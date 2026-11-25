# Spark Lab — electricity self-learning platform

Interactive course: NZ Year 10 → NCEA Level 1–3 → first-year electrical engineering.
Static site (HTML + ES modules), no build step. Works offline as an installable app (PWA) on Chromebook and Android.

## Status
- **Build 1**: platform engine + Chapter 0 (Maths Toolkit) and Chapters 1–3.
- **Build 1.5**: Google sign-in, cloud sync between devices, parent Family page.
- **Build 2**: Chapters 4–7 (charge, current and voltage; resistance and Ohm’s law; series and parallel calculations; electrical power and energy) with 8 new interactives.
- **Build 3**: Chapters 8–11 (DC, AC and transmission; electric fields; EMF, internal resistance and Kirchhoff’s laws; potential dividers and sensors) with 5 new interactives.
- **Build 4** (this version): Chapters 12–15 (magnetism, magnetic force and motors, electromagnetic induction and generators, transformers and the grid), 6 new interactives and 3 mixed-topic mock exams (content/mocks.js, shown on the Review page). Stage 1 complete.
- Next: Stage 2 (NCEA Level 3 electrical systems) and Stage 3 (university bridge).

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
js/core/cloud.js        Google sign-in + Firestore sync; js/core/merge.js merges two devices' progress
js/views/               one file per page
js/sims/                interactive simulations (loaded on demand)
js/utils/               DOM, maths, dates, KaTeX, circuit-diagram SVG kit
content/manifest.js     course map (all chapters; status 'ready' or 'soon')
content/chXX.js         one file per chapter: lessons, checkpoints, tests, glossary, formulas
content/mocks.js        mixed-topic mock exams (same test format, not on the course map)
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
Progress, notes and rewards are stored in the learner's browser (localStorage), so the app works offline.
Settings → Backup lets the learner download a backup file or copy a transfer code to move between devices.

## Accounts and cloud sync (Build 1.5)
- Anyone with a Google account can sign in (Settings → Account, or the button in the top bar).
  Progress then syncs through Firebase (project `spark-lab-9c886`, Firestore in australia-southeast1).
- Parent accounts are listed in `PARENT_EMAILS` in `js/config.js` **and** in `tools/firestore.rules`.
  A learner ticks which parents may see their progress; parents use the Family page (`#/family`)
  to see progress, answer saved questions and set rewards.
- Signing out saves to the cloud, then clears progress from that device (shared-device safety).
- `js/firebase-config.js` holds the web app config (public by design; access is controlled by the rules).
- After changing `tools/firestore.rules`, paste it into Firebase console → Firestore → Rules → Publish.
