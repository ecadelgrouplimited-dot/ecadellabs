import Link from "next/link";
import Image from "next/image";

const RESEARCH_LINKS = [
  { href:"/research",     label:"Research Projects" },
  { href:"/publications", label:"Publications" },
  { href:"/fellows",      label:"Fellows" },
  { href:"/grants",       label:"Grants" },
  { href:"/partnerships", label:"Partners" },
];

const INSTITUTION_LINKS = [
  { href:"/contact",                label:"Contact",             external:false },
  { href:"/api-docs",              label:"Research API",        external:false },
  { href:"https://ecadelgroup.com", label:"ECADEL GROUP",        external:true },
  { href:"https://sbb.finance",     label:"Smart Business Book", external:true },
  { href:"https://pame.cc",         label:"PAME AI",             external:true },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor:"#0A0C12", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"4rem 1.5rem 0" }}>

        {/* ── Main grid ───────────────────────────────────── */}
        <div className="footer-grid" style={{ paddingBottom:"3rem", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:"0.75rem", textDecoration:"none", marginBottom:"1.25rem" }}>
              <Image src="/logos/ecadel_labs_transparent_1600.png" alt="ECADEL LABS" width={44} height={44} style={{ opacity:0.85 }} />
              <div>
                <div style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"0.9375rem", letterSpacing:"0.03em", lineHeight:1 }}>
                  ECADEL <span style={{ color:"#C8A96E" }}>LABS</span>
                </div>
                <div style={{ fontSize:"7px", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginTop:"4px" }}>
                  Research &amp; Innovation Engine
                </div>
              </div>
            </Link>

            <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.5)", lineHeight:1.75, maxWidth:"20rem", marginBottom:"1.25rem" }}>
              The research and innovation engine of ECADEL GROUP LIMITED — advancing African intelligence infrastructure through original research and applied technology.
            </p>

            <a href="https://ecadelgroup.com" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display:"inline-flex", alignItems:"center", gap:"0.25rem", borderBottom:"1px solid rgba(200,169,110,0.22)", paddingBottom:"1px", color:"rgba(200,169,110,0.6)" }}>
              Part of ECADEL GROUP LIMITED ↗
            </a>
          </div>

          {/* Research nav */}
          <div>
            <div style={{ fontSize:"8px", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"1.25rem" }}>
              Research
            </div>
            <div style={{ display:"flex", flexDirection:"column" }}>
              {RESEARCH_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Institution nav */}
          <div>
            <div style={{ fontSize:"8px", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(200,196,190,0.32)", fontFamily:"monospace", marginBottom:"1.25rem" }}>
              Institution
            </div>
            <div style={{ display:"flex", flexDirection:"column" }}>
              {INSTITUTION_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noopener noreferrer" : undefined}
                  className="footer-link"
                >
                  {l.label}{l.external ? " ↗" : ""}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem", padding:"1.25rem 0" }}>
          <p style={{ fontSize:"10px", color:"rgba(200,196,190,0.28)", fontFamily:"monospace", letterSpacing:"0.06em" }}>
            © {new Date().getFullYear()} ECADEL LABS · A Division of ECADEL GROUP LIMITED · Kampala, Uganda
          </p>
          <p style={{ fontSize:"10px", color:"rgba(200,196,190,0.22)", fontFamily:"monospace" }}>
            ecadellabs.cloud
          </p>
        </div>
      </div>
    </footer>
  );
}
