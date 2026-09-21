import Link from "next/link";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { formatIdIntoLabel } from "@/src/helper/helper.common";
import { getOrGenerateInterviewReport } from "@/src/actions/analytics";
import AnalyticsClientView from "@/src/components/analytics/AnalyticsClientView";
import { InterviewSessionInfo } from "@/src/components/analytics/analyticsTypes";

type AnalyticsPageParams = {
  params: Promise<{id : string}>
}

export default async function AnalyticsPage({params}: AnalyticsPageParams) {
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
      report: true,
    },
  });

  if (!interview) {
    redirect("/history");
  }

  const roleLabel = formatIdIntoLabel(interview.role);
  const expLabel = formatIdIntoLabel(interview.experience);

  // Case 1: No conversations recorded at all (abandoned session before starting)
  if (!interview.conversations || interview.conversations.length === 0) {
    return (
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl w-full mx-auto space-y-8 relative">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Interview History</span>
        </Link>

        <div className="p-8 sm:p-12 rounded-3xl bg-[#090e1c]/90 border border-slate-800/90 text-center space-y-6 shadow-2xl">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
              No Transcript Recorded
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              This session was started for <strong className="text-slate-200">{roleLabel} ({expLabel})</strong>, but ended before any questions or candidate answers were recorded.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/history"
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
            >
              ← Return to History
            </Link>
            <Link
              href="/interview"
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              Start New Mock Interview
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Case 2: Fetch or Generate Report via Gemini
  const reportResult = await getOrGenerateInterviewReport(interviewId);

  if (!reportResult.success) {
    return (
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl w-full mx-auto space-y-8 relative">

        <div className="p-8 sm:p-12 rounded-3xl bg-[#090e1c]/90 border border-rose-500/30 text-center space-y-6 shadow-2xl">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
              Report Generation Notice
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              An unexpected issue occurred while evaluating this interview session.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Please try again after some time.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            
            <Link
              href="/history"
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="text-sm" /> 
              Return to History
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const interviewDetails: InterviewSessionInfo = {
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
    timeElapsed: interview.timeElapsed,
    createdAt: interview.createdAt.toISOString(),
  };

 
  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto space-y-8 relative pb-20">
      {/* Background glow graphics */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <AnalyticsClientView interviewDetails={interviewDetails} interviewReport={reportResult.data} />
    </main>
  );
}
