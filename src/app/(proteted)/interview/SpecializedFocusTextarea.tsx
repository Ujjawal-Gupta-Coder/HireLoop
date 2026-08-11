type SpecializedFocusTextareaProps = {
    order: number,
    focusAreas: string,
    setFocusAreas: React.Dispatch<React.SetStateAction<string>>
}

const SpecializedFocusTextarea = ({order, focusAreas, setFocusAreas}: SpecializedFocusTextareaProps) => {
  return (
    <div className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/70 via-[#0c101d]/80 to-slate-950/70 backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-[0_18px_50px_-30px_rgba(13,148,136,0.35)] hover:border-slate-700 transition-all duration-300">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-950/50 border border-teal-500/20 text-teal-400 text-xs font-bold font-mono">{order}</span>
              <h2 className="text-base font-bold tracking-tight font-display">Specialized Focus / Topics</h2>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Express custom requests or constraints. Let the AI interviewer know if you want to focus heavily on certain libraries, concurrency models, architectural patterns, or mock behavioral questions for a specific company profile.
            </p>

            <textarea
              rows={3}
              placeholder="Example: Concentrate on Next.js 15 App Router routing features, Prisma transactions, PostgreSQL index scaling, or behavioral issues relating to conflict resolution and handling legacy system migration..."
              value={focusAreas}
              onChange={(e) => setFocusAreas(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-900 rounded-xl p-4 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 shadow-inner resize-none leading-relaxed"
            />
          </div>
  )
}

export default SpecializedFocusTextarea
