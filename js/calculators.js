/* Calculators page: five independent, live-updating ratio calculators. */

(function () {
  "use strict";

  function fmtMoney(n) {
    return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  function fmtPercent(n) {
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 }) + "%";
  }
  function fmtRatio(n) {
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 }) + "x";
  }

  function wire(formId, resultId, compute, exampleValues) {
    const form = document.getElementById(formId);
    const result = document.getElementById(resultId);
    if (!form || !result) return;

    const inputs = Array.from(form.querySelectorAll("input"));

    function update() {
      const values = inputs.map(function (i) { return parseFloat(i.value); });
      if (values.some(function (v) { return isNaN(v); })) {
        result.textContent = "Enter valid numbers above.";
        return;
      }
      result.textContent = compute.apply(null, values);
    }

    inputs.forEach(function (i) { i.addEventListener("input", update); });

    const exampleBtn = form.querySelector("[data-example]");
    if (exampleBtn && exampleValues) {
      exampleBtn.addEventListener("click", function () {
        inputs.forEach(function (i, idx) { i.value = exampleValues[idx]; });
        update();
      });
    }

    update();
  }

  wire("dy-form", "dy-result", function (dividend, price) {
    return "Dividend Yield: " + fmtPercent((dividend / price) * 100);
  }, [2.0, 100]);

  wire("pe-form", "pe-result", function (price, eps) {
    return "P/E Ratio: " + fmtRatio(price / eps);
  }, [38, 2]);

  wire("eps-form", "eps-result", function (earnings, shares) {
    return "EPS: " + fmtMoney(earnings / shares) + " per share";
  }, [10000000, 5000000]);

  wire("mc-form", "mc-result", function (price, shares) {
    return "Market Cap: " + fmtMoney(price * shares);
  }, [100, 5000000]);

  wire("ic-form", "ic-result", function (ebitda, interest) {
    return "Interest Coverage: " + fmtRatio(ebitda / interest);
  }, [40000000, 5000000]);
})();
