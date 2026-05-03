import { commandCreateCapture } from '$lib/remotes/capture.remote';
import { readStoreByNameAndWorkspaceId, readStores } from '$lib/remotes/store.remote';
import { Hono } from 'hono';
import * as v from 'valibot';
import { vValidator } from '@hono/valibot-validator';
import { readSearchCaptures } from '$lib/remotes/capture.remote';
import openApiSpec from '../../../openapi/openapi.json' with { type: 'json' };
import { readWorkspace, readWorkspaces } from '$lib/remotes/workspace.remote';
import Bun from 'bun';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { jwt } from './jwt';
import { oidc } from './oidc';

const paramsValidator = vValidator(
	'param',
	v.object({
		workspace: v.string()
	})
);

const Type = {
	Text: 'text',
	Data: 'data',
	Url: 'url'
} as const;

export const router = new Hono()
	.get('/alive', (c) => {
		return c.json({ alive: true });
	})
	.get('/oidc', (c) => {
		return c.json(oidc.enabled());
	})
	.get('/openapi', (c) => {
		return c.json(openApiSpec);
	})
	.use(async (c, next) => {
		if (!oidc.enabled()) return next();
		const authorization = c.req.header('Authorization');
		if (!authorization) return c.status(401);
		const bearer = authorization.replace('Bearer ', '');
		const decodedJwt = await jwt.verify(bearer);
		if (!decodedJwt) return c.status(401);
		return next();
	})
	.get('/backup', async (c) => {
		const sqliteDir = fileURLToPath(new URL('../../../', import.meta.url));
		const dbPath = join(sqliteDir, 'sqlite.db');
		const buffer = await Bun.file(dbPath).arrayBuffer();
		c.header('Content-Type', 'application/octet-stream');
		c.header('Content-Disposition', `attachment; filename="sqlite.db"`);
		return c.body(buffer);
	})
	.get('/:workspace/stores', paramsValidator, async (c) => {
		const { workspace } = c.req.valid('param');
		const { id: workspaceId } = await readWorkspace({ name: workspace });
		const result = await readStores({ workspaceId });
		return c.json(result);
	})
	.get(
		'/:workspace/search',
		paramsValidator,
		vValidator(
			'query',
			v.object({
				query: v.string(),
				store: v.optional(v.string())
			})
		),
		async (c) => {
			const args = c.req.valid('query');
			const { workspace } = c.req.valid('param');
			const result = await readSearchCaptures({ ...args, workspace });
			return c.json(result);
		}
	)
	.get('/workspaces', async (c) => {
		const workspaces = await readWorkspaces();
		return c.json(workspaces);
	})
	.post(
		'/:workspace/capture',
		paramsValidator,
		vValidator(
			'json',
			v.object({
				type: v.enum(Type),
				content: v.string(),
				store: v.string()
			})
		),
		async (c) => {
			const args = { ...c.req.valid('json'), ...c.req.valid('param') };
			const workspace = await readWorkspace({ name: args.workspace });
			const store = await readStoreByNameAndWorkspaceId({
				name: args.store,
				workspaceId: workspace.id
			});
			await commandCreateCapture({ ...args, storeId: store.id });
			return c.json({ success: true });
		}
	);

export const api = new Hono().route('/api/v1', router);

export type Router = typeof router;
export type AppType = typeof api;
