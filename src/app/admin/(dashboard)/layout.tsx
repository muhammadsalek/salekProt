import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { NavLinks } from "@/components/admin/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { resources } from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/auth";

// Every admin page checks the session at request time.
export const instant = false;

export default async function DashboardLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  const links = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/profile", label: "Profile" },
    ...resources.map((r) => ({ href: `/admin/${r.key}`, label: r.label })),
    { href: "/admin/account", label: "Account" },
  ];

  return (
    <div className="min-h-screen md:flex">
      <aside className="border-border bg-surface border-b md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <div className="flex h-full flex-col gap-4 p-4">
          <div className="flex items-center justify-between md:block">
            <Link href="/admin" className="font-semibold">
              Site admin
            </Link>
            <p className="text-muted hidden truncate text-xs md:mt-1 md:block">{admin.email}</p>
          </div>
          <nav aria-label="Admin">
            <NavLinks links={links} />
          </nav>
          <div className="mt-auto hidden space-y-3 md:block">
            <ThemeToggle className="ml-3" />
            <Link
              href="/"
              target="_blank"
              className="text-muted hover:text-foreground block px-3 text-sm"
            >
              View site ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="text-muted hover:text-foreground px-3 text-sm">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-10">
        {children}
        <div className="border-border text-muted mt-12 flex items-center gap-4 border-t pt-4 text-sm md:hidden">
          <ThemeToggle />
          <Link href="/" target="_blank">
            View site ↗
          </Link>
          <form action={logout}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </main>
    </div>
  );
}
