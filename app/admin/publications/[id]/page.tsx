"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Send, Trash2, ExternalLink, Star } from "lucide-react";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { INPUT, FieldLabel, FormSection, Row, Btn, fieldFocus, fieldBlur } from "@/components/admin/FormField";

const CATEGORIES = [
  { value:"research-note",    label:"Research Note" },
  { value:"white-paper",      label:"White Paper" },
  { value:"technical-report", label:"Technical Report" },
  { value:"position-paper",   label:"Position Paper" },
];

export default function EditPublicationPage({ params }: { params: Promise<{ id:string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loaded,   setLoaded]   = useState(false);
  const [form, setForm] = useState({
    title:"", abstract:"", content:"", category:"research-note",
    authors:"", tags:"", pdfUrl:"", slug:"", featured:false, published:false,
  });
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]:v }));

  useEffect(() => {
    fetch(`/api/publications/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setForm({
          title:d.title, abstract:d.abstract, content:d.content??"",
          category:d.category, slug:d.slug,
          authors:(JSON.parse(d.authors??"[]") as string[]).join(", "),
          tags:   (JSON.parse(d.tags??"[]")    as string[]).join(", "),
          pdfUrl:d.pdfUrl??"", featured:d.featured, published:d.published,
        });
        setLoaded(true);
      });
  }, [id]);

  async function save(publish: boolean) {
    setSaving(true);
    try {
      await fetch(`/api/publications/${id}`, {
        method:"PATCH", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ ...form, authors:form.authors.split(",").map((a)=>a.trim()).filter(Boolean), tags:form.tags.split(",").map((t)=>t.trim()).filter(Boolean), published:publish }),
      });
      router.push("/admin/publications");
    } finally { setSaving(false); }
  }

  async function del() {
    if (!confirm("Delete this publication permanently? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/publications/${id}`, { method:"DELETE" });
    router.push("/admin/publications");
  }

  if (!loaded) return (
    <div style={{ padding:"2rem 2.5rem", color:"rgba(200,196,190,0.38)", fontSize:"0.875rem" }}>Loading…</div>
  );

  return (
    <div style={{ padding:"2rem 2.5rem", maxWidth:"860px" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <Link href="/admin/publications" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"32px", height:"32px", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"3px", color:"rgba(200,196,190,0.55)", textDecoration:"none" }}>
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"2px" }}>Edit Publication</h1>
            <code style={{ fontSize:"10px", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>{form.slug}</code>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
          {form.published && (
            <Link href={`/publications/${form.slug}`} target="_blank" style={{ display:"inline-flex", alignItems:"center", gap:"0.375rem", padding:"0.45rem 0.875rem", fontSize:"0.75rem", color:"#5B8FBF", border:"1px solid rgba(91,143,191,0.25)", borderRadius:"3px", textDecoration:"none" }}>
              <ExternalLink size={12} /> View live
            </Link>
          )}
          <Btn onClick={del} disabled={deleting} variant="danger" size="sm">
            <Trash2 size={12} /> {deleting ? "Deleting…" : "Delete"}
          </Btn>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>

        <FormSection title="Publication Details">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div>
              <FieldLabel required>Title</FieldLabel>
              <input value={form.title} onChange={(e)=>set("title",e.target.value)} style={{ ...INPUT, fontSize:"1.0625rem", fontFamily:"var(--font-display)", fontWeight:500 }} onFocus={fieldFocus} onBlur={fieldBlur} />
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
                <input value={form.authors} onChange={(e)=>set("authors",e.target.value)} style={INPUT} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </Row>
            <div>
              <FieldLabel required hint={`${form.abstract.length} chars`}>Abstract</FieldLabel>
              <textarea value={form.abstract} onChange={(e)=>set("abstract",e.target.value)} rows={4} style={{ ...INPUT, resize:"none" }} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
          </div>
        </FormSection>

        <FormSection title="Full Content" accent="#8BA7C7">
          <MarkdownEditor value={form.content} onChange={(v)=>set("content",v)} rows={22} />
        </FormSection>

        <FormSection title="Metadata & Publishing" accent="#D4A24C">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <Row>
              <div>
                <FieldLabel hint="comma-separated">Tags</FieldLabel>
                <input value={form.tags} onChange={(e)=>set("tags",e.target.value)} style={INPUT} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <FieldLabel hint="optional">PDF URL</FieldLabel>
                <input value={form.pdfUrl} onChange={(e)=>set("pdfUrl",e.target.value)} style={INPUT} onFocus={fieldFocus} onBlur={fieldBlur} />
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
          <Btn onClick={()=>save(false)} disabled={saving} variant="secondary">
            <Save size={14} /> Save Draft
          </Btn>
          <Btn onClick={()=>save(true)} disabled={saving} variant="primary">
            <Send size={14} /> {form.published ? "Update Published" : "Publish Now"}
          </Btn>
          <Link href="/admin/publications" style={{ marginLeft:"auto", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none" }}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
