-- CreateTable
CREATE TABLE "Nonce" (
    "id" SERIAL NOT NULL,
    "chainId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nonce" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nonce_pkey" PRIMARY KEY ("id")
);
