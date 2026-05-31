import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, BookOpen, FlaskConical } from "lucide-react";
import type { Metadata } from "next";

const ROLE_LABELS: Record<string,string> = {
  "research-fellow":"Research Fellow","resident":"Resident",
  "collaborator":"Collaborator","advisor":"Advisor",
};

const STATUS_COLORS: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };
const CAT_LABELS: Record<string,string> = {
  "white-paper":"White Paper","research-note":"Research Note",
  "technical-report":"Technical Report","position-paper":"Position Paper",
};

export async function generateMetadata({ params }: { params: Promise<{ slug:string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = await prisma.fellow.findFirst({ where:{ OR:[{ slug },{ id:slug }], active:true } });
  if (!f) return { title:"Researcher" };
  return {
    title:       f.name,
    description: `${ROLE_LABELS[f.role] ?? f.role} at ECADEL LABS${f.institution ? ` · ${f.institution}` : ""}. ${f.bio.slice(0,140)}`,
  };
}

export default async function FellowProfilePage({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;

  // Support both slug and id (for fellows without slugs yet)
  const fellow = await prisma.fellow.findFirst({
    where: { OR:[{ slug },{ id:slug }], active:true },
  });
  if (!fellow) return notFound();

  const expertise = JSON.parse(fellow.expertise) as string[];
  const initials  = fellow.name.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase();

  // Find publications by this researcher (match name in authors)
  const publications = await prisma.publication.findMany({
    where:   { published:true, authors:{ contains: fellow.name.split(" ")[0] } },
    orderBy: { publishedAt:"desc" },
    take:    10,
    select:  { id:true, slug:true, title:true, category:true, publishedAt:true, abstract:true },
  });

  // Find research projects they're associated with (match name in partners or by domain overlap)
  const allProjects = await prisma.researchProject.findMany({
    where:   { published:true },
    orderBy: [{ featured:"desc" },{ createdAt:"desc" }],
    take:    20,
    select:  { id:true, slug:true, title:true, status:true, technologies:true, description:true },
  });
  const relatedProjects = allProjects.filter((p) => {
    const techs = JSON.parse(p.technologies) as string[];
    return expertise.some((e) => techs.some((t) =>
      t.toLowerCase().includes(e.toLowerCase().split(" ")[0]) ||
      e.toLowerCase().includes(t.toLowerCase())
    ));
  }).slice(0, 4);

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <Link href="/fellows" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none", marginBottom:"2.5rem" }}>
            <ArrowLeft size={14} /> All Fellows
          </Link>

          <div style={{ display:"flex", alignItems:"flex-start", gap:"2rem", flexWrap:"wrap" }}>
            {/* Avatar */}
            <div style={{ width:"80px", height:"80px", borderRadius:"50%", backgroundColor:"rgba(200,169,110,0.1)", border:"2px solid rgba(200,169,110,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1.75rem", color:"#C8A96E", flexShrink:0 }}>
              {initials}
            </div>

            <div style={{ flex:1, minWidth:"200px" }}>
              <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.5rem" }}>
                {ROLE_LABELS[fellow.role] ?? fellow.role}
              </p>
              <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"clamp(1.5rem,2.2vw,2rem)", lineHeight:1.1, marginBottom:"0.5rem" }}>
                {fellow.name}
              </h1>
              {fellow.institution && (
                <p style={{ fontSize:"0.9375rem", color:"rgba(200,196,190,0.52)", marginBottom:"0.75rem" }}>{fellow.institution}</p>
              )}
              {fellow.cohort && (
                <p style={{ fontSize:"9px", fontFamily:"monospace", color:"rgba(200,196,190,0.32)", marginBottom:"1rem" }}>
                  ECADEL LABS · Cohort {fellow.cohort}
                </p>
              )}

              {/* Links */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.625rem" }}>
                {fellow.linkedinUrl && (
                  <a href={fellow.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:"0.375rem", padding:"0.375rem 0.875rem", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,196,190,0.58)", fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
                    <Globe size={12} /> LinkedIn
                  </a>
                )}
                {fellow.orcid && (
                  <a href={`https://orcid.org/${fellow.orcid}`} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:"0.375rem", padding:"0.375rem 0.875rem", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,196,190,0.58)", fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
                    <ExternalLink size={12} /> ORCID
                  </a>
                )}
                {fellow.twitter && (
                  <a href={`https://x.com/${fellow.twitter.replace("@","")}`} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:"0.375rem", padding:"0.375rem 0.875rem", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,196,190,0.58)", fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
                    ↗ X / Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>

        {/* Biography */}
        <div style={{ marginBottom:"3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"1rem" }}>Biography</p>
          <p style={{ color:"rgba(200,196,190,0.72)", lineHeight:1.9, fontSize:"0.9375rem" }}>{fellow.bio}</p>
        </div>

        {/* Expertise */}
        {expertise.length > 0 && (
          <div style={{ marginBottom:"3rem" }}>
            <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"1rem" }}>Areas of Expertise</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
              {expertise.map((e) => (
                <Link key={e} href={`/tags/${encodeURIComponent(e)}`} style={{ padding:"0.5rem 1rem", backgroundColor:"rgba(200,169,110,0.06)", border:"1px solid rgba(200,169,110,0.15)", color:"rgba(200,169,110,0.7)", fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
                  {e}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {publications.length > 0 && (
          <div style={{ marginBottom:"3rem" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <BookOpen size={13} color="rgba(200,169,110,0.6)" />
                <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Publications</p>
              </div>
              <Link href="/publications" style={{ fontSize:"0.75rem", color:"rgba(200,169,110,0.6)", textDecoration:"none" }}>All publications →</Link>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)", borderRadius:"4px", overflow:"hidden" }}>
              {publications.map((pub) => (
                <Link key={pub.id} href={`/publications/${pub.slug}`} style={{ backgroundColor:"#060608", padding:"1.25rem 1.5rem", textDecoration:"none", display:"flex", flexDirection:"column", gap:"0.375rem" }} className="hover:bg-deep group">
                  <span style={{ fontSize:"9px", fontFamily:"monospace", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.38)", padding:"2px 6px", alignSelf:"flex-start", borderRadius:"2px" }}>
                    {CAT_LABELS[pub.category] ?? pub.category}
                  </span>
                  <span style={{ fontSize:"0.9375rem", fontWeight:500, color:"#F0EDE6", fontFamily:"var(--font-display)" }} className="group-hover:text-gold transition-colors">
                    {pub.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related research */}
        {relatedProjects.length > 0 && (
          <div style={{ marginBottom:"3rem" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <FlaskConical size={13} color="rgba(200,169,110,0.6)" />
                <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Research Domains</p>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)", borderRadius:"4px", overflow:"hidden" }}>
              {relatedProjects.map((p) => (
                <Link key={p.id} href={`/research/${p.slug}`} style={{ backgroundColor:"#060608", padding:"1.25rem 1.5rem", textDecoration:"none", display:"flex", alignItems:"flex-start", gap:"0.875rem" }} className="hover:bg-deep group">
                  <span style={{ fontSize:"8px", padding:"2px 8px", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.08em", flexShrink:0, marginTop:"2px", backgroundColor:`${STATUS_COLORS[p.status]}14`, color:STATUS_COLORS[p.status], borderRadius:"2px" }}>
                    {p.status}
                  </span>
                  <div>
                    <p style={{ fontSize:"0.9375rem", fontWeight:500, color:"#F0EDE6", fontFamily:"var(--font-display)", marginBottom:"0.25rem" }} className="group-hover:text-gold transition-colors">
                      {p.title}
                    </p>
                    <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)", lineHeight:1.5, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical" }}>
                      {p.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Contact / Apply CTA */}
        <div style={{ padding:"2rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", textAlign:"center" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
            Collaborate with {fellow.name.split(" ")[0]}
          </p>
          <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.875rem", lineHeight:1.7, marginBottom:"1.5rem" }}>
            Interested in collaborating on research with ECADEL LABS? Reach out through our inquiry portal.
          </p>
          <Link href={`/contact?type=research`} style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.75rem 1.75rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
            Research Inquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
