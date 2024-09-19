import { NextApiRequest, NextApiResponse } from 'next';


// api/relayer.js
import { ethers } from 'ethers';

// The JSON RPC URL of an Ethereum node (like Infura or Alchemy)
const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');

// A private key to sign transactions (you may want to use a secure key vault)
const wallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY!, provider);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { chainId, domain, types, message, signature, txHash, uuid } = req.body;

      // if just the txHash is passed in, just return the txHash
      // TODO (Mike): check if the txHash is valid and alert the dapp that we've received a payment
      if (txHash) {
        return res.status(200).json({ txHash });
      }

      // Validate and recover the signer from the signature
      const signerAddress = ethers.verifyTypedData(domain, types, message, signature);

      // If valid, you can relay the transaction to the Ethereum network
      const tx = {
          from: signerAddress,
          to: message.to,
          value: message.value,
          data: message.data,
          chainId,
      } as ethers.TransactionRequest;

      // Sign and send the transaction
      const sentTx = await wallet.sendTransaction(tx);

      // Respond with the transaction hash
      return res.status(200).json({ txHash: sentTx.hash });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to process transaction' });
    }
}
