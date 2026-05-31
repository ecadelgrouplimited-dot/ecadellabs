"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Globe, ToggleLeft, ToggleRight } from "lucide-react";

interface Partnership {
  id:string; institution:string; type:string;
  country:string; description:string; website?:string; active:boolean;
}

const TYPES = ["university","research-body","government","ngo","development-bank"];
const TYPE_LABEL: Record<string,string> = { "university":"University","research-body":"Research Body","government":"Government","ngo":"NGO","development-bank":"Development Bank" };

const INPUT: React.CSSProperties = { width:"100%", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#F0EDE6", padding:"0.625rem 0.875rem", fontSize:"0.875rem", outline:"none", fontFamily:"inherit", borderRadius:"3px" };

export default function PartnershipsAdmin() {
  const [items,   setItems]   = useState<Partnership[]>([]);
  const [adding,  setAdding]  = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({ institution:"", type:"university", country:"", description:"", website:"" });
  const set = (k:string, v:string) => setForm((f) => ({ ...f, [k]:v }));

  const load = () => fetch("/api/partnerships?admin=true").then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  async function handleAdd() {
    setSaving(true);
    try {
      await fetch("/api/partnerships",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      setAdding(false);
      setForm({ institution:"", type:"university", country:"", description:"", website:"" });
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id:string) {
    if (!confirm("Remove this partnership?")) return;
    await fetch(`/api/partnerships/${id}`,{ method:"DELETE" });
    load();
  }

  async function toggleActive(id:string, active:boolean) {
    await fetch(`/api/partnerships/${id}`,{ method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ active:!active }) });
    load();
  }

  return (
    <div style={{ padding:"2rem 2.5rem" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.25rem" }}>Partnerships</h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)" }}>{items.length} total · {items.filter((i) => i.active).length} active</p>
        </div>
        <button onClick={() => setAdding(true)} style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.6rem 1.125rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", border:"none", cursor:"pointer", borderRadius:"3px" }}>
          <Plus size={14} /> Add Partner
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.1)", borderTop:"2px solid #C8A96E", padding:"1.5rem", marginBottom:"1.5rem", borderRadius:"4px" }}>
          <h3 style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"#F0EDE6", fontSize:"0.9375rem", marginBottom:"1.25rem" }}>New Partnership</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
            <div>
              <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Institution *</label>
              <input value={form.institution} onChange={(e) => set("institution", e.target.value)} style={INPUT} placeholder="Makerere University" onFocus={(e) => (e.target.style.borderColor = "rgba(200,169,110,0.5)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} style={{ ...INPUT, cursor:"pointer" }}>
                {TYPES.map((t) => <option key={t} value={t}>{t.replace(/-/g," ")}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Country *</label>
              <input value={form.country} onChange={(e) => set("country", e.target.value)} style={INPUT} placeholder="Uganda" onFocus={(e) => (e.target.style.borderColor = "rgba(200,169,110,0.5)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Website</label>
              <input value={form.website} onChange={(e) => set("website", e.target.value)} style={INPUT} placeholder="https://…" onFocus={(e) => (e.target.style.borderColor = "rgba(200,169,110,0.5)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>
          </div>
          <div style={{ marginBottom:"1rem" }}>
            <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Description *</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} style={{ ...INPUT, resize:"none" }} placeholder="Describe the partnership…" onFocus={(e) => (e.target.style.borderColor = "rgba(200,169,110,0.5)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
          </div>
          <div style={{ display:"flex", gap:"0.75rem" }}>
            <button onClick={handleAdd} disabled={saving || !form.institution || !form.description} style={{ padding:"0.6rem 1.25rem", backgroundColor:saving ? "rgba(200,169,110,0.6)" : "#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", border:"none", cursor:"pointer", borderRadius:"3px", opacity: (!form.institution || !form.description) ? 0.5 : 1 }}>
              {saving ? "Adding…" : "Add"}
            </button>
            <button onClick={() => setAdding(false)} style={{ padding:"0.6rem 1rem", backgroundColor:"transparent", color:"rgba(200,196,190,0.5)", fontSize:"0.8125rem", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer", borderRadius:"3px" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)", borderRadius:"4px", overflow:"hidden" }}>
        {items.length === 0 ? (
          <div style={{ padding:"3rem", textAlign:"center", color:"rgba(200,196,190,0.32)", fontSize:"0.875rem", backgroundColor:"#0A0C12" }}>No partnerships yet.</div>
        ) : items.map((item) => (
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1rem 1.5rem", backgroundColor:"#0A0C12" }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.25rem" }}>
                <span style={{ fontSize:"0.9375rem", fontWeight:500, color:"#F0EDE6" }}>{item.institution}</span>
                <span style={{ fontSize:"9px", padding:"1px 6px", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.42)", borderRadius:"2px" }}>{TYPE_LABEL[item.type] ?? item.type}</span>
                <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>{item.country}</span>
              </div>
              <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.description}</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", flexShrink:0 }}>
              {item.website && (
                <a href={item.website} target="_blank" style={{ color:"rgba(200,196,190,0.35)", textDecoration:"none" }} onMouseOver={(e) => (e.currentTarget.style.color = "#5B8FBF")} onMouseOut={(e) => (e.currentTarget.style.color = "rgba(200,196,190,0.35)")}>
                  <Globe size={14} />
                </a>
              )}
              <button onClick={() => toggleActive(item.id, item.active)} style={{ display:"flex", alignItems:"center", gap:"0.375rem", padding:"0.375rem 0.75rem", fontSize:"10px", border:`1px solid ${item.active ? "rgba(74,180,120,0.3)" : "rgba(255,255,255,0.1)"}`, color:item.active ? "#4ab478" : "rgba(200,196,190,0.4)", backgroundColor:"transparent", cursor:"pointer", borderRadius:"2px", transition:"all 0.15s" }}>
                {item.active ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                {item.active ? "Active" : "Inactive"}
              </button>
              <button onClick={() => handleDelete(item.id)} style={{ color:"rgba(200,196,190,0.25)", background:"none", border:"none", cursor:"pointer", padding:"0.25rem" }} onMouseOver={(e) => (e.currentTarget.style.color = "#e05555")} onMouseOut={(e) => (e.currentTarget.style.color = "rgba(200,196,190,0.25)")}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
