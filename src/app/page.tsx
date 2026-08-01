import Navbar from "../components/Navbar";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import LandingPage from "../components/LandingPage";
import { auth } from "../auth";

export default async function Page() {
  const session = await auth();
  return (
    <>
      {/* Background glow graphics */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-emerald-50/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[1000px] left-10 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg-overlay pointer-events-none -z-20 opacity-60" />

      {/* NAVBAR */}
      <Navbar session={session} isLandingPage={true}/>

      {/* Landing page component group  */}
      <LandingPage />

      {/* TESTIMONIALS SECTION */}
      <Testimonials />

      {/* PRICING PLANS SECTION */}
      <Pricing session={session}/>

      {/* FAQ SECTION */}
      <FAQ />

      {/* FOOTER CALL TO ACTION */}
      <CTA />

      {/* FOOTER */}
      <Footer />
    </>
  );
}
