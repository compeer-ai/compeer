import type { User } from '$lib/models/user';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';

export const userRouter = new Hono()
    .get('read_user', async (ctx) => {
        const user = getCookie(ctx, 'user');
        if (user) {
            return ctx.json<User>(JSON.parse(user))
        }
    })