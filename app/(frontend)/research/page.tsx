import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Suspense } from "react";
import FilterBar from "@/components/ui/FilterBar";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const getProjects = unstable_cache(
  async (status?: string) => {
    const [projects, totalCount] = await Promise.all([
      prisma.researchProject.findMany({
        where:   { published:true, ...(status ? { status } : {}) },
        orderBy: [{ featured:"desc" },{ createdAt:"desc" }],
      }),
      prisma.researchProject.count({ where:{ published:true } }),
    ]);
    return { projects, totalCount };
  },
  ["research-list"],
  { revalidate: 180, tags:["research"] }
);

export const metadata: Metadata = {
  title: "Research Agenda",
  description: "ECADEL LABS' active research agenda — investigating the problems that matter most for African intelligence infrastructure.",
};

const STATUS_COLOR: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };
const STATUS_LABEL: Record<string,string> = { active:"Active", completed:"Completed", planned:"Planned" };

const STATUS_OPTIONS = [
  { value:"active",    label:"Active" },
  { value:"planned",   label:"Planned" },
  { value:"completed", label:"Completed" },
];

export default async function ResearchPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;

  const { projects, totalCount } = await getProjects(status);

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>
            Research Agenda
          </p>
          <h1 style={{ fontSize:"clamp(1.8rem,2.5vw,2.5rem)", fontWeight:700, color:"#F0EDE6", lineHeight:1.1, fontFamily:"var(--font-display)", marginBottom:"1.125rem" }}>
            What We Are Investigating.
          </h1>
          <p style={{ color:"rgba(200,196,190,0.62)", maxWidth:"42rem", lineHeight:1.75, fontSize:"0.9375rem", marginBottom:"2rem" }}>
            ECADEL LABS pursues research into the problems that matter most for African intelligence infrastructure — complex, underserved, and consequential.
          </p>

          {/* Filter bar */}
          <Suspense>
            <FilterBar param="status" options={STATUS_OPTIONS} allLabel={`All (${totalCount})`} />
          </Suspense>
        </div>
      </div>

      {/* ── Project list ────────────────────────────────────────────────── */}
      <div style={{ maxWidth:"80rem", margin:"0 auto", padding:"2.5rem 1.5rem 5rem" }}>
        {projects.length === 0 ? (
          <div style={{ textAlign:"center", padding:"5rem 0", color:"rgba(200,196,190,0.35)", fontSize:"0.875rem" }}>
            No {status} research projects yet.{" "}
            <Link href="/research" style={{ color:"rgba(200,169,110,0.7)", textDecoration:"none" }}>View all →</Link>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.06)" }}>
            {projects.map((p) => {
              const techs = JSON.parse(p.technologies) as string[];
              return (
                <Link
                  key={p.id}
                  href={`/research/${p.slug}`}
                  style={{ backgroundColor:"#060608", padding:"2rem 2rem 2rem 1.75rem", display:"flex", alignItems:"flex-start", gap:"2rem", textDecoration:"none", borderLeft:"3px solid transparent", transition:"all 0.2s" }}
                  className="hover:bg-deep hover:border-l-gold group"
                >
                  {/* Status */}
                  <div style={{ flexShrink:0, paddingTop:"0.2rem", minWidth:"70px" }}>
                    <span style={{ fontSize:"8px", padding:"3px 9px", fontFamily:"monospace", letterSpacing:"0.1em", textTransform:"uppercase", display:"inline-block", backgroundColor:`${STATUS_COLOR[p.status]}14`, color:STATUS_COLOR[p.status] }}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <h2 style={{ fontSize:"1rem", fontWeight:600, color:"#F0EDE6", lineHeight:1.4, marginBottom:"0.5rem", fontFamily:"var(--font-display)" }} className="group-hover:text-gold transition-colors">
                      {p.title}
                    </h2>
                    <p style={{ color:"rgba(200,196,190,0.52)", fontSize:"0.8125rem", lineHeight:1.7, marginBottom:"0.875rem", overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {p.problem}
                    </p>
                    {techs.length > 0 && (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem" }}>
                        {techs.slice(0,4).map((t) => (
                          <span key={t} style={{ fontSize:"9px", padding:"2px 7px", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.38)", fontFamily:"monospace" }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <ChevronRight size={16} color="rgba(200,196,190,0.2)" style={{ flexShrink:0, marginTop:"0.2rem" }} className="group-hover:text-gold transition-colors" />
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop:"4rem", padding:"2.5rem", backgroundColor:"#0A0C12", border:"1px solid rgba(255,255,255,0.07)", textAlign:"center" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"0.875rem" }}>Research Collaboration</p>
          <h3 style={{ fontSize:"1.25rem", fontWeight:700, color:"#F0EDE6", fontFamily:"var(--font-display)", marginBottom:"0.75rem" }}>Partner on a Research Problem</h3>
          <p style={{ color:"rgba(200,196,190,0.52)", fontSize:"0.875rem", lineHeight:1.7, marginBottom:"1.5rem" }}>
            Universities, institutions, and researchers are welcome to contact us about formal research collaboration.
          </p>
          <Link href="/contact?type=research" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.75rem 1.75rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none" }}>
            Research Inquiry <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
