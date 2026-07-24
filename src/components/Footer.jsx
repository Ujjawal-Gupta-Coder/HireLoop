import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 flex items-center justify-center bg-teal-600 rounded-lg shadow-md shadow-teal-900/30">
            <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3 6-6" />
            </svg>
          </div>
          <span className="text-base font-bold text-white">HireLoop</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-normal">
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Cookie Policy</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Contact Support</a>
        </div>

        <p className="text-xs text-slate-600 font-normal">
          &copy; {new Date().getFullYear()} HireLoop AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
