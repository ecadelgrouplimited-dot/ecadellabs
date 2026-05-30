"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Beaker, Menu, X, ExternalLink } from "lucide-react";

const links = [
  { href: "/research",      label: "Research" },
  { href: "/publications",  label: "Publications" },
  { href: "/fellows",       label: "Fellows" },
  { href: "/grants",        label: "Grants" },
  { href: "/partnerships",  label: "Partners" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/7 bg-deep/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Beaker size={17} className="text-gold" />
          <div>
            <span className="font-display font-bold text-cream text-sm tracking-wide">
              ECADEL <span className="text-gold">LABS</span>
            </span>
            <div className="text-[8px] tracking-[0.2em] uppercase text-platinum/38 font-mono -mt-0.5">
              Research & Innovation
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors duration-200 relative group ${
                pathname.startsWith(l.href)
                  ? "text-gold"
                  : "text-platinum/65 hover:text-cream"
              }`}
            >
              {l.label}
              <span className={`absolute -bottom-px left-0 h-px w-full transition-all duration-300 ${pathname.startsWith(l.href) ? "bg-gold" : "bg-gold scale-x-0 group-hover:scale-x-100"}`} />
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="https://ecadelgroup.com"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-platinum/42 hover:text-cream transition-colors duration-200"
          >
            <ExternalLink size={11} />
            ECADEL GROUP
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 border border-gold/35 text-gold text-xs tracking-wide hover:bg-gold/8 transition-colors duration-200 font-display"
          >
            Get in Touch
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-platinum/65 hover:text-cream transition-colors p-1">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-deep border-t border-white/7 px-6 py-5 space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-platinum/65 hover:text-cream transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}
            className="block mt-4 py-3 text-center border border-gold/35 text-gold text-sm font-display">
            Get in Touch
          </Link>
        </div>
      )}
    </header>
  );
}
