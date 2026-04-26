import { getRequestEvent, query } from '$app/server';

export const readJwt = query(async () => {
	const { cookies } = getRequestEvent();
	const jwt = cookies.get('jwt');
	return jwt;
});
