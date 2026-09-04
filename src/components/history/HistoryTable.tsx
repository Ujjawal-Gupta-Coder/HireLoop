"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Play,
  FileText,
  MoreVertical,
  Trash2,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Coins,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SerializedInterviewHistory } from "./types";
import {
  getTrackInfo,
  DIFFICULTY_MAP,
  STATUS_MAP,
  formatDuration,
  formatInterviewDate,
} from "./historyHelpers";
import { formatIdIntoLabel } from "@/src/helper/helper.common";

type HistoryTableProps = {
  interviews: SerializedInterviewHistory[];
  onViewDetails: (interview: SerializedInterviewHistory) => void;
};

export default function HistoryTable({
  interviews,
  onViewDetails,
}: HistoryTableProps) {
  const router = useRouter();

  const columns = [
    "Date & Time",
    "Role & Track",
    "Experience & Level",
    "Questions Progress",
    "Duration",
    "Status",
    "Actions",
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0c1120]/70 backdrop-blur-md shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/50 text-slate-400 font-semibold text-xs tracking-wider uppercase">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-4 px-5 ${idx === columns.length - 1 ? "text-right" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {interviews.map((interview) => {
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

              const TrackIcon = track.icon;
              const StatusIcon = status.icon;
              const roleLabel = formatIdIntoLabel(interview.role);
              const experienceLabel = formatIdIntoLabel(interview.experience);

              const totalQuestions = Math.max(1, interview.totalQuestions || 1);
              const answered = Math.min(interview.answered || 0, totalQuestions);
              const progressPercent = Math.min(
                100,
                Math.round((answered / totalQuestions) * 100)
              );

              return (
                <tr
                  key={interview.id}
                  onClick={() => router.push(`/analytics/${interview.id}`)}
                  className="hover:bg-slate-900/60 transition-colors group/row cursor-pointer"
                >
                  {/* Date & Time */}
                  <td className="py-4 px-5 font-medium text-slate-300 whitespace-nowrap text-xs sm:text-sm">
                    {formatInterviewDate(interview.createdAt)}
                  </td>

                  {/* Role & Track */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border ${track.borderColor} shrink-0 group-hover/row:scale-105 transition-transform`}
                      >
                        <TrackIcon className={`h-4 w-4 ${track.textColor}`} />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200 block text-sm group-hover/row:text-teal-300 transition-colors">
                          {roleLabel}
                        </span>
                        <span
                          className={`inline-block text-[10px] font-semibold ${track.textColor}`}
                        >
                          {track.label}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Experience & Difficulty */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-800">
                        {experienceLabel}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${difficulty.badgeColor}`}
                      >
                        {difficulty.label}
                      </span>
                    </div>
                  </td>

                  {/* Progress & Questions */}
                  <td className="py-4 px-5">
                    <div className="w-36 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">
                          {answered} / {interview.totalQuestions}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-900 border border-slate-800/80 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            interview.status === "COMPLETED"
                              ? "bg-gradient-to-r from-teal-500 to-emerald-400"
                              : interview.status === "RUNNING"
                              ? "bg-gradient-to-r from-teal-500 to-cyan-400"
                              : "bg-slate-600"
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Duration & Credits */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-200">
                        <Clock className="h-3 w-3 text-teal-400" />
                        {formatDuration(interview.timeElapsed)}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Coins className="h-2.5 w-2.5 text-amber-400" />
                        {interview.creditsUsed} Credits
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.badgeColor}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td
                    className="py-4 px-5 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      {interview.status === "RUNNING" ? (
                        <Link
                          href={`/interview-room/${interview.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all cursor-pointer shadow-sm"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>Resume</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/analytics/${interview.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all cursor-pointer shadow-sm group/btn"
                        >
                          <BarChart3 className="h-3 w-3" />
                          <span>Analytics</span>
                          <ArrowUpRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                      )}

                      {/* Dropdown Options */}
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer outline-none"
                            title="More options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="z-50 min-w-[180px] overflow-hidden rounded-xl bg-[#0d1322] border border-slate-800/90 p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in-80"
                            sideOffset={5}
                            align="end"
                          >
                            <DropdownMenu.Item asChild>
                              <Link
                                href={`/analytics/${interview.id}`}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-teal-400 rounded-lg hover:bg-teal-950/40 cursor-pointer outline-none transition-colors"
                              >
                                <BarChart3 className="h-3.5 w-3.5" />
                                <span>View Analytics</span>
                              </Link>
                            </DropdownMenu.Item>

                            <DropdownMenu.Item
                              onClick={() => onViewDetails(interview)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 rounded-lg hover:bg-slate-800/60 cursor-pointer outline-none transition-colors"
                            >
                              <FileText className="h-3.5 w-3.5 text-slate-400" />
                              <span>Transcript Preview</span>
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

                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

