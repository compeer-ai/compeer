import { readDoc } from '$lib/remotes/doc.remote';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const doc = await readDoc({ slug: params.docsSlug });
		return new Response(doc.markdown, {
			headers: {
				'content-type': 'text/plain; charset=utf-8'
			}
		});
	} catch {
		return new Response('Not found', { status: 404 });
	}
};
