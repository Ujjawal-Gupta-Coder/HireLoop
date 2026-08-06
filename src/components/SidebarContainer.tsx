import Sidebar from './Sidebar';
import { X } from 'lucide-react';

type SidebarContainerProps = {
  isSidebarOpen: boolean,
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContainer = ({isSidebarOpen, setIsSidebarOpen}: SidebarContainerProps) => {
  return (
    <>
    
     {/* 1. Desktop Sidebar */}
      <Sidebar className="hidden md:flex shrink-0" />

      {/* 2. Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-dark/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Sidebar content */}
          <div className="relative flex flex-col w-64 max-w-xs bg-[#060B18] transform transition-transform duration-300 ease-in-out">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setIsSidebarOpen(false)} className="w-full border-r-0" />
          </div>
        </div>
      )}
    </>
  )
}

export default SidebarContainer
