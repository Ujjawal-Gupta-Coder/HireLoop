import { AlertCircle, ChevronRight, Coins, Loader, X } from "lucide-react"

type ConformationDialogBoxProps = {
    credits: number,
    requiredCredits: number,
    isConfirming: boolean,
    setShowConfirmModal: React.Dispatch<React.SetStateAction<boolean>>,
    handleConfirmStart: () => Promise<void>
}
const ConformationDialogBox = ({credits, requiredCredits, isConfirming, setShowConfirmModal, handleConfirmStart}: ConformationDialogBoxProps) => {
    
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
        onClick={() => !isConfirming && setShowConfirmModal(false)}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#0e1320] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col p-6 space-y-5">
        {/* Close Button */}
        {!isConfirming && (
          <button 
            onClick={() => setShowConfirmModal(false)}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Title & Warning Icon */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 rounded-full bg-amber-950/40 border border-amber-500/20 text-amber-400 animate-pulse-glow">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-100 font-display">Confirm Interview Start</h3>
            <p className="text-xs text-slate-400">Please review your setup details</p>
          </div>
        </div>

        {/* Details Box */}
        <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4 space-y-3">

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Current Balance</span>
            <span className="font-bold text-teal-400">{credits} Credits</span>
          </div>
          
          <div className="flex justify-between items-center text-xs border-t border-slate-900/60 pt-3">
            <span className="text-slate-400 font-medium">Credits to Deduct</span>
            <span className="font-bold text-slate-250">{requiredCredits} Credits</span>
          </div>
          <div className="flex justify-between items-center text-xs border-t border-slate-900/60 pt-3">
            <span className="text-slate-400 font-medium">Remaining Balance</span>
            <span className="font-bold text-slate-350">{credits - requiredCredits} Credits</span>
          </div>
        </div>

        {/* Warning Message */}
        <div className="flex gap-2.5 p-3.5 bg-amber-950/20 rounded-xl border border-amber-550/15 text-xs text-amber-300/90 leading-relaxed">
          <Coins className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Important:</strong> Credits will be deducted once you click yes, regardless of whether you continue the interview or not.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowConfirmModal(false)}
            disabled={isConfirming}
            className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-900/50 transition-colors border border-slate-800 disabled:opacity-50 cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmStart}
            disabled={isConfirming}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-350 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 transition-all duration-200"
          >
            {isConfirming ? (
              <>
                <Loader className="h-3.5 w-3.5 animate-spin" />
                <span>Starting...</span>
              </>
            ) : (
              <>
                <span>Yes, Start Session</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConformationDialogBox
