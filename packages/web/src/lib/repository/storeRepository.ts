import { storeTable } from '$lib/utilities/schema';
import { type InferSelectModel } from 'drizzle-orm';
import { BaseRepoistory } from './baseRepository';
import { createSelectSchema } from 'drizzle-valibot';

export type Store = InferSelectModel<typeof storeTable>;
export const projectSchema = createSelectSchema(storeTable);

export class StoreRepository extends BaseRepoistory<typeof storeTable, string> {
	constructor() {
		super(storeTable, storeTable.id);
	}
}
