async function fetcher(
  fetch: typeof window.fetch,
  url: string,
): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ScrapeBot/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch URL: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

async function _DOMParser(fetch: typeof window.fetch, url: string) {
  const html = await fetcher(fetch, url);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const scriptTags = doc.querySelectorAll(
    "script, style, noscript, iframe, canvas, svg",
  );
  scriptTags.forEach((tag: Element) => tag.remove());
  const text = doc.body?.textContent || "";
  return normalizeText(text);
}

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
    "&mdash;": "—",
    "&ndash;": "–",
    "&hellip;": "…",
  };

  return text.replace(
    /&(?:amp|lt|gt|quot|#[0-9]+|#[xX][0-9a-fA-F]+);/g,
    (entity) => entities[entity] || entity,
  );
}

async function regex(fetch: typeof window.fetch, url: string) {
  const html = await fetcher(fetch, url);
  const withoutScriptTags = html.replace(
    /<(script|style|noscript|iframe|canvas|svg)[^>]*>[\s\S]*?<\/\1>/gi,
    " ",
  );
  const withoutTags = withoutScriptTags.replace(/<[^>]+>/g, " ");
  const decoded = decodeHtmlEntities(withoutTags);
  return normalizeText(decoded);
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export const scrape = {
  DOMParser: _DOMParser,
  regex,
};
