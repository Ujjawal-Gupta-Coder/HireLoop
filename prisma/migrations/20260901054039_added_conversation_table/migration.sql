-- CreateEnum
CREATE TYPE "Speaker" AS ENUM ('INTERVIEWER', 'CANDIDATE');

-- AlterTable
ALTER TABLE "InterviewHistory" ADD COLUMN     "timeElapsed" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "speaker" "Speaker" NOT NULL,
    "message" TEXT NOT NULL,
    "questionNumber" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "InterviewHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
