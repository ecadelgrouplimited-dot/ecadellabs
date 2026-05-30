import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Funding & Grants",
  description: "ECADEL LABS actively pursues research funding from AfDB, Gates Foundation, USAID, EU Horizon, and World Bank IFC. Our grant strategy for African intelligence infrastructure.",
};

const GRANT_BODIES = [
  { name:"African Development Bank", short:"AfDB", type:"Development Finance", description:"The continent's premier development finance institution. ECADEL LABS' research on African financial data infrastructure and governance intelligence aligns directly with AfDB's digitisation and AI-for-Africa mandates.", focus:["Financial Infrastructure","Governance Technology","Digital Transformation"], url:"https://www.afdb.org" },
  { name:"Gates Foundation", short:"BMGF", type:"Philanthropic", description:"ECADEL LABS' work on mobile money data systems, offline-first AI, and consequence intelligence for public health governance aligns with Gates Foundation priorities in global health and poverty reduction.", focus:["Mobile Money & Financial Access","Public Health Intelligence","AI for Development"], url:"https://www.gatesfoundation.org" },
  { name:"USAID", short:"USAID", type:"Bilateral Aid", description:"USAID's focus on digital development and open data makes ECADEL LABS' sovereign intelligence infrastructure research directly relevant, particularly SafeRoad data systems and civic technology research.", focus:["Digital Development","Open Data","Civic Technology"], url:"https://www.usaid.gov" },
  { name:"EU Horizon Europe", short:"EU Horizon", type:"Research Fund", description:"As a formal research institution, ECADEL LABS is positioned to participate in Horizon Europe programmes on AI, digitisation, and African partnerships — particularly through Global South research consortia.", focus:["AI Research","Global South Partnerships","Responsible AI"], url:"https://research-and-innovation.ec.europa.eu" },
  { name:"World Bank IFC", short:"IFC", type:"Development Finance", description:"The International Finance Corporation's private sector development mandate aligns with ECADEL LABS' research into SME financial data infrastructure and mobile money as an intelligence layer for African enterprises.", focus:["SME Development","Financial Systems","Private Sector AI"], url:"https://www.ifc.org" },
];

const STRENGTHS = [
  "Original research agenda addressing under-served African technology infrastructure problems",
  "Applied research deployments in production (SBB, PAME AI, SafeRoad UG)",
  "Institutional affiliation with ECADEL GROUP LIMITED",
  "East Africa beachhead with Uganda operations established",
  "Cross-disciplinary approach: AI, civic tech, financial infrastructure, road safety",
  "Commitment to open publication of research findings",
];

export default function GrantsPage() {
  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
            Grant Strategy
          </p>
          <h1 style={{ fontSize:"clamp(1.8rem,2.5vw,2.5rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, fontFamily:"var(--font-display)", marginBottom:"1.125rem" }}>
            Research Funding &amp; Grants.
          </h1>
          <p style={{ color:"rgba(200,196,190,0.62)", maxWidth:"42rem", lineHeight:1.75, fontSize:"0.9375rem" }}>
            ECADEL LABS actively pursues research funding from development finance institutions, philanthropic bodies, and bilateral agencies that share our commitment to African intelligence infrastructure.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>

        {/* Why Fund section */}
        <div style={{ backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", padding:"2.5rem", marginBottom:"3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1.5rem" }}>Why Fund ECADEL LABS</p>
          <div className="grants-grid">
            {STRENGTHS.map((s) => (
              <div key={s} style={{ display:"flex", alignItems:"flex-start", gap:"0.625rem" }}>
                <CheckCircle2 size={13} color="rgba(200,169,110,0.65)" style={{ flexShrink:0, marginTop:"1px" }} />
                <span style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.65)", lineHeight:1.6 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grant bodies */}
        <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,196,190,0.35)", fontFamily:"monospace", marginBottom:"1.25rem" }}>
          Target Grant Bodies
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.06)", marginBottom:"3rem" }}>
          {GRANT_BODIES.map((g) => (
            <div key={g.name} style={{ backgroundColor:"#060608", padding:"2rem" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"2rem", marginBottom:"0.875rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                  <h2 style={{ fontSize:"1rem", fontWeight:700, color:"#F0EDE6", fontFamily:"var(--font-display)" }}>{g.name}</h2>
                  <span style={{ fontSize:"9px", padding:"2px 7px", backgroundColor:"rgba(255,255,255,0.05)", color:"rgba(200,196,190,0.42)", fontFamily:"monospace" }}>{g.type}</span>
                </div>
                <a href={g.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:"9px", color:"rgba(200,196,190,0.38)", textDecoration:"none", flexShrink:0 }}>{g.short} ↗</a>
              </div>
              <p style={{ color:"rgba(200,196,190,0.58)", fontSize:"0.8125rem", lineHeight:1.7, marginBottom:"1rem" }}>{g.description}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem" }}>
                {g.focus.map((f) => (
                  <span key={f} style={{ fontSize:"9px", padding:"2px 8px", backgroundColor:"rgba(200,169,110,0.06)", color:"rgba(200,169,110,0.55)", fontFamily:"monospace", border:"1px solid rgba(200,169,110,0.12)" }}>{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding:"3rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", textAlign:"center" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1rem" }}>Collaborate on Funding</p>
          <h2 style={{ fontSize:"clamp(1.4rem,2vw,1.75rem)", fontWeight:700, color:"#F0EDE6", fontFamily:"var(--font-display)", marginBottom:"0.875rem" }}>
            Co-Apply with ECADEL LABS
          </h2>
          <p style={{ color:"rgba(200,196,190,0.55)", fontSize:"0.875rem", lineHeight:1.7, maxWidth:"30rem", margin:"0 auto 1.75rem" }}>
            Universities, research institutions, and NGOs can co-apply for grants with ECADEL LABS. If your research agenda aligns with ours, we want to hear from you.
          </p>
          <Link href="/contact?type=grant" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.8rem 2rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none" }}>
            Grant Partnership Inquiry <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
