import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

const AiModelFailed = () => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Background ambient lighting */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-teal-500/10 blur-[110px] pointer-events-none" />

      {/* Main Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-b from-[#0f172a] via-[#090e1c] to-[#040711] p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.12)] text-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        
        {/* Top glowing accent border */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

        {/* Warning Icon Badge */}
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
            <AlertTriangle className="w-8 h-8" />
          </div>
          {/* Animated pulsing indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-slate-950" />
          </span>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/25 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>High Demand Detected</span>
        </div>

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2.5 font-display">
          AI Interviewer Temporarily Busy
        </h2>

        {/* Informative Body Copy */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mb-5 font-normal">
          Due to heavy traffic and high service demand, our AI interviewer is momentarily unavailable. You can safely resume your interview after a few minutes.
        </p>

        {/* Progress Saved Reassurance Pill */}
        <div className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium mb-6">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Your progress and answered questions are safely saved.</span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-teal-500/40 text-slate-200 hover:text-white font-medium text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
        </button>

      </div>
    </div>
  );
};

export default AiModelFailed;
