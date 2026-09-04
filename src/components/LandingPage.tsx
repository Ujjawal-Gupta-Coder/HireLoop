"use client";

import { useState } from "react";
import {
  Check,
  Sparkles,
  Cpu,
  TrendingUp,
  Users,
  ArrowRight,
  Mic,
  AudioLines,
  FileText,
  Download,
  Layers,
  Laptop,
  Database,
  Code2,
  Smartphone,
  Terminal,
  Brain,
  Sliders,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import {
  IconRoute,
  IconTimeline,
  IconBrain,
} from "@tabler/icons-react";
import CodeEditorMockup from "./CodeEditorMockup";


// Interview Tracks
const INTERVIEW_TRACKS = [
  {
    id: "technical",
    title: "Technical Round",
    shortTitle: "Technical",
    desc: "In-depth questions on CS fundamentals, database internals, language-specific mechanics, and system architecture.",
    icon: Laptop,
    badge: "Core Technical",
    iconColor: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
    focus: [
      "Core Language & Runtime Internals",
      "Database Indexing & ACID Guarantees",
      "API Protocols, REST & Microservices",
      "Concurrency, Caching & Memory Management",
    ],
  },
  {
    id: "coding",
    title: "Coding Round",
    shortTitle: "Coding",
    desc: "Algorithmic thinking, complexity tradeoffs, data structures, and edge-case evaluations via interactive problem walkthroughs.",
    icon: Code2,
    badge: "Algorithms & Logic",
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    focus: [
      "Time & Space Complexity (Big-O)",
      "Arrays, Trees, Graphs & Dynamic Programming",
      "Boundary Conditions & Edge-Case Defense",
      "Logical Decomposition & Code Clarity",
    ],
  },
  {
    id: "system_design",
    title: "System Designing",
    shortTitle: "System Design",
    desc: "Scalable architectural breakdowns, distributed topologies, load balancing, message queues, and high availability.",
    icon: Layers,
    badge: "Distributed Systems",
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    focus: [
      "Horizontal vs Vertical Scalability",
      "Message Queues & Event Streaming",
      "Database Sharding & Replication Lag",
      "Fault Tolerance, Latency & Disaster Recovery",
    ],
  },
  {
    id: "behaviour",
    title: "Behaviour Round",
    shortTitle: "Behavioral",
    desc: "Soft skills, culture alignment, situational leadership, conflict resolution, and structured STAR method storytelling.",
    icon: Users,
    badge: "STAR Method",
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    focus: [
      "Conflict Resolution & Teamwork",
      "Project Ownership & Accountability",
      "Stakeholder Communication & Empathy",
      "Adapting Under Tight Delivery Deadlines",
    ],
  },
  {
    id: "mixed",
    title: "Mixed Round",
    shortTitle: "Technical + Behaviour",
    desc: "A comprehensive hybrid simulation pairing deep technical questioning with leadership, decision-making, and culture assessments.",
    icon: Cpu,
    badge: "Full Assessment",
    iconColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    focus: [
      "Technical Depth & Architecture Rationale",
      "Navigating Engineering Disagreements",
      "Mentorship & Engineering Culture",
      "End-to-End Product Execution",
    ],
  },
];

// Supported Roles
const SUPPORTED_ROLES = [
  { id: "full_stack", label: "Full Stack Developer", icon: Layers },
  { id: "frontend", label: "Frontend Developer", icon: Laptop },
  { id: "backend", label: "Backend Developer", icon: Database },
  { id: "react", label: "React Developer", icon: Code2 },
  { id: "software_engineer", label: "Software Engineer", icon: Cpu },
  { id: "mobile_app", label: "Mobile App Developer", icon: Smartphone },
  { id: "devops", label: "DevOps Engineer", icon: Terminal },
  { id: "aiml", label: "AIML Engineer", icon: Brain },
];

// Experience Levels
const EXPERIENCE_LEVELS = [
  { id: "fresher", label: "Fresher", years: "0-1 yrs" },
  { id: "junior", label: "Junior", years: "1-3 yrs" },
  { id: "midlevel", label: "Mid-Level", years: "3-5 yrs" },
  { id: "senior", label: "Senior", years: "5-8 yrs" },
  { id: "lead_staff", label: "Lead Staff", years: "8+ yrs" },
  { id: "manager", label: "Manager", years: "Leadership" },
];

// How It Works Steps
const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Configure Interview",
    desc: "Choose your interview track (Technical, Coding, System Design, Behavioral, or Mix), target role, and seniority level to tailor the interviewer.",
    icon: Sliders,
    badge: "Step 1",
  },
  {
    step: "02",
    title: "Start the Interview",
    desc: "Step into your interview room and answer questions naturally in real-time. Practice answering deep-dives and dynamic follow-up prompts.",
    icon: Mic,
    badge: "Step 2",
  },
  {
    step: "03",
    title: "Analyse Performance",
    desc: "Our diagnostic engine analyzes your speech cadence, domain precision, clarity, and STAR framework structure within seconds.",
    icon: BarChart3,
    badge: "Step 3",
  },
  {
    step: "04",
    title: "Download PDF Report & Improve",
    desc: "Review your detailed diagnostic breakdown with actionable takeaways, question-by-question scoring, and a 1-click downloadable PDF report.",
    icon: Download,
    badge: "Step 4",
  },
];

