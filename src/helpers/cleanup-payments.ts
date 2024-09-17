import { getPrismaClient } from './database';

export async function cleanupOldPayments() {
  const prisma = getPrismaClient();
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  try {
    const result = await prisma.paymentTx.deleteMany({
      where: {
        createdAt: {
          lt: fiveMinutesAgo
        }
      }
    });

    console.log(`Deleted ${result.count} old payment transactions`);
    return result.count;
  } catch (error) {
    console.error('Error cleaning up old payments:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}