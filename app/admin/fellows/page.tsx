import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FellowsAdmin() {
  const fellows = await prisma.fellow.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-cream text-2xl mb-1">Fellows & Researchers</h1>
          <p className="text-platinum/55 text-sm">{fellows.length} total</p>
        </div>
        <Link href="/admin/fellows/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-obsidian text-sm font-display font-semibold hover:bg-gold-dim transition-colors">
          <Plus size={14} /> Add Fellow
        </Link>
      </div>

      <div className="bg-carbon border border-white/7">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/7 text-[9px] tracking-[0.2em] uppercase text-muted font-mono">
          <span className="col-span-4">Name</span>
          <span className="col-span-3">Role</span>
          <span className="col-span-3">Institution</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-1"></span>
        </div>
        {fellows.length === 0 ? (
          <div className="px-6 py-12 text-center text-platinum/38 text-sm">
            No fellows yet. <Link href="/admin/fellows/new" className="text-gold hover:underline">Add the first one →</Link>
          </div>
        ) : fellows.map((f) => (
          <div key={f.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-t border-white/5 hover:bg-graphite/30 transition-colors">
            <div className="col-span-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-[10px] font-display font-bold shrink-0">
                  {f.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                </div>
                <span className="text-sm text-cream font-medium truncate">{f.name}</span>
              </div>
            </div>
            <div className="col-span-3 text-xs text-platinum/55 truncate">{f.role.replace(/-/g," ")}</div>
            <div className="col-span-3 text-xs text-platinum/38 truncate">{f.institution ?? "—"}</div>
            <div className="col-span-1">
              <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${f.active ? "bg-emerald/10 text-emerald" : "bg-white/5 text-muted"}`}>
                {f.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="col-span-1 flex justify-end">
              <Link href={`/admin/fellows/${f.id}`} className="text-platinum/38 hover:text-gold transition-colors">
                <Edit size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
