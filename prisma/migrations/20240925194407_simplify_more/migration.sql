/*
  Warnings:

  - You are about to drop the column `contractAddress` on the `ContactlessPaymentTxOrMsg` table. All the data in the column will be lost.
  - You are about to drop the column `toAddress` on the `ContactlessPaymentTxOrMsg` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `ContactlessPaymentTxOrMsg` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContactlessPaymentTxOrMsg" DROP COLUMN "contractAddress",
DROP COLUMN "toAddress",
DROP COLUMN "value";
