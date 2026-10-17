import Image from "next/image";
import Link from "next/link";
import { PublicationEntry } from "@/components/site/publication-entry";
import { Section } from "@/components/site/section";
import { TutorialGrid } from "@/components/site/tutorial-grid";
import { tally } from "@/lib/format";
import {
  getFeaturedPublications,
  getProfile,
  getPublications,
  getResearchAreas,
  getTutorials,
} from "@/lib/queries";

export default async function HomePage() {
  const [profile, featured, publications, areas, tutorials] = await Promise.all([
    getProfile(),
    getFeaturedPublications(),
    getPublications(),
    getResearchAreas(),
    getTutorials(3),
  ]);

  if (!profile) {
    return (
      <p className="text-muted py-24 text-center">
        This site is being set up. Please check back soon.
      </p>
    );
  }

  const countries = tally(publications.map((p) => p.countries)).map(([c]) => c);
  const affiliation = [profile.department, profile.institution].filter(Boolean).join(", ");

  return (
    <>
      <section className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
        {profile.photoUrl && (
          <div className="relative mx-auto w-full max-w-sm md:mx-0">
            <div
              aria-hidden
              className="border-accent/40 absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border"
            />
            <Image
              src={profile.photoUrl}
              alt={`Portrait of ${profile.name}`}
              width={571}
              height={751}
              priority
              sizes="(min-width: 768px) 380px, 90vw"
              className="relative aspect-[4/5] w-full rounded-2xl object-cover object-top"
            />
          </div>
        )}

        <div>
          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
            {profile.name}
          </h1>
          {profile.title && <p className="mt-4 text-xl">{profile.title}</p>}
          {affiliation && <p className="text-muted mt-1">{affiliation}</p>}
          {profile.focus && (
            <p className="mt-6 max-w-xl font-serif text-xl leading-relaxed text-pretty italic">
              {profile.focus}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {profile.cvUrl && (
              <a
                href="/cv"
                className="bg-accent text-accent-foreground rounded-md px-5 py-2.5 font-medium hover:opacity-90"
              >
                Download CV
              </a>
            )}
            {profile.scholarUrl && (
              <a
                href={profile.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-surface hover:border-accent rounded-md border px-5 py-2.5 font-medium"
              >
                Google Scholar
              </a>
            )}
            <Link
              href="/contact"
              className="border-border bg-surface hover:border-accent rounded-md border px-5 py-2.5 font-medium"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      {countries.length > 0 && (
        <section className="bg-surface border-border mt-16 rounded-xl border px-6 py-5">
          <p className="text-muted text-sm">Demographic and Health Survey data analysed so far</p>
          <ul className="mt-2 flex flex-wrap gap-x-8 gap-y-1 font-serif text-lg">
            {countries.map((c) => (
              <li key={c}>
                <Link
                  href={`/publications?country=${encodeURIComponent(c)}`}
                  className="hover:text-accent"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.shortBio && (
        <p className="mt-16 max-w-2xl text-lg leading-relaxed">
          {profile.shortBio}{" "}
          <Link href="/about" className="text-accent hover:underline">
            More about me
          </Link>
        </p>
      )}

      {areas.length > 0 && (
        <Section title="Research interests" more={{ href: "/research", label: "All research" }}>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <li key={a.id}>
                <h3 className="font-serif text-lg font-semibold">{a.title}</h3>
                <p className="text-muted mt-2 line-clamp-4 leading-relaxed">{a.summary}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {featured.length > 0 && (
        <Section
          title="Selected publications"
          more={{ href: "/publications", label: "All publications" }}
        >
          <div className="max-w-3xl space-y-8">
            {featured.map((p) => (
              <PublicationEntry key={p.id} pub={p} author={profile.name} />
            ))}
          </div>
        </Section>
      )}

      {tutorials.length > 0 && (
        <Section title="Latest tutorials" more={{ href: "/tutorials", label: "All tutorials" }}>
          <TutorialGrid tutorials={tutorials} />
        </Section>
      )}
    </>
  );
}
