import { Hono } from 'hono';
import { WorkspaceRepository, workspaceSchema } from '$lib/repository/workspaceRepository';
import { captureTable, workspaceTable, storeTable } from '$lib/utilities/schema';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { StoreRepository, selectStoreSchema } from '$lib/repository/storeRepository';
import { CaptureRepository, captureSchema } from '$lib/repository/captureRepository';
import { validator } from 'hono-openapi';

const workspaceRepository = new WorkspaceRepository();
const storeRepository = new StoreRepository();
const captureRepository = new CaptureRepository();

export const readWorkspaceParamsSchema = v.object({ name: v.string() });
export const readWorkspacesParamsSchema = v.object({
	limit: v.optional(v.number()),
	offset: v.optional(v.number())
});
export const createWorkspaceSchema = v.object({
	name: v.pipe(
		v.string(),
		v.transform((input) => input.toLocaleLowerCase().replaceAll(' ', '-'))
	)
});
export const updateWorkspaceSchema = v.object({ id: v.string(), name: v.string() });
export const deleteWorkspaceSchema = v.object({ id: v.string() });
export const exportWorkspaceSchema = v.object({ name: v.string() });
export const importWorkspaceSchema = v.object({
	workspace: workspaceSchema,
	stores: v.array(
		v.object({
			store: selectStoreSchema,
			captures: v.array(captureSchema)
		})
	)
});

export const workspaceRouter = new Hono()
	.get('read_workspace', validator('param', readWorkspaceParamsSchema), async (ctx) => {
		const { name } = ctx.req.valid('param');
		const result = await workspaceRepository.readByPredicate(eq(workspaceTable.name, name));
		const workspace = result.first();
		if (!workspace) {
			const createdWorkspace = await workspaceRepository.create({ name });
			return ctx.json(createdWorkspace.first());
		}
		return ctx.json(workspace);
	})
	.get(
		'read_workspaces',
		validator('param', readWorkspacesParamsSchema),
		async (ctx) => {
			const { limit, offset } = ctx.req.valid('param');
			const workspaces = await workspaceRepository.readAll(limit, offset);
			return ctx.json(workspaces);
		}
	)
	.post('create_workspace', validator('json', createWorkspaceSchema), async (ctx) => {
		const { name } = ctx.req.valid('json');
		const result = await workspaceRepository.create({ name });
		return ctx.json(result.first());
	})
	.put(
		'update_workspace',
		validator('json', updateWorkspaceSchema),
		async (ctx) => {
			const { id, name } = ctx.req.valid('json');
			const result = await workspaceRepository.update(id, { name });
			return ctx.json(result.first());
		}
	)
	.delete('delete_workspace', validator('json', deleteWorkspaceSchema), async (ctx) => {
		const { id } = ctx.req.valid('json');
		await workspaceRepository.deleteById(id);
		return ctx.body(null, 204);
	})
	.post('export_workspace', validator('json', exportWorkspaceSchema), async (ctx) => {
		const { name } = ctx.req.valid('json');
		const workspaceResult = await workspaceRepository.readByPredicate(
			eq(workspaceTable.name, name)
		);
		const workspace = workspaceResult.first();
		if (!workspace) return ctx.json({ error: 'Workspace not found' }, 404);

		const storeResult = await storeRepository.readByPredicate(
			eq(storeTable.workspaceId, workspace.id)
		);
		const stores = storeResult.all();

		const storeExports = await Promise.all(
			stores.map(async (store) => {
				const captureResult = await captureRepository.readByPredicate(
					eq(captureTable.storeId, store.id)
				);
				return { store, captures: captureResult.all() };
			})
		);

		return ctx.json({ workspace, stores: storeExports });
	})
	.post('import_workspace', validator('json', importWorkspaceSchema), async (ctx) => {
		const { workspace: workspaceData, stores } = ctx.req.valid('json');
		await workspaceRepository.create({ name: workspaceData.name });
		for (const { store, captures } of stores) {
			await storeRepository.create(store);
			if (captures.length) {
				await captureRepository.createMany(captures);
			}
		}
		return ctx.json({ success: true });
	});
