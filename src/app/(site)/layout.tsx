import type { Metadata } from "next";
import Link from "next/link";
import { MobileMenu } from "@/components/site/mobile-menu";
import { SiteNav } from "@/components/site/site-nav";
import { VideoPlayerProvider } from "@/components/site/video-player";
import { profileLinks } from "@/lib/format";
import { getProfile } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile?.name ?? "Academic portfolio";
  return {
    title: { template: `%s | ${name}`, default: name },
    description: profile?.shortBio || profile?.focus || undefined,
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();
  const name = profile?.name ?? "Portfolio";

  return (
    <VideoPlayerProvider>
      <header className="border-border bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
          <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
            {name}
          </Link>
          <nav aria-label="Main">
            <SiteNav className="hidden gap-6 text-[0.95rem] md:flex" />
            <MobileMenu />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-12 pb-20 sm:px-6 sm:pt-16">
        {children}
      </main>

      <footer className="border-border border-t">
        <div className="text-muted mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            {name}
            {profile?.institution && `, ${profile.institution}`}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {profile?.email && (
              <li>
                <a href={`mailto:${profile.email}`} className="hover:text-foreground">
                  Email
                </a>
              </li>
            )}
            {profileLinks(profile).map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </VideoPlayerProvider>
  );
}
