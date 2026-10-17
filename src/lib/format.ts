import type { Profile } from "@/lib/queries";

export function formatDate(date: Date, style: "day" | "month" = "day") {
  return date.toLocaleDateString("en-GB", {
    day: style === "day" ? "numeric" : undefined,
    month: style === "day" ? "short" : "long",
    year: "numeric",
  });
}

/** The profile's external links that are filled in, in display order. */
export function profileLinks(profile: Profile | null) {
  if (!profile) return [];
  const links: { label: string; href: string | null }[] = [
    { label: "Google Scholar", href: profile.scholarUrl },
    { label: "ORCID", href: profile.orcidUrl },
    { label: "ResearchGate", href: profile.researchGateUrl },
    { label: "GitHub", href: profile.githubUrl },
    { label: "LinkedIn", href: profile.linkedinUrl },
    { label: "X / Bluesky", href: profile.xUrl },
  ];
  return links.filter((l): l is { label: string; href: string } => !!l.href);
}

/** Unique values across publications, most frequent first. */
export function tally(lists: string[][]) {
  const counts = new Map<string, number>();
  for (const list of lists) for (const v of list) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
