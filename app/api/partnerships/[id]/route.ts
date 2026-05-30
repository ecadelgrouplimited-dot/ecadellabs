import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const item = await prisma.partnership.update({
    where: { id },
    data: {
      ...(body.institution && { institution: body.institution }),
      ...(body.type        && { type: body.type }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.country     && { country: body.country }),
      ...(body.website     !== undefined && { website: body.website }),
      ...(body.logoUrl     !== undefined && { logoUrl: body.logoUrl }),
      ...(body.active      !== undefined && { active: body.active }),
      ...(body.featured    !== undefined && { featured: body.featured }),
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.partnership.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
