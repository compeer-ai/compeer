import { readSearchCaptures } from '$lib/remotes/capture.remote';
import { readProject } from '$lib/remotes/project.remote';
import { errors } from '$lib/utilities/errors';
import type { RequestHandler } from '@sveltejs/kit';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import { HttpTransport } from '@tmcp/transport-http';
import { McpServer } from 'tmcp';
import * as v from 'valibot';

export const POST: RequestHandler = async ({ request, params, url }) => {
	if (!params.projectId || !params.workspace) {
		throw errors.badRequest(url, 'Invalid project id');
	}
	const project = await readProject({ id: params.projectId });
	const name = `read-${project.name}-captures`;
	const workspace = params.workspace;

	const server = new McpServer(
		{
			name: `${project.name}-server`,
			version: '1.0.0'
		},
		{
			adapter: new ValibotJsonSchemaAdapter(),
			instructions: `Get captures within ${project.name}`,
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
			description: `Read captures for ${project.name}`,
			title: `Read ${project.name} Captures`,
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
			const result = await readSearchCaptures({ project: project.name, workspace, query });
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
