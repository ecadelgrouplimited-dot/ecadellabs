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
  const status = searchParams.get("status") ?? undefined;
  const limit  = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const page   = Math.max(Number(searchParams.get("page")  ?? "1"), 1);

  const where = {
    published: true,
    ...(status ? { status } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.researchProject.findMany({
      where,
      select: {
        id:true, title:true, slug:true, description:true, problem:true,
        status:true, technologies:true, partners:true, startDate:true, featured:true,
      },
      orderBy: [{ featured:"desc" }, { createdAt:"desc" }],
      take:  limit,
      skip: (page - 1) * limit,
    }),
    prisma.researchProject.count({ where }),
  ]);

  const data = items.map((p) => ({
    ...p,
    technologies: JSON.parse(p.technologies),
    partners:     p.partners ? JSON.parse(p.partners) : [],
    url:         `https://ecadellabs.cloud/research/${p.slug}`,
  }));

  return NextResponse.json({
    data,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  }, { headers: CORS });
}
