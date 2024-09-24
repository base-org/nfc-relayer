import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismaClient } from '@helpers/database';
import { formatTxData, handleContractCallFetchByUUID } from '@/helpers/handleContractCallFetchByUUID';
import { sliceAbi } from '@/SliceAbi';
import { ethers } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = getPrismaClient();

  if (req.method === 'GET') {
    try {
      const { uuid, buyerAddress } = req.query;

      if (typeof uuid !== 'string') {
        return res.status(400).json({ message: 'Invalid UUID' });
      }

      // TODO (Justin): Await these promises in parallel
      const paymentTxPromise = prisma.paymentTx.findUnique({
        where: { uuid },
      });

      const txDataPromise = prisma.contactlessPaymentTxData.findUnique({
        where: { uuid },
      });

      const txMessagePromise = prisma.contactlessPaymentMessage.findUnique({
        where: { uuid },
      });
      
      const [paymentTx, txData, txMessage] = (await Promise.allSettled([paymentTxPromise, txDataPromise, txMessagePromise])).map(({ value }) => value);

      if (!txData && !paymentTx && !txMessage) {
        return res.status(404).json({ message: 'Not Found' });
      }

      if (paymentTx) {
        res.status(200).json({ payloadType: 'eip681', ...paymentTx });
      } else if (txData) {
        // console.log({ test: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(JSON.stringify(sliceAbi)))});
        const formattedTxData = await formatTxData({ txData, buyerAddress });
        res.status(200).json({ payloadType: 'contractCall', ...formattedTxData })
      } else {
        // TODO (Justin): Substitute the txMessage field's buyer address with the actual buyer address
        res.status(200).json({ payloadType: 'eip712', ...txMessage });
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