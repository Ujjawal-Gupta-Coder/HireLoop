import { Mic } from "lucide-react";

const VoiceWave = ({ state }: { state: "listening" | "speaking" | "thinking" }) => {
  // Height configurations for the sound wave bars
  const leftHeights = [6, 10, 8, 14, 10, 20, 12, 24, 16, 20, 10, 14, 8, 10];
  const rightHeights = [10, 8, 14, 10, 20, 16, 24, 12, 20, 10, 14, 8, 10, 6];

  let barClass = "wave-bar-listening";
  if (state === "speaking") {
    barClass = "wave-bar-speaking";
  } else if (state === "thinking") {
    barClass = "wave-bar-thinking";
  }

  return (
    <div className="absolute bottom-[26%] md:bottom-[23%] lg:bottom-[21%] left-0 right-0 flex items-center justify-center gap-1.5 px-6 z-20 pointer-events-none">
      
      {/* Left side wave */}
      <div className="flex items-center gap-1.5">
        {/* 10 dots */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={`left-dot-${i}`} 
            className="w-1.5 h-1.5 rounded-full bg-teal-500/40 transition-all duration-500"
            style={{
              opacity: state === "thinking" ? 0.2 + Math.sin(i * 0.55) * 0.2 : 0.6,
              transform: state === "thinking" ? `scale(${0.75 + Math.sin(i * 0.55) * 0.25})` : "none",
            }}
          />
        ))}
        {/* 14 bars */}
        {leftHeights.map((height, i) => {
          // ripple effect delay (closer to center means smaller delay)
          const delay = (13 - i) * 0.055;
          return (
            <div 
              key={`left-bar-${i}`} 
              className={`w-[2.5px] rounded-full bg-teal-400 ${barClass}`}
              style={{
                height: `${height}px`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Center glowing microphone circle */}
      <div className="relative mx-3 flex items-center justify-center min-w-10 min-h-10 rounded-full bg-[#020408]/95 border border-teal-500/40 shadow-[0_0_24px_rgba(20,184,166,0.35)] pointer-events-auto group active:scale-95 transition-all">
        {state === "listening" && (
          <div className="absolute inset-0 rounded-full border border-teal-500/30 animate-ping opacity-60 pointer-events-none" />
        )}
        {state === "speaking" && (
          <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-80 pointer-events-none" style={{ animationDuration: "1.1s" }} />
        )}
        {state === "thinking" && (
          <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-pulse opacity-40 pointer-events-none" />
        )}
        <Mic className="w-6 h-6 text-teal-400 group-hover:scale-105 transition-transform" />
      </div>

      {/* Right side wave */}
      <div className="flex items-center gap-1.5">
        {/* 14 bars */}
        {rightHeights.map((height, i) => {
          // ripple effect delay (closer to center means smaller delay)
          const delay = i * 0.055;
          return (
            <div 
              key={`right-bar-${i}`} 
              className={`w-[2.5px] rounded-full bg-teal-400 ${barClass}`}
              style={{
                height: `${height}px`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
        {/* 10 dots */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={`right-dot-${i}`} 
            className="w-1.5 h-1.5 rounded-full bg-teal-500/40 transition-all duration-500"
            style={{
              opacity: state === "thinking" ? 0.2 + Math.sin((i + 10) * 0.55) * 0.2 : 0.6,
              transform: state === "thinking" ? `scale(${0.75 + Math.sin((i + 10) * 0.55) * 0.25})` : "none",
            }}
          />
        ))}
      </div>

    </div>
  );
}

export default VoiceWave
