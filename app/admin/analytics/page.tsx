import { prisma } from "@/lib/db";
import { BarChart2, Eye, TrendingUp, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsAdmin() {
  const now   = new Date();
  const day7  = new Date(now.getTime() - 7  * 86400000);
  const day30 = new Date(now.getTime() - 30 * 86400000);
  const day1  = new Date(now.getTime() - 86400000);

  const [total, week, today, month] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where:{ createdAt:{ gte:day7 } } }),
    prisma.pageView.count({ where:{ createdAt:{ gte:day1 } } }),
    prisma.pageView.count({ where:{ createdAt:{ gte:day30 } } }),
  ]);

  // Top pages (last 30 days)
  const rawViews = await prisma.pageView.findMany({
    where:   { createdAt:{ gte:day30 } },
    select:  { path:true },
  });

  const pageCounts: Record<string,number> = {};
  for (const v of rawViews) {
    pageCounts[v.path] = (pageCounts[v.path] ?? 0) + 1;
  }
  const topPages = Object.entries(pageCounts)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 15);

  // Daily views for the last 14 days
  const daily: Record<string,number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    daily[d.toISOString().split("T")[0]] = 0;
  }
  const recentViews = await prisma.pageView.findMany({
    where:  { createdAt:{ gte:new Date(now.getTime() - 14*86400000) } },
    select: { createdAt:true },
  });
  for (const v of recentViews) {
    const key = v.createdAt.toISOString().split("T")[0];
    if (key in daily) daily[key]++;
  }

  const dailyMax = Math.max(...Object.values(daily), 1);
  const dailyEntries = Object.entries(daily);

  // Top referrers
  const refViews = await prisma.pageView.findMany({
    where:  { createdAt:{ gte:day30 }, referrer:{ not:null } },
    select: { referrer:true },
  });
  const refCounts: Record<string,number> = {};
  for (const v of refViews) {
    if (!v.referrer) continue;
    try {
      const host = new URL(v.referrer).hostname.replace("www.","");
      refCounts[host] = (refCounts[host] ?? 0) + 1;
    } catch { /* invalid URL */ }
  }
  const topRefs = Object.entries(refCounts).sort((a,b)=>b[1]-a[1]).slice(0,8);

  const STATS = [
    { label:"All Time",     value:total, color:"#C8A96E", icon:Eye },
    { label:"This Month",   value:month, color:"#8BA7C7", icon:TrendingUp },
    { label:"This Week",    value:week,  color:"#4ab478",  icon:BarChart2 },
    { label:"Today",        value:today, color:"#D4A24C",  icon:Globe },
  ];

  return (
    <div style={{ padding:"2rem 2.5rem" }}>
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.25rem" }}>Analytics</h1>
        <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)" }}>Privacy-respecting page view tracking — no cookies, no PII</p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1px", backgroundColor:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.06)", marginBottom:"2rem" }}>
        {STATS.map(({ label, value, color, icon:Icon }) => (
          <div key={label} style={{ backgroundColor:"#0A0C12", padding:"1.25rem 1.5rem", borderLeft:`3px solid ${color}` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.75rem" }}>
              <span style={{ fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace" }}>{label}</span>
              <Icon size={13} color={`${color}80`} />
            </div>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"2rem", color, lineHeight:1 }}>
              {value.toLocaleString()}
            </div>
            <div style={{ fontSize:"10px", color:"rgba(200,196,190,0.32)", marginTop:"0.25rem" }}>page views</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:"1.5rem", marginBottom:"2rem" }}>

        {/* Daily chart */}
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", padding:"1.5rem" }}>
          <p style={{ fontSize:"8px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"1.25rem" }}>
            Daily Views — Last 14 Days
          </p>
          <div style={{ display:"flex", alignItems:"flex-end", gap:"4px", height:"100px" }}>
            {dailyEntries.map(([date, count]) => (
              <div key={date} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                <div
                  title={`${date}: ${count}`}
                  style={{ width:"100%", backgroundColor:"#C8A96E", borderRadius:"2px 2px 0 0", height:`${Math.max(2, (count / dailyMax) * 100)}%`, opacity:0.8, transition:"height 0.3s" }}
                />
                <span style={{ fontSize:"7px", color:"rgba(200,196,190,0.25)", fontFamily:"monospace", transform:"rotate(-45deg)", transformOrigin:"top center", whiteSpace:"nowrap" }}>
                  {date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top referrers */}
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", padding:"1.5rem" }}>
          <p style={{ fontSize:"8px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"1.25rem" }}>
            Top Referrers
          </p>
          {topRefs.length === 0 ? (
            <p style={{ color:"rgba(200,196,190,0.28)", fontSize:"0.8125rem" }}>No referrer data yet.</p>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
              {topRefs.map(([host, count]) => (
                <div key={host} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.65)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"180px" }}>{host}</span>
                  <span style={{ fontSize:"10px", fontFamily:"monospace", color:"rgba(200,196,190,0.4)" }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top pages */}
      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", overflow:"hidden" }}>
        <div style={{ padding:"1rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize:"8px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>
            Top Pages — Last 30 Days
          </p>
        </div>
        {topPages.length === 0 ? (
          <div style={{ padding:"2rem", textAlign:"center", color:"rgba(200,196,190,0.28)", fontSize:"0.875rem" }}>
            No page views recorded yet. Views will appear here once visitors browse the site.
          </div>
        ) : topPages.map(([path, count], i) => {
          const pct = Math.round((count / (topPages[0]?.[1] ?? 1)) * 100);
          return (
            <div key={path} className="admin-row" style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"0.875rem 1.5rem", borderBottom: i < topPages.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <span style={{ width:"24px", fontSize:"10px", color:"rgba(200,196,190,0.28)", fontFamily:"monospace", flexShrink:0, textAlign:"right" }}>{i+1}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"0.875rem", color:"#F0EDE6", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:"4px" }}>{path}</div>
                <div style={{ height:"3px", backgroundColor:"rgba(255,255,255,0.06)", borderRadius:"2px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, backgroundColor:"rgba(200,169,110,0.55)", borderRadius:"2px" }} />
                </div>
              </div>
              <span style={{ fontSize:"0.875rem", fontWeight:600, color:"#C8A96E", fontFamily:"var(--font-display)", flexShrink:0 }}>
                {count.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
