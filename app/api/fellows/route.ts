import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "true";
  const fellows = await prisma.fellow.findMany({
    where:   admin ? {} : { active: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
  return NextResponse.json(fellows);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fellow = await prisma.fellow.create({
      data: {
        name:        body.name,
        role:        body.role ?? "research-fellow",
        bio:         body.bio,
        expertise:   JSON.stringify(body.expertise ?? []),
        institution: body.institution ?? null,
        cohort:      body.cohort ?? null,
        photoUrl:    body.photoUrl ?? null,
        linkedinUrl: body.linkedinUrl ?? null,
        active:      body.active ?? true,
        featured:    body.featured ?? false,
      },
    });
    return NextResponse.json(fellow, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create fellow" }, { status: 500 });
  }
}
