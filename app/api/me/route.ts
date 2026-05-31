import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  const jar   = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const payload = verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  return NextResponse.json({ id: payload.id, name: payload.name, email: payload.email, role: payload.role ?? "admin" });
}
