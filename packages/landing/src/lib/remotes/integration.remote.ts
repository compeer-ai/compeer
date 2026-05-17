import { prerender } from '$app/server';
import * as v from 'valibot';
import { compile } from 'mdsvex';
import integrations from "$lib/data/integrations.json";
import type { Integration } from '$lib/models/integration';

export const readIntegrations = prerender(() => {
	return Object.entries(integrations).map(([slug, data]) => ({ slug, ...data })) as Integration[];
});

export const readIntegration = prerender(
	v.object({
		slug: v.string()
	}),
	async (validatedPayload) => {
		if (!(validatedPayload.slug in integrations)) {
			throw new Error("Integration not found")
		}
		const data = integrations[validatedPayload.slug as keyof typeof integrations] as Integration;
		const compiledContent = await compile(data.content);
		return {
			...data,
			content: compiledContent?.code,
		};
	},
	{
		inputs: () => Object.keys(integrations).map((key) => ({ slug: key }))
	}
);
