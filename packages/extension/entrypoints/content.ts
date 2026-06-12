import { scrape } from "@compeer-ai/scrape";

export default defineContentScript({
  matches: ['*'],
  async main() {
    let instanceUrl = (await browser.storage.sync.get('server')).server;
    if (!instanceUrl) {
      instanceUrl = window.prompt('Enter your Compeer instance URL:', 'http://localhost:3000');
      if (!instanceUrl) return;
      await browser.storage.sync.set({ server: instanceUrl });
    }
    const selection = window.getSelection();
    let selectedContent = "";
    let urlCapture = false;
    if (selection && selection.toString().length > 0) {
      selectedContent = selection.toString();
    } else if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const fragment = range.cloneContents();
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(fragment);
      selectedContent = tempDiv.innerHTML;
    } else {
      const content = document.documentElement.outerHTML;
      selectedContent = await scrape.DOMParser(content);
      urlCapture = true;
    }
    function toBase64url(s: string) {
      return btoa(Array.from(new TextEncoder().encode(s)).map(b => String.fromCharCode(b)).join(''))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    const url = new URL(`${instanceUrl}/capture`)
    if (urlCapture) {
      url.searchParams.set('url', toBase64url(window.location.href));
    }
    url.searchParams.set('text', toBase64url(selectedContent));
    window.location.href = url.toString();
  },
});
