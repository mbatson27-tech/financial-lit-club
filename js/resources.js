/* Resources page: loads data/resources.json, renders website cards and the
   reading list, and filters both by the search box. */

(function () {
  "use strict";

  const websiteGrid = document.getElementById("website-grid");
  const bookList = document.getElementById("book-list");
  const emptyEl = document.getElementById("resource-empty");
  const searchInput = document.getElementById("resource-search");
  const websitesHeading = document.getElementById("websites-heading");
  const booksHeading = document.getElementById("books-heading");

  let websites = [];
  let books = [];

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function websiteCardHtml(site) {
    return (
      '<div class="resource-card">' +
        '<div class="rc-top"><h3>' + escapeHtml(site.name) + "</h3>" +
        (site.paywall ? '<span class="badge badge-paywall">Paywall</span>' : "") +
        "</div>" +
        '<p>' + escapeHtml(site.description || "") + "</p>" +
        '<a class="rc-link" href="' + site.url + '" target="_blank" rel="noopener noreferrer">Visit site →</a>' +
      "</div>"
    );
  }

  function bookCardHtml(book) {
    return (
      '<li class="book-card">' +
        '<span class="book-icon" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span>' +
        '<div><h3>' + escapeHtml(book.title) + "</h3>" +
        '<p>by ' + escapeHtml(book.author) + "</p></div>" +
      "</li>"
    );
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();

    const matchedSites = websites.filter(function (s) {
      return !query || s.name.toLowerCase().indexOf(query) !== -1 || (s.description || "").toLowerCase().indexOf(query) !== -1;
    });
    const matchedBooks = books.filter(function (b) {
      return !query || b.title.toLowerCase().indexOf(query) !== -1 || b.author.toLowerCase().indexOf(query) !== -1;
    });

    websiteGrid.innerHTML = matchedSites.map(websiteCardHtml).join("");
    bookList.innerHTML = matchedBooks.map(bookCardHtml).join("");

    websitesHeading.hidden = matchedSites.length === 0;
    websiteGrid.hidden = matchedSites.length === 0;
    booksHeading.hidden = matchedBooks.length === 0;
    bookList.hidden = matchedBooks.length === 0;

    emptyEl.hidden = matchedSites.length + matchedBooks.length !== 0;
  }

  function applyQueryParam() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) searchInput.value = q;
  }

  fetch("data/resources.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      websites = data.websites || [];
      books = data.books || [];
      applyQueryParam();
      render();
    })
    .catch(function () {
      websiteGrid.innerHTML = "";
      bookList.innerHTML = "";
      emptyEl.hidden = false;
      emptyEl.textContent = "Could not load resources. Please try again later.";
    });

  searchInput.addEventListener("input", render);
})();
