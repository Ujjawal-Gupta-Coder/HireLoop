import { auth } from "@/src/auth";
import BillingPageClient from "@/src/components/BillingPageClient";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if(!session?.user) {
    redirect('/auth');
  }

  return <BillingPageClient />;
}
