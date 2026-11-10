/**
 * graph-tools.js — proportion-explorer and gradient-explorer (Chapter 0 graphs).
 */
import { $, $$ } from '../utils/dom.js';

const W = 340;
const H = 220;
const PAD = { l: 46, r: 14, t: 14, b: 38 };

/**
 * Map data to SVG coordinates.
 * @param {number} x Data x.
 * @param {number} y Data y.
 * @param {number} xmax Axis max x.
 * @param {number} ymax Axis max y.
 * @param {number} [ymin=0] Axis min y.
 * @returns {number[]} [px, py].
 */
function toPx(x, y, xmax, ymax, ymin = 0) {
  return [PAD.l + (x / xmax) * (W - PAD.l - PAD.r), H - PAD.b - ((y - ymin) / (ymax - ymin)) * (H - PAD.t - PAD.b)];
}

/**
 * Axes with ticks and labels.
 * @param {string} xl X label.
 * @param {string} yl Y label.
 * @param {number} xmax X max.
 * @param {number} ymax Y max.
 * @param {number} [ymin=0] Y min.
 * @returns {string} SVG markup.
 */
function axes(xl, yl, xmax, ymax, ymin = 0) {
  let s = `<line x1="${PAD.l}" y1="${H - PAD.b}" x2="${W - PAD.r}" y2="${H - PAD.b}"/><line x1="${PAD.l}" y1="${PAD.t}" x2="${PAD.l}" y2="${H - PAD.b}"/>`;
  for (let i = 0; i <= 4; i++) {
    const xv = (xmax / 4) * i;
    const yv = ymin + ((ymax - ymin) / 4) * i;
    const [px] = toPx(xv, 0, xmax, ymax, ymin);
    const [, py] = toPx(0, yv, xmax, ymax, ymin);
    s += `<line x1="${px}" y1="${H - PAD.b}" x2="${px}" y2="${H - PAD.b + 4}"/><text x="${px}" y="${H - PAD.b + 16}" text-anchor="middle" class="lbl small">${+xv.toFixed(2)}</text>`;
    s += `<line x1="${PAD.l - 4}" y1="${py}" x2="${PAD.l}" y2="${py}"/><text x="${PAD.l - 7}" y="${py + 4}" text-anchor="end" class="lbl small">${+yv.toFixed(2)}</text>`;
    if (i) s += `<line x1="${PAD.l}" y1="${py}" x2="${W - PAD.r}" y2="${py}" class="thin dash" style="stroke:var(--line)"/>`;
  }
  s += `<text x="${(W + PAD.l) / 2}" y="${H - 4}" text-anchor="middle" class="lbl">${xl}</text>`;
  s += `<text x="12" y="${(H - PAD.b + PAD.t) / 2}" text-anchor="middle" class="lbl" transform="rotate(-90 12 ${(H - PAD.b + PAD.t) / 2})">${yl}</text>`;
  return s;
}

const RELS = {
  direct: { name: 'Direct: V = IR (R fixed at 4 Ω)', x: 'Current I (A)', y: 'Voltage V (V)', xmax: 3, ymax: 12, f: (x) => 4 * x, xs: 'I', ys: 'V', xu: 'A', yu: 'V', note: (r) => `When I is multiplied by ${r}, V is multiplied by ${r}. Straight line through the origin: V ∝ I.` },
  inverse: { name: 'Inverse: I = V / R (V fixed at 12 V)', x: 'Resistance R (Ω)', y: 'Current I (A)', xmax: 24, ymax: 6, f: (x) => 12 / x, xs: 'R', ys: 'I', xu: 'Ω', yu: 'A', min: 2, note: (r) => `When R is multiplied by ${r}, I is divided by ${r}. A curve that never touches the axes: I ∝ 1/R.` },
  square: { name: 'Square: P = I²R (R fixed at 2 Ω)', x: 'Current I (A)', y: 'Power P (W)', xmax: 3, ymax: 18, f: (x) => 2 * x * x, xs: 'I', ys: 'P', xu: 'A', yu: 'W', note: (r) => `When I is multiplied by ${r}, P is multiplied by ${r}² = ${r * r}. A curve that gets steeper: P ∝ I².` },
};

