import { type InferSelectModel } from 'drizzle-orm';
import { BaseRepoistory } from './baseRepository';
import { captureTable } from '$lib/utilities/schema';
import { createSelectSchema } from 'drizzle-valibot';

export type Capture = InferSelectModel<typeof captureTable>;
export const captureSchema = createSelectSchema(captureTable);

export class CaptureRepository extends BaseRepoistory<typeof captureTable, string> {
	constructor() {
		super(captureTable, captureTable.id);
	}
}
