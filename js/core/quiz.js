/**
 * quiz.js — the quiz engine used by lesson checkpoints, quick checks, chapter tests,
 * practice mixes and the mistake book.
 *
 * Question types: mcq, multi, tf, num, order, match, fill, explain.
 * Modes: 'inline' (single quick check), 'checkpoint' (2 tries + hint), 'test', 'practice', 'mistakes'.
 */
import { esc, shuffle, $, $$ } from '../utils/dom.js';
import { parseNumber, approxEqual, countSF, fmtSci } from '../utils/math.js';
import { renderMath } from '../utils/tex.js';
import { XP } from '../config.js';
import { addXP } from './xp.js';
import { recordAnswer } from './progress.js';

const TIER_NAME = { A: 'Achieved', M: 'Merit', E: 'Excellence' };

/**
 * Prepare a question for display (shuffled options, item orders).
 * @param {object} q Question.
 * @returns {object} View model.
 */
function prepare(q) {
  const vm = { q };
  if (q.type === 'mcq' || q.type === 'multi') {
    const idx = q.options.map((_, i) => i);
    vm.order = q.noShuffle ? idx : shuffle(idx);
  }
  if (q.type === 'order') {
    let o = shuffle(q.items.map((_, i) => i));
    if (o.every((v, i) => v === i) && o.length > 1) o = o.reverse();
    vm.order = o;
  }
  if (q.type === 'match') vm.right = shuffle(q.pairs.map((p, i) => i));
  return vm;
}

/**
 * Markup for the answer area of a question.
 * @param {object} vm View model from prepare().
 * @returns {string} HTML.
 */
function bodyHTML(vm) {
  const q = vm.q;
  switch (q.type) {
    case 'mcq':
    case 'multi':
      return `<div class="opts" role="${q.type === 'mcq' ? 'radiogroup' : 'group'}">${vm.order.map((i) =>
        `<button type="button" class="opt" data-i="${i}" role="${q.type === 'mcq' ? 'radio' : 'checkbox'}" aria-checked="false"><span class="opt-mark"></span><span class="opt-text">${q.options[i]}</span></button>`).join('')}</div>` +
        (q.type === 'multi' ? '<p class="qnote">Select all that apply.</p>' : '');
    case 'tf':
      return `<div class="opts tf" role="radiogroup"><button type="button" class="opt" data-i="1" role="radio" aria-checked="false"><span class="opt-mark"></span><span class="opt-text">True</span></button>` +
        `<button type="button" class="opt" data-i="0" role="radio" aria-checked="false"><span class="opt-mark"></span><span class="opt-text">False</span></button></div>`;
    case 'num':
      return `<div class="numrow"><input class="numin" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Your answer" aria-label="Your answer">` +
        (q.units ? `<select class="unitin" aria-label="Unit"><option value="">unit…</option>${q.units.map((u) => `<option>${esc(u)}</option>`).join('')}</select>` : (q.unit ? `<span class="unit">${q.unit}</span>` : '')) +
        `</div><div class="chips"><button type="button" class="chip" data-ins="×10^">×10^</button><button type="button" class="chip" data-ins="-">−</button><button type="button" class="chip" data-ins=".">.</button></div>` +
        `<p class="qnote">Type numbers like 0.25, 2.5×10^-3 or 2.5e-3.</p>`;
    case 'order':
      return `<ol class="orderlist">${vm.order.map((i) => `<li data-i="${i}"><span class="ord-text">${q.items[i]}</span>` +
        `<span class="ord-btns"><button type="button" class="ord-up" aria-label="Move up">▲</button><button type="button" class="ord-down" aria-label="Move down">▼</button></span></li>`).join('')}</ol>` +
        '<p class="qnote">Use ▲ ▼ to put the steps in order.</p>';
    case 'match':
      return `<div class="matchgrid">${q.pairs.map((p, i) => `<div class="match-left">${p[0]}</div>` +
        `<select class="match-sel" data-i="${i}" aria-label="Match for item ${i + 1}"><option value="">choose…</option>${vm.right.map((j) => `<option value="${j}">${esc(stripTags(q.pairs[j][1]))}</option>`).join('')}</select>`).join('')}</div>`;
    case 'fill': {
      let k = 0;
      const html = q.text.replace(/\{(\d+)\}/g, (_, n) => {
        const b = q.blanks[Number(n)];
        k++;
        return `<select class="fill-sel" data-b="${n}" aria-label="Blank ${k}"><option value="">…</option>${b.options.map((o, i) => `<option value="${i}">${esc(o)}</option>`).join('')}</select>`;
      });
      return `<p class="filltext">${html}</p>`;
    }
    case 'explain':
      return `<textarea class="explain-in" rows="5" placeholder="Write your answer here first, then compare it with the model answer."></textarea>` +
        `<div class="rubric hidden"><div class="model"><h4>Model answer</h4>${q.model}</div>` +
        `<h4>Tick each point your answer included</h4><ul class="points">${q.points.map((p, i) =>
          `<li><label><input type="checkbox" data-p="${i}"> <span class="tier-tag t-${p.lvl}">${p.lvl}</span> ${p.text}</label></li>`).join('')}</ul></div>`;
    default:
      return '<p>Unknown question type.</p>';
  }
}

