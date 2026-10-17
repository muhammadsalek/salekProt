import type { Metadata } from "next";
import { changeEmail, changePassword } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { RecordForm } from "@/components/admin/record-form";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const admin = await requireAdmin();

  return (
    <>
      <PageHeader title="Account" description="Your login details for this admin area." />

      <section className="border-border bg-surface mb-8 rounded-lg border p-6">
        <h2 className="font-medium">Login email</h2>
        <p className="text-muted mt-1 mb-5 text-sm">
          Currently <span className="text-foreground font-medium">{admin.email}</span>
        </p>
        <RecordForm
          action={changeEmail}
          submitLabel="Change email"
          fields={[
            { name: "email", label: "New login email", type: "email", required: true },
            {
              name: "currentPassword",
              label: "Current password",
              type: "password",
              required: true,
            },
          ]}
        />
      </section>

      <section className="border-border bg-surface rounded-lg border p-6">
        <h2 className="mb-5 font-medium">Password</h2>
        <RecordForm
          action={changePassword}
          submitLabel="Change password"
          fields={[
            {
              name: "currentPassword",
              label: "Current password",
              type: "password",
              required: true,
            },
            {
              name: "newPassword",
              label: "New password",
              type: "password",
              required: true,
              help: "At least 10 characters.",
            },
            {
              name: "confirmPassword",
              label: "Repeat new password",
              type: "password",
              required: true,
            },
          ]}
        />
      </section>
    </>
  );
}

// Reads the session and live data on every request.
export const instant = false;
