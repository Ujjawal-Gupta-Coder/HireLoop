"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from '@/public/logo.svg'
import Footer from "@/src/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

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

          {/* LEFT COLUMN: Features & Branding */}
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

          {/* RIGHT COLUMN: Auth Card */}
          <div className="flex items-center justify-center lg:col-span-5 w-full">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.01] p-8 lg:p-10 shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
              {/* Internal Card glows */}
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

              {/* Mobile branding */}
              <div className="mb-8 flex justify-center lg:hidden">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-teal-950/50 border border-teal-500/30 shadow-lg shadow-teal-500/10">
                    <Image
                      src="/logo.svg"
                      alt="HireLoop Logo"
                      fill
                    />
                  </div>
                  <span className="text-2xl font-bold tracking-tight">
                    Hire<span className="text-teal-400">Loop</span>
                  </span>
                </Link>
              </div>

              {/* Toggle switch */}
              <div className="relative z-10 mb-8 flex justify-center">
                <div className="inline-flex rounded-full bg-slate-950/60 p-1 border border-white/10">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`rounded-full px-5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                      !isSignUp
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`rounded-full px-5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                      isSignUp
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <div className="mb-8 text-center relative z-10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/5 p-[1px] ring-1 ring-white/10 shadow-lg shadow-teal-500/10">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-950/80 backdrop-blur-xl">
                    <Image src={Logo} alt={"HireLoop Logo"} className="h-16 w-16 text-teal-400 animate-pulse" />
                  </div>
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>

                <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                  {isSignUp 
                    ? "Join HireLoop today to start practicing and master your next interview." 
                    : "Access your personalized interview tracks and resume your AI prep sessions."}
                </p>
              </div>

              {/* Google Sign-in Button */}
              <div className="relative z-10">
                <button
                  className="group relative flex w-full items-center justify-center gap-3.5 rounded-2xl bg-white px-5 py-4 font-semibold text-slate-900 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-950 cursor-pointer"
                  onClick={() => {alert('You Try to log in.')}}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    className="shrink-0"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.3 14.7l6.6 4.8C14.6 15.5 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.7 39.6 16.3 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.4-6.1 6.9l6.2 5.2C39.2 36.5 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"
                    />
                  </svg>

                  <span className="tracking-wide">
                    {isSignUp ? "Sign up with Google" : "Sign in with Google"}
                  </span>

                  <ArrowRight className="ml-auto h-5 w-5 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-900" />
                </button>
              </div>

              <div className="relative mt-8 flex items-center justify-center z-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative bg-[#030712] px-3 text-[10px] uppercase text-slate-500 tracking-wider py-0.5 rounded-full border border-white/10">
                  Secure Connection
                </div>
              </div>

              <div className="mt-8 text-center relative z-10">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                >
                  <span className="transition-transform duration-300 group-hover:-translate-x-1"> <ArrowLeft className="h-5 w-5" /> </span>
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
    
    <Footer />
    </>
  );
}