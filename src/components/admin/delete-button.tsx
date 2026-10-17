"use client";

import { useFormStatus } from "react-dom";

export function DeleteButton({
  action,
  itemName,
  compact = false,
}: {
  action: () => Promise<void>;
  itemName: string;
  compact?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete this ${itemName}? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <Submit compact={compact} />
    </form>
  );
}

function Submit({ compact }: { compact: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        compact
          ? "text-danger text-sm hover:underline disabled:opacity-60"
          : "border-danger/50 text-danger hover:bg-danger/10 rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-60"
      }
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
