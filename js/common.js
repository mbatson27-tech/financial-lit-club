/* Shared behavior for every page: theme toggle, mobile nav, site-wide search. */

(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  function initTheme() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    const ICON_SUN =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>' +
      '<line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>' +
      '<line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>' +
      '<line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></svg>';
    const ICON_MOON =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

    function paintButton(theme) {
      const isDark = theme === "dark";
      btn.innerHTML = isDark ? ICON_SUN : ICON_MOON;
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }

    paintButton(document.documentElement.getAttribute("data-theme") || "light");

    btn.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("flec-theme", next);
      } catch (e) {
        /* localStorage unavailable; theme just won't persist */
      }
      paintButton(next);
    });
  }

  /* ---------- Mobile nav ---------- */
  function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Site-wide search ---------- */
  function initSiteSearch() {
    const input = document.getElementById("site-search-input");
    const resultsBox = document.getElementById("site-search-results");
    if (!input || !resultsBox) return;

    let index = null; // built lazily on first keystroke

    function buildIndex(data) {
      const items = [];

      (data.videoSeries || []).forEach(function (group) {
        (group.videos || []).forEach(function (v) {
          if (v.linkPending) return; // nothing to link to yet
          items.push({
            type: "Video",
            title: v.title,
            meta: group.series,
            href: "videos.html?q=" + encodeURIComponent(v.title)
          });
        });
      });

      (data.websites || []).forEach(function (site) {
        items.push({
          type: "Resource",
          title: site.name,
          meta: site.paywall ? "Website · Paywall" : "Website",
          href: "resources.html?q=" + encodeURIComponent(site.name)
        });
      });

      (data.books || []).forEach(function (book) {
        items.push({
          type: "Book",
          title: book.title,
          meta: "by " + book.author,
          href: "resources.html?q=" + encodeURIComponent(book.title)
        });
      });

      if (typeof KEY_CONCEPTS_INDEX !== "undefined") {
        KEY_CONCEPTS_INDEX.forEach(function (term) {
          items.push({
            type: "Key Concept",
            title: term.term,
            meta: term.section,
            href: "key-concepts.html#" + term.slug
          });
        });
      }

      return items;
    }

    function ensureIndex() {
      if (index) return Promise.resolve(index);
      return fetch("data/resources.json")
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          index = buildIndex(data);
          return index;
        })
        .catch(function () {
          index = typeof KEY_CONCEPTS_INDEX !== "undefined"
            ? buildIndex({ videoSeries: [], websites: [], books: [] })
            : [];
          return index;
        });
    }

    function render(matches, query) {
      resultsBox.innerHTML = "";
      if (!query) {
        resultsBox.classList.remove("open");
        return;
      }
      if (matches.length === 0) {
        const empty = document.createElement("div");
        empty.className = "search-empty";
        empty.textContent = 'No matches for "' + query + '".';
        resultsBox.appendChild(empty);
        resultsBox.classList.add("open");
        return;
      }

      matches.slice(0, 20).forEach(function (item) {
        const a = document.createElement("a");
        a.className = "search-result";
        a.href = item.href;
        a.innerHTML =
          '<div class="sr-title">' + escapeHtml(item.title) + "</div>" +
          '<div class="sr-meta">' + escapeHtml(item.type) + " · " + escapeHtml(item.meta) + "</div>";
        resultsBox.appendChild(a);
      });
      resultsBox.classList.add("open");
    }

    function escapeHtml(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    let debounceId = null;
    input.addEventListener("input", function () {
      const query = input.value.trim();
      clearTimeout(debounceId);
      debounceId = setTimeout(function () {
        if (!query) {
          render([], "");
          return;
        }
        ensureIndex().then(function (items) {
          const q = query.toLowerCase();
          const matches = items.filter(function (item) {
            return (
              item.title.toLowerCase().indexOf(q) !== -1 ||
              item.meta.toLowerCase().indexOf(q) !== -1
            );
          });
          render(matches, query);
        });
      }, 120);
    });

    input.addEventListener("focus", function () {
      if (input.value.trim()) resultsBox.classList.add("open");
    });

    document.addEventListener("click", function (e) {
      if (!resultsBox.contains(e.target) && e.target !== input) {
        resultsBox.classList.remove("open");
      }
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        resultsBox.classList.remove("open");
        input.blur();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initMobileNav();
    initSiteSearch();
  });
})();
