"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const FAQS = [
        {
            q: "How accurate is the AI feedback?",
            a: "Our AI feedback analyzes your responses, communication, technical knowledge, and interview performance using advanced AI models. You'll receive personalized suggestions, strengths, and actionable improvements after every interview."
        },
        {
            q: "Do my credits expire?",
            a: "No. Your credits never expire, so you can use them whenever you're ready to practice. Buy once and prepare at your own pace."
        },
        {
            q: "What interview types can I practice?",
            a: "Practice technical, behavioral, coding, HR, and role-specific interviews tailored to your experience level, skills, and target job role."
        },
        {
            q: "How does the credit system work?",
            a: "Each AI interview or premium feature uses a certain number of credits. Simply purchase a credit pack once and spend credits only on the features you use—no monthly subscriptions or recurring charges."
        },
        {
            q: "Do I get free credits?",
            a: "Yes! Every new account receives free credits to explore the platform before purchasing a credit pack."
        },
        {
            q: "Is my interview data private?",
            a: "Absolutely. Your interview recordings, transcripts, and personal data are encrypted and accessible only to you. We never sell your data or use your private interviews to train public AI models."
        }
    ];
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Still Curious?</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 font-normal">Explore answers to the questions users ask most.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between text-white font-semibold text-sm sm:text-base cursor-pointer hover:bg-white/[0.01]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "transform rotate-180 text-teal-400" : ""}`} />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px] border-t border-white/5" : "max-h-0"
                  }`}
                >
                  <p className="p-6 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal bg-slate-950/20">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
  )
}

export default FAQ
