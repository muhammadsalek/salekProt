// Developer recovery: sets the admin's login email + password from ADMIN_EMAIL / ADMIN_PASSWORD
// and signs out every session. Run with: npm run admin:reset
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
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
  if (password.length < 10) throw new Error("ADMIN_PASSWORD must be at least 10 characters.");

  const passwordHash = await hashPassword(password);
  const admin = await db.adminUser.findFirst();
  if (admin) {
    await db.adminUser.update({
      where: { id: admin.id },
      data: { email, passwordHash, sessionVersion: { increment: 1 } },
    });
  } else {
    await db.adminUser.create({ data: { email, passwordHash } });
  }
  console.log(`Admin login reset for ${email}. All existing sessions are signed out.`);
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
