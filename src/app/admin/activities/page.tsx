
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { ACTIVITY_CATEGORIES } from "@/lib/academic-activities";
import {
  createActivity,
  updateActivity,
  deleteActivity,
} from "./actions";

export const metadata: Metadata = {
  title: "Academic Activities · Admin",
  robots: {
    index: false,
    follow: false,
  },
};

const input =
  "border-border bg-surface w-full rounded-md border px-3 py-2 text-sm";

const label = "block text-sm font-medium mb-1.5";

type ActivityData = {
  title: string;
  category: string;
  organization: string | null;
  dateLabel: string | null;
  description: string | null;
  link: string | null;
  order: number;
};

function ActivityFields({
  activity,
}: {
  activity?: ActivityData;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className={label} htmlFor={activity ? undefined : "new-title"}>
          Title *
        </label>
        <input
          id={activity ? undefined : "new-title"}
          className={input}
          name="title"
          required
          maxLength={180}
          defaultValue={activity?.title}
        />
      </div>

      <div>
        <label className={label}>
          Category *
        </label>
        <select
          className={input}
          name="category"
          required
          defaultValue={activity?.category ?? ACTIVITY_CATEGORIES[0]}
        >
          {ACTIVITY_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={label}>
          Organization / Issuer
        </label>
        <input
          className={input}
          name="organization"
          maxLength={250}
          defaultValue={activity?.organization ?? ""}
        />
      </div>

      <div>
        <label className={label}>
          Date / Period
        </label>
        <input
          className={input}
          name="dateLabel"
          maxLength={100}
          placeholder="e.g. Mar–Aug 2025"
          defaultValue={activity?.dateLabel ?? ""}
        />
      </div>

      <div>
        <label className={label}>
          Certificate / Evidence Link
        </label>
        <input
          className={input}
          type="url"
          name="link"
          maxLength={1500}
          placeholder="https://..."
          defaultValue={activity?.link ?? ""}
        />
      </div>

      <div>
        <label className={label}>
          Display Order
        </label>
        <input
          className={input}
          type="number"
          name="order"
          min="0"
          max="9999"
          defaultValue={activity?.order ?? 0}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={label}>
          Description
        </label>
        <textarea
          className={input}
          name="description"
          maxLength={5000}
          rows={3}
          defaultValue={activity?.description ?? ""}
        />
      </div>
    </div>
  );
}

/*
 * Database access and authentication remain inside
 * this async component, rendered through Suspense.
 */
async function AcademicActivitiesAdminContent() {
  await requireAdmin();

  const activities = await db.academicActivity.findMany({
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-accent-strong text-xs font-semibold uppercase tracking-widest">
            Admin · Content
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold">
            Training & Academic Activities
          </h1>

          <p className="text-muted mt-2 text-sm">
            Add memberships, professional training, workshops,
            conferences, leadership positions and academic
            service. Changes appear on the About page.
          </p>
        </div>

        <Link
          className="border-border rounded-md border px-4 py-2 text-sm"
          href="/admin"
        >
          ← Dashboard
        </Link>
      </div>

      <section className="border-border rounded-lg border p-5 sm:p-7">
        <h2 className="mb-5 font-serif text-xl font-semibold">
          Add New Activity
        </h2>

        <form action={createActivity} className="space-y-5">
          <ActivityFields />

          <button
            className="bg-accent text-accent-foreground rounded-md px-5 py-2.5 text-sm font-semibold"
            type="submit"
          >
            Save Activity
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="mb-5 font-serif text-2xl font-semibold">
          Manage Activities ({activities.length})
        </h2>

        {activities.length === 0 ? (
          <p className="text-muted text-sm">
            No academic activities added yet.
            Use the form above to create your first entry.
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <details
                className="border-border rounded-lg border p-5"
                key={activity.id}
              >
                <summary className="cursor-pointer font-semibold">
                  {activity.title}

                  <span className="text-muted ml-2 text-sm font-normal">
                    · {activity.category}
                  </span>
                </summary>

                <form
                  action={updateActivity}
                  className="mt-5 space-y-4"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={activity.id}
                  />

                  <ActivityFields activity={activity} />

                  <button
                    type="submit"
                    className="bg-accent text-accent-foreground rounded-md px-5 py-2.5 text-sm font-semibold"
                  >
                    Save Changes
                  </button>
                </form>

                <form
                  action={deleteActivity}
                  className="mt-3"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={activity.id}
                  />

                  <button
                    type="submit"
                    className="text-sm font-semibold text-red-600"
                  >
                    Delete Activity
                  </button>
                </form>
              </details>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/*
 * Suspense allows the authentication and database
 * operations to run without blocking prerendering.
 */
export default function AcademicActivitiesAdminPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-muted text-sm">
            Loading academic activities...
          </p>
        </main>
      }
    >
      <AcademicActivitiesAdminContent />
    </Suspense>
  );
}
