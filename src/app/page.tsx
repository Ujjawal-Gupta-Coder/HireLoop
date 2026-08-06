import Navbar from "../components/Navbar";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import LandingPage from "../components/LandingPage";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";

export default async function Page() {
  let session: any = null;
  let testimonial: any[] = [];
  let faq: any[] = [];
  let plans: any[] = [];
  try {
    [session, testimonial, faq, plans] = await Promise.all([
      auth(),
      prisma.testimonial.findMany({
        select: {
          quote : true,
          name : true,
          role : true,
          avatar : true,
          color : true, 
        },
        orderBy: {
          order: "asc"
        }
      }), 
      prisma.fAQ.findMany({
        select: {
          question : true,
          answer : true,
        },
        orderBy: {
          order: "asc"
        }
      }),
      prisma.plan.findMany({
        select: {
            id:true,
            name:true,
            credits:true,
            amount:true,
            currencySymbol:true,
            description:true, 
            features:true, 
            isMostPopular:true, 
            buttonText:true, 
        },
        orderBy: {
            amount: "asc"
        }
      })
    ])
  } catch(error) {
      console.error("Database crashed: ", error);
  }
  
  let credits:number = 0;
  if(session?.user?.email) {
    try {
      const userData = await prisma.user.findUnique({
        where: {
          email: session.user.email
        },
        select: {
          credits: true
        }
      })
      credits = userData?.credits || 0;
    } catch(error) {
      console.error("Error in getting user credits: ", error);
    }
      
  }

  return (
    <>
      {/* Background glow graphics */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-emerald-50/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[1000px] left-10 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg-overlay pointer-events-none -z-20 opacity-60" />

      {/* NAVBAR */}
      <Navbar session={session} credits={credits} isLandingPage={true}/>  

      {/* Landing page component group  */}
      <LandingPage />

      {/* TESTIMONIALS SECTION */}
      <Testimonials testimonialData={testimonial}/>

      {/* PRICING PLANS SECTION */}
      <Pricing session={session} plans={plans}/>

      {/* FAQ SECTION */}
      <FAQ faqData={faq}/>

      {/* FOOTER CALL TO ACTION */}
      <CTA />

      {/* FOOTER */}
      <Footer />
    </>
  );
}
