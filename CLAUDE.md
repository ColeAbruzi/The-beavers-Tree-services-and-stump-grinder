# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing site (single page) for "The Beavers Stump Grinding & Tree Service." No build tooling, no package manager, no framework — just three hand-written files:

- `index.html` — all page markup and content (hero, services, process, sign/find-us, reviews, FAQ, contact form, footer), sections in DOM order matching the nav anchors (`#services`, `#process`, `#sign`, `#reviews`, `#faq`, `#contact`).
- `style.css` — all styling, driven by CSS custom properties defined once in `:root` at the top (`--ink`, `--panel`, `--gold`, `--red`, `--paper`, `--muted`, `--line`, `--radius`, `--ease`). Change a color/spacing token there rather than hardcoding values in individual rules.
- `script.js` — all behavior, plain vanilla JS with no dependencies, organized as independent `// ===== Section =====` blocks (footer year, header shrink-on-scroll, mobile menu toggle, scroll-reveal via `IntersectionObserver`, animated stat counters, FAQ accordion, contact form validation).

## Running/testing locally

There is no dev server, bundler, linter, or test suite configured. To preview changes, just open `index.html` directly in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server`). Reload the browser to see changes — nothing is compiled.

## Deployment

`.github/workflows/static.yml` deploys the entire repo root to GitHub Pages automatically on every push to `main` (via `actions/upload-pages-artifact` + `actions/deploy-pages`). There is no staging step — pushing to `main` ships directly to production. Be careful with direct commits/pushes to `main`.

## Key implementation notes

- The contact form (`#contact-form` in `index.html`, validation logic in `script.js`) is **client-side only** — it validates and shows a success message but does not actually send data anywhere. There is no backend. If wiring up real submissions, integrate a service like Formspree/Netlify Forms or a custom endpoint, and update the `// No backend is connected yet` comment block in `script.js`.
- Content is duplicated in a few places by design: the phone number (`978-648-8610`) and email appear in the header, hero, sign section, contact section, footer, and mobile call bar — update all occurrences together when changing contact info.
- `.reveal` elements fade/slide in via `IntersectionObserver` in `script.js`; new sections that should animate in on scroll need the `reveal` class added in HTML — no JS changes required.
- The stat counters (`.stat-num` with a `data-target` attribute) animate once when `#stats` scrolls into view; add new stats by adding a `.stat` block with a `data-target` number.
- Mobile breakpoints are at `980px` and `760px` in `style.css`; the mobile call bar (`.mobile-call-bar`) and hamburger menu only appear below `760px`.
- Respects `prefers-reduced-motion` by disabling reveal transitions and the spinning brand logo animation.
