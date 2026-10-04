import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Video,
  Coins,
  Clock,
  CheckCircle2,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Radio,
  FileQuestion,
  Receipt,
  ArrowRight,
  Award,
  Globe,
  User,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { formatIdIntoLabel } from "@/src/helper/helper.common";
import { formatDuration, getTrackInfo } from "@/src/components/history/historyHelpers";

export type DashboardStats = {
  currentCredits: number;
  completedInterviews: number;
  totalPurchasedCredits: number;
  totalTimeElapsed: number;
};

export type DashboardRecentInterview = {
  id: string;
  role: string;
  type: string;
  status: string;
  answered: number;
  totalQuestions: number;
  timeElapsed: number;
  createdAt: string;
  overallScore: number | null;
};

export type DashboardRecentPayment = {
  id: string;
  planName: string;
  planCredits: number;
  amount: number;
  status: string;
  receiptId: string;
  createdAt: string;
};

export default async function DashboardPage() {
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
      name: true,
      email: true,
      credits: true,
      interviewHistory: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          type: true,
          role: true,
          status: true,
          answered: true,
          totalQuestions: true,
          timeElapsed: true,
          createdAt: true,
          report: {
            select: {
              overallScore: true,
            },
          },
        },
      },
      payment: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          amount: true,
          status: true,
          receiptId: true,
          createdAt: true,
          plan: {
            select: {
              name: true,
              credits: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/auth");
  }

  // Aggregate stats across all interviews & payments for this user
  const [allInterviews, purchasedCreditEntries] = await Promise.all([
    prisma.interviewHistory.findMany({
      where: {
        userId: user.id,
      },
      select: {
        status: true,
        timeElapsed: true,
      },
    }),
    prisma.creditHistory.findMany({
      where: {
        userId: user.id,
        type: "PURCHASE",
      },
      select: {
        credit: true,
      },
    }),
  ]);

  const completedInterviews = allInterviews.filter(
    (i) => i.status === "COMPLETED"
  ).length;

  const totalTimeElapsed = allInterviews.reduce(
    (acc, curr) => acc + (curr.timeElapsed || 0),
    0
  );

  const totalPurchasedCredits = purchasedCreditEntries.reduce(
    (acc, curr) => acc + curr.credit,
    0
  );

  const stats: DashboardStats = {
    currentCredits: user.credits,
    completedInterviews,
    totalPurchasedCredits,
    totalTimeElapsed,
  };

  const recentInterviews: DashboardRecentInterview[] = user.interviewHistory.map(
    (item) => ({
      id: item.id,
      role: item.role,
      type: item.type,
      status: item.status,
      answered: item.answered,
      totalQuestions: item.totalQuestions,
      timeElapsed: item.timeElapsed || 0,
      createdAt: item.createdAt.toISOString(),
      overallScore: item.report?.overallScore ?? null,
    })
  );

  const recentPayments: DashboardRecentPayment[] = user.payment.map(
    (payment) => ({
      id: payment.id,
      planName: payment.plan.name,
      planCredits: payment.plan.credits,
      amount: payment.amount,
      status: payment.status,
      receiptId: payment.receiptId,
      createdAt: payment.createdAt.toISOString(),
    })
  );
  
  const CURRENCY_SYMBOL = "₹";

  const statCards = [
      {
        title: "Current Credits",
        value: stats.currentCredits,
        subtitle: "Available to practice",
        icon: Coins,
        iconColor: "text-yellow-400",
        accentBg: "bg-teal-950/40 border-teal-500/20",
        glowColor: "from-teal-950/20 via-slate-900/40 to-slate-950/60",
        borderColor: "border-slate-800/80 hover:border-teal-500/30",
      },
      {
        title: "Interviews Completed",
        value: stats.completedInterviews,
        subtitle: "Full sessions finished",
        icon: CheckCircle2,
        iconColor: "text-emerald-400",
        accentBg: "bg-emerald-950/40 border-emerald-500/20",
        glowColor: "from-emerald-950/20 via-slate-900/40 to-slate-950/60",
        borderColor: "border-slate-800/80 hover:border-emerald-500/30",
      },
      {
        title: "Credits Purchased",
        value: stats.totalPurchasedCredits,
        subtitle: "Lifetime bought",
        icon: ShoppingBag,
        iconColor: "text-teal-400",
        accentBg: "bg-cyan-950/40 border-cyan-500/20",
        glowColor: "from-cyan-950/20 via-slate-900/40 to-slate-950/60",
        borderColor: "border-slate-800/80 hover:border-cyan-500/30",
      },
      {
        title: "Time in Interviews",
        value: formatDuration(stats.totalTimeElapsed),
        subtitle: "Total practice time",
        icon: Clock,
        iconColor: "text-blue-400",
        accentBg: "bg-blue-950/40 border-blue-500/20",
        glowColor: "from-blue-950/20 via-slate-900/40 to-slate-950/60",
        borderColor: "border-slate-800/80 hover:border-blue-500/30",
      },
    ];

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-8">
      {/* 1. Welcome Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#111827]/85 to-[#0b0f19]/90 border border-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Subtle Teal Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-display">
              Welcome back, {user.name || "Candidate"} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-400 font-medium">
              Ready for your next interview?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/interview"
              className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 hover:scale-[1.02] shadow-lg shadow-teal-500/20 transition-all duration-200 cursor-pointer group"
            >
              <Video className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
              <span>Start Interview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Account Overview Stats (4-Card Responsive Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl bg-linear-to-b ${card.glowColor} border ${card.borderColor} p-5 shadow-xl transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                  {card.title}
                </span>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl border ${card.accentBg} shadow-inner transition-transform group-hover:scale-105`}
                >
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-display">
                  {card.value}
                </span>
                <span className="text-xs text-slate-400 font-medium mt-1">
                  {card.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Content: Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Interviews */}
        <div className="rounded-2xl border border-slate-900/90 bg-[#0c101d]/60 backdrop-blur-md shadow-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 border-b border-slate-900/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-200 tracking-tight font-display flex items-center gap-2">
                  <Video className="h-4.5 w-4.5 text-teal-400" />
                  Recent Interviews
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest sessions and performance evaluations
                </p>
              </div>

              <Link
                href="/history"
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors group"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {recentInterviews.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-500">
                  <FileQuestion className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300">No interviews yet</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Start your first mock interview to practice and get AI feedback.
                  </p>
                </div>
                <Link
                  href="/interview"
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all cursor-pointer shadow-md"
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Start Interview</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-900/60">
                {recentInterviews.map((interview) => {
                  const trackInfo = getTrackInfo(interview.type);
                  const isCompleted = interview.status === "COMPLETED";
                  const isRunning = interview.status === "RUNNING";

                  const formattedDate = new Date(interview.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });

                  return (
                    <div
                      key={interview.id}
                      className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-900/20 px-2 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${trackInfo.badgeColor}`}
                        >
                          <trackInfo.icon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-teal-300 transition-colors">
                            {formatIdIntoLabel(interview.role)}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                            <span className="text-teal-400/80 font-medium">
                              {trackInfo.shortLabel}
                            </span>
                            <span>•</span>
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Score if completed & available */}
                        {isCompleted && interview.overallScore !== null && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-teal-950/40 text-teal-400 border border-teal-500/20 px-2 py-0.5 text-xs font-semibold">
                            <Award className="h-3 w-3" />
                            <span>{interview.overallScore}%</span>
                          </span>
                        )}

                        {/* Status Badge */}
                        {isCompleted ? (
                          <Link
                            href={`/analytics/${interview.id}`}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold transition-colors"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Completed</span>
                          </Link>
                        ) : isRunning ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-teal-950/40 text-teal-400 border border-teal-500/20 px-2.5 py-0.5 text-xs font-semibold">
                            <Radio className="h-3 w-3 animate-pulse" />
                            <span>In Progress</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 text-xs font-semibold">
                            <span>Abandoned</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Transactions */}
        <div className="rounded-2xl border border-slate-900/90 bg-[#0c101d]/60 backdrop-blur-md shadow-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 border-b border-slate-900/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-200 tracking-tight font-display flex items-center gap-2">
                  <CreditCard className="h-4.5 w-4.5 text-teal-400" />
                  Recent Transactions
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Recent credit purchases and payments
                </p>
              </div>

              <Link
                href="/billing"
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors group"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {recentPayments.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-500">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300">No transactions yet</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Purchase credits anytime to unlock mock interview sessions.
                  </p>
                </div>
                <Link
                  href="/#pricing"
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all cursor-pointer shadow-md"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Explore Plans</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-900/60">
                {recentPayments.map((payment) => {
                  const formattedDate = new Date(payment.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={payment.id}
                      className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-900/20 px-2 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl border border-teal-500/20 bg-teal-950/40 flex items-center justify-center text-teal-400 shrink-0">
                          <Coins className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-teal-300 transition-colors">
                            {payment.planName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="text-teal-400 font-semibold">
                              +{payment.planCredits} Credits
                            </span>
                            <span>•</span>
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-semibold text-slate-200 text-sm">
                          {CURRENCY_SYMBOL}{payment.amount}
                        </span>

                        {payment.status === "PAID" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid
                          </span>
                        ) : payment.status === "FAILED" ? (
                          <span className="inline-flex items-center rounded-full bg-rose-950/40 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 text-xs font-semibold">
                            Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-yellow-950/40 text-yellow-400 border border-yellow-500/20 px-2.5 py-0.5 text-xs font-semibold">
                            {payment.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Quick Links Navigation */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-display">
          Quick Links
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Link 1: Landing Page */}
          <Link
            href="/"
            className="flex items-center justify-between p-4 rounded-2xl bg-linear-to-b from-[#111827]/70 to-[#0b0f19]/90 border border-slate-900 hover:border-teal-500/30 shadow-lg transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-950/40 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200 group-hover:text-teal-300 transition-colors">
                  HireLoop Home
                </p>
                <p className="text-xs text-slate-500">Visit landing page</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Link 2: Profile */}
          <Link
            href="/profile"
            className="flex items-center justify-between p-4 rounded-2xl bg-linear-to-b from-[#111827]/70 to-[#0b0f19]/90 border border-slate-900 hover:border-teal-500/30 shadow-lg transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200 group-hover:text-teal-300 transition-colors">
                  Profile
                </p>
                <p className="text-xs text-slate-500">Account credentials</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Link 3: Billing */}
          <Link
            href="/billing"
            className="flex items-center justify-between p-4 rounded-2xl bg-linear-to-b from-[#111827]/70 to-[#0b0f19]/90 border border-slate-900 hover:border-teal-500/30 shadow-lg transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200 group-hover:text-teal-300 transition-colors">
                  Billing
                </p>
                <p className="text-xs text-slate-500">Payments & invoices</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Link 4: Buy Credits */}
          <Link
            href="/#pricing"
            className="flex items-center justify-between p-4 rounded-2xl bg-linear-to-b from-teal-950/30 to-[#0b0f19]/90 border border-teal-500/30 hover:border-teal-400/50 shadow-lg shadow-teal-500/5 transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-teal-300 group-hover:text-teal-200 transition-colors">
                  Need More Credits?
                </p>
                <p className="text-xs text-teal-400/80">Buy credits</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-teal-400 group-hover:translate-x-0.5 transition-all" />
          </Link>

        </div>
      </div>
    </main>
  );
}
