/**
 * ohm-sims.js — Chapter 5 interactives: ohm-lab (virtual I–V experiment) and sensor-lab (LDR and thermistor).
 */
import { $ } from '../utils/dom.js';
import { svg, comp, wire, label, dot } from '../utils/svg.js';
import { eng, sig } from '../utils/math.js';

/**
 * Generic x–y plot with axes through the origin (supports negative x).
 * @param {object} o Options: w, h, xmin, xmax, ymin, ymax, xl, yl, curve (fn), pts ([[x,y]]), mark ([x,y]), xTicks, yTicks, yFmt, xFmt, log (x log scale).
 * @returns {string} SVG element.
 */
function plot(o) {
  const W = o.w || 360;
  const H = o.h || 240;
  const P = { l: 50, r: 16, t: 14, b: 40 };
  const lx = (x) => (o.log ? Math.log10(x) : x);
  const X = (x) => P.l + ((lx(x) - lx(o.xmin)) / (lx(o.xmax) - lx(o.xmin))) * (W - P.l - P.r);
  const Y = (y) => H - P.b - ((y - o.ymin) / (o.ymax - o.ymin)) * (H - P.t - P.b);
  const x0 = o.xmin < 0 ? X(0) : P.l;
  const y0 = o.ymin < 0 ? Y(0) : H - P.b;
  let s = `<rect x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}" class="fill-sheet thin" style="stroke:var(--line)"/>`;
  for (const xv of o.xTicks) s += `<line x1="${X(xv)}" y1="${P.t}" x2="${X(xv)}" y2="${H - P.b}" class="thin" style="stroke:var(--line)"/><text x="${X(xv)}" y="${H - P.b + 15}" text-anchor="middle" class="lbl small">${(o.xFmt || String)(xv)}</text>`;
  for (const yv of o.yTicks) s += `<line x1="${P.l}" y1="${Y(yv)}" x2="${W - P.r}" y2="${Y(yv)}" class="thin" style="stroke:var(--line)"/><text x="${P.l - 6}" y="${Y(yv) + 4}" text-anchor="end" class="lbl small">${(o.yFmt || String)(yv)}</text>`;
  s += `<line x1="${P.l}" y1="${y0}" x2="${W - P.r}" y2="${y0}"/><line x1="${x0}" y1="${P.t}" x2="${x0}" y2="${H - P.b}"/>`;
  if (o.curve) {
    let d = '';
    for (let i = 0; i <= 160; i++) {
      const x = o.log ? 10 ** (lx(o.xmin) + ((lx(o.xmax) - lx(o.xmin)) * i) / 160) : o.xmin + ((o.xmax - o.xmin) * i) / 160;
      const y = Math.max(o.ymin, Math.min(o.ymax, o.curve(x)));
      d += `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`;
    }
    s += `<path d="${d}" class="${o.curveCls || 'dash'}" style="stroke:var(--ink-3)"/>`;
  }
  for (const [x, y] of o.pts || []) s += `<circle cx="${X(x)}" cy="${Y(y)}" r="4.5" class="solid" style="fill:var(--blue);stroke:none"/>`;
  if (o.mark) s += `<circle cx="${X(o.mark[0])}" cy="${Y(Math.max(o.ymin, Math.min(o.ymax, o.mark[1])))}" r="7" style="fill:var(--glow);stroke:var(--ink)"/>`;
  s += `<text x="${(W + P.l) / 2}" y="${H - 6}" text-anchor="middle" class="lbl">${o.xl}</text>`;
  s += `<text x="13" y="${(H - P.b + P.t) / 2}" text-anchor="middle" class="lbl" transform="rotate(-90 13 ${(H - P.b + P.t) / 2})">${o.yl}</text>`;
  return svg(W, H, s, { title: `${o.yl} against ${o.xl}`, maxw: 460 });
}

const COMPONENTS = {
  r10: { n: '10 Ω resistor', sym: 'resistor', vmin: -6, vmax: 6, step: 0.5, i: (v) => v / 10, imax: 0.7, note: 'Straight line through the origin: current is proportional to voltage, so the resistance is constant. This is an <b>ohmic</b> conductor.' },
  r20: { n: '20 Ω resistor', sym: 'resistor', vmin: -6, vmax: 6, step: 0.5, i: (v) => v / 20, imax: 0.7, note: 'Still a straight line through the origin, but <b>less steep</b>: a bigger resistance lets less current through at each voltage. On an I–V graph the gradient is 1/R.' },
  lamp: { n: 'Filament lamp', sym: 'bulb', vmin: -6, vmax: 6, step: 0.5, i: (v) => Math.sign(v) * 0.1024 * Math.abs(v) ** 0.6, imax: 0.35, note: 'The curve bends over: as the current rises the filament gets hotter, its metal ions vibrate more, and the resistance increases. <b>Non-ohmic.</b>' },
  diode: { n: 'Diode', sym: 'diode', vmin: -1, vmax: 0.85, step: 0.05, i: (v) => (v > 0 ? 1e-9 * (Math.exp(v / 0.045) - 1) : -1e-9), imax: 0.16, note: 'Almost no current in reverse. Forward, nothing much happens until about 0.6 V, then the current rises very steeply. <b>Non-ohmic</b>; conducts one way only.' },
  therm: { n: 'Thermistor (self-heating)', sym: 'thermistor', vmin: -6, vmax: 6, step: 0.5, i: (v) => v / (150 / (1 + 0.03 * v * v)), imax: 0.09, note: 'The curve bends upwards: the current warms the thermistor, and a warmer thermistor has <b>less</b> resistance, so the current rises faster than the voltage.' },
};

