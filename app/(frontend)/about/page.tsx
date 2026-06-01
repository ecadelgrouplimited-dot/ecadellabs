import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FlaskConical, FileText, Users, Building2, BookOpen, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "ECADEL LABS is the research and innovation engine of ECADEL GROUP LIMITED — a formal research institution advancing African intelligence infrastructure through original research, academic partnerships, and applied technology.",
  alternates: { canonical: "https://ecadellabs.cloud/about" },
};

const PILLARS = [
  {
    icon: FlaskConical,
    title: "Problem-First Research",
    body: "We begin with specific, named problems — not technology trends. Every research agenda item at ECADEL LABS starts with a documented problem that is complex, underserved, and consequential for African institutions.",
  },
  {
    icon: FileText,
    title: "Applied & Published",
    body: "ECADEL LABS research is applied through ECADEL GROUP's platforms — SBB, PAME AI, SafeRoad UG — and published openly. Research findings become deployments. Deployments generate new research questions.",
  },
  {
    icon: Globe,
    title: "African-Centered",
    body: "Solutions are built for African realities from the ground up — not imported from elsewhere and adapted. Offline-first architecture, mobile money infrastructure, and East African governance contexts are first principles, not constraints.",
  },
];

const ENGAGE = [
  { href:"/fellows",              icon:Users,     label:"Research Fellowships",      desc:"Join ECADEL LABS as a research fellow, resident, or collaborator." },
  { href:"/partnerships",         icon:Building2, label:"Institutional Partnerships", desc:"Formalise a research partnership between your institution and ECADEL LABS." },
  { href:"/grants",               icon:BookOpen,  label:"Grant Co-Applications",      desc:"Co-apply with ECADEL LABS for AfDB, Gates, USAID, EU Horizon, or IFC funding." },
  { href:"/research",             icon:FlaskConical,label:"Research Collaboration",   desc:"Contribute to an active research agenda item as an investigator or domain expert." },
];

