"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "../../public/logo.svg";
import Link from "next/link";
import { Menu, X, Coins, LayoutDashboard } from "lucide-react";
import { Session } from "../types";

const Navbar = ({ session, credits = 0, isLandingPage = false }: { session: Session, credits: number, isLandingPage?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);

    const isLoggedIn = !!session?.user; 

    const NAV_TABS = [
        {
            lable: "Features",
            link: "features"
        },
        {
            lable: "Interview Tracks",
            link: "tracks"
        },
        {
            lable: "Methodology",
            link: "methodology"
        },
        {
            lable: "Success Stories",
            link: "testimonials"
        },
        {
            lable: "Pricing",
            link: "pricing"
        },
    ];

    return (
        <header className={`${isLandingPage ? "fixed" : "sticky"} w-full top-0 z-50 glass-panel border-b border-white/5 backdrop-blur-md bg-dark/70`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo and Brand Name */}
                <div className="flex items-center space-x-3">
                    <div className="relative w-9 h-9 flex items-center justify-center bg-primary-dark rounded-xl shadow-lg shadow-primary-shadow/30">
                        <Image src={Logo} alt="Logo" fill />
                    </div>
                    <Link href={"/"} className="text-xl font-bold tracking-tight text-text cursor-pointer group">
                        Hire<span className="group-hover:text-primary-light">Loop</span>
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                {isLandingPage && (
                    <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-text-muted">
                        {NAV_TABS.map((tab, index) => (
                            <Link 
                                key={index} 
                                href={`#${tab.link}`} 
                                className="hover:text-text transition-colors duration-200"
                            >
                                {tab.lable}
                            </Link>
                        ))}
                    </nav>
                )}

                {/* Desktop Action Buttons / User Menu */}
                <div className="hidden lg:flex items-center space-x-4">
                    {!isLoggedIn ? (
                        <>
                            <Link href={"/auth"} className="text-sm font-semibold text-text-muted hover:text-text transition-colors cursor-pointer">
                                Sign In
                            </Link>
                            <Link href={"/auth"} className="px-4 py-2 text-sm font-semibold rounded-xl text-text bg-primary hover:bg-primary-light/90 shadow-md hover:shadow-lg shadow-primary-shadow hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Credits Badge */}
                            <div className="flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-950/40 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md shadow-sm">
                                <Coins className="h-3.5 w-3.5 text-yellow-400" />
                                <span className="text-teal-400">{credits} Credits</span>
                            </div>
                            {/* Dashboard Button */}
                            <Link href={"/dashboard"} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-text bg-primary hover:bg-primary-light/90 shadow-md hover:shadow-lg shadow-primary-shadow hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger Menu Toggle */}
                <div className="flex lg:hidden items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-text-muted hover:text-text p-2 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown Menu */}
            {isOpen && (
                <div className="lg:hidden border-t border-white/5  bg-dark/95 backdrop-blur-xl px-4 pt-4 pb-8 space-y-4 shadow-xl">
                    {isLandingPage && (
                        <nav className="flex flex-col space-y-3">
                            {NAV_TABS.map((tab, index) => (
                                <Link
                                    key={index}
                                    href={`#${tab.link}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-base font-medium text-text-muted hover:text-text py-2 border-b border-white/5 transition-colors"
                                >
                                    {tab.lable}
                                </Link>
                            ))}
                        </nav>
                    )}
                    
                    {/* Mobile Actions */}
                    <div className="pt-2">
                        {!isLoggedIn ? (
                            <div className="flex flex-col space-y-3">
                                <Link 
                                    href={"/auth"} 
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center py-2.5 text-sm font-semibold text-text-muted hover:text-text border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    href={"/auth"} 
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center py-2.5 text-sm font-semibold rounded-xl text-text bg-primary hover:bg-primary-light/90 shadow-md shadow-primary-shadow transition-colors"
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-3">
                                {/* Mobile Credits Display */}
                                <div className="w-fit flex items-center justify-start rounded-xl border border-teal-500/20 bg-teal-950/30 px-4 py-2.5 text-sm font-semibold">
                                    <span className="flex items-center gap-2">
                                        <Coins className="h-4 w-4 text-yellow-400" />
                                        <span className="text-teal-400">{credits} Credits</span>
                                    </span>
                                </div>
                                {/* Mobile Dashboard Link */}
                                <Link 
                                    href={"/dashboard"} 
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl text-text bg-primary hover:bg-primary-light/90 shadow-md shadow-primary-shadow transition-colors"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
