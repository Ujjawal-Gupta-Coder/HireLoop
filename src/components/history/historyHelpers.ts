import {
  Laptop,
  Code2,
  Users,
  Layers,
  Cpu,
  CheckCircle2,
  Radio,
  Clock,
  Sparkles,
  LucideIcon,
} from "lucide-react";

export type TrackInfo = {
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  bgGradient: string;
};

export const TRACK_MAP: Record<string, TrackInfo> = {
  TECHNICAL_INTERVIEW: {
    label: "Technical Q&A",
    shortLabel: "Technical",
    icon: Laptop,
    badgeColor: "bg-blue-950/40 text-blue-400 border-blue-500/20",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    glowColor: "shadow-blue-500/10",
    bgGradient: "from-blue-950/30 via-slate-900/40 to-slate-950/80",
  },
  CODING_INTERVIEW: {
    label: "Coding Practice",
    shortLabel: "Coding",
    icon: Code2,
    badgeColor: "bg-teal-950/40 text-teal-400 border-teal-500/20",
    textColor: "text-teal-400",
    borderColor: "border-teal-500/20",
    glowColor: "shadow-teal-500/10",
    bgGradient: "from-teal-950/30 via-slate-900/40 to-slate-950/80",
  },
  BEHAVIORAL_INTERVIEW: {
    label: "Behavioral",
    shortLabel: "Behavioral",
    icon: Users,
    badgeColor: "bg-purple-950/40 text-purple-400 border-purple-500/20",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    glowColor: "shadow-purple-500/10",
    bgGradient: "from-purple-950/30 via-slate-900/40 to-slate-950/80",
  },
  SYSTEM_DESIGN_INTERVIEW: {
    label: "System Design",
    shortLabel: "System Design",
    icon: Layers,
    badgeColor: "bg-amber-950/40 text-amber-400 border-amber-500/20",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/20",
    glowColor: "shadow-amber-500/10",
    bgGradient: "from-amber-950/30 via-slate-900/40 to-slate-950/80",
  },
  MIXED_INTERVIEW: {
    label: "Mixed Trial",
    shortLabel: "Mixed",
    icon: Cpu,
    badgeColor: "bg-rose-950/40 text-rose-400 border-rose-500/20",
    textColor: "text-rose-400",
    borderColor: "border-rose-500/20",
    glowColor: "shadow-rose-500/10",
    bgGradient: "from-rose-950/30 via-slate-900/40 to-slate-950/80",
  },
};

export const getTrackInfo = (type: string): TrackInfo => {
  return (
    TRACK_MAP[type] || {
      label: "Interview",
      shortLabel: "Interview",
      icon: Sparkles,
      badgeColor: "bg-teal-950/40 text-teal-400 border-teal-500/20",
      textColor: "text-teal-400",
      borderColor: "border-teal-500/20",
      glowColor: "shadow-teal-500/10",
      bgGradient: "from-teal-950/30 via-slate-900/40 to-slate-950/80",
    }
  );
};

export const DIFFICULTY_MAP: Record<
  string,
  { label: string; badgeColor: string; textColor: string; dotColor: string }
> = {
  EASY: {
    label: "Easy",
    badgeColor: "bg-emerald-950/40 text-emerald-400 border-emerald-500/20",
    textColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
  },
  MEDIUM: {
    label: "Medium",
    badgeColor: "bg-amber-950/40 text-amber-400 border-amber-500/20",
    textColor: "text-amber-400",
    dotColor: "bg-amber-400",
  },
  HARD: {
    label: "Hard",
    badgeColor: "bg-rose-950/40 text-rose-400 border-rose-500/20",
    textColor: "text-rose-400",
    dotColor: "bg-rose-400",
  },
};

export const STATUS_MAP: Record<
  string,
  { label: string; badgeColor: string; icon: LucideIcon; dotColor: string }
> = {
  COMPLETED: {
    label: "Completed",
    badgeColor: "bg-emerald-950/40 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
    dotColor: "bg-emerald-400",
  },
  RUNNING: {
    label: "In Progress",
    badgeColor: "bg-teal-950/40 text-teal-400 border-teal-500/30 animate-pulse",
    icon: Radio,
    dotColor: "bg-teal-400",
  },
  ABANDONED: {
    label: "Abandoned",
    badgeColor: "bg-slate-900/60 text-slate-400 border-slate-700/40",
    icon: Clock,
    dotColor: "bg-slate-400",
  },
};

export function formatDuration(seconds: number = 0): string {
  if (!seconds || seconds <= 0) return "0s";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs > 0 ? `${secs}s` : ""}`.trim();
  }
  return `${secs}s`;
}

export function formatDetailedDuration(seconds: number = 0): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatInterviewDate(isoString: string): string {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatRelativeDate(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) {
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }
  if (diffMins > 0) {
    return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}
