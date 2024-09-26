import { createPaymentTxOrMsg } from '@/services/paymentTxOrMsgService';
import { Payload } from '@/types/paymentTx';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // validations
      const payloadType = req.body.payloadType;
      if (!payloadType || !['eip681', 'contractCall', 'eip712'].includes(payloadType)) {
        return res.status(400).json({ message: 'Invalid or missing payload type' });
      }

      // write to db
      const paymentTxOrMsg = await createPaymentTxOrMsg(req.body as Payload);

      // return response
      res
        .status(201)
        .json({ message: 'Payment relay stored successfully', uuid: paymentTxOrMsg.uuid });
    } catch (error) {
      console.error('Error storing payment:', error);
      res
        .status(500)
        .json({ message: `Error storing payment transaction params: ${(error as Error).message}` });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
