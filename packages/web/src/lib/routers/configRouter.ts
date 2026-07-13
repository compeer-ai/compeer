import { Hono } from 'hono';
import { ConfigRepository } from '$lib/repository/configRepository';
import { configTable } from '$lib/utilities/schema';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { validator } from 'hono-openapi';

export const updateThemeSchema = v.object({
	theme: v.string()
});

const configRepository = new ConfigRepository();

export const configRouter = new Hono()
	.get('read_theme', async (ctx) => {
		const result = await configRepository.readByPredicate(eq(configTable.key, 'theme'));
		const config = result.first();
		if (config) {
			return ctx.json(config.value as string);
		}
		return ctx.json(null);
	})
	.post(
		'update_theme',
		validator('json', updateThemeSchema),
		async (ctx) => {
			const { theme } = ctx.req.valid('json');
			await configRepository.upsert({
				key: 'theme',
				value: theme
			});
			return ctx.json({ success: true });
		}
	);
