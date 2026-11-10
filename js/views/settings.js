/**
 * settings.js — profile, daily goal, theme, text size, backup / transfer, install, reset,
 * plus the first-run welcome dialog.
 */
import { $, esc, downloadText, bindOnce } from '../utils/dom.js';
import { getState, commit, exportJSON, importJSON, makeTransferCode, readTransferCode, resetAll } from '../core/store.js';
import { checkAchievements } from '../core/achievements.js';
import { DAILY_GOAL_OPTIONS, APP_VERSION } from '../config.js';
import { openModal, toast, confirmBox, ohmieTip, updateTopbar } from '../ui/shell.js';
import { shortDate } from '../utils/date.js';

let installPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installPrompt = e; });

/**
 * Apply theme and text size from the profile.
 * @returns {void}
 */
export function applyPrefs() {
  const p = getState().profile;
  const root = document.documentElement;
  if (p.theme === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', p.theme);
  root.style.setProperty('--text-scale', String(p.textScale || 1));
  const dark = p.theme === 'dark' || (p.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#121a2e' : '#f5f8fd');
}

/**
 * Mark that a backup was made.
 * @returns {void}
 */
function noteBackup() {
  getState().lastBackup = Date.now();
  commit('backup');
  checkAchievements();
}

/**
 * Settings page.
 * @param {Element} view Main view.
 * @returns {() => void} Cleanup.
 */
export function settingsView(view) {
  const s = getState();
  const p = s.profile;
  view.innerHTML = `
  <div class="page narrow settings">
    <header class="page-head"><h1>Settings</h1></header>
    <section class="card set-sec"><h2>You</h2>
      <label class="field">Name<input id="nm" maxlength="30" value="${esc(p.name)}" placeholder="Your first name"></label>
      <label class="field">Daily XP goal<select id="goal">${DAILY_GOAL_OPTIONS.map((g) => `<option value="${g}" ${g === p.dailyGoal ? 'selected' : ''}>${g} XP — ${{ 30: 'light', 50: 'steady', 80: 'keen', 120: 'exam push' }[g]}</option>`).join('')}</select></label>
    </section>
    <section class="card set-sec"><h2>Look</h2>
      <div class="field">Theme<div class="seg" role="radiogroup">${['auto', 'light', 'dark'].map((t) => `<button type="button" class="seg-btn ${p.theme === t ? 'on' : ''}" data-theme="${t}" role="radio" aria-checked="${p.theme === t}">${{ auto: 'Match device', light: 'Light', dark: 'Dark' }[t]}</button>`).join('')}</div></div>
      <div class="field">Text size<div class="seg" role="radiogroup">${[[0.94, 'Smaller'], [1, 'Normal'], [1.1, 'Larger'], [1.22, 'Largest']].map(([v, l]) => `<button type="button" class="seg-btn ${Number(p.textScale) === v ? 'on' : ''}" data-scale="${v}" role="radio" aria-checked="${Number(p.textScale) === v}">${l}</button>`).join('')}</div></div>
    </section>
    <section class="card set-sec"><h2>Backup and moving devices</h2>
      <p>Your progress is saved in this browser only. Back it up regularly, and use a transfer code to move between your Chromebook and phone.</p>
      <p class="muted small">Last backup: ${s.lastBackup ? shortDate(s.lastBackup) : 'never'}</p>
      <div class="row wrap">
        <button type="button" class="btn primary small dl">Download backup file</button>
        <label class="btn ghost small filebtn">Restore from file<input type="file" accept="application/json,.json" class="restore" hidden></label>
        <button type="button" class="btn ghost small mk-code">Copy transfer code</button>
        <button type="button" class="btn ghost small use-code">Paste transfer code</button>
      </div>
    </section>
    <section class="card set-sec"><h2>Install</h2>
      <p>Install Spark Lab like an app. It then opens from your home screen or shelf and works offline.</p>
      <button type="button" class="btn ghost small install">Install app</button>
      <p class="muted small install-help">On Android Chrome: menu ⋮ → <i>Add to Home screen</i>. On a Chromebook: the install icon in the address bar, or menu ⋮ → <i>Cast, save and share</i> → <i>Install page as app</i>.</p>
    </section>
    <section class="card set-sec danger-zone"><h2>Start over</h2><p>Erase all progress, notes and rewards on this device.</p><button type="button" class="btn danger small reset">Erase everything</button></section>
    <p class="muted small center">Spark Lab ${APP_VERSION}</p>
  </div>`;

  $('#nm', view).addEventListener('change', (e) => { p.name = e.target.value.trim(); commit('profile'); });
  $('#goal', view).addEventListener('change', (e) => { p.dailyGoal = Number(e.target.value); commit('profile'); updateTopbar(); });

  const onClick = async (ev) => {
    const t = ev.target;
    const th = t.closest('[data-theme]');
    if (th && th.classList.contains('seg-btn')) { p.theme = th.dataset.theme; commit('profile'); applyPrefs(); settingsView(view); return; }
    const sc = t.closest('[data-scale]');
    if (sc) { p.textScale = Number(sc.dataset.scale); commit('profile'); applyPrefs(); settingsView(view); return; }
    if (t.closest('.dl')) {
      noteBackup();
      downloadText(`spark-lab-backup-${new Date().toISOString().slice(0, 10)}.json`, exportJSON(), 'application/json');
      toast('Backup downloaded. Keep the file somewhere safe, such as Google Drive.', { kind: 'good', ms: 4000 });
      return;
    }
    if (t.closest('.mk-code')) {
      noteBackup();
      const code = await makeTransferCode();
      await openModal({
        title: 'Transfer code', body: `<p>Copy this code, send it to your other device (for example in an email to yourself), then choose <b>Paste transfer code</b> there.</p><textarea class="code-box" rows="6" readonly>${code}</textarea>`,
        onMount: (el) => { const ta = $('.code-box', el); ta.select(); navigator.clipboard?.writeText(code).then(() => toast('Code copied.', { kind: 'good' })).catch(() => {}); },
        actions: [{ label: 'Done', kind: 'primary', value: null }],
      });
      return;
    }
    if (t.closest('.use-code')) {
      const code = await openModal({ title: 'Paste transfer code', body: '<p>This replaces the progress on this device with the progress in the code.</p><textarea id="tc" rows="6" placeholder="SPARK1.…"></textarea>', actions: [{ label: 'Cancel', value: null }, { label: 'Load progress', kind: 'primary', value: (el) => $('#tc', el).value }] });
      if (!code) return;
      try { await readTransferCode(code); applyPrefs(); toast('Progress loaded.', { kind: 'good' }); location.hash = '#/home'; }
      catch (err) { toast(esc(err.message), { kind: 'bad', ms: 5000 }); }
      return;
    }
    if (t.closest('.install')) {
      if (installPrompt) { installPrompt.prompt(); installPrompt = null; }
      else toast('Use your browser menu to install — see the steps below the button.', { ms: 4000 });
      return;
    }
    if (t.closest('.reset')) {
      if (!await confirmBox('Erase everything?', '<p>All XP, badges, notes, highlights and rewards on this device will be deleted. Download a backup first if you might want them back.</p>', 'Erase everything', true)) return;
      resetAll(); applyPrefs(); toast('Everything has been reset.'); location.hash = '#/home';
    }
  };
  const unbind = bindOnce(view, 'click', onClick);
  $('.restore', view).addEventListener('change', async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!await confirmBox('Restore backup?', 'This replaces the progress on this device with the backup file.', 'Restore')) return;
    try { importJSON(await f.text()); applyPrefs(); toast('Backup restored.', { kind: 'good' }); location.hash = '#/home'; }
    catch (err) { toast(esc(err.message), { kind: 'bad', ms: 5000 }); }
  });
  window.scrollTo(0, 0);
  return unbind;
}

