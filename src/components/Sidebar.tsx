"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Video,
  GalleryHorizontalEnd,
  User,
  CreditCard,
  Settings,
  ShoppingCart,
  ArrowRight,
  LogOut,
} from "lucide-react";
import Logo from "../../public/logo.svg";
import signOutWithGoogle from "../actions/signOut";

interface SidebarProps {
  className?: string;
  onCloseMobile?: () => void;
}

export default function Sidebar({ className = "", onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const navigationTabs = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Start Interview", href: "/interview", icon: Video },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Interview History", href: "/history", icon: GalleryHorizontalEnd },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className={`flex flex-col w-56 bg-[#060B18] border-r border-slate-900/60 h-screen sticky top-0 text-slate-300 py-6 px-4 z-40 ${className}`}
    >
      {/* Brand Header */}
      <div className="flex items-center space-x-3 px-3 mb-8">
        <div className="relative w-9 h-9 flex items-center justify-center bg-primary-dark rounded-xl shadow-lg shadow-primary-shadow/30 border border-teal-500/10">
          <Image src={Logo} alt="Logo" fill className="p-0.5" />
        </div>
        <Link href="/" className="text-xl font-bold tracking-tight text-text cursor-pointer group">
          Hire<span className="text-teal-400 group-hover:text-primary-light">Loop</span>
        </Link>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-7 no-scrollbar">
        {/* Main Section */}
        <nav className="space-y-1.5">
          {navigationTabs.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-teal-950/30 border border-teal-500/20 text-teal-400 font-semibold shadow-inner"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <item.icon
                  className={`h-4.5 w-4.5 transition-colors ${
                    active ? "text-teal-400" : "text-slate-400 group-hover:text-slate-300"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Content  */}
      <div className="mt-auto pt-6 border-t border-slate-900/80">
      
      {/* Buy More Credits Promo Card */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-teal-950/40 to-slate-950/80 border border-teal-500/10 p-4 shadow-xl">
          {/* Subtle Glow Graphics */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-950/60 border border-teal-500/20 mb-3 shadow-inner">
            <ShoppingCart className="h-5 w-5 text-teal-400 animate-pulse" />
          </div>

          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
            Buy More Credits
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Get more credits to practice premium interviews
          </p>

          <Link
            href="/#pricing"
            className="flex items-center justify-between mt-4 w-full px-3.5 py-2 text-xs font-semibold text-teal-400 bg-teal-950/30 border border-teal-500/20 rounded-xl hover:bg-teal-400 hover:text-slate-950 hover:border-transparent transition-all duration-200 cursor-pointer shadow-sm group"
          >
            <span>Buy Credits</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      {/* Logout button  */}
        <button
          onClick={signOutWithGoogle}
          className="flex items-center w-full mt-2 gap-3 px-3.5 py-2.5 rounded-xl text-sm cursor-pointer transition-color bg-linear-to-tr from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600  border border-red-600/30 text-text font-bold shadow-inner"
        >
          <LogOut className="h-4.5 w-4.5"/>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
