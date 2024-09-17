import { cleanupOldPayments } from '@helpers/cleanup-payments';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  // const authHeader = request.headers.get('authorization');
  // if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return response.status(401).json({ success: false });
  // }
  const deletedCount = await cleanupOldPayments();
  console.log(`Cleaned up ${deletedCount} old payment transactions`);

  response
    .status(200)
    .json({ success: true, message: `Cleaned up ${deletedCount} old payment transactions` });
}
