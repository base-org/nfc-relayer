import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismaClient } from '@helpers/database';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = getPrismaClient();

  if (req.method === 'POST') {
    try {
      // const { uuid, toAddress, chainId, amount, contractId, data } = req.body;
      const { uuid, chainId, requiresBuyerAddress, contractAbi, placeholderBuyerAddress, approveTxs, relayerSubmissionParams, paymentTx, dappUrl, dappName } = req.body;
      const paymentUuid = uuid || uuidv4();

      const newPaymentTx = await prisma.contactlessPaymentTxData.create({
        data: {
          uuid: paymentUuid,
          requiresBuyerAddress,
          contractAbi,
          placeholderBuyerAddress,
          chainId,
          approveTxs,
          relayerSubmissionParams,
          paymentTx,
          dappUrl,
          dappName,
        },
      });

      res.status(201).json({ message: 'Payment relay stored successfully', uuid: newPaymentTx.uuid });
    } catch (error) {
      console.error('Error storing payment:', error);
      res.status(500).json({ message: `Error storing payment transaction params: ${(error as Error).message}`});
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}