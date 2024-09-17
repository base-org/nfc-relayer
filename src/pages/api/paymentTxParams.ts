import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismaClient } from '../../helpers/database';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = getPrismaClient();

  if (req.method === 'POST') {
    try {
      const { uuid, toAddress, chainId, amount, contractId, data } = req.body;
      const paymentUuid = uuid || uuidv4();

      const newPaymentTx = await prisma.paymentTx.create({
        data: {
          uuid: paymentUuid,
          toAddress,
          chainId,
          amount,
          contractId,
          data: data || {},
        },
      });

      res.status(201).json({ message: 'Payment relay stored successfully', uuid: newPaymentTx.uuid });
    } catch (error) {
      console.error('Error storing payment:', error);
      res.status(500).json({ message: 'Error storing payment transaction params' });
    }
  } else if (req.method === 'GET') {
    try {
      const { uuid } = req.query;
      
      if (typeof uuid !== 'string') {
        return res.status(400).json({ message: 'Invalid UUID' });
      }

      const paymentTx = await prisma.paymentTx.findUnique({
        where: { uuid },
      });

      if (!paymentTx) {
        return res.status(404).json({ message: 'Not Found' });
      }

      res.status(200).json(paymentTx);
    } catch (error) {
      console.error('Error retrieving payment transaction:', error);
      res.status(500).json({ message: 'Error retrieving payment transaction' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}