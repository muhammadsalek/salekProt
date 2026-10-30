"use client";

import { useState } from "react";

export function CopyBibtex({
  bibtex,
  className = "text-accent hover:underline",
}: {
  bibtex: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(bibtex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={className}
    >
      {copied ? "Copied" : "Copy BibTeX"}
    </button>
  );
}
