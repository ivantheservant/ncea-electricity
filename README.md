# Spark Lab — electricity self-learning platform

Interactive course: NZ Year 10 → NCEA Level 1–3 → first-year electrical engineering.
Static site (HTML + ES modules), no build step. Works offline as an installable app (PWA) on Chromebook and Android.

## Status
- **Build 1** (this version): platform engine + Chapter 0 (Maths Toolkit) and Chapters 1–3.
- Build 2: Chapters 4–7 · Build 3: Chapters 8–11 · Build 4: Chapters 12–15 + mock exams.

## Run locally
```
cd ncea-electricity
python -m http.server 8000
```
Open http://localhost:8000 (ES modules and the service worker need http, not file://).

## Structure
```
index.html              entry page
js/main.js              entry only: boot + routes
js/config.js            XP rules, levels, grade thresholds
js/core/                store, router, content loader, XP, progress, achievements,
                        quiz engine, flashcards (SRS), notes, rewards, search
js/ui/                  shell (nav, toasts, modals), lesson sections, highlighter, sim loader
js/views/               one file per page
js/sims/                interactive simulations (loaded on demand)
js/utils/               DOM, maths, dates, KaTeX, circuit-diagram SVG kit
content/manifest.js     course map (all chapters; status 'ready' or 'soon')
content/chXX.js         one file per chapter: lessons, checkpoints, tests, glossary, formulas
vendor/                 KaTeX and fonts (served locally so the app works offline)
tools/build_sw.py       regenerates sw.js (offline cache list + version)
```

## Adding a chapter
1. Create `content/chNN.js` (copy the shape of `ch03.js`).
2. Set the chapter's `status: 'ready'` in `content/manifest.js`.
3. Run `python tools/build_sw.py` so the new file is cached offline.

## Deploy (GitHub Pages)
Push to `main`, then Settings → Pages → Deploy from branch → `main` / root.
After every change, run `python tools/build_sw.py` before pushing; learners then see an “Update now” prompt.

## Data
All progress, notes and rewards are stored in the learner's browser (localStorage).
Settings → Backup lets the learner download a backup file or copy a transfer code to move between devices.
