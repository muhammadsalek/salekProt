import Link from "next/link";

/** A titled block on a page, with an optional "see all" link on the right. */
export function Section({
  title,
  more,
  children,
}: {
  title: string;
  more?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="border-border mt-16 border-t pt-8">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-2xl font-semibold">{title}</h2>
        {more && (
          <Link href={more.href} className="text-accent text-sm hover:underline">
            {more.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function PageTitle({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="mb-12 max-w-2xl">
      <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      {lead && <p className="text-muted mt-4 text-lg leading-relaxed">{lead}</p>}
    </header>
  );
}
