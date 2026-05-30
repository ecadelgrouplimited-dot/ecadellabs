import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pub = await prisma.publication.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!pub) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pub);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const pub = await prisma.publication.update({
      where: { id },
      data: {
        ...(body.title    && { title: body.title, slug: body.slug || slugify(body.title) }),
        ...(body.abstract !== undefined && { abstract: body.abstract }),
        ...(body.content  !== undefined && { content: body.content }),
        ...(body.category && { category: body.category }),
        ...(body.authors  && { authors: JSON.stringify(body.authors) }),
        ...(body.tags     && { tags: JSON.stringify(body.tags) }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.published !== undefined && {
          published:   body.published,
          publishedAt: body.published ? new Date() : null,
        }),
        ...(body.pdfUrl   !== undefined && { pdfUrl: body.pdfUrl }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      },
    });
    return NextResponse.json(pub);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.publication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
