"use client";

import { Gauge, Plus, Tags, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

type DifficultyAndSkillsProps = {
  order:number;
  difficulty: string;
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
  selectedSkills: string[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>;
};

const DifficultyAndSkills = ({
  order,
  difficulty,
  setDifficulty,
  selectedSkills,
  setSelectedSkills,
}: DifficultyAndSkillsProps) => {
  const [customSkill, setCustomSkill] = useState<string>("");

  // Toggle skills with 1-5 validation limits
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length <= 1) {
        toast.error("Minimum 1 skill is required");
        return;
      }
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      if (selectedSkills.length >= 5) {
        toast.error("Maximum 5 skills allowed");
        return;
      }
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Add custom skill with 1-5 validation limits
  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkill = customSkill.trim();
    if (!cleanSkill) return;
    if (selectedSkills.length >= 5) {
      toast.error("Maximum 5 skills allowed");
      return;
    }
    if (selectedSkills.includes(cleanSkill)) {
      toast.error("Skill already selected");
      setCustomSkill("");
      return;
    }

    if(cleanSkill.length > 40) {
      toast.error("Skill name must be 40 characters or less");
      return;
    }

    setSelectedSkills([...selectedSkills, cleanSkill]);
    setCustomSkill("");
  };

  // Delete skill tag
  const removeSkill = (skillToRemove: string) => {
    if (selectedSkills.length <= 1) {
      toast.error("Minimum 1 skill is required");
      return;
    }
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove));
  };

  //Pre-defined Popular Skills Cloud
  const popularSkills = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "Go",
    "Java",
    "C++",
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
    "System Design",
    "Tailwind CSS",
    "Data Structures",
    "APIs",
    "GraphQL",
  ];

  // Difficulty explanations and progress metrics
  const difficultyMetadata: Record<
    string,
    {
      percent: number;
      color: string;
      bg: string;
      text: string;
      description: string;
    }
  > = {
    EASY: {
      percent: 33,
      color: "bg-emerald-500",
      bg: "bg-emerald-950/20",
      text: "text-emerald-400",
      description:
        "Conceptual baseline. Ideal for entry-level checks, fundamental loops, syntax details, and simple behavioral situations.",
    },
    MEDIUM: {
      percent: 66,
      color: "bg-amber-500",
      bg: "bg-amber-950/20",
      text: "text-amber-400",
      description:
        "Standard industry evaluation. Includes core system patterns, practical algorithms, API designs, and typical engineering collaboration challenges.",
    },
    HARD: {
      percent: 100,
      color: "bg-rose-500",
      bg: "bg-rose-950/20",
      text: "text-rose-400",
      description:
        "Rigorous architect level. Focuses on system scale bottlenecks, deep structural algorithm complexity, edge optimizations, and senior engineering conflicts.",
    },
  };
  const difficultyOptions = [
    {
      id: "EASY",
      name: "Easy Practice",
      color:
        "border-emerald-500/20 text-emerald-400 bg-emerald-950/10 hover:bg-emerald-950/20",
      activeColor:
        "border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/30",
    },
    {
      id: "MEDIUM",
      name: "Medium (Standard)",
      color:
        "border-amber-500/20 text-amber-400 bg-amber-950/10 hover:bg-amber-950/20",
      activeColor:
        "border-amber-500 bg-amber-950/40 ring-1 ring-amber-500/30",
    },
    {
      id: "HARD",
      name: "Hard (Rigorous)",
      color:
        "border-rose-500/20 text-rose-400 bg-rose-950/10 hover:bg-rose-950/20",
      activeColor:
        "border-rose-500 bg-rose-950/40 ring-1 ring-rose-500/30",
    },
  ]
  const activeDifficultyMetric =
    difficultyMetadata[difficulty] || difficultyMetadata.medium;
  return (
    <div className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/70 via-[#0c101d]/80 to-slate-950/70 backdrop-blur-xl p-6 sm:p-7 space-y-6 shadow-[0_18px_50px_-30px_rgba(13,148,136,0.35)] hover:border-slate-700 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-950/50 border border-teal-500/20 text-teal-400 text-xs font-bold font-mono">
            {order}
          </span>
          <h2 className="text-base font-bold tracking-tight font-display">
            Difficulty & Skill Cloud
          </h2>
        </div>
      </div>

      {/* Difficulty Pills & Progress Bar */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Session Difficulty
          </label>
          <div className="flex flex-wrap gap-3">
            {difficultyOptions.map((item) => {
              const isActive = difficulty === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDifficulty(item.id)}
                  className={`px-5 py-2 rounded-xl border text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? item.activeColor
                      : `${item.color} border-slate-900`
                  }`}
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping" />
                  )}
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Difficulty Meter with Descriptions */}
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-900/60 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 animate-pulse" />
              Complexity Meter
            </span>
            <span
              className={`${activeDifficultyMetric.text} font-extrabold uppercase tracking-wide`}
            >
              {difficulty} Mode
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-900">
            <div
              className={`h-full transition-all duration-500 ease-out ${activeDifficultyMetric.color}`}
              style={{ width: `${activeDifficultyMetric.percent}%` }}
            />
          </div>
          {/* Explanatory text so users know what to expect */}
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans pt-1">
            {activeDifficultyMetric.description}
          </p>
        </div>
      </div>

      {/* Selected Skills Tags */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Target Skills (1 to 5 Skills)
          </label>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
              selectedSkills.length === 5
                ? "text-amber-400 bg-amber-950/30 border-amber-500/10"
                : "text-teal-400 bg-teal-950/30 border-teal-500/10"
            }`}
          >
            {selectedSkills.length} / 5 skills
          </span>
        </div>

        <div className="flex flex-wrap gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-900 min-h-[50px]">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-300 hover:scale-105 transition-transform duration-200"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-teal-500 hover:text-rose-400 transition-colors ml-1 cursor-pointer focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add Custom Skill Form */}
        <form onSubmit={handleAddCustomSkill} className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom skill (e.g. Docker, Redis, PyTorch)..."
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            className="flex-1 bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 shadow-inner"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold rounded-xl border border-teal-500/30 bg-teal-950/40 text-teal-400 hover:bg-teal-900/40 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Popular Skill Bank */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Tags className="h-3.5 w-3.5 text-slate-600" />
            <span>Popular Skills Click-Cloud (Max 5)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {popularSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-lg border text-xs transition-all duration-200 cursor-pointer hover:scale-[1.03] ${
                    isSelected
                      ? "bg-teal-950/20 border-teal-500/40 text-teal-400 font-semibold"
                      : "bg-slate-950/30 border-slate-900/60 text-slate-400 hover:border-slate-800 hover:text-slate-300"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultyAndSkills;
