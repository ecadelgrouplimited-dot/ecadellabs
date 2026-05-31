"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Eye, CheckCircle2, Mail } from "lucide-react";

const INPUT: React.CSSProperties = { width:"100%", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#F0EDE6", padding:"0.75rem 0.875rem", fontSize:"0.875rem", outline:"none", fontFamily:"inherit", borderRadius:"3px", transition:"border-color 0.2s" };
const focus = (e: React.FocusEvent<HTMLElement>) => (e.target as HTMLElement).style.borderColor = "rgba(200,169,110,0.5)";
const blur  = (e: React.FocusEvent<HTMLElement>) => (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";

export default function NewsletterCompose() {
  const [subject, setSubject] = useState("");
  const [body,    setBody]    = useState("");
  const [state,   setState]   = useState<"idle"|"previewing"|"sending"|"sent"|"error">("idle");
  const [result,  setResult]  = useState<{ sent?:number; failed?:number; total?:number; html?:string } | null>(null);
  const [showHtml,setShowHtml]= useState(false);

  async function preview() {
    setState("previewing");
    const res = await fetch("/api/admin/newsletter/send", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ subject, body, preview:true }),
    });
    const d = await res.json();
    setResult(d);
    setShowHtml(true);
    setState("idle");
  }

  async function send() {
    if (!confirm(`Send to ${result?.total ?? "all"} subscribers? This cannot be undone.`)) return;
    setState("sending");
    const res = await fetch("/api/admin/newsletter/send", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ subject, body, preview:false }),
    });
    if (res.ok) {
      const d = await res.json();
      setResult(d);
      setState("sent");
    } else {
      setState("error");
    }
  }

  if (state === "sent" && result) {
    return (
      <div style={{ padding:"2rem 2.5rem", maxWidth:"640px" }}>
        <div style={{ textAlign:"center", padding:"4rem 0" }}>
          <CheckCircle2 size={40} color="#4ab478" style={{ margin:"0 auto 1.25rem" }} />
          <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.75rem" }}>Newsletter Sent</h2>
          <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.9375rem", marginBottom:"0.5rem" }}>
            <strong style={{ color:"#4ab478" }}>{result.sent}</strong> emails delivered
            {result.failed! > 0 && <>, <strong style={{ color:"#e05555" }}>{result.failed}</strong> failed</>}
            {" "}out of {result.total} subscribers.
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:"0.875rem", marginTop:"2rem" }}>
            <Link href="/admin/newsletter" style={{ padding:"0.7rem 1.5rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
              Back to Subscribers
            </Link>
            <button onClick={()=>{setState("idle");setResult(null);setSubject("");setBody("");setShowHtml(false);}} style={{ padding:"0.7rem 1.5rem", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,196,190,0.65)", fontSize:"0.8125rem", cursor:"pointer", borderRadius:"3px" }}>
              Write Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:"2rem 2.5rem", maxWidth:"760px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"2rem" }}>
        <Link href="/admin/newsletter" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"32px", height:"32px", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"3px", color:"rgba(200,196,190,0.55)", textDecoration:"none" }}>
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"2px" }}>Compose Newsletter</h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)" }}>Write and send a research update to all subscribers</p>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
        {/* Subject */}
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", padding:"1.5rem" }}>
          <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>
            Subject Line *
          </label>
          <input value={subject} onChange={(e)=>setSubject(e.target.value)} style={{ ...INPUT, fontSize:"1.0625rem", fontFamily:"var(--font-display)", fontWeight:500 }} placeholder="ECADEL LABS Research Update — June 2026" onFocus={focus} onBlur={blur} />
        </div>

        {/* Body */}
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderLeft:"3px solid #C8A96E", borderRadius:"4px", padding:"1.5rem" }}>
          <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>
            Email Body * <span style={{ color:"rgba(200,196,190,0.28)", textTransform:"none", letterSpacing:0 }}>— plain text, paragraphs separated by blank lines</span>
          </label>
          <textarea
            value={body}
            onChange={(e)=>setBody(e.target.value)}
            rows={14}
            style={{ ...INPUT, resize:"vertical" }}
            placeholder={"Dear researchers and scholars,\n\nWe are pleased to share our latest research findings from ECADEL LABS...\n\nThank you for your continued interest in African intelligence infrastructure research.\n\nThe ECADEL LABS Research Team"}
            onFocus={focus}
            onBlur={blur}
          />
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"0.5rem" }}>
            <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.28)", fontFamily:"monospace" }}>
              {body.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>

        {/* HTML Preview */}
        {showHtml && result?.html && (
          <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", overflow:"hidden" }}>
            <div style={{ padding:"0.75rem 1.25rem", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <Eye size={13} color="rgba(200,169,110,0.6)" />
                <span style={{ fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,169,110,0.6)", fontFamily:"monospace" }}>
                  Email Preview · {result.total} recipients
                </span>
              </div>
              <button onClick={()=>setShowHtml(false)} style={{ fontSize:"9px", color:"rgba(200,196,190,0.38)", background:"none", border:"none", cursor:"pointer" }}>hide</button>
            </div>
            <div style={{ height:"420px", overflow:"auto", backgroundColor:"#fff" }}>
              <iframe srcDoc={result.html} style={{ width:"100%", height:"100%", border:"none" }} title="Email preview" />
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.875rem", padding:"1.25rem 1.5rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px" }}>
          <button
            onClick={preview}
            disabled={!subject||!body||state==="previewing"}
            style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.7rem 1.375rem", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,196,190,0.72)", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", cursor:(!subject||!body)?"not-allowed":"pointer", borderRadius:"3px", opacity:(!subject||!body)?0.45:1 }}
          >
            <Eye size={14} /> Preview Email
          </button>
          <button
            onClick={send}
            disabled={!subject||!body||state==="sending"||!showHtml}
            style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.7rem 1.375rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", border:"none", cursor:(!subject||!body||!showHtml)?"not-allowed":"pointer", borderRadius:"3px", opacity:(!subject||!body||!showHtml)?0.45:1 }}
          >
            <Send size={14} /> {state==="sending" ? "Sending…" : `Send to Subscribers`}
          </button>
          {!showHtml && subject && body && (
            <span style={{ fontSize:"0.75rem", color:"rgba(200,196,190,0.38)", fontStyle:"italic" }}>Preview first, then send</span>
          )}
          {state === "error" && <span style={{ fontSize:"0.8125rem", color:"#e05555" }}>Send failed. Check SMTP settings.</span>}
        </div>
      </div>
    </div>
  );
}
