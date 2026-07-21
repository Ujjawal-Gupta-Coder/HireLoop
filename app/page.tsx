"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  Check,
  X,
  ChevronDown,
  Sparkles,
  Clock,
  Shield,
  ArrowRight,
  Upload,
  Video,
  Mic,
  Cpu,
  Award,
  TrendingUp,
  Users,
  CheckCircle2,
  Target,
  Activity,
  FileText,
  Lock,
  Volume2,
  ExternalLink,
  MessageSquare
} from "lucide-react";

// Mock questions database for different roles & experience levels
const ROLE_QUESTIONS: Record<string, Record<string, string[]>> = {
  frontend: {
    fresher: [
      "Explain the box model in CSS and how box-sizing works.",
      "What is the difference between let, const, and var in JavaScript?",
      "How does state differ from props in React?"
    ],
    junior: [
      "Explain how React's Virtual DOM and reconciliation work.",
      "What are the different ways to optimize performance in a Next.js application?",
      "How do you handle state management in a large-scale React app?"
    ],
    mid_senior: [
      "Describe your strategy for building a highly accessible (WCAG) component library.",
      "How do you design a client-side caching strategy for a data-intensive dashboard?",
      "Explain the architectural trade-offs between SSR, SSG, and ISR in Next.js."
    ],
    senior: [
      "How would you architect a micro-frontend architecture for an enterprise e-commerce platform?",
      "Detail your approach to Core Web Vitals optimization for a site with millions of monthly active users.",
      "How do you lead a team in adopting modern build tooling while mitigating migration risks?"
    ]
  },
  backend: {
    fresher: [
      "What is the difference between SQL and NoSQL databases?",
      "Explain the HTTP request-response cycle and status codes.",
      "What is a RESTful API and what are its key constraints?"
    ],
    junior: [
      "How do indexes work in databases, and when should you avoid using them?",
      "Describe how you would design a system to handle session management in a distributed environment.",
      "What is the difference between horizontal and vertical scaling?"
    ],
    mid_senior: [
      "How do you handle database transaction concurrency and avoid race conditions?",
      "Design a rate limiter for an public-facing API gateway supporting 10,000 requests/sec.",
      "Compare message queues like RabbitMQ and Kafka for event-driven microservices."
    ],
    senior: [
      "Design a highly available, globally distributed reservation system (like Airbnb). How do you handle double bookings?",
      "Describe your strategy for migrating a monolithic database to microservices with zero downtime.",
      "How do you design for failure? Explain chaos engineering principles you have implemented."
    ]
  },
  fullstack: {
    fresher: [
      "What is CORS and how do you resolve CORS errors?",
      "How do you structure a simple web application database schema for a blog?",
      "Explain client-side vs server-side routing."
    ],
    junior: [
      "Describe how you secure authentication using JWT and secure cookies.",
      "How do you write efficient database queries to prevent N+1 query problems?",
      "Compare GraphQL and REST in terms of payload size, flexibility, and caching."
    ],
    mid_senior: [
      "Design a real-time collaborative document editor (like Google Docs). What transport layer and state sync would you use?",
      "How do you balance server rendering vs client-side state for search engine indexable pages?",
      "Explain the implementation of a full-text search engine (e.g., Elasticsearch) into an existing relational DB stack."
    ],
    senior: [
      "How would you architect a globally distributed SaaS platform from infrastructure (IAC) to deployment pipelines and UI frontend?",
      "Explain how you design telemetry, logging, and tracing across a heterogeneous frontend/backend stack.",
      "How do you establish standard development practices to ensure clean code quality in a team of 40+ fullstack engineers?"
    ]
  },
  qa: {
    fresher: [
      "What is the difference between manual and automated testing?",
      "What is a bug lifecycle and what are its key stages?",
      "Explain unit tests vs integration tests."
    ],
    junior: [
      "How do you write structured locator selectors for dynamic web elements?",
      "Describe your experience with end-to-end testing frameworks like Playwright or Cypress.",
      "What is CI/CD and how do automated test suites fit into it?"
    ],
    mid_senior: [
      "How do you design a test automation framework from scratch for a single-page app?",
      "Explain your strategy for test data generation and cleanup in automated integration tests.",
      "Describe how you run visual regression tests and handle flaky test suites."
    ],
    senior: [
      "How do you establish a quality engineering culture across multiple product squads?",
      "Design a scalable performance and load testing framework capable of simulating 100k concurrent users.",
      "How do you integrate security scans, static analysis, and automated accessibility checks into a mature CD pipeline?"
    ]
  },
  ai: {
    fresher: [
      "What is the difference between supervised and unsupervised learning?",
      "Explain the concept of overfitting and how you can prevent it.",
      "What is a loss function and why is it important?"
    ],
    junior: [
      "Explain the transformer architecture and the self-attention mechanism.",
      "How do you optimize hyper-parameters for a deep neural network?",
      "What is the difference between embeddings and standard high-dimensional vectors?"
    ],
    mid_senior: [
      "Describe the process of fine-tuning a large language model (LLM) using LoRA or QLoRA.",
      "How do you design a retrieval-augmented generation (RAG) system with semantic chunking?",
      "Compare vector database index types like HNSW and IVF-PQ for vector searching."
    ],
    senior: [
      "How would you architect a real-time LLM inference system serving low latency recommendations to millions of users?",
      "Design an evaluation pipeline for LLM agents, ensuring guardrails for toxicity, hallucination, and data leakage.",
      "Explain your methodology for distributed training of large models across multi-node GPU clusters."
    ]
  },
  data_science: {
    fresher: [
      "What is the Central Limit Theorem and why is it foundational to statistics?",
      "Explain the difference between precision and recall.",
      "How do you handle missing or null values in a dataset?"
    ],
    junior: [
      "Explain how a random forest classifier works and how it measures feature importance.",
      "Describe how you would design a new A/B test to validate homepage layout modifications.",
      "What is collinearity and how does it affect regression models?"
    ],
    mid_senior: [
      "How do you validate causality vs correlation in operational analytics dashboards?",
      "Describe how you deploy ML models into production and set up monitoring for feature drift.",
      "How do you design multi-touch attribution models for marketing campaigns?"
    ],
    senior: [
      "How do you design a data-driven strategy for user retention using survival analysis and cohort modeling?",
      "Detail your approach to structuring a corporate data warehouse (lakehouse) for self-service business intelligence.",
      "How do you lead executive stakeholders in defining OKRs using advanced predictive metrics instead of lagging indicators?"
    ]
  }
};

