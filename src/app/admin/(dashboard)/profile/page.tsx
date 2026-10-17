import type { Metadata } from "next";
import { saveProfile } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { RecordForm } from "@/components/admin/record-form";
import { toFormValues } from "@/lib/admin/fields";
import { profileFields } from "@/lib/admin/resources";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const profile = await db.profile.findUnique({ where: { id: 1 } });

  // Show when the CV was last replaced.
  const fields = profileFields.map((f) =>
    f.name === "cvUrl" && profile?.cvUpdatedAt
      ? {
          ...f,
          help: `${f.help} Last updated ${profile.cvUpdatedAt.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}.`,
        }
      : f,
  );

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your photo, CV, bio and contact details, shown across the website."
      />
      {!isCloudinaryConfigured() && (
        <p className="border-highlight/40 bg-highlight/10 mb-6 rounded-md border px-4 py-3 text-sm">
          Photo and CV uploads are not set up yet: the Cloudinary keys are missing from the server
          settings.
        </p>
      )}
      <div className="border-border bg-surface rounded-lg border p-6">
        <RecordForm
          action={saveProfile}
          fields={fields}
          initialValues={toFormValues(profileFields, profile)}
          submitLabel="Save profile"
        />
      </div>
    </>
  );
}

// Reads the session and live data on every request.
export const instant = false;
