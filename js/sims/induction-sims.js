/**
 * induction-sims.js — Chapters 14–15 interactives: induction-lab (moving rod on rails and
 * magnet-in-coil), ac-generator (output of a spinning coil) and transformer-lab.
 */
import { $, reducedMotion } from '../utils/dom.js';
import { svg, comp, wire, label, arrow } from '../utils/svg.js';
import { sig, eng } from '../utils/math.js';

/**
 * Cross (field into page) marker.
 * @param {number} x X.
 * @param {number} y Y.
 * @returns {string} SVG markup.
 */
function cross(x, y) {
  return `<line x1="${x - 5}" y1="${y - 5}" x2="${x + 5}" y2="${y + 5}" class="thin" style="stroke:var(--ink-3)"/><line x1="${x - 5}" y1="${y + 5}" x2="${x + 5}" y2="${y - 5}" class="thin" style="stroke:var(--ink-3)"/>`;
}

/**
 * Induction lab with two modes.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {() => void} Cleanup.
 */
function inductionLab(el, ctx) {
  let mode = 'rod';
  let raf = 0;
  let magX = 60;
  let needleV = 0;
  let northFirst = true;
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><button type="button" class="tgl on" data-m="rod">Rod on rails: V = BvL</button><button type="button" class="tgl" data-m="coil">Magnet and coil</button></div>
    <div class="plot"></div><div class="sim-row ctrls"></div><div class="sim-out out"></div></div>`;
  const ctrls = () => {
    $('.ctrls', el).innerHTML = mode === 'rod'
      ? '<label>v <input type="range" class="v" min="0" max="10" step="0.5" value="4"> <span class="vv"></span></label><label>B <input type="range" class="B" min="0.1" max="1" step="0.1" value="0.5"> <span class="Bv"></span></label><label>L <input type="range" class="L" min="0.1" max="0.5" step="0.1" value="0.3"> <span class="Lv"></span></label><label>R <input type="range" class="R" min="1" max="10" value="2"> <span class="Rv"></span></label>'
      : '<button type="button" class="btn primary small push">Push magnet in</button><button type="button" class="btn ghost small pull">Pull it out</button><button type="button" class="btn ghost small flipm">Turn magnet round</button><label>Speed <input type="range" class="sp" min="1" max="3" value="2"></label><label>Turns <select class="N"><option>50</option><option selected>100</option><option>200</option></select></label>';
  };
  const drawRod = () => {
    const v = Number($('.v', el).value);
    const B = Number($('.B', el).value);
    const L = Number($('.L', el).value);
    const R = Number($('.R', el).value);
    $('.vv', el).textContent = `${v} m/s`; $('.Bv', el).textContent = `${B.toFixed(1)} T`; $('.Lv', el).textContent = `${L.toFixed(1)} m`; $('.Rv', el).textContent = `${R} Ω`;
    const emf = B * v * L;
    const I = emf / R;
    const F = B * I * L;
    const W = 520;
    const top = 50;
    const bot = top + 60 + L * 300;
    let s = '';
    for (let x = 60; x < W - 10; x += 45) for (let y = top - 20; y < bot + 30; y += 40) s += cross(x, y);
    s += wire([60, top], [W - 20, top]) + wire([60, bot], [W - 20, bot]) + comp('resistor', 60, top, 60, bot, { label: `R = ${R} Ω`, labelPos: 'right' });
    const rx = 330;
    s += `<line x1="${rx}" y1="${top - 8}" x2="${rx}" y2="${bot + 8}" style="stroke:var(--warn, #c9822b);stroke-width:8"/>`;
    if (v > 0) {
      s += arrow(rx + 12, (top + bot) / 2, rx + 12 + 10 + v * 8, (top + bot) / 2, 'accent') + label(rx + 26 + v * 8, (top + bot) / 2 - 8, `v = ${v} m/s`, { anchor: 'start', cls: 'small bold' });
      s += arrow(rx - 14, bot - 20, rx - 14, top + 20) + label(rx - 20, top + 34, 'I', { anchor: 'end', cls: 'bold' });
      s += arrow(rx, bot + 26, rx - 30 - F * 150, bot + 26, '') + label(rx - 38 - F * 150, bot + 31, 'F on rod (opposes motion)', { anchor: 'end', cls: 'small bold' });
    }
    $('.plot', el).innerHTML = svg(W, bot + 50, s, { title: 'Metal rod sliding along rails through a magnetic field into the page', maxw: 560 });
    $('.out', el).innerHTML = `Induced voltage <b>V = BvL = ${B.toFixed(1)} × ${v} × ${L.toFixed(1)} = ${sig(emf, 3)} V</b>; current I = V/R = ${sig(I, 3)} A, flowing up the rod.<br>` +
      `The current in the rod feels a force F = BIL = ${sig(F, 3)} N backwards — it <b>opposes</b> the motion (Lenz’s law). To keep the rod moving you must push with ${sig(F, 3)} N, doing work at ${sig(F * v, 3)} W, which appears as heat in R (I²R = ${sig(I * I * R, 3)} W).`;
  };
  const drawCoil = () => {
    const W = 520;
    const H = 220;
    const N = Number($('.N', el).value);
    let s = '';
    for (let k = 0; k < 9; k++) s += `<ellipse cx="${300 + k * 16}" cy="100" rx="8" ry="46" style="stroke:var(--warn, #c9822b);stroke-width:3"/>`;
    s += wire([300, 146], [300, 190], [360, 190]) + wire([428, 146], [428, 190], [400, 190]);
    s += `<circle cx="380" cy="190" r="22" class="fill-sheet"/><line x1="380" y1="196" x2="${380 + 18 * Math.sin(needleV)}" y2="${196 - 18 * Math.cos(needleV)}" style="stroke:var(--bad);stroke-width:2.5"/>` + label(380, 214, 'G', { cls: 'small bold' });
    const nCol = 'color-mix(in srgb, var(--bad) 40%, var(--sheet))';
    const sCol = 'color-mix(in srgb, var(--blue) 40%, var(--sheet))';
    s += `<rect x="${magX}" y="80" width="60" height="40" style="fill:${northFirst ? sCol : nCol}"/><rect x="${magX + 60}" y="80" width="60" height="40" style="fill:${northFirst ? nCol : sCol}"/>` +
      label(magX + 30, 106, northFirst ? 'S' : 'N', { cls: 'bold' }) + label(magX + 90, 106, northFirst ? 'N' : 'S', { cls: 'bold' });
    $('.plot', el).innerHTML = svg(W, H, s, { title: 'Bar magnet moving into a coil connected to a galvanometer', maxw: 560 });
    $('.out', el).innerHTML = `A voltage is induced only while the magnetic field through the coil is <b>changing</b> — when the magnet moves. Faster movement, a stronger magnet or more turns (now ${N}) → bigger reading. Pulling out, or turning the magnet round, reverses the direction. By Lenz’s law the coil’s current makes it repel the magnet as it comes in and attract it as it leaves.`;
  };
  const draw = () => (mode === 'rod' ? drawRod() : drawCoil());
  const move = (dir) => {
    ctx.onUse();
    cancelAnimationFrame(raf);
    const sp = Number($('.sp', el).value);
    const N = Number($('.N', el).value);
    const target = dir > 0 ? 210 : 60;
    if ((dir > 0 && magX >= target) || (dir < 0 && magX <= target)) return;
    const k = (northFirst ? 1 : -1) * dir * sp * (N / 100) * 0.35;
    if (reducedMotion()) { magX = target; needleV = 0; draw(); return; }
    const step = () => {
      magX += dir * sp * 3;
      const moving = dir > 0 ? magX < target : magX > target;
      needleV = moving ? Math.max(-1.2, Math.min(1.2, k)) : needleV * 0.8;
      if (!moving) magX = target;
      draw();
      if (moving || Math.abs(needleV) > 0.01) raf = requestAnimationFrame(step); else { needleV = 0; draw(); }
    };
    raf = requestAnimationFrame(step);
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  el.addEventListener('change', () => draw());
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-m]');
    if (b) { ctx.onUse(); mode = b.dataset.m; el.querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('on', x === b)); ctrls(); draw(); }
    if (ev.target.closest('.push')) move(1);
    if (ev.target.closest('.pull')) move(-1);
    if (ev.target.closest('.flipm')) { northFirst = !northFirst; draw(); }
  });
  ctrls();
  draw();
  return () => cancelAnimationFrame(raf);
}

/**
 * AC generator output graph.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function generator(el, ctx) {
  el.innerHTML = `<div class="sim-ui"><div class="plot"></div>
    <div class="sim-row"><label>Turns per second <input type="range" class="f" min="1" max="5" value="2"></label><span class="fv"></span></div>
    <div class="sim-row"><label>Turns of wire N <input type="range" class="N" min="10" max="100" step="10" value="50"></label><span class="Nv"></span></div>
    <div class="sim-row"><label>Field B <input type="range" class="B" min="0.1" max="0.5" step="0.1" value="0.2"></label><span class="Bv"></span></div>
    <div class="sim-out out"></div></div>`;
  const draw = () => {
    const f = Number($('.f', el).value);
    const N = Number($('.N', el).value);
    const B = Number($('.B', el).value);
    const A = 0.01; // 10 cm × 10 cm coil
    const peak = N * B * A * 2 * Math.PI * f;
    $('.fv', el).textContent = `${f} rev/s (${f} Hz)`; $('.Nv', el).textContent = N; $('.Bv', el).textContent = `${B.toFixed(1)} T`;
    const W = 520;
    const H = 230;
    const P = { l: 46, r: 10, t: 12, b: 34 };
    const vmax = 16;
    const X = (t) => P.l + t * (W - P.l - P.r);
    const Y = (v) => P.t + ((vmax - v) / (2 * vmax)) * (H - P.t - P.b);
    let s = '';
    for (let i = 0; i <= 10; i++) s += `<line x1="${X(i / 10)}" y1="${P.t}" x2="${X(i / 10)}" y2="${H - P.b}" class="thin" style="stroke:var(--line)"/>` + label(X(i / 10), H - P.b + 15, String(i / 10), { cls: 'small' });
    for (const v of [-16, -8, 0, 8, 16]) s += `<line x1="${P.l}" y1="${Y(v)}" x2="${W - P.r}" y2="${Y(v)}" class="thin" style="stroke:${v ? 'var(--line)' : 'var(--ink-3)'}"/>` + label(P.l - 6, Y(v) + 4, String(v), { anchor: 'end', cls: 'small' });
    let d = '';
    for (let i = 0; i <= 400; i++) { const t = i / 400; d += `${i ? 'L' : 'M'}${X(t).toFixed(1)},${Y(Math.max(-vmax, Math.min(vmax, peak * Math.sin(2 * Math.PI * f * t)))).toFixed(1)}`; }
    s += `<path d="${d}" style="stroke:var(--blue);stroke-width:3"/>` + label((W + P.l) / 2, H - 4, 'time (s)') + `<text x="13" y="${(H - P.b + P.t) / 2}" text-anchor="middle" class="lbl" transform="rotate(-90 13 ${(H - P.b + P.t) / 2})">EMF (V)</text>`;
    $('.plot', el).innerHTML = svg(W, H, s, { title: 'Generator output voltage against time', maxw: 560 });
    $('.out', el).innerHTML = `Peak EMF = NBAω = ${N} × ${B.toFixed(1)} × 0.010 m² × 2π × ${f} = <b>${sig(peak, 3)} V</b>; frequency <b>${f} Hz</b>.<br>Spin faster and <b>both</b> the frequency and the peak voltage increase (the flux changes faster). More turns or a stronger magnet raise the peak but not the frequency. The output is AC because each side of the coil moves up, then down, through the field.`;
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  draw();
}

/**
 * Transformer lab.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function transformer(el, ctx) {
  let dc = false;
  el.innerHTML = `<div class="sim-ui"><div class="sim-row"><button type="button" class="tgl on" data-s="ac">AC input</button><button type="button" class="tgl" data-s="dc">DC input</button><label><input type="checkbox" class="real"> Real transformer (95% efficient)</label></div>
    <div class="plot"></div>
    <div class="sim-row"><label>Input voltage <select class="Vp"><option>12</option><option selected>230</option><option>11000</option></select> V</label><label>Load <select class="R"><option>10</option><option selected>100</option><option>1000</option></select> Ω</label></div>
    <div class="sim-row"><label>Primary turns <input type="range" class="Np" min="50" max="2000" step="50" value="1000"></label><span class="Npv"></span></div>
    <div class="sim-row"><label>Secondary turns <input type="range" class="Ns" min="50" max="2000" step="50" value="100"></label><span class="Nsv"></span></div>
    <div class="sim-out out"></div></div>`;
  const draw = () => {
    const Vp = Number($('.Vp', el).value);
    const Np = Number($('.Np', el).value);
    const Ns = Number($('.Ns', el).value);
    const R = Number($('.R', el).value);
    const eff = $('.real', el).checked ? 0.95 : 1;
    $('.Npv', el).textContent = Np; $('.Nsv', el).textContent = Ns;
    const Vs = dc ? 0 : (Vp * Ns) / Np;
    const Is = Vs / R;
    const Ps = Vs * Is;
    const Pp = Ps / eff;
    const Ip = dc ? NaN : Pp / Vp;
    const coils = (x, n, side) => {
      const k = Math.max(3, Math.min(14, Math.round(n / 120)));
      let s = '';
      for (let i = 0; i < k; i++) { const y = 60 + i * (110 / k); s += `<path d="M${x - 14},${y} C ${x + (side ? 22 : -22)},${y + 2} ${x + (side ? 22 : -22)},${y + 110 / k - 2} ${x - 14},${y + 110 / k}" style="stroke:var(--warn, #c9822b);stroke-width:2.5"/>`; }
      return s;
    };
    let s = '<rect x="150" y="40" width="220" height="150" rx="6" style="fill:none;stroke:var(--ink-3);stroke-width:22"/>' + coils(150, Np, false) + coils(384, Ns, true);
    s += wire([136, 60], [60, 60]) + wire([136, 170], [60, 170]) + comp(dc ? 'cell' : 'ac', 60, 170, 60, 60, { label: `${Vp} V ${dc ? 'DC' : 'AC'}`, labelPos: 'left' });
    s += wire([398, 60], [470, 60]) + wire([398, 170], [470, 170]) + comp('resistor', 470, 60, 470, 170, { label: `${R} Ω`, labelPos: 'right' });
    s += label(150, 215, `primary ${Np} turns`, { cls: 'small bold' }) + label(370, 215, `secondary ${Ns} turns`, { cls: 'small bold' }) + label(260, 120, 'iron core', { cls: 'small' });
    $('.plot', el).innerHTML = svg(560, 225, s, { title: 'Transformer: primary coil, iron core, secondary coil and load', maxw: 580 });
    $('.out', el).innerHTML = dc
      ? '<b>No output.</b> A steady DC current makes a steady magnetic field in the core. The field through the secondary is not changing, so no voltage is induced (only a brief pulse when you switch on or off). Transformers need AC.'
      : `${Ns > Np ? '<b>Step-up</b>' : Ns < Np ? '<b>Step-down</b>' : 'Same voltage'}: V<sub>s</sub> = V<sub>p</sub> × N<sub>s</sub>/N<sub>p</sub> = ${Vp} × ${Ns}/${Np} = <b>${eng(Vs, 'V')}</b>.<br>Load current I<sub>s</sub> = V<sub>s</sub>/R = ${eng(Is, 'A')}; output power ${eng(Ps, 'W')}.<br>` +
        `Input power ${eng(Pp, 'W')} → primary current I<sub>p</sub> = ${eng(Ip, 'A')}${eff < 1 ? ' (5% lost as heat in the coils and core)' : ' (ideal: V<sub>p</sub>I<sub>p</sub> = V<sub>s</sub>I<sub>s</sub>)'}. Stepping the voltage up steps the current down.`;
  };
  el.addEventListener('input', () => { ctx.onUse(); draw(); });
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-s]');
    if (!b) return;
    ctx.onUse();
    dc = b.dataset.s === 'dc';
    el.querySelectorAll('[data-s]').forEach((x) => x.classList.toggle('on', x === b));
    draw();
  });
  draw();
}

/**
 * Mount a Chapter 14/15 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {(() => void)|void} Cleanup.
 */
export function mount(el, id, ctx) {
  if (id === 'induction-lab') return inductionLab(el, ctx);
  if (id === 'ac-generator') return generator(el, ctx);
  if (id === 'transformer-lab') return transformer(el, ctx);
  return undefined;
}
