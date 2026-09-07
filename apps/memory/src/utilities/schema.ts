import { defineRelations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/valibot";
import * as v from "valibot";

export const memoryTable = sqliteTable("memory", {
  id: text()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  text: text(),
  data: text({ mode: "json" }).$type<unknown>(),
});

export const insertMemorySchema = createInsertSchema(memoryTable);
export type InsertedMemory = v.InferOutput<typeof insertMemorySchema>;
export const selectMemorySchema = createSelectSchema(memoryTable);
export type Memory = v.InferOutput<typeof selectMemorySchema>;
export const updateMemorySchema = createUpdateSchema(memoryTable);
export type UpdatedMemory = Partial<Memory>;

export const schema = defineRelations({ memoryTable }, () => ({}));