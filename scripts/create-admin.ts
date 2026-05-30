import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import * as readline from "readline";
import path from "node:path";

function createClient() {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/ecadellabs.db";
  const rel  = raw.replace(/^file:/, "");
  const url  = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

const prisma = createClient();

function prompt(q: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(q, (ans) => { rl.close(); resolve(ans); }));
}

async function main() {
  console.log("\n── ECADEL LABS Admin Account Creation ──\n");

  // Support non-interactive mode via CLI args: tsx create-admin.ts name email password
  let name     = process.argv[2] ?? "";
  let email    = process.argv[3] ?? "";
  let password = process.argv[4] ?? "";

  if (!name)     name     = await prompt("Full name: ");
  if (!email)    email    = await prompt("Email:     ");
  if (!password) password = await prompt("Password:  ");

  if (!name || !email || !password) {
    console.error("All fields are required.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.adminUser.upsert({
    where:  { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });

  console.log(`\n✓ Admin account ready: ${user.email}`);
  console.log(`  Login at: /admin/login`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
