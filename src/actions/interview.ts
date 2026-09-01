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

export async function deleteInterviewSession(interviewId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    if (!interviewId || !interviewId.trim()) {
      return { success: false, error: "Interview ID is required" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const interview = await prisma.interviewHistory.findFirst({
      where: {
        id: interviewId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!interview) {
      return {
        success: false,
        error: "Interview session not found or you do not have permission to delete it",
      };
    }

    await prisma.$transaction([
      prisma.conversation.deleteMany({
        where: { interviewId },
      }),
      prisma.interviewHistory.delete({
        where: { id: interviewId },
      }),
    ]);

    return { success: true };
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Failed to delete interview session";
    console.error("Error in deleteInterviewSession:", error);
    return { success: false, error: errMsg };
  }
}

