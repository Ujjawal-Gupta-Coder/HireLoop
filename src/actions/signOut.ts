"use server"

import { signOut } from "../auth"
 
const signOutWithGoogle = async () => {
    await signOut({ redirectTo: "/" });
}

export default signOutWithGoogle;