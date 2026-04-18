import { scrape } from "@barque/scrape";

(async () => {
  const content = document.documentElement.outerHTML;
  const text = await scrape.DOMParser(content);
  const encodedText = encodeURIComponent(text);
  window.location.href = `http://localhost:7009?text=${encodedText}`;
})();
