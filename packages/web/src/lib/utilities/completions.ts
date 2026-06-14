import { Hono } from 'hono';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { validator } from 'hono-openapi';
import * as v from 'valibot';

const completionsSchema = v.object({
	provider: v.string(),
	baseURL: v.string(),
	apiKey: v.string()
});

const router = new Hono().post('/*', validator('header', completionsSchema), (c) => {
	const { provider: name, baseURL, apiKey } = c.req.valid('header');
	const provider = createOpenAICompatible({ name, baseURL, apiKey });
	return c.text('Not Yet Implemented');
});

export const completions = new Hono().route('/', router);
