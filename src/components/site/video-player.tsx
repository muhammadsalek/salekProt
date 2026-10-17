"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Video = { id: string; title: string };

const PlayerContext = createContext<(video: Video) => void>(() => {});

/** Opens a video in the floating player. */
export function usePlayVideo() {
  return useContext(PlayerContext);
}

/**
 * One floating player for the whole site, docked bottom-right.
 * It lives in the site layout, so it keeps playing while the visitor moves between pages.
 */
export function VideoPlayerProvider({ children }: { children: React.ReactNode }) {
  const [video, setVideo] = useState<Video | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const play = useCallback((next: Video) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setVideo(next);
  }, []);

  const close = useCallback(() => {
    setVideo(null);
    returnFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (!video) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [video, close]);

  return (
    <PlayerContext.Provider value={play}>
      {children}
      {video && (
        <aside
          aria-label="Video player"
          className="border-border bg-surface fixed right-3 bottom-3 left-3 z-50 overflow-hidden rounded-xl border shadow-2xl motion-safe:animate-[player-in_200ms_ease-out] sm:left-auto sm:w-[26rem]"
        >
          <div className="flex items-center gap-3 px-4 py-2.5">
            <p className="min-w-0 flex-1 truncate text-sm font-medium" title={video.title}>
              {video.title}
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground shrink-0 text-sm"
            >
              YouTube
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close video"
              className="text-muted hover:text-foreground -mr-1 grid size-8 shrink-0 place-items-center rounded-md"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="size-5 fill-none stroke-current stroke-2"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="aspect-video bg-black">
            <iframe
              key={video.id}
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          </div>
        </aside>
      )}
    </PlayerContext.Provider>
  );
}
