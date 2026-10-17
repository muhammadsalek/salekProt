"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {links.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <li key={link.href} className="shrink-0">
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={
                "block rounded-md px-3 py-2 text-sm whitespace-nowrap " +
                (active
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-muted hover:bg-foreground/5 hover:text-foreground")
              }
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
