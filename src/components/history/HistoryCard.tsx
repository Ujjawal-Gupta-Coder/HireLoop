"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Clock,
  Sparkles,
  Play,
  FileText,
  MoreVertical,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  Coins,
  ChevronRight,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SerializedInterviewHistory } from "./types";
import {
  getTrackInfo,
  DIFFICULTY_MAP,
  STATUS_MAP,
  formatDuration,
  formatRelativeDate,
  formatInterviewDate,
} from "./historyHelpers";
import { formatIdIntoLabel } from "@/src/helper/helper.common";

type HistoryCardProps = {
  interview: SerializedInterviewHistory;
  onViewDetails: (interview: SerializedInterviewHistory) => void;
  onDeleteRequest: (interview: SerializedInterviewHistory) => void;
};

export default function HistoryCard({
  interview,
  onViewDetails,
  onDeleteRequest,
}: HistoryCardProps) {
  const track = getTrackInfo(interview.type);
  const difficulty = DIFFICULTY_MAP[interview.difficulty] || {
    label: interview.difficulty,
    badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
    textColor: "text-slate-300",
    dotColor: "bg-slate-400",
  };
  const status = STATUS_MAP[interview.status] || {
    label: interview.status,
    badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
    icon: Clock,
    dotColor: "bg-slate-400",
  };

  const StatusIcon = status.icon;
  const TrackIcon = track.icon;

  const totalQuestions = Math.max(1, interview.totalQuestions || 1);
  const answered = Math.min(interview.answered || 0, totalQuestions);
  const progressPercent = Math.min(100, Math.round((answered / totalQuestions) * 100));

  const roleLabel = formatIdIntoLabel(interview.role);
  const experienceLabel = formatIdIntoLabel(interview.experience);
  const sessionTypeLabel = formatIdIntoLabel(interview.sessionType);

  const displayedSkills = interview.skills?.slice(0, 3) || [];
  const extraSkillsCount = (interview.skills?.length || 0) - displayedSkills.length;

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e1424]/90 via-[#0a0f1d]/95 to-[#060a14] border border-slate-800/80 hover:border-teal-500/40 p-5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-teal-950/20 group hover:-translate-y-1`}
    >
      {/* Dynamic Glow Behind Track Icon */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-colors duration-500`}
      />

      {/* Top Header Row: Track Badge, Status Badge & Dropdown */}
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Track Badge & Icon */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900/90 border ${track.borderColor} shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-200`}
          >
            <TrackIcon className={`h-5 w-5 ${track.textColor}`} />
          </div>
          <div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${track.badgeColor}`}
            >
              {track.shortLabel}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatRelativeDate(interview.createdAt)}</span>
            </p>
          </div>
        </div>

        {/* Right Header: Status & Menu */}
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.badgeColor}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            <span>{status.label}</span>
          </span>

          {/* Radix Dropdown Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer outline-none"
                title="Options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-[170px] overflow-hidden rounded-xl bg-[#0d1322] border border-slate-800/90 p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in-80"
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Item
                  onClick={() => onViewDetails(interview)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 rounded-lg hover:bg-teal-950/40 hover:text-teal-300 cursor-pointer outline-none transition-colors"
                >
                  <FileText className="h-3.5 w-3.5 text-teal-400" />
                  <span>View Details & Transcript</span>
                </DropdownMenu.Item>

                {interview.status === "RUNNING" && (
                  <DropdownMenu.Item asChild>
                    <Link
                      href={`/interview-room/${interview.id}`}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-emerald-300 rounded-lg hover:bg-emerald-950/40 cursor-pointer outline-none transition-colors"
                    >
                      <Play className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Resume Session</span>
                    </Link>
                  </DropdownMenu.Item>
                )}

                <DropdownMenu.Item asChild>
                  <Link
                    href="/interview"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 rounded-lg hover:bg-slate-800/60 cursor-pointer outline-none transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-blue-400" />
                    <span>Practice New Session</span>
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-px bg-slate-800/80 my-1" />

                <DropdownMenu.Item
                  onClick={() => onDeleteRequest(interview)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 rounded-lg hover:bg-rose-950/40 cursor-pointer outline-none transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                  <span>Delete Session</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Main Body: Role Title & Parameter Tags */}
      <div className="space-y-3 flex-1">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-teal-300 transition-colors tracking-tight line-clamp-1 font-display">
            {roleLabel}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {/* Experience Badge */}
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-900/80 text-slate-300 border border-slate-800">
              {experienceLabel}
            </span>

            {/* Difficulty Badge */}
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${difficulty.badgeColor} flex items-center gap-1`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${difficulty.dotColor}`} />
              {difficulty.label}
            </span>

            {/* Session Type */}
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900/60 text-slate-400 border border-slate-800/80">
              {sessionTypeLabel}
            </span>
          </div>
        </div>

        {/* Skill Chips */}
        {displayedSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {displayedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-teal-950/30 text-teal-300/90 border border-teal-500/15"
              >
                {skill}
              </span>
            ))}
            {extraSkillsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700/50">
                +{extraSkillsCount}
              </span>
            )}
          </div>
        )}

        {/* Progress Bar & Questions Counter */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Questions Progress</span>
            <span className="font-semibold text-slate-200">
              {answered} / {interview.totalQuestions} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900/90 border border-slate-800/80 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                interview.status === "COMPLETED"
                  ? "bg-gradient-to-r from-teal-500 to-emerald-400"
                  : interview.status === "RUNNING"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-400 animate-pulse"
                  : "bg-slate-600"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Metrics Row & Action Buttons */}
      <div className="pt-4 mt-4 border-t border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-slate-300 font-semibold" title="Time elapsed">
            <Clock className="h-3.5 w-3.5 text-teal-400" />
            <span>{formatDuration(interview.timeElapsed)}</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1 text-slate-400" title="Credits used">
            <Coins className="h-3.5 w-3.5 text-amber-400" />
            <span>{interview.creditsUsed} Credits</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {interview.status === "RUNNING" ? (
            <Link
              href={`/interview-room/${interview.id}`}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all duration-200 shadow-md shadow-teal-500/10 cursor-pointer group/btn"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Resume</span>
            </Link>
          ) : (
            <button
              onClick={() => onViewDetails(interview)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl text-teal-400 bg-teal-950/40 border border-teal-500/25 hover:bg-teal-400 hover:text-slate-950 hover:border-transparent transition-all duration-200 cursor-pointer shadow-sm group/btn"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Transcript</span>
              <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
