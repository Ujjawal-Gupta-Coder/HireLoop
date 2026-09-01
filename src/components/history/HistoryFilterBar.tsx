"use client";

import {
  Search,
  X,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  Laptop,
  Code2,
  Users,
  Layers,
  Cpu,
  Sparkles,
} from "lucide-react";
import {
  StatusFilterType,
  TrackFilterType,
  DifficultyFilterType,
  SortOptionType,
  ViewModeType,
} from "./types";

type HistoryFilterBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: StatusFilterType;
  setStatusFilter: (status: StatusFilterType) => void;
  trackFilter: TrackFilterType;
  setTrackFilter: (track: TrackFilterType) => void;
  difficultyFilter: DifficultyFilterType;
  setDifficultyFilter: (diff: DifficultyFilterType) => void;
  sortOption: SortOptionType;
  setSortOption: (sort: SortOptionType) => void;
  viewMode: ViewModeType;
  setViewMode: (mode: ViewModeType) => void;
  statusCounts: {
    ALL: number;
    COMPLETED: number;
    RUNNING: number;
    ABANDONED: number;
  };
  totalFilteredCount: number;
};

export default function HistoryFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  trackFilter,
  setTrackFilter,
  difficultyFilter,
  setDifficultyFilter,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  statusCounts,
  totalFilteredCount,
}: HistoryFilterBarProps) {
  const statusOptions: { id: StatusFilterType; label: string; count: number }[] = [
    { id: "ALL", label: "All Sessions", count: statusCounts.ALL },
    { id: "COMPLETED", label: "Completed", count: statusCounts.COMPLETED },
    { id: "RUNNING", label: "In Progress", count: statusCounts.RUNNING },
    { id: "ABANDONED", label: "Abandoned", count: statusCounts.ABANDONED },
  ];

  const trackOptions: { id: TrackFilterType; label: string }[] = [
    { id: "ALL", label: "All Tracks" },
    { id: "TECHNICAL_INTERVIEW", label: "Technical Q&A" },
    { id: "CODING_INTERVIEW", label: "Coding Practice" },
    { id: "BEHAVIORAL_INTERVIEW", label: "Behavioral" },
    { id: "SYSTEM_DESIGN_INTERVIEW", label: "System Design" },
    { id: "MIXED_INTERVIEW", label: "Mixed Trial" },
  ];

  const difficultyOptions: { id: DifficultyFilterType; label: string }[] = [
    { id: "ALL", label: "All Difficulties" },
    { id: "EASY", label: "Easy" },
    { id: "MEDIUM", label: "Medium" },
    { id: "HARD", label: "Hard" },
  ];

  const sortOptions: { id: SortOptionType; label: string }[] = [
    { id: "NEWEST", label: "Newest First" },
    { id: "OLDEST", label: "Oldest First" },
    { id: "LONGEST_DURATION", label: "Longest Duration" },
    { id: "MOST_QUESTIONS", label: "Most Questions" },
  ];

  const isAnyFilterActive =
    searchQuery.trim() !== "" ||
    statusFilter !== "ALL" ||
    trackFilter !== "ALL" ||
    difficultyFilter !== "ALL";

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setTrackFilter("ALL");
    setDifficultyFilter("ALL");
  };

  return (
    <div className="space-y-4">
      {/* Top Row: Search & Dropdown Filters & View Switcher */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search by role, skill (e.g. React, SQL), or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-[#0b101e]/80 border border-slate-800/90 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Track Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value as TrackFilterType)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-[#0b101e]/80 border border-slate-800/90 rounded-xl text-xs font-semibold text-slate-300 hover:border-slate-700 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all cursor-pointer shadow-inner pr-8 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px_9px] bg-[right_12px_center] bg-no-repeat"
            >
              {trackOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-[#0b101e] text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilterType)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-[#0b101e]/80 border border-slate-800/90 rounded-xl text-xs font-semibold text-slate-300 hover:border-slate-700 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all cursor-pointer shadow-inner pr-8 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px_9px] bg-[right_12px_center] bg-no-repeat"
            >
              {difficultyOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-[#0b101e] text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOptionType)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-[#0b101e]/80 border border-slate-800/90 rounded-xl text-xs font-semibold text-slate-300 hover:border-slate-700 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all cursor-pointer shadow-inner pr-8 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px_9px] bg-[right_12px_center] bg-no-repeat"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-[#0b101e] text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Switcher (Grid / Table) */}
          <div className="flex items-center bg-[#0b101e]/80 border border-slate-800/90 rounded-xl p-1 shadow-inner shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Status Filter Tabs & Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-900/60">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {statusOptions.map((opt) => {
            const isActive = statusFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setStatusFilter(opt.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-teal-500/20 border border-teal-500/40 text-teal-300 shadow-sm"
                    : "bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    isActive
                      ? "bg-teal-400/20 text-teal-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Counter & Clear filter action */}
        <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
          <span>
            Showing <strong className="text-slate-200">{totalFilteredCount}</strong> session
            {totalFilteredCount === 1 ? "" : "s"}
          </span>
          {isAnyFilterActive && (
            <button
              onClick={clearAllFilters}
              className="text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
