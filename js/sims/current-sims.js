/**
 * current-sims.js — Chapter 4 interactives: charge-flow (Q = It) and energy-lift (V = ΔE/q).
 */
import { $, reducedMotion } from '../utils/dom.js';
import { svg, label } from '../utils/svg.js';
import { sig } from '../utils/math.js';

const E_CHARGE = 1.6e-19;

/**
 * Write a large number in scientific notation with a ×10 power.
 * @param {number} x Value.
 * @param {number} [sf=3] Significant figures.
 * @returns {string} HTML.
 */
function sci(x, sf = 3) {
  if (x === 0) return '0';
  const p = Math.floor(Math.log10(Math.abs(x)));
  const m = x / 10 ** p;
  return `${m.toFixed(sf - 1)} × 10<sup>${p}</sup>`;
}

/**
 * Charge counter: each dot is one coulomb passing a counting gate.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {() => void} Cleanup.
 */
function chargeFlow(el, ctx) {
  el.innerHTML = `<div class="sim-ui"><div class="plot"></div>
    <div class="sim-row"><label>Current <input type="range" class="I" min="1" max="30" value="10"></label><span class="Iv"></span></div>
    <div class="sim-row"><label>Run for <select class="T"><option value="5">5 s</option><option value="10" selected>10 s</option><option value="20">20 s</option></select></label>
      <button type="button" class="btn primary small go">Start</button><button type="button" class="btn ghost small reset">Reset</button></div>
    <div class="sim-out out"></div></div>`;
  let raf = 0;
  let running = false;
  let t = 0;
  let last = 0;
  let offset = 0;
  const W = 520;
  const gateX = 300;
  const I = () => Number($('.I', el).value) / 10;
  const T = () => Number($('.T', el).value);

  const draw = () => {
    const spacing = 60;
    let dots = '';
    for (let x = -spacing + (offset % spacing); x < W; x += spacing) {
      if (x < 20 || x > W - 20) continue;
      dots += `<circle cx="${x.toFixed(1)}" cy="70" r="11" class="fill-glow"/><text x="${x.toFixed(1)}" y="75" text-anchor="middle" class="lbl small bold">1 C</text>`;
    }
    const inner = `<rect x="10" y="48" width="${W - 20}" height="44" rx="22" class="fill-soft"/>${dots}` +
      `<line x1="${gateX}" y1="30" x2="${gateX}" y2="110" class="dash" style="stroke:var(--bad);stroke-width:2.5"/>` +
      label(gateX, 24, 'counting point', { cls: 'bold' }) + label(60, 130, 'conventional current →', { cls: 'small' });
    $('.plot', el).innerHTML = svg(W, 140, inner, { title: 'Coulombs of charge flowing past a point in a wire', maxw: 560 });
  };
  const text = () => {
    const q = I() * t;
    $('.Iv', el).textContent = `${I().toFixed(1)} A`;
    $('.out', el).innerHTML = `Time <b>${t.toFixed(1)} s</b> · charge past the point <b>Q = It = ${I().toFixed(1)} × ${t.toFixed(1)} = ${sig(q, 3)} C</b><br>` +
      `That is about <b>${sci(q / E_CHARGE || 0)}</b> electrons (each coulomb is 6.25 × 10<sup>18</sup> electrons). Each glowing dot stands for one whole coulomb, so <b>${I().toFixed(1)} dots pass every second</b>.`;
  };
  const frame = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (running) {
      t = Math.min(T(), t + dt);
      offset += I() * 60 * dt; // 60 px spacing → I dots per second
      if (t >= T()) running = false;
      draw();
      text();
    }
    if (running) raf = requestAnimationFrame(frame);
  };
  el.addEventListener('click', (ev) => {
    if (ev.target.closest('.go')) {
      ctx.onUse();
      if (t >= T()) t = 0;
      if (reducedMotion()) { t = T(); offset += I() * 60 * T(); draw(); text(); return; }
      running = true;
      last = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    }
    if (ev.target.closest('.reset')) { running = false; t = 0; offset = 0; draw(); text(); }
  });
  el.addEventListener('input', () => { text(); });
  draw();
  text();
  return () => cancelAnimationFrame(raf);
}

