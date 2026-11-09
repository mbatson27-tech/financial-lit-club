# [Club Name] — Resource Library

A static, no-build website for our Financial & Economic Literacy Club: notes
(Key Concepts), a video library, a resource/reading list, and interactive
ratio calculators. Plain HTML, CSS, and vanilla JavaScript — no frameworks,
no build step, free to host on GitHub Pages.

## Site structure

```
index.html            Home
key-concepts.html      Key Concepts notes (economics, investing, accounting)
videos.html             Video Library (search + filter by series)
resources.html          Websites + Reading List
calculators.html        Interactive ratio calculators
css/styles.css          All styles (includes light/dark theme)
js/common.js            Theme toggle, mobile nav, site-wide search
js/concepts-index.js    Glossary terms used by the search box
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

The Key Concepts page (`key-concepts.html`) is hand-formatted HTML (tables,
formula boxes, etc. don't translate well from plain text), not generated
from JSON. `content/key-concepts.txt` is kept as the original reference
copy of the notes. To change the Key Concepts page itself, edit the
`<section>` you want inside `key-concepts.html` directly — each glossary
term is a `<dt id="some-slug">` / `<dd>` pair. If you add a new term and
want it to show up in the site search, also add a matching entry to
`js/concepts-index.js`.

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

- Replace every `[Club Name]` placeholder (in the `<title>`, header, and
  footer of each page) with your club's real name.
- Add the "Capitalism (Inside Out)" video link in `data/resources.json`
  once it's available (search for `linkPending` in that file).
- Drop images into the `images/` folder and swap them in for the graph
  placeholders on the Key Concepts page when they're ready.
