/**
 * shell.js — app frame (top bar, navigation), toasts, modals, celebrations, confetti and the mascot.
 */
import { esc, $, $$, reducedMotion } from '../utils/dom.js';
import { getState, onEvent } from '../core/store.js';
import { levelInfo, liveStreak, todayXP } from '../core/xp.js';
import { current } from '../core/router.js';
import { cloudEnabled, cloudReady, currentUser, signIn } from '../core/cloud.js';

const NAV = [
  { href: '#/home', label: 'Home', icon: 'home', match: ['/home'] },
  { href: '#/learn', label: 'Learn', icon: 'learn', match: ['/learn', '/chapter', '/lesson', '/test'] },
  { href: '#/review', label: 'Review', icon: 'review', match: ['/review', '/flashcards', '/mistakes', '/practice', '/formulas', '/glossary'] },
  { href: '#/notes', label: 'Notes', icon: 'notes', match: ['/notes'] },
  { href: '#/me', label: 'Me', icon: 'me', match: ['/me', '/rewards', '/settings', '/family'] },
];

const ICONS = {
  home: '<path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
  learn: '<path d="M4 6.5C6.5 5 9.5 5 12 6.8 14.5 5 17.5 5 20 6.5V19c-2.5-1.5-5.5-1.5-8 .3-2.5-1.8-5.5-1.8-8-.3z"/><path d="M12 6.8v12.5"/>',
  review: '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4"/>',
  notes: '<path d="M6 4h9l3 3v13H6z"/><path d="M9 11h6M9 14.5h6"/><path d="M14.5 4v3.5H18"/>',
  me: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1.2-3.6 4-5.3 7-5.3s5.8 1.7 7 5.3"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
  family: '<circle cx="8.5" cy="8" r="2.8"/><circle cx="16" cy="9.5" r="2.2"/><path d="M3.5 19c.8-3.4 2.8-5.2 5-5.2s4.2 1.8 5 5.2M13.2 15.2c.8-1 1.8-1.5 2.8-1.5 2 0 3.6 1.6 4.2 4.6"/>',
  signin: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M10 8l4 4-4 4M14 12H4"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M12 9v11M4 13h16"/><path d="M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zm0 0c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>',
};

/**
 * Icon markup.
 * @param {string} name Icon key.
 * @returns {string} SVG markup.
 */