/**
 * Energy "hill": a coulomb gains ΔE = εq in the battery and loses it in two series resistors.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function energyLift(el, ctx) {
  el.innerHTML = `<div class="sim-ui"><div class="plot"></div>
    <div class="sim-row"><label>Battery voltage <input type="range" class="V" min="3" max="24" value="12"></label><span class="Vv"></span></div>
    <div class="sim-row"><label>R₁ <select class="R1">${[2, 4, 6, 8, 10, 12].map((r) => `<option ${r === 4 ? 'selected' : ''}>${r}</option>`).join('')}</select> Ω</label>
      <label>R₂ <select class="R2">${[2, 4, 6, 8, 10, 12].map((r) => `<option ${r === 8 ? 'selected' : ''}>${r}</option>`).join('')}</select> Ω</label>
      <label>Charge q <select class="q"><option value="1">1 C</option><option value="5">5 C</option><option value="60">60 C</option></select></label></div>
    <div class="sim-out out"></div></div>`;
  const draw = () => {
    const V = Number($('.V', el).value) / 2;
    const r1 = Number($('.R1', el).value);
    const r2 = Number($('.R2', el).value);
    const q = Number($('.q', el).value);
    const v1 = (V * r1) / (r1 + r2);
    const v2 = V - v1;
    $('.Vv', el).textContent = `${V.toFixed(1)} V`;
    const H = 230;
    const base = 190;
    const scale = 140 / 12;
    const y = (e) => base - e * scale;
    const pts = [[40, y(0)], [110, y(0)], [140, y(V)], [200, y(V)], [250, y(V - v1)], [320, y(V - v1)], [370, y(0)], [450, y(0)]];
    let inner = `<line x1="30" y1="${base}" x2="470" y2="${base}" class="thin"/>` +
      `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" style="stroke:var(--blue);stroke-width:4"/>` +
      `<rect x="108" y="${y(V)}" width="34" height="${base - y(V)}" class="fill-green" style="opacity:.55"/>` +
      label(125, base + 18, 'battery', { cls: 'small bold' }) + label(225, base + 18, 'R₁', { cls: 'small bold' }) + label(345, base + 18, 'R₂', { cls: 'small bold' }) +
      label(170, y(V) - 10, `+${sig(V * q, 3)} J`, { cls: 'bold' }) + label(262, (y(V) + y(V - v1)) / 2 + 4, `−${sig(v1 * q, 3)} J`, { anchor: 'start', cls: 'bold' }) +
      label(382, (y(V - v1) + y(0)) / 2 + 4, `−${sig(v2 * q, 3)} J`, { anchor: 'start', cls: 'bold' });
    inner += `<circle cx="170" cy="${y(V) - 30}" r="0"/>`;
    inner += `<text x="14" y="${y(V)}" class="lbl small">${sig(V, 3)} V</text>`;
    $('.plot', el).innerHTML = svg(480, H, inner, { title: 'Energy per coulomb gained in the battery and lost in each resistor', maxw: 540 });
    $('.out', el).innerHTML = `Each coulomb gains <b>${sig(V, 3)} J</b> in the battery and gives it all away: <b>${sig(v1, 3)} J in R₁</b> and <b>${sig(v2, 3)} J in R₂</b>. So V₁ = ${sig(v1, 3)} V and V₂ = ${sig(v2, 3)} V, and ${sig(v1, 3)} + ${sig(v2, 3)} = ${sig(V, 3)} V.<br>` +
      `For ${q} C of charge: ΔE = Vq → battery supplies ${sig(V, 3)} × ${q} = <b>${sig(V * q, 3)} J</b>. The bigger resistor takes the bigger share.`;
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  draw();
}

/**
 * Mount a Chapter 4 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {(() => void)|void} Cleanup.
 */
export function mount(el, id, ctx) {
  if (id === 'charge-flow') return chargeFlow(el, ctx);
  if (id === 'energy-lift') return energyLift(el, ctx);
  return undefined;
}
