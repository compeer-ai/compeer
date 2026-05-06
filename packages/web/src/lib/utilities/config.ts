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

export const apiKeys = configuration.apiKeys;

export const config = {
	url: configuration.url,
	flags: configuration.flags,
	version: configuration.version,
	readFlag,
	readUserScopedFlag
};
