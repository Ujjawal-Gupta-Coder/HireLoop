"use client";

import { AlertTriangle, BookmarkCheck, CheckCircle2, ChevronRight, Clock, HelpCircle, Loader, LogOut, PhoneOff, X } from "lucide-react";

type InterviewConfirmModalProps = {
  isOpen: boolean;
  type: "exit" | "end" | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
  answered: number;
  totalQuestions: number;
  timeElapsed: number;
};

export default function InterviewConfirmModal({
  isOpen,
  type,
  onClose,
  onConfirm,
  isProcessing,
  answered,
  totalQuestions,
  timeElapsed,
}: InterviewConfirmModalProps) {
  if (!isOpen || !type) return null;

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const isExit = type === "exit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <div 
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={() => !isProcessing && onClose()}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0c1222] to-[#050814] shadow-2xl shadow-black/80 animate-in zoom-in-95 duration-200 flex flex-col p-6 sm:p-7 space-y-5 text-slate-100">
        
        {/* Close Button */}
        {!isProcessing && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Modal Header & Status Icon */}
        <div className="flex flex-col items-center text-center space-y-3.5 pt-1">
          <div className={`p-4 rounded-2xl border flex items-center justify-center shadow-lg transition-transform duration-300 ${
            isExit 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-500/10" 
              : "bg-red-500/10 border-red-500/30 text-red-400 shadow-red-500/10"
          }`}>
            {isExit ? (
              <LogOut className="h-7 w-7" />
            ) : (
              <PhoneOff className="h-7 w-7" />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {isExit ? "Pause & Exit Interview?" : "End Interview Session?"}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              {isExit 
                ? "Your progress will be saved so you can resume this interview anytime from your dashboard." 
                : "This will permanently complete this interview and generate your performance report."}
            </p>
          </div>
        </div>

        {/* Stats & Session Snapshot */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
              Questions Completed
            </span>
            <span className="font-bold text-white font-mono">
              {answered} <span className="text-slate-500 font-normal">/ {totalQuestions}</span>
            </span>
          </div>

          <div className="flex justify-between items-center text-xs border-t border-slate-900 pt-3">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Elapsed Time
            </span>
            <span className="font-bold text-white font-mono">
              {formatTime(timeElapsed)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs border-t border-slate-900 pt-3">
            <span className="text-slate-400 flex items-center gap-1.5">
              <BookmarkCheck className="w-3.5 h-3.5 text-teal-400" />
              Interview Status
            </span>
            <span className={`font-bold text-xs ${isExit ? "text-amber-400" : "text-red-400"}`}>
              {isExit ? "Will Stay In Progress (Resumable)" : "Will Mark Completed (Final)"}
            </span>
          </div>
        </div>

        {/* Informative / Warning Note */}
        {isExit ? (
          <div className="flex gap-3 p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
            <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Resume Anytime:</strong> All questions and answers recorded so far are securely saved in your account. You can return and continue from where you left off.
            </span>
          </div>
        ) : (
          <div className="flex gap-3 p-3.5 bg-red-500/10 rounded-2xl border border-red-500/20 text-xs text-red-300 leading-relaxed">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <span>
              <strong>Cannot be undone:</strong> Ending now will finalize your session. You will <strong>not</strong> be able to resume this interview room once completed.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 text-xs font-semibold rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 transition-colors border border-slate-800 disabled:opacity-50 cursor-pointer text-center"
          >
            Cancel & Return
          </button>
          
          {isExit ? (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-slate-950 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-amber-500/20 transition-all duration-200 active:scale-95"
            >
              {isProcessing ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Saving & Exiting...</span>
                </>
              ) : (
                <>
                  <span>Save & Exit</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-red-600/30 transition-all duration-200 active:scale-95"
            >
              {isProcessing ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Finishing...</span>
                </>
              ) : (
                <>
                  <span>End Permanently</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
