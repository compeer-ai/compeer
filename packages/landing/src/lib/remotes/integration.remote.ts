import { prerender } from '$app/server';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import * as v from 'valibot';
import { compile } from 'mdsvex';

const ROOT = process.cwd();

async function _readIntegrations() {
	const targetDir = path.join(ROOT, `./src/lib/markdown/integrations`);
	const files = await readdir(targetDir);
	const integrations = [];
	for (const file of files) {
		const markdown = await Bun.file(path.join(ROOT, `./src/lib/markdown/integrations`, file)).text();
		const { data: metadata } = matter(markdown);
		integrations.push({
			...(metadata as { name: string, description: string, tag: 'Agent' | 'Inference' | 'Cloud' | 'Developer Tool' }),
			slug: file.slice(0, file.length - 4)
		});
	}
	return integrations;
}

export const readIntegrations = prerender(_readIntegrations);

export const readIntegration = prerender(
	v.object({
		slug: v.string()
	}),
	async (validatedPayload) => {
		const integrationLocation = path.join(ROOT, `./src/lib/markdown/integrations`, `${validatedPayload.slug}.svx`);
		const exists = await Bun.file(integrationLocation).exists();
		if (!exists) throw new Error('File not found');
		const markdown = await Bun.file(integrationLocation).text();
		const { data: metadata, content } = matter(markdown);
		const compiledContent = await compile(content);
		return {
			...(metadata as { name: string, description: string, tag: 'Agent' | 'Inference' | 'Cloud' | 'Developer Tool' }),
			content: compiledContent?.code
		};
	},
	{
		inputs: async () => {
			const allIntegrations = await _readIntegrations();
			return allIntegrations;
		}
	}
);
