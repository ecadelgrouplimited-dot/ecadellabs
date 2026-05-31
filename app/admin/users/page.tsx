"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ShieldCheck, Edit3 } from "lucide-react";

interface AdminUser { id:string; name:string; email:string; role:string; createdAt:string; lastLoginAt:string|null }

const INPUT: React.CSSProperties = { width:"100%", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#F0EDE6", padding:"0.625rem 0.875rem", fontSize:"0.875rem", outline:"none", fontFamily:"inherit", borderRadius:"3px" };
const focus = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) => (e.target.style.borderColor = "rgba(200,169,110,0.5)");
const blur  = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) => (e.target.style.borderColor = "rgba(255,255,255,0.1)");

export default function UsersAdmin() {
  const [users,   setUsers]   = useState<AdminUser[]>([]);
  const [me,      setMe]      = useState<{ id:string; role:string } | null>(null);
  const [adding,  setAdding]  = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"editor" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]:v }));

  const load = async () => {
    const [usersRes, meRes] = await Promise.all([fetch("/api/admin/users"), fetch("/api/me")]);
    if (usersRes.ok) setUsers(await usersRes.json());
    if (meRes.ok)   setMe(await meRes.json());
  };
  useEffect(() => { load(); }, []);

  async function handleAdd() {
    setError(""); setSaving(true);
    try {
      const res = await fetch("/api/admin/users", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed"); }
      setAdding(false);
      setForm({ name:"", email:"", password:"", role:"editor" });
      load();
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setSaving(false); }
  }

  async function changeRole(id: string, role: string) {
    await fetch("/api/admin/users", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id, role }) });
    load();
  }

  async function deleteUser(id: string) {
    if (!confirm("Remove this admin user?")) return;
    await fetch("/api/admin/users", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id }) });
    load();
  }

  return (
    <div style={{ padding:"2rem 2.5rem", maxWidth:"760px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.25rem" }}>Admin Users</h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)" }}>Manage who can access the admin panel and what they can do.</p>
        </div>
        {me?.role === "admin" && (
          <button onClick={() => setAdding(true)} style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.6rem 1.125rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", border:"none", cursor:"pointer", borderRadius:"3px" }}>
            <Plus size={14} /> Add User
          </button>
        )}
      </div>

      {/* Role legend */}
      <div style={{ display:"flex", gap:"1.5rem", padding:"1rem 1.25rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", marginBottom:"1.5rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <ShieldCheck size={14} color="#C8A96E" />
          <span style={{ fontSize:"0.8125rem", fontWeight:600, color:"#C8A96E" }}>Admin</span>
          <span style={{ fontSize:"0.75rem", color:"rgba(200,196,190,0.45)" }}>— full access including settings, users, and all content</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <Edit3 size={13} color="#5B8FBF" />
          <span style={{ fontSize:"0.8125rem", fontWeight:600, color:"#5B8FBF" }}>Editor</span>
          <span style={{ fontSize:"0.75rem", color:"rgba(200,196,190,0.45)" }}>— can create, edit and publish content; no settings or user access</span>
        </div>
      </div>

      {/* Add user form */}
      {adding && (
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.1)", borderTop:"2px solid #C8A96E", padding:"1.5rem", borderRadius:"4px", marginBottom:"1.5rem" }}>
          <h3 style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"#F0EDE6", fontSize:"0.9375rem", marginBottom:"1.25rem" }}>Add Admin User</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
            <div>
              <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Full Name *</label>
              <input value={form.name} onChange={(e)=>set("name",e.target.value)} style={INPUT} placeholder="Sarah Nakato" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Email *</label>
              <input type="email" value={form.email} onChange={(e)=>set("email",e.target.value)} style={INPUT} placeholder="sarah@ecadelgroup.com" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Password * (min 8 chars)</label>
              <input type="password" value={form.password} onChange={(e)=>set("password",e.target.value)} style={INPUT} placeholder="••••••••" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"9px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.42)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Role</label>
              <select value={form.role} onChange={(e)=>set("role",e.target.value)} style={{ ...INPUT, cursor:"pointer" }} onFocus={focus} onBlur={blur}>
                <option value="editor">Editor — can publish, cannot manage settings</option>
                <option value="admin">Admin — full access</option>
              </select>
            </div>
          </div>
          {error && <p style={{ fontSize:"0.8125rem", color:"#e05555", marginBottom:"1rem" }}>{error}</p>}
          <div style={{ display:"flex", gap:"0.75rem" }}>
            <button onClick={handleAdd} disabled={saving||!form.name||!form.email||!form.password} style={{ padding:"0.6rem 1.25rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", border:"none", cursor:"pointer", borderRadius:"3px", opacity:(saving||!form.name||!form.email||!form.password)?0.5:1 }}>
              {saving ? "Adding…" : "Add User"}
            </button>
            <button onClick={()=>{setAdding(false);setError("");}} style={{ padding:"0.6rem 1rem", backgroundColor:"transparent", color:"rgba(200,196,190,0.5)", fontSize:"0.8125rem", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer", borderRadius:"3px" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users table */}
      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"4px", overflow:"hidden" }}>
        <div style={{ display:"flex", gap:"1rem", padding:"0.625rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"rgba(255,255,255,0.02)", fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>
          <span style={{ flex:"1 1 0" }}>User</span>
          <span style={{ width:"100px", flexShrink:0 }}>Role</span>
          <span style={{ width:"120px", flexShrink:0 }}>Last Login</span>
          <span style={{ width:"48px",  flexShrink:0 }} />
        </div>
        {users.map((u, i) => (
          <div key={u.id} className="admin-row" style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1rem 1.5rem", borderBottom: i < users.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div style={{ flex:"1 1 0", minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"2px" }}>
                <span style={{ fontSize:"0.875rem", fontWeight:500, color:"#F0EDE6" }}>{u.name}</span>
                {u.id === me?.id && <span style={{ fontSize:"9px", padding:"1px 6px", backgroundColor:"rgba(200,169,110,0.12)", color:"#C8A96E", borderRadius:"2px", fontFamily:"monospace" }}>you</span>}
              </div>
              <span style={{ fontSize:"11px", color:"rgba(200,196,190,0.38)", fontFamily:"monospace" }}>{u.email}</span>
            </div>
            <div style={{ width:"100px", flexShrink:0 }}>
              {me?.role === "admin" && u.id !== me.id ? (
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  style={{ backgroundColor:"transparent", border:"1px solid rgba(255,255,255,0.1)", color: u.role==="admin" ? "#C8A96E" : "#5B8FBF", fontSize:"10px", padding:"2px 6px", borderRadius:"2px", cursor:"pointer", outline:"none" }}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              ) : (
                <span style={{ fontSize:"10px", padding:"2px 8px", borderRadius:"2px", backgroundColor: u.role==="admin" ? "rgba(200,169,110,0.12)" : "rgba(91,143,191,0.12)", color: u.role==="admin" ? "#C8A96E" : "#5B8FBF" }}>
                  {u.role}
                </span>
              )}
            </div>
            <div style={{ width:"120px", flexShrink:0, fontSize:"11px", color:"rgba(200,196,190,0.35)", fontFamily:"monospace" }}>
              {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}) : "Never"}
            </div>
            <div style={{ width:"48px", flexShrink:0, display:"flex", justifyContent:"flex-end" }}>
              {me?.role === "admin" && u.id !== me.id && (
                <button onClick={() => deleteUser(u.id)} className="a-del"><Trash2 size={13} /></button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
