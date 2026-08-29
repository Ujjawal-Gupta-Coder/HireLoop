"use client";

import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import InterviewerFeed from "./InterviewerFeed";
import Sidebar from "./Sidebar";

type InterviewRoomClientProps = {
  type: string
}

export default function InterviewRoomClient({type: interviewType}: InterviewRoomClientProps) {

  // Timer state
  const [timeElapsed, setTimeElapsed] = useState(0); 
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Notes
  const [notes, setNotes] = useState<string>("");

  // Questions
  const totalQuestion = 10;
  const [currentQuestion, setCurrentQuestion] = useState(4);

  // Start ticking timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
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
      <Header timeElapsed={timeElapsed} type={interviewType} currentQuestion={currentQuestion} totalQuestion={totalQuestion}/>

      {/* Main Container Wrapper */}
      <main className="flex-1 mx-4 sm:mx-8 mb-6 border border-slate-900 rounded-[24px] bg-[#030712]/40 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-0 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Side: Video/Interviewer feed */}
        <InterviewerFeed />

        {/* Right Side: Dashboard Panel */}
        <Sidebar notes={notes} setNotes={setNotes} />

      </main>

    </div>
  );
}

