import { getRequestEvent } from '$app/server';
import bookmarklet from '$lib/assets/bookmarklet.txt?raw';
import { enhancedQuery } from '$lib/utilities/remote';

const _readBookmarklet = enhancedQuery('read_bookmarklet', null, () => {
	const { url } = getRequestEvent();
	const origin = url.origin;
	if (bookmarklet.includes(origin)) {
		return bookmarklet;
	}
	return bookmarklet.replace('http://localhost:3000', origin);
});

export const readBookmarklet = _readBookmarklet.query;
