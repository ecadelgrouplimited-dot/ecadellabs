import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const archived = searchParams.get("archived") === "true";
  const inquiries = await prisma.inquiry.findMany({
    where:   { archived },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(inquiries);
}
