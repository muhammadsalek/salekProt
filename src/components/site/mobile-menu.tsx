"use client";

import { useRef } from "react";
import { SiteNav } from "@/components/site/site-nav";

export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={ref} className="group lg:hidden">
      <summary className="text-muted hover:text-foreground cursor-pointer list-none py-1 [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">Menu</span>
        <span className="hidden group-open:inline">Close</span>
      </summary>
      <div className="border-border bg-background absolute inset-x-0 top-full border-b px-4 pb-6">
        <SiteNav
          className="space-y-2 pt-2 text-lg"
          onNavigate={() => ref.current?.removeAttribute("open")}
        />
      </div>
    </details>
  );
}
