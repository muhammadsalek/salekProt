import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle, Section } from "@/components/site/section";
import { groupSkills } from "@/lib/format";
import { getAboutData, getProfile } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About | Md Salek Miah",
  description:
    "Academic background, research affiliations, teaching, skills, and honours of Md Salek Miah.",
};

const highlights = [
  {
    number: "01",
    heading: "Global health collaboration",
    role: "GBD Collaborator Network",
    detail:
      "Contributor to Global Burden of Disease collaborative manuscripts under review; the study is coordinated by IHME at the University of Washington.",
  },
  {
    number: "02",
    heading: "University-funded field research",
    role: "SUST Research Centre",
    detail:
      "Contributed to three completed funded studies spanning maternal and newborn health, occupational exposure, and older adults' quality of life.",
  },
  {
    number: "03",
    heading: "Teaching & research training",
    role: "CBHR · BIIHR · SUST Data Science Club",
    detail:
      "Teach applied statistics, biostatistics, R, Stata, SPSS, research methods, and reproducible data analysis through courses and workshops.",
  },
  {
    number: "04",
    heading: "Open research education",
    role: "Founder · Salek Data Lab & Research Diary",
    detail:
      "Create accessible Bengali-language tutorials and science communication resources through educational media and online communities.",
  },
  {
    number: "05",
    heading: "Scholarly service",
    role: "Journal peer reviewer",
    detail:
      "Review research methodology, statistical analyses, reporting, and reproducibility for international peer-reviewed journals.",
  },
];

export default async function AboutPage() {
  const [profile, { education, skills, awards }] = await Promise.all([
    getProfile(),
    getAboutData(),
  ]);

  const skillGroups = groupSkills(skills);

  return (
    <div className="pb-20">
      <PageTitle
        title="About"
        lead="Research background, academic engagement, and professional development"
      />

      {/* SHORT, DISTINCT INTRODUCTION — NO REPEATED LONG BIO */}
      <section className="border-border grid gap-8 border-b pb-12 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)] md:gap-12">
        <div>
          <p className="text-accent-strong text-xs font-semibold uppercase tracking-[0.17em]">
            Academic profile
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Research, teaching & academic service
          </h2>
          <p className="text-muted mt-5 max-w-3xl text-base leading-8">
            I am an early-career researcher in statistics and population health,
            with peer-reviewed research across epidemiology, health inequalities,
            and explainable machine learning. Beyond publishing research, I
            contribute to collaborative global health studies, university-funded
            fieldwork, research training, and open science communication.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {profile?.cvUrl && (
              <Link
                href="/cv"
                className="bg-accent text-accent-foreground hover:bg-accent-strong rounded-md px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Academic CV
              </Link>
            )}
            <Link
              href="/research"
              className="border-border bg-surface hover:border-accent rounded-md border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              Research projects
            </Link>
            <Link
              href="/publications"
              className="border-border bg-surface hover:border-accent rounded-md border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              Publications
            </Link>
          </div>
        </div>
        <aside className="bg-accent-soft rounded-lg p-6">
          <p className="text-accent-strong text-xs font-semibold uppercase tracking-[0.16em]">
            Current academic focus
          </p>
          <ul className="mt-5 space-y-4 text-sm leading-6">
            <li className="border-border border-b pb-3">Clinical & translational epidemiology</li>
            <li className="border-border border-b pb-3">Health equity & population-based research</li>
            <li className="border-border border-b pb-3">Complex survey & longitudinal methods</li>
            <li>Explainable machine learning</li>
          </ul>
        </aside>
      </section>

      {/* FIVE SCANNABLE PROFESSIONAL HIGHLIGHTS */}
      <Section title="Academic & Professional Engagement">
        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((item) => (
            <article
              key={item.number}
              className="border-border bg-surface rounded-lg border p-6"
            >
              <span className="text-accent-strong text-xs font-semibold tracking-widest">
                {item.number}
              </span>
              <h3 className="mt-3 font-serif text-xl font-semibold">
                {item.heading}
              </h3>
              <p className="text-accent-strong mt-2 text-sm font-semibold">
                {item.role}
              </p>
              <p className="text-muted mt-3 text-sm leading-7">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
        <p className="text-muted mt-5 text-sm leading-6">
          For study designs, sample sizes, analytical methods, and current
          project status, see the <Link href="/research" className="text-accent-strong underline underline-offset-4">Research</Link> page.
        </p>
      </Section>

      {/* DATABASE-DRIVEN EDUCATION */}
      {education.length > 0 && (
        <Section title="Education">
          <ol className="max-w-4xl space-y-5">
            {education.map((item) => (
              <li
                key={item.id}
                className="border-border grid gap-3 border-l-2 pl-5 sm:grid-cols-[9rem_1fr] sm:gap-8"
              >
                <p className="text-muted text-sm sm:pt-1">
                  {item.startYear} – {item.endYear ?? "Present"}
                </p>
                <div>
                  <h3 className="font-serif text-lg font-semibold">
                    {item.degree}
                  </h3>
                  <p className="text-muted mt-1">{item.institution}</p>
                  {item.details && (
                    <p className="mt-2 text-sm leading-7">{item.details}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* DATABASE-DRIVEN METHODS & SOFTWARE */}
      {skillGroups.length > 0 && (
        <Section title="Methods & Technical Skills">
          <dl className="grid gap-5 sm:grid-cols-2">
            {skillGroups.map(([category, names]) => (
              <div
                key={category}
                className="border-border rounded-lg border p-5"
              >
                <dt className="font-serif text-lg font-semibold">
                  {category}
                </dt>
                <dd className="mt-4">
                  <ul className="flex flex-wrap gap-2">
                    {names.map((name) => (
                      <li
                        key={name}
                        className="border-border bg-surface rounded-md border px-3 py-1.5 text-xs"
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

      {/* DATABASE-DRIVEN AWARDS */}
      {awards.length > 0 && (
        <Section title="Selected Awards & Honours">
          <ul className="max-w-4xl space-y-4">
            {awards.map((award) => (
              <li
                key={award.id}
                className="border-border grid gap-2 border-b pb-4 last:border-b-0 sm:grid-cols-[7rem_1fr] sm:gap-6"
              >
                <p className="text-accent-strong text-sm font-semibold">
                  {award.year}
                </p>
                <div>
                  <h3 className="font-semibold">{award.title}</h3>
                  {award.issuer && (
                    <p className="text-muted mt-1 text-sm">{award.issuer}</p>
                  )}
                  {award.description && (
                    <p className="text-muted mt-2 text-sm leading-7">
                      {award.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <section className="border-border mt-14 border-t pt-10">
        <h2 className="font-serif text-2xl font-semibold">
          Research direction
        </h2>
        <p className="text-muted mt-4 max-w-3xl leading-8">
          My longer-term interests include clinical outcomes, health equity,
          and robust statistical methods for survey-based and longitudinal
          health research. I am particularly interested in transparent,
          reproducible analysis that can inform public health decisions.
        </p>
        <Link
          href="/contact"
          className="text-accent-strong mt-5 inline-block text-sm font-semibold underline underline-offset-4"
        >
          Contact for academic collaboration
        </Link>
      </section>
    </div>
  );
}
