"use client";

import { useState, useEffect } from "react";
import { Mail, Archive, Check, Inbox } from "lucide-react";

interface Inquiry { id:string; name:string; email:string; organisation?:string; type:string; message:string; read:boolean; archived:boolean; createdAt:string; }

const TYPE_LABELS: Record<string,string> = { research:"Research", fellowship:"Fellowship", partnership:"Partnership", grant:"Grant", general:"General", newsletter:"Newsletter" };
const TYPE_COLORS: Record<string,string> = { research:"#5B8FBF", fellowship:"#C8A96E", partnership:"#4ab478", grant:"#D4A24C", newsletter:"#a78bfa", general:"rgba(200,196,190,0.5)" };

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected,  setSelected]  = useState<Inquiry|null>(null);
  const [loading,   setLoading]   = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/inquiries").then((r) => r.json()).then((d) => { setInquiries(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  async function markRead(id:string) {
    await fetch(`/api/inquiries/${id}`,{ method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ read:true }) });
    setInquiries((prev) => prev.map((i) => i.id === id ? {...i, read:true} : i));
  }

  async function archive(id:string) {
    await fetch(`/api/inquiries/${id}`,{ method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ archived:true }) });
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function open(inq:Inquiry) {
    setSelected(inq);
    if (!inq.read) markRead(inq.id);
  }

  const unread = inquiries.filter((i) => !i.read).length;

  return (
    <div style={{ display:"flex", height:"calc(100vh - 0px)", overflow:"hidden" }}>
      {/* Left — list */}
      <div style={{ width:"300px", flexShrink:0, borderRight:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", backgroundColor:"#0A0C12" }}>
        <div style={{ padding:"1.5rem 1.5rem 1rem", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.125rem", marginBottom:"0.25rem" }}>Inquiries</h1>
          <p style={{ fontSize:"0.75rem", color:"rgba(200,196,190,0.42)" }}>
            {loading ? "Loading…" : `${unread} unread · ${inquiries.length} total`}
          </p>
        </div>

        <div style={{ flex:1, overflowY:"auto" }}>
          {loading ? (
            <div style={{ padding:"2rem", textAlign:"center", color:"rgba(200,196,190,0.32)", fontSize:"0.875rem" }}>Loading…</div>
          ) : inquiries.length === 0 ? (
            <div style={{ padding:"2rem", textAlign:"center" }}>
              <Inbox size={24} color="rgba(200,196,190,0.2)" style={{ margin:"0 auto 0.75rem" }} />
              <p style={{ color:"rgba(200,196,190,0.32)", fontSize:"0.875rem" }}>No inquiries yet.</p>
            </div>
          ) : inquiries.map((inq) => (
            <button
              key={inq.id}
              onClick={() => open(inq)}
              style={{
                display:"block", width:"100%", textAlign:"left",
                padding:"0.875rem 1.25rem",
                borderBottom:"1px solid rgba(255,255,255,0.04)",
                backgroundColor: selected?.id === inq.id ? "rgba(200,169,110,0.06)" : "transparent",
                borderLeft: selected?.id === inq.id ? "2px solid #C8A96E" : "2px solid transparent",
                cursor:"pointer", transition:"all 0.15s", border:"none",
              }}
              onMouseOver={(e) => { if (selected?.id !== inq.id) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
              onMouseOut={(e)  => { if (selected?.id !== inq.id) e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"0.5rem", marginBottom:"0.25rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", minWidth:0 }}>
                  {!inq.read && <span style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:"#C8A96E", flexShrink:0 }} />}
                  <span style={{ fontSize:"0.875rem", fontWeight:!inq.read ? 600 : 400, color: !inq.read ? "#F0EDE6" : "rgba(200,196,190,0.65)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {inq.name}
                  </span>
                </div>
                <span style={{ fontSize:"9px", padding:"1px 6px", borderRadius:"2px", color:TYPE_COLORS[inq.type] ?? "rgba(200,196,190,0.45)", backgroundColor:`${TYPE_COLORS[inq.type] ?? "rgba(200,196,190,0.45)"}15`, flexShrink:0 }}>
                  {TYPE_LABELS[inq.type] ?? inq.type}
                </span>
              </div>
              <p style={{ fontSize:"11px", color:"rgba(200,196,190,0.38)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingLeft: !inq.read ? "14px" : 0 }}>
                {inq.organisation ?? inq.email}
              </p>
              <p style={{ fontSize:"11px", color:"rgba(200,196,190,0.28)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:"2px", paddingLeft: !inq.read ? "14px" : 0 }}>
                {inq.message.slice(0, 55)}…
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Right — detail */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {selected ? (
          <>
            {/* Detail header */}
            <div style={{ padding:"1.25rem 2rem", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"space-between", backgroundColor:"#0A0C12" }}>
              <div style={{ minWidth:0 }}>
                <h2 style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"#F0EDE6", fontSize:"1rem", marginBottom:"2px" }}>{selected.name}</h2>
                <p style={{ fontSize:"0.75rem", color:"rgba(200,196,190,0.42)" }}>
                  {selected.email}{selected.organisation ? ` · ${selected.organisation}` : ""}
                </p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", flexShrink:0 }}>
                {selected.read && (
                  <span style={{ display:"flex", alignItems:"center", gap:"0.25rem", fontSize:"10px", color:"#4ab478" }}>
                    <Check size={11} /> Read
                  </span>
                )}
                <a href={`mailto:${selected.email}?subject=Re: ${TYPE_LABELS[selected.type] ?? selected.type} — ECADEL LABS`}
                  style={{ display:"inline-flex", alignItems:"center", gap:"0.375rem", padding:"0.5rem 0.875rem", fontSize:"0.75rem", color:"#C8A96E", border:"1px solid rgba(200,169,110,0.3)", textDecoration:"none", borderRadius:"3px" }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(200,169,110,0.06)")}
                  onMouseOut={(e)  => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Mail size={12} /> Reply
                </a>
                <button onClick={() => archive(selected.id)}
                  style={{ display:"inline-flex", alignItems:"center", gap:"0.375rem", padding:"0.5rem 0.875rem", fontSize:"0.75rem", color:"rgba(200,196,190,0.5)", border:"1px solid rgba(255,255,255,0.08)", backgroundColor:"transparent", cursor:"pointer", borderRadius:"3px" }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)")}
                  onMouseOut={(e)  => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Archive size={12} /> Archive
                </button>
              </div>
            </div>

            {/* Detail body */}
            <div style={{ flex:1, overflowY:"auto", padding:"2rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.5rem" }}>
                <span style={{ fontSize:"9px", padding:"3px 10px", borderRadius:"2px", letterSpacing:"0.12em", textTransform:"uppercase", color:TYPE_COLORS[selected.type] ?? "rgba(200,196,190,0.45)", border:`1px solid ${TYPE_COLORS[selected.type] ?? "rgba(200,196,190,0.2)"}40`, backgroundColor:`${TYPE_COLORS[selected.type] ?? "rgba(200,196,190,0.1)"}12` }}>
                  {TYPE_LABELS[selected.type] ?? selected.type}
                </span>
                <span style={{ fontSize:"10px", color:"rgba(200,196,190,0.35)", fontFamily:"monospace" }}>
                  {new Date(selected.createdAt).toLocaleString("en-GB",{ dateStyle:"long", timeStyle:"short" })}
                </span>
              </div>

              <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", padding:"1.5rem", borderRadius:"4px" }}>
                <p style={{ fontSize:"0.9375rem", color:"rgba(200,196,190,0.75)", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{selected.message}</p>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem" }}>
            <Inbox size={32} color="rgba(200,196,190,0.15)" />
            <p style={{ color:"rgba(200,196,190,0.28)", fontSize:"0.875rem" }}>Select an inquiry to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
