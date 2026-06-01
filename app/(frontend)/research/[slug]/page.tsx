import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, Users } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600  // 1-hour ISR cache

export async function generateMetadata({ params }: { params: Promise<{ slug:string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.researchProject.findFirst({ where:{ slug, published:true } });
  if (!p) return { title:"Research Project" };
  return { title: p.title, description: p.problem.slice(0, 160) };
}

const STATUS_COLOR: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };

export default async function ResearchProjectPage({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  const project = await prisma.researchProject.findFirst({ where:{ slug, published:true } });
  if (!project) return notFound();

  const technologies = JSON.parse(project.technologies) as string[];
  const partners     = project.partners ? JSON.parse(project.partners) as string[] : [];

  // Related publications — match by shared tags/technologies
  const allPubs = await prisma.publication.findMany({
    where: { published:true },
    select: { id:true, slug:true, title:true, abstract:true, category:true, tags:true },
    orderBy: { publishedAt:"desc" },
    take: 20,
  });

  const related = allPubs
    .filter((pub) => {
      const pubTags = JSON.parse(pub.tags) as string[];
      return technologies.some((tech) =>
        pubTags.some((tag) => tag.toLowerCase().includes(tech.toLowerCase().split(" ")[0]) || tech.toLowerCase().includes(tag.toLowerCase()))
      );
    })
    .slice(0, 3);

  // Fall back to latest publications if no match
  const relatedPubs = related.length > 0 ? related : allPubs.slice(0, 2);

  const CAT_LABELS: Record<string,string> = {
    "white-paper":"White Paper","research-note":"Research Note",
    "technical-report":"Technical Report","position-paper":"Position Paper",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "ResearchProject",
    "name":      project.title,
    "description": project.problem,
    "url":       `https://ecadellabs.cloud/research/${project.slug}`,
    "status":    project.status,
    "funder":    { "@type":"Organization", "name":"ECADEL LABS", "url":"https://ecadellabs.cloud" },
    "researchArea": technologies.map((t) => ({ "@type":"DefinedTerm", "name":t })),
    ...(partners.length > 0 ? { "contributor": partners.map((p) => ({ "@type":"Organization", "name":p })) } : {}),
  };

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Header */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"64rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <Link href="/research" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none", marginBottom:"2rem" }}>
            <ArrowLeft size={14} /> All Research
          </Link>

          <div style={{ marginBottom:"1.25rem" }}>
            <span style={{ fontSize:"8px", padding:"3px 10px", fontFamily:"monospace", letterSpacing:"0.1em", textTransform:"uppercase", backgroundColor:`${STATUS_COLOR[project.status]}14`, color:STATUS_COLOR[project.status] }}>
              {project.status}
            </span>
          </div>

          <h1 style={{ fontSize:"clamp(1.75rem,2.5vw,2.4rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, fontFamily:"var(--font-display)", marginBottom:"1.25rem" }}>
            {project.title}
          </h1>
          <p style={{ color:"rgba(200,196,190,0.65)", fontSize:"1rem", lineHeight:1.75, maxWidth:"42rem" }}>
            {project.description}
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth:"64rem", margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"2.5rem" }}>

          {/* Research Problem */}
          <div style={{ padding:"2rem", backgroundColor:"#0A0C12", borderLeft:"3px solid #C8A96E" }}>
            <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>Research Problem</p>
            <p style={{ color:"rgba(200,196,190,0.72)", lineHeight:1.8, fontSize:"0.9375rem" }}>{project.problem}</p>
          </div>

          {/* Methodology */}
          {project.methodology && (
            <div>
              <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>Methodology</p>
              <p style={{ color:"rgba(200,196,190,0.65)", lineHeight:1.8, fontSize:"0.9375rem" }}>{project.methodology}</p>
            </div>
          )}

          {/* Outcomes */}
          {project.outcomes && (
            <div style={{ padding:"2rem", backgroundColor:"#131720", border:"1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>Outcomes &amp; Findings</p>
              <p style={{ color:"rgba(200,196,190,0.72)", lineHeight:1.8, fontSize:"0.9375rem" }}>{project.outcomes}</p>
            </div>
          )}

          {/* Technologies + Partners */}
          {(technologies.length > 0 || partners.length > 0) && (
            <div style={{ display:"flex", gap:"3rem", flexWrap:"wrap", paddingTop:"1.5rem", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              {technologies.length > 0 && (
                <div style={{ flex:1, minWidth:"200px" }}>
                  <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Technologies</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem" }}>
                    {technologies.map((t) => (
                      <Link key={t} href={`/tags/${encodeURIComponent(t)}`} style={{ fontSize:"0.75rem", padding:"4px 10px", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.58)", fontFamily:"monospace", textDecoration:"none" }}
                        className="hover:bg-gold/10 hover:text-gold transition-colors">
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {partners.length > 0 && (
                <div style={{ flex:1, minWidth:"200px" }}>
                  <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Partner Institutions</p>
                  {partners.map((p) => (
                    <div key={p} style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.62)", marginBottom:"0.25rem" }}>{p}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Collaborate CTA */}
          <div style={{ padding:"1.75rem 2rem", backgroundColor:"rgba(200,169,110,0.04)", border:"1px solid rgba(200,169,110,0.15)", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.5rem" }}>Collaborate on this Research</p>
              <p style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.58)", lineHeight:1.6 }}>
                Researchers, institutions, and domain experts are welcome to propose a collaboration on this agenda item.
              </p>
            </div>
            <Link href={`/research/${project.slug}/collaborate`} style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.75rem 1.5rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px", flexShrink:0 }}>
              <Users size={14} /> Propose Collaboration
            </Link>
          </div>

          {/* Related Publications */}
          {relatedPubs.length > 0 && (
            <div style={{ paddingTop:"2rem", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
                <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace" }}>Related Publications</p>
                <Link href="/publications" style={{ fontSize:"0.75rem", color:"rgba(200,169,110,0.65)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.25rem" }}>
                  All publications <ArrowRight size={12} />
                </Link>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)" }}>
                {relatedPubs.map((pub) => (
                  <Link key={pub.id} href={`/publications/${pub.slug}`} style={{ backgroundColor:"#060608", padding:"1.25rem 1.5rem", display:"flex", alignItems:"flex-start", gap:"1rem", textDecoration:"none" }} className="hover:bg-deep group">
                    <FileText size={14} color="rgba(200,169,110,0.5)" style={{ flexShrink:0, marginTop:"2px" }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.375rem" }}>
                        <span style={{ fontSize:"9px", padding:"2px 6px", fontFamily:"monospace", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.38)" }}>
                          {CAT_LABELS[pub.category] ?? pub.category}
                        </span>
                      </div>
                      <p style={{ fontSize:"0.875rem", fontWeight:500, color:"#F0EDE6", lineHeight:1.4, fontFamily:"var(--font-display)" }} className="group-hover:text-gold transition-colors">
                        {pub.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
