"use client";

import { HelpCircle, Sparkles, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type TranscriptItem = {
  id: string;
  sender: "AI" | "User";
  senderName: string;
  timestamp: string;
  text: string;
};

type SidebarProps = {
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  messages: TranscriptItem[];
  currentQuestion: number;
  currentQuestionText: string;
};

const Sidebar = ({
  notes,
  setNotes,
  messages,
  currentQuestion,
  currentQuestionText,
}: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<"progress" | "notes">("progress");
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ONLY the transcript container to the bottom as messages update (never scroll the whole window/header)
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTo({
        top: transcriptContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
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
                    #{currentQuestion}
                  </span>
                </div>

                {/* Premium, visually distinct, current question box */}
                <div className="bg-gradient-to-br from-[#060a15] to-[#0c1328] border border-teal-500/25 p-5 md:p-6 rounded-2xl flex items-start gap-4 shadow-[0_0_20px_rgba(20,184,166,0.06)] transition-all duration-300 hover:border-teal-500/40">
                  <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 border border-teal-500/20 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
                    <HelpCircle className="w-6 h-6 text-teal-400 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base md:text-lg font-semibold text-white leading-relaxed">
                      {currentQuestionText || "Start the interview to receive your first question."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transcript History list - Auto-scrolling only within this inner container */}
              <div className="flex-1 flex flex-col gap-2 min-h-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TRANSCRIPT</span>
                
                <div 
                  ref={transcriptContainerRef}
                  className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 max-h-[280px] sm:max-h-[340px] lg:max-h-none"
                >
                  {messages.length === 0 ? (
                    <div className="h-full min-h-[80px] flex items-center justify-center text-slate-600 text-xs italic">
                      No conversation logs yet.
                    </div>
                  ) : (
                    <>
                      {messages.map((item) => {
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
                    </>
                  )}
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
  );
};

export default Sidebar;
