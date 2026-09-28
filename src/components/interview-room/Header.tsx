import Image from "next/image"
import LOGO from "@/public/logo.svg"
import { AudioLines, Clock } from "lucide-react"
import { formatIdIntoLabel } from "@/src/helper/helper.common"

type HeaderProps = {
    timeElapsed: number
    type: string
    currentQuestion: number
    totalQuestion: number
}

const Header = ({timeElapsed, type, currentQuestion, totalQuestion}: HeaderProps) => {
    
    const formatTime = (secs: number) => {
        const minutes = Math.floor(secs / 60);
        const seconds = secs % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

  return (
    <header className="w-full px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-4 sticky top-0 z-30 bg-[#020408]">
        
        {/* Left section: Logo & Title badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center bg-primary-dark rounded-xl shadow-lg shadow-primary-shadow/30">
                <Image src={LOGO} alt="Logo" fill />
            </div>

            <span className="font-bold font-display text-xl tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:text-white transition">
              HireLoop
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800/80 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2.5">
            <span className="font-semibold text-sm text-slate-200 hidden lg:block ">{formatIdIntoLabel(type)}</span>
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
            <div className="absolute top-0 left-0 h-full bg-linear-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(20,184,166,0.4)]" style={{width: `${currentQuestion / totalQuestion * 100}%`}} />
          </div>
          <span className="font-bold text-slate-200 text-sm font-mono"> {currentQuestion} / {totalQuestion}</span>
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
  )
}

export default Header
