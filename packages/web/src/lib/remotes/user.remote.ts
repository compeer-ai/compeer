import { getRequestEvent, query } from '$app/server';
import type { User } from '$lib/models/user';
import { errors } from '$lib/utilities/errors';

export const readUser = query(async () => {
	const { cookies, url } = getRequestEvent();
	const user = cookies.get('user');
	if (!user) throw errors.badRequest(url, 'Could not retrieve user');
	return JSON.parse(user) as User;
});
