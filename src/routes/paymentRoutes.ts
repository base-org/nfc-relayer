import express, { Request, Response } from 'express';
import { getPrismaClient } from '../helpers/database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/paymentTxParams', async (req: Request, res: Response) => {
  try {
    const { uuid, toAddress, chainId, amount, contractId, data } = req.body;
    const prisma = getPrismaClient();

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
});

router.get('/paymentTxParams/:uuid', async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const prisma = getPrismaClient();

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
});

export default router;