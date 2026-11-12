/* Static site checker for the Financial & Economic Literacy Club site.
   Usage: node tools/check-site.mjs
   Exits non-zero if any errors are found. */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const errors = [];
const warnings = [];

function err(file, msg) { errors.push(`${file}: ${msg}`); }
function warn(file, msg) { warnings.push(`${file}: ${msg}`); }

/* ---------- Collect files ---------- */
function walk(dir, exts, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === "tools") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}

const htmlFiles = walk(ROOT, [".html"]);
const jsonFiles = walk(join(ROOT, "data"), [".json"]);

/* key-concepts.html renders its term cards from js/concepts-data.js, so
   fragment ids for that page also come from the data file's slugs. */
const conceptSlugs = new Set();
const dataFile = join(ROOT, "js", "concepts-data.js");
if (existsSync(dataFile)) {
  const src = readFileSync(dataFile, "utf8");
  for (const m of src.matchAll(/^\s*(?:slug|id):\s*"([^"]+)"/gm)) conceptSlugs.add(m[1]);
}

const rel = (f) => f.slice(ROOT.length + 1).split(sep).join("/");

/* ---------- HTML checks ---------- */
const YT_ID = /^[A-Za-z0-9_-]{11}$/;

for (const file of htmlFiles) {
  const name = rel(file);
  const html = readFileSync(file, "utf8");
  const fileDir = dirname(file);

  /* href/src extraction (skip <base>, which 404.html legitimately sets). */
  const attrRe = /<(\w+)[^>]*?\s(?:href|src)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = attrRe.exec(html))) {
    const [, tag, url] = m;
    if (tag.toLowerCase() === "base") continue;
    if (!url) { warn(name, "empty href/src"); continue; }
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(url)) continue;
    if (url.startsWith("#")) continue;

    if (url.startsWith("/")) {
      err(name, `root-absolute path "${url}" (breaks GitHub Pages subfolder hosting)`);
      continue;
    }

    /* Resolve relative to the file (404.html uses <base>, but its relative
       targets resolve to the repo root anyway). */
    const clean = url.split("#")[0].split("?")[0];
    if (!clean) continue;
    let target = resolve(fileDir, clean);
    if (clean === "./" || clean.endsWith("/")) target = join(target, "index.html");
    if (!existsSync(target)) err(name, `broken reference "${url}"`);
  }

  /* In-page fragment links: #foo must match an id somewhere in the site.
     Same-page fragments must exist in this file. */
  const ids = new Set();
  const idRe = /\sid\s*=\s*"([^"]+)"/g;
  const seen = new Map();
  while ((m = idRe.exec(html))) {
    const id = m[1];
    seen.set(id, (seen.get(id) || 0) + 1);
    ids.add(id);
  }
  for (const [id, count] of seen) {
    if (count > 1) err(name, `duplicate id "${id}" (${count} times)`);
  }
  const isConceptsPage = name === "key-concepts.html";
  const fragRe = /\shref\s*=\s*"#([^"]+)"/g;
  while ((m = fragRe.exec(html))) {
    if (!ids.has(m[1]) && !(isConceptsPage && conceptSlugs.has(m[1]))) {
      err(name, `same-page fragment "#${m[1]}" has no matching id`);
    }
  }

  /* Cross-page fragments (page.html#frag) */
  const crossRe = /\shref\s*=\s*"([a-zA-Z0-9._/-]+\.html)#([^"]+)"/g;
  while ((m = crossRe.exec(html))) {
    const targetFile = resolve(fileDir, m[1]);
    if (!existsSync(targetFile)) continue; // already reported as broken
    if (m[1].endsWith("key-concepts.html") && conceptSlugs.has(m[2])) continue;
    const targetHtml = readFileSync(targetFile, "utf8");
    if (!new RegExp(`\\sid\\s*=\\s*"${m[2].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(targetHtml)) {
      err(name, `fragment "${m[1]}#${m[2]}" has no matching id in ${m[1]}`);
    }
  }

  /* Images missing alt */
  const imgRe = /<img\b[^>]*>/g;
  while ((m = imgRe.exec(html))) {
    if (!/\salt\s*=/.test(m[0])) err(name, `img missing alt attribute: ${m[0].slice(0, 70)}`);
  }
}

/* ---------- JSON checks ---------- */
for (const file of jsonFiles) {
  const name = rel(file);
  let data;
  try {
    data = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    err(name, `invalid JSON: ${e.message}`);
    continue;
  }
  for (const group of data.videoSeries || []) {
    for (const v of group.videos || []) {
      if (v.linkPending) continue;
      if (v.isPlaylist) {
        if (!v.playlistId || !/^[A-Za-z0-9_-]{10,}$/.test(v.playlistId)) {
          err(name, `invalid playlistId for "${v.title}"`);
        }
      } else if (!v.videoId || !YT_ID.test(v.videoId)) {
        err(name, `invalid YouTube videoId "${v.videoId}" for "${v.title}"`);
      }
    }
  }
}

/* ---------- Report ---------- */
for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(
  `\nChecked ${htmlFiles.length} HTML files, ${jsonFiles.length} JSON files: ` +
  `${errors.length} error(s), ${warnings.length} warning(s).`
);
process.exit(errors.length ? 1 : 0);