/**
 * First-run welcome: name and daily goal.
 * @returns {Promise<void>}
 */
export async function welcome() {
  const s = getState();
  if (s.profile.onboarded) return;
  const res = await openModal({
    title: 'Welcome to Spark Lab',
    cls: 'welcome',
    body: `${ohmieTip('<p>Hi! I\'m Ohmie. I\'ll pop up with tips as you learn electricity — from Year 10 all the way to engineering.</p>')}
      <label class="field">What should I call you?<input id="w-name" maxlength="30" placeholder="First name"></label>
      <label class="field">Daily goal<select id="w-goal">${DAILY_GOAL_OPTIONS.map((g) => `<option value="${g}" ${g === 50 ? 'selected' : ''}>${g} XP a day — ${{ 30: 'about 10 minutes', 50: 'about 15 minutes', 80: 'about 25 minutes', 120: 'about 40 minutes' }[g]}</option>`).join('')}</select></label>
      <ul class="welcome-list"><li>Finish lessons to light up your course circuit.</li><li>Select any lesson text to highlight it, add a note or save a question.</li><li>Earn XP, badges and real rewards set by your parent.</li></ul>`,
    actions: [{ label: "Let's start", kind: 'primary', value: (el) => ({ name: $('#w-name', el).value.trim(), goal: Number($('#w-goal', el).value) }) }],
  });
  s.profile.onboarded = true;
  if (res) { s.profile.name = res.name; s.profile.dailyGoal = res.goal; }
  commit('profile');
}
