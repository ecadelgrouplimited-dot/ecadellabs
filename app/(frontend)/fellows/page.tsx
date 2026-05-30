import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  "research-fellow": "Research Fellow",
  "resident": "Resident",
  "collaborator": "Collaborator",
  "advisor": "Advisor",
};

export default async function FellowsPage() {
  const fellows = await prisma.fellow.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-20">
        <div className="text-[9px] tracking-[0.35em] uppercase text-gold/70 font-mono mb-4 flex items-center gap-2">
          <Users size={11} className="text-gold" /> Fellowship Program
        </div>
        <h1 className="font-display font-bold text-cream text-5xl md:text-6xl mb-6 leading-tight">
          Fellows &amp;<br /><span style={{ color: "#C8A96E" }}>Researchers.</span>
        </h1>
        <p className="text-platinum/65 text-lg leading-relaxed max-w-2xl">
          ECADEL LABS trains the engineers, researchers, and systems thinkers who will build Africa&apos;s intelligence infrastructure. Our fellowship programme connects ambitious Africans with the problems worth solving.
        </p>
      </div>

      {/* Fellowship value props */}
      <div className="grid md:grid-cols-3 gap-px bg-white/5 mb-20">
        {[
          { title: "Research Access", desc: "Work alongside ECADEL LABS' active research agenda on real problems with real stakes." },
          { title: "Platform Exposure", desc: "Contribute to and learn from SBB, PAME AI, SafeRoad, Hapa, and Meridian — systems in production." },
          { title: "Institutional Network", desc: "Connect with ECADEL GROUP's partners, grant bodies, and university collaborators across Africa." },
        ].map((v) => (
          <div key={v.title} className="bg-carbon p-8 group hover:bg-graphite transition-colors cursor-default">
            <div className="w-1 h-8 bg-gold mb-5" />
            <h3 className="font-display font-semibold text-cream text-base mb-2">{v.title}</h3>
            <p className="text-platinum/60 text-sm leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Current fellows */}
      {fellows.length > 0 && (
        <div className="mb-20">
          <div className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-mono mb-8">Current Fellows & Researchers</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {fellows.map((f) => {
              const expertise = JSON.parse(f.expertise) as string[];
              return (
                <div key={f.id} className="bg-carbon border border-white/7 p-7 hover:border-gold/20 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center font-display font-bold text-gold text-sm shrink-0">
                      {f.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-cream text-base">{f.name}</div>
                      <div className="text-[10px] text-gold/70 tracking-wide mt-0.5">{ROLE_LABELS[f.role] ?? f.role}</div>
                      {f.institution && <div className="text-xs text-platinum/38 mt-0.5">{f.institution}</div>}
                    </div>
                  </div>
                  <p className="text-platinum/60 text-sm leading-relaxed mb-4 line-clamp-3">{f.bio}</p>
                  {expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {expertise.slice(0,3).map((e) => (
                        <span key={e} className="text-[9px] bg-white/4 text-platinum/42 px-2 py-0.5 rounded-sm font-mono">{e}</span>
                      ))}
                    </div>
                  )}
                  {f.linkedinUrl && (
                    <a href={f.linkedinUrl} target="_blank" className="flex items-center gap-1.5 text-[10px] text-platinum/38 hover:text-gold transition-colors mt-2">
                      LinkedIn ↗
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Apply CTA */}
      <div className="border border-white/10 bg-carbon p-10 text-center">
        <div className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-mono mb-4">Join ECADEL LABS</div>
        <h2 className="font-display font-bold text-cream text-3xl mb-4">Apply for a Fellowship</h2>
        <p className="text-platinum/60 text-sm leading-relaxed max-w-xl mx-auto mb-8">
          We are looking for researchers and engineers who are deeply serious about African technology infrastructure. If that is you, reach out.
        </p>
        <Link href="/contact?type=fellowship"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-obsidian font-display font-semibold text-sm hover:bg-gold-dim transition-colors">
          Fellowship Inquiry <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
