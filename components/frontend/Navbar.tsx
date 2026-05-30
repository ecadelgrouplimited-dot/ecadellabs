"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight, Search } from "lucide-react";

const LINKS = [
  { href:"/research",     label:"Research" },
  { href:"/publications", label:"Publications" },
  { href:"/fellows",      label:"Fellows" },
  { href:"/grants",       label:"Grants" },
  { href:"/partnerships", label:"Partners" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      position:"fixed", top:0, left:0, right:0, zIndex:50,
      backgroundColor:"rgba(6,6,8,0.92)",
      backdropFilter:"blur(20px)",
      WebkitBackdropFilter:"blur(20px)",
      borderBottom:"1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"0 1.5rem", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>

        {/* ── Logo ─────────────────────────────────────────── */}
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:"0.75rem", textDecoration:"none" }} onClick={() => setOpen(false)}>
          <Image
            src="/logos/ecadel_labs_transparent_1600.png"
            alt="ECADEL LABS"
            width={36} height={36}
            style={{ opacity:0.92 }}
          />
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"0.875rem", letterSpacing:"0.03em", lineHeight:1 }}>
              ECADEL <span style={{ color:"#C8A96E" }}>LABS</span>
            </div>
            <div style={{ fontSize:"7px", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(200,196,190,0.38)", fontFamily:"monospace", marginTop:"3px" }}>
              Research &amp; Innovation
            </div>
          </div>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────── */}
        <nav className="nav-links">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={`nav-link${active?" active":""}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop actions ──────────────────────────────── */}
        <div className="nav-actions" style={{ gap:"0.75rem" }}>
          {/* Search icon */}
          <Link href="/search" style={{ display:"flex", alignItems:"center", padding:"0.375rem", color:"rgba(200,196,190,0.45)", transition:"color 0.2s", textDecoration:"none" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#C8A96E")}
            onMouseOut={(e)  => (e.currentTarget.style.color = "rgba(200,196,190,0.45)")}
            title="Search"
          >
            <Search size={15} />
          </Link>

          <Link
            href="https://ecadelgroup.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:"0.3rem", fontSize:"0.75rem", color:"rgba(200,196,190,0.4)", textDecoration:"none", transition:"color 0.2s" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "rgba(200,196,190,0.75)")}
            onMouseOut={(e)  => (e.currentTarget.style.color = "rgba(200,196,190,0.4)")}
          >
            ECADEL GROUP <ArrowUpRight size={11} />
          </Link>
          <Link
            href="/contact"
            style={{ padding:"0.5rem 1.125rem", border:"1px solid rgba(200,169,110,0.4)", color:"#C8A96E", fontSize:"0.8125rem", fontFamily:"var(--font-display)", fontWeight:500, textDecoration:"none", letterSpacing:"0.02em", transition:"all 0.2s" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(200,169,110,0.08)"; e.currentTarget.style.borderColor = "rgba(200,169,110,0.7)"; }}
            onMouseOut={(e)  => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "rgba(200,169,110,0.4)"; }}
          >
            Get in Touch
          </Link>
        </div>

        {/* ── Mobile burger ────────────────────────────────── */}
        <button
          onClick={() => setOpen(!open)}
          className="nav-burger"
          style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(200,196,190,0.65)", padding:"0.25rem" }}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────── */}
      {open && (
        <div
          className="mobile-menu"
          style={{ backgroundColor:"#0A0C12", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"1.25rem 1.5rem 1.5rem" }}
        >
          {/* Mobile search */}
          <Link href="/search" onClick={() => setOpen(false)} style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.75rem 0.875rem", marginBottom:"0.75rem", backgroundColor:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", color:"rgba(200,196,190,0.5)", fontSize:"0.875rem", textDecoration:"none" }}>
            <Search size={14} />
            Search publications &amp; research…
          </Link>

          {/* Nav links */}
          <div style={{ display:"flex", flexDirection:"column", gap:"0.125rem", marginBottom:"1.25rem" }}>
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    padding:"0.75rem 0.875rem",
                    fontSize:"0.9375rem",
                    fontFamily:"var(--font-display)",
                    fontWeight:500,
                    color: active ? "#C8A96E" : "rgba(200,196,190,0.72)",
                    textDecoration:"none",
                    borderLeft:`2px solid ${active ? "#C8A96E" : "transparent"}`,
                    paddingLeft: active ? "1rem" : "0.875rem",
                    backgroundColor: active ? "rgba(200,169,110,0.05)" : "transparent",
                    transition:"all 0.15s",
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height:"1px", backgroundColor:"rgba(255,255,255,0.06)", marginBottom:"1.25rem" }} />

          {/* CTA + external */}
          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              style={{ display:"flex", justifyContent:"center", padding:"0.875rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.875rem", textDecoration:"none", textAlign:"center" }}
            >
              Get in Touch
            </Link>
            <Link
              href="https://ecadelgroup.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.375rem", padding:"0.75rem", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,196,190,0.45)", fontSize:"0.8125rem", textDecoration:"none" }}
            >
              ECADEL GROUP LIMITED <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
