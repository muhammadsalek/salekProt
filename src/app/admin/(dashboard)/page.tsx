import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { countRecords } from "@/lib/admin/data";
import { resources } from "@/lib/admin/resources";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminHome() {
  const [profile, counts] = await Promise.all([
    db.profile.findUnique({ where: { id: 1 }, select: { name: true } }),
    Promise.all(resources.map((r) => countRecords(r.key))),
  ]);

  return (
    <>
      <PageHeader
        title={profile ? `Welcome, ${profile.name}` : "Welcome"}
        description="Choose what you want to update. Changes appear on the website as soon as you save."
      />

      {!profile && (
        <p className="border-highlight/40 bg-highlight/10 mb-6 rounded-md border px-4 py-3 text-sm">
          Start by filling in your{" "}
          <Link href="/admin/profile" className="text-accent font-medium underline">
            profile
          </Link>{" "}
          — your name, bio and links.
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2">
        <li>
          <Card
            href="/admin/profile"
            title="Profile"
            text="Name, bio, photo, CV and profile links."
          />
        </li>
        {resources.map((r, i) => (
          <li key={r.key}>
            <Card href={`/admin/${r.key}`} title={r.label} text={r.description} count={counts[i]} />
          </li>
        ))}
        <li>
          <Card href="/admin/account" title="Account" text="Change your login email or password." />
        </li>
      </ul>
    </>
  );
}

function Card({
  href,
  title,
  text,
  count,
}: {
  href: string;
  title: string;
  text: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className="border-border bg-surface hover:border-accent block h-full rounded-lg border p-5 transition-colors"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-medium">{title}</h2>
        {count !== undefined && <span className="text-muted text-sm">{count}</span>}
      </div>
      <p className="text-muted mt-1 text-sm">{text}</p>
    </Link>
  );
}

// Reads the session and live data on every request.
export const instant = false;
