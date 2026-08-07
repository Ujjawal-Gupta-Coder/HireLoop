"use client";

import { useRouter } from "next/navigation";
import { X, ArrowRight, AlertTriangle, Home } from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();

  const handleRetry = () => {
    router.push("/#pricing");
  };

  const handleHome = () => {
    router.push("/billing");
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative bg-primary-dark/30 text-[#F8FAFC] overflow-hidden select-none font-sans">
      {/* Background decoration grid overlay */}
      <div className="absolute inset-0 grid-bg-overlay opacity-30 z-0"></div>

      {/* Decorative colored glow blobs (Warm sunset/red/amber palette) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-red-950/10 blur-[120px] pointer-events-none z-0 animate-pulse-glow"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-orange-950/5 blur-[150px] pointer-events-none z-0"></div>

      {/* Main glassmorphic wrapper */}
      <div
        className="w-full max-w-md mx-4 glass-panel rounded-2xl p-8 relative z-20 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.45)] border-red-500/25 transition-all duration-500 ease-out"
        style={{
          minHeight: "400px",
        }}
      >
        <div className="w-full flex flex-col items-center animate-[fadeIn_0.6s_ease-out_forwards]">
          {/* Animated Warning / Abort Badge */}
          <div className="relative mb-6">
            {/* Spinning outer alert circles */}
            <div className="absolute inset-[-12px] rounded-full border border-red-500/20 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-[-6px] rounded-full border border-dashed border-orange-500/30 animate-[spin_6s_linear_infinite_reverse]" />

            {/* Central Red Badge */}
            <div className="w-20 h-20 rounded-full bg-linear-to-tr from-red-600 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.45)] animate-[bounceIn_0.8s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
              <X className="w-10 h-10 text-[#030712] stroke-[3.5]" />
            </div>

            {/* Floating warning icon */}
            <AlertTriangle className="absolute -top-2 -right-2 text-orange-400 w-5 h-5 animate-bounce" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent mb-2">
            Payment Cancelled
          </h1>
          <p className="text-sm text-text-muted max-w-xs mb-8">
            Your transaction was cancelled. No money has been deducted from your account. You can retry the payment whenever you are ready.
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-3.5">
            <button
              onClick={handleRetry}
              className="group w-full py-3.5 px-5 rounded-xl font-semibold bg-linear-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-dark flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(239,68,68,0.25)] transition-all duration-300 transform active:scale-98"
            >
              Try Again
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={handleHome}
              className="w-full py-3 px-5 rounded-xl font-semibold bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/60 text-[#F8FAFC] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 transform active:scale-98"
            >
              <Home className="w-4 h-4 text-slate-400" />
              Go to Payment Page
            </button>
          </div>
        </div>
      </div>

      {/* Local custom keyframes inline styles */}
      <style jsx global>{`
        @keyframes bounceIn {
          from, 20%, 40%, 60%, 80%, to {
            animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
          }
          0% {
            opacity: 0;
            transform: scale3d(.3, .3, .3);
          }
          20% {
            transform: scale3d(1.1, 1.1, 1.1);
          }
          40% {
            transform: scale3d(.9, .9, .9);
          }
          60% {
            opacity: 1;
            transform: scale3d(1.03, 1.03, 1.03);
          }
          80% {
            transform: scale3d(.97, .97, .97);
          }
          to {
            opacity: 1;
            transform: scale3d(1, 1, 1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
