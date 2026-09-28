import { CheckCircle2, ShieldCheck } from 'lucide-react'

const SecurePaymentBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-teal-500/10 bg-linear-to-r from-teal-950/15 via-slate-950/50 to-slate-950/80 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            {/* Glow effect */}
            <div className="absolute -left-10 -top-10 w-28 h-28 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start md:items-center gap-4">
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-teal-950/40 border border-teal-500/20 shadow-inner">
                <ShieldCheck className="h-6 w-6 text-teal-400 animate-pulse-glow" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-200 tracking-tight">
                  Secure Payments
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                  All payments are processed securely via Stripe. Your card data and transactions
                  are encrypted and always protected. We do not store your credit card info.
                </p>
              </div>
            </div>

            {/* Custom SVG Credit Card Graphic */}
            <div className="hidden lg:block relative w-48 h-24 shrink-0 select-none opacity-85 hover:opacity-100 transition-opacity">
              {/* Back Card */}
              <div className="absolute right-2 top-0 w-36 h-20 rounded-xl bg-linear-to-tr from-slate-900 to-slate-800 border border-slate-800 shadow-md transform rotate-6" />
              
              {/* Front Card */}
              <div className="absolute left-2 bottom-0 w-36 h-20 rounded-xl bg-linear-to-tr from-teal-950/70 via-slate-950/90 to-teal-950/40 border border-teal-500/20 shadow-xl flex flex-col justify-between p-3.5 backdrop-blur-xs">
                {/* Chip and Signal */}
                <div className="flex items-center justify-between">
                  <div className="w-5.5 h-4 bg-teal-400/20 border border-teal-500/30 rounded-xs" />
                  <div className="w-4 h-4 rounded-full bg-teal-400/10 border border-teal-400/35 flex items-center justify-center">
                    <CheckCircle2 className="h-2 w-2 text-teal-400" />
                  </div>
                </div>
                {/* Dots mimicking numbers */}
                <div className="space-y-1">
                  <div className="flex gap-1">
                    <span className="inline-block w-1.5 h-1 rounded-full bg-teal-500/40" />
                    <span className="inline-block w-1.5 h-1 rounded-full bg-teal-500/40" />
                    <span className="inline-block w-1.5 h-1 rounded-full bg-teal-500/40" />
                    <span className="inline-block w-1.5 h-1 rounded-full bg-teal-500/40" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] text-teal-500/50 uppercase tracking-widest font-mono">
                      Hireloop Client
                    </span>
                    <span className="text-[7px] text-teal-500/70 font-mono">08/29</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}

export default SecurePaymentBanner
