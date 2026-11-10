/**
 * maths-trainers.js — practice machines for Chapter 0:
 * prefix-trainer, sci-trainer, rearrange-trainer, sigfig-trainer.
 */
import { $, $$, shuffle } from '../utils/dom.js';
import { parseNumber, approxEqual, roundSF, countSF, randInt, pick, fmtSci } from '../utils/math.js';
import { renderMath } from '../utils/tex.js';

const PREFIX = [
  { p: 'G', n: 'giga', e: 9 }, { p: 'M', n: 'mega', e: 6 }, { p: 'k', n: 'kilo', e: 3 }, { p: '', n: '(none)', e: 0 },
  { p: 'm', n: 'milli', e: -3 }, { p: 'μ', n: 'micro', e: -6 }, { p: 'n', n: 'nano', e: -9 }, { p: 'p', n: 'pico', e: -12 },
];
const UNITS = [['A', 'current'], ['V', 'voltage'], ['Ω', 'resistance'], ['C', 'charge'], ['W', 'power'], ['J', 'energy']];

/**
 * Format a plain decimal without floating-point noise.
 * @param {number} x Value.
 * @returns {string} Text.
 */
function nice(x) {
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e-4 && a < 1e7) return String(Number(x.toPrecision(10)));
  return fmtSci(x, 4).replace(/<\/?sup>/g, (t) => (t === '<sup>' ? '^' : ''));
}

/**
 * Shared shell for a trainer: question area, input, feedback, streak.
 * @param {Element} el Mount point.
 * @param {string} title Heading.
 * @param {() => {html:string, check:(raw:string)=>{ok:boolean, why:string}, input?:string, options?:string[]}} make Question factory.
 * @param {object} ctx Sim context.
 * @returns {void}
 */
function trainer(el, title, make, ctx) {
  let q = null;
  let streak = 0;
  let best = 0;
  let answered = false;
  el.innerHTML = `<div class="sim-ui"><div class="sim-row between" style="justify-content:space-between"><b>${title}</b><span class="sim-score">Streak 0 · Best 0</span></div>
    <div class="sim-big tq"></div><div class="tin"></div><div class="sim-feedback"></div>
    <div class="sim-row"><button type="button" class="btn primary small tcheck">Check</button><button type="button" class="btn ghost small tnext">New question</button></div></div>`;
  const fb = $('.sim-feedback', el);
  /** New question. */
  const next = () => {
    q = make();
    answered = false;
    $('.tq', el).innerHTML = q.html;
    $('.tin', el).innerHTML = q.options
      ? `<div class="opts">${q.options.map((o, i) => `<button type="button" class="opt" data-i="${i}" role="radio" aria-checked="false"><span class="opt-mark"></span><span class="opt-text">${o}</span></button>`).join('')}</div>`
      : `<div class="numrow"><input class="numin" type="text" autocomplete="off" spellcheck="false" placeholder="${q.input || 'Your answer'}" aria-label="Your answer">${q.unit ? `<span class="unit">${q.unit}</span>` : ''}</div>`;
    fb.textContent = '';
    fb.className = 'sim-feedback';
    $('.tcheck', el).disabled = false;
    renderMath(el);
  };
  /** Mark, or move on when already marked. */
  const check = () => {
    const btn = $('.tcheck', el);
    if (answered) { next(); btn.textContent = 'Check'; return; }
    const sel = $('.opt[aria-checked="true"]', el);
    const raw = q.options ? (sel ? sel.dataset.i : '') : $('.numin', el).value;
    if (!String(raw).trim()) { fb.textContent = 'Enter an answer first.'; return; }
    ctx.onUse();
    const r = q.check(raw);
    answered = true;
    streak = r.ok ? streak + 1 : 0;
    best = Math.max(best, streak);
    fb.className = `sim-feedback ${r.ok ? 'ok' : 'no'}`;
    fb.innerHTML = `${r.ok ? '✓ Correct!' : '✗ Not quite.'} <span style="font-weight:400">${r.why}</span>`;
    $('.sim-score', el).textContent = `Streak ${streak} · Best ${best}`;
    btn.textContent = 'Next';
    renderMath(fb);
  };
  el.addEventListener('click', (ev) => {
    const o = ev.target.closest('.opt');
    if (o && !answered) { $$('.opt', el).forEach((b) => b.setAttribute('aria-checked', String(b === o))); return; }
    if (ev.target.closest('.tcheck')) { check(); return; }
    if (ev.target.closest('.tnext')) { $('.tcheck', el).textContent = 'Check'; next(); }
  });
  el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target.matches('.numin')) { ev.preventDefault(); check(); } });
  next();
}

