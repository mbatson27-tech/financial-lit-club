/* Renders the Key Concepts glossary from js/concepts-data.js into
   collapsible term cards, and wires up the toolbar (search, group chips,
   expand/collapse all, A-Z view), the sticky TOC, and deep links. */

(function () {
  "use strict";

  if (typeof CONCEPTS_DATA === "undefined") return;

  const bySlug = new Map(CONCEPTS_DATA.map(function (c) { return [c.slug, c]; }));
  const groupById = new Map(CONCEPT_GROUPS.map(function (g) { return [g.id, g]; }));

  /* ---------- Build cards ---------- */

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function cardHtml(c) {
    const g = groupById.get(c.group);
    let body = "";
    body += '<p class="term-def">' + c.def + "</p>";
    if (c.why) {
      body += '<p class="term-why"><strong>Why it matters:</strong> ' + c.why + "</p>";
    }
    if (c.example) {
      body += '<div class="example-box"><strong>Real-world example:</strong> ' + c.example + "</div>";
    }
    if (c.formula) {
      body +=
        '<div class="formula-box">' +
        '<div class="formula-name">' + esc(c.formula.name) + "</div>" +
        "<code>" + esc(c.formula.code) + "</code>" +
        (c.formula.note ? '<p class="formula-note">' + c.formula.note + "</p>" : "") +
        (c.formula.worked ? '<p class="formula-worked">' + c.formula.worked + "</p>" : "") +
        "</div>";
    }
    if (c.html) body += c.html;
    if (c.related && c.related.length) {
      const links = c.related
        .filter(function (slug) { return bySlug.has(slug); })
        .map(function (slug) {
          return '<a href="#' + slug + '" data-related>' + esc(bySlug.get(slug).term) + "</a>";
        })
        .join('<span aria-hidden="true"> · </span>');
      body += '<p class="term-related"><strong>Related:</strong> ' + links + "</p>";
    }

    return (
      '<article class="term-card" id="' + c.slug + '" data-slug="' + c.slug + '" data-group="' + c.group + '">' +
      '<h3 class="term-heading">' +
      '<button type="button" class="term-toggle" aria-expanded="false" aria-controls="' + c.slug + '-body">' +
      '<span class="term-tag term-tag--' + (g ? g.color : "navy") + '" aria-hidden="true"></span>' +
      '<span class="term-title" id="' + c.slug + '-label">' + esc(c.term) + "</span>" +
      '<svg class="icon term-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>' +
      "</button></h3>" +
      '<div class="term-body" id="' + c.slug + '-body" role="region" aria-labelledby="' + c.slug + '-label">' +
      '<div class="term-body-inner">' + body + "</div></div></article>"
    );
  }

  const originalOrder = new Map(); // group id -> [card elements]

  for (const g of CONCEPT_GROUPS) {
    const list = document.querySelector('.term-list[data-group="' + g.id + '"]');
    if (!list) continue;
    list.innerHTML = CONCEPTS_DATA.filter(function (c) { return c.group === g.id; })
      .map(cardHtml).join("");
    originalOrder.set(g.id, Array.from(list.children));
  }

  const cards = Array.from(document.querySelectorAll(".term-card"));
  const sections = CONCEPT_GROUPS
    .map(function (g) { return document.getElementById(g.id); })
    .filter(Boolean);

  /* ---------- Expand / collapse ---------- */

  function setOpen(card, open) {
    card.classList.toggle("open", open);
    const btn = card.querySelector(".term-toggle");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  document.addEventListener("click", function (e) {
    const toggle = e.target.closest(".term-toggle");
    if (toggle) {
      const card = toggle.closest(".term-card");
      setOpen(card, !card.classList.contains("open"));
      return;
    }
    const related = e.target.closest("a[data-related]");
    if (related) {
      e.preventDefault();
      const slug = related.getAttribute("href").slice(1);
      openSlug(slug, true);
      if (history.replaceState) history.replaceState(null, "", "#" + slug);
    }
  });

  const expandAllBtn = document.getElementById("expand-all");
  const collapseAllBtn = document.getElementById("collapse-all");
  if (expandAllBtn) expandAllBtn.addEventListener("click", function () {
    cards.forEach(function (c) { if (!c.classList.contains("filtered-out")) setOpen(c, true); });
  });
  if (collapseAllBtn) collapseAllBtn.addEventListener("click", function () {
    cards.forEach(function (c) { setOpen(c, false); });
  });

  /* ---------- Search + group filter ---------- */

  const searchInput = document.getElementById("concept-search");
  const chipsWrap = document.getElementById("group-chips");
  const noResults = document.getElementById("kc-no-results");
  const countEl = document.getElementById("kc-count");
  let activeGroup = "all";

  const searchText = new Map(); // slug -> lowercase haystack
  for (const c of CONCEPTS_DATA) {
    const parts = [c.term, c.def, c.why || "", c.example || ""];
    if (c.formula) parts.push(c.formula.name, c.formula.code, c.formula.note || "");
    searchText.set(c.slug, parts.join(" ").replace(/<[^>]*>/g, " ").toLowerCase());
  }

  function applyFilters() {
    const q = (searchInput ? searchInput.value : "").trim().toLowerCase();
    let visible = 0;
    cards.forEach(function (card) {
      const slug = card.dataset.slug;
      const matchGroup = activeGroup === "all" || card.dataset.group === activeGroup;
      const matchQuery = !q || searchText.get(slug).indexOf(q) !== -1;
      const show = matchGroup && matchQuery;
      card.classList.toggle("filtered-out", !show);
      card.hidden = !show;
      if (show) visible++;
    });
    sections.forEach(function (sec) {
      const any = Array.from(sec.querySelectorAll(".term-card")).some(function (c) { return !c.hidden; });
      sec.hidden = !any || azMode;
    });
    if (noResults) noResults.hidden = visible !== 0;
    if (countEl) {
      countEl.textContent = visible === cards.length
        ? cards.length + " terms"
        : visible + " of " + cards.length + " terms";
    }
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);

  if (chipsWrap) {
    chipsWrap.innerHTML =
      '<button type="button" class="chip" data-group="all" aria-pressed="true">All topics</button>' +
      CONCEPT_GROUPS.map(function (g) {
        return '<button type="button" class="chip chip--' + g.color + '" data-group="' + g.id + '" aria-pressed="false">' + esc(g.name) + "</button>";
      }).join("");
    chipsWrap.addEventListener("click", function (e) {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      activeGroup = chip.dataset.group;
      chipsWrap.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      applyFilters();
    });
  }

  /* ---------- A-Z view ---------- */

  const azToggle = document.getElementById("az-toggle");
  const azSection = document.getElementById("az-view");
  const azList = azSection ? azSection.querySelector(".term-list") : null;
  const layout = document.querySelector(".kc-layout");
  let azMode = false;

  function setAzMode(on) {
    azMode = on;
    if (azToggle) azToggle.setAttribute("aria-pressed", on ? "true" : "false");
    if (layout) layout.classList.toggle("kc-az-mode", on);
    if (on && azList) {
      cards.slice().sort(function (a, b) {
        return bySlug.get(a.dataset.slug).term.localeCompare(bySlug.get(b.dataset.slug).term);
      }).forEach(function (card) { azList.appendChild(card); });
    } else {
      originalOrder.forEach(function (els, gid) {
        const list = document.querySelector('.kc-group .term-list[data-group="' + gid + '"]');
        if (list) els.forEach(function (el) { list.appendChild(el); });
      });
    }
    if (azSection) azSection.hidden = !on;
    applyFilters();
  }

  if (azToggle) azToggle.addEventListener("click", function () { setAzMode(!azMode); });

  /* ---------- Deep links ---------- */

  function clearFiltersIfHidden(card) {
    if (!card.hidden) return;
    if (searchInput) searchInput.value = "";
    activeGroup = "all";
    if (chipsWrap) chipsWrap.querySelectorAll(".chip").forEach(function (c) {
      c.setAttribute("aria-pressed", c.dataset.group === "all" ? "true" : "false");
    });
    applyFilters();
  }

  function openSlug(slug, scroll) {
    const card = document.getElementById(slug);
    if (!card || !card.classList.contains("term-card")) return false;
    clearFiltersIfHidden(card);
    setOpen(card, true);
    if (scroll) {
      card.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
      const btn = card.querySelector(".term-toggle");
      if (btn) btn.focus({ preventScroll: true });
    }
    return true;
  }

  function prefersReduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function handleHash() {
    const slug = decodeURIComponent(location.hash.slice(1));
    if (slug) openSlug(slug, true);
  }

  window.addEventListener("hashchange", handleHash);

  /* ---------- TOC highlight + mobile select ---------- */

  const tocLinks = Array.from(document.querySelectorAll(".kc-toc ol a"));
  const tocSelect = document.getElementById("kc-toc-select");

  if (tocSelect) {
    tocSelect.addEventListener("change", function () {
      const sec = document.getElementById(tocSelect.value);
      if (sec) sec.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
    });
  }

  function setActive(id) {
    tocLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
    if (tocSelect && tocSelect.value !== id) tocSelect.value = id;
  }

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Init ---------- */

  applyFilters();
  handleHash();
})();
