import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, FlaskConical, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

const GRANT_BODIES = [
  "African Development Bank",
  "Gates Foundation",
  "USAID",
  "EU Horizon",
  "World Bank IFC",
];

const DOMAINS = [
  "AI Systems & Machine Learning",
  "Mobile Money & Financial Data",
  "Consequence Intelligence",
  "Offline-First Architecture",
  "Civic Technology",
  "Road Safety Infrastructure",
];

const STATS = [
  { value: "6",  label: "Research Domains" },
  { value: "3+", label: "Active Projects" },
  { value: "1",  label: "Active Fellows" },
  { value: "5",  label: "Target Grant Bodies" },
];

const STATUS_COLORS: Record<string, string> = {
  active: "#4ab478", completed: "#5B8FBF", planned: "#D4A24C",
};

const CAT_LABELS: Record<string, string> = {
  "white-paper": "White Paper", "research-note": "Research Note",
  "technical-report": "Technical Report", "position-paper": "Position Paper",
};

export default async function HomePage() {
  const [featuredPub, featuredProject] = await Promise.all([
    prisma.publication.findFirst({ where: { published: true, featured: true }, orderBy: { publishedAt: "desc" } }),
    prisma.researchProject.findFirst({ where: { published: true, featured: true } }),
  ]);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#060608",
          paddingTop: "10rem",
          paddingBottom: "7rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid" style={{ opacity: 0.35, pointerEvents: "none" }} />
        {/* Radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 70% 50%, rgba(200,169,110,0.07) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "80rem", margin: "0 auto" }}>
          {/* Two-column layout on large screens */}
          <div style={{ display: "flex", alignItems: "center", gap: "4rem" }}>

            {/* Left column */}
            <div style={{ flex: "1 1 0", minWidth: 0 }}>

              {/* Label */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
                <div style={{ width: "2rem", height: "1px", backgroundColor: "rgba(200,169,110,0.5)" }} />
                <span style={{
                  fontSize: "0.625rem", letterSpacing: "0.4em",
                  textTransform: "uppercase", color: "rgba(200,169,110,0.8)", fontFamily: "monospace",
                }}>
                  ECADEL LABS · ecadellabs.cloud
                </span>
              </div>

              {/* Heading */}
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "#F0EDE6",
                lineHeight: 1.06,
                fontSize: "clamp(2.8rem, 4.8vw, 4.8rem)",
                marginBottom: "1.5rem",
              }}>
                Research &amp; Innovation<br />
                <span style={{ color: "#C8A96E" }}>Engine for Africa.</span>
              </h1>

              {/* Body */}
              <p style={{
                color: "rgba(200,196,190,0.65)", fontSize: "1.125rem",
                lineHeight: 1.7, maxWidth: "34rem", marginBottom: "2.5rem",
              }}>
                The research and innovation engine of ECADEL GROUP LIMITED — advancing African intelligence infrastructure through original research, academic partnerships, and applied technology for the continent.
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "3.5rem" }}>
                <Link href="/research" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.875rem 1.75rem",
                  backgroundColor: "#C8A96E", color: "#060608",
                  fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.875rem",
                  textDecoration: "none",
                }}>
                  View Research Agenda <ArrowRight size={15} />
                </Link>
                <Link href="/publications" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.875rem 1.75rem",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(200,196,190,0.72)", fontSize: "0.875rem",
                  textDecoration: "none",
                }}>
                  Read Publications
                </Link>
              </div>

              {/* Stats */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1px", backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                {STATS.map((s) => (
                  <div key={s.label} style={{
                    backgroundColor: "#060608", padding: "1.25rem 1rem",
                    textAlign: "center",
                  }}>
                    <div style={{
                      fontFamily: "var(--font-display)", fontWeight: 900,
                      fontSize: "1.75rem", color: "#C8A96E", marginBottom: "0.25rem",
                    }}>{s.value}</div>
                    <div style={{
                      fontSize: "0.625rem", color: "rgba(200,196,190,0.45)",
                      letterSpacing: "0.05em", textTransform: "uppercase",
                    }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — logo mark (large screens only) */}
            <div style={{
              flexShrink: 0, width: "340px", height: "340px",
              opacity: 0.28, display: "none",
            }} className="lg:!block">
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src="/logos/ecadel_labs_transparent_1600.png"
                  alt=""
                  fill
                  sizes="340px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Featured content ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Featured research project */}
          <div>
            <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase text-gold/70 font-mono mb-5">
              <FlaskConical size={11} className="text-gold" />
              Featured Research
            </div>
            {featuredProject ? (
              <Link href={`/research/${featuredProject.slug}`}
                className="group block bg-carbon border border-white/7 p-7 hover:border-gold/25 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] px-2 py-1 rounded-sm font-mono"
                    style={{ background: `${STATUS_COLORS[featuredProject.status]}15`, color: STATUS_COLORS[featuredProject.status] }}>
                    {featuredProject.status}
                  </span>
                </div>
                <h3 className="font-display font-bold text-cream text-xl mb-3 group-hover:text-gold/90 transition-colors leading-snug">
                  {featuredProject.title}
                </h3>
                <p className="text-platinum/60 text-sm leading-relaxed mb-5 line-clamp-3">{featuredProject.problem}</p>
                <span className="text-xs text-gold/70 group-hover:text-gold transition-colors flex items-center gap-1">
                  Read more <ChevronRight size={12} />
                </span>
              </Link>
            ) : (
              <div className="bg-carbon border border-white/7 border-dashed p-10 text-center text-platinum/30 text-sm">
                No featured research yet
              </div>
            )}
          </div>

          {/* Featured publication */}
          <div>
            <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase text-gold/70 font-mono mb-5">
              <FileText size={11} className="text-gold" />
              Latest Publication
            </div>
            {featuredPub ? (
              <Link href={`/publications/${featuredPub.slug}`}
                className="group block bg-carbon border border-white/7 p-7 hover:border-gold/25 transition-all duration-300">
                <span className="text-[9px] text-platinum/42 bg-white/5 px-2 py-1 font-mono rounded-sm mb-4 inline-block">
                  {CAT_LABELS[featuredPub.category] ?? featuredPub.category}
                </span>
                <h3 className="font-display font-bold text-cream text-xl mb-3 group-hover:text-gold/90 transition-colors leading-snug">
                  {featuredPub.title}
                </h3>
                <p className="text-platinum/60 text-sm leading-relaxed mb-5 line-clamp-3">{featuredPub.abstract}</p>
                <span className="text-xs text-gold/70 group-hover:text-gold transition-colors flex items-center gap-1">
                  Read publication <ChevronRight size={12} />
                </span>
              </Link>
            ) : (
              <div className="bg-carbon border border-white/7 border-dashed p-10 text-center text-platinum/30 text-sm">
                No publications yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Research domains ─────────────────────────────────────────────────── */}
      <section className="bg-deep border-y border-white/7">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-mono mb-8">Research Domains</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {DOMAINS.map((d) => (
              <div key={d} className="bg-deep px-6 py-5 group hover:bg-graphite transition-colors duration-200 cursor-default">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold/50 group-hover:bg-gold transition-colors" />
                  <span className="text-sm text-platinum/68 group-hover:text-cream transition-colors">{d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grant bodies ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-mono mb-3">Grant Partnerships</div>
            <h2 className="font-display font-bold text-cream text-3xl">
              Institutions We Partner<br /><span style={{ color: "#C8A96E" }}>With &amp; Pursue</span>
            </h2>
          </div>
          <Link href="/grants" className="flex items-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors pb-0.5 border-b border-gold/30 hover:border-gold self-end">
            View grant strategy <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/5">
          {GRANT_BODIES.map((g) => (
            <div key={g} className="bg-carbon px-6 py-8 text-center group hover:bg-graphite transition-colors cursor-default">
              <div className="text-sm text-platinum/65 group-hover:text-cream transition-colors font-medium">{g}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/7 bg-deep">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-mono mb-5">Get Involved</div>
          <h2 className="font-display font-bold text-cream text-4xl md:text-5xl mb-6 leading-tight">
            Research with<br /><span style={{ color: "#C8A96E" }}>ECADEL LABS.</span>
          </h2>
          <p className="text-platinum/65 text-base leading-relaxed mb-10 max-w-2xl mx-auto">
            Whether you are a researcher, university, grant body, or institution — there is a role for you in building Africa&apos;s intelligence infrastructure.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/fellows" className="px-8 py-4 bg-gold text-obsidian font-display font-semibold text-sm hover:bg-gold-dim transition-colors">
              Explore Fellowships
            </Link>
            <Link href="/contact" className="px-8 py-4 border border-white/12 text-platinum/72 text-sm hover:text-cream hover:border-white/20 transition-all">
              Research Partnership Inquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
