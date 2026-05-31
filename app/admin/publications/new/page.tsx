"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Send, Star } from "lucide-react";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { INPUT, FieldLabel, FormSection, Row, Btn, fieldFocus, fieldBlur } from "@/components/admin/FormField";

const CATEGORIES = [
  { value:"research-note",    label:"Research Note" },
  { value:"white-paper",      label:"White Paper" },
  { value:"technical-report", label:"Technical Report" },
  { value:"position-paper",   label:"Position Paper" },
];

export default function NewPublicationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title:"", abstract:"", content:"", category:"research-note",
    authors:"ECADEL LABS Research Team", tags:"", pdfUrl:"", featured:false,
  });
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]:v }));

  async function save(publish: boolean) {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/publications", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ ...form, authors:form.authors.split(",").map((a)=>a.trim()).filter(Boolean), tags:form.tags.split(",").map((t)=>t.trim()).filter(Boolean), published:publish }),
      });
      if (!res.ok) throw new Error();
      router.push("/admin/publications");
    } catch { alert("Failed to save. Please try again."); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ padding:"2rem 2.5rem", maxWidth:"860px" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"2rem" }}>
        <Link href="/admin/publications" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"32px", height:"32px", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"3px", color:"rgba(200,196,190,0.55)", textDecoration:"none" }}>
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"2px" }}>New Publication</h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)" }}>Write a research note, white paper, report, or position paper</p>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>

        {/* Core fields */}
        <FormSection title="Publication Details">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div>
              <FieldLabel required>Title</FieldLabel>
              <input value={form.title} onChange={(e)=>set("title",e.target.value)} style={{ ...INPUT, fontSize:"1.0625rem", fontFamily:"var(--font-display)", fontWeight:500 }} placeholder="Publication title" onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
            <Row>
              <div>
                <FieldLabel required>Category</FieldLabel>
                <select value={form.category} onChange={(e)=>set("category",e.target.value)} style={{ ...INPUT, cursor:"pointer" }} onFocus={fieldFocus} onBlur={fieldBlur}>
                  {CATEGORIES.map((c)=><option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel hint="comma-separated">Authors</FieldLabel>
                <input value={form.authors} onChange={(e)=>set("authors",e.target.value)} style={INPUT} placeholder="ECADEL LABS Research Team" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </Row>
            <div>
              <FieldLabel required hint={`${form.abstract.length} / 500 chars`}>Abstract</FieldLabel>
              <textarea value={form.abstract} onChange={(e)=>set("abstract",e.target.value)} rows={4} style={{ ...INPUT, resize:"none" }} placeholder="A concise summary of the publication (1–2 paragraphs)…" onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
          </div>
        </FormSection>

        {/* Markdown editor */}
        <FormSection title="Full Content" accent="#8BA7C7">
          <MarkdownEditor
            value={form.content}
            onChange={(v)=>set("content",v)}
            rows={20}
            placeholder={"# Introduction\n\nWrite your full publication content here in Markdown…\n\n## Section 2\n\nContinue writing…"}
          />
        </FormSection>

        {/* Metadata */}
        <FormSection title="Metadata & Publishing" accent="#D4A24C">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <Row>
              <div>
                <FieldLabel hint="comma-separated">Tags</FieldLabel>
                <input value={form.tags} onChange={(e)=>set("tags",e.target.value)} style={INPUT} placeholder="AI, Africa, Research" onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <FieldLabel hint="Google Drive, PDF, or any URL">Document URL</FieldLabel>
                <input value={form.pdfUrl} onChange={(e)=>set("pdfUrl",e.target.value)} style={INPUT} placeholder="https://drive.google.com/file/d/…/view or direct PDF URL" onFocus={fieldFocus} onBlur={fieldBlur} />
                <p style={{ fontSize:"9px", color:"rgba(200,196,190,0.28)", marginTop:"0.375rem" }}>
                  Paste a Google Drive share link, direct PDF URL, or any accessible document URL. The ECADEL LABS Reader will embed it automatically.
                </p>
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
          <Btn onClick={()=>save(false)} disabled={saving||!form.title||!form.abstract} variant="secondary">
            <Save size={14} /> {saving ? "Saving…" : "Save Draft"}
          </Btn>
          <Btn onClick={()=>save(true)} disabled={saving||!form.title||!form.abstract} variant="primary">
            <Send size={14} /> {saving ? "Publishing…" : "Publish Now"}
          </Btn>
          <Link href="/admin/publications" style={{ marginLeft:"auto", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none" }}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
