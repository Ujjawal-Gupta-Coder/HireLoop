"use client";

import { useState } from "react";
import { 
  Code2, 
  Users, 
  Laptop, 
  Layers, 
  Cpu, 
  Sparkles,
  Zap,
  Clock,
  Timer,
} from "lucide-react";
import InterviewType from "./InterviewType";
import RoleAndExperience from "./RoleAndExperience";
import DifficultyAndSkills from "./DifficultyAndSkills";
import InterviewLength from "./InterviewLength";
import SpecializedFocusTextarea from "./SpecializedFocusTextarea";
import SummaryCardConfig from "./SummaryCardConfig";
import { InterViewLengthOptionsType, InterviewTypeConfig } from "@/src/types";
import InterviewLaunchAmination from "./InterviewLaunchAmination";

type InterviewConfigClientProps = {
  credits: number;
};

export default function InterviewConfigClient({ credits }: InterviewConfigClientProps) {

  // Interview Tracks configuration
  const interviewTypes: InterviewTypeConfig[] = [
    {
      id: "TECHNICAL_INTERVIEW",
      title: "Technical Q&A",
      description: "CS fundamentals, database designs, systems concepts.",
      icon: Laptop,
      cost: 10,
      badge: "Standard",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20",
      glowColor: "group-hover:shadow-blue-500/10",
    },
    {
      id: "CODING_INTERVIEW",
      title: "Coding Practice",
      description: "Live interactive coding & algorithm execution sandboxes.",
      icon: Code2,
      cost: 15,
      badge: "Premium",
      iconColor: "text-teal-400",
      borderColor: "border-teal-500/20",
      glowColor: "group-hover:shadow-teal-500/10",
    },
    {
      id: "BEHAVIORAL_INTERVIEW",
      title: "Behavioral",
      description: "Soft skills, scenarios, fitment check, and leadership fit.",
      icon: Users,
      cost: 10,
      badge: "Premium",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/20",
      glowColor: "group-hover:shadow-purple-500/10",
    },
    {
      id: "SYSTEM_DESIGN_INTERVIEW",
      title: "System Design",
      description: "Scalability, high availability, database topologies, APIs.",
      icon: Layers,
      cost: 15,
      badge: "Standard",
      iconColor: "text-amber-400",
      borderColor: "border-amber-500/20",
      glowColor: "group-hover:shadow-amber-500/10",
    },
    {
      id: "MIXED_INTERVIEW",
      title: "Mixed Trial",
      description: "A hybrid test combining technical and behavior rounds.",
      icon: Cpu,
      cost: 15,
      badge: "Best Value",
      iconColor: "text-rose-400",
      borderColor: "border-rose-500/20",
      glowColor: "group-hover:shadow-rose-500/10",
    },
  ];

  // Interview length configuration
  const interViewLengthOptions: InterViewLengthOptionsType[] = [
    {
      id: "QUICK",
      title: "Quick Practice",
      shortTitle: "Quick",
      questions: 5,
      duration: "~3–4 min",
      icon: Zap,
      tagLine: "Fast-paced checkpoint",
      credits: 5,
      isRecommended: false,
    },
    {
      id: "STANDARD",
      title: "Standard Session",
      shortTitle: "Standard",
      questions: 8,
      duration: "~5–7 min",
      icon: Clock,
      tagLine: "Standard evaluations",
      credits: 10,
      isRecommended: true,
    },
    {
      id: "EXTENDED",
      title: "Extended Evaluation",
      shortTitle: "Extended",
      questions: 12,
      duration: "~8–10 min",
      icon: Timer,
      tagLine: "Deep dive check",
      credits: 15,
      isRecommended: false,
    },
  ];

  // Animation steps 
  const launchStepsText = [
  "Preparing your interview configuration...",
  "Analyzing your selected skills and experience...",
  "Generating your personalized interview structure...",
  "Calibrating questions to your selected difficulty...",
  "Initializing the AI interviewer...",
  "Preparing your interview environment...",
  "Ready! Entering interview room...",
];

  // State variables
  const [selectedType, setSelectedType] = useState<string>("TECHNICAL_INTERVIEW");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["React", "TypeScript"]);
  const [difficulty, setDifficulty] = useState<string>("MEDIUM");
  const [experience, setExperience] = useState<string>("JUNIOR");
  const [targetRole, setTargetRole] = useState<string>("FULL_STACK_DEVELOPER");
  const [sessionLength, setSessionLength] = useState<string>("STANDARD");
  const [focusAreas, setFocusAreas] = useState<string>("");
   const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [launchStep, setLaunchStep] = useState<number>(0);

  if (isLaunching) 
    return <InterviewLaunchAmination launchStep={launchStep} launchStepsText={launchStepsText}/>;

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-8 relative pb-20">
      
      {/* Dynamic Background Graphics */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Page Title Header */}
      <div className="relative flex flex-col justify-between items-start gap-3 border-b border-slate-800/80 pb-7">
        <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Preparation Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 font-display">
          Setup Your AI Interview
        </h1>
        <p className="text-[12px] md:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Configure your technical scope, experience level, and difficulty. Our generative AI agent will craft a personalized session based on your parameters.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Form Configurations */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1: Choose Interview Type - Vertical Cards */}
          <InterviewType order={1} selectedType={selectedType} setSelectedType={setSelectedType} interviewTypes={interviewTypes} />

          {/* Section 2: Role and Experience */}
          <RoleAndExperience order={2} targetRole={targetRole} setTargetRole={setTargetRole} experience={experience} setExperience={setExperience} />

          {/* Section 3: Difficulty & Skill Cloud */}
          <DifficultyAndSkills order={3} difficulty={difficulty} setDifficulty={setDifficulty} selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />

          {/* Section 4: Select Interview Length */}
          <InterviewLength order={4} sessionLength={sessionLength} setSessionLength={setSessionLength} interViewLengthOptions={interViewLengthOptions} />

          {/* Section 5: Focus Area text instructions */}
          <SpecializedFocusTextarea order={5} focusAreas={focusAreas} setFocusAreas={setFocusAreas} />

        </div>

        {/* Right: Summary Card */}
        <SummaryCardConfig credits={credits} interviewTypes={interviewTypes} interViewLengthOptions={interViewLengthOptions} selectedType={selectedType} selectedSkills={selectedSkills} difficulty={difficulty} experience={experience} targetRole={targetRole} sessionLength={sessionLength} focusAreas={focusAreas} setIsLaunching={setIsLaunching} setLaunchStep={setLaunchStep} totalLaunchSteps={launchStepsText.length} />

      </div>

    </main>
  );
}