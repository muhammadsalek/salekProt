import type { Metadata } from "next";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { PageTitle } from "@/components/site/section";
import { getGalleryEvents } from "@/lib/queries";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const events = await getGalleryEvents();

  return (
    <>
      <PageTitle
        title="Gallery"
        lead="Photos from conferences, presentations and academic events. Select an event to see all its photos."
      />

      {events.length > 0 ? (
        <GalleryGrid events={events} />
      ) : (
        <p className="text-muted">Photos will appear here soon.</p>
      )}
    </>
  );
}
