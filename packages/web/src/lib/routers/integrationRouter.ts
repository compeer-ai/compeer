import { Hono } from 'hono';
import bookmarklet from "$lib/assets/bookmarklet.txt?raw";

export const integrationRouter = new Hono()
    .get('read_bookmarklet', (ctx) => {
        const url = new URL(ctx.req.url);
        const origin = url.origin;
        if (bookmarklet.includes(origin)) {
            return bookmarklet;
        }
        return ctx.body(bookmarklet.replace('http://localhost:3000', origin), 200, {
            'Content-Type': 'text/javascript',
            'Content-Disposition': 'attachment; filename="bookmarklet.js"'
        });
    });

