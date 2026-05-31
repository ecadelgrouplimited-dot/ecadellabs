import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit2 } from "lucide-react";

export const dynamic = "force-dynamic";

const ROLES: Record<string,string> = {
  "research-fellow":"Research Fellow","resident":"Resident",
  "collaborator":"Collaborator","advisor":"Advisor",
};

const COL = {
  name:        { flex:"1 1 0", minWidth:0 },
  role:        { width:"150px", flexShrink:0 },
  institution: { width:"180px", flexShrink:0 },
  status:      { width:"80px",  flexShrink:0 },
  actions:     { width:"48px",  flexShrink:0, display:"flex", justifyContent:"flex-end" },
};

export default async function FellowsAdmin() {
  const fellows = await prisma.fellow.findMany({ orderBy:{ name:"asc" } });
  const active = fellows.filter((f) => f.active).length;

  return (
    <div style={{ padding:"2rem 2.5rem" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.25rem" }}>
            Fellows &amp; Researchers
          </h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)" }}>
            {fellows.length} total · {active} active
          </p>
        </div>
        <Link href="/admin/fellows/new" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.6rem 1.125rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
          <Plus size={14} /> Add Fellow
        </Link>
      </div>

      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"4px", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"0.625rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"rgba(255,255,255,0.02)" }}>
            <div style={{ ...COL.name,        fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Name</div>
          <div style={{ ...COL.role,        fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Role</div>
          <div style={{ ...COL.institution, fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Institution</div>
          <div style={{ ...COL.status,      fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Status</div>
          <div style={{ ...COL.actions }} />
        </div>

        {fellows.length === 0 ? (
          <div style={{ padding:"3rem", textAlign:"center", color:"rgba(200,196,190,0.32)", fontSize:"0.875rem" }}>
            No fellows yet.{" "}
            <Link href="/admin/fellows/new" style={{ color:"#C8A96E", textDecoration:"none" }}>Add the first one →</Link>
          </div>
        ) : fellows.map((f, i) => {
          const initials = f.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div
              key={f.id}
              style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"0.875rem 1.5rem", borderBottom: i < fellows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", transition:"background-color 0.15s" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)")}
              onMouseOut={(e)  => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div style={{ ...COL.name, display:"flex", alignItems:"center", gap:"0.75rem" }}>
                <div style={{ width:"32px", height:"32px", borderRadius:"50%", backgroundColor:"rgba(200,169,110,0.1)", border:"1px solid rgba(200,169,110,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:700, color:"#C8A96E", flexShrink:0, fontFamily:"var(--font-display)" }}>
                  {initials}
                </div>
                <span style={{ fontSize:"0.875rem", fontWeight:500, color:"#F0EDE6", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</span>
              </div>

              <div style={{ ...COL.role, fontSize:"0.8125rem", color:"rgba(200,196,190,0.55)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {ROLES[f.role] ?? f.role}
              </div>

              <div style={{ ...COL.institution, fontSize:"0.8125rem", color:"rgba(200,196,190,0.38)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {f.institution ?? "—"}
              </div>

              <div style={COL.status}>
                <span style={{ fontSize:"9px", padding:"2px 8px", borderRadius:"2px", backgroundColor: f.active ? "rgba(74,180,120,0.12)" : "rgba(255,255,255,0.04)", color: f.active ? "#4ab478" : "rgba(200,196,190,0.38)" }}>
                  {f.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div style={COL.actions}>
                <Link href={`/admin/fellows/${f.id}`} style={{ color:"rgba(200,196,190,0.38)", textDecoration:"none" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#C8A96E")} onMouseOut={(e) => (e.currentTarget.style.color = "rgba(200,196,190,0.38)")}>
                  <Edit2 size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
