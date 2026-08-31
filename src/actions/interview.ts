"use server";

import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/src/lib/prisma";
import { InterviewStatus } from "@prisma/client";

type MappedMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

export async function generateInterviewQuestion(
  history: MappedMessage[],
  role: string,
  experience: string,
  difficulty: string,
  skills: string[],
  context: string | null | undefined,
  totalQuestions: number,
  currentQuestion: number
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are a friendly and professional AI technical interviewer conducting a voice-based interview.
Details:
- Role being interviewed for: ${role}
- Experience level: ${experience}
- Difficulty: ${difficulty}
- Specific Skills to evaluate: ${skills.join(", ")}
${context ? `- Custom Context/Focus: ${context}` : ""}
- Total number of questions: ${totalQuestions}
- Current Question Index: ${currentQuestion} of ${totalQuestions}

Your response MUST follow this exact structure:
1. Provide a brief, supportive acknowledgement of the candidate's last answer (1 sentence max). If this is the start of the interview (Question Index 1), skip the acknowledgement and just ask the question.
2. Ask the next technical/behavioral interview question. The question must be relevant to the role, experience, difficulty, and skills listed above.
3. If the current question index (${currentQuestion}) equals the total questions (${totalQuestions}), this is the final question. After they answer, thank the candidate for their time, let them know that the interview is now complete, and do not ask any further questions.

Strict Constraints:
- You must ask exactly ONE clear, concise question in your response.
- Do NOT output any markdown, bullet points, bold text, stars, brackets, or code snippets, as your response will be read aloud via browser Text-to-Speech (TTS). Write only in plain, natural conversational language.
- Keep your responses short, natural, and conversational.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contents: history as any,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    const generatedText = response.text;

    if (!generatedText) {
      throw new Error("Invalid response received from Gemini API");
    }

    return {
      success: true,
      text: generatedText.trim(),
    };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to generate next question";
    console.error("Error in generateInterviewQuestion server action:", error);
    return {
      success: false,
      error: errMsg,
    };
  }
}

export async function updateInterviewProgress(interviewId: string, answeredCount: number) {
  try {
    await prisma.interviewHistory.update({
      where: { id: interviewId },
      data: { answered: answeredCount },
    });
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to update progress";
    console.error("Error in updateInterviewProgress:", error);
    return { success: false, error: errMsg };
  }
}

export async function endInterviewSession(interviewId: string) {
  try {
    await prisma.interviewHistory.update({
      where: { id: interviewId },
      data: { status: InterviewStatus.COMPLETED },
    });
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to end interview";
    console.error("Error in endInterviewSession:", error);
    return { success: false, error: errMsg };
  }
}
