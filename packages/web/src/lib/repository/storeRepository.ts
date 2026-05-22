import { storeTable } from '$lib/utilities/schema';
import { type InferSelectModel } from 'drizzle-orm';
import { BaseRepoistory } from './baseRepository';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';

export type Store = InferSelectModel<typeof storeTable>;
export const selectStoreSchema = createSelectSchema(storeTable);
export const insertStoreSchema = createInsertSchema(storeTable);

export class StoreRepository extends BaseRepoistory<typeof storeTable, string> {
	constructor() {
		super(storeTable, storeTable.id);
	}
}
