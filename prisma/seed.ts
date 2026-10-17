// Creates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD. Safe to run more than once.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/password";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.");
  }
  if (password.length < 10) throw new Error("ADMIN_PASSWORD must be at least 10 characters.");

  if (await db.adminUser.count()) {
    console.log("Admin account already exists — nothing to do.");
    return;
  }

  await db.adminUser.create({ data: { email, passwordHash: await hashPassword(password) } });
  console.log(`Created admin account for ${email}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
