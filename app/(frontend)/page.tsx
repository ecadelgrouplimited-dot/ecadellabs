import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, FlaskConical, ChevronRight, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

const GRANT_BODIES = ["African Development Bank","Gates Foundation","USAID","EU Horizon","World Bank IFC"];
const DOMAINS = ["AI Systems & Machine Learning","Mobile Money & Financial Data","Consequence Intelligence","Offline-First Architecture","Civic Technology","Road Safety Infrastructure"];
const STATUS_COLORS: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };
const CAT_LABELS: Record<string,string> = { "white-paper":"White Paper","research-note":"Research Note","technical-report":"Technical Report","position-paper":"Position Paper" };

// Shared inline style constants
const S = {
  label: { fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase" as const, color:"rgba(200,169,110,0.72)", fontFamily:"monospace" },
  h2sm: { fontSize:"clamp(1.4rem,2vw,1.8rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.15, fontFamily:"var(--font-display)" },
};

export default async function HomePage() {
  const [featuredPub, featuredProject, projects, fellows, partners] = await Promise.all([
    prisma.publication.findFirst({ where:{ published:true, featured:true }, orderBy:{ publishedAt:"desc" } }),
    prisma.researchProject.findFirst({ where:{ published:true, featured:true } }),
    prisma.researchProject.findMany({ where:{ published:true }, orderBy:{ createdAt:"desc" }, take:3 }),
    prisma.fellow.count({ where:{ active:true } }),
    prisma.partnership.findMany({ where:{ active:true }, orderBy:[{ featured:"desc" },{ institution:"asc" }], take:8 }),
  ]);

  return (
    <div style={{ backgroundColor:"#060608" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ position:"relative", overflow:"hidden", minHeight:"100vh", display:"flex", alignItems:"center" }}>
        {/* Subtle grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(200,169,110,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,0.025) 1px,transparent 1px)", backgroundSize:"64px 64px", pointerEvents:"none" }} />
        {/* Gold glow */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 65% 55% at 72% 50%, rgba(200,169,110,0.06) 0%,transparent 65%)", pointerEvents:"none" }} />
        {/* Top fade */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"120px", background:"linear-gradient(to bottom,rgba(6,6,8,0.6),transparent)", pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:10, maxWidth:"80rem", margin:"0 auto", padding:"7rem 1.5rem 5rem", width:"100%" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"5rem" }}>

            {/* Left */}
            <div style={{ flex:"1 1 0", minWidth:0 }}>
              {/* Label */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"2rem" }}>
                <div style={{ width:"2rem", height:"1px", backgroundColor:"rgba(200,169,110,0.45)" }} />
                <span style={{ ...S.label }}>ECADEL LABS · Research & Innovation Engine</span>
              </div>

              {/* Heading */}
              <h1 style={{ fontSize:"clamp(2.4rem,3.8vw,4rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.08, fontFamily:"var(--font-display)", marginBottom:"1.5rem" }}>
                The Research Engine<br />
                <span style={{ color:"#C8A96E" }}>Behind Africa&apos;s Future.</span>
              </h1>

              <p style={{ color:"rgba(200,196,190,0.65)", fontSize:"1.0625rem", lineHeight:1.75, maxWidth:"32rem", marginBottom:"2.5rem" }}>
                ECADEL LABS is the research and innovation engine of ECADEL GROUP LIMITED — advancing African intelligence infrastructure through original research, academic partnerships, and applied technology.
              </p>

              {/* CTAs */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.875rem", marginBottom:"3.5rem" }}>
                <Link href="/research" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.8rem 1.75rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none" }}>
                  View Research Agenda <ArrowRight size={14} />
                </Link>
                <Link href="/publications" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.8rem 1.75rem", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,196,190,0.7)", fontSize:"0.8125rem", textDecoration:"none" }}>
                  Read Publications
                </Link>
              </div>

              {/* Stats */}
              <div className="stats-grid" style={{ backgroundColor:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.06)", maxWidth:"36rem" }}>
                {[
                  { v:DOMAINS.length.toString(), l:"Research Domains" },
                  { v:`${projects.length}+`, l:"Active Projects" },
                  { v:`${fellows||1}`, l:"Active Fellows" },
                  { v:"5", l:"Grant Bodies" },
                ].map((s) => (
                  <div key={s.l} style={{ backgroundColor:"#060608", padding:"1rem 0.75rem", textAlign:"center" }}>
                    <div style={{ fontFamily:"var(--font-display)", fontWeight:900, fontSize:"1.5rem", color:"#C8A96E", marginBottom:"0.2rem" }}>{s.v}</div>
                    <div style={{ fontSize:"8px", color:"rgba(200,196,190,0.42)", letterSpacing:"0.08em", textTransform:"uppercase" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — logo mark */}
            <div style={{ flexShrink:0, width:"320px", height:"320px", opacity:0.22, display:"none" }} className="lg:!block">
              <div style={{ position:"relative", width:"100%", height:"100%" }}>
                <Image src="/logos/ecadel_labs_transparent_1600.png" alt="" fill sizes="320px" className="object-contain" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED CONTENT ────────────────────────────────────────────── */}
      <section style={{ borderTop:"1px solid rgba(255,255,255,0.07)", backgroundColor:"#0A0C12" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"4rem 1.5rem" }}>
          <div className="pub-grid" style={{ backgroundColor:"rgba(255,255,255,0.07)" }}>

            {/* Featured research */}
            <div style={{ backgroundColor:"#0A0C12", padding:"2.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.5rem" }}>
                <FlaskConical size={11} color="#C8A96E" />
                <span style={{ ...S.label }}>Featured Research</span>
              </div>
              {featuredProject ? (
                <Link href={`/research/${featuredProject.slug}`} style={{ textDecoration:"none", display:"block" }} className="group">
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", marginBottom:"1rem" }}>
                    <span style={{ fontSize:"9px", padding:"3px 8px", fontFamily:"monospace", borderRadius:"2px", backgroundColor:`${STATUS_COLORS[featuredProject.status]}15`, color:STATUS_COLORS[featuredProject.status] }}>
                      {featuredProject.status}
                    </span>
                  </div>
                  <h3 style={{ ...S.h2sm, fontSize:"1.2rem", marginBottom:"0.875rem" }} className="group-hover:text-gold transition-colors">{featuredProject.title}</h3>
                  <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.875rem", lineHeight:1.7, marginBottom:"1.25rem", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{featuredProject.problem}</p>
                  <span style={{ fontSize:"0.75rem", color:"rgba(200,169,110,0.7)", display:"flex", alignItems:"center", gap:"0.25rem" }}>Read more <ChevronRight size={12} /></span>
                </Link>
              ) : (
                <div style={{ color:"rgba(200,196,190,0.3)", fontSize:"0.875rem", padding:"2rem 0" }}>No featured research yet</div>
              )}
            </div>

            {/* Featured publication */}
            <div style={{ backgroundColor:"#060608", padding:"2.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.5rem" }}>
                <FileText size={11} color="#C8A96E" />
                <span style={{ ...S.label }}>Latest Publication</span>
              </div>
              {featuredPub ? (
                <Link href={`/publications/${featuredPub.slug}`} style={{ textDecoration:"none", display:"block" }} className="group">
                  <span style={{ fontSize:"9px", fontFamily:"monospace", padding:"3px 8px", backgroundColor:"rgba(255,255,255,0.05)", color:"rgba(200,196,190,0.42)", borderRadius:"2px", marginBottom:"1rem", display:"inline-block" }}>
                    {CAT_LABELS[featuredPub.category] ?? featuredPub.category}
                  </span>
                  <h3 style={{ ...S.h2sm, fontSize:"1.2rem", marginBottom:"0.875rem" }} className="group-hover:text-gold transition-colors">{featuredPub.title}</h3>
                  <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.875rem", lineHeight:1.7, marginBottom:"1.25rem", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{featuredPub.abstract}</p>
                  <span style={{ fontSize:"0.75rem", color:"rgba(200,169,110,0.7)", display:"flex", alignItems:"center", gap:"0.25rem" }}>Read publication <ChevronRight size={12} /></span>
                </Link>
              ) : (
                <div style={{ color:"rgba(200,196,190,0.3)", fontSize:"0.875rem", padding:"2rem 0" }}>No publications yet</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESEARCH DOMAINS ─────────────────────────────────────────────── */}
      <section style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"3.5rem 1.5rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem" }}>
            <span style={{ ...S.label }}>Research Domains</span>
            <Link href="/research" style={{ fontSize:"0.75rem", color:"rgba(200,169,110,0.7)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.25rem" }}>
              All research <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)" }}>
            {DOMAINS.map((d) => (
              <div key={d} style={{ backgroundColor:"#060608", padding:"1rem 1.25rem", display:"flex", alignItems:"center", gap:"0.625rem" }}>
                <span style={{ width:"4px", height:"4px", borderRadius:"50%", backgroundColor:"rgba(200,169,110,0.45)", flexShrink:0 }} />
                <span style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.65)" }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRANT PARTNERSHIPS ───────────────────────────────────────────── */}
      <section style={{ borderTop:"1px solid rgba(255,255,255,0.07)", backgroundColor:"#0A0C12" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"4rem 1.5rem" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <p style={{ ...S.label, marginBottom:"0.625rem" }}>Grant Partnerships</p>
              <h2 style={{ ...S.h2sm }}>Institutions We Partner With &amp; Pursue</h2>
            </div>
            <Link href="/grants" style={{ fontSize:"0.75rem", color:"rgba(200,169,110,0.7)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.25rem", borderBottom:"1px solid rgba(200,169,110,0.3)", paddingBottom:"2px" }}>
              View grant strategy <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)" }}>
            {GRANT_BODIES.map((g) => (
              <div key={g} style={{ backgroundColor:"#131720", padding:"1.5rem 1rem", textAlign:"center" }}>
                <span style={{ fontSize:"0.8rem", color:"rgba(200,196,190,0.6)", fontWeight:500 }}>{g}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners strip ───────────────────────────────────────────────── */}
      {partners.length > 0 && (
        <section style={{ borderTop:"1px solid rgba(255,255,255,0.07)", backgroundColor:"#0A0C12" }}>
          <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"2.5rem 1.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
              <span style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>
                Partner Institutions
              </span>
              <Link href="/partnerships" style={{ fontSize:"0.75rem", color:"rgba(200,169,110,0.62)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.25rem" }}>
                All partners <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)" }}>
              {partners.map((p) => (
                <div key={p.id} style={{ backgroundColor:"#0A0C12", padding:"1rem 1.5rem", flex:"1 1 auto", minWidth:"160px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"0.8125rem", fontWeight:500, color:"rgba(200,196,190,0.62)", marginBottom:"2px" }}>{p.institution}</div>
                    <div style={{ fontSize:"8px", letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(200,196,190,0.28)", fontFamily:"monospace" }}>{p.country}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"5rem 1.5rem", textAlign:"center" }}>
          <p style={{ ...S.label, marginBottom:"1.25rem" }}>Get Involved</p>
          <h2 style={{ fontSize:"clamp(1.8rem,2.5vw,2.5rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, fontFamily:"var(--font-display)", marginBottom:"1.25rem" }}>
            Research with ECADEL LABS.
          </h2>
          <p style={{ color:"rgba(200,196,190,0.6)", fontSize:"0.9375rem", lineHeight:1.75, marginBottom:"2.5rem", maxWidth:"32rem", margin:"0 auto 2.5rem" }}>
            Whether you are a researcher, university, grant body, or institution — there is a role for you in building Africa&apos;s intelligence infrastructure.
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:"0.875rem", flexWrap:"wrap" }}>
            <Link href="/fellows" style={{ padding:"0.8rem 2rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none" }}>
              Explore Fellowships
            </Link>
            <Link href="/contact" style={{ padding:"0.8rem 2rem", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,196,190,0.7)", fontSize:"0.8125rem", textDecoration:"none" }}>
              Research Partnership Inquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
