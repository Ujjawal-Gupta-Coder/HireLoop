"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  PhoneOff, 
  Clock, 
  Sparkles, 
  User, 
  ShieldCheck,
  HelpCircle,
  Briefcase,
  TrendingUp,
  FileText,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// Types for components
type TranscriptItem = {
  id: string;
  sender: "AI" | "User";
  senderName: string;
  timestamp: string;
  text: string;
  status?: "current" | "completed";
};

export default function InterviewRoomPage() {
  // Tabs: 'progress' | 'notes'
  const [activeTab, setActiveTab] = useState<"progress" | "notes">("progress");
  
  // Timer state
  const [timeElapsed, setTimeElapsed] = useState(268); // 4 minutes 28 seconds (268s)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Controls states
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [notes, setNotes] = useState<string>("");

  // Start ticking timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Mock list of conversation items matching the transcript layout
  const transcriptHistory: TranscriptItem[] = [
    {
      id: "t1",
      sender: "AI",
      senderName: "AI Interviewer",
      timestamp: "04:12 PM",
      text: "Tell me about yourself and your background.",
      status: "completed",
    },
    {
      id: "t2",
      sender: "User",
      senderName: "You",
      timestamp: "04:13 PM",
      text: "I'm a computer science student with experience in full stack development using MERN stack...",
      status: "completed",
    },
    {
      id: "t3",
      sender: "AI",
      senderName: "AI Interviewer",
      timestamp: "04:15 PM",
      text: "What is the difference between var, let and const in JavaScript?",
      status: "completed",
    },
    {
      id: "t4",
      sender: "User", // Matches the current active question
      senderName: "Current",
      timestamp: "04:17 PM",
      text: "Can you explain the difference between SQL and NoSQL databases?",
      status: "current",
    },
  ];

  const handleEndInterview = () => {
    toast.success("Ending interview session...", {
      icon: "👋",
      style: {
        background: "#030712",
        color: "#F8FAFC",
        border: "1px solid rgba(239, 68, 68, 0.4)",
      }
    });
  };

  return (
    <div className="lg:h-screen lg:overflow-hidden min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500/20">
      
      {/* 1. Header component */}
      <header className="w-full border-b border-slate-800/60 bg-[#070b16] px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
        
        {/* Left section: Logo & Status badge */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-500 shadow-md shadow-teal-500/20">
              {/* Infinity loop shaped custom SVG */}
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 9C9.75 9 11.25 10.5 12 12C12.75 13.5 14.25 15 16.5 15C18.9853 15 21 12.9853 21 10.5C21 8.01472 18.9853 6 16.5 6C14.25 6 12.75 7.5 12 9C11.25 10.5 9.75 12 7.5 12C5.01472 12 3 9.98528 3 7.5C3 5.01472 5.01472 3 7.5 3C9.75 3 11.25 4.5 12 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold font-display text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:text-white transition">
              HireLoop
            </span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2">
            <span className="font-medium text-sm text-slate-200">Technical Interview</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <span className="w-1 h-1 rounded-full bg-teal-400 animate-pulse" />
              Voice Interview
            </div>
          </div>
        </div>

        {/* Center section: Main Question progress tracker */}
        <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-xl text-sm min-w-[200px] md:min-w-[280px]">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Progress</span>
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full w-[30%] transition-all duration-500 shadow-[0_0_12px_rgba(20,184,166,0.5)]" />
          </div>
          <span className="font-semibold text-slate-200 text-sm font-display whitespace-nowrap">3 / 10</span>
        </div>

        {/* Right section: Timer widget & Action buttons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-teal-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-white tracking-wider">
                {formatTime(timeElapsed)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-0.5">Time Elapsed</span>
            </div>
          </div>

          <button 
            onClick={handleEndInterview}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 active:scale-[0.98] text-red-400 font-medium text-sm transition-all duration-200 shadow-lg shadow-red-500/5"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden md:inline">End Interview</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-y-auto lg:overflow-hidden min-h-0">
        
        {/* Left Side: Video/Interviewer feed & Controls (takes 8 cols) */}
        <section className="lg:col-span-8 flex flex-col gap-4 lg:h-full lg:overflow-hidden min-h-0">
          
          {/* Interviewer stream mockup card */}
          <div className="relative flex-1 lg:h-full rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/60 shadow-2xl flex flex-col justify-between group min-h-[400px] lg:min-h-0">
            
            {/* Background image: Simulated webcam connection */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/interviewer.png" 
                alt="AI Interviewer Feed" 
                className="w-full h-full object-cover brightness-[0.8] contrast-[1.05] group-hover:scale-[1.01] transition-transform duration-700"
              />
              {/* Overlay vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 opacity-80" />
            </div>

            {/* Top row: Status indicators on feed overlay */}
            <div className="relative z-10 p-5 flex items-center justify-between">
              
              {/* AI Interviewer Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 shadow-md">
                <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-teal-400 animate-pulse" />
                </div>
                <span className="text-xs font-semibold text-white tracking-wide">AI Interviewer</span>
              </div>

              {/* Status Audio Waves badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 backdrop-blur-md border border-teal-500/30 text-teal-400 shadow-md shadow-teal-500/5">
                {/* Micro sound waves */}
                <div className="flex items-end gap-[2px] h-3 w-4">
                  <span className="w-[2.5px] bg-teal-400 rounded-full animate-[wave-bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }} />
                  <span className="w-[2.5px] bg-teal-400 rounded-full animate-[wave-bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }} />
                  <span className="w-[2.5px] bg-teal-400 rounded-full animate-[wave-bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }} />
                  <span className="w-[2.5px] bg-teal-400 rounded-full animate-[wave-bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-xs font-semibold tracking-wide">Listening...</span>
              </div>
            </div>

            {/* Bottom floating elements: Transcript bubble & Audio controls */}
            <div className="relative z-10 p-6 flex flex-col gap-4 mt-auto">
              
              {/* Transcript overlay bubble */}
              <div className="w-full bg-[#0a101f]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-2xl flex items-start gap-4">
                
                {/* Teal speaker waves */}
                <div className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 self-start mt-0.5">
                  <div className="flex items-end gap-1 h-4 w-5">
                    <span className="w-[3px] bg-teal-400 rounded-full animate-[wave-bounce_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }} />
                    <span className="w-[3px] bg-teal-400 rounded-full animate-[wave-bounce_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
                    <span className="w-[3px] bg-teal-400 rounded-full animate-[wave-bounce_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                    <span className="w-[3px] bg-teal-400 rounded-full animate-[wave-bounce_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }} />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xs text-teal-400 font-bold tracking-wider uppercase mb-1">Great! Let's start with some fundamental concepts.</p>
                  <p className="text-slate-100 text-base md:text-lg font-medium leading-relaxed">
                    Can you explain the difference between SQL and NoSQL databases?
                  </p>
                </div>
              </div>

              {/* Bottom bar inside video widget: Control Buttons & Status */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                
                {/* Listening wave indicators */}
                <div className="flex items-center gap-3">
                  <div className="flex items-end gap-1 h-3.5 w-6">
                    <span className="w-[3px] bg-teal-400 rounded-full animate-[wave-bounce_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }} />
                    <span className="w-[3px] bg-teal-400 rounded-full animate-[wave-bounce_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }} />
                    <span className="w-[3px] bg-teal-400 rounded-full animate-[wave-bounce_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }} />
                    <span className="w-[3px] bg-teal-400 rounded-full animate-[wave-bounce_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                    <span className="w-[3px] bg-teal-400 rounded-full animate-[wave-bounce_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span className="text-xs font-semibold text-teal-400 tracking-wider">Listening...</span>
                  <span className="text-xs text-slate-500 font-mono tracking-widest animate-pulse">••••••••</span>
                </div>

                {/* Main controls row */}
                <div className="flex items-center gap-6 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-6 py-2.5 rounded-2xl shadow-xl">
                  
                  {/* Mute toggle button */}
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <button 
                      onClick={() => {
                        setIsMuted(!isMuted);
                        toast.success(isMuted ? "Microphone active" : "Microphone muted", {
                          style: { background: "#0f172a", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.1)" }
                        });
                      }}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                        isMuted 
                          ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30" 
                          : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium group-hover/btn:text-slate-200 transition">
                      {isMuted ? "Unmute" : "Mute"}
                    </span>
                  </div>

                  {/* End Call Button */}
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <button 
                      onClick={handleEndInterview}
                      className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white flex items-center justify-center transition shadow-lg shadow-red-600/30 border border-red-500/50"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium group-hover/btn:text-red-400 transition">
                      End Interview
                    </span>
                  </div>

                  {/* Speaker Toggle Button */}
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <button 
                      onClick={() => {
                        setIsSpeakerOn(!isSpeakerOn);
                        toast.success(isSpeakerOn ? "Speaker muted" : "Speaker active", {
                          style: { background: "#0f172a", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.1)" }
                        });
                      }}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                        !isSpeakerOn 
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30" 
                          : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium group-hover/btn:text-slate-200 transition">
                      {isSpeakerOn ? "Speaker On" : "Speaker Off"}
                    </span>
                  </div>

                </div>

                {/* Right alignment placeholder for screen centering */}
                <div className="w-20 hidden sm:block" />
              </div>

            </div>
          </div>
        </section>

        {/* Right Side: Dashboard Panel (takes 4 cols) */}
        <section className="lg:col-span-4 flex flex-col lg:h-full lg:overflow-hidden min-h-0">
          <div className="flex-1 bg-[#070b16]/90 border border-slate-800/80 rounded-3xl p-5 shadow-2xl flex flex-col justify-between gap-6 overflow-hidden lg:h-full min-h-0">
            
            {/* Upper Content wrapper */}
            <div className="flex flex-col gap-6 overflow-hidden flex-1 min-h-0">
              
              {/* Custom styled Tabs Header */}
              <div className="flex border-b border-slate-800/80 pb-0.5">
                <button 
                  onClick={() => setActiveTab("progress")}
                  className={`flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 transition relative ${
                    activeTab === "progress" 
                      ? "text-teal-400 border-teal-500" 
                      : "text-slate-400 border-transparent hover:text-slate-200"
                  }`}
                >
                  Interview Progress
                  {activeTab === "progress" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-400 blur-[2px]" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("notes")}
                  className={`flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 transition relative ${
                    activeTab === "notes" 
                      ? "text-teal-400 border-teal-500" 
                      : "text-slate-400 border-transparent hover:text-slate-200"
                  }`}
                >
                  Interview Notes
                  {activeTab === "notes" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-400 blur-[2px]" />
                  )}
                </button>
              </div>

              {/* Dynamic Content depending on Tab selection */}
              {activeTab === "progress" ? (
                <div className="flex flex-col gap-6 overflow-y-auto pr-1 no-scrollbar flex-1 min-h-0">
                  
                  {/* Progress section */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Progress</h3>
                    
                    <div className="flex items-center gap-6 bg-slate-900/30 border border-slate-800/40 p-4 rounded-2xl">
                      {/* Radial Progress donut */}
                      <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
                        <svg className="w-24 h-24 transform -rotate-90">
                          {/* Background Track Circle */}
                          <circle 
                            cx="48" 
                            cy="48" 
                            r="36" 
                            className="stroke-slate-800/60" 
                            strokeWidth="8" 
                            fill="transparent" 
                          />
                          {/* Active Answered Progress Circle */}
                          <circle 
                            cx="48" 
                            cy="48" 
                            r="36" 
                            className="stroke-teal-500" 
                            strokeWidth="8" 
                            fill="transparent" 
                            strokeDasharray="226.2" // 2 * pi * r (36)
                            strokeDashoffset="158.3" // (1 - 0.3) * 226.2 = 30% filled
                            strokeLinecap="round"
                          />
                          {/* In Progress Segment (small gradient accent, static indicator) */}
                          <circle 
                            cx="48" 
                            cy="48" 
                            r="36" 
                            className="stroke-amber-400/80" 
                            strokeWidth="8" 
                            fill="transparent" 
                            strokeDasharray="226.2"
                            strokeDashoffset="226.2" // 0% in-progress
                            strokeLinecap="round"
                          />
                        </svg>
                        {/* Text inside the ring */}
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold font-display text-white">3</span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">/ 10</span>
                        </div>
                      </div>

                      {/* Legend right side */}
                      <div className="flex-1 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                            <span className="text-slate-400">Answered</span>
                          </div>
                          <span className="text-slate-200 font-mono">3</span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <span className="text-slate-400">In Progress</span>
                          </div>
                          <span className="text-slate-200 font-mono">0</span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                            <span className="text-slate-400">Remaining</span>
                          </div>
                          <span className="text-slate-200 font-mono">7</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Question Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Question</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-semibold font-mono text-[10px]">
                        #3
                      </span>
                    </div>

                    <div className="bg-[#090e1a] border border-slate-800/80 p-4.5 rounded-2xl">
                      <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                        Can you explain the difference between SQL and NoSQL databases?
                      </p>
                    </div>
                  </div>

                  {/* Transcript History list */}
                  <div className="flex-1 flex flex-col gap-3 min-h-[220px]">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Interview Transcript</h3>
                    
                    <div className="flex flex-col gap-3">
                      {transcriptHistory.map((item) => {
                        const isAI = item.sender === "AI";
                        const isCurrent = item.status === "current";

                        return (
                          <div 
                            key={item.id}
                            className={`p-3.5 rounded-2xl border transition-all ${
                              isCurrent 
                                ? "bg-teal-950/20 border-teal-500/40 shadow-md shadow-teal-500/5" 
                                : "bg-slate-900/40 border-slate-800/60"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              {/* Sender Profile Info */}
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  isCurrent 
                                    ? "bg-teal-500/20 text-teal-400" 
                                    : isAI 
                                      ? "bg-slate-800 text-teal-400" 
                                      : "bg-slate-800 text-slate-400"
                                }`}>
                                  {isCurrent ? (
                                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                                  ) : isAI ? (
                                    <Sparkles className="w-3.5 h-3.5" />
                                  ) : (
                                    <User className="w-3.5 h-3.5" />
                                  )}
                                </div>
                                <span className={`text-xs font-bold ${isCurrent ? "text-teal-400" : "text-slate-300"}`}>
                                  {item.senderName}
                                </span>
                              </div>
                              {/* Timestamp */}
                              <span className="text-[10px] text-slate-500 font-mono font-medium">
                                {item.timestamp}
                              </span>
                            </div>

                            <p className={`text-xs leading-relaxed ${isCurrent ? "text-teal-300 font-medium" : "text-slate-400"}`}>
                              {item.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ) : (
                /* Notes Tab */
                <div className="flex-1 flex flex-col gap-3 min-h-0">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Sandbox & Notes</h3>
                    <p className="text-[11px] text-slate-500">Write down key points, architectural draft, or queries to help organize your response.</p>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Type anything here to guide your answer flow (e.g. SQL = structured/relational, NoSQL = flexible/document)..."
                    className="flex-1 w-full bg-[#030712] border border-slate-800/80 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-all font-mono resize-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Markdown formatting is supported</span>
                    <span>{notes.length} chars</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky bottom banner of side panel */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
              {/* Soundwaves icon */}
              <div className="flex items-end gap-[1.5px] h-3 w-3.5">
                <span className="w-[1.5px] bg-slate-600 rounded-full animate-pulse" />
                <span className="w-[1.5px] bg-slate-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-[1.5px] bg-slate-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <span>Transcript updates in real-time</span>
            </div>

          </div>
        </section>

      </main>

      {/* 2. Footer status metadata bar */}
      <footer className="w-full bg-[#040810] border-t border-slate-800/80 px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
          
          {/* Card 1: Interview Type */}
          <div className="bg-slate-900/35 border border-slate-800/40 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/25 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Interview Type</span>
              <span className="text-xs font-bold text-slate-200">Technical Q&A</span>
            </div>
          </div>

          {/* Card 2: Target Role */}
          <div className="bg-slate-900/35 border border-slate-800/40 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/25 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Role</span>
              <span className="text-xs font-bold text-slate-200">Full Stack Developer</span>
            </div>
          </div>

          {/* Card 3: Experience Level */}
          <div className="bg-slate-900/35 border border-slate-800/40 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/25 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Experience Level</span>
              <span className="text-xs font-bold text-slate-200">Mid-Level (3-5 yrs)</span>
            </div>
          </div>

          {/* Card 4: Interview ID */}
          <div className="bg-slate-900/35 border border-slate-800/40 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/25 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Interview ID</span>
              <span className="text-xs font-bold text-slate-200 font-mono">INT-2024-00125</span>
            </div>
          </div>

          {/* Card 5: Secure badge */}
          <div className="col-span-2 md:col-span-1 bg-slate-900/35 border border-slate-800/40 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/25 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4.5 h-4.5 text-teal-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-400 leading-snug block">Your conversation is secure</span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">and encrypted</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