/**
 * Remove tags (for option text inside <select>).
 * @param {string} s HTML.
 * @returns {string} Text.
 */
function stripTags(s) {
  return String(s).replace(/<sup>(.*?)<\/sup>/g, '^$1').replace(/<sub>(.*?)<\/sub>/g, '$1').replace(/<[^>]+>/g, '').replace(/\$/g, '');
}

/**
 * Read the student's response from the card.
 * @param {object} vm View model.
 * @param {Element} card Card element.
 * @returns {*} Response (shape depends on type) or null if incomplete.
 */
function readResponse(vm, card) {
  const q = vm.q;
  switch (q.type) {
    case 'mcq':
    case 'tf': {
      const sel = $('.opt[aria-checked="true"]', card);
      return sel ? Number(sel.dataset.i) : null;
    }
    case 'multi': {
      const sel = $$('.opt[aria-checked="true"]', card).map((b) => Number(b.dataset.i));
      return sel.length ? sel.sort() : null;
    }
    case 'num': {
      const raw = $('.numin', card).value;
      if (!raw.trim()) return null;
      const unit = $('.unitin', card)?.value ?? null;
      if (q.units && !unit) return null;
      return { raw, value: parseNumber(raw), unit };
    }
    case 'order':
      return $$('.orderlist li', card).map((li) => Number(li.dataset.i));
    case 'match': {
      const v = $$('.match-sel', card).map((s) => s.value);
      return v.some((x) => x === '') ? null : v.map(Number);
    }
    case 'fill': {
      const v = $$('.fill-sel', card).map((s) => s.value);
      return v.some((x) => x === '') ? null : v.map(Number);
    }
    case 'explain':
      return $$('.points input', card).map((c) => c.checked);
    default:
      return null;
  }
}

/**
 * Mark a response.
 * @param {object} q Question.
 * @param {*} r Response from readResponse().
 * @returns {{correct:boolean, score:number, msg?:string}} Result.
 */
export function grade(q, r) {
  switch (q.type) {
    case 'mcq':
      return { correct: r === q.answer, score: r === q.answer ? 1 : 0 };
    case 'tf':
      return { correct: r === (q.answer ? 1 : 0), score: r === (q.answer ? 1 : 0) ? 1 : 0 };
    case 'multi': {
      const want = q.answer.slice().sort();
      const ok = want.length === r.length && want.every((v, i) => v === r[i]);
      return { correct: ok, score: ok ? 1 : 0 };
    }
    case 'num': {
      if (!Number.isFinite(r.value)) return { correct: false, score: 0, msg: 'That is not a number the app can read. Try a form like 2.5×10^-3.' };
      const tol = q.exact ? 1e-9 : (q.tol ?? 0.02);
      let ok = approxEqual(r.value, q.answer, tol);
      let msg = '';
      if (ok && q.sf && countSF(r.raw.replace(/[x×*]10\^.*$/i, '')) !== q.sf) { ok = false; msg = `The value is right, but it should have ${q.sf} significant figures.`; }
      if (ok && q.units && r.unit !== q.unit) { ok = false; msg = 'The number is right, but the unit is not.'; }
      if (!ok && !msg && approxEqual(Math.abs(r.value), Math.abs(q.answer), tol)) msg = 'Check the sign (+ or −).';
      if (!ok && !msg && Number.isFinite(r.value) && q.answer !== 0) {
        const ratio = Math.log10(Math.abs(r.value / q.answer));
        if (Math.abs(ratio - Math.round(ratio)) < 0.01 && Math.round(ratio) !== 0) msg = `You are out by a factor of 10${Math.round(ratio) > 0 ? '' : '⁻'}${superscript(Math.abs(Math.round(ratio)))} — check your prefixes and powers of ten.`;
      }
      return { correct: ok, score: ok ? 1 : 0, msg };
    }
    case 'order': {
      const ok = r.every((v, i) => v === i);
      return { correct: ok, score: ok ? 1 : 0 };
    }
    case 'match':
    case 'fill': {
      const want = q.type === 'match' ? q.pairs.map((_, i) => i) : q.blanks.map((b) => b.answer);
      const right = r.filter((v, i) => v === want[i]).length;
      return { correct: right === want.length, score: right / want.length };
    }
    case 'explain': {
      const ticked = r.filter(Boolean).length;
      const score = q.points.length ? ticked / q.points.length : 0;
      return { correct: score >= 0.67, score };
    }
    default:
      return { correct: false, score: 0 };
  }
}