const TESTIMONIALS = [
  {
    quote: "HireLoop was a game-changer. The AI picked up on my filler words, helped me structure my answers, and the role-specific coding questions were spot on.",
    name: "James Jenkins",
    role: "Product Designer at Google",
    avatar: "JJ",
    color: "from-purple-500 to-indigo-500"
  },
  {
    quote: "The behavioral feedback was incredibly accurate. It helped me structure my thoughts using the STAR method and feel completely confident during the actual loop.",
    name: "Sarah Chen",
    role: "Software Engineer at Stripe",
    avatar: "SC",
    color: "from-blue-500 to-cyan-500"
  },
  {
    quote: "As a career switcher, the technical sessions were invaluable. The AI asked relevant, deep follow-up questions that tested my system architecture knowledge.",
    name: "Alex Rodriguez",
    role: "Product Manager at Airbnb",
    avatar: "AR",
    color: "from-pink-500 to-rose-500"
  }
];

const FAQS = [
  {
    q: "How accurate is the AI feedback?",
    a: "Our AI analysis system leverages advanced speech-to-text models combined with custom large language models fine-tuned on thousands of successful tech industry interviews. Feedback on structure (like the STAR method), technical accuracy, pacing, and keyword inclusion achieves a 95%+ correlation with professional recruiter assessments."
  },
  {
    q: "Is my data and video recording private?",
    a: "Absolutely. We prioritize your privacy above all else. Your mock interview video, audio streams, and transcripts are fully encrypted in transit and at rest. They are only accessible to you. We do not sell your data or use your personal recordings to train public models. You can delete your recordings and profile at any time."
  },
  {
    q: "What types of interviews do you support?",
    a: "We support a wide array of tracks: technical coding challenges, system design architecture loops, behavioral STAR method coaching, product sense reviews, general HR screeners, and senior leadership case studies. You can select custom roles, customize experience levels, or even paste your own target job description for a tailored practice session."
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, you can cancel your subscription at any time. If you subscribe to our Pro plans, you can downgrade or cancel from your dashboard account settings in one click. You will retain access to your Pro features until the end of your billing cycle."
  }
];

