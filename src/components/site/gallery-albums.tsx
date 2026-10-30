"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type Album = {
  id: string;
  title: string;
  /** Already formatted for display. */
  date: string;
  location: string | null;
  description: string | null;
  photos: string[];
};

/** One card per event; selecting it opens the event's photos in a viewer. */
export function GalleryAlbums({ albums }: { albums: Album[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<{ album: Album; index: number } | null>(null);

  // Opened after the photos render, so the dialog can focus its close button.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (view && dialog && !dialog.open) dialog.showModal();
  }, [view]);

  const close = () => dialogRef.current?.close();
  const show = (index: number) =>
    setView((v) => v && { ...v, index: (index + v.album.photos.length) % v.album.photos.length });

  return (
    <>
      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => {
          const open = () => setView({ album, index: 0 });
          const count = album.photos.length;
          return (
            <li key={album.id}>
              <article>
                <button
                  type="button"
                  onClick={open}
                  aria-label={`View photos: ${album.title}`}
                  className="group bg-foreground/5 relative block aspect-[4/3] w-full overflow-hidden rounded-lg"
                >
                  <Image
                    src={album.photos[0]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  {count > 1 && (
                    <span className="absolute right-2 bottom-2 rounded-md bg-black/65 px-2 py-0.5 text-xs font-medium text-white">
                      {count} photos
                    </span>
                  )}
                </button>
                <h3 className="mt-3 font-serif text-lg leading-snug font-semibold text-pretty">
                  <button type="button" onClick={open} className="hover:text-accent text-left">
                    {album.title}
                  </button>
                </h3>
                <p className="text-muted mt-1 text-sm">
                  {[album.date, album.location].filter(Boolean).join(" · ")}
                </p>
                {album.description && (
                  <p className="mt-2 line-clamp-3 leading-relaxed">{album.description}</p>
                )}
              </article>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={view?.album.title}
        onClose={() => setView(null)}
        // A click on the dimmed backdrop lands on the dialog element itself.
        onClick={(e) => e.target === e.currentTarget && close()}
        onKeyDown={(e) => {
          if (!view) return;
          if (e.key === "ArrowRight") show(view.index + 1);
          if (e.key === "ArrowLeft") show(view.index - 1);
        }}
        className="bg-surface text-foreground border-border m-auto max-h-[calc(100dvh-2rem)] w-[min(64rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border p-0 shadow-2xl backdrop:bg-black/80"
      >
        {view && <Viewer album={view.album} index={view.index} onShow={show} onClose={close} />}
      </dialog>
    </>
  );
}

function Viewer({
  album,
  index,
  onShow,
  onClose,
}: {
  album: Album;
  index: number;
  onShow: (index: number) => void;
  onClose: () => void;
}) {
  const count = album.photos.length;
  const meta = [album.date, album.location].filter(Boolean).join(" · ");

  return (
    <>
      <div className="flex items-start gap-4 px-5 pt-4 pb-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-xl font-semibold text-pretty">{album.title}</h2>
          <p className="text-muted mt-0.5 text-sm">
            {meta}
            {count > 1 && (
              <span className="tabular-nums">
                {" "}
                · Photo {index + 1} of {count}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-muted hover:text-foreground -mr-1 grid size-9 shrink-0 place-items-center rounded-md"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-none stroke-current stroke-2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="relative h-[min(65dvh,42rem)] bg-black">
        <Image
          key={album.photos[index]}
          src={album.photos[index]}
          alt={`${album.title}, photo ${index + 1} of ${count}`}
          fill
          sizes="(min-width: 1024px) 64rem, 100vw"
          className="object-contain"
        />
        {count > 1 && (
          <>
            <ArrowButton direction="previous" onClick={() => onShow(index - 1)} />
            <ArrowButton direction="next" onClick={() => onShow(index + 1)} />
          </>
        )}
      </div>

      {(count > 1 || album.description) && (
        <div className="space-y-4 px-5 py-4">
          {count > 1 && (
            <ul className="flex gap-2 overflow-x-auto pb-1">
              {album.photos.map((photo, i) => (
                <li key={photo} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onShow(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className={
                      "relative block size-14 overflow-hidden rounded-md ring-offset-2 ring-offset-[var(--surface)] " +
                      (i === index ? "ring-accent ring-2" : "opacity-70 hover:opacity-100")
                    }
                  >
                    <Image src={photo} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {album.description && (
            <p className="max-w-3xl leading-relaxed whitespace-pre-line">{album.description}</p>
          )}
        </div>
      )}
    </>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "next" ? "Next photo" : "Previous photo"}
      className={
        "absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 " +
        (direction === "next" ? "right-3" : "left-3")
      }
    >
      <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-none stroke-current stroke-2">
        <path d={direction === "next" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} />
      </svg>
    </button>
  );
}
