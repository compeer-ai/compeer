import type { Snippet } from "svelte";


function sendSnippet<T extends Record<string, any>>(
  key: string,
  snippet: Snippet<T[]>,
) {
  window.dispatchEvent(
    new CustomEvent<{ snippet: Snippet }>(key, { detail: { snippet } }),
  );
}

function sendState<T extends Record<string, any>>(
  key: string,
  state: T
) {
  window.dispatchEvent(
    new CustomEvent<{ state: T }>(key, { detail: { state } }),
  );
}

function listen<T extends CustomEvent>(key: string, handler: (e: T) => void) {
  window.addEventListener(key, handler as EventListener);
  return () => window.removeEventListener(key, handler as EventListener);
}

function clear(key: string) {
    window.dispatchEvent(
    new CustomEvent<{ key: string }>('clear', { detail: { key } }),
  );
}

export const dispatcher = {
  sendSnippet,
  sendState,
  clear,
  listen,
};
