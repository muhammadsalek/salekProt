"use client";

import Link from "next/link";
import { Fragment, useActionState } from "react";
import { UploadField } from "@/components/admin/upload-field";
import { UploadListField } from "@/components/admin/upload-list-field";
import { MONTHS, type Field, type FormState, type FormValues } from "@/lib/admin/fields";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  fields: readonly Field[];
  initialValues?: FormValues;
  submitLabel: string;
  cancelHref?: string;
};

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground " +
  "placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none " +
  "aria-invalid:border-danger";

export function RecordForm({ action, fields, initialValues = {}, submitLabel, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const values = state.values ?? initialValues;

  return (
    <form
      action={formAction}
      className="grid grid-cols-[minmax(0,1fr)_7rem] gap-x-3 gap-y-5 *:col-span-2"
      noValidate
    >
      {state.error && (
        <p
          role="alert"
          className="border-danger/40 bg-danger/10 text-danger rounded-md border px-4 py-3 text-sm"
        >
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          role="status"
          className="border-success/40 bg-success/10 text-success rounded-md border px-4 py-3 text-sm"
        >
          {state.success}
        </p>
      )}

      {fields.map((field, i) => (
        <Fragment key={field.name}>
          {field.section && (
            <h2
              className={
                "text-foreground text-base font-semibold" +
                (i > 0 ? " border-border border-t pt-6" : "")
              }
            >
              {field.section}
            </h2>
          )}
          {/* A narrow field shares a row with the field before it. */}
          <div className={field.narrow || fields[i + 1]?.narrow ? "col-span-1!" : undefined}>
            <FieldInput
              field={field}
              value={values[field.name]}
              errors={state.fieldErrors?.[field.name]}
            />
          </div>
        </Fragment>
      ))}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent text-accent-foreground rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        {cancelHref && (
          <Link href={cancelHref} className="text-muted hover:text-foreground text-sm">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}

function FieldInput({
  field,
  value,
  errors,
}: {
  field: Field;
  value: string | boolean | undefined;
  errors?: string[];
}) {
  const id = `field-${field.name}`;
  const describedBy = [field.help && `${id}-help`, errors?.length && `${id}-error`]
    .filter(Boolean)
    .join(" ");
  const common = {
    id,
    name: field.name,
    "aria-invalid": errors?.length ? true : undefined,
    "aria-describedby": describedBy || undefined,
  };
  const text = typeof value === "string" ? value : "";

  if (field.type === "checkbox") {
    return (
      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            {...common}
            type="checkbox"
            defaultChecked={value === true}
            className="accent-accent size-4"
          />
          {field.label}
        </label>
        <Hint id={id} help={field.help} errors={errors} />
      </div>
    );
  }

  let control;
  if (field.type === "upload") {
    // Keyed by the saved value so the widget resets after a successful save.
    control = (
      <UploadField
        key={text}
        field={field}
        initialUrl={text}
        describedBy={common["aria-describedby"]}
      />
    );
  } else if (field.type === "uploads") {
    control = (
      <UploadListField
        key={text}
        field={field}
        initialUrls={text ? text.split("\n") : []}
        describedBy={common["aria-describedby"]}
      />
    );
  } else if (field.type === "textarea") {
    control = (
      <textarea
        {...common}
        rows={field.rows ?? 4}
        defaultValue={text}
        placeholder={field.placeholder}
        className={inputClass}
      />
    );
  } else if (field.type === "month") {
    control = (
      <select {...common} defaultValue={text} className={inputClass}>
        <option value="">—</option>
        {MONTHS.map((m, i) => (
          <option key={m} value={String(i + 1)}>
            {m}
          </option>
        ))}
      </select>
    );
  } else if (field.type === "select") {
    control = (
      <select {...common} defaultValue={text || field.options?.[0]?.value} className={inputClass}>
        {field.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else {
    const type = {
      number: "number",
      date: "date",
      url: "url",
      email: "email",
      password: "password",
      youtube: "url",
    }[field.type as string];
    control = (
      <input
        {...common}
        type={type ?? "text"}
        // Never echo passwords back into the page.
        defaultValue={field.type === "password" ? "" : text}
        placeholder={field.placeholder}
        autoComplete={
          field.type === "password"
            ? field.name === "currentPassword" || field.name === "password"
              ? "current-password"
              : "new-password"
            : field.type === "email"
              ? "email"
              : undefined
        }
        className={inputClass}
      />
    );
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {field.label}
        {field.required && <span className="text-danger"> *</span>}
      </label>
      {control}
      <Hint id={id} help={field.help} errors={errors} />
    </div>
  );
}

function Hint({ id, help, errors }: { id: string; help?: string; errors?: string[] }) {
  return (
    <>
      {help && (
        <p id={`${id}-help`} className="text-muted text-xs">
          {help}
        </p>
      )}
      {errors?.length ? (
        <p id={`${id}-error`} className="text-danger text-xs">
          {errors[0]}
        </p>
      ) : null}
    </>
  );
}
