import type { RequestHandler } from "@sveltejs/kit";
import { mcpServer } from '$lib/utilities/mcpServer';

export const POST: RequestHandler = ({ request }) => mcpServer.fetch(request);
export const GET: RequestHandler = ({ request }) => mcpServer.fetch(request);
