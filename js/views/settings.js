/**
 * settings.js — profile, daily goal, theme, text size, backup / transfer, install, reset,
 * plus the first-run welcome dialog.
 */
import { $, esc, downloadText, bindOnce } from '../utils/dom.js';
import { getState, commit, exportJSON, importJSON, makeTransferCode, readTransferCode, resetAll } from '../core/store.js';
import { checkAchievements } from '../core/achievements.js';
import { DAILY_GOAL_OPTIONS, APP_VERSION, PARENT_EMAILS } from '../config.js';
import { openModal, toast, confirmBox, ohmieTip, updateTopbar, avatar } from '../ui/shell.js';
import { shortDate } from '../utils/date.js';
import { cloudEnabled, cloudReady, currentUser, sharedParents, setSharedParents, signIn, signOutUser, lastCloudSave } from '../core/cloud.js';

const G_LOGO = '<svg class="g-logo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.2C12.4 13.7 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.8c4.3-4 6.9-9.9 6.9-17.2z"/><path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.2C1 16.6 0 20.2 0 24s1 7.4 2.6 10.8l7.9-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.8c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.2-13.5-10l-7.9 6.2C6.6 42.6 14.6 48 24 48z"/></svg>';

/**
 * Sign in from a button and report the result.
 * @returns {Promise<boolean>} True when signed in.
 */
export async function signInFlow() {
  try {
    const ok = await signIn();
    if (ok) toast('Signed in. Your progress now saves to your Google account.', { kind: 'good', ms: 4000 });
    return ok;
  } catch (err) {
    toast(esc(err.message || 'Sign-in failed. Try again.'), { kind: 'bad', ms: 5000 });
    return false;
  }
}

/**
 * Account card (Google sign-in, sharing with parents, sign out).
 * @returns {string} HTML ('' when online accounts are not configured).
 */
