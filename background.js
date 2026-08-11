// Service worker: keep the toolbar action enabled only on talishar.net tabs.

const TALISHAR_URL = /^https:\/\/(?:[a-z0-9-]+\.)*talishar\.net(?:[/:?#]|$)/i;

async function syncAction(tabId, url) {
  if (url && TALISHAR_URL.test(url)) {
    await chrome.action.enable(tabId);
  } else {
    await chrome.action.disable(tabId);
  }
}

async function syncAllTabs() {
  await chrome.action.disable();
  const tabs = await chrome.tabs.query({});
  await Promise.all(tabs.map((t) => syncAction(t.id, t.url)));
}

chrome.runtime.onInstalled.addListener(syncAllTabs);
chrome.runtime.onStartup.addListener(syncAllTabs);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === "loading") {
    syncAction(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  syncAction(tabId, tab.url);
});
