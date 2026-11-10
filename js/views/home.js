/**
 * home.js — dashboard: the "course circuit" (chapters drawn as bulbs that light up),
 * continue card, daily goal, streak, reviews due, rewards and a fun fact.
 */
import { esc } from '../utils/dom.js';
import { renderMath } from '../utils/tex.js';
import { getState } from '../core/store.js';
import { allChapters, getLesson, funFacts } from '../core/content.js';
import { chapterProgress, nextLessonId, lessonsDoneCount } from '../core/progress.js';
import { levelInfo, liveStreak } from '../core/xp.js';
import { dueCount } from '../core/srs.js';
import { condProgress } from '../core/rewards.js';
import { badgeList } from '../core/achievements.js';
import { ohmieTip, ring, goalStatus } from '../ui/shell.js';
import { dayKey } from '../utils/date.js';

/**
 * The course drawn as a snaking series circuit; each chapter is a bulb.
 * Bulbs glow in proportion to chapter progress.
 * @returns {string} SVG markup.
 */
export function courseCircuit() {
  const chs = allChapters();
  const cols = 4;
  const xs = [70, 152, 234, 316];
  const R = 16;
  const rowH = 86;
  const top = 40;
  const pos = chs.map((c, i) => {
    const r = Math.floor(i / cols);
    const k = i % cols;
    return { x: r % 2 === 0 ? xs[k] : xs[cols - 1 - k], y: top + r * rowH, c, row: r };
  });
  const first = pos[0];
  const last = pos[pos.length - 1];
  let wires = `<polyline class="wire" points="10,${first.y} ${first.x - R},${first.y}"/>`;
  for (let i = 0; i < pos.length - 1; i++) {
    const a = pos[i];
    const b = pos[i + 1];
    if (a.y === b.y) {
      const d = b.x > a.x ? 1 : -1;
      wires += `<line class="wire" x1="${a.x + R * d}" y1="${a.y}" x2="${b.x - R * d}" y2="${b.y}"/>`;
    } else {
      const right = a.x > 200;
      const side = right ? 354 : 30;
      const o = right ? R : -R;
      wires += `<polyline class="wire" points="${a.x + o},${a.y} ${side},${a.y} ${side},${b.y} ${b.x + o},${b.y}"/>`;
    }
  }
  const bottom = last.y + 34;
  const bat = first.y + 22;
  if (last.row % 2 === 1) wires += `<polyline class="wire" points="${last.x - R},${last.y} 10,${last.y} 10,${bat + 8}"/>`;
  else wires += `<polyline class="wire" points="${last.x + R},${last.y} 354,${last.y} 354,${bottom} 10,${bottom} 10,${bat + 8}"/>`;
  wires += `<line class="wire" x1="10" y1="${first.y}" x2="10" y2="${bat}"/>`;
  wires += `<g class="comp"><line x1="0" y1="${bat}" x2="20" y2="${bat}"/><line x1="4" y1="${bat + 8}" x2="16" y2="${bat + 8}" class="thick"/></g>`;
  let bulbs = '';
  for (const p of pos) {
    const ready = p.c.status === 'ready' && p.c.lessons;
    const pr = ready ? chapterProgress(p.c).pct : 0;
    const lit = pr > 0 ? 0.25 + 0.75 * pr : 0;
    bulbs += `<a href="#/chapter/${p.c.id}" class="cbulb ${ready ? 'ready' : 'soon'} ${pr >= 1 ? 'full' : ''}" aria-label="Chapter ${p.c.num}: ${esc(p.c.title)}${ready ? `, ${Math.round(pr * 100)}% complete` : ', coming soon'}">` +
      `${lit ? `<circle cx="${p.x}" cy="${p.y}" r="${R + 12 * pr}" class="halo" style="opacity:${lit}"/>` : ''}` +
      `<circle cx="${p.x}" cy="${p.y}" r="${R}" class="bulb-glass" style="--lit:${lit}"/>` +
      `<line x1="${p.x - 11}" y1="${p.y - 11}" x2="${p.x + 11}" y2="${p.y + 11}"/><line x1="${p.x - 11}" y1="${p.y + 11}" x2="${p.x + 11}" y2="${p.y - 11}"/>` +
      `<text x="${p.x}" y="${p.y + 36}" text-anchor="middle" class="cb-num">${p.c.num}</text></a>`;
  }
  const h = (last.row % 2 === 1 ? last.y + 48 : bottom + 10);
  return `<svg class="course-circuit dia" viewBox="0 0 366 ${h}" role="group" aria-label="Course map drawn as a circuit">${wires}${bulbs}</svg>`;
}

/**
 * Render the home page.
 * @param {Element} view Main view.
 * @returns {() => void} Cleanup.
 */
