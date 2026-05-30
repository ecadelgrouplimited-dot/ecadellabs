"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

export default function SettingsAdmin() {
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [form, setForm] = useState({
    labsTitle:       "ECADEL LABS",
    labsTagline:     "Research & Innovation Engine",
    labsDescription: "The research and innovation engine of ECADEL GROUP LIMITED — advancing African intelligence infrastructure through original research, academic partnerships, and applied technology.",
    contactEmail:    "ecadel@ecadelgroup.com",
    researchDomains: "6",
    activeProjects:  "3",
    grantBodies:     "5",
  });

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => {
      if (d && Object.keys(d).length > 0) setForm((f) => ({ ...f, ...d }));
    }).catch(() => {});
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display font-bold text-cream text-2xl mb-1">Settings</h1>
        <p className="text-platinum/55 text-sm">Site-wide configuration for ecadellabs.cloud</p>
      </div>

      <div className="space-y-8">
        {/* Branding */}
        <div>
          <h2 className="font-display font-semibold text-cream text-base mb-4 pb-2 border-b border-white/7">Branding</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Site Title</label>
                <input value={form.labsTitle} onChange={(e) => set("labsTitle", e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Tagline</label>
                <input value={form.labsTagline} onChange={(e) => set("labsTagline", e.target.value)} className="admin-input" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Site Description (Meta)</label>
              <textarea value={form.labsDescription} onChange={(e) => set("labsDescription", e.target.value)} rows={3} className="admin-input resize-none" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-display font-semibold text-cream text-base mb-4 pb-2 border-b border-white/7">Contact</h2>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Contact Email</label>
            <input value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} className="admin-input" />
          </div>
        </div>

        {/* Homepage stats */}
        <div>
          <h2 className="font-display font-semibold text-cream text-base mb-4 pb-2 border-b border-white/7">Homepage Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: "researchDomains", label: "Research Domains" },
              { key: "activeProjects",  label: "Active Projects" },
              { key: "grantBodies",     label: "Grant Bodies Targeted" },
            ].map((s) => (
              <div key={s.key}>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">{s.label}</label>
                <input
                  value={form[s.key as keyof typeof form]}
                  onChange={(e) => set(s.key, e.target.value)}
                  className="admin-input"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/7">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold text-obsidian text-sm font-semibold hover:bg-gold-dim transition-colors disabled:opacity-40">
            <Save size={14} />
            {saved ? "Saved ✓" : saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
