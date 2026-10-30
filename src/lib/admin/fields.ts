import { z } from "zod";
import { youtubeVideoId } from "@/lib/youtube-id";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "url"
  | "email"
  | "password"
  | "upload"
  /** Several uploaded files, kept in order; stored as a string list. */
  | "uploads"
  | "youtube"
  /** Month of the year (1–12), shown as a dropdown; optional. */
  | "month"
  | "checkbox"
  | "select"
  | "list";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: readonly { value: string; label: string }[];
  /** For types "upload" and "uploads": what kind of file goes to Cloudinary. */
  upload?: "image" | "pdf";
  /** For type "uploads": the most files allowed. */
  maxFiles?: number;
  /** Starts a new titled group in the form before this field. */
  section?: string;
  /** Shown in a narrow column beside the previous field (e.g. a position number). */
  narrow?: boolean;
  rows?: number;
};

/** Value shape used by form inputs. */
export type FormValues = Record<string, string | boolean>;

export type FormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  /** Submitted values, so the form keeps what was typed after a validation error. */
  values?: FormValues;
};

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);
const emptyToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

function fieldSchema(field: Field): z.ZodType {
  switch (field.type) {
    case "checkbox":
      // readForm already yields a boolean; raw "on"/"true" strings are accepted too.
      return z.preprocess((v) => v === true || v === "on" || v === "true", z.boolean());
    case "number": {
      const n = z.coerce.number({ error: "Enter a number" }).int({ error: "Enter a whole number" });
      return field.required
        ? z.preprocess(emptyToUndefined, n)
        : z.preprocess(emptyToNull, n.nullable());
    }
    case "date": {
      const d = z.coerce.date({ error: "Enter a valid date" });
      return field.required
        ? z.preprocess(emptyToUndefined, d)
        : z.preprocess(emptyToNull, d.nullable());
    }
    // Upload values are Cloudinary URLs; actions also check they belong to our account.
    case "upload":
    case "url": {
      const link = z.url({ error: "Enter a full link starting with https://" });
      // Uploads may also be files shipped with the site, e.g. /images/profile.jpg.
      const url =
        field.type === "upload"
          ? z.union([z.string().regex(/^\/[\w\-./]+$/), link], {
              error: "Please upload the file again.",
            })
          : link;
      const trimmed = (v: unknown) => (typeof v === "string" ? v.trim() : v);
      return field.required
        ? z.preprocess(trimmed, url)
        : z.preprocess((v) => emptyToNull(trimmed(v)), url.nullable());
    }
    // Form value is one URL per line (see readForm); stored as a list.
    case "uploads": {
      const file = z.union([z.string().regex(/^\/[\w\-./]+$/), z.url({ protocol: /^https?$/ })], {
        error: "Please upload the files again.",
      });
      let list = z.array(file);
      if (field.maxFiles) {
        list = list.max(field.maxFiles, { error: `Add at most ${field.maxFiles} files.` });
      }
      if (field.required) list = list.min(1, { error: "Upload at least one file." });
      return z.preprocess((v) => (typeof v === "string" ? uploadedUrls(v.split("\n")) : v), list);
    }
    case "youtube": {
      const video = z.string().refine((v) => youtubeVideoId(v) !== null, {
        error: "Paste a YouTube video link, e.g. https://www.youtube.com/watch?v=…",
      });
      const trimmed = (v: unknown) => (typeof v === "string" ? v.trim() : v);
      return field.required
        ? z.preprocess(trimmed, video)
        : z.preprocess((v) => emptyToNull(trimmed(v)), video.nullable());
    }
    case "email": {
      const email = z.email({ error: "Enter a valid email address" });
      const trimmed = (v: unknown) => (typeof v === "string" ? v.trim() : v);
      return field.required
        ? z.preprocess(trimmed, email)
        : z.preprocess(trimmed, z.union([z.literal(""), email]));
    }
    case "month":
      return z.preprocess(
        emptyToNull,
        z.coerce.number().int().min(1).max(12, { error: "Choose a month" }).nullable(),
      );
    case "select": {
      const values = (field.options ?? []).map((o) => o.value) as [string, ...string[]];
      return z.enum(values, { error: `Choose a ${field.label.toLowerCase()}` });
    }
    case "list":
      return z.string().transform((v) =>
        v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      );
    default: {
      const text = z.string().trim();
      return field.required
        ? text.min(1, { error: `${field.label} is required` })
        : z.preprocess(emptyToNull, text.nullable());
    }
  }
}

/** Builds a Zod schema that turns submitted form values into DB-ready data. */
export function schemaFor(fields: readonly Field[]) {
  return z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)])));
}

/** Reads the configured fields out of FormData as plain strings/booleans. */
export function readForm(fields: readonly Field[], formData: FormData): FormValues {
  return Object.fromEntries(
    fields.map((f) => {
      if (f.type === "uploads") {
        // One hidden input per file, in display order.
        return [f.name, uploadedUrls(formData.getAll(f.name)).join("\n")];
      }
      const v = formData.get(f.name);
      if (f.type === "checkbox") return [f.name, v === "on"];
      return [f.name, typeof v === "string" ? v : ""];
    }),
  );
}

/** Converts a DB record into strings/booleans for form inputs. */
export function toFormValues(
  fields: readonly Field[],
  record: Record<string, unknown> | null,
): FormValues {
  const values: FormValues = {};
  for (const f of fields) {
    const v = record?.[f.name];
    if (f.type === "checkbox") values[f.name] = Boolean(v);
    else if (v instanceof Date) values[f.name] = v.toISOString().slice(0, 10);
    else if (Array.isArray(v)) values[f.name] = v.join(f.type === "uploads" ? "\n" : ", ");
    else values[f.name] = v == null ? "" : String(v);
  }
  return values;
}

/** The non-empty file URLs in an "upload" or "uploads" value (a URL, a list, or nothing). */
export function uploadedUrls(value: unknown): string[] {
  const list = Array.isArray(value) ? value : [value];
  return list
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
    .map((v) => v.trim());
}

/** Short human-readable text for list tables. */
export function displayValue(field: Field, value: unknown): string {
  if (value == null || value === "") return "—";
  if (field.type === "checkbox") return value ? "Yes" : "No";
  if (field.type === "month") return MONTHS[Number(value) - 1] ?? "—";
  if (field.type === "uploads" && Array.isArray(value)) {
    return value.length ? `${value.length} ${value.length === 1 ? "file" : "files"}` : "—";
  }
  if (field.type === "select") {
    return field.options?.find((o) => o.value === value)?.label ?? String(value);
  }
  if (value instanceof Date) {
    return value.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
