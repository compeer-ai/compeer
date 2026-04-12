const CAPTURE_ALLOWLIST_HOSTNAMES = ["example.com", "app.example.com"];

function shouldEnableCaptureForUrl(urlString?: string): boolean {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }
    return CAPTURE_ALLOWLIST_HOSTNAMES.includes(url.hostname);
  } catch (error) {
    return false;
  }
}

async function updateActionForTab(tabId: number, urlString?: string) {
  if (shouldEnableCaptureForUrl(urlString)) {
    await browser.action.enable(tabId);
  } else {
    await browser.action.disable(tabId);
  }
}

async function captureFromTab(tab: { id?: number }, selectionText?: string) {
  if (!tab.id) return;
  await browser.sidePanel.open({
    tabId: tab.id,
  });
  if (selectionText) {
    await browser.storage.local.set({
      content: selectionText,
      highlight: true,
    });
    return;
  }
  try {
    const [{ result }] = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () =>
        document.body?.innerText || document.documentElement?.innerText || "",
    });

    await browser.storage.local.set({
      content: result ?? "",
      highlight: false,
    });
  } catch (error) {
    // TODO: handle properly
    console.error(error);
    await browser.storage.local.set({
      content: "",
      highlight: false,
    });
  }
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "capture",
      title: "Capture",
      contexts: ["all"],
    });
  });

  browser.action.setTitle({ title: "Capture" });

  browser.action.onClicked.addListener(async (tab) => {
    await captureFromTab(tab);
  });

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" || changeInfo.url) {
      await updateActionForTab(tabId, tab.url);
    }
  });

  browser.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await browser.tabs.get(tabId);
    await updateActionForTab(tabId, tab.url);
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "capture" && tab) {
      await captureFromTab(tab, info.selectionText);
    }
  });
});
