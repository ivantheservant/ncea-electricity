/**
 * network-sims.js — Chapter 6 interactives: resistance-builder (total resistance) and
 * circuit-solver (step-by-step analysis of series, parallel and mixed circuits).
 */
import { $ } from '../utils/dom.js';
import { svg, comp, wire, label, dot } from '../utils/svg.js';
import { renderMath } from '../utils/tex.js';

const VALUES = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 47, 60, 100];

/**
 * Number to 3 significant figures as a plain string.
 * @param {number} x Value.
 * @returns {string} e.g. '2.40'.
 */
function f3(x) {
  if (!Number.isFinite(x)) return '—';
  const s = x.toPrecision(3);
  return s.includes('e') ? String(Number(s)) : s;
}

/**
 * Value picker.
 * @param {string} cls Class name.
 * @param {number} val Selected value.
 * @returns {string} HTML select.
 */
function pick(cls, val) {
  return `<select class="${cls}">${VALUES.map((v) => `<option ${v === val ? 'selected' : ''}>${v}</option>`).join('')}</select>`;
}

/**
 * Total resistance builder for series, parallel and one mixed arrangement.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function builder(el, ctx) {
  let mode = 'series';
  let vals = [4, 6, 12];
  el.innerHTML = `<div class="sim-ui"><div class="sim-row">${['series', 'parallel', 'mixed'].map((m) => `<button type="button" class="tgl ${m === mode ? 'on' : ''}" data-mode="${m}">${m === 'mixed' ? 'Mixed: R₁ + (R₂ ∥ R₃)' : m[0].toUpperCase() + m.slice(1)}</button>`).join('')}</div>
    <div class="plot"></div><div class="sim-row vals"></div><div class="sim-out out steps-out"></div></div>`;
  const draw = () => {
    if (mode === 'mixed' && vals.length !== 3) vals = [vals[0] || 4, vals[1] || 6, vals[2] || 12];
    $('.vals', el).innerHTML = vals.map((v, i) => `<label>R<sub>${i + 1}</sub> ${pick(`v${i}`, v)} Ω</label>`).join('') +
      (mode !== 'mixed' ? `${vals.length < 5 ? '<button type="button" class="btn ghost small add">+ Add resistor</button>' : ''}${vals.length > 2 ? '<button type="button" class="btn ghost small rem">− Remove</button>' : ''}` : '');
    let inner = '';
    let steps = '';
    let total;
    const n = vals.length;
    if (mode === 'series') {
      const x0 = 30;
      inner += label(x0, 52, 'A', { cls: 'bold' });
      vals.forEach((v, i) => { inner += comp('resistor', x0 + 10 + i * 90, 60, x0 + 100 + i * 90, 60, { label: `${v} Ω` }); });
      inner += label(x0 + 20 + n * 90, 52, 'B', { cls: 'bold' });
      total = vals.reduce((a, b) => a + b, 0);
      steps = `<b>Series: add them up.</b><ol><li>$R_T = ${vals.map((v, i) => `R_${i + 1}`).join(' + ')}$</li><li>$R_T = ${vals.join(' + ')}$</li><li>$R_T = ${f3(total)}\\ \\Omega$</li></ol>The total is always <b>bigger than the biggest</b> resistor (${Math.max(...vals)} Ω).`;
      $('.plot', el).innerHTML = svg(70 + n * 90, 90, inner, { title: 'Resistors in series', maxw: 120 + n * 90 });
    } else if (mode === 'parallel') {
      const top = 30;
      inner += wire([20, top + 10 + (n - 1) * 30], [60, top + 10 + (n - 1) * 30]) + label(14, top + 15 + (n - 1) * 30, 'A', { anchor: 'end', cls: 'bold' });
      inner += wire([60, top + 10], [60, top + 10 + (n - 1) * 60]) + wire([240, top + 10], [240, top + 10 + (n - 1) * 60]);
      vals.forEach((v, i) => { const y = top + 10 + i * 60; inner += comp('resistor', 60, y, 240, y, { label: `${v} Ω` }) + dot(60, y) + dot(240, y); });
      inner += wire([240, top + 10 + (n - 1) * 30], [280, top + 10 + (n - 1) * 30]) + label(288, top + 15 + (n - 1) * 30, 'B', { anchor: 'start', cls: 'bold' });
      const recip = vals.reduce((a, b) => a + 1 / b, 0);
      total = 1 / recip;
      steps = `<b>Parallel: add the reciprocals, then flip.</b><ol><li>$\\dfrac{1}{R_T} = ${vals.map((v, i) => `\\dfrac{1}{R_${i + 1}}`).join(' + ')}$</li><li>$\\dfrac{1}{R_T} = ${vals.map((v) => `\\dfrac{1}{${v}}`).join(' + ')} = ${vals.map((v) => f3(1 / v)).join(' + ')} = ${f3(recip)}\\ \\Omega^{-1}$</li><li>$R_T = \\dfrac{1}{${f3(recip)}} = ${f3(total)}\\ \\Omega$</li></ol>The total is always <b>smaller than the smallest</b> resistor (${Math.min(...vals)} Ω). Calculator: <code>${vals.map((v) => `${v} x⁻¹`).join(' + ')} = x⁻¹</code>.` +
        (n === 2 ? `<br>Shortcut for two: $R_T = \\dfrac{R_1 R_2}{R_1 + R_2} = \\dfrac{${vals[0]} \\times ${vals[1]}}{${vals[0]} + ${vals[1]}} = ${f3(total)}\\ \\Omega$.` : '');
      $('.plot', el).innerHTML = svg(310, top + 30 + (n - 1) * 60, inner, { title: 'Resistors in parallel', maxw: 360 });
    } else {
      const [a, b, c] = vals;
      const pr = (b * c) / (b + c);
      total = a + pr;
      inner += label(14, 64, 'A', { anchor: 'end', cls: 'bold' }) + wire([20, 60], [30, 60]) + comp('resistor', 30, 60, 130, 60, { label: `R₁ ${a} Ω` }) + wire([130, 60], [160, 60], [160, 30]) + wire([160, 60], [160, 100]);
      inner += comp('resistor', 160, 30, 290, 30, { label: `R₂ ${b} Ω` }) + comp('resistor', 160, 100, 290, 100, { label: `R₃ ${c} Ω`, labelPos: 'below' }) + wire([290, 30], [290, 100]) + wire([290, 60], [310, 60]) + dot(160, 60) + dot(290, 60) + label(318, 64, 'B', { anchor: 'start', cls: 'bold' });
      steps = `<b>Mixed: simplify the parallel pair first, then add the series part.</b><ol><li>Parallel pair: $R_{23} = \\dfrac{R_2 R_3}{R_2 + R_3} = \\dfrac{${b} \\times ${c}}{${b} + ${c}} = ${f3(pr)}\\ \\Omega$</li><li>Now R₁ is in series with R₂₃: $R_T = R_1 + R_{23} = ${a} + ${f3(pr)}$</li><li>$R_T = ${f3(total)}\\ \\Omega$</li></ol>`;
      $('.plot', el).innerHTML = svg(340, 140, inner, { title: 'R1 in series with R2 and R3 in parallel', maxw: 400 });
    }
    $('.out', el).innerHTML = `<p style="margin:0 0 6px">Total resistance between A and B: <b>${f3(total)} Ω</b></p>${steps}`;
    renderMath($('.out', el));
  };
  el.addEventListener('change', (ev) => {
    const m = ev.target.className.match(/^v(\d)$/);
    if (m) { ctx.onUse(); vals[Number(m[1])] = Number(ev.target.value); draw(); }
  });
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-mode]');
    if (b) { ctx.onUse(); mode = b.dataset.mode; el.querySelectorAll('[data-mode]').forEach((x) => x.classList.toggle('on', x === b)); if (mode === 'mixed') vals = vals.slice(0, 3); draw(); }
    if (ev.target.closest('.add')) { vals.push(10); draw(); }
    if (ev.target.closest('.rem')) { vals.pop(); draw(); }
  });
  draw();
}

const LAYOUTS = {
  series: { n: 'Series', count: 2 },
  parallel: { n: 'Parallel', count: 2 },
  mixed1: { n: 'R₁ + (R₂ ∥ R₃)', count: 3 },
  mixed2: { n: '(R₁ + R₂) ∥ R₃', count: 3 },
};

/**
 * Solve a preset circuit and return the steps and component results.
 * @param {string} kind Layout key.
 * @param {number} V Supply voltage.
 * @param {number[]} R Resistances.
 * @returns {{steps:string[], rows:{name:string, R:number, V:number, I:number}[], RT:number, IT:number}} Solution.
 */
