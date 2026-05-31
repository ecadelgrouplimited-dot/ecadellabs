import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/db";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  const jar     = await cookies();
  const token   = jar.get(COOKIE_NAME)?.value;
  const payload = token ? verifyJWT(token) : null;
  if (!payload) return NextResponse.json({ error:"Forbidden" }, { status:403 });

  const dbPath = path.join(process.cwd(), "prisma", "ecadellabs.db");
  let dbSizeKb = 0;
  try {
    const stat = fs.statSync(dbPath);
    dbSizeKb = Math.round(stat.size / 1024);
  } catch { /* ignore */ }

  const [pubCount, projCount, inqCount, viewCount] = await Promise.all([
    prisma.publication.count({ where:{ published:true } }),
    prisma.researchProject.count({ where:{ published:true } }),
    prisma.inquiry.count({ where:{ archived:false } }),
    prisma.pageView.count(),
  ]);

  return NextResponse.json({
    dbSizeKb,
    publishedPublications: pubCount,
    publishedProjects:     projCount,
    totalInquiries:        inqCount,
    totalPageViews:        viewCount,
    nodeVersion:           process.version,
    uptime:                Math.round(process.uptime()),
  });
}
