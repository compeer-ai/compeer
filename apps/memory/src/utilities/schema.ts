import { defineRelations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const memoryTable = sqliteTable("memory", {
  id: text()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  text: text().notNull(),
});

export const schema = defineRelations({ memoryTable }, () => ({}));