/**
 * Proportion explorer.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function proportion(el, ctx) {
  let rel = 'direct';
  let x0 = 1;
  el.innerHTML = `<div class="sim-ui"><div class="sim-row">${Object.keys(RELS).map((k) => `<button type="button" class="tgl ${k === rel ? 'on' : ''}" data-rel="${k}">${k[0].toUpperCase() + k.slice(1)}</button>`).join('')}</div>
    <div class="plot"></div>
    <div class="sim-row"><label>Start value <input type="range" class="xr" min="0" max="100" value="33"></label><button type="button" class="btn ghost small dbl">Double it</button><button type="button" class="btn ghost small tri">Triple it</button></div>
    <div class="sim-out out"></div></div>`;
  /**
   * Draw the graph with points at x0 and k·x0.
   * @param {number} k Multiplier.
   */
  const draw = (k = 1) => {
    const R = RELS[rel];
    const xmin = R.min || 0;
    let path = '';
    for (let i = 0; i <= 80; i++) {
      const x = xmin + ((R.xmax - xmin) * i) / 80;
      const y = Math.min(R.f(x), R.ymax * 1.05);
      const [px, py] = toPx(x, y, R.xmax, R.ymax);
      path += `${i ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`;
    }
    const x1 = x0;
    const x2 = Math.min(R.xmax, x0 * k);
    const p1 = toPx(x1, R.f(x1), R.xmax, R.ymax);
    const p2 = toPx(x2, R.f(x2), R.xmax, R.ymax);
    $('.plot', el).innerHTML = `<svg class="dia" viewBox="0 0 ${W} ${H}" role="img" aria-label="${R.name}">${axes(R.x, R.y, R.xmax, R.ymax)}
      <path d="${path}" style="stroke:var(--blue);stroke-width:2.5"/>
      <circle cx="${p1[0]}" cy="${p1[1]}" r="6" class="fill-green"/>${k > 1 ? `<circle cx="${p2[0]}" cy="${p2[1]}" r="6" class="fill-pink"/>` : ''}</svg>`;
    const y1 = R.f(x1);
    const y2 = R.f(x2);
    $('.out', el).innerHTML = `<b>${R.name}</b><br>${R.xs} = ${+x1.toFixed(2)} ${R.xu} → ${R.ys} = ${+y1.toFixed(2)} ${R.yu}` +
      (k > 1 ? `<br>${R.xs} = ${+x2.toFixed(2)} ${R.xu} → ${R.ys} = ${+y2.toFixed(2)} ${R.yu}<br>${R.note(k)}` : '<br>Press “Double it” or “Triple it” to see what happens.');
  };
  const setX = () => {
    const R = RELS[rel];
    const v = Number($('.xr', el).value) / 100;
    const lo = R.min || 0.2;
    x0 = +(lo + v * (R.xmax / 3 - lo)).toFixed(2);
    draw();
  };
  el.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-rel]');
    if (t) { rel = t.dataset.rel; $$('[data-rel]', el).forEach((b) => b.classList.toggle('on', b === t)); setX(); return; }
    if (ev.target.closest('.dbl')) { ctx.onUse(); draw(2); }
    if (ev.target.closest('.tri')) { ctx.onUse(); draw(3); }
  });
  $('.xr', el).addEventListener('input', () => { ctx.onUse(); setX(); });
  setX();
}

