-- AlterTable
ALTER TABLE "PaymentTx" ADD COLUMN     "relayerSubmissionParams" JSONB;

-- CreateTable
CREATE TABLE "ContactlessPaymentMessage" (
    "uuid" TEXT NOT NULL,
    "relayerSubmissionParams" JSONB NOT NULL,
    "message" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactlessPaymentMessage_pkey" PRIMARY KEY ("uuid")
);
