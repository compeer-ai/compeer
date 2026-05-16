import { prerender } from '$app/server';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import * as v from "valibot";
import { compile } from 'mdsvex';
import { highlighter } from '$lib/utilities/highlighter';

const ROOT = process.cwd();

async function _readDocs() {
	const targetDir = path.join(ROOT, `./src/lib/markdown/docs`);
	const files = await readdir(targetDir);
	const docs = [];
	for (const file of files) {
		const markdown = await Bun.file(path.join(ROOT, `./src/lib/markdown/docs`, file)).text();
		const { data: metadata } = matter(markdown);
		docs.push({
			title: (metadata as { title: string }).title,
			order: (metadata as { order?: number }).order,
			slug: file.slice(0, file.length - 4)
		});
	}
	docs.sort((firstDoc, secondDoc) => {
		const firstOrder = firstDoc.order ?? Number.POSITIVE_INFINITY;
		const secondOrder = secondDoc.order ?? Number.POSITIVE_INFINITY;
		return firstOrder - secondOrder;
	});
	return docs;
}

export const readDocs = prerender(_readDocs);

export const readDoc = prerender(
	v.object({
		slug: v.string()
	}),
	async (validatedPayload) => {
		const docLocation = path.join(ROOT, `./src/lib/markdown/docs`, `${validatedPayload.slug}.svx`);
		const exists = await Bun.file(docLocation).exists();
		if (!exists) throw new Error('File not found');
		const markdown = await Bun.file(docLocation).text();
		const { data: metadata, content } = matter(markdown);
		const compiledContent = await compile(content, {
			highlight: {
				highlighter: (code, lang) => {
					return highlighter.codeToHtml(code, {
						lang: lang || 'text', 
						theme: 'tokyo-night'
					})
				}
			}
		});
		return {
			...(metadata as { title: string; description: string }),
			content: compiledContent?.code,
			markdown,
		};
	},
	{
		inputs: async () => {
			const gettingStarted = await _readDocs();
			return gettingStarted;
		}
	}
);