export default function Page() {
  // Simulator State
  const [demoStage, setDemoStage] = useState<"idle" | "countdown" | "recording" | "feedback">("idle");
  const [countdown, setCountdown] = useState(3);
  const [speechText, setSpeechText] = useState("");
  const [audioBars, setAudioBars] = useState<number[]>([15, 20, 10, 40, 15, 30, 10, 15, 30, 45, 10, 20, 15, 10, 25]);
  const [hasWebcamPermission, setHasWebcamPermission] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  // Role & Level State
  const [selectedRole, setSelectedRole] = useState<string>("frontend");
  const [selectedLevel, setSelectedLevel] = useState<string>("junior");
  const [trackQuestionIndex, setTrackQuestionIndex] = useState(0);

  // Pricing State
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speechIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const waveformIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset track question index if role or level changes
  useEffect(() => {
    setTrackQuestionIndex(0);
  }, [selectedRole, selectedLevel]);

  // Audio Waveform Animation
  useEffect(() => {
    if (demoStage === "recording") {
      waveformIntervalRef.current = setInterval(() => {
        setAudioBars(prev => prev.map(() => Math.floor(Math.random() * 45) + 5));
      }, 100);
    } else {
      if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
      setAudioBars([15, 20, 10, 20, 15, 30, 10, 15, 20, 30, 10, 20, 15, 10, 15]);
    }
    return () => {
      if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
    };
  }, [demoStage]);

  // Countdown timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (demoStage === "countdown") {
      if (countdown > 1) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        timer = setTimeout(() => {
          setDemoStage("recording");
          startMockSpeechText();
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [demoStage, countdown]);

  // Cleanup webcam stream on unmount
  useEffect(() => {
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [webcamStream]);

  // Request webcam access
  const enableWebcam = async () => {
    try {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        setWebcamStream(null);
        setHasWebcamPermission(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setWebcamStream(stream);
      setHasWebcamPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied or unsupported:", err);
      alert("Could not access camera. Using premium abstract visualization mode instead!");
      setHasWebcamPermission(false);
    }
  };

  const startDemo = () => {
    setCountdown(3);
    setDemoStage("countdown");
    setSpeechText("");
  };

  const stopDemo = () => {
    if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    setDemoStage("feedback");
  };

  const resetDemo = () => {
    if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    setDemoStage("idle");
    setSpeechText("");
  };

  // Mock transcription generation
  const startMockSpeechText = () => {
    const textSegments = [
      "To optimize rendering in React, ",
      "we can use React.memo to prevent unnecessary re-renders ",
      "for functional components whose props haven't changed. ",
      "Additionally, the useMemo and useCallback hooks help preserve referential identity ",
      "of objects and functions across renders. ",
      "By avoiding deep component re-evaluations, we can achieve 60 frames-per-second scrolling, ",
      "especially inside large database dashboard views..."
    ];
    let currentIndex = 0;
    setSpeechText("");

    speechIntervalRef.current = setInterval(() => {
      if (currentIndex < textSegments.length) {
        setSpeechText(prev => prev + textSegments[currentIndex]);
        currentIndex++;
      } else {
        if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
        setDemoStage("feedback");
      }
    }, 1800);
  };

  // Safe question retrieval helper
  const getQuestion = (role: string, level: string, index: number): string => {
    const roleMap = ROLE_QUESTIONS[role];
    if (!roleMap) return "Question loading...";
    const questions = roleMap[level];
    if (!questions || questions.length === 0) return "Question loading...";
    return questions[index % questions.length];
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 font-sans selection:bg-brand-violet/30 overflow-x-hidden relative">
      
      {/* Background glow graphics */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-violet/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[1000px] left-10 w-[400px] h-[400px] bg-brand-indigo/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg-overlay pointer-events-none -z-20 opacity-60" />

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-brand-violet to-brand-blue rounded-xl shadow-lg shadow-brand-violet/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3 6-6" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              HireLoop
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#tracks" className="hover:text-white transition-colors duration-200">Interview Tracks</a>
            <a href="#methodology" className="hover:text-white transition-colors duration-200">Methodology</a>
            <a href="#testimonials" className="hover:text-white transition-colors duration-200">Success Stories</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-brand-violet to-brand-indigo hover:from-brand-violet hover:to-brand-blue shadow-md hover:shadow-lg shadow-brand-violet/20 hover:scale-[1.02] transition-all duration-200">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Coach pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-brand-violet/30 bg-brand-violet/10 text-xs font-semibold text-brand-violet animate-pulse-glow mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MEET YOUR AI COACH</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Master Every Interview with Your{" "}
          <span className="bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-blue bg-clip-text text-transparent italic pr-2">
            AI-Powered
          </span>
          Copilot.
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
          Stop guessing. HireLoop provides real-time feedback, behavioral analysis, and industry-specific simulations to help you land your dream offer.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl text-white bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-blue hover:scale-[1.03] shadow-xl shadow-brand-violet/25 hover:shadow-brand-indigo/35 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Get Started for Free</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>View Demo Room</span>
          </a>
        </div>

        {/* Feature points */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-900">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Personalized Tracks</span>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-lg bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Real-Time Analysis</span>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Fast AI Feedback</span>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Secure & Private</span>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO ROOM SECTION */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Try the AI Interview Simulator
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Experience our real-time feedback loops. Click start, answer the prompt, and review instant telemetry analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* Left panel: Camera & Simulator controls */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-white/5 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            
            {/* Upper state indicators */}
            <div className="flex items-center justify-between mb-6 z-10">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${demoStage === "recording" ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  {demoStage === "recording" ? "Live Recording Session" : "Simulator Ready"}
                </span>
              </div>
              <button 
                onClick={enableWebcam} 
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 ${
                  hasWebcamPermission 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20" 
                    : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{hasWebcamPermission ? "Disable Webcam" : "Test Webcam"}</span>
              </button>
            </div>

            {/* Video / Visual Screen Area */}
            <div className="aspect-video w-full rounded-2xl bg-[#090A11] border border-white/5 relative flex items-center justify-center overflow-hidden mb-6 group shadow-inner">
              
              {/* Webcam view */}
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${
                  hasWebcamPermission && webcamStream ? "opacity-75" : "opacity-0 pointer-events-none"
                }`}
              />

              {/* Mock visualization if webcam is off */}
              {(!hasWebcamPermission || !webcamStream) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-b from-[#131526] to-[#0A0B14]">
                  {/* Floating abstract voice icon */}
                  <div className="w-16 h-16 rounded-full bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet mb-4 shadow-lg animate-float">
                    <Mic className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">AI Audio/Video Feed</span>
                  <span className="text-xs text-slate-500 mt-1 max-w-xs">
                    Enable webcam above, or use the interactive audio simulation below
                  </span>
                </div>
              )}

              {/* Countdown Overlay */}
              {demoStage === "countdown" && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-20">
                  <div className="text-7xl font-extrabold text-brand-violet animate-ping">{countdown}</div>
                  <div className="text-sm font-semibold text-slate-400 mt-4">Preparing simulation room...</div>
                </div>
              )}

              {/* Idle screen trigger */}
              {demoStage === "idle" && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-10 transition-opacity">
                  <button 
                    onClick={startDemo}
                    className="w-14 h-14 rounded-full bg-brand-violet hover:bg-brand-indigo text-white flex items-center justify-center shadow-lg shadow-brand-violet/30 hover:shadow-brand-indigo/40 hover:scale-110 transition-all duration-300"
                  >
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </button>
                </div>
              )}

              {/* Bottom active telemetry indicators */}
              {demoStage === "recording" && (
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur border border-white/5 px-4 py-2.5 rounded-xl flex items-center justify-between z-10">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-end space-x-1.5 h-6">
                      {audioBars.map((bar, idx) => (
                        <div
                          key={idx}
                          className="w-1 bg-brand-violet rounded-full transition-all duration-105"
                          style={{ 
                            height: `${bar}%`,
                            animation: `wave-bounce ${0.5 + (idx % 5) * 0.2}s ease-in-out infinite alternate`
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono text-slate-400">00:12</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">Analyzing Speech</span>
                  </div>
                </div>
              )}
            </div>

            {/* Controls panel */}
            <div className="flex items-center justify-between gap-4">
              {demoStage === "idle" && (
                <button
                  onClick={startDemo}
                  className="w-full py-3.5 bg-brand-violet hover:bg-brand-indigo text-white font-bold rounded-xl shadow-lg shadow-brand-violet/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Practice Session</span>
                </button>
              )}

              {demoStage === "countdown" && (
                <button
                  disabled
                  className="w-full py-3.5 bg-slate-800 text-slate-500 font-bold rounded-xl cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>Readying...</span>
                </button>
              )}

              {demoStage === "recording" && (
                <button
                  onClick={stopDemo}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 animate-pulse"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop & Generate Feedback</span>
                </button>
              )}

              {demoStage === "feedback" && (
                <div className="w-full flex gap-3">
                  <button
                    onClick={startDemo}
                    className="flex-1 py-3 bg-brand-violet/20 hover:bg-brand-violet/30 border border-brand-violet/40 text-brand-violet font-semibold rounded-xl transition-all"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={resetDemo}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all"
                  >
                    Reset Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Real-time Transcript & AI Scoring */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Question display card */}
            <div className="glass-panel rounded-3xl p-6 border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-violet bg-brand-violet/10 border border-brand-violet/20 px-2.5 py-1 rounded-md">
                Active Prompt
              </span>
              <h3 className="text-md font-semibold text-white mt-3 leading-snug">
                {getQuestion(selectedRole, selectedLevel, trackQuestionIndex)}
              </h3>
            </div>

            {/* Transcription display card */}
            <div className="glass-panel rounded-3xl p-6 border border-white/5 flex-1 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1 rounded-md">
                  Live Transcription
                </span>
                <div className="mt-4 text-sm text-slate-300 leading-relaxed font-sans min-h-[100px] max-h-[140px] overflow-y-auto no-scrollbar font-normal">
                  {demoStage === "idle" && (
                    <span className="text-slate-500 italic">Start the practice session to generate real-time transcript answers.</span>
                  )}
                  {demoStage === "countdown" && (
                    <span className="text-slate-500 italic">Initializing speech-to-text connection...</span>
                  )}
                  {demoStage === "recording" && (
                    <>
                      <span>{speechText}</span>
                      <span className="inline-block w-1.5 h-4 ml-1 bg-brand-violet animate-pulse" />
                    </>
                  )}
                  {demoStage === "feedback" && (
                    <span className="text-slate-300">{speechText || "To optimize rendering in React, we can use React.memo to prevent unnecessary re-renders for functional components whose props haven't changed. Additionally, the useMemo and useCallback hooks help preserve referential identity of objects and functions across renders. By avoiding deep component re-evaluations, we can achieve 60 frames-per-second scrolling, especially inside large database dashboard views..."}</span>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-3 flex items-center justify-between">
                <span>Model: HireLoop-Audio-v2.1</span>
                <span>Language: English (US)</span>
              </div>
            </div>

            {/* AI Scoring Display Card */}
            <div className="glass-panel rounded-3xl p-6 border border-white/5 relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-md">
                AI Diagnostics Feedback
              </span>

              {/* Overlay locked cover when idle/recording */}
              {(demoStage === "idle" || demoStage === "countdown" || demoStage === "recording") && (
                <div className="absolute inset-0 bg-[#131526]/95 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center select-none">
                  <Lock className="w-8 h-8 text-slate-500 mb-2" />
                  <span className="text-sm font-semibold text-slate-300">Telemetry Feedback Locked</span>
                  <span className="text-xs text-slate-500 max-w-[200px] mt-1">
                    Complete the interview prompt recording to analyze performance metrics.
                  </span>
                </div>
              )}

              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Pacing (Speech Rate)</span>
                    <span className="text-brand-violet font-bold">142 WPM (Optimal)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-violet to-brand-indigo w-[90%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Keywords Inclusion</span>
                    <span className="text-brand-blue font-bold">85% Match</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-blue to-cyan-400 w-[85%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Tone & Volume</span>
                    <span className="text-emerald-400 font-bold">Confident (45dB)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 w-[95%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Answer Structuring</span>
                    <span className="text-pink-400 font-bold">STAR Method Match</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-400 to-rose-400 w-[78%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALIZED TRACKS SECTION */}
      <section id="tracks" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Track cards list */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">Curriculum Suite</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
                Specialized Interview Tracks
              </h2>
              <p className="text-slate-400">
                We adjust model parameters based on specific targets. Practice focused loops for major tech screening layers.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: "HR Round", desc: "General behavioral questions, core company value alignment, and cultural fit validations.", icon: Users, color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
                { title: "Behavioral Round", desc: "Soft skill assessments focused on leadership, teamwork, stress response, and STAR structure alignment.", icon: MessageSquare, color: "bg-pink-500/10 border-pink-500/20 text-pink-400" },
                { title: "Coding Round", desc: "Interactive algorithmic challenges, time complexity evaluations, and array/tree/graph optimization loops.", icon: Cpu, color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
                { title: "Technical Architecture", desc: "Deep dives on system design, microservices, load balancing, databases, and caching strategies.", icon: Target, color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
                { title: "Leadership Executive", desc: "Strategic thinking, budget resource planning, conflict resolution, and product management simulation scripts.", icon: Award, color: "bg-amber-500/10 border-amber-500/20 text-amber-400" }
              ].map((track, index) => {
                const IconComponent = track.icon;
                return (
                  <div key={index} className="flex gap-4 p-5 rounded-2xl bg-[#131526]/50 border border-white/5 hover:border-slate-800 transition-all group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${track.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-brand-violet transition-colors">{track.title}</h4>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{track.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Role & Level Interactive Card selectors */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
            
            {/* Supported Roles Selectors */}
            <div className="glass-panel rounded-3xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Supported Technical Roles</h3>
              <p className="text-xs text-slate-400 mb-6 font-normal">Select a profile target to adjust the simulator's knowledge base parameters:</p>
              
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: "frontend", label: "Frontend" },
                  { id: "backend", label: "Backend" },
                  { id: "fullstack", label: "Fullstack" },
                  { id: "qa", label: "QA Engineer" },
                  { id: "ai", label: "AI Engineer" },
                  { id: "data_science", label: "Data Scientist" }
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-full border cursor-pointer transition-all ${
                      selectedRole === role.id 
                        ? "bg-brand-violet text-white border-brand-violet shadow-md shadow-brand-violet/20" 
                        : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience level Selector */}
            <div className="glass-panel rounded-3xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">Adaptive Experience Levels</h3>
              <p className="text-xs text-slate-400 mb-5 font-normal">Our AI adjusts question difficulty based on seniority loops:</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "fresher", label: "Fresher" },
                  { id: "junior", label: "Junior (1-3y)" },
                  { id: "mid_senior", label: "Mid-Senior (3-8y)" },
                  { id: "senior", label: "Senior (8y+)" }
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`py-3 px-2 text-xs font-semibold rounded-xl border text-center cursor-pointer transition-all ${
                      selectedLevel === level.id 
                        ? "bg-brand-blue text-white border-brand-blue shadow-md shadow-brand-blue/20" 
                        : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Question Preview Board */}
            <div className="glass-panel-highlight rounded-3xl p-6 border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-violet/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Question Library Showcase
                </span>
                <span className="text-[10px] font-bold text-brand-violet bg-brand-violet/10 border border-brand-violet/20 px-2 py-0.5 rounded uppercase">
                  {selectedRole} • {selectedLevel}
                </span>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-4 border border-white/5 mb-4">
                <p className="text-sm font-semibold text-white leading-relaxed">
                  "{getQuestion(selectedRole, selectedLevel, trackQuestionIndex)}"
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setTrackQuestionIndex(prev => prev + 1)}
                  className="text-xs text-brand-violet hover:text-brand-indigo font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <span>Cycle next prompt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href="#demo"
                  onClick={() => {
                    // Pre-fill simulator questions if user clicks this action
                    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-[10px] font-bold uppercase rounded-lg border border-slate-800 text-slate-300 hover:text-white"
                >
                  Load in simulator
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">Workflow Strategy</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">How it Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto font-normal">Get your custom prep workspace online in just 4 simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Upload Resume", desc: "Securely drag in your portfolio resume. Our parser highlights technical skills and projects." },
            { step: "2", title: "Start Interview", desc: "Select roles and experience scales. Start realistic video and speech simulators." },
            { step: "3", title: "Receive Feedback", desc: "Receive immediate detailed diagnostics reporting covering metrics and pacing." },
            { step: "4", title: "Refine & Impress", desc: "Follow customized remediation tips and review sample ideal responses." }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-6 border border-white/5 relative group hover:scale-[1.01] transition-all">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-md font-extrabold text-brand-violet group-hover:bg-brand-violet group-hover:text-white transition-all duration-300 mb-5 shadow">
                {item.step}
              </div>
              <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEEP LEARNING METHODOLOGY SECTION */}
      <section id="methodology" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-16">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">Engine Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">Deep-learning Methodology</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Our platform's core advanced LLM/ML sentiment and speech analytics provide unparalleled diagnostics accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Simulated Practice</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal mb-6">
                Immerse yourself answering questions specifically generated by our industry-trained AI models in real time.
              </p>
            </div>

            {/* Dashboard Mock 1 */}
            <div className="bg-[#090A11] rounded-2xl border border-white/5 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Webcam Stream</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />Rec</span>
              </div>
              <div className="h-28 rounded-lg bg-gradient-to-tr from-slate-900 to-[#131526] relative overflow-hidden flex items-center justify-center">
                {/* SVG mock person avatar */}
                <svg className="w-10 h-10 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                {/* Overlay waves */}
                <div className="absolute bottom-2 left-2 right-2 h-4 flex items-end justify-center gap-0.5">
                  <div className="w-0.5 h-3 bg-brand-violet rounded-full" />
                  <div className="w-0.5 h-4 bg-brand-violet rounded-full" />
                  <div className="w-0.5 h-2 bg-brand-violet rounded-full" />
                  <div className="w-0.5 h-5 bg-brand-violet rounded-full" />
                  <div className="w-0.5 h-3 bg-brand-violet rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal mb-6">
                Get direct visual feedback on your body language, tone of voice, pacing, and keyword relevance within seconds.
              </p>
            </div>

            {/* Dashboard Mock 2 */}
            <div className="bg-[#090A11] rounded-2xl border border-white/5 p-4 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-500">Live Speech Telemetry</span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[9px] font-semibold mb-0.5 text-slate-400">
                    <span>Clarity Score</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue w-[92%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-semibold mb-0.5 text-slate-400">
                    <span>Filler words</span>
                    <span>0.8 / min</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[95%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-semibold mb-0.5 text-slate-400">
                    <span>Confidence metrics</span>
                    <span>Excellent</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-violet w-[88%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-5">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Targeted Coaching</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal mb-6">
                Receive actionable tips and customized action plans to resolve your structural weaknesses and build interview confidence.
              </p>
            </div>

            {/* Dashboard Mock 3 */}
            <div className="bg-[#090A11] rounded-2xl border border-white/5 p-4 flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-500">Coach Remediations</span>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-white/5">
                  <div className="w-4 h-4 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="text-[10px] text-slate-300">
                    <span className="font-bold text-white block">Strong introduction structure</span>
                    Hit key resume achievements inside 60 seconds.
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-white/5">
                  <div className="w-4 h-4 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div className="text-[10px] text-slate-300 font-normal">
                    <span className="font-bold text-white block">Structure your star result</span>
                    Detail the metric impact of your backend migration project.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CAREER SUCCESS STORIES SECTION */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-16">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">Career Success Stories</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Join 20,000+ candidates who landed software roles at industry leaders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="glass-panel rounded-3xl p-8 border border-white/5 flex flex-col justify-between relative group hover:scale-[1.01] transition-all">
              <span className="text-5xl text-brand-violet/20 font-serif absolute top-4 left-4 select-none">“</span>
              <p className="text-sm text-slate-300 italic relative z-10 leading-relaxed mb-8 font-normal">
                {t.quote}
              </p>
              
              <div className="flex items-center space-x-3 border-t border-slate-900 pt-6">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
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

      {/* PRICING PLANS SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">Flexible Packages</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">Invest in Your Career</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 font-normal">Plans designed for every stage of your job search prep journey.</p>
          
          {/* Toggle Monthly / Annual */}
          <div className="inline-flex items-center bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                billingPeriod === "monthly"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annually")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                billingPeriod === "annually"
                  ? "bg-brand-violet text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Billed Annually</span>
              <span className="px-1.5 py-0.5 bg-white/20 text-[9px] font-extrabold rounded-md text-white">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Starter Plan */}
          <div className="glass-panel rounded-3xl p-8 border border-white/5 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starter</span>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-sm text-slate-500 ml-2">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-normal">Free diagnostics baseline parameters access.</p>
              
              <ul className="mt-8 space-y-4 text-xs text-slate-300 font-normal">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-violet shrink-0" />
                  <span>2 AI Simulations / Week</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-violet shrink-0" />
                  <span>Basic Sentiment Analysis score</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-violet shrink-0" />
                  <span>Public Job Board access</span>
                </li>
              </ul>
            </div>
            <button className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all">
              Get Started
            </button>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="glass-panel-highlight rounded-3xl p-8 border flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 bg-brand-violet text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Most Popular
            </div>

            <div>
              <span className="text-xs font-bold text-brand-violet uppercase tracking-wider">Pro Tier</span>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">
                  {billingPeriod === "monthly" ? "$29" : "$23"}
                </span>
                <span className="text-sm text-slate-500 ml-2">/ month</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-normal">Full access suite for active job search runs.</p>
              
              <ul className="mt-8 space-y-4 text-xs text-slate-300 font-normal">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-violet shrink-0" />
                  <span className="font-semibold text-white">Unlimited Simulations</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-violet shrink-0" />
                  <span>Full Video & Tone Coaching analytics</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-violet shrink-0" />
                  <span>Custom Role Benchmarking algorithms</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-violet shrink-0" />
                  <span>Resume Scanner & Improver utility</span>
                </li>
              </ul>
            </div>
            <button className="w-full mt-8 py-3.5 bg-gradient-to-r from-brand-violet to-brand-indigo hover:from-brand-violet hover:to-brand-blue text-white font-bold rounded-xl shadow-lg shadow-brand-violet/20 hover:scale-[1.01] cursor-pointer transition-all">
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-panel rounded-3xl p-8 border border-white/5 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enterprise</span>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-normal">White-label university and corporate portals.</p>
              
              <ul className="mt-8 space-y-4 text-xs text-slate-300 font-normal">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-violet shrink-0" />
                  <span>Team Analytics Dashboard</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-violet shrink-0" />
                  <span>White-label platform branding</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-violet shrink-0" />
                  <span>Dedicated Success Manager</span>
                </li>
              </ul>
            </div>
            <button className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all">
              Contact Sales
            </button>
          </div>

        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400">Everything you need to know about the HireLoop platform.</p>
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
                  className="w-full p-6 text-left flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-brand-violet cursor-pointer transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-violet" : ""}`} 
                  />
                </button>
                
                {/* Expandable answer panel */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px] border-t border-slate-900" : "max-h-0"
                  }`}
                >
                  <p className="p-6 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel-highlight rounded-3xl p-8 sm:p-12 border relative overflow-hidden text-center max-w-5xl mx-auto">
          {/* Decorative glows */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-brand-violet/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Land the Offer?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed mb-8 font-normal">
            Join thousands of successful candidates today. Your next career milestone is just a loop away.
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 hover:scale-[1.02] shadow-xl transition-all duration-200"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 flex items-center justify-center bg-gradient-to-tr from-brand-violet to-brand-blue rounded-lg">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3 6-6" />
              </svg>
            </div>
            <span className="text-base font-bold text-white">HireLoop</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-normal">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Contact Support</a>
          </div>

          <p className="text-xs text-slate-600 font-normal">
            &copy; {new Date().getFullYear()} HireLoop AI. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
