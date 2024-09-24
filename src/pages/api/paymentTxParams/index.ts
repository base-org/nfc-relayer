import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismaClient } from '@helpers/database';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = getPrismaClient();

  if (req.method === 'POST') {
    try {
      const { 
        payloadType,
        uuid,
        chainId, 
        dappUrl, 
        dappName,
        relayerSubmissionParams, 

        // fields relevant to the eip712 payload type
        message,
        additionalPayload,
        
        // fields relevant to contractCall payload type
        requiresBuyerAddress, 
        contractAbi, 
        placeholderBuyerAddress, 
        approveTxs, 
        paymentTx, 

        // fields relevant to eip681 payload type
        contractAddress,
        toAddress,
        value,
      } = req.body;

      if (!payloadType) {
        return res.status(400).json({ message: 'Payload type is required' });
      }

      if (!['eip681', 'contractCall', 'eip712'].includes(payloadType)) {
        return res.status(400).json({ message: 'Invalid payload type, must be eip681 or contractCall' });
      }

      const paymentUuid = uuid || uuidv4();

      let newPaymentTx;

      if (payloadType === 'eip681') { 
        newPaymentTx = await prisma.paymentTx.create({
          data: {
            uuid: paymentUuid,
            chainId,
            dappUrl,
            dappName,
            contractAddress,
            toAddress,
            value,
            relayerSubmissionParams,
          },
        });
      } else if (payloadType === 'contractCall') {
        newPaymentTx = await prisma.contactlessPaymentTxData.create({
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
      } else if (payloadType === 'eip712') {
        newPaymentTx = await prisma.contactlessPaymentMessage.create({
          data: {
            uuid: paymentUuid,
            chainId,
            relayerSubmissionParams,
            message,
            additionalPayload,
            dappUrl,
            dappName,
          }
        });
      } else {
        return res.status(400).json({ message: 'Invalid payload type' });
      }

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