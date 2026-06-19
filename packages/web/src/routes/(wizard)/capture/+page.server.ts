import { errors } from '$lib/utilities/errors';
import * as v from 'valibot';

function fromBase64url(s: string) {
	const base64 = s.replace(/-/g, '+').replace(/_/g, '/');
	const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
	return new TextDecoder().decode(new Uint8Array(Array.from(atob(padded), (c) => c.charCodeAt(0))));
}

export const load = async ({ url }) => {
	const searchParams = url.searchParams;
	const textParams = v.object({
		text: v.pipe(v.string(), v.transform(fromBase64url))
	});
	const urlParams = v.object({
		url: v.pipe(v.string(), v.transform(fromBase64url), v.url())
	});
	const searchParamsSchema = v.union([textParams, urlParams]);
	const result = await v.safeParseAsync(searchParamsSchema, Object.fromEntries(searchParams));
	if (!result.success) {
		throw errors.badRequest(url, 'Invalid search params');
	}
	return result.output;
};
