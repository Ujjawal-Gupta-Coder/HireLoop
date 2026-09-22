/*
  Warnings:

  - Changed the type of `performance` on the `InterviewReport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `communicationPerformance` on the `InterviewReport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Performance" AS ENUM ('POOR', 'WEAK', 'AVERAGE', 'GOOD', 'EXCELLENT');

-- DropForeignKey
ALTER TABLE "InterviewReport" DROP CONSTRAINT "InterviewReport_interviewId_fkey";

-- AlterTable
ALTER TABLE "InterviewReport" DROP COLUMN "performance",
ADD COLUMN     "performance" "Performance" NOT NULL,
DROP COLUMN "communicationPerformance",
ADD COLUMN     "communicationPerformance" "Performance" NOT NULL;

-- AddForeignKey
ALTER TABLE "InterviewReport" ADD CONSTRAINT "InterviewReport_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "InterviewHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
