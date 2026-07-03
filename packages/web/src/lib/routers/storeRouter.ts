import { Hono } from 'hono';
import {
	StoreRepository,
	selectStoreSchema,
	insertStoreSchema
} from '$lib/repository/storeRepository';
import { CaptureRepository, captureSchema } from '$lib/repository/captureRepository';
import { captureTable, storeTable } from '$lib/utilities/schema';
import { and, eq } from 'drizzle-orm';
import * as v from 'valibot';
import { validator } from 'hono-openapi';

const storeRepository = new StoreRepository();
const captureRepository = new CaptureRepository();

export const storeRouter = new Hono()
	.get(
		'read_store',
		validator(
			'param',
			v.object({
				id: v.string()
			})
		),
		async (ctx) => {
			const { id } = ctx.req.valid('param');
			const result = await storeRepository.readByPredicate(eq(storeTable.id, id));
			const store = result.first();
			if (!store) {
				return ctx.json({ error: 'Store not found' }, 404);
			}
			return ctx.json(store);
		}
	)
	.get(
		'read_stores',
		validator(
			'param',
			v.object({
				workspaceId: v.string(),
				limit: v.optional(v.number()),
				offset: v.optional(v.number())
			})
		),
		async (ctx) => {
			const { workspaceId, limit, offset } = ctx.req.valid('param');
			const result = await storeRepository.readByPredicate(
				eq(storeTable.workspaceId, workspaceId),
				offset,
				limit
			);
			return ctx.json(result.all());
		}
	)
	.get(
		'read_store_by_name_and_workspace_id',
		validator('param', v.object({ name: v.string(), workspaceId: v.string() })),
		async (ctx) => {
			const { name, workspaceId } = ctx.req.valid('param');
			const result = await storeRepository.readByPredicate(
				and(eq(storeTable.name, name), eq(storeTable.workspaceId, workspaceId))!!
			);
			const store = result.first();
			if (!store) {
				return ctx.json({ error: 'Store not found' }, 404);
			}
			return ctx.json(store);
		}
	)
	.delete('delete_store', validator('json', v.object({ id: v.string() })), async (ctx) => {
		const { id } = ctx.req.valid('json');
		await storeRepository.deleteByPredicate(eq(storeTable.id, id));
		return ctx.body(null, 204);
	})
	.put(
		'update_store',
		validator(
			'json',
			v.object({
				name: v.string(),
				id: v.string(),
				description: v.string()
			})
		),
		async (ctx) => {
			const payload = ctx.req.valid('json');
			const result = await storeRepository.update(payload.id, payload);
			return ctx.json(result.first());
		}
	)
	.post(
		'create_store',
		validator(
			'json',
			v.object({
				...insertStoreSchema.entries,
				name: v.pipe(
					v.string(),
					v.transform((input) => input.toLowerCase().replaceAll(' ', '-'))
				)
			})
		),
		async (ctx) => {
			const payload = ctx.req.valid('json');
			const result = await storeRepository.create(payload);
			return ctx.json(result.first());
		}
	)
	.post(
		'create_stores_with_captures',
		validator(
			'json',
			v.object({
				stores: v.array(
					v.object({
						store: selectStoreSchema,
						captures: v.array(captureSchema)
					})
				)
			})
		),
		async (ctx) => {
			const payload = ctx.req.valid('json');
			const stores = payload.stores.map(({ store }) => store);
			const captures = payload.stores.flatMap(({ captures }) => captures);
			await storeRepository.createMany(stores);
			await captureRepository.createMany(captures);
			return ctx.json({ success: true });
		}
	)
	.post('export_store', validator('json', v.object({ id: v.string() })), async (ctx) => {
		const { id } = ctx.req.valid('json');
		const storeResult = await storeRepository.readByPredicate(eq(storeTable.id, id));
		const store = storeResult.first();
		if (!store) {
			return ctx.json({ error: 'Store not found' }, 404);
		}
		const capturesResult = await captureRepository.readByPredicate(eq(captureTable.storeId, id));
		return ctx.json({ store, captures: capturesResult.all() });
	})
	.post(
		'import_store',
		validator(
			'json',
			v.object({
				store: selectStoreSchema,
				captures: v.optional(v.array(captureSchema)),
				workspaceId: v.string()
			})
		),
		async (ctx) => {
			const raw = ctx.req.valid('json');
			const store = { ...raw.store, workspaceId: raw.workspaceId };
			const result = await storeRepository.create(store);
			if (raw.captures?.length) {
				await captureRepository.createMany(raw.captures);
			}
			return ctx.json({ success: true });
		}
	);
