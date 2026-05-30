import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { marked } from "marked";

const CAT_LABELS: Record<string,string> = {
  "white-paper":"White Paper","research-note":"Research Note",
  "technical-report":"Technical Report","position-paper":"Position Paper",
};

export default async function PublicationPage({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  const pub = await prisma.publication.findFirst({ where:{ slug, published:true } });
  if (!pub) return notFound();

  const authors = JSON.parse(pub.authors) as string[];
  const tags    = JSON.parse(pub.tags) as string[];
  const html    = pub.content ? await marked(pub.content) : null;

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <Link href="/publications" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)", textDecoration:"none", marginBottom:"2rem" }}>
            <ArrowLeft size={14} /> All Publications
          </Link>

          {/* Meta row */}
          <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:"0.75rem", marginBottom:"1.25rem" }}>
            <span style={{ fontSize:"9px", padding:"3px 8px", fontFamily:"monospace", backgroundColor:"rgba(255,255,255,0.05)", color:"rgba(200,196,190,0.45)" }}>
              {CAT_LABELS[pub.category] ?? pub.category}
            </span>
            {pub.publishedAt && (
              <span style={{ fontSize:"10px", color:"rgba(200,196,190,0.38)", fontFamily:"monospace" }}>
                {new Date(pub.publishedAt).toLocaleDateString("en-GB",{ day:"2-digit", month:"long", year:"numeric" })}
              </span>
            )}
            {pub.pdfUrl && (
              <a href={pub.pdfUrl} target="_blank" style={{ display:"flex", alignItems:"center", gap:"0.375rem", fontSize:"10px", color:"rgba(200,169,110,0.7)", textDecoration:"none", marginLeft:"auto" }}>
                <Download size={11} /> Download PDF
              </a>
            )}
          </div>

          <h1 style={{ fontSize:"clamp(1.6rem,2.2vw,2.2rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.15, fontFamily:"var(--font-display)", marginBottom:"1rem" }}>
            {pub.title}
          </h1>

          {authors.length > 0 && (
            <p style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.5)", marginBottom:"1rem" }}>{authors.join(", ")}</p>
          )}

          {tags.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem" }}>
              {tags.map((t) => (
                <span key={t} style={{ fontSize:"9px", padding:"2px 7px", backgroundColor:"rgba(200,169,110,0.06)", color:"rgba(200,169,110,0.5)", fontFamily:"monospace" }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>
        {/* Abstract */}
        <div style={{ padding:"1.75rem 2rem", backgroundColor:"#0A0C12", borderLeft:"3px solid #C8A96E", marginBottom:"2.5rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Abstract</p>
          <p style={{ color:"rgba(200,196,190,0.7)", lineHeight:1.8, fontSize:"0.9375rem" }}>{pub.abstract}</p>
        </div>

        {/* Full content */}
        {html && (
          <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        )}

        {/* Citation */}
        <div style={{ marginTop:"3.5rem", paddingTop:"2rem", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Cite This Work</p>
          <div style={{ padding:"1rem 1.25rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", fontFamily:"monospace", fontSize:"0.75rem", color:"rgba(200,196,190,0.5)", lineHeight:1.7 }}>
            {authors.join(", ")} ({pub.publishedAt ? new Date(pub.publishedAt).getFullYear() : new Date().getFullYear()}).{" "}
            <em>{pub.title}</em>. ECADEL LABS. ecadellabs.cloud/publications/{pub.slug}
          </div>
        </div>
      </div>
    </div>
  );
}
