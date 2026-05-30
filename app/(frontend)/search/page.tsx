import { prisma } from "@/lib/db";
import Link from "next/link";
import { Search, FileText, FlaskConical, ArrowRight } from "lucide-react";
import { Suspense } from "react";
import SearchInput from "./SearchInput";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search ECADEL LABS research projects, publications, and more.",
};

const STATUS_COLORS: Record<string,string> = { active:"#4ab478", completed:"#5B8FBF", planned:"#D4A24C" };
const CAT_LABELS: Record<string,string> = {
  "white-paper":"White Paper","research-note":"Research Note",
  "technical-report":"Technical Report","position-paper":"Position Paper",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let publications: { id:string; slug:string; title:string; abstract:string; category:string }[] = [];
  let projects:     { id:string; slug:string; title:string; problem:string; status:string }[]    = [];

  if (query.length >= 2) {
    [publications, projects] = await Promise.all([
      prisma.publication.findMany({
        where: {
          published: true,
          OR: [
            { title:    { contains: query } },
            { abstract: { contains: query } },
            { tags:     { contains: query } },
            { content:  { contains: query } },
            { authors:  { contains: query } },
          ],
        },
        select: { id:true, slug:true, title:true, abstract:true, category:true },
        orderBy: [{ featured:"desc" }, { publishedAt:"desc" }],
        take: 20,
      }),
      prisma.researchProject.findMany({
        where: {
          published: true,
          OR: [
            { title:        { contains: query } },
            { problem:      { contains: query } },
            { description:  { contains: query } },
            { technologies: { contains: query } },
            { methodology:  { contains: query } },
          ],
        },
        select: { id:true, slug:true, title:true, problem:true, status:true },
        orderBy: [{ featured:"desc" }, { createdAt:"desc" }],
        take: 20,
      }),
    ]);
  }

  const total = publications.length + projects.length;
  const hasQuery = query.length >= 2;

  return (
    <div style={{ backgroundColor:"#060608", minHeight:"100vh" }}>
      {/* ── Search header ───────────────────────────────────────────────── */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", backgroundColor:"#0A0C12" }}>
        <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"7rem 1.5rem 3rem" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(200,169,110,0.7)", fontFamily:"monospace", marginBottom:"1.25rem" }}>
            Search ECADEL LABS
          </p>

          {/* Search input */}
          <Suspense>
            <SearchInput initialValue={query} />
          </Suspense>

          {/* Result count */}
          {hasQuery && (
            <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.42)", marginTop:"1rem" }}>
              {total === 0
                ? `No results for "${query}"`
                : `${total} result${total !== 1 ? "s" : ""} for "${query}"`}
            </p>
          )}
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:"56rem", margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>

        {/* Empty/prompt state */}
        {!hasQuery && (
          <div style={{ textAlign:"center", padding:"4rem 0" }}>
            <Search size={32} color="rgba(200,196,190,0.18)" style={{ margin:"0 auto 1.25rem" }} />
            <p style={{ color:"rgba(200,196,190,0.38)", fontSize:"0.9375rem" }}>
              Search publications, research projects, topics, and authors.
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:"0.5rem", flexWrap:"wrap", marginTop:"2rem" }}>
              {["AI","Africa","Mobile Money","Offline","Governance"].map((t) => (
                <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} style={{ padding:"0.375rem 0.875rem", fontSize:"9px", letterSpacing:"0.12em", fontFamily:"monospace", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.45)", textDecoration:"none", border:"1px solid rgba(255,255,255,0.07)" }}>
                  {t}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {hasQuery && total === 0 && (
          <div style={{ textAlign:"center", padding:"4rem 0" }}>
            <p style={{ color:"rgba(200,196,190,0.38)", fontSize:"0.9375rem", marginBottom:"1.5rem" }}>
              Nothing matched your search. Try different keywords.
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:"0.875rem", flexWrap:"wrap" }}>
              <Link href="/research"     style={{ fontSize:"0.8125rem", color:"rgba(200,169,110,0.7)", textDecoration:"none" }}>Browse Research →</Link>
              <Link href="/publications" style={{ fontSize:"0.8125rem", color:"rgba(200,169,110,0.7)", textDecoration:"none" }}>Browse Publications →</Link>
            </div>
          </div>
        )}

        {/* Publications results */}
        {publications.length > 0 && (
          <div style={{ marginBottom:"3rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"1rem" }}>
              <FileText size={13} color="rgba(200,169,110,0.65)" />
              <span style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.65)", fontFamily:"monospace" }}>
                Publications — {publications.length}
              </span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)" }}>
              {publications.map((pub) => (
                <Link key={pub.id} href={`/publications/${pub.slug}`} style={{ backgroundColor:"#060608", padding:"1.5rem", textDecoration:"none", display:"flex", flexDirection:"column", gap:"0.5rem" }} className="hover:bg-deep group">
                  <span style={{ fontSize:"9px", fontFamily:"monospace", backgroundColor:"rgba(255,255,255,0.04)", color:"rgba(200,196,190,0.38)", padding:"2px 6px", alignSelf:"flex-start" }}>
                    {CAT_LABELS[pub.category] ?? pub.category}
                  </span>
                  <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#F0EDE6", lineHeight:1.4, fontFamily:"var(--font-display)" }} className="group-hover:text-gold transition-colors">
                    {pub.title}
                  </h3>
                  <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.5)", lineHeight:1.65, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                    {pub.abstract}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Research results */}
        {projects.length > 0 && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"1rem" }}>
              <FlaskConical size={13} color="rgba(200,169,110,0.65)" />
              <span style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(200,169,110,0.65)", fontFamily:"monospace" }}>
                Research Projects — {projects.length}
              </span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1px", backgroundColor:"rgba(255,255,255,0.05)" }}>
              {projects.map((p) => (
                <Link key={p.id} href={`/research/${p.slug}`} style={{ backgroundColor:"#060608", padding:"1.5rem", textDecoration:"none", display:"flex", alignItems:"flex-start", gap:"1rem" }} className="hover:bg-deep group">
                  <span style={{ fontSize:"8px", padding:"3px 8px", fontFamily:"monospace", textTransform:"uppercase", flexShrink:0, marginTop:"2px", backgroundColor:`${STATUS_COLORS[p.status]}14`, color:STATUS_COLORS[p.status] }}>
                    {p.status}
                  </span>
                  <div>
                    <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#F0EDE6", lineHeight:1.4, fontFamily:"var(--font-display)", marginBottom:"0.375rem" }} className="group-hover:text-gold transition-colors">
                      {p.title}
                    </h3>
                    <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.5)", lineHeight:1.65, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {p.problem}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
