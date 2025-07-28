function saveVisit(tab) {
  if (!tab.url.startsWith("http")) return;
  const entry = {
    url: tab.url,
    title: tab.title || tab.url,
    timestamp: new Date().toISOString(),
  };

  browser.storage.local.get({ history: [] }).then((data) => {
    const updated = [entry, ...data.history].slice(0, 100);
    browser.storage.local.set({ history: updated });
  });
}

//trigger when tab updated
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    saveVisit(tab);
  }
});