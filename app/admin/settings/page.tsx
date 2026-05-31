"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2 } from "lucide-react";

interface Publication { id:string; title:string; published:boolean; featured:boolean }
interface Project     { id:string; title:string; published:boolean; featured:boolean }

export default function SettingsAdmin() {
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const [pubs,   setPubs]     = useState<Publication[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    labsTitle:       "ECADEL LABS",
    labsTagline:     "Research & Innovation Engine",
    labsDescription: "The research and innovation engine of ECADEL GROUP LIMITED — advancing African intelligence infrastructure through original research, academic partnerships, and applied technology.",
    contactEmail:    "ecadel@ecadelgroup.com",
    researchDomains: "6",
    activeProjects:  "3",
    grantBodies:     "5",
    featuredPubId:   "",
    featuredProjectId: "",
  });

  useEffect(() => {
    // Load settings
    fetch("/api/settings").then((r) => r.json()).then((d) => {
      if (d && Object.keys(d).length > 0) setForm((f) => ({ ...f, ...d }));
    }).catch(() => {});

    // Load publications + research for featured selectors
    Promise.all([
      fetch("/api/publications?admin=true").then((r) => r.json()),
      fetch("/api/research?admin=true").then((r) => r.json()),
    ]).then(([pubData, projData]) => {
      setPubs(Array.isArray(pubData) ? pubData : []);
      setProjects(Array.isArray(projData) ? projData : []);
    }).catch(() => {});
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true);
    try {
      // Save settings
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Update featured publication
      if (form.featuredPubId) {
        await Promise.all(
          pubs.map((p) =>
            fetch(`/api/publications/${p.id}`, {
              method:  "PATCH",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({ featured: p.id === form.featuredPubId }),
            })
          )
        );
      }

      // Update featured research project
      if (form.featuredProjectId) {
        await Promise.all(
          projects.map((p) =>
            fetch(`/api/research/${p.id}`, {
              method:  "PATCH",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({ featured: p.id === form.featuredProjectId }),
            })
          )
        );
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  const currentFeaturedPub     = pubs.find((p) => p.featured)?.id     ?? "";
  const currentFeaturedProject = projects.find((p) => p.featured)?.id ?? "";

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

        {/* Featured Content */}
        <div>
          <h2 className="font-display font-semibold text-cream text-base mb-1 pb-2 border-b border-white/7">Featured Content</h2>
          <p className="text-platinum/45 text-xs mb-4">Controls which publication and research project appear on the homepage hero.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">
                Featured Publication {currentFeaturedPub && <span className="text-emerald/70">· Currently set</span>}
              </label>
              <select
                value={form.featuredPubId || currentFeaturedPub}
                onChange={(e) => set("featuredPubId", e.target.value)}
                className="admin-input"
              >
                <option value="">— Keep current —</option>
                {pubs.filter((p) => p.published).map((p) => (
                  <option key={p.id} value={p.id}>{p.title}{p.featured ? " ★" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">
                Featured Research Project {currentFeaturedProject && <span className="text-emerald/70">· Currently set</span>}
              </label>
              <select
                value={form.featuredProjectId || currentFeaturedProject}
                onChange={(e) => set("featuredProjectId", e.target.value)}
                className="admin-input"
              >
                <option value="">— Keep current —</option>
                {projects.filter((p) => p.published).map((p) => (
                  <option key={p.id} value={p.id}>{p.title}{p.featured ? " ★" : ""}</option>
                ))}
              </select>
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
              { key:"researchDomains", label:"Research Domains" },
              { key:"activeProjects",  label:"Active Projects" },
              { key:"grantBodies",     label:"Grant Bodies Targeted" },
            ].map((s) => (
              <div key={s.key}>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">{s.label}</label>
                <input value={form[s.key as keyof typeof form]} onChange={(e) => set(s.key, e.target.value)} className="admin-input" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/7">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold text-obsidian text-sm font-semibold hover:bg-gold-dim transition-colors disabled:opacity-40">
            {saved ? <><CheckCircle2 size={14} /> Saved</> : saving ? "Saving…" : <><Save size={14} /> Save Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
}
