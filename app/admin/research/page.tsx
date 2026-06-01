import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminResearchList from "./AdminResearchList";

export const dynamic = "force-dynamic";

export default async function ResearchAdmin({ searchParams }: { searchParams: Promise<{ q?:string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const all = await prisma.researchProject.findMany({ orderBy:{ createdAt:"desc" } });
  const projects = query
    ? all.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.status.includes(query.toLowerCase()))
    : all;

  const published = all.filter((p) => p.published).length;

  return (
    <div style={{ padding:"2rem 2.5rem" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1.5rem" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.25rem" }}>Research Projects</h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)" }}>{all.length} total · {published} published</p>
        </div>
        <Link href="/admin/research/new" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.6rem 1.125rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
          <Plus size={14} /> New Project
        </Link>
      </div>
      <AdminResearchList
        projects={projects.map(p => ({ id:p.id, title:p.title, slug:p.slug, status:p.status, problem:p.problem, published:p.published, createdAt:p.createdAt.toISOString() }))}
        initialQuery={query}
      />
    </div>
  );
}
