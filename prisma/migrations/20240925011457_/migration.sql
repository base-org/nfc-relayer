/*
  Warnings:

  - You are about to drop the column `relayerSubmissionParams` on the `ContactlessPaymentMessage` table. All the data in the column will be lost.
  - You are about to drop the column `placeholderBuyerAddress` on the `ContactlessPaymentTxData` table. All the data in the column will be lost.
  - You are about to drop the column `relayerSubmissionParams` on the `ContactlessPaymentTxData` table. All the data in the column will be lost.
  - You are about to drop the column `requiresBuyerAddress` on the `ContactlessPaymentTxData` table. All the data in the column will be lost.
  - You are about to drop the column `relayerSubmissionParams` on the `PaymentTx` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContactlessPaymentMessage" DROP COLUMN "relayerSubmissionParams",
ADD COLUMN     "rpcProxySubmissionParams" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "ContactlessPaymentTxData" DROP COLUMN "placeholderBuyerAddress",
DROP COLUMN "relayerSubmissionParams",
DROP COLUMN "requiresBuyerAddress",
ADD COLUMN     "placeholderSenderAddress" TEXT,
ADD COLUMN     "requiresSenderAddress" BOOLEAN,
ADD COLUMN     "rpcProxySubmissionParams" JSONB;

-- AlterTable
ALTER TABLE "PaymentTx" DROP COLUMN "relayerSubmissionParams",
ADD COLUMN     "rpcProxySubmissionParams" JSONB;
