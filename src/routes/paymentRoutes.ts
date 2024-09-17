import express, { Request, Response } from 'express';
import { getPrismaClient } from '../helpers/database';

const router = express.Router();

router.post('/paymentTxParams', async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const prisma = getPrismaClient();

    const newPaymentTx = await prisma.paymentTx.create({
      data: {
        toAddress: data.toAddress,
        chainId: data.chainId,
        amount: data.amount,
        contractId: data.contractId,
      },
    });

    res.status(201).json({ message: 'Payment transaction params stored successfully', uuid: newPaymentTx.uuid });
  } catch (error) {
    console.error('Error storing payment transaction params:', error);
    res.status(500).json({ message: 'Error storing payment transaction params' });
  }
});

export default router;