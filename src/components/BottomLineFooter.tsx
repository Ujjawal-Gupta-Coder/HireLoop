import Link from "next/link"
import { PORTFOLIO_WEBSITE } from "../constants"

const BottomLineFooter = () => {
  return (
        // Copyright and developer credit 
    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 p-4 border-t border-white/5 text-xs text-text-muted">
        <p className="text-center sm:text-left leading-relaxed">
        © {new Date().getFullYear()} HireLoop. ⚙️ All rights reserved. ✨Designed & Developed with 💖 by <Link href={PORTFOLIO_WEBSITE}>Ujjawal Gupta</Link>
        </p> 
    </div>
  )
}

export default BottomLineFooter
