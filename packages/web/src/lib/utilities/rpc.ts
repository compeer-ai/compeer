import { type Context } from 'hono';
import type { GenericSchema, InferOutput } from 'valibot';
import { cache } from './cache';
import { validator } from 'hono-openapi';
import { createFactory } from 'hono/factory';

function cacheKey(path: string, params: unknown): string {
	return `${path}:${Bun.hash(JSON.stringify(params))}`;
}
const factory = createFactory();

export const rpc = {
	query<I extends GenericSchema, O>(
		path: string,
		schema: I,
		fn: (args: InferOutput<I>) => O | Promise<O>
	) {
		const handler = factory.createHandlers(
			async (
				ctx: Context<{}, string, { in: { param: InferOutput<I> }; out: { param: InferOutput<I> } }>
			) => {
				if (!ctx.req.url.endsWith(path)) throw new Error('Invalidate RPC name');
				if (ctx.req.method !== 'GET') throw new Error('Invalid RPC method');
				const params = ctx.req.valid('param') as InferOutput<I>;
				const key = cacheKey(path, params);
				const result = await cache.read(key, () => fn(params));
				return ctx.json({ result, key });
			}
		);

		return {
			handler,
			path,
			schema,
			fn,
			validator: validator('param', schema),
			invalidate: (params: InferOutput<I>) => cache.invalidate(cacheKey(path, params))
		};
	},

	mutation<I extends GenericSchema, O>(
		path: string,
		schema: I,
		fn: (args: InferOutput<I>) => O | Promise<O>,
		invalidate?: (args: InferOutput<I>) => string[]
	) {
		const handler = factory.createHandlers(
			async (
				ctx: Context<
					{ Variables: { invalidations: string[] } },
					string,
					{ in: { json: InferOutput<I> }; out: { json: InferOutput<I> } }
				>
			) => {
				if (!ctx.req.url.endsWith(path)) throw new Error('Invalidate RPC name');
				if (!['POST', 'DELETE', 'PUT', 'PATCH'].includes(ctx.req.method))
					throw new Error('Invalid RPC method');
				const json = ctx.req.valid('json');
				const result = await Promise.resolve(fn(json));
				const invalidations = invalidate?.(json);
				return ctx.json({ ...result, invalidations });
			}
		);

		return {
			path,
			handler,
			schema,
			fn,
			invalidate: (...keys: string[]) => cache.invalidate(...keys)
		};
	}
};
