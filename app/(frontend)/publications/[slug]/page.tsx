import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Calendar } from "lucide-react";
import { marked } from "marked";

const CAT_LABELS: Record<string, string> = {
  "white-paper": "White Paper", "research-note": "Research Note",
  "technical-report": "Technical Report", "position-paper": "Position Paper",
};

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pub = await prisma.publication.findFirst({ where: { slug, published: true } });
  if (!pub) return notFound();

  const authors = JSON.parse(pub.authors) as string[];
  const tags    = JSON.parse(pub.tags)    as string[];
  const htmlContent = pub.content ? await marked(pub.content) : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <Link href="/publications" className="flex items-center gap-2 text-platinum/42 hover:text-cream transition-colors text-sm mb-12">
        <ArrowLeft size={14} /> All Publications
      </Link>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="text-[9px] bg-white/5 text-platinum/50 px-2.5 py-1 font-mono rounded-sm">
          {CAT_LABELS[pub.category] ?? pub.category}
        </span>
        {pub.publishedAt && (
          <span className="flex items-center gap-1.5 text-[10px] text-platinum/38 font-mono">
            <Calendar size={10} />
            {new Date(pub.publishedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        )}
        {pub.pdfUrl && (
          <a href={pub.pdfUrl} target="_blank"
            className="flex items-center gap-1.5 text-[10px] text-gold/70 hover:text-gold transition-colors ml-auto">
            <Download size={10} /> Download PDF
          </a>
        )}
      </div>

      <h1 className="font-display font-bold text-cream leading-tight mb-6" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>
        {pub.title}
      </h1>

      {authors.length > 0 && (
        <div className="text-sm text-platinum/55 mb-2">{authors.join(", ")}</div>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {tags.map((t) => (
            <span key={t} className="text-[9px] text-platinum/38 bg-white/4 px-2 py-0.5 rounded-sm font-mono">{t}</span>
          ))}
        </div>
      )}

      {/* Abstract */}
      <div className="bg-carbon border-l-2 border-gold p-6 mb-12">
        <div className="text-[9px] tracking-[0.25em] uppercase text-gold/70 font-mono mb-2">Abstract</div>
        <p className="text-platinum/72 leading-relaxed">{pub.abstract}</p>
      </div>

      {/* Full content */}
      {htmlContent && (
        <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      )}

      {/* Citation */}
      <div className="mt-16 pt-8 border-t border-white/7">
        <div className="text-[9px] tracking-[0.25em] uppercase text-muted font-mono mb-3">Cite This Work</div>
        <div className="bg-carbon border border-white/7 p-4 font-mono text-xs text-platinum/55 leading-relaxed">
          {authors.join(", ")} ({pub.publishedAt ? new Date(pub.publishedAt).getFullYear() : new Date().getFullYear()}).{" "}
          <em>{pub.title}</em>. ECADEL LABS. ecadellabs.cloud/publications/{pub.slug}
        </div>
      </div>
    </div>
  );
}
