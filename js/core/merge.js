/**
 * merge.js — combine two copies of the learner's state (e.g. Chromebook and phone)
 * so that progress made on either device is kept. Merging is symmetric: both devices
 * end up with the same result whichever merges first.
 */

/**
 * Union of two keyed objects, resolving clashes with a picker.
 * @param {object} a First map.
 * @param {object} b Second map.
 * @param {(x:any, y:any)=>any} pick Chooses or combines two values for the same key.
 * @returns {object} Merged map.
 */
function mergeMap(a = {}, b = {}, pick) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = k in out ? pick(out[k], v) : v;
  return out;
}

/**
 * Union of two arrays of records keyed by a field; later edits win.
 * @param {object[]} a First list.
 * @param {object[]} b Second list.
 * @param {string} key Identity field.
 * @returns {object[]} Merged list.
 */
function mergeList(a = [], b = [], key) {
  const map = new Map();
  for (const r of [...a, ...b]) {
    const k = r[key];
    const old = map.get(k);
    if (!old || (r.edited || r.at || 0) > (old.edited || old.at || 0)) map.set(k, r);
  }
  return [...map.values()].sort((x, y) => (x.at || 0) - (y.at || 0));
}

const RANK = { N: 0, A: 1, M: 2, E: 3 };
const STATUS = { locked: 0, unlocked: 1, claimed: 2 };

/**
 * Merge two learner states.
 * @param {object} a Local state.
 * @param {object} b Remote state.
 * @returns {object} New merged state (inputs are not modified).
 */
export function mergeStates(a, b) {
  if (!b) return structuredClone(a);
  if (!a) return structuredClone(b);
  const A = structuredClone(a);
  const B = structuredClone(b);
  const out = A;
  // A device with no progress yet takes the other copy's settings (goal, theme, text size).
  const aEmpty = !(A.xp?.total) && !Object.keys(A.lessons || {}).length;
  const first = aEmpty ? A : B;
  const second = aEmpty ? B : A;
  out.profile = {
    ...first.profile, ...second.profile,
    name: second.profile?.name || first.profile?.name || '',
    onboarded: !!(A.profile?.onboarded || B.profile?.onboarded),
    created: Math.min(A.profile?.created || Infinity, B.profile?.created || Infinity),
  };
  out.xp = {
    total: Math.max(A.xp?.total || 0, B.xp?.total || 0),
    byDay: mergeMap(A.xp?.byDay, B.xp?.byDay, Math.max),
  };
  out.lessons = mergeMap(A.lessons, B.lessons, (x, y) => ({
    done: !!(x.done || y.done), best: Math.max(x.best || 0, y.best || 0),
    at: Math.min(x.at || Infinity, y.at || Infinity) === Infinity ? undefined : Math.min(x.at || Infinity, y.at || Infinity),
    visits: Math.max(x.visits || 0, y.visits || 0), perfect: !!(x.perfect || y.perfect),
  }));
  out.quiz = mergeMap(A.quiz, B.quiz, (x, y) => {
    const newer = (y.tries || 0) > (x.tries || 0) ? y : x;
    return { tries: Math.max(x.tries || 0, y.tries || 0), right: Math.max(x.right || 0, y.right || 0), wrongEver: !!(x.wrongEver || y.wrongEver), comeback: !!(x.comeback || y.comeback), last: newer.last };
  });
  out.tests = mergeMap(A.tests, B.tests, (x, y) => {
    const best = !x.best ? y.best : !y.best ? x.best : (RANK[y.best.grade] > RANK[x.best.grade] || (RANK[y.best.grade] === RANK[x.best.grade] && y.best.score > x.best.score)) ? y.best : x.best;
    const seen = new Set();
    const history = [...(x.history || []), ...(y.history || [])].filter((h) => !seen.has(h.at) && seen.add(h.at)).sort((p, q) => p.at - q.at).slice(-20);
    return { best, history, bonuses: { ...(x.bonuses || {}), ...(y.bonuses || {}) } };
  });
  out.badges = mergeMap(A.badges, B.badges, Math.min);
  const sa = A.streak || {};
  const sb = B.streak || {};
  const later = (sb.lastDay || '') > (sa.lastDay || '') ? sb : (sa.lastDay || '') > (sb.lastDay || '') ? sa : (sb.current > sa.current ? sb : sa);
  out.streak = { current: later.current || 0, lastDay: later.lastDay || null, best: Math.max(sa.best || 0, sb.best || 0) };
  out.goalDays = { ...(A.goalDays || {}), ...(B.goalDays || {}) };
  out.highlights = mergeList(A.highlights, B.highlights, 'id');
  out.bookmarks = mergeList(A.bookmarks, B.bookmarks, 'key');
  out.questions = mergeList(A.questions, B.questions, 'id');
  out.srs = mergeMap(A.srs, B.srs, (x, y) => ((y.seen || 0) > (x.seen || 0) ? y : x));
  out.srsDaily = mergeMap(A.srsDaily, B.srsDaily, (x, y) => ({ newSeen: Math.max(x.newSeen || 0, y.newSeen || 0), reviews: Math.max(x.reviews || 0, y.reviews || 0), xp: Math.max(x.xp || 0, y.xp || 0) }));
  // A mistake survives only if the copy that saw the question most recently still has it.
  const mistakes = {};
  for (const id of new Set([...Object.keys(A.mistakes || {}), ...Object.keys(B.mistakes || {})])) {
    const ta = A.quiz?.[id]?.tries || 0;
    const tb = B.quiz?.[id]?.tries || 0;
    const src = tb > ta ? B : A;
    if (src.mistakes?.[id]) mistakes[id] = src.mistakes[id];
  }
  out.mistakes = mistakes;
  out.sims = mergeMap(A.sims, B.sims, Math.min);
  out.facts = mergeMap(A.facts, B.facts, Math.min);
  out.visited = mergeMap(A.visited, B.visited, Math.max);
  out.counters = mergeMap(A.counters, B.counters, Math.max);
  out.rewardsSeen = { ...(A.rewardsSeen || {}), ...(B.rewardsSeen || {}) };
  const ra = A.rewards || { items: [] };
  const rb = B.rewards || { items: [] };
  const items = new Map();
  for (const it of [...(ra.items || []), ...(rb.items || [])]) {
    const old = items.get(it.id);
    if (!old || STATUS[it.status] > STATUS[old.status]) items.set(it.id, it);
  }
  out.rewards = { pinHash: ra.pinHash || rb.pinHash || null, salt: ra.pinHash ? ra.salt : rb.salt || null, items: [...items.values()] };
  out.lastLesson = A.lastLesson || B.lastLesson || null;
  out.lastBackup = Math.max(A.lastBackup || 0, B.lastBackup || 0) || null;
  return out;
}
