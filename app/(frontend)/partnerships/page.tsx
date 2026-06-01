import { prisma } from "@/lib/db";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";
import { Suspense } from "react";
import FilterBar from "@/components/ui/FilterBar";
import type { Metadata } from "next";

export const revalidate = 300  // 5-min ISR cache;

export const metadata: Metadata = {
  title: "Partnerships",
  description: "ECADEL LABS' institutional research partners — universities, development banks, research bodies, and governments advancing African intelligence infrastructure.",
};

const TYPE_LABELS: Record<string,string> = {
  "university":"University","research-body":"Research Body",
  "government":"Government","ngo":"NGO","development-bank":"Development Bank",
};

const TYPE_OPTIONS = [
  { value:"university",      label:"Universities" },
  { value:"development-bank",label:"Development Banks" },
  { value:"research-body",   label:"Research Bodies" },
  { value:"government",      label:"Government" },
  { value:"ngo",             label:"NGOs" },
];

export default async function PartnershipsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;

  const partners = await prisma.partnership.findMany({
    where: { active:true, ...(type ? { type } : {}) },
    orderBy: [{ featured:"desc" },{ institution:"asc" }],
  });

  const totalCount = await prisma.partnership.count({ where:{ active:true } });

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
            Institutional Partners
          </p>
          <h1 style={{ fontSize:"clamp(1.8rem,2.5vw,2.5rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, fontFamily:"var(--font-display)", marginBottom:"1.125rem" }}>
            Research Partnerships.
          </h1>
          <p style={{ color:"rgba(200,196,190,0.62)", maxWidth:"42rem", lineHeight:1.75, fontSize:"0.9375rem", marginBottom:"1.5rem" }}>
            ECADEL LABS collaborates with universities, research institutions, development banks, and governments to advance African intelligence infrastructure research.
          </p>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
            {/* Filter */}
            <Suspense>
              <FilterBar param="type" options={TYPE_OPTIONS} allLabel={`All (${totalCount})`} />
            </Suspense>

            <Link href="/contact?type=partnership" style={{ fontSize:"0.8125rem", color:"rgba(200,169,110,0.75)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.375rem", borderBottom:"1px solid rgba(200,169,110,0.25)", paddingBottom:"1px", flexShrink:0 }}>
              Become a partner <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Partner grid ────────────────────────────────────────────────── */}
      <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>
        {partners.length === 0 ? (
          <div style={{ textAlign:"center", padding:"5rem 0", color:"rgba(200,196,190,0.35)", fontSize:"0.875rem" }}>
            No partners in this category yet.{" "}
            <Link href="/partnerships" style={{ color:"rgba(200,169,110,0.7)", textDecoration:"none" }}>View all →</Link>
          </div>
        ) : (
          <div className="partner-grid" style={{ backgroundColor:"rgba(255,255,255,0.06)", marginBottom:"3rem" }}>
            {partners.map((p) => (
              <div key={p.id} style={{ backgroundColor:"#060608", padding:"2rem" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
                  <span style={{ fontSize:"9px", padding:"2px 7px", fontFamily:"monospace", backgroundColor:"rgba(255,255,255,0.05)", color:"rgba(200,196,190,0.42)" }}>
                    {TYPE_LABELS[p.type] ?? p.type}
                  </span>
                  <span style={{ fontSize:"9px", color:"rgba(200,196,190,0.35)", fontFamily:"monospace" }}>{p.country}</span>
                </div>

                <h3 style={{ fontSize:"1rem", fontWeight:600, color:"#F0EDE6", fontFamily:"var(--font-display)", marginBottom:"0.75rem" }}>{p.institution}</h3>

                <p style={{ color:"rgba(200,196,190,0.52)", fontSize:"0.8125rem", lineHeight:1.7, marginBottom:"1.25rem", overflow:"hidden", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical" }}>
                  {p.description}
                </p>

                {p.website && (
                  <a href={p.website} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"0.375rem", fontSize:"10px", color:"rgba(200,196,190,0.38)", textDecoration:"none" }}>
                    <Globe size={10} /> Website ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{ padding:"3rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", textAlign:"center" }}>
          <h2 style={{ fontSize:"clamp(1.4rem,2vw,1.75rem)", fontWeight:700, color:"#F0EDE6", fontFamily:"var(--font-display)", marginBottom:"0.875rem" }}>Research With Us</h2>
          <p style={{ color:"rgba(200,196,190,0.52)", fontSize:"0.875rem", lineHeight:1.7, maxWidth:"30rem", margin:"0 auto 1.75rem" }}>
            Universities, research bodies, and institutions that share our commitment to African technology infrastructure are welcome to reach out about formal research partnerships.
          </p>
          <Link href="/contact?type=partnership" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.8rem 2rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none" }}>
            Partnership Inquiry <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
