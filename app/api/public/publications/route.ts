import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "X-ECADEL-LABS-API":            "v1",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const tag      = searchParams.get("tag")      ?? undefined;
  const limit    = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const page     = Math.max(Number(searchParams.get("page")  ?? "1"), 1);

  const where = {
    published: true,
    ...(category ? { category } : {}),
    ...(tag ? { tags: { contains: tag } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.publication.findMany({
      where,
      select: {
        id:true, title:true, slug:true, abstract:true, category:true,
        authors:true, tags:true, pdfUrl:true, publishedAt:true, featured:true,
      },
      orderBy: [{ featured:"desc" }, { publishedAt:"desc" }],
      take:   limit,
      skip:  (page - 1) * limit,
    }),
    prisma.publication.count({ where }),
  ]);

  const data = items.map((p) => ({
    ...p,
    authors:     JSON.parse(p.authors),
    tags:        JSON.parse(p.tags),
    url:        `https://ecadellabs.cloud/publications/${p.slug}`,
  }));

  return NextResponse.json({
    data,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  }, { headers: CORS });
}
