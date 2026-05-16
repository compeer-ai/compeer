import { scrape } from "@compeer-ai/scrape";

(async () => {
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
  const encodedText = encodeURIComponent(selectedContent);
  const url = new URL("http://localhost:3000/capture")
  if (urlCapture) {
    const currentUrl = window.location.href;
    url.searchParams.set('url', currentUrl);
  }
  url.searchParams.set('text', encodedText);
  window.location.href = url.toString();
})();
