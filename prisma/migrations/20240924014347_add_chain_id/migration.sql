/*
  Warnings:

  - Added the required column `chainId` to the `ContactlessPaymentMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactlessPaymentMessage" ADD COLUMN     "chainId" TEXT NOT NULL;
