import type { Metadata } from "next";
import { PageTitle, Section } from "@/components/site/section";
import { getAboutData, getProfile } from "@/lib/queries";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [profile, { education, skills, awards }] = await Promise.all([
    getProfile(),
    getAboutData(),
  ]);

  const skillGroups = new Map<string, string[]>();
  for (const s of skills) {
    const key = s.category || "Other";
    skillGroups.set(key, [...(skillGroups.get(key) ?? []), s.name]);
  }

  return (
    <>
      <PageTitle title="About" lead={profile?.title || undefined} />

      {profile?.longBio && (
        <div className="max-w-2xl space-y-5 font-serif text-lg leading-[1.75]">
          {profile.longBio.split(/\n\s*\n/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {profile?.cvUrl && (
        <p className="mt-8">
          <a
            href="/cv"
            className="bg-accent text-accent-foreground inline-block rounded-md px-5 py-2.5 font-medium hover:opacity-90"
          >
            Download CV (PDF)
          </a>
        </p>
      )}

      {education.length > 0 && (
        <Section title="Education">
          <ul className="max-w-3xl space-y-6">
            {education.map((e) => (
              <li key={e.id} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <p className="text-muted text-sm sm:pt-1">
                  {e.startYear} to {e.endYear ?? "present"}
                </p>
                <div>
                  <h3 className="font-serif text-lg font-semibold">{e.degree}</h3>
                  <p className="text-muted">{e.institution}</p>
                  {e.details && <p className="mt-1 leading-relaxed">{e.details}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {skillGroups.size > 0 && (
        <Section title="Skills">
          <dl className="grid max-w-3xl gap-6 sm:grid-cols-2">
            {[...skillGroups].map(([category, names]) => (
              <div key={category}>
                <dt className="font-serif text-lg font-semibold">{category}</dt>
                <dd className="text-muted mt-1 leading-relaxed">{names.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {awards.length > 0 && (
        <Section title="Awards and honours">
          <ul className="max-w-3xl space-y-5">
            {awards.map((a) => (
              <li key={a.id} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <p className="text-muted text-sm sm:pt-1">{a.year}</p>
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  {a.issuer && <p className="text-muted">{a.issuer}</p>}
                  {a.description && <p className="mt-1 leading-relaxed">{a.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
