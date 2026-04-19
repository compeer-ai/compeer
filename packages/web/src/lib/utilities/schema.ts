import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, customType, unique } from 'drizzle-orm/sqlite-core';

const embedding = customType<{
	data: number[];
	config: { dimensions: number };
	configRequired: true;
	driverData: Buffer;
}>({
	dataType(config) {
		return `F32_BLOB(${config.dimensions})`;
	},
	fromDriver(value: Buffer) {
		return Array.from(new Float32Array(value.buffer));
	},
	toDriver(value: number[]) {
		return sql`vector32(${JSON.stringify(value)})`;
	}
});

export const projectTable = sqliteTable(
	'project',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => Bun.randomUUIDv7()),
		name: text().notNull().unique(),
		description: text(),
		workspaceId: text()
			.references(() => workspaceTable.id, {
				onDelete: 'cascade'
			})
			.notNull()
	},
	(t) => [unique().on(t.name, t.workspaceId)]
);

export const workspaceTable = sqliteTable('workspace', {
	id: text()
		.primaryKey()
		.$defaultFn(() => Bun.randomUUIDv7()),
	name: text().notNull().unique()
});

export const configTable = sqliteTable('config', {
	key: text().primaryKey().notNull(),
	value: text({ mode: 'json' }).$type<unknown>().notNull().default({})
});

export const captureTable = sqliteTable('capture', {
	id: text()
		.primaryKey()
		.$defaultFn(() => Bun.randomUUIDv7()),
	created: text().default(sql`(CURRENT_DATE)`),
	content: text().notNull(),
	embedding: embedding({ dimensions: 384 }).notNull(),
	type: text().notNull(),
	url: text(),
	enabled: integer({ mode: 'boolean' }).default(true).notNull(),
	projectId: text()
		.references(() => projectTable.id, {
			onDelete: 'cascade'
		})
		.notNull()
});

export const captureChunkTable = sqliteTable('capture_chunk', {
	id: text()
		.primaryKey()
		.$defaultFn(() => Bun.randomUUIDv7()),
	captureId: text()
		.references(() => captureTable.id, {
			onDelete: 'cascade'
		})
		.notNull(),
	content: text().notNull(),
	embedding: embedding({ dimensions: 384 }).notNull()
});
