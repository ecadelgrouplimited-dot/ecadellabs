"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Send, FileText, Users, Building2, FlaskConical } from "lucide-react";
import type { Metadata } from "next";

const INQUIRY_TYPES = [
  { value:"research",    icon:FlaskConical, label:"Research Collaboration",    desc:"Propose a joint research project or contribute to an active agenda item." },
  { value:"fellowship",  icon:Users,        label:"Fellowship Application",    desc:"Apply to join ECADEL LABS as a research fellow, resident, or collaborator." },
  { value:"partnership", icon:Building2,    label:"Institutional Partnership", desc:"Initiate a formal research partnership between your institution and ECADEL LABS." },
  { value:"grant",       icon:FileText,     label:"Grant Co-Application",      desc:"Propose a joint grant application to AfDB, Gates Foundation, USAID, or EU Horizon." },
];

const INPUT: React.CSSProperties = {
  width:"100%", backgroundColor:"rgba(255,255,255,0.04)",
  border:"1px solid rgba(255,255,255,0.1)", color:"#F0EDE6",
  padding:"0.75rem 0.875rem", fontSize:"0.9375rem",
  outline:"none", fontFamily:"inherit", borderRadius:"3px",
  transition:"border-color 0.2s", boxSizing:"border-box" as const,
};
const LABEL: React.CSSProperties = {
  display:"block", fontSize:"9px", letterSpacing:"0.2em",
  textTransform:"uppercase", color:"rgba(200,196,190,0.48)",
  fontFamily:"monospace", marginBottom:"0.5rem",
};

