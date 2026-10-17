import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { removeRecord, saveRecord } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { PageHeader } from "@/components/admin/page-header";
import { RecordForm } from "@/components/admin/record-form";
import { getRecord } from "@/lib/admin/data";
import { toFormValues } from "@/lib/admin/fields";
import { getResource } from "@/lib/admin/resources";

export async function generateMetadata({
  params,
}: PageProps<"/admin/[resource]/[id]">): Promise<Metadata> {
  const resource = getResource((await params).resource);
  return { title: resource && `Edit ${resource.singular.toLowerCase()}` };
}

export default async function EditRecordPage({ params }: PageProps<"/admin/[resource]/[id]">) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) notFound();
  const record = await getRecord(resource.key, id);
  if (!record) notFound();

  const itemName = resource.singular.toLowerCase();

  return (
    <>
      <PageHeader
        title={`Edit ${itemName}`}
        back={{ href: `/admin/${resource.key}`, label: resource.label }}
        action={
          <DeleteButton itemName={itemName} action={removeRecord.bind(null, resource.key, id)} />
        }
      />
      <div className="border-border bg-surface rounded-lg border p-6">
        <RecordForm
          action={saveRecord.bind(null, resource.key, id)}
          fields={resource.fields}
          initialValues={toFormValues(resource.fields, record)}
          submitLabel="Save changes"
          cancelHref={`/admin/${resource.key}`}
        />
      </div>
    </>
  );
}

// Reads the session and live data on every request.
export const instant = false;
