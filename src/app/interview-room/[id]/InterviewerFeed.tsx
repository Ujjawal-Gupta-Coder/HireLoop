"use client";

import { AudioLines, Brain, Mic, MicOff, PhoneOff, Sparkles, Volume2, VolumeX } from "lucide-react";
import toast from "react-hot-toast";
import VoiceWave from "./VoiceWave";
import Image from "next/image";
import InterviewerImage from "@/public/interviewer.png"
import { useState } from "react";

const InterviewerFeed = () => {

    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);

    const [interviewerState, setInterviewerState] = useState<"listening" | "speaking" | "thinking">("listening");

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
    <section className="lg:col-span-8 flex flex-col lg:h-full lg:overflow-hidden min-h-[500px] sm:min-h-[560px] lg:min-h-0 relative">
          
          {/* Main Interviewer Video mock card */}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 flex flex-col justify-between group min-h-[460px] sm:min-h-[520px] lg:min-h-0">
            
            {/* Background image: Simulated webcam connection */}
            <div className="absolute inset-0 z-0">
              <Image 
                src={InterviewerImage}
                alt="AI Interviewer" 
                fill
                className="object-cover brightness-[0.8] contrast-[1.02] group-hover:scale-[1.005] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-slate-950/30" />
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
  )
}

export default InterviewerFeed
