
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
        <h1 className="font-serif text-3xl font-semibold">
          Academic Portfolio
        </h1>
        <p className="text-muted mt-4">
          Profile information is temporarily unavailable.
        </p>
      </main>
    );
  }

  // Publication and research statistics
  const countries = tally(
    publications.map((publication) => publication.countries)
  ).map(([country]) => country);

  const publishedCount = publications.filter(
    (publication) =>
      publication.status === "PUBLISHED" ||
      publication.status === "ACCEPTED"
  ).length;

  const underReviewCount = publications.filter(
    (publication) => publication.status === "UNDER_REVIEW"
  ).length;

  const peerReviewCount = experience.filter(
    (item) => item.category === "PEER_REVIEW"
  ).length;

  const affiliation = [
    profile.department,
    profile.institution,
  ]
    .filter(Boolean)
    .join(", ");

  const links = profileLinks(profile);

  const statistics = [
    {
      value: publishedCount,
      label: "Published & Accepted Articles",
      href: "/publications",
    },
    {
      value: underReviewCount,
      label: "Manuscripts Under Review",
      href: "/publications?status=UNDER_REVIEW",
    },
    {
      value: countries.length,
      label: "Countries Studied",
      href: "/research",
    },
    {
      value: peerReviewCount,
      label: "Peer-Review Roles",
      href: "/experience",
    },
  ].filter((item) => item.value > 0);

  return (
    <main className="pb-20">
      {/* ============================== */}
      {/* HERO SECTION                   */}
      {/* ============================== */}

      <section className="border-border border-b py-14 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_0.8fr] lg:gap-20">

          {/* LEFT: ACADEMIC INTRODUCTION */}
          <div className="order-2 lg:order-1">
            <p className="text-accent-strong mb-5 text-xs font-bold uppercase tracking-[0.2em]">
              Academic Portfolio / Bangladesh
            </p>

            <h1 className="font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              {profile.name}
            </h1>

            <p className="text-accent-strong mt-6 text-lg font-semibold leading-relaxed">
              Applied Statistics | Epidemiology |
              Biostatistics | Health Data Science
            </p>

            {affiliation && (
              <p className="text-muted mt-3 leading-relaxed">
                {affiliation}
              </p>
            )}

            {/* PROFESSIONAL BIOGRAPHY */}
            <div className="mt-9 max-w-2xl">
              <h2 className="font-serif text-2xl font-semibold">
                Bio
              </h2>

              <p className="text-muted mt-5 text-base leading-8">
                I am an early-career researcher specializing in
                applied statistics, epidemiology, biostatistics,
                and explainable machine learning, with several
                peer-reviewed publications in international
                journals, including Q1-ranked journals. My
                research integrates statistical modelling,
                nationally representative survey data, and
                interpretable machine learning to investigate
                population health challenges, healthcare
                inequalities, and evidence-based public health
                interventions. I have completed contributions
                to three university-funded research projects
                supported by the SUST Research Centre.
              </p>

              <p className="text-muted mt-4 text-base leading-8">
                My current research activities include serving
                as the appointed Lead Research Assistant for a
                prospective post-stroke disability and
                quality-of-life cohort study, currently in the
                planning stage, in collaboration with clinical
                researchers. My contributions include protocol
                development, questionnaire design, recruitment
                planning, and longitudinal analysis planning.
                I have also contributed to the PROSPERO-registered
                methodological review,{" "}
                <span className="font-medium">
                  Best Practices for Machine Learning with
                  Complex Survey Data
                </span>{" "}
                (CRD420261399081), examining complex survey
                design, sampling weights, missing data,
                predictive validation, and methodological bias.
              </p>
            </div>

            {/* EXPLORE MY WORK */}
            <div className="mt-9">
              <h3 className="font-serif text-xl font-semibold">
                Explore My Work
              </h3>

              <p className="text-muted mt-3 max-w-2xl leading-8">
                Explore my{" "}
                <Link
                  href="/research"
                  className="text-accent-strong font-medium underline underline-offset-4"
                >
                  research
                </Link>
                ,{" "}
                <Link
                  href="/publications"
                  className="text-accent-strong font-medium underline underline-offset-4"
                >
                  peer-reviewed publications
                </Link>
                ,{" "}
                <Link
                  href="/experience"
                  className="text-accent-strong font-medium underline underline-offset-4"
                >
                  academic experience
                </Link>
                , and{" "}
                <Link
                  href="/projects"
                  className="text-accent-strong font-medium underline underline-offset-4"
                >
                  research projects
                </Link>
                .
              </p>
            </div>

            {/* PRIMARY ACTION BUTTONS */}
            <div className="mt-9 flex flex-wrap gap-3">
              {profile.cvUrl && (
                <Link
                  href="/cv"
                  className="bg-accent text-accent-foreground hover:bg-accent-strong inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition-colors"
                >
                  Academic CV
                </Link>
              )}

              <Link
                href="/research"
                className="border-border bg-surface hover:border-accent inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold transition-colors"
              >
                Explore Research
              </Link>

              <Link
                href="/publications"
                className="border-border bg-surface hover:border-accent inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold transition-colors"
              >
                Publications
              </Link>
            </div>

            {/* ACADEMIC PROFILE LINKS */}
            {links.length > 0 && (
              <ul
                aria-label="Academic profiles"
                className="mt-7 flex flex-wrap gap-x-5 gap-y-3"
              >
                {links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-accent inline-flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                      <ProfileLinkIcon
                        id={link.id}
                        className="size-4 shrink-0"
                      />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RIGHT: PROFILE PHOTO */}
          {profile.photoUrl && (
            <div className="order-1 mx-auto w-full max-w-sm lg:order-2 lg:ml-auto">
              <div className="border-border bg-surface overflow-hidden rounded-lg border p-2 shadow-sm">
                <Image
                  src={profile.photoUrl}
                  alt={`Portrait of ${profile.name}`}
                  width={571}
                  height={751}
                  priority
                  sizes="(min-width: 1024px) 360px, 90vw"
                  className="aspect-[4/5] w-full rounded-sm object-cover object-top"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-3">
                  <span className="text-sm font-semibold">
                    {profile.name}
                  </span>

                  <span className="text-muted text-xs">
                    Early-Career Researcher
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================== */}
      {/* RESEARCH ACHIEVEMENTS          */}
      {/* ============================== */}

      {statistics.length > 0 && (
        <section className="border-border border-b py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {statistics.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group block"
              >
                <span className="block font-serif text-4xl font-semibold tabular-nums md:text-5xl">
                  {item.value}
                </span>

                <span className="text-muted group-hover:text-accent mt-2 block text-sm leading-relaxed transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============================== */}
      {/* RESEARCH INTERESTS             */}
      {/* ============================== */}

      {areas.length > 0 && (
        <Section
          title="Research Interests"
          more={{
            href: "/research",
            label: "Explore All Research",
          }}
        >
          <div className="grid gap-5 md:grid-cols-2">
            {areas.map((area, index) => (
              <article
                key={area.id}
                className="border-border hover:border-accent/50 rounded-lg border p-6 transition-colors"
              >
                <p className="text-accent-strong mb-4 text-xs font-semibold uppercase tracking-widest">
                  Research Area{" "}
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="font-serif text-xl font-semibold">
                  {area.title}
                </h3>

                <p className="text-muted mt-3 text-sm leading-7">
                  {area.summary}
                </p>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* ============================== */}
      {/* SELECTED PUBLICATIONS          */}
      {/* ============================== */}

      {featured.length > 0 && (
        <Section
          title="Selected Peer-Reviewed Publications"
          more={{
            href: "/publications",
            label: "View All Publications",
          }}
        >
          <div className="max-w-4xl space-y-7">
            {featured.map((publication) => (
              <article
                key={publication.id}
                className="border-border border-b pb-7 last:border-b-0"
              >
                <PublicationEntry
                  pub={publication}
                  author={profile.name}
                  featured
                />
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* ============================== */}
      {/* RESEARCH GEOGRAPHY             */}
      {/* ============================== */}

      {countries.length > 0 && (
        <Section
          title="Research Geography & Study Populations"
          more={{
            href: "/research",
            label: "Research Overview",
          }}
        >
          <p className="text-muted mb-6 max-w-3xl leading-8">
            My research includes population-based
            investigations using nationally
            representative survey datasets.
            Explore publications associated with
            different countries and study populations.
          </p>

          <ul className="flex flex-wrap gap-3">
            {countries.map((country) => (
              <li key={country}>
                <Link
                  href={`/publications?country=${encodeURIComponent(country)}`}
                  className="border-border bg-surface hover:border-accent inline-flex rounded-md border px-4 py-2 text-sm transition-colors"
                >
                  {country}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ============================== */}
      {/* STATISTICAL EXPERTISE          */}
      {/* ============================== */}

      {skills.length > 0 && (
        <Section
          title="Statistical & Computational Expertise"
          more={{
            href: "/about",
            label: "More About My Background",
          }}
        >
          <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {groupSkills(skills).map(([category, names]) => (
              <div key={category}>
                <dt className="font-serif text-lg font-semibold">
                  {category}
                </dt>

                <dd className="mt-4">
                  <ul className="flex flex-wrap gap-2">
                    {names.map((name) => (
                      <li
                        key={name}
                        className="border-border rounded-md border px-3 py-1.5 text-xs"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {/* ============================== */}
      {/* ACADEMIC EVENTS                */}
      {/* ============================== */}

      {gallery.length > 0 && (
        <Section
          title="Conferences & Academic Activities"
          more={{
            href: "/gallery",
            label: "View Full Gallery",
          }}
        >
          <GalleryGrid events={gallery} />
        </Section>
      )}

      {/* ============================== */}
      {/* RESEARCH TUTORIALS             */}
      {/* ============================== */}

      {tutorials.length > 0 && (
        <Section
          title="Teaching & Research Tutorials"
          more={{
            href: "/tutorials",
            label: "Explore All Tutorials",
          }}
        >
          <TutorialGrid tutorials={tutorials} />
        </Section>
      )}

      {/* ============================== */}
      {/* CONTACT SECTION                */}
      {/* ============================== */}

      <section className="border-border mt-16 border-t py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Research & Academic Collaboration
            </h2>

            <p className="text-muted mt-4 max-w-2xl leading-8">
              I welcome opportunities for academic
              collaboration, interdisciplinary
              research, and scholarly exchange in
              biostatistics, epidemiology,
              public health, and data science.
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
