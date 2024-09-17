import { cleanupOldPayments } from '@helpers/cleanup-payments';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler() {
  const deletedCount = await cleanupOldPayments();
  console.log(`Cleaned up ${deletedCount} old payment transactions`);
}