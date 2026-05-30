"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2 } from "lucide-react";

const INQUIRY_TYPES = [
  { value:"research",    label:"Research Collaboration" },
  { value:"fellowship",  label:"Fellowship Application" },
  { value:"partnership", label:"Institutional Partnership" },
  { value:"grant",       label:"Grant Co-Application" },
  { value:"general",     label:"General Inquiry" },
];

const INPUT_STYLE: React.CSSProperties = {
  width:"100%", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
  color:"#F0EDE6", padding:"0.625rem 0.875rem", fontSize:"0.875rem", outline:"none",
  fontFamily:"inherit", borderRadius:"2px",
};

function ContactForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name:"", email:"", organisation:"", type:"general", message:"" });
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    const t = searchParams.get("type");
    if (t && INQUIRY_TYPES.some((x) => x.value === t)) {
      setForm((f) => ({ ...f, type: t }));
    }
  }, [searchParams]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us at ecadel@ecadelgroup.com");
    } finally { setLoading(false); }
  }

  if (submitted) {
    return (
      <div style={{ padding:"3rem", backgroundColor:"#0A0C12", border:"1px solid rgba(200,169,110,0.15)", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:"1rem" }}>
        <CheckCircle2 size={32} color="#C8A96E" />
        <h3 style={{ fontSize:"1.25rem", fontWeight:700, color:"#F0EDE6", fontFamily:"var(--font-display)" }}>Inquiry Received</h3>
        <p style={{ color:"rgba(200,196,190,0.58)", fontSize:"0.875rem", lineHeight:1.7, maxWidth:"22rem" }}>
          Thank you. ECADEL LABS reviews every inquiry personally and will respond within 72 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
        <div>
          <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.45)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Full Name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} style={INPUT_STYLE} placeholder="Your name" />
        </div>
        <div>
          <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.45)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Organisation</label>
          <input value={form.organisation} onChange={(e) => set("organisation", e.target.value)} style={INPUT_STYLE} placeholder="University / Institution" />
        </div>
      </div>
      <div>
        <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.45)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Email Address *</label>
        <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} style={INPUT_STYLE} placeholder="your@institution.edu" />
      </div>
      <div>
        <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.45)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Inquiry Type</label>
        <select value={form.type} onChange={(e) => set("type", e.target.value)} style={{ ...INPUT_STYLE, cursor:"pointer" }}>
          {INQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.45)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Message *</label>
        <textarea required rows={6} value={form.message} onChange={(e) => set("message", e.target.value)}
          style={{ ...INPUT_STYLE, resize:"none" }}
          placeholder="Describe your research, the collaboration you are proposing, or what you would like to discuss…" />
      </div>
      {error && (
        <div style={{ fontSize:"0.8125rem", color:"#e05555", border:"1px solid rgba(224,85,85,0.2)", backgroundColor:"rgba(224,85,85,0.05)", padding:"0.75rem 1rem" }}>{error}</div>
      )}
      <button type="submit" disabled={loading} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", padding:"0.875rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.875rem", border:"none", cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
        {loading ? "Sending…" : <><Send size={14} /> Submit Inquiry</>}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>Get in Touch</p>
          <h1 style={{ fontSize:"clamp(1.8rem,2.5vw,2.5rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, fontFamily:"var(--font-display)", marginBottom:"1.125rem" }}>
            Start a Conversation.
          </h1>
          <p style={{ color:"rgba(200,196,190,0.62)", maxWidth:"42rem", lineHeight:1.75, fontSize:"0.9375rem" }}>
            ECADEL LABS is open to serious conversations about research collaboration, fellowships, and partnerships.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"3.5rem 1.5rem 5rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"4rem" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:"2rem" }}>
            {[
              { label:"Research Inquiries",     value:"ecadel@ecadelgroup.com" },
              { label:"Fellowship Applications", value:"ecadel@ecadelgroup.com" },
              { label:"Institution",             value:"ECADEL GROUP LIMITED · Kampala, Uganda" },
              { label:"Main Website",            value:"ecadelgroup.com" },
              { label:"Response Time",           value:"Within 72 hours" },
            ].map((c) => (
              <div key={c.label}>
                <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginBottom:"0.375rem" }}>{c.label}</p>
                <p style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.7)" }}>{c.value}</p>
              </div>
            ))}
          </div>
          <Suspense fallback={<div style={{ color:"rgba(200,196,190,0.3)", fontSize:"0.875rem" }}>Loading form…</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
