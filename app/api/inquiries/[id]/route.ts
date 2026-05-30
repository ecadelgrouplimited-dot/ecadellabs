import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: {
      ...(body.read     !== undefined && { read: body.read }),
      ...(body.archived !== undefined && { archived: body.archived }),
    },
  });
  return NextResponse.json(inquiry);
}
