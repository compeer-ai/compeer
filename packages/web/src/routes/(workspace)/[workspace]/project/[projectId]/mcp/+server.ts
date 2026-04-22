import { readSearchCaptures } from '$lib/remotes/capture.remote';
import { readProject } from '$lib/remotes/store.remote';
import { errors } from '$lib/utilities/errors';
import type { RequestHandler } from '@sveltejs/kit';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import { HttpTransport } from '@tmcp/transport-http';
import { McpServer } from 'tmcp';
import * as v from 'valibot';

export const POST: RequestHandler = async ({ request, params, url }) => {
	if (!params.projectId || !params.workspace) {
		throw errors.badRequest(url, 'Invalid store id');
	}
	const store = await readProject({ id: params.projectId });
	const name = `read-${store.name}-captures`;
	const workspace = params.workspace;

	const server = new McpServer(
		{
			name: `${store.name}-projet-compeer-server`,
			version: '1.0.0'
		},
		{
			adapter: new ValibotJsonSchemaAdapter(),
			instructions: `Get captures within ${store.name}`,
			capabilities: {
				tools: {
					[name]: true
				}
			}
		}
	);

	server.tool(
		{
			name: name,
			description: `Read captures for ${store.name}`,
			title: `Read ${store.name} Captures`,
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
			const result = await readSearchCaptures({ store: store.name, workspace, query });
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ result })
					}
				],
				structuredContent: { result }
			};
		}
	);

	const transport = new HttpTransport(server);
	const response = await transport.respond(request);
	if (!response) {
		throw errors.notFound(url, 'Not found');
	}
	return response;
};
