/* Home page: hero parallax + animated stat counters.
   (Scroll-reveal is handled site-wide by js/common.js.)
   Respects prefers-reduced-motion (no parallax, no animations). */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Keep the hero exactly viewport-height minus the sticky header. */
  var header = document.querySelector(".site-header");
  function setHeaderHeight() {
    if (header) {
      document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    }
  }
  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);

  /* ---------- Animated stat counters (values computed from real data) ---------- */
  function countUp(el, target, suffix) {
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initStats() {
    var nums = document.querySelectorAll(".stat-num[data-stat]");
    if (!nums.length) return;

    /* Concepts + topics come from js/concepts-data.js (already loaded). */
    var values = {
      concepts: typeof CONCEPTS_DATA !== "undefined" ? Math.floor(CONCEPTS_DATA.length / 10) * 10 : 60,
      topics: typeof CONCEPT_GROUPS !== "undefined" ? CONCEPT_GROUPS.length : 8,
      videos: null, // filled from data/resources.json
      calculators: 5
    };

    var started = false;
    function startAll() {
      if (started) return;
      started = true;
      nums.forEach(function (el) {
        var key = el.getAttribute("data-stat");
        var target = values[key];
        if (target === null || target === undefined) {
          target = parseInt(el.textContent, 10) || 0;
        }
        countUp(el, target, el.getAttribute("data-suffix") || "");
      });
    }

    var fetched = fetch("data/resources.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var count = 0;
        (data.videoSeries || []).forEach(function (g) {
          count += (g.videos || []).length;
        });
        values.videos = Math.floor(count / 10) * 10; // "40+" style
      })
      .catch(function () { values.videos = 40; });

    function onVisible() {
      fetched.then(startAll);
    }

    var strip = document.querySelector(".stats-strip");
    if (prefersReduced || !("IntersectionObserver" in window) || !strip) {
      onVisible();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          io.disconnect();
          onVisible();
        }
      });
    }, { threshold: 0.3 });
    io.observe(strip);
  }
  initStats();

  /* Subtle parallax: hero background scrolls slower than the page. */
  var heroBg = document.querySelector(".hero-bg");
  if (heroBg && !prefersReduced) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        heroBg.style.transform = "translateY(" + window.scrollY * 0.3 + "px)";
        ticking = false;
      });
    }, { passive: true });
  }
})();

/* About Us photo: if the school-hosted portrait fails to load,
   remove it so the gold monogram placeholder shows instead. */
(function () {
  "use strict";
  var img = document.querySelector(".profile-img");
  if (!img) return;
  function drop() { if (img.parentNode) img.parentNode.removeChild(img); }
  if (img.complete && img.naturalWidth === 0 && img.currentSrc) drop();
  img.addEventListener("error", drop);
})();
