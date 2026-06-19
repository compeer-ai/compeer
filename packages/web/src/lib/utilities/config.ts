import fileConfiguration from '../assets/config.json';
import defaultConfiguration from '../assets/defaultConfig.json';

const configuration = {
	...defaultConfiguration,
	...fileConfiguration
};

function readFlag(flag: keyof typeof configuration.flags) {
	return configuration.flags[flag];
}

function readUserScopedFlag(email: string, flag: keyof typeof configuration.flags) {
	if (!(email in configuration)) {
		return false;
	}
	const userScopedFlags = configuration[
		email as keyof typeof configuration
	] as typeof configuration.flags;
	return userScopedFlags[flag];
}

const envApiKeysString =
	typeof Bun !== 'undefined' ? Bun.env.COMPEER_API_KEYS : process.env.COMPEER_API_KEYS;
const envApiKeys = envApiKeysString ? envApiKeysString.split(',') : [];

export const apiKeys = [...(configuration.apiKeys || []), ...envApiKeys]
	.map((key) => key.trim())
	.filter((key) => key !== '$API_KEY' && key !== '');

export const config = {
	url: configuration.url,
	flags: configuration.flags,
	version: configuration.version,
	readFlag,
	readUserScopedFlag
};