export function homeView(view) {
  const s = getState();
  const name = s.profile.name ? esc(s.profile.name) : 'there';
  const nextId = nextLessonId();
  const nx = nextId ? getLesson(nextId) : null;
  const lastId = s.lastLesson && !s.lessons[s.lastLesson]?.done ? s.lastLesson : null;
  const resume = lastId ? getLesson(lastId) : nx;
  const g = goalStatus();
  const lv = levelInfo(s.xp.total);
  const due = dueCount();
  const mistakes = Object.keys(s.mistakes).length;
  const rewards = s.rewards.items.filter((r) => r.status !== 'claimed').slice(0, 2);
  const facts = funFacts();
  const fact = facts.length ? facts[hashDay(dayKey()) % facts.length] : null;
  const badges = badgeList().filter((b) => s.badges[b.id]).sort((a, b) => s.badges[b.id] - s.badges[a.id]).slice(0, 4);
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  view.innerHTML = `
  <div class="page home">
    <section class="home-hero">
      <div class="hero-text">
        <h1>${greeting}, ${name}</h1>
        <p class="lede">${lessonsDoneCount() ? `You have lit up ${lessonsDoneCount()} lesson${lessonsDoneCount() === 1 ? '' : 's'} so far. Every bulb in your course circuit glows brighter as you finish its lessons.` : 'This is your course, drawn as a circuit. Finish lessons to light up each chapter bulb.'}</p>
        ${resume ? `<a class="continue" href="#/lesson/${resume.lesson.id}">
          <span class="c-label">${lastId ? 'Pick up where you left off' : 'Next lesson'}</span>
          <span class="c-title">${resume.lesson.id} ${esc(resume.lesson.title)}</span>
          <span class="c-sub">Chapter ${resume.chapter.num}: ${esc(resume.chapter.title)}</span></a>`
    : '<div class="continue done"><span class="c-title">Every lesson so far is complete!</span><span class="c-sub">Try the chapter tests or your flashcards while the next chapters are built.</span></div>'}
      </div>
      <div class="hero-map">${courseCircuit()}</div>
    </section>

    <section class="stat-row">
      <a class="stat" href="#/me">${ring(g.pct, 58, `${Math.round(g.pct * 100)}%`)}<div><b>${g.xp} / ${g.goal} XP</b><span>Today's goal</span></div></a>
      <a class="stat" href="#/me"><span class="stat-big">🔥 ${liveStreak()}</span><div><b>Day streak</b><span>Best: ${s.streak.best}</span></div></a>
      <a class="stat" href="#/me"><span class="stat-big lvl">${lv.index + 1}</span><div><b>${esc(lv.name)}</b><span>${lv.next ? `${lv.toNext} XP to ${esc(lv.next.name)}` : 'Top level!'}</span></div></a>
    </section>

    <section class="todo">
      <h2>Revision</h2>
      <div class="todo-grid">
        <a class="todo-card" href="#/flashcards"><span class="t-num">${due}</span><span class="t-lbl">flashcard${due === 1 ? '' : 's'} ready</span><span class="t-sub">A few minutes a day keeps formulas fresh.</span></a>
        <a class="todo-card" href="#/mistakes"><span class="t-num">${mistakes}</span><span class="t-lbl">in your mistake book</span><span class="t-sub">${mistakes ? 'Get each one right twice to clear it.' : 'Nothing to fix right now.'}</span></a>
        <a class="todo-card" href="#/practice"><span class="t-num">10</span><span class="t-lbl">question practice mix</span><span class="t-sub">Mixed questions from lessons you have done.</span></a>
      </div>
    </section>

    ${rewards.length ? `<section class="home-rewards"><h2>Rewards you are working towards</h2>${rewards.map((r) => {
    const p = condProgress(r.cond);
    return `<a class="reward-mini ${r.status}" href="#/rewards"><span class="rw-ico">${r.status === 'unlocked' ? '🎁' : '🔒'}</span><div class="rw-main"><b>${esc(r.title)}</b><span class="bar"><span style="width:${Math.round(p.pct * 100)}%"></span></span><small>${r.status === 'unlocked' ? 'Unlocked! Ask your parent to hand it over.' : esc(p.text)}</small></div></a>`;
  }).join('')}</section>` : ''}

    ${badges.length ? `<section class="home-badges"><h2>Latest badges</h2><div class="badge-strip">${badges.map((b) => `<a href="#/me" class="badge-chip" title="${esc(b.desc)}"><span>${b.icon}</span>${esc(b.name)}</a>`).join('')}</div></section>` : ''}

    ${fact ? `<section class="home-fact">${ohmieTip(`<p><b>Fact of the day.</b> ${fact.html}</p><p><a href="#/lesson/${fact.lessonId}">From lesson ${fact.lessonId}</a></p>`, 'wow')}</section>` : ''}
  </div>`;
  renderMath(view);
  window.scrollTo(0, 0);
  return () => {};
}

/**
 * Stable number from a string (picks the fact of the day).
 * @param {string} str Input.
 * @returns {number} Non-negative integer.
 */
function hashDay(str) {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}
