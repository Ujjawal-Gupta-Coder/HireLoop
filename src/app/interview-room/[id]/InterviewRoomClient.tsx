"use client";

//  🔦--->       /* eslint-disable @typescript-eslint/no-explicit-any */
//  🔦-->      /* eslint-disable react-hooks/purity */

import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import InterviewerFeed from "./InterviewerFeed";
import Sidebar from "./Sidebar";
import { generateInterviewQuestion, updateInterviewProgress, endInterviewSession } from "@/src/actions/interview";
import { formatIdIntoLabel } from "@/src/helper/helper.common";
import LOGO from "@/public/logo.svg"
import toast from "react-hot-toast";
import Image from "next/image";

type SerializedInterviewDetails = {
  id: string;
  userId: string;
  type: string;
  role: string;
  experience: string;
  difficulty: string;
  skills: string[];
  sessionType: string;
  context: string | null;
  creditsUsed: number;
  totalQuestions: number;
  answered: number;
  status: string;
};

type InterviewRoomClientProps = {
  interviewDetails: SerializedInterviewDetails;
};

export default function InterviewRoomClient({ interviewDetails }: InterviewRoomClientProps) {
  // Timer state
  const [timeElapsed, setTimeElapsed] = useState(0); 
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Notes
  const [notes, setNotes] = useState<string>("");

  // Questions progress
  const totalQuestions = interviewDetails.totalQuestions;
  const [currentQuestion, setCurrentQuestion] = useState(interviewDetails.answered + 1);
  const [currentQuestionText, setCurrentQuestionText] = useState("");

  // Messages / transcript
  const [messages, setMessages] = useState<{
    id: string;
    sender: "AI" | "User";
    senderName: string;
    timestamp: string;
    text: string;
  }[]>([]);

  // States
  const [interviewerState, setInterviewerState] = useState<"listening" | "speaking" | "thinking">("thinking");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);

  // Constants since control buttons were removed
  const isMuted = false;
  const isSpeakerOn = true;

  // Track if user has spoken in current turn
  const [hasSpoken, setHasSpoken] = useState(false);
  const currentTranscriptRef = useRef<string>("");

  // Refs for Web Speech API
  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef<boolean>(false);
  const shouldListenRef = useRef<boolean>(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Safe helper ref to start SpeechRecognition with device recycle safety and retry capability
  const safeStartRef = useRef<(() => void) | undefined>(undefined);
  safeStartRef.current = () => {
    if (!recognitionRef.current) return;
    shouldListenRef.current = true;
    try {
      recognitionRef.current.start();
    } catch (err: any) {
      if (err.name === "InvalidStateError" || err.message?.includes("already started")) {
        // Already active or in transition, ignore
      } else {
        console.warn("SpeechRecognition start failed, scheduling retry...");
        setTimeout(() => {
          try {
            if (shouldListenRef.current) {
              recognitionRef.current.start();
            }
          } catch {}
        }, 300);
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const getFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  // Speaks text using SpeechSynthesis (TTS)
  const speakText = (text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    if (!isSpeakerOn) {
      if (onEnd) {
        setTimeout(onEnd, 2000);
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Microsoft"))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setInterviewerState("speaking");
      isSpeakingRef.current = true;
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      console.error("SpeechSynthesis error:", err);
      isSpeakingRef.current = false;
      if (onEnd) onEnd();
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Update user message in the client-side log in real-time
  const updateUserMessage = (text: string) => {
    setMessages(prev => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.sender === "User") {
        return [
          ...prev.slice(0, prev.length - 1),
          { ...lastMsg, text }
        ];
      } else {
        return [
          ...prev,
          {
            id: `user-${Date.now()}`,
            sender: "User",
            senderName: "You",
            timestamp: getFormattedTime(),
            text
          }
        ];
      }
    });
  };

  // Fetch next question from Gemini
  const fetchNextQuestion = async (currentHistory: typeof messages, nextQuestionIndex: number) => {
    // Format history for Gemini API. We prepend a user start message so that the turn sequence:
    // always starts with user, alternates user/model, and avoids starting with model.
    const geminiHistory = [
      { role: "user" as const, parts: [{ text: "Please start the interview." }] },
      ...currentHistory.map(m => ({
        role: m.sender === "AI" ? ("model" as const) : ("user" as const),
        parts: [{ text: m.text }]
      }))
    ];

    const result = await generateInterviewQuestion(
      geminiHistory,
      interviewDetails.role,
      interviewDetails.experience,
      interviewDetails.difficulty,
      interviewDetails.skills,
      interviewDetails.context,
      totalQuestions,
      nextQuestionIndex
    );

    if (result.success && result.text) {
      const questionText = result.text;
      setCurrentQuestion(nextQuestionIndex);
      setCurrentQuestionText(questionText);

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "AI",
          senderName: "AI Interviewer",
          timestamp: getFormattedTime(),
          text: questionText
        }
      ]);

      speakText(questionText, () => {
        if (recognitionRef.current && !isMuted) {
          safeStartRef.current?.();
        } else {
          setInterviewerState("listening");
        }
      });
    } else {
      console.error("Gemini failed to get question:", result.error);
      const fallbackQuestion = "Could you explain more about your experience working in teams and managing project goals?";
      setCurrentQuestion(nextQuestionIndex);
      setCurrentQuestionText(fallbackQuestion);

      setMessages(prev => [
        ...prev,
        {
          id: `ai-fb-${Date.now()}`,
          sender: "AI",
          senderName: "AI Interviewer",
          timestamp: getFormattedTime(),
          text: fallbackQuestion
        }
      ]);

      speakText(fallbackQuestion, () => {
        if (recognitionRef.current && !isMuted) {
          safeStartRef.current?.();
        } else {
          setInterviewerState("listening");
        }
      });
    }
  };

  // Handle final completion state
  const handleFinishInterview = async (finalHistory: typeof messages) => {
    const geminiHistory = [
      { role: "user" as const, parts: [{ text: "Please start the interview." }] },
      ...finalHistory.map(m => ({
        role: m.sender === "AI" ? ("model" as const) : ("user" as const),
        parts: [{ text: m.text }]
      }))
    ];

    const result = await generateInterviewQuestion(
      geminiHistory,
      interviewDetails.role,
      interviewDetails.experience,
      interviewDetails.difficulty,
      interviewDetails.skills,
      interviewDetails.context,
      totalQuestions,
      totalQuestions
    );

    let closingText = "Thank you so much. We have completed all the questions for today. I will compile your results now. Feel free to leave the room by clicking End Interview.";
    if (result.success && result.text) {
      closingText = result.text;
    }

    setMessages(prev => [
      ...prev,
      {
        id: `ai-closing-${Date.now()}`,
        sender: "AI",
        senderName: "AI Interviewer",
        timestamp: getFormattedTime(),
        text: closingText
      }
    ]);

    speakText(closingText, async () => {
      setInterviewerState("listening");
      await endInterviewSession(interviewDetails.id);
      setTimeout(() => {
        window.location.href = `/analytics/${interviewDetails.id}`;
      }, 5000);
    });
  };

  // Submit response and trigger Gemini next question
  const handleSubmitResponse = async (userText: string) => {
    if (interviewerState === "thinking" || interviewerState === "speaking") return;

    setInterviewerState("thinking");
    shouldListenRef.current = false;
    setHasSpoken(false);
    currentTranscriptRef.current = "";

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    // Filter out any trailing User messages to prevent duplicates from asynchronous state updates
    const updatedMessages = [...messages];
    while (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].sender === "User") {
      updatedMessages.pop();
    }
    updatedMessages.push({
      id: `user-${Date.now()}`,
      sender: "User" as const,
      senderName: "You",
      timestamp: getFormattedTime(),
      text: userText
    });
    setMessages(updatedMessages);

    const nextQuestionIndex = currentQuestion + 1;

    // Update progress in DB
    await updateInterviewProgress(interviewDetails.id, currentQuestion);

    if (currentQuestion >= totalQuestions) {
      await handleFinishInterview(updatedMessages);
    } else {
      await fetchNextQuestion(updatedMessages, nextQuestionIndex);
    }
  };

  // Manual submission when candidate clicks "Done"
  const handleManualSubmit = () => {
    if (currentTranscriptRef.current.trim()) {
      handleSubmitResponse(currentTranscriptRef.current.trim());
    }
  };

  // Initialize SpeechRecognition (STT)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Listen continuously until manual submit
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setInterviewerState("listening");
    };

    recognition.onresult = (event: any) => {
      let fullFinal = "";
      let fullInterim = "";
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          fullFinal += event.results[i][0].transcript;
        } else {
          fullInterim += event.results[i][0].transcript;
        }
      }

      const currentSpokenText = fullFinal + fullInterim;
      // Capture the full text (final + interim) so manual submission is complete and immediate
      currentTranscriptRef.current = currentSpokenText;
      if (currentSpokenText.trim()) {
        setHasSpoken(true);
        updateUserMessage(currentSpokenText);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "aborted") {
        return; // Ignore programmatic abort errors
      }
      console.error("SpeechRecognition error:", event.error);
      if (event.error === "no-speech") {
        if (shouldListenRef.current) {
          setTimeout(() => {
            if (shouldListenRef.current) {
              try {
                recognition.start();
              } catch {}
            }
          }, 200);
        }
      }
    };

    recognition.onend = () => {
      // Do NOT automatically submit when silence triggers recognition end.
      // Simply restart listening if the state is still listening, adding a slight delay for device cycle safety.
      if (shouldListenRef.current) {
        setTimeout(() => {
          if (shouldListenRef.current) {
            try {
              recognition.start();
            } catch {}
          }
        }, 150);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInterviewStarted]);

  // Start interview flow when user clicks overlay button
  const startInterviewFlow = () => {
    setIsInterviewStarted(true);
    setHasSpoken(false);
    currentTranscriptRef.current = "";

    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    setInterviewerState("thinking");

    const introPrompt = `Hello, welcome to your voice interview for the position of ${formatIdIntoLabel(interviewDetails.role)} (${formatIdIntoLabel(interviewDetails.experience)}). We will go through ${totalQuestions} questions. Let's start. Please introduce yourself and describe your professional background.`;
    
    setCurrentQuestion(1);
    setCurrentQuestionText("Please introduce yourself and describe your professional background.");

    setMessages([
      {
        id: `ai-intro-${Date.now()}`,
        sender: "AI",
        senderName: "AI Interviewer",
        timestamp: getFormattedTime(),
        text: introPrompt
      }
    ]);

    speakText(introPrompt, () => {
      if (recognitionRef.current && !isMuted) {
        safeStartRef.current?.();
      } else {
        setInterviewerState("listening");
      }
    });
  };

  // Manual End Interview
  const handleEndInterviewManual = async () => {
    shouldListenRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    toast.success("Ending interview session...", {
      icon: "👋",
      style: {
        background: "#030712",
        color: "#F8FAFC",
        border: "1px solid rgba(239, 68, 68, 0.4)",
      }
    });

    await endInterviewSession(interviewDetails.id);
    setTimeout(() => {
      window.location.href = `/analytics/${interviewDetails.id}`;
    }, 1500);
  };

  return (
    <div className="lg:h-screen lg:overflow-hidden min-h-screen bg-[#020408] text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500/20 relative">
      
      {/* 0. Start Interview Overlay */}
      {!isInterviewStarted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full mx-4 p-8 rounded-3xl border border-teal-500/30 bg-gradient-to-b from-[#080d1a] to-[#030612] text-center shadow-[0_0_50px_rgba(20,184,166,0.15)]">
            <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20 mb-6 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
              {/* <Sparkles className="w-8 h-8 text-teal-400" /> */}
              <Image src={LOGO} alt={"HireLoop Logo"} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">AI Voice Interview Room</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Welcome! You are about to start a dynamic voice interview for the position of <span className="text-teal-400 font-semibold">{formatIdIntoLabel(interviewDetails.role)}</span> ({formatIdIntoLabel(interviewDetails.experience)}). 
              Please ensure your microphone is working and you are in a quiet environment.
            </p>
            <button
              onClick={startInterviewFlow}
              className="w-full py-3.5 rounded-xl cursor-pointer bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold tracking-wide transition shadow-lg shadow-teal-500/25 active:scale-95"
            >
              Start Interview
            </button>
          </div>
        </div>
      )}

      {/* Dynamic styles for state wave animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wave-listening {
          0%, 100% {
            transform: scaleY(0.25);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        @keyframes wave-speaking {
          0%, 100% {
            transform: scaleY(0.15);
            opacity: 0.45;
          }
          50% {
            transform: scaleY(1.85);
            opacity: 1;
          }
        }
        @keyframes wave-thinking {
          0%, 100% {
            transform: scaleY(0.35);
            opacity: 0.25;
          }
          50% {
            transform: scaleY(0.55);
            opacity: 0.75;
          }
        }

        .wave-bar-listening {
          animation: wave-listening 1.2s ease-in-out infinite;
          transform-origin: center;
        }
        .wave-bar-speaking {
          animation: wave-speaking 0.65s ease-in-out infinite;
          transform-origin: center;
        }
        .wave-bar-thinking {
          animation: wave-thinking 2.2s ease-in-out infinite;
          transform-origin: center;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0d9488;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0ea5e9;
        }
      `}} />

      {/* 1. Header component */}
      <Header 
        timeElapsed={timeElapsed} 
        type={interviewDetails.type} 
        currentQuestion={currentQuestion} 
        totalQuestion={totalQuestions}
      />

      {/* Main Container Wrapper */}
      <main className="flex-1 mx-4 sm:mx-8 mb-6 border border-slate-900 rounded-[24px] bg-[#030712]/40 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-0 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Side: Video/Interviewer feed */}
        <InterviewerFeed 
          interviewerState={interviewerState}
          onEndInterview={handleEndInterviewManual}
          hasSpoken={hasSpoken}
          onSubmitAnswer={handleManualSubmit}
        />

        {/* Right Side: Dashboard Panel */}
        <Sidebar 
          notes={notes} 
          setNotes={setNotes} 
          messages={messages}
          currentQuestion={currentQuestion}
          currentQuestionText={currentQuestionText}
        />

      </main>

    </div>
  );
}
