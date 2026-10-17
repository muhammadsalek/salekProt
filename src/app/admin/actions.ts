"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { createRecord, deleteRecord, getRecord, updateRecord } from "@/lib/admin/data";
import { readForm, schemaFor, type Field, type FormState } from "@/lib/admin/fields";
import { getResource, profileFields } from "@/lib/admin/resources";
import { createSession, deleteSession, requireAdmin } from "@/lib/auth";
import {
  createUploadTicket,
  deleteAsset,
  isOwnAsset,
  type UploadKind,
  type UploadTicket,
} from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

const GENERIC_SAVE_ERROR = "Something went wrong while saving. Please try again.";

// ---------- Auth ----------

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1),
});

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const email = String(formData.get("email") ?? "");
  const failure: FormState = { error: "Incorrect email or password.", values: { email } };
  if (!parsed.success) return failure;

  const user = await db.adminUser.findUnique({ where: { email: parsed.data.email } });
  const ok = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;
  if (!user || !ok) {
    // Slow down repeated guessing.
    await new Promise((r) => setTimeout(r, 600));
    return failure;
  }

  await createSession(user.id, user.sessionVersion);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

// ---------- Uploads ----------

/** Called by the upload widget right before sending a file to Cloudinary. */
export async function getUploadTicket(kind: UploadKind): Promise<UploadTicket | null> {
  await requireAdmin();
  if (kind !== "image" && kind !== "pdf") return null;
  return createUploadTicket(kind);
}

type Values = Record<string, unknown> | null;

/** Rejects upload URLs that did not come from our Cloudinary account (unchanged values are fine). */
function checkUploads(fields: readonly Field[], data: Values, before: Values) {
  const errors: Record<string, string[]> = {};
  for (const f of fields) {
    const value = data?.[f.name];
    if (f.type !== "upload" || typeof value !== "string" || value === before?.[f.name]) continue;
    if (!isOwnAsset(value, f.upload ?? "image")) errors[f.name] = ["Please upload the file again."];
  }
  return Object.keys(errors).length ? errors : null;
}

/** After the response, deletes Cloudinary files that were replaced or removed. */
function deleteReplacedUploads(fields: readonly Field[], before: Values, current: Values) {
  const stale = fields
    .filter((f) => f.type === "upload")
    .map((f) => before?.[f.name])
    .filter((v, i, all): v is string => typeof v === "string" && v !== "" && all.indexOf(v) === i)
    .filter((v) => !fields.some((f) => current?.[f.name] === v));
  if (stale.length) after(() => Promise.all(stale.map(deleteAsset)));
}

// ---------- Content sections ----------

export async function saveRecord(
  resourceKey: string,
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const resource = getResource(resourceKey);
  if (!resource) return { error: "Unknown section." };

  const values = readForm(resource.fields, formData);
  const parsed = schemaFor(resource.fields).safeParse(values);
  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const before = id ? await getRecord(resource.key, id) : null;
  if (id && !before) return { error: "This item no longer exists." };
  const uploadErrors = checkUploads(resource.fields, parsed.data, before);
  if (uploadErrors)
    return { error: "An upload did not finish.", fieldErrors: uploadErrors, values };

  try {
    if (id) await updateRecord(resource.key, id, parsed.data);
    else await createRecord(resource.key, parsed.data);
  } catch (err) {
    console.error(err);
    return { error: GENERIC_SAVE_ERROR, values };
  }

  deleteReplacedUploads(resource.fields, before, parsed.data);
  updateTag(resource.key);
  redirect(`/admin/${resource.key}?saved=${id ? "updated" : "created"}`);
}

export async function removeRecord(resourceKey: string, id: string) {
  await requireAdmin();
  const resource = getResource(resourceKey);
  if (!resource) return;
  const before = await getRecord(resource.key, id);
  if (before) {
    await deleteRecord(resource.key, id);
    deleteReplacedUploads(resource.fields, before, null);
  }
  updateTag(resource.key);
  redirect(`/admin/${resource.key}?saved=deleted`);
}

// ---------- Profile ----------

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(profileFields, formData);
  const parsed = schemaFor(profileFields).safeParse(values);
  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  // Profile columns are non-null strings except the links, so map empty text to "".
  const data = Object.fromEntries(
    Object.entries(parsed.data).map(([k, v]) => [k, v === null && !k.endsWith("Url") ? "" : v]),
  ) as Record<string, string | null> & { name: string };

  const before = await db.profile.findUnique({ where: { id: 1 } });
  const uploadErrors = checkUploads(profileFields, data, before);
  if (uploadErrors)
    return { error: "An upload did not finish.", fieldErrors: uploadErrors, values };

  const cvChanged = data.cvUrl !== (before?.cvUrl ?? null);
  const update = {
    ...data,
    ...(cvChanged && { cvUpdatedAt: data.cvUrl ? new Date() : null }),
  };

  try {
    await db.profile.upsert({ where: { id: 1 }, create: { id: 1, ...update }, update });
  } catch (err) {
    console.error(err);
    return { error: GENERIC_SAVE_ERROR, values };
  }

  deleteReplacedUploads(profileFields, before, data);
  updateTag("profile");
  return { success: "Profile saved.", values };
}

// ---------- Account ----------

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Enter a valid email address" })),
  currentPassword: z.string().min(1, { error: "Enter your current password" }),
});

export async function changeEmail(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = emailSchema.safeParse({
    email: formData.get("email"),
    currentPassword: formData.get("currentPassword"),
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const user = await db.adminUser.findUniqueOrThrow({ where: { id: admin.id } });
  if (!(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    return { fieldErrors: { currentPassword: ["Current password is incorrect"] } };
  }
  if (parsed.data.email === user.email) return { success: "That is already your login email." };

  const taken = await db.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (taken) return { fieldErrors: { email: ["That email is already in use"] } };

  const updated = await db.adminUser.update({
    where: { id: user.id },
    data: { email: parsed.data.email, sessionVersion: { increment: 1 } },
  });
  await createSession(updated.id, updated.sessionVersion);
  return { success: `Login email changed to ${updated.email}.` };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Enter your current password" }),
    newPassword: z.string().min(10, { error: "Use at least 10 characters" }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const user = await db.adminUser.findUniqueOrThrow({ where: { id: admin.id } });
  if (!(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    return { fieldErrors: { currentPassword: ["Current password is incorrect"] } };
  }

  // Bumping the version signs out every other browser.
  const updated = await db.adminUser.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(parsed.data.newPassword),
      sessionVersion: { increment: 1 },
    },
  });
  await createSession(updated.id, updated.sessionVersion);
  return { success: "Password changed. Other devices have been signed out." };
}