function solve(kind, V, R) {
  const s = [];
  const rows = [];
  let RT;
  let IT;
  if (kind === 'series') {
    RT = R[0] + R[1];
    IT = V / RT;
    s.push(`Total resistance (series): $R_T = R_1 + R_2 = ${R[0]} + ${R[1]} = ${f3(RT)}\\ \\Omega$`);
    s.push(`Total current: $I = \\dfrac{V}{R_T} = \\dfrac{${V}}{${f3(RT)}} = ${f3(IT)}$ A. In series this current flows through <b>both</b> resistors.`);
    s.push(`Voltage across each: $V_1 = IR_1 = ${f3(IT)} \\times ${R[0]} = ${f3(IT * R[0])}$ V and $V_2 = IR_2 = ${f3(IT)} \\times ${R[1]} = ${f3(IT * R[1])}$ V.`);
    s.push(`Check: $V_1 + V_2 = ${f3(IT * R[0])} + ${f3(IT * R[1])} = ${f3(V)}$ V ✓ (they add up to the supply).`);
    rows.push({ name: 'R₁', R: R[0], V: IT * R[0], I: IT }, { name: 'R₂', R: R[1], V: IT * R[1], I: IT });
  } else if (kind === 'parallel') {
    RT = (R[0] * R[1]) / (R[0] + R[1]);
    IT = V / RT;
    s.push(`In parallel each resistor has the full supply voltage: $V_1 = V_2 = ${V}$ V.`);
    s.push(`Branch currents: $I_1 = \\dfrac{V}{R_1} = \\dfrac{${V}}{${R[0]}} = ${f3(V / R[0])}$ A and $I_2 = \\dfrac{V}{R_2} = \\dfrac{${V}}{${R[1]}} = ${f3(V / R[1])}$ A.`);
    s.push(`Total current (junction rule): $I = I_1 + I_2 = ${f3(V / R[0])} + ${f3(V / R[1])} = ${f3(IT)}$ A.`);
    s.push(`Check with total resistance: $R_T = \\dfrac{R_1R_2}{R_1+R_2} = ${f3(RT)}\\ \\Omega$, and $\\dfrac{V}{R_T} = \\dfrac{${V}}{${f3(RT)}} = ${f3(IT)}$ A ✓`);
    rows.push({ name: 'R₁', R: R[0], V, I: V / R[0] }, { name: 'R₂', R: R[1], V, I: V / R[1] });
  } else if (kind === 'mixed1') {
    const p = (R[1] * R[2]) / (R[1] + R[2]);
    RT = R[0] + p;
    IT = V / RT;
    const v1 = IT * R[0];
    const vp = V - v1;
    s.push(`Simplify the parallel pair: $R_{23} = \\dfrac{R_2R_3}{R_2+R_3} = \\dfrac{${R[1]} \\times ${R[2]}}{${R[1]} + ${R[2]}} = ${f3(p)}\\ \\Omega$.`);
    s.push(`Total resistance: $R_T = R_1 + R_{23} = ${R[0]} + ${f3(p)} = ${f3(RT)}\\ \\Omega$.`);
    s.push(`Total current (all of it flows through R₁): $I = \\dfrac{V}{R_T} = \\dfrac{${V}}{${f3(RT)}} = ${f3(IT)}$ A.`);
    s.push(`Voltage across R₁: $V_1 = IR_1 = ${f3(IT)} \\times ${R[0]} = ${f3(v1)}$ V. The rest is across the pair: $V_{23} = ${V} - ${f3(v1)} = ${f3(vp)}$ V (the same for R₂ and R₃).`);
    s.push(`Branch currents: $I_2 = \\dfrac{${f3(vp)}}{${R[1]}} = ${f3(vp / R[1])}$ A and $I_3 = \\dfrac{${f3(vp)}}{${R[2]}} = ${f3(vp / R[2])}$ A. Check: $${f3(vp / R[1])} + ${f3(vp / R[2])} = ${f3(IT)}$ A ✓`);
    rows.push({ name: 'R₁', R: R[0], V: v1, I: IT }, { name: 'R₂', R: R[1], V: vp, I: vp / R[1] }, { name: 'R₃', R: R[2], V: vp, I: vp / R[2] });
  } else {
    const top = R[0] + R[1];
    RT = (top * R[2]) / (top + R[2]);
    IT = V / RT;
    const it = V / top;
    s.push(`Top branch (R₁ and R₂ in series): $R_{12} = ${R[0]} + ${R[1]} = ${f3(top)}\\ \\Omega$. Each branch has the full ${V} V across it.`);
    s.push(`Top branch current: $I_{12} = \\dfrac{${V}}{${f3(top)}} = ${f3(it)}$ A, so $V_1 = ${f3(it)} \\times ${R[0]} = ${f3(it * R[0])}$ V and $V_2 = ${f3(it)} \\times ${R[1]} = ${f3(it * R[1])}$ V.`);
    s.push(`Bottom branch: $I_3 = \\dfrac{${V}}{${R[2]}} = ${f3(V / R[2])}$ A.`);
    s.push(`Total current: $I = ${f3(it)} + ${f3(V / R[2])} = ${f3(IT)}$ A. Check: $R_T = \\dfrac{R_{12}R_3}{R_{12}+R_3} = ${f3(RT)}\\ \\Omega$ and $\\dfrac{${V}}{${f3(RT)}} = ${f3(IT)}$ A ✓`);
    rows.push({ name: 'R₁', R: R[0], V: it * R[0], I: it }, { name: 'R₂', R: R[1], V: it * R[1], I: it }, { name: 'R₃', R: R[2], V, I: V / R[2] });
  }
  return { steps: s, rows, RT, IT };
}

