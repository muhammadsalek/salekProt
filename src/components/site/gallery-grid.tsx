import { GalleryAlbums } from "@/components/site/gallery-albums";
import { formatDate } from "@/lib/format";
import type { GalleryEvent } from "@/lib/queries";

export function GalleryGrid({ events }: { events: GalleryEvent[] }) {
  return (
    <GalleryAlbums
      // Dates are formatted here so visitors in other time zones see the same day.
      albums={events.map((e) => ({
        id: e.id,
        title: e.title,
        date: formatDate(e.date),
        location: e.location,
        description: e.description,
        photos: e.photos,
      }))}
    />
  );
}
