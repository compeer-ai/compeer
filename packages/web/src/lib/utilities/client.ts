import { hc } from 'hono/client';
import type { AppType } from './api';

export const createClient = (baseUrl: string, options?: { headers?: Record<string, string> }) => {
	return hc<AppType>(baseUrl, { headers: options?.headers });
};

export type Client = ReturnType<typeof createClient>;
