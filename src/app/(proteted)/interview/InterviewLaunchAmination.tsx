import { Loader, Sparkles } from "lucide-react"

type InterviewLaunchAminationProps = {
    launchStep: number
}

const InterviewLaunchAmination = ({launchStep}: InterviewLaunchAminationProps) => {
    const launchStepsText = [
          "Configuring AI Interview Parameters...",
          "Analyzing selected skills & difficulty context...",
          "Injecting developer experience profile details...",
          "Tailoring custom system coding sandbox...",
          "Initializing AI voice and conversational engine...",
          "Setting up secure exam room environment...",
          "Ready! Entering room..."
        ];
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-8 bg-[#0B1120] relative min-h-[80vh]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse-glow" />
        
        <div className="max-w-md w-full text-center space-y-6 relative z-10 glass-panel-highlight rounded-3xl p-8 border-teal-500/20 bg-slate-950/60 shadow-[0_0_50px_rgba(13,148,136,0.15)] animate-float">
          <div className="flex justify-center">
            <div className="relative w-20 h-20 flex items-center justify-center bg-teal-950/50 border border-teal-500/30 rounded-2xl shadow-inner">
              <Sparkles className="h-10 w-10 text-teal-400 animate-pulse" />
              <div className="absolute -inset-1 border border-teal-400/20 rounded-2xl animate-spin [animation-duration:10s]" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-100 font-display tracking-wide">
              Preparing Your AI Interview
            </h3>
            <p className="text-sm text-slate-400">
              Generating tailored questions and configuring the audio space...
            </p>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-left font-mono text-xs text-slate-300 min-h-[50px] flex items-center gap-3">
            <Loader className="h-4 w-4 text-teal-400 animate-spin shrink-0" />
            <span className="animate-pulse">{launchStepsText[launchStep]}</span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-linear-to-r from-teal-500 to-emerald-400 h-full transition-all duration-500 ease-out"
              style={{ width: `${((launchStep + 1) / launchStepsText.length) * 100}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
            HIRELOOP AI CORE V2
          </p>
        </div>
      </div>
  )
}

export default InterviewLaunchAmination
