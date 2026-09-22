"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Cpu,
  MessageSquare,
  Award,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface EvaluationStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const EVALUATION_STEPS: EvaluationStep[] = [
  {
    id: 1,
    title: "Reviewing Interview Transcript",
    subtitle: "Parsing candidate answers and contextual questions from the session...",
    icon: Brain,
  },
  {
    id: 2,
    title: "Evaluating Technical Acumen",
    subtitle: "Benchmarking problem solving, technical depth, and architectural reasoning...",
    icon: Cpu,
  },
  {
    id: 3,
    title: "Analyzing Communication Polish",
    subtitle: "Scoring clarity, vocabulary, tone, poise, and workplace professionalism...",
    icon: MessageSquare,
  },
  {
    id: 4,
    title: "Synthesizing AI Evaluation Report",
    subtitle: "Compiling executive summary, score cards, and actionable recommendations...",
    icon: Award,
  },
];

export default function AnalyticsLoadingAnimation() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Cycle through evaluation steps every ~2.8 seconds
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % EVALUATION_STEPS.length);
    }, 2800);

    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const activeStep = EVALUATION_STEPS[currentStepIndex];
  const progressPercent = Math.min(95, Math.round(((currentStepIndex + 1) / EVALUATION_STEPS.length) * 100));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Background glow graphics */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Main AI Generation Focal Card */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-[#090e1c]/95 border border-teal-500/25 backdrop-blur-xl text-center space-y-7 shadow-2xl shadow-teal-950/40 overflow-hidden">
        {/* Top ambient highlight line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-linear-to-r from-transparent via-teal-400 to-transparent opacity-80" />

        {/* Central Animated Orb */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          {/* Pulsing ambient glow */}
          <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl animate-pulse" />

          {/* Outer rotating dashed ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-teal-500/30 animate-spin"
            style={{ animationDuration: "10s" }}
          />

          {/* Middle counter-rotating ring */}
          <div
            className="absolute inset-2 rounded-full border-2 border-cyan-400/40 border-t-transparent border-l-transparent animate-spin"
            style={{ animationDuration: "3.5s", animationDirection: "reverse" }}
          />

          {/* Center glowing badge */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-tr from-teal-500/20 to-cyan-500/20 border border-teal-400/50 flex items-center justify-center shadow-lg shadow-teal-500/25 text-teal-300">
            <activeStep.icon className="h-7 w-7 sm:h-8 sm:w-8 animate-pulse text-teal-300" />
          </div>
        </div>

        {/* Status Pill & Headings */}
        <div className="space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
            </span>
            <span>AI Evaluation in Progress</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{elapsedSeconds}s elapsed</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display tracking-tight">
            Generating Analytics Report
          </h2>

          {/* Active Step Transition */}
          <div className="min-h-[50px] flex flex-col items-center justify-center transition-all duration-300">
            <p className="text-sm sm:text-base font-semibold text-teal-300 flex items-center gap-1.5 justify-center">
              <Sparkles className="h-4 w-4 shrink-0 text-teal-400" />
              <span>{activeStep.title}</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-md mx-auto leading-relaxed">
              {activeStep.subtitle}
            </p>
          </div>
        </div>

        {/* Shimmering Progress Bar */}
        <div className="space-y-2 max-w-md mx-auto w-full pt-1">
          <div className="h-2 w-full bg-slate-900/90 border border-slate-800 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-linear-to-r from-teal-500 via-cyan-400 to-teal-400 rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Traveling light beam */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 px-1 font-mono">
            <span>Step {currentStepIndex + 1} of {EVALUATION_STEPS.length}</span>
            <span>{progressPercent}% Complete</span>
          </div>
        </div>

        {/* Step Indicator Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-2xl mx-auto text-left">
          {EVALUATION_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2.5 ${
                  isCurrent
                    ? "bg-teal-500/10 border-teal-500/40 text-teal-300 shadow-md shadow-teal-500/10"
                    : isCompleted
                    ? "bg-slate-900/80 border-slate-800 text-slate-300"
                    : "bg-slate-950/40 border-slate-800/40 text-slate-500"
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 text-teal-300 animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-600 font-mono">
                      {step.id}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate leading-tight">
                    {step.title.split(" ")[0]} {step.title.split(" ")[1] || ""}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {isCompleted ? "Completed" : isCurrent ? "Analyzing..." : "Pending"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skeletons Preview of the Analytics Dashboard */}
      <div className="space-y-6 opacity-40 pointer-events-none select-none transition-opacity duration-500">
        {/* Strip skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 p-4 rounded-2xl bg-[#090e1c]/60 border border-slate-800/60 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-2.5 bg-slate-800 rounded w-16" />
              <div className="h-4 bg-slate-700/60 rounded w-20" />
            </div>
          ))}
        </div>

        {/* Main overview grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gauge card skeleton */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-[#090e1c]/60 border border-slate-800/60 animate-pulse space-y-4 flex flex-col items-center justify-center min-h-[260px]">
            <div className="h-4 bg-slate-800 rounded w-32" />
            <div className="w-36 h-36 rounded-full border-4 border-slate-800 flex items-center justify-center">
              <div className="w-20 h-8 bg-slate-800/80 rounded-lg" />
            </div>
            <div className="h-3 bg-slate-800/50 rounded w-24" />
          </div>

          {/* Metric cards skeleton */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-[#090e1c]/60 border border-slate-800/60 animate-pulse space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-slate-800 rounded w-28" />
                  <div className="h-6 bg-teal-900/30 rounded-lg w-10" />
                </div>
                <div className="h-2 bg-slate-800/80 rounded w-full" />
                <div className="h-3 bg-slate-800/50 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
