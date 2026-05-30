import { prisma } from "@/lib/db";
import Link from "next/link";
import { FileText, Download, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

const CAT_LABELS: Record<string, string> = {
  "white-paper": "White Paper", "research-note": "Research Note",
  "technical-report": "Technical Report", "position-paper": "Position Paper",
};

export default async function PublicationsPage() {
  const pubs = await prisma.publication.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <div className="text-[9px] tracking-[0.35em] uppercase text-gold/70 font-mono mb-4 flex items-center gap-2">
          <FileText size={11} className="text-gold" /> Publications
        </div>
        <h1 className="font-display font-bold text-cream text-5xl md:text-6xl mb-6 leading-tight">
          Research<br /><span style={{ color: "#C8A96E" }}>Publications.</span>
        </h1>
        <p className="text-platinum/65 text-lg leading-relaxed max-w-2xl">
          White papers, research notes, technical reports, and position papers — the written output of ECADEL LABS&apos; work on African intelligence infrastructure.
        </p>
      </div>

      {pubs.length === 0 ? (
        <div className="text-center py-24 text-platinum/38 text-sm">Publications coming soon.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-px bg-white/5">
          {pubs.map((pub) => {
            const authors = JSON.parse(pub.authors) as string[];
            const tags    = JSON.parse(pub.tags)    as string[];
            return (
              <Link key={pub.id} href={`/publications/${pub.slug}`}
                className="group bg-carbon p-8 hover:bg-graphite transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] bg-white/5 text-platinum/42 px-2 py-1 font-mono rounded-sm">
                    {CAT_LABELS[pub.category] ?? pub.category}
                  </span>
                  {pub.pdfUrl && <Download size={12} className="text-platinum/30 group-hover:text-gold transition-colors" />}
                </div>
                <h2 className="font-display font-bold text-cream text-lg mb-3 leading-snug group-hover:text-gold/90 transition-colors line-clamp-2">
                  {pub.title}
                </h2>
                <p className="text-platinum/55 text-sm leading-relaxed mb-5 line-clamp-3">{pub.abstract}</p>
                {authors.length > 0 && (
                  <div className="text-[10px] text-platinum/38 font-mono mb-4">{authors.join(", ")}</div>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.slice(0,3).map((t) => (
                      <span key={t} className="text-[9px] text-platinum/35 bg-white/4 px-1.5 py-0.5 rounded-sm">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-gold/60 group-hover:text-gold transition-colors mt-2">
                  Read <ChevronRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
