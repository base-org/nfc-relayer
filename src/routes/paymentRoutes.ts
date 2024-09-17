import express, { Request, Response } from 'express';
import { getConnection } from '../helpers/database';
import { PaymentTx } from '../models/PaymentTx';

const router = express.Router();

router.post('/paymentTxParams', async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const connection = await getConnection();
    const paymentTxRepository = connection.getRepository(PaymentTx);

    const newPaymentTx = paymentTxRepository.create(data);
    await paymentTxRepository.save(newPaymentTx);

    res.status(201).json({ message: 'Payment transaction params stored successfully', uuid: newPaymentTx.uuid });
  } catch (error) {
    console.error('Error storing payment transaction params:', error);
    res.status(500).json({ message: 'Error storing payment transaction params' });
  }
});

export default router;