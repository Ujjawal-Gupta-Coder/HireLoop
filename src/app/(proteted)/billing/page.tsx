import { auth } from "@/src/auth";
import BillingPageClient from "@/src/components/BillingPageClient";
import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

type PaymentWithPlan = Prisma.PaymentGetPayload<{
  include: { plan: true }
}>

export default async function Page() {
  const session = await auth();

  if(!session?.user?.email) {
    redirect('/auth');
  }

  let userData:{credits: number, payment:PaymentWithPlan[]} | null = null;
  let errorMsg: string | undefined = undefined;
  
  try {
    userData = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
      select: {
        credits: true,
        payment: {
          include: {
            plan: true
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })
  } catch(error) {
    console.error("Error in fetching payment records: ", error);
    errorMsg = "Error in fetching payment records";
  }

  const payments = userData?.payment;

  let totalCredits = 0, totalAmountSpend = 0; 

  if(payments && payments?.length !== 0) {
      for(const payment of payments) {
        totalCredits += payment.plan.credits;
        totalAmountSpend += payment.amount;
      }
  }

  return <BillingPageClient payments={payments || null} currentCredits={userData?.credits || 0} totalCredits={totalCredits} totalAmountSpend={totalAmountSpend} totalTransactions={payments?.length || 0} error={errorMsg}/>;
}
