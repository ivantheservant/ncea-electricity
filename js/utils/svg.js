/**
 * svg.js — circuit-diagram drawing kit (IEC / NZ-textbook style symbols).
 * Every function returns an SVG markup string, so diagrams can live inside content files.
 * Styling comes from CSS (.dia), so diagrams follow light/dark themes automatically.
 */

/** Half-length of each symbol body along the wire. */
const HALF = {
  cell: 4, battery: 12, bulb: 12, resistor: 16, variable: 16, 'switch-open': 14, 'switch-closed': 14,
  ammeter: 12, voltmeter: 12, ohmmeter: 12, fuse: 14, ldr: 18, thermistor: 16, diode: 8, led: 8,
  motor: 12, capacitor: 4, ac: 12, gap: 14, heater: 16,
};

/**
 * Draw the symbol body in local coordinates (centred at 0,0, wire along +x).
 * @param {string} type Component type.
 * @param {object} o Options (lit, flip).
 * @returns {string} SVG markup.
 */
function body(type, o) {
  switch (type) {
    case 'cell':
      return `<line x1="-4" y1="-14" x2="-4" y2="14"/><line x1="4" y1="-7" x2="4" y2="7" class="thick"/>`;
    case 'battery':
      return `<line x1="-12" y1="-14" x2="-12" y2="14"/><line x1="-4" y1="-7" x2="-4" y2="7" class="thick"/>` +
        `<line x1="4" y1="-14" x2="4" y2="14"/><line x1="12" y1="-7" x2="12" y2="7" class="thick"/>`;
    case 'bulb':
      return `${o.lit ? `<circle r="21" class="halo" style="opacity:${o.lit}"/>` : ''}` +
        `<circle r="12" class="${o.lit ? 'bulb-lit' : 'bulb-off'}"/>` +
        `<line x1="-8.5" y1="-8.5" x2="8.5" y2="8.5"/><line x1="-8.5" y1="8.5" x2="8.5" y2="-8.5"/>`;
    case 'resistor':
    case 'heater':
      return `<rect x="-16" y="-7" width="32" height="14" class="${type === 'heater' ? 'hatch' : ''}"/>`;
    case 'variable':
      return `<rect x="-16" y="-7" width="32" height="14"/><line x1="-14" y1="13" x2="13" y2="-12" marker-end="url(#arrowhead)"/>`;
    case 'switch-open':
      return `<line x1="-14" y1="0" x2="11" y2="-12"/><circle cx="-14" cy="0" r="2.6" class="solid"/><circle cx="14" cy="0" r="2.6" class="solid"/>`;
    case 'switch-closed':
      return `<line x1="-14" y1="0" x2="14" y2="0"/><circle cx="-14" cy="0" r="2.6" class="solid"/><circle cx="14" cy="0" r="2.6" class="solid"/>`;
    case 'ammeter':
    case 'voltmeter':
    case 'ohmmeter':
    case 'motor':
      return `<circle r="12" class="meter"/>`;
    case 'fuse':
      return `<rect x="-14" y="-5" width="28" height="10"/><line x1="-14" y1="0" x2="14" y2="0"/>`;
    case 'ldr':
      return `<circle r="18"/><rect x="-12" y="-5" width="24" height="10"/>` +
        `<line x1="-18" y1="-30" x2="-8" y2="-19" marker-end="url(#arrowhead)"/><line x1="-6" y1="-32" x2="4" y2="-21" marker-end="url(#arrowhead)"/>`;
    case 'thermistor':
      return `<rect x="-16" y="-7" width="32" height="14"/><polyline points="-20,13 -13,13 13,-13"/>`;
    case 'diode':
      return `<polygon points="-8,-9 -8,9 8,0" class="solid"/><line x1="8" y1="-9" x2="8" y2="9"/>`;
    case 'led':
      return `<polygon points="-8,-9 -8,9 8,0" class="solid"/><line x1="8" y1="-9" x2="8" y2="9"/>` +
        `<line x1="0" y1="-12" x2="8" y2="-21" marker-end="url(#arrowhead)"/><line x1="7" y1="-9" x2="15" y2="-18" marker-end="url(#arrowhead)"/>`;
    case 'capacitor':
      return `<line x1="-4" y1="-13" x2="-4" y2="13"/><line x1="4" y1="-13" x2="4" y2="13"/>`;
    case 'ac':
      return `<circle r="12"/><path d="M-7 0 C-5 -7 -2 -7 0 0 S5 7 7 0"/>`;
    case 'gap':
      return `<circle cx="-14" cy="0" r="2.6" class="solid"/><circle cx="14" cy="0" r="2.6" class="solid"/>`;
    default:
      return '';
  }
}

