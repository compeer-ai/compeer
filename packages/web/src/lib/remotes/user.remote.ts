import { getRequestEvent, query } from '$app/server';
import type { User } from '$lib/models/user';

export const readUser = query(async () => {
	const { cookies } = getRequestEvent();
	const user = cookies.get('user');
	if (user) {
		return JSON.parse(user) as User;
	}
});
