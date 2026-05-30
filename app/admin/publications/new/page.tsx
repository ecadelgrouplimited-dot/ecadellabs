"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { value: "research-note",     label: "Research Note" },
  { value: "white-paper",       label: "White Paper" },
  { value: "technical-report",  label: "Technical Report" },
  { value: "position-paper",    label: "Position Paper" },
];

export default function NewPublicationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", abstract: "", content: "", category: "research-note",
    authors: "", tags: "", pdfUrl: "", featured: false, published: false,
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave(publish: boolean) {
    setSaving(true);
    try {
      const res = await fetch("/api/publications", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          authors:   form.authors.split(",").map((a) => a.trim()).filter(Boolean),
          tags:      form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          published: publish,
        }),
      });
      if (!res.ok) throw new Error();
      router.push("/admin/publications");
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/publications" className="text-platinum/42 hover:text-cream transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display font-bold text-cream text-2xl">New Publication</h1>
          <p className="text-platinum/42 text-sm mt-0.5">Create a research note, white paper, or report</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Title *</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)}
            className="admin-input text-lg font-display" placeholder="Publication title" />
        </div>

        {/* Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Category *</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="admin-input">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Authors (comma-separated)</label>
            <input value={form.authors} onChange={(e) => set("authors", e.target.value)}
              className="admin-input" placeholder="ECADEL LABS Research Team" />
          </div>
        </div>

        {/* Abstract */}
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Abstract *</label>
          <textarea value={form.abstract} onChange={(e) => set("abstract", e.target.value)}
            rows={4} className="admin-input resize-none" placeholder="A concise summary of the publication…" />
        </div>

        {/* Content */}
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">
            Full Content (Markdown)
          </label>
          <textarea value={form.content} onChange={(e) => set("content", e.target.value)}
            rows={18} className="admin-input resize-y font-mono text-xs leading-relaxed"
            placeholder={"# Introduction\n\nYour full publication content in Markdown…"} />
        </div>

        {/* Tags + PDF */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => set("tags", e.target.value)}
              className="admin-input" placeholder="AI, Africa, Research" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">PDF URL (optional)</label>
            <input value={form.pdfUrl} onChange={(e) => set("pdfUrl", e.target.value)}
              className="admin-input" placeholder="https://…" />
          </div>
        </div>

        {/* Flags */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)}
              className="accent-gold" />
            <span className="text-sm text-platinum/68">Featured on homepage</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/7">
          <button onClick={() => handleSave(false)} disabled={saving || !form.title}
            className="flex items-center gap-2 px-5 py-2.5 bg-carbon border border-white/10 text-platinum/72 text-sm hover:text-cream hover:border-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <Save size={14} /> Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving || !form.title || !form.abstract}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold text-obsidian text-sm font-semibold hover:bg-gold-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {saving ? "Publishing…" : "Publish"}
          </button>
          <Link href="/admin/publications" className="ml-auto text-sm text-muted hover:text-platinum/68 transition-colors">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
