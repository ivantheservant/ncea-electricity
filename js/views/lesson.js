/**
 * lesson.js — the lesson page: sections, quick checks, worked examples, fun facts,
 * bookmarks, highlighting and the checkpoint quiz that completes the lesson.
 */
import { $, $$, esc } from '../utils/dom.js';
import { renderMath } from '../utils/tex.js';
import { getLesson } from '../core/content.js';
import { getState, commit } from '../core/store.js';
import { visitLesson, completeLesson, isLessonDone, markFact } from '../core/progress.js';
import { toggleBookmark, isBookmarked } from '../core/notes.js';
import { mountQuiz } from '../core/quiz.js';
import { checkAchievements } from '../core/achievements.js';
import { renderSection, bmIcon } from '../ui/sections.js';
import { assignBlockIds, restoreHighlights, attachHighlighter } from '../ui/highlighter.js';
import { mountSims } from '../ui/sims.js';
import { levelTags, ohmieTip, toast } from '../ui/shell.js';

/**
 * Render a lesson.
 * @param {Element} view Main view element.
 * @param {string} id Lesson id.
 * @param {object} query Query params (s = section index to scroll to).
 * @returns {Promise<() => void>} Cleanup function.
 */
export async function lessonView(view, id, query) {
  const ctx = getLesson(id);
  if (!ctx) {
    view.innerHTML = `<div class="page narrow"><h1>Lesson not found</h1><p>There is no lesson ${esc(id)} yet.</p><a class="btn primary" href="#/learn">Open the course map</a></div>`;
    return () => {};
  }
  const { lesson: L, chapter: C, prev, next } = ctx;
  visitLesson(L.id);
  const done = isLessonDone(L.id);
  const best = getState().lessons[L.id]?.best;
  view.innerHTML = `
  <article class="lesson page">
    <nav class="crumbs"><a href="#/learn">Course</a><span>/</span><a href="#/chapter/${C.id}">Chapter ${C.num}: ${esc(C.title)}</a></nav>
    <header class="lesson-head">
      <div class="lnum" aria-hidden="true">${L.id}</div>
      <div class="lh-main">
        <h1>${L.title}</h1>
        <div class="tags">${levelTags(L.levels)}<span class="mins">${L.minutes || 10} min</span>${done ? '<span class="done-tag">✓ Completed</span>' : ''}</div>
      </div>
      <button type="button" class="bm-btn big ${isBookmarked(L.id) ? 'on' : ''}" data-bm="lesson" aria-pressed="${isBookmarked(L.id)}" aria-label="Bookmark this lesson">${bmIcon()}</button>
    </header>
    ${L.objectives?.length ? `<section class="objectives"><h2>By the end of this lesson you can</h2><ul>${L.objectives.map((o) => `<li>${o}</li>`).join('')}</ul></section>` : ''}
    ${L.intro ? `<div class="intro">${ohmieTip(`<p>${L.intro}</p>`)}</div>` : ''}
    <div class="sections">${(L.sections || []).map((s, i) => renderSection(s, i, L)).join('')}</div>
    ${L.checkpoint?.length ? `<section class="checkpoint" id="checkpoint">
      <div class="cp-head"><h2>Checkpoint</h2><p>${done ? `Lesson complete${best != null ? ` — best score ${Math.round(best * 100)}%` : ''}. Try again any time for practice.` : `Answer ${L.checkpoint.length} questions to complete this lesson. You get two tries and a hint on each.`}</p></div>
      <div class="cp-mount"></div></section>` : ''}
    <nav class="lesson-nav">
      ${prev ? `<a class="ln prev" href="#/lesson/${prev.id}"><span>Previous</span><b>${prev.id} ${esc(prev.title)}</b></a>` : '<span></span>'}
      ${next ? `<a class="ln next" href="#/lesson/${next.id}"><span>Next</span><b>${next.id} ${esc(next.title)}</b></a>` : `<a class="ln next" href="#/chapter/${C.id}"><span>Finished the chapter?</span><b>Chapter ${C.num} overview</b></a>`}
    </nav>
  </article>
  <div class="readbar" aria-hidden="true"><span></span></div>`;

  const root = $('.lesson', view);
  renderMath(root);
  assignBlockIds(root);
  restoreHighlights(root, L.id);
  const detachHL = attachHighlighter(root, L.id, L.title);
  const quizzes = [];

  // Quick checks
  for (const sec of L.sections || []) {
    if (sec.type !== 'try') continue;
    const el = $(`.try-mount[data-q="${sec.question.id}"]`, root);
    if (el) quizzes.push(mountQuiz(el, [sec.question], { mode: 'inline', autofocus: false }));
  }

  // Checkpoint
  const cp = $('.cp-mount', root);
  let cpQuiz = null;
  if (cp) startCheckpoint();

  /** Start (or restart) the checkpoint quiz. */
  function startCheckpoint() {
    cpQuiz?.destroy();
    cpQuiz = (mountQuiz(cp, L.checkpoint, {
      mode: 'checkpoint', autofocus: false, finishLabel: 'Finish lesson',
      onFinish: (res) => {
        const s = getState();
        const rec = s.lessons[L.id] || (s.lessons[L.id] = {});
        if (res.perfect && !rec.perfect) { rec.perfect = true; s.counters.perfectCheckpoints += 1; commit('perfect'); }
        const first = completeLesson(L.id, res.frac);
        checkAchievements();
        const pct = Math.round(res.frac * 100);
        const msg = pct === 100 ? 'Perfect score! You really understand this.' : pct >= 70 ? 'Great work. Questions you missed are saved in your mistake book for review.' : 'Good effort. Reread the parts you found tricky, then review your mistake book.';
        cp.innerHTML = `<div class="cp-result">${ohmieTip(`<p><b>${pct}%</b> — ${msg}</p>`, pct >= 70 ? 'wow' : 'think')}
          <div class="row">${next ? `<a class="btn primary" href="#/lesson/${next.id}">Next lesson: ${next.id}</a>` : `<a class="btn primary" href="#/test/${C.id}">Try the Chapter ${C.num} test</a>`}
          <button type="button" class="btn ghost cp-again">Try the checkpoint again</button></div></div>`;
        if (first) toast(`Lesson ${L.id} complete!`, { kind: 'good' });
        $('.done-tag', root) || $('.lesson-head .tags', root)?.insertAdjacentHTML('beforeend', '<span class="done-tag">✓ Completed</span>');
      },
    }));
  }

  // Clicks: bookmarks, worked-example steps, fun facts, checkpoint retry
  const onClick = (ev) => {
    const bm = ev.target.closest('.bm-btn');
    if (bm) {
      const sec = bm.dataset.bm === 'lesson' ? null : Number(bm.dataset.bm);
      const on = toggleBookmark(L.id, sec, sec == null ? `${L.id} ${L.title}` : `${L.id} ${bm.dataset.title}`);
      bm.classList.toggle('on', on);
      bm.setAttribute('aria-pressed', String(on));
      toast(on ? 'Bookmarked. Find it under Notes.' : 'Bookmark removed.');
      return;
    }
    const nextBtn = ev.target.closest('.ex-next');
    const allBtn = ev.target.closest('.ex-all');
    if (nextBtn || allBtn) {
      const card = ev.target.closest('.example');
      const steps = $$('.step', card);
      const ol = $('.steps', card);
      let n = Number(ol.dataset.revealed);
      n = allBtn ? steps.length : n + 1;
      steps.forEach((st, k) => st.classList.toggle('hidden', k >= n));
      ol.dataset.revealed = String(n);
      if (n >= steps.length) {
        $('.ex-ans', card).classList.remove('hidden');
        $('.ex-ctrl', card).remove();
      } else {
        nextBtn && (nextBtn.textContent = `Show step ${n + 1}`);
        if (allBtn) $('.ex-ctrl', card).remove();
      }
      return;
    }
    const fact = ev.target.closest('.fact-btn');
    if (fact) {
      const box = fact.closest('.fact');
      const body = $('.fact-body', box);
      const open = body.hidden;
      body.hidden = !open;
      box.classList.toggle('open', open);
      fact.setAttribute('aria-expanded', String(open));
      $('span:last-child', fact).textContent = open ? 'Fun fact' : 'Fun fact: tap to reveal';
      if (open) markFact(fact.dataset.fact);
      return;
    }
    if (ev.target.closest('.cp-again')) { startCheckpoint(); cp.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  };
  root.addEventListener('click', onClick);

  // Reading progress bar
  const bar = $('.readbar span', view);
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = `${max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const cleanSims = await mountSims(root);

  if (query.s != null) {
    const target = $(`#s${Number(query.s)}`, root);
    if (target) setTimeout(() => target.scrollIntoView({ block: 'start' }), 60);
  } else {
    window.scrollTo(0, 0);
  }

  return () => {
    detachHL();
    cleanSims();
    quizzes.forEach((q) => q.destroy());
    cpQuiz?.destroy();
    root.removeEventListener('click', onClick);
    window.removeEventListener('scroll', onScroll);
  };
}
