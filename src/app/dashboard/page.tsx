import signOutWithGoogle from "@/src/actions/signOut"
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";

const page = async () => {
    const session = await auth();

    if(!session?.user) {
        redirect('/auth');
    }  

  return (
    <div className="flex flex-col gap-4 font-bold text-4xl w-full text-center mt-16">
      Dashboard Page

    <div className="text-2xl font-semibold italic">Hi, <span className="text-teal-500">{session?.user?.name}</span>👋</div>
    <div className="text-2xl font-semibold italic">{session?.user?.email}</div>
      <div className="flex justify-end px-16">
        
        <form action={signOutWithGoogle} >
          <button type="submit" className="border bg-teal-500 rounded-xl text-md cursor-pointer hover:bg-pink-600 px-4 py-2">Sign Out</button>
        </form>

      </div>
    </div>
  )
}

export default page
