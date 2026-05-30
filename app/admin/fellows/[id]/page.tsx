"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const ROLES = [
  { value: "research-fellow", label: "Research Fellow" },
  { value: "resident",        label: "Resident" },
  { value: "collaborator",    label: "Collaborator" },
  { value: "advisor",         label: "Advisor" },
];

export default function EditFellowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", role: "research-fellow", bio: "", expertise: "",
    institution: "", cohort: "", linkedinUrl: "", active: true, featured: false,
  });

  useEffect(() => {
    fetch(`/api/fellows/${id}`).then((r) => r.json()).then((d) =>
      setForm({
        name: d.name, role: d.role, bio: d.bio,
        expertise: (JSON.parse(d.expertise ?? "[]") as string[]).join(", "),
        institution: d.institution ?? "", cohort: d.cohort ?? "",
        linkedinUrl: d.linkedinUrl ?? "", active: d.active, featured: d.featured,
      })
    );
  }, [id]);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/fellows/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, expertise: form.expertise.split(",").map((e) => e.trim()).filter(Boolean) }),
      });
      router.push("/admin/fellows");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm("Remove this fellow?")) return;
    await fetch(`/api/fellows/${id}`, { method: "DELETE" });
    router.push("/admin/fellows");
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/fellows" className="text-platinum/42 hover:text-cream transition-colors"><ArrowLeft size={16} /></Link>
          <h1 className="font-display font-bold text-cream text-2xl">Edit Fellow</h1>
        </div>
        <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-2 text-xs text-ruby/70 hover:text-ruby hover:bg-ruby/5 border border-transparent hover:border-ruby/20 transition-all">
          <Trash2 size={12} /> Remove
        </button>
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Full Name</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Role</label>
            <select value={form.role} onChange={(e) => set("role", e.target.value)} className="admin-input">
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Biography</label>
          <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={4} className="admin-input resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Expertise</label>
            <input value={form.expertise} onChange={(e) => set("expertise", e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Institution</label>
            <input value={form.institution} onChange={(e) => set("institution", e.target.value)} className="admin-input" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Cohort</label>
            <input value={form.cohort} onChange={(e) => set("cohort", e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">LinkedIn</label>
            <input value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} className="admin-input" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="accent-gold" />
            <span className="text-sm text-platinum/68">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-gold" />
            <span className="text-sm text-platinum/68">Featured</span>
          </label>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-white/7">
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 bg-gold text-obsidian text-sm font-semibold hover:bg-gold-dim transition-colors disabled:opacity-40">
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <Link href="/admin/fellows" className="text-sm text-muted hover:text-platinum/68 transition-colors">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
