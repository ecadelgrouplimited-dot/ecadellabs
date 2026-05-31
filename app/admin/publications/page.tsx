import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit2, ExternalLink } from "lucide-react";
import PublishToggle from "@/components/admin/PublishToggle";

export const dynamic = "force-dynamic";

const CAT: Record<string,string> = {
  "white-paper":"White Paper","research-note":"Research Note",
  "technical-report":"Technical Report","position-paper":"Position Paper",
};

// Shared cell style for consistent table layout
const COL = {
  title:    { flex:"1 1 0", minWidth:0 },
  category: { width:"140px", flexShrink:0 },
  status:   { width:"110px", flexShrink:0 },
  date:     { width:"90px",  flexShrink:0 },
  actions:  { width:"72px",  flexShrink:0, display:"flex", alignItems:"center", gap:"0.625rem", justifyContent:"flex-end" },
};

export default async function PublicationsAdmin() {
  const pubs = await prisma.publication.findMany({ orderBy:{ createdAt:"desc" } });
  const published = pubs.filter((p) => p.published).length;

  return (
    <div style={{ padding:"2rem 2.5rem" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.25rem" }}>
            Publications
          </h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)" }}>
            {pubs.length} total · {published} published
          </p>
        </div>
        <Link href="/admin/publications/new" style={{
          display:"inline-flex", alignItems:"center", gap:"0.5rem",
          padding:"0.6rem 1.125rem", backgroundColor:"#C8A96E",
          color:"#060608", fontFamily:"var(--font-display)", fontWeight:600,
          fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px",
        }}>
          <Plus size={14} /> New Publication
        </Link>
      </div>

      {/* Table */}
      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"4px", overflow:"hidden" }}>
        {/* Column headers */}
        <div style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"0.625rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"rgba(255,255,255,0.02)" }}>
          <div style={{ ...COL.title,    fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Title</div>
          <div style={{ ...COL.category, fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Category</div>
          <div style={{ ...COL.status,   fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Status</div>
          <div style={{ ...COL.date,     fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Date</div>
          <div style={{ ...COL.actions }} />
        </div>

        {pubs.length === 0 ? (
          <div style={{ padding:"3rem", textAlign:"center", color:"rgba(200,196,190,0.32)", fontSize:"0.875rem" }}>
            No publications yet.{" "}
            <Link href="/admin/publications/new" style={{ color:"#C8A96E", textDecoration:"none" }}>Create the first one →</Link>
          </div>
        ) : pubs.map((pub, i) => (
          <div
            key={pub.id}
            style={{
              display:"flex", alignItems:"center", gap:"1rem",
              padding:"0.875rem 1.5rem",
              borderBottom: i < pubs.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              transition:"background-color 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)")}
            onMouseOut={(e)  => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div style={COL.title}>
              <div style={{ fontSize:"0.875rem", fontWeight:500, color:"#F0EDE6", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:"2px" }}>
                {pub.title}
              </div>
              <div style={{ fontSize:"10px", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {pub.slug}
              </div>
            </div>

            <div style={COL.category}>
              <span style={{ fontSize:"10px", padding:"2px 8px", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.52)", borderRadius:"2px" }}>
                {CAT[pub.category] ?? pub.category}
              </span>
            </div>

            <div style={COL.status}>
              <PublishToggle id={pub.id} published={pub.published} endpoint="publications" />
            </div>

            <div style={{ ...COL.date, fontSize:"11px", color:"rgba(200,196,190,0.38)", fontFamily:"monospace" }}>
              {new Date(pub.createdAt).toLocaleDateString("en-GB",{ day:"2-digit", month:"short", year:"2-digit" })}
            </div>

            <div style={COL.actions}>
              <Link href={`/admin/publications/${pub.id}`} style={{ color:"rgba(200,196,190,0.38)", textDecoration:"none" }}
                title="Edit" onMouseOver={(e) => (e.currentTarget.style.color = "#C8A96E")} onMouseOut={(e) => (e.currentTarget.style.color = "rgba(200,196,190,0.38)")}>
                <Edit2 size={14} />
              </Link>
              {pub.published && (
                <Link href={`/publications/${pub.slug}`} target="_blank" style={{ color:"rgba(200,196,190,0.38)", textDecoration:"none" }}
                  title="View live" onMouseOver={(e) => (e.currentTarget.style.color = "#5B8FBF")} onMouseOut={(e) => (e.currentTarget.style.color = "rgba(200,196,190,0.38)")}>
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
