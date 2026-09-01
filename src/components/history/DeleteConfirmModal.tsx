"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { SerializedInterviewHistory } from "./types";
import { formatInterviewDate, getTrackInfo } from "./historyHelpers";
import { formatIdIntoLabel } from "@/src/helper/helper.common";

type DeleteConfirmModalProps = {
  interview: SerializedInterviewHistory;
  onClose: () => void;
  onConfirmDelete: (interviewId: string) => Promise<void>;
};

export default function DeleteConfirmModal({
  interview,
  onClose,
  onConfirmDelete,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const track = getTrackInfo(interview.type);
  const roleLabel = formatIdIntoLabel(interview.role);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirmDelete(interview.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#0d1222] border border-rose-500/20 shadow-2xl p-6 space-y-5">
        {/* Header with icon & close */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-400 shadow-inner">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-display">
                Delete Interview Session?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Session details card */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Target Role:</span>
            <span className="font-semibold text-slate-200">{roleLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Track:</span>
            <span className="font-semibold text-slate-200">{track.label}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Recorded Date:</span>
            <span className="font-semibold text-slate-300">
              {formatInterviewDate(interview.createdAt)}
            </span>
          </div>
        </div>

        {/* Warning text */}
        <p className="text-xs text-rose-300/90 leading-relaxed bg-rose-950/20 border border-rose-500/20 rounded-xl p-3">
          Deleting this session will permanently remove all related Q&A audio transcripts, candidate notes, and analytics from your account.
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-600/20 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
