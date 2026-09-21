"use client";

import { useMemo } from "react";
import { getTierInfo } from "./performanceMeter";

type PerformanceGaugeProps = {
  score: number;
  label: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
};

export default function PerformanceGauge({
  score,
  label,
  sublabel,
  size = 180,
  strokeWidth = 14,
}: PerformanceGaugeProps) {
  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));
  const tier = useMemo(() => getTierInfo(boundedScore), [boundedScore]);

  // Semi-circle or full circular gauge
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 260-degree arc for a modern speedometer feel
  const arcDegrees = 260;
  const arcLength = (circumference * arcDegrees) / 360;
  const strokeDashoffset = arcLength - (arcLength * boundedScore) / 100;
  const rotationOffset = 90 + (360 - arcDegrees) / 2;

  // Gradient ID
  const gradientId = useMemo(
    () => `gauge-gradient-${label.toLowerCase().replace(/\s+/g, "-")}`,
    [label]
  );

  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl bg-[#0a101f]/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl group hover:border-slate-700/80 transition-all duration-300">
      {/* Background glow based on tier */}
      <div
        className={`absolute inset-0 rounded-3xl opacity-20 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-35 ${
          tier.level === "Excellent"
            ? "bg-emerald-500"
            : tier.level === "Good"
            ? "bg-teal-500"
            : tier.level === "Average"
            ? "bg-yellow-500"
            : tier.level === "Weak"
            ? "bg-amber-500"
            : "bg-rose-500"
        }`}
      />

      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform"
          style={{ transform: `rotate(${rotationOffset}deg)` }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              {tier.level === "Excellent" ? (
                <>
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </>
              ) : tier.level === "Good" ? (
                <>
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </>
              ) : tier.level === "Average" ? (
                <>
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#facc15" />
                </>
              ) : tier.level === "Weak" ? (
                <>
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fb923c" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </>
              )}
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${arcLength} ${circumference}`}
          />

          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <div className="flex items-baseline gap-0.5">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100 font-display">
              {boundedScore}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">/100</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Score
          </span>
        </div>
      </div>

      {/* Label and Performance Badge */}
      <div className="text-center mt-3 space-y-2">
        <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
          {label}
        </h3>
        {sublabel && (
          <p className="text-[11px] text-slate-400 max-w-[200px] leading-tight">
            {sublabel}
          </p>
        )}

        <div className="pt-1 flex items-center justify-center">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wide shadow-sm ${tier.badgeBg}`}
          >
            <span className={`w-2 h-2 rounded-full ${tier.dotColor} animate-pulse`} />
            <span>{tier.level}</span>
            <span className="text-[10px] opacity-75 font-normal">({tier.rangeLabel})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
