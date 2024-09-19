import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismaClient } from '@helpers/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = getPrismaClient();

  if (req.method === 'GET') {
    try {
      const { uuid } = req.query;

      if (typeof uuid !== 'string') {
        return res.status(400).json({ message: 'Invalid UUID' });
      }

      const txData = await prisma.contactlessPaymentTxData.findUnique({
        where: { uuid },
      });

      const paymentTx = await prisma.paymentTx.findUnique({
        where: { uuid },
      });

      if (!txData && !paymentTx) {
        return res.status(404).json({ message: 'Not Found' });
      }

      if (paymentTx) {
        res.status(200).json({ payloadType: 'eip681', ...paymentTx });
      } else {
        // omit the requiresBuyerAddress, contractAbi, and placeholderBuyerAddress fields
        // from the response
        const txDataReturned = {
          ...txData,
          requiresBuyerAddress: undefined,
          contractAbi: undefined,
          placeholderBuyerAddress: undefined,
        }
        res.status(200).json({ payloadType: 'contractCall', ...txDataReturned });
      }
    } catch (error) {
      console.error('Error retrieving payment transaction:', error);
      res.status(500).json({ message: `Error retrieving payment transaction: ${(error as Error).message}` });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}