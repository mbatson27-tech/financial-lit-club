/* Calculators page: five independent, live-updating ratio calculators.

   Inputs are text fields (inputmode="decimal") rather than type="number"
   so large values can show thousands separators, e.g. 10,000,000. Commas,
   dollar signs, and spaces are stripped before parsing, and each field is
   re-formatted with commas when it loses focus.

   Each calculator lists its fields in order. For every field we check, in
   order: empty -> not a number -> negative -> zero (when zero isn't
   allowed). The first problem found replaces the result with a message
   that says what's missing and how to fix it. */

(function () {
  "use strict";

  const LOCALE = "en-US";

  function fmtNumber(n, minDigits, maxDigits) {
    return n.toLocaleString(LOCALE, {
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits
    });
  }
  /* Totals stay whole when they can ($500,000,000); per-share amounts
     always show cents ($2.00). */
  function fmtMoney(n, alwaysCents) {
    return "$" + (Number.isInteger(n) && !alwaysCents ? fmtNumber(n, 0, 0) : fmtNumber(n, 2, 2));
  }
  function fmtPercent(n) { return fmtNumber(n, 1, 2) + "%"; }
  function fmtRatio(n) { return fmtNumber(n, 1, 2) + "x"; }

  /* "10,000,000" -> 10000000; "" -> null; "abc" -> NaN */
  function parse(raw) {
    const cleaned = String(raw).replace(/[,$\s]/g, "");
    if (cleaned === "") return null;
    return /^-?(\d+\.?\d*|\.\d+)$/.test(cleaned) ? parseFloat(cleaned) : NaN;
  }

  /* Format with commas but keep what the user typed after the decimal point. */
  function formatInput(input) {
    const n = parse(input.value);
    if (n === null || isNaN(n)) return;
    const decimals = (String(input.value).split(".")[1] || "").replace(/\D/g, "").length;
    input.value = fmtNumber(n, decimals, Math.max(decimals, 0));
  }

  function check(fields, values) {
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      const v = values[i];
      if (v === null) return f.empty;
      if (isNaN(v)) return "Use numbers only for " + f.name + ", like 1,000 or 2.50.";
      if (v < 0) return "Use a positive number for " + f.name + ".";
      if (v === 0 && f.zero) return f.zero;
    }
    return null;
  }

  function wire(cfg) {
    const form = document.getElementById(cfg.form);
    const result = document.getElementById(cfg.result);
    if (!form || !result) return;

    const inputs = cfg.fields.map(function (f) { return document.getElementById(f.id); });
    if (inputs.some(function (i) { return !i; })) return;
    let firstRun = true;

    function show(text, isNotice) {
      const changed = text !== result.textContent;
      result.textContent = text;
      result.classList.toggle("calc-result--notice", isNotice);
      if (changed && !firstRun && !isNotice) {
        /* Re-trigger the pop animation (CSS no-ops it under reduced motion). */
        result.classList.remove("pop");
        void result.offsetWidth;
        result.classList.add("pop");
      }
      firstRun = false;
    }

    function update() {
      const values = inputs.map(function (i) { return parse(i.value); });
      const problem = check(cfg.fields, values);
      if (problem) {
        show(problem, true);
        return;
      }
      const out = cfg.compute.apply(null, values);
      if (out.notice) show(out.notice, true);
      else show(out, false);
    }

    inputs.forEach(function (i) {
      formatInput(i);
      i.addEventListener("input", update);
      i.addEventListener("blur", function () { formatInput(i); });
    });

    const exampleBtn = form.querySelector("[data-example]");
    if (exampleBtn) {
      exampleBtn.addEventListener("click", function () {
        inputs.forEach(function (i, idx) {
          i.value = cfg.example[idx];
          formatInput(i);
        });
        update();
      });
    }

    form.addEventListener("submit", function (e) { e.preventDefault(); });

    update();
  }

  wire({
    form: "dy-form",
    result: "dy-result",
    fields: [
      { id: "dy-dividend", name: "the annual dividend",
        empty: "Enter the annual dividend to see the yield." },
      { id: "dy-price", name: "the share price",
        empty: "Enter the share price to see the yield.",
        zero: "Share price must be more than $0 to calculate a yield." }
    ],
    example: ["2.00", "100"],
    compute: function (dividend, price) {
      if (dividend === 0) return "Dividend Yield: 0.0% (this stock pays no dividend)";
      return "Dividend Yield: " + fmtPercent((dividend / price) * 100);
    }
  });

  wire({
    form: "pe-form",
    result: "pe-result",
    fields: [
      { id: "pe-price", name: "the share price",
        empty: "Enter the share price to see the P/E ratio." },
      { id: "pe-eps", name: "earnings per share",
        empty: "Enter earnings per share (EPS) to see the P/E ratio.",
        zero: "EPS must be more than $0. A company with no earnings has no P/E ratio." }
    ],
    example: ["38", "2"],
    compute: function (price, eps) {
      return "P/E Ratio: " + fmtRatio(price / eps);
    }
  });

  wire({
    form: "eps-form",
    result: "eps-result",
    fields: [
      { id: "eps-earnings", name: "net earnings",
        empty: "Enter the company's yearly net earnings to see EPS." },
      { id: "eps-shares", name: "shares outstanding",
        empty: "Enter the number of shares outstanding to see EPS.",
        zero: "Shares outstanding must be at least 1 to calculate EPS." }
    ],
    example: ["10000000", "5000000"],
    compute: function (earnings, shares) {
      return "EPS: " + fmtMoney(earnings / shares, true) + " per share";
    }
  });

  wire({
    form: "mc-form",
    result: "mc-result",
    fields: [
      { id: "mc-price", name: "the share price",
        empty: "Enter the share price to see the market cap." },
      { id: "mc-shares", name: "shares outstanding",
        empty: "Enter the number of shares outstanding to see the market cap.",
        zero: "Shares outstanding must be at least 1 to calculate market cap." }
    ],
    example: ["100", "5000000"],
    compute: function (price, shares) {
      return "Market Cap: " + fmtMoney(price * shares);
    }
  });

  wire({
    form: "ic-form",
    result: "ic-result",
    fields: [
      { id: "ic-ebitda", name: "EBITDA",
        empty: "Enter EBITDA (or cash flow) to see interest coverage." },
      { id: "ic-interest", name: "interest expense",
        empty: "Enter the yearly interest expense to see interest coverage.",
        zero: "Interest expense is $0, so there's no interest to cover. Enter an amount above $0." }
    ],
    example: ["40000000", "5000000"],
    compute: function (ebitda, interest) {
      const r = ebitda / interest;
      /* Ratings follow the Key Concepts note: 4x+ is good, 8x+ is spectacular. */
      const rating = r >= 8 ? "spectacular" : r >= 4 ? "good" : "below the 4x good range";
      return "Interest Coverage: " + fmtRatio(r) + " (" + rating + ")";
    }
  });
})();
