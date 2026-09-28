import { Check } from 'lucide-react'

const SubmitSpeechUI = ({onSubmitAnswer}: {onSubmitAnswer: () => void}) => {
  return (
    <div className="absolute bottom-28 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
  <button
    onClick={onSubmitAnswer}
    className="
      group relative flex items-center gap-3
      px-5 sm:px-6 py-3
      rounded-full
      bg-white/8 backdrop-blur-xl
      border border-white/15
      text-white font-medium text-xs sm:text-sm
      tracking-wide
      shadow-[0_8px_32px_rgba(0,0,0,0.25),0_0_25px_rgba(20,184,166,0.15)]
      hover:bg-white/12
      hover:border-teal-300/40
      hover:shadow-[0_8px_40px_rgba(0,0,0,0.3),0_0_35px_rgba(20,184,166,0.3)]
      cursor-pointer
      active:scale-95
      transition-all duration-300
      overflow-hidden
    "
  >
    {/* Glass shine */}
    <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

    {/* Status indicator */}
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-40 animate-ping" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
    </span>

    <span className="relative">Submit Answer</span>

    {/* Arrow / check container */}
    <span className="
      relative flex items-center justify-center
      w-7 h-7
      rounded-full
      bg-teal-400/15
      border border-teal-300/20
      group-hover:bg-teal-400/25
      group-hover:border-teal-300/40
      group-hover:scale-110
      transition-all duration-300
    ">
      <Check className="w-3.5 h-3.5 text-teal-300 stroke-[2.5]" />
    </span>
  </button>
</div>
  )
}

export default SubmitSpeechUI
