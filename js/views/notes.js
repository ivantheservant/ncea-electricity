/**
 * notes.js — highlights and notes, bookmarks, and saved questions, with export and share.
 */
import { $, esc, downloadText, bindOnce } from '../utils/dom.js';
import { getState } from '../core/store.js';
import { getLesson } from '../core/content.js';
import { removeHighlight, updateHighlight, toggleBookmark, updateQuestion, removeQuestion } from '../core/notes.js';
import { shortDate } from '../utils/date.js';
import { ohmieTip, toast, openModal, confirmBox } from '../ui/shell.js';

/**
 * Notes page.
 * @param {Element} view Main view.
 * @param {object} query {tab: 'highlights'|'bookmarks'|'questions', color}.
 * @returns {() => void} Cleanup.
 */
export function notesView(view, query) {
  const tab = query.tab || 'highlights';
  const color = query.color || '';
  const s = getState();
  const tabs = [['highlights', `Highlights & notes (${s.highlights.length})`], ['bookmarks', `Bookmarks (${s.bookmarks.length})`], ['questions', `My questions (${s.questions.length})`]];
  view.innerHTML = `
  <div class="page narrow notes">
    <header class="page-head"><h1>Notes</h1><p class="lede">Select any text in a lesson to highlight it, add a note, or save a question.</p></header>
    <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<a role="tab" href="#/notes?tab=${k}" class="tab ${k === tab ? 'on' : ''}" aria-selected="${k === tab}">${l}</a>`).join('')}</div>
    <div class="tab-body">${tab === 'highlights' ? highlightsHTML(color) : tab === 'bookmarks' ? bookmarksHTML() : questionsHTML()}</div>
  </div>`;

  const onClick = async (ev) => {
    const t = ev.target;
    const del = t.closest('[data-del-hl]');
    if (del && await confirmBox('Delete highlight?', 'The highlight and its note will be removed.', 'Delete', true)) { removeHighlight(del.dataset.delHl); notesView(view, query); return; }
    const ed = t.closest('[data-edit-hl]');
    if (ed) {
      const h = getState().highlights.find((x) => x.id === ed.dataset.editHl);
      const note = await openModal({ title: 'Edit note', body: `<blockquote class="quote">${esc(h.text)}</blockquote><label class="field">Note<textarea id="ne" rows="4">${esc(h.note || '')}</textarea></label>`, actions: [{ label: 'Cancel', value: null }, { label: 'Save', kind: 'primary', value: (el) => $('#ne', el).value.trim() }] });
      if (note !== null) { updateHighlight(h.id, { note }); notesView(view, query); }
      return;
    }
    const ub = t.closest('[data-unbm]');
    if (ub) {
      const b = getState().bookmarks.find((x) => x.key === ub.dataset.unbm);
      if (b) toggleBookmark(b.lesson, b.sec, b.title);
      notesView(view, query);
      return;
    }
    const ans = t.closest('[data-ans]');
    if (ans) {
      const q = getState().questions.find((x) => x.id === ans.dataset.ans);
      const res = await openModal({ title: 'Answer', body: `<p><b>${esc(q.text)}</b></p><label class="field">What you found out<textarea id="qa" rows="4">${esc(q.answer || '')}</textarea></label>`, actions: [{ label: 'Cancel', value: null }, { label: 'Save as answered', kind: 'primary', value: (el) => $('#qa', el).value.trim() }] });
      if (res !== null) { updateQuestion(q.id, { answer: res, answered: true }); notesView(view, query); }
      return;
    }
    const dq = t.closest('[data-delq]');
    if (dq && await confirmBox('Delete question?', 'This question will be removed.', 'Delete', true)) { removeQuestion(dq.dataset.delq); notesView(view, query); return; }
    if (t.closest('.export-notes')) { downloadText(`spark-lab-notes-${new Date().toISOString().slice(0, 10)}.md`, notesMarkdown()); toast('Notes downloaded.', { kind: 'good' }); return; }
    if (t.closest('.share-q')) {
      const text = questionsText();
      if (navigator.share) { try { await navigator.share({ title: 'My physics questions', text }); } catch { /* cancelled */ } }
      else { await navigator.clipboard?.writeText(text); toast('Questions copied. Paste them into a message.', { kind: 'good' }); }
    }
  };
  const unbind = bindOnce(view, 'click', onClick);
  const sel = $('.color-filter', view);
  sel?.addEventListener('change', () => { location.hash = `#/notes?tab=highlights${sel.value ? `&color=${sel.value}` : ''}`; });
  window.scrollTo(0, 0);
  return unbind;
}

/**
 * Lesson label.
 * @param {string} id Lesson id.
 * @returns {string} e.g. '1.3 Charging by friction'.
 */
function lessonLabel(id) {
  const l = getLesson(id);
  return l ? `${id} ${l.lesson.title}` : id;
}

