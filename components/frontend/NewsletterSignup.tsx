"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function NewsletterSignup() {
  const [email,   setEmail]   = useState("");
  const [state,   setState]   = useState<"idle"|"loading"|"done"|"error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          name:    email,
          email:   email.trim(),
          type:    "newsletter",
          message: "Research updates newsletter subscription",
        }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
        <CheckCircle2 size={16} color="#4ab478" />
        <span style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.7)" }}>
          Subscribed. We&apos;ll notify you when new research is published.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", maxWidth:"28rem" }}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@institution.edu"
        style={{
          flex:1, minWidth:"180px",
          backgroundColor:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.1)",
          color:"#F0EDE6", padding:"0.625rem 0.875rem",
          fontSize:"0.875rem", outline:"none", fontFamily:"inherit",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(200,169,110,0.4)")}
        onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
      />
      <button
        type="submit"
        disabled={state === "loading"}
        style={{
          display:"flex", alignItems:"center", gap:"0.375rem",
          padding:"0.625rem 1.25rem",
          backgroundColor: state === "loading" ? "rgba(200,169,110,0.6)" : "#C8A96E",
          color:"#060608",
          fontFamily:"var(--font-display)", fontWeight:600,
          fontSize:"0.8125rem", border:"none", cursor:"pointer",
        }}
      >
        {state === "loading" ? "…" : <><ArrowRight size={14} /></>}
      </button>
      {state === "error" && (
        <p style={{ width:"100%", fontSize:"0.75rem", color:"rgba(224,85,85,0.8)" }}>
          Something went wrong. Try again or email ecadel@ecadelgroup.com
        </p>
      )}
    </form>
  );
}
