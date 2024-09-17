import { NextApiRequest, NextApiResponse } from 'next';
import { cleanupOldPayments } from '@helpers/cleanup-payments';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for Vercel's cron job secret
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const deletedCount = await cleanupOldPayments();
    return res.status(200).json({ message: `Cleaned up ${deletedCount} old payment transactions` });
  } catch (error) {
    console.error('Error in cleanup cron job:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}