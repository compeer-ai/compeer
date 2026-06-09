import { completions } from '$lib/utilities/completions';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = ({ request }) => completions.fetch(request);
export const GET: RequestHandler = ({ request }) => completions.fetch(request);
