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
  const role   = searchParams.get("role")   ?? undefined;
  const limit  = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const page   = Math.max(Number(searchParams.get("page")  ?? "1"), 1);

  const where = { active:true, ...(role ? { role } : {}) };

  const [items, total] = await Promise.all([
    prisma.fellow.findMany({
      where,
      select: { id:true, slug:true, name:true, role:true, bio:true, expertise:true, institution:true, cohort:true, linkedinUrl:true, orcid:true, featured:true },
      orderBy: [{ featured:"desc" },{ name:"asc" }],
      take:  limit,
      skip: (page-1) * limit,
    }),
    prisma.fellow.count({ where }),
  ]);

  const data = items.map((f) => ({
    ...f,
    expertise: JSON.parse(f.expertise),
    profileUrl: f.slug ? `https://ecadellabs.cloud/fellows/${f.slug}` : null,
  }));

  return NextResponse.json({ data, meta:{ total, page, limit, pages:Math.ceil(total/limit) } }, { headers:CORS });
}
