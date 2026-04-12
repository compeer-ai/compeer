import { commandCreateCapture } from '$lib/remotes/capture.remote';
import { readProjects } from '$lib/remotes/project.remote';
import { Hono } from 'hono';
import z from 'zod';
import { zValidator } from '@hono/zod-validator';
import { readSearchCaptures } from '$lib/remotes/capture.remote';
import openApiSpec from '../../../openapi/openapi.json' with { type: 'json' };
import { backup } from '$lib/utilities/backup';
import { readWorkspace, readWorkspaces } from '$lib/remotes/workspace.remote';

const paramsValidator = zValidator(
	'param',
	z.object({
		workspace: z.string()
	})
);

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
		zValidator(
			'query',
			z.object({
				query: z.string(),
				project: z.string().optional()
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
		zValidator(
			'json',
			z.object({
				type: z.enum(['text', 'data', 'url']),
				content: z.string(),
				projectId: z.string()
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
