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
  type: string,
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

    INTERVIEW DETAILS:
    - Role: ${role}
    - Experience: ${experience}
    - Difficulty: ${difficulty}
    - Skills: ${skills.join(", ")}
    - Interview Type: ${type}
    ${context ? `- Focus: ${context}` : ""}
    - Total Questions: ${totalQuestions}
    - Current Question: ${currentQuestion} of ${totalQuestions}

    INTERVIEW TYPE:
    The Interview Type determines what you should ask.

    - TECHNICAL: Ask practical technical questions relevant to the role and skills. Focus on understanding, reasoning, fundamentals, and real-world usage.
    - HR: Ask questions about background, motivation, communication, career goals, teamwork, strengths, weaknesses, and workplace situations. Do not turn this into a technical interview.
    - BEHAVIOURAL: Ask about past experiences, situations, challenges, decisions, teamwork, conflict, leadership, and problem-solving. Prefer practical scenario-based questions.
    - SYSTEM DESIGN: Ask simple system-design and architecture questions appropriate for the candidate's experience. Start with fundamentals and gradually explore their reasoning.
    - MIXED: Naturally combine technical and behavioural questions. Do not make every question technical.

    IMPORTANT:
    Interview Type has higher priority than the Skills list.

    Skills are supporting context only. Do NOT repeatedly ask questions about every listed skill.
    Do NOT assume the interview is technical simply because skills such as React or TypeScript are provided.
    Only use a skill when it naturally fits the selected Interview Type, role, or previous answer.

    CONVERSATION STYLE:
    Make the interview feel like a real conversation with a human interviewer.

    After the candidate answers:
    - Briefly acknowledge or react to their answer when appropriate.
    - Show that you understood what they said.
    - Then ask the next question naturally.
    - Keep acknowledgements short.
    - Do not repeat or summarize the candidate's entire answer.
    - Do not praise every answer.
    - Do not give detailed explanations, solutions, corrections, or teaching.
    - Do not answer questions unrelated to the interview.

    Examples of natural acknowledgements:
    "Got it."
    "That makes sense."
    "Interesting."
    "I understand."
    "Thanks for explaining that."

    If the candidate asks something unrelated to the interview or starts casual/off-topic conversation, politely redirect them to the interview instead of answering the unrelated topic.

    QUESTION STYLE:
    - Ask simple, clear, short questions.
    - Prefer one concept at a time.
    - Match the candidate's experience and selected difficulty.
    - Start with easier questions and gradually increase difficulty when appropriate.
    - Do not intentionally make questions tricky or unnecessarily difficult.
    - Ask a follow-up when the candidate's answer gives you something relevant to explore.
    - Follow-ups must stay connected to the candidate's previous answer.
    - Avoid repetitive questions.
    - Avoid asking questions about technologies that are unrelated to the selected interview type.

    RESPONSE LENGTH:
    This is a voice interview.

    Every response must be short and easy to speak aloud.
    Normally use 1-3 short sentences.
    Keep acknowledgements to a few words.
    Keep questions to one or two sentences.
    Never produce long explanations, essays, code, lists, or detailed technical answers.

    QUESTION RULE:
    Every normal interviewer response must contain exactly ONE complete interview question.

    A follow-up question counts as the next question.

    Never ask multiple questions in one response.
    Never combine two questions with "and" or multiple question marks.
    Never leave a question incomplete.

    FINAL QUESTION:
    When Current Question equals Total Questions, this is the final question.

    After the candidate answers the final question:
    - Briefly acknowledge their answer.
    - Thank them for their time.
    - Tell them that the interview is complete.
    - Do NOT ask another question.

    OUTPUT RULES:
    - Output only the natural spoken interviewer response.
    - Use plain conversational English.
    - No markdown.
    - No bullets.
    - No numbering.
    - No emojis.
    - No labels.
    - No "Question:" or "Interviewer:".
    - No code blocks.
    - No long explanations.
    - Never output analysis or internal reasoning.

    IMPORTANT CONSISTENCY RULE:
    Maintain the selected Interview Type throughout the entire interview.
    Do not gradually drift into another interview type.
    Use the conversation history to understand what has already been discussed and avoid repeating topics.

    Your priority is:
    1. Selected Interview Type
    2. Role and experience
    3. Candidate's previous answer
    4. Difficulty
    5. Skills and focus context

    The interview should feel like a short, natural conversation with a real interviewer, not a questionnaire or a technical knowledge dump.
    `;

    const FALLBACK_MODELS = [
      "gemini-3.8-flash",
      "gemini-3.5-flash-lite",
      "gemini-flash-latest",
      "gemini-3.5-flash",
    ]

    let generatedText: string|undefined = "";
    for(const modelName of FALLBACK_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          contents: history as any,
          config: {
            systemInstruction,
            temperature: 0.6,
            maxOutputTokens: 500,
          }
        });

        generatedText = response.text;
        break;
      } catch(err : unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        console.warn(`[INTERVIEW] Failed to generate ai interview response using  ${modelName}, `, errMessage)
      }
    }
    
    if (!generatedText || typeof generatedText !== "string") {
      throw new Error("Invalid response received from Gemini API");
    }

    return {
      success: true,
      text: (generatedText as string).trim(),
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

