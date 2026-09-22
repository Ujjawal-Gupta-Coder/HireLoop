"use client";

import { CheckCircle2, AlertTriangle, Lightbulb, Sparkles } from "lucide-react";

type StrengthsWeaknessesCardProps = {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
};

export default function StrengthsWeaknessesCard({
  strengths,
  weaknesses,
  recommendations,
}: StrengthsWeaknessesCardProps) {
  const safeStrengths = strengths.slice(0, 3);
  const safeWeaknesses = weaknesses.slice(0, 3);
  const safeRecommendations = recommendations.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Strengths */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#091717]/90 to-[#070d18]/90 border border-emerald-500/20 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Key Strengths
              </h3>
              <span className="text-[11px] text-emerald-400 font-medium">
                Top 3 Demonstrated Assets
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
            3 Bullets
          </span>
        </div>

        <ul className="space-y-3 pt-1">
          {safeStrengths.map((str, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-emerald-500/30 transition-colors"
            >
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                {str}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Weaknesses */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#181014]/90 to-[#070d18]/90 border border-amber-500/20 shadow-xl space-y-4 hover:border-amber-500/40 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Weaknesses
              </h3>
              <span className="text-[11px] text-amber-400 font-medium">
                Top 3 Areas for Growth
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300">
            3 Bullets
          </span>
        </div>

        <ul className="space-y-3 pt-1">
          {safeWeaknesses.map((weak, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-amber-500/30 transition-colors"
            >
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                {weak}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. AI Recommendations */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#0d1624]/90 to-[#070d18]/90 border border-cyan-500/20 shadow-xl space-y-4 hover:border-cyan-500/40 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                AI Recommendations
              </h3>
              <span className="text-[11px] text-cyan-400 font-medium">
                Top 3 Actionable Next Steps
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            3 Bullets
          </span>
        </div>

        <ul className="space-y-3 pt-1">
          {safeRecommendations.map((rec, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-cyan-500/30 transition-colors"
            >
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold mt-0.5">
                <Sparkles className="h-3 w-3" />
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                {rec}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
