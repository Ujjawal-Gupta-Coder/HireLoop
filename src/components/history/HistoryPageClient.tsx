"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Video,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
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
import NoHistoryFound from "./NoHistoryFound";
import { getTrackInfo } from "./historyHelpers";
import { formatIdIntoLabel } from "@/src/helper/helper.common";

type HistoryPageClientProps = {
  initialInterviews: SerializedInterviewHistory[];
};

const INITIAL_BATCH_SIZE = 8;
const BATCH_LOAD_SIZE = 6;

export default function HistoryPageClient({
  initialInterviews: interviews,
}: HistoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");
  const [trackFilter, setTrackFilter] = useState<TrackFilterType>("ALL");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilterType>("ALL");
  const [sortOption, setSortOption] = useState<SortOptionType>("NEWEST");
  const [viewMode, setViewMode] = useState<ViewModeType>("grid");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  // Modals state
  const [selectedInterviewForDetails, setSelectedInterviewForDetails] =
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

  // Sliced interviews for infinite scrolling
  const visibleInterviews = useMemo(() => {
    return filteredAndSortedInterviews.slice(0, visibleCount);
  }, [filteredAndSortedInterviews, visibleCount]);

  const hasMore = visibleCount < filteredAndSortedInterviews.length;

  // Reset visibleCount when filters change
  const handleFilterReset = () => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    handleFilterReset();
  };

  const handleStatusChange = (st: StatusFilterType) => {
    setStatusFilter(st);
    handleFilterReset();
  };

  const handleTrackChange = (tr: TrackFilterType) => {
    setTrackFilter(tr);
    handleFilterReset();
  };

  const handleDifficultyChange = (diff: DifficultyFilterType) => {
    setDifficultyFilter(diff);
    handleFilterReset();
  };

  const handleSortChange = (so: SortOptionType) => {
    setSortOption(so);
    handleFilterReset();
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setTrackFilter("ALL");
    setDifficultyFilter("ALL");
    setSortOption("NEWEST");
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  // IntersectionObserver for infinite scrolling
  useEffect(() => {
    const observerTarget = observerTargetRef.current;
    if (!observerTarget || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + BATCH_LOAD_SIZE);
            setIsLoadingMore(false);
          }, 250);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "150px",
      }
    );

    observer.observe(observerTarget);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore]);

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
            Review your past AI interview sessions, analyze audio transcripts, resume ongoing evaluations, and click on any card to explore comprehensive analytics.
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
              {visibleInterviews.map((interview) => (
                <HistoryCard
                  key={interview.id}
                  interview={interview}
                  onViewDetails={setSelectedInterviewForDetails}
                />
              ))}
            </div>
          ) : (
            <HistoryTable
              interviews={visibleInterviews}
              onViewDetails={setSelectedInterviewForDetails}
            />
          )}

          {/* Infinite Scroll Sentinel & Status Indicators */}
          <div
            ref={observerTargetRef}
            className="flex flex-col items-center justify-center pt-6 pb-2 text-center"
          >
            {hasMore ? (
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-semibold text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
                <span>Loading more sessions...</span>
              </div>
            ) : filteredAndSortedInterviews.length > 0 ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500/80" />
                <span>
                  All <strong className="text-slate-400">{filteredAndSortedInterviews.length}</strong> sessions loaded • Tap any session to explore deep analysis
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Details & Transcript Modal */}
      {selectedInterviewForDetails && (
        <InterviewDetailsModal
          interview={selectedInterviewForDetails}
          onClose={() => setSelectedInterviewForDetails(null)}
        />
      )}
    </main>
  );
}
