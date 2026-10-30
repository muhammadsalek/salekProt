import type { Metadata } from "next";
import { PageTitle } from "@/components/site/section";
import { getProjects } from "@/lib/queries";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageTitle
        title="Projects"
        lead="Software, data tools and analyses I have built, with live demos and open source code."
      />

      {projects.length === 0 ? (
        <p className="text-muted">Projects will appear here soon.</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => {
            const links = [
              { label: "Live demo", href: p.demoUrl },
              { label: "GitHub", href: p.githubUrl },
            ].filter((l): l is { label: string; href: string } => !!l.href);
            return (
              <li
                key={p.id}
                className="border-border bg-surface flex flex-col rounded-lg border p-6"
              >
                <h2 className="font-serif text-xl leading-snug font-semibold text-pretty">
                  {p.title}
                </h2>
                <p className="mt-3 leading-relaxed">{p.description}</p>

                {p.technologies.length > 0 && (
                  <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-2">
                    {p.technologies.map((t) => (
                      <li
                        key={t}
                        className="bg-accent-soft text-accent-strong rounded-full px-2.5 py-0.5 text-sm"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}

                {links.length > 0 && (
                  <p className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-5 text-sm font-medium">
                    {links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {l.label} ↗
                      </a>
                    ))}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
