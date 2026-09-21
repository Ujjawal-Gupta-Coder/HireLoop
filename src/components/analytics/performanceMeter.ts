import { PerformanceLevel } from "./analyticsTypes";

export type PerformanceTierInfo = {
  level: PerformanceLevel;
  rangeLabel: string;
  min: number;
  max: number;
  textColor: string;
  bgColor: string;
  badgeBg: string;
  borderColor: string;
  dotColor: string;
  progressGradient: string;
  glowShadow: string;
  summary: string;
};

export const PERFORMANCE_TIERS: Record<PerformanceLevel, PerformanceTierInfo> = {
  Poor: {
    level: "Poor",
    rangeLabel: "0 - 29",
    min: 0,
    max: 29,
    textColor: "text-rose-400",
    bgColor: "bg-rose-950/40",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    borderColor: "border-rose-500/30",
    dotColor: "bg-rose-500",
    progressGradient: "from-rose-600 to-rose-400",
    glowShadow: "shadow-rose-500/20",
    summary: "Significant foundational practice required.",
  },
  Weak: {
    level: "Weak",
    rangeLabel: "30 - 44",
    min: 30,
    max: 44,
    textColor: "text-amber-400",
    bgColor: "bg-amber-950/40",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    borderColor: "border-amber-500/30",
    dotColor: "bg-amber-500",
    progressGradient: "from-amber-600 to-amber-400",
    glowShadow: "shadow-amber-500/20",
    summary: "Basic familiarity, but lacks consistency and detail.",
  },
  Average: {
    level: "Average",
    rangeLabel: "45 - 69",
    min: 45,
    max: 69,
    textColor: "text-yellow-400",
    bgColor: "bg-yellow-950/40",
    badgeBg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    borderColor: "border-yellow-500/30",
    dotColor: "bg-yellow-500",
    progressGradient: "from-yellow-600 to-yellow-400",
    glowShadow: "shadow-yellow-500/20",
    summary: "Satisfactory responses with room for technical depth.",
  },
  Good: {
    level: "Good",
    rangeLabel: "70 - 84",
    min: 70,
    max: 84,
    textColor: "text-teal-400",
    bgColor: "bg-teal-950/40",
    badgeBg: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    borderColor: "border-teal-500/30",
    dotColor: "bg-teal-400",
    progressGradient: "from-teal-600 to-teal-400",
    glowShadow: "shadow-teal-500/20",
    summary: "Solid competency and structured communication.",
  },
  Excellent: {
    level: "Excellent",
    rangeLabel: "85 - 100",
    min: 85,
    max: 100,
    textColor: "text-emerald-400",
    bgColor: "bg-emerald-950/40",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    borderColor: "border-emerald-500/30",
    dotColor: "bg-emerald-400",
    progressGradient: "from-emerald-500 to-teal-300",
    glowShadow: "shadow-emerald-500/25",
    summary: "Outstanding mastery, articulate delivery, and clear reasoning.",
  },
};

/**
 * 0 - 29 = Poor
 * 30 - 44 = Weak
 * 45 - 69 = Average
 * 70 - 84 = Good
 * 85 - 100 = Excellent
 */
export function getPerformanceLevel(score: number): PerformanceLevel {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  if (s <= 29) return "Poor";
  if (s <= 44) return "Weak";
  if (s <= 69) return "Average";
  if (s <= 84) return "Good";
  return "Excellent";
}

export function getTierInfo(scoreOrLevel: number | PerformanceLevel): PerformanceTierInfo {
  const level = typeof scoreOrLevel === "number" ? getPerformanceLevel(scoreOrLevel) : scoreOrLevel;
  return PERFORMANCE_TIERS[level] || PERFORMANCE_TIERS.Average;
}

export function calculateOverallScore(scores: {
  confidence: number;
  clarity: number;
  relevancy: number;
  depth: number;
  problemSolving: number;
}): number {
  const total =
    scores.confidence +
    scores.clarity +
    scores.relevancy +
    scores.depth +
    scores.problemSolving;
  return Math.max(0, Math.min(100, Math.round(total / 5)));
}

export function calculateCommunicationScore(scores: {
  clarity: number;
  grammar: number;
  vocabulary: number;
  tone: number;
  professionalism: number;
}): number {
  const total =
    scores.clarity +
    scores.grammar +
    scores.vocabulary +
    scores.tone +
    scores.professionalism;
  return Math.max(0, Math.min(100, Math.round(total / 5)));
}

export function getQuestionScoreBadge(scoreOutOf10: number) {
  const s = Math.max(0, Math.min(10, scoreOutOf10));
  if (s >= 8.5) {
    return {
      text: "Excellent",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      pillColor: "bg-emerald-500",
    };
  }
  if (s >= 7) {
    return {
      text: "Good",
      className: "bg-teal-500/10 text-teal-400 border-teal-500/30",
      pillColor: "bg-teal-400",
    };
  }
  if (s >= 4.5) {
    return {
      text: "Average",
      className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      pillColor: "bg-yellow-500",
    };
  }
  if (s >= 3) {
    return {
      text: "Weak",
      className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      pillColor: "bg-amber-500",
    };
  }
  return {
    text: "Poor",
    className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    pillColor: "bg-rose-500",
  };
}
