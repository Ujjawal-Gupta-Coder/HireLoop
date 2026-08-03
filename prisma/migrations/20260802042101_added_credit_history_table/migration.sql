-- CreateEnum
CREATE TYPE "CreditTransactionType" AS ENUM ('REGISTRATION', 'PURCHASE', 'BASIC_INTERVIEW', 'CODING_INTERVIEW');

-- CreateTable
CREATE TABLE "CreditHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credit" INTEGER NOT NULL,
    "type" "CreditTransactionType" NOT NULL,
    "stripeSessionId" TEXT,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditHistory_stripeSessionId_key" ON "CreditHistory"("stripeSessionId");

-- AddForeignKey
ALTER TABLE "CreditHistory" ADD CONSTRAINT "CreditHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
