import { Hono } from 'hono';
import { validator } from 'hono-openapi';
import * as v from 'valibot';
import { HttpTransport } from '@tmcp/transport-http';
import { McpServer } from 'tmcp';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import pkg from '../../../package.json';
import { errors } from './errors';
import { readSearchCaptures } from '$lib/remotes/capture.remote';

const paramsSchema = v.object({
	workspace: v.string(),
	store: v.string()
});

const router = new Hono().post('/*', validator('param', paramsSchema), async (c) => {
	const { workspace, store } = c.req.valid('param');
	const mcpServer = new McpServer(
		{
			name: store ? `${workspace}-${store}-server` : `${workspace}-server`,
			version: pkg.version
		},
		{
			adapter: new ValibotJsonSchemaAdapter(),
			instructions: `Use this server for finding context within ${workspace}${store ? `/${store}` : ''}`
		}
	);

	mcpServer.tool(
		{
			name: 'search',
			description: 'Search for context that might be useful',
			schema: v.object({
				query: v.string()
			}),
			outputSchema: v.object({
				result: v.array(
					v.object({
						content: v.string()
					})
				)
			})
		},
		async ({ query }) => {
			const result = await readSearchCaptures({ store, workspace, query });
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(result)
					}
				],
				structuredContent: {
					result
				}
			};
		}
	);

	const transport = new HttpTransport(mcpServer);
	const response = await transport.respond(c.req.raw);
	if (!response) return c.status(500);
	return response;
});
