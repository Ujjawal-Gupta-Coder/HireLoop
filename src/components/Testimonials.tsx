import SectionHeader from "./ui/SectionHeader";

const Testimonials = () => {
    const TESTIMONIALS = [
  {
    quote:
      "HireLoop gave me realistic interview practice and detailed AI feedback. The personalized questions helped me identify weak areas and improve with every session.",
    name: "Aarav Sharma",
    role: "Frontend Developer",
    avatar: "AS",
    color: "bg-teal-600"
  },
  {
    quote:
      "The coding interviews felt surprisingly close to real technical rounds. The AI feedback was clear, practical, and helped me prepare with confidence.",
    name: "Priya Verma",
    role: "Software Engineer",
    avatar: "PV",
    color: "bg-emerald-600"
  },
  {
    quote:
      "From behavioral interviews to system design, HireLoop made my preparation structured and focused. The credit-based model was simple and easy to understand.",
    name: "Rohan Patel",
    role: "Full Stack Developer",
    avatar: "RP",
    color: "bg-teal-700"
  }
];
  return (
    <section id="testimonials" className="section-container-style">
            <SectionHeader overLine="Testimonials" heading="Career Success Stories" subHeading="See how HireLoop helps candidates prepare for interviews with confidence."/>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="glass-panel rounded-3xl p-8 border border-white/5 flex flex-col justify-between relative group hover:scale-[1.01] transition-all">
                  <span className="text-5xl text-brand-violet/20 font-serif absolute top-4 left-4 select-none">“</span>
                  <p className="text-sm text-slate-300 italic relative z-10 leading-relaxed mb-8 font-normal">
                    {t.quote}
                  </p>
                  
                  <div className="flex items-center space-x-3 border-t border-slate-900 pt-6">
                    <div className={`w-10 h-10 rounded-full bg-linear-to-tr ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
  )
}

export default Testimonials