// Evaluation Cards 
const EVALUATION_CARDS = [
  {
    title: "Conversational Intelligence",
    tagline: "Natural Interview Dynamics",
    desc: "Interact with an AI interviewer equipped with low-latency recognition and adaptive follow-up questions tailored to your specific answers.",
    icon: Mic,
    iconColor: "text-teal-400",
    badgeBg: "bg-teal-500/10 border-teal-500/20",
    metrics: [
      { label: "Response Latency", value: "< 1.2s", width: "95%" },
      { label: "Contextual Follow-ups", value: "Real-time", width: "90%" },
      { label: "Realistic Interview Flow", value: "Adaptive", width: "100%" },
    ],
  },
  {
    title: "AI Performance Analysis",
    tagline: "Intelligent Interview Evaluation",
    desc: "AI analyzes your interview responses to evaluate technical accuracy, communication quality, and answer relevance.",
    icon: TrendingUp,
    iconColor: "text-cyan-400",
    badgeBg: "bg-cyan-500/10 border-cyan-500/20",
    metrics: [
      { label: "Technical Accuracy", value: "92 / 100", width: "92%" },
      { label: "Communication Quality", value: "95 / 100", width: "95%" },
      { label: "Answer Relevance", value: "90 / 100", width: "90%" },
    ],
  },
  {
    title: "Comprehensive PDF Report",
    tagline: "Actionable Performance Roadmap",
    desc: "Receive structured scorecards and download a professional PDF report containing strengths, weaknesses, and concrete recommendations.",
    icon: FileText,
    iconColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20",
    metrics: [
      { label: "Technical Competency", value: "92 / 100", width: "92%" },
      { label: "Communication Clarity", value: "95 / 100", width: "95%" },
      { label: "1-Click PDF Export", value: "Ready to Share", width: "100%" },
    ],
  },
];


