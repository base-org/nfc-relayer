import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismaClient } from '@helpers/database';
import { formatTxDataResponse } from '@/helpers/formatTxDataResponse';
import { ethers } from 'ethers';
import { formatTxMessageResponse } from '@/helpers/formatTxMessageResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = getPrismaClient();

  if (req.method === 'GET') {
    try {
      const { uuid, buyerAddress } = req.query;

      if (typeof uuid !== 'string') {
        return res.status(400).json({ message: 'Invalid UUID' });
      }

      if (!!buyerAddress && ((typeof buyerAddress !== 'string') || !ethers.utils.isAddress(buyerAddress))) {
        return res.status(400).json({ message: 'Invalid buyer address' });
      }
      
      const paymentTxPromise = prisma.paymentTx.findUnique({
        where: { uuid },
      });
      const txDataPromise = prisma.contactlessPaymentTxData.findUnique({
        where: { uuid },
      });
      const txMessagePromise = prisma.contactlessPaymentMessage.findUnique({
        where: { uuid },
      });
      
      const [paymentTx, txData, txMessage] = (await Promise.allSettled([paymentTxPromise, txDataPromise, txMessagePromise])).map(promiseResult => {
        if (promiseResult.status === 'fulfilled') {
          return promiseResult.value
        };

        return undefined;
      });

      if (!txData && !paymentTx && !txMessage) {
        return res.status(404).json({ message: 'Not Found' });
      }

      if (paymentTx) {
        res.status(200).json({ payloadType: 'eip681', ...paymentTx });
      } else if (txData) {
        // Substitute the buyer address into the tx call data if applicable
        const formattedTxData = await formatTxDataResponse({ txData, buyerAddress });
        res.status(200).json({ payloadType: 'contractCall', ...formattedTxData })
      } else {
        // Substitute the buyer address into the message's from field if applicable
        const formattedTxMessage = formatTxMessageResponse({ txMessage, buyerAddress });
        res.status(200).json({ payloadType: 'eip712', ...formattedTxMessage });
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