/**
 * Virtual I–V experiment with readings table and graph.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function ohmLab(el, ctx) {
  let key = 'r10';
  let readings = [];
  el.innerHTML = `<div class="sim-ui">
    <div class="sim-row"><label>Component <select class="cmp">${Object.entries(COMPONENTS).map(([k, c]) => `<option value="${k}">${c.n}</option>`).join('')}</select></label></div>
    <div class="ohm-grid"><div class="circ"></div><div class="graph"></div></div>
    <div class="sim-row"><label>Supply <input type="range" class="V"></label><span class="Vv"></span>
      <button type="button" class="btn primary small rec">Record reading</button><button type="button" class="btn ghost small clr">Clear</button><button type="button" class="btn ghost small curve">Show full curve</button></div>
    <div class="tablewrap"><table class="rd"><thead><tr><th>V (V)</th><th>I (A)</th><th>R = V/I (Ω)</th></tr></thead><tbody></tbody></table></div>
    <div class="sim-out out"></div></div>`;
  let showCurve = false;
  const setup = () => {
    const c = COMPONENTS[key];
    const r = $('.V', el);
    r.min = c.vmin; r.max = c.vmax; r.step = c.step; r.value = c.vmax > 1 ? 2 : 0.6;
    readings = [];
    showCurve = false;
  };
  const draw = () => {
    const c = COMPONENTS[key];
    const v = Number($('.V', el).value);
    const i = c.i(v);
    $('.Vv', el).textContent = `${v.toFixed(2)} V`;
    const circ = comp('battery', 40, 150, 40, 40, { signs: true, label: 'variable supply', labelPos: 'left' }) + wire([40, 40], [90, 40]) +
      comp('ammeter', 90, 40, 170, 40) + wire([170, 40], [200, 40]) + comp(c.sym, 200, 40, 280, 40, { lit: c.sym === 'bulb' ? Math.min(1, Math.abs(i) / 0.3) : undefined }) +
      wire([280, 40], [300, 40], [300, 150], [40, 150]) + wire([190, 40], [190, 95], [205, 95]) + comp('voltmeter', 205, 95, 275, 95) + wire([275, 95], [290, 95], [290, 40]) +
      dot(190, 40) + dot(290, 40) + label(130, 75, eng(Math.abs(i) < 1e-6 ? 0 : i, 'A'), { cls: 'bold' }) + label(240, 128, `${v.toFixed(2)} V`, { cls: 'bold' });
    $('.circ', el).innerHTML = svg(400, 170, `<g transform="translate(70 0)">${circ}</g>`, { title: 'Circuit with ammeter in series and voltmeter across the component', maxw: 440 });
    const xt = c.vmin < -3 ? [c.vmin, c.vmin / 2, 0, c.vmax / 2, c.vmax].map((x) => +x.toFixed(2)) : [-1, -0.5, 0, 0.4, 0.8];
    const yt = [-c.imax, -c.imax / 2, 0, c.imax / 2, c.imax].map((y) => +y.toPrecision(2));
    $('.graph', el).innerHTML = plot({ xmin: c.vmin, xmax: c.vmax, ymin: -c.imax, ymax: c.imax, xl: 'Voltage V (V)', yl: 'Current I (A)', xTicks: xt, yTicks: yt, curve: showCurve ? c.i : null, pts: readings.map((r) => [r.v, r.i]), mark: [v, i] });
    $('.rd tbody', el).innerHTML = readings.map((r) => `<tr><td>${r.v.toFixed(2)}</td><td>${Math.abs(r.i) < 1e-6 ? '0.000' : sig(r.i, 3)}</td><td>${Math.abs(r.i) < 1e-6 ? '∞ (no current)' : sig(r.v / r.i, 3)}</td></tr>`).join('') || '<tr><td colspan="3" class="muted">Press “Record reading” at several voltages.</td></tr>';
    $('.out', el).innerHTML = readings.length >= 4 || showCurve ? c.note : `Take at least 5 readings, including some negative voltages (reverse the supply). Then look at the R = V/I column: does the resistance stay the same?`;
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  el.addEventListener('change', (ev) => { if (ev.target.closest('.cmp')) { key = ev.target.value; setup(); draw(); } });
  el.addEventListener('click', (ev) => {
    if (ev.target.closest('.rec')) {
      ctx.onUse();
      const v = Number($('.V', el).value);
      readings = readings.filter((r) => r.v !== v).concat({ v, i: COMPONENTS[key].i(v) }).sort((a, b) => a.v - b.v);
      draw();
    }
    if (ev.target.closest('.clr')) { readings = []; showCurve = false; draw(); }
    if (ev.target.closest('.curve')) { showCurve = !showCurve; draw(); }
  });
  setup();
  draw();
}

/**
 * LDR and thermistor explorer with a simple series circuit.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function sensorLab(el, ctx) {
  let kind = 'ldr';
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><button type="button" class="tgl on" data-k="ldr">LDR</button><button type="button" class="tgl" data-k="therm">Thermistor</button></div>
    <div class="ohm-grid"><div class="graph"></div><div class="circ"></div></div>
    <div class="sim-row"><label class="lab"></label><input type="range" class="x" min="0" max="100" value="50"><span class="xv"></span></div>
    <div class="sim-out out"></div></div>`;
  const ldrR = (lux) => 1e6 * lux ** -0.75;
  const thR = (c) => 10000 * Math.exp(3950 * (1 / (c + 273.15) - 1 / 298.15));
  const draw = () => {
    const s = Number($('.x', el).value) / 100;
    let R;
    let graph;
    if (kind === 'ldr') {
      const lux = 10 ** (s * 4);
      R = ldrR(lux);
      $('.lab', el).textContent = 'Light level';
      $('.xv', el).textContent = `${sig(lux, 2)} lux ${lux < 5 ? '(dark night)' : lux < 100 ? '(dim room)' : lux < 1000 ? '(bright room)' : '(daylight)'}`;
      graph = plot({ xmin: 1, xmax: 10000, ymin: 0, ymax: 300, log: true, xl: 'Light level (lux, log scale)', yl: 'Resistance (kΩ)', xTicks: [1, 10, 100, 1000, 10000], yTicks: [0, 100, 200, 300], curve: (x) => ldrR(x) / 1000, curveCls: '', mark: [lux, R / 1000] });
    } else {
      const c = -10 + s * 110;
      R = thR(c);
      $('.lab', el).textContent = 'Temperature';
      $('.xv', el).textContent = `${c.toFixed(0)} °C`;
      graph = plot({ xmin: -10, xmax: 100, ymin: 0, ymax: 60, xl: 'Temperature (°C)', yl: 'Resistance (kΩ)', xTicks: [0, 25, 50, 75, 100], yTicks: [0, 20, 40, 60], curve: (x) => thR(x) / 1000, curveCls: '', mark: [c, R / 1000] });
    }
    const Rf = 10000;
    const I = 6 / (R + Rf);
    const vs = I * R;
    $('.graph', el).innerHTML = graph;
    const circ = comp('battery', 40, 150, 40, 40, { signs: true, label: '6.0 V', labelPos: 'left' }) + wire([40, 40], [80, 40]) + comp(kind === 'ldr' ? 'ldr' : 'thermistor', 80, 40, 170, 40, { label: eng(R, 'Ω') }) +
      wire([170, 40], [200, 40]) + comp('resistor', 200, 40, 280, 40, { label: '10 kΩ' }) + wire([280, 40], [300, 40], [300, 150], [40, 150]) +
      wire([75, 40], [75, 95], [90, 95]) + comp('voltmeter', 90, 95, 160, 95) + wire([160, 95], [175, 95], [175, 40]) + dot(75, 40) + dot(175, 40) + label(125, 130, `${vs.toFixed(2)} V`, { cls: 'bold' });
    $('.circ', el).innerHTML = svg(330, 170, circ, { title: 'Sensor in series with a fixed resistor', maxw: 380 });
    $('.out', el).innerHTML = `Resistance <b>${eng(R, 'Ω')}</b>. Circuit current <b>${eng(I, 'A')}</b>; voltage across the sensor <b>${vs.toFixed(2)} V</b>.<br>` +
      (kind === 'ldr' ? 'More light frees more charge carriers in the semiconductor, so the resistance <b>falls</b>. Uses: street lights that switch on at dusk, camera exposure, night lights.' :
        'Heating frees more charge carriers in the semiconductor, so the resistance <b>falls</b> (an NTC thermistor). Uses: fire alarms, oven and fridge thermostats, car engine sensors.') +
      ` Watch the voltmeter: the sensor’s share of the 6 V changes as its resistance changes — this is how sensor circuits work (Chapter 11).`;
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-k]');
    if (!b) return;
    ctx.onUse();
    kind = b.dataset.k;
    el.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('on', x === b));
    draw();
  });
  draw();
}

/**
 * Mount a Chapter 5 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {(() => void)|void} Cleanup.
 */
export function mount(el, id, ctx) {
  if (id === 'ohm-lab') return ohmLab(el, ctx);
  if (id === 'sensor-lab') return sensorLab(el, ctx);
  return undefined;
}

