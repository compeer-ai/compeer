import { prerender } from '$app/server';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import * as v from 'valibot';
import { compile } from 'mdsvex';

const ROOT = process.cwd();

async function _readBlogs() {
	const targetDir = path.join(ROOT, `./src/lib/markdown/blog`);
	const files = await readdir(targetDir);
	const blogs = [];
	for (const file of files) {
		const markdown = await Bun.file(path.join(ROOT, `./src/lib/markdown/blog`, file)).text();
		const { data: metadata } = matter(markdown);
		blogs.push({
			...(metadata as { title: string, order?: number, description: string }),
			slug: file.slice(0, file.length - 4)
		});
	}
	blogs.sort((firstBlog, secondBlog) => {
		const firstOrder = firstBlog.order ?? Number.POSITIVE_INFINITY;
		const secondOrder = secondBlog.order ?? Number.POSITIVE_INFINITY;
		return firstOrder - secondOrder;
	});
	return blogs;
}

export const readBlogs = prerender(_readBlogs);

export const readBlog = prerender(
	v.object({
		slug: v.string()
	}),
	async (validatedPayload) => {
		const blogLocation = path.join(ROOT, `./src/lib/markdown/blog`, `${validatedPayload.slug}.svx`);
		const exists = await Bun.file(blogLocation).exists();
		if (!exists) throw new Error('File not found');
		const markdown = await Bun.file(blogLocation).text();
		const { data: metadata, content } = matter(markdown);
		const compiledContent = await compile(content);
		return {
			...(metadata as { title: string, order?: number, description: string }),
			content: compiledContent?.code
		};
	},
	{
		inputs: async () => {
			const allBlogs = await _readBlogs();
			return allBlogs;
		}
	}
);
