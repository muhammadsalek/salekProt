import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageTitle, Section } from "@/components/site/section";
import { tally } from "@/lib/format";
import { getPublications, getResearchAreas } from "@/lib/queries";

export const metadata: Metadata = { title: "Research" };

export default async function ResearchPage() {
  const [areas, publications] = await Promise.all([getResearchAreas(), getPublications()]);
  const countries = tally(publications.map((p) => p.countries));

  return (
    <>
      <PageTitle
        title="Research"
        lead="Secondary analysis of nationally representative survey data to estimate health burdens that are often overlooked."
      />

      {areas.length === 0 ? (
        <p className="text-muted">Research areas will appear here soon.</p>
      ) : (
        <div className="space-y-14">
          {areas.map((a) => (
            <article
              key={a.id}
              className={
                "grid max-w-4xl gap-6" + (a.imageUrl ? " sm:grid-cols-[minmax(0,1fr)_14rem]" : "")
              }
            >
              <div>
                <h2 className="font-serif text-2xl font-semibold">{a.title}</h2>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed">{a.summary}</p>
              </div>
              {a.imageUrl && (
                <Image
                  src={a.imageUrl}
                  alt=""
                  width={448}
                  height={336}
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
              )}
            </article>
          ))}
        </div>
      )}

      {countries.length > 0 && (
        <Section title="Countries and datasets">
          <p className="text-muted mb-6 max-w-2xl leading-relaxed">
            Demographic and Health Surveys (DHS) used in my papers. Select a country to see the
            related publications.
          </p>
          <ul className="flex flex-wrap gap-3">
            {countries.map(([country, count]) => (
              <li key={country}>
                <Link
                  href={`/publications?country=${encodeURIComponent(country)}`}
                  className="border-border bg-surface hover:border-accent inline-flex items-baseline gap-2 rounded-full border px-4 py-1.5"
                >
                  {country}
                  <span className="text-muted text-sm">
                    {count} {count === 1 ? "paper" : "papers"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
