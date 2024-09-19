-- CreateTable
CREATE TABLE "ContactlessPaymentTxData" (
    "uuid" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "requiresBuyerAddress" BOOLEAN,
    "contractAbi" TEXT,
    "placeholderBuyerAddress" TEXT,
    "approveTxs" JSONB,
    "relayerSubmissionParams" JSONB,
    "paymentTx" JSONB NOT NULL,
    "dappName" TEXT,
    "dappUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactlessPaymentTxData_pkey" PRIMARY KEY ("uuid")
);
