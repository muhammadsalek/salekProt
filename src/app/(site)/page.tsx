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

// Content here is a short introduction, not a duplicate of the full Research,
// Publications, or Experience pages. Detailed records remain on those pages.
const fundedStudies = [
  {
    title: "Occupational Health & Pesticide Exposure",
    detail: "399 farmers · Exposure and health outcomes",
    context: "SUST Research Centre-funded project",
  },
  {
    title: "Maternal & Newborn Health in the Haor Region",
    detail: "800 women · 40 Union Parishads",
    context: "SUST Research Centre-funded project",
  },
  {
    title: "Geriatric Quality of Life & Migration",
    detail: "1,200 older adults · Population health research",
    context: "SUST Research Centre-funded project",
  },
];

export default async function HomePage() {
  const [
    profile,
    featured,
    publications,
    areas,
    tutorials,
    experience,
    gallery,
    skills,
  ] = await Promise.all([
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
      <main className="py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Academic Portfolio</h1>
        <p className="text-muted mt-4">Profile information is temporarily unavailable.</p>
      </main>
    );
  }

  const countries = tally(publications.map((p) => p.countries)).map(([country]) => country);
  const publishedCount = publications.filter(
    (p) => p.status === "PUBLISHED" || p.status === "ACCEPTED"
  ).length;
  const underReviewCount = publications.filter((p) => p.status === "UNDER_REVIEW").length;
  const peerReviewCount = experience.filter((e) => e.category === "PEER_REVIEW").length;
  const affiliation = [profile.department, profile.institution].filter(Boolean).join(", ");
  const links = profileLinks(profile);

  const statistics = [
    { value: publishedCount, label: "Published & accepted papers", href: "/publications" },
    { value: 3, label: "Completed funded projects", href: "/research" },
    { value: countries.length, label: "Countries represented in research", href: "/research" },
    { value: underReviewCount, label: "Manuscripts under review", href: "/publications?status=UNDER_REVIEW" },
  ].filter((item) => item.value > 0);

  return (
    <main className="pb-16">
      {/* Hero: concise academic identity, not a full CV */}
      <section className="border-border border-b py-12 md:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)] lg:gap-14">
          <div className="order-2 min-w-0 lg:order-1">
            <p className="text-accent-strong text-xs font-semibold uppercase tracking-[0.18em]">
              Academic Portfolio · Sylhet, Bangladesh
            </p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {profile.name}
            </h1>
            <p className="text-accent-strong mt-5 text-base font-semibold leading-relaxed sm:text-lg">
              Epidemiology · Biostatistics · Health Equity · Explainable AI
            </p>
            {affiliation && <p className="text-muted mt-2 text-sm leading-relaxed">{affiliation}</p>}

            {/* Evidence-led introduction: no repeated long biographical paragraphs. */}
            <p className="mt-6 max-w-2xl text-base leading-7">
              Early-career researcher working across clinical and population health.
              Author of peer-reviewed studies in <em>Scientific Reports</em>,
              <em> PLOS ONE</em> and other international journals; contributor to
              three completed SUST Research Centre-funded studies.
            </p>

            <div className="mt-6 max-w-2xl">
              <h2 className="font-serif text-xl font-semibold">Research & Academic Highlights</h2>
              <ul className="mt-4 space-y-3">
                <li className="border-border border-l-2 pl-4 text-sm leading-6">
                  <strong>GBD collaborator</strong> — Global Burden of Disease Collaborator
                  Network, coordinated by IHME at the University of Washington;
                  contributions to collaborative manuscripts under review.
                </li>
                <li className="border-border border-l-2 pl-4 text-sm leading-6">
                  <strong>University-funded research</strong> — contributed to three
                  completed SUST Research Centre projects on occupational health,
                  maternal care and older adults’ quality of life.
                </li>
                <li className="border-border border-l-2 pl-4 text-sm leading-6">
                  <strong>Clinical & methodological research</strong> — appointed Lead
                  Research Assistant for a prospective post-stroke cohort
                  (planning stage); contributor to a PROSPERO-registered review
                  (CRD420261399081).
                </li>
                <li className="border-border border-l-2 pl-4 text-sm leading-6">
                  <strong>Research instructor</strong> — Center for Bio Health Research
                  (CBHR) and Bangladesh Institute of Innovative Health Research
                  (BIIHR), teaching applied data analysis and biostatistics.
                </li>
                <li className="border-border border-l-2 pl-4 text-sm leading-6">
                  <strong>Science communication</strong> — founder of Salek Data Lab
                  (YouTube) and Research Diary (Facebook-based science education).
                </li>
              </ul>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {profile.cvUrl && (
                <Link
                  href="/cv"
                  className="bg-accent text-accent-foreground hover:bg-accent-strong inline-flex items-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors"
                >
                  Academic CV
                </Link>
              )}
              <Link
                href="/research"
                className="border-border bg-surface hover:border-accent inline-flex items-center rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Explore Research
              </Link>
              <Link
                href="/publications"
                className="border-border bg-surface hover:border-accent inline-flex items-center rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Publications
              </Link>
            </div>

            {links.length > 0 && (
              <ul aria-label="Academic profiles" className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
                {links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-accent inline-flex items-center gap-2 text-sm transition-colors"
                    >
                      <ProfileLinkIcon id={link.id} className="size-4 shrink-0" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {profile.photoUrl && (
            <figure className="order-1 mx-auto w-full max-w-xs lg:order-2 lg:ml-auto lg:max-w-sm">
              <div className="border-border bg-surface overflow-hidden rounded-md border p-2 shadow-sm">
                <Image
                  src={profile.photoUrl}
                  alt={`Portrait of ${profile.name}`}
                  width={571}
                  height={751}
                  priority
                  sizes="(min-width: 1024px) 340px, 85vw"
                  className="aspect-[4/5] w-full rounded-sm object-cover object-top"
                />
                <figcaption className="flex flex-wrap justify-between gap-1 px-2 pt-3 text-xs">
                  <span className="font-semibold">{profile.name}</span>
                  <span className="text-muted">Early-Career Researcher</span>
                </figcaption>
              </div>
            </figure>
          )}
        </div>
      </section>

      {/* Dynamic statistics; the funded count is taken from the three CV-confirmed projects. */}
      {statistics.length > 0 && (
        <section className="border-border border-b py-9" aria-label="Research at a glance">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {statistics.map((item) => (
              <Link key={item.label} href={item.href} className="group block">
                <span className="block font-serif text-4xl font-semibold tabular-nums">
                  {item.value}
                </span>
                <span className="text-muted group-hover:text-accent mt-2 block text-sm leading-6 transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Brief project index; methods, dates and PI details belong on the Research page. */}
      <Section title="University-Funded Research" more={{ href: "/research", label: "Research details" }}>
        <p className="text-muted mb-6 max-w-3xl leading-7">
          Three completed SUST Research Centre-funded studies spanning occupational,
          maternal, and ageing-related population health.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {fundedStudies.map((study) => (
            <article key={study.title} className="border-border rounded-lg border p-5">
              <p className="text-accent-strong text-xs font-semibold uppercase tracking-wide">
                {study.context}
              </p>
              <h3 className="mt-3 font-serif text-lg font-semibold leading-snug">
                {study.title}
              </h3>
              <p className="text-muted mt-3 text-sm leading-6">{study.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Short ongoing work summaries, clearly labelled as not completed. */}
      <Section title="Current Research" more={{ href: "/experience", label: "Research appointments" }}>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="border-border rounded-lg border p-6">
            <p className="text-accent-strong text-xs font-semibold uppercase tracking-wide">
              Lead Research Assistant · Planning stage
            </p>
            <h3 className="mt-3 font-serif text-xl font-semibold">
              Post-Stroke Disability & Quality-of-Life Cohort
            </h3>
            <p className="text-muted mt-3 text-sm leading-7">
              Protocol, questionnaire, recruitment and longitudinal-analysis planning
              with clinical collaborators. The prospective cohort is in preparation.
            </p>
          </article>
          <article className="border-border rounded-lg border p-6">
            <p className="text-accent-strong text-xs font-semibold uppercase tracking-wide">
              Methodological review · PROSPERO CRD420261399081
            </p>
            <h3 className="mt-3 font-serif text-xl font-semibold">
              Machine Learning with Complex Survey Data
            </h3>
            <p className="text-muted mt-3 text-sm leading-7">
              Review work on survey weights, missing data, predictive validation,
              design considerations and methodological bias.
            </p>
          </article>
        </div>
      </Section>

      {areas.length > 0 && (
        <Section title="Research Interests" more={{ href: "/research", label: "All research areas" }}>
          <div className="grid gap-6 sm:grid-cols-2">
            {areas.map((area) => (
              <article key={area.id} className="border-border border-l-2 pl-5">
                <h3 className="font-serif text-lg font-semibold">{area.title}</h3>
                <p className="text-muted mt-2 text-sm leading-7">{area.summary}</p>
              </article>
            ))}
          </div>
        </Section>
      )}

      {featured.length > 0 && (
        <Section
          title="Selected Publications"
          more={{ href: "/publications", label: "Full publication list" }}
        >
          <div className="max-w-4xl space-y-7">
            {featured.map((publication) => (
              <article key={publication.id} className="border-border border-b pb-6 last:border-0">
                <PublicationEntry pub={publication} author={profile.name} featured />
              </article>
            ))}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Methods & Tools" more={{ href: "/about", label: "Full expertise" }}>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {groupSkills(skills).map(([category, names]) => (
              <div key={category}>
                <dt className="font-serif text-lg font-semibold">{category}</dt>
                <dd className="mt-3">
                  <ul className="flex flex-wrap gap-2">
                    {names.map((name) => (
                      <li key={name} className="border-border rounded-md border px-2.5 py-1 text-xs">
                        {name}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
          {peerReviewCount > 0 && (
            <p className="text-muted mt-6 text-sm">
              Academic peer-review roles are listed on the{" "}
              <Link href="/experience" className="text-accent hover:underline">Experience page</Link>.
            </p>
          )}
        </Section>
      )}

      {gallery.length > 0 && (
        <Section title="Conferences & Academic Activities" more={{ href: "/gallery", label: "View gallery" }}>
          <GalleryGrid events={gallery} />
        </Section>
      )}

      {tutorials.length > 0 && (
        <Section title="Teaching & Research Tutorials" more={{ href: "/tutorials", label: "All tutorials" }}>
          <TutorialGrid tutorials={tutorials} />
        </Section>
      )}

      <section className="border-border mt-14 border-t py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Research Collaboration</h2>
            <p className="text-muted mt-3 max-w-2xl leading-7">
              I welcome collaborations in epidemiology, biostatistics,
              clinical outcomes and equitable population health research.
            </p>
          </div>
          <Link
            href="/contact"
            className="border-border hover:border-accent inline-flex shrink-0 justify-center rounded-md border px-6 py-3 text-sm font-semibold transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
