import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismaClient } from '@helpers/database';
import { ethers } from 'ethers';

// TODO: Amhed: Discuss w/Justin if worth to remove
// import { formatTxDataResponse } from '@/helpers/formatTxDataResponse';
// import { formatTxMessageResponse } from '@/helpers/formatTxMessageResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = getPrismaClient();

  if (req.method === 'GET') {
    try {
      const { uuid, buyerAddress } = req.query;

      if (!uuid || typeof uuid !== 'string') {
        return res.status(400).json({ message: 'Invalid UUID' });
      }

      // TODO: Justin / Rafa is this stil buyer? or sender? I dont remember
      if (!!buyerAddress && ((typeof buyerAddress !== 'string') || !ethers.utils.isAddress(buyerAddress))) {
        return res.status(400).json({ message: 'Invalid buyer address' });
      }
      
      const paymentTxOrMsg = await prisma.contactlessPaymentTxOrMsg.findUnique({
        where: { uuid },
      });
      

      if (!paymentTxOrMsg) {
        return res.status(404).json({ message: 'Not Found' });
      }

      res.status(200).json(paymentTxOrMsg);
    } catch (error) {
      console.error('Error retrieving payment transaction:', error);
      res.status(500).json({ message: `Error retrieving payment transaction: ${(error as Error).message}` });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}