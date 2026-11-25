/**
 * magnet-sims.js — Chapters 12–13 interactives: mag-field (field patterns with compasses),
 * force-lab (F = BIL and F = Bqv) and dc-motor (a coil turning in a field).
 */
import { $, reducedMotion } from '../utils/dom.js';
import { svg, label, arrow } from '../utils/svg.js';
import { sig } from '../utils/math.js';

/**
 * Compass needle pointing along (bx, by).
 * @param {number} x Centre x.
 * @param {number} y Centre y.
 * @param {number} bx Field x.
 * @param {number} by Field y.
 * @returns {string} SVG markup.
 */
function needle(x, y, bx, by) {
  const a = (Math.atan2(by, bx) * 180) / Math.PI;
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})"><polygon points="0,-3 11,0 0,3" class="nostroke" style="fill:var(--bad)"/><polygon points="0,-3 -11,0 0,3" class="nostroke" style="fill:var(--ink-3)"/></g>`;
}

/**
 * Dot (out of page) or cross (into page) symbol.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {boolean} out True for out of the page.
 * @param {number} [r=9] Radius.
 * @returns {string} SVG markup.
 */
function dotCross(x, y, out, r = 9) {
  return `<circle cx="${x}" cy="${y}" r="${r}" class="fill-sheet"/>` + (out ? `<circle cx="${x}" cy="${y}" r="2.6" class="solid"/>` : `<line x1="${x - r * 0.6}" y1="${y - r * 0.6}" x2="${x + r * 0.6}" y2="${y + r * 0.6}"/><line x1="${x - r * 0.6}" y1="${y + r * 0.6}" x2="${x + r * 0.6}" y2="${y - r * 0.6}"/>`);
}

