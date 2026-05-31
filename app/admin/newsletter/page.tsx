import { prisma } from "@/lib/db";
import Link from "next/link";
import { Mail, Users, Download, Send } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsletterAdmin() {
  const subscribers = await prisma.inquiry.findMany({
    where:   { type:"newsletter", archived:false },
    orderBy: { createdAt:"desc" },
    select:  { id:true, email:true, name:true, organisation:true, createdAt:true, read:true },
  });

  const thisMonth = subscribers.filter((s) => {
    const d = new Date(s.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div style={{ padding:"2rem 2.5rem" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.25rem" }}>
            Newsletter Subscribers
          </h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)" }}>
            {subscribers.length} total · {thisMonth} this month
          </p>
        </div>
        <div style={{ display:"flex", gap:"0.75rem" }}>
          <Link href="/admin/newsletter/compose" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.6rem 1.125rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
            <Send size={13} /> Compose &amp; Send
          </Link>
          <a
            href={`data:text/csv;charset=utf-8,Email,Joined\n${subscribers.map((s) => `${s.email},${new Date(s.createdAt).toISOString().split("T")[0]}`).join("\n")}`}
            download="ecadellabs-subscribers.csv"
            style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.6rem 1.125rem", backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(200,196,190,0.65)", fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}
          >
            <Download size={13} /> Export CSV
          </a>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", backgroundColor:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.06)", marginBottom:"2rem" }}>
        {[
          { icon:Users, label:"Total Subscribers",  value:subscribers.length, color:"#a78bfa" },
          { icon:Mail,  label:"This Month",          value:thisMonth,           color:"#C8A96E" },
          { icon:Mail,  label:"Growth Rate",         value:thisMonth > 0 ? `+${thisMonth}` : "—", color:"#4ab478" },
        ].map(({ icon:Icon, label, value, color }) => (
          <div key={label} style={{ backgroundColor:"#0A0C12", padding:"1.25rem 1.5rem", borderLeft:`3px solid ${color}` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.625rem" }}>
              <span style={{ fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace" }}>{label}</span>
              <Icon size={13} color={`${color}80`} />
            </div>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.75rem", color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Subscriber table */}
      <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"4px", overflow:"hidden" }}>

        {/* Column headers */}
        <div style={{ display:"flex", gap:"1rem", padding:"0.625rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"rgba(255,255,255,0.02)", fontSize:"8px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace" }}>
          <span style={{ flex:"1 1 0" }}>Email</span>
          <span style={{ width:"180px", flexShrink:0 }}>Organisation</span>
          <span style={{ width:"120px", flexShrink:0 }}>Joined</span>
        </div>

        {subscribers.length === 0 ? (
          <div style={{ padding:"3rem", textAlign:"center", color:"rgba(200,196,190,0.32)", fontSize:"0.875rem" }}>
            <Mail size={28} color="rgba(200,196,190,0.15)" style={{ margin:"0 auto 0.875rem" }} />
            <p>No newsletter subscribers yet.</p>
            <p style={{ fontSize:"0.75rem", marginTop:"0.375rem" }}>The newsletter signup is on the homepage.</p>
          </div>
        ) : subscribers.map((s, i) => (
          <div key={s.id} className="admin-row" style={{
            display:"flex", alignItems:"center", gap:"1rem", padding:"0.875rem 1.5rem",
            borderBottom: i < subscribers.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <div style={{ flex:"1 1 0", minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <div style={{ width:"28px", height:"28px", borderRadius:"50%", backgroundColor:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Mail size={11} color="rgba(167,139,250,0.7)" />
                </div>
                <a href={`mailto:${s.email}`} style={{ fontSize:"0.875rem", fontWeight:500, color:"#F0EDE6", textDecoration:"none" }}
                  className="a-view">
                  {s.email}
                </a>
              </div>
            </div>
            <div style={{ width:"180px", flexShrink:0, fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {s.organisation ?? s.name ?? "—"}
            </div>
            <div style={{ width:"120px", flexShrink:0, fontSize:"11px", color:"rgba(200,196,190,0.35)", fontFamily:"monospace" }}>
              {new Date(s.createdAt).toLocaleDateString("en-GB",{ day:"2-digit", month:"short", year:"numeric" })}
            </div>
          </div>
        ))}
      </div>

      {subscribers.length > 0 && (
        <p style={{ fontSize:"10px", color:"rgba(200,196,190,0.25)", fontFamily:"monospace", marginTop:"1rem", textAlign:"right" }}>
          {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""} total · use Export CSV to send a research update
        </p>
      )}
    </div>
  );
}
