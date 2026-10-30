import { CopyBibtex } from "@/components/site/copy-bibtex";
import { publicationStatus } from "@/lib/admin/resources";
import type { Publication } from "@/lib/queries";

const FINAL = new Set(["PUBLISHED", "ACCEPTED"]);

/** Bolds the researcher's own name in the author list. */
function Authors({ authors, highlight }: { authors: string; highlight?: string }) {
  const key = highlight?.trim().split(/\s+/).at(-1)?.toLowerCase();
  const parts = authors.split(/,\s*/);
  return (
    <>
      {parts.map((name, i) => (
        <span key={i}>
          {key && key.length > 2 && name.toLowerCase().includes(key) ? (
            <strong className="text-foreground font-semibold">{name}</strong>
          ) : (
            name
          )}
          {i < parts.length - 1 && ", "}
        </span>
      ))}
    </>
  );
}

// Distinct colours so a skimming reader spots each link at once on the home page.
const ACTION_STYLES: Record<string, string> = {
  DOI: "border-accent/40 bg-accent-soft text-accent-strong hover:bg-accent hover:text-accent-foreground",
  PDF: "border-highlight/40 bg-highlight/10 text-highlight hover:bg-highlight hover:text-background",
  "Code & data":
    "border-success/40 bg-success/10 text-success hover:bg-success hover:text-background",
};

export function PublicationEntry({
  pub,
  author,
  featured = false,
}: {
  pub: Publication;
  author?: string;
  /** Home-page card: topics on the left, coloured links on the right. */
  featured?: boolean;
}) {
  const status = publicationStatus.find((s) => s.value === pub.status)?.label ?? pub.status;
  const link = pub.url ?? (pub.doi ? `https://doi.org/${pub.doi}` : null);
  const actions = [
    pub.doi && { label: "DOI", href: `https://doi.org/${pub.doi}` },
    pub.pdfUrl && { label: "PDF", href: pub.pdfUrl },
    pub.codeUrl && { label: "Code & data", href: pub.codeUrl },
  ].filter((a): a is { label: string; href: string } => !!a);
  const showFooter = featured
    ? pub.tags.length > 0 || actions.length > 0 || !!pub.bibtex
    : actions.length > 0 || !!pub.bibtex;

  return (
    <article className="space-y-1.5">
      <h3 className="text-accent-strong font-serif text-lg leading-snug font-semibold text-pretty">
        {link ? (
          <a
            href={link}
            className="decoration-accent/40 underline-offset-4 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {pub.title}
          </a>
        ) : (
          pub.title
        )}
      </h3>
      <p className="text-muted text-[0.95rem]">
        <Authors authors={pub.authors} highlight={author} />
      </p>
      <p className="text-[0.95rem]">
        {pub.venue && <em className="font-serif">{pub.venue}</em>}
        {pub.venue && ", "}
        {pub.year}
        {!FINAL.has(pub.status) && (
          <span className="border-highlight/40 bg-highlight/10 text-highlight ml-2 rounded-full border px-2 py-px text-xs font-medium">
            {status}
          </span>
        )}
      </p>
      {featured && showFooter && (
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-start sm:justify-between">
          {pub.tags.length > 0 ? (
            <ul aria-label="Topics" className="flex flex-wrap gap-1.5">
              {pub.tags.map((t) => (
                <li
                  key={t}
                  className="bg-accent-soft text-accent-strong rounded-full px-2.5 py-0.5 text-xs font-medium"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          <div className="flex shrink-0 flex-wrap gap-2 text-sm font-semibold sm:justify-end">
            {actions.map((a) => (
              <a
                key={a.label}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-md border px-3 py-1 transition-colors ${ACTION_STYLES[a.label]}`}
              >
                {a.label}
              </a>
            ))}
            {pub.bibtex && (
              <CopyBibtex
                bibtex={pub.bibtex}
                className="border-border bg-surface text-foreground hover:border-accent hover:text-accent rounded-md border px-3 py-1 transition-colors"
              />
            )}
          </div>
        </div>
      )}
      {!featured && showFooter && (
        <p className="flex flex-wrap gap-x-4 gap-y-1 pt-0.5 text-sm">
          {actions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {a.label}
            </a>
          ))}
          {pub.bibtex && <CopyBibtex bibtex={pub.bibtex} />}
        </p>
      )}
    </article>
  );
}