function accountHTML() {
  if (!cloudEnabled()) return '';
  const u = currentUser();
  if (!cloudReady()) return '<section class="card set-sec acct-sec"><h2>Account</h2><p class="muted">Checking sign-in…</p></section>';
  if (!u) {
    return `<section class="card set-sec acct-sec"><h2>Account</h2>
      <p>Sign in with Google to save your progress online. It then follows you between your Chromebook and phone, and your parents can see how you are going and set rewards.</p>
      <button type="button" class="btn primary sign-in">${G_LOGO} Sign in with Google</button>
      <p class="muted small">Without signing in, progress stays in this browser only.</p></section>`;
  }
  const shared = sharedParents();
  const saved = lastCloudSave();
  return `<section class="card set-sec acct-sec"><h2>Account</h2>
    <div class="acct-row">${avatar(u, 48)}<div><b>${esc(u.name || u.email)}</b><span class="muted small">${esc(u.email)}</span></div></div>
    <p class="small">Your progress saves to your Google account automatically.${saved ? ` Last saved at ${new Date(saved).toLocaleTimeString('en-NZ', { hour: 'numeric', minute: '2-digit' })}.` : ''}</p>
    ${u.isParent ? '<p>This is a parent account. Open the <a href="#/family">Family page</a> to see progress, answer questions and set rewards.</p>' : `
    <fieldset class="share"><legend>Share my progress with</legend>
      ${PARENT_EMAILS.map((e) => `<label class="check"><input type="checkbox" class="share-box" value="${e}" ${shared.includes(e) ? 'checked' : ''}> ${e}</label>`).join('')}
      <p class="muted small">Parents you share with can see your progress, test results and saved questions, answer your questions and set rewards. They cannot change your progress.</p>
    </fieldset>`}
    <button type="button" class="btn ghost small sign-out">Sign out</button></section>`;
}

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
    ${accountHTML()}
    <section class="card set-sec"><h2>You</h2>
      <label class="field">Name<input id="nm" maxlength="30" value="${esc(p.name)}" placeholder="Your first name"></label>
      <label class="field">Daily XP goal<select id="goal">${DAILY_GOAL_OPTIONS.map((g) => `<option value="${g}" ${g === p.dailyGoal ? 'selected' : ''}>${g} XP — ${{ 30: 'light', 50: 'steady', 80: 'keen', 120: 'exam push' }[g]}</option>`).join('')}</select></label>
    </section>
    <section class="card set-sec"><h2>Look</h2>
      <div class="field">Theme<div class="seg" role="radiogroup">${['auto', 'light', 'dark'].map((t) => `<button type="button" class="seg-btn ${p.theme === t ? 'on' : ''}" data-theme="${t}" role="radio" aria-checked="${p.theme === t}">${{ auto: 'Match device', light: 'Light', dark: 'Dark' }[t]}</button>`).join('')}</div></div>
      <div class="field">Text size<div class="seg" role="radiogroup">${[[0.94, 'Smaller'], [1, 'Normal'], [1.1, 'Larger'], [1.22, 'Largest']].map(([v, l]) => `<button type="button" class="seg-btn ${Number(p.textScale) === v ? 'on' : ''}" data-scale="${v}" role="radio" aria-checked="${Number(p.textScale) === v}">${l}</button>`).join('')}</div></div>
    </section>
    <section class="card set-sec"><h2>Backup and moving devices</h2>
      <p>${currentUser() ? 'Your progress also saves to your Google account. A backup file is still a good extra copy.' : 'Your progress is saved in this browser only. Back it up regularly, and use a transfer code to move between your Chromebook and phone — or sign in with Google above to do this automatically.'}</p>
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
    if (t.closest('.sign-in')) { await signInFlow(); return; }
    if (t.closest('.sign-out')) {
      if (!await confirmBox('Sign out?', '<p>Your progress is saved to your Google account, then removed from this device. Sign in again to get it back.</p>', 'Sign out')) return;
      try { await signOutUser(); applyPrefs(); toast('Signed out.'); settingsView(view); }
      catch (err) { toast(esc(err.message), { kind: 'bad', ms: 6000 }); }
      return;
    }
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
  view.querySelectorAll('.share-box').forEach((box) => box.addEventListener('change', async () => {
    const emails = [...view.querySelectorAll('.share-box:checked')].map((b) => b.value);
    if (await setSharedParents(emails)) toast(emails.length ? `Sharing with ${emails.map(esc).join(' and ')}.` : 'Sharing turned off.', { kind: 'good', ms: 3500 });
    else toast('Could not update sharing. Check your internet connection.', { kind: 'bad', ms: 5000 });
  }));
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
  const cloud = cloudEnabled() && !currentUser();
  const read = (el, signin) => ({ name: $('#w-name', el).value.trim(), goal: Number($('#w-goal', el).value), signin });
  const res = await openModal({
    title: 'Welcome to Spark Lab',
    cls: 'welcome',
    body: `${ohmieTip('<p>Hi! I\'m Ohmie. I\'ll pop up with tips as you learn electricity — from Year 10 all the way to engineering.</p>')}
      <label class="field">What should I call you?<input id="w-name" maxlength="30" placeholder="First name"></label>
      <label class="field">Daily goal<select id="w-goal">${DAILY_GOAL_OPTIONS.map((g) => `<option value="${g}" ${g === 50 ? 'selected' : ''}>${g} XP a day — ${{ 30: 'about 10 minutes', 50: 'about 15 minutes', 80: 'about 25 minutes', 120: 'about 40 minutes' }[g]}</option>`).join('')}</select></label>
      <ul class="welcome-list"><li>Finish lessons to light up your course circuit.</li><li>Select any lesson text to highlight it, add a note or save a question.</li><li>Earn XP, badges and real rewards set by your parent.</li></ul>
      ${cloud ? '<p class="small">Sign in with Google to keep your progress on both your Chromebook and phone, and to share it with your parents.</p>' : ''}`,
    actions: cloud
      ? [{ label: 'Start without signing in', value: (el) => read(el, false) }, { label: `${G_LOGO} Sign in with Google`, kind: 'primary', value: (el) => read(el, true) }]
      : [{ label: "Let's start", kind: 'primary', value: (el) => read(el, false) }],
  });
  s.profile.onboarded = true;
  if (res) { if (res.name) s.profile.name = res.name; s.profile.dailyGoal = res.goal; }
  commit('profile');
  if (res?.signin) await signInFlow();
}
