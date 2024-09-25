import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { getPaymentTxOrMsg } from '@/services/paymentTxOrMsgService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { uuid, senderAddress } = req.query;

      if (!uuid || typeof uuid !== 'string') {
        return res.status(400).json({ message: 'Invalid UUID' });
      }

      if (
        !!senderAddress &&
        (typeof senderAddress !== 'string' || !ethers.utils.isAddress(senderAddress))
      ) {
        return res.status(400).json({ message: 'Invalid sender address' });
      }

      const paymentTxOrMsg = await getPaymentTxOrMsg(uuid as string);
      res.status(200).json(paymentTxOrMsg);
    } catch (error) {
      console.error('Error retrieving payment transaction:', error);
      res
        .status(500)
        .json({ message: `Error retrieving payment transaction: ${(error as Error).message}` });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
