"use client";

import { useState } from "react";

export function CopyBibtex({ bibtex }: { bibtex: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(bibtex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-accent hover:underline"
    >
      {copied ? "Copied" : "Copy BibTeX"}
    </button>
  );
}
