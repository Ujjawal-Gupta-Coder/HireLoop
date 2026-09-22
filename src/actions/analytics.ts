"use server";

import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import {
  calculateOverallScore,
  calculateCommunicationScore,
  getPerformanceLevel,
} from "@/src/components/analytics/performanceMeter";
import {
  InterviewReportData,
  InterviewSessionInfo,
  QuestionAnalysis,
} from "@/src/components/analytics/analyticsTypes";
import { Performance } from "@prisma/client";
import { generateAnalyticsPDF } from "@/src/helper/generateAnalyticsPDF";
import { supabase } from "../lib/supabase";

type GeminiRawReport = {
  confidenceScore: number;
  clarityScore: number;
  relevancyScore: number;
  depthScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  commClarityScore: number;
  commGrammarScore: number;
  commVocabularyScore: number;
  commToneScore: number;
  commProfessionalismScore: number;
  communicationFeedback: string;
  questionAnalyses: {
    questionNumber?: number;
    question: string;
    answer: string;
    feedback: string;
    score: number;
  }[];
  summary: string;
};

export async function getOrGenerateInterviewReport(
  interviewId: string,
): Promise<
  | { success: true; data: InterviewReportData }
  | { success: false; error: string }
> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Fetch interview history with conversations and existing report
    const interview = await prisma.interviewHistory.findFirst({
      where: {
        id: interviewId,
        userId: user.id,
      },
      include: {
        conversations: {
          orderBy: { createdAt: "asc" },
        },
        report: true,
        user: true
      },
    });

    if (!interview) {
      return { success: false, error: "Interview session not found"};
    }

    // Return report if exist
    if (interview.report) {
      const r = interview.report;
      const parsedQuestions: QuestionAnalysis[] = Array.isArray(r.questionAnalyses)
        ? (r.questionAnalyses as QuestionAnalysis[])
        : [];

      return {
        success: true,
        data: {
          id: r.id,
          interviewId: r.interviewId,
          overallScore: r.overallScore,
          performance: getPerformanceLevel(r.overallScore),
          confidenceScore: r.confidenceScore,
          clarityScore: r.clarityScore,
          relevancyScore: r.relevancyScore,
          depthScore: r.depthScore,
          problemSolvingScore: r.problemSolvingScore,
          strengths: r.strengths,
          weaknesses: r.weaknesses,
          recommendations: r.recommendations,
          communicationScore: r.communicationScore,
          communicationPerformance: getPerformanceLevel(r.communicationScore),
          commClarityScore: r.commClarityScore,
          commGrammarScore: r.commGrammarScore,
          commVocabularyScore: r.commVocabularyScore,
          commToneScore: r.commToneScore,
          commProfessionalismScore: r.commProfessionalismScore,
          communicationFeedback: r.communicationFeedback,
          questionAnalyses: parsedQuestions,
          summary: r.summary,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        },
      };
    }

    // If there are no conversations at all, we cannot generate a meaningful report
    if (!interview.conversations || interview.conversations.length === 0) {
      return {
        success: false,
        error: "No conversation transcript recorded for this session.",
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: "GEMINI_API_KEY is not configured in environment variables.",
      };
    }

    // Prepare transcript text for Gemini
    const transcriptFormatted = interview.conversations
      .map((c, i) => {
        const speaker = c.speaker === "INTERVIEWER" ? "Interviewer (AI)" : "Candidate";
        const qTag = c.questionNumber ? ` [Question ${c.questionNumber}]` : "";
        return `Entry ${i + 1} (${speaker}${qTag}):\n${c.message}`;
      })
      .join("\n\n");

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a Principal Technical Hiring Manager and Senior Executive Communications Coach.
Your task is to thoroughly analyze an interview transcript and produce a high-precision, objective evaluation report.

Context of the Interview:
- Role: ${interview.role}
- Experience Level: ${interview.experience}
- Difficulty: ${interview.difficulty}
- Target Skills: ${interview.skills.join(", ")}
${interview.context ? `- Additional Context: ${interview.context}` : ""}
- Questions Answered: ${interview.answered} of ${interview.totalQuestions}
- Total Time: ${interview.timeElapsed} seconds

