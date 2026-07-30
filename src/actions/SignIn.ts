"use server"

import { signIn } from "../auth";

const signInWithGoogle = async () => {
        await signIn("google", { redirectTo: "/dashboard" });
}

export default signInWithGoogle;