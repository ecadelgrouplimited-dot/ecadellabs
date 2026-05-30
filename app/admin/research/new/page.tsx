"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewResearchPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", problem: "", methodology: "", outcomes: "",
    status: "planned", technologies: "", partners: "",
    featured: false, published: false,
  });
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave(publish: boolean) {
    setSaving(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
          partners:     form.partners.split(",").map((p) => p.trim()).filter(Boolean),
          published:    publish,
        }),
      });
      if (!res.ok) throw new Error();
      router.push("/admin/research");
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/research" className="text-platinum/42 hover:text-cream transition-colors"><ArrowLeft size={16} /></Link>
        <h1 className="font-display font-bold text-cream text-2xl">New Research Project</h1>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Title *</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className="admin-input text-lg font-display" placeholder="Research project title" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className="admin-input">
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Technologies (comma-separated)</label>
            <input value={form.technologies} onChange={(e) => set("technologies", e.target.value)} className="admin-input" placeholder="AI, SQLite, Africa" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Description *</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="admin-input resize-none" placeholder="Brief overview of the research project" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Research Problem *</label>
          <textarea value={form.problem} onChange={(e) => set("problem", e.target.value)} rows={4} className="admin-input resize-none" placeholder="What problem is this research addressing?" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Methodology (optional)</label>
          <textarea value={form.methodology} onChange={(e) => set("methodology", e.target.value)} rows={3} className="admin-input resize-none" placeholder="Research approach and methods" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Partner Institutions (comma-separated)</label>
          <input value={form.partners} onChange={(e) => set("partners", e.target.value)} className="admin-input" placeholder="Makerere University, AfDB" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-gold" />
          <span className="text-sm text-platinum/68">Feature on homepage</span>
        </label>
        <div className="flex items-center gap-3 pt-4 border-t border-white/7">
          <button onClick={() => handleSave(false)} disabled={saving || !form.title}
            className="px-5 py-2.5 bg-carbon border border-white/10 text-platinum/72 text-sm hover:text-cream hover:border-white/20 transition-all disabled:opacity-40">
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving || !form.title || !form.problem}
            className="px-5 py-2.5 bg-gold text-obsidian text-sm font-semibold hover:bg-gold-dim transition-colors disabled:opacity-40">
            {saving ? "Publishing…" : "Publish"}
          </button>
          <Link href="/admin/research" className="ml-auto text-sm text-muted hover:text-platinum/68 transition-colors">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
