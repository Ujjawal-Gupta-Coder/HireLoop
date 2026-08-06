"use client";

import { ChevronDown, ChevronUp, Coins, Menu } from "lucide-react"
import { Session } from "../types";
import { generateInitials } from "../helper/helper.common";
import { useState } from "react";
import Link from "next/link";
import signOutWithGoogle from "../actions/signOut";

type hearderProps = {
    session: Session,
    credits: number
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const Header = ({session, credits, setIsSidebarOpen}:hearderProps) => {

   const [drower, setDrower] = useState(false);
   const initials = generateInitials(session?.user?.name || "Invalid");

   const drowerItems = [
    {
        label: "Dashboard",
        link: "/dashboard"
    },
    {
        label: "Profile",
        link: "/profile"
    },
    {
        label: "History",
        link: "/history"
    },
    {
        label: "Payment",
        link: "/billing"
    },
    {
        label: "Settings",
        link: "/settings"
    },
   ]

   const handleSignOutClick = () => {
       setDrower(false);
       signOutWithGoogle();
   }

  return (
    <header className="min-h-16 border-b border-slate-900/60 bg-dark/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center">
        {/* Mobile Sidebar Toggle Button */}
        <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 md:hidden focus:outline-none cursor-pointer"
        >
            <Menu className="h-5.5 w-5.5" />
        </button>
        </div>

        <div className="flex items-center gap-4">
        {/* Credits Counter */}
        <div className="flex items-center gap-1.5 rounded-sm border border-teal-500/20 bg-teal-950/40 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md shadow-sm">
            <Coins className="h-3.5 w-3.5 text-yellow-400" />
            <span className="text-teal-400">{credits} Credits</span>
        </div>

        {/* User Dropdown */}
        <div className="flex items-center pl-2 border-l gap-2 border-slate-900">
            <div className="h-8.5 w-8.5 border-2 rounded-full flex items-center justify-center border-teal-300 shadow-md">
                <span className="text-sm font-bold text-teal-400">{initials}</span> 
            </div>

            <button onClick={() => setDrower(!drower)} className="cursor-pointer">
            {
                drower ? 
                <ChevronUp/> :
                <ChevronDown/>
            }
            </button>
            
            {
                drower && 
                <div className="absolute flex flex-col right-6 top-12 z-20 w-38 rounded-xl border border-slate-900 bg-[#0e1320] p-1.5 shadow-2xl text-left">
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDrower(false)}
                />

                {
                    drowerItems.map((item, idx) => {
                        return (
                            <Link
                                key={idx}
                                href={item.link}
                                onClick={() => setDrower(false)}
                                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                                >
                                {item.label}
                            </Link>
                        )
                    })
                }
                
                <button
                onClick={handleSignOutClick}
                className="w-full text-left px-3 py-2 mt-1 text-xs text-slate-300 hover:bg-red-400 bg-red-500 rounded-lg transition-all cursor-pointer"
                >
                Sign Out
                </button>
            </div>
            }
            
        </div>
        </div>
    </header>
  )
}

export default Header
