"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Star } from "lucide-react";
import { INPUT, FieldLabel, FormSection, Row, Btn, fieldFocus, fieldBlur } from "@/components/admin/FormField";

const ROLES = [
  { value:"research-fellow", label:"Research Fellow",  desc:"Core researcher" },
  { value:"resident",        label:"Resident",         desc:"Short-term engagement" },
  { value:"collaborator",    label:"Collaborator",     desc:"External contributor" },
  { value:"advisor",         label:"Advisor",          desc:"Senior guidance" },
];

export default function NewFellowPage() {
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name:"", role:"research-fellow", bio:"", expertise:"",
    institution:"", cohort:"2026", linkedinUrl:"", orcid:"", twitter:"", active:true, featured:false,
  });
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]:v }));

  const initials = form.name.split(" ").filter(Boolean).map((n)=>n[0]).join("").slice(0,2).toUpperCase();

  async function save() {
    if (!form.name || !form.bio) return;
    setSaving(true);
    try {
      await fetch("/api/fellows", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ ...form, expertise:form.expertise.split(",").map((e)=>e.trim()).filter(Boolean) }),
      });
      router.push("/admin/fellows");
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ padding:"2rem 2.5rem", maxWidth:"760px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"2rem" }}>
        <Link href="/admin/fellows" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"32px", height:"32px", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"3px", color:"rgba(200,196,190,0.55)", textDecoration:"none" }}>
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"2px" }}>Add Fellow</h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)" }}>Onboard a researcher or fellow into ECADEL LABS</p>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>

        {/* Identity */}
        <FormSection title="Identity">
          <div style={{ display:"flex", gap:"1.5rem", alignItems:"flex-start" }}>
            {/* Avatar preview */}
            <div style={{ width:"64px", height:"64px", borderRadius:"50%", backgroundColor:"rgba(200,169,110,0.1)", border:"2px solid rgba(200,169,110,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1.25rem", color:"#C8A96E", flexShrink:0 }}>
              {initials || "?"}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ marginBottom:"1rem" }}>
                <FieldLabel required>Full Name</FieldLabel>
                <input value={form.name} onChange={(e)=>set("name",e.target.value)} style={{ ...INPUT, fontSize:"1.0625rem", fontFamily:"var(--font-display)", fontWeight:500 }} placeholder="Dr. Jane Doe" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <FieldLabel required>Biography</FieldLabel>
                <textarea value={form.bio} onChange={(e)=>set("bio",e.target.value)} rows={4} style={{ ...INPUT, resize:"none" }} placeholder="Research background, areas of expertise, and contributions to ECADEL LABS…" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Role */}
        <FormSection title="Role">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.625rem" }}>
            {ROLES.map((r) => {
              const active = form.role === r.value;
              return (
                <button key={r.value} type="button" onClick={()=>set("role",r.value)} style={{ padding:"0.875rem 1rem", borderRadius:"3px", cursor:"pointer", textAlign:"left", border:`1px solid ${active ? "#C8A96E" : "rgba(255,255,255,0.08)"}`, backgroundColor:active ? "rgba(200,169,110,0.08)" : "rgba(255,255,255,0.02)", transition:"all 0.15s" }}>
                  <div style={{ fontSize:"0.875rem", fontWeight:600, color:active ? "#C8A96E" : "rgba(200,196,190,0.65)", marginBottom:"2px" }}>{r.label}</div>
                  <div style={{ fontSize:"10px", color:"rgba(200,196,190,0.32)" }}>{r.desc}</div>
                </button>
              );
            })}
          </div>
        </FormSection>

        {/* Details */}
        <FormSection title="Details &amp; Links" accent="#8BA7C7">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <Row>
              <div>
                <FieldLabel hint="comma-separated">Areas of Expertise</FieldLabel>
                <input value={form.expertise} onChange={(e)=>set("expertise",e.target.value)} style={INPUT} placeholder="AI Architecture, Data Science" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <FieldLabel hint="optional">Institution</FieldLabel>
                <input value={form.institution} onChange={(e)=>set("institution",e.target.value)} style={INPUT} placeholder="Makerere University" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </Row>
            <Row>
              <div>
                <FieldLabel>Cohort / Year</FieldLabel>
                <input value={form.cohort} onChange={(e)=>set("cohort",e.target.value)} style={INPUT} placeholder="2026" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <FieldLabel hint="optional">LinkedIn URL</FieldLabel>
                <input value={form.linkedinUrl} onChange={(e)=>set("linkedinUrl",e.target.value)} style={INPUT} placeholder="https://linkedin.com/in/…" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </Row>
            <Row>
              <div>
                <FieldLabel hint="e.g. 0000-0001-2345-6789">ORCID iD</FieldLabel>
                <input value={form.orcid} onChange={(e)=>set("orcid",e.target.value)} style={INPUT} placeholder="0000-0000-0000-0000" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <FieldLabel hint="without @">X / Twitter Handle</FieldLabel>
                <input value={form.twitter} onChange={(e)=>set("twitter",e.target.value)} style={INPUT} placeholder="username" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </Row>
            <div style={{ display:"flex", gap:"1.5rem" }}>
              <label style={{ display:"flex", alignItems:"center", gap:"0.625rem", cursor:"pointer", userSelect:"none" }}>
                <input type="checkbox" checked={form.active} onChange={(e)=>set("active",e.target.checked)} style={{ accentColor:"#C8A96E", width:"14px", height:"14px" }} />
                <span style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.68)" }}>Active fellow</span>
              </label>
              <label style={{ display:"flex", alignItems:"center", gap:"0.625rem", cursor:"pointer", userSelect:"none" }}>
                <input type="checkbox" checked={form.featured} onChange={(e)=>set("featured",e.target.checked)} style={{ accentColor:"#C8A96E", width:"14px", height:"14px" }} />
                <Star size={13} color="rgba(200,169,110,0.6)" />
                <span style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.68)" }}>Featured</span>
              </label>
            </div>
          </div>
        </FormSection>

        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"1.25rem 1.5rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px" }}>
          <Btn onClick={save} disabled={saving||!form.name||!form.bio} variant="primary">
            <UserPlus size={14} /> {saving ? "Adding…" : "Add Fellow"}
          </Btn>
          <Link href="/admin/fellows" style={{ marginLeft:"auto", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none" }}>Cancel</Link>
        </div>
      </div>
    </div>
  );
}
