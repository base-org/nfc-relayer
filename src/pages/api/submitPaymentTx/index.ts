import { NextApiRequest, NextApiResponse } from 'next';
import { USDC_BASE_CONTRACT_ABI } from '../../../constants'


// api/relayer.js
import { ethers } from 'ethers';
import { getPrismaClient } from '@helpers/database';

// The JSON RPC URL of an Ethereum node (like Infura or Alchemy)
const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');

// A private key to sign transactions (you may want to use a secure key vault)
const wallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY!, provider);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prisma = getPrismaClient();

    try {
      const { chainId, domain, types, message, signature, txHash, uuid } = req.body;

      // if just the txHash is passed in, just return the txHash
      // TODO (Mike): check if the txHash is valid and alert the dapp that we've received a payment
      if (txHash) {
        return res.status(200).json({ txHash });
      }


      // const contract = new ethers.Contract(message.to, USDC_BASE_CONTRACT_ABI, wallet);

      // Validate and recover the signer from the signature
      const signerAddress = ethers.verifyTypedData(domain, types, message, signature);

      let expectedNonceEntry = await prisma.nonce.findFirst({
        where: { address: signerAddress.toLowerCase(), chainId },
      });

      if (!expectedNonceEntry) {
        expectedNonceEntry = await prisma.nonce.create({
          data: {
            chainId,
            address: signerAddress.toLowerCase(),
            nonce: 0,
          },
        });
      }

      // Check the nonce
      if (expectedNonceEntry.nonce !== BigInt(message.nonce)) {
        return res.status(400).json({ error: 'Invalid nonce' });
      }

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

      // Increment the nonce
      await prisma.nonce.update({
        where: { id: expectedNonceEntry.id },
        data: { nonce: expectedNonceEntry.nonce + BigInt(1) },
      });

      // Respond with the transaction hash
      return res.status(200).json({ txHash: sentTx.hash });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to process transaction' });
    }
}
