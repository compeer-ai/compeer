import { commandCreateCapture } from '$lib/remotes/capture.remote';
import { readProjects } from '$lib/remotes/project.remote';
import { Hono } from 'hono';
import * as v from 'valibot';
import { vValidator } from '@hono/valibot-validator';
import { readSearchCaptures } from '$lib/remotes/capture.remote';
import openApiSpec from '../../../openapi/openapi.json' with { type: 'json' };
import { readWorkspace, readWorkspaces } from '$lib/remotes/workspace.remote';

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
	.get('/openapi', (c) => {
		return c.json(openApiSpec);
	})
	.get('/:workspace/projects', paramsValidator, async (c) => {
		const { workspace } = c.req.valid('param');
		const { id: workspaceId } = await readWorkspace({ name: workspace });
		const result = await readProjects({ workspaceId });
		return c.json(result);
	})
	.get(
		'/:workspace/search',
		paramsValidator,
		vValidator(
			'query',
			v.object({
				query: v.string(),
				project: v.optional(v.string())
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
		'/capture',
		vValidator(
			'json',
			v.object({
				type: v.enum(Type),
				content: v.string(),
				projectId: v.string()
			})
		),
		async (c) => {
			const args = c.req.valid('json');
			await commandCreateCapture(args);
			return c.json({ success: true });
		}
	);

export const api = new Hono().route('/api/v1', router);

export type Router = typeof router;
export type AppType = typeof api;
