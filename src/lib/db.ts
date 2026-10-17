import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    // The local `prisma dev` server only handles one connection at a time; set to 1 there.
    max: Number(process.env.DATABASE_POOL_MAX) || undefined,
  });
  return new PrismaClient({ adapter });
}

// Reuse one client across hot reloads in development.
const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
