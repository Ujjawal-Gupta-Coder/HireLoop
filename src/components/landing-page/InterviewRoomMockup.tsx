import Image from "next/image";
import { Mic, Volume2, PhoneOff, Sparkles } from "lucide-react";

const InterviewRoomMockup = () => {
  return (
   <div className="max-w-5xl mx-auto w-full mb-24 mt-12 relative px-4 lg:px-0">
      {/* Subtle background glow behind the mockup */}
      <div className="absolute inset-0 bg-brand-teal/5 rounded-3xl blur-3xl pointer-events-none -z-10 transform scale-90" />

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">

        {/* LEFT COLUMN: Digital Interview Room + Voice Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between relative group min-h-[440px] lg:min-h-0">

          {/* Digital Interview Room Window Container */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col h-full hover:border-teal-500/30 transition-all duration-300">

            {/* Room Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/70 border-b border-white/5 backdrop-blur-md z-10">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/70 block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70 block" />
                <span className="w-3 h-3 rounded-full bg-green-500/70 block" />
              </div>

              <div className="text-xs font-mono text-slate-300 flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded-md border border-white/5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-teal-400 font-bold">LIVE</span>
                <span className="text-slate-600">|</span>
                <span>Room #HL-204</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 border border-teal-500/20 px-2 py-0.5 rounded font-semibold">
                  1080p HD
                </span>
              </div>
            </div>

            {/* Main Video Room Workspace */}
            <div className="relative w-full flex-grow min-h-[380px] sm:min-h-[440px] overflow-hidden bg-slate-950 flex flex-col justify-between">
              
              {/* AI Interviewer Video Feed */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/interviewer.png"
                  alt="AI Interviewer in Digital Interview Room"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-top brightness-[0.88] contrast-[1.03] group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                />
                {/* Atmospheric gradient overlay for contrast & readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/50 pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5 pointer-events-none" />
              </div>

              {/* Video Top Overlay */}
              <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
                {/* REC Status Badge */}
                <div className="flex items-center space-x-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-white font-mono text-[10px] font-bold tracking-wider">REC</span>
                  <span className="text-slate-400 font-mono text-[10px]">00:05:24</span>
                </div>

                {/* AI Interviewer Badge */}
                <div className="flex items-center space-x-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-500/25 shadow-lg">
                  <div className="w-4 h-4 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-teal-400" />
                  </div>
                  <span className="text-[10px] font-bold text-white tracking-wide">AI Interviewer</span>
                </div>
              </div>

              {/* Video Bottom Overlay */}
              <div className="relative z-10 p-4 flex items-end justify-between pointer-events-none mt-auto">

                {/* Video Meeting Floating Dock Controls */}
                <div className="hidden md:flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-xl pointer-events-auto">
                  <div className="p-1.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    <Mic className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1.5 rounded-full bg-slate-900 text-slate-300 border border-white/5">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  {/* <div className="h-3.5 w-px bg-white/10 mx-0.5" /> */}
                  <div className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-semibold flex items-center space-x-1">
                    <PhoneOff className="w-3 h-3" />
                    <span>End</span>
                  </div>
                </div>

                {/* Candidate PIP (Picture-In-Picture) Preview */}
                <div className="flex flex-col w-28 h-20 bg-slate-900/90 backdrop-blur-md rounded-xl border border-teal-500/30 overflow-hidden shadow-2xl relative">
                  <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-1.5">
                    <div className="w-7 h-7 rounded-full bg-slate-700/80 border border-white/10 flex items-center justify-center text-slate-200 text-[10px] font-bold mb-1">
                      YOU
                    </div>
                    <span className="text-[9px] font-medium text-slate-300 truncate max-w-full">Candidate</span>
                    <div className="absolute top-1.5 right-1.5 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    </div>
                    <div className="absolute bottom-1 left-2 flex items-center space-x-1">
                      <span className="text-[8px] text-teal-400 font-mono">Mic Live</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Overlapping AI Voice Panel */}
          <div className="absolute -bottom-6 -left-6 w-72 glass-panel rounded-2xl p-4 border border-teal-500/20 shadow-2xl shadow-black/60 hover:border-teal-500/45 transition-all duration-300 animate-float hidden sm:block">

            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center space-x-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span className="text-teal-400">Voice Interview</span>
              </span>

              <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                05:24
              </span>
            </div>

            <div className="flex items-center space-x-3 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xs font-semibold animate-pulse shrink-0">
                🎙️
              </div>

              <div className="flex-grow">
                <div className="text-[10px] font-bold text-white flex justify-between">
                  <span>Interviewer AI</span>
                  <span className="text-teal-400 font-normal">Listening...</span>
                </div>

                {/* Voice Wave Animation  */}
                <div className="flex items-center space-x-0.5 mt-1.5 h-4">
                  <div className="w-[3px] bg-teal-500 rounded-full h-2 animate-wave-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-[3px] bg-teal-400 rounded-full h-3 animate-wave-bounce" style={{ animationDelay: '0.3s' }} />
                  <div className="w-[3px] bg-teal-500 rounded-full h-1 animate-wave-bounce" style={{ animationDelay: '0.5s' }} />
                  <div className="w-[3px] bg-emerald-400 rounded-full h-4 animate-wave-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-[3px] bg-teal-500 rounded-full h-2 animate-wave-bounce" style={{ animationDelay: '0.4s' }} />
                  <div className="w-[3px] bg-teal-400 rounded-full h-3.5 animate-wave-bounce" style={{ animationDelay: '0.7s' }} />
                  <div className="w-[3px] bg-teal-500 rounded-full h-1 animate-wave-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-[3px] bg-emerald-500 rounded-full h-2 animate-wave-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Chat Transcript + Report Card + Analytics */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 relative min-h-[380px] lg:min-h-0">

          {/* Conversation Transcript Panel */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-2xl flex flex-col justify-between h-full hover:border-teal-500/30 transition-all duration-300">

            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Transcription
              </span>

              <span className="text-[9px] px-2 py-0.5 bg-slate-900 border border-white/5 text-slate-400 rounded-md font-mono">
                Interview Transcript
              </span>
            </div>

            <div className="space-y-4 text-xs text-left font-sans flex-grow">

              {/* AI Bubble */}
              <div className="flex items-start space-x-2.5">
                <div className="w-6 h-6 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-[10px] text-teal-400 font-bold shrink-0">
                  AI
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl rounded-tl-none border border-white/5 text-slate-300 leading-relaxed flex-1">
                  <span className="font-semibold text-white block mb-0.5 text-[10px]">
                    Interviewer
                  </span>
                  &ldquo;How would you design a distributed cache layer to prevent cache stampedes under heavy traffic?&rdquo;
                </div>
              </div>

              {/* Candidate Bubble */}
              <div className="flex items-start space-x-2.5">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">
                  ME
                </div>

                <div className="bg-teal-950/20 p-3 rounded-2xl rounded-tl-none border border-teal-500/10 text-slate-200 leading-relaxed flex-1">
                  <span className="font-semibold text-teal-400 block mb-0.5 text-[10px] flex items-center justify-between">
                    <span>Candidate</span>
                    <span className="text-[8px] bg-teal-500/10 border border-teal-500/20 px-1 rounded text-teal-300">
                      24 sec
                    </span>
                  </span>
                  &ldquo;I would use probabilistic early expiration like the XFetch algorithm, combined with distributed mutex locks on cache misses and Redis read replicas...&rdquo;
                </div>
              </div>

              {/* AI Follow-up Bubble */}
              <div className="flex items-start space-x-2.5">
                <div className="w-6 h-6 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-[10px] text-teal-400 font-bold shrink-0">
                  AI
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl rounded-tl-none border border-white/5 text-slate-300 leading-relaxed flex-1">
                  <span className="font-semibold text-white block mb-0.5 text-[10px]">
                    Interviewer
                  </span>
                  &ldquo;Excellent. How do you handle cache invalidation consistency across multiple service replicas?&rdquo;
                </div>
              </div>

            </div>

            <div className="border-t border-white/5 pt-3 mt-4 text-[10px] text-slate-500 italic flex items-center justify-between">
              <span>Transcript captured</span>
              <span className="text-teal-400">3 messages</span>
            </div>
          </div>

          {/* Floating Overlapping AI Report Card */}
          <div className="absolute -top-14 -right-4 sm:-right-6 lg:-right-8 w-60 sm:w-64 glass-panel-highlight rounded-2xl p-4 border shadow-2xl hover:border-teal-500/50 transition-all duration-300 animate-float-delayed hidden sm:block z-20">

            <div className="flex items-center justify-between border-b border-teal-500/20 pb-2 mb-3">
              <span className="text-[10px] font-bold tracking-wider text-teal-400 uppercase">
                AI Evaluation
              </span>

              <span className="text-xs font-bold text-white bg-teal-600/30 border border-teal-500/30 px-2 py-0.5 rounded-full">
                Score: 91%
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-left">

              <div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-0.5">
                  <span>Communication Skills</span>
                  <span className="text-teal-400">95%</span>
                </div>

                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full w-[95%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-0.5">
                  <span>Technical Knowledge</span>
                  <span className="text-teal-400">92%</span>
                </div>

                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full w-[92%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-0.5">
                  <span>Problem Solving</span>
                  <span className="text-teal-400">88%</span>
                </div>

                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full w-[88%]" />
                </div>
              </div>

            </div>
          </div>

          {/* Floating Overlapping Interview Progress Panel */}
          <div className="absolute -bottom-8 -right-4 w-52 glass-panel rounded-2xl p-3.5 border border-white/10 shadow-2xl shadow-black/50 hover:border-teal-500/30 transition-all duration-300 animate-float hidden md:block">

            <div className="flex items-center justify-between">

              <div className="text-left">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block">
                  Interview Progress
                </span>

                <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span>6 of 8 Questions</span>
                  <span className="text-teal-400 text-xs">✓</span>
                </span>
              </div>

              <div className="w-14 h-6 text-right">
                {/* Tiny SVG sparkline representing interview progress */}
                <svg
                  className="w-full h-full text-teal-500"
                  viewBox="0 0 50 20"
                  fill="none"
                >
                  <path
                    d="M0 15 L10 12 L20 18 L30 8 L40 5 L50 2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewRoomMockup
