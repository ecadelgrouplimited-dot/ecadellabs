"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Star } from "lucide-react";
import { INPUT, FieldLabel, FormSection, Row, Btn, fieldFocus, fieldBlur } from "@/components/admin/FormField";

const ROLES = [
  { value:"research-fellow", label:"Research Fellow" },
  { value:"resident",        label:"Resident" },
  { value:"collaborator",    label:"Collaborator" },
  { value:"advisor",         label:"Advisor" },
];

export default function EditFellowPage({ params }: { params: Promise<{ id:string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({
    name:"", role:"research-fellow", bio:"", expertise:"",
    institution:"", cohort:"", linkedinUrl:"", active:true, featured:false,
  });
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]:v }));

  useEffect(() => {
    fetch(`/api/fellows/${id}`).then((r)=>r.json()).then((d) => {
      setForm({ name:d.name, role:d.role, bio:d.bio, expertise:(JSON.parse(d.expertise??"[]") as string[]).join(", "), institution:d.institution??"", cohort:d.cohort??"", linkedinUrl:d.linkedinUrl??"", active:d.active, featured:d.featured });
      setLoaded(true);
    });
  }, [id]);

  const initials = form.name.split(" ").filter(Boolean).map((n)=>n[0]).join("").slice(0,2).toUpperCase();

  async function save() {
    setSaving(true);
    try {
      await fetch(`/api/fellows/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ...form, expertise:form.expertise.split(",").map((e)=>e.trim()).filter(Boolean) }) });
      router.push("/admin/fellows");
    } finally { setSaving(false); }
  }

  async function del() {
    if (!confirm("Remove this fellow?")) return;
    await fetch(`/api/fellows/${id}`, { method:"DELETE" });
    router.push("/admin/fellows");
  }

  if (!loaded) return <div style={{ padding:"2rem 2.5rem", color:"rgba(200,196,190,0.38)" }}>Loading…</div>;

  return (
    <div style={{ padding:"2rem 2.5rem", maxWidth:"760px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <Link href="/admin/fellows" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"32px", height:"32px", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"3px", color:"rgba(200,196,190,0.55)", textDecoration:"none" }}>
            <ArrowLeft size={15} />
          </Link>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem" }}>Edit Fellow</h1>
        </div>
        <Btn onClick={del} variant="danger" size="sm"><Trash2 size={12} /> Remove</Btn>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
        <FormSection title="Identity">
          <div style={{ display:"flex", gap:"1.5rem", alignItems:"flex-start" }}>
            <div style={{ width:"64px", height:"64px", borderRadius:"50%", backgroundColor:"rgba(200,169,110,0.1)", border:"2px solid rgba(200,169,110,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1.25rem", color:"#C8A96E", flexShrink:0 }}>
              {initials || "?"}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ marginBottom:"1rem" }}>
                <FieldLabel required>Full Name</FieldLabel>
                <input value={form.name} onChange={(e)=>set("name",e.target.value)} style={{ ...INPUT, fontSize:"1.0625rem", fontFamily:"var(--font-display)", fontWeight:500 }} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <FieldLabel required>Biography</FieldLabel>
                <textarea value={form.bio} onChange={(e)=>set("bio",e.target.value)} rows={4} style={{ ...INPUT, resize:"none" }} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Role">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.5rem" }}>
            {ROLES.map((r) => {
              const active = form.role === r.value;
              return (
                <button key={r.value} type="button" onClick={()=>set("role",r.value)} style={{ padding:"0.625rem 0.75rem", borderRadius:"3px", cursor:"pointer", textAlign:"center", border:`1px solid ${active ? "#C8A96E" : "rgba(255,255,255,0.08)"}`, backgroundColor:active ? "rgba(200,169,110,0.08)" : "rgba(255,255,255,0.02)", fontSize:"0.8125rem", fontWeight:600, color:active ? "#C8A96E" : "rgba(200,196,190,0.55)", transition:"all 0.15s" }}>
                  {r.label}
                </button>
              );
            })}
          </div>
        </FormSection>

        <FormSection title="Details &amp; Links" accent="#8BA7C7">
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <Row>
              <div>
                <FieldLabel hint="comma-separated">Expertise</FieldLabel>
                <input value={form.expertise} onChange={(e)=>set("expertise",e.target.value)} style={INPUT} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <FieldLabel>Institution</FieldLabel>
                <input value={form.institution} onChange={(e)=>set("institution",e.target.value)} style={INPUT} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </Row>
            <Row>
              <div>
                <FieldLabel>Cohort</FieldLabel>
                <input value={form.cohort} onChange={(e)=>set("cohort",e.target.value)} style={INPUT} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div>
                <FieldLabel>LinkedIn</FieldLabel>
                <input value={form.linkedinUrl} onChange={(e)=>set("linkedinUrl",e.target.value)} style={INPUT} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </Row>
            <div style={{ display:"flex", gap:"1.5rem" }}>
              <label style={{ display:"flex", alignItems:"center", gap:"0.625rem", cursor:"pointer", userSelect:"none" }}>
                <input type="checkbox" checked={form.active} onChange={(e)=>set("active",e.target.checked)} style={{ accentColor:"#C8A96E", width:"14px", height:"14px" }} />
                <span style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.68)" }}>Active</span>
              </label>
              <label style={{ display:"flex", alignItems:"center", gap:"0.625rem", cursor:"pointer", userSelect:"none" }}>
                <input type="checkbox" checked={form.featured} onChange={(e)=>set("featured",e.target.checked)} style={{ accentColor:"#C8A96E", width:"14px", height:"14px" }} />
                <Star size={13} color="rgba(200,169,110,0.6)" />
                <span style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.68)" }}>Featured</span>
              </label>
            </div>
          </div>
        </FormSection>

        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"1.25rem 1.5rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px" }}>
          <Btn onClick={save} disabled={saving} variant="primary"><Save size={14} /> Save Changes</Btn>
          <Link href="/admin/fellows" style={{ marginLeft:"auto", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none" }}>Cancel</Link>
        </div>
      </div>
    </div>
  );
}
