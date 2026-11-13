/* Video Library page: loads data/resources.json, renders cards grouped by
   series, and wires up the search box + series filter chips. */

(function () {
  "use strict";

  const resultsEl = document.getElementById("video-results");
  const emptyEl = document.getElementById("video-empty");
  const searchInput = document.getElementById("video-search");
  const filtersEl = document.getElementById("series-filters");

  let allSeries = [];
  let activeFilter = "All";

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function videoCardHtml(video, seriesName) {
    if (video.linkPending) {
      return (
        '<div class="video-card pending" aria-disabled="true">' +
          '<div class="thumb-wrap"><div class="generic-thumb"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg></div></div>' +
          '<div class="vc-body">' +
            '<div class="vc-series">' + escapeHtml(seriesName) + "</div>" +
            '<div class="vc-title">' + escapeHtml(video.title) + "</div>" +
            '<span class="badge badge-pending vc-badge">Link coming soon</span>' +
          "</div>" +
        "</div>"
      );
    }

    const thumbSrc = video.isPlaylist
      ? null
      : "https://img.youtube.com/vi/" + video.videoId + "/hqdefault.jpg";

    const thumbHtml = thumbSrc
      ? '<img src="' + thumbSrc + '" alt="" loading="lazy">'
      : '<div class="generic-thumb"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></div>';

    const badge = video.isPlaylist
      ? '<span class="play-badge">Playlist</span>'
      : '<span class="play-badge">YouTube</span>';

    return (
      '<a class="video-card" href="' + video.url + '" target="_blank" rel="noopener noreferrer">' +
        '<div class="thumb-wrap">' + thumbHtml + badge + "</div>" +
        '<div class="vc-body">' +
          '<div class="vc-series">' + escapeHtml(seriesName) + "</div>" +
          '<div class="vc-title">' + escapeHtml(video.title) + "</div>" +
        "</div>" +
      "</a>"
    );
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    resultsEl.innerHTML = "";
    let totalShown = 0;

    allSeries.forEach(function (group) {
      if (activeFilter !== "All" && group.series !== activeFilter) return;

      const matches = group.videos.filter(function (v) {
        return !query || v.title.toLowerCase().indexOf(query) !== -1;
      });
      if (matches.length === 0) return;

      totalShown += matches.length;

      const section = document.createElement("section");
      section.innerHTML =
        '<div class="series-heading"><h2>' + escapeHtml(group.series) +
        '</h2><span class="count">' + matches.length + (matches.length === 1 ? " video" : " videos") + "</span></div>" +
        '<div class="video-grid">' +
          matches.map(function (v) { return videoCardHtml(v, group.series); }).join("") +
        "</div>";
      resultsEl.appendChild(section);
    });

    emptyEl.hidden = totalShown !== 0;
  }

  function renderFilters() {
    const names = ["All"].concat(allSeries.map(function (g) { return g.series; }));
    filtersEl.innerHTML = names
      .map(function (name) {
        const pressed = name === activeFilter ? "true" : "false";
        return (
          '<button type="button" class="chip" aria-pressed="' + pressed + '" data-series="' +
          escapeHtml(name) + '">' + escapeHtml(name) + "</button>"
        );
      })
      .join("");

    filtersEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      activeFilter = btn.getAttribute("data-series");
      filtersEl.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === btn));
      });
      render();
    });
  }

  function applyQueryParam() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) searchInput.value = q;
  }

  fetch("data/resources.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      allSeries = data.videoSeries || [];
      renderFilters();
      applyQueryParam();
      render();
    })
    .catch(function () {
      resultsEl.innerHTML = '<p class="empty-state">Could not load the video library. Please try again later.</p>';
    });

  searchInput.addEventListener("input", render);
})();
