import { scrape } from "@barque/scrape";

(async () => {
  const content = document.documentElement.outerHTML;
  const text = await scrape.DOMParser(content);
  console.log(text);
})();
