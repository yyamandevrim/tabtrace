function saveVisit(tab) {
    const entry = {
        url: tab.url,
        title: tab.title,
        timestamp: new Date().toISOString()
    };
    browser.storage.local.get({ history: [] }).then((data) => {
        const updated = [entry, ...data.history].slice(0, 100);
        browser.storage.local.set({ history: updated });
    });
}

//trigger when tab updated
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.startsWith("http")) {
    saveVisit(tab);
  }
});