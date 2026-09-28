"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import SidebarContainer from "./SidebarContainer";
import { Session } from "../../types";

type ProtectedWrapperClientProps = {
  children: React.ReactNode;
  credits: number;
  session: Session;
};

const ProtectedWrapperClient = ({
  children,
  credits,
  session,
}: ProtectedWrapperClientProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Disable browser automatic scroll restoration to avoid unexpected scroll jumps
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "scrollRestoration" in window.history
    ) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Reset scroll position to top whenever navigating between pages (e.g. /history to /analytics/[id])
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
      scrollContainerRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-text font-sans overflow-hidden">
      <SidebarContainer
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div
        ref={scrollContainerRef}
        data-scroll-container="true"
        className="flex-1 flex flex-col overflow-y-auto h-screen no-scrollbar relative"
      >
        {/* Header */}
        <Header
          session={session}
          credits={credits}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};

export default ProtectedWrapperClient;
