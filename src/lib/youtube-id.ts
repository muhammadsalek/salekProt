/**
 * Extracts the video id from a YouTube link: watch?v=, youtu.be/, /shorts/, /embed/, /live/.
 * Returns null for anything else.
 */
export function youtubeVideoId(link: string): string | null {
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m|music)\./, "");
  let id: string | null | undefined = null;
  if (host === "youtu.be") id = url.pathname.split("/")[1];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : url.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?]+)/)?.[1];
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}

export function youtubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
