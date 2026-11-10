/**
 * date.js — local-date helpers. Days are keyed 'YYYY-MM-DD' in the device's time zone.
 */

/**
 * Key for a date in local time.
 * @param {Date} [d=new Date()] Date to convert.
 * @returns {string} 'YYYY-MM-DD'.
 */
export function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Parse a day key back to a Date at local midnight.
 * @param {string} key 'YYYY-MM-DD'.
 * @returns {Date} Date object.
 */
export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Add days to a day key.
 * @param {string} key Start day.
 * @param {number} n Days to add (may be negative).
 * @returns {string} New day key.
 */
export function addDays(key, n) {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

/**
 * Whole days from a to b (b − a).
 * @param {string} a Day key.
 * @param {string} b Day key.
 * @returns {number} Difference in days.
 */
export function daysBetween(a, b) {
  return Math.round((fromKey(b) - fromKey(a)) / 86400000);
}

/**
 * Short readable date, e.g. '10 Nov'.
 * @param {number|string|Date} t Timestamp, key or Date.
 * @returns {string} Formatted date.
 */
export function shortDate(t) {
  const d = typeof t === 'string' ? fromKey(t) : new Date(t);
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
}
