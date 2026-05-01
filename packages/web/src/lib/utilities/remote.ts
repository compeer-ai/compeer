import { command, form, getRequestEvent, query } from '$app/server';
import { cache } from './cache';
import { type RemoteCommand, type RemoteForm, type RemoteQueryFunction } from '@sveltejs/kit';
import { loggers } from './loggers';
import { version } from '../../../package.json';
import * as v from 'valibot';
import { errors } from './errors';
import { config } from './config';
import { readUser } from '$lib/remotes/user.remote';

export function enhancedQuery<T>(key: string, flag: keyof typeof config.flags | null, fn: () => T) {
	const _query = query(async () => {
		const { url } = getRequestEvent();
		const user = await readUser();
		if (flag && !config.readFlag(flag)) {
			throw errors.badRequest(url, 'Remote function not enabled');
		}
		if (user && flag && !config.readUserScopedFlag(user.email, flag)) {
			throw errors.badRequest(url, 'Remote function not enabled');
		}
		const cacheKey = `${version}:${key}`;
		const hashedCacheKey = Bun.hash(cacheKey).toString();
		const result = await cache.read(hashedCacheKey, () => fn());
		return result;
	});

	function refresh() {
		const cacheKey = `${version}:${key}`;
		const hashedCacheKey = Bun.hash(cacheKey).toString();
		cache.invalidate(hashedCacheKey);
	}

	return {
		query: _query,
		refresh
	};
}

export function enhancedValidatedQuery<S extends v.ObjectSchema<any, any>, T>(
	key: string,
	flag: keyof typeof config.flags | null,
	schema: S,
	fn: (args: { validatedPayload: v.InferOutput<S> }) => T
): {
	query: RemoteQueryFunction<v.InferOutput<S>, T>;
	refresh: (validatedPayload: v.InferOutput<S>) => Promise<void>;
	refreshAll: () => void;
} {
	const _query = query(schema, async (validatedPayload: v.InferOutput<S>) => {
		const { url } = getRequestEvent();
		const user = await readUser();
		if (flag && !config.readFlag(flag)) {
			throw errors.badRequest(url, 'Remote function not enabled');
		}
		if (user && flag && !config.readUserScopedFlag(user.email, flag)) {
			throw errors.badRequest(url, 'Remote function not enabled');
		}
		const computedCacheKey = `${version}:${key}:${Object.entries(validatedPayload)
			.map(([key, value]) => `(${key}=${value})`)
			.join('')}`;
		const hashedComputedCacheKey = Bun.hash(computedCacheKey).toString();
		const result = await cache.read(`${version}:${key}`, () =>
			cache.read(hashedComputedCacheKey, () => fn({ validatedPayload }))
		);
		return result;
	});

	async function refresh(validatedPayload: v.InferOutput<S>) {
		const parsed = await v.parseAsync(schema, validatedPayload);
		const computedCacheKey = `${version}:${key}:${Object.entries(parsed)
			.map(([key, value]) => `(${key}=${value})`)
			.join('')}`;
		const hashedComputedCacheKey = Bun.hash(computedCacheKey).toString();
		loggers.data.info(`Invalidating ${hashedComputedCacheKey} ${key}`);
		cache.invalidate(hashedComputedCacheKey);
	}

	function refreshAll() {
		loggers.data.info(`Invalidating ${key}`);
		cache.invalidate(`${version}:${key}`);
	}

	return {
		query: _query,
		refresh,
		refreshAll
	};
}

export function enhancedValidatedMutation<S extends v.ObjectSchema<any, any>, T>(
	schema: S,
	flag: keyof typeof config.flags | null,
	fn: (args: { validatedPayload: v.InferOutput<S> }) => T
): {
	command: RemoteCommand<v.InferOutput<S>, T>;
	form: RemoteForm<v.InferOutput<S>, T>;
} {
	const _form = form(schema, async (validatedPayload: v.InferOutput<S>) => {
		const { url } = getRequestEvent();
		const user = await readUser();
		if (flag && !config.readFlag(flag)) {
			throw errors.badRequest(url, 'Remote function not enabled');
		}
		if (user && flag && !config.readUserScopedFlag(user.email, flag)) {
			throw errors.badRequest(url, 'Remote function not enabled');
		}
		const result = await Promise.resolve(
			fn({
				validatedPayload: validatedPayload
			})
		);
		return result;
	});

	const _command = command(schema, async (validatedPayload: v.InferOutput<S>) => {
		const { url } = getRequestEvent();
		if (flag && !config[flag as keyof typeof config]) {
			throw errors.badRequest(url, 'Remote function not enabled');
		}
		const result = fn({
			validatedPayload: validatedPayload
		});

		return result;
	});

	return {
		command: _command,
		form: _form
	};
}

export function enhancedMutation<T>(flag: keyof typeof config.flags | null, fn: () => T) {
	const _form = form('unchecked', async () => {
		const { url } = getRequestEvent();
		const user = await readUser();
		if (flag && !config.readFlag(flag)) {
			throw errors.badRequest(url, 'Remote function not enabled');
		}
		if (user && flag && !config.readUserScopedFlag(user.email, flag)) {
			throw errors.badRequest(url, 'Remote function not enabled');
		}
		const result = fn();
		return result;
	});

	const _command = command('unchecked', async () => {
		const { url } = getRequestEvent();
		if (flag && !config[flag as keyof typeof config]) {
			throw errors.badRequest(url, 'Remote function not enabled');
		}
		const result = fn();
		return result;
	});

	return {
		form: _form,
		command: _command
	};
}
