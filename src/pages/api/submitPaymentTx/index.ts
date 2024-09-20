
import { fiatTokenAbi } from "@/FiatTokenAbi";
import { sponsoredUsdcMapping } from "@/sponsoredUsdcConfig";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

type SponsoredRelayResponse = {
  data?: ethers.providers.TransactionResponse;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SponsoredRelayResponse>
) {
  // return res.status(500);

  if (req.method !== "POST") {
    return res.status(500);
  }

  const { chainId } = req.body;
  const sponsoredInfo = sponsoredUsdcMapping.find((s) => s.chainId === Number(chainId));
  if (!sponsoredInfo) {
    return res.status(500).json({ error: "Unsupported chain" });
  }

  const provider = new ethers.providers.JsonRpcProvider(sponsoredInfo.rpc);

  const { from, to, value, nonce, validAfter, validBefore, signature, uuid, txHash } = req.body;

  // TODO (Mike): If possible, use the UUID to communicate to the appropriate websocket that a transaction was received and sent
  if (txHash) {
    return res.status(200).json({ data: { hash: txHash } });
  }

  const { v, r, s } = ethers.utils.splitSignature(signature);

  const contract = new ethers.Contract(
    sponsoredInfo.fiatTokenAddress,
    fiatTokenAbi,
    provider
  );
  const txParams = [from, to, value, validAfter, validBefore, nonce, v, r, s];

  console.log(txParams);

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

  const key = ethers.Wallet.fromMnemonic(process.env.MNEMONIC!).privateKey;
  const signer = new ethers.Wallet(key, provider);
  const signedTx = await signer.signTransaction(tx);

  try {
    const txSubmission = await provider.sendTransaction(signedTx);
    res.status(200).json({ data: txSubmission });
  } catch (err: any) {
    // TODO: Report error somehwere
    res
      .status(200)
      .json({ error: err?.message ?? "Error submitting transaction" });
  }
}
