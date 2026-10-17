import type { Metadata } from "next";
import { PageTitle } from "@/components/site/section";
import { TutorialGrid } from "@/components/site/tutorial-grid";
import { getProfile, getTutorials } from "@/lib/queries";

export const metadata: Metadata = { title: "Tutorials" };

export default async function TutorialsPage() {
  const [profile, tutorials] = await Promise.all([getProfile(), getTutorials()]);

  return (
    <>
      <PageTitle
        title="Tutorials"
        lead="Video tutorials on statistics and working with survey data. Select a video to watch it here."
      />

      {tutorials.length > 0 ? (
        <TutorialGrid tutorials={tutorials} />
      ) : (
        <p className="text-muted">Tutorials will appear here soon.</p>
      )}

      {profile?.youtubeUrl && (
        <p className="mt-14">
          <a
            href={profile.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-accent-foreground inline-block rounded-md px-5 py-2.5 font-medium hover:opacity-90"
          >
            See all videos on YouTube
          </a>
        </p>
      )}
    </>
  );
}
