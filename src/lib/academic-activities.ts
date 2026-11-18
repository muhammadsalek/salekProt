import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

export const ACTIVITY_CATEGORIES = [
  "Professional Appointments & Memberships",
  "Professional Training & Certifications",
  "Workshops & Conferences",
  "Leadership & Community Engagement",
  "Academic Service & Volunteering",
] as const;

export async function getAcademicActivities() {
  "use cache";
  cacheLife("max");
  cacheTag("academic-activities");
  return db.academicActivity.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}
