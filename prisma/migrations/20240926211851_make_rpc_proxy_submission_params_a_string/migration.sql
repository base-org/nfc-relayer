/*
  Warnings:

  - Made the column `rpcProxySubmissionParams` on table `ContactlessPaymentTxOrMsg` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ContactlessPaymentTxOrMsg" ALTER COLUMN "rpcProxySubmissionParams" SET NOT NULL,
ALTER COLUMN "rpcProxySubmissionParams" SET DATA TYPE TEXT;
