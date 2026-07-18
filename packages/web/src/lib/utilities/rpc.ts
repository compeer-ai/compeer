import { type Context } from 'hono';
import type { GenericSchema, InferOutput } from 'valibot';
import { cache } from './cache';
import { validator } from 'hono-openapi';

function cacheKey(path: string, params: unknown): string {
	return `${path}:${Bun.hash(JSON.stringify(params))}`;
}

export const rpc = {
	query<I extends GenericSchema, O>(
		path: string,
		schema: I,
		fn: (args: InferOutput<I>) => O | Promise<O>
	) {
		const handler = async (
			ctx: Context<{}, string, { in: { param: InferOutput<I> }; out: { param: InferOutput<I> } }>
		) => {
			if (ctx.req.path !== path) throw new Error('Path mismatch');
			const params = ctx.req.valid('param') as InferOutput<I>;
			const key = cacheKey(path, params);
			const result = await cache.read(key, () => fn(params));
			return ctx.json({ result, key });
		};

		return {
			handler,
			path,
			schema,
			validator: validator('param', schema),
			invalidate: (params: InferOutput<I>) => cache.invalidate(cacheKey(path, params))
		};
	},

	mutation<I extends GenericSchema, O>(
		path: string,
		schema: I,
		fn: (args: InferOutput<I>) => O | Promise<O>
	) {
		const handler = async (
			ctx: Context<
				{ Variables: { invalidations: string[] } },
				string,
				{ in: { json: InferOutput<I> }; out: { json: InferOutput<I> } }
			>
		) => {
			const json = ctx.req.valid('json');
			const invalidations = ctx.get('invalidations');
			cache.invalidate(...invalidations);
			const result = await Promise.resolve(fn(json));
			return ctx.json({ ...result, invalidations });
		};

		return {
			handler,
			invalidate: (...keys: string[]) => cache.invalidate(...keys)
		};
	}
};
