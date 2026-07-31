"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Sparkles, RefreshCw, Star } from "lucide-react";

type AnimationStatus = "preparing" | "igniting" | "liftoff" | "success";

interface CoinParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  life: number;
  maxLife: number;
  bounceCount: number;
  symbol: string;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<AnimationStatus>("preparing");
  const [countdown, setCountdown] = useState(7);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Particle tracking
  const coinsRef = useRef<CoinParticle[]>([]);
  const sparksRef = useRef<SparkParticle[]>([]);
  const smokeRef = useRef<SmokeParticle[]>([]);

  // Simulation coordinates (rocket coordinates)
  const rocketCoords = useRef({ x: 0, y: 0 });


  // Update rocket coordinates based on DOM element position
  const updateRocketCoords = () => {
    const padEl = document.getElementById("launchpad");
    if (padEl) {
      const rect = padEl.getBoundingClientRect();
      rocketCoords.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    } else {
      // Fallback to center of screen
      rocketCoords.current = {
        x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
        y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
      };
    }
  };

  // Timeline orchestration
  useEffect(() => {
    // Stage 1 -> Stage 2 (Preparing -> Igniting)
    const ignitionTimeout = setTimeout(() => {
      setStatus("igniting");
    }, 1200);

    // Stage 2 -> Stage 3 (Igniting -> Liftoff)
    const liftoffTimeout = setTimeout(() => {
      setStatus("liftoff");
      // Trigger massive coin explosion
      triggerCoinExplosion();
    }, 2400);

    // Stage 3 -> Stage 4 (Liftoff -> Success Card Reveal)
    const successTimeout = setTimeout(() => {
      setStatus("success");
    }, 3800);

    return () => {
      clearTimeout(ignitionTimeout);
      clearTimeout(liftoffTimeout);
      clearTimeout(successTimeout);
    };
  }, []);

  // Redirect countdown
  useEffect(() => {
    if (status !== "success") return;

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  // Handle redirect when countdown hits 0
  useEffect(() => {
    if (status === "success" && countdown <= 0) {
      router.push("/");
    }
  }, [countdown, status, router]);

  // Coin burst generator
  const triggerCoinExplosion = () => {
    updateRocketCoords();
    const { x, y } = rocketCoords.current;

    // Spawn Coins
    for (let i = 0; i < 45; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.7); // mostly upward fan shape
      const speed = 12 + Math.random() * 16;
      coinsRef.current.push({
        x,
        y: y - 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4, // push upward
        radius: 8 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        alpha: 1,
        life: 0,
        maxLife: 150 + Math.random() * 80,
        bounceCount: 0,
        symbol: Math.random() > 0.4 ? "₹" : "🌟",
      });
    }

    // Spawn Sparkles
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 10;
      sparksRef.current.push({
        x,
        y: y - 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        color: Math.random() > 0.5 ? "#2DD4BF" : "#06B6D4", // Teal / Cyan
        alpha: 1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    }
  };

  // Setup Canvas and Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const ctx = canvas.getContext("2d");

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle coordinates update dynamically in case of viewport change
      updateRocketCoords();
      const rX = rocketCoords.current.x;
      const rY = rocketCoords.current.y;

      // 1. Spawning smoke during ignition & liftoff
      if (status === "igniting") {
        if (Math.random() < 0.4) {
          smokeRef.current.push({
            x: rX + (Math.random() - 0.5) * 20,
            y: rY + 15,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 1.5 + 0.5,
            radius: 8 + Math.random() * 12,
            alpha: 0.8,
            life: 0,
            maxLife: 40 + Math.random() * 30,
          });
        }
      } else if (status === "liftoff") {
        // Continuous smoke stream
        for (let i = 0; i < 3; i++) {
          smokeRef.current.push({
            x: rX + (Math.random() - 0.5) * 15,
            y: rY + 10,
            vx: (Math.random() - 0.5) * 3,
            vy: 2 + Math.random() * 3,
            radius: 10 + Math.random() * 15,
            alpha: 0.9,
            life: 0,
            maxLife: 60 + Math.random() * 40,
          });
        }
      }

      // 2. Render & Update Smoke
      smokeRef.current = smokeRef.current.filter((smoke) => {
        smoke.x += smoke.vx;
        smoke.y += smoke.vy;
        smoke.radius += 0.2; // expand
        smoke.alpha = 1 - smoke.life / smoke.maxLife;
        smoke.life++;

        ctx.save();
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          smoke.x,
          smoke.y,
          0,
          smoke.x,
          smoke.y,
          smoke.radius
        );
        gradient.addColorStop(0, `rgba(45, 212, 191, ${smoke.alpha * 0.25})`); // Glowing Teal
        gradient.addColorStop(0.5, `rgba(15, 23, 42, ${smoke.alpha * 0.15})`); // Dark slate
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.arc(smoke.x, smoke.y, smoke.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return smoke.life < smoke.maxLife;
      });

      // 3. Render & Update Sparks
      sparksRef.current = sparksRef.current.filter((spark) => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.98; // friction
        spark.vy *= 0.98;
        spark.alpha = 1 - spark.life / spark.maxLife;
        spark.life++;

        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = spark.color;
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = spark.alpha;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return spark.life < spark.maxLife;
      });

      // 4. Render & Update Coins
      coinsRef.current = coinsRef.current.filter((coin) => {
        coin.x += coin.vx;
        coin.y += coin.vy;
        coin.vy += 0.45; // gravity
        coin.vx *= 0.99; // air resistance
        coin.rotation += coin.rotationSpeed;
        coin.life++;

        // Bounce on bottom screen
        const bottomLimit = canvas.height - coin.radius - 10;
        if (coin.y > bottomLimit && coin.vy > 0) {
          coin.y = bottomLimit;
          coin.vy = -coin.vy * 0.55; // dampening
          coin.vx *= 0.8;
          coin.bounceCount++;
        }

        // Bounce off left/right side boundaries
        if (coin.x < coin.radius && coin.vx < 0) {
          coin.x = coin.radius;
          coin.vx = -coin.vx * 0.6;
        } else if (coin.x > canvas.width - coin.radius && coin.vx > 0) {
          coin.x = canvas.width - coin.radius;
          coin.vx = -coin.vx * 0.6;
        }

        coin.alpha = Math.max(0, 1 - coin.life / coin.maxLife);

        ctx.save();
        ctx.translate(coin.x, coin.y);
        // Simulate 3D coin rotation by scaling horizontally using cosine of rotation
        const scaleX = Math.cos(coin.rotation);
        ctx.scale(scaleX, 1);

        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(234, 179, 8, 0.4)"; // Yellow glow

        // Coin body (Gold gradient)
        ctx.beginPath();
        ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
        const goldGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coin.radius);
        goldGrad.addColorStop(0, "#FDE047"); // light gold
        goldGrad.addColorStop(0.7, "#EAB308"); // normal gold
        goldGrad.addColorStop(1, "#CA8A04"); // dark gold
        ctx.fillStyle = goldGrad;
        ctx.fill();

        // Inner rim
        ctx.beginPath();
        ctx.arc(0, 0, coin.radius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(254, 240, 138, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Gold Coin Symbol ($ or Star)
        ctx.fillStyle = "#854D0E"; // Deep bronze for symbol text
        ctx.font = `bold ${Math.round(coin.radius * 1.1)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(coin.symbol, 0, 0.5);

        ctx.restore();

        return coin.life < coin.maxLife && coin.alpha > 0;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status]);

  const handleManualRedirect = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative bg-dark text-[#F8FAFC] overflow-hidden select-none font-sans">
      {/* Background decoration grid overlay */}
      <div className="absolute inset-0 grid-bg-overlay opacity-40 z-0"></div>

      {/* Decorative colored glow blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none z-0 animate-pulse-glow"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none z-0"></div>

      {/* Full screen canvas overlay for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Main glassmorphic wrapper */}
      <div
        ref={containerRef}
        className="w-full max-w-md mx-4 glass-panel-highlight rounded-2xl p-8 relative z-20 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-700 ease-out"
        style={{
          minHeight: "450px",
          transform: status === "success" ? "translateY(0) scale(1)" : "translateY(10px) scale(0.98)",
        }}
      >
        {/* Animated Rocket Area */}
        {status !== "success" && (
          <div className="flex flex-col items-center justify-center relative w-full h-48 mb-4">
            {/* Launch base ring */}
            <div
              id="launchpad"
              className={`absolute bottom-4 w-28 h-4 rounded-full bg-linear-to-r from-teal-500/30 to-cyan-500/30 border border-teal-500/50 flex items-center justify-center transition-all duration-500 ${
                status === "igniting"
                  ? "shadow-[0_0_30px_rgba(20,184,166,0.6)] border-teal-400 scale-105"
                  : "shadow-[0_0_15px_rgba(20,184,166,0.2)]"
              }`}
            >
              <div className="w-16 h-0.5 rounded-full bg-teal-400/60 blur-[1px]"></div>
            </div>

            {/* Glowing cloud under launchpad */}
            {status === "igniting" && (
              <div className="absolute bottom-0 w-44 h-10 bg-teal-500/20 blur-md rounded-full animate-pulse"></div>
            )}

            {/* The Rocket */}
            <div
              className={`absolute transition-all duration-1000 select-none ${
                status === "preparing"
                  ? "translate-y-0 animate-float"
                  : status === "igniting"
                  ? "translate-y-0 animate-[shake_0.15s_infinite]"
                  : "translate-y-[-300px] scale-50 opacity-0"
              }`}
              style={{
                bottom: "16px",
              }}
            >
              <svg
                width="72"
                height="110"
                viewBox="0 0 72 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_5px_15px_rgba(13,148,136,0.4)]"
              >
                {/* Flame effect */}
                {(status === "igniting" || status === "liftoff") && (
                  <path
                    d="M36 110C42 98 48 94 48 85C48 76 36 76 36 76C36 76 24 76 24 85C24 94 30 98 36 110Z"
                    fill="url(#fire_gradient)"
                    className="animate-pulse"
                  />
                )}

                {/* Rocket body */}
                <path
                  d="M36 10C36 10 18 28 18 58C18 78 24 82 36 82C48 82 54 78 54 58C54 28 36 10 36 10Z"
                  fill="url(#rocket_gradient)"
                />

                {/* Rocket tip cone */}
                <path
                  d="M36 10C36 10 25.5 20.5 22 30C31.5 30 40.5 30 50 30C46.5 20.5 36 10 36 10Z"
                  fill="#00BFA5"
                />

                {/* Side Wings / Fins */}
                <path
                  d="M18 55C18 55 6 64 6 78C6 80 10 82 14 80C19 78 18 70 18 70V55Z"
                  fill="#00867D"
                />
                <path
                  d="M54 55C54 55 66 64 66 78C66 80 62 82 58 80C53 78 54 70 54 70V55Z"
                  fill="#00867D"
                />

                {/* Central Thruster Base */}
                <rect x="28" y="80" width="16" height="5" rx="2" fill="#374151" />

                {/* Glass window */}
                <circle cx="36" cy="45" r="7" fill="#0F172A" stroke="#00D2C4" strokeWidth="2" />
                <circle cx="34" cy="43" r="2" fill="white" opacity="0.8" />

                {/* Gradients */}
                <defs>
                  <linearGradient id="rocket_gradient" x1="36" y1="10" x2="36" y2="82" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F8FAFC" />
                    <stop offset="0.6" stopColor="#E2E8F0" />
                    <stop offset="1" stopColor="#94A3B8" />
                  </linearGradient>
                  <linearGradient id="fire_gradient" x1="36" y1="76" x2="36" y2="110" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2DD4BF" />
                    <stop offset="0.5" stopColor="#F59E0B" />
                    <stop offset="1" stopColor="#EF4444" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Preparation / Ignition labels */}
            <div className="absolute top-2 left-0 right-0 flex flex-col items-center">
              <span className="text-teal-400 text-xs tracking-widest uppercase font-semibold animate-pulse">
                {status === "preparing" && "Encrypting Transaction..."}
                {status === "igniting" && "Launching payment confirmation..."}
                {status === "liftoff" && "Rocket liftoff!"}
              </span>
            </div>
          </div>
        )}

        {/* Success Card content */}
        {status === "success" && (
          <div className="w-full flex flex-col items-center animate-[fadeIn_0.6s_ease-out_forwards]">
            {/* Animated Checkmark Circle */}
            <div className="relative mb-6">
              {/* Spinning outer glowing circles */}
              <div className="absolute inset-[-12px] rounded-full border border-teal-500/20 animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-[-6px] rounded-full border border-dashed border-cyan-400/40 animate-[spin_12s_linear_infinite_reverse]" />

              {/* Central Green/Teal Badge */}
              <div className="w-20 h-20 rounded-full bg-linear-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.6)] animate-[bounceIn_0.8s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
                <Check className="w-10 h-10 text-[#030712] stroke-[3.5]" />
              </div>

              {/* Sparkles icons flying around */}
              <Sparkles className="absolute -top-3 -right-3 text-yellow-400 w-5 h-5 animate-pulse" />
              <Star className="absolute -bottom-2 -left-3 text-cyan-400 w-4 h-4 animate-bounce" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-[#2DD4BF] via-[#06B6D4] to-[#38BDF8] bg-clip-text text-transparent mb-2">
              Payment Confirmed!
            </h1>
            <p className="text-sm text-text-muted max-w-xs mb-8">
              Thank you! Your transaction completed successfully. Enjoy your premium access!
            </p>

            {/* Auto Redirect status bar */}
            <div className="w-full flex flex-col items-center mb-6">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Redirecting to homepage in <strong className="text-teal-400 font-mono text-sm">{countdown}</strong> seconds...</span>
              </div>
              {/* Progress bar container */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-teal-500 to-cyan-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 7) * 100}%` }}
                />
              </div>
            </div>

            {/* Instant Action buttons */}
            <button
              onClick={handleManualRedirect}
              className="group w-full py-3 px-5 rounded-xl font-semibold bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-dark flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(20,184,166,0.3)] transition-all duration-300 transform active:scale-98"
            >
              Go to Home Page
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Local custom keyframes inline styles */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-2px, 1px) rotate(-1deg); }
          40% { transform: translate(1.5px, -1.5px) rotate(1deg); }
          60% { transform: translate(-1.5px, 1px) rotate(0deg); }
          80% { transform: translate(2px, -1px) rotate(0.5deg); }
        }

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
