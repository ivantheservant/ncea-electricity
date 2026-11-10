/**
 * circuit-sims.js — Chapter 3 interactives: symbol-spotter, series-parallel, meter-placement, mixed-circuit.
 */
import { $, $$, shuffle } from '../utils/dom.js';
import { comp, wire, dot, svg, symbol, label } from '../utils/svg.js';

export const SYMBOL_NAMES = {
  cell: 'Cell', battery: 'Battery (two or more cells)', bulb: 'Lamp (bulb)', resistor: 'Resistor', variable: 'Variable resistor (rheostat)',
  'switch-open': 'Switch (open)', 'switch-closed': 'Switch (closed)', ammeter: 'Ammeter', voltmeter: 'Voltmeter', fuse: 'Fuse',
  ldr: 'Light-dependent resistor (LDR)', thermistor: 'Thermistor', diode: 'Diode', led: 'Light-emitting diode (LED)', motor: 'Motor',
  ac: 'AC supply', earth: 'Earth', junction: 'Wires joined (junction)', crossing: 'Wires crossing (not joined)', capacitor: 'Capacitor',
};

/**
 * Symbol-spotting game: name the symbol, 10 rounds.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function spotter(el, ctx) {
  const types = Object.keys(SYMBOL_NAMES);
  let round = 0;
  let score = 0;
  let best = 0;
  let cur = null;
  let locked = false;
  let deck = shuffle(types);
  el.innerHTML = `<div class="sim-ui"><div class="sim-row" style="justify-content:space-between"><b>Symbol spotter</b><span class="sim-score"></span></div>
    <div class="sym-show" style="display:grid;place-items:center;min-height:110px"></div><div class="opts so"></div><div class="sim-feedback"></div>
    <div class="sim-row"><button type="button" class="btn primary small nx" hidden>Next symbol</button></div></div>`;
  const next = () => {
    if (round >= 10) {
      best = Math.max(best, score);
      $('.sym-show', el).innerHTML = `<p class="sim-big">${score} / 10 ${score === 10 ? '— perfect!' : score >= 8 ? '— great!' : ''}</p>`;
      $('.so', el).innerHTML = '';
      $('.sim-feedback', el).textContent = 'Play again to beat your best.';
      $('.nx', el).hidden = false; $('.nx', el).textContent = 'Play again';
      round = 0; score = 0; deck = shuffle(types);
      $('.sim-score', el).textContent = `Best ${best} / 10`;
      return;
    }
    cur = deck[round % deck.length];
    const wrong = shuffle(types.filter((t) => t !== cur)).slice(0, 3);
    const opts = shuffle([cur, ...wrong]);
    $('.sym-show', el).innerHTML = symbol(cur).replace('class="dia sym"', 'class="dia sym" style="max-width:160px"');
    $('.so', el).innerHTML = opts.map((o) => `<button type="button" class="opt" data-o="${o}"><span class="opt-mark"></span><span class="opt-text">${SYMBOL_NAMES[o]}</span></button>`).join('');
    $('.sim-feedback', el).textContent = '';
    $('.sim-feedback', el).className = 'sim-feedback';
    $('.nx', el).hidden = true;
    $('.sim-score', el).textContent = `Round ${round + 1} of 10 · Score ${score}`;
    locked = false;
  };
  el.addEventListener('click', (ev) => {
    const o = ev.target.closest('.opt');
    if (o && !locked) {
      ctx.onUse();
      locked = true;
      const ok = o.dataset.o === cur;
      if (ok) score++;
      $$('.opt', el).forEach((b) => { if (b.dataset.o === cur) b.classList.add('is-right'); else if (b === o) b.classList.add('is-wrong'); });
      const fb = $('.sim-feedback', el);
      fb.className = `sim-feedback ${ok ? 'ok' : 'no'}`;
      fb.textContent = ok ? '✓ Correct!' : `✗ That one is: ${SYMBOL_NAMES[cur]}.`;
      round++;
      $('.sim-score', el).textContent = `Round ${round} of 10 · Score ${score}`;
      $('.nx', el).hidden = false; $('.nx', el).textContent = round >= 10 ? 'See score' : 'Next symbol';
      return;
    }
    if (ev.target.closest('.nx')) next();
  });
  next();
}

const V = 6;
const RB = 12;

/**
 * Series / parallel bulb lab with removable bulbs.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function seriesParallel(el, ctx) {
  let mode = 'series';
  let n = 2;
  let broken = [false, false, false];
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><button type="button" class="tgl on" data-mode="series">Series</button><button type="button" class="tgl" data-mode="parallel">Parallel</button>
    <span style="margin-left:auto"></span><label>Bulbs <select class="nb"><option>1</option><option selected>2</option><option>3</option></select></label></div>
    <div class="plot"></div><p class="muted small" style="margin:0">Tap a bulb to remove it (as if it blew). Tap again to put it back.</p><div class="sim-out out"></div></div>`;
  const draw = () => {
    const alive = broken.slice(0, n).map((b) => !b);
    let inner = '';
    const readings = [];
    let I = 0;
    if (mode === 'series') {
      const ok = alive.every(Boolean);
      I = ok ? V / (n * RB) : 0;
      const xs = n === 1 ? [210] : n === 2 ? [160, 270] : [140, 220, 300];
      inner += comp('battery', 40, 160, 40, 50, { signs: true, label: '6 V', labelPos: 'left' });
      let last = 40;
      xs.forEach((x, i) => {
        inner += wire([last, 50], [x - 30, 50]);
        inner += `<g class="bulbtap" data-b="${i}" role="button" tabindex="0" aria-label="Bulb ${i + 1}">${comp(alive[i] ? 'bulb' : 'gap', x - 30, 50, x + 30, 50, { lit: ok ? Math.min(1, (I * RB / V) ** 2 * 1.6) : 0, label: `${i + 1}${alive[i] ? '' : ' removed'}` })}<rect x="${x - 30}" y="26" width="60" height="48" class="hit"/></g>`;
        last = x + 30;
        readings.push(`Bulb ${i + 1}: ${alive[i] ? `${(I * RB).toFixed(1)} V` : 'removed'}`);
      });
      inner += wire([last, 50], [360, 50]);
      inner += comp('ammeter', 360, 50, 360, 160, { label: `${I.toFixed(2)} A`, labelPos: 'right' });
      inner += wire([360, 160], [40, 160]);
    } else {
      const xs = n === 1 ? [240] : n === 2 ? [200, 300] : [160, 240, 320];
      inner += comp('battery', 40, 170, 40, 50, { signs: true, label: '6 V', labelPos: 'left' });
      inner += comp('ammeter', 40, 50, 120, 50, { at: 0.55 });
      inner += wire([120, 50], [xs[xs.length - 1], 50]);
      inner += wire([40, 170], [xs[xs.length - 1], 170]);
      xs.forEach((x, i) => {
        inner += `<g class="bulbtap" data-b="${i}" role="button" tabindex="0" aria-label="Bulb ${i + 1}">${comp(alive[i] ? 'bulb' : 'gap', x, 50, x, 170, { lit: alive[i] ? 1 : 0, label: `${i + 1}${alive[i] ? '' : ' removed'}`, labelPos: 'right' })}<rect x="${x - 26}" y="80" width="52" height="60" class="hit"/></g>`;
        if (i < xs.length - 1) inner += dot(x, 50) + dot(x, 170);
        readings.push(`Bulb ${i + 1}: ${alive[i] ? `${V.toFixed(1)} V, ${(V / RB).toFixed(2)} A` : 'removed'}`);
      });
      I = alive.filter(Boolean).length * (V / RB);
      inner += label(84, 30, `${I.toFixed(2)} A`, { cls: 'bold' });
    }
    $('.plot', el).innerHTML = svg(400, mode === 'series' ? 190 : 200, inner, { title: `${mode} circuit with ${n} bulbs`, maxw: 460 });
    const allAlive = alive.every(Boolean);
    const msg = mode === 'series'
      ? (allAlive ? `One path only. The same current (${I.toFixed(2)} A) flows through every bulb. The 6 V is shared: ${n} bulbs × ${(V / n).toFixed(1)} V = 6 V. More bulbs → less current → each bulb dimmer.` : 'A bulb is removed, so the only path is broken. No current flows anywhere and every bulb goes out.')
      : `Each bulb has its own path to the battery and gets the full 6 V. Branch currents add up: total = ${I.toFixed(2)} A. ${allAlive ? 'Adding more bulbs adds more current — the battery runs down faster.' : 'The removed bulb only breaks its own branch; the others stay just as bright.'}`;
    $('.out', el).innerHTML = `<b>Ammeter (total current): ${I.toFixed(2)} A</b><br>${readings.join(' · ')}<br>${msg}<br><span class="muted small">Model: ideal 6 V battery and identical 12 Ω bulbs. Real bulbs change resistance as they heat up.</span>`;
  };
  el.addEventListener('click', (ev) => {
    const m = ev.target.closest('[data-mode]');
    if (m) { mode = m.dataset.mode; $$('[data-mode]', el).forEach((b) => b.classList.toggle('on', b === m)); broken = [false, false, false]; ctx.onUse(); draw(); return; }
    const b = ev.target.closest('.bulbtap');
    if (b) { ctx.onUse(); const i = Number(b.dataset.b); broken[i] = !broken[i]; draw(); }
  });
  el.addEventListener('keydown', (ev) => { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.closest('.bulbtap')) { ev.preventDefault(); ev.target.closest('.bulbtap').dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
  $('.nb', el).addEventListener('change', (e) => { n = Number(e.target.value); broken = [false, false, false]; ctx.onUse(); draw(); });
  draw();
}

const TASKS = [
  { meter: 'ammeter', text: 'Place the <b>ammeter</b> to measure the current through bulb A.', ok: ['S1', 'S2', 'S3', 'S4'] },
  { meter: 'voltmeter', text: 'Place the <b>voltmeter</b> to measure the voltage across bulb B.', ok: ['PB'] },
  { meter: 'voltmeter', text: 'Place the <b>voltmeter</b> to measure the voltage across bulb A.', ok: ['PA'] },
  { meter: 'ammeter', text: 'Place the <b>ammeter</b> to measure the current through bulb B.', ok: ['S1', 'S2', 'S3', 'S4'] },
  { meter: 'voltmeter', text: 'Place the <b>voltmeter</b> to measure the voltage across both bulbs together.', ok: ['PAB'] },
];

/**
 * Meter placement game.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function meters(el, ctx) {
  let t = 0;
  let picked = null;
  let score = 0;
  el.innerHTML = `<div class="sim-ui"><p class="sim-out task"></p><div class="plot"></div><div class="sim-feedback"></div>
    <div class="sim-row"><button type="button" class="btn primary small nx" hidden>Next task</button><span class="sim-score"></span></div></div>`;
  const slot = (id, x, y) => {
    const T = TASKS[t % TASKS.length];
    const show = picked === id;
    return `<g class="slot ${show ? 'picked' : ''}" data-slot="${id}" role="button" tabindex="0" aria-label="Position ${id}"><rect x="${x - 17}" y="${y - 13}" width="34" height="26" rx="6"/>` +
      `<text x="${x}" y="${y + 5}" text-anchor="middle" class="bold">${show ? (T.meter === 'ammeter' ? 'A' : 'V') : '?'}</text></g>`;
  };
  const draw = () => {
    const T = TASKS[t % TASKS.length];
    let s = comp('battery', 60, 180, 60, 70, { signs: true, label: '6 V', labelPos: 'left' });
    s += wire([60, 70], [85, 70]) + wire([119, 70], [150, 70]);
    s += comp('bulb', 150, 70, 230, 70, { label: 'A', labelPos: 'below' }) + wire([230, 70], [245, 70]) + wire([279, 70], [290, 70]);
    s += comp('bulb', 290, 70, 370, 70, { label: 'B', labelPos: 'below' }) + wire([370, 70], [420, 70], [420, 112]) + wire([420, 138], [420, 180], [281, 180]) + wire([247, 180], [60, 180]);
    s += wire([160, 70], [160, 30], [173, 30]) + wire([207, 30], [220, 30], [220, 70]);
    s += wire([300, 70], [300, 30], [313, 30]) + wire([347, 30], [360, 30], [360, 70]);
    s += wire([135, 70], [135, 130], [245, 130]) + wire([279, 130], [380, 130], [380, 70]);
    s += dot(135, 70) + dot(160, 70) + dot(220, 70) + dot(300, 70) + dot(360, 70) + dot(380, 70);
    s += slot('S1', 102, 70) + slot('S2', 262, 70) + slot('S3', 420, 125) + slot('S4', 264, 180);
    s += slot('PA', 190, 30) + slot('PB', 330, 30) + slot('PAB', 262, 130);
    $('.plot', el).innerHTML = svg(460, 200, s, { title: 'Circuit with possible meter positions', maxw: 540 });
    $('.task', el).innerHTML = `Task ${(t % TASKS.length) + 1} of ${TASKS.length}: ${T.text} Tap a <b>?</b> box.`;
    $('.sim-score', el).textContent = `Score ${score}`;
  };
  const choose = (id) => {
    if (picked) return;
    ctx.onUse();
    picked = id;
    const T = TASKS[t % TASKS.length];
    const ok = T.ok.includes(id);
    const series = id.startsWith('S');
    let why;
    if (ok) {
      why = T.meter === 'ammeter'
        ? 'The ammeter is in series, so the current must flow through it. In a series circuit the current is the same everywhere, so any series position gives the same reading.'
        : 'The voltmeter is connected in parallel, across the two ends of what you are measuring.';
    } else if (T.meter === 'ammeter' && !series) {
      why = 'An ammeter has almost zero resistance. Connected in parallel it makes a short circuit around the bulb, so a large current flows through the meter instead. Ammeters always go in series.';
    } else if (T.meter === 'voltmeter' && series) {
      why = 'A voltmeter has a very high resistance. In series it blocks almost all the current, so the bulbs go out and the meter reads nearly the full battery voltage. Voltmeters go in parallel, across a component.';
    } else {
      why = 'Right type of connection, but across the wrong part of the circuit. Check which component the question asks about.';
    }
    if (ok) score++;
    const fb = $('.sim-feedback', el);
    fb.className = `sim-feedback ${ok ? 'ok' : 'no'}`;
    fb.innerHTML = `${ok ? '✓ Yes.' : '✗ Not there.'} <span style="font-weight:400">${why}</span>`;
    $('.nx', el).hidden = false;
    draw();
  };
  el.addEventListener('click', (ev) => {
    const s = ev.target.closest('.slot');
    if (s) { choose(s.dataset.slot); return; }
    if (ev.target.closest('.nx')) { t++; picked = null; $('.sim-feedback', el).textContent = ''; $('.nx', el).hidden = true; draw(); }
  });
  el.addEventListener('keydown', (ev) => { const s = ev.target.closest('.slot'); if (s && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); choose(s.dataset.slot); } });
  draw();
}

/**
 * Mixed circuit: bulb A in series with parallel pair B and C.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function mixed(el, ctx) {
  const gone = { A: false, B: false, C: false };
  el.innerHTML = '<div class="sim-ui"><div class="plot"></div><p class="muted small" style="margin:0">Tap a bulb to remove it. Tap again to put it back.</p><div class="sim-out out"></div></div>';
  const draw = () => {
    const par = [!gone.B ? RB : null, !gone.C ? RB : null].filter(Boolean);
    const Rp = par.length === 2 ? RB / 2 : par.length === 1 ? RB : Infinity;
    const I = gone.A || !Number.isFinite(Rp) ? 0 : V / (RB + Rp);
    const VA = I * RB;
    const Vp = I * (Number.isFinite(Rp) ? Rp : 0);
    const lit = (v) => Math.min(1, (v / V) ** 2 * 1.8);
    const b = (id, x1, y1, x2, y2, v) => `<g class="bulbtap" data-b="${id}" role="button" tabindex="0" aria-label="Bulb ${id}">${comp(gone[id] ? 'gap' : 'bulb', x1, y1, x2, y2, { lit: gone[id] ? 0 : lit(v), label: `${id}${gone[id] ? ' removed' : ''}` })}<rect x="${(x1 + x2) / 2 - 28}" y="${y1 - 26}" width="56" height="52" class="hit"/></g>`;
    let s = comp('battery', 40, 180, 40, 60, { signs: true, label: '6 V', labelPos: 'left' });
    s += wire([40, 60], [90, 60]) + b('A', 90, 60, 170, 60, VA) + wire([170, 60], [220, 60]);
    s += wire([220, 60], [250, 60]) + b('B', 250, 60, 330, 60, gone.B ? 0 : Vp) + wire([330, 60], [370, 60], [370, 180], [40, 180]);
    s += wire([220, 60], [220, 130], [250, 130]) + b('C', 250, 130, 330, 130, gone.C ? 0 : Vp) + wire([330, 130], [370, 130]);
    s += dot(220, 60) + dot(370, 130);
    $('.plot', el).innerHTML = svg(420, 200, s, { title: 'Bulb A in series with bulbs B and C in parallel', maxw: 500 });
    const f = (x) => x.toFixed(2);
    let msg;
    if (I === 0) msg = gone.A ? 'Bulb A is on the only path back to the battery, so removing it stops all current.' : 'With both B and C removed there is no complete path, so nothing lights.';
    else if (!gone.B && !gone.C) msg = 'A carries the whole current, which then splits between B and C. A is the brightest; B and C are equally dim. The parallel pair has half the resistance of one bulb, so it gets a smaller share of the 6 V.';
    else msg = 'With one parallel bulb removed, the circuit is now two bulbs in series. Total resistance rises, current falls, so A gets dimmer — but the remaining parallel bulb gets a bigger share of the voltage and gets brighter.';
    $('.out', el).innerHTML = `<b>Current from battery: ${f(I)} A</b><br>V<sub>A</sub> = ${f(VA)} V · V<sub>B</sub> = ${gone.B ? '—' : f(Vp) + ' V'} · V<sub>C</sub> = ${gone.C ? '—' : f(Vp) + ' V'} (check: ${f(VA)} + ${f(Vp)} = ${f(VA + Vp)} V)<br>${msg}`;
  };
  el.addEventListener('click', (ev) => { const b = ev.target.closest('.bulbtap'); if (b) { ctx.onUse(); gone[b.dataset.b] = !gone[b.dataset.b]; draw(); } });
  el.addEventListener('keydown', (ev) => { const b = ev.target.closest('.bulbtap'); if (b && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); b.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
  draw();
}

/**
 * Mount a Chapter 3 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {void}
 */
export function mount(el, id, ctx) {
  if (id === 'symbol-spotter') spotter(el, ctx);
  if (id === 'series-parallel') seriesParallel(el, ctx);
  if (id === 'meter-placement') meters(el, ctx);
  if (id === 'mixed-circuit') mixed(el, ctx);
}

