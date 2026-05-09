import { type InferSelectModel } from 'drizzle-orm';
import { BaseRepoistory } from './baseRepository';
import { workspaceTable } from '$lib/utilities/schema';
import { createSelectSchema } from 'drizzle-valibot';

export type Workspace = InferSelectModel<typeof workspaceTable>;
export const workspaceSchema = createSelectSchema(workspaceTable);

export class WorkspaceRepository extends BaseRepoistory<typeof workspaceTable, string> {
	constructor() {
		super(workspaceTable, workspaceTable.id);
	}
}
