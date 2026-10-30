"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ACCEPT, uploadFile } from "@/components/admin/upload-field";
import type { Field } from "@/lib/admin/fields";

type Progress = { current: number; total: number; percent: number };

/** Several images in order, e.g. event photos. The first one is the cover. */
export function UploadListField({
  field,
  initialUrls,
  describedBy,
}: {
  field: Field;
  initialUrls: string[];
  describedBy?: string;
}) {
  const kind = field.upload ?? "image";
  const max = field.maxFiles ?? Infinity;
  const [urls, setUrls] = useState(initialUrls);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = `field-${field.name}`;
  const uploading = progress !== null;
  const full = urls.length >= max;
  const changed = urls.join("\n") !== initialUrls.join("\n");

  // One at a time, so progress is easy to follow and a slow connection is not overloaded.
  async function handleFiles(files: File[]) {
    const batch = files.slice(0, max - urls.length);
    const problems =
      batch.length < files.length
        ? [`You can add up to ${max} files, so ${files.length - batch.length} were skipped.`]
        : [];
    setErrors([]);
    for (const [i, file] of batch.entries()) {
      const step = { current: i + 1, total: batch.length };
      setProgress({ ...step, percent: 0 });
      const result = await uploadFile(file, kind, (percent) => setProgress({ ...step, percent }));
      if ("url" in result) setUrls((prev) => [...prev, result.url]);
      else problems.push(`${file.name}: ${result.error}`);
    }
    setProgress(null);
    setErrors(problems);
  }

  return (
    <div className="space-y-3">
      {urls.map((url) => (
        <input key={url} type="hidden" name={field.name} value={url} />
      ))}

      {urls.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {urls.map((url, i) => (
            <li key={url} className="space-y-1.5">
              <div className="relative">
                <Image
                  src={url}
                  alt={`Uploaded file ${i + 1}`}
                  width={160}
                  height={160}
                  unoptimized
                  className="border-border aspect-square w-full rounded-lg border object-cover"
                />
                {i === 0 && urls.length > 1 && (
                  <span className="bg-accent text-accent-foreground absolute top-1.5 left-1.5 rounded px-1.5 py-0.5 text-xs font-medium">
                    Cover
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-3 text-xs">
                {i > 0 && (
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => setUrls((prev) => [url, ...prev.filter((u) => u !== url)])}
                    className="text-accent hover:underline disabled:opacity-60"
                  >
                    Make cover
                  </button>
                )}
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => setUrls((prev) => prev.filter((u) => u !== url))}
                  className="text-danger hover:underline disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted text-sm">No files uploaded yet.</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          accept={ACCEPT[kind]}
          className="sr-only"
          aria-describedby={describedBy}
          disabled={uploading || full}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) void handleFiles(files);
          }}
        />
        <button
          type="button"
          disabled={uploading || full}
          onClick={() => inputRef.current?.click()}
          className="border-border hover:border-accent rounded-md border px-3 py-1.5 text-sm font-medium disabled:opacity-60"
        >
          {progress
            ? `Uploading ${progress.current} of ${progress.total}… ${progress.percent}%`
            : urls.length
              ? "Add more"
              : "Upload"}
        </button>
        {full && <span className="text-muted text-xs">You have reached the limit of {max}.</span>}
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="text-danger space-y-1 text-xs">
          {errors.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      )}
      {changed && !uploading && (
        <p className="text-highlight text-xs">Not saved yet. Click the save button below.</p>
      )}
    </div>
  );
}
