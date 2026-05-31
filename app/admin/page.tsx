import { prisma } from "@/lib/db";
import Link from "next/link";
import { FileText, FlaskConical, Users, Building2, MessageSquare, Plus, ExternalLink, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

const LABEL: Record<string,string>  = { research:"Research", fellowship:"Fellowship", partnership:"Partnership", grant:"Grant", general:"General", newsletter:"Newsletter" };
const TCOLOR: Record<string,string> = { research:"#5B8FBF", fellowship:"#C8A96E", partnership:"#4ab478", grant:"#D4A24C", general:"rgba(200,196,190,0.45)", newsletter:"#a78bfa" };

export default async function AdminDashboard() {
  const [pubCount, projCount, fellowCount, inqCount, partCount, unreadCount] = await Promise.all([
    prisma.publication.count(),
    prisma.researchProject.count(),
    prisma.fellow.count({ where:{ active:true } }),
    prisma.inquiry.count({ where:{ archived:false } }),
    prisma.partnership.count({ where:{ active:true } }),
    prisma.inquiry.count({ where:{ read:false, archived:false } }),
  ]);

  const [recentInquiries, breakdown, newsletterCount] = await Promise.all([
    prisma.inquiry.findMany({ where:{ archived:false }, orderBy:{ createdAt:"desc" }, take:5 }),
    prisma.inquiry.groupBy({ by:["type"], where:{ archived:false }, _count:{ id:true }, orderBy:{ _count:{ id:"desc" } } }),
    prisma.inquiry.count({ where:{ type:"newsletter", archived:false } }),
  ]);

  const STATS = [
    { label:"Publications", value:pubCount,   sub:"Total",          color:"#C8A96E", icon:FileText },
    { label:"Research",     value:projCount,  sub:"Projects",       color:"#8BA7C7", icon:FlaskConical },
    { label:"Fellows",      value:fellowCount,sub:"Active",         color:"#C8A96E", icon:Users },
    { label:"Partners",     value:partCount,  sub:"Active",         color:"#8BA7C7", icon:Building2 },
    { label:"Inquiries",    value:`${unreadCount}/${inqCount}`, sub:"Unread / Total", color:"#D4A24C", icon:MessageSquare },
  ];

  const QUICK_ACTIONS = [
    { href:"/admin/publications/new", icon:FileText,   label:"New Publication",      sub:"Write and publish a paper" },
    { href:"/admin/research/new",     icon:FlaskConical,label:"New Research Project", sub:"Add a research agenda item" },
    { href:"/admin/fellows/new",      icon:Users,       label:"Add Fellow",           sub:"Onboard a researcher" },
    { href:"/admin/partnerships",     icon:Building2,   label:"Manage Partners",      sub:"View partner institutions" },
  ];

  return (
    <div style={{ padding:"2rem 2.5rem", maxWidth:"1200px" }}>

      {/* Page title */}
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.5rem", marginBottom:"0.25rem" }}>
          Dashboard
        </h1>
        <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)" }}>ECADEL LABS — Research &amp; Innovation Engine</p>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"1px", backgroundColor:"rgba(255,255,255,0.06)", marginBottom:"2rem", border:"1px solid rgba(255,255,255,0.06)" }}>
        {STATS.map(({ label, value, sub, color, icon:Icon }) => (
          <div key={label} style={{ backgroundColor:"#0A0C12", padding:"1.25rem 1.5rem", borderLeft:`3px solid ${color}` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.75rem" }}>
              <span style={{ fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace" }}>{label}</span>
              <Icon size={14} color={`${color}80`} />
            </div>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.875rem", color, lineHeight:1, marginBottom:"0.25rem" }}>
              {value}
            </div>
            <div style={{ fontSize:"10px", color:"rgba(200,196,190,0.38)" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:"1.5rem", marginBottom:"2rem" }}>

        {/* Quick actions */}
        <div>
          <p style={{ fontSize:"8px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"0.875rem" }}>Quick Actions</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)" }}>
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.href} href={a.href} className="admin-row" style={{
                display:"flex", alignItems:"center", gap:"0.875rem",
                padding:"1rem 1.25rem", backgroundColor:"#0A0C12",
                textDecoration:"none",
              }}>
                <div style={{ width:"36px", height:"36px", borderRadius:"3px", backgroundColor:"rgba(200,169,110,0.08)", border:"1px solid rgba(200,169,110,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <a.icon size={16} color="#C8A96E" />
                </div>
                <div>
                  <div style={{ fontSize:"0.875rem", fontWeight:500, color:"#F0EDE6", marginBottom:"2px" }}>{a.label}</div>
                  <div style={{ fontSize:"10px", color:"rgba(200,196,190,0.38)" }}>{a.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Inquiry breakdown */}
        <div>
          <p style={{ fontSize:"8px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"0.875rem" }}>Inquiry Breakdown</p>
          <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", padding:"1.25rem" }}>
            {breakdown.length === 0 ? (
              <p style={{ color:"rgba(200,196,190,0.32)", fontSize:"0.8125rem", textAlign:"center", padding:"1rem 0" }}>No inquiries yet.</p>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
                {breakdown.map((item) => {
                  const pct   = Math.round((item._count.id / inqCount) * 100);
                  const color = TCOLOR[item.type] ?? "rgba(200,196,190,0.4)";
                  return (
                    <div key={item.type}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.375rem" }}>
                        <span style={{ fontSize:"10px", color:"rgba(200,196,190,0.62)" }}>{LABEL[item.type] ?? item.type}</span>
                        <span style={{ fontSize:"10px", fontFamily:"monospace", color }}>{item._count.id}</span>
                      </div>
                      <div style={{ height:"3px", backgroundColor:"rgba(255,255,255,0.06)", borderRadius:"2px", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, backgroundColor:color, borderRadius:"2px" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {newsletterCount > 0 && (
              <div style={{ marginTop:"1rem", paddingTop:"0.875rem", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <Mail size={11} color="#a78bfa" />
                <span style={{ fontSize:"10px", color:"rgba(200,196,190,0.45)" }}>{newsletterCount} newsletter subscriber{newsletterCount !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Recent inquiries ──────────────────────────────────────────── */}
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.875rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
            <p style={{ fontSize:"8px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>Recent Inquiries</p>
            {unreadCount > 0 && (
              <span style={{ fontSize:"9px", padding:"1px 7px", backgroundColor:"rgba(212,162,76,0.15)", color:"#D4A24C", border:"1px solid rgba(212,162,76,0.25)", borderRadius:"2px", fontFamily:"monospace" }}>
                {unreadCount} unread
              </span>
            )}
          </div>
          <Link href="/admin/inquiries" style={{ fontSize:"10px", color:"rgba(200,196,190,0.38)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.25rem" }}
            className="a-view">
            View all <ExternalLink size={10} />
          </Link>
        </div>

        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", overflow:"hidden" }}>
          {recentInquiries.length === 0 ? (
            <div style={{ padding:"2rem", textAlign:"center", color:"rgba(200,196,190,0.32)", fontSize:"0.8125rem" }}>No inquiries yet.</div>
          ) : recentInquiries.map((inq, i) => (
            <div key={inq.id} className="admin-row" style={{
              display:"flex", alignItems:"flex-start", gap:"1rem", padding:"0.875rem 1.25rem",
              borderBottom: i < recentInquiries.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              backgroundColor: !inq.read ? "rgba(200,169,110,0.02)" : "transparent",
            }}>
              {/* Unread dot */}
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor: !inq.read ? "#C8A96E" : "transparent", marginTop:"0.375rem", flexShrink:0 }} />

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.25rem" }}>
                  <span style={{ fontSize:"0.875rem", fontWeight: !inq.read ? 600 : 400, color:"#F0EDE6", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {inq.name}
                  </span>
                  <span style={{ fontSize:"9px", padding:"1px 6px", borderRadius:"2px", color:TCOLOR[inq.type] ?? "rgba(200,196,190,0.45)", backgroundColor:`${TCOLOR[inq.type] ?? "rgba(200,196,190,0.1)"}15`, flexShrink:0 }}>
                    {LABEL[inq.type] ?? inq.type}
                  </span>
                </div>
                <p style={{ fontSize:"11px", color:"rgba(200,196,190,0.45)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {inq.email}
                </p>
                <p style={{ fontSize:"11px", color:"rgba(200,196,190,0.32)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:"2px" }}>
                  {inq.message.slice(0, 80)}{inq.message.length > 80 ? "…" : ""}
                </p>
              </div>

              <span style={{ fontSize:"10px", color:"rgba(200,196,190,0.28)", fontFamily:"monospace", flexShrink:0, paddingTop:"2px" }}>
                {new Date(inq.createdAt).toLocaleDateString("en-GB",{ day:"2-digit", month:"short" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
