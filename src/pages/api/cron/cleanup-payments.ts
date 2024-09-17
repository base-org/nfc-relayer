import { NextApiRequest, NextApiResponse } from 'next';
import { verifySignature } from '@vercel/next-cron';
import { cleanupOldPayments } from '../../../helpers/cleanup-payments';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const isValidSignature = await verifySignature(req);

  if (!isValidSignature) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const deletedCount = await cleanupOldPayments();
    return res.status(200).json({ message: `Cleaned up ${deletedCount} old payment transactions` });
  } catch (error) {
    console.error('Error in cleanup cron job:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}