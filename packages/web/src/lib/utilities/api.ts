import { commandCreateCapture } from '$lib/remotes/capture.remote';
import { readStoreByNameAndWorkspaceId, readStores } from '$lib/remotes/store.remote';
import { Hono } from 'hono';
import * as v from 'valibot';
import { readSearchCaptures } from '$lib/remotes/capture.remote';
import { readWorkspace, readWorkspaces } from '$lib/remotes/workspace.remote';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jwt } from './jwt';
import { oidc } from './oidc';
import defaultConfiguration from '../assets/defaultConfig.json';
import configuration from '../assets/config.json';
import { describeRoute, openAPIRouteHandler, resolver, validator } from 'hono-openapi';
import { selectStoreSchema } from '$lib/repository/storeRepository';
import { workspaceSchema } from '$lib/repository/workspaceRepository';

export const API_KEYS = configuration.apiKeys || defaultConfiguration.apiKeys || [];

const paramsSchema = v.object({
	workspace: v.string()
});

const Type = {
	Text: 'text',
	Data: 'data',
	Url: 'url'
} as const;

export const router = new Hono()
	.get('/alive', describeRoute({
			description: "Get a workspace's stores",
			responses: {
				200: {
					description: 'Successful response',
					content: {
						'application/json': { schema: resolver(v.object( { alive: v.boolean() })) }
					}
				}
			}
		}),(c) => {
		return c.json({ alive: true });
	})
	.get('/oidc', describeRoute({
			description: "Get a workspace's stores",
			responses: {
				200: {
					description: 'Successful response',
					content: {
						'application/json': { schema: resolver(v.boolean()) }
					}
				}
			}
		}), (c) => {
		return c.json(oidc.enabled());
	})
	.use(async (c, next) => {
		if (!oidc.enabled()) return next();
		const apiKey = c.req.header('X-Api-Key');
		if (apiKey) {
			return API_KEYS.includes(apiKey) ? next() : c.status(401);
		}
		const authorization = c.req.header('Authorization');
		if (!authorization) return c.status(401);
		const bearer = authorization.replace('Bearer ', '');
		const decodedJwt = await jwt.verify(bearer);
		if (!decodedJwt) return c.status(401);

		return next();
	})
	.get('/backup', describeRoute({
			description: "Get a workspace's stores",
			responses: {
				200: {
					description: 'Successful response'
				}
			}
		}),async (c) => {
		const sqliteDir = fileURLToPath(new URL('../../../', import.meta.url));
		const dbPath = join(sqliteDir, 'sqlite.db');
		const buffer = await Bun.file(dbPath).arrayBuffer();
		c.header('Content-Type', 'application/octet-stream');
		c.header('Content-Disposition', `attachment; filename="sqlite.db"`);
		return c.body(buffer);
	})
	.get(
		'/:workspace/stores',
		describeRoute({
			description: "Get a workspace's stores",
			responses: {
				200: {
					description: 'Successful response',
					content: {
						'application/json': { schema: resolver(v.array(selectStoreSchema)) }
					}
				}
			}
		}),
		validator('param', paramsSchema),
		async (c) => {
			const { workspace } = c.req.valid('param');
			const { id: workspaceId } = await readWorkspace({ name: workspace });
			const result = await readStores({ workspaceId, limit: undefined, offset: undefined });
			return c.json(result);
		}
	)
	.get(
		'/:workspace/search',
		describeRoute({
			description: "Get a workspace's stores",
			responses: {
				200: {
					description: 'Successful response',
					content: {
						'application/json': {
							schema: resolver(
								v.object({
									captureId: v.string(),
									content: v.string()
								})
							)
						}
					}
				}
			}
		}),
		validator('param', paramsSchema),
		validator(
			'query',
			v.object({
				store: v.optional(v.string()),
				query: v.string()
			})
		),
		async (c) => {
			const args = c.req.valid('query');
			const { workspace } = c.req.valid('param');
			const result = await readSearchCaptures({ ...args, workspace });
			return c.json(result);
		}
	)
	.get(
		'/workspaces',
		describeRoute({
			description: 'Get all workspaces',
			responses: {
				200: {
					description: 'Successful response',
					content: {
						'application/json': {
							schema: resolver(v.array(workspaceSchema))
						}
					}
				}
			}
		}),
		async (c) => {
			const workspaces = await readWorkspaces({ limit: undefined, offset: undefined });
			return c.json(workspaces);
		}
	)
	.post(
		'/:workspace/capture',
		describeRoute({
			description: 'Create a capture',
			responses: {
				200: {
					description: 'Successful response',
					content: {
						'application/json': {
							schema: resolver(
								v.object({
									success: v.literal(true)
								})
							)
						}
					}
				}
			}
		}),
		validator('param', paramsSchema),
		validator(
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

router.get(
	'/openapi',
	openAPIRouteHandler(router, {
		documentation: {
			info: {
				title: 'Compeer API',
				version: '1.0.0',
				description: 'Compeer API'
			},
			servers: [{ url: 'http://localhost:3000', description: 'Compeer' }]
		}
	})
);
export const api = new Hono().route('/api/v1', router);

export type Router = typeof router;
export type AppType = typeof api;
