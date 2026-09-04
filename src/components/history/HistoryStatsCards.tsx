"use client";

import {
  History,
  CheckCircle2,
  Clock,
  MessageSquareQuote,
  TrendingUp,
  Award,
} from "lucide-react";
import { HistoryStats } from "./types";
import { formatDuration } from "./historyHelpers";

type HistoryStatsCardsProps = {
  stats: HistoryStats;
};

export default function HistoryStatsCards({ stats }: HistoryStatsCardsProps) {
  const cards = [
    {
      title: "Total Sessions",
      value: stats.totalInterviews,
      subtitle: "Lifetime interview runs",
      icon: History,
      iconColor: "text-teal-400",
      iconBg: "bg-teal-950/40 border-teal-500/20",
      accentDot: "bg-teal-400",
      gradient: "from-teal-950/20 via-slate-900/40 to-slate-950/60",
      borderColor: "border-slate-800/80 hover:border-teal-500/30",
    },
    {
      title: "Completed Rate",
      value: `${stats.completionRate}%`,
      subtitle: `${stats.completedInterviews} of ${stats.totalInterviews} finished`,
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-950/40 border-emerald-500/20",
      accentDot: "bg-emerald-400",
      gradient: "from-emerald-950/20 via-slate-900/40 to-slate-950/60",
      borderColor: "border-slate-800/80 hover:border-emerald-500/30",
    },
    {
      title: "Practice Time",
      value: formatDuration(stats.totalTimeElapsed),
      subtitle: "Active audio & Q&A time",
      icon: Clock,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-950/40 border-blue-500/20",
      accentDot: "bg-blue-400",
      gradient: "from-blue-950/20 via-slate-900/40 to-slate-950/60",
      borderColor: "border-slate-800/80 hover:border-blue-500/30",
    },
    {
      title: "Questions Answered",
      value: stats.totalQuestionsAnswered,
      subtitle: "Total technical responses",
      icon: MessageSquareQuote,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-950/40 border-purple-500/20",
      accentDot: "bg-purple-400",
      gradient: "from-purple-950/20 via-slate-900/40 to-slate-950/60",
      borderColor: "border-slate-800/80 hover:border-purple-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${card.gradient} border ${card.borderColor} p-5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 group`}
          >
            {/* Subtle glow orb behind icon */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-teal-500/10 transition-colors" />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                {card.title}
              </span>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl border ${card.iconBg} shadow-inner transition-transform duration-200 group-hover:scale-105`}
              >
                <IconComponent className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-display">
                {card.value}
              </span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${card.accentDot}`} />
                <span className="text-xs text-slate-400 font-medium">
                  {card.subtitle}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