/**
 * Circuit diagram for a preset.
 * @param {string} kind Layout key.
 * @param {number} V Supply voltage.
 * @param {number[]} R Resistances.
 * @returns {string} SVG.
 */
function diagram(kind, V, R) {
  const bat = (top, bottom) => comp('battery', 40, bottom, 40, top, { signs: true, label: `${V} V`, labelPos: 'left' });
  let inner = '';
  if (kind === 'series') {
    inner = bat(40, 150) + wire([40, 40], [80, 40]) + comp('resistor', 80, 40, 180, 40, { label: `R₁ = ${R[0]} Ω` }) + wire([180, 40], [210, 40]) + comp('resistor', 210, 40, 310, 40, { label: `R₂ = ${R[1]} Ω` }) + wire([310, 40], [340, 40], [340, 150], [40, 150]);
  } else if (kind === 'parallel') {
    inner = bat(40, 160) + wire([40, 40], [300, 40]) + comp('resistor', 180, 40, 180, 160, { label: `R₁ = ${R[0]} Ω`, labelPos: 'right' }) + comp('resistor', 300, 40, 300, 160, { label: `R₂ = ${R[1]} Ω`, labelPos: 'right' }) + wire([40, 160], [300, 160]) + dot(180, 40) + dot(180, 160);
  } else if (kind === 'mixed1') {
    inner = bat(50, 170) + wire([40, 50], [70, 50]) + comp('resistor', 70, 50, 160, 50, { label: `R₁ = ${R[0]} Ω` }) + wire([160, 50], [200, 50]) + comp('resistor', 200, 50, 320, 50, { label: `R₂ = ${R[1]} Ω` }) + wire([320, 50], [360, 50], [360, 170], [40, 170]) +
      wire([180, 50], [180, 115], [200, 115]) + comp('resistor', 200, 115, 320, 115, { label: `R₃ = ${R[2]} Ω`, labelPos: 'below' }) + wire([320, 115], [360, 115]) + dot(180, 50) + dot(360, 115);
  } else {
    inner = bat(40, 170) + wire([40, 40], [70, 40]) + comp('resistor', 70, 40, 180, 40, { label: `R₁ = ${R[0]} Ω` }) + comp('resistor', 180, 40, 290, 40, { label: `R₂ = ${R[1]} Ω` }) + wire([290, 40], [330, 40], [330, 170], [40, 170]) +
      wire([60, 40], [60, 110], [120, 110]) + comp('resistor', 120, 110, 240, 110, { label: `R₃ = ${R[2]} Ω`, labelPos: 'below' }) + wire([240, 110], [330, 110]) + dot(60, 40) + dot(330, 110);
  }
  return svg(400, 200, inner, { title: `${LAYOUTS[kind].n} circuit`, maxw: 460 });
}

