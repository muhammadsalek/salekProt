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

export function PublicationEntry({ pub, author }: { pub: Publication; author?: string }) {
  const status = publicationStatus.find((s) => s.value === pub.status)?.label ?? pub.status;
  const link = pub.url ?? (pub.doi ? `https://doi.org/${pub.doi}` : null);
  const actions = [
    pub.doi && { label: "DOI", href: `https://doi.org/${pub.doi}` },
    pub.pdfUrl && { label: "PDF", href: pub.pdfUrl },
    pub.codeUrl && { label: "Code & data", href: pub.codeUrl },
  ].filter((a): a is { label: string; href: string } => !!a);

  return (
    <article className="space-y-1.5">
      <h3 className="font-serif text-lg leading-snug font-semibold text-pretty">
        {link ? (
          <a href={link} className="hover:text-accent" target="_blank" rel="noopener noreferrer">
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
          <span className="border-highlight/40 text-highlight ml-2 rounded-full border px-2 py-px text-xs font-medium">
            {status}
          </span>
        )}
      </p>
      {(actions.length > 0 || pub.bibtex) && (
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
