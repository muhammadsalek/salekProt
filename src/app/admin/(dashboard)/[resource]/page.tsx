import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { removeRecord } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { buttonClass, PageHeader } from "@/components/admin/page-header";
import { listRecords } from "@/lib/admin/data";
import { displayValue } from "@/lib/admin/fields";
import { getResource } from "@/lib/admin/resources";

const savedMessages: Record<string, string> = {
  created: "Added.",
  updated: "Changes saved.",
  deleted: "Deleted.",
};

export async function generateMetadata({
  params,
}: PageProps<"/admin/[resource]">): Promise<Metadata> {
  return { title: getResource((await params).resource)?.label };
}

export default async function ResourceListPage({
  params,
  searchParams,
}: PageProps<"/admin/[resource]">) {
  const resource = getResource((await params).resource);
  if (!resource) notFound();

  const saved = (await searchParams).saved;
  const message = typeof saved === "string" ? savedMessages[saved] : undefined;
  const records = await listRecords(resource.key);
  const columns = resource.columns.map((name) => resource.fields.find((f) => f.name === name)!);
  const itemName = resource.singular.toLowerCase();

  return (
    <>
      <PageHeader
        title={resource.label}
        description={resource.description}
        action={
          <Link href={`/admin/${resource.key}/new`} className={buttonClass}>
            Add {itemName}
          </Link>
        }
      />

      {message && (
        <p
          role="status"
          className="border-success/40 bg-success/10 text-success mb-6 rounded-md border px-4 py-3 text-sm"
        >
          {message}
        </p>
      )}

      {records.length === 0 ? (
        <div className="border-border rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted">Nothing here yet.</p>
          <Link href={`/admin/${resource.key}/new`} className={`${buttonClass} mt-4`}>
            Add your first {itemName}
          </Link>
        </div>
      ) : (
        <div className="border-border bg-surface overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="border-border text-muted border-b text-xs tracking-wide uppercase">
              <tr>
                {columns.map((c) => (
                  <th key={c.name} scope="col" className="px-4 py-3 font-medium">
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {records.map((record) => (
                <tr key={record.id} className="align-top">
                  {columns.map((c, i) => (
                    <td
                      key={c.name}
                      className={i === 0 ? "max-w-md px-4 py-3" : "text-muted px-4 py-3"}
                    >
                      {i === 0 ? (
                        <Link
                          href={`/admin/${resource.key}/${record.id}`}
                          className="text-foreground hover:text-accent line-clamp-2 font-medium"
                        >
                          {displayValue(c, record[c.name])}
                        </Link>
                      ) : (
                        displayValue(c, record[c.name])
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/${resource.key}/${record.id}`}
                        className="text-accent text-sm hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        compact
                        itemName={itemName}
                        action={removeRecord.bind(null, resource.key, record.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// Reads the session and live data on every request.
export const instant = false;
