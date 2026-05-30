import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, ExternalLink } from "lucide-react";
import PublishToggle from "@/components/admin/PublishToggle";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  active:    "bg-emerald/10 text-emerald",
  completed: "bg-sapphire/10 text-sapphire",
  planned:   "bg-amber/10 text-amber",
};

export default async function ResearchAdmin() {
  const projects = await prisma.researchProject.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-cream text-2xl mb-1">Research Projects</h1>
          <p className="text-platinum/55 text-sm">{projects.length} total</p>
        </div>
        <Link href="/admin/research/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-obsidian text-sm font-display font-semibold hover:bg-gold-dim transition-colors">
          <Plus size={14} /> New Project
        </Link>
      </div>

      <div className="bg-carbon border border-white/7">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/7 text-[9px] tracking-[0.2em] uppercase text-muted font-mono">
          <span className="col-span-4">Title</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2">Published</span>
          <span className="col-span-3">Date</span>
          <span className="col-span-1"></span>
        </div>
        {projects.length === 0 ? (
          <div className="px-6 py-12 text-center text-platinum/38 text-sm">
            No projects yet. <Link href="/admin/research/new" className="text-gold hover:underline">Create the first one →</Link>
          </div>
        ) : projects.map((p) => (
          <div key={p.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-t border-white/5 hover:bg-graphite/30 transition-colors">
            <div className="col-span-4">
              <div className="text-sm text-cream font-medium truncate">{p.title}</div>
              <div className="text-[10px] text-platinum/38 truncate mt-0.5">{p.problem.slice(0, 60)}…</div>
            </div>
            <div className="col-span-2">
              <span className={`text-[10px] px-2 py-1 rounded-sm ${STATUS_STYLES[p.status] ?? "bg-white/5 text-muted"}`}>
                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
              </span>
            </div>
            <div className="col-span-2">
              <PublishToggle id={p.id} published={p.published} endpoint="research" />
            </div>
            <div className="col-span-3 text-[10px] text-muted font-mono">
              {new Date(p.createdAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"2-digit" })}
            </div>
            <div className="col-span-1 flex items-center gap-2 justify-end">
              <Link href={`/admin/research/${p.id}`} className="text-platinum/38 hover:text-gold transition-colors">
                <Edit size={13} />
              </Link>
              {p.published && (
                <Link href={`/research/${p.slug}`} target="_blank" className="text-platinum/38 hover:text-sapphire transition-colors">
                  <ExternalLink size={13} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
