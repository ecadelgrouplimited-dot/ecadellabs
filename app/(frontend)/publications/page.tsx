import { prisma } from "@/lib/db";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const CAT_LABELS: Record<string,string> = {
  "white-paper":"White Paper","research-note":"Research Note",
  "technical-report":"Technical Report","position-paper":"Position Paper",
};

export default async function PublicationsPage() {
  const pubs = await prisma.publication.findMany({
    where: { published:true },
    orderBy: [{ featured:"desc" },{ publishedAt:"desc" }],
  });

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
            Publications
          </p>
          <h1 style={{ fontSize:"clamp(1.8rem,2.5vw,2.5rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, fontFamily:"var(--font-display)", marginBottom:"1.125rem" }}>
            Research Publications.
          </h1>
          <p style={{ color:"rgba(200,196,190,0.62)", maxWidth:"42rem", lineHeight:1.75, fontSize:"0.9375rem" }}>
            White papers, research notes, technical reports, and position papers — the written output of ECADEL LABS&apos; work on African intelligence infrastructure.
          </p>
        </div>
      </div>

      {/* ── Publication list ─────────────────────────────────────────────── */}
      <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"2.5rem 1.5rem 5rem" }}>
        {pubs.length === 0 ? (
          <div style={{ textAlign:"center", padding:"5rem 0", color:"rgba(200,196,190,0.35)", fontSize:"0.875rem" }}>
            Publications coming soon.
          </div>
        ) : (
          <div className="pub-grid" style={{ backgroundColor:"rgba(255,255,255,0.06)" }}>
            {pubs.map((pub) => {
              const authors = JSON.parse(pub.authors) as string[];
              const tags    = JSON.parse(pub.tags) as string[];
              return (
                <Link
                  key={pub.id}
                  href={`/publications/${pub.slug}`}
                  style={{ backgroundColor:"#060608", padding:"2rem", textDecoration:"none", display:"flex", flexDirection:"column", gap:"1rem", borderTop:"2px solid transparent", transition:"all 0.2s" }}
                  className="hover:bg-deep hover:border-t-gold group"
                >
                  {/* Category + PDF */}
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:"9px", padding:"3px 8px", fontFamily:"monospace", backgroundColor:"rgba(255,255,255,0.05)", color:"rgba(200,196,190,0.45)" }}>
                      {CAT_LABELS[pub.category] ?? pub.category}
                    </span>
                    {pub.pdfUrl && <Download size={12} color="rgba(200,196,190,0.3)" />}
                  </div>

                  {/* Title */}
                  <h2 style={{ fontSize:"1rem", fontWeight:600, color:"#F0EDE6", lineHeight:1.4, fontFamily:"var(--font-display)" }} className="group-hover:text-gold-80 transition-colors">
                    {pub.title}
                  </h2>

                  {/* Abstract */}
                  <p style={{ color:"rgba(200,196,190,0.5)", fontSize:"0.8125rem", lineHeight:1.7, flex:1, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical" }}>
                    {pub.abstract}
                  </p>

                  {/* Authors */}
                  {authors.length > 0 && (
                    <p style={{ fontSize:"10px", fontFamily:"monospace", color:"rgba(200,196,190,0.35)" }}>{authors.join(", ")}</p>
                  )}

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem" }}>
                      {tags.slice(0,4).map((t) => (
                        <span key={t} style={{ fontSize:"9px", padding:"2px 7px", backgroundColor:"rgba(200,169,110,0.06)", color:"rgba(200,169,110,0.5)", fontFamily:"monospace" }}>{t}</span>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize:"0.75rem", color:"rgba(200,169,110,0.65)", display:"flex", alignItems:"center", gap:"0.25rem" }}>
                    Read <ArrowRight size={12} />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
