"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, FileText, FlaskConical, Users,
  Building2, MessageSquare, Settings, LogOut, ExternalLink, Mail,
  BarChart2, UserCog,
} from "lucide-react";

const NAV = [
  { href:"/admin",             icon:LayoutDashboard, label:"Dashboard" },
  { href:"/admin/publications", icon:FileText,        label:"Publications" },
  { href:"/admin/research",    icon:FlaskConical,     label:"Research" },
  { href:"/admin/fellows",     icon:Users,            label:"Fellows" },
  { href:"/admin/partnerships",icon:Building2,        label:"Partnerships" },
  { href:"/admin/inquiries",   icon:MessageSquare, label:"Inquiries",  badge:true,  adminOnly:false },
  { href:"/admin/analytics",   icon:BarChart2,     label:"Analytics",             adminOnly:false },
  { href:"/admin/newsletter",  icon:Mail,          label:"Newsletter",            adminOnly:true },
  { href:"/admin/users",       icon:UserCog,       label:"Users",                 adminOnly:true },
  { href:"/admin/settings",    icon:Settings,      label:"Settings",              adminOnly:true },
];

const ITEM: React.CSSProperties = {
  display:"flex", alignItems:"center", justifyContent:"space-between",
  padding:"0.625rem 0.875rem", fontSize:"0.875rem", fontWeight:500,
  textDecoration:"none", borderRadius:"4px",
  transition:"all 0.15s", marginBottom:"2px",
};

export default function Sidebar() {
  const pathname = usePathname();
  const [unread, setUnread]   = useState(0);
  const [myRole, setMyRole]   = useState<string>("editor");

  useEffect(() => {
    const load = () =>
      fetch("/api/inquiries")
        .then((r) => r.json())
        .then((d: { read:boolean }[]) => {
          if (Array.isArray(d)) setUnread(d.filter((i) => !i.read).length);
        })
        .catch(() => {});

    fetch("/api/me").then((r) => r.json()).then((d) => {
      if (d?.role) setMyRole(d.role);
    }).catch(() => {});

    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method:"POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside style={{
      width:"232px", flexShrink:0,
      backgroundColor:"#0A0C12",
      borderRight:"1px solid rgba(255,255,255,0.07)",
      display:"flex", flexDirection:"column",
      minHeight:"100vh",
    }}>

      {/* ── Logo ─────────────────────────────────────────── */}
      <div style={{ padding:"1.25rem 1.25rem 1rem", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <Link href="/" target="_blank" style={{ display:"flex", alignItems:"center", gap:"0.625rem", textDecoration:"none" }}>
          <Image
            src="/logos/ecadel_labs_transparent_1600.png"
            alt="ECADEL LABS"
            width={32} height={32}
            style={{ opacity:0.85 }}
          />
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"0.8125rem", letterSpacing:"0.03em", lineHeight:1 }}>
              ECADEL <span style={{ color:"#C8A96E" }}>LABS</span>
            </div>
            <div style={{ fontSize:"7px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginTop:"3px" }}>
              Admin Panel
            </div>
          </div>
        </Link>
      </div>

      {/* ── Navigation ───────────────────────────────────── */}
      <nav style={{ flex:1, padding:"1rem 0.75rem 0.75rem", overflowY:"auto" }}>
        <div style={{ fontSize:"8px", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(200,196,190,0.28)", fontFamily:"monospace", padding:"0 0.5rem", marginBottom:"0.5rem" }}>
          Content
        </div>

        {NAV.filter((item) => !item.adminOnly || myRole === "admin").map(({ href, icon:Icon, label, badge }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          const showBadge = badge && unread > 0;

          return (
            <Link
              key={href}
              href={href}
              style={{
                ...ITEM,
                backgroundColor: active ? "rgba(200,169,110,0.1)"  : "transparent",
                color:           active ? "#C8A96E"                 : "rgba(200,196,190,0.62)",
                borderLeft:     `2px solid ${active ? "#C8A96E" : "transparent"}`,
                paddingLeft:     active ? "0.75rem" : "0.875rem",
              }}
              onMouseOver={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "#F0EDE6";
                }
              }}
              onMouseOut={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(200,196,190,0.62)";
                }
              }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
                <Icon
                  size={15}
                  color={active ? "#C8A96E" : "rgba(200,196,190,0.45)"}
                />
                <span>{label}</span>
              </div>
              {showBadge && (
                <span style={{
                  fontSize:"9px", padding:"1px 6px",
                  backgroundColor:"rgba(212,162,76,0.18)",
                  color:"#D4A24C",
                  border:"1px solid rgba(212,162,76,0.3)",
                  borderRadius:"2px", fontFamily:"monospace",
                }}>
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ───────────────────────────────────────── */}
      <div style={{ padding:"0.75rem", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <Link
          href="/"
          target="_blank"
          style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.5rem 0.625rem", fontSize:"0.75rem", color:"rgba(200,196,190,0.4)", textDecoration:"none", borderRadius:"4px", marginBottom:"2px", transition:"all 0.15s" }}
          onMouseOver={(e) => { e.currentTarget.style.color = "rgba(200,169,110,0.8)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
          onMouseOut={(e)  => { e.currentTarget.style.color = "rgba(200,196,190,0.4)"; e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <ExternalLink size={12} />
          View live site
        </Link>
        <button
          onClick={logout}
          style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.5rem 0.625rem", fontSize:"0.75rem", color:"rgba(200,196,190,0.4)", background:"none", border:"none", cursor:"pointer", borderRadius:"4px", width:"100%", transition:"all 0.15s" }}
          onMouseOver={(e) => { e.currentTarget.style.color = "#e05555"; e.currentTarget.style.backgroundColor = "rgba(224,85,85,0.06)"; }}
          onMouseOut={(e)  => { e.currentTarget.style.color = "rgba(200,196,190,0.4)"; e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
