import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Ping the database
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status:  "ok",
      service: "ecadellabs",
      db:      "connected",
      ts:      new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { status:"error", service:"ecadellabs", db:"disconnected", ts:new Date().toISOString() },
      { status:503 }
    );
  }
}
