import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';

export const jwtRouter = new Hono()
    .get('read_jwt', async (ctx) => {
        const jwt = getCookie(ctx, 'jwt');
        return ctx.json(jwt);
    })