/**
 * Gradient explorer: straight-line graphs, gradient and intercept.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function gradient(el, ctx) {
  let mode = 'ohm';
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><button type="button" class="tgl on" data-m="ohm">Resistor: V = IR</button><button type="button" class="tgl" data-m="emf">Battery: V = ε − Ir</button></div>
    <div class="plot"></div><div class="sim-row ctrls"></div><div class="sim-out out"></div></div>`;
  const vals = { R: 4, eps: 12, r: 2 };
  /** Render controls for the mode. */
  const controls = () => {
    $('.ctrls', el).innerHTML = mode === 'ohm'
      ? '<label>R <input type="range" class="sl" data-k="R" min="1" max="8" step="0.5" value="' + vals.R + '"></label>'
      : '<label>ε <input type="range" class="sl" data-k="eps" min="6" max="16" step="0.5" value="' + vals.eps + '"></label><label>r <input type="range" class="sl" data-k="r" min="0.5" max="5" step="0.5" value="' + vals.r + '"></label>';
  };
  /** Redraw graph and readout. */
  const draw = () => {
    const xmax = 4;
    const ymax = 16;
    const f = mode === 'ohm' ? (x) => vals.R * x : (x) => vals.eps - vals.r * x;
    const a = toPx(0, f(0), xmax, ymax);
    const xEnd = mode === 'ohm' ? Math.min(xmax, ymax / vals.R) : Math.min(xmax, vals.eps / vals.r);
    const b = toPx(xEnd, f(xEnd), xmax, ymax);
    const x1 = mode === 'ohm' ? Math.min(1, xEnd * 0.3) : +(xEnd * 0.25).toFixed(2);
    const x2 = mode === 'ohm' ? Math.min(3, xEnd * 0.9) : +(xEnd * 0.75).toFixed(2);
    const p1 = toPx(x1, f(x1), xmax, ymax);
    const p2 = toPx(x2, f(x2), xmax, ymax);
    const rise = f(x2) - f(x1);
    const run = x2 - x1;
    $('.plot', el).innerHTML = `<svg class="dia" viewBox="0 0 ${W} ${H}" role="img" aria-label="Straight-line graph">${axes('Current I (A)', 'Voltage V (V)', xmax, ymax)}
      <line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke:var(--blue);stroke-width:2.5"/>
      <polyline points="${p1[0]},${p1[1]} ${p2[0]},${p1[1]} ${p2[0]},${p2[1]}" class="dash" style="stroke:var(--bad)"/>
      <text x="${(p1[0] + p2[0]) / 2}" y="${p1[1] + (mode === 'ohm' ? 16 : -6)}" text-anchor="middle" class="lbl small">run ΔI = ${+run.toFixed(2)} A</text>
      <text x="${p2[0] + 6}" y="${(p1[1] + p2[1]) / 2}" class="lbl small">rise ΔV = ${+rise.toFixed(2)} V</text>
      <circle cx="${p1[0]}" cy="${p1[1]}" r="5" class="fill-green"/><circle cx="${p2[0]}" cy="${p2[1]}" r="5" class="fill-green"/>
      ${mode === 'emf' ? `<circle cx="${a[0]}" cy="${a[1]}" r="6" class="fill-pink"/><text x="${a[0] + 10}" y="${a[1] - 8}" class="lbl small">intercept = ε</text>` : ''}</svg>`;
    const grad = rise / run;
    $('.out', el).innerHTML = mode === 'ohm'
      ? `Gradient = rise ÷ run = ${+rise.toFixed(2)} V ÷ ${+run.toFixed(2)} A = <b>${+grad.toFixed(2)} Ω</b>. For a V–I graph the gradient is the resistance R. The line passes through the origin, so V ∝ I.`
      : `Gradient = ${+rise.toFixed(2)} ÷ ${+run.toFixed(2)} = <b>${+grad.toFixed(2)} Ω</b> = −r. The y-intercept is <b>ε = ${vals.eps} V</b> (the voltage when no current flows). You will meet this in Chapter 10.`;
  };
  el.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-m]');
    if (!t) return;
    mode = t.dataset.m;
    $$('[data-m]', el).forEach((b) => b.classList.toggle('on', b === t));
    controls();
    draw();
    ctx.onUse();
  });
  el.addEventListener('input', (ev) => {
    const s = ev.target.closest('.sl');
    if (!s) return;
    vals[s.dataset.k] = Number(s.value);
    ctx.onUse();
    draw();
  });
  controls();
  draw();
}

/**
 * Mount a graph tool.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {void}
 */
export function mount(el, id, ctx) {
  if (id === 'proportion-explorer') proportion(el, ctx);
  if (id === 'gradient-explorer') gradient(el, ctx);
}