const LETTER = { ammeter: 'A', voltmeter: 'V', ohmmeter: 'Ω', motor: 'M' };

/**
 * Place a component on a straight horizontal or vertical wire from (x1,y1) to (x2,y2).
 * @param {string} type Component type (see HALF keys).
 * @param {number} x1 Start x.
 * @param {number} y1 Start y.
 * @param {number} x2 End x.
 * @param {number} y2 End y.
 * @param {object} [o] Options: label, labelPos ('above'|'below'|'left'|'right'), lit (0–1),
 *   signs (show + and − on cells), id (data-id), cls (extra class), at (0–1 position along wire).
 * @returns {string} SVG markup.
 */
export function comp(type, x1, y1, x2, y2, o = {}) {
  const horiz = Math.abs(y2 - y1) < Math.abs(x2 - x1);
  const len = horiz ? x2 - x1 : y2 - y1;
  const dir = Math.sign(len) || 1;
  const t = o.at ?? 0.5;
  const cx = horiz ? x1 + len * t : x1;
  const cy = horiz ? y1 : y1 + len * t;
  const h = HALF[type] ?? 12;
  const angle = horiz ? (dir > 0 ? 0 : 180) : (dir > 0 ? 90 : -90);
  const s = horiz ? [cx - h * dir, cy] : [cx, cy - h * dir];
  const e = horiz ? [cx + h * dir, cy] : [cx, cy + h * dir];
  let out = `<g class="comp comp-${type} ${o.cls || ''}"${o.id ? ` data-id="${o.id}"` : ''}>`;
  out += `<line x1="${x1}" y1="${y1}" x2="${s[0]}" y2="${s[1]}"/>`;
  out += `<line x1="${e[0]}" y1="${e[1]}" x2="${x2}" y2="${y2}"/>`;
  out += `<g transform="translate(${cx} ${cy}) rotate(${angle})">${body(type, o)}</g>`;
  if (LETTER[type]) out += `<text x="${cx}" y="${cy + 5}" class="meter-letter" text-anchor="middle">${LETTER[type]}</text>`;
  if (o.signs && (type === 'cell' || type === 'battery')) {
    const plus = horiz ? [cx - (h + 6) * dir, cy - 18] : [cx + 18, cy - (h + 4) * dir];
    const minus = horiz ? [cx + (h + 6) * dir, cy - 18] : [cx + 18, cy + (h + 10) * dir];
    out += `<text x="${plus[0]}" y="${plus[1]}" class="sign" text-anchor="middle">+</text>`;
    out += `<text x="${minus[0]}" y="${minus[1]}" class="sign" text-anchor="middle">−</text>`;
  }
  if (o.label) {
    const pos = o.labelPos || (horiz ? 'above' : 'right');
    const off = (type === 'ldr' ? 36 : 24);
    const p = { above: [cx, cy - off], below: [cx, cy + off + 8], left: [cx - off - 4, cy + 5], right: [cx + off + 4, cy + 5] }[pos];
    const anchor = pos === 'left' ? 'end' : pos === 'right' ? 'start' : 'middle';
    out += `<text x="${p[0]}" y="${p[1]}" class="lbl" text-anchor="${anchor}">${o.label}</text>`;
  }
  return out + '</g>';
}

/**
 * Plain wire through a list of points.
 * @param {...number[]} pts Points as [x, y] pairs.
 * @returns {string} SVG polyline.
 */
export function wire(...pts) {
  return `<polyline class="wire" points="${pts.map((p) => p.join(',')).join(' ')}"/>`;
}

/**
 * Junction dot.
 * @param {number} x X.
 * @param {number} y Y.
 * @returns {string} SVG circle.
 */
export function dot(x, y) {
  return `<circle cx="${x}" cy="${y}" r="3.4" class="solid junction"/>`;
}

/**
 * Text label.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {string} text Label text (may contain <tspan>).
 * @param {object} [o] Options: anchor ('start'|'middle'|'end'), cls.
 * @returns {string} SVG text.
 */
export function label(x, y, text, o = {}) {
  return `<text x="${x}" y="${y}" class="lbl ${o.cls || ''}" text-anchor="${o.anchor || 'middle'}">${text}</text>`;
}

/**
 * Small filled arrowhead showing current direction at a point.
 * @param {number} x X of the arrow tip centre.
 * @param {number} y Y.
 * @param {'right'|'left'|'up'|'down'} dir Direction.
 * @param {object} [o] Options: label, cls.
 * @returns {string} SVG markup.
 */
