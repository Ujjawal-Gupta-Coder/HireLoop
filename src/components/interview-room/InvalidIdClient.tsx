"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const InvalidIdClient = () => {
    const router = useRouter();

    useEffect(() => {
        toast.error("Interview ID is invalid")
        router.push("/dashboard")
    }, [router]);

  return null
}

export default InvalidIdClient
