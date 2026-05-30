"use client";

import { useState, useEffect } from "react";
import { Mail, Archive, MailOpen } from "lucide-react";

interface Inquiry {
  id: string; name: string; email: string; organisation?: string;
  type: string; message: string; read: boolean; archived: boolean;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  research: "Research", fellowship: "Fellowship", partnership: "Partnership",
  grant: "Grant", general: "General",
};

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected]   = useState<Inquiry | null>(null);
  const [loading, setLoading]     = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/inquiries").then((r) => r.json()).then((d) => { setInquiries(d); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    await fetch(`/api/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, read: true } : i));
  }

  async function archive(id: string) {
    await fetch(`/api/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ archived: true }) });
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  const openInquiry = (inq: Inquiry) => {
    setSelected(inq);
    if (!inq.read) markRead(inq.id);
  };

  return (
    <div className="flex h-screen">
      {/* List */}
      <div className="w-80 shrink-0 border-r border-white/7 flex flex-col">
        <div className="px-6 py-4 border-b border-white/7">
          <h1 className="font-display font-bold text-cream text-lg">Inquiries</h1>
          <p className="text-platinum/42 text-xs mt-0.5">{inquiries.filter((i) => !i.read).length} unread</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {loading ? (
            <div className="p-6 text-platinum/38 text-sm text-center">Loading…</div>
          ) : inquiries.length === 0 ? (
            <div className="p-6 text-platinum/38 text-sm text-center">No inquiries.</div>
          ) : inquiries.map((inq) => (
            <button key={inq.id} onClick={() => openInquiry(inq)}
              className={`w-full text-left px-4 py-4 hover:bg-graphite/40 transition-colors ${selected?.id === inq.id ? "bg-graphite/50" : ""}`}>
              <div className="flex items-start gap-2 mb-1">
                {!inq.read && <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />}
                <span className={`text-sm font-medium truncate ${!inq.read ? "text-cream" : "text-platinum/68"}`}>{inq.name}</span>
                <span className="text-[9px] bg-white/5 text-muted px-1.5 py-0.5 rounded-sm shrink-0 ml-auto">
                  {TYPE_LABELS[inq.type] ?? inq.type}
                </span>
              </div>
              <div className="text-[10px] text-platinum/38 truncate pl-3.5">{inq.organisation ?? inq.email}</div>
              <div className="text-xs text-platinum/30 truncate pl-3.5 mt-0.5">{inq.message.slice(0, 55)}…</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 flex flex-col">
        {selected ? (
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between px-8 py-4 bg-obsidian border-b border-white/7 z-10">
              <div>
                <h2 className="font-display font-semibold text-cream text-base">{selected.name}</h2>
                <div className="text-xs text-platinum/42 mt-0.5">
                  {selected.email}{selected.organisation ? ` · ${selected.organisation}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={`mailto:${selected.email}?subject=Re: ${TYPE_LABELS[selected.type]} — ECADEL LABS`}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-gold border border-gold/30 hover:bg-gold/5 transition-colors">
                  <Mail size={12} /> Reply via Email
                </a>
                <button onClick={() => archive(selected.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted hover:text-platinum/68 border border-white/8 hover:border-white/15 transition-all">
                  <Archive size={12} /> Archive
                </button>
              </div>
            </div>
            <div className="px-8 py-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[9px] tracking-[0.15em] uppercase text-gold bg-gold/8 border border-gold/20 px-2 py-1">
                  {TYPE_LABELS[selected.type] ?? selected.type}
                </span>
                <span className="text-[10px] text-muted font-mono">
                  {new Date(selected.createdAt).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}
                </span>
                {selected.read && <span className="flex items-center gap-1 text-[10px] text-emerald"><MailOpen size={10} /> Read</span>}
              </div>
              <div className="bg-carbon border border-white/7 p-6">
                <p className="text-platinum/72 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-platinum/30 text-sm">
            Select an inquiry to read
          </div>
        )}
      </div>
    </div>
  );
}
