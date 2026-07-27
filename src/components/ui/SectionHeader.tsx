import { Sparkles } from "lucide-react"

const SectionHeader = ({overLine, heading, subHeading, isPricingSection = false}:{overLine: string, heading:string, subHeading:string, isPricingSection:boolean}) => {
  return (
    <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">{overLine}</span>
        <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2 mb-4">
            {heading}
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-8 font-normal">{subHeading}</p>

        {/* Free Registration Bonus Banner only in Pricing section*/}
        {
            isPricingSection && 
            <div className="inline-flex items-center gap-2.5 bg-linear-to-r from-teal-950/60 via-slate-900/60 to-teal-950/60 p-4 rounded-2xl border border-teal-500/10 max-w-2xl mx-auto text-left shadow-lg backdrop-blur-md">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/25">
                    <Sparkles className="h-4 w-4 text-teal-400" />
                </span>
                <div>
                    <p className="text-xs font-bold text-slate-200">
                        🎁 Registration Bonus
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                        Get <span className="text-teal-400 font-semibold">50 free credits</span> automatically upon creating your account. No payment details required.
                    </p>
                </div>
            </div>
        }
            
    </div>
  )
}

export default SectionHeader
