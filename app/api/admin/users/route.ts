import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { verifyJWT, COOKIE_NAME } from "@/lib/auth";

async function requireAdmin() {
  const jar     = await cookies();
  const token   = jar.get(COOKIE_NAME)?.value;
  const payload = token ? verifyJWT(token) : null;
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt:"asc" },
    select:  { id:true, name:true, email:true, role:true, createdAt:true, lastLoginAt:true },
  });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error:"Forbidden" }, { status:403 });
  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password) return NextResponse.json({ error:"Missing fields" }, { status:400 });
    if (password.length < 8)          return NextResponse.json({ error:"Password too short" }, { status:400 });
    if (!["admin","editor"].includes(role)) return NextResponse.json({ error:"Invalid role" }, { status:400 });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.adminUser.create({
      data: { name, email, passwordHash, role },
      select: { id:true, name:true, email:true, role:true, createdAt:true },
    });
    return NextResponse.json(user, { status:201 });
  } catch (err: unknown) {
    if ((err as { code?:string }).code === "P2002") return NextResponse.json({ error:"Email already exists" }, { status:409 });
    return NextResponse.json({ error:"Failed to create user" }, { status:500 });
  }
}

export async function PATCH(request: Request) {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const { id, role } = await request.json();
  if (id === me.id) return NextResponse.json({ error:"Cannot change your own role" }, { status:400 });
  const user = await prisma.adminUser.update({ where:{ id }, data:{ role }, select:{ id:true, role:true } });
  return NextResponse.json(user);
}

export async function DELETE(request: Request) {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const { id } = await request.json();
  if (id === me.id) return NextResponse.json({ error:"Cannot delete yourself" }, { status:400 });
  await prisma.adminUser.delete({ where:{ id } });
  return NextResponse.json({ success:true });
}
