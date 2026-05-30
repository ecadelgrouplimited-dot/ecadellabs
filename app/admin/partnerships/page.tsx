"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Globe } from "lucide-react";

interface Partnership {
  id: string; institution: string; type: string;
  country: string; description: string; website?: string; active: boolean;
}

const TYPES = ["university","research-body","government","ngo","development-bank"];

export default function PartnershipsAdmin() {
  const [items, setItems]     = useState<Partnership[]>([]);
  const [adding, setAdding]   = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm] = useState({ institution: "", type: "university", country: "", description: "", website: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const load = () => fetch("/api/partnerships?admin=true").then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  async function handleAdd() {
    setSaving(true);
    try {
      await fetch("/api/partnerships", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setAdding(false);
      setForm({ institution: "", type: "university", country: "", description: "", website: "" });
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this partnership?")) return;
    await fetch(`/api/partnerships/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/partnerships/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !active }) });
    load();
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-cream text-2xl mb-1">Partnerships</h1>
          <p className="text-platinum/55 text-sm">{items.length} total</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-obsidian text-sm font-display font-semibold hover:bg-gold-dim transition-colors">
          <Plus size={14} /> Add Partner
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-carbon border border-white/10 p-6 mb-6 space-y-4">
          <h3 className="font-display font-semibold text-cream text-sm mb-4">Add New Partnership</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Institution *</label>
              <input value={form.institution} onChange={(e) => set("institution", e.target.value)} className="admin-input" placeholder="Makerere University" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className="admin-input">
                {TYPES.map((t) => <option key={t} value={t}>{t.replace(/-/g," ")}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Country *</label>
              <input value={form.country} onChange={(e) => set("country", e.target.value)} className="admin-input" placeholder="Uganda" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Website</label>
              <input value={form.website} onChange={(e) => set("website", e.target.value)} className="admin-input" placeholder="https://…" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Description *</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="admin-input resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleAdd} disabled={saving || !form.institution || !form.description}
              className="px-4 py-2 bg-gold text-obsidian text-sm font-semibold hover:bg-gold-dim disabled:opacity-40">
              {saving ? "Saving…" : "Add"}
            </button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-muted hover:text-platinum/68">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-carbon border border-white/7 px-5 py-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm text-cream font-medium">{item.institution}</span>
                <span className="text-[9px] bg-white/5 text-muted px-1.5 py-0.5 rounded-sm">{item.type.replace(/-/g," ")}</span>
                <span className="text-[9px] text-platinum/38">{item.country}</span>
              </div>
              <p className="text-xs text-platinum/45 truncate">{item.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {item.website && (
                <a href={item.website} target="_blank" className="text-platinum/38 hover:text-sapphire transition-colors"><Globe size={13} /></a>
              )}
              <button onClick={() => toggleActive(item.id, item.active)}
                className={`text-[9px] px-2 py-1 border rounded-sm transition-colors ${item.active ? "border-emerald/30 text-emerald hover:bg-emerald/5" : "border-white/10 text-muted hover:border-white/20"}`}>
                {item.active ? "Active" : "Inactive"}
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-platinum/25 hover:text-ruby transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