/**
 * Prefix conversion question.
 * @returns {object} Question.
 */
function prefixQ() {
  const [u, what] = pick(UNITS);
  let from;
  let to;
  do { from = pick(PREFIX.slice(1, 7)); to = pick(PREFIX.slice(1, 7)); } while (from === to || Math.abs(from.e - to.e) > 6);
  const val = pick([1.5, 2.2, 4.7, 12, 25, 47, 68, 150, 220, 330, 470, 0.5, 0.82, 3.3]);
  const ans = val * Math.pow(10, from.e - to.e);
  const why = `${from.n} = 10<sup>${from.e}</sup> and ${to.n} = 10<sup>${to.e}</sup>, so multiply by 10<sup>${from.e - to.e}</sup>: ${val} ${from.p}${u} = ${nice(ans)} ${to.p}${u}.`;
  return {
    html: `Convert <b>${val} ${from.p}${u}</b> (${what}) into <b>${to.p}${u}</b>`, unit: `${to.p}${u}`, input: 'Number only',
    check: (raw) => ({ ok: approxEqual(parseNumber(raw), ans, 1e-6), why }),
  };
}

/**
 * Scientific-notation question.
 * @returns {object} Question.
 */
function sciQ() {
  const mant = pick([1.6, 2.5, 3.0, 4.7, 6.25, 9.1, 1.2, 7.5, 5.4, 8.99]);
  const e = pick([-19, -12, -9, -6, -5, -4, -3, 3, 4, 5, 6, 8, 9, 18]);
  const val = mant * Math.pow(10, e);
  if (Math.random() < 0.5 && Math.abs(e) <= 6) {
    const dec = nice(val);
    return {
      html: `Write <b>${dec.replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}</b> in scientific notation`, input: 'e.g. 4.7×10^-4',
      check: (raw) => {
        const v = parseNumber(raw);
        const m = String(raw).replace(/\s/g, '').match(/^([+-]?\d*\.?\d+)\s*(?:[x×*·]10\^?|e)/i);
        const mOk = m && Math.abs(parseFloat(m[1])) >= 1 && Math.abs(parseFloat(m[1])) < 10;
        const ok = approxEqual(v, val, 1e-9) && !!mOk;
        return { ok, why: ok ? `${dec} = ${mant} × 10<sup>${e}</sup>.` : `${approxEqual(v, val, 1e-9) ? 'The value is right, but the number in front must be between 1 and 10. ' : ''}Answer: ${mant} × 10<sup>${e}</sup>.` };
      },
    };
  }
  return {
    html: `Calculate <b>(${mant} × 10<sup>${e}</sup>) × (2 × 10<sup>${-Math.sign(e) * 2}</sup>)</b>`, input: 'e.g. 3.2×10^-17',
    check: (raw) => {
      const ans = val * 2 * Math.pow(10, -Math.sign(e) * 2);
      return { ok: approxEqual(parseNumber(raw), ans, 1e-6), why: `Multiply the numbers (${mant} × 2 = ${nice(mant * 2)}) and add the powers (${e} + ${-Math.sign(e) * 2} = ${e - Math.sign(e) * 2}): ${fmtSci(ans, 3)}.` };
    },
  };
}

