"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";

const INPUT: React.CSSProperties = { width:"100%", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#F0EDE6", padding:"0.75rem 0.875rem", fontSize:"0.9375rem", outline:"none", fontFamily:"inherit", borderRadius:"3px", transition:"border-color 0.2s", boxSizing:"border-box" as const };
const focus = (e: React.FocusEvent<HTMLElement>) => (e.target as HTMLElement).style.borderColor = "rgba(200,169,110,0.55)";
const blur  = (e: React.FocusEvent<HTMLElement>) => (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
const LABEL: React.CSSProperties = { display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.48)", fontFamily:"monospace", marginBottom:"0.5rem" };

interface Project { title:string; problem:string; status:string; slug:string }

function CollaborateForm({ slug }: { slug:string }) {
  const searchParams = useSearchParams();
  const [project, setProject] = useState<Project|null>(null);
  const [state,   setState]   = useState<"idle"|"loading"|"done"|"error">("idle");
  const [form, setForm] = useState({
    name:"", email:"", organisation:"",
    role:"", contribution:"", timeline:"", message:"",
  });
  const set = (k:string,v:string) => setForm(f=>({...f,[k]:v}));

  useEffect(() => {
    fetch(`/api/research/${slug}`).then(r=>r.json()).then((d:Project)=>setProject(d)).catch(()=>{});
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const message = [
      `Research Project: ${project?.title ?? slug}`,
      `Role/Capacity: ${form.role}`,
      `Proposed Contribution: ${form.contribution}`,
      form.timeline && `Timeline: ${form.timeline}`,
      form.message  && `Additional context: ${form.message}`,
    ].filter(Boolean).join("\n\n");

    try {
      const res = await fetch("/api/contact", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name:form.name, email:form.email, organisation:form.organisation, type:"research", message }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch { setState("error"); }
  }

  if (state === "done") {
    return (
      <div style={{ textAlign:"center", padding:"5rem 1.5rem" }}>
        <div style={{ width:"64px", height:"64px", borderRadius:"50%", backgroundColor:"rgba(74,180,120,0.12)", border:"1px solid rgba(74,180,120,0.25)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem" }}>
          <CheckCircle2 size={28} color="#4ab478" />
        </div>
        <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.5rem", marginBottom:"1rem" }}>Collaboration Proposal Received</h2>
        <p style={{ color:"rgba(200,196,190,0.6)", fontSize:"0.9375rem", lineHeight:1.75, maxWidth:"30rem", margin:"0 auto 2rem" }}>
          Thank you. ECADEL LABS reviews every collaboration proposal personally. We will respond within 5 business days.
        </p>
        <Link href={`/research/${slug}`} style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.75rem 1.75rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
          Back to Research Project
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:"44rem", margin:"0 auto" }}>
      {/* Back */}
      <Link href={`/research/${slug}`} style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none", marginBottom:"2.5rem" }}>
        <ArrowLeft size={14} /> Back to project
      </Link>

      {/* Project context */}
      {project && (
        <div style={{ padding:"1.25rem 1.5rem", backgroundColor:"#0A0C12", borderLeft:"3px solid #C8A96E", marginBottom:"2.5rem", borderRadius:"2px" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.625rem" }}>
            Proposing collaboration on
          </p>
          <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.125rem", lineHeight:1.25 }}>
            {project.title}
          </h2>
        </div>
      )}

      <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
        {/* Contact */}
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", padding:"1.5rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginBottom:"1.25rem" }}>Your Details</p>
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
          <div>
            <label style={LABEL}>Institution / Organisation</label>
            <input value={form.organisation} onChange={e=>set("organisation",e.target.value)} style={INPUT} placeholder="University of Nairobi, Independent Researcher…" onFocus={focus} onBlur={blur} />
          </div>
        </div>

        {/* Proposal */}
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderLeft:"3px solid #C8A96E", borderRadius:"4px", padding:"1.5rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1.25rem" }}>Collaboration Proposal</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"1.125rem" }}>
            <div>
              <label style={LABEL}>Your Role / Capacity *</label>
              <input required value={form.role} onChange={e=>set("role",e.target.value)} style={INPUT} placeholder="PhD Researcher, Data Engineer, Field Research Partner…" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={LABEL}>Proposed Contribution *</label>
              <textarea required rows={5} value={form.contribution} onChange={e=>set("contribution",e.target.value)} style={{ ...INPUT, resize:"vertical" }} placeholder="Describe specifically what you would contribute: data collection, analysis methodology, domain expertise, funding, field access…" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={LABEL}>Proposed Timeline</label>
              <input value={form.timeline} onChange={e=>set("timeline",e.target.value)} style={INPUT} placeholder="e.g. 3-month engagement, starting Q3 2026" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={LABEL}>Additional Context</label>
              <textarea rows={3} value={form.message} onChange={e=>set("message",e.target.value)} style={{ ...INPUT, resize:"none" }} placeholder="Prior publications, relevant datasets, funding sources, or anything else ECADEL LABS should know…" onFocus={focus} onBlur={blur} />
            </div>
          </div>
        </div>

        {state === "error" && (
          <div style={{ padding:"0.75rem 1rem", backgroundColor:"rgba(224,85,85,0.06)", border:"1px solid rgba(224,85,85,0.2)", color:"#e05555", fontSize:"0.875rem", borderRadius:"3px" }}>
            Something went wrong. Email us at ecadel@ecadelgroup.com
          </div>
        )}

        <button type="submit" disabled={state==="loading"} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", padding:"1rem", backgroundColor:state==="loading"?"rgba(200,169,110,0.6)":"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:700, fontSize:"0.9375rem", border:"none", cursor:state==="loading"?"not-allowed":"pointer", borderRadius:"3px" }}>
          <Send size={16} /> {state==="loading" ? "Submitting…" : "Submit Collaboration Proposal"}
        </button>

        <p style={{ fontSize:"10px", color:"rgba(200,196,190,0.28)", textAlign:"center", lineHeight:1.7 }}>
          ECADEL LABS reviews every proposal personally. Response within 5 business days.<br />All proposals are treated as confidential.
        </p>
      </form>
    </div>
  );
}

export default function CollaboratePage({ params }: { params: Promise<{ slug:string }> }) {
  const [slug, setSlug] = useState<string|null>(null);

  // Unwrap params in client component
  params.then((p) => setSlug(p.slug));

  if (!slug) return null;

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"44rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>Research Collaboration</p>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"clamp(1.6rem,2.2vw,2.2rem)", lineHeight:1.1, marginBottom:"1rem" }}>
            Propose a Collaboration
          </h1>
          <p style={{ color:"rgba(200,196,190,0.62)", maxWidth:"36rem", lineHeight:1.75 }}>
            ECADEL LABS welcomes collaborations from researchers, institutions, and domain experts who can contribute meaningfully to this research agenda.
          </p>
        </div>
      </div>
      <div style={{ maxWidth:"44rem", margin:"0 auto", padding:"3rem 1.5rem 6rem" }}>
        <Suspense fallback={null}>
          <CollaborateForm slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
