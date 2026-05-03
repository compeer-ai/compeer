import { readSearchCaptures } from '$lib/remotes/capture.remote';
import { errors } from '$lib/utilities/errors';
import { jwt } from '$lib/utilities/jwt';
import { secrets } from '$lib/utilities/secrets';
import type { RequestHandler } from '@sveltejs/kit';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import { HttpTransport } from '@tmcp/transport-http';
import { Hono } from 'hono';
import { McpServer } from 'tmcp';
import * as v from 'valibot';
import { createHash } from 'crypto';
import { vValidator } from '@hono/valibot-validator';

interface AuthCodeData {
	code_challenge: string;
	workspace: string;
	created_at: number;
}

const authCodes = new Map<string, AuthCodeData>();

// Helper to generate random codes
function generateRandomCode(): string {
	return createHash('sha256')
		.update(Math.random().toString() + Date.now())
		.digest('hex');
}

// Helper to verify PKCE
function verifyPKCE(codeVerifier: string, codeChallenge: string): boolean {
	const computed = createHash('sha256')
		.update(codeVerifier)
		.digest('base64url');
	return computed === codeChallenge;
}

function mcp() {
	const router = new Hono()
	.get('/:workspace/.welcome/oauth-protected-resource', vValidator('param', v.object({
		workspace: v.string()
	})),(c) => {
		const workspace = c.req.param('workspace');
		return c.json({
			resource: `http://localhost:5173/mcp/${workspace}`,
			authorization_servers: [secrets.read('OIDC_SERVER')],
			scopes_supported: ['mcp:tools', 'mcp:resources']
		});
	})
	.get('/:workspace/.well-known/oauth-authorization-server', vValidator('param', v.object({
		workspace: v.string()
	})), (c) => {
		const base = 'http://localhost:5173';
		const workspace = c.req.param('workspace');
		return c.json({
			issuer: secrets.read('OIDC_SERVER'),
			authorization_endpoint: `${base}/mcp/oauth/authorize`,
			token_endpoint: `${base}/mcp/${workspace}oauth/token`,
			response_types_supported: ['code'],
			grant_types_supported: ['authorization_code'],
			code_challenge_methods_supported: ['S256'],
			token_endpoint_auth_methods_supported: ['none']
		});
	})
	.get('/:workspace/oauth/authorize', vValidator('param', v.object({
		workspace: v.string()
	})), async (c) => {
		const { workspace } = c.req.valid('param')
		try {
			const {
				client_id,
				redirect_uri,
				response_type,
				code_challenge,
				code_challenge_method,
				state
			} = c.req.query();

			// Validate required parameters
			if (!code_challenge || code_challenge_method !== 'S256') {
				return c.json(
					{
						error: 'invalid_request',
						error_description: 'PKCE with S256 is required'
					},
					400
				);
			}

			if (response_type !== 'code') {
				return c.json(
					{
						error: 'unsupported_response_type',
						error_description: 'Only response_type=code is supported'
					},
					400
				);
			}

			const authCode = generateRandomCode();
			authCodes.set(authCode, {
				code_challenge,
				workspace,
				created_at: Date.now()
			});

			const redirectUrl = new URL(redirect_uri);
			redirectUrl.searchParams.append('code', authCode);
			if (state) {
				redirectUrl.searchParams.append('state', state);
			}

			return c.redirect(redirectUrl.toString(), 302);
		} catch (err) {
			console.error('OAuth authorize error:', err);
			return c.json(
				{
					error: 'server_error',
					error_description: 'An error occurred during authorization'
				},
				500
			);
		}
	})
	.post('/:workspace/oauth/token', vValidator('param', v.object({
		workspace: v.string()
	})), async (c) => {
		try {
			const body = await c.req.json();
			const { code, code_verifier, grant_type } = body;

			if (grant_type !== 'authorization_code') {
				return c.json(
					{
						error: 'unsupported_grant_type',
						error_description: 'Only authorization_code grant type is supported'
					},
					400
				);
			}

			if (!code || !code_verifier) {
				return c.json(
					{
						error: 'invalid_request',
						error_description: 'Missing required parameters: code and code_verifier'
					},
					400
				);
			}

			const authCodeData = authCodes.get(code);
			if (!authCodeData) {
				return c.json(
					{
						error: 'invalid_grant',
						error_description: 'Authorization code not found or expired'
					},
					400
				);
			}

			if (Date.now() - authCodeData.created_at > 10 * 60 * 1000) {
				authCodes.delete(code);
				return c.json(
					{
						error: 'invalid_grant',
						error_description: 'Authorization code expired'
					},
					400
				);
			}

			if (!verifyPKCE(code_verifier, authCodeData.code_challenge)) {
				return c.json(
					{
						error: 'invalid_grant',
						error_description: 'Invalid code_verifier'
					},
					400
				);
			}

			authCodes.delete(code);

			const accessToken = await jwt.encode({
				workspace: authCodeData.workspace,
				scope: 'mcp:tools mcp:resources'
			});

			return c.json({
				access_token: accessToken,
				token_type: 'Bearer',
				expires_in: 3600
			});
		} catch (err) {
			console.error('OAuth token error:', err);
			return c.json(
				{
					error: 'server_error',
					error_description: 'An error occurred while processing the token request'
				},
				500
			);
		}
	})
	.post('/:workspace/mcp/', vValidator(
		'param',
		v.object({
			workspace: v.string()
		})
	),
	async (c) => {
		const params = c.req.valid('param');
		const url = new URL(c.req.url);
		const request = c.req.raw;
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
	})
	return router;
}

const api = mcp();

export const POST: RequestHandler = ({ request }) => api.fetch(request);