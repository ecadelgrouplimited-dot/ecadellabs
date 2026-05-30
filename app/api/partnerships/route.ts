import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "true";
  const items = await prisma.partnership.findMany({
    where:   admin ? {} : { active: true },
    orderBy: [{ featured: "desc" }, { institution: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.partnership.create({
      data: {
        institution: body.institution,
        slug:        body.slug || slugify(body.institution),
        type:        body.type ?? "university",
        description: body.description,
        country:     body.country,
        website:     body.website ?? null,
        logoUrl:     body.logoUrl ?? null,
        active:      body.active ?? true,
        featured:    body.featured ?? false,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create partnership" }, { status: 500 });
  }
}
