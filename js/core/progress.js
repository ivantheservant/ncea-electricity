/**
 * progress.js — lesson completion, question statistics, the mistake book and chapter tests.
 */
import { XP, MISTAKE_CLEAR_STREAK } from '../config.js';
import { getState, commit, emit } from './store.js';
import { addXP } from './xp.js';
import { lessonOrder, readyChapters, getChapter } from './content.js';

/**
 * Whether a lesson is complete.
 * @param {string} id Lesson id.
 * @returns {boolean} True when complete.
 */
export function isLessonDone(id) {
  return !!getState().lessons[id]?.done;
}

/**
 * Mark a lesson complete (first time gives XP) and remember its checkpoint score.
 * @param {string} id Lesson id.
 * @param {number} [score] Checkpoint score 0–1.
 * @returns {boolean} True when this was the first completion.
 */
export function completeLesson(id, score) {
  const s = getState();
  const rec = s.lessons[id] || (s.lessons[id] = { done: false, best: 0, visits: 0 });
  const first = !rec.done;
  rec.done = true;
  rec.at = rec.at || Date.now();
  if (typeof score === 'number') rec.best = Math.max(rec.best || 0, score);
  if (first) {
    addXP(XP.lessonComplete, `Lesson ${id} complete`);
    emit('lesson-complete', id);
  }
  commit('lesson');
  return first;
}

/**
 * Record that a lesson was opened.
 * @param {string} id Lesson id.
 * @returns {void}
 */
export function visitLesson(id) {
  const s = getState();
  const rec = s.lessons[id] || (s.lessons[id] = { done: false, best: 0, visits: 0 });
  rec.visits = (rec.visits || 0) + 1;
  s.lastLesson = id;
  commit('visit');
}

/**
 * Number of completed lessons.
 * @returns {number} Count.
 */
export function lessonsDoneCount() {
  return Object.values(getState().lessons).filter((l) => l.done).length;
}

/**
 * Chapter progress.
 * @param {object} ch Chapter (ready).
 * @returns {{done:number, total:number, pct:number}} Progress.
 */
export function chapterProgress(ch) {
  const total = ch.lessons?.length || 0;
  const done = (ch.lessons || []).filter((l) => isLessonDone(l.id)).length;
  return { done, total, pct: total ? done / total : 0 };
}

/**
 * Whether every lesson in a chapter is done.
 * @param {string} chId Chapter id.
 * @returns {boolean} True when complete.
 */
export function isChapterComplete(chId) {
  const ch = getChapter(chId);
  if (!ch?.lessons?.length) return false;
  return ch.lessons.every((l) => isLessonDone(l.id));
}

/**
 * The next lesson to study (first incomplete in course order).
 * @returns {string|null} Lesson id or null when everything is done.
 */
export function nextLessonId() {
  return lessonOrder().find((id) => !isLessonDone(id)) || null;
}

/**
 * Record an answer: statistics, mistake book and comeback counter.
 * @param {object} q Question (must have id).
 * @param {boolean} correct Whether the answer was right.
 * @returns {{cleared:boolean, comeback:boolean}} What happened in the mistake book.
 */
export function recordAnswer(q, correct) {
  const s = getState();
  const st = s.quiz[q.id] || (s.quiz[q.id] = { tries: 0, right: 0, wrongEver: false });
  st.tries += 1;
  st.last = correct;
  let cleared = false;
  let comeback = false;
  if (correct) {
    st.right += 1;
    if (st.wrongEver && !st.comeback) { st.comeback = true; comeback = true; s.counters.comebacks += 1; }
    const m = s.mistakes[q.id];
    if (m) {
      m.streak += 1;
      if (m.streak >= MISTAKE_CLEAR_STREAK) {
        delete s.mistakes[q.id];
        s.counters.mistakesCleared += 1;
        cleared = true;
        addXP(XP.mistakeCleared, 'Mistake cleared');
      }
    }
  } else {
    st.wrongEver = true;
    const m = s.mistakes[q.id] || (s.mistakes[q.id] = { count: 0, streak: 0, at: Date.now() });
    m.count += 1;
    m.streak = 0;
    m.at = Date.now();
  }
  commit('answer');
  return { cleared, comeback };
}

/**
 * Save a chapter-test result and award grade bonus XP the first time each grade is reached.
 * @param {string} chId Chapter id.
 * @param {{score:number, total:number, tiers:object, grade:string}} result Result.
 * @returns {void}
 */
export function recordTest(chId, result) {
  const s = getState();
  const t = s.tests[chId] || (s.tests[chId] = { best: null, history: [], bonuses: {} });
  t.history.push({ ...result, at: Date.now() });
  if (t.history.length > 20) t.history.shift();
  const rank = { N: 0, A: 1, M: 2, E: 3 };
  if (!t.best || rank[result.grade] > rank[t.best.grade] || (rank[result.grade] === rank[t.best.grade] && result.score > t.best.score)) {
    t.best = { ...result, at: Date.now() };
  }
  t.bonuses = t.bonuses || {};
  for (const g of ['A', 'M', 'E']) {
    if (rank[result.grade] >= rank[g] && !t.bonuses[g]) {
      t.bonuses[g] = true;
      addXP(XP.testGradeBonus[g], `First ${{ A: 'Achieved', M: 'Merit', E: 'Excellence' }[g]} in Chapter ${getChapter(chId).num} test`);
    }
  }
  commit('test');
}

/**
 * Count chapter tests at or above a grade.
 * @param {'A'|'M'|'E'} grade Minimum grade.
 * @returns {number} Count.
 */
export function testsAtGrade(grade) {
  const rank = { N: 0, A: 1, M: 2, E: 3 };
  return Object.values(getState().tests).filter((t) => t.best && rank[t.best.grade] >= rank[grade]).length;
}

/**
 * Average best checkpoint score over completed lessons.
 * @returns {number} 0–1.
 */
export function avgCheckpoint() {
  const done = Object.values(getState().lessons).filter((l) => l.done);
  if (!done.length) return 0;
  return done.reduce((a, l) => a + (l.best || 0), 0) / done.length;
}

/**
 * Remember that a sim was used; first use gives XP.
 * @param {string} simId Sim id.
 * @returns {void}
 */
export function markSim(simId) {
  const s = getState();
  if (s.sims[simId]) return;
  s.sims[simId] = Date.now();
  addXP(XP.simFirstUse, 'Tried an interactive');
}

/**
 * Remember that a fun fact was revealed; first reveal gives XP.
 * @param {string} factId Fact id.
 * @returns {void}
 */
export function markFact(factId) {
  const s = getState();
  if (s.facts[factId]) return;
  s.facts[factId] = Date.now();
  addXP(XP.funFact, 'Fun fact');
}

/**
 * Ready chapter ids in which at least one lesson is done.
 * @returns {string[]} Chapter ids.
 */
export function startedChapterIds() {
  return readyChapters().filter((c) => c.lessons.some((l) => isLessonDone(l.id))).map((c) => c.id);
}
