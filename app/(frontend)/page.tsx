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

export default async function HomePage() {
  const [featuredPub, featuredProject, recentProjects, fellows] = await Promise.all([
    prisma.publication.findFirst({ where: { published: true, featured: true }, orderBy: { publishedAt: "desc" } }),
    prisma.researchProject.findFirst({ where: { published: true, featured: true } }),
    prisma.researchProject.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.fellow.count({ where: { active: true } }),
  ]);

  const CAT_LABELS: Record<string, string> = {
    "white-paper": "White Paper", "research-note": "Research Note",
    "technical-report": "Technical Report", "position-paper": "Position Paper",
  };
  const STATUS_COLORS: Record<string, string> = {
    active: "#4ab478", completed: "#5B8FBF", planned: "#D4A24C",
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-[0.35]" />
        {/* Radial glow — shifted right to complement the logo mark */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 65% 65% at 75% 52%, rgba(200,169,110,0.07) 0%, transparent 65%)",
        }} />
        {/* Subtle top fade for navbar */}
        <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(6,6,8,0.5), transparent)" }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full py-24 grid lg:grid-cols-[1fr_380px] gap-16 items-center">
          {/* Left — content */}
          <div>
            {/* Label */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px bg-gold/50" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold/80 font-mono">
                ECADEL LABS · ecadellabs.cloud
              </span>
            </div>

            <h1 className="font-display font-bold text-cream leading-[1.06] mb-6"
              style={{ fontSize: "clamp(2.6rem,4.8vw,4.6rem)" }}>
              Research &amp; Innovation<br />
              <span style={{ color: "#C8A96E" }}>Engine for Africa.</span>
            </h1>

            <p className="text-platinum/65 text-lg leading-relaxed max-w-xl mb-10">
              The research and innovation engine of ECADEL GROUP LIMITED — advancing African intelligence infrastructure through original research, academic partnerships, and applied technology for the continent.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link href="/research"
                className="flex items-center gap-2 px-7 py-3.5 bg-gold text-obsidian font-display font-semibold text-sm hover:bg-gold-dim transition-colors">
                View Research Agenda
                <ArrowRight size={15} />
              </Link>
              <Link href="/publications"
                className="flex items-center gap-2 px-7 py-3.5 border border-white/12 text-platinum/72 text-sm hover:text-cream hover:border-white/20 transition-all">
                Read Publications
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/6 border border-white/6">
              {[
                { value: DOMAINS.length.toString(),  label: "Research Domains" },
                { value: `${recentProjects.length}+`, label: "Active Projects" },
                { value: `${fellows || "1"}`,          label: "Active Fellows" },
                { value: `${GRANT_BODIES.length}`,    label: "Target Grant Bodies" },
              ].map((s) => (
                <div key={s.label} className="bg-obsidian px-5 py-5 text-center">
                  <div className="font-display font-black text-2xl mb-0.5" style={{ color: "#C8A96E" }}>{s.value}</div>
                  <div className="text-[10px] text-platinum/45 tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — logo mark */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-72 h-72 lg:w-80 lg:h-80">
              <Image
                src="/logos/ecadel_labs_transparent_1600.png"
                alt="ECADEL LABS"
                fill
                className="object-contain opacity-[0.32]"
                priority
              />
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
                className="group block bg-carbon border border-white/7 p-7 hover:border-gold/25 transition-all duration-300 h-[calc(100%-2rem)]">
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
                className="group block bg-carbon border border-white/7 p-7 hover:border-gold/25 transition-all duration-300 h-[calc(100%-2rem)]">
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
            Whether you are a researcher, university, grant body, or institution — there is a role for you in building Africa&apos;s intelligence infrastructure. Start a conversation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/fellows"
              className="px-8 py-4 bg-gold text-obsidian font-display font-semibold text-sm hover:bg-gold-dim transition-colors">
              Explore Fellowships
            </Link>
            <Link href="/contact"
              className="px-8 py-4 border border-white/12 text-platinum/72 text-sm hover:text-cream hover:border-white/20 transition-all">
              Research Partnership Inquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
