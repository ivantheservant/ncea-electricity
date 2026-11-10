/**
 * family.js — parent page: see each linked learner's progress, answer their saved questions,
 * and set or hand over rewards. Only parent accounts (PARENT_EMAILS) can use it.
 */
import { $, esc, uid, bindOnce } from '../utils/dom.js';
import { freshState } from '../core/store.js';
import { readyChapters, getLesson } from '../core/content.js';
import { levelInfo } from '../core/xp.js';
import { rewardList } from '../core/rewards.js';
import { cloudEnabled, cloudReady, currentUser, listMyLearners, saveFamily, signIn } from '../core/cloud.js';
import { dayKey, addDays, shortDate } from '../utils/date.js';
import { ohmieTip, openModal, toast, confirmBox, confetti, avatar } from '../ui/shell.js';
import { rewardCards, rewardDialog } from './rewards.js';

const GRADE = { N: 'Not yet', A: 'Achieved', M: 'Merit', E: 'Excellence' };

let learners = null;
let picked = null;
let loadError = '';
let cachedFor = '';

/**
 * Fill in any fields missing from a learner's saved state.
 * @param {object|null} s Saved state.
 * @returns {object} Complete state.
 */
function normalise(s) {
  const base = freshState();
  if (!s || typeof s !== 'object') return base;
  const out = { ...base, ...s };
  for (const k of Object.keys(base)) if (out[k] == null) out[k] = base[k];
  out.profile = { ...base.profile, ...(s.profile || {}) };
  out.xp = { ...base.xp, ...(s.xp || {}), byDay: s.xp?.byDay || {} };
  out.streak = { ...base.streak, ...(s.streak || {}) };
  out.counters = { ...base.counters, ...(s.counters || {}) };
  return out;
}

/**
 * How long ago a time was, in words.
 * @param {number} t Epoch ms.
 * @returns {string} e.g. '5 minutes ago'.
 */
function ago(t) {
  if (!t) return 'not yet';
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 2) return 'just now';
  if (m < 60) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.round(h / 24);
  return d < 14 ? `${d} day${d === 1 ? '' : 's'} ago` : shortDate(t);
}

/**
 * Current streak for a learner, treating a missed yesterday as broken.
 * @param {object} s Learner state.
 * @returns {number} Days in a row.
 */
function streakOf(s) {
  const today = dayKey();
  return s.streak.lastDay === today || s.streak.lastDay === addDays(today, -1) ? s.streak.current : 0;
}

/**
 * Family page.
 * @param {Element} view Main view.
 * @returns {() => void} Cleanup.
 */
