import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin     = searchParams.get("admin") === "true";
  const published = !admin;
  const publications = await prisma.publication.findMany({
    where:   published ? { published: true } : {},
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(publications);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.slug || slugify(body.title);
    const pub = await prisma.publication.create({
      data: {
        title:       body.title,
        slug,
        abstract:    body.abstract,
        content:     body.content ?? "",
        category:    body.category ?? "research-note",
        authors:     JSON.stringify(body.authors ?? []),
        tags:        JSON.stringify(body.tags ?? []),
        featured:    body.featured ?? false,
        published:   body.published ?? false,
        publishedAt: body.published ? new Date() : null,
        pdfUrl:      body.pdfUrl ?? null,
        imageUrl:    body.imageUrl ?? null,
      },
    });
    return NextResponse.json(pub, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create publication" }, { status: 500 });
  }
}
