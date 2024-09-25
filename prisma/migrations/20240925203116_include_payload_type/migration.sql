/*
  Warnings:

  - Added the required column `payloadType` to the `ContactlessPaymentTxOrMsg` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactlessPaymentTxOrMsg" ADD COLUMN     "payloadType" TEXT NOT NULL;
