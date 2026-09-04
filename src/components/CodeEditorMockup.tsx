const CodeEditorMockup = () => {
  return (
    <div className="max-w-5xl mx-auto w-full mb-24 mt-12 relative px-4 lg:px-0">
  {/* Subtle background glow behind the mockup */}
  <div className="absolute inset-0 bg-brand-teal/5 rounded-3xl blur-3xl pointer-events-none -z-10 transform scale-90" />

  {/* Main Showcase Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">

    {/* LEFT COLUMN: Code Editor + Voice Panel */}
    <div className="lg:col-span-7 flex flex-col justify-between relative group min-h-[380px] lg:min-h-0">

      {/* VS Code–style Coding Interview Editor */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col h-full hover:border-teal-500/30 transition-all duration-300">

        {/* Editor Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/40 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/70 block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70 block" />
            <span className="w-3 h-3 rounded-full bg-green-500/70 block" />
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center space-x-1.5 bg-slate-900/60 px-3 py-1 rounded-md border border-white/5">
            <span className="text-teal-400">⚡</span>
            <span>solution.js</span>
          </div>

          <div className="w-12" />
        </div>

        {/* Editor Workspace */}
        <div className="p-5 font-mono text-xs text-left overflow-x-auto leading-relaxed bg-[#0F1210]/95 flex-grow no-scrollbar">

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">1</span>
            <span className="text-teal-450 text-teal-400">function</span>{" "}
            <span className="text-yellow-300">twoSum</span>(
            <span>nums, target</span>) {"{"}
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">2</span>
            <span>  </span>
            <span className="text-teal-450 text-teal-400">const</span>{" "}
            map = <span className="text-teal-450 text-teal-400">new</span>{" "}
            <span className="text-yellow-300">Map</span>();
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">3</span>
            <span>  </span>
            <span className="text-teal-450 text-teal-400">for</span>{" "}
            ({" "}
            <span className="text-teal-450 text-teal-400">let</span>{" "}
            i = 0; i &lt; nums.length; i++) {"{"}
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">4</span>
            <span>    </span>
            <span className="text-teal-450 text-teal-400">const</span>{" "}
            complement = target - nums[i];
          </div>

          <div className="flex bg-teal-950/20 border-l-2 border-teal-500 -mx-5 px-5 py-0.5">
            <span className="w-6 text-teal-600 select-none">5</span>
            <span className="text-slate-500 italic">
              // 💡 Check if complement was already seen
            </span>
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">6</span>
            <span>    </span>
            <span className="text-teal-450 text-teal-400">if</span>{" "}
            (map.has(complement)) {"{"}
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">7</span>
            <span>      </span>
            <span className="text-teal-450 text-teal-400">return</span>{" "}
            [map.get(complement), i];
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">8</span>
            <span>    {"}"}</span>
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">9</span>
            <span>    map.set(nums[i], i);</span>
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">10</span>
            <span>  {"}"}</span>
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">11</span>
            <span>  </span>
            <span className="text-teal-450 text-teal-400">return</span>{" "}
            [];
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">12</span>
            <span>{"}"}</span>
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">13</span>
            <span></span>
          </div>

          <div className="flex">
            <span className="w-6 text-slate-600 select-none">14</span>
            <span className="text-slate-500 italic">
              // Time: O(n) | Space: O(n)
            </span>
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

            {/* Live Waveform graphic using small SVG peaks */}
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
              "Can you walk me through your approach to the Two Sum problem?"
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
              "I'll use a hash map to store the numbers I've already seen. For each element, I'll check whether its complement exists in the map..."
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
              "Good. What would be the time and space complexity of your solution?"
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 pt-3 mt-4 text-[10px] text-slate-500 italic flex items-center justify-between">
          <span>Transcript captured</span>
          <span className="text-teal-450">3 messages</span>
        </div>
      </div>

      {/* Floating Overlapping AI Report Card */}
      <div className="absolute -top-12 -right-8 w-64 glass-panel-highlight rounded-2xl p-4 border shadow-2xl hover:border-teal-500/50 transition-all duration-300 animate-float-delayed hidden sm:block">

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
              <span>Coding Efficiency</span>
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

export default CodeEditorMockup