/**
 * Small integer to superscript digits.
 * @param {number} n Integer.
 * @returns {string} Superscript string.
 */
function superscript(n) {
  return String(n).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]).join('');
}

/**
 * The correct answer as HTML (shown after the final attempt).
 * @param {object} q Question.
 * @returns {string} HTML.
 */
export function answerHTML(q) {
  switch (q.type) {
    case 'mcq': return q.options[q.answer];
    case 'multi': return q.answer.map((i) => q.options[i]).join('; ');
    case 'tf': return q.answer ? 'True' : 'False';
    case 'num': return `${q.answerText || fmtSci(q.answer, q.sf || 3)}${q.unit ? ' ' + q.unit : ''}`;
    case 'order': return `<ol>${q.items.map((it) => `<li>${it}</li>`).join('')}</ol>`;
    case 'match': return `<ul>${q.pairs.map((p) => `<li>${p[0]} → ${p[1]}</li>`).join('')}</ul>`;
    case 'fill': {
      return q.text.replace(/\{(\d+)\}/g, (_, n) => `<b>${esc(q.blanks[Number(n)].options[q.blanks[Number(n)].answer])}</b>`);
    }
    case 'explain': return 'See the model answer above.';
    default: return '';
  }
}

/**
 * Show which options were right/wrong after marking.
 * @param {object} vm View model.
 * @param {Element} card Card.
 * @param {*} r Response.
 * @param {boolean} final Whether to reveal the right answer.
 * @returns {void}
 */
function paintMarks(vm, card, r, final) {
  const q = vm.q;
  if (q.type === 'mcq' || q.type === 'tf' || q.type === 'multi') {
    const right = q.type === 'multi' ? q.answer : [q.type === 'tf' ? (q.answer ? 1 : 0) : q.answer];
    $$('.opt', card).forEach((b) => {
      const i = Number(b.dataset.i);
      const chosen = b.getAttribute('aria-checked') === 'true';
      b.classList.toggle('is-wrong', chosen && !right.includes(i));
      b.classList.toggle('is-right', (final || chosen) && right.includes(i) && (final || chosen));
    });
  }
  if (q.type === 'match' || q.type === 'fill') {
    const sels = $$(q.type === 'match' ? '.match-sel' : '.fill-sel', card);
    const want = q.type === 'match' ? q.pairs.map((_, i) => i) : q.blanks.map((b) => b.answer);
    sels.forEach((s, i) => { s.classList.toggle('is-right', r[i] === want[i]); s.classList.toggle('is-wrong', r[i] !== want[i]); });
  }
  if (q.type === 'order') {
    $$('.orderlist li', card).forEach((li, pos) => { li.classList.toggle('is-right', Number(li.dataset.i) === pos); li.classList.toggle('is-wrong', Number(li.dataset.i) !== pos); });
  }
}

/**
 * Lock inputs on a card.
 * @param {Element} card Card.
 * @returns {void}
 */
function lock(card) {
  card.classList.add('locked');
  $$('input, select, textarea, .opt, .ord-up, .ord-down, .chip', card).forEach((el) => { el.disabled = true; });
}

/**
 * Mount a quiz into an element.
 * @param {Element} root Container.
 * @param {object[]} questions Questions to ask (in order).
 * @param {object} [opts] Options.
 * @param {string} [opts.mode='checkpoint'] 'inline' | 'checkpoint' | 'test' | 'practice' | 'mistakes'.
 * @param {(res:object)=>void} [opts.onFinish] Called with {score, total, correct, firstTry, tiers, perfect, details}.
 * @param {string} [opts.finishLabel] Label for the final button.
 * @returns {{destroy:()=>void}} Handle.
 */
