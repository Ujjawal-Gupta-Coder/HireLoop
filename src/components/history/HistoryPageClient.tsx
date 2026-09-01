"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Video,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GalleryHorizontalEnd,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  SerializedInterviewHistory,
  StatusFilterType,
  TrackFilterType,
  DifficultyFilterType,
  SortOptionType,
  ViewModeType,
  HistoryStats,
} from "./types";
import HistoryStatsCards from "./HistoryStatsCards";
import HistoryFilterBar from "./HistoryFilterBar";
import HistoryCard from "./HistoryCard";
import HistoryTable from "./HistoryTable";
import InterviewDetailsModal from "./InterviewDetailsModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import NoHistoryFound from "./NoHistoryFound";
import { deleteInterviewSession } from "@/src/actions/interview";
import { getTrackInfo } from "./historyHelpers";
import { formatIdIntoLabel } from "@/src/helper/helper.common";

type HistoryPageClientProps = {
  initialInterviews: SerializedInterviewHistory[];
};

const ITEMS_PER_PAGE = 6;

export default function HistoryPageClient({
  initialInterviews,
}: HistoryPageClientProps) {
  const [interviews, setInterviews] =
    useState<SerializedInterviewHistory[]>(initialInterviews);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");
  const [trackFilter, setTrackFilter] = useState<TrackFilterType>("ALL");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilterType>("ALL");
  const [sortOption, setSortOption] = useState<SortOptionType>("NEWEST");
  const [viewMode, setViewMode] = useState<ViewModeType>("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals state
  const [selectedInterviewForDetails, setSelectedInterviewForDetails] =
    useState<SerializedInterviewHistory | null>(null);
  const [interviewToDelete, setInterviewToDelete] =
    useState<SerializedInterviewHistory | null>(null);

  // Dynamic Telemetry Statistics based on all interviews
  const stats: HistoryStats = useMemo(() => {
    const total = interviews.length;
    const completed = interviews.filter((i) => i.status === "COMPLETED").length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalTime = interviews.reduce((acc, curr) => acc + (curr.timeElapsed || 0), 0);
    const totalAnswered = interviews.reduce((acc, curr) => acc + (curr.answered || 0), 0);

    return {
      totalInterviews: total,
      completedInterviews: completed,
      completionRate: rate,
      totalTimeElapsed: totalTime,
      totalQuestionsAnswered: totalAnswered,
    };
  }, [interviews]);

  // Status Counts for filter tabs
  const statusCounts = useMemo(() => {
    return {
      ALL: interviews.length,
      COMPLETED: interviews.filter((i) => i.status === "COMPLETED").length,
      RUNNING: interviews.filter((i) => i.status === "RUNNING").length,
      ABANDONED: interviews.filter((i) => i.status === "ABANDONED").length,
    };
  }, [interviews]);

  // Filter & Sort Pipeline
  const filteredAndSortedInterviews = useMemo(() => {
    return interviews
      .filter((item) => {
        // 1. Status Filter
        if (statusFilter !== "ALL" && item.status !== statusFilter) {
          return false;
        }

        // 2. Track Filter
        if (trackFilter !== "ALL" && item.type !== trackFilter) {
          return false;
        }

        // 3. Difficulty Filter
        if (difficultyFilter !== "ALL" && item.difficulty !== difficultyFilter) {
          return false;
        }

        // 4. Search Query Match
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const roleLabel = formatIdIntoLabel(item.role).toLowerCase();
          const trackInfo = getTrackInfo(item.type);
          const trackLabel = trackInfo.label.toLowerCase();
          const skillsMatch = item.skills?.some((s) => s.toLowerCase().includes(query));
          const contextMatch = item.context?.toLowerCase().includes(query);
          const notesMatch = item.notes?.toLowerCase().includes(query);

          if (
            !roleLabel.includes(query) &&
            !trackLabel.includes(query) &&
            !skillsMatch &&
            !contextMatch &&
            !notesMatch
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "NEWEST":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "OLDEST":
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case "LONGEST_DURATION":
            return (b.timeElapsed || 0) - (a.timeElapsed || 0);
          case "MOST_QUESTIONS":
            return (b.answered || 0) - (a.answered || 0);
          default:
            return 0;
        }
      });
  }, [
    interviews,
    statusFilter,
    trackFilter,
    difficultyFilter,
    searchQuery,
    sortOption,
  ]);

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedInterviews.length / ITEMS_PER_PAGE)
  );
  const paginatedInterviews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedInterviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedInterviews, currentPage]);

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    handleFilterChange();
  };

  const handleStatusChange = (st: StatusFilterType) => {
    setStatusFilter(st);
    handleFilterChange();
  };

  const handleTrackChange = (tr: TrackFilterType) => {
    setTrackFilter(tr);
    handleFilterChange();
  };

  const handleDifficultyChange = (diff: DifficultyFilterType) => {
    setDifficultyFilter(diff);
    handleFilterChange();
  };

  const handleSortChange = (so: SortOptionType) => {
    setSortOption(so);
    handleFilterChange();
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setTrackFilter("ALL");
    setDifficultyFilter("ALL");
    setSortOption("NEWEST");
    setCurrentPage(1);
  };

  // Delete Action
  const handleConfirmDelete = async (interviewId: string) => {
    try {
      const res = await deleteInterviewSession(interviewId);
      if (!res.success) {
        toast.error(res.error || "Failed to delete interview session");
        return;
      }

      setInterviews((prev) => prev.filter((item) => item.id !== interviewId));
      if (selectedInterviewForDetails?.id === interviewId) {
        setSelectedInterviewForDetails(null);
      }
      setInterviewToDelete(null);
      toast.success("Interview session deleted successfully");
    } catch (err) {
      toast.error("Failed to delete interview session");
      console.error("Delete session error:", err);
    }
  };

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-8 relative pb-24">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-40 left-10 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Page Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs tracking-wider uppercase mb-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interview Telemetry & Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 font-display">
            Interview History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed max-w-2xl">
            Review your past AI interview sessions, analyze audio transcripts, resume ongoing evaluations, and track your practice progress over time.
          </p>
        </div>

        <Link
          href="/interview"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 hover:scale-[1.02] shadow-lg shadow-teal-500/15 transition-all duration-200 cursor-pointer self-start sm:self-auto group shrink-0"
        >
          <Video className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span>New AI Interview</span>
        </Link>
      </div>

      {/* Telemetry Stats Cards */}
      <HistoryStatsCards stats={stats} />

      {/* Filters, Search, and View Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#090e1c]/80 border border-slate-800/80 shadow-xl backdrop-blur-md">
        <HistoryFilterBar
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusChange}
          trackFilter={trackFilter}
          setTrackFilter={handleTrackChange}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={handleDifficultyChange}
          sortOption={sortOption}
          setSortOption={handleSortChange}
          viewMode={viewMode}
          setViewMode={setViewMode}
          statusCounts={statusCounts}
          totalFilteredCount={filteredAndSortedInterviews.length}
        />
      </div>

      {/* Interview List / Cards / Empty States */}
      {filteredAndSortedInterviews.length === 0 ? (
        <NoHistoryFound
          isFiltered={interviews.length > 0}
          onClearFilters={handleClearAllFilters}
        />
      ) : (
        <div className="space-y-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedInterviews.map((interview) => (
                <HistoryCard
                  key={interview.id}
                  interview={interview}
                  onViewDetails={setSelectedInterviewForDetails}
                  onDeleteRequest={setInterviewToDelete}
                />
              ))}
            </div>
          ) : (
            <HistoryTable
              interviews={paginatedInterviews}
              onViewDetails={setSelectedInterviewForDetails}
              onDeleteRequest={setInterviewToDelete}
            />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">
                Page <strong className="text-slate-200">{currentPage}</strong> of{" "}
                <strong className="text-slate-200">{totalPages}</strong> (
                {filteredAndSortedInterviews.length} total sessions)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                        : "bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details & Transcript Modal */}
      {selectedInterviewForDetails && (
        <InterviewDetailsModal
          interview={selectedInterviewForDetails}
          onClose={() => setSelectedInterviewForDetails(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {interviewToDelete && (
        <DeleteConfirmModal
          interview={interviewToDelete}
          onClose={() => setInterviewToDelete(null)}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </main>
  );
}
