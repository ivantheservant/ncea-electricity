/**
 * srs.js — flashcards with a 5-box Leitner spaced-repetition schedule.
 * Cards come from each chapter's glossary, formulas and extra flashcards.
 */
import { SRS_INTERVALS, SRS_NEW_PER_DAY, XP } from '../config.js';
import { getState, commit } from './store.js';
import { addXP } from './xp.js';
import { readyChapters } from './content.js';
import { dayKey, addDays } from '../utils/date.js';

/**
 * Slug for ids.
 * @param {string} s Text.
 * @returns {string} Slug.
 */
function slug(s) {
  return String(s).toLowerCase().replace(/<[^>]+>|\$/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
}

/**
 * Every flashcard from ready chapters.
 * @param {string} [chapterId] Limit to one chapter.
 * @returns {{id:string, front:string, back:string, chapterId:string, kind:string}[]} Cards.
 */
export function allCards(chapterId) {
  const cards = [];
  for (const ch of readyChapters()) {
    if (chapterId && ch.id !== chapterId) continue;
    for (const g of ch.glossary || []) cards.push({ id: `${ch.id}:g:${slug(g.term)}`, front: g.term, back: g.def, chapterId: ch.id, kind: 'Term' });
    for (const f of ch.formulas || []) {
      cards.push({
        id: `${ch.id}:f:${slug(f.name)}`, front: f.name,
        back: `$$${f.tex}$$${f.symbols ? `<ul class="symlist">${f.symbols.map((s) => `<li>$${s[0]}$ = ${s[1]}${s[2] ? ` (${s[2]})` : ''}</li>`).join('')}</ul>` : ''}`,
        chapterId: ch.id, kind: 'Formula',
      });
    }
    for (const c of ch.flashcards || []) cards.push({ id: `${ch.id}:c:${slug(c.front)}`, front: c.front, back: c.back, chapterId: ch.id, kind: 'Card' });
  }
  return cards;
}

/**
 * Cards to study now: due reviews first, then up to today's quota of new cards.
 * @param {string} [chapterId] Limit to one chapter.
 * @returns {object[]} Cards in study order.
 */
export function dueCards(chapterId) {
  const s = getState();
  const today = dayKey();
  const cards = allCards(chapterId);
  const due = cards.filter((c) => s.srs[c.id] && s.srs[c.id].due <= today);
  const newUsed = s.srsDaily[today]?.newSeen || 0;
  const fresh = cards.filter((c) => !s.srs[c.id]).slice(0, Math.max(0, SRS_NEW_PER_DAY - newUsed));
  due.sort((a, b) => s.srs[a.id].box - s.srs[b.id].box);
  return [...due, ...fresh];
}

/**
 * Count of cards due now (including today's new-card quota).
 * @returns {number} Count.
 */
export function dueCount() {
  return dueCards().length;
}

/**
 * Record a flashcard review.
 * @param {object} card Card.
 * @param {boolean} knew True for "Got it", false for "Not yet".
 * @returns {void}
 */
export function review(card, knew) {
  const s = getState();
  const today = dayKey();
  const daily = s.srsDaily[today] || (s.srsDaily[today] = { newSeen: 0, reviews: 0, xp: 0 });
  let rec = s.srs[card.id];
  if (!rec) {
    rec = s.srs[card.id] = { box: 0, due: today, seen: 0, right: 0, wrong: 0 };
    daily.newSeen += 1;
  }
  rec.seen += 1;
  if (knew) {
    rec.right += 1;
    rec.box = Math.min(SRS_INTERVALS.length, rec.box + 1);
    rec.due = addDays(today, SRS_INTERVALS[rec.box - 1] || 1);
    if (rec.box === 1) rec.due = addDays(today, 1);
  } else {
    rec.wrong += 1;
    rec.box = 1;
    rec.due = today;
  }
  daily.reviews += 1;
  s.counters.flashReviews += 1;
  // tidy old daily records
  for (const k of Object.keys(s.srsDaily)) if (k < addDays(today, -30)) delete s.srsDaily[k];
  if (daily.xp < XP.flashcardDailyCap) {
    daily.xp += XP.flashcard;
    addXP(XP.flashcard, 'Flashcard');
  } else {
    commit('srs');
  }
}

/**
 * Mastery summary per box.
 * @param {string} [chapterId] Limit.
 * @returns {{total:number, seen:number, mastered:number}} Counts (mastered = box ≥ 4).
 */
export function mastery(chapterId) {
  const s = getState();
  const cards = allCards(chapterId);
  const seen = cards.filter((c) => s.srs[c.id]).length;
  const mastered = cards.filter((c) => (s.srs[c.id]?.box || 0) >= 4).length;
  return { total: cards.length, seen, mastered };
}
