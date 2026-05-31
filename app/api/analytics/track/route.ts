import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { path, referrer } = await request.json();
    if (!path || typeof path !== "string") return NextResponse.json({ ok:false });

    // Skip admin routes
    if (path.startsWith("/admin")) return NextResponse.json({ ok:true });

    await prisma.pageView.create({
      data: { path: path.slice(0, 500), referrer: referrer?.slice(0, 500) ?? null },
    });
    return NextResponse.json({ ok:true });
  } catch {
    return NextResponse.json({ ok:false });
  }
}
