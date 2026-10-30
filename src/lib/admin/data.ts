import "server-only";
import { db } from "@/lib/db";
import type { ResourceKey } from "@/lib/admin/resources";

export type Row = Record<string, unknown> & { id: string };

// The subset of a Prisma model delegate the generic admin screens need.
type Delegate = {
  findMany(args: { orderBy: unknown }): Promise<Row[]>;
  findUnique(args: { where: { id: string } }): Promise<Row | null>;
  create(args: { data: unknown }): Promise<Row>;
  update(args: { where: { id: string }; data: unknown }): Promise<Row>;
  delete(args: { where: { id: string } }): Promise<Row>;
  count(): Promise<number>;
};

const models = {
  publications: {
    delegate: db.publication,
    orderBy: [{ year: "desc" }, { status: "asc" }, { createdAt: "asc" }],
  },
  experience: {
    delegate: db.experience,
    orderBy: [{ startYear: "desc" }, { startMonth: { sort: "desc", nulls: "last" } }],
  },
  projects: { delegate: db.project, orderBy: [{ order: "asc" }, { createdAt: "desc" }] },
  tutorials: { delegate: db.tutorial, orderBy: [{ date: "desc" }, { createdAt: "desc" }] },
  gallery: { delegate: db.galleryEvent, orderBy: [{ date: "desc" }, { createdAt: "desc" }] },
  research: { delegate: db.researchArea, orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
  awards: { delegate: db.award, orderBy: [{ year: { sort: "desc", nulls: "last" } }] },
  education: { delegate: db.education, orderBy: [{ order: "asc" }, { startYear: "desc" }] },
  skills: { delegate: db.skill, orderBy: [{ order: "asc" }, { name: "asc" }] },
} satisfies Record<ResourceKey, { delegate: unknown; orderBy: unknown }>;

function model(key: ResourceKey) {
  const m = models[key];
  return { delegate: m.delegate as unknown as Delegate, orderBy: m.orderBy };
}

export function listRecords(key: ResourceKey) {
  const { delegate, orderBy } = model(key);
  return delegate.findMany({ orderBy });
}

export function getRecord(key: ResourceKey, id: string) {
  return model(key).delegate.findUnique({ where: { id } });
}

export function createRecord(key: ResourceKey, data: unknown) {
  return model(key).delegate.create({ data });
}

export function updateRecord(key: ResourceKey, id: string, data: unknown) {
  return model(key).delegate.update({ where: { id }, data });
}

export function deleteRecord(key: ResourceKey, id: string) {
  return model(key).delegate.delete({ where: { id } });
}

export function countRecords(key: ResourceKey) {
  return model(key).delegate.count();
}
