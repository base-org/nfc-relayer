/*
  Warnings:

  - You are about to drop the `ContactlessPaymentMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactlessPaymentTxData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Nonce` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentTx` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ContactlessPaymentMessage";

-- DropTable
DROP TABLE "ContactlessPaymentTxData";

-- DropTable
DROP TABLE "Nonce";

-- DropTable
DROP TABLE "PaymentTx";

-- CreateTable
CREATE TABLE "ContactlessPaymentTxOrMsg" (
    "uuid" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "txParams" JSONB,
    "rpcProxySubmissionParams" JSONB,
    "dappName" TEXT,
    "dappUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactlessPaymentTxOrMsg_pkey" PRIMARY KEY ("uuid")
);
