import { Hono } from 'hono';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { validator } from 'hono-openapi';
import * as v from 'valibot';
import { generateText, streamText, type ModelMessage } from 'ai';

const completionsSchema = v.object({
	provider: v.string(),
	baseURL: v.string(),
	modelId: v.string(),
	apiKey: v.string()
});

const conversationSchema = v.array(
	v.object({
		role: v.string(),
		content: v.string()
	})
);

const paramsSchema = v.object({
	workspace: v.string(),
	store: v.string()
});

const router = new Hono().post(
	'/*',
	validator('header', completionsSchema),
	validator('json', conversationSchema),
	(c) => {
		const { provider: name, baseURL, apiKey, modelId } = c.req.valid('header');
		const provider = createOpenAICompatible({ name, baseURL, apiKey });
		const model = provider(modelId);
		const messages = c.req.valid('json');
		const result = streamText({
			model,
			messages,
			prompt: `
			  Answer the prompt with the following context:
				<context>
				</context>
      `
		});
		return result.toUIMessageStreamResponse();
	}
);

export const completions = new Hono().route('/', router);