export function icon(name) {
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

/**
 * Ohmie, the study mascot (inspired by the doodles in the learner's own notes).
 * @param {string} [mood='happy'] 'happy' | 'wow' | 'think'.
 * @returns {string} SVG markup.
 */
export function mascot(mood = 'happy') {
  const mouth = mood === 'wow'
    ? '<ellipse cx="30" cy="38" rx="5" ry="6" class="m-mouth"/>'
    : mood === 'think'
      ? '<path d="M23 38h14" class="m-line"/>'
      : '<rect x="19" y="33" width="22" height="8" rx="3.5" class="m-mouth"/><path d="M23.5 33v8M28 33v8M32.5 33v8M37 33v8M19 37h22" class="m-teeth"/>';
  return `<svg class="ohmie-svg" viewBox="0 0 60 80" aria-hidden="true">` +
    `<path d="M30 3 25 12h6l-4 8" class="m-bolt"/>` +
    `<path d="M10 66V34a20 20 0 0 1 40 0v32" class="m-body"/>` +
    `<path d="M20 66v10M40 66v10" class="m-line"/>` +
    `<ellipse cx="23" cy="26" rx="2.6" ry="3.2" class="m-eye"/><ellipse cx="37" cy="26" rx="2.6" ry="3.2" class="m-eye"/>` +
    `${mouth}</svg>`;
}

/**
 * Speech-bubble tip from Ohmie.
 * @param {string} html Bubble content.
 * @param {string} [mood] Mascot mood.
 * @returns {string} HTML.
 */
export function ohmieTip(html, mood) {
  return `<div class="ohmie"><span class="ohmie-fig">${mascot(mood)}</span><div class="bubble">${html}</div></div>`;
}

/**
 * Render the app frame once.
 * @returns {void}
 */
export function renderShell() {
  const app = $('#app');
  app.innerHTML = `
    <a class="skip" href="#view">Skip to content</a>
    <header class="topbar">
      <a class="brand" href="#/home" aria-label="Spark Lab home"><span class="brand-bolt">${boltMark()}</span><span class="brand-name">Spark Lab</span></a>
      <div class="topstats">
        <a class="pill streak-pill" href="#/me" title="Study streak"><span class="flame">🔥</span><span class="streak-n">0</span></a>
        <a class="pill xp-pill" href="#/me" title="Level and XP"><span class="lvl-name"></span><span class="xpbar"><span class="xpfill"></span></span><span class="xp-n"></span></a>
      </div>
      <a class="iconbtn" href="#/search" aria-label="Search">${icon('search')}</a>
      <a class="iconbtn hide-sm" href="#/settings" aria-label="Settings">${icon('settings')}</a>
      <span class="acct-slot"></span>
    </header>
    <nav class="nav" aria-label="Main">
      ${NAV.map((n) => `<a href="${n.href}" data-nav="${n.href}">${icon(n.icon)}<span>${n.label}</span></a>`).join('')}
      <a href="#/rewards" class="rail-only" data-nav="#/rewards">${icon('gift')}<span>Rewards</span></a>
      <a href="#/family" class="rail-only parent-only" data-nav="#/family" hidden>${icon('family')}<span>Family</span></a>
      <a href="#/settings" class="rail-only" data-nav="#/settings">${icon('settings')}<span>Settings</span></a>
    </nav>
    <main id="view" tabindex="-1"></main>
    <div id="toasts" aria-live="polite"></div>
    <div id="modal-root"></div>
    <div id="hl-bar" class="hl-bar" hidden></div>`;
  updateTopbar();
  onEvent('change', updateTopbar);
  onEvent('auth', updateTopbar);
  $('.acct-slot').addEventListener('click', async (e) => {
    if (!e.target.closest('.acct-signin')) return;
    try {
      if (await signIn()) toast('Signed in. Your progress now saves to your Google account.', { kind: 'good', ms: 4000 });
    } catch (err) {
      toast(esc(err.message || 'Sign-in failed. Try again.'), { kind: 'bad', ms: 5000 });
    }
  });
}

/**
 * Round profile picture (or initial) for a signed-in user.
 * @param {{name?:string, email?:string, photo?:string}} u User.
 * @param {number} [size=32] Size in pixels.
 * @returns {string} HTML.
 */
export function avatar(u, size = 32) {
  const initial = esc((u?.name || u?.email || '?').trim().charAt(0).toUpperCase());
  const style = `width:${size}px;height:${size}px;font-size:${Math.round(size * 0.45)}px`;
  const img = u?.photo ? `<img src="${esc(u.photo)}" alt="" referrerpolicy="no-referrer" onerror="this.remove()">` : '';
  return `<span class="avatar" style="${style}"><span aria-hidden="true">${initial}</span>${img}</span>`;
}

/**
 * Render the account button in the top bar.
 * @returns {void}
 */
function renderAccount() {
  const slot = $('.acct-slot');
  if (!slot) return;
  const u = currentUser();
  const key = !cloudEnabled() ? 'off' : !cloudReady() ? 'wait' : u ? `in:${u.uid}:${u.photo}` : 'out';
  if (slot.dataset.key === key) return;
  slot.dataset.key = key;
  if (key === 'off' || key === 'wait') { slot.innerHTML = ''; return; }
  slot.innerHTML = u
    ? `<a class="acct-btn" href="#/settings" aria-label="Account: ${esc(u.email)}" title="${esc(u.email)}">${avatar(u, 30)}</a>`
    : `<button type="button" class="acct-btn acct-signin" aria-label="Sign in with Google">${icon('signin')}<span class="acct-txt">Sign in</span></button>`;
  $$('.parent-only').forEach((a) => { a.hidden = !u?.isParent; });
}

/**
 * Small lightning-bolt logo mark.
 * @returns {string} SVG markup.
 */
function boltMark() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 5 13.5h6L9.5 22 19 9.5h-6.2z"/></svg>';
}

/**
 * Refresh XP, level and streak in the top bar and highlight the active nav item.
 * @returns {void}
 */
