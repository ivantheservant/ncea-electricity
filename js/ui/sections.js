/**
 * sections.js — turns lesson section objects into HTML.
 *
 * Section types: text, tip, example, misconception, funfact, maths, exam, deeper, sim,
 * diagram, key, try, formula.
 */
import { esc } from '../utils/dom.js';
import { ohmieTip, levelTags } from './shell.js';
import { getState } from '../core/store.js';
import { isBookmarked } from '../core/notes.js';

/**
 * Bookmark toggle button for a section heading.
 * @param {string} lessonId Lesson id.
 * @param {number} i Section index.
 * @param {string} title Section title.
 * @returns {string} HTML.
 */
function bmBtn(lessonId, i, title) {
  const on = isBookmarked(lessonId, i);
  return `<button type="button" class="bm-btn ${on ? 'on' : ''}" data-bm="${i}" data-title="${esc(title)}" aria-pressed="${on}" aria-label="Bookmark this section">${bmIcon()}</button>`;
}

/**
 * Bookmark icon.
 * @returns {string} SVG.
 */
export function bmIcon() {
  return '<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M7 4h10v16l-5-4-5 4z"/></svg>';
}

/**
 * Render one section.
 * @param {object} s Section.
 * @param {number} i Index within the lesson.
 * @param {object} lesson Lesson.
 * @returns {string} HTML.
 */
export function renderSection(s, i, lesson) {
  const zone = (html) => `<div class="hl-zone" data-sec="${i}">${html}</div>`;
  const head = (title, cls = '') => (title ? `<div class="sec-head ${cls}"><h3>${title}</h3>${bmBtn(lesson.id, i, title)}</div>` : '');
  const wrapS = (inner, extra = '') => `<section class="sec sec-${s.type} ${extra}" id="s${i}">${inner}</section>`;
  switch (s.type) {
    case 'text':
      return wrapS(head(s.title) + zone(s.html) + (s.levels ? `<div class="sec-tags">${levelTags(s.levels)}</div>` : ''));
    case 'tip':
      return wrapS(`<div class="hl-zone" data-sec="${i}">${ohmieTip(`<p>${s.html}</p>`, s.mood)}</div>`);
    case 'example':
      return wrapS(`<div class="card example">${head(`Worked example${s.title ? ': ' + s.title : ''}`)}` +
        zone(`<div class="ex-q">${s.q}</div>`) +
        `<ol class="steps" data-revealed="0">${s.steps.map((st) => `<li class="step hidden"><div class="hl-zone" data-sec="${i}x">${st}</div></li>`).join('')}</ol>` +
        `<div class="ex-ans hidden">${zone(s.answer)}</div>` +
        `<div class="ex-ctrl"><p class="ex-prompt">Try it yourself first, then check each step.</p><button type="button" class="btn primary small ex-next">Show step 1</button><button type="button" class="btn ghost small ex-all">Show all</button></div></div>`);
    case 'misconception':
      return wrapS(`<div class="card mix">${head(s.title || 'Common mix-up')}` +
        zone(`<p class="mix-wrong"><span class="mk">✗</span> ${s.wrong}</p><p class="mix-right"><span class="mk">✓</span> ${s.right}</p>${s.html || ''}`) + '</div>');
    case 'funfact': {
      const seen = !!getState().facts[s.factId];
      return wrapS(`<div class="fact ${seen ? 'open' : ''}"><button type="button" class="fact-btn" data-fact="${s.factId}" aria-expanded="${seen}">` +
        `<span class="fact-ico">💡</span><span>${seen ? 'Fun fact' : 'Fun fact: tap to reveal'}${s.title ? ` — ${s.title}` : ''}</span></button>` +
        `<div class="fact-body" ${seen ? '' : 'hidden'}>${zone(s.html)}</div></div>`);
    }
    case 'maths':
      return wrapS(`<div class="card maths">${head(`Maths corner${s.title ? ': ' + s.title : ''}`)}${zone(s.html)}` +
        (s.link ? `<a class="more" href="#/lesson/${s.link}">Review this in lesson ${s.link}</a>` : '') + '</div>');
    case 'exam':
      return wrapS(`<div class="card exam">${head(s.title || 'Exam focus')}` +
        (s.standard ? `<p class="std">${s.standard}</p>` : '') + zone(s.html) + '</div>');
    case 'deeper':
      return wrapS(`<details class="deeper"><summary>${levelTags(s.levels || ['Uni'])}<span class="deeper-title">Go deeper: ${s.title}</span></summary>${zone(s.html)}</details>`);
    case 'sim':
      return wrapS(`<figure class="sim"><div class="sim-mount" data-sim="${s.sim}"></div>${s.caption ? `<figcaption class="hl-zone" data-sec="${i}"><p>${s.caption}</p></figcaption>` : ''}</figure>`);
    case 'diagram':
      return wrapS(`<figure class="diagram">${s.svg}${s.caption ? `<figcaption class="hl-zone" data-sec="${i}"><p>${s.caption}</p></figcaption>` : ''}</figure>`);
    case 'key':
      return wrapS(`<div class="card key">${head(s.title || 'Key points')}${zone(`<ul>${s.points.map((p) => `<li>${p}</li>`).join('')}</ul>`)}</div>`);
    case 'try':
      return wrapS(`<div class="card try"><div class="sec-head"><h3>Quick check</h3></div><div class="try-mount" data-q="${s.question.id}"></div></div>`);
    case 'formula':
      return wrapS(`<div class="card formula">${head(s.title || 'Formula')}<div class="f-main">$$${s.tex}$$</div>` +
        (s.symbols ? `<table class="symtab"><thead><tr><th>Symbol</th><th>Meaning</th><th>Unit</th></tr></thead><tbody>${s.symbols.map((r) => `<tr><td>$${r[0]}$</td><td>${r[1]}</td><td>${r[2] || ''}</td></tr>`).join('')}</tbody></table>` : '') +
        (s.html ? zone(s.html) : '') + '</div>');
    default:
      return '';
  }
}
