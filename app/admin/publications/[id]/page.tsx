"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { value: "research-note",    label: "Research Note" },
  { value: "white-paper",      label: "White Paper" },
  { value: "technical-report", label: "Technical Report" },
  { value: "position-paper",   label: "Position Paper" },
];

export default function EditPublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    title: "", abstract: "", content: "", category: "research-note",
    authors: "", tags: "", pdfUrl: "", slug: "", featured: false, published: false,
  });

  useEffect(() => {
    fetch(`/api/publications/${id}`)
      .then((r) => r.json())
      .then((d) => setForm({
        title: d.title, abstract: d.abstract, content: d.content ?? "",
        category: d.category, slug: d.slug,
        authors: (JSON.parse(d.authors ?? "[]") as string[]).join(", "),
        tags:    (JSON.parse(d.tags    ?? "[]") as string[]).join(", "),
        pdfUrl:  d.pdfUrl ?? "", featured: d.featured, published: d.published,
      }));
  }, [id]);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave(pub: boolean) {
    setSaving(true);
    try {
      await fetch(`/api/publications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          authors:   form.authors.split(",").map((a) => a.trim()).filter(Boolean),
          tags:      form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          published: pub,
        }),
      });
      router.push("/admin/publications");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm("Delete this publication? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/publications/${id}`, { method: "DELETE" });
    router.push("/admin/publications");
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/publications" className="text-platinum/42 hover:text-cream transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-display font-bold text-cream text-2xl">Edit Publication</h1>
            <div className="text-platinum/38 text-xs font-mono mt-0.5">{form.slug}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {form.published && (
            <Link href={`/publications/${form.slug}`} target="_blank"
              className="flex items-center gap-1.5 text-xs text-sapphire hover:text-cream transition-colors">
              <ExternalLink size={12} /> View live
            </Link>
          )}
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-ruby/70 hover:text-ruby hover:bg-ruby/5 border border-transparent hover:border-ruby/20 transition-all">
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Title</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className="admin-input text-lg font-display" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="admin-input">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Authors</label>
            <input value={form.authors} onChange={(e) => set("authors", e.target.value)} className="admin-input" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Abstract</label>
          <textarea value={form.abstract} onChange={(e) => set("abstract", e.target.value)} rows={4} className="admin-input resize-none" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Full Content (Markdown)</label>
          <textarea value={form.content} onChange={(e) => set("content", e.target.value)}
            rows={20} className="admin-input resize-y font-mono text-xs leading-relaxed" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Tags</label>
            <input value={form.tags} onChange={(e) => set("tags", e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">PDF URL</label>
            <input value={form.pdfUrl} onChange={(e) => set("pdfUrl", e.target.value)} className="admin-input" />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-gold" />
          <span className="text-sm text-platinum/68">Featured on homepage</span>
        </label>
        <div className="flex items-center gap-3 pt-4 border-t border-white/7">
          <button onClick={() => handleSave(false)} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-carbon border border-white/10 text-platinum/72 text-sm hover:text-cream hover:border-white/20 transition-all">
            <Save size={14} /> Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold text-obsidian text-sm font-semibold hover:bg-gold-dim transition-colors">
            {saving ? "Saving…" : form.published ? "Update Published" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