const FORMULAS = [
  { f: 'V = IR', s: 'I', a: 'I = \\frac{V}{R}', w: ['I = VR', 'I = \\frac{R}{V}', 'I = V - R'], why: 'Divide both sides by $R$.' },
  { f: 'V = IR', s: 'R', a: 'R = \\frac{V}{I}', w: ['R = VI', 'R = \\frac{I}{V}', 'R = V - I'], why: 'Divide both sides by $I$.' },
  { f: 'Q = It', s: 't', a: 't = \\frac{Q}{I}', w: ['t = QI', 't = \\frac{I}{Q}', 't = Q - I'], why: 'Divide both sides by $I$.' },
  { f: 'P = VI', s: 'V', a: 'V = \\frac{P}{I}', w: ['V = PI', 'V = \\frac{I}{P}', 'V = P - I'], why: 'Divide both sides by $I$.' },
  { f: 'E = Pt', s: 'P', a: 'P = \\frac{E}{t}', w: ['P = Et', 'P = \\frac{t}{E}', 'P = E - t'], why: 'Divide both sides by $t$.' },
  { f: 'E = Vq', s: 'q', a: 'q = \\frac{E}{V}', w: ['q = EV', 'q = \\frac{V}{E}', 'q = E + V'], why: 'Divide both sides by $V$.' },
  { f: 'P = I^2R', s: 'I', a: 'I = \\sqrt{\\frac{P}{R}}', w: ['I = \\frac{P}{R^2}', 'I = \\sqrt{PR}', 'I = \\frac{P^2}{R}'], why: 'Divide by $R$ to get $I^2 = P/R$, then take the square root.' },
  { f: 'P = \\frac{V^2}{R}', s: 'V', a: 'V = \\sqrt{PR}', w: ['V = \\frac{P}{R}', 'V = \\sqrt{\\frac{P}{R}}', 'V = PR^2'], why: 'Multiply by $R$ to get $V^2 = PR$, then take the square root.' },
  { f: 'E_k = \\tfrac{1}{2}mv^2', s: 'v', a: 'v = \\sqrt{\\frac{2E_k}{m}}', w: ['v = \\frac{2E_k}{m}', 'v = \\sqrt{\\frac{E_k}{2m}}', 'v = \\sqrt{2E_k m}'], why: 'Multiply by 2, divide by $m$, then take the square root.' },
  { f: 'V = \\varepsilon - Ir', s: 'r', a: 'r = \\frac{\\varepsilon - V}{I}', w: ['r = \\frac{V - \\varepsilon}{I}', 'r = \\varepsilon - VI', 'r = \\frac{\\varepsilon}{I} - V'], why: 'Add $Ir$ to both sides and subtract $V$: $Ir = \\varepsilon - V$. Then divide by $I$.' },
  { f: 'E = \\frac{V}{d}', s: 'd', a: 'd = \\frac{V}{E}', w: ['d = VE', 'd = \\frac{E}{V}', 'd = V - E'], why: 'Multiply both sides by $d$ ($Ed = V$), then divide by $E$.' },
];

/**
 * Rearranging question.
 * @returns {object} Question.
 */
function rearrangeQ() {
  const f = pick(FORMULAS);
  const opts = shuffle([f.a, ...f.w]);
  const ans = opts.indexOf(f.a);
  return {
    html: `Make $${f.s}$ the subject of $${f.f}$`, options: opts.map((o) => `$${o}$`),
    check: (raw) => ({ ok: Number(raw) === ans, why: `${f.why} So $${f.a}$.` }),
  };
}

/**
 * Significant-figure question.
 * @returns {object} Question.
 */
function sigfigQ() {
  if (Math.random() < 0.45) {
    const s = pick(['0.00450', '2.030', '1500.0', '0.0702', '3.00', '12.5', '0.000600', '6.02', '100.4', '0.10', '45.0', '7.0010']);
    const n = countSF(s);
    return {
      html: `How many significant figures are in <b>${s}</b>?`, input: 'A whole number',
      check: (raw) => ({ ok: parseInt(raw, 10) === n, why: `${s} has ${n} significant figures. Leading zeros never count; zeros between digits count; zeros at the end after a decimal point count.` }),
    };
  }
  let x;
  let n;
  let r;
  do {
    n = pick([2, 3]);
    x = (randInt(10001, 99999) / 10000) * Math.pow(10, randInt(-4, 1));
    r = roundSF(x, n);
  } while (Number.isInteger(r) && r % 10 === 0);
  const shown = Number(x.toPrecision(5));
  const ansText = r.toPrecision(n);
  return {
    html: `Round <b>${shown}</b> to <b>${n}</b> significant figures`, input: 'Your rounded number',
    check: (raw) => {
      const v = parseNumber(raw);
      const ok = approxEqual(v, r, 1e-9) && countSF(String(raw).trim()) === n;
      return { ok, why: `Answer: ${ansText}. Count ${n} digits from the first non-zero digit, then look at the next digit to decide whether to round up.` };
    },
  };
}

/**
 * Mount one of the maths trainers.
 * @param {Element} el Mount point.
 * @param {string} id Sim id.
 * @param {object} ctx Context with onUse().
 * @returns {void}
 */
export function mount(el, id, ctx) {
  if (id === 'prefix-trainer') trainer(el, 'Prefix converter', prefixQ, ctx);
  if (id === 'sci-trainer') trainer(el, 'Scientific notation practice', sciQ, ctx);
  if (id === 'rearrange-trainer') trainer(el, 'Rearranging practice', rearrangeQ, ctx);
  if (id === 'sigfig-trainer') trainer(el, 'Significant figures practice', sigfigQ, ctx);
}

