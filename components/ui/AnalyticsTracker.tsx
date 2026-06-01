"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Debounce: only track a page if the user stays for 2+ seconds
// Prevents tracking rapid navigations and bots scanning pages
const DEBOUNCE_MS = 2000;

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const timer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any pending tracker from previous navigation
    if (timer.current) clearTimeout(timer.current);

    // Skip admin routes entirely
    if (pathname.startsWith("/admin")) return;

    // Wait 2s before counting — filters out bounces and bot scans
    timer.current = setTimeout(() => {
      fetch("/api/analytics/track", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ path: pathname, referrer: document.referrer || null }),
        // keepalive allows the request to outlive the page unload
        keepalive: true,
      }).catch(() => {});
    }, DEBOUNCE_MS);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [pathname]);

  return null;
}
