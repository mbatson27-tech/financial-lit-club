# Financial and Economic Literacy Club — Resource Library

A static, no-build website for our Financial & Economic Literacy Club: notes
(Key Concepts), a video library, a resource/reading list, and interactive
ratio calculators. Plain HTML, CSS, and vanilla JavaScript — no frameworks,
no build step, free to host on GitHub Pages.

## Site structure

```
index.html            Home
key-concepts.html      Key Concepts notes (economics, investing, accounting)
graphs.html             Interactive economics graphs (business cycle, PPF, shifts)
videos.html             Video Library (search + filter by series)
resources.html          Websites + Reading List
calculators.html        Interactive ratio calculators
css/styles.css          All styles (includes light/dark theme)
js/common.js            Theme toggle, mobile nav, site-wide search
js/concepts-data.js     ALL Key Concepts content lives here (also feeds search)
js/concepts.js          Renders Key Concepts cards, toolbar, TOC, deep links
js/graphs.js            Graphs page tabs, shift animations, test-yourself mode
js/videos.js            Video Library page logic
js/resources.js         Resources page logic
js/calculators.js       Calculator logic
data/resources.json     ALL video, website, and book content lives here
content/key-concepts.txt  Original source notes (reference copy)
```

## Editing content — you never need to touch HTML

Everything in the **Video Library** and **Resources** pages is generated from
one file: [`data/resources.json`](data/resources.json). To add, remove, or
edit a video, website, or book, just edit that file and save — the pages
pick it up automatically.

### Add a video

Find the right series inside `"videoSeries"` (or add a new series object) and
add an entry to its `"videos"` array:

```json
{ "title": "My New Video", "videoId": "dQw4w9WgXcQ", "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
```

- `videoId` is the part of the YouTube URL after `v=`. It's used to build the
  thumbnail (`https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg`).
- For a **playlist** instead of a single video, use `"isPlaylist": true` and
  `"playlistId"` instead of `videoId` — it will show a generic thumbnail.
- If you don't have a link yet, use `"linkPending": true` and omit `url` —
  the card will show a "Link coming soon" badge and won't be clickable.

### Add a website

Add an entry to `"websites"`:

```json
{ "name": "Example Finance Site", "url": "https://example.com", "description": "One sentence about it.", "paywall": false }
```

Set `"paywall": true` to show the orange "Paywall" badge.

### Add a book

Add an entry to `"books"`:

```json
{ "title": "Book Title", "author": "Author Name" }
```

### Editing Key Concepts

Every term on the Key Concepts page lives in one file:
[`js/concepts-data.js`](js/concepts-data.js). Each entry has a `slug`
(used for deep links like `key-concepts.html#opportunity-cost`), a `term`,
a `group` (one of the eight topics in `CONCEPT_GROUPS`), a plain-English
`def`, a `why` ("Why it matters"), an `example`, and a `related` list of
other slugs. Formulas can add a `formula` object with a worked example.
Edit that file to add or change a term — the page cards and the site-wide
search both update automatically. `content/key-concepts.txt` is kept as
the original reference copy of the notes.

## Running it locally

No build step or server required — just open `index.html` in a browser.
For search/filtering to work correctly in all browsers, it's best to serve
it over a local HTTP server rather than opening the file directly:

```bash
cd finlit-club
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Create a new GitHub repository (or use an existing one) and push this
   folder to it:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-ORG/YOUR-REPO.git
   git push -u origin main
   ```
2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick the **main** branch and the **/ (root)** folder, then **Save**.
5. GitHub will publish the site at `https://YOUR-ORG.github.io/YOUR-REPO/`
   within a minute or two. Any future `git push` to `main` updates the live
   site automatically.

## Before you launch

- Add the "Capitalism (Inside Out)" video link in `data/resources.json`
  once it's available (search for `linkPending` in that file).

The economics graphs are drawn as inline SVG, so they automatically match
the light/dark theme — no image files needed.
