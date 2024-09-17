import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.NODE_ENV === 'production' 
            ? process.env.DATABASE_URL_POOLED 
            : process.env.DATABASE_URL,
        },
      },
    });
  }
  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}