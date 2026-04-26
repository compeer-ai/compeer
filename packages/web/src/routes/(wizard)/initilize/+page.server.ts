import { errors } from '$lib/utilities/errors';
import * as v from 'valibot';

export const load = async ({ url }) => {
	const searchParams = url.searchParams;
	const searchParamsSchema = v.object({
		redirectUri: v.pipe(v.string(), v.url())
	});
	const result = await v.safeParseAsync(searchParamsSchema, Object.fromEntries(searchParams));
	if (!result.success) {
		throw errors.badRequest(url, 'Invalid search params');
	}
	return result.output;
};
