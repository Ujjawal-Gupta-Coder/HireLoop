"use client";

import { useState, useMemo } from "react";
import {
  HelpCircle,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { QuestionAnalysis } from "./analyticsTypes";
import { getQuestionScoreBadge } from "./performanceMeter";

type QuestionAnalysisSectionProps = {
  questions: QuestionAnalysis[];
};

export default function QuestionAnalysisSection({
  questions,
}: QuestionAnalysisSectionProps) {
  const [filterMode, setFilterMode] = useState<"ALL" | "HIGH" | "MID" | "LOW">("ALL");
  const [expandedQue, setExpandedQue] = useState<number>(-1);

  const toggleExpand = (qNum: number) => {
    if(qNum === expandedQue) {
      setExpandedQue(-1);
    }
    else setExpandedQue(qNum);
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filterMode === "HIGH" && q.score < 7.5) return false;
      if (filterMode === "MID" && (q.score < 5 || q.score >= 7.5)) return false;
      if (filterMode === "LOW" && q.score >= 5) return false;

      return true;
    });
  }, [questions, filterMode]);

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#090e1c]/80 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="h-4 w-4 text-teal-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Filter:
            </span>
          </div>

          <button
            onClick={() => setFilterMode("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterMode === "ALL"
                ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            All ({questions.length})
          </button>

          <button
            onClick={() => setFilterMode("HIGH")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterMode === "HIGH"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-emerald-400 hover:bg-emerald-950/40 border border-slate-800"
            }`}
          >
            High Scoring (≥ 7.5)
          </button>

          <button
            onClick={() => setFilterMode("MID")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterMode === "MID"
                ? "bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20"
                : "bg-slate-900 text-yellow-400 hover:bg-yellow-950/40 border border-slate-800"
            }`}
          >
            Average (5 - 7.4)
          </button>

          <button
            onClick={() => setFilterMode("LOW")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterMode === "LOW"
                ? "bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20"
                : "bg-slate-900 text-rose-400 hover:bg-rose-950/40 border border-slate-800"
            }`}
          >
            Needs Practice (&lt; 5)
          </button>
        </div>

      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="p-10 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
          <HelpCircle className="h-8 w-8 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No questions match your filter.</p>
          <button
            onClick={() => {
              setFilterMode("ALL");
            }}
            className="text-xs text-teal-400 hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedQue === q.questionNumber;
            const badge = getQuestionScoreBadge(q.score);

            return (
              <div
                key={q.questionNumber}
                className="rounded-2xl bg-[#090e1c]/80 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 overflow-hidden shadow-lg"
              >
                {/* Header / Accordion trigger */}
                <button
                  type="button"
                  onClick={() => toggleExpand(q.questionNumber)}
                  className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 text-left transition-colors hover:bg-slate-800/30 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="flex-shrink-0 px-2.5 py-1 rounded-xl text-xs font-bold bg-teal-950/60 border border-teal-500/30 text-teal-300 font-mono">
                      Q{q.questionNumber}
                    </span>

                    <h4 className="text-sm font-bold text-slate-100 line-clamp-1 sm:line-clamp-2">
                      {q.question}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-baseline gap-1 text-right">
                      <span className="text-base font-extrabold text-slate-100 font-display">
                        {q.score.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">/10</span>
                    </div>

                    <span
                      className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.className}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.pillColor}`} />
                      {badge.text}
                    </span>

                    <div className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-slate-950/40 space-y-4">
                    {/* Full Question */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <HelpCircle className="h-3.5 w-3.5 text-teal-400" />
                        <span>Question Asked</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {q.question}
                      </p>
                    </div>

                    {/* Candidate's Answer */}
                    <div className="p-4 rounded-xl bg-[#0b1329]/80 border border-blue-500/20 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                          <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                          <span>Candidate&apos;s Answer</span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {q.answer || "No verbal or text response recorded."}
                      </p>
                    </div>

                    {/* AI Feedback & Score Breakdown */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/40 via-emerald-950/30 to-slate-950/60 border border-teal-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="h-3.5 w-3.5 text-teal-300" />
                          <span>AI Feedback &amp; Evaluation</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-medium">Rating:</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badge.className}`}>
                            {q.score.toFixed(1)} / 10 • {badge.text}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {q.feedback}
                      </p>

                      {/* Mini Score Bar */}
                      <div className="pt-2 flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              q.score >= 7.5
                                ? "bg-emerald-400"
                                : q.score >= 5
                                ? "bg-yellow-400"
                                : "bg-rose-400"
                            }`}
                            style={{ width: `${Math.min(100, q.score * 10)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {(q.score * 10).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
