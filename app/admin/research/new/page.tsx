"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Send, Star } from "lucide-react";
import { INPUT, FieldLabel, FormSection, Row, Btn, fieldFocus, fieldBlur } from "@/components/admin/FormField";

export default function NewResearchPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title:"", description:"", problem:"", methodology:"", outcomes:"",
    status:"planned", technologies:"", partners:"", featured:false,
  });
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]:v }));

  async function save(publish: boolean) {
    if (!form.title || !form.problem) return;
    setSaving(true);
    try {
      const res = await fetch("/api/research", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ ...form, technologies:form.technologies.split(",").map((t)=>t.trim()).filter(Boolean), partners:form.partners.split(",").map((p)=>p.trim()).filter(Boolean), published:publish }),
      });
      if (!res.ok) throw new Error();
      router.push("/admin/research");
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  }

  const STATUS_OPTS = [
    { value:"planned",   label:"Planned",   desc:"Not yet started" },
    { value:"active",    label:"Active",    desc:"Currently ongoing" },
    { value:"completed", label:"Completed", desc:"Research concluded" },
  ];

  return (
    <div style={{ padding:"2rem 2.5rem", maxWidth:"860px" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"2rem" }}>
        <Link href="/admin/research" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"32px", height:"32px", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"3px", color:"rgba(200,196,190,0.55)", textDecoration:"none" }}>
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"2px" }}>New Research Project</h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)" }}>Add a research agenda item to the ECADEL LABS programme</p>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>

        {/* Core details */}
        <FormSection title="Project Details">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div>
              <FieldLabel required>Title</FieldLabel>
              <input value={form.title} onChange={(e)=>set("title",e.target.value)} style={{ ...INPUT, fontSize:"1.0625rem", fontFamily:"var(--font-display)", fontWeight:500 }} placeholder="Research project title" onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>

            {/* Status selector */}
            <div>
              <FieldLabel required>Status</FieldLabel>
              <div style={{ display:"flex", gap:"0.625rem" }}>
                {STATUS_OPTS.map((s) => {
                  const active = form.status === s.value;
                  const COLORS: Record<string,string> = { planned:"#D4A24C", active:"#4ab478", completed:"#5B8FBF" };
                  const c = COLORS[s.value];
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => set("status", s.value)}
                      style={{ flex:1, padding:"0.75rem 1rem", borderRadius:"3px", cursor:"pointer", transition:"all 0.15s", textAlign:"left", border:`1px solid ${active ? c : "rgba(255,255,255,0.08)"}`, backgroundColor: active ? `${c}12` : "rgba(255,255,255,0.02)" }}
                    >
                      <div style={{ fontSize:"0.8125rem", fontWeight:600, color: active ? c : "rgba(200,196,190,0.55)", marginBottom:"2px" }}>{s.label}</div>
                      <div style={{ fontSize:"10px", color:"rgba(200,196,190,0.32)" }}>{s.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <FieldLabel required>Brief Description</FieldLabel>
              <textarea value={form.description} onChange={(e)=>set("description",e.target.value)} rows={3} style={{ ...INPUT, resize:"none" }} placeholder="A 2–3 sentence overview of this research project…" onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
          </div>
        </FormSection>

        {/* Research problem */}
        <FormSection title="Research Problem" accent="#e05555">
          <div>
            <FieldLabel required hint="The core problem this research addresses">Research Problem Statement</FieldLabel>
            <textarea value={form.problem} onChange={(e)=>set("problem",e.target.value)} rows={6} style={{ ...INPUT, resize:"vertical" }} placeholder="What is the specific problem? Why does it matter for African intelligence infrastructure? Who is affected and how?" onFocus={fieldFocus} onBlur={fieldBlur} />
          </div>
        </FormSection>

        {/* Methodology */}
        <FormSection title="Methodology & Outcomes" accent="#8BA7C7">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div>
              <FieldLabel hint="optional">Methodology / Approach</FieldLabel>
              <textarea value={form.methodology} onChange={(e)=>set("methodology",e.target.value)} rows={4} style={{ ...INPUT, resize:"vertical" }} placeholder="How is this research being conducted? What methods, frameworks, or data sources are being used?" onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
            <div>
              <FieldLabel hint="optional — complete when findings emerge">Outcomes &amp; Findings</FieldLabel>
              <textarea value={form.outcomes} onChange={(e)=>set("outcomes",e.target.value)} rows={3} style={{ ...INPUT, resize:"vertical" }} placeholder="What has been discovered? What are the key conclusions?" onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
          </div>
        </FormSection>

        {/* Technical metadata */}
        <FormSection title="Technical Context" accent="#D4A24C">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <Row>
              <div>
                <FieldLabel hint="comma-separated">Technologies / Domains</FieldLabel>
                <input value={form.technologies} onChange={(e)=>set("technologies",e.target.value)} style={INPUT} placeholder="AI, SQLite, Mobile Money, Africa" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <FieldLabel hint="comma-separated">Partner Institutions</FieldLabel>
                <input value={form.partners} onChange={(e)=>set("partners",e.target.value)} style={INPUT} placeholder="Makerere University, AfDB" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </Row>
            <label style={{ display:"flex", alignItems:"center", gap:"0.625rem", cursor:"pointer", userSelect:"none" }}>
              <input type="checkbox" checked={form.featured} onChange={(e)=>set("featured",e.target.checked)} style={{ accentColor:"#C8A96E", width:"14px", height:"14px" }} />
              <Star size={13} color="rgba(200,169,110,0.6)" />
              <span style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.68)" }}>Feature on homepage</span>
            </label>
          </div>
        </FormSection>

        {/* Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"1.25rem 1.5rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px" }}>
          <Btn onClick={()=>save(false)} disabled={saving||!form.title} variant="secondary">
            <Save size={14} /> Save Draft
          </Btn>
          <Btn onClick={()=>save(true)} disabled={saving||!form.title||!form.problem} variant="primary">
            <Send size={14} /> Publish Now
          </Btn>
          <Link href="/admin/research" style={{ marginLeft:"auto", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none" }}>Cancel</Link>
        </div>
      </div>
    </div>
  );
}
