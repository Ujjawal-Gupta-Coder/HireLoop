"use client";

import { useMemo } from "react";
import { LucideIcon } from "lucide-react";
import { getTierInfo } from "./performanceMeter";

type ScoreParameterCardProps = {
  title: string;
  score: number;
  icon: LucideIcon;
  description?: string;
  benchmarkHint?: string;
};

export default function ScoreParameterCard({
  title,
  score,
  icon: Icon,
  description,
  benchmarkHint,
}: ScoreParameterCardProps) {
  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));
  const tier = useMemo(() => getTierInfo(boundedScore), [boundedScore]);

  return (
    <div className="relative p-5 rounded-2xl bg-[#090e1c]/80 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 shadow-lg flex flex-col justify-between group">
      {/* Top row: Icon, title, and score badge */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-xl border ${tier.bgColor} ${tier.borderColor} ${tier.textColor} shadow-inner`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                {title}
              </h4>
              {benchmarkHint && (
                <span className="text-[10px] text-slate-500 block">
                  {benchmarkHint}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xl font-extrabold text-slate-100 font-display">
                {boundedScore}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">/100</span>
            </div>
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${tier.badgeBg}`}
            >
              {tier.level}
            </span>
          </div>
        </div>

        {description && (
          <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/50 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Proficiency</span>
          <span className={tier.textColor}>{boundedScore}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-900 border border-slate-800/80 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${tier.progressGradient} transition-all duration-1000 ease-out`}
            style={{ width: `${boundedScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}
