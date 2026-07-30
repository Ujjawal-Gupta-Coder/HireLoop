 "use server"

import { signIn } from "../auth";

const SignInWithGoogle = async () => {
        await signIn("google");
}

export default SignInWithGoogle;