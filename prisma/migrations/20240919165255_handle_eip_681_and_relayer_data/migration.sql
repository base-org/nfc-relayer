/*
  Warnings:

  - You are about to drop the column `contractId` on the `PaymentTx` table. All the data in the column will be lost.
  - Added the required column `contractAddress` to the `PaymentTx` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `PaymentTx` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentTx" DROP COLUMN "contractId",
ADD COLUMN     "contractAddress" TEXT NOT NULL,
ADD COLUMN     "dappName" TEXT,
ADD COLUMN     "dappUrl" TEXT,
ADD COLUMN     "value" TEXT NOT NULL;
