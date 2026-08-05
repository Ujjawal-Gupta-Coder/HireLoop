"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SectionHeader from "./ui/SectionHeader";
import { FAQ } from "@prisma/client";

const FAQComponent = ({faqData}: {faqData: FAQ[]}) => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    
  return (
    <section id="faq" className="section-container-style">
        
        <SectionHeader overLine="Still Curious?" heading="Frequently Asked Questions" subHeading="Explore answers to the questions users ask most." />

        <div className="space-y-4">
          {faqData.map((faq, index) => {
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
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "transform rotate-180 text-teal-400" : ""}`} />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px] border-t border-white/5" : "max-h-0"
                  }`}
                >
                  <p className="p-6 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal bg-slate-950/20">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
  )
}

export default FAQComponent
