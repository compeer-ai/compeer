import { ConfigRepository } from '$lib/repository/configRepository';
import { enhancedQuery, enhancedValidatedMutation } from '$lib/utilities/remote';
import { configTable } from '$lib/utilities/schema';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

const configRepository = new ConfigRepository();

const _updateTheme = enhancedValidatedMutation(
	v.object({
		theme: v.string()
	}),
	null,
	async ({ validatedPayload }) => {
		await configRepository.upsert({
			key: 'theme',
			value: validatedPayload.theme
		});
		_readTheme.refresh();
	}
);

export const updateThemeCommand = _updateTheme.command;

const _readTheme = enhancedQuery('read_theme', null, async () => {
	const result = await configRepository.readByPredicate(eq(configTable.key, 'theme'));
	const config = result.first();
	if (config) {
		return config.value as string;
	}
	return null;
});

export const readTheme = _readTheme.query;
