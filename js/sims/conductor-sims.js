/**
 * conductor-sims.js — Chapter 2 interactives: material-tester, electron-drift, wire-resistance.
 */
import { $, $$, reducedMotion } from '../utils/dom.js';
import { comp, wire, svg } from '../utils/svg.js';

const MATERIALS = [
  { k: 'copper', n: 'Copper wire', lit: 1, why: 'Metal: huge numbers of free (delocalised) electrons. Excellent conductor.' },
  { k: 'alu', n: 'Aluminium foil', lit: 1, why: 'Metal: free electrons carry the current. Very good conductor.' },
  { k: 'clip', n: 'Steel paper clip', lit: 0.95, why: 'Metal (mostly iron): free electrons. Good conductor, a little more resistance than copper.' },
  { k: 'graphite', n: 'Pencil lead (graphite)', lit: 0.55, why: 'Graphite is carbon with some free electrons between its layers. It conducts, but with more resistance, so the bulb is dimmer.' },
  { k: 'salt', n: 'Salt water', lit: 0.25, why: 'Dissolved salt makes positive and negative ions that can move. The ions carry the current. Glows faintly.' },
  { k: 'pure', n: 'Pure (distilled) water', lit: 0, why: 'Almost no ions, so almost no charge carriers. The bulb stays off. Tap water and sea water conduct because of dissolved substances.' },
  { k: 'plastic', n: 'Plastic ruler', lit: 0, why: 'Insulator: electrons are tightly bound in molecules. No free charge carriers.' },
  { k: 'rubber', n: 'Rubber band', lit: 0, why: 'Insulator: no free charge carriers. That is why wires are coated in plastic or rubber.' },
  { k: 'glass', n: 'Glass rod', lit: 0, why: 'Insulator at room temperature.' },
  { k: 'wood', n: 'Dry wood', lit: 0, why: 'Insulator when dry. Wet wood can conduct a little because of dissolved ions.' },
  { k: 'air', n: 'Air (gap)', lit: 0, why: 'Air is an insulator at low voltages. Only very high voltages make sparks or lightning.' },
];

/**
 * Material tester circuit.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function tester(el, ctx) {
  let cur = 'air';
  el.innerHTML = `<div class="sim-ui"><div class="plot"></div><div class="mat-grid">${MATERIALS.map((m) => `<button type="button" class="mat ${m.k === cur ? 'on' : ''}" data-m="${m.k}">${m.n}</button>`).join('')}</div><div class="sim-out out"></div></div>`;
  const draw = () => {
    const m = MATERIALS.find((x) => x.k === cur);
    let inner = wire([40, 40], [40, 150], [300, 150], [300, 40]);
    inner = comp('battery', 40, 40, 170, 40, { signs: true, label: '3 V battery', at: 0.45 }) + comp('bulb', 300, 40, 300, 150, { lit: m.lit, label: 'bulb', labelPos: 'right' }) + wire([40, 40], [40, 150], [130, 150]) + wire([210, 150], [300, 150]) + wire([170, 40], [300, 40]);
    inner += `<circle cx="134" cy="150" r="4" class="solid"/><circle cx="206" cy="150" r="4" class="solid"/>`;
    inner += m.k === 'air' ? '<text x="170" y="174" text-anchor="middle" class="lbl small">test gap</text>' : `<rect x="136" y="142" width="68" height="16" rx="6" class="${m.lit ? 'fill-green' : 'fill-soft'}"/><text x="170" y="178" text-anchor="middle" class="lbl small">${m.n}</text>`;
    $('.plot', el).innerHTML = svg(360, 190, inner, { title: `Circuit testing ${m.n}`, maxw: 420 });
    $('.out', el).innerHTML = `<b>${m.lit >= 0.9 ? 'Bulb bright — conductor.' : m.lit > 0 ? 'Bulb dim — conducts, but poorly.' : 'Bulb off — insulator (or no charge carriers).'}</b> ${m.why}`;
  };
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-m]');
    if (!b) return;
    ctx.onUse();
    cur = b.dataset.m;
    $$('[data-m]', el).forEach((x) => x.classList.toggle('on', x === b));
    draw();
  });
  draw();
}

/**
 * Electron drift animation on a canvas.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {() => void} Cleanup.
 */
