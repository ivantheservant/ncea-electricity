/**
 * me.js — profile page: level, XP history, streak calendar, stats and badges.
 */
import { esc } from '../utils/dom.js';
import { getState } from '../core/store.js';
import { levelInfo, liveStreak } from '../core/xp.js';
import { LEVELS } from '../config.js';
import { badgeList } from '../core/achievements.js';
import { lessonsDoneCount, avgCheckpoint } from '../core/progress.js';
import { lessonOrder } from '../core/content.js';
import { dayKey, addDays, shortDate } from '../utils/date.js';
import { icon } from '../ui/shell.js';
import { currentUser } from '../core/cloud.js';

/**
 * Me page.
 * @param {Element} view Main view.
 * @returns {() => void} Cleanup.
 */
export function meView(view) {
  const s = getState();
  const lv = levelInfo(s.xp.total);
  const today = dayKey();
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13));
  const max = Math.max(s.profile.dailyGoal, ...days.map((d) => s.xp.byDay[d] || 0));
  const badges = badgeList();
  const earned = badges.filter((b) => s.badges[b.id]).length;
  const groups = [...new Set(badges.map((b) => b.group))];
  view.innerHTML = `
  <div class="page me">
    <header class="me-head">
      <div class="lvl-badge"><span>${lv.index + 1}</span></div>
      <div><h1>${esc(s.profile.name || 'Your progress')}</h1>
        <p class="lede">${esc(lv.name)} · ${s.xp.total} XP${lv.next ? ` · ${lv.toNext} XP to ${esc(lv.next.name)}` : ''}</p>
        <div class="bar lvl-bar"><span style="width:${Math.round(lv.pct * 100)}%"></span></div></div>
      <div class="me-links">${currentUser()?.isParent ? `<a class="btn primary small" href="#/family">${icon('family')} Family</a>` : ''}<a class="btn ghost small" href="#/rewards">${icon('gift')} Reward Board</a><a class="btn ghost small" href="#/settings">${icon('settings')} Settings</a></div>
    </header>

    <section class="stats-grid">
      <div class="statbox"><b>${lessonsDoneCount()}</b><span>of ${lessonOrder().length} lessons done</span></div>
      <div class="statbox"><b>${Math.round(avgCheckpoint() * 100)}%</b><span>average checkpoint</span></div>
      <div class="statbox"><b>🔥 ${liveStreak()}</b><span>day streak (best ${s.streak.best})</span></div>
      <div class="statbox"><b>${Object.keys(s.goalDays).length}</b><span>days goal reached</span></div>
      <div class="statbox"><b>${s.counters.flashReviews}</b><span>flashcards reviewed</span></div>
      <div class="statbox"><b>${s.counters.mistakesCleared}</b><span>mistakes cleared</span></div>
    </section>

    <section class="xp-chart">
      <h2>XP, last 14 days</h2>
      <div class="bars" role="img" aria-label="XP earned each day for the last 14 days">
        ${days.map((d) => { const v = s.xp.byDay[d] || 0; return `<div class="bcol ${s.goalDays[d] ? 'goal' : ''} ${d === today ? 'today' : ''}" title="${shortDate(d)}: ${v} XP"><span class="bval">${v || ''}</span><span class="bfill" style="height:${Math.round((v / max) * 110)}px"></span><span class="blbl">${d.slice(8)}</span></div>`; }).join('')}
        <div class="goal-line" style="bottom:${22 + Math.round((s.profile.dailyGoal / max) * 110)}px"><span>goal</span></div>
      </div>
    </section>

    <section class="levels">
      <h2>Level ladder</h2>
      <ol class="ladder">${LEVELS.map((l, i) => `<li class="${i < lv.index ? 'past' : i === lv.index ? 'now' : ''}"><span class="lad-n">${i + 1}</span><b>${esc(l.name)}</b><small>${l.min} XP</small></li>`).join('')}</ol>
    </section>

    <section class="badges">
      <h2>Badges <small>${earned} of ${badges.length}</small></h2>
      ${groups.map((g) => `<h3>${g}</h3><div class="badge-grid">${badges.filter((b) => b.group === g).map((b) => {
    const at = s.badges[b.id];
    return `<div class="badge ${at ? 'earned' : 'locked'}"><span class="b-ico">${at ? b.icon : '🔒'}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small>${at ? `<em>${shortDate(at)}</em>` : ''}</div>`;
  }).join('')}</div>`).join('')}
    </section>
  </div>`;
  window.scrollTo(0, 0);
  return () => {};
}
