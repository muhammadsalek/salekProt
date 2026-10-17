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
  | "youtube"
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
  /** For type "upload": what kind of file goes to Cloudinary. */
  upload?: "image" | "pdf";
  /** Starts a new titled group in the form before this field. */
  section?: string;
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
      return z.preprocess((v) => v === "on" || v === "true", z.boolean());
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
    else if (Array.isArray(v)) values[f.name] = v.join(", ");
    else values[f.name] = v == null ? "" : String(v);
  }
  return values;
}

/** Short human-readable text for list tables. */
export function displayValue(field: Field, value: unknown): string {
  if (value == null || value === "") return "—";
  if (field.type === "checkbox") return value ? "Yes" : "No";
  if (field.type === "select") {
    return field.options?.find((o) => o.value === value)?.label ?? String(value);
  }
  if (value instanceof Date) {
    return value.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}