function drift(el, ctx) {
  el.innerHTML = `<div class="sim-ui"><canvas width="640" height="260" aria-label="Free electrons moving between metal ions"></canvas>
    <div class="sim-row"><button type="button" class="tgl conn">Connect the battery</button><label>Voltage <input type="range" class="v" min="1" max="10" value="4"></label><button type="button" class="tgl trace on">Track one electron</button></div>
    <div class="sim-out out"></div></div>`;
  const cv = $('canvas', el);
  const g = cv.getContext('2d');
  const ions = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) ions.push({ x: 40 + c * 62, y: 50 + r * 55, ox: 40 + c * 62, oy: 50 + r * 55 });
  const es = Array.from({ length: 46 }, () => ({ x: Math.random() * 640, y: 26 + Math.random() * 210, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 }));
  const tracked = es[0];
  let trail = [];
  let on = false;
  let raf = 0;
  let visible = true;
  let heat = 0;
  const colors = () => {
    const cs = getComputedStyle(document.documentElement);
    return { ion: cs.getPropertyValue('--bad').trim(), e: cs.getPropertyValue('--blue').trim(), ink: cs.getPropertyValue('--ink').trim(), bg: cs.getPropertyValue('--sheet-2').trim(), hl: cs.getPropertyValue('--glow').trim() };
  };
  let C = colors();
  const step = () => {
    const V = Number($('.v', el).value);
    const push = on ? -0.05 * V : 0;
    heat = heat * 0.97 + (on ? V * 0.06 : 0) * 0.03;
    for (const e of es) {
      e.vx += push + (Math.random() - 0.5) * 0.6;
      e.vy += (Math.random() - 0.5) * 0.6;
      const sp = Math.hypot(e.vx, e.vy);
      if (sp > 5) { e.vx *= 5 / sp; e.vy *= 5 / sp; }
      e.x += e.vx; e.y += e.vy;
      for (const ion of ions) {
        if (Math.hypot(e.x - ion.x, e.y - ion.y) < 16) { e.vx = (Math.random() - 0.5) * 5; e.vy = (Math.random() - 0.5) * 5; }
      }
      if (e.y < 22) { e.y = 22; e.vy = Math.abs(e.vy); }
      if (e.y > 238) { e.y = 238; e.vy = -Math.abs(e.vy); }
      if (e.x < 0) { e.x += 640; if (e === tracked) trail = []; }
      if (e.x > 640) { e.x -= 640; if (e === tracked) trail = []; }
    }
    for (const ion of ions) {
      const j = 0.6 + heat * 3;
      ion.x = ion.ox + (Math.random() - 0.5) * j;
      ion.y = ion.oy + (Math.random() - 0.5) * j;
    }
    trail.push([tracked.x, tracked.y]);
    if (trail.length > 160) trail.shift();
  };
  const draw = () => {
    g.clearRect(0, 0, 640, 260);
    g.fillStyle = C.bg; g.fillRect(0, 0, 640, 260);
    g.strokeStyle = C.ink; g.lineWidth = 2; g.strokeRect(1, 12, 638, 236);
    for (const ion of ions) {
      g.beginPath(); g.arc(ion.x, ion.y, 13, 0, Math.PI * 2); g.fillStyle = C.ion + '33'; g.fill(); g.strokeStyle = C.ion; g.stroke();
      g.fillStyle = C.ion; g.font = 'bold 16px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('+', ion.x, ion.y + 1);
    }
    if ($('.trace', el).classList.contains('on') && trail.length > 1) {
      g.beginPath(); g.moveTo(trail[0][0], trail[0][1]);
      for (const [x, y] of trail) g.lineTo(x, y);
      g.strokeStyle = C.hl; g.lineWidth = 3; g.stroke();
    }
    for (const e of es) {
      g.beginPath(); g.arc(e.x, e.y, e === tracked ? 6 : 4, 0, Math.PI * 2); g.fillStyle = e === tracked ? C.hl : C.e; g.fill();
      if (e === tracked) { g.strokeStyle = C.ink; g.lineWidth = 1.5; g.stroke(); }
    }
    g.fillStyle = C.ink; g.font = 'bold 14px sans-serif'; g.textAlign = 'left';
    if (on) { g.fillText('+ terminal side', 8, 9); g.textAlign = 'right'; g.fillText('− terminal side', 632, 9); }
  };
  const loop = () => {
    if (visible) { step(); draw(); }
    raf = requestAnimationFrame(loop);
  };
  const text = () => {
    $('.out', el).innerHTML = on
      ? 'Now there is an electric field along the wire. Electrons still zig-zag randomly, but they <b>drift</b> slowly towards the positive terminal. Collisions make the ions vibrate more — the wire warms up. Raise the voltage: faster drift, more collisions, more heating.'
      : 'No battery: free electrons move fast but in random directions. As many go left as right, so there is <b>no current</b>. The + circles are the fixed metal ions.';
  };
  el.addEventListener('click', (ev) => {
    if (ev.target.closest('.conn')) { ctx.onUse(); on = !on; ev.target.closest('.conn').classList.toggle('on', on); ev.target.closest('.conn').textContent = on ? 'Disconnect the battery' : 'Connect the battery'; trail = []; text(); }
    if (ev.target.closest('.trace')) { ev.target.closest('.trace').classList.toggle('on'); trail = []; }
  });
  const io = new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; }, { threshold: 0.05 });
  io.observe(cv);
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const recolor = () => { C = colors(); };
  mq.addEventListener?.('change', recolor);
  text();
  if (reducedMotion()) { for (let k = 0; k < 30; k++) step(); draw(); }
  else loop();
  return () => { cancelAnimationFrame(raf); io.disconnect(); mq.removeEventListener?.('change', recolor); };
}

