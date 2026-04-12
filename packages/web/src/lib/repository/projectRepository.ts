import { projectTable } from '$lib/utilities/schema';
import { type InferSelectModel } from 'drizzle-orm';
import { BaseRepoistory } from './baseRepository';
import { createSelectSchema } from 'drizzle-valibot';

export type Project = InferSelectModel<typeof projectTable>;
export const projectSchema = createSelectSchema(projectTable);

export class ProjectRepository extends BaseRepoistory<typeof projectTable, string> {
	constructor() {
		super(projectTable, projectTable.id);
	}
}
