"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Award,
  BookOpen,
  MessageSquare,
  Brain,
  Compass,
  Lightbulb,
  Layers,
  FileText,
  Volume2,
  Target,
  Smile,
  Briefcase,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { InterviewReportData, InterviewSessionInfo } from "./analyticsTypes";
import PerformanceGauge from "./PerformanceGauge";
import ScoreParameterCard from "./ScoreParameterCard";
import StrengthsWeaknessesCard from "./StrengthsWeaknessesCard";
import QuestionAnalysisSection from "./QuestionAnalysisSection";
import { formatIdIntoLabel } from "@/src/helper/helper.common";
import { formatDuration, formatInterviewDate } from "@/src/components/history/historyHelpers";

type AnalyticsClientViewProps = {
  interviewDetails: InterviewSessionInfo;
  interviewReport: InterviewReportData;
};

export default function AnalyticsClientView({
  interviewDetails,
  interviewReport,
}: AnalyticsClientViewProps) {
  const report = interviewReport;
  const [activeTab, setActiveTab] = useState<"overview" | "communication" | "questions">("overview");

  const typeLabel = formatIdIntoLabel(interviewDetails.type);
  const roleLabel = formatIdIntoLabel(interviewDetails.role);
  const experienceLabel = formatIdIntoLabel(interviewDetails.experience);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Prevent auto-scrolling down when opening analytics page
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetScrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const scrollContainers = document.querySelectorAll(
        ".overflow-y-auto, [data-scroll-container]"
      );
      scrollContainers.forEach((container) => {
        container.scrollTop = 0;
      });
    };

    resetScrollToTop();
    const rAF = requestAnimationFrame(resetScrollToTop);
    const timer = setTimeout(resetScrollToTop, 50);

    return () => {
      cancelAnimationFrame(rAF);
      clearTimeout(timer);
    };
  }, []);

  const handleDownloadAnalytics = async () => {
    try {
      setIsGeneratingPDF(true);
      const raw = await fetch(`/api/interview-report/${interviewDetails.id}`);
      const res = await raw.json();
      if(!res.success) throw new Error(res.message)
    
      window.open(res.data.url, "_blank");

    } catch(error) {
      toast.error("Download interview report action failed");
      console.error("Error in download interview report: ", error);
    } finally {
      setIsGeneratingPDF(false);
    }
    
  };

  return (
    <div className="space-y-8 print:space-y-4">
      
      {/* Top Heading  */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 font-display">
            AI Analytics Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed max-w-2xl">
            Comprehensive Gemini AI evaluation, communication scoring, and question-by-question analysis.
          </p>
        </div>

        {/* Download PDF Report  */}
        <button
          onClick={handleDownloadAnalytics}
          disabled={isGeneratingPDF}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-slate-950 transition-all duration-200 cursor-pointer self-start sm:self-auto group shrink-0 ${
            isGeneratingPDF
              ? "bg-teal-500/70 opacity-80 cursor-not-allowed"
              : "bg-teal-400 hover:bg-teal-300 hover:scale-[1.02] shadow-lg shadow-teal-500/15"
          }`}
        >
          {isGeneratingPDF ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
          ) : (
            <FileText className="h-4 w-4 transition-transform group-hover:scale-110" />
          )}
          <span>{isGeneratingPDF ? "Generating PDF..." : "Download PDF"}</span>     
        </button>
      </div>
      
      {/* Session Metadata Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 p-4 rounded-2xl bg-[#090e1c]/90 border border-slate-800/80 shadow-lg text-xs">
         <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Role
          </span>
          <p className="font-bold text-slate-200">{roleLabel}</p>
        </div>

         <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Type
          </span>
          <p className="font-bold text-slate-200">{typeLabel}</p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Experience Level
          </span>
          <p className="font-bold text-slate-200">{experienceLabel}</p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Questions Answered
          </span>
          <p className="font-bold text-teal-400">
            {interviewDetails.answered} / {interviewDetails.totalQuestions}
          </p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Time Invested
          </span>
          <p className="font-bold text-slate-200">
            {formatDuration(interviewDetails.timeElapsed)}
          </p>
        </div>

        <div className="space-y-0.5 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Session Date
          </span>
          <p className="font-bold text-slate-300">
            {formatInterviewDate(interviewDetails.createdAt)}
          </p>
        </div>
      </div>

      {/* Performance Gauges Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Overall Score Gauge */}
        <PerformanceGauge
          score={report.overallScore}
          label="Overall Interview Score"
          sublabel="Based on Confidence, Clarity, Relevancy, Depth & Problem Solving"
        />

        {/* Communication Score Gauge */}
        <PerformanceGauge
          score={report.communicationScore}
          label="Communication Score"
          sublabel="Based on Clarity, Grammar, Vocabulary, Tone & Professionalism"
        />
      </div>

      {/* AI Summary Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1427]/95 via-[#090f1f]/95 to-[#060a16]/95 border border-teal-500/30 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shadow-inner">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-100 uppercase tracking-wide font-display">
                AI Interview Summary
              </h2>
              <span className="text-xs text-teal-400 font-medium">
                Comprehensive Evaluation Verdict
              </span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold border border-teal-500/30 bg-teal-950/40 text-teal-300">
            Hiring Assessment
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed sm:leading-loose whitespace-pre-wrap font-sans">
          {report.summary}
        </p>
      </div>

      {/* 3 Strengths, 3 Weaknesses, 3 Recommendations */}
      <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-teal-400" />
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wide">
              Key Strengths, Weaknesses &amp; AI Recommendations
            </h3>
          </div>

          <StrengthsWeaknessesCard
            strengths={report.strengths}
            weaknesses={report.weaknesses}
            recommendations={report.recommendations}
          />
      </div>

      {/* Interactive Tabs Navigation */}
      <div className="space-y-8 animate-in fade-in duration-300">
          
        {/* Tab controlls  */}
        <div className="flex border-b border-slate-800/80 gap-3 sm:gap-6 print:hidden">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "overview"
                ? "text-teal-400 border-teal-400"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            Overall Performance Breakdown
          </button>

          <button
            onClick={() => setActiveTab("communication")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "communication"
                ? "text-teal-400 border-teal-400"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            Communication Diagnostics (5 Parameters)
          </button>

          <button
            onClick={() => setActiveTab("questions")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "questions"
                ? "text-teal-400 border-teal-400"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            Question-by-Question Analysis ({report.questionAnalyses.length})
          </button>
        </div>

      {/* TAB 1: OVERVIEW & 5 CORE PARAMETERS */}
      {
        activeTab === "overview" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-teal-400" />
                <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wide">
                  Overall Score: 5 Core Parameters
                </h3>
              </div>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Confidence */}
            <ScoreParameterCard
                title="Confidence"
                score={report.confidenceScore}
                icon={Award}
                benchmarkHint="Conviction & Composure"
                description="Assesses candidate assertiveness, emotional steadiness, and confidence under pressure."
              />

              {/* 2. Clarity */}
              <ScoreParameterCard
                title="Clarity"
                score={report.clarityScore}
                icon={Compass}
                benchmarkHint="Directness & Structure"
                description="Measures how cleanly and straightforwardly thoughts and technical solutions are communicated."
              />

              {/* 3. Answer Relevancy */}
              <ScoreParameterCard
                title="Answer Relevancy"
                score={report.relevancyScore}
                icon={Target}
                benchmarkHint="Direct Response Precision"
                description="Evaluates whether the candidate accurately addressed the exact question asked without deflection."
              />

              {/* 4. Depth of Knowledge */}
              <ScoreParameterCard
                title="Depth of Knowledge"
                score={report.depthScore}
                icon={BookOpen}
                benchmarkHint="Technical Depth & Principles"
                description="Underlying software principles, best practices, edge cases, and conceptual mastery."
              />

              {/* 5. Problem Solving */}
              <ScoreParameterCard
                title="Problem Solving"
                score={report.problemSolvingScore}
                icon={Brain}
                benchmarkHint="Logic, Strategy & Tradeoffs"
                description="Analytical reasoning, step-by-step thinking, tradeoff evaluation, and design decision-making."
              />
            
          </div>
          </div>
        )
      }

      {/* TAB 2: COMMUNICATION DIAGNOSTICS */}
      {
        activeTab === "communication" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 5 Communication Parameters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-teal-400" />
                <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wide">
                  Communication Breakdown: 5 Distinct Parameters
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Clarity */}
              <ScoreParameterCard
                title="Clarity"
                score={report.commClarityScore}
                icon={Compass}
                benchmarkHint="Verbal Articulation"
                description="Flow, cadence, concise delivery, and lack of ambiguous phrasing."
              />

              {/* 2. Grammar & Language */}
              <ScoreParameterCard
                title="Grammar & Language"
                score={report.commGrammarScore}
                icon={FileText}
                benchmarkHint="Linguistic Precision"
                description="Syntactic accuracy, sentence structure, grammatical correctness, and fluency."
              />

              {/* 3. Vocabulary */}
              <ScoreParameterCard
                title="Vocabulary"
                score={report.commVocabularyScore}
                icon={BookOpen}
                benchmarkHint="Domain Terminology"
                description="Usage of precise technical terms, domain vocabulary, and professional idioms."
              />

              {/* 4. Tone */}
              <ScoreParameterCard
                title="Tone"
                score={report.commToneScore}
                icon={Smile}
                benchmarkHint="Warmth & Empathy"
                description="Politeness, positive cadence, constructive attitude, and conversational warmth."
              />

              {/* 5. Professionalism */}
              <ScoreParameterCard
                title="Professionalism"
                score={report.commProfessionalismScore}
                icon={Briefcase}
                benchmarkHint="Workplace Etiquette"
                description="Business conduct, respect, active listening, and interview presence."
              />
            </div>
          </div>

            {/* AI Communication Summary  */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/30 via-slate-900/60 to-slate-950/80 border border-blue-500/30 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  AI Communication Feedback
                </h3>
                <span className="text-[11px] text-blue-400 font-medium">
                  Verbal and Linguistic Diagnostic
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed sm:leading-loose whitespace-pre-wrap font-sans">
              {report.communicationFeedback}
            </p>
          </div>
          </div>
        )
      }

      {/* TAB 3: QUESTION-BY-QUESTION ANALYSIS */}
       {
        activeTab === "questions" && (
           <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-teal-400" />
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wide">
                Detailed Question-by-Question Breakdown
              </h3>
            </div>
            <span className="text-xs text-teal-400 font-semibold">
              {report.questionAnalyses.length} Questions Evaluated
            </span>
          </div>

          <QuestionAnalysisSection questions={report.questionAnalyses} />
        </div>
        )
      } 
      </div>

      {/* Bottom Practice CTA */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/30 to-slate-900 border border-teal-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-100">
            Ready for your next round?
          </h4>
          <p className="text-xs text-slate-400">
            Keep practicing mock interviews to refine your technical depth and verbal delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
          >
            All Sessions
          </Link>
          <Link
            href="/interview"
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-md shadow-teal-500/20"
          >
            Start New Interview
          </Link>
        </div>
      </div>
    </div>
  );
}
