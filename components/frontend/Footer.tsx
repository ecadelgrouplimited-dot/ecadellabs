import Link from "next/link";
import { Beaker, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/7 bg-deep mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Beaker size={16} className="text-gold" />
              <span className="font-display font-bold text-cream text-sm tracking-wide">
                ECADEL <span className="text-gold">LABS</span>
              </span>
            </div>
            <p className="text-platinum/55 text-sm leading-relaxed max-w-sm mb-4">
              The research and innovation engine of ECADEL GROUP LIMITED — advancing African intelligence infrastructure through original research and applied technology.
            </p>
            <Link href="https://ecadelgroup.com" target="_blank"
              className="flex items-center gap-1.5 text-xs text-gold/70 hover:text-gold transition-colors">
              <ExternalLink size={10} />
              Part of ECADEL GROUP LIMITED
            </Link>
          </div>

          {/* Research */}
          <div>
            <div className="text-[9px] tracking-[0.25em] uppercase text-muted font-mono mb-4">Research</div>
            <ul className="space-y-2.5">
              {[
                { href: "/research",     label: "Research Projects" },
                { href: "/publications", label: "Publications" },
                { href: "/fellows",      label: "Fellows" },
                { href: "/grants",       label: "Grants" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-platinum/55 hover:text-cream transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institution */}
          <div>
            <div className="text-[9px] tracking-[0.25em] uppercase text-muted font-mono mb-4">Institution</div>
            <ul className="space-y-2.5">
              {[
                { href: "/partnerships", label: "Partners" },
                { href: "/contact",      label: "Contact" },
                { href: "https://ecadelgroup.com", label: "ECADEL GROUP" },
                { href: "https://sbb.finance",     label: "Smart Business Book" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-platinum/55 hover:text-cream transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-platinum/30 tracking-wide font-mono">
            © {new Date().getFullYear()} ECADEL LABS · A Division of ECADEL GROUP LIMITED · Kampala, Uganda
          </p>
          <p className="text-[10px] text-platinum/25 font-mono">
            ecadellabs.cloud
          </p>
        </div>
      </div>
    </footer>
  );
}
