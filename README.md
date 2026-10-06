# PawSteps

PawSteps is a daily dog training program that runs entirely in the browser. It walks you through a six-week plan, and it tracks sessions, notes, ratings, and streaks on the device in `localStorage`. Nothing is sent to a server.

**Live app:** https://ellisdeeman.github.io/Doggy-Bootcamp/

Open that link on a phone and use **Add to Home Screen** to install it. After the first visit, the service worker can open the app offline. `index.html` is fetched network-first, so an update on GitHub Pages replaces the cached copy the next time the phone is online.

## Repository layout

- `index.html` — the app (CSS and JavaScript are inlined; no network dependencies)
- `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — installable PWA
- `.nojekyll` — tells GitHub Pages to serve the files as-is
- `src/` — editable source. `python3 src/build.py` rebuilds the root `index.html`, including the manifest, icon, and service-worker tags
- `python3 src/make_icons.py` redraws the three PNG icons (needs [Pillow](https://python-pillow.org/))
- `tests/` — Playwright scripts for onboarding, progress, and settings. They are not required to use the app

GitHub Pages should deploy from the `main` branch, root folder (`/`).
