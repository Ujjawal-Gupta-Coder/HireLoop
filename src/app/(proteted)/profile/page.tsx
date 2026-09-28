import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Calendar,
  Coins,
  Video,
  ShoppingBag,
  CreditCard,
  GalleryHorizontalEnd,
  LogOut,
} from "lucide-react";

import { generateInitials } from "@/src/helper/helper.common";
import signOutWithGoogle from "@/src/actions/signOut";

type ProfileData = {
  name: string;
  email: string;
  createdAt: string;
  currentCredits: number;
  totalPurchasedCredits: number;
  totalInterviews: number;
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      name: true,
      email: true,
      credits: true,
      createdAt: true,
      creditHistory: {
        where: {
          type: "PURCHASE",
        },
        select: {
          credit: true,
        },
      },
      _count: {
        select: {
          interviewHistory: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth");
  }

  const totalPurchasedCredits = user.creditHistory.reduce(
    (prev, curr) => prev + curr.credit,
    0
  );

  const profile: ProfileData = {
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    currentCredits: user.credits,
    totalPurchasedCredits,
    totalInterviews: user._count.interviewHistory,
  };

  const initials = generateInitials(profile.name);
  
    const formattedJoinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
  <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-2xl w-full mx-auto flex flex-col justify-center">
      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-[#111827]/80 to-[#0b0f19]/95 border border-slate-900/90 p-7 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Subtle background glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* User Identity Section */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Profile Picture */}
          <div className="relative mb-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-linear-to-br from-teal-950 to-slate-950 border-2 border-teal-500/40 flex items-center justify-center shadow-xl shadow-teal-500/10">
                <span className="text-3xl font-extrabold text-teal-300 font-display">
                  {initials}
                </span>
              </div>

            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0b0f19]" />
            </span>
          </div>

          {/* User Name */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">
            {profile.name}
          </h1>

          {/* User Email */}
          <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
            <Mail className="h-4 w-4 text-slate-500 shrink-0" />
            <span>{profile.email}</span>
          </p>

          {/* Member Since */}
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
            <Calendar className="h-3.5 w-3.5 text-teal-500/80 shrink-0" />
            <span>Member since {formattedJoinedDate}</span>
          </p>
        </div>

        {/* 3 Metric Stats Row */}
        <div className="relative z-10 grid grid-cols-3 divide-x divide-slate-800/80 rounded-2xl bg-slate-950/60 border border-slate-900 my-8 py-4 px-2">
          {/* Total credit he has */}
          <div className="flex flex-col items-center px-2 text-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Coins className="h-3.5 w-3.5 text-yellow-400" />
              <span>Current Credits</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-teal-400 font-display mt-1">
              {profile.currentCredits}
            </span>
          </div>

          {/* Total credit he purchased */}
          <div className="flex flex-col items-center px-2 text-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <ShoppingBag className="h-3.5 w-3.5 text-teal-400" />
              <span>Credits Bought</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-100 font-display mt-1">
              {profile.totalPurchasedCredits}
            </span>
          </div>

          {/* Total interview he took part */}
          <div className="flex flex-col items-center px-2 text-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Video className="h-3.5 w-3.5 text-emerald-400" />
              <span>Interviews Taken</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-100 font-display mt-1">
              {profile.totalInterviews}
            </span>
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="relative z-10 space-y-3">
          {/* Start Interview Button */}
          <Link
            href="/interview"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 hover:scale-[1.01] shadow-lg shadow-teal-500/10 transition-all duration-200 cursor-pointer"
          >
            <Video className="h-4 w-4" />
            <span>Start Interview</span>
          </Link>

          {/* 2-Column Buttons: History & Payments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* View Interview History Button */}
            <Link
              href="/history"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer"
            >
              <GalleryHorizontalEnd className="h-4 w-4 text-teal-400" />
              <span>View Interview History</span>
            </Link>

            {/* View Payment History Button */}
            <Link
              href="/billing"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer"
            >
              <CreditCard className="h-4 w-4 text-teal-400" />
              <span>View Payment History</span>
            </Link>
          </div>

          {/* Sign Out Button */}
          <div className="pt-2">
            <button
              onClick={signOutWithGoogle}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-tr from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 border border-red-600/30 shadow-lg shadow-rose-500/10 transition-all duration-200 cursor-pointer active:scale-98"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
