import { Hono } from 'hono';
import { validator } from 'hono-openapi';
import * as v from 'valibot';
import { HttpTransport } from '@tmcp/transport-http';
import { McpServer } from 'tmcp';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import pkg from '../../../package.json';
import { readSearchCaptures } from '$lib/remotes/capture.remote';
import defaultConfiguration from '../assets/defaultConfig.json';
import configuration from '../assets/config.json';

export const API_KEYS = configuration.apiKeys || defaultConfiguration.apiKeys;

const paramsSchema = v.object({
	workspace: v.string(),
	store: v.string()
});

export const router = new Hono()
	.use(async (c, next) => {
		if (!API_KEYS.length) return next();
		const apiKey = c.req.header('X-Api-Key');
		if (apiKey && API_KEYS.includes(apiKey)) {
			return next();
		}
		return c.status(401);
	})
	.post('/*', validator('param', paramsSchema), async (c) => {
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
