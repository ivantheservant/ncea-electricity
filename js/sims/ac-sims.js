/**
 * ac-sims.js — Chapter 8 interactives: ac-scope (DC, AC, rms and rectification on an
 * oscilloscope-style screen) and grid-loss (transmission voltage and I²R loss).
 */
import { $ } from '../utils/dom.js';
import { svg, label } from '../utils/svg.js';
import { sig, eng } from '../utils/math.js';

const MODES = {
  dc: 'DC (battery)',
  ac: 'AC',
  half: 'Half-wave rectified',
  full: 'Full-wave rectified',
  smooth: 'Full-wave + smoothing',
};

/**
 * Oscilloscope-style voltage–time display.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function scope(el, ctx) {
  let mode = 'ac';
  el.innerHTML = `<div class="sim-ui"><div class="sim-row">${Object.entries(MODES).map(([k, n]) => `<button type="button" class="tgl ${k === mode ? 'on' : ''}" data-m="${k}">${n}</button>`).join('')}</div>
    <div class="plot"></div>
    <div class="sim-row"><label>Peak voltage <input type="range" class="vp" min="1" max="12" step="0.5" value="10"></label><span class="vpv"></span></div>
    <div class="sim-row"><label>Frequency <input type="range" class="f" min="25" max="100" step="5" value="50"></label><span class="fv"></span></div>
    <div class="sim-row"><label><input type="checkbox" class="rms" checked> Show rms line</label></div>
    <div class="sim-out out"></div></div>`;
  const draw = () => {
    const vp = Number($('.vp', el).value);
    const f = Number($('.f', el).value);
    const showRms = $('.rms', el).checked;
    $('.vpv', el).textContent = `${vp} V`;
    $('.fv', el).textContent = `${f} Hz`;
    const W = 520;
    const H = 260;
    const P = { l: 46, r: 12, t: 12, b: 34 };
    const tmax = 0.04;
    const X = (t) => P.l + (t / tmax) * (W - P.l - P.r);
    const Y = (v) => P.t + ((12 - v) / 24) * (H - P.t - P.b);
    const wave = (t) => {
      const s = vp * Math.sin(2 * Math.PI * f * t);
      if (mode === 'dc') return vp;
      if (mode === 'ac') return s;
      if (mode === 'half') return Math.max(0, s);
      if (mode === 'full') return Math.abs(s);
      // smoothing: capacitor discharges between peaks (simple exponential model)
      const T2 = 1 / (2 * f);
      const ph = t % T2;
      const tp = T2 / 2;
      const droop = vp * Math.exp(-(ph < tp ? ph + T2 - tp : ph - tp) / 0.03);
      return Math.max(Math.abs(s), droop);
    };
    let grid = '';
    for (let i = 0; i <= 8; i++) grid += `<line x1="${X((tmax / 8) * i)}" y1="${P.t}" x2="${X((tmax / 8) * i)}" y2="${H - P.b}" class="thin" style="stroke:var(--line)"/>` + label(X((tmax / 8) * i), H - P.b + 15, String((tmax / 8) * i * 1000), { cls: 'small' });
    for (const v of [-12, -8, -4, 0, 4, 8, 12]) grid += `<line x1="${P.l}" y1="${Y(v)}" x2="${W - P.r}" y2="${Y(v)}" class="thin" style="stroke:${v === 0 ? 'var(--ink-3)' : 'var(--line)'}"/>` + label(P.l - 6, Y(v) + 4, String(v), { anchor: 'end', cls: 'small' });
    let d = '';
    for (let i = 0; i <= 400; i++) {
      const t = (tmax * i) / 400;
      d += `${i ? 'L' : 'M'}${X(t).toFixed(1)},${Y(wave(t)).toFixed(1)}`;
    }
    const rms = mode === 'dc' ? vp : mode === 'half' ? vp / 2 : mode === 'smooth' ? vp * 0.85 : vp / Math.SQRT2;
    let inner = grid + `<path d="${d}" style="stroke:var(--blue);stroke-width:3"/>`;
    if (showRms && mode !== 'dc') inner += `<line x1="${P.l}" y1="${Y(rms)}" x2="${W - P.r}" y2="${Y(rms)}" class="dash" style="stroke:var(--bad);stroke-width:2"/>` + label(W - P.r - 4, Y(rms) - 6, `rms ≈ ${sig(rms, 3)} V`, { anchor: 'end', cls: 'small bold' });
    inner += label((W + P.l) / 2, H - 4, 'time (ms)') + `<text x="13" y="${(H - P.b + P.t) / 2}" text-anchor="middle" class="lbl" transform="rotate(-90 13 ${(H - P.b + P.t) / 2})">voltage (V)</text>`;
    $('.plot', el).innerHTML = svg(W, H, inner, { title: `${MODES[mode]} voltage against time`, maxw: 560 });
    const T = 1 / f;
    const notes = {
      dc: 'A steady voltage that never changes direction: the current always flows the same way.',
      ac: `The voltage reverses direction every half-cycle. Period T = 1/f = 1/${f} = <b>${sig(T * 1000, 3)} ms</b>. Peak ${vp} V → rms = V<sub>peak</sub>/√2 = <b>${sig(vp / Math.SQRT2, 3)} V</b>: this AC heats a resistor exactly as much as ${sig(vp / Math.SQRT2, 3)} V DC would.`,
      half: 'One diode blocks the negative half-cycles, so the current only flows one way — but it is switched off half the time.',
      full: `A bridge of four diodes flips the negative half-cycles over, giving ${2 * f} bumps per second, all in one direction.`,
      smooth: 'A capacitor charges up at each peak and supplies current while the voltage falls, so the output is nearly steady DC with a small “ripple”.',
    };
    $('.out', el).innerHTML = notes[mode];
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-m]');
    if (!b) return;
    ctx.onUse();
    mode = b.dataset.m;
    el.querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('on', x === b));
    draw();
  });
  draw();
}

const VOLTAGES = [11e3, 33e3, 110e3, 220e3, 400e3];

/**
 * Transmission line loss explorer.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function gridLoss(el, ctx) {
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><label>Power sent <select class="P"><option value="50">50 MW</option><option value="100" selected>100 MW</option><option value="500">500 MW</option></select></label>
    <label>Line resistance <select class="R"><option value="2">2 Ω</option><option value="5" selected>5 Ω</option><option value="10">10 Ω</option></select></label></div>
    <div class="sim-row"><label>Transmission voltage <input type="range" class="V" min="0" max="4" step="1" value="1"></label><span class="Vv"></span></div>
    <div class="plot"></div><div class="sim-out out"></div></div>`;
  const draw = () => {
    const P = Number($('.P', el).value) * 1e6;
    const R = Number($('.R', el).value);
    const V = VOLTAGES[Number($('.V', el).value)];
    const I = P / V;
    const loss = I * I * R;
    const frac = loss / P;
    $('.Vv', el).textContent = eng(V, 'V');
    const W = 480;
    const full = 400;
    const lossW = Math.min(1, frac) * full;
    const inner = `<rect x="40" y="30" width="${full}" height="34" class="fill-soft"/><rect x="40" y="30" width="${full - lossW}" height="34" class="fill-green"/>` +
      `<rect x="${40 + full - lossW}" y="30" width="${lossW}" height="34" class="fill-pink"/>` +
      label(40, 22, 'power station', { anchor: 'start', cls: 'small bold' }) + label(440, 22, 'town', { anchor: 'end', cls: 'small bold' }) +
      label(240, 88, frac >= 1 ? 'More than all the power would be lost — impossible to deliver!' : `${sig((1 - frac) * 100, 3)}% delivered, ${sig(frac * 100, 3)}% lost as heat`, { cls: 'bold' });
    $('.plot', el).innerHTML = svg(W, 100, inner, { title: 'Share of power delivered and lost', maxw: 520 });
    $('.out', el).innerHTML = `Current: I = P/V = ${eng(P, 'W')} ÷ ${eng(V, 'V')} = <b>${eng(I, 'A')}</b>.<br>Heat lost in the lines: P<sub>loss</sub> = I²R = (${sig(I, 3)})² × ${R} = <b>${eng(loss, 'W')}</b>.<br>` +
      'Raise the voltage one step and watch: the current falls in proportion, but the loss falls with the <b>square</b> of the current.';
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  draw();
}

/**
 * Mount a Chapter 8 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {(() => void)|void} Cleanup.
 */
export function mount(el, id, ctx) {
  if (id === 'ac-scope') return scope(el, ctx);
  if (id === 'grid-loss') return gridLoss(el, ctx);
  return undefined;
}
