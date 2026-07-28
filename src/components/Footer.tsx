import Image from "next/image"
import Link from "next/link"
import Poster from "../../public/hireloop_poster.png"

const Footer = () => {
  const FOOTER_LINKS = [
    {
      groupHeader: "Platform",
      data: [
        {
          label: "Features",
          link: "/#features"
        },
        {
          label: "Interview Tracks",
          link: "/#tracks"
        },
        {
          label: "Methodology",
          link: "/#methodology"
        },
        {
          label: "Pricing",
          link: "/#pricing"
        },
      ]
    },
    {
      groupHeader: "Resources",
      data: [
        {
          label: "Success Stories",
          link: "/#testimonials"
        },
        {
          label: "FAQ",
          link: "/#faq"
        },
      ]
    },
    {
      groupHeader: "Connect",
      data: [
        {
          label: "Twitter",
          link: "https://x.com/Ujjawal_Codes"
        },
        {
          label: "GitHub",
          link: "https://github.com/Ujjawal-Gupta-Coder"
        },
        {
          label: "LinkedIn",
          link: "https://www.linkedin.com/in/ujjawal-gupta-dev/"
        }
      ]
    }
  ]
  
  const PORTFOLIO_LINK = "https://ujjawalgupta.vercel.app/"

  return (
    <footer className="relative border-white/5 bg-dark/60 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden backdrop-blur-md">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-72 h-72 bg-primary-light/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex flex-col items-center gap-12">
       
        {/* Main footer Section */}
        <div className="w-full flex flex-col md:flex-row items-center gap-y-8 gap-x-4 justify-between pt-8 border-t border-white/5">
          
          {/* Poster  */}
          <div className="w-full md:w-[50%] lg:w-[55%] xl:w-[60%] flex justify-center">
            <div className="relative group overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-2 backdrop-blur-xl shadow-2xl shadow-primary-dark/20 transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10 max-w-4xl w-full">
              <div className="relative overflow-hidden rounded-xl w-full aspect-4/1">
                <Image 
                  src={Poster} 
                  alt="HireLoop - Practice. Improve. Get Hired." 
                  fill
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-dark/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

           </div>
        
          {/* Useful links  */}
          <div className="flex flax-wrap md:flex-nowrap items-start justify-between gap-x-10 sm:gap-x-16 md:gap-x-12 gap-y-4">
            {
              FOOTER_LINKS.map((link, index) => {
                  return (
                    <div key={index} className="flex flex-col space-y-3">
                      <h4 className="text-sm font-semibold text-text uppercase tracking-wider">{link.groupHeader}</h4>
                      <div className="flex flex-col space-y-2 text-xs sm:text-sm text-text-muted">
                        {
                          link.data.map((data, index) => {
                              return <Link key={index} href={data.link} className="hover:text-primary-light transition-colors duration-200">{data.label}</Link>
                          })
                        }
                      </div>
                    </div>
                  )
              })
            }

          </div>

        </div>

        {/* Copyright Section */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-white/5 text-xs text-text-muted">
          <p className="text-center sm:text-left leading-relaxed">
            © {new Date().getFullYear()} HireLoop. ⚙️ All rights reserved. ✨Designed & Developed with 💖 by <Link href={PORTFOLIO_LINK}>Ujjawal Gupta</Link>
          </p> 
        </div>

      </div>
    </footer>
  )
}

export default Footer