export function updateTopbar() {
  const s = getState();
  const lv = levelInfo(s.xp.total);
  const set = (sel, v) => { const el = $(sel); if (el) el.textContent = v; };
  set('.lvl-name', lv.name);
  set('.xp-n', `${s.xp.total} XP`);
  set('.streak-n', String(liveStreak()));
  const fill = $('.xpfill');
  if (fill) fill.style.width = `${Math.round(lv.pct * 100)}%`;
  renderAccount();
  const path = current().path;
  $$('.nav a').forEach((a) => {
    const item = NAV.find((n) => n.href === a.dataset.nav);
    const active = item ? item.match.some((m) => path.startsWith(m)) : path.startsWith(a.dataset.nav.slice(1));
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

/**
 * Show a short toast.
 * @param {string} html Message HTML.
 * @param {object} [o] Options: kind ('xp'|'good'|'bad'|'info'), ms.
 * @returns {void}
 */
export function toast(html, o = {}) {
  const box = $('#toasts');
  if (!box) return;
  const el = document.createElement('div');
  el.className = `toast toast-${o.kind || 'info'}`;
  el.innerHTML = html;
  box.appendChild(el);
  while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, o.ms || 2600);
}

let modalOpen = false;
const modalQueue = [];

/**
 * Open a modal dialog. Dialogs queue if one is already open.
 * @param {object} o Options.
 * @param {string} o.title Title.
 * @param {string} o.body Body HTML.
 * @param {{label:string, value:*, kind?:string}[]} [o.actions] Buttons (default: Close).
 * @param {(el:Element, close:(v:any)=>void)=>void} [o.onMount] Called after rendering.
 * @param {string} [o.cls] Extra class.
 * @returns {Promise<*>} Resolves with the clicked action's value (null when dismissed).
 */
export function openModal(o) {
  return new Promise((resolve) => {
    modalQueue.push({ o, resolve });
    if (!modalOpen) nextModal();
  });
}

/** Show the next queued modal. */
function nextModal() {
  const item = modalQueue.shift();
  if (!item) { modalOpen = false; return; }
  modalOpen = true;
  const { o, resolve } = item;
  const root = $('#modal-root');
  const prevFocus = document.activeElement;
  const actions = o.actions || [{ label: 'Close', value: null, kind: 'primary' }];
  root.innerHTML = `<div class="backdrop"></div><div class="modal ${o.cls || ''}" role="dialog" aria-modal="true" aria-labelledby="m-title">
    <h2 id="m-title">${o.title}</h2><div class="m-body">${o.body}</div>
    <div class="m-actions">${actions.map((a, i) => `<button type="button" class="btn ${a.kind || 'ghost'}" data-a="${i}">${a.label}</button>`).join('')}</div></div>`;
  const close = (v) => {
    root.innerHTML = '';
    document.removeEventListener('keydown', onKey);
    if (prevFocus && prevFocus.focus) prevFocus.focus({ preventScroll: true });
    resolve(v);
    setTimeout(nextModal, 60);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(null); };
  document.addEventListener('keydown', onKey);
  $('.backdrop', root).addEventListener('click', () => close(null));
  $$('[data-a]', root).forEach((b) => b.addEventListener('click', () => {
    const a = actions[Number(b.dataset.a)];
    if (a.validate && !a.validate(root)) return;
    close(typeof a.value === 'function' ? a.value(root) : a.value);
  }));
  if (o.onMount) o.onMount(root, close);
  const focusEl = $('input, textarea, select', $('.m-body', root)) || $('.m-actions .primary', root);
  focusEl?.focus({ preventScroll: true });
}

/**
 * Yes/no confirmation.
 * @param {string} title Title.
 * @param {string} body Body HTML.
 * @param {string} [yes='Confirm'] Confirm button label.
 * @param {boolean} [danger=false] Red confirm button.
 * @returns {Promise<boolean>} True when confirmed.
 */
export async function confirmBox(title, body, yes = 'Confirm', danger = false) {
  const v = await openModal({ title, body, actions: [{ label: 'Cancel', value: false }, { label: yes, value: true, kind: danger ? 'danger' : 'primary' }] });
  return v === true;
}

/**
 * Confetti burst (skipped when reduced motion is on).
 * @returns {void}
 */
export function confetti() {
  if (reducedMotion()) return;
  const c = document.createElement('canvas');
  c.className = 'confetti';
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const colors = ['#c9f26b', '#ffb0c8', '#ffe066', '#3b5bdb', '#74c0fc'];
  const parts = Array.from({ length: 90 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 9 - 3, r: Math.random() * 6 + 3,
    c: colors[Math.floor(Math.random() * colors.length)], a: Math.random() * Math.PI,
  }));
  const t0 = performance.now();
  (function frame(t) {
    const dt = t - t0;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += 0.25; p.x += p.vx; p.y += p.vy; p.a += 0.15;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.max(0, 1 - dt / 1600);
      ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore();
    }
    if (dt < 1600) requestAnimationFrame(frame); else c.remove();
  })(t0);
}