/**
 * Magnetic field explorer: bar magnet, straight wire, solenoid.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function magField(el, ctx) {
  let mode = 'bar';
  let flip = false;
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><button type="button" class="tgl on" data-m="bar">Bar magnet</button><button type="button" class="tgl" data-m="wire">Straight wire</button><button type="button" class="tgl" data-m="sol">Solenoid</button><button type="button" class="btn ghost small flip">Reverse</button></div>
    <div class="plot"></div>
    <div class="sim-row extra"></div><div class="sim-out out"></div></div>`;
  const W = 520;
  const H = 300;
  const extra = () => {
    $('.extra', el).innerHTML = mode === 'bar' ? '' : `<label>Current <input type="range" class="I" min="1" max="10" value="4"></label>${mode === 'sol' ? '<label>Turns <input type="range" class="N" min="5" max="40" step="5" value="20"></label><label><input type="checkbox" class="core"> Iron core</label>' : ''}`;
  };
  const draw = () => {
    let s = '';
    const pts = [];
    for (let x = 30; x < W; x += 46) for (let y = 26; y < H; y += 42) pts.push([x, y]);
    if (mode === 'bar' || mode === 'sol') {
      const cx = W / 2;
      const cy = H / 2;
      const half = mode === 'bar' ? 80 : 95;
      // N pole on the right unless flipped (for the solenoid this follows the current direction)
      const nx = flip ? cx - half : cx + half;
      const sx = flip ? cx + half : cx - half;
      for (const [x, y] of pts) {
        const inside = Math.abs(x - cx) < half - 5 && Math.abs(y - cy) < 34;
        if (inside && mode === 'bar') continue;
        let bx;
        let by;
        if (inside) { bx = sx < nx ? 1 : -1; by = 0; } else {
          const f = (px, py, q) => { const dx = x - px; const dy = y - py; const r3 = (dx * dx + dy * dy) ** 1.5 + 1; return [(q * dx) / r3, (q * dy) / r3]; };
          const [ax, ay] = f(nx, cy, 1);
          const [cxx, cyy] = f(sx, cy, -1);
          bx = ax + cxx; by = ay + cyy;
        }
        s += needle(x, y, bx, by);
      }
      if (mode === 'bar') {
        s += `<rect x="${cx - half}" y="${cy - 26}" width="${half}" height="52" style="fill:${flip ? 'color-mix(in srgb, var(--bad) 35%, var(--sheet))' : 'color-mix(in srgb, var(--blue) 35%, var(--sheet))'}"/><rect x="${cx}" y="${cy - 26}" width="${half}" height="52" style="fill:${flip ? 'color-mix(in srgb, var(--blue) 35%, var(--sheet))' : 'color-mix(in srgb, var(--bad) 35%, var(--sheet))'}"/>`;
        s += label(cx - half / 2, cy + 6, flip ? 'N' : 'S', { cls: 'bold' }) + label(cx + half / 2, cy + 6, flip ? 'S' : 'N', { cls: 'bold' });
      } else {
        for (let k = 0; k < 9; k++) {
          const x = cx - half + 10 + k * ((2 * half - 20) / 8);
          s += dotCross(x, cy - 40, !flip, 7) + dotCross(x, cy + 40, flip, 7);
        }
        s += label(nx + (nx > cx ? 22 : -22), cy + 5, 'N', { cls: 'bold' }) + label(sx + (sx > cx ? 22 : -22), cy + 5, 'S', { cls: 'bold' });
        if ($('.core', el)?.checked) s += `<rect x="${cx - half + 4}" y="${cy - 14}" width="${2 * half - 8}" height="28" rx="4" style="fill:color-mix(in srgb, var(--ink-3) 30%, transparent)"/>`;
      }
    } else {
      const cx = W / 2;
      const cy = H / 2;
      for (const [x, y] of pts) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy < 400) continue;
        // out of page current → anticlockwise field (seen from above)
        const sgn = flip ? -1 : 1;
        s += needle(x, y, sgn * dy, -sgn * dx);
      }
      for (const rr of [50, 95, 140]) s += `<circle cx="${cx}" cy="${cy}" r="${rr}" class="thin dash" style="stroke:var(--ink-3)"/>`;
      s += dotCross(cx, cy, !flip, 14);
    }
    $('.plot', el).innerHTML = svg(W, H, s, { title: 'Compass needles showing a magnetic field (red end points north)', maxw: 560 });
    const I = Number($('.I', el)?.value || 0);
    const N = Number($('.N', el)?.value || 0);
    const core = $('.core', el)?.checked;
    const notes = {
      bar: 'Field lines leave the <b>north</b> pole and enter the <b>south</b> pole. Each compass’s red (north) end points along the field. The field is strongest near the poles, where the needles crowd round.',
      wire: `Current ${flip ? 'into' : 'out of'} the page: the field lines are circles, going ${flip ? 'clockwise' : 'anticlockwise'}. Right-hand grip rule: thumb along the current, fingers curl the way of the field. B ∝ I/r: at this current the field 1 cm from the wire would be about ${sig(2e-7 * I / 0.01 * 1e6, 3)} μT (B = μ₀I/2πr).`,
      sol: `Inside, the field is strong and uniform; outside it looks like a bar magnet’s. Grip the coil with your right hand, fingers along the current: your thumb points to the N end. Field inside ≈ μ₀nI = ${sig(4 * Math.PI * 1e-7 * (N / 0.1) * I * (core ? 1000 : 1) * 1000, 3)} mT for a 10 cm coil${core ? ' (an iron core multiplies it by roughly a thousand)' : ''}.`,
    };
    $('.out', el).innerHTML = notes[mode];
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-m]');
    if (b) { ctx.onUse(); mode = b.dataset.m; el.querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('on', x === b)); extra(); draw(); }
    if (ev.target.closest('.flip')) { ctx.onUse(); flip = !flip; draw(); }
  });
  extra();
  draw();
}

/**
 * Force on a wire (F = BIL) or a moving charge (F = Bqv) in a field into or out of the page.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function forceLab(el, ctx) {
  let mode = 'wire';
  let fieldOut = false;
  let rightward = true;
  let charge = 'electron';
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><button type="button" class="tgl on" data-m="wire">Wire: F = BIL</button><button type="button" class="tgl" data-m="charge">Moving charge: F = Bqv</button></div>
    <div class="sim-row"><button type="button" class="btn ghost small fld">Reverse field</button><button type="button" class="btn ghost small dir">Reverse current / velocity</button><span class="qsel"></span></div>
    <div class="plot"></div><div class="sim-row sliders"></div><div class="sim-out out"></div></div>`;
  const sliders = () => {
    $('.sliders', el).innerHTML = `<label>B <input type="range" class="B" min="0.05" max="0.5" step="0.05" value="0.2"> <span class="Bv"></span></label>` +
      (mode === 'wire' ? '<label>I <input type="range" class="I" min="0.5" max="5" step="0.5" value="2"> <span class="Iv"></span></label><label>L <input type="range" class="L" min="0.05" max="0.3" step="0.05" value="0.1"> <span class="Lv"></span></label>' : '');
    $('.qsel', el).innerHTML = mode === 'charge' ? `<button type="button" class="tgl ${charge === 'electron' ? 'on' : ''}" data-q="electron">Electron</button><button type="button" class="tgl ${charge === 'proton' ? 'on' : ''}" data-q="proton">Proton</button>` : '';
  };
  const draw = () => {
    const B = Number($('.B', el).value);
    $('.Bv', el).textContent = `${B.toFixed(2)} T`;
    const W = 520;
    const H = 280;
    let s = '';
    for (let x = 40; x < W; x += 60) for (let y = 30; y < H; y += 60) s += dotCross(x, y, fieldOut, 7);
    // positive charge moving right in a field into the page: F = qv × B points up
    const sign = (mode === 'charge' && charge === 'electron' ? -1 : 1) * (rightward ? 1 : -1) * (fieldOut ? -1 : 1);
    let txt;
    if (mode === 'wire') {
      const I = Number($('.I', el).value);
      const L = Number($('.L', el).value);
      $('.Iv', el).textContent = `${I} A`;
      $('.Lv', el).textContent = `${L} m`;
      const F = B * I * L;
      const px = 60 + (L / 0.3) * 200;
      s += `<line x1="${W / 2 - px}" y1="${H / 2}" x2="${W / 2 + px}" y2="${H / 2}" style="stroke:var(--warn, #c9822b);stroke-width:7"/>`;
      s += arrow(rightward ? W / 2 - 40 : W / 2 + 40, H / 2 + 22, rightward ? W / 2 + 40 : W / 2 - 40, H / 2 + 22, 'accent') + label(W / 2, H / 2 + 42, `I = ${I} A`, { cls: 'bold' });
      const len = 20 + F * 200;
      s += arrow(W / 2, H / 2 - 8, W / 2, H / 2 - 8 - sign * len) + label(W / 2 + 10, H / 2 - 8 - sign * len / 2, `F = ${sig(F, 3)} N`, { anchor: 'start', cls: 'bold' });
      txt = `F = BIL = ${B.toFixed(2)} × ${I} × ${L} = <b>${sig(F, 3)} N</b>, ${sign > 0 ? 'up the page' : 'down the page'}.<br>Right-hand slap rule: fingers along B (${fieldOut ? 'out of' : 'into'} the page), thumb along the current (${rightward ? 'right' : 'left'}); your palm pushes in the direction of the force.`;
    } else {
      const p = charge === 'electron' ? { q: 1.6e-19, m: 9.11e-31, v: 2.0e6, n: 'electron' } : { q: 1.6e-19, m: 1.67e-27, v: 2.0e5, n: 'proton' };
      const F = B * p.q * p.v;
      const rr = (p.m * p.v) / (p.q * B);
      const rpx = Math.min(110, Math.max(30, rr * (charge === 'electron' ? 2e6 : 1e4) * 4));
      const cx = W / 2;
      const cy = H / 2 - sign * rpx;
      s += `<circle cx="${cx}" cy="${cy}" r="${rpx}" class="dash" style="stroke:var(--blue)"/>`;
      s += `<circle cx="${cx}" cy="${H / 2}" r="9" style="fill:${charge === 'electron' ? 'var(--blue)' : 'var(--bad)'};stroke:none"/>`;
      s += arrow(cx, H / 2, cx + (rightward ? 60 : -60), H / 2, 'accent') + label(cx + (rightward ? 70 : -70), H / 2 + 5, 'v', { anchor: rightward ? 'start' : 'end', cls: 'bold' });
      s += arrow(cx, H / 2, cx, H / 2 - sign * 45) + label(cx + 8, H / 2 - sign * 52, 'F', { anchor: 'start', cls: 'bold' });
      txt = `F = Bqv = ${B.toFixed(2)} × 1.6 × 10⁻¹⁹ × ${p.v.toExponential(1).replace('e+', ' × 10^')} = <b>${F.toExponential(2)} N</b>. The force is always at right angles to the velocity, so the ${p.n} moves in a <b>circle</b> (radius r = mv/Bq ≈ ${sig(rr * 1000, 3)} mm). A stronger field gives a tighter circle. Reverse the charge sign and the force — and the circle — flip.`;
    }
    $('.plot', el).innerHTML = svg(W, H, s, { title: mode === 'wire' ? 'Current-carrying wire in a magnetic field' : 'Charged particle moving in a magnetic field', maxw: 560 });
    $('.out', el).innerHTML = `Field ${fieldOut ? 'out of the page (dots)' : 'into the page (crosses)'}. ${txt}`;
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-m]');
    if (b) { ctx.onUse(); mode = b.dataset.m; el.querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('on', x === b)); sliders(); draw(); }
    const q = ev.target.closest('[data-q]');
    if (q) { charge = q.dataset.q; sliders(); draw(); }
    if (ev.target.closest('.fld')) { fieldOut = !fieldOut; draw(); }
    if (ev.target.closest('.dir')) { rightward = !rightward; draw(); }
  });
  sliders();
  draw();
}

/**
 * DC motor: a coil turning between magnet poles, with or without a split-ring commutator.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {() => void} Cleanup.
 */
