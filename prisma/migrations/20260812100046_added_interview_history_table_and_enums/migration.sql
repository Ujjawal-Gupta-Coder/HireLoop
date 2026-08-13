/*
  Warnings:

  - The values [BASIC_INTERVIEW] on the enum `CreditTransactionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('TECHNICAL_INTERVIEW', 'CODING_INTERVIEW', 'SYSTEM_DESIGN_INTERVIEW', 'BEHAVIORAL_INTERVIEW', 'MIXED_INTERVIEW');

-- CreateEnum
CREATE TYPE "InterviewRole" AS ENUM ('FULL_STACK_DEVELOPER', 'FRONT_END_DEVELOPER', 'BACK_END_DEVELOPER', 'REACT_DEVELOPER', 'SOFTWARE_ENGINEER', 'MOBILE_APP_DEVELOPER', 'DEVOPS_ENGINEER', 'AI_ML_ENGINEER');

-- CreateEnum
CREATE TYPE "Experience" AS ENUM ('FRESHER', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD_STAFF', 'MANAGER');

-- CreateEnum
CREATE TYPE "DifficultyType" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "InterviewSessionType" AS ENUM ('QUICK', 'STANDARD', 'EXTENDED');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('RUNNING', 'ABANDONED', 'COMPLETED');

-- AlterEnum
BEGIN;
CREATE TYPE "CreditTransactionType_new" AS ENUM ('ADMIN', 'REGISTRATION', 'PURCHASE', 'TECHNICAL_INTERVIEW', 'CODING_INTERVIEW', 'SYSTEM_DESIGN_INTERVIEW', 'BEHAVIORAL_INTERVIEW', 'MIXED_INTERVIEW');
ALTER TABLE "CreditHistory" ALTER COLUMN "type" TYPE "CreditTransactionType_new" USING ("type"::text::"CreditTransactionType_new");
ALTER TYPE "CreditTransactionType" RENAME TO "CreditTransactionType_old";
ALTER TYPE "CreditTransactionType_new" RENAME TO "CreditTransactionType";
DROP TYPE "public"."CreditTransactionType_old";
COMMIT;

-- CreateTable
CREATE TABLE "InterviewHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "InterviewType" NOT NULL,
    "role" "InterviewRole" NOT NULL,
    "experience" "Experience" NOT NULL,
    "difficulty" "DifficultyType" NOT NULL,
    "skills" TEXT[],
    "sessionType" "InterviewSessionType" NOT NULL,
    "context" TEXT,
    "creditUsed" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "answered" INTEGER NOT NULL,
    "status" "InterviewStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterviewHistory" ADD CONSTRAINT "InterviewHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