/**
 * Wire global celebrations: XP toasts, badges, level-ups, goals and rewards.
 * @returns {void}
 */
export function wireCelebrations() {
  onEvent('xp', ({ amount, reason }) => toast(`<b>+${amount} XP</b> <span>${esc(reason)}</span>`, { kind: 'xp', ms: 1800 }));
  onEvent('badge', (b) => {
    confetti();
    openModal({ title: 'Badge earned!', cls: 'celebrate', body: `<div class="big-emoji">${b.icon}</div><p class="cele-name">${esc(b.name)}</p><p>${esc(b.desc)}</p>`, actions: [{ label: 'Nice!', value: true, kind: 'primary' }] });
  });
  onEvent('level', (lv) => {
    confetti();
    openModal({ title: 'Level up!', cls: 'celebrate', body: `${ohmieTip(`You are now a <b>${esc(lv.name)}</b>. Keep that current flowing!`, 'wow')}`, actions: [{ label: 'Keep going', value: true, kind: 'primary' }] });
  });
  onEvent('goal', (g) => toast(`🎯 <b>Daily goal reached!</b> <span>${g} XP today</span>`, { kind: 'good', ms: 3200 }));
  onEvent('reward', (r) => {
    confetti();
    openModal({ title: 'Reward unlocked!', cls: 'celebrate', body: `<div class="big-emoji">🎁</div><p class="cele-name">${esc(r.title)}</p><p>Show this to your parent so they can hand it over and mark it as claimed.</p>`, actions: [{ label: 'See Reward Board', value: 'go', kind: 'primary' }, { label: 'Later', value: null }] })
      .then((v) => { if (v === 'go') location.hash = '#/rewards'; });
  });
  onEvent('save-error', () => toast('Progress could not be saved on this device. Check that the browser allows site storage.', { kind: 'bad', ms: 5000 }));
}

/**
 * Progress ring SVG.
 * @param {number} pct 0–1.
 * @param {number} [size=56] Pixel size.
 * @param {string} [label=''] Centre text.
 * @returns {string} SVG markup.
 */
export function ring(pct, size = 56, label = '') {
  const r = 22;
  const c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 56 56" width="${size}" height="${size}" aria-hidden="true">` +
    `<circle cx="28" cy="28" r="${r}" class="ring-bg"/><circle cx="28" cy="28" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(1, pct)))}" transform="rotate(-90 28 28)"/>` +
    `${label ? `<text x="28" y="32.5" text-anchor="middle" class="ring-lbl">${label}</text>` : ''}</svg>`;
}

/**
 * Today's XP versus the daily goal.
 * @returns {{xp:number, goal:number, pct:number}} Status.
 */
export function goalStatus() {
  const goal = getState().profile.dailyGoal;
  const xp = todayXP();
  return { xp, goal, pct: Math.min(1, xp / goal) };
}

/**
 * Level-tag chips.
 * @param {string[]} levels e.g. ['Y10','L1'].
 * @returns {string} HTML.
 */
export function levelTags(levels = []) {
  const names = { Y10: 'Year 10', L1: 'NCEA L1', L2: 'NCEA L2', L3: 'NCEA L3', Uni: 'University' };
  return levels.map((l) => `<span class="ltag lt-${l}">${names[l] || l}</span>`).join('');
}
