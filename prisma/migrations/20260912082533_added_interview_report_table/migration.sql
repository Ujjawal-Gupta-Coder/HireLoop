-- CreateTable
CREATE TABLE "InterviewReport" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "performance" TEXT NOT NULL,
    "confidenceScore" INTEGER NOT NULL,
    "clarityScore" INTEGER NOT NULL,
    "relevancyScore" INTEGER NOT NULL,
    "depthScore" INTEGER NOT NULL,
    "problemSolvingScore" INTEGER NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "recommendations" TEXT[],
    "communicationScore" INTEGER NOT NULL,
    "communicationPerformance" TEXT NOT NULL,
    "commClarityScore" INTEGER NOT NULL,
    "commGrammarScore" INTEGER NOT NULL,
    "commVocabularyScore" INTEGER NOT NULL,
    "commToneScore" INTEGER NOT NULL,
    "commProfessionalismScore" INTEGER NOT NULL,
    "communicationFeedback" TEXT NOT NULL,
    "questionAnalyses" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewReport_interviewId_key" ON "InterviewReport"("interviewId");

-- AddForeignKey
ALTER TABLE "InterviewReport" ADD CONSTRAINT "InterviewReport_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "InterviewHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
