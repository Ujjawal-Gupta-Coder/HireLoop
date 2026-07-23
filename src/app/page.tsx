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
  MessageSquare,
  Terminal,
  RefreshCw
} from "lucide-react";
import {
  IconRoute,
  IconTimeline,
  IconBrain,
  IconShieldLock
} from "@tabler/icons-react";

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
    color: "bg-teal-600"
  },
  {
    quote: "The behavioral feedback was incredibly accurate. It helped me structure my thoughts using the STAR method and feel completely confident during the actual loop.",
    name: "Sarah Chen",
    role: "Software Engineer at Stripe",
    avatar: "SC",
    color: "bg-emerald-600"
  },
  {
    quote: "As a career switcher, the technical sessions were invaluable. The AI asked relevant, deep follow-up questions that tested my system architecture knowledge.",
    name: "Alex Rodriguez",
    role: "Product Manager at Airbnb",
    avatar: "AR",
    color: "bg-teal-700"
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

interface CodingChallenge {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  initialCode: string;
  testCases: { input: string; expected: string }[];
  aiFeedback: {
    timeComplexity: string;
    spaceComplexity: string;
    suggestions: string[];
    score: number;
  };
}

const CODING_CHALLENGES: Record<string, CodingChallenge[]> = {
  frontend: [
    {
      title: "Custom Array Filter",
      difficulty: "Easy",
      description: "Implement a function `myFilter(arr, callback)` that behaves exactly like `Array.prototype.filter()`. It should construct a new array with elements that pass the callback test.",
      initialCode: `function myFilter(arr, callback) {
  // Write your code here
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i], i, arr)) {
      result.push(arr[i]);
    }
  }
  return result;
}`,
      testCases: [
        { input: "myFilter([1, 2, 3, 4], x => x % 2 === 0)", expected: "[2, 4]" },
        { input: "myFilter(['apple', 'banana', 'kiwi'], s => s.length > 5)", expected: "['banana']" },
        { input: "myFilter([10, -5, 0], x => x > 0)", expected: "[10]" }
      ],
      aiFeedback: {
        timeComplexity: "O(N) where N is the number of elements in the array.",
        spaceComplexity: "O(N) in the worst case to store the filtered output array.",
        suggestions: [
          "Check for null or undefined callback before executing.",
          "Ensure sparse arrays are handled without invoking the callback on empty indices."
        ],
        score: 95
      }
    }
  ],
  backend: [
    {
      title: "Two Sum",
      difficulty: "Easy",
      description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Assume each input has exactly one solution and do not use the same element twice.",
      initialCode: `function twoSum(nums, target) {
  // Write your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      testCases: [
        { input: "twoSum([2, 7, 11, 15], 9)", expected: "[0, 1]" },
        { input: "twoSum([3, 2, 4], 6)", expected: "[1, 2]" },
        { input: "twoSum([3, 3], 6)", expected: "[0, 1]" }
      ],
      aiFeedback: {
        timeComplexity: "O(N) using a single-pass hash map lookup.",
        spaceComplexity: "O(N) to store values in the hash map.",
        suggestions: [
          "Your current single-pass Map solution is highly optimized.",
          "Make sure to handle potential large inputs and duplicate elements correctly."
        ],
        score: 98
      }
    }
  ],
  fullstack: [
    {
      title: "Deep Clone Object",
      difficulty: "Medium",
      description: "Write a function `deepClone(obj)` that returns a deep copy of an object. The function should handle nested objects, arrays, and primitive values.",
      initialCode: `function deepClone(obj) {
  // Write your code here
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}`,
      testCases: [
        { input: "deepClone({ a: 1, b: { c: 2 } })", expected: "{ a: 1, b: { c: 2 } }" },
        { input: "deepClone([1, [2, 3]])", expected: "[1, [2, 3]]" },
        { input: "deepClone(null)", expected: "null" }
      ],
      aiFeedback: {
        timeComplexity: "O(M) where M is the total number of nested properties/nodes.",
        spaceComplexity: "O(D) call stack space where D is the maximum depth of recursion.",
        suggestions: [
          "Avoid using JSON.parse(JSON.stringify(x)) as it fails on functions, Symbols, and Date objects.",
          "Consider handling circular references using a Map or WeakMap to avoid stack overflows."
        ],
        score: 92
      }
    }
  ],
  qa: [
    {
      title: "Validate Bracket Sequence",
      difficulty: "Easy",
      description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Brackets must close in correct order and type.",
      initialCode: `function isValidBrackets(s) {
  // Write your code here
  const stack = [];
  const matches = { ')': '(', '}': '{', ']': '[' };
  for (let char of s) {
    if (['(', '{', '['].includes(char)) {
      stack.push(char);
    } else if (matches[char]) {
      if (stack.pop() !== matches[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
      testCases: [
        { input: "isValidBrackets('()[]{}')", expected: "true" },
        { input: "isValidBrackets('(]')", expected: "false" },
        { input: "isValidBrackets('([)]')", expected: "false" }
      ],
      aiFeedback: {
        timeComplexity: "O(N) where N is the length of the input string.",
        spaceComplexity: "O(N) to store unmatched open brackets in the stack.",
        suggestions: [
          "Nice usage of stack data structure.",
          "Add handling for characters other than brackets if the input allows them, or ensure strict input checks."
        ],
        score: 96
      }
    }
  ],
  ai: [
    {
      title: "Compute Cosine Similarity",
      difficulty: "Medium",
      description: "Calculate the cosine similarity between two numeric vectors of equal length. Formula: Similarity = (A • B) / (||A|| * ||B||). Return 0 if either vector magnitude is 0.",
      initialCode: `function cosineSimilarity(vecA, vecB) {
  // Write your code here
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}`,
      testCases: [
        { input: "cosineSimilarity([1, 2], [2, 4])", expected: "1.0" },
        { input: "cosineSimilarity([1, 0], [0, 1])", expected: "0.0" },
        { input: "cosineSimilarity([3, 8, 7], [-1, 2, 4])", expected: "0.85" }
      ],
      aiFeedback: {
        timeComplexity: "O(D) where D is the dimension of the vectors.",
        spaceComplexity: "O(1) auxiliary space.",
        suggestions: [
          "Validate that vecA and vecB are of equal length before iterating.",
          "Watch out for floating point precision issues; round off results when appropriate."
        ],
        score: 93
      }
    }
  ],
  data_science: [
    {
      title: "Calculate Mean and Median",
      difficulty: "Easy",
      description: "Given an array of numbers, return an object containing the mean and median of the values. If the array is empty, return null.",
      initialCode: `function getMeanMedian(nums) {
  // Write your code here
  if (!nums || nums.length === 0) return null;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 
    ? sorted[mid] 
    : (sorted[mid - 1] + sorted[mid]) / 2;
  return { mean, median };
}`,
      testCases: [
        { input: "getMeanMedian([1, 3, 3, 6, 7, 8, 9])", expected: "{ mean: 5.28, median: 6 }" },
        { input: "getMeanMedian([1, 2, 3, 4])", expected: "{ mean: 2.5, median: 2.5 }" },
        { input: "getMeanMedian([])", expected: "null" }
      ],
      aiFeedback: {
        timeComplexity: "O(N log N) dominated by sorting the array to find the median.",
        spaceComplexity: "O(N) to copy and store the sorted array.",
        suggestions: [
          "To optimize finding median for large datasets, consider Quickselect algorithm which runs in O(N) average time.",
          "Be careful with sorting numbers in JavaScript using `.sort()`: always provide a compare function `(a, b) => a - b`."
        ],
        score: 97
      }
    }
  ]
};

export default function Page() {
  // Tabs State
  const [activeTab, setActiveTab] = useState<"audio" | "coding">("audio");

  // Audio Simulator State
  const [audioStage, setAudioStage] = useState<"idle" | "countdown" | "active" | "feedback">("idle");
  const [audioCountdown, setAudioCountdown] = useState(3);
  const [audioSpeechText, setAudioSpeechText] = useState("");
  const [audioBars, setAudioBars] = useState<number[]>([15, 20, 10, 40, 15, 30, 10, 15, 30, 45, 10, 20, 15, 10, 25]);
  const [audioSpeaker, setAudioSpeaker] = useState<"ai" | "candidate">("ai");

  // Coding Simulator State
  const [codingStage, setCodingStage] = useState<"idle" | "running" | "feedback">("idle");
  const [editorCode, setEditorCode] = useState("");
  const [runStatus, setRunStatus] = useState("");
  const [completedTests, setCompletedTests] = useState<Record<number, "pending" | "running" | "passed">>({});

  // Role & Level State
  const [selectedRole, setSelectedRole] = useState<string>("frontend");
  const [selectedLevel, setSelectedLevel] = useState<string>("junior");
  const [trackQuestionIndex, setTrackQuestionIndex] = useState(0);

  // Pricing State
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const speechIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const waveformIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset track question index if role or level changes
  useEffect(() => {
    setTrackQuestionIndex(0);
  }, [selectedRole, selectedLevel]);

  // Helper for loading selected coding challenge boilerplate
  const getChallengeForRole = (role: string): CodingChallenge => {
    const list = CODING_CHALLENGES[role] || CODING_CHALLENGES["backend"];
    return list[0];
  };

  // Sync editor boilerplates when active role is updated
  useEffect(() => {
    const challenge = getChallengeForRole(selectedRole);
    setEditorCode(challenge.initialCode);
    setCodingStage("idle");
    setCompletedTests({});
    setRunStatus("");
  }, [selectedRole]);

  // Audio Waveform Animation
  useEffect(() => {
    if (audioStage === "active") {
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
  }, [audioStage]);

  // Audio countdown timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (audioStage === "countdown") {
      if (audioCountdown > 1) {
        timer = setTimeout(() => setAudioCountdown(audioCountdown - 1), 1000);
      } else {
        timer = setTimeout(() => {
          setAudioStage("active");
          setAudioSpeaker("ai");
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [audioStage, audioCountdown]);

  // Audio speech transcription & speaker turn simulation
  useEffect(() => {
    let speakInterval: NodeJS.Timeout;
    let turnTimeout: NodeJS.Timeout;

    if (audioStage === "active") {
      if (audioSpeaker === "ai") {
        setAudioSpeechText(`AI Coach: "Welcome to your practice room. Let's evaluate your domain skills. Here is my question for you: ${getQuestion(selectedRole, selectedLevel, trackQuestionIndex)}"`);
        
        // AI Coach speaks for 4 seconds, then turns to candidate
        turnTimeout = setTimeout(() => {
          setAudioSpeaker("candidate");
        }, 4000);
      } else {
        // Candidate speaking simulation
        const textSegments = [
          "To address this question, ",
          "I usually start by identifying the performance bottlenecks. ",
          "Specifically, we want to optimize structural elements, use proper caching strategies, ",
          "and ensure that our main execution loops are non-blocking. ",
          "By doing this, we minimize computational latency and provide an optimal user experience."
        ];
        let currentIndex = 0;
        setAudioSpeechText(prev => prev + "\n\nCandidate: ");

        speakInterval = setInterval(() => {
          if (currentIndex < textSegments.length) {
            setAudioSpeechText(prev => prev + textSegments[currentIndex]);
            currentIndex++;
          } else {
            clearInterval(speakInterval);
            // Auto complete call and show feedback after answer ends
            setAudioStage("feedback");
          }
        }, 1500);
      }
    }

    return () => {
      clearInterval(speakInterval);
      clearTimeout(turnTimeout);
    };
  }, [audioStage, audioSpeaker]);

  const startAudioDemo = () => {
    setAudioCountdown(3);
    setAudioStage("countdown");
    setAudioSpeechText("");
  };

  const stopAudioDemo = () => {
    setAudioStage("feedback");
  };

  const resetAudioDemo = () => {
    setAudioStage("idle");
    setAudioSpeechText("");
  };

  // Run tests simulation for coding workspace
  const runCodeTests = () => {
    setCodingStage("running");
    setRunStatus("Compiling and executing tests on sandbox environment...");
    setCompletedTests({ 0: "running", 1: "pending", 2: "pending" });

    setTimeout(() => {
      setCompletedTests({ 0: "passed", 1: "running", 2: "pending" });
      
      setTimeout(() => {
        setCompletedTests({ 0: "passed", 1: "passed", 2: "running" });

        setTimeout(() => {
          setCompletedTests({ 0: "passed", 1: "passed", 2: "passed" });
          setRunStatus("All 3 tests passed successfully! 🎉");
          setCodingStage("feedback");
        }, 800);
      }, 800);
    }, 800);
  };

  // Safe question retrieval helper
  const getQuestion = (role: string, level: string, index: number): string => {
    const roleMap = ROLE_QUESTIONS[role];
    if (!roleMap) return "Question loading...";
    const questions = roleMap[level];
    if (!questions || questions.length === 0) return "Question loading...";
    return questions[index % questions.length];
  };

  const activeChallenge = getChallengeForRole(selectedRole);

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 font-sans selection:bg-brand-teal/30 overflow-x-hidden relative">
      
      {/* Background glow graphics */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-emerald-50/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[1000px] left-10 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg-overlay pointer-events-none -z-20 opacity-60" />

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="relative w-9 h-9 flex items-center justify-center bg-teal-600 rounded-xl shadow-lg shadow-teal-900/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3 6-6" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
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
            <button className="px-4 py-2 text-sm font-semibold rounded-xl text-white bg-teal-600 hover:bg-teal-500 shadow-md hover:shadow-lg shadow-teal-900/30 hover:scale-[1.02] transition-all duration-200">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Coach tag */}
        <div className="inline-flex items-center px-2.5 py-1 rounded-md border border-teal-500/20 bg-teal-950/20 text-xs font-semibold tracking-wider text-teal-400 mb-8 uppercase">
          <span>Meet Your AI Coach</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Master Every Interview with Your{" "}
          <span className="text-teal-400 italic pr-2">
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
            className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl text-white bg-teal-600 hover:bg-teal-500 hover:scale-[1.03] shadow-xl shadow-teal-900/30 transition-all duration-300 flex items-center justify-center space-x-2"
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

        {/* Product UI Showcase */}
        <div className="max-w-5xl mx-auto w-full mb-24 mt-12 relative px-4 lg:px-0">
          
          {/* Subtle background glow behind the mockup */}
          <div className="absolute inset-0 bg-brand-teal/5 rounded-3xl blur-3xl pointer-events-none -z-10 transform scale-90" />
          
          {/* Main Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
            
            {/* LEFT COLUMN: Code Editor + Voice Panel */}
            <div className="lg:col-span-7 flex flex-col justify-between relative group min-h-[380px] lg:min-h-0">
              
              {/* VS Code–style Coding Interview Editor */}
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col h-full hover:border-teal-500/30 transition-all duration-300">
                {/* Editor Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/40 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/70 block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/70 block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/70 block" />
                  </div>
                  <div className="text-xs font-mono text-slate-400 flex items-center space-x-1.5 bg-slate-900/60 px-3 py-1 rounded-md border border-white/5">
                    <span className="text-teal-400">⚡</span>
                    <span>solution.ts</span>
                  </div>
                  <div className="w-12" />
                </div>

                {/* Editor Workspace */}
                <div className="p-5 font-mono text-xs text-left overflow-x-auto leading-relaxed bg-[#0F1210]/95 flex-grow no-scrollbar">
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">1</span>
                    <span className="text-teal-450">interface</span> <span className="text-blue-300">Result</span> {"{"}
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">2</span>
                    <span>  throughput: <span className="text-amber-405 text-amber-400">number</span>;</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">3</span>
                    <span>  active: <span className="text-amber-405 text-amber-400">boolean</span>;</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">4</span>
                    <span>{"}"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">5</span>
                    <span></span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">6</span>
                    <span className="text-teal-450 text-teal-400">function</span> <span className="text-yellow-300">optimizeStream</span>(<span>streams: Stream[]</span>): <span className="text-blue-300">Result</span> {"{"}
                  </div>
                  <div className="flex bg-teal-950/20 border-l-2 border-teal-500 -mx-5 px-5 py-0.5">
                    <span className="w-6 text-teal-600 select-none">7</span>
                    <span className="text-slate-500 italic">// 💡 AI Hint: Optimize N+1 database queries to minimize latency</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">8</span>
                    <span>  <span className="text-teal-450 text-teal-400">const</span> activeQueue = <span className="text-teal-450 text-teal-400">new</span> <span className="text-yellow-300">PriorityQueue</span>();</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">9</span>
                    <span>  <span className="text-teal-455 text-teal-450 text-teal-400">for</span> (<span className="text-teal-455 text-teal-450 text-teal-400 font-semibold">const</span> stream <span className="text-teal-450 text-teal-450 text-teal-400">of</span> streams) {"{"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">10</span>
                    <span>    <span className="text-teal-450 text-teal-450 text-teal-400">if</span> (stream.<span className="text-yellow-300">isActive</span>()) {"{"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">11</span>
                    <span>      activeQueue.<span className="text-yellow-300">enqueue</span>(stream, stream.priority);</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">12</span>
                    <span>    {"}"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">13</span>
                    <span>  {"}"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">14</span>
                    <span>  <span className="text-teal-450 text-teal-450 text-teal-400">return</span> activeQueue.<span className="text-yellow-300">process</span>();</span>
                  </div>
                  <div className="flex">
                    <span className="w-6 text-slate-600 select-none">15</span>
                    <span>{"}"}</span>
                  </div>
                </div>
              </div>

              {/* Overlapping AI Voice Panel */}
              <div className="absolute -bottom-6 -left-6 w-72 glass-panel rounded-2xl p-4 border border-teal-500/20 shadow-2xl shadow-black/60 hover:border-teal-500/45 transition-all duration-300 animate-float hidden sm:block">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center space-x-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                    </span>
                    <span className="text-teal-400">Voice Channel</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-white/5">05:24</span>
                </div>
                
                <div className="flex items-center space-x-3 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xs font-semibold animate-pulse shrink-0">
                    🎙️
                  </div>
                  <div className="flex-grow">
                    <div className="text-[10px] font-bold text-white flex justify-between">
                      <span>Interviewer AI</span>
                      <span className="text-teal-400 font-normal">Listening...</span>
                    </div>
                    {/* Live Waveform graphic using small SVG peaks */}
                    <div className="flex items-center space-x-0.5 mt-1.5 h-4">
                      <div className="w-[3px] bg-teal-500 rounded-full h-2 animate-wave-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-[3px] bg-teal-400 rounded-full h-3 animate-wave-bounce" style={{ animationDelay: '0.3s' }} />
                      <div className="w-[3px] bg-teal-500 rounded-full h-1 animate-wave-bounce" style={{ animationDelay: '0.5s' }} />
                      <div className="w-[3px] bg-emerald-400 rounded-full h-4 animate-wave-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-[3px] bg-teal-500 rounded-full h-2 animate-wave-bounce" style={{ animationDelay: '0.4s' }} />
                      <div className="w-[3px] bg-teal-400 rounded-full h-3.5 animate-wave-bounce" style={{ animationDelay: '0.7s' }} />
                      <div className="w-[3px] bg-teal-500 rounded-full h-1 animate-wave-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-[3px] bg-emerald-500 rounded-full h-2 animate-wave-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Chat Transcript + Report Card + Analytics */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 relative min-h-[380px] lg:min-h-0">
              
              {/* Conversation Transcript Panel */}
              <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-2xl flex flex-col justify-between h-full hover:border-teal-500/30 transition-all duration-300">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Live Evaluation Feed</span>
                  <span className="text-[9px] px-2 py-0.5 bg-slate-900 border border-white/5 text-slate-400 rounded-md font-mono">STAR Method Validations</span>
                </div>

                <div className="space-y-4 text-xs text-left font-sans flex-grow">
                  {/* AI Bubble */}
                  <div className="flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-[10px] text-teal-400 font-bold shrink-0">
                      AI
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-2xl rounded-tl-none border border-white/5 text-slate-300 leading-relaxed flex-1">
                      <span className="font-semibold text-white block mb-0.5 text-[10px]">AI Coach</span>
                      "Can you explain your system scaling strategy? How do you prevent replication lag?"
                    </div>
                  </div>

                  {/* Candidate Bubble */}
                  <div className="flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">
                      ME
                    </div>
                    <div className="bg-teal-950/20 p-3 rounded-2xl rounded-tl-none border border-teal-500/10 text-slate-200 leading-relaxed flex-1">
                      <span className="font-semibold text-teal-400 block mb-0.5 text-[10px] flex items-center justify-between">
                        <span>Candidate</span>
                        <span className="text-[8px] bg-teal-500/10 border border-teal-500/20 px-1 rounded text-teal-300">STAR: Situation</span>
                      </span>
                      "We noticed a 4-second replication delay during peak writes. I migrated write traffic to a redis-backed queue..."
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-4 text-[10px] text-slate-500 italic flex items-center justify-between">
                  <span>Sentiment Pacing: Stable (138 WPM)</span>
                  <span className="text-teal-450">STAR Match: 94%</span>
                </div>
              </div>

              {/* Floating Overlapping AI Report Card */}
              <div className="absolute -top-12 -right-8 w-64 glass-panel-highlight rounded-2xl p-4 border shadow-2xl hover:border-teal-500/50 transition-all duration-300 animate-float-delayed hidden sm:block">
                <div className="flex items-center justify-between border-b border-teal-500/20 pb-2 mb-3">
                  <span className="text-[10px] font-bold tracking-wider text-teal-400 uppercase">AI Evaluation</span>
                  <span className="text-xs font-bold text-white bg-teal-600/30 border border-teal-500/30 px-2 py-0.5 rounded-full">Score: 91%</span>
                </div>

                <div className="space-y-2.5 text-xs text-left">
                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-0.5">
                      <span>Communication Skills</span>
                      <span className="text-teal-400">95%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full w-[95%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-0.5">
                      <span>Coding Efficiency</span>
                      <span className="text-teal-400">92%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full w-[92%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-0.5">
                      <span>Problem Solving</span>
                      <span className="text-teal-400">88%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full w-[88%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Overlapping Analytics/Streak Panel */}
              <div className="absolute -bottom-8 -right-4 w-52 glass-panel rounded-2xl p-3.5 border border-white/10 shadow-2xl shadow-black/50 hover:border-teal-500/30 transition-all duration-300 animate-float hidden md:block">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Daily Practice</span>
                    <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <span>5 Day Streak</span>
                      <span className="text-teal-400 text-xs">🔥</span>
                    </span>
                  </div>
                  <div className="w-14 h-6 text-right">
                    {/* Tiny SVG sparkline path representing daily scores */}
                    <svg className="w-full h-full text-teal-500" viewBox="0 0 50 20" fill="none">
                      <path d="M0 15 L10 12 L20 18 L30 8 L40 5 L50 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Feature points */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-900">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-tr-2xl rounded-bl-2xl rounded-tl-md rounded-br-md bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <IconRoute className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Personalized Tracks</span>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <IconTimeline className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Real-Time Analysis</span>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-t-[1.25rem] rounded-b-[0.5rem] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <IconBrain className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Fast AI Feedback</span>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-r-[1.25rem] rounded-l-[0.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <IconShieldLock className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Secure & Private</span>
          </div>
        </div>
      </section>
      {/* INTERACTIVE DEMO ROOM SECTION */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Try the AI Interview Simulator
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-normal">
            Experience our specialized interview workspaces. Select a room below to test real-time feedback loops and sandbox execution.
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 shadow-2xl relative">
            <button
              onClick={() => setActiveTab("audio")}
              className={`px-6 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                activeTab === "audio"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-900/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>🎙️ Audio Interview Room</span>
            </button>
            <button
              onClick={() => setActiveTab("coding")}
              className={`px-6 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                activeTab === "coding"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-900/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>💻 Coding Interview Room</span>
            </button>
          </div>
        </div>

        {activeTab === "audio" ? (
          /* AUDIO INTERVIEW SIMULATOR WORKSPACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
            
            {/* Left Column: Speaker feeds & Controls */}
            <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-white/5 flex flex-col justify-between relative overflow-hidden shadow-2xl">
              
              {/* Upper call state indicators */}
              <div className="flex items-center justify-between mb-6 z-10">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${audioStage === "active" ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
                  <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    {audioStage === "active" ? "Call Session Active" : audioStage === "countdown" ? "Connecting..." : "Audio Room Ready"}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {audioStage === "active" ? "Mode: Dual Audio Feed" : "No Camera Required"}
                </div>
              </div>

              {/* Grid with AI Coach & Candidate Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                
                {/* AI Coach Audio Feed */}
                <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-40 ${
                  audioStage === "active" && audioSpeaker === "ai"
                    ? "bg-brand-violet/10 border-brand-violet/40 shadow-lg shadow-brand-violet/10 scale-[1.02]"
                    : "bg-slate-900/50 border-white/5 opacity-70"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-brand-violet/20 flex items-center justify-center text-brand-violet font-bold relative">
                        A
                        {audioStage === "active" && audioSpeaker === "ai" && (
                          <span className="absolute -inset-0.5 rounded-full border-2 border-brand-violet animate-ping opacity-75" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">AI Coach</h4>
                        <p className="text-[10px] text-slate-400">Aria - Technical Reviewer</p>
                      </div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      audioStage === "active" && audioSpeaker === "ai"
                        ? "bg-brand-violet text-white animate-pulse"
                        : "bg-slate-800 text-slate-500"
                    }`}>
                      {audioStage === "active" && audioSpeaker === "ai" ? "Speaking" : "Muted"}
                    </span>
                  </div>

                  {/* AI Audio Waveforms */}
                  <div className="flex items-end justify-center space-x-1 h-12">
                    {audioStage === "active" && audioSpeaker === "ai" ? (
                      audioBars.slice(0, 12).map((bar, idx) => (
                        <div
                          key={idx}
                          className="w-1 bg-brand-violet rounded-full transition-all duration-100"
                          style={{ 
                            height: `${bar}%`,
                            animation: `wave-bounce ${0.4 + (idx % 4) * 0.12}s ease-in-out infinite alternate`
                          }}
                        />
                      ))
                    ) : (
                      <div className="w-full border-b border-dashed border-slate-800 h-6 flex items-center justify-center">
                        <span className="text-[9px] text-slate-600 tracking-widest uppercase">Silent</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidate Audio Feed */}
                <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-40 ${
                  audioStage === "active" && audioSpeaker === "candidate"
                    ? "bg-brand-blue/10 border-brand-blue/40 shadow-lg shadow-brand-blue/10 scale-[1.02]"
                    : "bg-slate-900/50 border-white/5 opacity-70"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold relative">
                        U
                        {audioStage === "active" && audioSpeaker === "candidate" && (
                          <span className="absolute -inset-0.5 rounded-full border-2 border-brand-blue animate-ping opacity-75" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Candidate (You)</h4>
                        <p className="text-[10px] text-slate-400">Local Mic - Live Stream</p>
                      </div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      audioStage === "active" && audioSpeaker === "candidate"
                        ? "bg-brand-blue text-white animate-pulse"
                        : "bg-slate-800 text-slate-500"
                    }`}>
                      {audioStage === "active" && audioSpeaker === "candidate" ? "Speaking" : "Listening"}
                    </span>
                  </div>

                  {/* Candidate Audio Waveforms */}
                  <div className="flex items-end justify-center space-x-1 h-12">
                    {audioStage === "active" && audioSpeaker === "candidate" ? (
                      audioBars.slice(3, 15).map((bar, idx) => (
                        <div
                          key={idx}
                          className="w-1 bg-brand-blue rounded-full transition-all duration-100"
                          style={{ 
                            height: `${bar}%`,
                            animation: `wave-bounce ${0.4 + (idx % 4) * 0.12}s ease-in-out infinite alternate`
                          }}
                        />
                      ))
                    ) : (
                      <div className="w-full border-b border-dashed border-slate-800 h-6 flex items-center justify-center">
                        <span className="text-[9px] text-slate-600 tracking-widest uppercase">Silent</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Call Room Background Overlay / Countdown info */}
              <div className="w-full rounded-2xl bg-[#090A11] border border-white/5 relative flex flex-col justify-center overflow-hidden mb-6 shadow-inner min-h-[140px] p-6">
                
                {audioStage === "idle" && (
                  <div className="flex flex-col items-center justify-center text-center select-none">
                    <div className="w-12 h-12 rounded-full bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet mb-3 animate-float">
                      <Mic className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-350">Secure Audio Room Simulation</span>
                    <span className="text-xs text-slate-500 mt-1 max-w-sm">
                      Both candidate and AI coach communicate in full-duplex audio. Press Start to initialize the loop.
                    </span>
                  </div>
                )}

                {audioStage === "countdown" && (
                  <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center z-20">
                    <div className="text-5xl font-extrabold text-brand-violet animate-ping">{audioCountdown}</div>
                    <div className="text-xs font-semibold text-slate-400 mt-3">Connecting candidate audio channels...</div>
                  </div>
                )}

                {audioStage === "active" && (
                  <div className="w-full flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between text-[10px] text-slate-550 mb-3 border-b border-white/5 pb-2">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> RECORDING FEED</span>
                      <span className="font-mono">TIME REMAINING: ~30s</span>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-slate-950/50 border border-white/5 rounded-xl">
                      <Volume2 className="w-4 h-4 text-brand-violet mr-2 animate-bounce" />
                      <span className="text-xs text-slate-400 font-sans">
                        {audioSpeaker === "ai" ? "AI Recruiter is explaining the problem prompt." : "AI is active. Say your answer clearly into the microphone."}
                      </span>
                    </div>
                  </div>
                )}

                {audioStage === "feedback" && (
                  <div className="flex flex-col items-center justify-center text-center select-none">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                    <span className="text-sm font-semibold text-white">Audio Telemetry Evaluation Generated</span>
                    <span className="text-xs text-slate-550 mt-1 max-w-md">
                      Diagnostic speech analysis has been generated based on STAR method standards.
                    </span>
                  </div>
                )}

              </div>

              {/* Audio controls */}
              <div className="flex items-center justify-between gap-4">
                {audioStage === "idle" && (
                  <button
                    onClick={startAudioDemo}
                    className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>Connect Call Session</span>
                  </button>
                )}

                {audioStage === "countdown" && (
                  <button
                    disabled
                    className="w-full py-3.5 bg-slate-800 text-slate-500 font-bold rounded-xl cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span>Establishing link...</span>
                  </button>
                )}

                {audioStage === "active" && (
                  <button
                    onClick={stopAudioDemo}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>End & Analyze Audio Feed</span>
                  </button>
                )}

                {audioStage === "feedback" && (
                  <div className="w-full flex gap-3">
                    <button
                      onClick={startAudioDemo}
                      className="flex-1 py-3.5 bg-teal-950/20 hover:bg-teal-950/40 border border-teal-500/30 text-teal-400 font-semibold rounded-xl transition-all cursor-pointer"
                    >
                      Restart Session
                    </button>
                    <button
                      onClick={resetAudioDemo}
                      className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all cursor-pointer"
                    >
                      Clear Simulation
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Audio Transcript & AI Scoring */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Active Prompt displaying current question */}
              <div className="glass-panel rounded-3xl p-6 border border-white/5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-violet bg-brand-violet/10 border border-brand-violet/20 px-2.5 py-1 rounded-md">
                  Active Question Prompt
                </span>
                <h3 className="text-sm font-semibold text-white mt-3 leading-snug">
                  "{getQuestion(selectedRole, selectedLevel, trackQuestionIndex)}"
                </h3>
              </div>

              {/* Live Audio Transcription box */}
              <div className="glass-panel rounded-3xl p-6 border border-white/5 flex-1 flex flex-col justify-between min-h-[220px]">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1 rounded-md">
                    Speech Transcription Scroll
                  </span>
                  <div className="mt-4 text-xs text-slate-300 leading-relaxed font-sans min-h-[100px] max-h-[140px] overflow-y-auto no-scrollbar font-normal">
                    {audioStage === "idle" && (
                      <span className="text-slate-500 italic">Call simulator is offline. Connect call to stream transcript.</span>
                    )}
                    {audioStage === "countdown" && (
                      <span className="text-slate-500 italic">Connecting real-time Whisper translation hook...</span>
                    )}
                    {audioStage === "active" && (
                      <>
                        <span className="whitespace-pre-line">{audioSpeechText}</span>
                        <span className="inline-block w-1.5 h-3 ml-1 bg-brand-violet animate-pulse" />
                      </>
                    )}
                    {audioStage === "feedback" && (
                      <span className="text-slate-300 whitespace-pre-line">{audioSpeechText || "Evaluation complete."}</span>
                    )}
                  </div>
                </div>
                <div className="text-[9px] text-slate-500 border-t border-slate-900 pt-3 flex items-center justify-between">
                  <span>Engine: Whisper-Large-v3</span>
                  <span>Feedback Latency: &lt;1.8s</span>
                </div>
              </div>

              {/* AI scoring diagnostics for Audio call */}
              <div className="glass-panel rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                <span className="text-[9px] font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-md">
                  Audio Evaluation Scoring
                </span>

                {/* Locked overlay unless feedback has generated */}
                {audioStage !== "feedback" && (
                  <div className="absolute inset-0 bg-[#131526]/95 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center select-none">
                    <Lock className="w-7 h-7 text-slate-500 mb-2" />
                    <span className="text-xs font-semibold text-slate-300">Scoring Diagnostics Locked</span>
                    <span className="text-[10px] text-slate-500 max-w-[200px] mt-1">
                      Complete transcription evaluation to decrypt audio metrics dashboard.
                    </span>
                  </div>
                )}

                <div className="mt-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Pacing (Speech Rate)</span>
                      <span className="text-teal-400 font-bold">142 WPM (Optimal)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-teal-600 w-[90%] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">STAR Structure Alignment</span>
                      <span className="text-emerald-400 font-bold">85% Match</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[85%] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Tone Stability</span>
                      <span className="text-emerald-400 font-bold">Confident (45dB)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-teal-500 w-[95%] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Vocabulary & Filler Words</span>
                      <span className="text-teal-400 font-bold">No Filler Detected</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-teal-600 w-[80%] rounded-full" />
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* CODING INTERVIEW SIMULATOR WORKSPACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
            
            {/* Left Column: Problem Details & Live Test Cases */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Problem details panel */}
              <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col justify-between shadow-2xl min-h-[220px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1 rounded-md">
                      Coding Challenge
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      activeChallenge.difficulty === "Easy"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}>
                      {activeChallenge.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{activeChallenge.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal mb-4">
                    {activeChallenge.description}
                  </p>

                  <div className="border-t border-slate-900 pt-4 mt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Example Cases</span>
                    <div className="space-y-2">
                      {activeChallenge.testCases.map((tc, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-950/70 border border-white/5 rounded-lg font-mono text-[11px] text-slate-300 flex justify-between">
                          <div>
                            <span className="text-slate-500">Input:</span> {tc.input}
                          </div>
                          <div>
                            <span className="text-slate-500">Expected:</span> <span className="text-emerald-400 font-bold">{tc.expected}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Interactive test cases logs */}
              <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col shadow-2xl">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md self-start mb-4">
                  Sandbox Test Execution
                </span>

                <div className="space-y-3 font-mono text-xs">
                  {activeChallenge.testCases.map((tc, index) => {
                    const status = completedTests[index] || "pending";
                    return (
                      <div key={index} className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-xl border border-white/5">
                        <div className="flex items-center space-x-3">
                          {status === "pending" && <span className="w-2.5 h-2.5 rounded-full bg-slate-850 border border-slate-700 animate-pulse shrink-0" />}
                          {status === "running" && <div className="w-3.5 h-3.5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin shrink-0" />}
                          {status === "passed" && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                          <span className={`${status === "passed" ? "text-white" : "text-slate-450"}`}>
                            Test Case {index + 1}: Expected {tc.expected}
                          </span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${
                          status === "passed" ? "text-emerald-400" : status === "running" ? "text-brand-blue animate-pulse" : "text-slate-600"
                        }`}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {runStatus && (
                  <div className="mt-4 p-3 bg-brand-blue/5 border border-brand-blue/20 rounded-xl flex items-center space-x-2 text-xs text-brand-blue font-mono">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{runStatus}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Code Editor & AI Evaluation */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Code Editor */}
              <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[380px] h-full">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <div className="w-2 h-2 rounded-full bg-green-500/80" />
                    <span className="text-[10px] font-mono text-slate-400 ml-2">solution.js</span>
                  </div>
                  <span className="text-[9px] font-mono text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-0.5 rounded uppercase font-semibold">
                    JavaScript (Node)
                  </span>
                </div>

                <div className="flex-1 flex flex-col relative mb-4 font-mono text-xs">
                  <textarea
                    value={editorCode}
                    onChange={(e) => {
                      setEditorCode(e.target.value);
                      if (codingStage === "feedback") {
                        setCodingStage("idle");
                        setCompletedTests({});
                        setRunStatus("");
                      }
                    }}
                    className="w-full flex-1 min-h-[220px] bg-slate-950/80 text-emerald-400 p-4 rounded-xl border border-white/5 focus:outline-none focus:border-teal-500/40 font-mono text-xs leading-relaxed resize-none no-scrollbar shadow-inner"
                    spellCheck={false}
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setEditorCode(activeChallenge.initialCode);
                      setCodingStage("idle");
                      setCompletedTests({});
                      setRunStatus("");
                    }}
                    className="px-4 py-3 bg-slate-900 hover:bg-slate-850 text-xs font-bold uppercase rounded-xl border border-slate-800 text-slate-350 hover:text-white transition-all cursor-pointer flex items-center space-x-1 shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-hover-spin" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={runCodeTests}
                    disabled={codingStage === "running"}
                    className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-teal-900/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {codingStage === "running" ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Running Sandbox...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Run Code & Verify</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* AI Code scoring feedback */}
              <div className="glass-panel rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                <span className="text-[9px] font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-md">
                  AI Code Diagnostics
                </span>

                {codingStage !== "feedback" && (
                  <div className="absolute inset-0 bg-[#131526]/95 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center select-none">
                    <Lock className="w-7 h-7 text-slate-500 mb-2" />
                    <span className="text-xs font-semibold text-slate-350">Code Telemetry Locked</span>
                    <span className="text-[10px] text-slate-500 max-w-[220px] mt-1">
                      Execute sandboxed test cases successfully to generate O-notation and refactoring reviews.
                    </span>
                  </div>
                )}

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="text-xs text-slate-400">Total Code Efficiency</div>
                    <div className="text-sm font-extrabold text-brand-blue">{activeChallenge.aiFeedback.score}% Score</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Time Complexity</span>
                      <span className="block text-[11px] font-mono text-emerald-400 mt-1">{activeChallenge.aiFeedback.timeComplexity}</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Space Complexity</span>
                      <span className="block text-[11px] font-mono text-emerald-400 mt-1">{activeChallenge.aiFeedback.spaceComplexity}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-2">Review Recommendations</span>
                    <ul className="space-y-2">
                      {activeChallenge.aiFeedback.suggestions.map((suggestion, sIdx) => (
                        <li key={sIdx} className="text-[11px] text-slate-350 flex items-start gap-2 leading-relaxed">
                          <Sparkles className="w-3.5 h-3.5 text-brand-violet shrink-0 mt-0.5" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}
      </section>

      {/* SPECIALIZED TRACKS SECTION */}
      <section id="tracks" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Track cards list */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Curriculum Suite</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2 mb-4">
                Specialized Interview Tracks
              </h2>
              <p className="text-slate-400">
                We adjust model parameters based on specific targets. Practice focused loops for major tech screening layers.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: "HR Round", desc: "General behavioral questions, core company value alignment, and cultural fit validations.", icon: Users, color: "bg-teal-500/10 border-teal-500/20 text-teal-400" },
                { title: "Behavioral Round", desc: "Soft skill assessments focused on leadership, teamwork, stress response, and STAR structure alignment.", icon: MessageSquare, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
                { title: "Coding Round", desc: "Interactive algorithmic challenges, time complexity evaluations, and array/tree/graph optimization loops.", icon: Cpu, color: "bg-teal-500/10 border-teal-500/20 text-teal-400" },
                { title: "Technical Architecture", desc: "Deep dives on system design, microservices, load balancing, databases, and caching strategies.", icon: Target, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
                { title: "Leadership Executive", desc: "Strategic thinking, budget resource planning, conflict resolution, and product management simulation scripts.", icon: Award, color: "bg-teal-500/10 border-teal-500/20 text-teal-400" }
              ].map((track, index) => {
                const IconComponent = track.icon;
                return (
                  <div key={index} className="flex gap-4 p-5 rounded-2xl bg-card-dark/50 border border-white/5 hover:border-slate-800 transition-all group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${track.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">{track.title}</h4>
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
              <h3 className="text-lg font-semibold text-white mb-4">Supported Technical Roles</h3>
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
                        ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-900/30" 
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
              <h3 className="text-lg font-semibold text-white mb-2">Adaptive Experience Levels</h3>
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
                        ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-900/30" 
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
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Question Library Showcase
                </span>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-950/20 border border-teal-500/20 px-2 py-0.5 rounded uppercase">
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
                  className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center space-x-1 cursor-pointer"
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
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Workflow Strategy</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2 mb-4">How it Works</h2>
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
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-md font-extrabold text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 mb-5 shadow">
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
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Engine Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2 mb-4">Deep-learning Methodology</h2>
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
              <h3 className="text-lg font-semibold text-white mb-2">Simulated Practice</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal mb-6">
                Immerse yourself answering questions specifically generated by our industry-trained AI models in real time.
              </p>
            </div>

            {/* Dashboard Mock 1 */}
            <div className="bg-slate-950/80 rounded-2xl border border-white/5 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Webcam Stream</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />Rec</span>
              </div>
              <div className="h-28 rounded-lg bg-gradient-to-tr from-slate-900 to-card-dark relative overflow-hidden flex items-center justify-center">
                {/* SVG mock person avatar */}
                <svg className="w-10 h-10 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                {/* Overlay waves */}
                <div className="absolute bottom-2 left-2 right-2 h-4 flex items-end justify-center gap-0.5">
                  <div className="w-0.5 h-3 bg-teal-500 rounded-full" />
                  <div className="w-0.5 h-4 bg-teal-500 rounded-full" />
                  <div className="w-0.5 h-2 bg-teal-500 rounded-full" />
                  <div className="w-0.5 h-5 bg-teal-500 rounded-full" />
                  <div className="w-0.5 h-3 bg-teal-500 rounded-full" />
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
              <h3 className="text-lg font-semibold text-white mb-2">Instant Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal mb-6">
                Get direct visual feedback on your body language, tone of voice, pacing, and keyword relevance within seconds.
              </p>
            </div>

            {/* Dashboard Mock 2 */}
            <div className="bg-slate-950/80 rounded-2xl border border-white/5 p-4 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-500">Live Speech Telemetry</span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[9px] font-semibold mb-0.5 text-slate-400">
                    <span>Clarity Score</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 w-[92%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-semibold mb-0.5 text-slate-400">
                    <span>Filler words</span>
                    <span>0.8 / min</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[95%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-semibold mb-0.5 text-slate-400">
                    <span>Confidence metrics</span>
                    <span>Excellent</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 w-[88%]" />
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
              <h3 className="text-lg font-semibold text-white mb-2">Targeted Coaching</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal mb-6">
                Receive actionable tips and customized action plans to resolve your structural weaknesses and build interview confidence.
              </p>
            </div>

            {/* Dashboard Mock 3 */}
            <div className="bg-slate-950/80 rounded-2xl border border-white/5 p-4 flex flex-col gap-3">
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
                  ? "bg-teal-600 text-white shadow-sm"
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
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-sm text-slate-500 ml-2">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-normal">Free diagnostics baseline parameters access.</p>
              
              <ul className="mt-8 space-y-4 text-xs text-slate-300 font-normal">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>2 AI Simulations / Week</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Basic Sentiment Analysis score</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Public Job Board access</span>
                </li>
              </ul>
            </div>
            <button className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-880 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all">
              Get Started
            </button>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="glass-panel-highlight rounded-3xl p-8 border flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 bg-teal-600 text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Most Popular
            </div>

            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Pro Tier</span>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-white">
                  {billingPeriod === "monthly" ? "$29" : "$23"}
                </span>
                <span className="text-sm text-slate-500 ml-2">/ month</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-normal">Full access suite for active job search runs.</p>
              
              <ul className="mt-8 space-y-4 text-xs text-slate-300 font-normal">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="font-semibold text-white">Unlimited Simulations</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Full Video & Tone Coaching analytics</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Custom Role Benchmarking algorithms</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Resume Scanner & Improver utility</span>
                </li>
              </ul>
            </div>
            <button className="w-full mt-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/30 hover:scale-[1.01] cursor-pointer transition-all">
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-panel rounded-3xl p-8 border border-white/5 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enterprise</span>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-normal">White-label university and corporate portals.</p>
              
              <ul className="mt-8 space-y-4 text-xs text-slate-300 font-normal">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="font-semibold text-white">Dedicated API deployment keys</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>SSO/SAML directory synchronization</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Custom LLM prompt fine-tuning loops</span>
                </li>
              </ul>
            </div>
            <button className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-880 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all">
              Contact Sales
            </button>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Frequently Asked Questions</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2 mb-4">
            Frequently Asked Questions
          </h2>
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
                  className="w-full p-6 text-left flex items-center justify-between text-white font-semibold text-sm sm:text-base cursor-pointer hover:bg-white/[0.01]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "transform rotate-180 text-teal-400" : ""}`} />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px] border-t border-white/5" : "max-h-0"
                  }`}
                >
                  <p className="p-6 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal bg-slate-950/20">
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
          <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
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
            <div className="w-7 h-7 flex items-center justify-center bg-teal-600 rounded-lg shadow-md shadow-teal-900/30">
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
