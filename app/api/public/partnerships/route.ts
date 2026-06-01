import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "X-ECADEL-LABS-API":            "v1",
};

export async function OPTIONS() {
  return new Response(null, { status:204, headers:CORS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type  = searchParams.get("type")  ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const page  = Math.max(Number(searchParams.get("page")  ?? "1"), 1);

  const where = { active:true, ...(type ? { type } : {}) };

  const [items, total] = await Promise.all([
    prisma.partnership.findMany({
      where,
      select: { id:true, institution:true, slug:true, type:true, description:true, country:true, website:true, featured:true },
      orderBy: [{ featured:"desc" },{ institution:"asc" }],
      take:  limit,
      skip: (page-1) * limit,
    }),
    prisma.partnership.count({ where }),
  ]);

  return NextResponse.json({ data:items, meta:{ total, page, limit, pages:Math.ceil(total/limit) } }, { headers:CORS });
}
