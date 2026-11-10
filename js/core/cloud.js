/**
 * cloud.js — optional Google sign-in and cloud sync (Firebase Auth + Firestore).
 * Without a Firebase config, or offline, the app runs in local-only mode and this module stays idle.
 *
 * Firestore layout:
 *   users/{uid}   { name, email, photo, parents: [emails], stateJson, clientUpdated, updatedAt }
 *   family/{uid}  { rewards: [...], answers: { questionId: {text, by, at} } }  — written by parents
 */
import { FIREBASE_CONFIG } from '../firebase-config.js';
import { PARENT_EMAILS, CLOUD_SAVE_DELAY } from '../config.js';
import { getState, replaceState, freshState, onEvent, emit } from './store.js';
import { mergeStates } from './merge.js';

let fb = null;
let auth = null;
let db = null;
let user = null;
let saveTimer = null;
let applying = false;
let family = { rewards: [], answers: {} };
let parentsList = [];
let ready = false;
let unsubFamily = null;
let lastSaved = 0;
let loading = null;

/**
 * Whether cloud features are configured.
 * @returns {boolean} True when a Firebase config is present.
 */
export function cloudEnabled() {
  return !!FIREBASE_CONFIG.apiKey;
}

/**
 * Whether an email belongs to a parent account.
 * @param {string} email Email address.
 * @returns {boolean} True for configured parent emails.
 */
export function isParentEmail(email) {
  return PARENT_EMAILS.includes(String(email || '').toLowerCase());
}

/**
 * The signed-in user, or null.
 * @returns {{uid:string, email:string, name:string, photo:string, isParent:boolean}|null} User.
 */
export function currentUser() {
  if (!user) return null;
  return { uid: user.uid, email: user.email, name: user.displayName || '', photo: user.photoURL || '', isParent: isParentEmail(user.email) && user.emailVerified };
}

/**
 * Parents this learner shares progress with.
 * @returns {string[]} Emails.
 */
export function sharedParents() {
  return parentsList.slice();
}

/**
 * Rewards and answers set by parents for the signed-in learner.
 * @returns {{rewards:object[], answers:object}} Family data.
 */
export function familyData() {
  return family;
}

/**
 * Whether the first auth check has finished.
 * @returns {boolean} True when ready.
 */
export function cloudReady() {
  return ready || !cloudEnabled();
}

/**
 * Time of the last successful cloud save.
 * @returns {number} Epoch ms (0 when never saved in this session).
 */
export function lastCloudSave() {
  return lastSaved;
}

/**
 * Load Firebase and start listening for sign-in. Safe to call when offline or more than once.
 * @returns {Promise<void>}
 */
export function initCloud() {
  if (!loading) loading = startCloud();
  return loading;
}

/**
 * One-time Firebase start-up (see initCloud).
 * @returns {Promise<void>}
 */
async function startCloud() {
  if (!cloudEnabled()) { ready = true; return; }
  try {
    fb = await import('../../vendor/firebase/firebase.js');
  } catch (err) {
    console.warn('Cloud sync unavailable', err);
    ready = true;
    emit('auth', null);
    return;
  }
  const app = fb.initializeApp(FIREBASE_CONFIG);
  auth = fb.getAuth(app);
  db = fb.initializeFirestore(app, { ignoreUndefinedProperties: true });
  try { await fb.getRedirectResult(auth); } catch (err) { console.warn(err); }
  fb.onAuthStateChanged(auth, async (u) => {
    user = u;
    if (u) {
      try { await pull(true); } catch (err) { console.warn('Sync failed', err); emit('cloud-error', err); }
      watchFamily();
    } else {
      stopFamily();
      parentsList = [];
    }
    ready = true;
    emit('auth', currentUser());
  });
  onEvent('change', (what) => { if (!applying && what !== 'replace' && what !== 'visit') scheduleSave(); });
  document.addEventListener('visibilitychange', () => {
    if (!user) return;
    if (document.visibilityState === 'hidden') pushNow();
    else pull(false).catch(() => {});
  });
  window.addEventListener('online', () => { if (user) pull(false).catch(() => {}); });
}

/**
 * Sign in with Google (popup, with redirect fallback when popups are blocked).
 * @returns {Promise<boolean>} True when signed in (false when the learner closed the popup).
 * @throws {Error} When sign-in fails for another reason.
 */
export async function signIn() {
  if (!auth && loading) await loading;
  if (!auth) throw new Error('Sign-in is not available right now. Check your internet connection and reload the page.');
  const provider = new fb.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await fb.signInWithPopup(auth, provider);
    return true;
  } catch (err) {
    if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/operation-not-supported-in-this-environment') {
      await fb.signInWithRedirect(auth, provider);
      return false;
    }
    if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') return false;
    if (err?.code === 'auth/network-request-failed') throw new Error('No internet connection. Connect and try again.');
    throw err;
  }
}

/**
 * Save to the cloud, sign out, then clear progress from this device so the next person
 * starts fresh. Display settings are kept.
 * @returns {Promise<void>}
 * @throws {Error} When the final save fails (nothing is cleared in that case).
 */
export async function signOutUser() {
  if (!auth || !user) return;
  const ok = await pushNow();
  if (!ok) throw new Error('Could not save to your Google account (are you offline?). Connect to the internet and try again.');
  stopFamily();
  await fb.signOut(auth);
  const p = getState().profile;
  const fresh = freshState();
  Object.assign(fresh.profile, { theme: p.theme, textScale: p.textScale, onboarded: true });
  applying = true;
  replaceState(fresh, 'replace');
  applying = false;
}