export function mountQuiz(root, questions, opts = {}) {
  const mode = opts.mode || 'checkpoint';
  const maxTries = mode === 'checkpoint' || mode === 'inline' ? 2 : 1;
  const vms = questions.map(prepare);
  const results = [];
  let idx = 0;
  let tries = 0;
  let hintShown = false;

  /** Render the current question. */
  function show() {
    const vm = vms[idx];
    const q = vm.q;
    tries = 0;
    hintShown = false;
    const dots = vms.length > 1 ? `<div class="qdots" aria-hidden="true">${vms.map((_, i) =>
      `<span class="qdot ${i < idx ? (results[i]?.correct ? 'ok' : 'bad') : i === idx ? 'cur' : ''}"></span>`).join('')}</div>` : '';
    root.innerHTML = `<div class="quiz quiz-${mode}">` +
      (vms.length > 1 ? `<div class="quiz-top"><span class="qcount">Question ${idx + 1} of ${vms.length}</span>${dots}</div>` : '') +
      `<div class="qcard" data-type="${q.type}">` +
      (q.tier ? `<span class="tier-tag t-${q.tier}">${TIER_NAME[q.tier]}</span>` : '') +
      `<div class="qtext">${q.q}</div>${q.figure ? `<figure class="qfig">${q.figure}</figure>` : ''}` +
      `<div class="qbody">${bodyHTML(vm)}</div>` +
      `<div class="qhint hidden"></div><div class="qfeedback" aria-live="polite"></div>` +
      `<div class="qactions">${q.hint && maxTries > 1 ? '<button type="button" class="btn ghost q-hint">Hint</button>' : ''}` +
      `<button type="button" class="btn primary q-check">${q.type === 'explain' ? 'Show model answer' : 'Check'}</button></div></div></div>`;
    renderMath(root);
    const first = $('.opt, .numin, .explain-in, select', root);
    if (first && opts.autofocus !== false && idx > 0) first.focus({ preventScroll: true });
  }

  /** Show the hint text. */
  function showHint() {
    const q = vms[idx].q;
    const el = $('.qhint', root);
    if (!q.hint || !el) return;
    el.innerHTML = `<b>Hint:</b> ${q.hint}`;
    el.classList.remove('hidden');
    renderMath(el);
    hintShown = true;
    $('.q-hint', root)?.remove();
  }

  /** Handle the Check button. */
  function check() {
    const vm = vms[idx];
    const q = vm.q;
    const card = $('.qcard', root);
    if (q.type === 'explain' && !card.classList.contains('revealed')) {
      card.classList.add('revealed');
      $('.rubric', card).classList.remove('hidden');
      $('.explain-in', card).readOnly = true;
      $('.q-check', card).textContent = 'Mark my answer';
      renderMath(card);
      return;
    }
    const r = readResponse(vm, card);
    const fb = $('.qfeedback', card);
    if (r === null) {
      fb.innerHTML = '<p class="fb-warn">Choose or type an answer first.</p>';
      return;
    }
    const g = grade(q, r);
    tries += 1;
    const final = g.correct || tries >= maxTries || q.type === 'explain';
    paintMarks(vm, card, r, final && !g.correct);
    if (!final) {
      fb.innerHTML = `<p class="fb-bad">Not quite. ${g.msg ? esc(g.msg) + ' ' : ''}Have another go.</p>`;
      if (q.hint && !hintShown) showHint();
      return;
    }
    lock(card);
    const firstTry = g.correct && tries === 1;
    results[idx] = { id: q.id, correct: g.correct, score: g.score, firstTry, tier: q.tier };
    if (mode !== 'inline') recordAnswer(q, q.type === 'explain' ? g.correct : firstTry);
    let xp = 0;
    if (g.correct) {
      if (mode === 'checkpoint') xp = firstTry ? XP.checkpointFirstTry : XP.checkpointRetry;
      else if (mode === 'test') xp = XP.testCorrect;
      else if (mode === 'practice' || mode === 'mistakes') xp = XP.practiceCorrect;
    }
    if (xp) addXP(xp, 'Correct answer');
    const verdict = q.type === 'explain'
      ? `<p class="fb-${g.correct ? 'good' : 'bad'}"><b>You covered ${Math.round(g.score * q.points.length)} of ${q.points.length} points.</b> ${g.correct ? 'Strong answer.' : 'Read the model answer again and note what was missing.'}</p>`
      : `<p class="fb-${g.correct ? 'good' : 'bad'}"><b>${g.correct ? (firstTry ? 'Correct!' : 'Correct on the second try.') : 'Not this time.'}</b> ${g.msg && !g.correct ? esc(g.msg) : ''}</p>` +
        (g.correct ? '' : `<div class="fb-answer"><b>Answer:</b> ${answerHTML(q)}</div>`);
    fb.innerHTML = verdict + (q.explain ? `<div class="fb-explain">${q.explain}</div>` : '');
    renderMath(fb);
    const actions = $('.qactions', card);
    actions.innerHTML = idx < vms.length - 1
      ? '<button type="button" class="btn primary q-next">Next question</button>'
      : (mode === 'inline' ? '' : `<button type="button" class="btn primary q-finish">${opts.finishLabel || 'See results'}</button>`);
    $('.q-next, .q-finish', actions)?.focus({ preventScroll: true });
    if (mode === 'inline' && opts.onFinish) opts.onFinish(summary());
  }

  /**
   * Summarise results.
   * @returns {object} Summary.
   */
  function summary() {
    const total = results.length;
    const correct = results.filter((r) => r.correct).length;
    const score = results.reduce((a, r) => a + r.score, 0);
    const tiers = {};
    for (const r of results) {
      if (!r.tier) continue;
      tiers[r.tier] = tiers[r.tier] || { got: 0, max: 0 };
      tiers[r.tier].got += r.score;
      tiers[r.tier].max += 1;
    }
    return { total, correct, score, frac: total ? score / total : 0, tiers, perfect: results.every((r) => r.firstTry), details: results.slice() };
  }

  /** Finish and hand control back. */
  function finish() {
    const res = summary();
    if (opts.onFinish) opts.onFinish(res, root);
  }

  /**
   * Click handler for the whole quiz.
   * @param {MouseEvent} ev Event.
   */
  function onClick(ev) {
    const t = ev.target;
    const card = $('.qcard', root);
    if (!card || card.classList.contains('locked') && !t.closest('.q-next, .q-finish')) return;
    const opt = t.closest('.opt');
    if (opt && !opt.disabled) {
      const type = vms[idx].q.type;
      if (type === 'multi') opt.setAttribute('aria-checked', opt.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
      else $$('.opt', card).forEach((b) => b.setAttribute('aria-checked', b === opt ? 'true' : 'false'));
      $$('.opt', card).forEach((b) => b.classList.remove('is-wrong', 'is-right'));
      return;
    }
    const chip = t.closest('.chip');
    if (chip) {
      const inp = $('.numin', card);
      const s = inp.selectionStart ?? inp.value.length;
      inp.value = inp.value.slice(0, s) + chip.dataset.ins + inp.value.slice(inp.selectionEnd ?? s);
      inp.focus();
      return;
    }
    const up = t.closest('.ord-up');
    const down = t.closest('.ord-down');
    if (up || down) {
      const li = t.closest('li');
      if (up && li.previousElementSibling) li.parentNode.insertBefore(li, li.previousElementSibling);
      if (down && li.nextElementSibling) li.parentNode.insertBefore(li.nextElementSibling, li);
      $$('.orderlist li', card).forEach((x) => x.classList.remove('is-wrong', 'is-right'));
      return;
    }
    if (t.closest('.q-hint')) return showHint();
    if (t.closest('.q-check')) return check();
    if (t.closest('.q-next')) { idx += 1; show(); root.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    if (t.closest('.q-finish')) return finish();
  }

  /**
   * Enter key submits.
   * @param {KeyboardEvent} ev Event.
   */
  function onKey(ev) {
    if (ev.key !== 'Enter' || ev.target.tagName === 'TEXTAREA') return;
    const btn = $('.q-check, .q-next, .q-finish', root);
    if (btn && ev.target.tagName === 'INPUT') { ev.preventDefault(); btn.click(); }
  }

  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKey);
  show();
  return {
    destroy() {
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKey);
    },
  };
}

/**
 * Work out a practice grade from tier results.
 * @param {object} tiers {A:{got,max}, M:{...}, E:{...}}.
 * @param {object} rules GRADE_RULES from config.
 * @returns {'N'|'A'|'M'|'E'} Grade.
 */
export function practiceGrade(tiers, rules) {
  const f = (t) => (tiers[t]?.max ? tiers[t].got / tiers[t].max : 0);
  const meets = (r) => Object.entries(r).every(([t, min]) => f(t) >= min);
  if (meets(rules.E)) return 'E';
  if (meets(rules.M)) return 'M';
  if (meets(rules.A)) return 'A';
  return 'N';
}
