import { Hono } from 'hono';
import { captureRouter } from '$lib/routers/captureRouter';
import { integrationRouter } from '$lib/routers/integrationRouter';
import { jwtRouter } from '$lib/routers/jwtRouter';
import { storeRouter } from '$lib/routers/storeRouter';
import { userRouter } from '$lib/routers/userRouter';
import { workspaceRouter } from '$lib/routers/workspaceRouter';

export const remotes = new Hono()
	.route('/user', userRouter)
	.route('/jwt', jwtRouter)
	.route('/config', configRouter)
	.route('/capture', captureRouter)
	.route('/store', storeRouter)
	.route('/workspace', workspaceRouter)
	.route('/integration', integrationRouter);

export type RemotesRouter = typeof remotes;
export type RemotesAppType = typeof remotes;
