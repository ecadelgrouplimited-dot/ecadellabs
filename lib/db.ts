import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

function getDbUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/ecadellabs.db";
  const rel  = raw.replace(/^file:/, "");
  return path.isAbsolute(rel) ? rel : path.join(/*turbopackIgnore: true*/ process.cwd(), rel);
}

function createClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({ url: getDbUrl() });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma    = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
