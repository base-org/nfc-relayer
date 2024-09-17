import { NextApiRequest, NextApiResponse } from 'next';
import { cleanupOldPayments } from '@helpers/cleanup-payments';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const deletedCount = await cleanupOldPayments();
    return res.status(200).json({ message: `Cleaned up ${deletedCount} old payment transactions` });
  } catch (error) {
    console.error('Error in cleanup cron job:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}