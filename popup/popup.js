document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const list = document.getElementById("historyList");
    let entries = [];

    // Helper - relative time
    function timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = [{
                label: "year",
                secs: 31536000
            },
            {
                label: "month",
                secs: 2592000
            },
            {
                label: "day",
                secs: 86400
            },
            {
                label: "hour",
                secs: 3600
            },
            {
                label: "minute",
                secs: 60
            },
            {
                label: "second",
                secs: 1
            }
        ];
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.secs);
            if (count > 0) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
        }
        return "just now";
    }

    function saveNotes() {
        // collect notes before saving. 
        entries.forEach((entry, i) => {
            const textarea = document.querySelector(`#note-${i}`);
            if (textarea) {
                entry.note = textarea.value;
            }
        });
        browser.storage.local.set({
            history: entries
        });
    }

    function renderList(filtered) {
        list.innerHTML = "";
        filtered.forEach((entry, i) => {
            const li = document.createElement("li");

            li.innerHTML = `
        <a class="title" href="${entry.url}" target="_blank" rel="noopener">${entry.title || entry.url}</a>
        <div class="url">${entry.url}</div>
        <div class="timestamp">${timeAgo(new Date(entry.timestamp))}</div>
        <button class="note-btn" data-index="${i}">${entry.note ? "Edit Note" : "Add Note"}</button>
        <textarea id="note-${i}" class="note-textarea" style="display: ${entry.note ? "block" : "none"};">${entry.note || ""}</textarea>
      `;
            list.appendChild(li);
        });

        // add events to note buttons.
        document.querySelectorAll(".note-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = btn.dataset.index;
                const textarea = document.getElementById(`note-${i}`);
                if (textarea.style.display === "none") {
                    textarea.style.display = "block";
                    btn.textContent = "Save Note";
                } else {
                    textarea.style.display = "none";
                    btn.textContent = textarea.value.trim() ? "Edit Note" : "Add Note";
                    saveNotes();
                }
            });
        });
    }

    // get data
    browser.storage.local.get("history").then((data) => {
        entries = data.history || [];
        renderList(entries);
    });

    // search func.
    searchInput.addEventListener("input", () => {
        const q = searchInput.value.toLowerCase();
        const filtered = entries.filter(e => {
            const note = e.note || "";
            return (e.title && e.title.toLowerCase().includes(q)) ||
                (e.url && e.url.toLowerCase().includes(q)) ||
                (note.toLowerCase().includes(q));
        });
        renderList(filtered);
    });
});