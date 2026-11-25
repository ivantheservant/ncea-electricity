/**
 * divider-sims.js — Chapter 10 and 11 interactives: emf-lab (EMF and internal resistance,
 * V = ε − Ir) and divider-lab (potential dividers with fixed resistors, a potentiometer or a sensor).
 */
import { $ } from '../utils/dom.js';
import { svg, comp, wire, label, dot } from '../utils/svg.js';
import { eng, sig } from '../utils/math.js';
import { plot } from './ohm-sims.js';

const CELLS = {
  aa: { n: 'New AA cell', e: 1.5, r: 0.2 },
  old: { n: 'Old AA cell', e: 1.4, r: 2.0 },
  pack: { n: '9 V battery', e: 9.0, r: 1.5 },
  car: { n: 'Car battery', e: 12.6, r: 0.02 },
  lemon: { n: 'Lemon cell', e: 0.9, r: 600 },
};

/**
 * EMF and internal resistance lab.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function emfLab(el, ctx) {
  let key = 'pack';
  let readings = [];
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><label>Source <select class="src">${Object.entries(CELLS).map(([k, c]) => `<option value="${k}" ${k === key ? 'selected' : ''}>${c.n}</option>`).join('')}</select></label></div>
    <div class="ohm-grid"><div class="circ"></div><div class="graph"></div></div>
    <div class="sim-row"><label>Load resistance <input type="range" class="R" min="0" max="100" value="60"></label><span class="Rv"></span>
      <button type="button" class="btn primary small rec">Record reading</button><button type="button" class="btn ghost small clr">Clear</button></div>
    <div class="sim-out out"></div></div>`;
  const loadR = () => {
    const c = CELLS[key];
    const s = Number($('.R', el).value) / 100;
    return c.r * 0.05 * 10 ** (s * 3.3); // from 0.05r to about 100r (log scale)
  };
  const draw = () => {
    const c = CELLS[key];
    const R = loadR();
    const I = c.e / (R + c.r);
    const V = I * R;
    $('.Rv', el).textContent = eng(R, 'Ω');
    const circ = `<rect x="40" y="60" width="90" height="90" rx="10" class="dash fill-soft"/>` + comp('cell', 85, 140, 85, 100, { signs: true }) + comp('resistor', 85, 100, 85, 70, {}) +
      label(85, 54, 'battery', { cls: 'small bold' }) + label(135, 125, `ε = ${c.e} V`, { anchor: 'start', cls: 'small' }) + label(135, 92, `r = ${eng(c.r, 'Ω')}`, { anchor: 'start', cls: 'small' }) +
      wire([85, 70], [85, 30], [200, 30]) + comp('ammeter', 200, 30, 260, 30) + wire([260, 30], [300, 30]) + comp('variable', 300, 30, 300, 180, { label: 'load R', labelPos: 'right' }) + wire([300, 180], [85, 180], [85, 140]) +
      wire([60, 30], [20, 30], [20, 90]) + comp('voltmeter', 20, 90, 20, 140) + wire([20, 140], [20, 180], [85, 180]) + dot(85, 30) + dot(85, 180) +
      label(230, 60, eng(I, 'A'), { cls: 'bold' }) + label(30, 200, `${sig(V, 3)} V`, { anchor: 'start', cls: 'bold' });
    $('.circ', el).innerHTML = svg(380, 210, wire([60, 30], [85, 30]) + circ, { title: 'Battery with internal resistance connected to a variable load, voltmeter across the terminals', maxw: 420 });
    const Imax = c.e / c.r;
    $('.graph', el).innerHTML = plot({ xmin: 0, xmax: Imax, ymin: 0, ymax: c.e * 1.1, xl: 'Current I (A)', yl: 'Terminal voltage V (V)', xTicks: [0, Imax / 4, Imax / 2, (3 * Imax) / 4, Imax].map((x) => +x.toPrecision(2)), yTicks: [0, c.e / 2, c.e].map((y) => +y.toPrecision(2)), pts: readings.map((q) => [q.I, q.V]), mark: [I, V], curve: readings.length >= 3 ? (x) => c.e - x * c.r : null });
    $('.out', el).innerHTML = `Terminal voltage <b>V = ε − Ir = ${c.e} − ${sig(I, 3)} × ${sig(c.r, 3)} = ${sig(V, 3)} V</b>. “Lost volts” inside the battery: Ir = <b>${sig(c.e - V, 3)} V</b>.<br>` +
      (readings.length >= 3 ? `The best-fit line meets the V-axis at <b>ε = ${c.e} V</b> (zero current) and its gradient is <b>−r = −${sig(c.r, 3)} Ω</b>. Short-circuit current (V = 0) would be ε/r = ${eng(Imax, 'A')}.` : 'Record readings at several load resistances to draw the V–I line.');
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  el.addEventListener('change', (ev) => { if (ev.target.classList.contains('src')) { key = ev.target.value; readings = []; draw(); } });
  el.addEventListener('click', (ev) => {
    if (ev.target.closest('.rec')) {
      ctx.onUse();
      const c = CELLS[key];
      const R = loadR();
      const I = c.e / (R + c.r);
      readings.push({ I, V: I * R });
      draw();
    }
    if (ev.target.closest('.clr')) { readings = []; draw(); }
  });
  draw();
}

/**
 * Potential divider lab.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function dividerLab(el, ctx) {
  let mode = 'fixed';
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><button type="button" class="tgl on" data-m="fixed">Two resistors</button><button type="button" class="tgl" data-m="pot">Potentiometer</button><button type="button" class="tgl" data-m="ldr">LDR sensor</button><button type="button" class="tgl" data-m="therm">Thermistor sensor</button></div>
    <div class="ohm-grid"><div class="circ"></div><div class="ctrl"></div></div>
    <div class="sim-row"><label>Load across the output <select class="load"><option value="0">none</option><option value="1000">1 kΩ</option><option value="10000">10 kΩ</option><option value="100000">100 kΩ</option></select></label>
      <label><input type="checkbox" class="swap"> Swap positions (sensor/R₁ on the bottom)</label></div>
    <div class="sim-out out"></div></div>`;
  const vals = { vin: 9, r1: 10000, r2: 4700, pos: 50, lux: 50, temp: 50 };
  const opts = [100, 470, 1000, 2200, 4700, 10000, 22000, 47000, 100000];
  const sel = (name, v) => `<select data-v="${name}">${opts.map((o) => `<option value="${o}" ${o === v ? 'selected' : ''}>${eng(o, 'Ω')}</option>`).join('')}</select>`;
  const controls = () => {
    let h = `<div class="sim-row"><label>V<sub>in</sub> <select data-v="vin">${[5, 6, 9, 12].map((v) => `<option ${v === vals.vin ? 'selected' : ''}>${v}</option>`).join('')}</select> V</label></div>`;
    if (mode === 'fixed') h += `<div class="sim-row"><label>R₁ (top) ${sel('r1', vals.r1)}</label></div><div class="sim-row"><label>R₂ (bottom) ${sel('r2', vals.r2)}</label></div>`;
    if (mode === 'pot') h += `<div class="sim-row"><label>Slider position <input type="range" data-v="pos" min="0" max="100" value="${vals.pos}"></label></div><p class="muted small">A 10 kΩ track: the slider splits it into a top part and a bottom part.</p>`;
    if (mode === 'ldr') h += `<div class="sim-row"><label>Light level <input type="range" data-v="lux" min="0" max="100" value="${vals.lux}"></label></div><div class="sim-row"><label>Fixed resistor ${sel('r2', vals.r2)}</label></div>`;
    if (mode === 'therm') h += `<div class="sim-row"><label>Temperature <input type="range" data-v="temp" min="0" max="100" value="${vals.temp}"></label></div><div class="sim-row"><label>Fixed resistor ${sel('r2', vals.r2)}</label></div>`;
    $('.ctrl', el).innerHTML = h;
  };
  const draw = () => {
    const swap = $('.swap', el).checked;
    const RL = Number($('.load', el).value);
    let top;
    let bot;
    let note = '';
    let topType = 'resistor';
    let botType = 'resistor';
    if (mode === 'fixed') { top = vals.r1; bot = vals.r2; }
    if (mode === 'pot') { top = Math.max(1, 10000 * (1 - vals.pos / 100)); bot = Math.max(1, 10000 * (vals.pos / 100)); note = `Slider ${vals.pos}% of the way up.`; }
    if (mode === 'ldr') {
      const lux = 10 ** ((vals.lux / 100) * 4);
      const s = 1e6 * lux ** -0.75;
      note = `${sig(lux, 2)} lux → LDR = ${eng(s, 'Ω')}.`;
      if (swap) { top = vals.r2; bot = s; botType = 'ldr'; } else { top = s; bot = vals.r2; topType = 'ldr'; }
    }
    if (mode === 'therm') {
      const c = vals.temp;
      const s = 10000 * Math.exp(3950 * (1 / (c + 273.15) - 1 / 298.15));
      note = `${c} °C → thermistor = ${eng(s, 'Ω')}.`;
      if (swap) { top = vals.r2; bot = s; botType = 'thermistor'; } else { top = s; bot = vals.r2; topType = 'thermistor'; }
    }
    if (mode === 'fixed' && swap) { [top, bot] = [bot, top]; }
    const botEff = RL ? (bot * RL) / (bot + RL) : bot;
    const vout = vals.vin * (botEff / (top + botEff));
    const vNoLoad = vals.vin * (bot / (top + bot));
    let circ = comp('battery', 40, 200, 40, 30, { signs: true, label: `${vals.vin} V`, labelPos: 'left' }) + wire([40, 30], [160, 30]);
    if (mode === 'pot') {
      circ += comp('variable', 160, 30, 160, 200, {}) + `<line x1="215" y1="${200 - (vals.pos / 100) * 150 - 10}" x2="175" y2="${200 - (vals.pos / 100) * 150 - 10}" marker-end="url(#arrowhead)"/>` + wire([215, 190 - (vals.pos / 100) * 150], [260, 190 - (vals.pos / 100) * 150], [260, 115]);
    } else {
      circ += comp(topType, 160, 30, 160, 115, { label: `${topType === 'resistor' ? 'R₁' : topType.toUpperCase()} ${eng(top, 'Ω')}`, labelPos: 'right' }) + comp(botType, 160, 115, 160, 200, { label: `${botType === 'resistor' ? 'R₂' : botType.toUpperCase()} ${eng(bot, 'Ω')}`, labelPos: 'right' }) + wire([160, 115], [260, 115]) + dot(160, 115);
    }
    circ += wire([160, 200], [40, 200]) + wire([160, 200], [300, 200]) + dot(160, 200) + `<circle cx="300" cy="115" r="4" class="solid"/><circle cx="300" cy="200" r="4" class="solid"/>` + wire([260, 115], [300, 115]);
    if (RL) circ += comp('resistor', 330, 115, 330, 200, { label: `load ${eng(RL, 'Ω')}`, labelPos: 'right' }) + wire([300, 115], [330, 115]) + wire([300, 200], [330, 200]);
    circ += label(300, 105, `V_out = ${sig(vout, 3)} V`, { anchor: 'middle', cls: 'bold' });
    $('.circ', el).innerHTML = svg(430, 220, circ.replaceAll('V_out', 'Vout'), { title: 'Potential divider with output across the bottom component', maxw: 460 });
    $('.out', el).innerHTML = `${note} V<sub>out</sub> = V<sub>in</sub> × R<sub>bottom</sub> / (R<sub>top</sub> + R<sub>bottom</sub>) = ${vals.vin} × ${eng(botEff, 'Ω')} / (${eng(top, 'Ω')} + ${eng(botEff, 'Ω')}) = <b>${sig(vout, 3)} V</b>.` +
      (RL ? `<br>Without the load it would be ${sig(vNoLoad, 3)} V. The load is in parallel with the bottom resistor and lowers its effective resistance, so V<sub>out</sub> drops — less so when the load resistance is much bigger than R<sub>bottom</sub>.` : '') +
      (mode === 'ldr' ? `<br>${swap ? 'LDR on the bottom: brighter → LDR resistance falls → V<sub>out</sub> falls. Darker → V<sub>out</sub> rises (a “turn on at night” circuit).' : 'LDR on top: brighter → top resistance falls → bigger share for the bottom resistor → V<sub>out</sub> rises.'}` : '') +
      (mode === 'therm' ? `<br>${swap ? 'Thermistor on the bottom: hotter → its resistance falls → V<sub>out</sub> falls.' : 'Thermistor on top: hotter → top resistance falls → V<sub>out</sub> rises (a fire-alarm style circuit).'}` : '');
  };
  el.addEventListener('input', (ev) => {
    ctx.onUse();
    const k = ev.target.dataset.v;
    if (k) vals[k] = Number(ev.target.value);
    draw();
  });
  el.addEventListener('change', (ev) => { const k = ev.target.dataset.v; if (k) vals[k] = Number(ev.target.value); draw(); });
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-m]');
    if (!b) return;
    ctx.onUse();
    mode = b.dataset.m;
    el.querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('on', x === b));
    controls();
    draw();
  });
  controls();
  draw();
}

/**
 * Mount a Chapter 10/11 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {(() => void)|void} Cleanup.
 */
export function mount(el, id, ctx) {
  if (id === 'emf-lab') return emfLab(el, ctx);
  if (id === 'divider-lab') return dividerLab(el, ctx);
  return undefined;
}
