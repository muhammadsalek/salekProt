-- Apply this migration ONCE to your PostgreSQL database before deploying the new page.
CREATE TABLE IF NOT EXISTS "AcademicActivity" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "organization" TEXT,
  "dateLabel" TEXT,
  "description" TEXT,
  "link" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AcademicActivity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "AcademicActivity_category_order_idx" ON "AcademicActivity"("category", "order");
