import { type InferSelectModel } from 'drizzle-orm';
import { BaseRepoistory } from './baseRepository';
import { workspaceTable } from '$lib/utilities/schema';

export type Workspace = InferSelectModel<typeof workspaceTable>;

export class WorkspaceRepository extends BaseRepoistory<typeof workspaceTable, string> {
	constructor() {
		super(workspaceTable, workspaceTable.id);
	}
}
