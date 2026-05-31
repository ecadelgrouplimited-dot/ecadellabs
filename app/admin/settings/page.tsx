"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2 } from "lucide-react";

interface Publication { id:string; title:string; published:boolean; featured:boolean }
interface Project     { id:string; title:string; published:boolean; featured:boolean }

const INPUT: React.CSSProperties = {
  width:"100%", backgroundColor:"rgba(255,255,255,0.04)",
  border:"1px solid rgba(255,255,255,0.1)", color:"#F0EDE6",
  padding:"0.625rem 0.875rem", fontSize:"0.875rem",
  outline:"none", fontFamily:"inherit", borderRadius:"3px",
  transition:"border-color 0.2s",
};

function SectionHeader({ title, sub }: { title:string; sub?:string }) {
  return (
    <div style={{ paddingBottom:"0.875rem", marginBottom:"1.25rem", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"baseline", gap:"0.75rem" }}>
      <h2 style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"#F0EDE6", fontSize:"0.9375rem" }}>{title}</h2>
      {sub && <span style={{ fontSize:"0.75rem", color:"rgba(200,196,190,0.38)" }}>{sub}</span>}
    </div>
  );
}

function Label({ children }: { children:React.ReactNode }) {
  return (
    <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>
      {children}
    </label>
  );
}

export default function SettingsAdmin() {
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const [pubs,   setPubs]     = useState<Publication[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    labsTitle:"ECADEL LABS", labsTagline:"Research & Innovation Engine",
    labsDescription:"The research and innovation engine of ECADEL GROUP LIMITED — advancing African intelligence infrastructure through original research, academic partnerships, and applied technology.",
    contactEmail:"ecadel@ecadelgroup.com",
    researchDomains:"6", activeProjects:"3", grantBodies:"5",
    featuredPubId:"", featuredProjectId:"",
  });

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => {
      if (d && Object.keys(d).length > 0) setForm((f) => ({ ...f, ...d }));
    }).catch(() => {});

    Promise.all([
      fetch("/api/publications?admin=true").then((r) => r.json()),
      fetch("/api/research?admin=true").then((r) => r.json()),
    ]).then(([pd, rd]) => {
      setPubs(Array.isArray(pd) ? pd : []);
      setProjects(Array.isArray(rd) ? rd : []);
    }).catch(() => {});
  }, []);

  const set = (k:string, v:string) => setForm((f) => ({ ...f, [k]:v }));

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/settings",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });

      if (form.featuredPubId) {
        await Promise.all(pubs.map((p) =>
          fetch(`/api/publications/${p.id}`,{ method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ featured: p.id === form.featuredPubId }) })
        ));
      }
      if (form.featuredProjectId) {
        await Promise.all(projects.map((p) =>
          fetch(`/api/research/${p.id}`,{ method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ featured: p.id === form.featuredProjectId }) })
        ));
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  const focusBorder = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => (e.target.style.borderColor = "rgba(200,169,110,0.5)");
  const blurBorder  = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  const currentFeaturedPub     = pubs.find((p) => p.featured)?.id     ?? "";
  const currentFeaturedProject = projects.find((p) => p.featured)?.id ?? "";

  return (
    <div style={{ padding:"2rem 2.5rem", maxWidth:"680px" }}>

      {/* Header */}
      <div style={{ marginBottom:"2.5rem" }}>
        <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.25rem" }}>Settings</h1>
        <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)" }}>Site-wide configuration for ecadellabs.cloud</p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"2.5rem" }}>

        {/* Branding */}
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", padding:"1.5rem", borderRadius:"4px" }}>
          <SectionHeader title="Branding" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
            <div>
              <Label>Site Title</Label>
              <input value={form.labsTitle} onChange={(e) => set("labsTitle",e.target.value)} style={INPUT} onFocus={focusBorder} onBlur={blurBorder} />
            </div>
            <div>
              <Label>Tagline</Label>
              <input value={form.labsTagline} onChange={(e) => set("labsTagline",e.target.value)} style={INPUT} onFocus={focusBorder} onBlur={blurBorder} />
            </div>
          </div>
          <div>
            <Label>Site Description (Meta)</Label>
            <textarea value={form.labsDescription} onChange={(e) => set("labsDescription",e.target.value)} rows={3} style={{ ...INPUT, resize:"none" }} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
        </div>

        {/* Featured Content */}
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", padding:"1.5rem", borderRadius:"4px" }}>
          <SectionHeader title="Featured Content" sub="Controls which items appear on the homepage hero" />
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.5rem" }}>
                <Label>Featured Publication</Label>
                {currentFeaturedPub && <span style={{ fontSize:"9px", color:"#4ab478", fontFamily:"monospace" }}>· currently set</span>}
              </div>
              <select value={form.featuredPubId || currentFeaturedPub} onChange={(e) => set("featuredPubId",e.target.value)} style={{ ...INPUT, cursor:"pointer" }} onFocus={focusBorder} onBlur={blurBorder}>
                <option value="">— Keep current —</option>
                {pubs.filter((p) => p.published).map((p) => (
                  <option key={p.id} value={p.id}>{p.title}{p.featured ? " ★" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.5rem" }}>
                <Label>Featured Research Project</Label>
                {currentFeaturedProject && <span style={{ fontSize:"9px", color:"#4ab478", fontFamily:"monospace" }}>· currently set</span>}
              </div>
              <select value={form.featuredProjectId || currentFeaturedProject} onChange={(e) => set("featuredProjectId",e.target.value)} style={{ ...INPUT, cursor:"pointer" }} onFocus={focusBorder} onBlur={blurBorder}>
                <option value="">— Keep current —</option>
                {projects.filter((p) => p.published).map((p) => (
                  <option key={p.id} value={p.id}>{p.title}{p.featured ? " ★" : ""}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", padding:"1.5rem", borderRadius:"4px" }}>
          <SectionHeader title="Contact" />
          <div>
            <Label>Contact Email</Label>
            <input value={form.contactEmail} onChange={(e) => set("contactEmail",e.target.value)} style={INPUT} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
        </div>

        {/* Homepage Stats */}
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", padding:"1.5rem", borderRadius:"4px" }}>
          <SectionHeader title="Homepage Stats" sub="Numbers shown in the hero stats grid" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem" }}>
            {[
              { key:"researchDomains", label:"Research Domains" },
              { key:"activeProjects",  label:"Active Projects" },
              { key:"grantBodies",     label:"Grant Bodies" },
            ].map((s) => (
              <div key={s.key}>
                <Label>{s.label}</Label>
                <input value={form[s.key as keyof typeof form]} onChange={(e) => set(s.key,e.target.value)} style={INPUT} onFocus={focusBorder} onBlur={blurBorder} />
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display:"inline-flex", alignItems:"center", gap:"0.5rem",
              padding:"0.75rem 1.5rem",
              backgroundColor: saved ? "#4ab478" : "#C8A96E",
              color:"#060608",
              fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.875rem",
              border:"none", cursor:saving ? "not-allowed" : "pointer",
              borderRadius:"3px", opacity:saving ? 0.7 : 1,
              transition:"all 0.2s",
            }}
          >
            {saved ? <><CheckCircle2 size={15} /> Saved</> :
             saving ? "Saving…" :
             <><Save size={15} /> Save Settings</>}
          </button>
          <span style={{ display:"block", marginTop:"0.625rem", fontSize:"10px", color:"rgba(200,196,190,0.28)" }}>
            Changes apply immediately after saving.
          </span>
        </div>
      </div>
    </div>
  );
}
