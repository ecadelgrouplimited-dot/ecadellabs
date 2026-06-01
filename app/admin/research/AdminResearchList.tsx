"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Edit2, ExternalLink, CheckSquare, Square, Send, EyeOff, X } from "lucide-react";
import PublishToggle from "@/components/admin/PublishToggle";

interface Project { id:string; title:string; slug:string; status:string; problem:string; published:boolean; createdAt:string }

const STATUS_COLOR: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };

export default function AdminResearchList({ projects, initialQuery }: { projects:Project[]; initialQuery:string }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [q, setQ]            = useState(initialQuery);
  const [selected, setSel]   = useState<Set<string>>(new Set());
  const [pending, startTrans]= useTransition();

  function search(val:string) {
    setQ(val);
    const p = new URLSearchParams();
    if (val) p.set("q", val);
    startTrans(() => router.push(`${pathname}?${p.toString()}`, { scroll:false }));
  }

  const toggle = (id:string) => setSel(s => { const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; });
  const clear  = () => setSel(new Set());
  const selAll = () => setSel(new Set(projects.map(p=>p.id)));

  async function bulk(publish:boolean) {
    await Promise.all([...selected].map(id =>
      fetch(`/api/research/${id}`,{ method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ published:publish }) })
    ));
    clear();
    startTrans(() => router.refresh());
  }

  const selItems = projects.filter(p=>selected.has(p.id));
  const canPub   = selItems.some(p=>!p.published);
  const canUnpub = selItems.some(p=>p.published);

  return (
    <>
      {/* Search + bulk */}
      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"0.875rem", alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, maxWidth:"320px" }}>
          <Search size={13} color="rgba(200,196,190,0.38)" style={{ position:"absolute", left:"0.75rem", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
          <input value={q} onChange={e=>search(e.target.value)} placeholder="Search projects…"
            style={{ width:"100%", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#F0EDE6", padding:"0.5rem 0.75rem 0.5rem 2.25rem", fontSize:"0.875rem", outline:"none", fontFamily:"inherit", borderRadius:"3px", boxSizing:"border-box" as const }}
            onFocus={e=>(e.target.style.borderColor="rgba(200,169,110,0.4)")}
            onBlur ={e=>(e.target.style.borderColor="rgba(255,255,255,0.08)")} />
        </div>
        {selected.size > 0 ? (
          <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
            <span style={{ fontSize:"0.8125rem", color:"#C8A96E", fontWeight:600 }}>{selected.size} selected</span>
            {canPub   && <button onClick={()=>bulk(true)}  disabled={pending} style={{ display:"flex", alignItems:"center", gap:"0.375rem", padding:"0.45rem 0.875rem", backgroundColor:"rgba(74,180,120,0.12)", border:"1px solid rgba(74,180,120,0.3)", color:"#4ab478", fontSize:"0.8125rem", cursor:"pointer", borderRadius:"3px", fontFamily:"inherit" }}><Send size={12}/>Publish</button>}
            {canUnpub && <button onClick={()=>bulk(false)} disabled={pending} style={{ display:"flex", alignItems:"center", gap:"0.375rem", padding:"0.45rem 0.875rem", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,196,190,0.65)", fontSize:"0.8125rem", cursor:"pointer", borderRadius:"3px", fontFamily:"inherit" }}><EyeOff size={12}/>Unpublish</button>}
            <button onClick={clear} style={{ fontSize:"10px", color:"rgba(200,196,190,0.42)", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.25rem" }}><X size={11}/>clear</button>
          </div>
        ) : (
          <button onClick={selAll} style={{ display:"flex", alignItems:"center", gap:"0.375rem", fontSize:"10px", color:"rgba(200,196,190,0.35)", background:"none", border:"none", cursor:"pointer", fontFamily:"monospace" }}>
            <CheckSquare size={11}/> Select all
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"4px", overflow:"hidden", opacity:pending?0.7:1, transition:"opacity 0.15s" }}>
        <div style={{ display:"flex", gap:"1rem", padding:"0.625rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"rgba(255,255,255,0.02)", fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", alignItems:"center" }}>
          <span style={{ width:"20px", flexShrink:0 }}/>
          <span style={{ flex:"1 1 0" }}>Title</span>
          <span style={{ width:"100px", flexShrink:0 }}>Status</span>
          <span style={{ width:"110px", flexShrink:0 }}>Published</span>
          <span style={{ width:"90px",  flexShrink:0 }}>Date</span>
          <span style={{ width:"72px",  flexShrink:0 }}/>
        </div>
        {projects.length === 0 ? (
          <div style={{ padding:"3rem", textAlign:"center", color:"rgba(200,196,190,0.32)", fontSize:"0.875rem" }}>
            {q ? `No projects match "${q}"` : "No projects yet."}{" "}
            <Link href="/admin/research/new" style={{ color:"#C8A96E", textDecoration:"none" }}>Create one →</Link>
          </div>
        ) : projects.map((p, i) => (
          <div key={p.id} className="admin-row" style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"0.875rem 1.5rem", borderBottom:i<projects.length-1?"1px solid rgba(255,255,255,0.05)":"none", backgroundColor:selected.has(p.id)?"rgba(200,169,110,0.04)":"transparent" }}>
            <button onClick={()=>toggle(p.id)} style={{ width:"20px", flexShrink:0, background:"none", border:"none", cursor:"pointer", color:selected.has(p.id)?"#C8A96E":"rgba(200,196,190,0.2)", padding:0 }}>
              {selected.has(p.id)?<CheckSquare size={15}/>:<Square size={15}/>}
            </button>
            <div style={{ flex:"1 1 0", minWidth:0 }}>
              <div style={{ fontSize:"0.875rem", fontWeight:500, color:"#F0EDE6", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:"2px" }}>{p.title}</div>
              <div style={{ fontSize:"10px", color:"rgba(200,196,190,0.35)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.problem.slice(0,65)}…</div>
            </div>
            <div style={{ width:"100px", flexShrink:0 }}>
              <span style={{ fontSize:"9px", padding:"2px 8px", borderRadius:"2px", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.08em", backgroundColor:`${STATUS_COLOR[p.status]}14`, color:STATUS_COLOR[p.status] }}>{p.status}</span>
            </div>
            <div style={{ width:"110px", flexShrink:0 }}>
              <PublishToggle id={p.id} published={p.published} endpoint="research"/>
            </div>
            <div style={{ width:"90px", flexShrink:0, fontSize:"11px", color:"rgba(200,196,190,0.38)", fontFamily:"monospace" }}>
              {new Date(p.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"})}
            </div>
            <div style={{ width:"72px", flexShrink:0, display:"flex", alignItems:"center", gap:"0.75rem", justifyContent:"flex-end" }}>
              <Link href={`/admin/research/${p.id}`} className="a-edit" title="Edit"><Edit2 size={14}/></Link>
              {p.published&&<Link href={`/research/${p.slug}`} target="_blank" className="a-view" title="View live"><ExternalLink size={14}/></Link>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
