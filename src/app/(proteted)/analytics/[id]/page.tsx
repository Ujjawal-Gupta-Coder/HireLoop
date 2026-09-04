import Link from "next/link";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import {
  BarChart3,
  ArrowLeft,
  Sparkles,
  FileText,
} from "lucide-react";
import { formatIdIntoLabel } from "@/src/helper/helper.common";
import { formatDuration, formatInterviewDate } from "@/src/components/history/historyHelpers";

type AnalyticsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/auth");
  }

  const { id: interviewId } = await params;
  if (!interviewId) {
    redirect("/history");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/auth");
  }

  const interview = await prisma.interviewHistory.findFirst({
    where: {
      id: interviewId,
      userId: user.id,
    },
    include: {
      conversations: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const roleLabel = interview ? formatIdIntoLabel(interview.role) : "Interview";
  const expLabel = interview ? formatIdIntoLabel(interview.experience) : "";

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl w-full mx-auto space-y-8 relative pb-20">
      {/* Background glow graphics */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Back button & Title */}
      <div className="space-y-4">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Interview History</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Performance Analytics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 font-display">
              {roleLabel} Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Session ID: <code className="text-teal-300 font-mono">{interviewId}</code>
            </p>
          </div>

          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-all cursor-pointer self-start sm:self-auto"
          >
            <FileText className="h-3.5 w-3.5 text-teal-400" />
            <span>View All Sessions</span>
          </Link>
        </div>
      </div>

      {/* Quick Summary Card if interview found */}
      {interview && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#090e1c]/80 border border-slate-800/80 shadow-xl">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Status</span>
            <span className="text-sm font-bold text-teal-400 mt-0.5 block">{interview.status}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Experience</span>
            <span className="text-sm font-bold text-slate-200 mt-0.5 block">{expLabel}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Questions Answered</span>
            <span className="text-sm font-bold text-slate-200 mt-0.5 block">
              {interview.answered} / {interview.totalQuestions}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Time Invested</span>
            <span className="text-sm font-bold text-slate-200 mt-0.5 block">
              {formatDuration(interview.timeElapsed)}
            </span>
          </div>
        </div>
      )}

      {/* Modern Analytics Placeholder Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0c1324] via-[#090e1c] to-[#060a14] border border-teal-500/30 p-8 sm:p-14 text-center shadow-2xl space-y-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-950/60 border border-teal-500/40 text-teal-400 shadow-inner shadow-teal-500/20">
          <BarChart3 className="h-8 w-8 animate-pulse" />
        </div>

        <div className="relative space-y-2 max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
            Detailed Analytics & AI Scoring Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The dedicated performance breakdown, grammar & communication scoring, technical accuracy graphs, and AI improvement recommendations for this session are coming here next!
          </p>
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/history"
            className="px-5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-all cursor-pointer"
          >
            ← Return to History
          </Link>
          <Link
            href="/interview"
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-lg shadow-teal-500/15 cursor-pointer"
          >
            Practice New Interview
          </Link>
        </div>
      </div>
    </main>
  );
}
