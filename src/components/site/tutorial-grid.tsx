import { VideoCard } from "@/components/site/video-card";
import { formatDate } from "@/lib/format";
import type { Tutorial } from "@/lib/queries";
import { youtubeThumbnail, youtubeVideoId } from "@/lib/youtube-id";

export function TutorialGrid({ tutorials }: { tutorials: Tutorial[] }) {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {tutorials.flatMap((t) => {
        const id = youtubeVideoId(t.videoUrl);
        if (!id) return [];
        return (
          <VideoCard
            key={t.id}
            videoId={id}
            title={t.title}
            thumbnail={t.thumbnailUrl || youtubeThumbnail(id)}
            date={formatDate(t.date)}
            description={t.description}
          />
        );
      })}
    </div>
  );
}
