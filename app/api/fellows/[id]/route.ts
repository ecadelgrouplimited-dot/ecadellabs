import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fellow = await prisma.fellow.findUnique({ where: { id } });
  if (!fellow) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(fellow);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const fellow = await prisma.fellow.update({
    where: { id },
    data: {
      ...(body.name        && { name: body.name }),
      ...(body.role        && { role: body.role }),
      ...(body.bio         !== undefined && { bio: body.bio }),
      ...(body.expertise   && { expertise: JSON.stringify(body.expertise) }),
      ...(body.institution !== undefined && { institution: body.institution }),
      ...(body.cohort      !== undefined && { cohort: body.cohort }),
      ...(body.photoUrl    !== undefined && { photoUrl: body.photoUrl }),
      ...(body.linkedinUrl !== undefined && { linkedinUrl: body.linkedinUrl }),
      ...(body.active      !== undefined && { active: body.active }),
      ...(body.featured    !== undefined && { featured: body.featured }),
    },
  });
  return NextResponse.json(fellow);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.fellow.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