CRITICAL EVALUATION GUIDELINES:
1. Overall Parameters (Score each from 0 to 100 based on standard tech hiring benchmarks):
   - confidenceScore: Candidate's conviction, assertiveness, and composure.
   - clarityScore: Structure, conciseness, and clarity of thought in technical explanations.
   - relevancyScore: Directness of answers to the actual questions asked without unnecessary deflection.
   - depthScore: Technical depth, architectural awareness, edge-case coverage, and best practices.
   - problemSolvingScore: Analytical ability, step-by-step reasoning, tradeoffs, and debugging mindset.

2. Strengths, Weaknesses, AI Recommendations:
   - strengths: Exactly 3 specific bullet points highlighting what the candidate executed well.
   - weaknesses: Exactly 3 specific bullet points highlighting what the candidate missed or answered poorly.
   - recommendations: Exactly 3 actionable, high-impact bullet points advising how the candidate can prepare and improve.

3. Communication Assessment (Score each from 0 to 100):
   - commClarityScore: Verbal/written clarity, pacing, and message structure.
   - commGrammarScore: Grammatical correctness, sentence formation, and linguistic coherence.
   - commVocabularyScore: Technical terminology and appropriate vocabulary usage.
   - commToneScore: Politeness, warmth, composure, and emotional intelligence.
   - commProfessionalismScore: Workplace etiquette, respect, formal engagement, and attentiveness.
   - communicationFeedback: An insightful, constructive 2 to 3 paragraph qualitative review of the candidate's communication style, verbal habits, and interpersonal polish.

4. Question-by-Question Analysis:
   - For every question asked during the interview, provide:
     - questionNumber: Integer (1, 2, 3, ...)
     - question: The interviewer's question text.
     - answer: The candidate's response or key points from their reply.
     - feedback: Constructive assessment of this specific answer, highlighting what was good, what was missing, and what a model answer would look like.
     - score: Score out of 10 (e.g. 7.5 or 8) based on technical accuracy and communication.

5. AI Interview Summary:
   - A comprehensive executive summary synthesizing the candidate's performance, strengths, growth areas, role-readiness verdict (e.g., whether they meet Fresher / Junior / Mid-Level expectations), and key takeaways.

