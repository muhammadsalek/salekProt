"use client";

import Image from "next/image";
import { usePlayVideo } from "@/components/site/video-player";

/** Thumbnail and title; clicking either opens the video in the floating player. */
export function VideoCard({
  videoId,
  title,
  thumbnail,
  date,
  description,
}: {
  videoId: string;
  title: string;
  thumbnail: string;
  date: string;
  description?: string | null;
}) {
  const play = usePlayVideo();
  const open = () => play({ id: videoId, title });

  return (
    <article>
      <button
        type="button"
        onClick={open}
        aria-label={`Play video: ${title}`}
        className="group bg-foreground/5 relative block aspect-video w-full overflow-hidden rounded-lg"
      >
        <Image
          src={thumbnail}
          alt=""
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full bg-black/65 transition-colors group-hover:bg-black/80">
            <svg viewBox="0 0 24 24" aria-hidden className="ml-1 size-6 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </button>
      <h3 className="mt-3 font-serif text-lg leading-snug font-semibold text-pretty">
        <button type="button" onClick={open} className="hover:text-accent text-left">
          {title}
        </button>
      </h3>
      <p className="text-muted mt-1 text-sm">{date}</p>
      {description && <p className="mt-2 leading-relaxed">{description}</p>}
    </article>
  );
}
