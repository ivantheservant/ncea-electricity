/**
 * review.js — revision tools: hub, flashcards, mistake book, practice mix,
 * formula sheet and glossary.
 */
import { $, $$, esc, shuffle } from '../utils/dom.js';
import { renderMath } from '../utils/tex.js';
import { getState, commit } from '../core/store.js';
import { readyChapters, getQuestion, practicePool, glossary, formulas, getChapter } from '../core/content.js';
import { dueCards, review, mastery, allCards } from '../core/srs.js';
import { mountQuiz } from '../core/quiz.js';
import { startedChapterIds } from '../core/progress.js';
import { checkAchievements } from '../core/achievements.js';
import { ohmieTip } from '../ui/shell.js';

/**
 * Revision hub.
 * @param {Element} view Main view.
 * @returns {() => void} Cleanup.
 */
export function reviewView(view) {
  const s = getState();
  const due = dueCards().length;
  const m = mastery();
  const mistakes = Object.keys(s.mistakes).length;
  view.innerHTML = `
  <div class="page review">
    <header class="page-head"><h1>Review</h1><p class="lede">Short, regular revision beats one long cram. Ten minutes of flashcards and mistakes most days will lift your exam grade.</p></header>
    <div class="hub-grid">
      <a class="hub-card" href="#/flashcards"><h2>Flashcards</h2><p class="hub-num">${due}</p><p>ready today · ${m.mastered} of ${m.total} mastered</p></a>
      <a class="hub-card" href="#/mistakes"><h2>Mistake book</h2><p class="hub-num">${mistakes}</p><p>questions to fix</p></a>
      <a class="hub-card" href="#/practice"><h2>Practice mix</h2><p class="hub-num">10</p><p>mixed questions from your lessons</p></a>
      <a class="hub-card" href="#/formulas"><h2>Formula sheet</h2><p>Every formula with symbols, units and when to use it.</p></a>
      <a class="hub-card" href="#/glossary"><h2>Glossary</h2><p>Key words and exact definitions examiners look for.</p></a>
      <a class="hub-card" href="#/learn"><h2>Chapter tests</h2><p>Achieved, Merit and Excellence questions for each chapter.</p></a>
    </div>
  </div>`;
  window.scrollTo(0, 0);
  return () => {};
}

/**
 * Flashcards (spaced repetition).
 * @param {Element} view Main view.
 * @param {object} query {c: chapter id}.
 * @returns {() => void} Cleanup.
 */
