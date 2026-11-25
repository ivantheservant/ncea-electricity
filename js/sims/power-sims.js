/**
 * power-sims.js — Chapter 7 interactives: power-bill (E = Pt in kWh and cost) and
 * circuit-load (total current on a household circuit and the circuit breaker).
 */
import { $ } from '../utils/dom.js';
import { sig } from '../utils/math.js';

/**
 * Dollar amount wrapped so KaTeX does not treat $ as maths.
 * @param {string|number} v Amount.
 * @returns {string} HTML.
 */
const money = (v) => `<span class="no-math">$${v}</span>`;

const APPLIANCES = [
  { n: 'Electric hot water cylinder', p: 3000, h: 2.5 },
  { n: 'Heat pump (heating)', p: 1500, h: 4 },
  { n: 'Oil column heater', p: 2000, h: 0 },
  { n: 'Electric kettle', p: 2200, h: 0.15 },
  { n: 'Oven', p: 2400, h: 0.5 },
  { n: 'Microwave', p: 1100, h: 0.2 },
  { n: 'Clothes dryer', p: 2400, h: 0 },
  { n: 'Hair dryer', p: 1800, h: 0.1 },
  { n: 'Fridge-freezer (average)', p: 150, h: 10 },
  { n: 'TV', p: 100, h: 3 },
  { n: 'Gaming PC', p: 400, h: 2 },
  { n: 'Laptop', p: 60, h: 4 },
  { n: 'Phone charger', p: 10, h: 2 },
  { n: '10 LED bulbs (9 W each)', p: 90, h: 5 },
  { n: 'Old 60 W filament bulb', p: 60, h: 0 },
];

/**
 * Household energy and cost calculator.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function powerBill(el, ctx) {
  const hours = APPLIANCES.map((a) => a.h);
  let sel = 0;
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><label>Your price <input type="number" class="price" min="5" max="100" step="1" value="35"> c per kWh</label></div>
    <div class="app-list">${APPLIANCES.map((a, i) => `<div class="app-row" data-i="${i}"><button type="button" class="linkbtn pick" data-i="${i}">${a.n} <span class="muted small">${a.p >= 1000 ? `${a.p / 1000} kW` : `${a.p} W`}</span></button><label class="small">h/day <input type="number" class="h" data-i="${i}" min="0" max="24" step="0.05" value="${a.h}"></label><span class="kwh small"></span></div>`).join('')}</div>
    <div class="sim-out out"></div></div>`;
  const draw = () => {
    const price = Number($('.price', el).value) || 0;
    const kwh = APPLIANCES.map((a, i) => (a.p / 1000) * hours[i]);
    const total = kwh.reduce((x, y) => x + y, 0);
    const max = Math.max(...kwh);
    el.querySelectorAll('.app-row').forEach((row, i) => {
      row.classList.toggle('big', kwh[i] === max && max > 0);
      row.querySelector('.kwh').textContent = `${sig(kwh[i], 3)} kWh/day`;
    });
    const a = APPLIANCES[sel];
    const e = (a.p / 1000) * hours[sel];
    $('.out', el).innerHTML = `<b>${a.n}</b>: E = Pt = ${a.p / 1000} kW × ${hours[sel]} h = <b>${sig(e, 3)} kWh</b> a day = ${sig(e * 3.6, 3)} MJ. Cost: ${sig(e, 3)} × ${price} c = <b>${sig(e * price, 3)} c a day</b> (about ${money((e * price * 365 / 100).toFixed(0))} a year).<br>` +
      `Whole house: <b>${sig(total, 3)} kWh a day</b> → about <b>${money((total * price / 100).toFixed(2))} a day</b>, <b>${money((total * price * 7 / 100).toFixed(2))} a week</b>, ${money((total * price * 365 / 100).toFixed(0))} a year (plus the fixed daily charge on a real bill). Red outline = the biggest energy user. High-power appliances that run for a long time cost the most — heating and hot water usually top the list.`;
  };
  el.addEventListener('input', (ev) => {
    ctx.onUse();
    if (ev.target.classList.contains('h')) { const i = Number(ev.target.dataset.i); hours[i] = Math.max(0, Math.min(24, Number(ev.target.value) || 0)); sel = i; }
    draw();
  });
  el.addEventListener('click', (ev) => { const b = ev.target.closest('.pick'); if (b) { ctx.onUse(); sel = Number(b.dataset.i); draw(); } });
  draw();
}

const LOADS = [
  { n: 'Heater (2.4 kW)', p: 2400 }, { n: 'Kettle (2.2 kW)', p: 2200 }, { n: 'Toaster (900 W)', p: 900 }, { n: 'Microwave (1.1 kW)', p: 1100 },
  { n: 'Hair dryer (1.8 kW)', p: 1800 }, { n: 'TV (100 W)', p: 100 }, { n: 'Laptop (60 W)', p: 60 }, { n: 'Vacuum cleaner (1.2 kW)', p: 1200 },
];

/**
 * Household circuit load and circuit breaker.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function circuitLoad(el, ctx) {
  const on = LOADS.map((l, i) => i === 1 || i === 5);
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><label>Circuit breaker <select class="cb"><option value="10">10 A (lighting circuit)</option><option value="16">16 A</option><option value="20" selected>20 A (power-point circuit)</option></select></label></div>
    <div class="mat-grid">${LOADS.map((l, i) => `<button type="button" class="mat ${on[i] ? 'on' : ''}" data-i="${i}" aria-pressed="${on[i]}">${l.n}</button>`).join('')}</div>
    <div class="sim-out out"></div></div>`;
  const draw = () => {
    const cb = Number($('.cb', el).value);
    const items = LOADS.filter((l, i) => on[i]);
    const P = items.reduce((a, l) => a + l.p, 0);
    const I = P / 230;
    const ok = I <= cb;
    $('.out', el).innerHTML = `All appliances are in <b>parallel</b> at 230 V, so their currents add up.<br>` +
      (items.length ? items.map((l) => `${l.n.split(' (')[0]}: I = P/V = ${l.p}/230 = ${sig(l.p / 230, 3)} A`).join('<br>') : 'Nothing switched on.') +
      `<br>Total: P = ${P} W → <b>I = ${P}/230 = ${sig(I, 3)} A</b>. ` +
      (ok ? `<span class="status-ok">OK — under the ${cb} A rating.</span>` : `<span class="status-bad">Breaker trips! ${sig(I, 3)} A is more than ${cb} A, so it switches the circuit off before the cables overheat.</span>`);
  };
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-i]');
    if (!b) return;
    ctx.onUse();
    const i = Number(b.dataset.i);
    on[i] = !on[i];
    b.classList.toggle('on', on[i]);
    b.setAttribute('aria-pressed', on[i]);
    draw();
  });
  el.addEventListener('change', () => { ctx.onUse(); draw(); });
  draw();
}

/**
 * Mount a Chapter 7 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {(() => void)|void} Cleanup.
 */
export function mount(el, id, ctx) {
  if (id === 'power-bill') return powerBill(el, ctx);
  if (id === 'circuit-load') return circuitLoad(el, ctx);
  return undefined;
}
