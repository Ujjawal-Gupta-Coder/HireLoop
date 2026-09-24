"use client";

import { useEffect } from "react";
import AnalyticsLoadingAnimation from "@/src/components/analytics/AnalyticsLoadingAnimation";

export default function AnalyticsLoading() {
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const scrollContainers = document.querySelectorAll(
      ".overflow-y-auto, [data-scroll-container]"
    );
    scrollContainers.forEach((el) => {
      el.scrollTop = 0;
    });
  }, []);

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto space-y-8 relative pb-20">
      <AnalyticsLoadingAnimation />
    </main>
  );
}
