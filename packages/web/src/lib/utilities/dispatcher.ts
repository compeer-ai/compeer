import type { Snippet } from 'svelte';

function state<T extends Record<string, any>>(key: string, state: T) {
	window.dispatchEvent(new CustomEvent<T>(key, { detail: { ...state } }));
}

function send<T extends Record<string, any>>(key: string, snippet: Snippet<T[]>) {
	window.dispatchEvent(new CustomEvent<{ snippet: Snippet }>(key, { detail: { snippet } }));
}

function snippet<T extends Record<string, any>>(snippet: Snippet<T[]>) {
	window.dispatchEvent(new CustomEvent<{ snippet: Snippet }>('snippet', { detail: { snippet } }));
}

function listen<T extends CustomEvent>(key: string, handler: (e: T) => void) {
	window.addEventListener(key, handler as EventListener);
	return () => window.removeEventListener(key, handler as EventListener);
}

export const dispatcher = {
	send,
	state,
	snippet,
	listen
};
