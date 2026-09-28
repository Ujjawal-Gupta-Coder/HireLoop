import { ArrowRight } from "lucide-react"
import Link from "next/link"

const CTA = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel-highlight rounded-3xl p-8 sm:p-12 border relative overflow-hidden text-center max-w-5xl mx-auto">
          {/* Decorative glows */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Ready to Land the Offer?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed mb-8 font-normal">
            Join thousands of successful candidates today. Your next career milestone is just a loop away.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 hover:scale-[1.02] shadow-xl transition-all duration-200"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
  )
}

export default CTA
