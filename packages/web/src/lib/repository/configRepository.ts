import { configTable } from '$lib/utilities/schema';
import { type InferSelectModel } from 'drizzle-orm';
import { BaseRepoistory } from './baseRepository';

export type Config = InferSelectModel<typeof configTable>;

export class ConfigRepository extends BaseRepoistory<typeof configTable, string> {
	constructor() {
		super(configTable, configTable.key);
	}
}
