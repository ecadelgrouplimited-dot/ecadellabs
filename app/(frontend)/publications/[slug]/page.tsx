import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";
import { marked } from "marked";
import type { Metadata } from "next";
import EcadelReader from "@/components/frontend/EcadelReader";
import SocialShare  from "@/components/frontend/SocialShare";
import PrintButton  from "@/components/ui/PrintButton";

const BASE = "https://ecadellabs.cloud";

const CAT_LABELS: Record<string,string> = {
  "white-paper":"White Paper","research-note":"Research Note",
  "technical-report":"Technical Report","position-paper":"Position Paper",
};

const STATUS_COLORS: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };

export async function generateMetadata({ params }: { params: Promise<{ slug:string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pub = await prisma.publication.findFirst({ where:{ slug, published:true } });
  if (!pub) return { title:"Publication" };
  const authors = JSON.parse(pub.authors) as string[];
  return {
    title:       pub.title,
    description: pub.abstract.slice(0, 160),
    alternates:  { canonical:`${BASE}/publications/${pub.slug}` },
    other: {
      "citation_title":            pub.title,
      "citation_author":           authors.join("; "),
      "citation_publication_date": pub.publishedAt ? String(new Date(pub.publishedAt).getFullYear()) : "",
      "citation_journal_title":    "ECADEL LABS",
      "citation_abstract_html_url":`${BASE}/publications/${pub.slug}`,
      ...(pub.pdfUrl ? { "citation_pdf_url": pub.pdfUrl } : {}),
    },
  };
}

export default async function PublicationPage({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  const pub = await prisma.publication.findFirst({ where:{ slug, published:true } });
  if (!pub) return notFound();

  const authors     = JSON.parse(pub.authors) as string[];
  const tags        = JSON.parse(pub.tags)    as string[];
  const htmlContent = pub.content ? String(await marked(pub.content)) : null;
  const wordCount   = pub.content ? pub.content.split(/\s+/).filter(Boolean).length : 0;

  // Related research projects
  const allProjects = await prisma.researchProject.findMany({
    where: { published:true },
    select: { id:true, slug:true, title:true, status:true, technologies:true },
    orderBy: { featured:"desc" },
    take:20,
  });
  const related = allProjects.filter((p) => {
    const techs = JSON.parse(p.technologies) as string[];
    return tags.some((tag) => techs.some((t) => t.toLowerCase().includes(tag.toLowerCase().split(" ")[0]) || tag.toLowerCase().includes(t.toLowerCase())));
  }).slice(0, 3);
  const relatedProjects = related.length > 0 ? related : allProjects.slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline":      pub.title,
    "description":   pub.abstract,
    "author":        authors.map((a) => ({ "@type":"Person", "name":a })),
    "datePublished": pub.publishedAt ? new Date(pub.publishedAt).toISOString().split("T")[0] : undefined,
    "publisher":     { "@type":"Organization", "name":"ECADEL LABS", "url":"https://ecadellabs.cloud" },
    "url":           `${BASE}/publications/${pub.slug}`,
    ...(pub.pdfUrl ? { "encoding": { "@type":"MediaObject", "contentUrl":pub.pdfUrl } } : {}),
  };

  const pubUrl = `${BASE}/publications/${pub.slug}`;

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <Link href="/publications" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", textDecoration:"none", marginBottom:"2rem" }}>
            <ArrowLeft size={14} /> All Publications
          </Link>

          {/* Meta row */}
          <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:"0.75rem", marginBottom:"1.25rem" }}>
            <span style={{ fontSize:"9px", padding:"3px 8px", fontFamily:"monospace", backgroundColor:"rgba(255,255,255,0.05)", color:"rgba(200,196,190,0.45)", borderRadius:"2px" }}>
              {CAT_LABELS[pub.category] ?? pub.category}
            </span>
            {pub.publishedAt && (
              <span style={{ fontSize:"10px", color:"rgba(200,196,190,0.35)", fontFamily:"monospace" }}>
                {new Date(pub.publishedAt).toLocaleDateString("en-GB",{ day:"2-digit", month:"long", year:"numeric" })}
              </span>
            )}
            {wordCount > 0 && (
              <span style={{ fontSize:"10px", color:"rgba(200,196,190,0.28)", fontFamily:"monospace" }}>
                ~{Math.ceil(wordCount / 200)} min read
              </span>
            )}
          </div>

          <h1 style={{ fontSize:"clamp(1.6rem,2.2vw,2.2rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.15, fontFamily:"var(--font-display)", marginBottom:"1rem" }}>
            {pub.title}
          </h1>

          {authors.length > 0 && (
            <p style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.48)", marginBottom:"1rem" }}>{authors.join(", ")}</p>
          )}

          {tags.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem" }}>
              {tags.map((t) => (
                <Link key={t} href={`/tags/${encodeURIComponent(t)}`} style={{ fontSize:"9px", padding:"2px 7px", backgroundColor:"rgba(200,169,110,0.06)", color:"rgba(200,169,110,0.5)", fontFamily:"monospace", textDecoration:"none", borderRadius:"2px" }}
                  className="hover:bg-gold/15 hover:text-gold transition-colors">
                  {t}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>

        {/* Abstract */}
        <div style={{ padding:"1.75rem 2rem", backgroundColor:"#0A0C12", borderLeft:"3px solid #C8A96E", marginBottom:"2.5rem", borderRadius:"2px" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Abstract</p>
          <p style={{ color:"rgba(200,196,190,0.72)", lineHeight:1.85, fontSize:"0.9375rem" }}>{pub.abstract}</p>
        </div>

        {/* ── ECADEL LABS READER ──────────────────────────────────── */}
        <div style={{ marginBottom:"2.5rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"1rem" }}>
            {pub.pdfUrl ? "Document Viewer" : "Full Text"}
          </p>
          <EcadelReader
            documentUrl={pub.pdfUrl}
            htmlContent={htmlContent}
            title={pub.title}
            estimatedWords={wordCount}
          />
        </div>

        {/* Print button */}
        <div className="no-print" style={{ marginBottom:"2rem" }}>
          <PrintButton />
        </div>

        {/* ── Social share ────────────────────────────────────────── */}
        <SocialShare
          title={pub.title}
          url={pubUrl}
          abstract={pub.abstract}
          authors={authors}
          tags={tags}
        />

        {/* ── Related research ──────────────────────────────────── */}
        {relatedProjects.length > 0 && (
          <div style={{ marginTop:"3rem", paddingTop:"2rem", borderTop:"1px solid rgba(255,255,255,0.07)" }} className="related-content">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
              <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Related Research</p>
              <Link href="/research" style={{ fontSize:"0.75rem", color:"rgba(200,169,110,0.62)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.25rem" }}>
                All research <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)", borderRadius:"4px", overflow:"hidden" }}>
              {relatedProjects.map((p) => (
                <Link key={p.id} href={`/research/${p.slug}`} style={{ backgroundColor:"#060608", padding:"1.25rem 1.5rem", display:"flex", alignItems:"flex-start", gap:"1rem", textDecoration:"none" }} className="hover:bg-deep group">
                  <FlaskConical size={14} color="rgba(200,169,110,0.5)" style={{ flexShrink:0, marginTop:"2px" }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ marginBottom:"0.3rem" }}>
                      <span style={{ fontSize:"8px", padding:"2px 6px", fontFamily:"monospace", backgroundColor:`${STATUS_COLORS[p.status]}12`, color:STATUS_COLORS[p.status], borderRadius:"2px" }}>
                        {p.status}
                      </span>
                    </div>
                    <p style={{ fontSize:"0.875rem", fontWeight:500, color:"#F0EDE6", lineHeight:1.4, fontFamily:"var(--font-display)" }} className="group-hover:text-gold transition-colors">
                      {p.title}
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
