import { fiatTokenAbi } from "@/FiatTokenAbi";
import { relayPayWithAuthorization } from "@/helpers/relayPayWithAuthorization";
import { applyCors } from "@/services/cors";
import { appendTxHashToPayment } from "@/services/paymentTxOrMsgService";
import { sponsoredUsdcMapping } from "@/sponsoredUsdcConfig";
import { payWithAuthorization } from "@slicekit/core";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

type TxHashReceivedResponse = {
  data?: {
    txHash: string;
  },
}

type SponsoredRelayResponse = {
  data?: ethers.providers.TransactionResponse | TxHashReceivedResponse;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SponsoredRelayResponse>
) {
  await applyCors(req, res);
  if (req.method !== "POST") {
    return res.status(500);
  }

  const { uuid, txHash } = req.body;

  if (txHash) {
    await appendTxHashToPayment(uuid, txHash);
    return res.status(200).json({ data: { txHash } as TxHashReceivedResponse });
  }

  const { typedData, signature, additionalPayload } = req.body;
  const { from, to, value, nonce, validAfter, validBefore } = typedData.message;
  const { chainId } = typedData.domain;

  const sponsoredInfo = sponsoredUsdcMapping.find((s) => s.chainId === Number(chainId));
  if (!sponsoredInfo) {
    return res.status(500).json({ error: "Unsupported chain" });
  }

  if (additionalPayload) {
    const { txHash } = await relayPayWithAuthorization({ 
      cartParams: additionalPayload.cartParams,
      slicerId: additionalPayload.slicerId,
      totalUsdcPrice: value,
      buyer: from,
      chainId,
      signature,
      authorizationParams: {
        from,
        nonce,
        to,
        validAfter,
        validBefore,
        value,
      },
    });

    await appendTxHashToPayment(uuid, txHash);
    return res.status(200).json({ data: { txHash } as TxHashReceivedResponse });
  }

  const provider = new ethers.providers.JsonRpcProvider(sponsoredInfo.rpc);

  const { v, r, s } = ethers.utils.splitSignature(signature);

  const contract = new ethers.Contract(
    sponsoredInfo.fiatTokenAddress,
    fiatTokenAbi,
    provider
  );
  const txParams = [from, to, value, validAfter, validBefore, nonce, v, r, s];

  // estimate gas
  const estimatedGasLimit =
    await contract.estimateGas.transferWithAuthorization.apply(null, txParams);

  // generate unsigned tx
  const tx = await contract.populateTransaction.transferWithAuthorization.apply(
    null,
    txParams
  );

  // 1559tx config
  tx.chainId = Number(chainId);
  tx.gasLimit = estimatedGasLimit;
  tx.gasPrice = await provider.getGasPrice();
  tx.nonce = await provider.getTransactionCount(process.env.PAYMASTER_ADDRESS!);

  const key = ethers.Wallet.fromMnemonic(process.env.PAYMASTER_MNEMONIC!).privateKey;
  const signer = new ethers.Wallet(key, provider);
  const signedTx = await signer.signTransaction(tx);

  try {
    const txSubmission = await provider.sendTransaction(signedTx);
    const txHash = txSubmission.hash;
    await appendTxHashToPayment(uuid, txHash);

    res.status(200).json({ data: txSubmission });
  } catch (err: any) {
    // TODO: Report error somehwere
    res
      .status(200)
      .json({ error: err?.message ?? "Error submitting transaction" });
  }
}