export function familyView(view) {
  const me = currentUser();
  const shell = (body) => `<div class="page narrow family"><header class="page-head"><h1>Family</h1>
    <p class="lede">See how your learner is going, answer their questions and set real rewards.</p></header>${body}</div>`;
  if (!cloudEnabled()) { view.innerHTML = shell('<p>Online accounts are not set up for this copy of Spark Lab.</p>'); return () => {}; }
  if (!cloudReady()) { view.innerHTML = shell('<p class="muted">Checking sign-in…</p>'); return () => {}; }
  if (!me) {
    view.innerHTML = shell(`${ohmieTip('<p>Parents: sign in with your Google account to see your learner\'s progress.</p>')}<button type="button" class="btn primary fam-signin">Sign in with Google</button>`);
    return bindOnce(view, 'click', async (e) => {
      if (!e.target.closest('.fam-signin')) return;
      try { await signIn(); } catch (err) { toast(esc(err.message), { kind: 'bad', ms: 5000 }); }
    });
  }
  if (cachedFor !== me.uid) { learners = null; picked = null; loadError = ''; cachedFor = me.uid; }
  if (!me.isParent) {
    view.innerHTML = shell(`<p>This page is for parent accounts. You are signed in as ${esc(me.email)}.</p><a class="btn ghost" href="#/home">Home</a>`);
    return () => {};
  }

  const render = () => {
    if (learners === null && !loadError) { view.innerHTML = shell('<p class="muted">Loading your learners…</p>'); return; }
    if (loadError) {
      view.innerHTML = shell(`<div class="card"><p>${esc(loadError)}</p><button type="button" class="btn primary small refresh">Try again</button></div>`);
      return;
    }
    if (!learners.length) {
      view.innerHTML = shell(`${ohmieTip(`<p>No learners are sharing with you yet. On your child's device, sign in to Spark Lab with their Google account, open <b>Settings → Account</b> and tick <b>${esc(me.email)}</b> under “Share my progress with”.</p>`, 'think')}
        <button type="button" class="btn primary small refresh">Refresh</button>`);
      return;
    }
    const L = learners.find((x) => x.uid === picked) || learners[0];
    picked = L.uid;
    view.innerHTML = shell(`
      ${learners.length > 1 ? `<div class="fam-pick" role="tablist">${learners.map((x) => `<button type="button" class="chip ${x.uid === L.uid ? 'on' : ''}" data-pick="${x.uid}" role="tab" aria-selected="${x.uid === L.uid}">${esc(x.name || x.email)}</button>`).join('')}</div>` : ''}
      ${learnerHTML(L)}`);
  };

  const load = async () => {
    learners = null;
    loadError = '';
    render();
    try {
      learners = (await listMyLearners()).map((x) => ({ ...x, state: normalise(x.state) }));
    } catch (err) {
      console.warn(err);
      learners = null;
      loadError = 'Could not load learners. Check your internet connection and try again.';
    }
    render();
  };

  /**
   * Save the family document for the picked learner and redraw.
   * @param {object} L Learner record.
   * @param {string} done Toast text on success.
   * @returns {Promise<void>}
   */
  const save = async (L, done) => {
    try {
      await saveFamily(L.uid, L.family);
      toast(done, { kind: 'good' });
    } catch (err) {
      console.warn(err);
      toast('Could not save. Check your internet connection and try again.', { kind: 'bad', ms: 5000 });
    }
    render();
  };

  const onClick = async (ev) => {
    const t = ev.target;
    if (t.closest('.refresh')) { load(); return; }
    const pk = t.closest('[data-pick]');
    if (pk) { picked = pk.dataset.pick; render(); return; }
    const L = learners?.find((x) => x.uid === picked);
    if (!L) return;
    if (t.closest('.add-rw')) {
      const res = await rewardDialog();
      if (!res) return;
      L.family.rewards = [...(L.family.rewards || []), { id: uid('rw_'), title: res.title.trim(), cond: res.cond, created: Date.now(), by: me.name.split(' ')[0] || me.email }];
      await save(L, 'Reward added. It shows on their Reward Board.');
      return;
    }
    const cl = t.closest('.claim');
    if (cl) {
      const r = L.family.rewards.find((x) => x.id === cl.dataset.id);
      if (!r) return;
      r.claimedAt = Date.now();
      r.claimedBy = me.name.split(' ')[0] || me.email;
      confetti();
      await save(L, 'Marked as given. Well earned!');
      return;
    }
    const del = t.closest('.del');
    if (del) {
      if (!await confirmBox('Delete reward?', 'This reward will be removed from their Reward Board.', 'Delete', true)) return;
      L.family.rewards = L.family.rewards.filter((x) => x.id !== del.dataset.id);
      await save(L, 'Reward deleted.');
      return;
    }
    const an = t.closest('[data-answer]');
    if (an) {
      const q = L.state.questions.find((x) => x.id === an.dataset.answer);
      const prev = L.family.answers?.[q.id];
      const text = await openModal({
        title: 'Answer a question',
        body: `<p><b>${esc(q.text)}</b></p>${q.context ? `<blockquote class="quote small">${esc(q.context)}</blockquote>` : ''}
          <label class="field">Your answer<textarea id="fa" rows="5" maxlength="2000">${esc(prev?.text || '')}</textarea></label>
          <p class="muted small">It appears under the question in their Notes.</p>`,
        actions: [{ label: 'Cancel', value: null }, { label: 'Send answer', kind: 'primary', value: (el) => $('#fa', el).value.trim() }],
      });
      if (text === null) return;
      L.family.answers = { ...(L.family.answers || {}) };
      if (text) L.family.answers[q.id] = { text, by: me.name.split(' ')[0] || 'Parent', at: Date.now() };
      else delete L.family.answers[q.id];
      await save(L, text ? 'Answer sent.' : 'Answer removed.');
    }
  };
  const unbind = bindOnce(view, 'click', onClick);
  if (learners === null || loadError) load(); else render();
  window.scrollTo(0, 0);
  return unbind;
}

/**
 * One learner's dashboard.
 * @param {object} L Learner record from listMyLearners (state normalised).
 * @returns {string} HTML.
 */
function learnerHTML(L) {
  const s = L.state;
  const lv = levelInfo(s.xp.total);
  const today = dayKey();
  const chapters = readyChapters();
  const totalLessons = chapters.reduce((n, c) => n + (c.lessons?.length || 0), 0);
  const done = Object.values(s.lessons).filter((l) => l.done).length;
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13));
  const goal = s.profile.dailyGoal || 50;
  const max = Math.max(goal, ...days.map((d) => s.xp.byDay[d] || 0));
  const recent = Object.entries(s.lessons).filter(([, r]) => r.done && r.at).sort((a, b) => b[1].at - a[1].at).slice(0, 5);
  const qs = s.questions.slice().sort((a, b) => b.at - a.at);
  const open = qs.filter((q) => !L.family.answers?.[q.id] && !q.answered).length;
  const rewards = rewardList(s, L.family, true);
  return `
    <div class="fam-head">${avatar({ name: L.name, email: L.email, photo: L.photo }, 52)}
      <div><h2>${esc(s.profile.name || L.name || 'Learner')}</h2><span class="muted small">${esc(L.email)} · last synced ${ago(L.updated)}</span></div>
      <button type="button" class="btn ghost small refresh">Refresh</button></div>

    <section class="stats-grid">
      <div class="statbox"><b>${s.xp.total} XP</b><span>Level ${lv.index + 1}: ${esc(lv.name)}</span></div>
      <div class="statbox"><b>${s.xp.byDay[today] || 0} / ${goal}</b><span>XP today / daily goal</span></div>
      <div class="statbox"><b>🔥 ${streakOf(s)}</b><span>day streak (best ${s.streak.best})</span></div>
      <div class="statbox"><b>${done} / ${totalLessons}</b><span>lessons done</span></div>
      <div class="statbox"><b>${Object.keys(s.badges).length}</b><span>badges earned</span></div>
      <div class="statbox"><b>${Object.keys(s.mistakes).length}</b><span>questions in the mistake book</span></div>
    </section>

    <section class="fam-sec xp-chart"><h2>XP, last 14 days</h2>
      <div class="bars" role="img" aria-label="XP earned each day for the last 14 days">
        ${days.map((d) => { const v = s.xp.byDay[d] || 0; return `<div class="bcol ${s.goalDays[d] ? 'goal' : ''} ${d === today ? 'today' : ''}" title="${shortDate(d)}: ${v} XP"><span class="bval">${v || ''}</span><span class="bfill" style="height:${Math.round((v / max) * 110)}px"></span><span class="blbl">${d.slice(8)}</span></div>`; }).join('')}
        <div class="goal-line" style="bottom:${22 + Math.round((goal / max) * 110)}px"><span>goal</span></div>
      </div></section>

    <section class="fam-sec"><h2>Chapters</h2>
      <ul class="ch-rows">${chapters.map((c) => {
    const n = c.lessons?.length || 0;
    const d = (c.lessons || []).filter((l) => s.lessons[l.id]?.done).length;
    const best = s.tests[c.id]?.best;
    return `<li><b>Chapter ${c.num}: ${esc(c.title)}</b>
          <span class="tags">${best ? `<span class="grade-tag g-${best.grade}">Test: ${GRADE[best.grade]}</span>` : '<span class="muted small">Test not tried</span>'}</span>
          <span class="bar"><span style="width:${n ? Math.round((d / n) * 100) : 0}%"></span></span>
          <small class="muted">${d} of ${n} lessons</small></li>`;
  }).join('')}</ul>
      ${recent.length ? `<p class="small"><b>Recently finished:</b> ${recent.map(([id, r]) => `${esc(id)} ${esc(getLesson(id)?.lesson.title || '')} (${shortDate(r.at)})`).join(' · ')}</p>` : ''}
    </section>

    <section class="fam-sec"><h2>Questions <small class="muted">${open ? `${open} waiting for an answer` : ''}</small></h2>
      ${qs.length ? `<ul class="q-list">${qs.map((q) => {
    const pa = L.family.answers?.[q.id];
    return `<li class="q-card ${pa || q.answered ? 'answered' : ''}"><p class="q-text">${esc(q.text)}</p>
          ${q.context ? `<blockquote class="quote small">${esc(q.context)}</blockquote>` : ''}
          ${q.answer ? `<p class="q-answer"><b>Their own answer:</b> ${esc(q.answer)}</p>` : ''}
          ${pa ? `<p class="q-answer from-parent"><b>${esc(pa.by)} answered:</b> ${esc(pa.text)}</p>` : ''}
          <div class="hl-meta"><span>${q.lesson ? esc(`${q.lesson} ${getLesson(q.lesson)?.lesson.title || ''}`) : ''}</span><span>${shortDate(q.at)}</span>
          <button type="button" class="linkbtn" data-answer="${q.id}">${pa ? 'Edit answer' : 'Answer'}</button></div></li>`;
  }).join('')}</ul>` : '<p class="muted">No saved questions yet. When they tap <b>Ask</b> in a lesson, the question shows up here.</p>'}
    </section>

    <section class="fam-sec"><h2>Rewards <button type="button" class="btn primary small add-rw">Add a reward</button></h2>
      ${rewards.length ? rewardCards(rewards, s, true) : '<p class="muted">No rewards yet. Add one, such as a movie night for finishing a chapter or a treat for Excellence in a chapter test. It unlocks by itself when the goal is reached.</p>'}
    </section>`;
}
