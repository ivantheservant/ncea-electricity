/**
 * learn.js — the course map (all chapters) and a single chapter's overview.
 */
import { esc } from '../utils/dom.js';
import { getState } from '../core/store.js';
import { allChapters, getChapter } from '../core/content.js';
import { COURSE } from '../../content/manifest.js';
import { chapterProgress, isLessonDone } from '../core/progress.js';
import { mastery } from '../core/srs.js';
import { levelTags, ring } from '../ui/shell.js';

const GRADE = { N: 'Not yet', A: 'Achieved', M: 'Merit', E: 'Excellence' };

/**
 * Course map.
 * @param {Element} view Main view.
 * @returns {() => void} Cleanup.
 */
export function learnView(view) {
  const chs = allChapters();
  view.innerHTML = `
  <div class="page learn">
    <header class="page-head"><h1>Course map</h1>
      <p class="lede">Start at Chapter 0 if you want to sharpen the maths first, or jump to Chapter 1. Tags show where each topic sits: Year 10, NCEA Level 1–3 or University.</p></header>
    <ol class="chapter-list">
      ${chs.map((c) => {
    const ready = c.status === 'ready' && c.lessons;
    const p = ready ? chapterProgress(c) : null;
    const best = getState().tests[c.id]?.best;
    return `<li class="ch-item ${ready ? 'ready' : 'soon'}">
          <a href="#/chapter/${c.id}" class="ch-link">
            <span class="ch-num">${c.num}</span>
            <span class="ch-main"><span class="ch-title">${esc(c.title)}</span><span class="ch-blurb">${esc(c.blurb)}</span>
              <span class="tags">${levelTags(c.levels)}${ready ? `<span class="mins">${c.lessons.length} lessons</span>` : `<span class="soon-tag">Coming in build ${c.build}</span>`}${best ? `<span class="grade-tag g-${best.grade}">Test: ${GRADE[best.grade]}</span>` : ''}</span></span>
            ${ready ? `<span class="ch-ring">${ring(p.pct, 52, `${p.done}/${p.total}`)}</span>` : ''}
          </a></li>`;
  }).join('')}
    </ol>
    <section class="later">
      ${COURSE.later.map((g) => `<div class="later-card"><h2>${esc(g.title)}</h2><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}
    </section>
  </div>`;
  window.scrollTo(0, 0);
  return () => {};
}

/**
 * One chapter.
 * @param {Element} view Main view.
 * @param {string} id Chapter id.
 * @returns {() => void} Cleanup.
 */
export function chapterView(view, id) {
  const c = getChapter(id);
  if (!c) { view.innerHTML = '<div class="page"><h1>Chapter not found</h1><a class="btn primary" href="#/learn">Course map</a></div>'; return () => {}; }
  if (!c.lessons) {
    view.innerHTML = `<div class="page narrow chapter-soon"><nav class="crumbs"><a href="#/learn">Course</a></nav>
      <h1>Chapter ${c.num}: ${esc(c.title)}</h1><div class="tags">${levelTags(c.levels)}</div><p class="lede">${esc(c.blurb)}</p>
      <div class="card"><p>This chapter is planned for <b>build ${c.build}</b>. Until then, keep your streak going with flashcards and the mistake book.</p>
      <div class="row"><a class="btn primary" href="#/flashcards">Study flashcards</a><a class="btn ghost" href="#/learn">Back to the course map</a></div></div></div>`;
    return () => {};
  }
  const p = chapterProgress(c);
  const s = getState();
  const best = s.tests[c.id]?.best;
  const m = mastery(c.id);
  view.innerHTML = `
  <div class="page chapter">
    <nav class="crumbs"><a href="#/learn">Course</a></nav>
    <header class="chapter-head">
      <div><span class="ch-num big">${c.num}</span></div>
      <div class="chh-main"><h1>${esc(c.title)}</h1><div class="tags">${levelTags(c.levels)}</div>
        <p class="lede">${c.intro || esc(c.blurb)}</p>
        ${c.standards ? `<p class="standards"><b>Links to:</b> ${c.standards}</p>` : ''}</div>
      <div class="chh-ring">${ring(p.pct, 84, `${Math.round(p.pct * 100)}%`)}</div>
    </header>
    <ol class="lesson-list">
      ${c.lessons.map((l) => {
    const done = isLessonDone(l.id);
    const sc = s.lessons[l.id]?.best;
    return `<li><a class="lesson-link ${done ? 'done' : ''}" href="#/lesson/${l.id}">
          <span class="ll-id">${l.id}</span><span class="ll-main"><b>${l.title}</b><span class="tags">${levelTags(l.levels)}<span class="mins">${l.minutes || 10} min</span></span></span>
          <span class="ll-status">${done ? `<span class="tick">✓</span>${sc != null ? `<small>${Math.round(sc * 100)}%</small>` : ''}` : ''}</span></a></li>`;
  }).join('')}
    </ol>
    <section class="chapter-extras">
      <a class="extra-card test-card" href="#/test/${c.id}"><h2>Chapter ${c.num} test</h2>
        <p>${c.test ? `${(c.test.A || []).length + (c.test.M || []).length + (c.test.E || []).length} exam-style questions in Achieved, Merit and Excellence tiers.` : ''}</p>
        <p class="grade-line">${best ? `Best result: <span class="grade-tag g-${best.grade}">${GRADE[best.grade]}</span> (${Math.round(best.score)} / ${best.total})` : 'Not attempted yet.'}</p></a>
      <a class="extra-card" href="#/flashcards?c=${c.id}"><h2>Flashcards</h2><p>${m.total} cards. ${m.mastered} mastered, ${m.seen} seen.</p></a>
      <a class="extra-card" href="#/formulas?c=${c.id}"><h2>Formula sheet</h2><p>${(c.formulas || []).length} formulas with symbols and units.</p></a>
      <a class="extra-card" href="#/glossary?c=${c.id}"><h2>Glossary</h2><p>${(c.glossary || []).length} key terms for this chapter.</p></a>
    </section>
  </div>`;
  window.scrollTo(0, 0);
  return () => {};
}
