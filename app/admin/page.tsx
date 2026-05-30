import { prisma } from "@/lib/db";
import StatsCard from "@/components/admin/StatsCard";
import { FileText, FlaskConical, Users, MessageSquare, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [pubs, projects, fellows, inquiries, partnerships, unread] = await Promise.all([
    prisma.publication.count(),
    prisma.researchProject.count(),
    prisma.fellow.count({ where: { active: true } }),
    prisma.inquiry.count({ where: { archived: false } }),
    prisma.partnership.count({ where: { active: true } }),
    prisma.inquiry.count({ where: { read: false, archived: false } }),
  ]);

  const recentInquiries = await prisma.inquiry.findMany({
    where:   { archived: false },
    orderBy: { createdAt: "desc" },
    take:    5,
  });

  const LABEL_MAP: Record<string, string> = {
    research: "Research", fellowship: "Fellowship", partnership: "Partnership",
    grant: "Grant", general: "General",
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-cream text-2xl mb-1">Dashboard</h1>
        <p className="text-platinum/60 text-sm">ECADEL LABS — Research & Innovation Engine</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-10">
        <StatsCard label="Publications" value={pubs}         sub="Total" accent="#C8A96E" />
        <StatsCard label="Research"     value={projects}     sub="Projects" accent="#8BA7C7" />
        <StatsCard label="Fellows"      value={fellows}      sub="Active" accent="#C8A96E" />
        <StatsCard label="Partners"     value={partnerships} sub="Active" accent="#8BA7C7" />
        <StatsCard label="Inquiries"    value={`${unread} / ${inquiries}`} sub="Unread / Total" accent="#D4A24C" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {[
          { href: "/admin/publications/new", icon: FileText,   label: "New Publication" },
          { href: "/admin/research/new",     icon: FlaskConical,label: "New Research Project" },
          { href: "/admin/fellows/new",      icon: Users,       label: "Add Fellow" },
          { href: "/admin/partnerships",     icon: Building2,   label: "Manage Partners" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-3 p-4 bg-carbon border border-white/7 hover:border-gold/30 hover:bg-graphite transition-all duration-200 group"
          >
            <a.icon size={16} className="text-gold/70 group-hover:text-gold transition-colors" />
            <span className="text-sm text-platinum/68 group-hover:text-cream transition-colors">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent inquiries */}
      <div className="bg-carbon border border-white/7">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/7">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-gold/70" />
            <span className="font-display font-medium text-cream text-sm">Recent Inquiries</span>
            {unread > 0 && (
              <span className="text-[9px] bg-amber/20 text-amber border border-amber/30 px-2 py-0.5 font-mono rounded-sm">
                {unread} unread
              </span>
            )}
          </div>
          <Link href="/admin/inquiries" className="text-[10px] text-platinum/42 hover:text-gold transition-colors flex items-center gap-1">
            View all <ExternalLink size={10} />
          </Link>
        </div>
        {recentInquiries.length === 0 ? (
          <div className="px-6 py-8 text-center text-platinum/38 text-sm">No inquiries yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentInquiries.map((inq) => (
              <div key={inq.id} className={`px-6 py-4 flex items-start justify-between gap-4 ${!inq.read ? "bg-gold/3" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {!inq.read && <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />}
                    <span className="text-sm text-cream font-medium truncate">{inq.name}</span>
                    <span className="text-[9px] text-platinum/42 bg-white/5 px-1.5 py-0.5 rounded-sm shrink-0">
                      {LABEL_MAP[inq.type] ?? inq.type}
                    </span>
                  </div>
                  <p className="text-xs text-platinum/55 truncate">{inq.email}{inq.organisation ? ` · ${inq.organisation}` : ""}</p>
                  <p className="text-xs text-platinum/38 truncate mt-0.5">{inq.message.slice(0, 80)}{inq.message.length > 80 ? "…" : ""}</p>
                </div>
                <span className="text-[10px] text-platinum/30 font-mono shrink-0">
                  {new Date(inq.createdAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
