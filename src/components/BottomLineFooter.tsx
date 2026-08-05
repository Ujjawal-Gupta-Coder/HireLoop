import Link from "next/link"

const BottomLineFooter = () => {
    const PORTFOLIO_LINK = "https://ujjawalgupta.vercel.app/"
  return (
        // Copyright and developer credit 
    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-4 border-t border-white/5 text-xs text-text-muted">
        <p className="text-center sm:text-left leading-relaxed">
        © {new Date().getFullYear()} HireLoop. ⚙️ All rights reserved. ✨Designed & Developed with 💖 by <Link href={PORTFOLIO_LINK}>Ujjawal Gupta</Link>
        </p> 
    </div>
  )
}

export default BottomLineFooter
