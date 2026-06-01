import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  const pub = await prisma.publication.findFirst({ where:{ slug, published:true } });
  if (!pub) return new NextResponse("Not found", { status:404 });

  const authors  = JSON.parse(pub.authors) as string[];
  const year     = pub.publishedAt ? new Date(pub.publishedAt).getFullYear() : new Date().getFullYear();
  const key      = `ecadellabs${year}_${slug.replace(/-/g,"_").slice(0,30)}`;

  const authorBib = authors
    .map((a) => { const parts = a.trim().split(" "); return parts.length > 1 ? `${parts[parts.length-1]}, ${parts.slice(0,-1).join(" ")}` : a; })
    .join(" and ");

  const bib = `@techreport{${key},
  author       = {${authorBib || "ECADEL LABS Research Team"}},
  title        = {{${pub.title}}},
  institution  = {ECADEL LABS, ECADEL GROUP LIMITED},
  year         = {${year}},
  type         = {${pub.category.replace(/-/g," ")}},
  url          = {https://ecadellabs.cloud/publications/${pub.slug}},
  note         = {Retrieved from ecadellabs.cloud}
}
`;

  return new NextResponse(bib, {
    headers: {
      "Content-Type":        "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.bib"`,
    },
  });
}
