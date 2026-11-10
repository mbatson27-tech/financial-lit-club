/* Home page: hero parallax + scroll-reveal animations.
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

  /* Scroll-reveal: fade in + slide up, once, via IntersectionObserver. */
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target); // animate only the first time
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

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
