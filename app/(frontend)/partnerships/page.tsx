import { prisma } from "@/lib/db";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  "university": "University", "research-body": "Research Body",
  "government": "Government", "ngo": "NGO", "development-bank": "Development Bank",
};

export default async function PartnershipsPage() {
  const partners = await prisma.partnership.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { institution: "asc" }],
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <div className="text-[9px] tracking-[0.35em] uppercase text-gold/70 font-mono mb-4">Institutional Partners</div>
        <h1 className="font-display font-bold text-cream text-5xl md:text-6xl mb-6 leading-tight">
          Research<br /><span style={{ color: "#C8A96E" }}>Partnerships.</span>
        </h1>
        <p className="text-platinum/65 text-lg leading-relaxed max-w-2xl mb-8">
          ECADEL LABS collaborates with universities, research institutions, development banks, and governments to advance African intelligence infrastructure research.
        </p>
        <Link href="/contact?type=partnership"
          className="inline-flex items-center gap-2 text-sm text-gold border-b border-gold/35 pb-0.5 hover:border-gold transition-all">
          Become a partner <ArrowRight size={13} />
        </Link>
      </div>

      {partners.length === 0 ? (
        <div className="text-center py-24 text-platinum/38 text-sm">Partnerships coming soon.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {partners.map((p) => (
            <div key={p.id} className="bg-carbon border border-white/7 p-7 hover:border-gold/20 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <span className="text-[9px] bg-white/5 text-platinum/42 px-2 py-1 rounded-sm font-mono">
                  {TYPE_LABELS[p.type] ?? p.type}
                </span>
                <span className="text-[10px] text-muted font-mono">{p.country}</span>
              </div>
              <h3 className="font-display font-semibold text-cream text-lg mb-3">{p.institution}</h3>
              <p className="text-platinum/55 text-sm leading-relaxed mb-4 line-clamp-3">{p.description}</p>
              {p.website && (
                <a href={p.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] text-platinum/38 hover:text-gold transition-colors">
                  <Globe size={10} /> Website ↗
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 border border-white/10 p-10 text-center">
        <h2 className="font-display font-bold text-cream text-3xl mb-4">Research With Us</h2>
        <p className="text-platinum/60 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
          Universities, research bodies, and institutions that share our commitment to African technology infrastructure are welcome to reach out about formal research partnerships.
        </p>
        <Link href="/contact?type=partnership"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-obsidian font-display font-semibold text-sm hover:bg-gold-dim transition-colors">
          Partnership Inquiry <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
