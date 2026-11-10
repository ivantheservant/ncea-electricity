/**
 * router.js — tiny hash router: '#/lesson/1.2?s=3' → handler({id:'1.2'}, {s:'3'}).
 */

const routes = [];
let notFound = null;

/**
 * Register a route.
 * @param {string} pattern Path pattern such as '/lesson/:id'.
 * @param {(params:object, query:object)=>void} handler Called on match.
 * @returns {void}
 */
export function route(pattern, handler) {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:([a-zA-Z]+)/g, (_, k) => { keys.push(k); return '([^/?]+)'; }) + '$');
  routes.push({ re, keys, handler });
}

/**
 * Register the fallback handler.
 * @param {(path:string)=>void} handler Called when nothing matches.
 * @returns {void}
 */
export function fallback(handler) {
  notFound = handler;
}

/**
 * Parse the current hash.
 * @returns {{path:string, query:object}} Parsed location.
 */
export function current() {
  const h = decodeURI(location.hash.replace(/^#/, '')) || '/home';
  const [path, qs] = h.split('?');
  const query = Object.fromEntries(new URLSearchParams(qs || ''));
  return { path: path || '/home', query };
}

/**
 * Run the handler for the current hash.
 * @returns {void}
 */
export function resolve() {
  const { path, query } = current();
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      r.handler(params, query);
      return;
    }
  }
  if (notFound) notFound(path);
}

/**
 * Navigate to a hash route.
 * @param {string} hash e.g. '#/lesson/1.1'.
 * @returns {void}
 */
export function go(hash) {
  if (location.hash === hash) resolve();
  else location.hash = hash;
}

/**
 * Start listening for hash changes.
 * @returns {void}
 */
export function startRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}
