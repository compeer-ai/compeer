import type { User } from '$lib/models/user';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { validator } from 'hono-openapi';
import * as v from 'valibot';

export const userRouter = new Hono()
    .get('read_user', async (ctx) => {
        const user = getCookie(ctx, 'user');
        if (user) {
            return ctx.json<User>(JSON.parse(user))
        }
    })