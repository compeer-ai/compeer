import { prerender } from '$app/server';
import * as v from 'valibot';
import artifacts from "$lib/data/artifacts.json";

export const readArtifacts = prerender(() => {
    return Object.entries(artifacts).map(([slug, data]) => ({ slug, ...data }));
});

export const readIntegration = prerender(
    v.object({
        slug: v.string()
    }),
    async (validatedPayload) => {
        if (!(validatedPayload.slug in artifacts)) {
            throw new Error("Artifact not found")
        }
        const data = artifacts[validatedPayload.slug as keyof typeof artifacts]
        return data
    },
    {
        inputs: () => Object.keys(artifacts).map((key) => ({ slug: key }))
    }
);
