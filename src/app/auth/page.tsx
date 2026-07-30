import Link from "next/link";
import Image from "next/image";
import Logo from '@/public/logo.svg'
import Footer from "@/src/components/Footer";
import { CheckCircle2, Sparkles } from "lucide-react";
import AuthPageCard from "@/src/components/AuthPageCard";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";

export default async function AuthPage() {
const session = await auth();

  const features = [
    {
      title: "Personalized interview tracks",
      desc: "Tailored to your target role, seniority level, and company standards."
    },
    {
      title: "Real-time AI feedback",
      desc: "Instant evaluation of your coding speed, communication structure, and body language."
    },
    {
      title: "Detailed performance analytics",
      desc: "Benchmark your score improvements over time and identify critical weaknesses."
    },
    {
      title: "Industry-specific interview simulations",
      desc: "Replicate actual top-tier technical loops under realistic, timed conditions."
    }
  ];

  if(session) {
    return redirect('/dashboard')
  }
  
  return (
    <> 
    <main className="relative min-h-screen overflow-hidden bg-dark text-text grid-bg-overlay pb-20 pt-16">
      {/* Glow Spotlights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] auth-bg-glow-primary" />
        <div className="absolute right-1/4 bottom-1/4 h-[600px] w-[600px] auth-bg-glow-secondary" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid w-full gap-16 lg:grid-cols-12 items-center">

          {/* Features & Branding */}
          <div className="hidden flex-col justify-center lg:flex lg:col-span-7">
            <Link
              href="/"
              className="mb-8 flex w-fit items-center gap-3.5 group"
            >
              <div className="flex relative h-12 w-12 items-center justify-center rounded-xl bg-primary-shadow/40 border border-border/30 shadow-lg shadow-border/10 group-hover:border-border/50 transition-all duration-300">
                <Image
                  src={Logo}
                  alt="HireLoop Logo"
                  fill
                  className="transition-transform duration-500 group-hover:rotate-12"
                />
              </div>

              <span className="text-3xl font-extrabold tracking-tight text-text">
                Hire<span className="text-teal-500 group-hover:text-primary-light transition-colors">Loop</span>
              </span>
            </Link>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-500/20 bg-teal-950/40 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-teal-400 uppercase backdrop-blur-md shadow-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-teal-400" />
              <span>AI Interview Platform</span>
            </div>

            <h1 className="mt-6 text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
              Welcome to your
              <span className="block mt-2 italic text-transparent bg-clip-text bg-linear-to-r from-teal-400 via-emerald-400 to-cyan-400">
                AI Career Copilot.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
              Practice personalized interviews, receive instant AI feedback,
              improve communication, and confidently crack your dream job.
            </p>

            {/* Enhanced Interactive Checklist */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 max-w-2xl">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.01] p-4 transition-all duration-300 hover:border-teal-500/20 hover:bg-white/[0.03] hover:shadow-lg hover:shadow-teal-500/[0.02]"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20 group-hover:bg-teal-500/20 group-hover:text-teal-300 transition-colors">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-400 transition-colors leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>

          {/* Auth Card */}
          <AuthPageCard />

        </div>
      </div>
    </main>
    
    <Footer />
    </>
  );
}