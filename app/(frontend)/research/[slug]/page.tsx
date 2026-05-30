import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug:string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.researchProject.findFirst({ where:{ slug, published:true } });
  if (!p) return { title:"Research Project" };
  return {
    title: p.title,
    description: p.problem.slice(0, 160),
  };
}

const STATUS_COLOR: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };

export default async function ResearchProjectPage({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  const project = await prisma.researchProject.findFirst({ where:{ slug, published:true } });
  if (!project) return notFound();

  const technologies = JSON.parse(project.technologies) as string[];
  const partners     = project.partners ? JSON.parse(project.partners) as string[] : [];

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"64rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <Link href="/research" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)", textDecoration:"none", marginBottom:"2rem" }}>
            <ArrowLeft size={14} /> All Research
          </Link>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
            <span style={{ fontSize:"8px", padding:"3px 10px", fontFamily:"monospace", letterSpacing:"0.1em", textTransform:"uppercase", borderRadius:"2px", backgroundColor:`${STATUS_COLOR[project.status]}14`, color:STATUS_COLOR[project.status] }}>
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

          {/* Meta */}
          {(technologies.length > 0 || partners.length > 0) && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem", paddingTop:"1.5rem", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              {technologies.length > 0 && (
                <div>
                  <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.38)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Technologies</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem" }}>
                    {technologies.map((t) => (
                      <span key={t} style={{ fontSize:"0.75rem", padding:"4px 10px", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.58)", fontFamily:"monospace" }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {partners.length > 0 && (
                <div>
                  <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.38)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Partner Institutions</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.375rem" }}>
                    {partners.map((p) => (
                      <span key={p} style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.62)" }}>{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
