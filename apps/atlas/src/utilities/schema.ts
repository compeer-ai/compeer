import { defineRelations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/valibot";
import * as v from "valibot";

export const indexTable = sqliteTable("memory", {
  id: text()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  name: text().unique(),
  artifact: text(),
});

export const insertIndexTable = createInsertSchema(indexTable);
export type InsertedIndex = v.InferOutput<typeof insertIndexTable>;
export const selectIndexTable = createSelectSchema(indexTable);
export type Index = v.InferOutput<typeof selectIndexTable>;
export const updatedIndexTable = createUpdateSchema(indexTable);
export type UpdatedIndex = Partial<Index>;

export const schema = defineRelations({ indexTable }, () => ({}));
