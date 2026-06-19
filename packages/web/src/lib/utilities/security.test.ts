import { describe, it, expect, vi } from 'vitest';

describe('Security', () => {
	it('should filter out the placeholder API key', async () => {
		const { apiKeys } = await import('./config');
		expect(apiKeys).not.toContain('$API_KEY');
	});

	it('should load API keys from COMPEER_API_KEYS environment variable', async () => {
		vi.stubEnv('COMPEER_API_KEYS', 'test-key-1,test-key-2');
		vi.resetModules();
		const { apiKeys } = await import('./config');
		expect(apiKeys).toContain('test-key-1');
		expect(apiKeys).toContain('test-key-2');
		vi.unstubAllEnvs();
	});

	it('should block requests when OIDC is disabled and API keys are configured', async () => {
		vi.stubEnv('COMPEER_API_KEYS', 'secret-api-key');
		vi.resetModules();

		const { oidc } = await import('./oidc');
		vi.spyOn(oidc, 'enabled').mockReturnValue(false);

		const { api } = await import('./api');

		// Request without API key
		const res = await api.request('http://localhost/api/v1/workspaces');
		expect(res.status).toBe(401);

		// Request with wrong API key
		const res2 = await api.request('http://localhost/api/v1/workspaces', {
			headers: { 'X-Api-Key': 'wrong-key' }
		});
		expect(res2.status).toBe(401);

		// Request with correct API key
		const res3 = await api.request('http://localhost/api/v1/workspaces', {
			headers: { 'X-Api-Key': 'secret-api-key' }
		});
		// Note: may return 200 or 500 depending on DB state, but not 401
		expect(res3.status).not.toBe(401);

		vi.unstubAllEnvs();
	});

	it('should allow requests when OIDC is disabled and NO API keys are configured', async () => {
		vi.stubEnv('COMPEER_API_KEYS', '');
		vi.resetModules();

		const { oidc } = await import('./oidc');
		vi.spyOn(oidc, 'enabled').mockReturnValue(false);

		const { api } = await import('./api');

		const res = await api.request('http://localhost/api/v1/alive');
		expect(res.status).toBe(200);

		vi.unstubAllEnvs();
	});
});
