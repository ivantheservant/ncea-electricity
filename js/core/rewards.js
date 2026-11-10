/**
 * rewards.js — the parent-run Reward Board. A parent sets a PIN, adds rewards with
 * conditions, and confirms when a reward has been handed over.
 * The PIN is a light lock for a shared device, not real security.
 */
import { getState, commit, emit } from './store.js';
import { uid } from '../utils/dom.js';
import { lessonsDoneCount, isChapterComplete } from './progress.js';
import { getChapter } from './content.js';
import { checkAchievements } from './achievements.js';

export const COND_TYPES = {
  xp: { label: 'Reach a total XP', unit: 'XP' },
  lessons: { label: 'Complete a number of lessons', unit: 'lessons' },
  chapter: { label: 'Finish a chapter', unit: '' },
  test: { label: 'Reach a grade in a chapter test', unit: '' },
  streak: { label: 'Study days in a row', unit: 'days' },
  badges: { label: 'Earn a number of badges', unit: 'badges' },
};

/**
 * SHA-256 of text (falls back to a simple hash where SubtleCrypto is unavailable).
 * @param {string} text Input.
 * @returns {Promise<string>} Hex digest.
 */
async function hash(text) {
  if (window.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) | 0;
  return 'x' + (h >>> 0).toString(16);
}

/**
 * Whether a parent PIN exists.
 * @returns {boolean} True when set.
 */
export function hasPin() {
  return !!getState().rewards.pinHash;
}

/**
 * Set or change the parent PIN.
 * @param {string} pin 4–8 digits.
 * @returns {Promise<void>}
 * @throws {Error} When the PIN format is wrong.
 */
export async function setPin(pin) {
  if (!/^\d{4,8}$/.test(pin)) throw new Error('Use 4 to 8 digits for the PIN.');
  const r = getState().rewards;
  r.salt = uid();
  r.pinHash = await hash(r.salt + pin);
  commit('rewards');
}

/**
 * Check a PIN.
 * @param {string} pin PIN typed.
 * @returns {Promise<boolean>} True when it matches.
 */
export async function verifyPin(pin) {
  const r = getState().rewards;
  if (!r.pinHash) return true;
  return (await hash(r.salt + pin)) === r.pinHash;
}

/**
 * Remove the PIN (parent action after verification).
 * @returns {void}
 */
export function clearPin() {
  const r = getState().rewards;
  r.pinHash = null;
  r.salt = null;
  commit('rewards');
}

/**
 * Current value and target for a condition.
 * @param {{type:string, target?:number, chapter?:string, grade?:string}} c Condition.
 * @returns {{value:number, target:number, pct:number, text:string}} Progress.
 */
export function condProgress(c) {
  const s = getState();
  const rank = { N: 0, A: 1, M: 2, E: 3 };
  const gname = { A: 'Achieved', M: 'Merit', E: 'Excellence' };
  switch (c.type) {
    case 'xp': return mk(s.xp.total, c.target, `${s.xp.total} / ${c.target} XP`);
    case 'lessons': { const v = lessonsDoneCount(); return mk(v, c.target, `${v} / ${c.target} lessons`); }
    case 'streak': return mk(s.streak.best, c.target, `Best streak ${s.streak.best} / ${c.target} days`);
    case 'badges': { const v = Object.keys(s.badges).length; return mk(v, c.target, `${v} / ${c.target} badges`); }
    case 'chapter': {
      const ch = getChapter(c.chapter);
      const total = ch?.lessons?.length || 1;
      const done = (ch?.lessons || []).filter((l) => s.lessons[l.id]?.done).length;
      return mk(isChapterComplete(c.chapter) ? total : done, total, `Chapter ${ch?.num ?? '?'}: ${done} / ${total} lessons`);
    }
    case 'test': {
      const best = s.tests[c.chapter]?.best?.grade || 'N';
      const ch = getChapter(c.chapter);
      return mk(rank[best], rank[c.grade], `Chapter ${ch?.num ?? '?'} test: best ${best === 'N' ? 'not yet' : gname[best]}, need ${gname[c.grade]}`);
    }
    default: return mk(0, 1, '');
  }
}

/**
 * Build a progress record.
 * @param {number} value Current.
 * @param {number} target Target.
 * @param {string} text Description.
 * @returns {{value:number, target:number, pct:number, text:string}} Record.
 */
function mk(value, target, text) {
  return { value, target, pct: Math.max(0, Math.min(1, target ? value / target : 0)), text };
}

/**
 * Plain description of a condition.
 * @param {object} c Condition.
 * @returns {string} Description.
 */
export function condText(c) {
  const gname = { A: 'Achieved', M: 'Merit', E: 'Excellence' };
  const ch = c.chapter ? getChapter(c.chapter) : null;
  switch (c.type) {
    case 'xp': return `Reach ${c.target} XP`;
    case 'lessons': return `Complete ${c.target} lessons`;
    case 'streak': return `Study ${c.target} days in a row`;
    case 'badges': return `Earn ${c.target} badges`;
    case 'chapter': return `Finish Chapter ${ch?.num}: ${ch?.title}`;
    case 'test': return `Get ${gname[c.grade]} or better in the Chapter ${ch?.num} test`;
    default: return '';
  }
}

/**
 * Add a reward.
 * @param {{title:string, cond:object}} r Reward.
 * @returns {object} Saved reward.
 */
export function addReward(r) {
  const rec = { id: uid('rw_'), title: r.title.trim(), cond: r.cond, status: 'locked', created: Date.now() };
  getState().rewards.items.push(rec);
  evaluateRewards();
  commit('rewards');
  return rec;
}

/**
 * Delete a reward.
 * @param {string} id Reward id.
 * @returns {void}
 */
export function removeReward(id) {
  const r = getState().rewards;
  r.items = r.items.filter((x) => x.id !== id);
  commit('rewards');
}

/**
 * Mark a reward as handed over.
 * @param {string} id Reward id.
 * @returns {void}
 */
export function claimReward(id) {
  const it = getState().rewards.items.find((x) => x.id === id);
  if (!it || it.status !== 'unlocked') return;
  it.status = 'claimed';
  it.claimedAt = Date.now();
  commit('rewards');
  checkAchievements();
}

/**
 * Unlock rewards whose conditions are met. Emits 'reward' for each new unlock.
 * @returns {object[]} Newly unlocked rewards.
 */
export function evaluateRewards() {
  const items = getState().rewards.items;
  const fresh = [];
  for (const it of items) {
    if (it.status !== 'locked') continue;
    const p = condProgress(it.cond);
    if (p.value >= p.target && p.target > 0) {
      it.status = 'unlocked';
      it.unlockedAt = Date.now();
      fresh.push(it);
    }
  }
  if (fresh.length) {
    commit('rewards');
    fresh.forEach((it) => emit('reward', it));
  }
  return fresh;
}
