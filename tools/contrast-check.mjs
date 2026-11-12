/* WCAG AA contrast audit for the LIGHT-mode design tokens.
   Reads the `:root { ... }` block in css/styles.css, computes contrast
   ratios for every text/background pair actually used on the site, and
   fails (exit 1) if any pair misses its threshold:
     4.5:1 for normal text, 3:1 for large text (>=24px, or >=18.66px bold).
   Usage: node tools/contrast-check.mjs */

import { readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(ROOT, "css", "styles.css"), "utf8");

/* ---------- Parse light-mode variables out of :root ---------- */
const rootBlock = css.match(/:root\s*{([^}]*)}/);
if (!rootBlock) {
  console.error("Could not find :root block in css/styles.css");
  process.exit(1);
}
const vars = {};
for (const m of rootBlock[1].matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
  vars[m[1]] = m[2];
}

/* ---------- Contrast math (WCAG 2.1) ---------- */
function hexToRgb(hex) {
  let h = hex.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(fg, bg) {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

/* ---------- Pairs to audit: [fg var, bg var, large?, where used] ---------- */
const PAIRS = [
  ["text", "bg", false, "body text on page background"],
  ["text", "surface", false, "body text on cards/panels (incl. graph labels .lbl)"],
  ["text", "surface-alt", false, "body text on alternate sections (note boxes, stats strip)"],
  ["text", "accent-soft", false, "example-box text"],
  ["text-muted", "bg", false, "muted text on page background"],
  ["text-muted", "surface", false, "captions/labels on cards (incl. graph .lbl-muted, axes)"],
  ["text-muted", "surface-alt", false, "muted text + search placeholder on alt surfaces"],
  ["heading", "bg", false, "headings on page background"],
  ["heading", "surface", false, "headings + nav links on header/cards"],
  ["heading", "surface-alt", false, "headings on alternate sections"],
  ["link", "bg", false, "links on page background"],
  ["link", "surface", false, "links on cards/footer"],
  ["accent", "bg", true, "stat counter numbers (large) on stats strip"],
  ["accent", "surface-alt", true, "stat counter numbers (large) on alt background"],
  ["accent", "accent-soft", false, "current-page nav link, example-box strong"],
  ["accent-contrast", "accent", false, "pressed chips / primary buttons / graph tab selected"],
  ["navy", "gold", false, "gold button text (hero CTA)"],
  ["gold-strong", "bg", false, "gold accent text on page background (eyebrow)"],
  ["gold-strong", "surface", false, "gold accent text on cards (.delta-down)"],
  ["gold-strong", "code-bg", false, "formula code text in formula boxes"],
  ["danger", "danger-soft", false, "paywall badge text"],
  ["danger", "surface", false, "danger text on cards"],
  ["g-contrast", "g-navy", false, "topic tag text (Foundations)"],
  ["g-contrast", "g-teal", false, "topic tag text (GDP & cycle)"],
  ["g-contrast", "g-purple", false, "topic tag text (Policy)"],
  ["g-contrast", "g-slate", false, "topic tag text (Capitalism)"],
  ["g-contrast", "g-gold", false, "topic tag text (Stocks)"],
  ["g-contrast", "g-green", false, "topic tag text (Bonds)"],
  ["g-contrast", "g-maroon", false, "topic tag text (Accounting)"],
  ["g-contrast", "g-blue", false, "topic tag text (Ratios)"],
];

/* ---------- Report ---------- */
let failures = 0;
const rows = [];
for (const [fg, bg, large, where] of PAIRS) {
  if (!vars[fg] || !vars[bg]) {
    rows.push(`SKIP  --${fg} / --${bg}  (variable not found)`);
    failures++;
    continue;
  }
  const r = ratio(vars[fg], vars[bg]);
  const need = large ? 3 : 4.5;
  const ok = r >= need;
  if (!ok) failures++;
  rows.push(
    `${ok ? "PASS " : "FAIL "} ${r.toFixed(2).padStart(5)}:1 (need ${need}:1)  ` +
    `--${fg} ${vars[fg]} on --${bg} ${vars[bg]}  — ${where}`
  );
}

for (const row of rows) console.log(row);
console.log(`\n${PAIRS.length} pairs checked: ${failures} failure(s).`);
process.exit(failures ? 1 : 0);
