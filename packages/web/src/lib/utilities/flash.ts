import type { Cookies } from '@sveltejs/kit';

function send<T extends { [key: string]: any }>(cookies: Cookies, payload: T) {
	cookies.set('flash', JSON.stringify(payload), {
		path: '/'
	});
}

function receive<T extends { [key: string]: any }>(cookies: Cookies) {
	const flash = cookies.get('flash');
	if (!flash) {
		return null;
	}
	const payload = JSON.parse(flash as string) as T;
	cookies.delete('flash', {
		path: '/'
	});
	return payload;
}

export const flash = {
	send,
	receive
};
