/**
 * notes.js — data functions for highlights, notes, bookmarks and saved questions.
 * (The on-page selection UI lives in ui/highlighter.js.)
 */
import { getState, commit } from './store.js';
import { checkAchievements } from './achievements.js';
import { uid } from '../utils/dom.js';

/**
 * Save a highlight.
 * @param {{lesson:string, bid:string, start:number, end:number, text:string, color:string, note?:string}} h Highlight.
 * @returns {object} Saved highlight with id.
 */
export function addHighlight(h) {
  const rec = { id: uid('hl_'), at: Date.now(), note: '', ...h };
  getState().highlights.push(rec);
  commit('highlight');
  checkAchievements();
  return rec;
}

/**
 * Change a highlight's colour or note.
 * @param {string} id Highlight id.
 * @param {object} patch Fields to change.
 * @returns {object|undefined} Updated highlight.
 */
export function updateHighlight(id, patch) {
  const h = getState().highlights.find((x) => x.id === id);
  if (!h) return undefined;
  Object.assign(h, patch, { edited: Date.now() });
  commit('highlight');
  checkAchievements();
  return h;
}

/**
 * Delete a highlight.
 * @param {string} id Highlight id.
 * @returns {void}
 */
export function removeHighlight(id) {
  const s = getState();
  s.highlights = s.highlights.filter((x) => x.id !== id);
  commit('highlight');
}

/**
 * Highlights for one lesson.
 * @param {string} lessonId Lesson id.
 * @returns {object[]} Highlights.
 */
export function lessonHighlights(lessonId) {
  return getState().highlights.filter((h) => h.lesson === lessonId);
}

/**
 * Bookmark key.
 * @param {string} lesson Lesson id.
 * @param {number|null} sec Section index or null for the whole lesson.
 * @returns {string} Key.
 */
function bmKey(lesson, sec) {
  return sec == null ? lesson : `${lesson}#${sec}`;
}

/**
 * Whether a lesson or section is bookmarked.
 * @param {string} lesson Lesson id.
 * @param {number|null} [sec=null] Section index.
 * @returns {boolean} True when bookmarked.
 */
export function isBookmarked(lesson, sec = null) {
  const k = bmKey(lesson, sec);
  return getState().bookmarks.some((b) => b.key === k);
}

/**
 * Toggle a bookmark.
 * @param {string} lesson Lesson id.
 * @param {number|null} sec Section index or null.
 * @param {string} title Title to show in the list.
 * @returns {boolean} New bookmarked state.
 */
export function toggleBookmark(lesson, sec, title) {
  const s = getState();
  const k = bmKey(lesson, sec);
  const i = s.bookmarks.findIndex((b) => b.key === k);
  if (i >= 0) s.bookmarks.splice(i, 1);
  else s.bookmarks.push({ key: k, lesson, sec, title, at: Date.now() });
  commit('bookmark');
  checkAchievements();
  return i < 0;
}

/**
 * Save a question for a teacher or parent.
 * @param {{lesson?:string, text:string, context?:string}} q Question.
 * @returns {object} Saved question.
 */
export function addQuestion(q) {
  const rec = { id: uid('q_'), at: Date.now(), answered: false, answer: '', ...q };
  getState().questions.push(rec);
  commit('question');
  checkAchievements();
  return rec;
}

/**
 * Update a saved question.
 * @param {string} id Question id.
 * @param {object} patch Fields to change.
 * @returns {void}
 */
export function updateQuestion(id, patch) {
  const q = getState().questions.find((x) => x.id === id);
  if (q) Object.assign(q, patch);
  commit('question');
}

/**
 * Delete a saved question.
 * @param {string} id Question id.
 * @returns {void}
 */
export function removeQuestion(id) {
  const s = getState();
  s.questions = s.questions.filter((x) => x.id !== id);
  commit('question');
}
