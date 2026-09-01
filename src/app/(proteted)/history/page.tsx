import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import HistoryPageClient from "@/src/components/history/HistoryPageClient";
import { SerializedInterviewHistory } from "@/src/components/history/types";

export const metadata = {
  title: "Interview History | HireLoop",
  description:
    "Review your AI interview history, practice telemetry, conversation transcripts, and performance progress.",
};

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user?.id) {
    redirect("/auth");
  }

  let serializedInterviews: SerializedInterviewHistory[] = [];

  try {
    const rawHistory = await prisma.interviewHistory.findMany({
      where: {
        userId: user.id,
      },
      include: {
        conversations: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    serializedInterviews = rawHistory.map((item) => ({
      id: item.id,
      userId: item.userId,
      type: item.type,
      role: item.role,
      experience: item.experience,
      difficulty: item.difficulty,
      skills: item.skills || [],
      sessionType: item.sessionType,
      context: item.context,
      creditsUsed: item.creditsUsed,
      totalQuestions: item.totalQuestions,
      answered: item.answered,
      status: item.status,
      timeElapsed: item.timeElapsed ?? 0,
      notes: item.notes,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      conversations: (item.conversations || []).map((c) => ({
        id: c.id,
        interviewId: c.interviewId,
        speaker: c.speaker,
        message: c.message,
        questionNumber: c.questionNumber,
        createdAt: c.createdAt.toISOString(),
      })),
    }));
  } catch (error) {
    console.error("Error fetching interview history:", error);
  }

  return <HistoryPageClient initialInterviews={serializedInterviews} />;
}
