document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get("history").then((data) => {
    const list = document.getElementById("historyList");
    if (!data.history || data.history.length === 0) {
      list.innerHTML = "<li>No history recorded yet.</li>";
      return;
    }
    data.history.slice(0, 10).forEach((entry) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${entry.url}" target="_blank" rel="noopener">${entry.title}</a><br><small>${new Date(entry.timestamp).toLocaleString()}</small>`;
      list.appendChild(li);
    });
  });
});
