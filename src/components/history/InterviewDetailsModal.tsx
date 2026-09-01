"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  X,
  Clock,
  Coins,
  Bot,
  User,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Calendar,
  FileText,
  HelpCircle,
  StickyNote,
  Target,
  Layers,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { SerializedInterviewHistory } from "./types";
import {
  getTrackInfo,
  DIFFICULTY_MAP,
  STATUS_MAP,
  formatDuration,
  formatInterviewDate,
  formatDetailedDuration,
} from "./historyHelpers";
import { formatIdIntoLabel } from "@/src/helper/helper.common";

type InterviewDetailsModalProps = {
  interview: SerializedInterviewHistory;
  onClose: () => void;
};

export default function InterviewDetailsModal({
  interview,
  onClose,
}: InterviewDetailsModalProps) {
  const [speakerFilter, setSpeakerFilter] = useState<"ALL" | "INTERVIEWER" | "CANDIDATE">("ALL");
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"transcript" | "notes">("transcript");

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
  const roleLabel = formatIdIntoLabel(interview.role);
  const experienceLabel = formatIdIntoLabel(interview.experience);
  const sessionTypeLabel = formatIdIntoLabel(interview.sessionType);

  const conversations = useMemo(() => {
    return interview.conversations || [];
  }, [interview.conversations]);

  const filteredConversations = useMemo(() => {
    if (speakerFilter === "ALL") return conversations;
    return conversations.filter((c) => c.speaker === speakerFilter);
  }, [conversations, speakerFilter]);

  const interviewerCount = useMemo(
    () => conversations.filter((c) => c.speaker === "INTERVIEWER").length,
    [conversations]
  );
  const candidateCount = useMemo(
    () => conversations.filter((c) => c.speaker === "CANDIDATE").length,
    [conversations]
  );

  // Format message time
  const formatMsgTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Copy transcript to clipboard
  const handleCopyTranscript = async () => {
    try {
      if (!conversations || conversations.length === 0) {
        toast.error("No transcript available to copy");
        return;
      }

      const text = conversations
        .map((c) => {
          const speaker = c.speaker === "INTERVIEWER" ? "AI Interviewer" : "Candidate";
          const qNum = c.questionNumber ? ` [Question ${c.questionNumber}]` : "";
          const time = formatMsgTime(c.createdAt);
          return `[${time}] ${speaker}${qNum}:\n${c.message}\n`;
        })
        .join("\n---\n\n");

      const header = `HireLoop AI Interview Session\nRole: ${roleLabel}\nTrack: ${track.label}\nExperience: ${experienceLabel}\nDifficulty: ${difficulty.label}\nDate: ${formatInterviewDate(
        interview.createdAt
      )}\nDuration: ${formatDuration(interview.timeElapsed)}\nStatus: ${status.label}\n\n==================== TRANSCRIPT ====================\n\n`;

      await navigator.clipboard.writeText(header + text);
      setCopied(true);
      toast.success("Transcript copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error("Failed to copy transcript");
      console.error("Copy error:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#090e1a] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-slate-800/80 bg-slate-950/40">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Track Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${track.badgeColor}`}
              >
                <TrackIcon className="h-3.5 w-3.5" />
                <span>{track.label}</span>
              </span>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.badgeColor}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                <span>{status.label}</span>
              </span>

              {/* Difficulty */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${difficulty.badgeColor}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${difficulty.dotColor}`} />
                <span>{difficulty.label}</span>
              </span>

              {/* Experience */}
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800">
                {experienceLabel}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
              {roleLabel} Session Review
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0"
            title="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 no-scrollbar">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Date Recorded
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 block">
                {formatInterviewDate(interview.createdAt)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Duration Elapsed
              </span>
              <span className="text-xs sm:text-sm font-bold text-teal-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatDetailedDuration(interview.timeElapsed)} ({formatDuration(interview.timeElapsed)})
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Questions Answered
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 block">
                {interview.answered} of {interview.totalQuestions} ({sessionTypeLabel})
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Credits Used
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5" />
                {interview.creditsUsed} Credits
              </span>
            </div>
          </div>

          {/* Assessed Skills Cloud */}
          {interview.skills && interview.skills.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Evaluated Skills & Topics
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {interview.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-teal-950/40 text-teal-300 border border-teal-500/20 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Context / Focus Areas (If set) */}
          {interview.context && interview.context.trim() && (
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
                <Target className="h-3.5 w-3.5" />
                <span>Custom Target Focus</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "{interview.context}"
              </p>
            </div>
          )}

          {/* Candidate Notes (If any) */}
          {interview.notes && interview.notes.trim() && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <StickyNote className="h-3.5 w-3.5" />
                <span>Candidate Session Notes</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {interview.notes}
              </p>
            </div>
          )}

          {/* Transcript Section */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-teal-400" />
                <h3 className="text-sm sm:text-base font-bold text-slate-100 font-display">
                  Interview Transcript ({conversations.length} Exchanges)
                </h3>
              </div>

              {/* Speaker Filters & Copy Button */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                  <button
                    onClick={() => setSpeakerFilter("ALL")}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      speakerFilter === "ALL"
                        ? "bg-teal-500/20 text-teal-300"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All ({conversations.length})
                  </button>
                  <button
                    onClick={() => setSpeakerFilter("INTERVIEWER")}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      speakerFilter === "INTERVIEWER"
                        ? "bg-teal-500/20 text-teal-300"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Interviewer ({interviewerCount})
                  </button>
                  <button
                    onClick={() => setSpeakerFilter("CANDIDATE")}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      speakerFilter === "CANDIDATE"
                        ? "bg-teal-500/20 text-teal-300"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Candidate ({candidateCount})
                  </button>
                </div>

                <button
                  onClick={handleCopyTranscript}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-teal-300 transition-all cursor-pointer"
                  title="Copy full transcript to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Transcript</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Conversation Feed */}
            {filteredConversations.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-xl bg-slate-900/30 border border-slate-800/60">
                <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-400">
                  {conversations.length === 0
                    ? "No audio conversations recorded for this session."
                    : "No messages match the current speaker filter."}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {conversations.length === 0
                    ? "The session might have been concluded before voice exchanges occurred."
                    : "Try switching to 'All' to view the entire transcript."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConversations.map((msg, idx) => {
                  const isInterviewer = msg.speaker === "INTERVIEWER";
                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex gap-3 sm:gap-4 ${
                        isInterviewer ? "justify-start" : "justify-end"
                      }`}
                    >
                      {/* Interviewer Avatar */}
                      {isInterviewer && (
                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-teal-950/60 border border-teal-500/30 text-teal-400 shadow-inner">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-1.5 shadow-md ${
                          isInterviewer
                            ? "bg-[#0f172a]/90 border border-teal-500/20 text-slate-200 rounded-tl-sm"
                            : "bg-teal-950/30 border border-indigo-500/30 text-slate-100 rounded-tr-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[11px] pb-1 border-b border-slate-800/60">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                isInterviewer ? "text-teal-400" : "text-indigo-300"
                              }`}
                            >
                              {isInterviewer ? "AI Interviewer" : "You (Candidate)"}
                            </span>
                            {msg.questionNumber && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
                                Question {msg.questionNumber}
                              </span>
                            )}
                          </div>
                          <span className="text-slate-500 font-medium">
                            {formatMsgTime(msg.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap pt-0.5">
                          {msg.message}
                        </p>
                      </div>

                      {/* Candidate Avatar */}
                      {!isInterviewer && (
                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 shadow-inner">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-xl transition-all cursor-pointer"
          >
            Close Window
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {interview.status === "RUNNING" && (
              <Link
                href={`/interview-room/${interview.id}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all cursor-pointer shadow-lg shadow-teal-500/10"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Resume Session</span>
              </Link>
            )}

            <Link
              href="/interview"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl text-teal-400 bg-teal-950/40 border border-teal-500/30 hover:bg-teal-400 hover:text-slate-950 hover:border-transparent transition-all cursor-pointer shadow-sm group"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Practice Similar</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
