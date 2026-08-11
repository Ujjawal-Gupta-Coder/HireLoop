import { InterviewTypeConfig } from "@/src/types";
import { Check } from "lucide-react";

type InterviewTypeProps = {
  order: number
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  interviewTypes: InterviewTypeConfig[]
};

const InterviewType = ({
  order,
  selectedType,
  setSelectedType,
  interviewTypes
}: InterviewTypeProps) => {
 
  return (
    <div className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/70 via-[#0c101d]/80 to-slate-950/70 backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-[0_18px_50px_-30px_rgba(13,148,136,0.35)] hover:border-slate-700 transition-all duration-300">
      <div className="flex items-center gap-2 text-slate-200">
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-950/50 border border-teal-500/20 text-teal-400 text-xs font-bold font-mono">
          {order}
        </span>
        <h2 className="text-base font-bold tracking-tight font-display">
          Select Interview Track
        </h2>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Standard sessions focus on conceptual design and QA.
        Specialized coding, situational fit, and mixed assessments utilize
        sandbox execution systems and custom speech agents.
      </p>

      {/* Grid of cards where height is greater than width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {interviewTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`group text-left p-5 rounded-2xl border flex flex-col justify-between cursor-pointer min-h-[190px] transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl ${
                isSelected
                  ? "bg-linear-to-br from-teal-950/50 via-slate-900/80 to-slate-950 border-teal-400/60 shadow-[0_0_30px_rgba(20,184,166,0.12)]"
                  : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 h-12 w-12 bg-teal-500/10 rounded-full blur-lg pointer-events-none" />
              )}

              <div className="space-y-3">
                <div
                  className={`p-2.5 rounded-xl w-fit bg-slate-900/80 border ${isSelected ? "border-teal-500/30 text-teal-400 shadow-inner animate-pulse-glow" : "border-slate-800 text-slate-500"} transition-colors`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-100">
                    {type.title}
                    {isSelected && (
                      <Check className="h-3 w-3 text-teal-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {type.description}
                  </p>
                </div>
              </div>

              {/* Cost count placed at the bottom */}
              <div
                className={`text-[11px] font-bold tracking-wider uppercase mt-5 ${
                  isSelected ? "text-teal-400 font-extrabold" : "text-slate-500"
                }`}
              >
                {type.cost} Credits
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewType;
