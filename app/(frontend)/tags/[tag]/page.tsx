import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, FlaskConical } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ tag:string }> }): Promise<Metadata> {
  const { tag } = await params;
  const label = decodeURIComponent(tag);
  return {
    title: `#${label}`,
    description: `ECADEL LABS research and publications tagged with "${label}".`,
  };
}

const STATUS_COLORS: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };
const CAT_LABELS: Record<string,string> = {
  "white-paper":"White Paper","research-note":"Research Note",
  "technical-report":"Technical Report","position-paper":"Position Paper",
};

export default async function TagPage({ params }: { params: Promise<{ tag:string }> }) {
  const { tag } = await params;
  const label   = decodeURIComponent(tag);

  // Search by containing the tag as a JSON string value (e.g. "AI" matches ["AI","Africa"])
  const searchStr = `"${label}"`;

  const [publications, projects] = await Promise.all([
    prisma.publication.findMany({
      where: { published:true, tags:{ contains: label } },
      select: { id:true, slug:true, title:true, abstract:true, category:true, publishedAt:true },
      orderBy: [{ featured:"desc" }, { publishedAt:"desc" }],
    }),
    prisma.researchProject.findMany({
      where: { published:true, technologies:{ contains: label } },
      select: { id:true, slug:true, title:true, problem:true, status:true },
      orderBy: [{ featured:"desc" }, { createdAt:"desc" }],
    }),
  ]);

  const total = publications.length + projects.length;
  if (total === 0) return notFound();

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <Link href="/research" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none", marginBottom:"2rem" }}>
            <ArrowLeft size={14} /> Back
          </Link>

          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
            Topic
          </p>
          <h1 style={{ fontSize:"clamp(1.6rem,2.2vw,2.2rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, fontFamily:"var(--font-display)", marginBottom:"0.75rem" }}>
            #{label}
          </h1>
          <p style={{ color:"rgba(200,196,190,0.5)", fontSize:"0.875rem" }}>
            {total} item{total !== 1 ? "s" : ""} — publications and research tagged with this topic
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>

        {/* Publications */}
        {publications.length > 0 && (
          <div style={{ marginBottom:"3rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"1rem" }}>
              <FileText size={13} color="rgba(200,169,110,0.6)" />
              <span style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.6)", fontFamily:"monospace" }}>
                Publications — {publications.length}
              </span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)" }}>
              {publications.map((pub) => (
                <Link key={pub.id} href={`/publications/${pub.slug}`} style={{ backgroundColor:"#060608", padding:"1.5rem", textDecoration:"none" }} className="hover:bg-deep group">
                  <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.5rem" }}>
                    <span style={{ fontSize:"9px", fontFamily:"monospace", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.38)", padding:"2px 6px" }}>
                      {CAT_LABELS[pub.category] ?? pub.category}
                    </span>
                    {pub.publishedAt && (
                      <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.28)", fontFamily:"monospace" }}>
                        {new Date(pub.publishedAt).getFullYear()}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#F0EDE6", lineHeight:1.4, fontFamily:"var(--font-display)" }} className="group-hover:text-gold transition-colors">
                    {pub.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Research */}
        {projects.length > 0 && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"1rem" }}>
              <FlaskConical size={13} color="rgba(200,169,110,0.6)" />
              <span style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.6)", fontFamily:"monospace" }}>
                Research Projects — {projects.length}
              </span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)" }}>
              {projects.map((p) => (
                <Link key={p.id} href={`/research/${p.slug}`} style={{ backgroundColor:"#060608", padding:"1.5rem", textDecoration:"none", display:"flex", alignItems:"flex-start", gap:"0.875rem" }} className="hover:bg-deep group">
                  <span style={{ fontSize:"8px", padding:"3px 8px", fontFamily:"monospace", textTransform:"uppercase", flexShrink:0, marginTop:"3px", backgroundColor:`${STATUS_COLORS[p.status]}14`, color:STATUS_COLORS[p.status] }}>
                    {p.status}
                  </span>
                  <div>
                    <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#F0EDE6", lineHeight:1.4, fontFamily:"var(--font-display)", marginBottom:"0.375rem" }} className="group-hover:text-gold transition-colors">
                      {p.title}
                    </h3>
                    <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.48)", lineHeight:1.6, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {p.problem}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
