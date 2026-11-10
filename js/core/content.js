/**
 * content.js — loads chapter files listed as ready in the manifest and indexes
 * lessons, questions, glossary terms, formulas and fun facts.
 */
import { COURSE } from '../../content/manifest.js';
import { plainText } from '../utils/dom.js';

const chapters = new Map();
const lessons = new Map();
const questions = new Map();
let order = [];

/**
 * Give every checkpoint and test question a stable id and a back-reference.
 * @param {object} ch Chapter data.
 * @returns {void}
 */
function indexChapter(ch) {
  ch.lessons.forEach((les, i) => {
    les.chapterId = ch.id;
    les.index = i;
    (les.checkpoint || []).forEach((q, j) => {
      q.id = q.id || `${les.id}.c${j + 1}`;
      q.lessonId = les.id;
      q.chapterId = ch.id;
      questions.set(q.id, q);
    });
    (les.sections || []).forEach((sec, j) => {
      if (sec.type === 'try' && sec.question) {
        sec.question.id = sec.question.id || `${les.id}.t${j + 1}`;
        sec.question.lessonId = les.id;
        sec.question.chapterId = ch.id;
        questions.set(sec.question.id, sec.question);
      }
      if (sec.type === 'funfact') sec.factId = `${les.id}.f${j + 1}`;
    });
    lessons.set(les.id, les);
  });
  for (const tier of ['A', 'M', 'E']) {
    (ch.test?.[tier] || []).forEach((q, j) => {
      q.id = q.id || `${ch.id}.${tier}${j + 1}`;
      q.tier = tier;
      q.chapterId = ch.id;
      questions.set(q.id, q);
    });
  }
}

/**
 * Load every ready chapter. Call once at start-up.
 * @returns {Promise<void>}
 * @throws {Error} When a chapter file fails to load.
 */
export async function initContent() {
  const ready = COURSE.chapters.filter((c) => c.status === 'ready');
  const mods = await Promise.all(ready.map((c) => import(`../../content/${c.id}.js`)));
  mods.forEach((m, i) => {
    const data = { ...ready[i], ...m.default };
    chapters.set(data.id, data);
    indexChapter(data);
  });
  order = ready.flatMap((c) => chapters.get(c.id).lessons.map((l) => l.id));
}

/**
 * All chapters from the manifest, with loaded data merged in for ready ones.
 * @returns {object[]} Chapter list in course order.
 */
export function allChapters() {
  return COURSE.chapters.map((c) => chapters.get(c.id) || c);
}

/**
 * Ready (loaded) chapters only.
 * @returns {object[]} Chapters with lessons.
 */
export function readyChapters() {
  return COURSE.chapters.filter((c) => chapters.has(c.id)).map((c) => chapters.get(c.id));
}

/**
 * One chapter.
 * @param {string} id e.g. 'ch01'.
 * @returns {object|undefined} Chapter.
 */
export function getChapter(id) {
  return chapters.get(id) || COURSE.chapters.find((c) => c.id === id);
}

/**
 * One lesson with neighbours.
 * @param {string} id e.g. '1.3'.
 * @returns {{lesson:object, chapter:object, prev:object|null, next:object|null}|null} Lesson context.
 */
export function getLesson(id) {
  const lesson = lessons.get(id);
  if (!lesson) return null;
  const i = order.indexOf(id);
  return {
    lesson,
    chapter: chapters.get(lesson.chapterId),
    prev: i > 0 ? lessons.get(order[i - 1]) : null,
    next: i < order.length - 1 ? lessons.get(order[i + 1]) : null,
  };
}

/**
 * Lesson ids in course order.
 * @returns {string[]} Ids.
 */
export function lessonOrder() {
  return order.slice();
}

/**
 * Look up any question by id.
 * @param {string} id Question id.
 * @returns {object|undefined} Question.
 */
export function getQuestion(id) {
  return questions.get(id);
}

/**
 * All checkpoint questions for the given chapters (for practice mixes).
 * @param {string[]} [chapterIds] Limit to these chapters.
 * @returns {object[]} Questions.
 */
export function practicePool(chapterIds) {
  return [...questions.values()].filter((q) => q.lessonId && (!chapterIds || chapterIds.includes(q.chapterId)));
}

/**
 * Glossary entries across ready chapters.
 * @returns {{term:string, def:string, chapterId:string}[]} Sorted entries.
 */
export function glossary() {
  return readyChapters()
    .flatMap((c) => (c.glossary || []).map((g) => ({ ...g, chapterId: c.id, chapterNum: c.num })))
    .sort((a, b) => a.term.localeCompare(b.term));
}

/**
 * Formula entries across ready chapters.
 * @returns {object[]} Formulas with chapter info.
 */
export function formulas() {
  return readyChapters().flatMap((c) => (c.formulas || []).map((f) => ({ ...f, chapterId: c.id, chapterNum: c.num, chapterTitle: c.title })));
}

/**
 * Every fun fact (for the home page "fact of the day").
 * @returns {{id:string, html:string, lessonId:string}[]} Facts.
 */
export function funFacts() {
  const out = [];
  for (const les of lessons.values()) {
    for (const s of les.sections || []) if (s.type === 'funfact') out.push({ id: s.factId, html: s.html, title: s.title, lessonId: les.id });
  }
  return out;
}

/**
 * Every sim id used in lessons.
 * @returns {string[]} Sim ids.
 */
export function allSimIds() {
  const ids = new Set();
  for (const les of lessons.values()) for (const s of les.sections || []) if (s.type === 'sim') ids.add(s.sim);
  return [...ids];
}

/**
 * Plain-text search records for every lesson section, glossary term and formula.
 * @returns {{kind:string, title:string, text:string, route:string, where:string}[]} Records.
 */
export function searchRecords() {
  const recs = [];
  for (const ch of readyChapters()) {
    for (const les of ch.lessons) {
      recs.push({ kind: 'Lesson', title: `${les.id} ${les.title}`, text: (les.objectives || []).join(' '), route: `#/lesson/${les.id}`, where: ch.title });
      (les.sections || []).forEach((s, i) => {
        const text = plainText([s.html, s.wrong, s.right, s.caption, (s.steps || []).join(' '), (s.points || []).join(' ')].join(' '));
        if (text) recs.push({ kind: 'Section', title: s.title || les.title, text, route: `#/lesson/${les.id}?s=${i}`, where: `${les.id} ${les.title}` });
      });
    }
    for (const g of ch.glossary || []) recs.push({ kind: 'Glossary', title: g.term, text: plainText(g.def), route: `#/glossary?t=${encodeURIComponent(g.term)}`, where: ch.title });
    for (const f of ch.formulas || []) recs.push({ kind: 'Formula', title: f.name, text: plainText(`${f.tex} ${f.note || ''} ${(f.symbols || []).map((s) => s.join(' ')).join(' ')}`), route: `#/formulas?c=${ch.id}`, where: ch.title });
  }
  return recs;
}
