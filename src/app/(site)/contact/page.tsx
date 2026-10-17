import type { Metadata } from "next";
import { PageTitle } from "@/components/site/section";
import { profileLinks } from "@/lib/format";
import { getProfile } from "@/lib/queries";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const profile = await getProfile();
  const links = profileLinks(profile);

  return (
    <>
      <PageTitle
        title="Contact"
        lead="I am happy to hear about research collaborations, graduate opportunities and questions about my work."
      />

      <div className="grid max-w-3xl gap-10 sm:grid-cols-2">
        <div className="space-y-8">
          {profile?.email && (
            <div>
              <h2 className="font-semibold">Email</h2>
              <a
                href={`mailto:${profile.email}`}
                className="text-accent mt-1 inline-block font-serif text-xl hover:underline"
              >
                {profile.email}
              </a>
            </div>
          )}
          {profile?.address && (
            <div>
              <h2 className="font-semibold">Address</h2>
              <address className="text-muted mt-1 leading-relaxed whitespace-pre-line not-italic">
                {profile.address}
              </address>
            </div>
          )}
        </div>

        {links.length > 0 && (
          <div>
            <h2 className="font-semibold">Elsewhere</h2>
            <ul className="mt-2 space-y-2">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
