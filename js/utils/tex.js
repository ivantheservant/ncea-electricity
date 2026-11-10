/**
 * tex.js — KaTeX rendering. KaTeX is loaded as a global script from /vendor.
 * Inline maths uses $...$ and display maths uses $$...$$ inside content strings.
 */

/**
 * Render all maths inside an element.
 * @param {Element} el Container.
 * @returns {void}
 */
export function renderMath(el) {
  if (!el || typeof window.renderMathInElement !== 'function') return;
  try {
    window.renderMathInElement(el, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
      ignoredClasses: ['no-math'],
    });
  } catch (err) {
    console.warn('Maths render failed', err);
  }
}

/**
 * Render a TeX string to HTML.
 * @param {string} src TeX source.
 * @param {boolean} [display=false] Display mode.
 * @returns {string} HTML (falls back to the escaped source).
 */
export function tex(src, display = false) {
  if (!window.katex) return src;
  try {
    return window.katex.renderToString(src, { throwOnError: false, displayMode: display });
  } catch {
    return src;
  }
}