export function flashcardsView(view, query) {
  const chId = query.c || '';
  const opts = readyChapters().map((c) => `<option value="${c.id}" ${c.id === chId ? 'selected' : ''}>Chapter ${c.num}: ${esc(c.title)}</option>`).join('');
  let deck = query.all ? shuffle(allCards(chId || undefined)) : dueCards(chId || undefined);
  let i = 0;
  let done = 0;
  view.innerHTML = `
  <div class="page narrow flash">
    <header class="page-head"><h1>Flashcards</h1>
      <label class="field inline">Deck <select class="deck-sel"><option value="">All chapters</option>${opts}</select></label></header>
    <div class="flash-mount"></div>
  </div>`;
  const mount = $('.flash-mount', view);

  /** Show the current card. */
  function show() {
    if (i >= deck.length) {
      mount.innerHTML = `${ohmieTip(done ? `<p>Deck done — ${done} card${done === 1 ? '' : 's'} reviewed. Cards you knew will come back in a few days; ones you missed come back sooner.</p>` : '<p>No cards are due right now. Come back tomorrow, or study the whole deck for extra practice.</p>', 'wow')}
        <div class="row"><a class="btn primary" href="#/flashcards?all=1${chId ? `&c=${chId}` : ''}">Study the whole deck</a><a class="btn ghost" href="#/review">Back to Review</a></div>`;
      return;
    }
    const c = deck[i];
    mount.innerHTML = `
      <p class="flash-count">Card ${i + 1} of ${deck.length} <span class="kind">${c.kind}</span></p>
      <button type="button" class="flashcard" aria-label="Flip card"><div class="fc-front">${c.front}</div><div class="fc-back" hidden>${c.back}</div><span class="fc-hint">Tap to flip</span></button>
      <div class="fc-actions" hidden><button type="button" class="btn bad-btn not-yet">Not yet</button><button type="button" class="btn good-btn got-it">Got it</button></div>`;
    renderMath(mount);
  }

  const onClick = (ev) => {
    const card = ev.target.closest('.flashcard');
    if (card) {
      const back = $('.fc-back', card);
      const front = $('.fc-front', card);
      const flipped = !back.hidden;
      back.hidden = flipped; front.hidden = !flipped;
      card.classList.toggle('flipped', !flipped);
      $('.fc-hint', card).textContent = flipped ? 'Tap to flip' : 'Did you know it?';
      $('.fc-actions', mount).hidden = false;
      return;
    }
    const got = ev.target.closest('.got-it');
    const not = ev.target.closest('.not-yet');
    if (got || not) {
      review(deck[i], !!got);
      checkAchievements();
      done += 1;
      if (not && !query.all) deck.push(deck[i]);
      i += 1;
      show();
    }
  };
  const onKey = (ev) => {
    if (ev.target.closest('input, select, textarea')) return;
    if (ev.key === ' ' || ev.key === 'Enter') { const c = $('.flashcard', mount); if (c && document.activeElement !== c) { ev.preventDefault(); c.click(); } }
    if (ev.key === 'ArrowRight') $('.got-it', mount)?.click();
    if (ev.key === 'ArrowLeft') $('.not-yet', mount)?.click();
  };
  mount.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  $('.deck-sel', view).addEventListener('change', (e) => { location.hash = `#/flashcards${e.target.value ? `?c=${e.target.value}` : ''}`; });
  show();
  window.scrollTo(0, 0);
  return () => { mount.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
}

/**
 * Mistake book.
 * @param {Element} view Main view.
 * @returns {() => void} Cleanup.
 */
export function mistakesView(view) {
  const s = getState();
  const items = Object.entries(s.mistakes).map(([id, m]) => ({ q: getQuestion(id), m })).filter((x) => x.q).sort((a, b) => b.m.at - a.m.at);
  let quiz = null;
  view.innerHTML = `
  <div class="page narrow mistakes">
    <header class="page-head"><h1>Mistake book</h1><p class="lede">Every question you got wrong is saved here. Answer it correctly twice in a row and it leaves the book.</p></header>
    ${items.length ? `<div class="row"><button type="button" class="btn primary start">Review ${Math.min(10, items.length)} mistake${items.length === 1 ? '' : 's'}</button></div>
    <ul class="mistake-list">${items.map(({ q, m }) => `<li><span class="ml-where">${q.lessonId ? `Lesson ${q.lessonId}` : `Chapter ${getChapter(q.chapterId)?.num} test`}</span><span class="ml-q">${q.q}</span><span class="ml-meta">Wrong ${m.count}× · ${m.streak}/2 right in a row</span></li>`).join('')}</ul>`
    : ohmieTip('<p>Your mistake book is empty. That means either you are brilliant or you have not started yet — either way, nice!</p>', 'wow')}
    <div class="mk-mount"></div>
  </div>`;
  renderMath(view);
  $('.start', view)?.addEventListener('click', () => {
    const qs = shuffle(items.map((x) => x.q)).slice(0, 10);
    $('.mistake-list', view)?.remove();
    $('.start', view)?.remove();
    quiz = mountQuiz($('.mk-mount', view), qs, {
      mode: 'mistakes', finishLabel: 'Finish',
      onFinish: (res) => {
        checkAchievements();
        $('.mk-mount', view).innerHTML = `${ohmieTip(`<p>You got <b>${res.correct} of ${res.total}</b> right. ${Object.keys(getState().mistakes).length} question(s) left in the book.</p>`, res.correct === res.total ? 'wow' : 'think')}<div class="row"><button type="button" class="btn primary again">Go again</button><a class="btn ghost" href="#/review">Back to Review</a></div>`;
        $('.again', view).addEventListener('click', () => { quiz?.destroy(); mistakesView(view); });
      },
    });
  });
  window.scrollTo(0, 0);
  return () => quiz?.destroy();
}

/**
 * Practice mix from lessons already started.
 * @param {Element} view Main view.
 * @returns {() => void} Cleanup.
 */
export function practiceView(view) {
  const started = startedChapterIds();
  const pool = practicePool(started.length ? started : undefined).filter((q) => q.type !== 'explain');
  let quiz = null;
  const qs = shuffle(pool).slice(0, 10);
  view.innerHTML = `<div class="page narrow practice"><header class="page-head"><h1>Practice mix</h1><p class="lede">${started.length ? 'Ten mixed questions from the chapters you have started.' : 'Ten mixed questions from the course so far.'} Mixing topics is one of the best ways to prepare for exams.</p></header><div class="pr-mount"></div></div>`;
  quiz = mountQuiz($('.pr-mount', view), qs, {
    mode: 'practice', finishLabel: 'Finish',
    onFinish: (res) => {
      getState().counters.practiceSessions += 1;
      commit('practice');
      checkAchievements();
      $('.pr-mount', view).innerHTML = `${ohmieTip(`<p><b>${res.correct} / ${res.total}</b> correct. Anything you missed is now in your mistake book.</p>`, res.correct >= 8 ? 'wow' : 'think')}<div class="row"><button type="button" class="btn primary again">New mix</button><a class="btn ghost" href="#/review">Back to Review</a></div>`;
      $('.again', view).addEventListener('click', () => { quiz?.destroy(); practiceView(view); });
    },
  });
  window.scrollTo(0, 0);
  return () => quiz?.destroy();
}

/**
 * Formula sheet.
 * @param {Element} view Main view.
 * @param {object} query {c: chapter id}.
 * @returns {() => void} Cleanup.
 */
export function formulasView(view, query) {
  getState().visited.formulas = Date.now();
  commit('visit');
  checkAchievements();
  const list = formulas().filter((f) => !query.c || f.chapterId === query.c);
  const groups = {};
  for (const f of list) (groups[f.chapterId] = groups[f.chapterId] || []).push(f);
  view.innerHTML = `
  <div class="page formulas">
    <header class="page-head"><h1>Formula sheet</h1><p class="lede">NCEA exam papers give you a formula sheet, but you still need to know what every symbol means, its unit, and when each formula applies.</p>
    ${query.c ? '<a class="more" href="#/formulas">Show every chapter</a>' : ''}</header>
    ${Object.entries(groups).map(([cid, fs]) => `<section class="f-group"><h2>Chapter ${fs[0].chapterNum}: ${esc(fs[0].chapterTitle)}</h2><div class="f-grid">${fs.map((f) => `
      <div class="card formula"><h3>${f.name}</h3><div class="f-main">$$${f.tex}$$</div>
        ${f.symbols ? `<table class="symtab"><tbody>${f.symbols.map((r) => `<tr><td>$${r[0]}$</td><td>${r[1]}</td><td>${r[2] || ''}</td></tr>`).join('')}</tbody></table>` : ''}
        ${f.note ? `<p class="f-note">${f.note}</p>` : ''}${f.level ? `<p class="f-level">${f.level}</p>` : ''}</div>`).join('')}</div></section>`).join('')}
  </div>`;
  renderMath(view);
  window.scrollTo(0, 0);
  return () => {};
}

/**
 * Glossary with filter box.
 * @param {Element} view Main view.
 * @param {object} query {c: chapter id, t: term to jump to}.
 * @returns {() => void} Cleanup.
 */
export function glossaryView(view, query) {
  getState().visited.glossary = Date.now();
  commit('visit');
  checkAchievements();
  const list = glossary().filter((g) => !query.c || g.chapterId === query.c);
  view.innerHTML = `
  <div class="page narrow glossary">
    <header class="page-head"><h1>Glossary</h1><p class="lede">Learn these exact meanings — examiners reward precise physics words.</p>
      <input type="search" class="g-filter" placeholder="Filter terms…" aria-label="Filter glossary" value="${esc(query.t || '')}">
      ${query.c ? '<a class="more" href="#/glossary">Show every chapter</a>' : ''}</header>
    <dl class="g-list">${list.map((g) => `<div class="g-item" data-term="${esc(g.term.toLowerCase())}"><dt>${g.term} <small>Ch ${g.chapterNum}</small></dt><dd>${g.def}</dd></div>`).join('')}</dl>
  </div>`;
  renderMath(view);
  const inp = $('.g-filter', view);
  const filter = () => {
    const t = inp.value.trim().toLowerCase();
    $$('.g-item', view).forEach((it) => { it.hidden = t && !it.dataset.term.includes(t) && !it.textContent.toLowerCase().includes(t); });
  };
  inp.addEventListener('input', filter);
  filter();
  window.scrollTo(0, 0);
  return () => {};
}

