"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

const VapiTest = () => {
  // 🔦 This is a test page to test the integration and working of Vapi ai model, we will modify it later as per our use case.
  const vapiRef = useRef<Vapi | null>(null);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {

    const vapi = new Vapi(
      process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!
    );

    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setIsCalling(true);
    });

    vapi.on("call-end", () => {
      setIsCalling(false);
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
    });

    return () => {
      vapi.stop();
      vapiRef.current = null;
    };
  }, []);

  const startInterview = () => {
    vapiRef.current?.start(
      process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!
    );
  };

  const stopInterview = () => {
    vapiRef.current?.stop();
  };

  return (
    <div>
      {!isCalling ? (
        <button onClick={startInterview}>
          Start Test Interview
        </button>
      ) : (
        <button onClick={stopInterview}>
          End Interview
        </button>
      )}
    </div>
  );
}

export default VapiTest