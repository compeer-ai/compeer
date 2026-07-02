import { Hono } from 'hono';
import { WorkspaceRepository, workspaceSchema } from '$lib/repository/workspaceRepository';
import { captureTable, workspaceTable, storeTable } from '$lib/utilities/schema';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { StoreRepository, selectStoreSchema } from '$lib/repository/storeRepository';
import { CaptureRepository, captureSchema } from '$lib/repository/captureRepository';

const workspaceRepository = new WorkspaceRepository();
const storeRepository = new StoreRepository();
const captureRepository = new CaptureRepository();

export const workspaceRouter = new Hono()
	.get('read_workspace', async (ctx) => {
		const { name } = v.parse(v.object({ name: v.string() }), ctx.req.query());
		const result = await workspaceRepository.readByPredicate(eq(workspaceTable.name, name));
		const workspace = result.first();
		if (!workspace) {
			const createdWorkspace = await workspaceRepository.create({ name });
			return ctx.json(createdWorkspace.first());
		}
		return ctx.json(workspace);
	})
	.get('read_workspaces', async (ctx) => {
		const { limit, offset } = v.parse(
			v.object({ limit: v.optional(v.number()), offset: v.optional(v.number()) }),
			ctx.req.query()
		);
		const workspaces = await workspaceRepository.readAll(limit, offset);
		return ctx.json(workspaces);
	})
	.post('create_workspace', async (ctx) => {
		const { name } = v.parse(
			v.object({
				name: v.pipe(
					v.string(),
					v.transform((input) => input.toLocaleLowerCase().replaceAll(' ', '-'))
				)
			}),
			await ctx.req.json()
		);
		const result = await workspaceRepository.create({ name });
		return ctx.json(result.first());
	})
	.put('update_workspace', async (ctx) => {
		const { id, name } = v.parse(
			v.object({ id: v.string(), name: v.string() }),
			await ctx.req.json()
		);
		const result = await workspaceRepository.update(id, { name });
		return ctx.json(result.first());
	})
	.delete('delete_workspace', async (ctx) => {
		const { id } = v.parse(v.object({ id: v.string() }), await ctx.req.json());
		await workspaceRepository.deleteById(id);
		return ctx.body(null, 204);
	})
	.post('export_workspace', async (ctx) => {
		const { name } = v.parse(v.object({ name: v.string() }), await ctx.req.json());
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
	.post('import_workspace', async (ctx) => {
		const { workspace: workspaceData, stores } = v.parse(
			v.object({
				workspace: workspaceSchema,
				stores: v.array(
					v.object({
						store: selectStoreSchema,
						captures: v.array(captureSchema)
					})
				)
			}),
			await ctx.req.json()
		);
		await workspaceRepository.create({ name: workspaceData.name });
		for (const { store, captures } of stores) {
			await storeRepository.create(store);
			if (captures.length) {
				await captureRepository.createMany(captures);
			}
		}
		return ctx.json({ success: true });
	});
