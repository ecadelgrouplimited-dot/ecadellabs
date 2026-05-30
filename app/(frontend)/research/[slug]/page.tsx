import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const STATUS_COLORS: Record<string, string> = { active: "#4ab478", completed: "#5B8FBF", planned: "#D4A24C" };

export default async function ResearchProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.researchProject.findFirst({
    where: { slug, published: true },
  });
  if (!project) return notFound();

  const technologies = JSON.parse(project.technologies) as string[];
  const partners     = project.partners ? JSON.parse(project.partners) as string[] : [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <Link href="/research" className="flex items-center gap-2 text-platinum/42 hover:text-cream transition-colors text-sm mb-12">
        <ArrowLeft size={14} /> All Research
      </Link>

      <div className="mb-3">
        <span className="text-[9px] px-2.5 py-1 font-mono rounded-sm"
          style={{ background: `${STATUS_COLORS[project.status]}12`, color: STATUS_COLORS[project.status] }}>
          {project.status}
        </span>
      </div>

      <h1 className="font-display font-bold text-cream leading-tight mb-6" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
        {project.title}
      </h1>

      <p className="text-platinum/65 text-lg leading-relaxed mb-12 pb-12 border-b border-white/7">
        {project.description}
      </p>

      <div className="space-y-10">
        {/* Problem */}
        <div>
          <div className="text-[9px] tracking-[0.25em] uppercase text-gold/70 font-mono mb-3">Research Problem</div>
          <p className="text-platinum/72 leading-relaxed">{project.problem}</p>
        </div>

        {/* Methodology */}
        {project.methodology && (
          <div>
            <div className="text-[9px] tracking-[0.25em] uppercase text-gold/70 font-mono mb-3">Methodology</div>
            <p className="text-platinum/72 leading-relaxed">{project.methodology}</p>
          </div>
        )}

        {/* Outcomes */}
        {project.outcomes && (
          <div>
            <div className="text-[9px] tracking-[0.25em] uppercase text-gold/70 font-mono mb-3">Outcomes & Findings</div>
            <div className="bg-carbon border-l-2 border-gold p-6">
              <p className="text-platinum/72 leading-relaxed">{project.outcomes}</p>
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="grid sm:grid-cols-2 gap-6 pt-8 border-t border-white/7">
          {technologies.length > 0 && (
            <div>
              <div className="text-[9px] tracking-[0.25em] uppercase text-muted font-mono mb-3">Technologies</div>
              <div className="flex flex-wrap gap-2">
                {technologies.map((t) => (
                  <span key={t} className="text-xs bg-white/5 text-platinum/60 px-2.5 py-1 font-mono">{t}</span>
                ))}
              </div>
            </div>
          )}
          {partners.length > 0 && (
            <div>
              <div className="text-[9px] tracking-[0.25em] uppercase text-muted font-mono mb-3">Partner Institutions</div>
              <div className="space-y-1">
                {partners.map((p) => (
                  <div key={p} className="text-sm text-platinum/65">{p}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
