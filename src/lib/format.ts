import type { Profile } from "@/lib/queries";

export function formatDate(date: Date, style: "day" | "month" = "day") {
  return date.toLocaleDateString("en-GB", {
    day: style === "day" ? "numeric" : undefined,
    month: style === "day" ? "short" : "long",
    year: "numeric",
  });
}

/**
 * The profile's external links that are filled in, ordered by the positions set in the admin.
 * Links without a position follow, in the default order below.
 */
export function profileLinks(profile: Profile | null) {
  if (!profile) return [];
  const links = [
    {
      id: "scholar",
      label: "Google Scholar",
      href: profile.scholarUrl,
      order: profile.scholarOrder,
    },
    { id: "orcid", label: "ORCID", href: profile.orcidUrl, order: profile.orcidOrder },
    {
      id: "researchgate",
      label: "ResearchGate",
      href: profile.researchGateUrl,
      order: profile.researchGateOrder,
    },
    { id: "github", label: "GitHub", href: profile.githubUrl, order: profile.githubOrder },
    { id: "linkedin", label: "LinkedIn", href: profile.linkedinUrl, order: profile.linkedinOrder },
    { id: "x", label: "X / Bluesky", href: profile.xUrl, order: profile.xOrder },
  ] satisfies (Omit<ProfileLink, "href"> & { href: string | null; order: number | null })[];
  return links
    .filter((l) => !!l.href)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
    .map(({ id, label, href }): ProfileLink => ({ id, label, href: href! }));
}

/** Skill names grouped by category (uncategorised ones under "Other"), in the order given. */
export function groupSkills(skills: { name: string; category: string | null }[]) {
  const groups = new Map<string, string[]>();
  for (const s of skills) {
    const key = s.category || "Other";
    groups.set(key, [...(groups.get(key) ?? []), s.name]);
  }
  return [...groups];
}

export type ProfileLinkId = "scholar" | "orcid" | "researchgate" | "github" | "linkedin" | "x";
export type ProfileLink = { id: ProfileLinkId; label: string; href: string };

/** Unique values across publications, most frequent first. */
export function tally(lists: string[][]) {
  const counts = new Map<string, number>();
  for (const list of lists) for (const v of list) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
