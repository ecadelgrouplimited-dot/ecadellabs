"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditResearchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", problem: "", methodology: "", outcomes: "",
    status: "planned", technologies: "", partners: "", featured: false, published: false,
  });

  useEffect(() => {
    fetch(`/api/research/${id}`).then((r) => r.json()).then((d) =>
      setForm({
        title: d.title, description: d.description, problem: d.problem,
        methodology: d.methodology ?? "", outcomes: d.outcomes ?? "",
        status: d.status,
        technologies: (JSON.parse(d.technologies ?? "[]") as string[]).join(", "),
        partners:     (JSON.parse(d.partners ?? "[]") as string[]).join(", "),
        featured: d.featured, published: d.published,
      })
    );
  }, [id]);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave(pub: boolean) {
    setSaving(true);
    try {
      await fetch(`/api/research/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
          partners:     form.partners.split(",").map((p) => p.trim()).filter(Boolean),
          published: pub,
        }),
      });
      router.push("/admin/research");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/research/${id}`, { method: "DELETE" });
    router.push("/admin/research");
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/research" className="text-platinum/42 hover:text-cream transition-colors"><ArrowLeft size={16} /></Link>
          <h1 className="font-display font-bold text-cream text-2xl">Edit Research Project</h1>
        </div>
        <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-2 text-xs text-ruby/70 hover:text-ruby hover:bg-ruby/5 border border-transparent hover:border-ruby/20 transition-all">
          <Trash2 size={12} /> Delete
        </button>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Title</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className="admin-input text-lg font-display" />
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
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Technologies</label>
            <input value={form.technologies} onChange={(e) => set("technologies", e.target.value)} className="admin-input" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="admin-input resize-none" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Research Problem</label>
          <textarea value={form.problem} onChange={(e) => set("problem", e.target.value)} rows={4} className="admin-input resize-none" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Methodology</label>
          <textarea value={form.methodology} onChange={(e) => set("methodology", e.target.value)} rows={3} className="admin-input resize-none" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Outcomes / Findings</label>
          <textarea value={form.outcomes} onChange={(e) => set("outcomes", e.target.value)} rows={3} className="admin-input resize-none" />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Partner Institutions</label>
          <input value={form.partners} onChange={(e) => set("partners", e.target.value)} className="admin-input" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-gold" />
          <span className="text-sm text-platinum/68">Featured on homepage</span>
        </label>
        <div className="flex items-center gap-3 pt-4 border-t border-white/7">
          <button onClick={() => handleSave(false)} disabled={saving}
            className="px-5 py-2.5 bg-carbon border border-white/10 text-platinum/72 text-sm hover:text-cream hover:border-white/20 transition-all">
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
            className="px-5 py-2.5 bg-gold text-obsidian text-sm font-semibold hover:bg-gold-dim transition-colors">
            {saving ? "Saving…" : form.published ? "Update" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
