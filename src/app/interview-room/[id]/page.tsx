import BottomLineFooter from "@/src/components/BottomLineFooter"
import InterviewRoomClient from "./InterviewRoomClient"
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import InvalidIdClient from "./InvalidIdClient";

const page = async ({params}:{params: Promise<{id: string}>}) => {
  
  const session = await auth();
  if(!session?.user?.email) {
    redirect("/auth");
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  })
  if(!user?.id) {
    redirect("/auth");
  }

  const {id: interviewId} = await params;
  if(!interviewId.trim()) {
    redirect("/interview");
  }

  const interviewDetails = await prisma.interviewHistory.findUnique({
    where: {
      id: interviewId,
      userId: user.id
    }
  })
  if(!interviewDetails) return <InvalidIdClient />

  if(interviewDetails.status !== "RUNNING") {
    redirect(`/analytics/${interviewDetails.id}`)
  }


  return (
    <>
      <InterviewRoomClient type={interviewDetails.type} />
      <BottomLineFooter />
    </>
  )
}

export default page
