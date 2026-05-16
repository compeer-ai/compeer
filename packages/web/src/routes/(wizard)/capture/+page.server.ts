import { errors } from '$lib/utilities/errors';
import * as v from 'valibot';

export const load = async ({ url }) => {
    const searchParams = url.searchParams;
    const textParams = v.object({
        text: v.string()
    })
    const urlParams = v.object({
        url: v.pipe(v.string(), v.url())
    })
    const searchParamsSchema = v.union([textParams, urlParams]);
    const result = await v.safeParseAsync(searchParamsSchema, Object.fromEntries(searchParams));
    if (!result.success) {
        throw errors.badRequest(url, 'Invalid search params');
    }
    return result.output;
};
