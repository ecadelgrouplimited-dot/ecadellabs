import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit2, ExternalLink } from "lucide-react";
import PublishToggle from "@/components/admin/PublishToggle";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };

export default async function ResearchAdmin() {
  const projects = await prisma.researchProject.findMany({ orderBy:{ createdAt:"desc" } });
  const published = projects.filter((p) => p.published).length;

  return (
    <div style={{ padding:"2rem 2.5rem" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.25rem" }}>
            Research Projects
          </h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)" }}>
            {projects.length} total · {published} published
          </p>
        </div>
        <Link href="/admin/research/new" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.6rem 1.125rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
          <Plus size={14} /> New Project
        </Link>
      </div>

      {/* Table */}
      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"4px", overflow:"hidden" }}>

        {/* Column headers */}
        <div style={{ display:"flex", gap:"1rem", padding:"0.625rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"rgba(255,255,255,0.02)", fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>
          <span style={{ flex:"1 1 0" }}>Title</span>
          <span style={{ width:"100px", flexShrink:0 }}>Status</span>
          <span style={{ width:"110px", flexShrink:0 }}>Published</span>
          <span style={{ width:"90px",  flexShrink:0 }}>Date</span>
          <span style={{ width:"72px",  flexShrink:0 }} />
        </div>

        {projects.length === 0 ? (
          <div style={{ padding:"3rem", textAlign:"center", color:"rgba(200,196,190,0.32)", fontSize:"0.875rem" }}>
            No projects yet.{" "}
            <Link href="/admin/research/new" style={{ color:"#C8A96E", textDecoration:"none" }}>Create the first one →</Link>
          </div>
        ) : projects.map((p, i) => (
          <div key={p.id} className="admin-row" style={{
            display:"flex", alignItems:"center", gap:"1rem", padding:"0.875rem 1.5rem",
            borderBottom: i < projects.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>

            {/* Title */}
            <div style={{ flex:"1 1 0", minWidth:0 }}>
              <div style={{ fontSize:"0.875rem", fontWeight:500, color:"#F0EDE6", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:"2px" }}>
                {p.title}
              </div>
              <div style={{ fontSize:"10px", color:"rgba(200,196,190,0.35)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {p.problem.slice(0, 70)}…
              </div>
            </div>

            {/* Status badge */}
            <div style={{ width:"100px", flexShrink:0 }}>
              <span style={{ fontSize:"9px", padding:"2px 8px", borderRadius:"2px", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.08em", backgroundColor:`${STATUS_COLOR[p.status]}14`, color:STATUS_COLOR[p.status] }}>
                {p.status}
              </span>
            </div>

            {/* Publish toggle */}
            <div style={{ width:"110px", flexShrink:0 }}>
              <PublishToggle id={p.id} published={p.published} endpoint="research" />
            </div>

            {/* Date */}
            <div style={{ width:"90px", flexShrink:0, fontSize:"11px", color:"rgba(200,196,190,0.38)", fontFamily:"monospace" }}>
              {new Date(p.createdAt).toLocaleDateString("en-GB",{ day:"2-digit", month:"short", year:"2-digit" })}
            </div>

            {/* Actions */}
            <div style={{ width:"72px", flexShrink:0, display:"flex", alignItems:"center", gap:"0.75rem", justifyContent:"flex-end" }}>
              <Link href={`/admin/research/${p.id}`} className="a-edit" title="Edit">
                <Edit2 size={14} />
              </Link>
              {p.published && (
                <Link href={`/research/${p.slug}`} target="_blank" className="a-view" title="View live">
                  <ExternalLink size={14} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
