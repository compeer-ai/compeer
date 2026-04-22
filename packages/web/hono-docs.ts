import { defineConfig } from '@rcmade/hono-docs';

export default defineConfig({
	tsConfigPath: './tsconfig.json',
	openApi: {
		openapi: '3.0.0',
		info: {
			title: 'Barque API',
			version: '1.0.0',
			description: 'API for managing projects, captures, and search functionality'
		},
		servers: [{ url: 'https://barque.ai/api/v1' }]
	},
	outputs: {
		openApiJson: './openapi/openapi.json'
	},
	apis: [
		{
			name: 'API Routes',
			apiPrefix: '/api/v1',
			appTypePath: 'src/lib/utilities/api.ts',
			api: [
				{
					api: '/projects',
					method: 'get',
					summary: 'List user projects',
					description: 'Returns all projects belonging to the authenticated user',
					tag: ['Projects']
				},
				{
					api: '/user',
					method: 'get',
					summary: 'Get current user',
					description: 'Returns information about the currently authenticated user',
					tag: ['User']
				},
				{
					api: '/search',
					method: 'get',
					summary: 'Search captures',
					description: 'Search for captures within a store using semantic search',
					tag: ['Search']
				},
				{
					api: '/capture',
					method: 'post',
					summary: 'Create capture',
					description: 'Create a new text, data, or URL capture in a store',
					tag: ['Captures']
				}
			]
		}
	]
});
