"use server";

import { updateTag } from "next/cache";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { ACTIVITY_CATEGORIES } from "@/lib/academic-activities";

function field(data: FormData, key: string, max = 1500) {
  return String(data.get(key) ?? "").trim().slice(0, max);
}

function validated(data: FormData) {
  const title = field(data, "title", 180);
  const category = field(data, "category", 100);
  if (!title) throw new Error("Title is required");
  if (!ACTIVITY_CATEGORIES.some((c) => c === category)) throw new Error("Invalid category");
  const rawUrl = field(data, "link", 1500);
  let link: string | null = null;
  if (rawUrl) {
    const url = new URL(rawUrl);
    if (!["https:", "http:"].includes(url.protocol)) throw new Error("Use an HTTP(S) link");
    link = url.toString();
  }
  const rawOrder = Number(field(data, "order", 6));
  const order = Number.isSafeInteger(rawOrder) && rawOrder >= 0 && rawOrder <= 9999 ? rawOrder : 0;
  return {
    title, category, order, link,
    organization: field(data, "organization", 250) || null,
    dateLabel: field(data, "dateLabel", 100) || null,
    description: field(data, "description", 5000) || null,
  };
}
function refresh() {
  updateTag("academic-activities");
  revalidatePath("/about");
  revalidatePath("/admin/activities");
}

export async function createActivity(data: FormData) {
  await requireAdmin();
  await db.academicActivity.create({ data: validated(data) });
  refresh();
}

export async function updateActivity(data: FormData) {
  await requireAdmin();
  const id = field(data, "id", 50);
  if (!id) throw new Error("Missing activity ID");
  await db.academicActivity.update({ where: { id }, data: validated(data) });
  refresh();
}

export async function deleteActivity(data: FormData) {
  await requireAdmin();
  const id = field(data, "id", 50);
  if (!id) throw new Error("Missing activity ID");
  await db.academicActivity.delete({ where: { id } });
  refresh();
}
