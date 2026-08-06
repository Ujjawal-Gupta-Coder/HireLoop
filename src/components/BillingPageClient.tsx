"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Coins,
  ShoppingCart,
  Download,
  MoreVertical,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  ShoppingBag,
  Sparkles
} from "lucide-react";

export default function BillingPageClientProps() {

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Mock Payment Records
  const mockPayments = [
    {
      id: "pay_1",
      date: "05 Aug 2026, 10:42 AM",
      plan: "Elite Plan",
      credits: "+1000 Credits",
      amount: "₹999",
      status: "Paid",
    },
    {
      id: "pay_2",
      date: "01 Aug 2026, 06:18 PM",
      plan: "Pro Plan",
      credits: "+500 Credits",
      amount: "₹499",
      status: "Paid",
    },
    {
      id: "pay_3",
      date: "28 Jul 2026, 11:21 AM",
      plan: "Starter Plan",
      credits: "+100 Credits",
      amount: "₹99",
      status: "Paid",
    },
    {
      id: "pay_4",
      date: "20 Jul 2026, 09:07 PM",
      plan: "Starter Plan",
      credits: "+100 Credits",
      amount: "₹99",
      status: "Paid",
    },
    {
      id: "pay_5",
      date: "12 Jul 2026, 03:36 PM",
      plan: "Starter Plan",
      credits: "+100 Credits",
      amount: "₹99",
      status: "Paid",
    },
  ];

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

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Current Credits */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#111827]/60 to-[#0b0f19]/80 border border-slate-900/80 p-5 shadow-xl flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-teal-950/40 border border-teal-500/20 shadow-inner">
                <Coins className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold tracking-wide">Current Credits</p>
                <p className="text-2xl font-bold text-slate-100 mt-0.5">70</p>
                <p className="text-[10px] text-teal-400 font-semibold mt-0.5 flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-teal-400" />
                  Available to use
                </p>
              </div>
            </div>

            {/* Card 2: Total Credits Purchased */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#111827]/60 to-[#0b0f19]/80 border border-slate-900/80 p-5 shadow-xl flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-purple-950/30 border border-purple-500/15 shadow-inner">
                <ShoppingBag className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold tracking-wide">Total Credits Purchased</p>
                <p className="text-2xl font-bold text-slate-100 mt-0.5">850</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Lifetime</p>
              </div>
            </div>

            {/* Card 3: Total Spent */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#111827]/60 to-[#0b0f19]/80 border border-slate-900/80 p-5 shadow-xl flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-950/30 border border-blue-500/15 shadow-inner">
                <CreditCard className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold tracking-wide">Total Spent</p>
                <p className="text-2xl font-bold text-slate-100 mt-0.5">₹1,597</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Across 5 payments</p>
              </div>
            </div>

            {/* Card 4: Total Transactions */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#111827]/60 to-[#0b0f19]/80 border border-slate-900/80 p-5 shadow-xl flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-950/30 border border-emerald-500/15 shadow-inner">
                <Calendar className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold tracking-wide">Total Transactions</p>
                <p className="text-2xl font-bold text-slate-100 mt-0.5">5</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">All time</p>
              </div>
            </div>

          </div>

          {/* Purchase History Section */}
          <div className="overflow-hidden rounded-2xl border border-slate-900 bg-[#0c101d]/60 backdrop-blur-md shadow-2xl p-6">
            <h3 className="text-lg font-bold text-slate-200 tracking-tight mb-5 font-display">
              Purchase History
            </h3>

            {/* Desktop Table View */}
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 font-semibold text-xs tracking-wider uppercase bg-slate-950/30">
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-4">Plan</th>
                    <th className="py-4 px-4">Credits</th>
                    <th className="py-4 px-4">Amount</th>
                    <th className="py-4 px-4">Payment Status</th>
                    <th className="py-4 px-4">Receipt</th>
                    <th className="py-4 px-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {mockPayments.map((payment, index) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-slate-900/20 transition-colors group/row"
                    >
                      {/* Date */}
                      <td className="py-4 px-6 font-medium text-slate-300">
                        {payment.date}
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-lg bg-teal-950/40 border border-teal-500/10 text-teal-400">
                            <Sparkles className="h-3.5 w-3.5" />
                          </span>
                          <span className="font-semibold text-slate-200">{payment.plan}</span>
                        </div>
                      </td>

                      {/* Credits */}
                      <td className="py-4 px-4 font-semibold text-teal-400">
                        {payment.credits}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-semibold text-slate-200">
                        {payment.amount}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 text-xs font-semibold">
                          <CheckCircle2 className="h-3 w-3" />
                          {payment.status}
                        </span>
                      </td>

                      {/* Receipt */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => console.log(`Download clicked for ${payment.id}`)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/20 bg-teal-950/20 text-teal-400 hover:bg-teal-500 hover:text-slate-950 hover:border-transparent px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </button>
                      </td>

                      {/* Options menu */}
                      <td className="py-4 px-6 text-right relative">
                        <button
                          onClick={() =>
                            setActiveDropdown(activeDropdown === index ? null : index)
                          }
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900/60 transition-colors focus:outline-none cursor-pointer inline-block"
                        >
                          <MoreVertical className="h-4.5 w-4.5" />
                        </button>

                        {/* Dropdown Options overlay */}
                        {activeDropdown === index && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveDropdown(null)}
                            />
                            <div className="absolute right-6 top-12 z-20 w-44 rounded-xl border border-slate-800 bg-[#0e1320] p-1.5 shadow-2xl text-left">
                              <button
                                onClick={() => setActiveDropdown(null)}
                                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                              >
                                View Receipt
                              </button>
                              <button
                                onClick={() => setActiveDropdown(null)}
                                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                              >
                                View Payment Details
                              </button>
                              <button
                                onClick={() => setActiveDropdown(null)}
                                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                              >
                                Copy Receipt ID
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Secure Payments Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-teal-500/10 bg-linear-to-r from-teal-950/15 via-slate-950/50 to-slate-950/80 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            {/* Glow effect */}
            <div className="absolute -left-10 -top-10 w-28 h-28 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start md:items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-teal-950/40 border border-teal-500/20 shadow-inner">
                <ShieldCheck className="h-6 w-6 text-teal-400 animate-pulse-glow" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-200 tracking-tight">
                  Secure Payments
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                  All payments are processed securely via Stripe. Your card data and transactions
                  are encrypted and always protected. We do not store your credit card info.
                </p>
              </div>
            </div>

            {/* Custom SVG Credit Card Graphic */}
            <div className="hidden lg:block relative w-48 h-24 flex-shrink-0 select-none opacity-85 hover:opacity-100 transition-opacity">
              {/* Back Card */}
              <div className="absolute right-2 top-0 w-36 h-20 rounded-xl bg-linear-to-tr from-slate-900 to-slate-800 border border-slate-800 shadow-md transform rotate-6" />
              
              {/* Front Card */}
              <div className="absolute left-2 bottom-0 w-36 h-20 rounded-xl bg-linear-to-tr from-teal-950/70 via-slate-950/90 to-teal-950/40 border border-teal-500/20 shadow-xl flex flex-col justify-between p-3.5 backdrop-blur-xs">
                {/* Chip and Signal */}
                <div className="flex items-center justify-between">
                  <div className="w-5.5 h-4 bg-teal-400/20 border border-teal-500/30 rounded-xs" />
                  <div className="w-4 h-4 rounded-full bg-teal-400/10 border border-teal-400/35 flex items-center justify-center">
                    <CheckCircle2 className="h-2 w-2 text-teal-400" />
                  </div>
                </div>
                {/* Dots mimicking numbers */}
                <div className="space-y-1">
                  <div className="flex gap-1">
                    <span className="inline-block w-1.5 h-1 rounded-full bg-teal-500/40" />
                    <span className="inline-block w-1.5 h-1 rounded-full bg-teal-500/40" />
                    <span className="inline-block w-1.5 h-1 rounded-full bg-teal-500/40" />
                    <span className="inline-block w-1.5 h-1 rounded-full bg-teal-500/40" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] text-teal-500/50 uppercase tracking-widest font-mono">
                      Hireloop Client
                    </span>
                    <span className="text-[7px] text-teal-500/70 font-mono">08/29</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>
  );
}