/**
 * Fresh state for a different account on this device, keeping display settings.
 * @returns {object} State.
 */
function blankForNewOwner() {
  const p = getState().profile;
  const fresh = freshState();
  Object.assign(fresh.profile, { theme: p.theme, textScale: p.textScale, onboarded: true });
  return fresh;
}

/**
 * Fetch the cloud copy and merge it with local progress. Progress on this device is merged
 * only when it belongs to the same account (or to nobody yet).
 * @param {boolean} first True on sign-in (always saves afterwards).
 * @returns {Promise<boolean>} True when local state changed.
 */
async function pull(first) {
  if (!user) return false;
  const snap = await fb.getDoc(fb.doc(db, 'users', user.uid));
  const local = getState();
  const sameOwner = !local.cloudOwner || local.cloudOwner === user.uid;
  let remote = null;
  if (snap.exists()) {
    const data = snap.data();
    parentsList = Array.isArray(data.parents) ? data.parents : [];
    try { remote = JSON.parse(data.stateJson || 'null'); } catch { remote = null; }
  } else {
    parentsList = [];
  }
  const base = sameOwner ? local : blankForNewOwner();
  const merged = mergeStates(base, remote);
  merged.cloudOwner = user.uid;
  if (!merged.profile.name && user.displayName) merged.profile.name = user.displayName.split(' ')[0];
  const changed = JSON.stringify(merged) !== JSON.stringify(local);
  if (changed) {
    applying = true;
    replaceState(merged, 'replace');
    applying = false;
    emit('synced', { first });
  }
  if (changed || first) await pushNow();
  return changed;
}

/**
 * Save local progress to the cloud soon (debounced).
 * @returns {void}
 */
function scheduleSave() {
  if (!user) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(pushNow, CLOUD_SAVE_DELAY);
}

/**
 * Save local progress to the cloud now.
 * @returns {Promise<boolean>} True when saved.
 */
export async function pushNow() {
  clearTimeout(saveTimer);
  if (!user || !db) return false;
  const s = getState();
  try {
    await fb.setDoc(fb.doc(db, 'users', user.uid), {
      name: s.profile.name || user.displayName || '',
      email: user.email,
      photo: user.photoURL || '',
      parents: parentsList,
      stateJson: JSON.stringify(s),
      clientUpdated: Date.now(),
      updatedAt: fb.serverTimestamp(),
    });
    lastSaved = Date.now();
    emit('cloud-saved', lastSaved);
    return true;
  } catch (err) {
    console.warn('Cloud save failed', err);
    emit('cloud-error', err);
    return false;
  }
}

/**
 * Choose which parents can see this learner's progress.
 * @param {string[]} emails Parent emails (only those in PARENT_EMAILS are kept).
 * @returns {Promise<boolean>} True when saved.
 */
export async function setSharedParents(emails) {
  parentsList = emails.map((e) => e.toLowerCase()).filter(isParentEmail);
  const ok = await pushNow();
  emit('auth', currentUser());
  return ok;
}

/**
 * Listen for rewards and answers parents set for this learner.
 * @returns {void}
 */
function watchFamily() {
  stopFamily();
  if (!user) return;
  unsubFamily = fb.onSnapshot(fb.doc(db, 'family', user.uid), (snap) => {
    const d = snap.exists() ? snap.data() : {};
    family = { rewards: d.rewards || [], answers: d.answers || {} };
    emit('family', family);
  }, (err) => {
    console.warn('Family data unavailable', err);
  });
}

/**
 * Stop listening for family data and clear it.
 * @returns {void}
 */
function stopFamily() {
  if (unsubFamily) { try { unsubFamily(); } catch { /* already stopped */ } }
  unsubFamily = null;
  family = { rewards: [], answers: {} };
}

/**
 * Parent: list learners who share progress with the signed-in parent.
 * @returns {Promise<{uid:string, name:string, email:string, photo:string, state:object, updated:number, family:object}[]>} Learners.
 * @throws {Error} When the signed-in user is not a parent or the request fails.
 */
export async function listMyLearners() {
  const me = currentUser();
  if (!me?.isParent) throw new Error('Only parent accounts can see learners.');
  const q = fb.query(fb.collection(db, 'users'), fb.where('parents', 'array-contains', me.email.toLowerCase()));
  const res = await fb.getDocs(q);
  const out = [];
  for (const d of res.docs) {
    const data = d.data();
    let state = null;
    try { state = JSON.parse(data.stateJson); } catch { state = null; }
    let fam = { rewards: [], answers: {} };
    try {
      const f = await fb.getDoc(fb.doc(db, 'family', d.id));
      if (f.exists()) fam = { rewards: f.data().rewards || [], answers: f.data().answers || {} };
    } catch { /* no family doc yet */ }
    out.push({ uid: d.id, name: data.name, email: data.email, photo: data.photo, state, updated: data.clientUpdated || 0, family: fam });
  }
  return out;
}

/**
 * Parent: save rewards and answers for a learner.
 * @param {string} uid Learner uid.
 * @param {{rewards:object[], answers:object}} data Family data.
 * @returns {Promise<void>}
 * @throws {Error} When the signed-in user is not a parent or the save fails.
 */
export async function saveFamily(uid, data) {
  const me = currentUser();
  if (!me?.isParent) throw new Error('Only parent accounts can change rewards.');
  await fb.setDoc(fb.doc(db, 'family', uid), { rewards: data.rewards || [], answers: data.answers || {}, updatedBy: me.email, updatedAt: fb.serverTimestamp() });
}
