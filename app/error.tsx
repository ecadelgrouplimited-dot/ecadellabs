"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log to console in dev; could pipe to monitoring service
    console.error("[ECADEL LABS Error]", error);
  }, [error]);

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem 1.5rem" }}>
      <div style={{ textAlign:"center", maxWidth:"28rem" }}>
        <p style={{ fontSize:"9px", letterSpacing:"0.4em", textTransform:"uppercase", color:"rgba(212,162,76,0.7)", fontFamily:"monospace", marginBottom:"1rem" }}>
          500 — Server Error
        </p>
        <h1 style={{ fontSize:"1.75rem", fontWeight:700, color:"#F0EDE6", fontFamily:"var(--font-display)", lineHeight:1.2, marginBottom:"1rem" }}>
          Something went wrong.
        </h1>
        <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.9375rem", lineHeight:1.7, marginBottom:"2.5rem" }}>
          An unexpected error occurred. The team has been notified. Try again or return home.
        </p>
        {error.digest && (
          <p style={{ fontSize:"9px", color:"rgba(200,196,190,0.25)", fontFamily:"monospace", marginBottom:"2rem" }}>
            Error ID: {error.digest}
          </p>
        )}
        <div style={{ display:"flex", justifyContent:"center", gap:"0.875rem", flexWrap:"wrap" }}>
          <button onClick={reset} style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.8rem 1.75rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", border:"none", cursor:"pointer", borderRadius:"3px" }}>
            Try Again
          </button>
          <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.8rem 1.75rem", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,196,190,0.7)", fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
