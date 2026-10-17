import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PublicationEntry } from "@/components/site/publication-entry";
import { PageTitle } from "@/components/site/section";
import { publicationStatus } from "@/lib/admin/resources";
import { tally } from "@/lib/format";
import { getProfile, getPublications } from "@/lib/queries";

export const metadata: Metadata = { title: "Publications" };

type Filters = { topic?: string; country?: string; status?: string };

export default async function PublicationsPage({ searchParams }: PageProps<"/publications">) {
  const profile = await getProfile();

  return (
    <>
      <PageTitle title="Publications" />
      {profile?.scholarUrl && (
        <p className="text-muted -mt-8 mb-10">
          Full and up-to-date list on{" "}
          <a
            href={profile.scholarUrl}
            className="text-accent hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Scholar
          </a>
          .
        </p>
      )}
      <Suspense fallback={<p className="text-muted">Loading publications…</p>}>
        <FilteredList searchParams={searchParams} author={profile?.name} />
      </Suspense>
    </>
  );
}

async function FilteredList({
  searchParams,
  author,
}: {
  searchParams: PageProps<"/publications">["searchParams"];
  author?: string;
}) {
  const params = await searchParams;
  const pick = (k: keyof Filters) => (typeof params[k] === "string" ? params[k] : undefined);
  const filters: Filters = {
    topic: pick("topic"),
    country: pick("country"),
    status: pick("status"),
  };

  const all = await getPublications();
  const shown = all.filter(
    (p) =>
      (!filters.topic || p.tags.includes(filters.topic)) &&
      (!filters.country || p.countries.includes(filters.country)) &&
      (!filters.status || p.status === filters.status),
  );

  const byYear = new Map<number, typeof shown>();
  for (const p of shown) byYear.set(p.year, [...(byYear.get(p.year) ?? []), p]);

  const href = (change: Partial<Filters>) => {
    const next = { ...filters, ...change };
    const qs = new URLSearchParams(
      Object.entries(next).filter((e): e is [string, string] => !!e[1]),
    ).toString();
    return qs ? `/publications?${qs}` : "/publications";
  };

  const groups: {
    key: keyof Filters;
    label: string;
    options: { value: string; label: string }[];
  }[] = [
    {
      key: "topic",
      label: "Topic",
      options: tally(all.map((p) => p.tags)).map(([t]) => ({ value: t, label: t })),
    },
    {
      key: "country",
      label: "Country",
      options: tally(all.map((p) => p.countries)).map(([c]) => ({ value: c, label: c })),
    },
    {
      key: "status",
      label: "Status",
      options: publicationStatus.filter((s) => all.some((p) => p.status === s.value)),
    },
  ];
  const active = Object.values(filters).some(Boolean);

  if (all.length === 0) return <p className="text-muted">Publications will appear here soon.</p>;

  return (
    <div className="grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <aside aria-label="Filter publications" className="space-y-6 text-sm">
        {groups
          .filter((g) => g.options.length > 1)
          .map((g) => (
            <div key={g.key}>
              <h2 className="mb-2 font-semibold">{g.label}</h2>
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {g.options.map((o) => {
                  const selected = filters[g.key] === o.value;
                  return (
                    <li key={o.value}>
                      <Link
                        href={href({ [g.key]: selected ? undefined : o.value })}
                        aria-current={selected ? "true" : undefined}
                        scroll={false}
                        className={
                          "inline-block rounded-full border px-3 py-1 lg:rounded-md lg:border-0 lg:px-2 " +
                          (selected
                            ? "border-accent bg-accent/10 text-accent font-medium"
                            : "border-border text-muted hover:text-foreground")
                        }
                      >
                        {o.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        {active && (
          <Link
            href="/publications"
            scroll={false}
            className="text-accent inline-block hover:underline"
          >
            Clear filters
          </Link>
        )}
      </aside>

      <div className="max-w-3xl">
        <p className="text-muted mb-8 text-sm" aria-live="polite">
          {shown.length} of {all.length} {all.length === 1 ? "publication" : "publications"}
        </p>
        {shown.length === 0 ? (
          <p>
            No publications match these filters.{" "}
            <Link href="/publications" className="text-accent hover:underline">
              Show all
            </Link>
          </p>
        ) : (
          <div className="space-y-12">
            {[...byYear].map(([year, pubs]) => (
              <section key={year}>
                <h2 className="text-muted mb-5 font-serif text-2xl">{year}</h2>
                <div className="space-y-8">
                  {pubs.map((p) => (
                    <PublicationEntry key={p.id} pub={p} author={author} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
