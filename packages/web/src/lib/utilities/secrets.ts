function read(key: string) {
	const value = safeRead(key);
	if (!value) throw new Error(`Could not find environment variable for ${key}`);
	return value;
}

function safeRead(key: string) {
	const value = Bun.env[key];
	if (!value) {
		return null;
	}
	return String(value);
}

export const secrets = {
	read,
	safeRead
};
