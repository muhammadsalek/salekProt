import Image from "next/image";
import Link from "next/link";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { ProfileLinkIcon } from "@/components/site/profile-link-icon";
import { PublicationEntry } from "@/components/site/publication-entry";
import { Section } from "@/components/site/section";
import { TutorialGrid } from "@/components/site/tutorial-grid";
import { groupSkills, profileLinks, tally } from "@/lib/format";
import {
  getExperience,
  getFeaturedPublications,
  getGalleryEvents,
  getProfile,
  getPublications,
  getResearchAreas,
  getSkills,
  getTutorials,
} from "@/lib/queries";

export default async function HomePage() {
  const [profile, featured, publications, areas, tutorials, experience, gallery, skills] =
    await Promise.all([
      getProfile(),
      getFeaturedPublications(),
      getPublications(),
      getResearchAreas(),
      getTutorials(3),
      getExperience(),
      getGalleryEvents(3),
      getSkills(),
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

  // Evidence at a glance, counted from the content so it stays current as he adds to it.
  const facts = [
    {
      value: publications.filter((p) => p.status === "PUBLISHED" || p.status === "ACCEPTED").length,
      label: "Peer-reviewed articles",
      href: "/publications",
    },
    {
      value: publications.filter((p) => p.status === "UNDER_REVIEW").length,
      label: "Manuscripts under review",
      href: "/publications?status=UNDER_REVIEW",
    },
    { value: countries.length, label: "Countries studied", href: "/research" },
    {
      value: experience.filter((e) => e.category === "PEER_REVIEW").length,
      label: "Publishers I review for",
      href: "/experience",
    },
  ].filter((f) => f.value > 0);
  const links = profileLinks(profile);

  return (
    <>
      <section className="bg-accent-soft -mt-12 pt-12 pb-12 shadow-[0_0_0_100vmax_var(--accent-soft)] [clip-path:inset(0_-100vmax)] sm:-mt-16 sm:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
          {profile.photoUrl && (
            <div className="relative mx-auto w-full max-w-sm md:mx-0">
              <div
                aria-hidden
                className="border-accent/50 absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border"
              />
              <Image
                src={profile.photoUrl}
                alt={`Portrait of ${profile.name}`}
                width={571}
                height={751}
                priority
                sizes="(min-width: 768px) 380px, 90vw"
                className="relative aspect-[4/5] w-full rounded-2xl object-cover object-top shadow-lg shadow-black/10"
              />
            </div>
          )}

          <div>
            <h1 className="font-serif text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              {profile.name}
            </h1>
            {profile.title && (
              <p className="text-accent-strong mt-4 text-xl font-medium">{profile.title}</p>
            )}
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
                  className="bg-accent text-accent-foreground hover:bg-accent-strong rounded-md px-5 py-2.5 font-medium shadow-sm transition-colors"
                >
                  Download CV
                </a>
              )}
              <Link
                href="/publications"
                className="border-border bg-surface hover:border-accent rounded-md border px-5 py-2.5 font-medium transition-colors"
              >
                Publications
              </Link>
              <Link
                href="/contact"
                className="border-border bg-surface hover:border-accent rounded-md border px-5 py-2.5 font-medium transition-colors"
              >
                Get in touch
              </Link>
            </div>

            {links.length > 0 && (
              <ul aria-label="Profiles" className="mt-4 flex flex-wrap gap-2">
                {links.map((l) => (
                  <li key={l.id}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-border bg-surface hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
                    >
                      <ProfileLinkIcon id={l.id} className="size-4 shrink-0" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {facts.length > 0 && (
          <ul
            aria-label="At a glance"
            className="border-accent/20 mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 sm:grid-cols-4"
          >
            {facts.map((f) => (
              <li key={f.label}>
                <Link href={f.href} className="group block">
                  <span className="text-foreground block font-serif text-4xl font-semibold tabular-nums">
                    {f.value}
                  </span>
                  <span className="text-muted group-hover:text-accent mt-1 block text-sm transition-colors">
                    {f.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {countries.length > 0 && (
        <section className="mt-12">
          <p className="text-muted text-sm">Demographic and Health Survey data analysed so far</p>
          <ul className="mt-2 flex flex-wrap gap-x-8 gap-y-1 font-serif text-lg">
            {countries.map((c) => (
              <li key={c}>
                <Link
                  href={`/publications?country=${encodeURIComponent(c)}`}
                  className="hover:text-accent decoration-accent/40 underline decoration-1 underline-offset-4"
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
                <p className="text-muted mt-2 leading-relaxed">{a.summary}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" more={{ href: "/about", label: "More about me" }}>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {groupSkills(skills).map(([category, names]) => (
              <div key={category}>
                <dt className="font-serif text-lg font-semibold">{category}</dt>
                <dd className="mt-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {names.map((n) => (
                      <li
                        key={n}
                        className="border-border bg-surface rounded-md border px-2.5 py-1 text-sm"
                      >
                        {n}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {featured.length > 0 && (
        <Section
          title="Selected publications"
          more={{ href: "/publications", label: "All publications" }}
        >
          <div className="max-w-3xl space-y-8">
            {featured.map((p) => (
              <div key={p.id} className="border-accent/60 border-l-2 pl-5">
                <PublicationEntry pub={p} author={profile.name} featured />
              </div>
            ))}
          </div>
        </Section>
      )}

      {gallery.length > 0 && (
        <Section title="Conferences & events" more={{ href: "/gallery", label: "Full gallery" }}>
          <GalleryGrid events={gallery} />
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
