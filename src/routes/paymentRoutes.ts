import express, { Request, Response } from 'express';
import PaymentTx, { IPaymentTx } from '../models/PaymentTx';

const router = express.Router();

router.post('/paymentTxParams', async (req: Request, res: Response) => {
  try {
    const { uuid, data } = req.body;

    const newPaymentTx: IPaymentTx = new PaymentTx({
      uuid,
      data,
    });

    await newPaymentTx.save();

    res.status(201).json({ message: 'Payment transaction params stored successfully', uuid });
  } catch (error) {
    console.error('Error storing payment transaction params:', error);
    res.status(500).json({ message: 'Error storing payment transaction params' });
  }
});

export default router;