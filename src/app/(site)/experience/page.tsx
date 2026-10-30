import type { Metadata } from "next";
import { PageTitle, Section } from "@/components/site/section";
import { MONTHS } from "@/lib/admin/fields";
import { experienceCategories } from "@/lib/admin/resources";
import { getExperience, type Experience } from "@/lib/queries";

export const metadata: Metadata = { title: "Experience" };

function when(year: number, month: number | null) {
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
}

function period(e: Experience) {
  const start = when(e.startYear, e.startMonth);
  if (e.endYear === null) return `${start} – Present`;
  const end = when(e.endYear, e.endMonth);
  return end === start ? start : `${start} – ${end}`;
}

export default async function ExperiencePage() {
  const all = await getExperience();
  const groups = experienceCategories
    .map((c) => ({ ...c, items: all.filter((e) => e.category === c.value) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageTitle
        title="Experience"
        lead="Research positions, funded projects, teaching and service."
      />

      {groups.length === 0 && <p className="text-muted">Experience will appear here soon.</p>}

      {groups.map((g, i) => {
        const list = (
          <ul className="max-w-3xl">
            {g.items.map((e) => {
              const points = (e.description ?? "")
                .split("\n")
                .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
                .filter(Boolean);
              return (
                <li key={e.id} className="group grid sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <p className="text-muted hidden pt-0.5 text-sm sm:block">{period(e)}</p>
                  {/* Timeline: filled dot for current roles, hollow for past ones. */}
                  <div className="border-border relative border-l pb-10 pl-6 group-last:pb-0 sm:pl-8">
                    <span
                      aria-hidden
                      className={
                        "absolute top-1.5 -left-[5px] size-[9px] rounded-full " +
                        (e.endYear === null
                          ? "bg-accent ring-accent-soft ring-4"
                          : "border-border bg-background border-2")
                      }
                    />
                    <p className="text-muted mb-1 text-sm sm:hidden">{period(e)}</p>
                    <h3 className="font-serif text-lg leading-snug font-semibold">{e.role}</h3>
                    <p className="text-muted">
                      {e.organization}
                      {e.location && `, ${e.location}`}
                    </p>
                    {points.length > 0 && (
                      <ul className="marker:text-muted mt-3 list-disc space-y-1.5 pl-5 leading-relaxed">
                        {points.map((p, j) => (
                          <li key={j}>{p}</li>
                        ))}
                      </ul>
                    )}
                    {e.link && (
                      <a
                        href={e.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent mt-2 inline-block text-sm hover:underline"
                      >
                        More details
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        );
        // The first group sits directly under the page title; the rest get a divider.
        return i === 0 ? (
          <section key={g.value}>
            <h2 className="mb-6 font-serif text-2xl font-semibold">{g.label}</h2>
            {list}
          </section>
        ) : (
          <Section key={g.value} title={g.label}>
            {list}
          </Section>
        );
      })}
    </>
  );
}
