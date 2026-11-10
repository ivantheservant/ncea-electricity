/**
 * highlighter.js — select text in a lesson to highlight it, add a note or save a question.
 * Highlights are stored as (block id, start, end) character offsets and re-applied on render.
 */
import { $, $$, esc } from '../utils/dom.js';
import { addHighlight, updateHighlight, removeHighlight, lessonHighlights, addQuestion } from '../core/notes.js';
import { openModal, toast } from './shell.js';

const BLOCKS = 'p, li, h3, h4, td, th, figcaption, dd, dt, blockquote';

/**
 * Give every innermost text block inside highlight zones a stable id.
 * @param {Element} root Lesson container.
 * @returns {void}
 */
export function assignBlockIds(root) {
  $$('.hl-zone', root).forEach((zone) => {
    let k = 0;
    $$(BLOCKS, zone).forEach((el) => {
      if (el.querySelector(BLOCKS) || el.closest('.no-hl')) return;
      el.dataset.bid = `${zone.dataset.sec}.${k++}`;
    });
  });
}

/**
 * Text nodes that count towards offsets (maths is skipped so offsets stay stable).
 * @param {Element} block Block element.
 * @returns {Text[]} Text nodes in order.
 */
function textNodes(block) {
  const out = [];
  const w = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest('.katex, .no-hl, button') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  while (w.nextNode()) out.push(w.currentNode);
  return out;
}

/**
 * Character offset of a DOM boundary point within a block.
 * @param {Element} block Block element.
 * @param {Node} node Boundary container.
 * @param {number} offset Boundary offset.
 * @returns {number} Offset in counted characters.
 */
function offsetOf(block, node, offset) {
  const r = document.createRange();
  r.setStart(node, offset);
  r.collapse(true);
  let n = 0;
  for (const t of textNodes(block)) {
    if (r.comparePoint(t, t.length) <= 0) { n += t.length; continue; }
    if (r.comparePoint(t, 0) >= 0) break;
    if (t === node) n += offset;
    break;
  }
  return n;
}

/**
 * Wrap characters [start, end) of a block in a <mark>.
 * @param {Element} block Block element.
 * @param {number} start Start offset.
 * @param {number} end End offset.
 * @param {object} h Highlight record.
 * @returns {boolean} True when something was wrapped.
 */
function wrap(block, start, end, h) {
  let pos = 0;
  const jobs = [];
  for (const t of textNodes(block)) {
    const a = pos;
    const b = pos + t.length;
    pos = b;
    const s = Math.max(start, a);
    const e = Math.min(end, b);
    if (s < e) jobs.push([t, s - a, e - a]);
  }
  for (const [t, s, e] of jobs) {
    let node = t;
    if (s > 0) node = node.splitText(s);
    if (e - s < node.length) node.splitText(e - s);
    const m = document.createElement('mark');
    m.className = `hl hl-${h.color}${h.note ? ' has-note' : ''}`;
    m.dataset.hl = h.id;
    node.parentNode.insertBefore(m, node);
    m.appendChild(node);
  }
  return jobs.length > 0;
}

/**
 * Remove marks for one highlight.
 * @param {Element} root Container.
 * @param {string} id Highlight id.
 * @returns {void}
 */
function unwrap(root, id) {
  $$(`mark[data-hl="${id}"]`, root).forEach((m) => {
    const p = m.parentNode;
    while (m.firstChild) p.insertBefore(m.firstChild, m);
    m.remove();
    p.normalize();
  });
}

/**
 * Apply saved highlights to a rendered lesson.
 * @param {Element} root Lesson container.
 * @param {string} lessonId Lesson id.
 * @returns {void}
 */
export function restoreHighlights(root, lessonId) {
  for (const h of lessonHighlights(lessonId)) {
    const block = root.querySelector(`[data-bid="${h.bid}"]`);
    if (!block) continue;
    const text = textNodes(block).map((t) => t.data).join('');
    let { start, end } = h;
    if (text.slice(start, end) !== h.text) {
      const i = text.indexOf(h.text);
      if (i < 0) continue;
      start = i;
      end = i + h.text.length;
    }
    wrap(block, start, end, h);
  }
}

/**
 * Turn the current selection into per-block pieces.
 * @param {Element} root Lesson container.
 * @param {Range} range Selection range.
 * @returns {{block:Element, bid:string, start:number, end:number, text:string}[]} Pieces.
 */
function piecesFrom(root, range) {
  const out = [];
  for (const block of $$('[data-bid]', root)) {
    if (!range.intersectsNode(block)) continue;
    const full = textNodes(block).map((t) => t.data).join('');
    const start = block.contains(range.startContainer) ? offsetOf(block, range.startContainer, range.startOffset) : 0;
    const end = block.contains(range.endContainer) ? offsetOf(block, range.endContainer, range.endOffset) : full.length;
    const text = full.slice(start, end);
    if (end > start && text.trim()) out.push({ block, bid: block.dataset.bid, start, end, text });
  }
  return out;
}

/**
 * Attach the highlighter to a lesson page.
 * @param {Element} root Lesson container.
 * @param {string} lessonId Lesson id.
 * @param {string} lessonTitle Lesson title (for saved questions).
 * @returns {() => void} Detach function.
 */
