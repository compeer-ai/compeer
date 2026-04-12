import { prerender } from '$app/server';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import z from 'zod';
import { compile } from 'mdsvex';
import { createHighlighter } from "shiki";

const ROOT = process.cwd();

const highlighter = await createHighlighter({
  themes: ['nord'],
  langs: ['javascript', 'typescript', 'bash'],
})

async function _readCookbook() {
	const targetDir = path.join(ROOT, `./src/lib/markdown/cookbook`);
	const files = await readdir(targetDir);
	const cookbook = [];
	for (const file of files) {
		const markdown = await Bun.file(path.join(ROOT, `./src/lib/markdown/cookbook`, file)).text();
		const { data: metadata } = matter(markdown);
		cookbook.push({
			...(metadata as { title: string, order?: number, icons: string[] }),
			slug: file.slice(0, file.length - 4)
		});
	}
	cookbook.sort((firstItem, secondItem) => {
		const firstOrder = firstItem.order ?? Number.POSITIVE_INFINITY;
		const secondOrder = secondItem.order ?? Number.POSITIVE_INFINITY;
		return firstOrder - secondOrder;
	});
	return cookbook;
}

export const readCookbooks = prerender(_readCookbook);

export const readCookbook = prerender(
	z.object({
		slug: z.string()
	}),
	async (validatedPayload) => {
		const entryLocation = path.join(ROOT, `./src/lib/markdown/cookbook`, `${validatedPayload.slug}.svx`);
		const exists = await Bun.file(entryLocation).exists();
		if (!exists) throw new Error('File not found');
		const markdown = await Bun.file(entryLocation).text();
		const { data: metadata, content } = matter(markdown);
		const compiledContent = await compile(content, {
			highlight: {
				highlighter: (code, lang) => {
					return highlighter.codeToHtml(code, {
						lang: lang || 'text',
						theme: 'nord'
					})
				}
			}
		});
		return {
			...(metadata as { title: string; description: string; icons: string[] }),
			content: compiledContent?.code
		};
	},
	{
		inputs: async () => {
			const cookbook = await _readCookbook();
			return cookbook;
		}
	}
);
