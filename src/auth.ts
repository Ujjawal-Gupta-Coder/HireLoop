import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { createUserIfNotExists } from "./lib/user";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],

  callbacks: {
    signIn: async ({user}) => {
      if(!user.name || !user.email) return false;

      try {
        const result = await createUserIfNotExists(user.name, user.email);
        return result ? true: false;
        
      } catch(error) {
        console.error("Error in signIn callback: ", error);
        return false;
      }
      
    }
  }
})