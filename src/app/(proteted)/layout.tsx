import { auth } from "@/src/auth";
import BottomLineFooter from "@/src/components/BottomLineFooter";
import ProtectedWrapperClient from "@/src/components/ProtectedWrapperClient";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";

const layout = async ({children}:{children: React.ReactNode}) => {
    const session = await auth();

    if(!session?.user) {
        redirect("/auth");
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
        <ProtectedWrapperClient session={session} credits={credits} >
            {children}
        </ProtectedWrapperClient>

        <BottomLineFooter />
    </>
  )
}

export default layout
