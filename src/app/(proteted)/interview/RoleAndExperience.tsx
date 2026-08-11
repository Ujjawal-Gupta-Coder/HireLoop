import {
  Brain,
  Check,
  Clock,
  Code2,
  Cpu,
  Database,
  Laptop,
  Layers,
  Smartphone,
  Terminal,
} from "lucide-react";

type RoleAndExperienceProps = {
  order:number,
  targetRole: string;
  setTargetRole: React.Dispatch<React.SetStateAction<string>>;
  experience: string;
  setExperience: React.Dispatch<React.SetStateAction<string>>;
};

const RoleAndExperience = ({
  order,
  targetRole,
  setTargetRole,
  experience,
  setExperience,
}: RoleAndExperienceProps) => {
  // Target Roles configuration
  const targetRoles = [
    { id: "Full Stack Developer", name: "Full Stack Developer", icon: Layers },
    { id: "Front End Developer", name: "Front End Developer", icon: Laptop },
    { id: "Back End Developer", name: "Back End Developer", icon: Database },
    { id: "React Developer", name: "React Developer", icon: Code2 },
    { id: "Software Engineer", name: "Software Engineer", icon: Cpu },
    {
      id: "Mobile App Developer",
      name: "Mobile App Developer",
      icon: Smartphone,
    },
    {
      id: "DevOps Engineer",
      name: "DevOps Engineer",
      icon: Terminal,
    },
    {
      id: "AI / ML Engineer",
      name: "AI / ML Engineer",
      icon: Brain,
    },
  ];

  // Experience timeline configurations
  const experienceLevels = [
    { id: "fresher", name: "Fresher", detail: "0-1 yrs", percent: 0 },
    { id: "junior", name: "Junior", detail: "1-3 yrs", percent: 20 },
    { id: "mid-level", name: "Mid-Level", detail: "3-5 yrs", percent: 40 },
    { id: "senior", name: "Senior", detail: "5-8 yrs", percent: 60 },
    { id: "lead-staff", name: "Lead/Staff", detail: "8+ yrs", percent: 80 },
    {
      id: "manager-director",
      name: "Manager+",
      detail: "Director",
      percent: 100,
    },
  ];

  // Colors for experience timeline transition
  const experienceColors: Record<
    string,
    { bar: string; text: string; glow: string; border: string }
  > = {
    fresher: {
      bar: "bg-teal-500",
      text: "text-teal-400",
      glow: "shadow-teal-500/50 border-teal-500",
      border: "border-teal-500/20",
    },
    junior: {
      bar: "bg-emerald-500",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/50 border-emerald-500",
      border: "border-emerald-500/20",
    },
    "mid-level": {
      bar: "bg-cyan-500",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/50 border-cyan-500",
      border: "border-cyan-500/20",
    },
    senior: {
      bar: "bg-blue-500",
      text: "text-blue-400",
      glow: "shadow-blue-500/50 border-blue-500",
      border: "border-blue-500/20",
    },
    "lead-staff": {
      bar: "bg-indigo-500",
      text: "text-indigo-400",
      glow: "shadow-indigo-500/50 border-indigo-500",
      border: "border-indigo-500/20",
    },
    "manager-director": {
      bar: "bg-purple-500",
      text: "text-purple-400",
      glow: "shadow-purple-500/50 border-purple-500",
      border: "border-purple-500/20",
    },
  };

  const activeExpColor =
    experienceColors[experience] || experienceColors["mid-level"];
  return (
    <div className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/70 via-[#0c101d]/80 to-slate-950/70 backdrop-blur-xl p-6 sm:p-7 space-y-6 shadow-[0_18px_50px_-30px_rgba(13,148,136,0.35)] hover:border-slate-700 transition-all duration-300">
      <div className="flex items-center gap-2 text-slate-200">
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-950/50 border border-teal-500/20 text-teal-400 text-xs font-bold font-mono">
          {order}
        </span>
        <h2 className="text-base font-bold tracking-tight font-display">
          Target Role & Experience Profile
        </h2>
      </div>

      <div className="space-y-5">
        {/* Target Role Selector Grid */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Target Role
            </label>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-teal-500/10 bg-teal-950/30 text-teal-400 select-none">
              Active: {targetRole}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {targetRoles.map((role) => {
              const IconComponent = role.icon;
              const isSelected = targetRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setTargetRole(role.id)}
                  className={`group p-4 rounded-2xl border flex flex-col justify-between text-left cursor-pointer min-h-[135px] transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl ${
                    isSelected
                      ? "bg-linear-to-br from-teal-950/40 via-slate-900/80 to-slate-950 border-teal-500/50 text-teal-300 shadow-[0_4px_25px_rgba(20,184,166,0.12)]"
                      : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 h-10 w-10 bg-teal-500/10 rounded-full blur-md pointer-events-none" />
                  )}

                  <div
                    className={`p-2.5 rounded-xl border w-fit ${
                      isSelected
                        ? "bg-teal-500/20 border-teal-500/30 text-teal-400 shadow-inner animate-pulse-glow"
                        : "bg-slate-900 border-slate-800 text-slate-500 group-hover:text-slate-400"
                    } transition-colors`}
                  >
                    <IconComponent className="h-4.5 w-4.5" />
                  </div>

                  <div className="space-y-1 pr-4">
                    <p
                      className={`text-xs font-bold leading-snug break-words ${isSelected ? "text-slate-100 font-extrabold" : "text-slate-400 group-hover:text-slate-200"}`}
                    >
                      {role.name}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <Check className="h-3.5 w-3.5 text-teal-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Specify Seniority Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-4 border-t border-slate-900/60">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-200 font-display">
              Seniority Profile
            </h3>
            <p className="text-[11px] text-slate-400">
              Select your seniority level on the timeline below.
            </p>
          </div>
          <div
            className={`px-4.5 py-2.5 rounded-xl border bg-slate-950/40 text-xs font-bold transition-all duration-500 ease-in-out text-slate-200 flex items-center gap-2 ${activeExpColor.border}`}
          >
            <Clock className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
            <span>
              {experienceLevels.find((e) => e.id === experience)?.name} (
              {experienceLevels.find((e) => e.id === experience)?.detail})
            </span>
          </div>
        </div>

        {/* Experience Timeline Slider - Below, changing colors smoothly */}
        <div className="space-y-3 pt-2">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Experience Level Timeline
          </label>

          <div className="relative pt-6 pb-4 px-3 bg-slate-950/30 rounded-2xl border border-slate-900/50 hover:border-slate-800 transition-colors duration-300">
            {/* Nodes */}
            <div className="relative flex justify-between">
              {/* Timeline bar base - centered vertically on the 18px (h-4.5) stepper dots */}
              <div className="absolute top-[9px] left-8 right-8 h-[3px] bg-slate-900 rounded-full -translate-y-1/2 border border-slate-800/80" />

              {/* Timeline bar filled (Smooth background-color transitions and glow) */}
              <div
                className={`absolute top-[9px] left-8 h-[3px] rounded-full -translate-y-1/2 transition-all duration-500 ease-in-out ${activeExpColor.bar} shadow-[0_0_8px_rgba(20,184,166,0.3)]`}
                style={{
                  width: `calc(${experienceLevels.find((e) => e.id === experience)?.percent}% - ${
                    (experienceLevels.find((e) => e.id === experience)
                      ?.percent || 0) * 0.64
                  }px)`,
                }}
              />

              {experienceLevels.map((level) => {
                const isCurrent = experience === level.id;
                const isPassed =
                  experienceLevels.find((e) => e.id === experience)!.percent >=
                  level.percent;
                const nodeColor = experienceColors[level.id] || activeExpColor;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setExperience(level.id)}
                    className="flex flex-col items-center group focus:outline-none cursor-pointer relative z-10 w-16"
                  >
                    {/* Stepper Node dot - now perfectly aligned with the line */}
                    <div
                      className={`h-4.5 w-4.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center relative ${
                        isCurrent
                          ? `bg-slate-950 scale-125 shadow-lg ${nodeColor.glow}`
                          : isPassed
                            ? `${nodeColor.bar} border-transparent shadow-[0_0_8px_rgba(20,184,166,0.25)]`
                            : "bg-slate-950 border-slate-800 group-hover:border-slate-700"
                      }`}
                    >
                      {isCurrent && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400"></span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold transition-colors duration-200 mt-3 ${
                        isCurrent
                          ? nodeColor.text
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    >
                      {level.name}
                    </span>
                    <span className="text-[8px] text-slate-600 font-mono mt-0.5">
                      {level.detail}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleAndExperience;
