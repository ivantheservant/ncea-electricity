/**
 * charge-sims.js — Chapter 1 interactives: atom-builder, charge-forces, rubbing-lab, induction-steps.
 */
import { $, $$ } from '../utils/dom.js';
import { charge, svg, arrow, earth } from '../utils/svg.js';

/**
 * Format a charge in coulombs.
 * @param {number} n Number of elementary charges (signed).
 * @returns {string} HTML.
 */
function coulombs(n) {
  if (n === 0) return '0 C';
  const v = n * 1.6;
  return `${v > 0 ? '+' : '−'}${+Math.abs(v).toFixed(1)} × 10<sup>−19</sup> C`;
}

/**
 * Atom builder: add/remove electrons and protons, see the net charge.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function atom(el, ctx) {
  let p = 3;
  let e = 3;
  el.innerHTML = `<div class="sim-ui"><div class="plot"></div>
    <div class="sim-row"><span>Electrons</span><button type="button" class="btn ghost small" data-d="e-">− electron</button><button type="button" class="btn ghost small" data-d="e+">+ electron</button></div>
    <div class="sim-row"><span>Protons</span><button type="button" class="btn ghost small" data-d="p-">− proton</button><button type="button" class="btn ghost small" data-d="p+">+ proton</button><small class="muted">(changes the element)</small></div>
    <div class="sim-out out"></div></div>`;
  const NAMES = ['—', 'hydrogen', 'helium', 'lithium', 'beryllium', 'boron', 'carbon', 'nitrogen', 'oxygen', 'fluorine', 'neon'];
  const draw = () => {
    let inner = `<circle cx="160" cy="100" r="78" class="dash thin" style="stroke:var(--ink-3)"/><circle cx="160" cy="100" r="${16 + p * 1.5}" class="fill-soft"/>`;
    for (let i = 0; i < p; i++) {
      const a = (i / Math.max(1, p)) * Math.PI * 2;
      const rr = p > 1 ? 7 + p : 0;
      inner += charge(160 + Math.cos(a) * rr, 100 + Math.sin(a) * rr, '+', 7);
    }
    for (let i = 0; i < e; i++) {
      const a = (i / Math.max(1, e)) * Math.PI * 2 - Math.PI / 2;
      inner += charge(160 + Math.cos(a) * 78, 100 + Math.sin(a) * 78, '-', 8);
    }
    $('.plot', el).innerHTML = svg(320, 200, inner, { title: `Atom with ${p} protons and ${e} electrons`, maxw: 340 });
    const net = p - e;
    const kind = net === 0 ? 'a neutral atom' : net > 0 ? `a positive ion (${net} electron${net > 1 ? 's' : ''} missing)` : `a negative ion (${-net} extra electron${net < -1 ? 's' : ''})`;
    $('.out', el).innerHTML = `<b>${NAMES[p] || 'element ' + p}</b>: ${p} protons, ${e} electrons → <b>${kind}</b>.<br>Net charge = ${net > 0 ? '+' : ''}${net}e = ${coulombs(net)}`;
  };
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-d]');
    if (!b) return;
    ctx.onUse();
    const d = b.dataset.d;
    if (d === 'e+' && e < 12) e++;
    if (d === 'e-' && e > 0) e--;
    if (d === 'p+' && p < 10) p++;
    if (d === 'p-' && p > 1) p--;
    draw();
  });
  draw();
}

/**
 * Two charges: signs, sizes and distance; force arrows scale with q1q2/r².
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function forces(el, ctx) {
  const st = { s1: '+', s2: '-', q1: 1, q2: 1, d: 3 };
  el.innerHTML = `<div class="sim-ui"><div class="plot"></div>
    <div class="sim-row"><label>Charge A <select class="s1"><option>+</option><option>-</option></select></label><label>size <input type="range" class="q1" min="1" max="3" value="1"></label></div>
    <div class="sim-row"><label>Charge B <select class="s2"><option>+</option><option selected>-</option></select></label><label>size <input type="range" class="q2" min="1" max="3" value="1"></label></div>
    <div class="sim-row"><label>Distance <input type="range" class="d" min="1" max="6" value="3"></label></div>
    <div class="sim-out out"></div></div>`;
  const draw = () => {
    const xA = 160 - st.d * 22;
    const xB = 160 + st.d * 22;
    const F = (st.q1 * st.q2) / (st.d * st.d);
    const F0 = 1 / 9;
    const len = Math.min(70, 14 + 50 * Math.sqrt(F / F0) * 0.5);
    const attract = st.s1 !== st.s2;
    const dir = attract ? 1 : -1;
    let inner = `<line x1="${xA}" y1="120" x2="${xB}" y2="120" class="thin dash" style="stroke:var(--ink-3)"/><text x="160" y="138" text-anchor="middle" class="lbl small">distance ${st.d} units</text>`;
    inner += charge(xA, 80, st.s1, 10 + st.q1 * 4) + charge(xB, 80, st.s2, 10 + st.q2 * 4);
    inner += arrow(xA + dir * (16 + st.q1 * 4) * (attract ? 1 : 1), 80, xA + dir * (16 + st.q1 * 4 + len), 80, 'accent');
    inner += arrow(xB - dir * (16 + st.q2 * 4), 80, xB - dir * (16 + st.q2 * 4 + len), 80, 'accent');
    $('.plot', el).innerHTML = svg(320, 150, inner, { title: attract ? 'Opposite charges attract' : 'Like charges repel', maxw: 380 });
    $('.out', el).innerHTML = `<b>${attract ? 'Opposite charges attract.' : 'Like charges repel.'}</b> Force size: <b>${+(F / F0).toFixed(2)}×</b> the starting force (size 1 and 1 at distance 3).<br>` +
      'Bigger charges give a bigger force. Halving the distance makes the force <b>4 times</b> bigger (inverse-square law). Both charges always feel the same size force, in opposite directions.';
  };
  el.addEventListener('input', () => {
    ctx.onUse();
    st.s1 = $('.s1', el).value; st.s2 = $('.s2', el).value;
    st.q1 = Number($('.q1', el).value); st.q2 = Number($('.q2', el).value); st.d = Number($('.d', el).value);
    draw();
  });
  draw();
}

const PAIRS = {
  polythene: { a: 'Polythene rod', b: 'Woollen cloth', gainer: 'a', note: 'Polythene holds electrons more strongly than wool, so electrons move from the wool to the rod.' },
  acetate: { a: 'Acetate rod', b: 'Cotton cloth', gainer: 'b', note: 'Acetate holds electrons less strongly than the cloth, so electrons move from the rod to the cloth.' },
  balloon: { a: 'Balloon (rubber)', b: 'Your hair', gainer: 'a', note: 'Rubber holds electrons more strongly than hair, so electrons move from hair to balloon. Each hair is now positive — they repel and stand up!' },
  glass: { a: 'Glass rod', b: 'Silk cloth', gainer: 'b', note: 'Silk holds electrons more strongly than glass, so electrons move from the glass to the silk.' },
};

/**
 * Rubbing lab: charging by friction with electron transfer and conservation of charge.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function rubbing(el, ctx) {
  let pair = 'polythene';
  let moved = 0;
  let tested = false;
  el.innerHTML = `<div class="sim-ui"><div class="sim-row">${Object.keys(PAIRS).map((k) => `<button type="button" class="tgl ${k === pair ? 'on' : ''}" data-p="${k}">${PAIRS[k].a.split(' ')[0]}</button>`).join('')}</div>
    <div class="plot"></div>
    <div class="sim-row"><button type="button" class="btn primary small rub">Rub them together</button><button type="button" class="btn ghost small test">Bring a negative rod near</button><button type="button" class="btn ghost small reset">Reset</button></div>
    <div class="sim-out out"></div></div>`;
  const draw = () => {
    const P = PAIRS[pair];
    const qa = P.gainer === 'a' ? -moved : moved;
    const qb = -qa;
    const objA = (x, q) => {
      let s = `<rect x="${x - 55}" y="40" width="110" height="34" rx="12" class="fill-sheet"/>`;
      const n = Math.abs(q);
      for (let i = 0; i < n; i++) s += charge(x - (n - 1) * 8 + i * 16, 57, q < 0 ? '-' : '+', 6);
      if (!n) s += `<text x="${x}" y="62" text-anchor="middle" class="lbl small muted-t">neutral</text>`;
      return s;
    };
    let inner = objA(90, qa) + objA(250, qb);
    inner += `<text x="90" y="98" text-anchor="middle" class="lbl bold">${P.a}</text><text x="250" y="98" text-anchor="middle" class="lbl bold">${P.b}</text>`;
    inner += `<text x="90" y="118" text-anchor="middle" class="lbl">${qa > 0 ? '+' : ''}${qa} units</text><text x="250" y="118" text-anchor="middle" class="lbl">${qb > 0 ? '+' : ''}${qb} units</text>`;
    if (tested && moved) {
      inner += `<rect x="150" y="150" width="40" height="14" rx="5" class="fill-soft"/>` + charge(160, 157, '-', 5) + charge(180, 157, '-', 5);
      inner += `<text x="170" y="182" text-anchor="middle" class="lbl small">negative test rod</text>`;
      inner += qa < 0 ? arrow(110, 126, 80, 126, 'accent') + `<text x="95" y="142" text-anchor="middle" class="lbl small">repelled</text>` : arrow(80, 126, 120, 140, 'accent') + `<text x="88" y="150" text-anchor="middle" class="lbl small">attracted</text>`;
      inner += qb < 0 ? arrow(230, 126, 260, 126, 'accent') + `<text x="250" y="142" text-anchor="middle" class="lbl small">repelled</text>` : arrow(260, 126, 220, 140, 'accent') + `<text x="252" y="150" text-anchor="middle" class="lbl small">attracted</text>`;
    }
    $('.plot', el).innerHTML = svg(340, tested && moved ? 190 : 130, inner, { title: 'Charging by friction', maxw: 420 });
    $('.out', el).innerHTML = moved
      ? `${P.note}<br>Total charge = ${qa} + ${qb > 0 ? '+' : ''}${qb} = <b>0</b>. Charge is not created — it is only moved, so the two objects always end up equal and opposite.`
      : 'Both objects start neutral (equal numbers of protons and electrons). Press <b>Rub</b>.';
  };
  el.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-p]');
    if (t) { pair = t.dataset.p; moved = 0; tested = false; $$('[data-p]', el).forEach((b) => b.classList.toggle('on', b === t)); draw(); return; }
    if (ev.target.closest('.rub')) { ctx.onUse(); moved = Math.min(6, moved + 2); draw(); }
    if (ev.target.closest('.test')) { ctx.onUse(); tested = true; draw(); }
    if (ev.target.closest('.reset')) { moved = 0; tested = false; draw(); }
  });
  draw();
}

const STEPS = [
  { t: '1. A neutral metal sphere stands on an insulating stand. Its free electrons are spread evenly, so there is no net charge.', rod: false, sep: 0, earth: false, net: 0 },
  { t: '2. Bring a negatively charged rod near (not touching). It repels free electrons to the far side. The near side is left positive. The sphere is still neutral overall — the charges are only separated.', rod: true, sep: 1, earth: false, net: 0 },
  { t: '3. Touch the far side with your finger (this earths the sphere). The repelled electrons flow away through you into the earth.', rod: true, sep: 1, earth: true, net: 1 },
  { t: '4. Remove your finger while the rod is still close. The electrons that left cannot get back.', rod: true, sep: 1, earth: false, net: 1 },
  { t: '5. Now take the rod away. The sphere has a net positive charge, which spreads out evenly over its surface. Induction gives the sphere the opposite charge to the rod — and the rod never touched it, so the rod keeps all of its charge.', rod: false, sep: 0, earth: false, net: 1, spread: true },
];

/**
 * Induction stepper.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function induction(el, ctx) {
  let i = 0;
  el.innerHTML = `<div class="sim-ui"><div class="plot"></div><p class="sim-out cap"></p>
    <div class="sim-row" style="justify-content:space-between"><button type="button" class="btn ghost small prev">Back</button><div class="stepper-dots">${STEPS.map(() => '<span></span>').join('')}</div><button type="button" class="btn primary small next">Next step</button></div></div>`;
  const draw = () => {
    const s = STEPS[i];
    let inner = '<line x1="200" y1="150" x2="200" y2="190" style="stroke-width:6"/><rect x="170" y="188" width="60" height="10" rx="3" class="fill-soft"/><text x="252" y="186" class="lbl small">insulating stand</text>';
    inner += '<circle cx="200" cy="100" r="52" class="fill-sheet"/>';
    // charges on the sphere
    const pos = [];
    const neg = [];
    if (s.spread) {
      for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; pos.push([200 + Math.cos(a) * 38, 100 + Math.sin(a) * 38]); }
    } else if (s.sep) {
      for (let k = 0; k < 4; k++) { const a = Math.PI + (k - 1.5) * 0.45; pos.push([200 + Math.cos(a) * 38, 100 + Math.sin(a) * 38]); }
      if (!s.net) for (let k = 0; k < 4; k++) { const a = (k - 1.5) * 0.45; neg.push([200 + Math.cos(a) * 38, 100 + Math.sin(a) * 38]); }
    } else {
      for (let k = 0; k < 4; k++) { const a = (k / 4) * Math.PI * 2 + 0.4; pos.push([200 + Math.cos(a) * 22, 100 + Math.sin(a) * 22]); neg.push([200 + Math.cos(a + 0.8) * 34, 100 + Math.sin(a + 0.8) * 34]); }
    }
    pos.forEach(([x, y]) => { inner += charge(x, y, '+', 7); });
    neg.forEach(([x, y]) => { inner += charge(x, y, '-', 7); });
    if (s.rod) {
      inner += '<rect x="34" y="88" width="96" height="24" rx="8" class="fill-soft"/>';
      for (let k = 0; k < 5; k++) inner += charge(50 + k * 16, 100, '-', 6);
      inner += '<text x="82" y="134" text-anchor="middle" class="lbl small">charged rod</text>';
    }
    if (s.earth) {
      inner += '<line x1="252" y1="100" x2="300" y2="100"/><line x1="300" y1="100" x2="300" y2="150"/>' + earth(300, 150);
      inner += '<text x="306" y="92" class="lbl small">finger (earth)</text>';
      for (let k = 0; k < 3; k++) inner += charge(268 + k * 12, 100, '-', 5);
      inner += arrow(300, 112, 300, 140, 'accent');
    }
    const label = s.net ? '<text x="200" y="30" text-anchor="middle" class="lbl bold">net charge: positive</text>' : '<text x="200" y="30" text-anchor="middle" class="lbl bold">net charge: zero</text>';
    $('.plot', el).innerHTML = svg(400, 210, inner + label, { title: `Charging by induction, step ${i + 1}`, maxw: 460 });
    $('.cap', el).textContent = s.t;
    $$('.stepper-dots span', el).forEach((d, k) => d.classList.toggle('on', k === i));
    $('.prev', el).disabled = i === 0;
    $('.next', el).textContent = i === STEPS.length - 1 ? 'Start again' : 'Next step';
  };
  el.addEventListener('click', (ev) => {
    if (ev.target.closest('.next')) { ctx.onUse(); i = i === STEPS.length - 1 ? 0 : i + 1; draw(); }
    if (ev.target.closest('.prev') && i > 0) { i--; draw(); }
  });
  draw();
}

/**
 * Mount a Chapter 1 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {void}
 */
export function mount(el, id, ctx) {
  if (id === 'atom-builder') atom(el, ctx);
  if (id === 'charge-forces') forces(el, ctx);
  if (id === 'rubbing-lab') rubbing(el, ctx);
  if (id === 'induction-steps') induction(el, ctx);
}

