/**
 * search.js — simple ranked full-text search over lessons, glossary and formulas.
 */
import { searchRecords } from './content.js';
import { esc } from '../utils/dom.js';

let records = null;

/**
 * Search everything.
 * @param {string} query Words to find.
 * @param {number} [limit=40] Maximum results.
 * @returns {{kind:string, title:string, route:string, where:string, snippet:string, score:number}[]} Results.
 */
export function search(query, limit = 40) {
  if (!records) records = searchRecords();
  const terms = String(query || '').toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const out = [];
  for (const r of records) {
    const title = r.title.toLowerCase();
    const text = r.text.toLowerCase();
    let score = 0;
    let all = true;
    for (const t of terms) {
      const inTitle = title.includes(t);
      const inText = text.includes(t);
      if (!inTitle && !inText) { all = false; break; }
      score += (inTitle ? 5 : 0) + (inText ? 1 : 0);
    }
    if (!all) continue;
    if (r.kind === 'Glossary' || r.kind === 'Formula') score += 2;
    out.push({ ...r, score, snippet: snippet(r.text, terms) });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Short excerpt around the first match with <mark> tags.
 * @param {string} text Plain text.
 * @param {string[]} terms Lower-case terms.
 * @returns {string} HTML snippet.
 */
function snippet(text, terms) {
  const low = text.toLowerCase();
  const i = Math.max(0, Math.min(...terms.map((t) => { const k = low.indexOf(t); return k < 0 ? Infinity : k; })));
  const start = Math.max(0, (Number.isFinite(i) ? i : 0) - 60);
  let s = esc((start > 0 ? '…' : '') + text.slice(start, start + 180) + (text.length > start + 180 ? '…' : ''));
  for (const t of terms) s = s.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
  return s;
}
