/**
 * search.js — search page over lessons, glossary and formulas.
 */
import { $, esc } from '../utils/dom.js';
import { search } from '../core/search.js';

/**
 * Search page.
 * @param {Element} view Main view.
 * @param {object} query {q: initial query}.
 * @returns {() => void} Cleanup.
 */
export function searchView(view, query) {
  view.innerHTML = `
  <div class="page narrow search">
    <header class="page-head"><h1>Search</h1>
      <input type="search" class="s-in" placeholder="Try “induction”, “ammeter” or “prefix”" aria-label="Search the course" value="${esc(query.q || '')}" autofocus></header>
    <div class="s-results" aria-live="polite"></div>
  </div>`;
  const inp = $('.s-in', view);
  const out = $('.s-results', view);
  let t = null;
  const run = () => {
    const q = inp.value.trim();
    history.replaceState(null, '', `#/search${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    if (q.length < 2) { out.innerHTML = '<p class="muted">Type at least two letters.</p>'; return; }
    const res = search(q);
    out.innerHTML = res.length
      ? `<p class="muted">${res.length} result${res.length === 1 ? '' : 's'}</p><ul class="s-list">${res.map((r) => `<li><a href="${r.route}"><span class="s-kind k-${r.kind.toLowerCase()}">${r.kind}</span><b>${esc(r.title.replace(/\$/g, ''))}</b><small>${esc(r.where)}</small><span class="s-snip">${r.snippet}</span></a></li>`).join('')}</ul>`
      : '<p class="muted">No matches. Try a shorter word or a different spelling.</p>';
  };
  inp.addEventListener('input', () => { clearTimeout(t); t = setTimeout(run, 150); });
  run();
  inp.focus();
  return () => clearTimeout(t);
}
