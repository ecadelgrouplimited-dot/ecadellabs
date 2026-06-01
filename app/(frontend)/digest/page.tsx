import { prisma } from "@/lib/db";
import Link from "next/link";
import { FileText, FlaskConical, Users, ArrowRight, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 300  // 5-min ISR cache;

export const metadata: Metadata = {
  title: "Research Digest",
  description: "ECADEL LABS Research Digest — a curated overview of our latest publications, active research, and institutional updates.",
};

const STATUS_COLORS: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };
const CAT_LABELS: Record<string,string> = {
  "white-paper":"White Paper","research-note":"Research Note",
  "technical-report":"Technical Report","position-paper":"Position Paper",
};

export default async function DigestPage() {
  const now   = new Date();
  const month = now.toLocaleDateString("en-GB", { month:"long", year:"numeric" });

  const [recentPubs, activeProjects, fellows, partners, allProjects] = await Promise.all([
    prisma.publication.findMany({
      where:   { published:true },
      orderBy: { publishedAt:"desc" },
      take:    5,
      select:  { id:true, slug:true, title:true, abstract:true, category:true, publishedAt:true, authors:true },
    }),
    prisma.researchProject.findMany({
      where:   { published:true, status:"active" },
      orderBy: [{ featured:"desc" },{ createdAt:"desc" }],
      take:    4,
      select:  { id:true, slug:true, title:true, problem:true, status:true, technologies:true },
    }),
    prisma.fellow.findMany({
      where:   { active:true, featured:true },
      orderBy: { name:"asc" },
      take:    3,
      select:  { id:true, slug:true, name:true, role:true, institution:true, expertise:true },
    }),
    prisma.partnership.findMany({
      where:   { active:true },
      orderBy: [{ featured:"desc" }],
      take:    4,
      select:  { id:true, institution:true, type:true, country:true },
    }),
    prisma.researchProject.count({ where:{ published:true } }),
  ]);

  const plannedProjects = await prisma.researchProject.findMany({
    where:   { published:true, status:"planned" },
    orderBy: { createdAt:"desc" },
    take:    3,
    select:  { id:true, slug:true, title:true, technologies:true },
  });

  const ROLE: Record<string,string> = { "research-fellow":"Research Fellow","resident":"Resident","collaborator":"Collaborator","advisor":"Advisor" };

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"#0A0C12" }}>
        <div style={{ maxWidth:"72rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:"1.5rem" }}>
            <div>
              <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
                ECADEL LABS · Research Digest
              </p>
              <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"clamp(1.8rem,2.5vw,2.5rem)", lineHeight:1.1, marginBottom:"0.75rem" }}>
                Research Briefing
              </h1>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", color:"rgba(200,196,190,0.42)", fontSize:"0.8125rem" }}>
                <Calendar size={13} />
                <span>{month}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
              {[
                { v:recentPubs.length,   l:"Publications" },
                { v:activeProjects.length,l:"Active Projects" },
                { v:fellows.length,      l:"Featured Fellows" },
                { v:partners.length,     l:"Partners" },
              ].map((s) => (
                <div key={s.l} style={{ textAlign:"center", padding:"0.875rem 1.25rem", backgroundColor:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"3px" }}>
                  <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.5rem", color:"#C8A96E" }}>{s.v}</div>
                  <div style={{ fontSize:"9px", color:"rgba(200,196,190,0.38)", textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"72rem", margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:"3rem" }}>

          {/* ── Main column ─────────────────────────────────────────── */}
          <div style={{ display:"flex", flexDirection:"column", gap:"3rem" }}>

            {/* Recent publications */}
            <section>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
                <FileText size={14} color="rgba(200,169,110,0.7)" />
                <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1rem" }}>Latest Publications</h2>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)", borderRadius:"4px", overflow:"hidden" }}>
                {recentPubs.map((pub) => {
                  const authors = JSON.parse(pub.authors) as string[];
                  return (
                    <Link key={pub.id} href={`/publications/${pub.slug}`} style={{ backgroundColor:"#060608", padding:"1.5rem", textDecoration:"none" }} className="hover:bg-deep group">
                      <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.625rem" }}>
                        <span style={{ fontSize:"9px", fontFamily:"monospace", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.42)", padding:"2px 6px", borderRadius:"2px" }}>
                          {CAT_LABELS[pub.category] ?? pub.category}
                        </span>
                        {pub.publishedAt && (
                          <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.28)", fontFamily:"monospace" }}>
                            {new Date(pub.publishedAt).toLocaleDateString("en-GB",{ day:"2-digit", month:"short", year:"2-digit" })}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"#F0EDE6", fontSize:"0.9375rem", lineHeight:1.4, marginBottom:"0.5rem" }} className="group-hover:text-gold transition-colors">
                        {pub.title}
                      </h3>
                      <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.5)", lineHeight:1.65, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                        {pub.abstract}
                      </p>
                      {authors.length > 0 && (
                        <p style={{ fontSize:"10px", color:"rgba(200,196,190,0.3)", fontFamily:"monospace", marginTop:"0.5rem" }}>{authors.join(", ")}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
              <Link href="/publications" style={{ display:"flex", alignItems:"center", gap:"0.375rem", fontSize:"0.8125rem", color:"rgba(200,169,110,0.65)", textDecoration:"none", marginTop:"1rem" }}>
                All publications <ArrowRight size={13} />
              </Link>
            </section>

            {/* Active research */}
            <section>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
                <FlaskConical size={14} color="rgba(200,169,110,0.7)" />
                <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1rem" }}>Active Research</h2>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)", borderRadius:"4px", overflow:"hidden" }}>
                {activeProjects.map((p) => {
                  const techs = (JSON.parse(p.technologies) as string[]).slice(0, 3);
                  return (
                    <Link key={p.id} href={`/research/${p.slug}`} style={{ backgroundColor:"#060608", padding:"1.5rem", textDecoration:"none", display:"flex", gap:"1rem" }} className="hover:bg-deep group">
                      <span style={{ fontSize:"8px", padding:"2px 8px", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.1em", flexShrink:0, marginTop:"3px", backgroundColor:`${STATUS_COLORS[p.status]}14`, color:STATUS_COLORS[p.status], borderRadius:"2px", height:"fit-content" }}>
                        {p.status}
                      </span>
                      <div>
                        <h3 style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"#F0EDE6", fontSize:"0.9375rem", lineHeight:1.4, marginBottom:"0.5rem" }} className="group-hover:text-gold transition-colors">
                          {p.title}
                        </h3>
                        <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.5)", lineHeight:1.65, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", marginBottom:"0.625rem" }}>
                          {p.problem}
                        </p>
                        <div style={{ display:"flex", gap:"0.375rem" }}>
                          {techs.map((t) => <span key={t} style={{ fontSize:"9px", padding:"1px 6px", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.38)", fontFamily:"monospace", borderRadius:"2px" }}>{t}</span>)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link href="/research" style={{ display:"flex", alignItems:"center", gap:"0.375rem", fontSize:"0.8125rem", color:"rgba(200,169,110,0.65)", textDecoration:"none", marginTop:"1rem" }}>
                Full research agenda <ArrowRight size={13} />
              </Link>
            </section>

          </div>

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <div style={{ display:"flex", flexDirection:"column", gap:"2rem" }}>

            {/* Fellow spotlight */}
            {fellows.length > 0 && (
              <section style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", padding:"1.5rem", borderRadius:"4px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
                  <Users size={13} color="rgba(200,169,110,0.65)" />
                  <h3 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"0.875rem" }}>Research Fellows</h3>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                  {fellows.map((f) => {
                    const expertise = (JSON.parse(f.expertise) as string[]).slice(0,2);
                    const initials  = f.name.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase();
                    return (
                      <Link key={f.id} href={`/fellows/${f.slug ?? f.id}`} style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem", textDecoration:"none" }} className="group">
                        <div style={{ width:"32px", height:"32px", borderRadius:"50%", backgroundColor:"rgba(200,169,110,0.1)", border:"1px solid rgba(200,169,110,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:"10px", color:"#C8A96E", flexShrink:0 }}>
                          {initials}
                        </div>
                        <div>
                          <p style={{ fontSize:"0.875rem", fontWeight:500, color:"#F0EDE6", marginBottom:"1px" }} className="group-hover:text-gold transition-colors">{f.name}</p>
                          <p style={{ fontSize:"10px", color:"rgba(200,196,190,0.42)" }}>{ROLE[f.role] ?? f.role}</p>
                          {expertise.length > 0 && (
                            <div style={{ display:"flex", gap:"0.25rem", marginTop:"0.375rem", flexWrap:"wrap" }}>
                              {expertise.map((e) => <span key={e} style={{ fontSize:"8px", padding:"1px 5px", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", borderRadius:"2px" }}>{e}</span>)}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link href="/fellows" style={{ display:"flex", alignItems:"center", gap:"0.25rem", fontSize:"0.75rem", color:"rgba(200,169,110,0.55)", textDecoration:"none", marginTop:"1.25rem", paddingTop:"1rem", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  All fellows <ArrowRight size={11} />
                </Link>
              </section>
            )}

            {/* Planned research pipeline */}
            {plannedProjects.length > 0 && (
              <section style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", padding:"1.5rem", borderRadius:"4px" }}>
                <h3 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"0.875rem", marginBottom:"1.25rem" }}>Research Pipeline</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                  {plannedProjects.map((p) => (
                    <Link key={p.id} href={`/research/${p.slug}`} style={{ textDecoration:"none" }} className="group">
                      <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.65)", lineHeight:1.4 }} className="group-hover:text-cream transition-colors">{p.title}</p>
                      <span style={{ fontSize:"8px", padding:"1px 6px", backgroundColor:"rgba(212,162,76,0.1)", color:"#D4A24C", fontFamily:"monospace", borderRadius:"2px", display:"inline-block", marginTop:"0.25rem" }}>planned</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Partner institutions */}
            {partners.length > 0 && (
              <section style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", padding:"1.5rem", borderRadius:"4px" }}>
                <h3 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"0.875rem", marginBottom:"1.25rem" }}>Partner Institutions</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                  {partners.map((p) => (
                    <div key={p.id}>
                      <p style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.68)", marginBottom:"2px" }}>{p.institution}</p>
                      <p style={{ fontSize:"9px", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>{p.country} · {p.type.replace(/-/g," ")}</p>
                    </div>
                  ))}
                </div>
                <Link href="/partnerships" style={{ display:"flex", alignItems:"center", gap:"0.25rem", fontSize:"0.75rem", color:"rgba(200,169,110,0.55)", textDecoration:"none", marginTop:"1.25rem", paddingTop:"1rem", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  All partners <ArrowRight size={11} />
                </Link>
              </section>
            )}

            {/* Subscribe CTA */}
            <section style={{ padding:"1.5rem", backgroundColor:"rgba(200,169,110,0.05)", border:"1px solid rgba(200,169,110,0.15)", borderRadius:"4px" }}>
              <p style={{ fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.75rem" }}>Stay Updated</p>
              <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.58)", lineHeight:1.65, marginBottom:"1rem" }}>
                Get the ECADEL LABS research digest delivered to your inbox.
              </p>
              <Link href="/#newsletter" style={{ display:"flex", justifyContent:"center", padding:"0.625rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
                Subscribe
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
