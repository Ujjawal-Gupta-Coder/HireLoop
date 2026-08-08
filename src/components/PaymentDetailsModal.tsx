"use client";

import { Prisma } from "@prisma/client";
import { Check, CheckCircle2, CircleX, Copy, CreditCard, FileText, HandCoins, Loader, Sparkles, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type PaymentWithPlan = Prisma.PaymentGetPayload<{
  include: { plan: true }
}>

type PaymentDetailsModalProps = {
  payment: PaymentWithPlan;
  onClose: () => void;
  onViewReceipt: (receiptId: string) => Promise<void>;
  openingReceipt: string | null;
}

const PaymentDetailsModal = ({ payment, onClose, onViewReceipt, openingReceipt }: PaymentDetailsModalProps) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formattedDate = payment.createdAt.toLocaleString("en-In", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).replace(" at", ", ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#0e1320] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-900 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-950/40 border border-teal-500/20 text-teal-400">
              <CreditCard className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Payment Details</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Transaction information & summary</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-5 py-5 space-y-5 flex-1">
          {/* Status & Amount Hero */}
          <div className="rounded-xl bg-slate-950/40 border border-slate-900 p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-[0.03] pointer-events-none">
              <CreditCard className="h-20 w-20 -mr-3 -mt-3 rotate-12" />
            </div>
            
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Amount Paid</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-0.5 font-display">
              {payment.plan.currencySymbol || "₹"}{payment.amount}
            </span>
            
            <div className="mt-2.5">
              {(() => {
                switch (payment.status) {
                  case "PAID":
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        Paid Successfully
                      </span>
                    );
                  case "FAILED":
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-950/50 text-rose-400 border border-red-500/20 px-2.5 py-0.5 text-[10px] font-semibold">
                        <CircleX className="h-3 w-3" />
                        Failed
                      </span>
                    );
                  case "PENDING":
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-950/50 text-yellow-500 border border-yellow-800/20 px-2.5 py-0.5 text-[10px] font-semibold">
                        <Loader className="h-3 w-3 animate-spin" />
                        Pending
                      </span>
                    );
                  case "REFUNDED":
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-950/50 text-sky-400 border border-blue-800/20 px-2.5 py-0.5 text-[10px] font-semibold">
                        <HandCoins className="h-3 w-3" />
                        Refunded
                      </span>
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Purchase Summary</h4>
            <div className="rounded-xl border border-slate-900 bg-slate-950/20 divide-y divide-slate-900/60 overflow-hidden">
              <div className="flex items-center justify-between p-3 text-xs">
                <span className="text-slate-400 font-medium">Plan Name</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-teal-400" />
                  {payment.plan.name}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 text-xs">
                <span className="text-slate-400 font-medium">Credits Included</span>
                <span className="font-bold text-teal-400">+{payment.plan.credits} Credits</span>
              </div>
              <div className="flex items-center justify-between p-3 text-xs">
                <span className="text-slate-400 font-medium">Purchase Date</span>
                <span className="text-slate-350 font-medium">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Reference IDs Section */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reference Information</h4>
            <div className="space-y-2.5">
              {/* Receipt ID */}
              <div className="flex flex-col gap-1 rounded-xl border border-slate-900 bg-slate-950/20 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">Receipt ID</span>
                  <button 
                    onClick={() => handleCopy(payment.receiptId, "receiptId", "Receipt ID")}
                    className="p-0.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-all cursor-pointer"
                    title="Copy Receipt ID"
                  >
                    {copiedField === "receiptId" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <code className="text-xs font-semibold text-slate-300 break-all select-all font-mono">
                  {payment.receiptId}
                </code>
              </div>

              {/* Session ID */}
              <div className="flex flex-col gap-1 rounded-xl border border-slate-900 bg-slate-950/20 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">Session ID</span>
                  <button 
                    onClick={() => handleCopy(payment.sessionId, "sessionId", "Session ID")}
                    className="p-0.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-all cursor-pointer"
                    title="Copy Session ID"
                  >
                    {copiedField === "sessionId" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <code className="text-[10px] font-medium text-slate-400 break-all select-all font-mono">
                  {payment.sessionId}
                </code>
              </div>

              {/* Transaction ID */}
              <div className="flex flex-col gap-1 rounded-xl border border-slate-900 bg-slate-950/20 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">Payment ID</span>
                  <button 
                    onClick={() => handleCopy(payment.id, "paymentId", "Payment ID")}
                    className="p-0.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-all cursor-pointer"
                    title="Copy Payment ID"
                  >
                    {copiedField === "paymentId" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <code className="text-[10px] font-medium text-slate-400 break-all select-all font-mono">
                  {payment.id}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-900 bg-slate-950/30 px-5 py-3 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-800 active:scale-95"
          >
            Close
          </button>
          
          <button
            onClick={() => onViewReceipt(payment.receiptId)}
            disabled={openingReceipt === payment.receiptId}
            className={`inline-flex items-center gap-1.5 rounded-lg border ${
              openingReceipt === payment.receiptId
                ? "border-grey-500/20 bg-slate-900 text-gray-400 hover:bg-gray-200"
                : "border-teal-500/20 bg-teal-950/20 text-teal-400 hover:bg-teal-500 hover:text-slate-950"
            } px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95`}
          >
            {openingReceipt === payment.receiptId ? (
              <>
                <Loader className="h-3.5 w-3.5 animate-spin" />
                <span>Preparing PDF</span>
              </>
            ) : (
              <>
                <FileText className="h-3.5 w-3.5" />
                <span>View Receipt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetailsModal;
