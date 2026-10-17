import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { login } from "@/app/admin/actions";
import { RecordForm } from "@/components/admin/record-form";
import { getAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

// Reads the session cookie on every request.
export const instant = false;

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="border-border bg-surface w-full max-w-sm rounded-xl border p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-muted mt-1 mb-6 text-sm">Manage your website content.</p>
        <RecordForm
          action={login}
          submitLabel="Sign in"
          fields={[
            { name: "email", label: "Email", type: "email", required: true },
            { name: "password", label: "Password", type: "password", required: true },
          ]}
        />
      </div>
    </main>
  );
}
