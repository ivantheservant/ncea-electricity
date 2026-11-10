/**
 * store.js — the single persisted state object (localStorage), a tiny event bus,
 * and backup helpers (file export/import and copy-paste transfer codes).
 */
import { STORAGE_KEY, SCHEMA_VERSION, DEFAULT_DAILY_GOAL } from '../config.js';

/**
 * Build a fresh, empty state.
 * @returns {object} New state.
 */
export function freshState() {
  return {
    v: SCHEMA_VERSION,
    profile: { name: '', created: Date.now(), dailyGoal: DEFAULT_DAILY_GOAL, theme: 'auto', textScale: 1, onboarded: false },
    xp: { total: 0, byDay: {} },
    lessons: {},
    quiz: {},
    tests: {},
    badges: {},
    streak: { current: 0, best: 0, lastDay: null },
    goalDays: {},
    highlights: [],
    bookmarks: [],
    questions: [],
    srs: {},
    srsDaily: {},
    mistakes: {},
    sims: {},
    facts: {},
    counters: { flashReviews: 0, mistakesCleared: 0, comebacks: 0, perfectCheckpoints: 0, practiceSessions: 0 },
    rewards: { pinHash: null, salt: null, items: [] },
    lastLesson: null,
    lastBackup: null,
    visited: {},
  };
}

let state = null;
let saveTimer = null;
const listeners = new Map();

/**
 * Deep-merge saved data onto a fresh state so new fields always exist.
 * @param {object} base Fresh state.
 * @param {object} saved Saved state.
 * @returns {object} Merged state.
 */
function merge(base, saved) {
  if (!saved || typeof saved !== 'object') return base;
  for (const k of Object.keys(saved)) {
    const b = base[k];
    const s = saved[k];
    if (b && typeof b === 'object' && !Array.isArray(b) && s && typeof s === 'object' && !Array.isArray(s)) {
      base[k] = merge(b, s);
    } else {
      base[k] = s;
    }
  }
  return base;
}

/**
 * Load state from localStorage (or start fresh). Safe when storage is blocked.
 * @returns {object} The live state object.
 */
export function load() {
  let saved = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) saved = JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read saved progress', err);
  }
  state = merge(freshState(), saved);
  state.v = SCHEMA_VERSION;
  return state;
}

/**
 * The live state object (load() must have run).
 * @returns {object} State.
 */
export function getState() {
  return state || load();
}

/**
 * Persist now.
 * @returns {boolean} True when saved.
 */
export function saveNow() {
  clearTimeout(saveTimer);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.warn('Could not save progress', err);
    emit('save-error', err);
    return false;
  }
}

/**
 * Persist soon (debounced) and notify listeners that state changed.
 * @param {string} [what='change'] What changed (passed to listeners).
 * @returns {void}
 */
export function commit(what = 'change') {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 250);
  emit('change', what);
}

/**
 * Subscribe to an event.
 * @param {string} evt Event name ('change', 'xp', 'badge', 'level', 'toast', 'save-error').
 * @param {(payload:any)=>void} fn Listener.
 * @returns {() => void} Unsubscribe function.
 */
export function onEvent(evt, fn) {
  if (!listeners.has(evt)) listeners.set(evt, new Set());
  listeners.get(evt).add(fn);
  return () => listeners.get(evt).delete(fn);
}

/**
 * Emit an event.
 * @param {string} evt Event name.
 * @param {*} payload Data.
 * @returns {void}
 */
export function emit(evt, payload) {
  (listeners.get(evt) || []).forEach((fn) => {
    try { fn(payload); } catch (err) { console.error(err); }
  });
}

/**
 * Serialise all progress for a backup file.
 * @returns {string} JSON text.
 */
export function exportJSON() {
  return JSON.stringify({ app: 'spark-lab', exported: new Date().toISOString(), state }, null, 1);
}

/**
 * Validate and load a backup.
 * @param {string} text JSON text from exportJSON().
 * @returns {object} The new state.
 * @throws {Error} When the text is not a Spark Lab backup.
 */
export function importJSON(text) {
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('That file is not a Spark Lab backup (it is not valid JSON).'); }
  if (!data || data.app !== 'spark-lab' || !data.state) throw new Error('That file is not a Spark Lab backup.');
  state = merge(freshState(), data.state);
  saveNow();
  emit('change', 'import');
  return state;
}

/**
 * Bytes → URL-safe base64.
 * @param {Uint8Array} bytes Data.
 * @returns {string} Base64url text.
 */
function toB64(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * URL-safe base64 → bytes.
 * @param {string} b64 Base64url text.
 * @returns {Uint8Array} Data.
 */
function fromB64(b64) {
  const s = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

/**
 * Make a compressed copy-paste code containing all progress.
 * @returns {Promise<string>} Code starting with 'SPARK1.'.
 */
export async function makeTransferCode() {
  const json = new TextEncoder().encode(exportJSON());
  if (typeof CompressionStream === 'undefined') return 'SPARK0.' + toB64(json);
  const stream = new Blob([json]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  const buf = new Uint8Array(await new Response(stream).arrayBuffer());
  return 'SPARK1.' + toB64(buf);
}

/**
 * Read a transfer code and load it.
 * @param {string} code Code from makeTransferCode().
 * @returns {Promise<object>} The new state.
 * @throws {Error} When the code is damaged or not a Spark Lab code.
 */
export async function readTransferCode(code) {
  const c = String(code || '').trim().replace(/\s+/g, '');
  if (!/^SPARK[01]\./.test(c)) throw new Error('That is not a Spark Lab transfer code. Codes start with SPARK1.');
  try {
    let bytes = fromB64(c.slice(7));
    if (c.startsWith('SPARK1.')) {
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    }
    return importJSON(new TextDecoder().decode(bytes));
  } catch (err) {
    if (err.message.startsWith('That')) throw err;
    throw new Error('The code is incomplete or damaged. Copy the whole code again and paste it here.');
  }
}

/**
 * Wipe all progress.
 * @returns {object} The fresh state.
 */
export function resetAll() {
  state = freshState();
  saveNow();
  emit('change', 'reset');
  return state;
}
