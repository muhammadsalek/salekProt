-- CreateEnum
CREATE TYPE "ExperienceCategory" AS ENUM ('RESEARCH', 'FUNDED_PROJECT', 'TEACHING', 'PEER_REVIEW', 'LEADERSHIP');

-- AlterTable
ALTER TABLE "Award" ALTER COLUMN "year" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "location" TEXT,
    "category" "ExperienceCategory" NOT NULL DEFAULT 'RESEARCH',
    "startYear" INTEGER NOT NULL,
    "startMonth" INTEGER,
    "endYear" INTEGER,
    "endMonth" INTEGER,
    "description" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Experience_category_startYear_idx" ON "Experience"("category", "startYear");

