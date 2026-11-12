/* Interactive graphs page: tab navigation, "test yourself" label hiding,
   the PPF outward-shift toggle, and animated supply/demand shift scenarios. */

(function () {
  "use strict";

  function prefersReduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------- Tabs ---------- */

  const tabs = Array.from(document.querySelectorAll('.graph-tabs [role="tab"]'));
  const panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });

  /* ---------- Draw-in animation for solid SVG curves ----------
     pathLength="1" makes one dash unit equal the whole line, so the CSS
     (gated behind prefers-reduced-motion: no-preference) can animate
     stroke-dashoffset 1 -> 0 to "draw" the curve. */
  document.querySelectorAll(".econ-graph").forEach(function (svg) {
    svg.querySelectorAll(".curve, .curve-new").forEach(function (el) {
      el.setAttribute("pathLength", "1");
    });
  });

  function triggerDraw(panel) {
    if (prefersReduced()) return;
    panel.querySelectorAll(".econ-graph").forEach(function (svg) {
      svg.classList.remove("draw");
      void svg.getBoundingClientRect(); // force reflow so the animation restarts
      svg.classList.add("draw");
    });
  }

  function selectTab(tab, focus) {
    tabs.forEach(function (t, i) {
      const selected = t === tab;
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
      if (selected) triggerDraw(panels[i]);
    });
    if (focus) tab.focus();
  }

  /* Draw the initially visible graph when it scrolls into view. */
  (function () {
    const first = panels.find(function (p) { return p && !p.hidden; });
    const svg = first && first.querySelector(".econ-graph");
    if (!svg || prefersReduced()) return;
    if (!("IntersectionObserver" in window)) { svg.classList.add("draw"); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          io.disconnect();
          svg.classList.add("draw");
        }
      });
    }, { threshold: 0.25 });
    io.observe(svg);
  })();

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab, false); });
    tab.addEventListener("keydown", function (e) {
      let target = null;
      if (e.key === "ArrowRight") target = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft") target = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") target = tabs[0];
      else if (e.key === "End") target = tabs[tabs.length - 1];
      if (target) { e.preventDefault(); selectTab(target, true); }
    });
  });

  /* ---------- Test yourself (hide labels) ---------- */

  const quizBtn = document.getElementById("quiz-toggle");
  if (quizBtn) {
    quizBtn.addEventListener("click", function () {
      const on = quizBtn.getAttribute("aria-pressed") !== "true";
      quizBtn.setAttribute("aria-pressed", on ? "true" : "false");
      quizBtn.textContent = on ? "Show labels" : "Test yourself: hide labels";
      document.body.classList.toggle("quiz-mode", on);
    });
  }

  /* ---------- PPF outward shift ---------- */

  const ppfBtn = document.getElementById("ppf-shift-btn");
  const ppfGrowth = document.getElementById("ppf-growth");
  if (ppfBtn && ppfGrowth) {
    ppfBtn.addEventListener("click", function () {
      const on = ppfBtn.getAttribute("aria-pressed") !== "true";
      ppfBtn.setAttribute("aria-pressed", on ? "true" : "false");
      ppfBtn.textContent = on ? "Shift the frontier back" : "Shift the frontier outward";
      ppfGrowth.hidden = !on;
    });
  }

  /* ---------- Shift scenarios ---------- */

  const BASE = {
    s: [70, 180, 260, 50],
    d: [70, 50, 260, 180],
    eq: [165, 115]
  };

  const SCENARIOS = {
    expansion: {
      title: "Shift: An Economic Expansion",
      move: "d",
      to: [115, 50, 300, 180],
      eqTo: [187, 100],
      newLbl: { x: 115, y: 42, text: "D₂" },
      arrow: { x1: 104, y1: 70, x2: 130, y2: 70, dir: "right" },
      caption: "Demand shifts right (P₁→P₂, Q₁→Q₂).",
      table: { gdp: "up", unemp: "down", infl: "up" },
      explain: "Consumers and businesses feel confident and spend more at every price, so the whole demand curve moves right. Producers ramp up output to meet it, and both the price level and quantity rise.",
      example: "Real example: the late-1990s U.S. boom — strong job growth and the internet build-out pushed demand, GDP, and inflation up together."
    },
    contraction: {
      title: "Shift: An Economic Contraction",
      move: "d",
      to: [40, 72, 218, 193],
      eqTo: [143, 130],
      newLbl: { x: 46, y: 64, text: "D₂" },
      arrow: { x1: 138, y1: 70, x2: 112, y2: 70, dir: "left" },
      caption: "Demand shifts left (P₁→P₂, Q₁→Q₂).",
      table: { gdp: "down", unemp: "up", infl: "down" },
      explain: "Fearful households and firms cut back spending at every price, so the demand curve moves left. Producers respond by cutting output and jobs, and both the price level and quantity fall.",
      example: "Real example: the 2008–09 Great Recession — after the housing crash, demand collapsed, unemployment hit 10%, and inflation fell toward zero."
    },
    shock: {
      title: "Shift: A Supply Shock (→ Stagflation)",
      move: "s",
      to: [42, 172, 220, 50],
      eqTo: [145, 101],
      newLbl: { x: 220, y: 42, text: "S₂" },
      arrow: { x1: 226, y1: 70, x2: 200, y2: 70, dir: "left" },
      caption: "Supply shifts left (P₁→P₂ ↑, Q₁→Q₂ ↓) — stagflation.",
      table: { gdp: "down", unemp: "up", infl: "up" },
      explain: "A jump in input costs (like oil) means producers supply less at every price, so the supply curve moves left. Output falls while prices rise — the painful combination called stagflation.",
      example: "Real example: the 1970s OPEC oil embargo — oil prices quadrupled, U.S. output stalled, and inflation and unemployment rose at the same time."
    },
    surplus: {
      title: "Shift: A Supply Surplus (very rare)",
      move: "s",
      to: [115, 180, 300, 53],
      eqTo: [188, 130],
      newLbl: { x: 297, y: 45, text: "S₂" },
      arrow: { x1: 236, y1: 70, x2: 262, y2: 70, dir: "right" },
      caption: "Supply shifts right (P₁→P₂ ↓, Q₁→Q₂ ↑).",
      table: { gdp: "up", unemp: "down", infl: "down" },
      explain: "New technology or abundant inputs let producers supply more at every price, so the supply curve moves right. Quantity rises while prices fall — growth without inflation.",
      example: "Real example: the 2010s U.S. shale-oil boom — new drilling technology flooded the market, cutting energy prices while output and jobs grew."
    }
  };

  const $ = function (id) { return document.getElementById(id); };
  const sS = $("sh-s"), sD = $("sh-d"), sOld = $("sh-old"), dot = $("sh-dot"), dotOld = $("sh-dot-old");

  if (sS && sD) {
    const els = {
      guideOldH: $("sh-guide-old-h"), guideOldV: $("sh-guide-old-v"),
      guideNewH: $("sh-guide-new-h"), guideNewV: $("sh-guide-new-v"),
      arrow: $("sh-arrow"), arrowLine: document.querySelector("#sh-arrow .shift"),
      arrowHead: $("sh-arrow-head"),
      sLbl: $("sh-s-lbl"), dLbl: $("sh-d-lbl"), newLbl: $("sh-new-lbl"),
      pOld: $("sh-p-old"), pNew: $("sh-p-new"), qOld: $("sh-q-old"), qNew: $("sh-q-new"),
      title: $("shift-title"), caption: $("shift-caption"),
      info: $("shift-info"), intro: $("shift-intro"),
      infoTitle: $("shift-info-title"), explain: $("shift-explain"), example: $("shift-example"),
      gdp: $("shift-gdp"), unemp: $("shift-unemp"), infl: $("shift-infl")
    };

    function setLine(el, c) {
      el.setAttribute("x1", c[0]); el.setAttribute("y1", c[1]);
      el.setAttribute("x2", c[2]); el.setAttribute("y2", c[3]);
    }
    function setDot(el, p) { el.setAttribute("cx", p[0]); el.setAttribute("cy", p[1]); }
    function setGuides(h, v, eq) {
      setLine(h, [40, eq[1], eq[0], eq[1]]);
      setLine(v, [eq[0], eq[1], eq[0], 195]);
    }

    let animId = null;

    function resetBase() {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
      setLine(sS, BASE.s); setLine(sD, BASE.d); setDot(dot, BASE.eq);
      [sOld, dotOld, els.guideOldH, els.guideOldV, els.guideNewH, els.guideNewV,
       els.arrow, els.newLbl, els.pOld, els.pNew, els.qOld, els.qNew]
        .forEach(function (el) { el.setAttribute("opacity", "0"); });
      els.sLbl.setAttribute("x", 260); els.sLbl.setAttribute("y", 42); els.sLbl.textContent = "S";
      els.dLbl.setAttribute("x", 70); els.dLbl.setAttribute("y", 42); els.dLbl.textContent = "D";
    }

    function arrowHeadPoints(a) {
      return a.dir === "right"
        ? (a.x2 + 9) + "," + a.y2 + " " + (a.x2 - 1) + "," + (a.y2 - 5) + " " + (a.x2 - 1) + "," + (a.y2 + 5)
        : (a.x2 - 9) + "," + a.y2 + " " + (a.x2 + 1) + "," + (a.y2 - 5) + " " + (a.x2 + 1) + "," + (a.y2 + 5);
    }

    function runScenario(key) {
      const sc = SCENARIOS[key];
      resetBase();

      const moving = sc.move === "d" ? sD : sS;
      const movingBase = sc.move === "d" ? BASE.d : BASE.s;
      const movingLbl = sc.move === "d" ? els.dLbl : els.sLbl;

      /* Old curve stays behind, faded. */
      setLine(sOld, movingBase);
      sOld.setAttribute("opacity", "1");
      setDot(dotOld, BASE.eq);
      dotOld.setAttribute("opacity", "1");
      setGuides(els.guideOldH, els.guideOldV, BASE.eq);
      els.guideOldH.setAttribute("opacity", "1");
      els.guideOldV.setAttribute("opacity", "1");
      setGuides(els.guideNewH, els.guideNewV, sc.eqTo);
      els.guideNewH.setAttribute("opacity", "1");
      els.guideNewV.setAttribute("opacity", "1");

      /* Re-label: the moving curve's base label becomes ₁, new label ₂. */
      movingLbl.textContent = (sc.move === "d" ? "D₁" : "S₁");
      els.newLbl.textContent = sc.newLbl.text;
      els.newLbl.setAttribute("x", sc.newLbl.x);
      els.newLbl.setAttribute("y", sc.newLbl.y);
      els.newLbl.setAttribute("opacity", "1");

      /* Shift arrow */
      setLine(els.arrowLine, [sc.arrow.x1, sc.arrow.y1, sc.arrow.x2, sc.arrow.y2]);
      els.arrowHead.setAttribute("points", arrowHeadPoints(sc.arrow));
      els.arrow.setAttribute("opacity", "1");

      /* Price/quantity tick labels */
      els.pOld.setAttribute("y", BASE.eq[1] + 4);
      els.qOld.setAttribute("x", BASE.eq[0]);
      els.pNew.setAttribute("y", sc.eqTo[1] + 4);
      els.qNew.setAttribute("x", sc.eqTo[0]);
      [els.pOld, els.pNew, els.qOld, els.qNew].forEach(function (el) { el.setAttribute("opacity", "1"); });

      /* Panel text */
      els.title.textContent = sc.title;
      els.caption.textContent = sc.caption;
      els.intro.hidden = true;
      els.info.hidden = false;
      els.infoTitle.textContent = sc.title.replace(/^Shift: /, "");
      els.explain.textContent = sc.explain;
      els.example.textContent = sc.example;
      const ARROWS = {
        up: '<span class="delta delta-up"><span aria-hidden="true">▲</span> Rises</span>',
        down: '<span class="delta delta-down"><span aria-hidden="true">▼</span> Falls</span>'
      };
      els.gdp.innerHTML = ARROWS[sc.table.gdp];
      els.unemp.innerHTML = ARROWS[sc.table.unemp];
      els.infl.innerHTML = ARROWS[sc.table.infl];

      /* Animate the moving curve + equilibrium dot from base to target. */
      if (prefersReduced()) {
        setLine(moving, sc.to);
        setDot(dot, sc.eqTo);
        return;
      }
      const t0 = performance.now(), DUR = 650;
      function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
      function frame(now) {
        const t = Math.min(1, (now - t0) / DUR), k = ease(t);
        const lerp = function (a, b) { return a + (b - a) * k; };
        setLine(moving, movingBase.map(function (v, i) { return lerp(v, sc.to[i]); }));
        setDot(dot, [lerp(BASE.eq[0], sc.eqTo[0]), lerp(BASE.eq[1], sc.eqTo[1])]);
        if (t < 1) animId = requestAnimationFrame(frame);
        else animId = null;
      }
      animId = requestAnimationFrame(frame);
    }

    const scenarioBtns = Array.from(document.querySelectorAll(".scenario-btns [data-scenario]"));
    scenarioBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        scenarioBtns.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        runScenario(btn.dataset.scenario);
      });
    });
  }
})();
