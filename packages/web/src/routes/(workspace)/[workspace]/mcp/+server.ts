import { readSearchCaptures } from '$lib/remotes/capture.remote';
import { readStore } from '$lib/remotes/store.remote';
import { errors } from '$lib/utilities/errors';
import type { RequestHandler } from '@sveltejs/kit';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import { HttpTransport } from '@tmcp/transport-http';
import { McpServer } from 'tmcp';
import * as v from 'valibot';

export const POST: RequestHandler = async ({ request, params, url }) => {
	if (!params.workspace) {
		throw errors.badRequest(url, 'Invalid store id');
	}
	const workspace = params.workspace;
	const name = `read-${workspace}-captures`;

	const server = new McpServer(
		{
			name: `${workspace}-compeer-workspace-server`,
			version: '1.0.0'
		},
		{
			adapter: new ValibotJsonSchemaAdapter(),
			instructions: `Get captures within ${workspace}`,
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
			description: `Read captures for ${workspace}`,
			title: `Read ${workspace} Captures`,
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
			const result = await readSearchCaptures({ workspace, query });
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
