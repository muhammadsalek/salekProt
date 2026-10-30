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
  return db.publication.findMany({
    orderBy: [{ year: "desc" }, { status: "asc" }, { createdAt: "asc" }],
  });
}

export async function getFeaturedPublications() {
  "use cache";
  cacheLife("max");
  cacheTag("publications");
  return db.publication.findMany({
    where: { featured: true },
    orderBy: [
      { featuredOrder: { sort: "asc", nulls: "last" } },
      { year: "desc" },
      { status: "asc" },
      { createdAt: "asc" },
    ],
  });
}

export async function getResearchAreas() {
  "use cache";
  cacheLife("max");
  cacheTag("research");
  return db.researchArea.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
}

export async function getProjects() {
  "use cache";
  cacheLife("max");
  cacheTag("projects");
  return db.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
}

export async function getTutorials(take?: number) {
  "use cache";
  cacheLife("max");
  cacheTag("tutorials");
  return db.tutorial.findMany({ orderBy: [{ date: "desc" }, { createdAt: "desc" }], take });
}

export async function getGalleryEvents(take?: number) {
  "use cache";
  cacheLife("max");
  cacheTag("gallery");
  return db.galleryEvent.findMany({
    where: { photos: { isEmpty: false } },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take,
  });
}

export async function getExperience() {
  "use cache";
  cacheLife("max");
  cacheTag("experience");
  return db.experience.findMany({
    orderBy: [
      { endYear: { sort: "desc", nulls: "first" } },
      { startYear: "desc" },
      { startMonth: { sort: "desc", nulls: "last" } },
    ],
  });
}

export async function getAboutData() {
  "use cache";
  cacheLife("max");
  cacheTag("education", "skills", "awards");
  const [education, skills, awards] = await Promise.all([
    db.education.findMany({ orderBy: [{ order: "asc" }, { startYear: "desc" }] }),
    db.skill.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
    db.award.findMany({ orderBy: { year: { sort: "desc", nulls: "last" } } }),
  ]);
  return { education, skills, awards };
}

export async function getSkills() {
  "use cache";
  cacheLife("max");
  cacheTag("skills");
  return db.skill.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
}

export type Publication = Awaited<ReturnType<typeof getPublications>>[number];
export type Tutorial = Awaited<ReturnType<typeof getTutorials>>[number];
export type Experience = Awaited<ReturnType<typeof getExperience>>[number];
export type GalleryEvent = Awaited<ReturnType<typeof getGalleryEvents>>[number];
export type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>>;
