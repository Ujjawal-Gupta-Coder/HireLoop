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
  HelpCircle,
  AudioLines,
  Brain,
} from "lucide-react";
import LOGO from "@/public/logo.svg"
import toast from "react-hot-toast";
import Image from "next/image";
import BottomLineFooter from "@/src/components/BottomLineFooter";

// Types for components
type TranscriptItem = {
  id: string;
  sender: "AI" | "User";
  senderName: string;
  timestamp: string;
  text: string;
};

export default function InterviewRoomPage() {
  // Active tab: 'progress' | 'notes'
  const [activeTab, setActiveTab] = useState<"progress" | "notes">("progress");
  
  // Interviewer states: 'listening' | 'speaking' | 'thinking'
  const [interviewerState, setInterviewerState] = useState<"listening" | "speaking" | "thinking">("listening");
  
  // Timer state
  const [timeElapsed, setTimeElapsed] = useState(0); 
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

  // Mock list of conversation items matching the mockup transcript layout
  const transcriptHistory: TranscriptItem[] = [
    {
      id: "t1",
      sender: "AI",
      senderName: "AI Interviewer",
      timestamp: "04:12 PM",
      text: "Tell me about yourself and your background.",
    },
    {
      id: "t2",
      sender: "User",
      senderName: "You",
      timestamp: "04:13 PM",
      text: "I have around 4 years of experience in full stack development. I enjoy building scalable web applications and solving complex problems.",
    },
    {
      id: "t3",
      sender: "AI",
      senderName: "AI Interviewer",
      timestamp: "04:14 PM",
      text: "Great! Let's talk about databases. Can you explain the difference between SQL and NoSQL databases?",
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
    <> 
    <div className="lg:h-screen lg:overflow-hidden min-h-screen bg-[#020408] text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500/20">
      
      {/* Dynamic styles for state wave animations */}
      <style jsx global>{`
        @keyframes wave-listening {
          0%, 100% {
            transform: scaleY(0.25);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        @keyframes wave-speaking {
          0%, 100% {
            transform: scaleY(0.15);
            opacity: 0.45;
          }
          50% {
            transform: scaleY(1.85);
            opacity: 1;
          }
        }
        @keyframes wave-thinking {
          0%, 100% {
            transform: scaleY(0.35);
            opacity: 0.25;
          }
          50% {
            transform: scaleY(0.55);
            opacity: 0.75;
          }
        }

        .wave-bar-listening {
          animation: wave-listening 1.2s ease-in-out infinite;
          transform-origin: center;
        }
        .wave-bar-speaking {
          animation: wave-speaking 0.65s ease-in-out infinite;
          transform-origin: center;
        }
        .wave-bar-thinking {
          animation: wave-thinking 2.2s ease-in-out infinite;
          transform-origin: center;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0d9488;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0ea5e9;
        }
      `}</style>

      {/* 1. Header component */}
      <header className="w-full px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-4 sticky top-0 z-30 bg-[#020408]">
        
        {/* Left section: Logo & Title badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center bg-primary-dark rounded-xl shadow-lg shadow-primary-shadow/30">
                <Image src={LOGO} alt="Logo" fill />
            </div>

            <span className="font-bold font-display text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:text-white transition">
              HireLoop
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800/80 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2.5">
            <span className="font-semibold text-sm text-slate-200 hidden lg:block ">Technical Interview</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <AudioLines className="w-3 h-3 text-teal-400" />
              Voice Interview
            </div>
          </div>
        </div>

        {/* Center section: Progress bar */}
        <div className="hidden md:flex items-center gap-3.5 text-sm">
          <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">PROGRESS</span>
          <div className="w-36 h-2 bg-slate-900 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full w-[30%] transition-all duration-500 shadow-[0_0_10px_rgba(20,184,166,0.4)]" />
          </div>
          <span className="font-bold text-slate-200 text-sm font-mono">3 / 10</span>
        </div>

        {/* Right section: Timer widget */}
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-teal-400" />
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold text-white tracking-wider leading-none">
              {formatTime(timeElapsed)}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 leading-none">Time Elapsed</span>
          </div>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="flex-1 mx-4 sm:mx-8 mb-6 border border-slate-900 rounded-[24px] bg-[#030712]/40 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-0 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Side: Video/Interviewer feed */}
        <section className="lg:col-span-8 flex flex-col lg:h-full lg:overflow-hidden min-h-[500px] sm:min-h-[560px] lg:min-h-0 relative">
          
          {/* Main Interviewer Video mock card */}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 flex flex-col justify-between group min-h-[460px] sm:min-h-[520px] lg:min-h-0">
            
            {/* Background image: Simulated webcam connection */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/interviewer.png" 
                alt="AI Interviewer" 
                className="w-full h-full object-cover brightness-[0.8] contrast-[1.02] group-hover:scale-[1.005] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
            </div>

            {/* Top Row: Overlay status badges */}
            <div className="relative z-10 p-5 flex items-center justify-between pointer-events-none">
              
              {/* AI Interviewer Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/5 shadow-md">
                <div className="w-5 h-5 rounded-full bg-teal-500/10 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                </div>
                <span className="text-[10px] md:text-xs font-bold text-white tracking-wide">AI Interviewer</span>
              </div>

              {/* Dynamic Status Badge */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-md transition-all duration-300 ${
                interviewerState === "listening"
                  ? "bg-teal-500/10 border-teal-500/30 text-teal-400 shadow-teal-500/5"
                  : interviewerState === "speaking"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-cyan-500/5"
                    : "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-purple-500/5"
              }`}>
                {interviewerState === "listening" && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-[10px] md:text-xs font-semibold tracking-wide">Listening...</span>
                    <div className="flex items-end gap-[2px] h-2.5 w-3 ml-0.5">
                      <span className="w-[2px] h-full bg-teal-400 rounded-full animate-[wave-bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }} />
                      <span className="w-[2px] h-full bg-teal-400 rounded-full animate-[wave-bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }} />
                      <span className="w-[2px] h-full bg-teal-400 rounded-full animate-[wave-bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }} /> 
                    </div>
                  </>
                )}
                {interviewerState === "speaking" && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[10px] md:text-xs font-semibold tracking-wide">Speaking...</span>
                    <AudioLines className="w-3.5 h-3.5 ml-0.5 animate-pulse" />
                  </>
                )}
                {interviewerState === "thinking" && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-[10px] md:text-xs font-semibold tracking-wide">Thinking...</span>
                    <Brain className="w-3.5 h-3.5 ml-0.5 animate-[spin_4s_linear_infinite]" />
                  </>
                )}
              </div>

            </div>

            {/* Middle/Bottom: Audio Wave Overlay & Center Microphone */}
            <VoiceWave state={interviewerState} />

            {/* Bottom Row: Controls Overlay */}
            <div className="relative z-10 py-6 px-1 sm:px-6 flex flex-col items-center pointer-events-none mt-auto ">
              
              {/* Glassmorphic main control panel bg-slate-950/75 */}
              <div className="flex items-center justify-center gap-5 sm:gap-7 w-fit backdrop-blur-lg border border-slate-800/60 px-5 sm:px-7 py-2.5 sm:py-3 rounded-[20px] shadow-xl pointer-events-auto">
                
                {/* Mute button */}
                <div className="flex flex-col items-center gap-1.5 group/btn">
                  <button 
                    onClick={() => {
                      setIsMuted(!isMuted);
                      toast.success(isMuted ? "Microphone active" : "Microphone muted", {
                        style: { background: "#0a0f1d", color: "#f8fafc", border: "1px solid rgba(20,184,166,0.1)" }
                      });
                    }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isMuted 
                        ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]" 
                        : "bg-slate-900/60 text-slate-300 border border-slate-800/80 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover/btn:text-slate-200 transition">
                    Mute
                  </span>
                </div>

                {/* End Interview Button */}
                <div className="flex flex-col items-center gap-1.5 group/btn">
                  <button 
                    onClick={handleEndInterview}
                    className="w-12 h-12 rounded-full cursor-pointer bg-[#ef4444] hover:bg-red-500 active:scale-95 text-white flex items-center justify-center transition shadow-lg shadow-red-600/30 border border-red-500/40"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover/btn:text-red-400 transition">
                    End Interview
                  </span>
                </div>

                {/* Speaker Toggle Button */}
                <div className="flex flex-col items-center gap-1.5 group/btn">
                  <button 
                    onClick={() => {
                      setIsSpeakerOn(!isSpeakerOn);
                      toast.success(isSpeakerOn ? "Speaker muted" : "Speaker active", {
                        style: { background: "#0a0f1d", color: "#f8fafc", border: "1px solid rgba(20,184,166,0.1)" }
                      });
                    }}
                    className={`w-11 h-11 rounded-full cursor-pointer flex items-center justify-center transition-all ${
                      !isSpeakerOn 
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]" 
                        : "bg-slate-900/60 text-slate-300 border border-slate-800/80 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover/btn:text-slate-200 transition wrap-break-word ">
                    Speaker On
                  </span>
                </div>

              </div>

            </div>

            {/* Test switcher panel - absolutely positioned floating pill at top-center */}
            {/* <div className="absolute top-18 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-full px-2 py-1 shadow-lg pointer-events-auto">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2 pr-1">TEST STATE:</span>
              <button 
                onClick={() => setInterviewerState("listening")}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  interviewerState === "listening"
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                }`}
              >
                Listening
              </button>
              <button 
                onClick={() => setInterviewerState("speaking")}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  interviewerState === "speaking"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                }`}
              >
                Speaking
              </button>
              <button 
                onClick={() => setInterviewerState("thinking")}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  interviewerState === "thinking"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                }`}
              >
                Thinking
              </button>
            </div> */}

          </div>
        </section>

        {/* Right Side: Dashboard Panel */}
        <section className="lg:col-span-4 flex flex-col lg:h-full lg:overflow-hidden min-h-[380px] lg:min-h-0">
          <div className="flex-1 bg-[#030712]/30 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between gap-5 overflow-hidden lg:h-full min-h-0">
            
            {/* Upper Content wrapper */}
            <div className="flex flex-col gap-5 overflow-hidden flex-1 min-h-0">
              
              {/* Custom styled Tabs Header */}
              <div className="flex border-b border-slate-900 pb-0.5">
                <button 
                  onClick={() => setActiveTab("progress")}
                  className={`flex-1 pb-3 text-[12px] md:text-sm font-semibold tracking-wide border-b-2 transition cursor-pointer relative ${
                    activeTab === "progress" 
                      ? "text-teal-400 border-teal-500" 
                      : "text-slate-500 border-transparent hover:text-slate-300"
                  }`}
                >
                  Interview Progress
                  {activeTab === "progress" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-400 blur-[2px]" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("notes")}
                  className={`flex-1 pb-3 text-[12px] md:text-sm font-semibold tracking-wide border-b-2 transition cursor-pointer relative ${
                    activeTab === "notes" 
                      ? "text-teal-400 border-teal-500" 
                      : "text-slate-500 border-transparent hover:text-slate-300"
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
                <div className="flex flex-col gap-5 overflow-hidden flex-1 min-h-0">
                  
                  {/* Current Question Section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CURRENT QUESTION</span>
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold font-mono text-[10px]">
                        #3
                      </span>
                    </div>

                    {/* Premium, visually distinct, larger current question box */}
                    <div className="bg-gradient-to-br from-[#060a15] to-[#0c1328] border border-teal-500/25 p-5 md:p-6 rounded-2xl flex items-start gap-4 shadow-[0_0_20px_rgba(20,184,166,0.06)] transition-all duration-300 hover:border-teal-500/40">
                      <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 border border-teal-500/20 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
                        <HelpCircle className="w-6 h-6 text-teal-400 animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base md:text-lg font-semibold text-white leading-relaxed">
                          Can you explain the difference between SQL and NoSQL databases?
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transcript History list */}
                  <div className="flex-1 flex flex-col gap-2 min-h-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TRANSCRIPT</span>
                    
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                      {transcriptHistory.map((item) => {
                        const isAI = item.sender === "AI";

                        return (
                          <div 
                            key={item.id}
                            className={`p-4 rounded-xl border ${
                              isAI 
                                ? "bg-slate-900/10 border-slate-900/40" 
                                : "bg-slate-900/25 border-slate-900/60"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              {/* Sender Profile Info */}
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  isAI 
                                    ? "bg-teal-500/10 text-teal-400" 
                                    : "bg-teal-500/10 text-teal-400"
                                }`}>
                                  {isAI ? (
                                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                                  ) : (
                                    <User className="w-3.5 h-3.5 text-teal-400" />
                                  )}
                                </div>
                                <span className={`text-xs font-bold ${isAI ? "text-slate-300" : "text-teal-400"}`}>
                                  {item.senderName}
                                </span>
                              </div>
                              {/* Timestamp */}
                              <span className="text-[10px] text-slate-500 font-mono font-medium">
                                {item.timestamp}
                              </span>
                            </div>

                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                              {item.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ) : (
                /* Simplified Notes Tab for candidate writing only */
                <div className="flex-1 flex flex-col min-h-0">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Type your notes here..."
                    className="flex-1 w-full bg-[#030712]/60 border border-slate-900 rounded-xl p-5 text-sm md:text-base text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500/30 transition-all font-sans resize-none"
                  />
                </div>
              )}
            </div>

            {/* Sticky bottom banner of side panel */}
            <div className="pt-3 border-t border-slate-900 flex items-center justify-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-end gap-[1.5px] h-2.5 w-3">
                <span className="w-[1.5px] bg-slate-700 rounded-full animate-pulse" />
                <span className="w-[1.5px] bg-slate-700 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-[1.5px] bg-slate-700 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <span>Transcript updates in real-time</span>
            </div>

          </div>
        </section>

      </main>

    </div>

    <BottomLineFooter />
    </>
  );
}

// Subcomponent for the horizontal sound wave around the central glowing mic button
function VoiceWave({ state }: { state: "listening" | "speaking" | "thinking" }) {
  // Height configurations for the sound wave bars
  const leftHeights = [6, 10, 8, 14, 10, 20, 12, 24, 16, 20, 10, 14, 8, 10];
  const rightHeights = [10, 8, 14, 10, 20, 16, 24, 12, 20, 10, 14, 8, 10, 6];

  let barClass = "wave-bar-listening";
  if (state === "speaking") {
    barClass = "wave-bar-speaking";
  } else if (state === "thinking") {
    barClass = "wave-bar-thinking";
  }

  return (
    <div className="absolute bottom-[26%] md:bottom-[23%] lg:bottom-[21%] left-0 right-0 flex items-center justify-center gap-1.5 px-6 z-20 pointer-events-none">
      
      {/* Left side wave */}
      <div className="flex items-center gap-1.5">
        {/* 10 dots */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={`left-dot-${i}`} 
            className="w-1.5 h-1.5 rounded-full bg-teal-500/40 transition-all duration-500"
            style={{
              opacity: state === "thinking" ? 0.2 + Math.sin(i * 0.55) * 0.2 : 0.6,
              transform: state === "thinking" ? `scale(${0.75 + Math.sin(i * 0.55) * 0.25})` : "none",
            }}
          />
        ))}
        {/* 14 bars */}
        {leftHeights.map((height, i) => {
          // ripple effect delay (closer to center means smaller delay)
          const delay = (13 - i) * 0.055;
          return (
            <div 
              key={`left-bar-${i}`} 
              className={`w-[2.5px] rounded-full bg-teal-400 ${barClass}`}
              style={{
                height: `${height}px`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Center glowing microphone circle */}
      <div className="relative mx-3 flex items-center justify-center min-w-10 min-h-10 rounded-full bg-[#020408]/95 border border-teal-500/40 shadow-[0_0_24px_rgba(20,184,166,0.35)] pointer-events-auto group active:scale-95 transition-all">
        {state === "listening" && (
          <div className="absolute inset-0 rounded-full border border-teal-500/30 animate-ping opacity-60 pointer-events-none" />
        )}
        {state === "speaking" && (
          <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-80 pointer-events-none" style={{ animationDuration: "1.1s" }} />
        )}
        {state === "thinking" && (
          <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-pulse opacity-40 pointer-events-none" />
        )}
        <Mic className="w-6 h-6 text-teal-400 group-hover:scale-105 transition-transform" />
      </div>

      {/* Right side wave */}
      <div className="flex items-center gap-1.5">
        {/* 14 bars */}
        {rightHeights.map((height, i) => {
          // ripple effect delay (closer to center means smaller delay)
          const delay = i * 0.055;
          return (
            <div 
              key={`right-bar-${i}`} 
              className={`w-[2.5px] rounded-full bg-teal-400 ${barClass}`}
              style={{
                height: `${height}px`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
        {/* 10 dots */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={`right-dot-${i}`} 
            className="w-1.5 h-1.5 rounded-full bg-teal-500/40 transition-all duration-500"
            style={{
              opacity: state === "thinking" ? 0.2 + Math.sin((i + 10) * 0.55) * 0.2 : 0.6,
              transform: state === "thinking" ? `scale(${0.75 + Math.sin((i + 10) * 0.55) * 0.25})` : "none",
            }}
          />
        ))}
      </div>

    </div>
  );
}
