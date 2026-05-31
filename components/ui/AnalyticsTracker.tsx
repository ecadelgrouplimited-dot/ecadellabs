"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Fire-and-forget — no await, no error surfacing to user
    fetch("/api/analytics/track", {
      method:  "POST",
      headers: { "Content-Type":"application/json" },
      body:    JSON.stringify({
        path:     pathname,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
