/**
 * dom.js — small DOM helpers shared by every view.
 */

/**
 * Escape text for safe insertion into HTML.
 * @param {*} value Any value; null/undefined become ''.
 * @returns {string} HTML-safe string.
 */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * querySelector shortcut.
 * @param {string} sel CSS selector.
 * @param {ParentNode} [root=document] Where to search.
 * @returns {Element|null} First match.
 */
export function $(sel, root = document) {
  return root.querySelector(sel);
}

/**
 * querySelectorAll shortcut returning an array.
 * @param {string} sel CSS selector.
 * @param {ParentNode} [root=document] Where to search.
 * @returns {Element[]} All matches.
 */
export function $$(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

/**
 * Create an element from an HTML string (first element only).
 * @param {string} html Markup.
 * @returns {Element} The created element.
 */
export function fromHTML(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/**
 * Attach a delegated event listener.
 * @param {Element} root Element that receives the event.
 * @param {string} type Event type, e.g. 'click'.
 * @param {string} sel Selector the event target must match (closest()).
 * @param {(ev: Event, el: Element) => void} fn Handler.
 * @returns {() => void} Function that removes the listener.
 */
export function on(root, type, sel, fn) {
  const handler = (ev) => {
    const el = ev.target.closest(sel);
    if (el && root.contains(el)) fn(ev, el);
  };
  root.addEventListener(type, handler);
  return () => root.removeEventListener(type, handler);
}

/**
 * Fisher–Yates shuffle that returns a new array.
 * @template T
 * @param {T[]} arr Input array (not modified).
 * @returns {T[]} Shuffled copy.
 */
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Create a short random id.
 * @param {string} [prefix=''] Optional prefix.
 * @returns {string} Id such as 'hl_k3x9a2'.
 */
export function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
}

/**
 * Strip tags from an HTML string to get plain text.
 * @param {string} html Markup.
 * @returns {string} Plain text with collapsed whitespace.
 */
export function plainText(html) {
  return String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Trigger a file download of text content.
 * @param {string} filename Suggested file name.
 * @param {string} text File content.
 * @param {string} [type='text/plain'] MIME type.
 * @returns {void}
 */
export function downloadText(filename, text, type = 'text/plain') {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Whether the user prefers reduced motion.
 * @returns {boolean} True when animations should be minimised.
 */
export function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const boundHandlers = new WeakMap();

/**
 * Attach a listener, replacing any listener previously attached with this helper
 * for the same element and event type. Views that re-render themselves use this
 * so handlers never stack up.
 * @param {Element} el Element.
 * @param {string} type Event type.
 * @param {(ev: Event) => void} fn Handler.
 * @returns {() => void} Function that removes the listener.
 */
export function bindOnce(el, type, fn) {
  let map = boundHandlers.get(el);
  if (!map) { map = {}; boundHandlers.set(el, map); }
  if (map[type]) el.removeEventListener(type, map[type]);
  map[type] = fn;
  el.addEventListener(type, fn);
  return () => { el.removeEventListener(type, fn); if (map[type] === fn) delete map[type]; };
}
