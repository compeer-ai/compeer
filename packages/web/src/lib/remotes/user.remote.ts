import { query } from '$app/server';

export const readUser = query(async () => {
	return {
		name: 'Liam'
	};
});
