import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.researchProject.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const project = await prisma.researchProject.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title, slug: body.slug || slugify(body.title) }),
        ...(body.description  !== undefined && { description: body.description }),
        ...(body.problem      !== undefined && { problem: body.problem }),
        ...(body.methodology  !== undefined && { methodology: body.methodology }),
        ...(body.outcomes     !== undefined && { outcomes: body.outcomes }),
        ...(body.status       && { status: body.status }),
        ...(body.technologies && { technologies: JSON.stringify(body.technologies) }),
        ...(body.partners     !== undefined && { partners: body.partners ? JSON.stringify(body.partners) : null }),
        ...(body.featured     !== undefined && { featured: body.featured }),
        ...(body.published    !== undefined && { published: body.published }),
        ...(body.imageUrl     !== undefined && { imageUrl: body.imageUrl }),
      },
    });
    return NextResponse.json(project);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.researchProject.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
