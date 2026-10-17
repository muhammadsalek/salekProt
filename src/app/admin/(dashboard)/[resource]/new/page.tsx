import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveRecord } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { RecordForm } from "@/components/admin/record-form";
import { getResource } from "@/lib/admin/resources";

export async function generateMetadata({
  params,
}: PageProps<"/admin/[resource]/new">): Promise<Metadata> {
  const resource = getResource((await params).resource);
  return { title: resource && `Add ${resource.singular.toLowerCase()}` };
}

export default async function NewRecordPage({ params }: PageProps<"/admin/[resource]/new">) {
  const resource = getResource((await params).resource);
  if (!resource) notFound();

  return (
    <>
      <PageHeader
        title={`Add ${resource.singular.toLowerCase()}`}
        back={{ href: `/admin/${resource.key}`, label: resource.label }}
      />
      <div className="border-border bg-surface rounded-lg border p-6">
        <RecordForm
          action={saveRecord.bind(null, resource.key, null)}
          fields={resource.fields}
          submitLabel="Save"
          cancelHref={`/admin/${resource.key}`}
        />
      </div>
    </>
  );
}

// Reads the session and live data on every request.
export const instant = false;
