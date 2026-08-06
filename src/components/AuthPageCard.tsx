"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import Logo from '@/public/logo.svg'
import { useState } from "react";
import signInWithGoogle from "../actions/signIn";

const AuthPageCard = () => {
    const [isSignUp, setIsSignUp] = useState(false);
  return (
    <div className="flex items-center justify-center lg:col-span-5 w-full">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.01] p-5 sm:p-8 lg:p-10 shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
              {/* Internal Card glows */}
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

              {/* Mobile branding */}
              <div className="mb-6 sm:mb-8 flex justify-center lg:hidden">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-950/50 border border-teal-500/30 shadow-lg shadow-teal-500/10 p-2">
                    <Image
                      src={Logo}
                      alt="HireLoop Logo"
                      width={32}
                      height={32}
                      className="text-teal-400"
                    />
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-white">
                    Hire<span className="text-teal-400">Loop</span>
                  </span>
                </Link>
              </div>

              {/* Toggle switch */}
              <div className="relative z-10 mb-6 sm:mb-8 flex justify-center">
                <div className="inline-flex rounded-full bg-slate-950/60 p-1 border border-white/10">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`rounded-full px-5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                      !isSignUp
                        ? "bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`rounded-full px-5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                      isSignUp
                        ? "bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <div className="mb-6 sm:mb-8 text-center relative z-10">
                <div className="mx-auto mb-5 hidden lg:flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-teal-500/20 to-cyan-500/5 p-[1px] ring-1 ring-white/10 shadow-lg shadow-teal-500/10">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-950/80 backdrop-blur-xl">
                    <Image src={Logo} alt={"HireLoop Logo"} className="h-16 w-16 text-teal-400 animate-pulse" />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
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
                <form
                  action={signInWithGoogle}
                >
                  <button
                    className="group relative flex w-full items-center justify-center gap-3.5 rounded-2xl bg-white px-5 py-3 sm:py-4 font-semibold text-slate-900 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-950 cursor-pointer"
                    type="submit"
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
                </form>
              </div>

              <div className="relative mt-6 sm:mt-8 flex items-center justify-center z-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative bg-[#030712] px-3 text-[10px] uppercase text-slate-500 tracking-wider py-0.5 rounded-full border border-white/10">
                  Secure Connection
                </div>
              </div>

              <div className="mt-6 sm:mt-8 text-center relative z-10">
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
  )
}

export default AuthPageCard
