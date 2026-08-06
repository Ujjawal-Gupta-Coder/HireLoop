'use client'

import { Check, Coins, Zap } from "lucide-react";
import SectionHeader from "./ui/SectionHeader";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { Plan, Session } from "@/src/types"

const Pricing = ({session, plans}: { session : Session, plans : Plan[] }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const openPaymentGateway = async (id:string) => {
        try {
            setLoading(true);

            const raw = await fetch("/api/create-checkout-session", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id})
            })
            const res = await raw.json();

            if(res.success) {
                window.location.href = res.data.url;
            }
            else toast.error(res.message);

        } catch(error) {
            toast.error('Opening payment gateway failed.');
            console.error("Error in opening payment gateway: ", error);
            return;
        } finally {
            setLoading(false);
        }   
    }

    const handlePaymentButtonClick = (id : string) => {
        if(!session?.user) {
            router.push("/auth")
        }
        else openPaymentGateway(id);
    }

    return (
        <section id="pricing" className="section-container-style">
            <Toaster />
            <SectionHeader overLine={"Flexible Packages"} heading={"Invest in Your Career"} subHeading={"Flexible credit packs designed to help you ace every interview."} isPricingSection={true} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
                {
                    plans.map((plan, index) => {
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
                                    {
                                        plan.isMostPopular ?
                                        <Zap className={`w-5 h-5 ${plan.isMostPopular? "text-teal-400 animate-pulse": "text-slate-400"}`} /> :
                                        <Coins className={`w-5 h-5 ${plan.isMostPopular? "text-teal-400 animate-pulse": "text-slate-400"}`} />
                                    }
                                    
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
                            <button disabled={loading} className={`w-full mt-8 ${loading ? "cursor-not-allowed":"cursor-pointer"} transition-all rounded-xl ${plan.isMostPopular? "py-3.5 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold shadow-lg shadow-teal-900/30": "py-3 g-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold border border-slate-800 hover:border-slate-700"}`}
                            onClick={() => handlePaymentButtonClick(plan.id)}
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