const WIRES = {
  copper: { n: 'Copper', rho: 1.68e-8, a: 0.0039 },
  aluminium: { n: 'Aluminium', rho: 2.65e-8, a: 0.0039 },
  tungsten: { n: 'Tungsten', rho: 5.6e-8, a: 0.0045 },
  nichrome: { n: 'Nichrome', rho: 1.1e-6, a: 0.0004 },
};

/**
 * Wire resistance explorer: R = ρL/A with temperature.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function wireR(el, ctx) {
  el.innerHTML = `<div class="sim-ui"><div class="plot"></div>
    <div class="sim-row"><label>Material <select class="mat-s">${Object.entries(WIRES).map(([k, w]) => `<option value="${k}">${w.n}</option>`).join('')}</select></label></div>
    <div class="sim-row"><label>Length <input type="range" class="L" min="1" max="20" value="4"></label><span class="Lv"></span></div>
    <div class="sim-row"><label>Diameter <input type="range" class="D" min="1" max="10" value="5"></label><span class="Dv"></span></div>
    <div class="sim-row"><label>Temperature <input type="range" class="T" min="20" max="320" step="10" value="20"></label><span class="Tv"></span></div>
    <div class="sim-out out"></div></div>`;
  const draw = () => {
    const w = WIRES[$('.mat-s', el).value];
    const L = Number($('.L', el).value) * 0.5;
    const d = Number($('.D', el).value) * 0.1;
    const T = Number($('.T', el).value);
    const A = Math.PI * Math.pow((d / 1000) / 2, 2);
    const R = (w.rho * L / A) * (1 + w.a * (T - 20));
    $('.Lv', el).textContent = `${L} m`;
    $('.Dv', el).textContent = `${d.toFixed(1)} mm`;
    $('.Tv', el).textContent = `${T} °C`;
    const len = 60 + (L / 10) * 240;
    const th = 2 + d * 9;
    const hot = Math.min(1, (T - 20) / 300);
    const inner = `<rect x="20" y="${60 - th / 2}" width="${len}" height="${th}" rx="${th / 2}" style="fill:color-mix(in srgb, var(--bad) ${Math.round(hot * 70)}%, ${w.n === 'Copper' ? '#d08a52' : w.n === 'Aluminium' ? '#b9c2cc' : w.n === 'Tungsten' ? '#8b8f99' : '#9aa0a8'});stroke:var(--ink)"/>` +
      `<text x="20" y="${60 + th / 2 + 18}" class="lbl small">${L} m long, ${d.toFixed(1)} mm across</text>`;
    $('.plot', el).innerHTML = svg(340, 110, inner, { title: 'Wire', maxw: 420 });
    const fmt = R >= 1 ? `${R.toPrecision(3)} Ω` : R >= 1e-3 ? `${(R * 1000).toPrecision(3)} mΩ` : `${R.toExponential(2)} Ω`;
    $('.out', el).innerHTML = `Resistance <b>R = ${fmt}</b><br><span class="muted">R = ρL/A, with ρ(${w.n}) = ${w.rho.toExponential(2)} Ω m at 20 °C. Try: double the length (R doubles). Double the diameter (area ×4, so R ÷ 4). Heat a metal (R rises).</span>`;
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  draw();
}

/**
 * Mount a Chapter 2 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {(() => void)|void} Cleanup.
 */
export function mount(el, id, ctx) {
  if (id === 'material-tester') return tester(el, ctx);
  if (id === 'electron-drift') return drift(el, ctx);
  if (id === 'wire-resistance') return wireR(el, ctx);
  return undefined;
}
