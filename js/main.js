/**
 * main.js — entry point only: boot the store, content, shell and router.
 */
import { load, onEvent, getState } from './core/store.js';
import { initContent } from './core/content.js';
import { route, fallback, startRouter, resolve, current } from './core/router.js';
import { checkAchievements } from './core/achievements.js';
import { evaluateRewards } from './core/rewards.js';
import { renderShell, updateTopbar, wireCelebrations, toast } from './ui/shell.js';
import { homeView } from './views/home.js';
import { learnView, chapterView } from './views/learn.js';
import { lessonView } from './views/lesson.js';
import { testView } from './views/test.js';
import { reviewView, flashcardsView, mistakesView, practiceView, formulasView, glossaryView } from './views/review.js';
import { notesView } from './views/notes.js';
import { searchView } from './views/search.js';
import { meView } from './views/me.js';
import { rewardsView } from './views/rewards.js';
import { settingsView, applyPrefs, welcome } from './views/settings.js';
import { familyView } from './views/family.js';
import { initCloud } from './core/cloud.js';

let cleanup = () => {};

/**
 * Swap the main view, running the previous view's cleanup first.
 * @param {(view:Element)=>(Function|Promise<Function>)} render View renderer.
 * @returns {Promise<void>}
 */
async function show(render) {
  try { cleanup(); } catch (err) { console.error(err); }
  cleanup = () => {};
  const view = document.getElementById('view');
  const fresh = view.cloneNode(false);
  view.replaceWith(fresh);
  try {
    const c = await render(fresh);
    cleanup = typeof c === 'function' ? c : () => {};
  } catch (err) {
    console.error(err);
    fresh.innerHTML = '<div class="page narrow"><h1>Something went wrong</h1><p>This page could not load. Go back to the home page and try again.</p><a class="btn primary" href="#/home">Home</a></div>';
  }
  updateTopbar();
  fresh.focus({ preventScroll: true });
}

/**
 * Register all routes.
 * @returns {void}
 */
function routes() {
  route('/home', () => show(homeView));
  route('/learn', () => show(learnView));
  route('/chapter/:id', (p) => show((v) => chapterView(v, p.id)));
  route('/lesson/:id', (p, q) => show((v) => lessonView(v, p.id, q)));
  route('/test/:id', (p) => show((v) => testView(v, p.id)));
  route('/review', () => show(reviewView));
  route('/flashcards', (p, q) => show((v) => flashcardsView(v, q)));
  route('/mistakes', () => show(mistakesView));
  route('/practice', () => show(practiceView));
  route('/formulas', (p, q) => show((v) => formulasView(v, q)));
  route('/glossary', (p, q) => show((v) => glossaryView(v, q)));
  route('/notes', (p, q) => show((v) => notesView(v, q)));
  route('/search', (p, q) => show((v) => searchView(v, q)));
  route('/me', () => show(meView));
  route('/rewards', () => show(rewardsView));
  route('/settings', () => show(settingsView));
  route('/family', () => show(familyView));
  fallback(() => { location.hash = '#/home'; });
}

/**
 * Register the service worker for offline use and tell the learner about updates.
 * @returns {void}
 */
function registerSW() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  // Reload only when the learner pressed "Update now" (not when the first install claims the page).
  let wantsUpdate = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!wantsUpdate) return;
    wantsUpdate = false;
    location.reload();
  });
  navigator.serviceWorker.register('./sw.js').then((reg) => {
    const offer = (worker) => {
      window.sparkUpdate = () => { wantsUpdate = true; worker.postMessage('skip-waiting'); };
      toast('New lessons are ready. <button type="button" class="linkbtn" onclick="window.sparkUpdate()">Update now</button>', { ms: 12000 });
    };
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw?.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) offer(nw);
      });
    });
  }).catch((err) => console.warn('Service worker not registered', err));
}

const BUSY = ['/lesson', '/test', '/flashcards', '/practice', '/mistakes'];

/**
 * Redraw the current page after sign-in or a sync, unless the learner is in the middle of
 * a lesson, test or review session (then only the top bar updates).
 * @param {string[]} [only] Redraw only when the current path starts with one of these.
 * @returns {void}
 */
function refreshView(only) {
  const path = current().path;
  if (BUSY.some((b) => path.startsWith(b)) || (only && !only.some((o) => path.startsWith(o)))) { updateTopbar(); return; }
  resolve();
}

/**
 * Connect cloud sync events to the app.
 * @returns {void}
 */
function wireCloud() {
  let lastErr = 0;
  onEvent('auth', () => { checkAchievements(); evaluateRewards(); refreshView(); });
  onEvent('synced', () => { applyPrefs(); checkAchievements(); evaluateRewards(); refreshView(); });
  onEvent('family', () => { evaluateRewards(); refreshView(['/home', '/rewards', '/notes', '/me']); });
  onEvent('cloud-error', () => {
    if (Date.now() - lastErr < 120000) return;
    lastErr = Date.now();
    toast('Could not reach your Google account. Your progress is still saved on this device and will sync later.', { kind: 'bad', ms: 5000 });
  });
  initCloud();
}

/**
 * Start the app.
 * @returns {Promise<void>}
 */
async function boot() {
  load();
  applyPrefs();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyPrefs);
  renderShell();
  wireCelebrations();
  try {
    await initContent();
  } catch (err) {
    console.error(err);
    document.getElementById('view').innerHTML = '<div class="page narrow"><h1>Lessons could not load</h1><p>Check your internet connection and reload the page.</p></div>';
    return;
  }
  routes();
  onEvent('change', (what) => {
    if (what === 'xp') checkAchievements();
    if (what !== 'rewards') evaluateRewards();
  });
  startRouter();
  checkAchievements();
  evaluateRewards();
  registerSW();
  wireCloud();
  const isNew = !getState().profile.onboarded;
  await welcome();
  if (isNew) resolve();
  updateTopbar();
}

boot();
