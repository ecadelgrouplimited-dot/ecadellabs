import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.setting.findMany();
  const map = Object.fromEntries(settings.map((s) => {
    try { return [s.key, JSON.parse(s.value)]; }
    catch { return [s.key, s.value]; }
  }));
  return NextResponse.json(map);
}

export async function POST(request: Request) {
  try {
    const body = await request.json(); // { key: string, value: any }[]
    const ops = Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({
        where:  { key },
        update: { value: JSON.stringify(value) },
        create: { key,   value: JSON.stringify(value) },
      })
    );
    await prisma.$transaction(ops);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