export function flow(x, y, dir, o = {}) {
  const rot = { right: 0, down: 90, left: 180, up: -90 }[dir];
  let s = `<g class="flow ${o.cls || ''}" transform="translate(${x} ${y}) rotate(${rot})"><polygon points="-6,-6 6,0 -6,6"/></g>`;
  if (o.label) {
    const off = dir === 'left' || dir === 'right' ? [0, -12] : [14, 4];
    s += `<text x="${x + off[0]}" y="${y + off[1]}" class="lbl small" text-anchor="${dir === 'up' || dir === 'down' ? 'start' : 'middle'}">${o.label}</text>`;
  }
  return s;
}

/**
 * Line with an arrowhead.
 * @param {number} x1 Start x.
 * @param {number} y1 Start y.
 * @param {number} x2 End x.
 * @param {number} y2 End y.
 * @param {string} [cls=''] Extra class (e.g. 'field', 'accent').
 * @returns {string} SVG line.
 */
export function arrow(x1, y1, x2, y2, cls = '') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="arrow ${cls}" marker-end="url(#arrowhead)"/>`;
}

/**
 * Earth symbol hanging below a point.
 * @param {number} x X.
 * @param {number} y Y of the connection point.
 * @returns {string} SVG markup.
 */
export function earth(x, y) {
  return `<g class="comp comp-earth"><line x1="${x}" y1="${y}" x2="${x}" y2="${y + 12}"/>` +
    `<line x1="${x - 12}" y1="${y + 12}" x2="${x + 12}" y2="${y + 12}"/>` +
    `<line x1="${x - 8}" y1="${y + 17}" x2="${x + 8}" y2="${y + 17}"/>` +
    `<line x1="${x - 4}" y1="${y + 22}" x2="${x + 4}" y2="${y + 22}"/></g>`;
}

/**
 * A charge marker (+ or −) in a small circle.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {'+'|'-'} sign Sign.
 * @param {number} [r=7] Radius.
 * @returns {string} SVG markup.
 */
export function charge(x, y, sign, r = 7) {
  const cls = sign === '+' ? 'q-pos' : 'q-neg';
  const bar = `<line x1="${x - r * 0.55}" y1="${y}" x2="${x + r * 0.55}" y2="${y}"/>`;
  const vert = sign === '+' ? `<line x1="${x}" y1="${y - r * 0.55}" x2="${x}" y2="${y + r * 0.55}"/>` : '';
  return `<g class="q ${cls}"><circle cx="${x}" cy="${y}" r="${r}"/>${bar}${vert}</g>`;
}

/**
 * Wrap content in an <svg> with shared defs.
 * @param {number} w Width of viewBox.
 * @param {number} h Height of viewBox.
 * @param {string} inner Markup.
 * @param {object} [o] Options: title (accessible name), cls, maxw (CSS max-width in px).
 * @returns {string} SVG element markup.
 */
let svgCount = 0;
export function svg(w, h, inner, o = {}) {
  // Each diagram gets its own marker id: a marker inside a hidden diagram would not render elsewhere.
  const id = `ah${++svgCount}`;
  return `<svg class="dia ${o.cls || ''}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${o.title || 'Diagram'}"` +
    `${o.maxw ? ` style="max-width:${o.maxw}px"` : ''}>` +
    `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">` +
    `<path d="M0,0 L10,5 L0,10 z" class="arrowhead"/></marker></defs>${inner.replaceAll('url(#arrowhead)', `url(#${id})`)}</svg>`;
}

/**
 * Symbol on its own (for symbol tables and games).
 * @param {string} type Component type.
 * @param {object} [o] Options passed to comp().
 * @returns {string} SVG element markup.
 */
export function symbol(type, o = {}) {
  if (type === 'earth') return svg(80, 60, wire([40, 6], [40, 18]) + earth(40, 18), { title: 'earth symbol', cls: 'sym' });
  if (type === 'junction') return svg(100, 60, wire([10, 30], [90, 30]) + wire([50, 30], [50, 56]) + dot(50, 30), { title: 'junction', cls: 'sym' });
  if (type === 'crossing') return svg(100, 60, wire([10, 30], [90, 30]) + wire([50, 4], [50, 56]), { title: 'wires crossing, not joined', cls: 'sym' });
  if (type === 'supply') return svg(100, 60, comp('cell', 10, 30, 90, 30, { signs: true }), { title: 'cell', cls: 'sym' });
  return svg(100, 60, comp(type, 8, 34, 92, 34, o), { title: type, cls: 'sym' });
}
