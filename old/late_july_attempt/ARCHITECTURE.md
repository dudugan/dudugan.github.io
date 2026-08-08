# Architecture — current state

Past writeups and Q&A are in `ARCHIVE.md`. Work still to do is in `TODO.md`. This doc is just "how the site works right now."

## Pages

Two structural pages, real URL per page, no build step:

- **index.html** — the readme page. Its own layout (photo + toolbar + bio + cli, bottom links marquee).
- **other.html** — the shared shell for every other page (sidebar with photo/toolbar/short bio/platform grid, `#content-mount` for the page's own content, footer with cli).
- **research.html / about-me.html / creative.html / affiliations.html** — content-only pages. Each is a real minimal document (own `<head>`, loads `script.js`) whose `<body>` is *just* that page's content, nothing else.

## How a content-only page becomes a full page

`script.js` runs on every page. On `DOMContentLoaded`, it checks `document.querySelector('.layout')`:

- Found (index.html, other.html) → the structure's already there, just mount.
- Not found (a content-only page) → `mergeContentPage()`: save the page's own body, `fetch('other.html')`, swap that shell in, drop the saved content into the now-present `#content-mount`, strip the shell's now-dead `<script>` tags, then dynamically load `cli.js` (it can't be a static `<script>` tag on these pages — the `#cli` markup it needs doesn't exist until after the merge).

Then, on every page: `mountToolbars()` / `mountNav()` / `mountLinks()` populate the empty mount points (`.toolbar-mount`, `#nav-mount`, `.links-mount`) from one shared source each, so that content is only ever written once in JS regardless of how many times the container appears on a page. `document.documentElement` gets a `.ready` class at the end, which is what reveals the page (see the FOUC guard in style.css) — matters most for content-only pages, which are raw and unstyled until the merge finishes.

## The rest

- **Toolbar** (`.tool-btn`, 4 buttons, `.half-toolbar` mounts only the first 2): theme toggles `html.dark-mode` + rotates 90°/click; music toggles `#bg-audio` + mirror-flips the button every 0.5s; video toggles `#bg-video` (a fixed full-page background, hidden when off, `muted` so browsers don't silently refuse to play it) + swaps its icon; dice randomizes `#photos`'s image. State is tracked with an explicit `.is-playing` class on each button rather than trusting the audio/video element's own `.paused`, which turned out to be unreliable. `#bg-video` has no `src` in the markup — `video-btn`'s click handler sets it (and so triggers the actual download) the first time it's ever clicked, not on page load.
- **Marquee** (`.marquee` + `.marquee-ltr`/`.marquee-rtl`): pure CSS animation, but the *amount* of content to animate is decided in JS. `wrapMarqueeContent()` measures how wide a single copy of the content renders, then repeats it as many times as needed to exceed the mount's width (stored as a `--marquee-copies` custom property), so there's always enough repeated content to keep the visible window full no matter how wide the screen is. The keyframes move by `-100% / var(--marquee-copies)` — always "one copy's width" — so scroll speed stays constant regardless of the copy count.
- **Accordion**: `accordionSection()` builds a section's markup; a document-level click listener toggles `.open`. research.html's sections are hand-expanded to that same markup (not generated at runtime — keeps the page JS-free).

## Known-good vs. still shaky

Verified working: research.html populates and links correctly, cli navigation works, the audio button's flip animation starts/stops correctly. See `TODO.md` for what's still open (marquee and video fixes from this round need a live re-check; actual audio playback is inaudible in David's current preview setup, cause not yet confirmed).
