/**
 * xp.js — XP, levels, daily goal and streaks.
 */
import { XP, LEVELS } from '../config.js';
import { getState, commit, emit } from './store.js';
import { dayKey, addDays } from '../utils/date.js';

/**
 * Level details for an XP total.
 * @param {number} total Total XP.
 * @returns {{index:number, name:string, min:number, next:object|null, pct:number, toNext:number}} Level info.
 */
export function levelInfo(total) {
  let index = 0;
  LEVELS.forEach((l, i) => { if (total >= l.min) index = i; });
  const cur = LEVELS[index];
  const next = LEVELS[index + 1] || null;
  const pct = next ? (total - cur.min) / (next.min - cur.min) : 1;
  return { index, name: cur.name, min: cur.min, next, pct, toNext: next ? next.min - total : 0 };
}

/**
 * XP earned today.
 * @returns {number} XP.
 */
export function todayXP() {
  return getState().xp.byDay[dayKey()] || 0;
}

/**
 * Update the streak for activity today. Returns a one-off bonus the first time each day.
 * @param {object} s State.
 * @param {string} today Day key.
 * @returns {number} Bonus XP (0 when none).
 */
function touchStreak(s, today) {
  const st = s.streak;
  if (st.lastDay === today) return 0;
  st.current = st.lastDay === addDays(today, -1) ? st.current + 1 : 1;
  st.lastDay = today;
  st.best = Math.max(st.best, st.current);
  emit('streak', st.current);
  return st.current >= 2 ? Math.min(XP.streakBonusPerDay * st.current, XP.streakBonusMax) : 0;
}

/**
 * Current streak, treating a missed yesterday as broken.
 * @returns {number} Days in a row.
 */
export function liveStreak() {
  const st = getState().streak;
  const today = dayKey();
  if (st.lastDay === today || st.lastDay === addDays(today, -1)) return st.current;
  return 0;
}

/**
 * Award XP and handle level-ups, daily goal and streak bonus.
 * @param {number} amount XP to add (ignored when ≤ 0).
 * @param {string} reason Short reason shown in the toast.
 * @returns {number} XP actually added (including any streak bonus).
 */
export function addXP(amount, reason) {
  if (!(amount > 0)) return 0;
  const s = getState();
  const today = dayKey();
  const bonus = touchStreak(s, today);
  const total = amount + bonus;
  const before = levelInfo(s.xp.total).index;
  s.xp.total += total;
  s.xp.byDay[today] = (s.xp.byDay[today] || 0) + total;
  emit('xp', { amount, reason });
  if (bonus) emit('xp', { amount: bonus, reason: `${s.streak.current}-day streak bonus` });
  const after = levelInfo(s.xp.total);
  if (after.index > before) emit('level', after);
  if (!s.goalDays[today] && s.xp.byDay[today] >= s.profile.dailyGoal) {
    s.goalDays[today] = true;
    emit('goal', s.profile.dailyGoal);
  }
  commit('xp');
  return total;
}