/**
 * Highlights grouped by lesson.
 * @param {string} color Filter colour or ''.
 * @returns {string} HTML.
 */
function highlightsHTML(color) {
  const hs = getState().highlights.filter((h) => !color || h.color === color);
  const filter = `<div class="row between"><label class="field inline">Colour <select class="color-filter"><option value="">All</option>${['green', 'pink', 'yellow'].map((c) => `<option ${c === color ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
    <button type="button" class="btn ghost small export-notes">Download notes</button></div>`;
  if (!hs.length) return filter + ohmieTip('<p>No highlights yet. In any lesson, select some text and choose a colour. Use green for key ideas and pink for things to revise — or your own system!</p>');
  const by = {};
  for (const h of hs) (by[h.lesson] = by[h.lesson] || []).push(h);
  return filter + Object.entries(by).map(([lid, list]) => `<section class="note-group"><h2><a href="#/lesson/${lid}">${esc(lessonLabel(lid))}</a></h2>
    <ul class="hl-list">${list.map((h) => `<li class="hl-card"><mark class="hl hl-${h.color}">${esc(h.text)}</mark>
      ${h.note ? `<p class="hl-note">${esc(h.note)}</p>` : ''}
      <div class="hl-meta"><span>${shortDate(h.at)}</span><a href="#/lesson/${lid}?s=${String(h.bid).split('.')[0].replace('x', '')}">Open</a><button type="button" class="linkbtn" data-edit-hl="${h.id}">${h.note ? 'Edit note' : 'Add note'}</button><button type="button" class="linkbtn danger" data-del-hl="${h.id}">Delete</button></div></li>`).join('')}</ul></section>`).join('');
}

/**
 * Bookmark list.
 * @returns {string} HTML.
 */
function bookmarksHTML() {
  const bs = getState().bookmarks.slice().sort((a, b) => b.at - a.at);
  if (!bs.length) return ohmieTip('<p>No bookmarks yet. Tap the bookmark icon next to a lesson title or section heading to save it here.</p>');
  return `<ul class="bm-list">${bs.map((b) => `<li><a href="#/lesson/${b.lesson}${b.sec != null ? `?s=${b.sec}` : ''}"><b>${esc(b.title)}</b><small>${b.sec != null ? 'Section' : 'Lesson'} · ${shortDate(b.at)}</small></a><button type="button" class="linkbtn danger" data-unbm="${esc(b.key)}">Remove</button></li>`).join('')}</ul>`;
}

/**
 * Saved questions.
 * @returns {string} HTML.
 */
function questionsHTML() {
  const qs = getState().questions.slice().sort((a, b) => b.at - a.at);
  if (!qs.length) return ohmieTip('<p>Stuck on something? Select the confusing text in a lesson and tap <b>Ask</b>. Your questions collect here so you can take them to your teacher or parent.</p>', 'think');
  return `<div class="row"><button type="button" class="btn primary small share-q">Share my questions</button></div>
    <ul class="q-list">${qs.map((q) => `<li class="q-card ${q.answered ? 'answered' : ''}"><p class="q-text">${esc(q.text)}</p>
      ${q.context ? `<blockquote class="quote small">${esc(q.context)}</blockquote>` : ''}
      ${q.answer ? `<p class="q-answer"><b>Answer:</b> ${esc(q.answer)}</p>` : ''}
      <div class="hl-meta"><span>${q.lesson ? `<a href="#/lesson/${q.lesson}">${esc(lessonLabel(q.lesson))}</a>` : ''}</span><span>${shortDate(q.at)}</span>
      <button type="button" class="linkbtn" data-ans="${q.id}">${q.answered ? 'Edit answer' : 'Mark answered'}</button><button type="button" class="linkbtn danger" data-delq="${q.id}">Delete</button></div></li>`).join('')}</ul>`;
}

/**
 * All notes as Markdown text.
 * @returns {string} Markdown.
 */
function notesMarkdown() {
  const s = getState();
  const by = {};
  for (const h of s.highlights) (by[h.lesson] = by[h.lesson] || []).push(h);
  let md = `# Spark Lab notes\n\nExported ${new Date().toLocaleString('en-NZ')}\n\n`;
  for (const [lid, list] of Object.entries(by)) {
    md += `## ${lessonLabel(lid)}\n\n`;
    for (const h of list) md += `- **${h.text}**${h.note ? `\n  - Note: ${h.note}` : ''}\n`;
    md += '\n';
  }
  if (s.questions.length) md += `## My questions\n\n${questionsText()}\n`;
  return md;
}

/**
 * Saved questions as plain text for sharing.
 * @returns {string} Text.
 */
function questionsText() {
  return getState().questions.map((q, i) => `${i + 1}. ${q.text}${q.lesson ? ` (lesson ${lessonLabel(q.lesson)})` : ''}${q.context ? `\n   About: "${q.context}"` : ''}${q.answer ? `\n   Answer: ${q.answer}` : ''}`).join('\n');
}
