import { Hono } from 'hono';

const router = new Hono()
    .post('/*', (c) => {
        return c.text('Not Yet Implemented');
    })
    .get('/*', (c) => {
        return c.text('Not Yet Implemented');
    })
export const completions = new Hono().route('/', router);