Strictly output valid JSON matching this schema:
{
  "confidenceScore": number (0-100),
  "clarityScore": number (0-100),
  "relevancyScore": number (0-100),
  "depthScore": number (0-100),
  "problemSolvingScore": number (0-100),
  "strengths": [string, string, string],
  "weaknesses": [string, string, string],
  "recommendations": [string, string, string],
  "commClarityScore": number (0-100),
  "commGrammarScore": number (0-100),
  "commVocabularyScore": number (0-100),
  "commToneScore": number (0-100),
  "commProfessionalismScore": number (0-100),
  "communicationFeedback": string,
  "questionAnalyses": [
    {
      "questionNumber": number,
      "question": string,
      "answer": string,
      "feedback": string,
      "score": number (0-10)
    }
  ],
  "summary": string
}`;

    // Prioritized list of Gemini models for resilience against rate limits and demand spikes
    const FALLBACK_MODELS = [
      "gemini-3.5-flash-lite",
      "gemini-flash-latest",
      "gemini-3.5-flash",
      "gemini-flash-lite-latest",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
    ];

    let parsed: GeminiRawReport | null = null;
    let lastError: unknown = null;
    let successfulModel = "";

    for (const modelName of FALLBACK_MODELS) {
      try {
        console.log(`[Analytics] Attempting report generation using model: ${modelName}`);
        const geminiResponse = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\n==================== INTERVIEW TRANSCRIPT ====================\n${transcriptFormatted}\n==================== END TRANSCRIPT ====================`,
                },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        const responseText = geminiResponse.text;
        if (!responseText) {
          throw new Error(`Empty response received from ${modelName}`);
        }

        let candidate: GeminiRawReport;
        try {
          candidate = JSON.parse(responseText);
        } catch {
          // If there are markdown backticks or wrappers, extract JSON substring
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error(`Failed to parse JSON response from ${modelName}`);
          }
          candidate = JSON.parse(jsonMatch[0]);
        }

        if (candidate && typeof candidate === "object") {
          parsed = candidate;
          successfulModel = modelName;
          console.log(`[Analytics] Successfully generated report using model: ${modelName}`);
          break;
        }
      } catch (err: unknown) {
        lastError = err;
        const errMessage = err instanceof Error ? err.message : String(err);
        console.warn(`[Analytics] Model ${modelName} failed, falling back to next model. Error: ${errMessage}`);
      }
    }

    if (!parsed) {
      const detail = lastError instanceof Error ? lastError.message : "Unknown error";
      throw new Error(`All AI fallback models failed to generate report. Last error: ${detail}`);
    }

    console.log(`[Analytics] Report finalized successfully via model: ${successfulModel}`);

    // Enforce 0-100 bounding on all parameter scores
    const boundScore = (num: number | undefined, defaultVal = 65) => {
      if (typeof num !== "number" || isNaN(num)) return defaultVal;
      return Math.max(0, Math.min(100, Math.round(num)));
    };

    const confidenceScore = boundScore(parsed.confidenceScore);
    const clarityScore = boundScore(parsed.clarityScore);
    const relevancyScore = boundScore(parsed.relevancyScore);
    const depthScore = boundScore(parsed.depthScore);
    const problemSolvingScore = boundScore(parsed.problemSolvingScore);

    // Calculate overall score mathematically: average of the 5 parameters
    const overallScore = calculateOverallScore({
      confidence: confidenceScore,
      clarity: clarityScore,
      relevancy: relevancyScore,
      depth: depthScore,
      problemSolving: problemSolvingScore,
    });
    const performance = getPerformanceLevel(overallScore).toUpperCase() as Performance;

    // Ensure exactly 3 bullets for strengths, weaknesses, recommendations
    const sanitizeBullets = (list: string[], defaultFallback: string[]): string[] => {
        if(!list || list.length === 0) return defaultFallback;
        const cleaned:string[] = [...list];
        while(cleaned.length < 3) {
          cleaned.push(defaultFallback[list.length])
        }
        return cleaned.slice(0,3);
    };

    const strengths = sanitizeBullets(parsed.strengths, [
      "Demonstrated willingness to engage with technical questions.",
      "Clear interest in software development concepts.",
      "Courteous and open demeanor throughout the conversation.",
    ]);

    const weaknesses = sanitizeBullets(parsed.weaknesses, [
      "Could elaborate more comprehensively with practical examples.",
      "Responses sometimes lacked structured technical depth.",
      "Can benefit from structured frameworks like STAR when answering.",
    ]);

    const recommendations = sanitizeBullets(parsed.recommendations, [
      "Practice breaking answers into problem, approach, and tradeoffs.",
      "Review core foundational concepts and terminology for the role.",
      "Perform mock interviews to improve response length and confidence.",
    ]);

    // Communication parameters (5 distinct scores)
    const commClarityScore = boundScore(parsed.commClarityScore);
    const commGrammarScore = boundScore(parsed.commGrammarScore);
    const commVocabularyScore = boundScore(parsed.commVocabularyScore);
    const commToneScore = boundScore(parsed.commToneScore);
    const commProfessionalismScore = boundScore(parsed.commProfessionalismScore);

    // Calculate communication score mathematically: average of the 5 parameters
    const communicationScore = calculateCommunicationScore({
      clarity: commClarityScore,
      grammar: commGrammarScore,
      vocabulary: commVocabularyScore,
      tone: commToneScore,
      professionalism: commProfessionalismScore,
    });
    const communicationPerformance = getPerformanceLevel(communicationScore).toUpperCase() as Performance;

    const communicationFeedback =
      typeof parsed.communicationFeedback === "string" && parsed.communicationFeedback.trim()
        ? parsed.communicationFeedback.trim()
        : "Communication was receptive and polite. Continuing to practice structured articulation will enhance impact in technical discussions.";

    // Question-by-question analysis
    let questionAnalyses: QuestionAnalysis[] = [];
    if (Array.isArray(parsed.questionAnalyses) && parsed.questionAnalyses.length > 0) {
      questionAnalyses = parsed.questionAnalyses.map((q, idx) => ({
        questionNumber: typeof q.questionNumber === "number" ? q.questionNumber : idx + 1,
        question: q.question || `Question ${idx + 1}`,
        answer: q.answer || "No response recorded.",
        feedback: q.feedback || "Good effort. Focus on providing concrete examples and deeper reasoning.",
        score: Math.max(0, Math.min(10, Math.round((q.score ?? 6) * 10) / 10)),
      }));
    }

    const summary =
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : "The candidate completed the interview session demonstrating foundational aptitude. Continued practice with technical interview depth and structured communication is recommended.";

    // Insert into database
    const savedReport = await prisma.interviewReport.create({
      data: {
        interviewId,
        overallScore,
        performance,
        confidenceScore,
        clarityScore,
        relevancyScore,
        depthScore,
        problemSolvingScore,
        strengths,
        weaknesses,
        recommendations,
        communicationScore,
        communicationPerformance,
        commClarityScore,
        commGrammarScore,
        commVocabularyScore,
        commToneScore,
        commProfessionalismScore,
        communicationFeedback,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        questionAnalyses: questionAnalyses as any,
        summary,
      },
    });
   
    let reportPath:string = "";
    const InterviewSession: InterviewSessionInfo = {
      id: interview.id,
      role: interview.role,
      experience: interview.experience,
      difficulty: interview.difficulty,
      type: interview.type,
      skills: interview.skills,
      context: interview.context,
      status: interview.status,
      totalQuestions: interview.totalQuestions,
      answered: interview.answered,
      userName: interview.user.name,
      userEmail: interview.user.email,
      timeElapsed: interview.timeElapsed,
      createdAt: interview.createdAt.toISOString(),
    };

    const savedReportData: InterviewReportData = {
      id: savedReport.id,
      interviewId: savedReport.interviewId,
      overallScore: savedReport.overallScore,
      performance: getPerformanceLevel(savedReport.overallScore),
      confidenceScore: savedReport.confidenceScore,
      clarityScore: savedReport.clarityScore,
      relevancyScore: savedReport.relevancyScore,
      depthScore: savedReport.depthScore,
      problemSolvingScore: savedReport.problemSolvingScore,
      strengths: savedReport.strengths,
      weaknesses: savedReport.weaknesses,
      recommendations: savedReport.recommendations,
      communicationScore: savedReport.communicationScore,
      communicationPerformance: getPerformanceLevel(savedReport.communicationScore),
      commClarityScore: savedReport.commClarityScore,
      commGrammarScore: savedReport.commGrammarScore,
      commVocabularyScore: savedReport.commVocabularyScore,
      commToneScore: savedReport.commToneScore,
      commProfessionalismScore: savedReport.commProfessionalismScore,
      communicationFeedback: savedReport.communicationFeedback,
      questionAnalyses,
      summary: savedReport.summary,
      createdAt: savedReport.createdAt.toISOString(),
      updatedAt: savedReport.updatedAt.toISOString(),
    }
    try {
        const reportPDFBytes = await generateAnalyticsPDF(InterviewSession, savedReportData);

        const filePath = `${interview.userId}/${interview.id}.pdf`;
    
        const {data, error} = await supabase.storage.from("Reports")
            .upload(filePath, reportPDFBytes, {
                contentType: "application/pdf",
                upsert: true                                   // override file : Yes, same name file override
            })
        if(error) throw new Error(`Interview report upload failed: ${error.message}`)
        
        reportPath = data.path;

    } catch (error) {
      console.error("Report generation/upload failed: ", error);
    }

    try {
        await prisma.interviewReport.update({
            where: {
                id: savedReport.id
            },
            data: {
              reportPath,
            }
        })
    } catch(error) {
        console.error("error in updating interview report path: ", error);
        await supabase.storage.from("Reports").remove([reportPath]);
    }

    return {
      success: true,
      data: savedReportData
    };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to generate interview report";
    console.error("Error in getOrGenerateInterviewReport:", error);
    return {
      success: false,
      error: errMsg,
    };
  }
}