function ApplyForm() {
  const searchParams = useSearchParams();
  const defaultType  = searchParams.get("type") ?? "research";

  const [type, setType] = useState(INQUIRY_TYPES.find((t) => t.value === defaultType) ? defaultType : "research");
  const [form, setForm] = useState({ name:"", email:"", organisation:"", title:"", abstract:"", background:"", timeline:"", message:"" });
  const [state, setState] = useState<"idle"|"loading"|"done"|"error">("idle");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]:v }));
  const focus = (e: React.FocusEvent<HTMLElement>) => (e.target as HTMLElement).style.borderColor = "rgba(200,169,110,0.55)";
  const blur  = (e: React.FocusEvent<HTMLElement>) => (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";

  const typeConfig = INQUIRY_TYPES.find((t) => t.value === type)!;

  const FIELD_LABELS: Record<string, Record<string,string>> = {
    research:    { title:"Research Proposal Title *", abstract:"Research Problem & Proposed Approach *", background:"Your Research Background *", timeline:"Proposed Timeline", message:"Additional Context" },
    fellowship:  { title:"Proposed Fellowship Focus Area *", abstract:"Why ECADEL LABS? What would you contribute? *", background:"Academic / Professional Background *", timeline:"Preferred Fellowship Period", message:"Anything else we should know" },
    partnership: { title:"Partnership Proposal Title *", abstract:"Nature of the Partnership & Mutual Value *", background:"About Your Institution *", timeline:"Proposed Partnership Timeline", message:"Additional Notes" },
    grant:       { title:"Grant Programme & Proposal Title *", abstract:"Research Scope & Grant Rationale *", background:"Your Track Record with Grant Applications *", timeline:"Grant Deadline / Application Window", message:"Specific support needed from ECADEL LABS" },
  };
  const labels = FIELD_LABELS[type];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const message = [
      form.title     && `**${labels.title.replace(" *","")}:** ${form.title}`,
      form.abstract  && `**${labels.abstract.replace(" *","")}:** ${form.abstract}`,
      form.background&& `**${labels.background.replace(" *","")}:** ${form.background}`,
      form.timeline  && `**${labels.timeline}:** ${form.timeline}`,
      form.message   && `**${labels.message}:** ${form.message}`,
    ].filter(Boolean).join("\n\n");

    try {
      const res = await fetch("/api/contact", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name:form.name, email:form.email, organisation:form.organisation, type, message }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch { setState("error"); }
  }

  if (state === "done") {
    return (
      <div style={{ maxWidth:"36rem", margin:"0 auto", textAlign:"center", padding:"4rem 1.5rem" }}>
        <div style={{ width:"64px", height:"64px", borderRadius:"50%", backgroundColor:"rgba(74,180,120,0.12)", border:"1px solid rgba(74,180,120,0.25)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem" }}>
          <CheckCircle2 size={28} color="#4ab478" />
        </div>
        <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.5rem", marginBottom:"1rem" }}>
          Application Received
        </h2>
        <p style={{ color:"rgba(200,196,190,0.62)", fontSize:"0.9375rem", lineHeight:1.75, marginBottom:"0.75rem" }}>
          Thank you. ECADEL LABS reviews every application personally. You will receive a response within 5 business days.
        </p>
        <p style={{ color:"rgba(200,196,190,0.38)", fontSize:"0.8125rem" }}>
          A confirmation has been sent to {form.email}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:"2rem" }}>
      {/* Type selector */}
      <div>
        <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1rem" }}>
          Application Type
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
          {INQUIRY_TYPES.map((t) => {
            const active = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                style={{
                  padding:"1rem 1.25rem", textAlign:"left", cursor:"pointer",
                  border:`1px solid ${active ? "#C8A96E" : "rgba(255,255,255,0.08)"}`,
                  backgroundColor:active ? "rgba(200,169,110,0.07)" : "rgba(255,255,255,0.02)",
                  borderRadius:"4px", transition:"all 0.15s",
                }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.375rem" }}>
                  <t.icon size={15} color={active ? "#C8A96E" : "rgba(200,196,190,0.45)"} />
                  <span style={{ fontSize:"0.875rem", fontWeight:600, color:active ? "#C8A96E" : "rgba(200,196,190,0.72)" }}>{t.label}</span>
                </div>
                <p style={{ fontSize:"11px", color:"rgba(200,196,190,0.38)", lineHeight:1.5 }}>{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact info */}
      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", padding:"1.5rem" }}>
        <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,196,190,0.38)", fontFamily:"monospace", marginBottom:"1.25rem" }}>
          Your Details
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
          <div>
            <label style={LABEL}>Full Name *</label>
            <input required value={form.name} onChange={(e)=>set("name",e.target.value)} style={INPUT} placeholder="Dr. Jane Doe" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={LABEL}>Email Address *</label>
            <input required type="email" value={form.email} onChange={(e)=>set("email",e.target.value)} style={INPUT} placeholder="jane@university.edu" onFocus={focus} onBlur={blur} />
          </div>
        </div>
        <div>
          <label style={LABEL}>Institution / Organisation</label>
          <input value={form.organisation} onChange={(e)=>set("organisation",e.target.value)} style={INPUT} placeholder="University of Nairobi, AfDB, Independent Researcher…" onFocus={focus} onBlur={blur} />
        </div>
      </div>

      {/* Application content */}
      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderLeft:"3px solid #C8A96E", borderRadius:"4px", padding:"1.5rem" }}>
        <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1.25rem" }}>
          {typeConfig.label}
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <div>
            <label style={LABEL}>{labels.title}</label>
            <input required value={form.title} onChange={(e)=>set("title",e.target.value)} style={{ ...INPUT, fontSize:"1.0625rem", fontFamily:"var(--font-display)", fontWeight:500 }} placeholder="Title of your proposal…" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={LABEL}>{labels.abstract}</label>
            <textarea required rows={5} value={form.abstract} onChange={(e)=>set("abstract",e.target.value)} style={{ ...INPUT, resize:"vertical" }} placeholder="Describe the core idea, the problem you are addressing, and why this matters for African intelligence infrastructure…" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={LABEL}>{labels.background}</label>
            <textarea required rows={4} value={form.background} onChange={(e)=>set("background",e.target.value)} style={{ ...INPUT, resize:"vertical" }} placeholder="Your relevant experience, prior research, institutional affiliation, publications…" onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
            <div>
              <label style={LABEL}>{labels.timeline}</label>
              <input value={form.timeline} onChange={(e)=>set("timeline",e.target.value)} style={INPUT} placeholder="e.g. 6 months starting Q3 2026" onFocus={focus} onBlur={blur} />
            </div>
          </div>
          <div>
            <label style={LABEL}>{labels.message}</label>
            <textarea rows={3} value={form.message} onChange={(e)=>set("message",e.target.value)} style={{ ...INPUT, resize:"none" }} placeholder="Anything else ECADEL LABS should know about your proposal…" onFocus={focus} onBlur={blur} />
          </div>
        </div>
      </div>

      {state === "error" && (
        <div style={{ padding:"0.75rem 1rem", backgroundColor:"rgba(224,85,85,0.06)", border:"1px solid rgba(224,85,85,0.2)", color:"#e05555", fontSize:"0.875rem", borderRadius:"3px" }}>
          Something went wrong. Please email your application directly to ecadel@ecadelgroup.com
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", padding:"1rem", backgroundColor: state === "loading" ? "rgba(200,169,110,0.7)" : "#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:700, fontSize:"0.9375rem", border:"none", cursor:state==="loading"?"not-allowed":"pointer", borderRadius:"3px" }}
      >
        <Send size={16} /> {state === "loading" ? "Submitting…" : "Submit Application"}
      </button>

      <p style={{ fontSize:"10px", color:"rgba(200,196,190,0.28)", textAlign:"center", lineHeight:1.7 }}>
        ECADEL LABS reviews every application personally. Response time: 5 business days.<br />
        All applications are treated with strict confidentiality.
      </p>
    </form>
  );
}

export default function ApplyPage() {
  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
            Apply to ECADEL LABS
          </p>
          <h1 style={{ fontSize:"clamp(1.8rem,2.5vw,2.5rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, fontFamily:"var(--font-display)", marginBottom:"1.125rem" }}>
            Research Application Portal.
          </h1>
          <p style={{ color:"rgba(200,196,190,0.62)", maxWidth:"42rem", lineHeight:1.75, fontSize:"0.9375rem" }}>
            ECADEL LABS invites researchers, engineers, institutions, and grant bodies to propose collaborations. Use this portal to submit a structured application — fellowship, research collaboration, institutional partnership, or grant co-application.
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"3rem 1.5rem 6rem" }}>
        <Suspense fallback={<div style={{ color:"rgba(200,196,190,0.35)", fontSize:"0.875rem" }}>Loading…</div>}>
          <ApplyForm />
        </Suspense>
      </div>
    </div>
  );
}
