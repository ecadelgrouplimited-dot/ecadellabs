import { prisma } from "@/lib/db";
import StatsCard from "@/components/admin/StatsCard";
import { FileText, FlaskConical, Users, MessageSquare, Building2, ExternalLink, Mail } from "lucide-react";
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

  const [recentInquiries, inquiryBreakdown, newsletterCount] = await Promise.all([
    prisma.inquiry.findMany({ where:{ archived:false }, orderBy:{ createdAt:"desc" }, take:5 }),
    prisma.inquiry.groupBy({
      by: ["type"],
      where: { archived:false },
      _count: { id:true },
      orderBy: { _count:{ id:"desc" } },
    }),
    prisma.inquiry.count({ where:{ type:"newsletter", archived:false } }),
  ]);

  const LABEL_MAP: Record<string, string> = {
    research:"Research", fellowship:"Fellowship", partnership:"Partnership",
    grant:"Grant", general:"General", newsletter:"Newsletter",
  };

  const TYPE_COLORS: Record<string, string> = {
    research:"#5B8FBF", fellowship:"#C8A96E", partnership:"#4ab478",
    grant:"#D4A24C", general:"rgba(200,196,190,0.5)", newsletter:"#a78bfa",
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

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Quick actions */}
        <div className="lg:col-span-2">
          <div className="text-[9px] tracking-[0.25em] uppercase text-muted font-mono mb-3">Quick Actions</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href:"/admin/publications/new", icon:FileText,   label:"New Publication" },
              { href:"/admin/research/new",     icon:FlaskConical,label:"New Research Project" },
              { href:"/admin/fellows/new",      icon:Users,       label:"Add Fellow" },
              { href:"/admin/partnerships",     icon:Building2,   label:"Manage Partners" },
            ].map((a) => (
              <Link key={a.href} href={a.href}
                className="flex items-center gap-3 p-4 bg-carbon border border-white/7 hover:border-gold/30 hover:bg-graphite transition-all duration-200 group">
                <a.icon size={16} className="text-gold/70 group-hover:text-gold transition-colors" />
                <span className="text-sm text-platinum/68 group-hover:text-cream transition-colors">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Inquiry breakdown */}
        <div>
          <div className="text-[9px] tracking-[0.25em] uppercase text-muted font-mono mb-3">Inquiry Breakdown</div>
          <div className="bg-carbon border border-white/7 p-4">
            {inquiryBreakdown.length === 0 ? (
              <p className="text-platinum/38 text-sm text-center py-4">No inquiries yet.</p>
            ) : (
              <div className="space-y-3">
                {inquiryBreakdown.map((item) => {
                  const pct = Math.round((item._count.id / inquiries) * 100);
                  const color = TYPE_COLORS[item.type] ?? "rgba(200,196,190,0.4)";
                  return (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-platinum/68">{LABEL_MAP[item.type] ?? item.type}</span>
                        <span className="text-[10px] font-mono" style={{ color }}>{item._count.id}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${pct}%`, backgroundColor:color, opacity:0.7 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {newsletterCount > 0 && (
              <div className="mt-4 pt-3 border-t border-white/7 flex items-center gap-2">
                <Mail size={12} className="text-purple-400/70" />
                <span className="text-[10px] text-platinum/55">{newsletterCount} newsletter subscriber{newsletterCount !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </div>
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
                  <p className="text-xs text-platinum/55 truncate">{inq.email}</p>
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
