"use client";

import Link from "next/link";
import {
  Coins,
  ShoppingCart,
  CheckCircle2,
  Calendar,
  CreditCard,
  ShoppingBag,
  Sparkles,
  CircleX,
  Loader,
  HandCoins,
  FileText,
  LucideIcon
} from "lucide-react";
import { Prisma } from "@prisma/client";
import toast from "react-hot-toast";
import SecurePaymentBanner from "./SecurePaymentBanner";
import NoPaymentRecord from "./NoPaymentRecord";
import DropdownPayment from "./DropdownPayment";
import { useState } from "react";
import PaymentDetailsModal from "./PaymentDetailsModal";

type PaymentWithPlan = Prisma.PaymentGetPayload<{
  include: { plan: true }
}>

type BillingPageClientProps = {
  payments: PaymentWithPlan[] | null,
  error?: string,
  currentCredits: number, 
  totalCredits: number, 
  totalAmountSpend: number, 
  totalTransactions: number
}

type quickCardType = {
  icon: LucideIcon,
  iconColor: string,
  heading: string,
  data: string | number,
  underLineText: string,
  underLineTextColor: string  
}
export default function BillingPageClient({payments, currentCredits, totalCredits, totalAmountSpend, totalTransactions, error} : BillingPageClientProps) {

  const CURRENCY_SYMBOL = "₹";
  const quickCard : quickCardType[] = [
    {
      icon: Coins,
      iconColor: "text-teal-400",
      heading: "Current Credits",
      data: currentCredits,
      underLineText: "Available to use",
      underLineTextColor: "text-teal-400"
    },
    {
      icon: ShoppingBag,
      iconColor: "text-purple-400",
      heading: "Total Credits Purchased",
      data: totalCredits,
      underLineText: "Lifetime",
      underLineTextColor: "text-slate-500"
    },
    {
      icon: CreditCard,
      iconColor: "text-blue-400",
      heading: "Total Spent",
      data: `${CURRENCY_SYMBOL}${totalAmountSpend.toLocaleString("en-IN")}`,
      underLineText: `Across ${totalTransactions} payments`,
      underLineTextColor: "text-slate-500"
    },
    {
      icon: Calendar,
      iconColor: "text-emerald-400",
      heading: "Total Transactions",
      data: totalTransactions,
      underLineText: "All time",
      underLineTextColor: "text-emerald-400"
    }
  ]
  const [openingReceipt, setOpeningReceipt] = useState<string|null>(null);
  const [selectedPaymentForDetails, setSelectedPaymentForDetails] = useState<PaymentWithPlan | null>(null);

  const handleReceiptViewClick = async (receiptId:string) => {
    try {
      setOpeningReceipt(receiptId);
      const raw = await fetch(`/api/payment/${receiptId}`);
      const res = await raw.json();
      if(!res.success) throw new Error(res.message)
    
      window.open(res.data.url, "_blank");

    } catch(error) {
      toast.error("View receipt action failed");
      console.error("Error in view receipt: ", error);
    } finally {
        setOpeningReceipt(null);
    }
  }

  const columns: string[] = ["Date", "Plan", "Credits", "Amount", "Payment Status", "Receipt"];

  if(error) toast.error(error);
  return (
        <main className="flex-1 py-8 px-6 sm:px-8 max-w-7xl w-full mx-auto space-y-8">

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-100 font-display">
                Payments & Receipts
              </h1>
              <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                Track your credit purchases and download receipts anytime.
              </p>
            </div>
            <Link
              href="/#pricing"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 hover:scale-[1.02] shadow-lg shadow-teal-500/10 transition-all duration-200 cursor-pointer self-start sm:self-auto group"
            >
              <ShoppingCart className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Buy More Credits</span>
            </Link>
          </div>

          {/* Quick Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {
              quickCard.map((card, index) => {
                return (
                  <div key={index} className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#111827]/60 to-[#0b0f19]/80 border border-slate-900/80 p-5 shadow-xl flex items-center gap-4">
                    <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-teal-950/40 border border-teal-500/20 shadow-inner">
                      <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold tracking-wide">{card.heading}</p>
                      <p className="text-2xl font-bold text-slate-100 mt-0.5">{card.data}</p>
                      <p className={`text-[10px] ${card.underLineTextColor} font-semibold mt-0.5 ${index === 0 && "flex items-center gap-1"}`}>
                        {index === 0 && <span className="inline-block h-1 w-1 rounded-full bg-teal-400" />}
                        {card.underLineText}
                      </p>
                    </div>
                  </div>
                )
              })
            }
          </div>

          {/* Purchase History Section */}
          <div className="overflow-hidden rounded-2xl border border-slate-900 bg-[#0c101d]/60 backdrop-blur-md shadow-2xl p-6">
            <h3 className="text-lg font-bold text-slate-200 tracking-tight mb-5 font-display">
              Purchase History
            </h3>

            {!payments || payments.length == 0 ? (
              <NoPaymentRecord error={error}/>
              ) : (
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                  <table className="w-full min-w-[900px] border-collapse text-left text-sm text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 font-semibold text-xs tracking-wider uppercase bg-slate-950/30">
                        {
                          columns.map((col, index) => {
                            return (
                              <th key={index} className="py-4 px-6">{col}</th>
                            )
                          })
                        }
                        <th className="py-4 px-6 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {payments.map((payment) => (
                        <tr
                          key={payment.receiptId}
                          className="hover:bg-slate-900/20 transition-colors group/row"
                        >
                          {/* Date */}
                          <td className="py-4 px-6 font-medium text-slate-300">
                            {payment.createdAt.toLocaleString("en-In", {
                              timeZone: "Asia/Kolkata",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true
                            }).replace(" at", ", ")}
                          </td>

                          {/* Plan */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-teal-950/40 border border-teal-500/10 text-teal-400">
                                <Sparkles className="h-3.5 w-3.5" />
                              </span>
                              <span className="font-semibold text-slate-200">{payment.plan.name}</span>
                            </div>
                          </td>

                          {/* Credits */}
                          <td className="py-4 px-4 font-semibold text-teal-400">
                            +{payment.plan.credits} Credits
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-4 font-semibold text-slate-200">
                            {CURRENCY_SYMBOL}{payment.amount}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4">
                          {
                            (() => {
                              switch (payment.status) {
                              case "PAID":
                              return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 text-xs font-semibold">
                                <CheckCircle2 className="h-3 w-3" />
                                Paid
                              </span>
                              break;
                            
                              case "FAILED":
                              return <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 text-text border border-red-500/10 px-2.5 py-1 text-xs font-bold">
                                <CircleX className="h-3 w-3"/>
                                Failed
                              </span>
                              break;

                              case "PENDING":
                              return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-600 text-text border border-yellow-800 px-2.5 py-1 text-xs font-bold">
                                <Loader className="h-3 w-3"/>
                                Pending
                              </span>
                              break;

                              case "REFUNDED":
                              return <span className="inline-flex items-center gap-1 rounded-full bg-sky-600 text-text border border-blue-800 px-2.5 py-1 text-xs font-bold">
                                <HandCoins className="h-3 w-3"/>
                                Refunded
                              </span>
                              break;
                            }
                            })()  
                          }

                          </td>

                          {/* Receipt */}
                          <td className="py-4 px-4">
                            {
                              payment.receiptPath && 
                              <button
                                onClick={()=> {handleReceiptViewClick(payment.receiptId)}}
                                disabled={openingReceipt === payment.receiptId}
                                className={`inline-flex items-center gap-1.5 rounded-lg border ${openingReceipt === payment.receiptId ? "border-grey-500/20 bg-slate-900 text-gray-400 hover:bg-gray-200 hover:text-slate-950" : "border-teal-500/20 bg-teal-950/20 text-teal-400 hover:bg-teal-500 hover:text-slate-950"} hover:border-transparent px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95`}
                              >
                                {
                                  openingReceipt === payment.receiptId ? 
                                  <> 
                                    <Loader className="h-3.5 w-3.5 animate-spin" />
                                    <span>Preparing</span>
                                  </>
                                :
                                  <>
                                    <FileText className="h-3.5 w-3.5 " /> 
                                    <span>View Receipt</span>
                                  </>
                                }
                              </button>
                            }
                            
                          </td>

                          {/* Options menu */}
                          <td className="py-4 px-6 text-right relative">
                            <DropdownPayment 
                              payment={payment}
                              onViewDetails={setSelectedPaymentForDetails}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>

          {/* Secure Payments Banner */}
          <SecurePaymentBanner />

          {/* Details Modal */}
          {selectedPaymentForDetails && (
            <PaymentDetailsModal
              payment={selectedPaymentForDetails}
              onClose={() => setSelectedPaymentForDetails(null)}
              onViewReceipt={handleReceiptViewClick}
              openingReceipt={openingReceipt}
            />
          )}
        </main>
  );
}
