/**
 * test.js — chapter tests in Achieved / Merit / Excellence tiers with a practice grade.
 */
import { $, esc, shuffle } from '../utils/dom.js';
import { getChapter } from '../core/content.js';
import { getState } from '../core/store.js';
import { mountQuiz, practiceGrade } from '../core/quiz.js';
import { recordTest } from '../core/progress.js';
import { checkAchievements } from '../core/achievements.js';
import { evaluateRewards } from '../core/rewards.js';
import { GRADE_RULES } from '../config.js';
import { ohmieTip, confetti } from '../ui/shell.js';

const GRADE = { N: 'Not Achieved yet', A: 'Achieved', M: 'Merit', E: 'Excellence' };

/**
 * Chapter test page.
 * @param {Element} view Main view.
 * @param {string} id Chapter id.
 * @returns {() => void} Cleanup.
 */
export function testView(view, id) {
  const c = getChapter(id);
  if (!c?.test) { view.innerHTML = '<div class="page narrow"><h1>No test yet</h1><a class="btn primary" href="#/learn">Course map</a></div>'; return () => {}; }
  let quiz = null;
  const best = getState().tests[c.id]?.best;
  const nA = c.test.A?.length || 0;
  const nM = c.test.M?.length || 0;
  const nE = c.test.E?.length || 0;

  /** Intro screen. */
  function intro() {
    view.innerHTML = `
    <div class="page narrow test">
      <nav class="crumbs"><a href="#/learn">Course</a><span>/</span><a href="#/chapter/${c.id}">Chapter ${c.num}</a></nav>
      <h1>Chapter ${c.num} test</h1>
      <p class="lede">${esc(c.title)}. Questions get harder as you go, like an NCEA paper: first Achieved, then Merit, then Excellence.</p>
      <div class="tier-cards">
        <div class="tier-card t-A"><b>Achieved</b><span>${nA} questions</span><small>Describe, identify, calculate in one step.</small></div>
        <div class="tier-card t-M"><b>Merit</b><span>${nM} questions</span><small>Explain why, link ideas, multi-step calculations.</small></div>
        <div class="tier-card t-E"><b>Excellence</b><span>${nE} questions</span><small>Discuss fully, compare, justify with physics and numbers.</small></div>
      </div>
      ${ohmieTip('<p>One try per question, and you see the explanation straight after. For written answers, write your own first, then tick the points you really included. Be honest — it is your practice!</p>')}
      ${best ? `<p class="best-line">Best so far: <span class="grade-tag g-${best.grade}">${GRADE[best.grade]}</span></p>` : ''}
      <div class="row"><button type="button" class="btn primary big start">Start the test</button><a class="btn ghost" href="#/chapter/${c.id}">Back</a></div>
      <p class="muted small">The grade here is a practice guide only. Real NCEA papers are marked by examiners using the whole answer.</p>
    </div>`;
    $('.start', view).addEventListener('click', run);
  }

  /** Run the quiz. */
  function run() {
    const qs = [...shuffle(c.test.A || []), ...shuffle(c.test.M || []), ...(c.test.E || [])];
    view.innerHTML = `<div class="page narrow test"><h1>Chapter ${c.num} test</h1><div class="test-mount"></div></div>`;
    quiz = mountQuiz($('.test-mount', view), qs, { mode: 'test', finishLabel: 'See my grade', onFinish: done });
    window.scrollTo(0, 0);
  }

  /**
   * Show results.
   * @param {object} res Quiz summary.
   */
  function done(res) {
    const g = practiceGrade(res.tiers, GRADE_RULES);
    recordTest(c.id, { score: res.score, total: res.total, tiers: res.tiers, grade: g });
    checkAchievements();
    evaluateRewards();
    if (g !== 'N') confetti();
    const bars = ['A', 'M', 'E'].map((t) => {
      const r = res.tiers[t] || { got: 0, max: 0 };
      const pct = r.max ? r.got / r.max : 0;
      return `<div class="tier-bar t-${t}"><span class="tb-name">${GRADE[t]}</span><span class="bar"><span style="width:${Math.round(pct * 100)}%"></span></span><span class="tb-val">${Math.round(r.got * 10) / 10} / ${r.max}</span></div>`;
    }).join('');
    const advice = {
      N: 'Go back over the lessons where you lost marks — your mistake book has them all — then try again.',
      A: 'Solid base. To reach Merit, practise explaining <i>why</i>: link each cause to its effect using physics words.',
      M: 'Great. For Excellence, answer every part, back every claim with a reason or a calculation, and compare situations fully.',
      E: 'Outstanding! You are thinking like a physicist. Keep this chapter fresh with flashcards.',
    }[g];
    view.innerHTML = `
    <div class="page narrow test result">
      <h1>Your result</h1>
      <div class="grade-big g-${g}">${GRADE[g]}</div>
      <div class="tier-bars">${bars}</div>
      ${ohmieTip(`<p>${advice}</p>`, g === 'E' || g === 'M' ? 'wow' : 'think')}
      <div class="row"><button type="button" class="btn primary again">Take the test again</button><a class="btn ghost" href="#/mistakes">Review mistakes</a><a class="btn ghost" href="#/chapter/${c.id}">Chapter overview</a></div>
    </div>`;
    $('.again', view).addEventListener('click', run);
    window.scrollTo(0, 0);
  }

  intro();
  window.scrollTo(0, 0);
  return () => quiz?.destroy();
}
