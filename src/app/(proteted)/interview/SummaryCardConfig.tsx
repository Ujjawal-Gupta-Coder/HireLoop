"use client"

import { useState } from "react"
import { InterViewLengthOptionsType, InterviewTypeConfig } from "@/src/types"
import { AlertCircle, ChevronRight, Coins, Compass, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import ConformationDialogBox from "./ConformationDialogBox"
import { formatIdIntoLabel } from "@/src/helper/helper.common"

type SummaryCardConfig = {
    credits: number,
    interviewTypes: InterviewTypeConfig[], 
    interViewLengthOptions: InterViewLengthOptionsType[],
    selectedType: string, 
    selectedSkills: string[], 
    difficulty: string, 
    experience: string, 
    targetRole: string, 
    sessionLength: string, 
    focusAreas: string,
    setIsLaunching: React.Dispatch<React.SetStateAction<boolean>>,
    setLaunchStep: React.Dispatch<React.SetStateAction<number>>,
    totalLaunchSteps: number
}

const SummaryCardConfig = ({ credits, interviewTypes, interViewLengthOptions, selectedType, selectedSkills, difficulty, experience, targetRole, sessionLength, focusAreas, setIsLaunching, setLaunchStep, totalLaunchSteps }:SummaryCardConfig) => {

    const activeTypeConfig = interviewTypes.find(t => t.id === selectedType) || interviewTypes[0];
    const selectedInterviewLength = interViewLengthOptions.find(e => e.id === sessionLength) || interViewLengthOptions[1]

    const requiredCredits = activeTypeConfig.cost + selectedInterviewLength.credits;
    const hasEnoughCredits = credits >= requiredCredits;
    const router = useRouter();

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleStartInterview = () => {
      if (!hasEnoughCredits) {
        toast.error("Insufficient credits. Please purchase more credits first.");
        return;
      }

      if (selectedSkills.length < 1) {
        toast.error("Please select at least 1 skill.");
        return;
      }
      if (selectedSkills.length > 5) {
        toast.error("Please select maximum 5 skills.");
        return;
      }

      setShowConfirmModal(true);
    };

     const handleConfirmStart = async () => {
      try {
        setIsConfirming(true);

        const config = {
          type: selectedType,
          skills: selectedSkills,
          difficulty,
          experience,
          role: targetRole,
          session: sessionLength,
          context: focusAreas
        };
        const raw = await fetch("/api/interview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(config)
        })
        const res = await raw.json();

        setShowConfirmModal(false);

        if(!res.success) {
          toast.error(res.message || "Failed to create interview session");
          setIsConfirming(false);
          return;
        }
        
        setIsLaunching(true);
        setLaunchStep(0);
        for (let i = 0; i < totalLaunchSteps; i++) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          setLaunchStep(i);
        }
        
        router.push(`/interview-room/${res.data.interviewId}`);

      } catch(error) {
        console.log("Error in creating interview session:", error);
        toast.error("Failed to create interview session")
        setIsConfirming(false);
        setShowConfirmModal(false);
      }
    };

  return (
    <div className="lg:col-span-1">
          <div className="sticky top-24 z-20 rounded-3xl border border-slate-800/90 bg-linear-to-b from-slate-900/95 via-[#0c101d]/95 to-slate-950/95 backdrop-blur-xl p-5 shadow-[0_25px_70px_-30px_rgba(13,148,136,0.35)] hover:shadow-[0_25px_70px_-20px_rgba(20,184,166,0.15)] hover:border-slate-700/80 space-y-5 transition-all duration-300">
            
            {/* Ambient Background decoration */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="text-sm font-bold text-slate-200 font-display tracking-wide border-b border-slate-900 pb-2.5 flex items-center gap-2">
              <Compass className="h-4 w-4 text-teal-400 animate-spin [animation-duration:12s]" />
              <span>Interview Setup Summary</span>
            </h3>

            {/* Selected Config Previews */}
            <div className="space-y-2 text-xs">
              
              <div className="flex justify-between items-start gap-4 border-b border-slate-900/40 pb-2">
                <span className="text-slate-500 font-medium">Session Track:</span>
                <span className="text-slate-200 font-semibold text-right">{activeTypeConfig.title}</span>
              </div>

              <div className="flex justify-between items-start gap-4 border-b border-slate-900/40 pb-2">
                <span className="text-slate-500 font-medium">Target Role:</span>
                <span className="text-slate-200 font-semibold text-right max-w-[130px] truncate">
                  {formatIdIntoLabel(targetRole)}
                </span>
              </div>

              <div className="flex justify-between items-start gap-4 border-b border-slate-900/40 pb-2">
                <span className="text-slate-500 font-medium">Seniority Profile:</span>
                <span className="text-slate-200 font-semibold text-right capitalize">{formatIdIntoLabel(experience)}</span>
              </div>

              <div className="flex justify-between items-start gap-4 border-b border-slate-900/40 pb-2">
                <span className="text-slate-500 font-medium">Difficulty Level:</span>
                <span className="text-slate-200 font-semibold capitalize text-right">{formatIdIntoLabel(difficulty)}</span>
              </div>

              <div className="flex justify-between items-start gap-4 border-b border-slate-900/40 pb-2">
                <span className="text-slate-500 font-medium">Session Length:</span>
                <span className="text-slate-200 font-semibold capitalize text-right">
                  {selectedInterviewLength.shortTitle} ({selectedInterviewLength.questions} Qs)
                </span>
              </div>

              <div className="flex justify-between items-start gap-4 border-b border-slate-900/40 pb-2">
                <span className="text-slate-500 font-medium">Skills Coverage:</span>
                <span className="text-slate-200 font-semibold text-right max-w-[120px] truncate" title={selectedSkills.join(", ")}>
                  {selectedSkills.join(", ")}
                </span>
              </div>
            </div>

            {/* Dynamic Credits cost block */}
            <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-900 shadow-inner">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-400">Total Cost</span>
                <span className="font-extrabold text-white text-base tracking-tight">
                  {requiredCredits} Credits
                </span>
              </div>

              {/* Insufficient credit Warning */}
              {!hasEnoughCredits && (
                <div className="pt-2 mt-2 border-t border-slate-900/60 space-y-1.5">
                  <div className="flex items-center gap-1 text-rose-400 text-xs font-semibold">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Insufficient Credits</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    You have {credits} credits. Please upgrade to proceed.
                  </p>
                </div>
              )}
            </div>

            {/* CTA action buttons */}
            <div className="space-y-2.5 pt-0.5">
              {hasEnoughCredits ? (
                <button
                  type="button"
                  onClick={handleStartInterview}
                  disabled={isConfirming}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 transition-all duration-200 font-bold text-xs cursor-pointer group select-none relative overflow-hidden"
                >
                  <span>Start Interview Session</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              ) : (
                <Link
                  href="/#pricing"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-slate-100 bg-linear-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 shadow-lg shadow-teal-500/5 hover:scale-[1.01] transition-all duration-200 font-bold text-xs cursor-pointer group"
                >
                  <Coins className="h-3.5 w-3.5 text-white shrink-0" />
                  <span>Buy More Credits</span>
                </Link>
              )}

              {/* Informative credit notes */}
              <div className="flex gap-2 p-2.5 bg-slate-900/30 rounded-xl border border-slate-900 text-[10px] text-slate-500 leading-normal">
                <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Your configuration will be used to dynamically tailor the interview flow, question difficulty, and evaluation criteria to your selected preferences.
                </span>
              </div>
            </div>

          </div>

          {/* Confirmation Modal */}
          {
            showConfirmModal && 
            <ConformationDialogBox credits={credits} requiredCredits={requiredCredits} isConfirming={isConfirming} setShowConfirmModal={setShowConfirmModal} handleConfirmStart={handleConfirmStart}/> 
          }
        </div>
  )
}

export default SummaryCardConfig
