/**
 * math.js — number parsing, rounding and formatting for physics answers.
 */

const SUPERSCRIPTS = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+' };

/**
 * Parse a number typed by a student. Accepts '0.25', '2.5e-3', '2.5E3',
 * '2.5 x 10^-3', '2.5×10⁻³', '2.5*10^-3', '1,500', '½' is not supported.
 * @param {string} raw Text from an input box.
 * @returns {number} Parsed value, or NaN when the text is not a number.
 */
export function parseNumber(raw) {
  if (raw == null) return NaN;
  let s = String(raw).trim();
  if (!s) return NaN;
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, (m) => '^' + m.split('').map((c) => SUPERSCRIPTS[c]).join(''));
  s = s.replace(/\s+/g, '').replace(/,(?=\d{3}(\D|$))/g, '').replace(/−/g, '-');
  s = s.replace(',', '.');
  // a × 10^b in any of its spellings
  const m = s.match(/^([+-]?\d*\.?\d+)(?:[x×*·]10\^?\(?([+-]?\d+)\)?)$/i);
  if (m) return parseFloat(m[1]) * Math.pow(10, parseInt(m[2], 10));
  const t = s.match(/^10\^\(?([+-]?\d+)\)?$/);
  if (t) return Math.pow(10, parseInt(t[1], 10));
  if (/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return parseFloat(s);
  return NaN;
}

/**
 * Compare a student's value with the expected answer using a relative tolerance.
 * @param {number} given Student value.
 * @param {number} expected Correct value.
 * @param {number} [relTol=0.02] Allowed relative error (0.02 = 2%).
 * @returns {boolean} True when close enough.
 */
export function approxEqual(given, expected, relTol = 0.02) {
  if (!Number.isFinite(given)) return false;
  if (expected === 0) return Math.abs(given) < 1e-12;
  return Math.abs(given - expected) <= Math.abs(expected) * relTol;
}

/**
 * Round to n significant figures.
 * @param {number} x Value.
 * @param {number} n Number of significant figures (≥1).
 * @returns {number} Rounded value.
 */
export function roundSF(x, n) {
  if (x === 0 || !Number.isFinite(x)) return x;
  const p = n - 1 - Math.floor(Math.log10(Math.abs(x)));
  const f = Math.pow(10, p);
  return Math.round(x * f) / f;
}

/**
 * Count significant figures in a number written as text.
 * Trailing zeros in a whole number without a decimal point are treated as NOT significant.
 * @param {string} s Number as typed, e.g. '0.00450'.
 * @returns {number} Count of significant figures, or NaN if not a plain decimal.
 */
export function countSF(s) {
  let t = String(s).trim().replace(/^[+-]/, '');
  const sci = t.match(/^(\d*\.?\d+)e[+-]?\d+$/i);
  if (sci) t = sci[1];
  if (!/^(\d+\.?\d*|\.\d+)$/.test(t)) return NaN;
  const hasPoint = t.includes('.');
  let digits = t.replace('.', '').replace(/^0+/, '');
  if (!hasPoint) digits = digits.replace(/0+$/, '');
  return digits.length || 1;
}

/**
 * Format a number in scientific notation as HTML (a × 10<sup>n</sup>).
 * Values between 0.001 and 99 999 are written normally.
 * @param {number} x Value.
 * @param {number} [sf=3] Significant figures.
 * @returns {string} HTML string.
 */
export function fmtSci(x, sf = 3) {
  if (!Number.isFinite(x)) return '—';
  if (x === 0) return '0';
  const ax = Math.abs(x);
  if (ax >= 1e-3 && ax < 1e5) return String(roundSF(x, sf));
  const exp = Math.floor(Math.log10(ax));
  let mant = roundSF(x / Math.pow(10, exp), sf);
  let e = exp;
  if (Math.abs(mant) >= 10) { mant /= 10; e += 1; }
  return `${mant} × 10<sup>${e}</sup>`;
}

/**
 * Clamp a number into a range.
 * @param {number} x Value.
 * @param {number} lo Minimum.
 * @param {number} hi Maximum.
 * @returns {number} Clamped value.
 */
export function clamp(x, lo, hi) {
  return Math.min(hi, Math.max(lo, x));
}

/**
 * Random integer in [lo, hi].
 * @param {number} lo Lower bound (inclusive).
 * @param {number} hi Upper bound (inclusive).
 * @returns {number} Random integer.
 */
export function randInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/**
 * Pick a random element.
 * @template T
 * @param {T[]} arr Non-empty array.
 * @returns {T} Random element.
 */
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
