import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const CATEGORIES: Record<string, string> = {
  "white-paper": "White Paper", "research-note": "Research Note",
  "technical-report": "Technical Report", "position-paper": "Position Paper",
};

export default async function PublicationsAdmin() {
  const pubs = await prisma.publication.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-cream text-2xl mb-1">Publications</h1>
          <p className="text-platinum/55 text-sm">{pubs.length} total</p>
        </div>
        <Link
          href="/admin/publications/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-obsidian text-sm font-display font-semibold hover:bg-gold-dim transition-colors duration-200"
        >
          <Plus size={14} />
          New Publication
        </Link>
      </div>

      <div className="bg-carbon border border-white/7">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/7 text-[9px] tracking-[0.2em] uppercase text-muted font-mono">
          <span className="col-span-5">Title</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-1"></span>
        </div>

        {pubs.length === 0 ? (
          <div className="px-6 py-12 text-center text-platinum/38 text-sm">
            No publications yet. <Link href="/admin/publications/new" className="text-gold hover:underline">Create the first one →</Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {pubs.map((pub) => (
              <div key={pub.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-graphite/30 transition-colors">
                <div className="col-span-5">
                  <div className="text-sm text-cream font-medium truncate">{pub.title}</div>
                  <div className="text-[10px] text-platinum/38 font-mono mt-0.5">{pub.slug}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] bg-white/5 text-platinum/55 px-2 py-1 rounded-sm">
                    {CATEGORIES[pub.category] ?? pub.category}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`text-[10px] px-2 py-1 rounded-sm ${pub.published ? "bg-emerald/10 text-emerald" : "bg-white/5 text-muted"}`}>
                    {pub.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="col-span-2 text-[10px] text-muted font-mono">
                  {new Date(pub.createdAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"2-digit" })}
                </div>
                <div className="col-span-1 flex items-center gap-2 justify-end">
                  <Link href={`/admin/publications/${pub.id}`} className="text-platinum/38 hover:text-gold transition-colors">
                    <Edit size={13} />
                  </Link>
                  {pub.published && (
                    <Link href={`/publications/${pub.slug}`} target="_blank" className="text-platinum/38 hover:text-sapphire transition-colors">
                      <ExternalLink size={13} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
