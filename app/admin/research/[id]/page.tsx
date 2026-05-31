"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Send, Trash2, ExternalLink, Star } from "lucide-react";
import { INPUT, FieldLabel, FormSection, Row, Btn, fieldFocus, fieldBlur } from "@/components/admin/FormField";

export default function EditResearchPage({ params }: { params: Promise<{ id:string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({
    title:"", description:"", problem:"", methodology:"", outcomes:"",
    status:"planned", technologies:"", partners:"", featured:false, published:false, slug:"",
  });
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]:v }));

  useEffect(() => {
    fetch(`/api/research/${id}`).then((r)=>r.json()).then((d) => {
      setForm({
        title:d.title, description:d.description, problem:d.problem,
        methodology:d.methodology??"", outcomes:d.outcomes??"", status:d.status, slug:d.slug,
        technologies:(JSON.parse(d.technologies??"[]") as string[]).join(", "),
        partners:    (JSON.parse(d.partners??"[]")     as string[]).join(", "),
        featured:d.featured, published:d.published,
      });
      setLoaded(true);
    });
  }, [id]);

  async function save(publish: boolean) {
    setSaving(true);
    try {
      await fetch(`/api/research/${id}`, {
        method:"PATCH", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ ...form, technologies:form.technologies.split(",").map((t)=>t.trim()).filter(Boolean), partners:form.partners.split(",").map((p)=>p.trim()).filter(Boolean), published:publish }),
      });
      router.push("/admin/research");
    } finally { setSaving(false); }
  }

  async function del() {
    if (!confirm("Delete this research project permanently?")) return;
    await fetch(`/api/research/${id}`, { method:"DELETE" });
    router.push("/admin/research");
  }

  if (!loaded) return <div style={{ padding:"2rem 2.5rem", color:"rgba(200,196,190,0.38)" }}>Loading…</div>;

  const STATUS_OPTS = [
    { value:"planned", label:"Planned", color:"#D4A24C" },
    { value:"active",  label:"Active",  color:"#4ab478" },
    { value:"completed",label:"Completed",color:"#5B8FBF" },
  ];

  return (
    <div style={{ padding:"2rem 2.5rem", maxWidth:"860px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <Link href="/admin/research" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"32px", height:"32px", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"3px", color:"rgba(200,196,190,0.55)", textDecoration:"none" }}>
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"2px" }}>Edit Research Project</h1>
            <code style={{ fontSize:"10px", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>{form.slug}</code>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
          {form.published && (
            <Link href={`/research/${form.slug}`} target="_blank" style={{ display:"inline-flex", alignItems:"center", gap:"0.375rem", padding:"0.45rem 0.875rem", fontSize:"0.75rem", color:"#5B8FBF", border:"1px solid rgba(91,143,191,0.25)", borderRadius:"3px", textDecoration:"none" }}>
              <ExternalLink size={12} /> View live
            </Link>
          )}
          <Btn onClick={del} variant="danger" size="sm"><Trash2 size={12} /> Delete</Btn>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
        <FormSection title="Project Details">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div>
              <FieldLabel required>Title</FieldLabel>
              <input value={form.title} onChange={(e)=>set("title",e.target.value)} style={{ ...INPUT, fontSize:"1.0625rem", fontFamily:"var(--font-display)", fontWeight:500 }} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
            <div>
              <FieldLabel required>Status</FieldLabel>
              <div style={{ display:"flex", gap:"0.625rem" }}>
                {STATUS_OPTS.map((s) => {
                  const active = form.status === s.value;
                  return (
                    <button key={s.value} type="button" onClick={()=>set("status",s.value)} style={{ flex:1, padding:"0.625rem 1rem", borderRadius:"3px", cursor:"pointer", textAlign:"left", border:`1px solid ${active ? s.color : "rgba(255,255,255,0.08)"}`, backgroundColor:active ? `${s.color}12` : "rgba(255,255,255,0.02)", fontSize:"0.8125rem", fontWeight:600, color:active ? s.color : "rgba(200,196,190,0.55)", transition:"all 0.15s" }}>
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <FieldLabel required>Description</FieldLabel>
              <textarea value={form.description} onChange={(e)=>set("description",e.target.value)} rows={3} style={{ ...INPUT, resize:"none" }} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
          </div>
        </FormSection>

        <FormSection title="Research Problem" accent="#e05555">
          <div>
            <FieldLabel required>Research Problem Statement</FieldLabel>
            <textarea value={form.problem} onChange={(e)=>set("problem",e.target.value)} rows={6} style={{ ...INPUT, resize:"vertical" }} onFocus={fieldFocus} onBlur={fieldBlur} />
          </div>
        </FormSection>

        <FormSection title="Methodology & Outcomes" accent="#8BA7C7">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div>
              <FieldLabel hint="optional">Methodology</FieldLabel>
              <textarea value={form.methodology} onChange={(e)=>set("methodology",e.target.value)} rows={4} style={{ ...INPUT, resize:"vertical" }} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
            <div>
              <FieldLabel hint="optional">Outcomes &amp; Findings</FieldLabel>
              <textarea value={form.outcomes} onChange={(e)=>set("outcomes",e.target.value)} rows={3} style={{ ...INPUT, resize:"vertical" }} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
          </div>
        </FormSection>

        <FormSection title="Technical Context" accent="#D4A24C">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <Row>
              <div>
                <FieldLabel hint="comma-separated">Technologies</FieldLabel>
                <input value={form.technologies} onChange={(e)=>set("technologies",e.target.value)} style={INPUT} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <FieldLabel hint="comma-separated">Partners</FieldLabel>
                <input value={form.partners} onChange={(e)=>set("partners",e.target.value)} style={INPUT} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </Row>
            <label style={{ display:"flex", alignItems:"center", gap:"0.625rem", cursor:"pointer", userSelect:"none" }}>
              <input type="checkbox" checked={form.featured} onChange={(e)=>set("featured",e.target.checked)} style={{ accentColor:"#C8A96E", width:"14px", height:"14px" }} />
              <Star size={13} color="rgba(200,169,110,0.6)" />
              <span style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.68)" }}>Feature on homepage</span>
            </label>
          </div>
        </FormSection>

        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"1.25rem 1.5rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px" }}>
          <Btn onClick={()=>save(false)} disabled={saving} variant="secondary"><Save size={14} /> Save Draft</Btn>
          <Btn onClick={()=>save(true)}  disabled={saving} variant="primary"><Send size={14} /> {form.published ? "Update" : "Publish"}</Btn>
          <Link href="/admin/research" style={{ marginLeft:"auto", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none" }}>Cancel</Link>
        </div>
      </div>
    </div>
  );
}
