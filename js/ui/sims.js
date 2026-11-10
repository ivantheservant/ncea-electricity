/**
 * sims.js — loads interactive simulations on demand and mounts them into lesson pages.
 * Each sim module exports mount(el, ctx) and returns an optional cleanup function.
 */
import { $$ } from '../utils/dom.js';
import { markSim } from '../core/progress.js';

const LOADERS = {
  'prefix-trainer': () => import('../sims/maths-trainers.js'),
  'sci-trainer': () => import('../sims/maths-trainers.js'),
  'rearrange-trainer': () => import('../sims/maths-trainers.js'),
  'sigfig-trainer': () => import('../sims/maths-trainers.js'),
  'proportion-explorer': () => import('../sims/graph-tools.js'),
  'gradient-explorer': () => import('../sims/graph-tools.js'),
  'atom-builder': () => import('../sims/charge-sims.js'),
  'charge-forces': () => import('../sims/charge-sims.js'),
  'rubbing-lab': () => import('../sims/charge-sims.js'),
  'induction-steps': () => import('../sims/charge-sims.js'),
  'material-tester': () => import('../sims/conductor-sims.js'),
  'electron-drift': () => import('../sims/conductor-sims.js'),
  'wire-resistance': () => import('../sims/conductor-sims.js'),
  'symbol-spotter': () => import('../sims/circuit-sims.js'),
  'series-parallel': () => import('../sims/circuit-sims.js'),
  'meter-placement': () => import('../sims/circuit-sims.js'),
  'mixed-circuit': () => import('../sims/circuit-sims.js'),
};

/**
 * Mount every sim placeholder inside a container.
 * @param {Element} root Container.
 * @returns {Promise<() => void>} Cleanup for all mounted sims.
 */
export async function mountSims(root) {
  const cleanups = [];
  for (const el of $$('.sim-mount[data-sim]', root)) {
    const id = el.dataset.sim;
    const load = LOADERS[id];
    if (!load) { el.innerHTML = `<p class="muted">Interactive “${id}” is coming soon.</p>`; continue; }
    try {
      const mod = await load();
      let used = false;
      const ctx = { onUse: () => { if (!used) { used = true; markSim(id); } } };
      el.addEventListener('pointerdown', ctx.onUse, { once: true });
      el.addEventListener('keydown', ctx.onUse, { once: true });
      const fn = mod.mount(el, id, ctx);
      if (typeof fn === 'function') cleanups.push(fn);
    } catch (err) {
      console.error(err);
      el.innerHTML = '<p class="muted">This interactive could not load. Check your connection and reload the page.</p>';
    }
  }
  return () => cleanups.forEach((f) => { try { f(); } catch { /* ignore */ } });
}