function dcMotor(el, ctx) {
  el.innerHTML = `<div class="sim-ui"><div class="plot"></div>
    <div class="sim-row"><button type="button" class="btn primary small run">Switch on</button><label><input type="checkbox" class="comm" checked> Split-ring commutator</label><label>Current <input type="range" class="I" min="1" max="5" value="3"></label></div>
    <div class="sim-out out"></div></div>`;
  let theta = 0.3;
  let omega = 0;
  let on = false;
  let raf = 0;
  let last = 0;
  const torqueOf = (th) => {
    const I = Number($('.I', el).value);
    let dirn = 1;
    if ($('.comm', el).checked) dirn = Math.cos(th) >= 0 ? 1 : -1; // current reverses every half turn
    return on ? I * dirn * Math.cos(th) : 0;
  };
  const draw = () => {
    const W = 520;
    const H = 260;
    const cx = W / 2;
    const cy = 120;
    const halfW = 110 * Math.cos(theta);
    const tq = torqueOf(theta);
    let s = `<rect x="20" y="40" width="70" height="160" rx="8" style="fill:color-mix(in srgb, var(--bad) 35%, var(--sheet))"/><rect x="${W - 90}" y="40" width="70" height="160" rx="8" style="fill:color-mix(in srgb, var(--blue) 35%, var(--sheet))"/>` +
      label(55, 125, 'N', { cls: 'bold' }) + label(W - 55, 125, 'S', { cls: 'bold' });
    for (let y = 60; y <= 180; y += 40) s += arrow(95, y, W - 95, y, 'field');
    s += `<rect x="${cx - Math.abs(halfW)}" y="${cy - 60}" width="${Math.max(2, 2 * Math.abs(halfW))}" height="120" style="fill:color-mix(in srgb, var(--glow) 40%, transparent);stroke:var(--ink);stroke-width:4"/>`;
    const sideL = cx - halfW;
    const sideR = cx + halfW;
    if (on && Math.abs(tq) > 0.01) {
      const up = tq > 0 ? -1 : 1;
      s += arrow(sideL, cy, sideL, cy + up * 50, 'accent') + arrow(sideR, cy, sideR, cy - up * 50, 'accent');
    }
    s += label(cx, H - 10, `coil angle ${Math.round(((theta * 180) / Math.PI) % 360 + 360) % 360}° · turning effect ${tq >= 0 ? '' : '−'}${Math.abs(tq).toFixed(1)}`, { cls: 'small bold' });
    $('.plot', el).innerHTML = svg(W, H, s, { title: 'Coil between the poles of a magnet, seen side-on', maxw: 560 });
  };
  const step = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    omega += (torqueOf(theta) * 6 - omega * 0.8) * dt;
    theta += omega * dt;
    draw();
    raf = requestAnimationFrame(step);
  };
  const text = () => {
    $('.out', el).innerHTML = $('.comm', el).checked
      ? 'The two sides of the coil carry current in opposite directions, so F = BIL pushes one side up and the other down: a turning effect. Every half turn the split-ring commutator swaps the connections, reversing the current so the coil keeps turning the same way. More current → bigger forces → faster.'
      : 'Without a commutator the current never reverses. Once the coil passes the vertical, the forces push it back, so it just rocks to and fro and settles — it cannot keep spinning.';
  };
  el.addEventListener('click', (ev) => {
    if (!ev.target.closest('.run')) return;
    ctx.onUse();
    on = !on;
    ev.target.textContent = on ? 'Switch off' : 'Switch on';
    if (reducedMotion()) { draw(); return; }
    cancelAnimationFrame(raf);
    last = performance.now();
    raf = requestAnimationFrame(step);
  });
  el.addEventListener('input', () => { ctx.onUse(); text(); draw(); });
  text();
  draw();
  return () => cancelAnimationFrame(raf);
}

/**
 * Mount a Chapter 12/13 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {(() => void)|void} Cleanup.
 */
export function mount(el, id, ctx) {
  if (id === 'mag-field') return magField(el, ctx);
  if (id === 'force-lab') return forceLab(el, ctx);
  if (id === 'dc-motor') return dcMotor(el, ctx);
  return undefined;
}
