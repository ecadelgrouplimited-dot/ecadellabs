import { prisma } from "@/lib/db";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = { active: "Active", completed: "Completed", planned: "Planned" };
const STATUS_COLORS: Record<string, string> = { active: "#4ab478", completed: "#5B8FBF", planned: "#D4A24C" };

export default async function ResearchPage() {
  const projects = await prisma.researchProject.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <div className="text-[9px] tracking-[0.35em] uppercase text-gold/70 font-mono mb-4">Research Agenda</div>
        <h1 className="font-display font-bold text-cream text-5xl md:text-6xl mb-6 leading-tight">
          What We Are<br /><span style={{ color: "#C8A96E" }}>Investigating.</span>
        </h1>
        <p className="text-platinum/65 text-lg leading-relaxed max-w-2xl">
          ECADEL LABS pursues research into the problems that matter most for African intelligence infrastructure — problems that are complex, underserved, and consequential.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-24 text-platinum/38">Research projects coming soon.</div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/research/${p.slug}`}
              className="group flex items-start gap-8 bg-carbon border border-white/7 p-8 hover:border-gold/20 transition-all duration-300">
              <div className="shrink-0 mt-1">
                <span className="text-[9px] px-2.5 py-1 font-mono rounded-sm"
                  style={{ background: `${STATUS_COLORS[p.status]}12`, color: STATUS_COLORS[p.status] }}>
                  {STATUS_LABELS[p.status]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-cream text-xl mb-2 group-hover:text-gold/90 transition-colors leading-snug">{p.title}</h2>
                <p className="text-platinum/60 text-sm leading-relaxed mb-4 line-clamp-2">{p.problem}</p>
                <div className="flex flex-wrap gap-2">
                  {(JSON.parse(p.technologies) as string[]).slice(0,4).map((t) => (
                    <span key={t} className="text-[9px] bg-white/5 text-platinum/42 px-2 py-0.5 rounded-sm font-mono">{t}</span>
                  ))}
                </div>
              </div>
              <ChevronRight size={18} className="text-platinum/25 group-hover:text-gold transition-colors shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
