import { remotes } from '$lib/utilities/remotes';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => remotes.fetch(request);
export const POST: RequestHandler = ({ request }) => remotes.fetch(request);
export const PUT: RequestHandler = ({ request }) => remotes.fetch(request);
export const DELETE: RequestHandler = ({ request }) => remotes.fetch(request);
