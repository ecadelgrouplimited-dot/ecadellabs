import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const GRANT_BODIES = [
  {
    name:        "African Development Bank",
    short:       "AfDB",
    type:        "Development Finance",
    description: "The continent's premier development finance institution. ECADEL LABS' research on African financial data infrastructure and governance intelligence aligns directly with AfDB's digitisation and AI-for-Africa mandates.",
    focus:       ["Financial Infrastructure", "Governance Technology", "Digital Transformation"],
    url:         "https://www.afdb.org",
  },
  {
    name:        "Gates Foundation",
    short:       "BMGF",
    type:        "Philanthropic",
    description: "ECADEL LABS' work on mobile money data systems, offline-first AI, and consequence intelligence for public health governance aligns with Gates Foundation priorities in global health and poverty reduction.",
    focus:       ["Mobile Money & Financial Access", "Public Health Intelligence", "AI for Development"],
    url:         "https://www.gatesfoundation.org",
  },
  {
    name:        "USAID",
    short:       "USAID",
    type:        "Bilateral Aid",
    description: "USAID's focus on digital development and open data makes ECADEL LABS' sovereign intelligence infrastructure research directly relevant, particularly SafeRoad data systems and civic technology research.",
    focus:       ["Digital Development", "Open Data", "Civic Technology"],
    url:         "https://www.usaid.gov",
  },
  {
    name:        "EU Horizon Europe",
    short:       "EU Horizon",
    type:        "Research Fund",
    description: "As a formal research institution, ECADEL LABS is positioned to participate in Horizon Europe programmes on AI, digitisation, and African partnerships — particularly through Global South research consortia.",
    focus:       ["AI Research", "Global South Partnerships", "Responsible AI"],
    url:         "https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe_en",
  },
  {
    name:        "World Bank IFC",
    short:       "IFC",
    type:        "Development Finance",
    description: "The International Finance Corporation's private sector development mandate aligns with ECADEL LABS' research into SME financial data infrastructure and mobile money as an intelligence layer for African enterprises.",
    focus:       ["SME Development", "Financial Systems", "Private Sector AI"],
    url:         "https://www.ifc.org",
  },
];

const RESEARCH_STRENGTHS = [
  "Original research agenda addressing under-served African technology infrastructure problems",
  "Applied research deployments in production (SBB, PAME AI, SafeRoad UG)",
  "Institutional affiliation with ECADEL GROUP LIMITED",
  "East Africa beachhead with Uganda operations established",
  "Cross-disciplinary approach: AI, civic tech, financial infrastructure, road safety",
  "Commitment to open publication of research findings",
];

export default function GrantsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-16">
        <div className="text-[9px] tracking-[0.35em] uppercase text-gold/70 font-mono mb-4">Grant Strategy</div>
        <h1 className="font-display font-bold text-cream text-5xl md:text-6xl mb-6 leading-tight">
          Research Funding<br /><span style={{ color: "#C8A96E" }}>& Grants.</span>
        </h1>
        <p className="text-platinum/65 text-lg leading-relaxed max-w-2xl">
          ECADEL LABS actively pursues research funding from development finance institutions, philanthropic bodies, and bilateral agencies that share our commitment to African intelligence infrastructure.
        </p>
      </div>

      {/* Why fund ECADEL LABS */}
      <div className="bg-carbon border border-white/7 p-10 mb-16">
        <div className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-mono mb-6">Why Fund ECADEL LABS</div>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
          {RESEARCH_STRENGTHS.map((s) => (
            <div key={s} className="flex items-start gap-3">
              <CheckCircle size={14} className="text-gold/70 mt-0.5 shrink-0" />
              <span className="text-sm text-platinum/68 leading-relaxed">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target grant bodies */}
      <div className="mb-16">
        <div className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-mono mb-8">Target Grant Bodies</div>
        <div className="space-y-3">
          {GRANT_BODIES.map((g) => (
            <div key={g.name} className="bg-carbon border border-white/7 p-8 hover:border-gold/20 transition-all duration-300">
              <div className="flex items-start justify-between gap-6 mb-4">
                <div>
                  <h2 className="font-display font-bold text-cream text-xl mb-1">{g.name}</h2>
                  <span className="text-[9px] bg-white/5 text-platinum/42 px-2 py-1 rounded-sm font-mono">{g.type}</span>
                </div>
                <a href={g.url} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-platinum/38 hover:text-gold transition-colors shrink-0 mt-1">
                  {g.short} ↗
                </a>
              </div>
              <p className="text-platinum/60 text-sm leading-relaxed mb-4">{g.description}</p>
              <div className="flex flex-wrap gap-2">
                {g.focus.map((f) => (
                  <span key={f} className="text-[9px] text-gold/60 bg-gold/5 border border-gold/15 px-2 py-0.5 rounded-sm">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Co-apply CTA */}
      <div className="border border-white/10 p-10 text-center">
        <div className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-mono mb-4">Collaborate on Funding</div>
        <h2 className="font-display font-bold text-cream text-3xl mb-4">Co-Apply with ECADEL LABS</h2>
        <p className="text-platinum/60 text-sm leading-relaxed max-w-xl mx-auto mb-8">
          Universities, research institutions, and NGOs can co-apply for grants with ECADEL LABS. If your research agenda aligns with ours, we want to hear from you.
        </p>
        <Link href="/contact?type=grant"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-obsidian font-display font-semibold text-sm hover:bg-gold-dim transition-colors">
          Grant Partnership Inquiry <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
