"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const ROLES = [
  { value: "research-fellow", label: "Research Fellow" },
  { value: "resident",        label: "Resident" },
  { value: "collaborator",    label: "Collaborator" },
  { value: "advisor",         label: "Advisor" },
];

export default function NewFellowPage() {
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", role: "research-fellow", bio: "", expertise: "",
    institution: "", cohort: "", photoUrl: "", linkedinUrl: "", active: true, featured: false,
  });
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/fellows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          expertise: form.expertise.split(",").map((e) => e.trim()).filter(Boolean),
        }),
      });
      router.push("/admin/fellows");
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/fellows" className="text-platinum/42 hover:text-cream transition-colors"><ArrowLeft size={16} /></Link>
        <h1 className="font-display font-bold text-cream text-2xl">Add Fellow</h1>
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Full Name *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className="admin-input" placeholder="Dr. Jane Doe" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Role</label>
            <select value={form.role} onChange={(e) => set("role", e.target.value)} className="admin-input">
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Biography *</label>
          <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={4} className="admin-input resize-none" placeholder="Research background, expertise, and contributions to ECADEL LABS" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Areas of Expertise (comma-separated)</label>
            <input value={form.expertise} onChange={(e) => set("expertise", e.target.value)} className="admin-input" placeholder="AI Systems, Data Science" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Institution</label>
            <input value={form.institution} onChange={(e) => set("institution", e.target.value)} className="admin-input" placeholder="Makerere University" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Cohort / Year</label>
            <input value={form.cohort} onChange={(e) => set("cohort", e.target.value)} className="admin-input" placeholder="2026" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">LinkedIn URL</label>
            <input value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} className="admin-input" placeholder="https://linkedin.com/in/…" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="accent-gold" />
            <span className="text-sm text-platinum/68">Active fellow</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-gold" />
            <span className="text-sm text-platinum/68">Featured</span>
          </label>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-white/7">
          <button onClick={handleSave} disabled={saving || !form.name || !form.bio}
            className="px-5 py-2.5 bg-gold text-obsidian text-sm font-semibold hover:bg-gold-dim transition-colors disabled:opacity-40">
            {saving ? "Saving…" : "Add Fellow"}
          </button>
          <Link href="/admin/fellows" className="text-sm text-muted hover:text-platinum/68 transition-colors">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
