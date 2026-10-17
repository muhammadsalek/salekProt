import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

// Public-site reads. Cached until the admin saves: admin actions call updateTag(<same tag>).

export async function getProfile() {
  "use cache";
  cacheLife("max");
  cacheTag("profile");
  return db.profile.findUnique({ where: { id: 1 } });
}

export async function getPublications() {
  "use cache";
  cacheLife("max");
  cacheTag("publications");
  return db.publication.findMany({ orderBy: [{ year: "desc" }, { createdAt: "desc" }] });
}

export async function getFeaturedPublications() {
  "use cache";
  cacheLife("max");
  cacheTag("publications");
  return db.publication.findMany({
    where: { featured: true },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    take: 3,
  });
}

export async function getResearchAreas() {
  "use cache";
  cacheLife("max");
  cacheTag("research");
  return db.researchArea.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
}

export async function getTutorials(take?: number) {
  "use cache";
  cacheLife("max");
  cacheTag("tutorials");
  return db.tutorial.findMany({ orderBy: [{ date: "desc" }, { createdAt: "desc" }], take });
}

export async function getAboutData() {
  "use cache";
  cacheLife("max");
  cacheTag("education", "skills", "awards");
  const [education, skills, awards] = await Promise.all([
    db.education.findMany({ orderBy: [{ order: "asc" }, { startYear: "desc" }] }),
    db.skill.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
    db.award.findMany({ orderBy: { year: "desc" } }),
  ]);
  return { education, skills, awards };
}

export type Publication = Awaited<ReturnType<typeof getPublications>>[number];
export type Tutorial = Awaited<ReturnType<typeof getTutorials>>[number];
export type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>>;
