import { defineConfig } from "prisma/config";

// This file configures the Prisma migration engine (schema engine / db push).
// The PrismaClient adapter (better-sqlite3) is configured in lib/db.ts separately.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./prisma/ecadellabs.db",
  },
});