export function attachHighlighter(root, lessonId, lessonTitle) {
  const bar = $('#hl-bar');
  let pending = null;
  let timer = null;

  bar.innerHTML = `<span class="hl-bar-label">Selected text</span>
    <button type="button" data-c="green" class="swatch sw-green" aria-label="Highlight green"></button>
    <button type="button" data-c="pink" class="swatch sw-pink" aria-label="Highlight pink"></button>
    <button type="button" data-c="yellow" class="swatch sw-yellow" aria-label="Highlight yellow"></button>
    <button type="button" data-act="note" class="btn small">Note</button>
    <button type="button" data-act="ask" class="btn small">Ask</button>
    <button type="button" data-act="close" class="iconbtn small" aria-label="Close">✕</button>`;

  const hide = () => { bar.hidden = true; pending = null; };

  /** React to selection changes. */
  const onSel = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) { if (!bar.matches(':hover, :focus-within')) hide(); return; }
      const range = sel.getRangeAt(0);
      if (!root.contains(range.commonAncestorContainer)) return;
      const pieces = piecesFrom(root, range);
      if (!pieces.length) return;
      pending = pieces;
      bar.hidden = false;
    }, 140);
  };

  /**
   * Save pending pieces as highlights.
   * @param {string} color Colour.
   * @param {string} [note=''] Note text.
   * @returns {object[]} Saved highlights.
   */
  const save = (color, note = '') => {
    if (!pending) return [];
    const saved = pending.map((p) => {
      const h = addHighlight({ lesson: lessonId, bid: p.bid, start: p.start, end: p.end, text: p.text, color, note });
      wrap(p.block, p.start, p.end, h);
      return h;
    });
    window.getSelection()?.removeAllRanges();
    hide();
    return saved;
  };

  /** Toolbar actions. */
  const onBar = async (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.c) { save(b.dataset.c); return; }
    if (b.dataset.act === 'close') { window.getSelection()?.removeAllRanges(); hide(); return; }
    if (!pending) return;
    const snippet = pending.map((p) => p.text).join(' … ');
    if (b.dataset.act === 'note') {
      const keep = pending;
      const note = await openModal({
        title: 'Add a note', body: `<blockquote class="quote">${esc(snippet)}</blockquote><label class="field">Your note<textarea id="note-in" rows="4" placeholder="Explain it in your own words…"></textarea></label>`,
        actions: [{ label: 'Cancel', value: null }, { label: 'Save note', kind: 'primary', value: (el) => $('#note-in', el).value.trim() }],
      });
      if (note === null) return;
      pending = keep;
      save('green', note);
      toast('Note saved. Find it under Notes.', { kind: 'good' });
    }
    if (b.dataset.act === 'ask') {
      const q = await openModal({
        title: 'Save a question', body: `<p>Not sure about this part? Write your question and it will be saved in Notes, ready to share with your teacher or parent.</p><blockquote class="quote">${esc(snippet)}</blockquote><label class="field">Your question<textarea id="q-in" rows="3" placeholder="What I don't get is…"></textarea></label>`,
        actions: [{ label: 'Cancel', value: null }, { label: 'Save question', kind: 'primary', value: (el) => $('#q-in', el).value.trim() }],
      });
      if (!q) return;
      addQuestion({ lesson: lessonId, lessonTitle, text: q, context: snippet });
      window.getSelection()?.removeAllRanges();
      hide();
      toast('Question saved under Notes.', { kind: 'good' });
    }
  };

  /** Keep the selection alive when tapping the toolbar. */
  const keep = (ev) => { if (ev.target.closest('button')) ev.preventDefault(); };

  /** Tap an existing highlight to edit it. */
  const onMark = async (ev) => {
    const m = ev.target.closest('mark.hl');
    if (!m || !window.getSelection().isCollapsed) return;
    const id = m.dataset.hl;
    const h = lessonHighlights(lessonId).find((x) => x.id === id);
    if (!h) return;
    const res = await openModal({
      title: 'Highlight', body: `<blockquote class="quote hlq hl-${h.color}">${esc(h.text)}</blockquote>
        <div class="swatches" role="radiogroup" aria-label="Colour">${['green', 'pink', 'yellow'].map((c) => `<button type="button" class="swatch sw-${c} ${c === h.color ? 'on' : ''}" data-c="${c}" aria-label="${c}"></button>`).join('')}</div>
        <label class="field">Note<textarea id="note-ed" rows="4">${esc(h.note || '')}</textarea></label>`,
      onMount: (el) => {
        $$('.swatches .swatch', el).forEach((s) => s.addEventListener('click', () => { $$('.swatches .swatch', el).forEach((x) => x.classList.toggle('on', x === s)); }));
      },
      actions: [
        { label: 'Delete', value: 'delete', kind: 'danger' },
        { label: 'Save', kind: 'primary', value: (el) => ({ color: $('.swatches .on', el)?.dataset.c || h.color, note: $('#note-ed', el).value.trim() }) },
      ],
    });
    if (res === 'delete') { removeHighlight(id); unwrap(root, id); toast('Highlight removed.'); return; }
    if (res && typeof res === 'object') {
      updateHighlight(id, res);
      $$(`mark[data-hl="${id}"]`, root).forEach((x) => { x.className = `hl hl-${res.color}${res.note ? ' has-note' : ''}`; });
    }
  };

  document.addEventListener('selectionchange', onSel);
  bar.addEventListener('click', onBar);
  bar.addEventListener('pointerdown', keep);
  bar.addEventListener('mousedown', keep);
  root.addEventListener('click', onMark);
  return () => {
    document.removeEventListener('selectionchange', onSel);
    bar.removeEventListener('click', onBar);
    bar.removeEventListener('pointerdown', keep);
    bar.removeEventListener('mousedown', keep);
    root.removeEventListener('click', onMark);
    hide();
  };
}
