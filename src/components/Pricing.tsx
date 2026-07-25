'use client'

import { Check, Coins, Sparkles, Zap } from "lucide-react";

const Pricing = () => {
    const PLAN_DETAILS = [
        {
            name: "Starter",
            credits: "100",
            amount: "99",
            currencySymbol: "₹",
            description: "Perfect for quick diagnostic checkups and standard practice runs.",
            features: [
                "10 AI Simulator runs (10 credits each)",
                "Standard Sentiment analysis score",
                "Credits never expire"
            ],
            icon: Coins,
            isMostPopular: false,
            buttonText: "Buy Starter Pack"
        },
        {
            name: "Pro Pack",
            credits: "300",
            amount: "249",
            currencySymbol: "₹",
            description: "Comprehensive package designed for active job seekers running multiple mock loops.",
            features: [
                "30 AI Simulator runs (10 credits each)",
                "Detailed resume optimizer & checklist",
                "Credits never expire"
            ],
            icon: Zap,
            isMostPopular: true,
            buttonText: "Upgrade to Pro"
        },
        {
            name: "Elite Pack",
            credits: "700",
            amount: "499",
            currencySymbol: "₹",
            description: "Ultimate solution for complete career coaching, covering massive system design and coding mock tests.",
            features: [
                "70 AI Simulator runs (10 credits each)",
                "Advanced system design interactive whiteboard tests",
                "Credits never expire"
            ],
            icon: Coins,
            isMostPopular: false,
            buttonText: "Buy Elite Pack"
        }
    ]
    return (
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-16">
            <div className="text-center mb-16">

                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Flexible Packages</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">Invest in Your Career</h2>
                <p className="text-slate-400 max-w-xl mx-auto mb-8 font-normal">Flexible credit packs designed to help you ace every interview.</p>
                
                {/* Free Registration Bonus Banner */}
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
            </div>

            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
                {
                    PLAN_DETAILS.map((plan, index) => {
                    return(
                        <div key={index} className={`rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${plan.isMostPopular? "glass-panel-highlight hover:shadow-[0_15px_40px_-10px_rgba(13,148,136,0.15)]  relative":"glass-panel border-white/5 hover:border-slate-800/80 hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]"}`}>
                            {
                                plan.isMostPopular &&
                                <div className="absolute -top-3.5 right-6 bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                    Most Popular
                                </div>
                            }
                            
                            <div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">{plan.name}</span>
                                    {
                                        plan.isMostPopular && 
                                        <span className="px-2 py-0.5 bg-teal-500/10 text-[10px] font-bold text-teal-400 rounded-md border border-teal-500/20">
                                            Recommended
                                        </span>
                                    }  
                                </div>
                                
                                <div className="mt-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-white">{plan.currencySymbol}{plan.amount}</span>
                                    <span className="text-sm text-slate-400 ml-2 font-normal">flat fee</span>
                                </div>

                                <div className={`mt-4 p-3 border rounded-xl flex items-center gap-2.5 ${plan.isMostPopular ? "bg-teal-500/5 border-teal-500/20" : "bg-white/[0.02] border-white/5"}`}>
                                    <plan.icon className={`w-5 h-5 ${plan.isMostPopular? "text-teal-400 animate-pulse": "text-slate-400"}`} />
                                    <div>
                                        <div className="text-lg font-bold text-white leading-none">{plan.credits}</div>
                                        <div className={`text-[10px] uppercase tracking-wider ${plan.isMostPopular? "text-teal-400 font-bold" : "text-slate-400 font-semibold"}`}>AI Credits Included</div>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-300 mt-4 font-normal">{plan.description}</p>
                                
                                <ul className="mt-8 space-y-4 text-xs text-slate-300 font-normal">
                                    {
                                        plan.features.map((feature, index) => {
                                            return (
                                                <li key={index} className="flex items-center space-x-2.5">
                                                    <Check className="w-4 h-4 text-teal-400 shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <button className={`w-full mt-8 cursor-pointer transition-all rounded-xl ${plan.isMostPopular? "py-3.5 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold shadow-lg shadow-teal-900/30": "py-3 g-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold border border-slate-800 hover:border-slate-700"}`}
                            onClick={() => {alert("Welcome to payment gateway.")}}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    )})
                }
            </div>

        </section>
    );
};

export default Pricing;
