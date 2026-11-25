/**
 * field-sims.js — Chapter 9 interactive: field-plates (uniform field between parallel plates,
 * E = V/d, F = Eq, ΔEp = qV, and the path of a charged particle).
 */
import { $, reducedMotion } from '../utils/dom.js';
import { svg, label, arrow } from '../utils/svg.js';

const PARTICLES = {
  electron: { n: 'Electron', q: -1.6e-19, m: 9.11e-31, v0: 3.0e7 },
  proton: { n: 'Proton', q: 1.6e-19, m: 1.67e-27, v0: 1.0e6 },
};

/**
 * Number in scientific notation as HTML.
 * @param {number} x Value.
 * @param {number} [sf=3] Significant figures.
 * @returns {string} HTML.
 */
function sci(x, sf = 3) {
  if (x === 0) return '0';
  const p = Math.floor(Math.log10(Math.abs(x)));
  if (p >= -2 && p < 4) return String(Number(x.toPrecision(sf)));
  return `${(x / 10 ** p).toFixed(sf - 1)} × 10<sup>${p}</sup>`;
}

/**
 * Parallel-plate field explorer.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {() => void} Cleanup.
 */
function plates(el, ctx) {
  let mode = 'accel';
  let kind = 'electron';
  let raf = 0;
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><button type="button" class="tgl on" data-mode="accel">Accelerate across the gap</button><button type="button" class="tgl" data-mode="deflect">Fire between the plates</button></div>
    <div class="sim-row"><button type="button" class="tgl on" data-k="electron">Electron</button><button type="button" class="tgl" data-k="proton">Proton</button><button type="button" class="btn primary small fire">Fire</button></div>
    <div class="plot"></div>
    <div class="sim-row"><label>Voltage <input type="range" class="V" min="100" max="3000" step="100" value="1000"></label><span class="Vv"></span></div>
    <div class="sim-row"><label>Plate gap <input type="range" class="d" min="2" max="8" step="1" value="4"></label><span class="dv"></span></div>
    <div class="sim-out out"></div></div>`;
  const W = 520;
  const H = 280;
  const top = 50;
  const L0 = 90;
  const L1 = 430;
  /**
   * Compute the path (in SVG coordinates) for the current settings.
   * @returns {{pts:number[][], bottom:number, info:object}} Path and numbers.
   */
  const model = () => {
    const V = Number($('.V', el).value);
    const d = Number($('.d', el).value) / 100;
    const p = PARTICLES[kind];
    const E = V / d;
    const F = E * Math.abs(p.q);
    const a = F / p.m;
    const gapPx = 40 + (d / 0.08) * 160;
    const bottom = top + gapPx;
    const pts = [];
    if (mode === 'accel') {
      const fromTop = p.q > 0; // positive charges start at the + plate (top)
      for (let i = 0; i <= 40; i++) {
        const s = (i / 40) ** 2; // constant acceleration: distance ∝ t²
        pts.push([260, fromTop ? top + 6 + s * (gapPx - 12) : bottom - 6 - s * (gapPx - 12)]);
      }
    } else {
      const Lm = 0.1;
      const ymax = d / 2;
      for (let i = 0; i <= 60; i++) {
        const x = (Lm * i) / 60;
        const t = x / p.v0;
        let y = 0.5 * a * t * t;
        if (y > ymax) y = ymax;
        // electrons are pulled up towards +, protons down towards −
        const py = (top + bottom) / 2 + (p.q < 0 ? -1 : 1) * (y / ymax) * (gapPx / 2 - 4);
        pts.push([L0 + (x / Lm) * (L1 - L0), py]);
        if (y >= ymax) break;
      }
      if (pts[pts.length - 1][0] >= L1 - 1) {
        const [x1, y1] = pts[pts.length - 1];
        const [x0, y0] = pts[pts.length - 2];
        pts.push([W - 10, y1 + ((y1 - y0) / (x1 - x0)) * (W - 10 - x1)]);
      }
    }
    return { pts, bottom, info: { V, d, E, F, a, p } };
  };
  const draw = (upto = null) => {
    const { pts, bottom, info } = model();
    const { V, d, E, F, a, p } = info;
    $('.Vv', el).textContent = `${V} V`;
    $('.dv', el).textContent = `${(d * 100).toFixed(0)} cm`;
    let inner = `<rect x="${L0}" y="${top - 12}" width="${L1 - L0}" height="12" style="fill:color-mix(in srgb, var(--bad) 30%, var(--sheet))"/>` +
      `<rect x="${L0}" y="${bottom}" width="${L1 - L0}" height="12" style="fill:color-mix(in srgb, var(--blue) 30%, var(--sheet))"/>` +
      label(L0 - 10, top - 2, `+${V} V`, { anchor: 'end', cls: 'bold' }) + label(L0 - 10, bottom + 10, '0 V', { anchor: 'end', cls: 'bold' });
    for (let x = L0 + 30; x < L1; x += 50) inner += arrow(x, top + 4, x, bottom - 4, 'field');
    const shown = upto == null ? pts : pts.slice(0, upto + 1);
    inner += `<polyline points="${shown.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ')}" class="dash" style="stroke:var(--ink-2)"/>`;
    const [cx, cy] = shown[shown.length - 1];
    inner += `<circle cx="${cx}" cy="${cy}" r="8" class="q ${p.q < 0 ? 'q-neg' : 'q-pos'}" style="fill:${p.q < 0 ? 'var(--blue)' : 'var(--bad)'};stroke:none"/>`;
    inner += label(W - 12, H - 8, 'field E points from + to −', { anchor: 'end', cls: 'small' });
    $('.plot', el).innerHTML = svg(W, H, inner, { title: 'Charged particle between parallel plates', maxw: 560 });
    const dE = Math.abs(p.q) * V;
    const v = Math.sqrt((2 * dE) / p.m);
    $('.out', el).innerHTML = `Field strength <b>E = V/d = ${V} ÷ ${d} = ${sci(E)} V m⁻¹</b> (the same everywhere between the plates).<br>` +
      `Force on the ${p.n.toLowerCase()}: <b>F = Eq = ${sci(E)} × 1.6 × 10<sup>−19</sup> = ${sci(F)} N</b>, ${p.q < 0 ? 'towards the + plate (against the field)' : 'towards the − plate (along the field)'}. Acceleration a = F/m = ${sci(a)} m s⁻².<br>` +
      (mode === 'accel' ? `Crossing the whole gap it gains <b>ΔE = qV = ${sci(dE)} J</b> of kinetic energy (the gap size does not matter!), reaching about ${sci(v)} m s⁻¹.` :
        'It keeps its forward speed but gains sideways speed, so its path is a parabola — like a ball thrown sideways. More voltage or a smaller gap → stronger field → more bending.');
  };
  const fire = () => {
    ctx.onUse();
    cancelAnimationFrame(raf);
    const n = model().pts.length;
    if (reducedMotion()) { draw(); return; }
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(n - 1, Math.floor(((now - t0) / 1200) * n));
      draw(k);
      if (k < n - 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  el.addEventListener('click', (ev) => {
    const m = ev.target.closest('[data-mode]');
    const k = ev.target.closest('[data-k]');
    if (m) { mode = m.dataset.mode; el.querySelectorAll('[data-mode]').forEach((x) => x.classList.toggle('on', x === m)); fire(); }
    if (k) { kind = k.dataset.k; el.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('on', x === k)); fire(); }
    if (ev.target.closest('.fire')) fire();
  });
  draw();
  return () => cancelAnimationFrame(raf);
}

/**
 * Mount a Chapter 9 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {(() => void)|void} Cleanup.
 */
export function mount(el, id, ctx) {
  if (id === 'field-plates') return plates(el, ctx);
  return undefined;
}
