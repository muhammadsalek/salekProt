-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cvUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "xUrl" TEXT;
