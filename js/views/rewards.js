/**
 * rewards.js — Reward Board. Learners see goals and progress; a parent (with PIN) adds
 * rewards and confirms hand-overs.
 */
import { $, esc, bindOnce } from '../utils/dom.js';
import { getState } from '../core/store.js';
import { readyChapters } from '../core/content.js';
import { hasPin, setPin, verifyPin, clearPin, addReward, removeReward, claimReward, condProgress, condText, evaluateRewards, COND_TYPES } from '../core/rewards.js';
import { ohmieTip, openModal, toast, confirmBox, confetti } from '../ui/shell.js';
import { shortDate } from '../utils/date.js';

let parentUntil = 0;

/**
 * Whether parent mode is unlocked (lasts 10 minutes).
 * @returns {boolean} True when unlocked.
 */
function parentMode() {
  return Date.now() < parentUntil;
}

/**
 * Ask for the PIN (or create one) and unlock parent mode.
 * @returns {Promise<boolean>} True when unlocked.
 */
async function unlock() {
  if (!hasPin()) {
    const pin = await openModal({
      title: 'Set a parent PIN', body: '<p>Choose a 4–8 digit PIN. It stops rewards being added or claimed without a parent. (It is a simple lock for a shared device, not bank-level security.)</p><label class="field">New PIN<input id="p1" type="password" inputmode="numeric" autocomplete="new-password" maxlength="8"></label><label class="field">Type it again<input id="p2" type="password" inputmode="numeric" autocomplete="new-password" maxlength="8"></label><p class="form-err" hidden></p>',
      actions: [{ label: 'Cancel', value: null }, {
        label: 'Save PIN', kind: 'primary',
        validate: (el) => { const a = $('#p1', el).value; const b = $('#p2', el).value; const e = $('.form-err', el); if (!/^\d{4,8}$/.test(a)) { e.hidden = false; e.textContent = 'Use 4 to 8 digits.'; return false; } if (a !== b) { e.hidden = false; e.textContent = 'The two PINs do not match.'; return false; } return true; },
        value: (el) => $('#p1', el).value,
      }],
    });
    if (!pin) return false;
    await setPin(pin);
    toast('Parent PIN saved.', { kind: 'good' });
    parentUntil = Date.now() + 10 * 60 * 1000;
    return true;
  }
  const pin = await openModal({
    title: 'Parent PIN', body: '<label class="field">Enter the parent PIN<input id="pin" type="password" inputmode="numeric" autocomplete="current-password" maxlength="8"></label>',
    actions: [{ label: 'Cancel', value: null }, { label: 'Unlock', kind: 'primary', value: (el) => $('#pin', el).value }],
  });
  if (pin == null) return false;
  if (await verifyPin(pin)) { parentUntil = Date.now() + 10 * 60 * 1000; return true; }
  toast('That PIN is not right.', { kind: 'bad' });
  return false;
}

/**
 * Reward Board page.
 * @param {Element} view Main view.
 * @returns {() => void} Cleanup.
 */
