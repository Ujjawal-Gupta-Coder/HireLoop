"use server";

import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/src/lib/prisma";
import { InterviewStatus, Speaker } from "@prisma/client";
import { auth } from "@/src/auth";

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

    const systemInstruction = `
      You are a friendly, professional AI interviewer conducting a natural voice-based interview.

      Interview Details:
      - Role: ${role}
      - Experience: ${experience}
      - Difficulty: ${difficulty}
      - Skills: ${skills.join(", ")}
      ${context ? `- Focus: ${context}` : ""}
      - Total Questions: ${totalQuestions}
      - Current Question: ${currentQuestion} of ${totalQuestions}

      Your goal is to make the interview feel like a real conversation with a human interviewer.

      CONVERSATION:
      - At the beginning, briefly greet the candidate and ask the first question.
      - After each answer, naturally respond based on what the candidate just said.
      - You may briefly acknowledge an interesting or relevant point before asking the next question.
      - Ask follow-up questions when the candidate's answer gives you something worth exploring.
      - Do not mechanically jump to a new topic after every answer.
      - Gradually explore the candidate's knowledge and reasoning.
      - Keep the conversation relevant to the role, experience, difficulty, and skills.
      - Keep responses short and natural for voice conversation.
      - If the current question index (${currentQuestion}) equals the total questions (${totalQuestions}), this is the final question. After they answer, thank the candidate for their time, let them know that the interview is now complete, and do not ask any further questions.
      
      QUESTION RULE:
      - Every response after the greeting must contain exactly ONE complete interview question.
      - A follow-up question counts as the next question.
      - Never ask multiple questions in one response.
      - Never leave a question incomplete.
      - Do not ask another question after the final question.

      OUTPUT:
      - Use plain, natural conversational English.
      - No markdown, bullets, numbering, brackets, emojis, or special formatting.
      - Do not include labels such as "Question:" or "Interviewer:".
      - Keep the response concise.
      - Output only the natural spoken interviewer response.

      The interview should feel like a real conversation, not a questionnaire.
      `;

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

export type SaveConversationParams = {
  interviewId: string;
  speaker: Speaker;
  message: string;
  questionNumber?: number | null;
  timeElapsed?: number;
  answered?: number;
  notes?: string;
};

export async function saveConversationMessage({
  interviewId,
  speaker,
  message,
  questionNumber,
  timeElapsed,
  answered,
  notes,
}: SaveConversationParams) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const trimmed = message.trim();
    if (!trimmed) {
      return { success: false, error: "Message cannot be empty" };
    }

    const interview = await prisma.interviewHistory.findFirst({
      where: {
        id: interviewId,
        user: { email: session.user.email },
      },
      select: { id: true },
    });

    if (!interview) {
      return { success: false, error: "Interview session not found or unauthorized" };
    }

    const conversation = await prisma.conversation.create({
      data: {
        interviewId,
        speaker,
        message: trimmed,
        questionNumber: questionNumber ?? null,
      },
    });

    const updateData: { timeElapsed?: number; answered?: number; notes?: string } = {};
    if (typeof timeElapsed === "number" && !isNaN(timeElapsed)) {
      updateData.timeElapsed = Math.max(0, Math.floor(timeElapsed));
    }
    if (typeof answered === "number" && !isNaN(answered)) {
      updateData.answered = Math.max(0, Math.floor(answered));
    }
    if (typeof notes === "string") {
      updateData.notes = notes;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.interviewHistory.update({
        where: { id: interviewId },
        data: updateData,
      });
    }

    return {
      success: true,
      data: {
        id: conversation.id,
        interviewId: conversation.interviewId,
        speaker: conversation.speaker,
        message: conversation.message,
        questionNumber: conversation.questionNumber,
        createdAt: conversation.createdAt.toISOString(),
      },
    };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to save conversation";
    console.error("Error in saveConversationMessage:", error);
    return { success: false, error: errMsg };
  }
}

export async function updateInterviewProgress(
  interviewId: string,
  answeredCount: number,
  timeElapsed?: number,
  notes?: string
) {
  try {
    const updateData: { answered: number; timeElapsed?: number; notes?: string } = {
      answered: answeredCount,
    };
    if (typeof timeElapsed === "number" && !isNaN(timeElapsed)) {
      updateData.timeElapsed = Math.max(0, Math.floor(timeElapsed));
    }
    if (typeof notes === "string") {
      updateData.notes = notes;
    }

    await prisma.interviewHistory.update({
      where: { id: interviewId },
      data: updateData,
    });
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to update progress";
    console.error("Error in updateInterviewProgress:", error);
    return { success: false, error: errMsg };
  }
}

export type EndInterviewSessionOptions = {
  interviewId: string;
  timeElapsed?: number;
  answered?: number;
  notes?: string;
  status?: InterviewStatus;
  pendingTranscript?: {
    speaker: Speaker;
    message: string;
    questionNumber?: number | null;
  };
};

export async function endInterviewSession(
  input: string | EndInterviewSessionOptions
) {
  try {
    const interviewId = typeof input === "string" ? input : input.interviewId;
    const timeElapsed = typeof input === "object" ? input.timeElapsed : undefined;
    const answered = typeof input === "object" ? input.answered : undefined;
    const notes = typeof input === "object" ? input.notes : undefined;
    const status =
      typeof input === "object" && input.status
        ? input.status
        : InterviewStatus.COMPLETED;
    const pendingTranscript =
      typeof input === "object" ? input.pendingTranscript : undefined;

    if (pendingTranscript && pendingTranscript.message.trim()) {
      await prisma.conversation.create({
        data: {
          interviewId,
          speaker: pendingTranscript.speaker,
          message: pendingTranscript.message.trim(),
          questionNumber: pendingTranscript.questionNumber ?? null,
        },
      });
    }

    const updateData: {
      status: InterviewStatus;
      timeElapsed?: number;
      answered?: number;
      notes?: string;
    } = {
      status,
    };

    if (typeof timeElapsed === "number" && !isNaN(timeElapsed)) {
      updateData.timeElapsed = Math.max(0, Math.floor(timeElapsed));
    }

    if (typeof answered === "number" && !isNaN(answered)) {
      updateData.answered = Math.max(0, Math.floor(answered));
    }

    if (typeof notes === "string") {
      updateData.notes = notes;
    }

    await prisma.interviewHistory.update({
      where: { id: interviewId },
      data: updateData,
    });

    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to end interview";
    console.error("Error in endInterviewSession:", error);
    return { success: false, error: errMsg };
  }
}

