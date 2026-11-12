/* Loads every page in a headless browser and reports console errors,
   page errors, and failed network requests.
   Usage: node tools/console-check.mjs
   Requires: npm i -D playwright  (plus `npx playwright install chromium`) */

import { createServer } from "node:http";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".json": "application/json",
  ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain",
};

/* Serve under a subfolder prefix to mimic GitHub Pages project hosting. */
const PREFIX = "/financial-lit-club";

const server = createServer((req, res) => {
  let path = decodeURIComponent(req.url.split("?")[0]);
  if (path === PREFIX || path === PREFIX + "/") path = PREFIX + "/index.html";
  if (!path.startsWith(PREFIX + "/")) { res.writeHead(404); res.end("outside prefix"); return; }
  const fsPath = join(ROOT, path.slice(PREFIX.length + 1));
  if (!fsPath.startsWith(ROOT) || !existsSync(fsPath)) {
    res.writeHead(404); res.end("not found"); return;
  }
  res.writeHead(200, { "Content-Type": MIME[extname(fsPath)] || "application/octet-stream" });
  res.end(readFileSync(fsPath));
});

const pages = readdirSync(ROOT).filter((f) => f.endsWith(".html"));

await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}${PREFIX}/`;

const browser = await chromium.launch();
const problems = [];

for (const pageFile of pages) {
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`${pageFile}: console error: ${msg.text()}`);
  });
  page.on("pageerror", (e) => problems.push(`${pageFile}: page error: ${e.message}`));
  page.on("requestfailed", (req) => {
    /* Ignore aborted third-party requests (fonts/thumbnails offline etc.)
       but always report failures for our own origin. */
    const url = req.url();
    if (url.startsWith(`http://127.0.0.1:${port}`)) {
      problems.push(`${pageFile}: request failed: ${url} (${req.failure()?.errorText})`);
    }
  });
  page.on("response", (res) => {
    const url = res.url();
    if (url.startsWith(`http://127.0.0.1:${port}`) && res.status() >= 400) {
      problems.push(`${pageFile}: HTTP ${res.status()}: ${url}`);
    }
  });
  await page.goto(base + pageFile, { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(600);
  /* Exercise interactive pages a little. */
  if (pageFile === "key-concepts.html") {
    await page.keyboard.press("Tab");
    const firstCard = page.locator(".term-card .term-toggle").first();
    if (await firstCard.count()) await firstCard.click();
  }
  if (pageFile === "graphs.html") {
    /* Activate each tab, then exercise the visible buttons inside it. */
    for (const tab of await page.locator(".graph-tabs [role=tab]").all()) {
      await tab.click();
      await page.waitForTimeout(150);
      for (const btn of await page.locator(".graph-panel:not([hidden]) .scenario-btns button").all()) {
        await btn.click();
        await page.waitForTimeout(250);
      }
    }
    const quiz = page.locator("#quiz-toggle");
    if (await quiz.count()) { await quiz.click(); await page.waitForTimeout(150); }
  }
  await page.close();
}

await browser.close();
server.close();

for (const p of problems) console.log("ERROR " + p);
console.log(`\nLoaded ${pages.length} pages: ${problems.length} problem(s).`);
process.exit(problems.length ? 1 : 0);