const LandingPage = () => {
  // Track State
  const [selectedTrack, setSelectedTrack] = useState<string>("technical");
  const [selectedRole, setSelectedRole] = useState<string>("full_stack");
  const [selectedLevel, setSelectedLevel] = useState<string>("midlevel");

  return (
    <>
      {/* Hero Section  */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/20 bg-teal-950/30 text-xs font-semibold tracking-wide text-teal-400 mb-8 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Meet Your AI Interview Copilot</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-5xl mx-auto leading-[1.12] mb-6 font-display">
          Master Every Interview with Your{" "}
          <span className="text-teal-400 italic pr-2">AI-Powered</span>
          Copilot.
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10 font-sans font-normal">
          HireLoop delivers realistic mock interview practice with AI-powered performance analysis and actionable diagnostic reports to help you land your dream offer.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="/interview"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl text-white bg-teal-600 hover:bg-teal-500 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-teal-900/30 transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <span>Start Practicing Now</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl text-slate-300 hover:text-white bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Explore Platform Features</span>
          </a>
        </div>

        {/* Code Editor Mockup  */}
        <CodeEditorMockup />
        
        {/* Key Points Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-900/90">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <IconRoute className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-300">5 Specialized Tracks</span>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <AudioLines className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-300">Conversational AI</span>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <IconBrain className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-300">Interview Analytics</span>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-300">Instant PDF Reports</span>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/20 bg-teal-950/20 text-xs font-semibold text-teal-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4 font-display">
            Built For Realistic Interview Preparation
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-normal leading-relaxed">
            Experience an intelligent preparation ecosystem designed to evaluate your communication, technical depth, and situational leadership.
          </p>
        </div>

        {/* Floating Animation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch relative">
          
          {/* Subtle Ambient Backlight */}
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="absolute bottom-10 right-1/4 w-[350px] h-[250px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* CARD 1: Real-Time Conversational AI (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Conversational Interviewer</h3>
                  <p className="text-xs text-slate-400">Contextual questions with real-time follow-ups</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/40 border border-teal-500/20 text-teal-400 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Live Evaluation</span>
              </div>
            </div>

            {/* Simulated Dialogue Snippet */}
            <div className="space-y-3.5 my-2">
              {/* AI Interviewer Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-[10px] text-teal-400 font-bold shrink-0 mt-0.5">
                  AI
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-2xl rounded-tl-sm border border-white/5 text-slate-300 text-xs leading-relaxed flex-1">
                  <span className="text-[10px] font-bold text-teal-400 block mb-1">Interviewer</span>
                  &ldquo;What is the difference between useState and useEffect in React, and when would you use each one?&rdquo;
                </div>
              </div>

              {/* Candidate Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0 mt-0.5">
                  YOU
                </div>
                <div className="bg-teal-950/20 p-3.5 rounded-2xl rounded-tl-sm border border-teal-500/15 text-slate-200 text-xs leading-relaxed flex-1">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Candidate</span>
                  &ldquo;useState is used to manage local state inside a component, while useEffect is used to handle side effects like API calls, subscriptions, or updating the document title. I would use useState...&rdquo;
                </div>
              </div>
            </div>

            {/* Live Waveform Indicator Bar */}
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-3 bg-teal-400 rounded-full animate-wave-bounce" style={{ animationDelay: "0.1s" }} />
                <span className="w-1 h-5 bg-teal-400 rounded-full animate-wave-bounce" style={{ animationDelay: "0.3s" }} />
                <span className="w-1 h-2.5 bg-teal-400 rounded-full animate-wave-bounce" style={{ animationDelay: "0.5s" }} />
                <span className="w-1 h-6 bg-cyan-400 rounded-full animate-wave-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="w-1 h-4 bg-teal-400 rounded-full animate-wave-bounce" style={{ animationDelay: "0.4s" }} />
                <span className="text-xs text-slate-400 ml-2 font-mono">Real-time Audio Cadence</span>
              </div>
              <span className="text-xs text-teal-400 font-mono font-semibold">Latency &lt;1.2s</span>
            </div>
          </div>

          {/* CARD 2: Performance Analysis Widget (5 cols - Floating) */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between shadow-2xl animate-float">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">AI Performance Analysis</h3>
                    <p className="text-xs text-slate-400">Interview performance & communication insights</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-950/40 text-cyan-400 border border-cyan-500/20">
                  AI Powered
                </span>
              </div>

              {/* Progress bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Technical Knowledge</span>
                    <span className="text-cyan-400 font-mono font-bold">88% (Strong)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 w-[88%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Communication</span>
                    <span className="text-emerald-400 font-mono font-bold">92% (Excellent)</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[92%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Answer Relevance</span>
                    <span className="text-teal-400 font-mono font-bold">95% (Excellent)</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-teal-500 w-[95%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
              <span>Automatic Analysis</span>
              <span className="text-cyan-400 font-semibold">Ready for Review</span>
            </div>
          </div>

          {/* CARD 3: STAR Method Validation (4 cols - Floating Delayed) */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between shadow-2xl animate-float-delayed">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">STAR Framework Audit</h3>
                  <p className="text-[11px] text-slate-400">Structured behavioral alignment</p>
                </div>
              </div>

              {/* STAR Checklist */}
              <div className="space-y-2 mt-4">
                {[
                  { label: "Situation", status: "Clear context defined", score: "96%" },
                  { label: "Task", status: "Core challenge framed", score: "92%" },
                  { label: "Action", status: "Key technical steps", score: "95%" },
                  { label: "Result", status: "Measurable metrics stated", score: "94%" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-slate-200">{item.label}</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold text-[11px]">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Overall STAR Match</span>
              <span className="text-emerald-400 font-bold">94% Alignment</span>
            </div>
          </div>

          {/* CARD 4: Specialized Tracks & Roles (4 cols) */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/10 hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <IconRoute className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">5 Tracks & 8 Roles</h3>
                  <p className="text-[11px] text-slate-400">Customized to your exact profile</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {INTERVIEW_TRACKS.map((track) => (
                  <span
                    key={track.id}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300"
                  >
                    {track.shortTitle}
                  </span>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-teal-950/20 border border-teal-500/20">
                <span className="text-[10px] text-teal-400 uppercase font-bold tracking-wider block mb-1">
                  Experience Levels
                </span>
                <p className="text-xs text-slate-300">
                  Fresher to Manager — practice at your level.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>Adaptive Scoring</span>
              <span className="text-teal-400 font-semibold">100% Tailored</span>
            </div>
          </div>

          {/* CARD 5: 1-Click PDF Report Download (4 cols - Floating) */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between shadow-2xl animate-float">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Download PDF Report</h3>
                    <p className="text-[11px] text-slate-400">Comprehensive diagnostic audits</p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Technical Depth</span>
                  <span className="text-teal-400 font-bold font-mono">92 / 100</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Communication Clarity</span>
                  <span className="text-cyan-400 font-bold font-mono">95 / 100</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Actionable Tips</span>
                  <span className="text-purple-400 font-bold font-mono">4 Areas</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Export Format</span>
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Audit Ready</span>
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Interview Tracks Section */}
      <section id="tracks" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Practice Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2 mb-4 font-display">
            Curated Tracks, Roles & Experience Levels
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-normal">
            HireLoop adjusts its evaluation criteria, depth of inquiry, and technical rubric based on your target round, engineering role, and seniority level.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: 5 Specialized Interview Tracks */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <IconRoute className="w-5 h-5 text-teal-400" />
                <span>Interview Tracks</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">5 Specialized Rounds</span>
            </div>

            <div className="space-y-3">
              {INTERVIEW_TRACKS.map((track) => {
                const IconComp = track.icon;
                const isSelected = selectedTrack === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrack(track.id)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start relative group ${
                      isSelected
                        ? "bg-slate-900/90 border-teal-500/50 shadow-lg shadow-teal-950/30"
                        : "bg-slate-950/40 border-white/5 hover:border-slate-800 hover:bg-slate-900/40"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-colors ${
                        isSelected
                          ? `${track.bgColor} ${track.borderColor} ${track.iconColor}`
                          : "bg-slate-900 border-slate-800 text-slate-500 group-hover:text-slate-300"
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-sm sm:text-base font-bold transition-colors ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                          {track.title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isSelected ? "bg-teal-500/10 border-teal-500/30 text-teal-400" : "bg-slate-900 border-slate-800 text-slate-500"
                        }`}>
                          {track.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {track.desc}
                      </p>

                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-1.5">
                          {track.focus.map((f, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-teal-300/90">
                              <Check className="w-3 h-3 text-teal-400 shrink-0" />
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Roles & Experience Levels (Clean & Uncluttered) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Roles Selection (8 Roles) */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-teal-400" />
                  <span>Engineering Roles</span>
                </h3>
                <span className="text-[11px] text-slate-500">8 Supported Specializations</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SUPPORTED_ROLES.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`px-3 py-3 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isSelected
                          ? "bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-900/30 font-bold"
                          : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <span className="leading-tight">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Experience Level Selection (6 Levels) */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <IconTimeline className="w-4 h-4 text-emerald-400" />
                  <span>Experience Levels</span>
                </h3>
                <span className="text-[11px] text-slate-500">Fresher to Leadership</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {EXPERIENCE_LEVELS.map((level) => {
                  const isSelected = selectedLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-900/30"
                          : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs font-bold block">{level.label}</span>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? "text-teal-100" : "text-slate-500"}`}>
                        {level.years}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simple Clean Callout Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/30 via-slate-900/40 to-slate-950/50 border border-teal-500/20 flex items-center justify-between gap-4 shadow-md">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Ready to test your readiness?</h4>
                <p className="text-xs text-slate-400">
                  Select your track and start an interview session anytime.
                </p>
              </div>
              <a
                href="/interview"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md shadow-teal-900/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Start Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-16">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Simple 4-Step Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2 mb-4 font-display">
            How HireLoop Works
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base font-normal">
            Sharpen your communication delivery and technical mastery in four streamlined steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 border border-white/5 relative group hover:border-teal-500/30 hover:scale-[1.02] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-md">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-extrabold font-mono text-slate-700 group-hover:text-teal-400 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block mb-1">
                    {item.badge}
                  </span>
                  <h4 className="text-base font-bold text-white mb-2.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Seamless Practice</span>
                  <ArrowRight className="w-3 h-3 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Evaluation Section */}
      <section id="evaluation" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-16">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Evaluation Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2 mb-4 font-display">
            Intelligent Evaluation Engine
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Engineered specifically for technical and behavioral assessments. Focused on verbal clarity, domain accuracy, and structured communication.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {EVALUATION_CARDS.map((card, cIdx) => {
            const IconC = card.icon;
            return (
              <div
                key={cIdx}
                className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col justify-between hover:border-slate-800 transition-all shadow-xl"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${card.badgeBg} ${card.iconColor} flex items-center justify-center mb-5 border`}>
                    <IconC className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {card.tagline}
                  </span>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal mb-6">
                    {card.desc}
                  </p>
                </div>

                {/* Diagnostics Preview Box */}
                <div className="bg-slate-950/80 rounded-2xl border border-white/5 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pb-2 border-b border-white/5">
                    <span>Telemetry Diagnostics</span>
                    <span className="flex items-center gap-1.5 text-teal-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      Active
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {card.metrics.map((m, mIdx) => (
                      <div key={mIdx}>
                        <div className="flex justify-between text-[10px] font-semibold mb-1 text-slate-300">
                          <span>{m.label}</span>
                          <span className="text-teal-400 font-mono">{m.value}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                            style={{ width: m.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default LandingPage;