export function rewardsView(view) {
  evaluateRewards();
  const items = getState().rewards.items;
  const pm = parentMode();
  const order = { unlocked: 0, locked: 1, claimed: 2 };
  const sorted = items.slice().sort((a, b) => order[a.status] - order[b.status]);
  view.innerHTML = `
  <div class="page narrow rewards">
    <header class="page-head"><h1>Reward Board</h1>
      <p class="lede">Real-world rewards set by a parent. Reach the goal, and the reward unlocks automatically.</p></header>
    <div class="row between parent-bar">
      ${pm ? '<span class="pm-on">Parent mode is on for 10 minutes</span>' : '<span class="muted">Parents: unlock to add or hand over rewards.</span>'}
      ${pm ? '<span class="row"><button type="button" class="btn primary small add-rw">Add a reward</button><button type="button" class="btn ghost small lock">Lock</button></span>' : '<button type="button" class="btn ghost small unlock">Parent mode</button>'}
    </div>
    ${sorted.length ? `<ul class="rw-list">${sorted.map((r) => {
    const p = condProgress(r.cond);
    return `<li class="rw-card ${r.status}">
        <span class="rw-ico">${r.status === 'claimed' ? '✅' : r.status === 'unlocked' ? '🎁' : '🔒'}</span>
        <div class="rw-main"><b>${esc(r.title)}</b><span class="rw-cond">${esc(condText(r.cond))}</span>
          ${r.status === 'locked' ? `<span class="bar"><span style="width:${Math.round(p.pct * 100)}%"></span></span><small>${esc(p.text)}</small>` : ''}
          ${r.status === 'unlocked' ? `<small>Unlocked ${shortDate(r.unlockedAt)} — waiting for a parent to hand it over.</small>` : ''}
          ${r.status === 'claimed' ? `<small>Claimed ${shortDate(r.claimedAt)}</small>` : ''}</div>
        ${pm ? `<div class="rw-actions">${r.status === 'unlocked' ? `<button type="button" class="btn primary small claim" data-id="${r.id}">Mark as given</button>` : ''}<button type="button" class="linkbtn danger del" data-id="${r.id}">Delete</button></div>` : ''}
      </li>`;
  }).join('')}</ul>`
    : ohmieTip('<p>No rewards yet. Ask a parent to open <b>Parent mode</b> and add one — like a movie night when you finish Chapter 1, or a treat for Excellence in a chapter test.</p>')}
    ${pm && hasPin() ? '<p class="muted small"><button type="button" class="linkbtn change-pin">Change PIN</button> · <button type="button" class="linkbtn remove-pin">Remove PIN</button></p>' : ''}
  </div>`;

  const onClick = async (ev) => {
    const t = ev.target;
    if (t.closest('.unlock')) { if (await unlock()) rewardsView(view); return; }
    if (t.closest('.lock')) { parentUntil = 0; rewardsView(view); return; }
    if (t.closest('.add-rw')) { await addDialog(); rewardsView(view); return; }
    const cl = t.closest('.claim');
    if (cl) { claimReward(cl.dataset.id); confetti(); toast('Reward marked as given. Well earned!', { kind: 'good' }); rewardsView(view); return; }
    const del = t.closest('.del');
    if (del && await confirmBox('Delete reward?', 'This reward will be removed from the board.', 'Delete', true)) { removeReward(del.dataset.id); rewardsView(view); return; }
    if (t.closest('.change-pin')) { clearPin(); if (await unlock()) rewardsView(view); return; }
    if (t.closest('.remove-pin') && await confirmBox('Remove PIN?', 'Anyone using this device will be able to add or claim rewards.', 'Remove', true)) { clearPin(); rewardsView(view); }
  };
  const unbind = bindOnce(view, 'click', onClick);
  window.scrollTo(0, 0);
  return unbind;
}

/**
 * Dialog to add a reward.
 * @returns {Promise<void>}
 */
async function addDialog() {
  const chOpts = readyChapters().concat().map((c) => `<option value="${c.id}">Chapter ${c.num}: ${esc(c.title)}</option>`).join('');
  const res = await openModal({
    title: 'Add a reward',
    body: `<label class="field">Reward<input id="rw-t" maxlength="80" placeholder="e.g. Movie night of your choice"></label>
      <label class="field">Goal<select id="rw-type">${Object.entries(COND_TYPES).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}</select></label>
      <label class="field rw-target">Target<input id="rw-n" type="number" min="1" value="500"></label>
      <label class="field rw-ch" hidden>Chapter<select id="rw-c">${chOpts}</select></label>
      <label class="field rw-g" hidden>Grade<select id="rw-g"><option value="A">Achieved or better</option><option value="M">Merit or better</option><option value="E" selected>Excellence</option></select></label>
      <p class="muted small">Ideas: 500 XP, a 7-day streak, finishing a chapter, or Excellence in a chapter test.</p><p class="form-err" hidden></p>`,
    onMount: (el) => {
      const type = $('#rw-type', el);
      const sync = () => {
        const v = type.value;
        $('.rw-target', el).hidden = v === 'chapter' || v === 'test';
        $('.rw-ch', el).hidden = !(v === 'chapter' || v === 'test');
        $('.rw-g', el).hidden = v !== 'test';
        const d = { xp: 500, lessons: 10, streak: 7, badges: 10 }[v];
        if (d) $('#rw-n', el).value = d;
      };
      type.addEventListener('change', sync);
      sync();
    },
    actions: [{ label: 'Cancel', value: null }, {
      label: 'Add reward', kind: 'primary',
      validate: (el) => { const e = $('.form-err', el); if (!$('#rw-t', el).value.trim()) { e.hidden = false; e.textContent = 'Give the reward a name.'; return false; } return true; },
      value: (el) => {
        const type = $('#rw-type', el).value;
        const cond = { type };
        if (type === 'chapter' || type === 'test') cond.chapter = $('#rw-c', el).value;
        if (type === 'test') cond.grade = $('#rw-g', el).value;
        if (!['chapter', 'test'].includes(type)) cond.target = Math.max(1, Number($('#rw-n', el).value) || 1);
        return { title: $('#rw-t', el).value, cond };
      },
    }],
  });
  if (res) { addReward(res); toast('Reward added.', { kind: 'good' }); }
}
