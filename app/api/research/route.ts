import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "true";
  const projects = await prisma.researchProject.findMany({
    where:   admin ? {} : { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await prisma.researchProject.create({
      data: {
        title:        body.title,
        slug:         body.slug || slugify(body.title),
        description:  body.description,
        problem:      body.problem,
        methodology:  body.methodology ?? null,
        outcomes:     body.outcomes ?? null,
        status:       body.status ?? "planned",
        technologies: JSON.stringify(body.technologies ?? []),
        partners:     body.partners ? JSON.stringify(body.partners) : null,
        startDate:    body.startDate ? new Date(body.startDate) : null,
        endDate:      body.endDate ? new Date(body.endDate) : null,
        featured:     body.featured ?? false,
        published:    body.published ?? false,
        imageUrl:     body.imageUrl ?? null,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