const DOMAINS = [
  "AI Systems & Machine Learning",
  "Mobile Money & Financial Data",
  "Consequence Intelligence",
  "Offline-First Architecture",
  "Civic Technology",
  "Road Safety Infrastructure",
  "Agricultural Intelligence",
  "Health Systems Intelligence",
  "Urban Intelligence",
  "Education Technology Research",
  "Energy & Infrastructure",
  "Legal & Regulatory Intelligence",
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"7rem 1.5rem 4rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"4rem", flexWrap:"wrap" }}>
            <div style={{ flex:"1 1 400px" }}>
              <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1rem" }}>
                About ECADEL LABS
              </p>
              <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"clamp(2rem,3vw,3rem)", lineHeight:1.08, marginBottom:"1.5rem" }}>
                The Research and Innovation Engine of ECADEL GROUP.
              </h1>
              <p style={{ color:"rgba(200,196,190,0.68)", fontSize:"1.0625rem", lineHeight:1.8, maxWidth:"38rem" }}>
                ECADEL LABS is not a product. It is not a startup. It is the institution inside the institution — where ideas are stress-tested before becoming subsidiaries, where shared technical foundations are built, and where ECADEL publishes work that positions it at the frontier of African technology thinking.
              </p>
            </div>
            <div style={{ flexShrink:0, width:"220px", height:"220px", opacity:0.2, position:"relative" }} className="hidden lg:block">
              <Image src="/logos/ecadel_labs_transparent_1600.png" alt="" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* ── What We Are ──────────────────────────────────────────────── */}
      <section style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"#0A0C12" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"4rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", flexWrap:"wrap" }}>
            <div>
              <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1.25rem" }}>What We Are</p>
              <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.5rem", lineHeight:1.2, marginBottom:"1.25rem" }}>
                A formal research institution inside a technology group.
              </h2>
              <p style={{ color:"rgba(200,196,190,0.65)", lineHeight:1.85, marginBottom:"1.25rem" }}>
                ECADEL LABS gives ECADEL GROUP LIMITED a research identity separate from its commercial operations. Separate in tone, audience, and purpose — but unmistakably part of the ECADEL family.
              </p>
              <p style={{ color:"rgba(200,196,190,0.65)", lineHeight:1.85, marginBottom:"1.25rem" }}>
                When ECADEL applies for a grant, this is the URL in the application. When a university wants to partner, this is the institution they engage. When a researcher wants to publish work on African technology infrastructure, this is the journal.
              </p>
            </div>
            <div>
              <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1.25rem" }}>What We Are Not</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
                {[
                  ["Not a consulting firm", "We do not bill by the hour or sell research reports. We publish openly."],
                  ["Not a university department", "We operate independently, with our own research agenda and publication record."],
                  ["Not a think tank", "Our research is applied — it deploys into real systems used by real Africans."],
                  ["Not a startup", "We are a long-term institution. Our horizon is generational, not quarterly."],
                ].map(([title, body]) => (
                  <div key={title} style={{ display:"flex", gap:"0.875rem" }}>
                    <div style={{ width:"3px", backgroundColor:"rgba(200,169,110,0.3)", flexShrink:0, alignSelf:"stretch", borderRadius:"2px" }} />
                    <div>
                      <p style={{ fontSize:"0.875rem", fontWeight:600, color:"#F0EDE6", fontFamily:"var(--font-display)", marginBottom:"2px" }}>{title}</p>
                      <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.52)", lineHeight:1.6 }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Research Pillars ─────────────────────────────────────────── */}
      <section style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"4rem 1.5rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"2rem" }}>
            Research Approach
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", backgroundColor:"rgba(255,255,255,0.06)" }}>
            {PILLARS.map(({ icon:Icon, title, body }) => (
              <div key={title} style={{ backgroundColor:"#060608", padding:"2.5rem 2rem" }}>
                <div style={{ width:"40px", height:"40px", backgroundColor:"rgba(200,169,110,0.08)", border:"1px solid rgba(200,169,110,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.25rem", borderRadius:"3px" }}>
                  <Icon size={18} color="#C8A96E" />
                </div>
                <h3 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1rem", marginBottom:"0.875rem" }}>{title}</h3>
                <p style={{ color:"rgba(200,196,190,0.58)", fontSize:"0.875rem", lineHeight:1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research Domains ─────────────────────────────────────────── */}
      <section style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"#0A0C12" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"4rem 1.5rem" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"1.75rem", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.625rem" }}>Research Domains</p>
              <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem" }}>
                12 domains · 80+ open research questions
              </h2>
            </div>
            <Link href="/research" style={{ fontSize:"0.8125rem", color:"rgba(200,169,110,0.7)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.375rem", borderBottom:"1px solid rgba(200,169,110,0.3)", paddingBottom:"2px" }}>
              Browse research agenda <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)" }}>
            {DOMAINS.map((d) => (
              <div key={d} style={{ backgroundColor:"#0A0C12", padding:"0.875rem 1.25rem", fontSize:"0.8125rem", color:"rgba(200,196,190,0.6)", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <span style={{ width:"4px", height:"4px", borderRadius:"50%", backgroundColor:"rgba(200,169,110,0.45)", flexShrink:0 }} />
                {d}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Governance & Affiliation ─────────────────────────────────── */}
      <section style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"4rem 1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", flexWrap:"wrap" }}>
            <div>
              <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1.25rem" }}>Governance</p>
              <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", lineHeight:1.2, marginBottom:"1.25rem" }}>
                A division of ECADEL GROUP LIMITED
              </h2>
              <p style={{ color:"rgba(200,196,190,0.62)", lineHeight:1.85, marginBottom:"1rem" }}>
                ECADEL LABS is a formal division of ECADEL GROUP LIMITED, headquartered in Kampala, Uganda. It operates under the governance of ECADEL GROUP with its own research mandate, publication record, and institutional identity.
              </p>
              <p style={{ color:"rgba(200,196,190,0.62)", lineHeight:1.85 }}>
                Research outputs from ECADEL LABS are applied through ECADEL GROUP's platforms: Smart Business Book (SBB), PAME AI, SafeRoad UG, Hapa, and Meridian — making ECADEL LABS one of the few research institutions in East Africa with direct deployment infrastructure.
              </p>
            </div>
            <div>
              <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1.25rem" }}>Key Information</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                {[
                  { label:"Founded",       value:"2026" },
                  { label:"Type",          value:"Research Division" },
                  { label:"Parent",        value:"ECADEL GROUP LIMITED" },
                  { label:"Headquarters",  value:"Kampala, Uganda" },
                  { label:"Region",        value:"East Africa / Sub-Saharan Africa" },
                  { label:"Focus",         value:"African Intelligence Infrastructure" },
                  { label:"Publications",  value:"Open access" },
                  { label:"Parent site",   value:"ecadelgroup.com" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display:"flex", gap:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.05)", paddingBottom:"0.875rem" }}>
                    <span style={{ fontSize:"9px", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", width:"100px", flexShrink:0 }}>{label}</span>
                    <span style={{ fontSize:"0.875rem", color:"rgba(200,196,190,0.72)" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How to Engage ────────────────────────────────────────────── */}
      <section>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"4rem 1.5rem 5rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
            Get Involved
          </p>
          <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.5rem", marginBottom:"2rem" }}>
            How to engage with ECADEL LABS
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1px", backgroundColor:"rgba(255,255,255,0.06)", marginBottom:"3rem" }}>
            {ENGAGE.map(({ href, icon:Icon, label, desc }) => (
              <Link key={href} href={href} style={{ backgroundColor:"#060608", padding:"2rem", textDecoration:"none", display:"flex", gap:"1.25rem" }} className="hover:bg-deep group">
                <div style={{ width:"40px", height:"40px", backgroundColor:"rgba(200,169,110,0.06)", border:"1px solid rgba(200,169,110,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, borderRadius:"3px" }}>
                  <Icon size={17} color="rgba(200,169,110,0.7)" />
                </div>
                <div>
                  <p style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"#F0EDE6", fontSize:"0.9375rem", marginBottom:"0.375rem" }} className="group-hover:text-gold transition-colors">{label}</p>
                  <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.52)", lineHeight:1.65 }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Final CTA */}
          <div style={{ padding:"2.5rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", textAlign:"center" }}>
            <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1rem" }}>
              Start a Conversation
            </p>
            <h3 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.875rem" }}>
              Serious about African technology infrastructure?
            </h3>
            <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.9375rem", lineHeight:1.75, maxWidth:"36rem", margin:"0 auto 2rem" }}>
              Whether you are a researcher, engineer, university, grant body, or institution — there is a role for you in building Africa&apos;s intelligence infrastructure.
            </p>
            <Link href="/contact" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.875rem 2.5rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:700, fontSize:"0.9375rem", textDecoration:"none", borderRadius:"3px" }}>
              Get in Touch <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
