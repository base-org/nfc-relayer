-- CreateTable
CREATE TABLE "PaymentTx" (
    "uuid" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTx_pkey" PRIMARY KEY ("uuid")
);