/**
 * Step-by-step circuit solver.
 * @param {Element} el Mount.
 * @param {object} ctx Context.
 * @returns {void}
 */
function solver(el, ctx) {
  let kind = 'series';
  let shown = 0;
  const R = [4, 12, 6];
  let V = 12;
  el.innerHTML = `<div class="sim-ui"><div class="sim-row">${Object.entries(LAYOUTS).map(([k, l]) => `<button type="button" class="tgl ${k === kind ? 'on' : ''}" data-k="${k}">${l.n}</button>`).join('')}</div>
    <div class="plot"></div><div class="sim-row vals"></div>
    <div class="sim-row"><button type="button" class="btn primary small next">Show next step</button><button type="button" class="btn ghost small all">Show all</button><button type="button" class="btn ghost small hide">Hide working</button></div>
    <div class="sim-out out steps-out"></div></div>`;
  const draw = () => {
    const n = LAYOUTS[kind].count;
    $('.vals', el).innerHTML = `<label>Supply <select class="sv">${[3, 6, 9, 12, 24].map((v) => `<option ${v === V ? 'selected' : ''}>${v}</option>`).join('')}</select> V</label>` +
      R.slice(0, n).map((v, i) => `<label>R<sub>${i + 1}</sub> ${pick(`v${i}`, v)} Ω</label>`).join('');
    $('.plot', el).innerHTML = diagram(kind, V, R);
    const sol = solve(kind, V, R);
    const done = shown >= sol.steps.length;
    $('.out', el).innerHTML = (shown ? `<ol>${sol.steps.slice(0, shown).map((x) => `<li>${x}</li>`).join('')}</ol>` : '<p style="margin:0">Work out the total current and every voltage and current yourself, then reveal the steps one at a time.</p>') +
      (done ? `<div class="tablewrap"><table class="rd"><thead><tr><th></th><th>R (Ω)</th><th>V (V)</th><th>I (A)</th><th>P = VI (W)</th></tr></thead><tbody>${sol.rows.map((r) => `<tr><td><b>${r.name}</b></td><td>${r.R}</td><td>${f3(r.V)}</td><td>${f3(r.I)}</td><td>${f3(r.V * r.I)}</td></tr>`).join('')}<tr><td><b>Total</b></td><td>${f3(sol.RT)}</td><td>${V}</td><td>${f3(sol.IT)}</td><td>${f3(V * sol.IT)}</td></tr></tbody></table></div>` : '');
    $('.next', el).disabled = done;
    renderMath($('.out', el));
  };
  el.addEventListener('change', (ev) => {
    ctx.onUse();
    if (ev.target.classList.contains('sv')) V = Number(ev.target.value);
    const m = ev.target.className.match(/^v(\d)$/);
    if (m) R[Number(m[1])] = Number(ev.target.value);
    shown = 0;
    draw();
  });
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-k]');
    if (b) { ctx.onUse(); kind = b.dataset.k; shown = 0; el.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('on', x === b)); draw(); }
    if (ev.target.closest('.next')) { ctx.onUse(); shown += 1; draw(); }
    if (ev.target.closest('.all')) { shown = 99; draw(); }
    if (ev.target.closest('.hide')) { shown = 0; draw(); }
  });
  draw();
}

/**
 * Mount a Chapter 6 sim.
 * @param {Element} el Mount.
 * @param {string} id Sim id.
 * @param {object} ctx Context.
 * @returns {(() => void)|void} Cleanup.
 */
export function mount(el, id, ctx) {
  if (id === 'resistance-builder') return builder(el, ctx);
  if (id === 'circuit-solver') return solver(el, ctx);
  return undefined;
}
