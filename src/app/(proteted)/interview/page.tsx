import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import InterviewConfigClient from "./InterviewConfigClient";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth");
  }

  let credits = 0;
  try {
    const userData = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        credits: true,
      },
    });
    credits = userData?.credits ?? 0;
  } catch (error) {
    console.error("Error in fetching user credits on interview page:", error);
  }

  return <InterviewConfigClient credits={credits} />;
};

export default Page;
