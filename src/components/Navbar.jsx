import Image from "next/image"
import Logo from "../../public/logo.svg"
import Link from "next/link"
const Navbar = ({isLandingPage = false}) => {
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
]

  return (
    <header className={`${isLandingPage ? "fixed":"sticky"} w-full top-0 z-50 glass-panel border-b border-white/5 backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="relative w-9 h-9 flex items-center justify-center bg-primary-dark rounded-xl shadow-lg shadow-primary-shadow/30">
                <Image src={Logo} alt="Logo" fill/>
            </div>
            <Link href={"/"} className="text-xl font-bold tracking-tight text-text cursor-pointer group">
                Hire<span className="group-hover:text-primary-light">Loop</span>
            </Link>
            </div>

            {isLandingPage && <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-text-muted">
                {
                    NAV_TABS.map((tab, index) => {
                        return <Link key={index} href={`#${tab.link}`} className="hover:text-text transition-colors duration-200">{tab.lable}</Link>
                    })
                }
            </nav>}

            <div className="flex items-center space-x-4">
            <Link href={"/auth"} className="text-sm font-semibold text-text-muted hover:text-text transition-colors cursor-pointer">
                Sign In
            </Link>
            <Link href={"/auth"} className="px-4 py-2 text-sm font-semibold rounded-xl text-text bg-primary hover:bg-primary-light/90 shadow-md hover:shadow-lg shadow-primary-shadow hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                Get Started
            </Link>
            </div>
        </div>
    </header>
  )
}

export default Navbar

