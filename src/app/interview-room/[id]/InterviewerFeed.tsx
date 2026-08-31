"use client";

import { AudioLines, Brain, Mic, PhoneOff, Sparkles } from "lucide-react";
import VoiceWave from "./VoiceWave";
import Image from "next/image";
import InterviewerImage from "@/public/interviewer.png";

type InterviewerFeedProps = {
  interviewerState: "listening" | "speaking" | "thinking";
  onEndInterview: () => void;
  hasSpoken: boolean;
  onSubmitAnswer: () => void;
};

const InterviewerFeed = ({
  interviewerState,
  onEndInterview,
  hasSpoken,
  onSubmitAnswer,
}: InterviewerFeedProps) => {

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
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-md transition-all duration-300 pointer-events-none ${
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
        <VoiceWave state={interviewerState} onMicClick={onSubmitAnswer} />

        {/* Bottom Row: Controls Overlay */}
        <div className="relative z-10 py-6 px-1 sm:px-6 flex flex-col items-center pointer-events-none mt-auto ">
          
          {/* Glassmorphic main control panel */}
          <div className="flex items-center justify-center gap-5 sm:gap-7 w-fit backdrop-blur-lg border border-slate-800/60 px-5 sm:px-7 py-2.5 sm:py-3 rounded-[20px] shadow-xl pointer-events-auto">
            
            {/* Done (Submit) button */}
            <div className="flex flex-col items-center gap-1.5 group/btn">
              <button 
                onClick={onSubmitAnswer}
                disabled={interviewerState !== "listening" || !hasSpoken}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed ${
                  interviewerState === "listening" && hasSpoken
                    ? "bg-teal-500 text-slate-950 border border-teal-400 hover:bg-teal-400 hover:text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.4)] animate-pulse"
                    : "bg-slate-900/60 text-slate-500 border border-slate-800/80"
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition ${
                interviewerState === "listening" && hasSpoken ? "text-teal-400" : "text-slate-500"
              }`}>
                Done
              </span>
            </div>

            {/* End Interview Button */}
            <div className="flex flex-col items-center gap-1.5 group/btn">
              <button 
                onClick={onEndInterview}
                className="w-12 h-12 rounded-full cursor-pointer bg-[#ef4444] hover:bg-red-500 active:scale-95 text-white flex items-center justify-center transition shadow-lg shadow-red-600/30 border border-red-500/40"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover/btn:text-red-400 transition">
                End Call
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default InterviewerFeed;
