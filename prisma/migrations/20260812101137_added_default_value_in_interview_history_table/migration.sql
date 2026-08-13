/*
  Warnings:

  - You are about to drop the column `creditUsed` on the `InterviewHistory` table. All the data in the column will be lost.
  - Added the required column `creditsUsed` to the `InterviewHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InterviewHistory" DROP COLUMN "creditUsed",
ADD COLUMN     "creditsUsed" INTEGER NOT NULL;
