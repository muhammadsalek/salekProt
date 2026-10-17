"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {navLinks.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={
                "block py-1 transition-colors " +
                (active
                  ? "text-accent underline decoration-2 underline-offset-8"
                  : "text-muted hover:text-foreground")
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
