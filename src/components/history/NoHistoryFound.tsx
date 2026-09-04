"use client";

import Link from "next/link";
import { Video, SearchX, RotateCcw, Sparkles, ArrowRight } from "lucide-react";

type NoHistoryFoundProps = {
  isFiltered: boolean;
  onClearFilters: () => void;
};

export default function NoHistoryFound({
  isFiltered,
  onClearFilters,
}: NoHistoryFoundProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-[#0a0f1d]/70 border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-teal-400 shadow-inner">
          <SearchX className="h-7 w-7" />
        </div>

        <div className="space-y-1 max-w-md">
          <h3 className="text-lg font-bold text-slate-100 font-display">
            No Interview Sessions Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            No interview records matched your active search query or selected filter criteria.
          </p>
        </div>

        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-teal-400 bg-teal-950/40 border border-teal-500/30 rounded-xl hover:bg-teal-400 hover:text-slate-950 transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center text-center p-8 sm:p-14 rounded-2xl bg-gradient-to-b from-[#0e1628]/80 via-[#0a0f1e]/90 to-[#060a14] border border-teal-500/20 shadow-2xl space-y-5">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-950/60 border border-teal-500/30 text-teal-400 shadow-inner shadow-teal-500/20 animate-pulse">
        <Video className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-lg relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ready to practice?</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
          No Interview History Yet
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          You haven't conducted any AI interview sessions yet. Launch your first voice-based technical or behavioral practice session now to build your interview telemetry!
        </p>
      </div>

      <Link
        href="/interview"
        className="relative inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 hover:scale-[1.02] shadow-lg shadow-teal-500/20 transition-all duration-200 cursor-pointer group"
      >
        <Video className="h-4 w-4 transition-transform group-hover:scale-110" />
        <span>Start Your First AI Interview</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
