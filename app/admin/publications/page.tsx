import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit2, ExternalLink } from "lucide-react";
import PublishToggle from "@/components/admin/PublishToggle";
import AdminPublicationsList from "./AdminPublicationsList";

export const dynamic = "force-dynamic";

const CAT: Record<string,string> = {
  "white-paper":"White Paper","research-note":"Research Note",
  "technical-report":"Technical Report","position-paper":"Position Paper",
};

export default async function PublicationsAdmin({ searchParams }: { searchParams: Promise<{ q?:string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const all = await prisma.publication.findMany({ orderBy:{ createdAt:"desc" }, select:{ id:true, title:true, slug:true, category:true, published:true, createdAt:true, content:true } });
  const pubs = query
    ? all.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.slug.includes(query.toLowerCase()))
    : all;

  const published = all.filter((p) => p.published).length;

  return (
    <div style={{ padding:"2rem 2.5rem" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1.5rem" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F0EDE6", fontSize:"1.375rem", marginBottom:"0.25rem" }}>
            Publications
          </h1>
          <p style={{ fontSize:"0.8125rem", color:"rgba(200,196,190,0.45)" }}>
            {all.length} total · {published} published
          </p>
        </div>
        <Link href="/admin/publications/new" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.6rem 1.125rem", backgroundColor:"#C8A96E", color:"#060608", fontFamily:"var(--font-display)", fontWeight:600, fontSize:"0.8125rem", textDecoration:"none", borderRadius:"3px" }}>
          <Plus size={14} /> New Publication
        </Link>
      </div>

      {/* Client component handles search input + bulk actions */}
      <AdminPublicationsList
        pubs={pubs.map((p) => ({
          id:p.id, title:p.title, slug:p.slug, category:p.category,
          published:p.published, createdAt:p.createdAt.toISOString(),
          readMins: p.content ? Math.max(1, Math.ceil(p.content.split(/\s+/).filter(Boolean).length / 200)) : null,
        }))}
        initialQuery={query}
        catLabels={CAT}
      />
    </div>
  );
}
