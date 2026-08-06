"use client";

import { useState } from "react";
import Header from "./Header"
import SidebarContainer from "./SidebarContainer"
import { Session } from "../types";

type ProtectedWrapperClientProps = {
  children: React.ReactNode, 
  credits: number,
  session: Session
}

const ProtectedWrapperClient = ({children, credits, session}:ProtectedWrapperClientProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-text font-sans overflow-hidden">
      <SidebarContainer isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-y-auto h-screen no-scrollbar relative">
        
          {/* Header */}
          <Header session={session} credits={credits} setIsSidebarOpen={setIsSidebarOpen} />

          {/* Main Content  */}
          {children}
      </div>
    </div>
  )
}

export default ProtectedWrapperClient
