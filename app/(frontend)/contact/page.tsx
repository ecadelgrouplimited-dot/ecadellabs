"use client";

import { useState } from "react";
import { Send, Beaker } from "lucide-react";

const INQUIRY_TYPES = [
  { value: "research",     label: "Research Collaboration" },
  { value: "fellowship",   label: "Fellowship Application" },
  { value: "partnership",  label: "Institutional Partnership" },
  { value: "grant",        label: "Grant Co-Application" },
  { value: "general",      label: "General Inquiry" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", organisation: "", type: "general", message: "" });
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us at ecadel@ecadelgroup.com");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-20">
        {/* Left */}
        <div>
          <div className="text-[9px] tracking-[0.35em] uppercase text-gold/70 font-mono mb-4">Get in Touch</div>
          <h1 className="font-display font-bold text-cream leading-tight mb-6" style={{ fontSize: "clamp(2rem,4vw,3.5rem)" }}>
            Start a<br /><span style={{ color: "#C8A96E" }}>Conversation.</span>
          </h1>
          <p className="text-platinum/65 leading-relaxed mb-10">
            Whether you are a researcher, university, grant body, or institution — ECADEL LABS is open to serious conversations about research collaboration, fellowships, and partnerships.
          </p>

          {/* Contact info */}
          <div className="space-y-5">
            {[
              { label: "Research Inquiries",     value: "ecadel@ecadelgroup.com" },
              { label: "Fellowship Applications", value: "ecadel@ecadelgroup.com" },
              { label: "Institution",             value: "ECADEL GROUP LIMITED · Kampala, Uganda" },
              { label: "Main Website",            value: "ecadelgroup.com" },
            ].map((c) => (
              <div key={c.label}>
                <div className="text-[9px] tracking-[0.2em] uppercase text-muted font-mono mb-0.5">{c.label}</div>
                <div className="text-sm text-platinum/68">{c.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div>
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 border border-gold/15 bg-gold/3">
              <Beaker size={28} className="text-gold mb-5" />
              <h3 className="font-display font-bold text-cream text-2xl mb-3">Inquiry Received</h3>
              <p className="text-platinum/60 text-sm max-w-xs leading-relaxed">
                Thank you. ECADEL LABS reviews every inquiry personally and will respond within 72 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Full Name *</label>
                  <input required value={form.name} onChange={(e) => set("name", e.target.value)} className="admin-input" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Organisation</label>
                  <input value={form.organisation} onChange={(e) => set("organisation", e.target.value)} className="admin-input" placeholder="University / Institution" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Email Address *</label>
                <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  className="admin-input" placeholder="your@institution.edu" />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Inquiry Type</label>
                <select value={form.type} onChange={(e) => set("type", e.target.value)} className="admin-input">
                  {INQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-1.5">Message *</label>
                <textarea required rows={6} value={form.message} onChange={(e) => set("message", e.target.value)}
                  className="admin-input resize-none"
                  placeholder="Describe your research, the collaboration you are proposing, or what you would like to discuss…" />
              </div>

              {error && (
                <div className="text-xs text-ruby border border-ruby/20 bg-ruby/5 px-4 py-3">{error}</div>
              )}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gold text-obsidian font-display font-semibold text-sm hover:bg-gold-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <><span className="animate-spin">⟳</span> Sending…</>
                ) : (
                  <><Send size={14} /> Submit Inquiry</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
