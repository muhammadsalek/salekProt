import Link from "next/link";

export function PageHeader({
  title,
  description,
  back,
  action,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      {back && (
        <Link
          href={back.href}
          className="text-muted hover:text-foreground mb-3 inline-block text-sm"
        >
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && <p className="text-muted mt-1 max-w-prose text-sm">{description}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

export const buttonClass =
  "inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90";
