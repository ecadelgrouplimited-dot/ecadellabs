"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, Users } from "lucide-react";

const INPUT: React.CSSProperties = { width:"100%", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#F0EDE6", padding:"0.75rem 0.875rem", fontSize:"0.9375rem", outline:"none", fontFamily:"inherit", borderRadius:"3px", transition:"border-color 0.2s", boxSizing:"border-box" as const };
const focus = (e: React.FocusEvent<HTMLElement>) => (e.target as HTMLElement).style.borderColor = "rgba(200,169,110,0.55)";
const blur  = (e: React.FocusEvent<HTMLElement>) => (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
const LABEL: React.CSSProperties = { display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.48)", fontFamily:"monospace", marginBottom:"0.5rem" };

const ROLES = [
  { value:"research-fellow", label:"Research Fellow",  desc:"Full engagement with the ECADEL LABS research agenda. Primary researcher on an active problem." },
  { value:"resident",        label:"Resident",         desc:"Short-term (3–6 month) embedded engagement. Bring specific expertise to a defined problem." },
  { value:"collaborator",    label:"Collaborator",     desc:"External contributor. Contribute data, methodology, domain expertise, or field access." },
  { value:"advisor",         label:"Advisor",          desc:"Senior guidance role. Provide strategic direction on research agenda or specific projects." },
];

function FellowApplyForm() {
  const [role, setRole]   = useState("research-fellow");
  const [state, setState] = useState<"idle"|"loading"|"done"|"error">("idle");
  const [form, setForm]   = useState({
    name:"", email:"", organisation:"",
    background:"", researchInterest:"", contribution:"",
    availability:"", linkedinUrl:"", portfolio:"",
  });
  const set = (k:string, v:string) => setForm(f=>({...f,[k]:v}));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const selectedRole = ROLES.find(r=>r.value===role)!;
    const message = [
      `Fellowship Role Sought: ${selectedRole.label}`,
      `Research Interest / Focus Area: ${form.researchInterest}`,
      `Professional Background: ${form.background}`,
      `What I Would Contribute: ${form.contribution}`,
      form.availability && `Availability: ${form.availability}`,
      form.linkedinUrl  && `LinkedIn: ${form.linkedinUrl}`,
      form.portfolio    && `Portfolio / Publications: ${form.portfolio}`,
    ].filter(Boolean).join("\n\n");

    try {
      const res = await fetch("/api/contact", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name:form.name, email:form.email, organisation:form.organisation, type:"fellowship", message }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch { setState("error"); }
  }

  if (state === "done") {
    return (
      <div style={{ textAlign:"center", padding:"5rem 1.5rem", maxWidth:"36rem", margin:"0 auto" }}>
        <div style={{ width:"64px", height:"64px", borderRadius:"50%", backgroundColor:"rgba(74,180,120,0.12)", border:"1px solid rgba(74,180,120,0.25)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem" }}>
          <CheckCircle2 size={28} color="#4ab478" />
        </div>
        <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.5rem", marginBottom:"1rem" }}>Application Received</h2>
        <p style={{ color:"rgba(200,196,190,0.6)", fontSize:"0.9375rem", lineHeight:1.75, marginBottom:"0.75rem" }}>
          Thank you. ECADEL LABS reviews every fellowship application personally. You will hear back within 5 business days.
        </p>
        <p style={{ color:"rgba(200,196,190,0.38)", fontSize:"0.8125rem", marginBottom:"2rem" }}>Confirmation sent to {form.email}</p>
        <Link href="/fellows" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.75rem 1.75rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
          <Users size={14} /> Meet the Current Fellows
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:"1.5rem", maxWidth:"44rem", margin:"0 auto" }}>

      {/* Role selector */}
      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", padding:"1.5rem" }}>
        <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1.25rem" }}>Fellowship Type</p>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
          {ROLES.map((r) => {
            const active = role === r.value;
            return (
              <button key={r.value} type="button" onClick={()=>setRole(r.value)} style={{ textAlign:"left", padding:"1rem 1.25rem", borderRadius:"3px", cursor:"pointer", border:`1px solid ${active?"#C8A96E":"rgba(255,255,255,0.08)"}`, backgroundColor:active?"rgba(200,169,110,0.07)":"rgba(255,255,255,0.02)", transition:"all 0.15s" }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:"0.75rem", marginBottom:"0.375rem" }}>
                  <span style={{ fontSize:"0.9375rem", fontWeight:600, color:active?"#C8A96E":"rgba(200,196,190,0.72)", fontFamily:"var(--font-display)" }}>{r.label}</span>
                </div>
                <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)", lineHeight:1.5, margin:0 }}>{r.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact details */}
      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", padding:"1.5rem" }}>
        <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,196,190,0.38)", fontFamily:"monospace", marginBottom:"1.25rem" }}>Your Details</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
          <div>
            <label style={LABEL}>Full Name *</label>
            <input required value={form.name} onChange={e=>set("name",e.target.value)} style={INPUT} placeholder="Dr. Sarah Nakato" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={LABEL}>Email *</label>
            <input required type="email" value={form.email} onChange={e=>set("email",e.target.value)} style={INPUT} placeholder="sarah@university.edu" onFocus={focus} onBlur={blur} />
          </div>
        </div>
        <div style={{ marginBottom:"1rem" }}>
          <label style={LABEL}>Institution / Affiliation</label>
          <input value={form.organisation} onChange={e=>set("organisation",e.target.value)} style={INPUT} placeholder="Makerere University, Independent Researcher…" onFocus={focus} onBlur={blur} />
        </div>
      </div>

      {/* Application content */}
      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderLeft:"3px solid #C8A96E", borderRadius:"4px", padding:"1.5rem" }}>
        <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1.25rem" }}>Your Application</p>
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <div>
            <label style={LABEL}>Research Interest / Proposed Focus Area *</label>
            <textarea required rows={3} value={form.researchInterest} onChange={e=>set("researchInterest",e.target.value)} style={{ ...INPUT, resize:"none" }} placeholder="What research problem do you want to work on at ECADEL LABS? Which of our 12 domains aligns with your work?" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={LABEL}>Professional Background *</label>
            <textarea required rows={4} value={form.background} onChange={e=>set("background",e.target.value)} style={{ ...INPUT, resize:"none" }} placeholder="Your education, research history, prior publications, technical skills, and relevant work experience…" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={LABEL}>What You Would Contribute *</label>
            <textarea required rows={4} value={form.contribution} onChange={e=>set("contribution",e.target.value)} style={{ ...INPUT, resize:"none" }} placeholder="Specifically: what skills, data, methodologies, networks, or expertise would you bring to ECADEL LABS research?" onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
            <div>
              <label style={LABEL}>Availability</label>
              <input value={form.availability} onChange={e=>set("availability",e.target.value)} style={INPUT} placeholder="Full-time from Q3 2026, 3 months…" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={LABEL}>LinkedIn / ORCID</label>
              <input value={form.linkedinUrl} onChange={e=>set("linkedinUrl",e.target.value)} style={INPUT} placeholder="https://linkedin.com/in/…" onFocus={focus} onBlur={blur} />
            </div>
          </div>
          <div>
            <label style={LABEL}>Portfolio / Publications / Work Samples</label>
            <textarea rows={2} value={form.portfolio} onChange={e=>set("portfolio",e.target.value)} style={{ ...INPUT, resize:"none" }} placeholder="Links to publications, GitHub, papers, datasets, or any relevant prior work…" onFocus={focus} onBlur={blur} />
          </div>
        </div>
      </div>

      {state === "error" && (
        <div style={{ padding:"0.75rem 1rem", backgroundColor:"rgba(224,85,85,0.06)", border:"1px solid rgba(224,85,85,0.2)", color:"#e05555", fontSize:"0.875rem", borderRadius:"3px" }}>
          Something went wrong. Email your application directly to ecadel@ecadelgroup.com
        </div>
      )}

      <button type="submit" disabled={state==="loading"} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", padding:"1rem", backgroundColor:state==="loading"?"rgba(200,169,110,0.6)":"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:700, fontSize:"0.9375rem", border:"none", cursor:"pointer", borderRadius:"3px" }}>
        <Send size={16} /> {state==="loading" ? "Submitting…" : "Submit Fellowship Application"}
      </button>
      <p style={{ fontSize:"10px", color:"rgba(200,196,190,0.28)", textAlign:"center", lineHeight:1.7 }}>
        Every application is reviewed personally by ECADEL LABS · Response within 5 business days · All applications are confidential
      </p>
    </form>
  );
}

export default function FellowApplyPage() {
  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <Link href="/fellows" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none", marginBottom:"2rem" }}>
            <ArrowLeft size={14} /> Fellows & Researchers
          </Link>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>Join ECADEL LABS</p>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"clamp(1.8rem,2.5vw,2.5rem)", lineHeight:1.1, marginBottom:"1.125rem" }}>
            Apply for a Fellowship.
          </h1>
          <p style={{ color:"rgba(200,196,190,0.62)", maxWidth:"42rem", lineHeight:1.75, fontSize:"0.9375rem" }}>
            ECADEL LABS is looking for researchers, engineers, and systems thinkers who are deeply serious about African technology infrastructure. If that is you, apply below.
          </p>
        </div>
      </div>
      <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"3rem 1.5rem 6rem" }}>
        <Suspense fallback={null}>
          <FellowApplyForm />
        </Suspense>
      </div>
    </div>
  );
}
