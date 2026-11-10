/**
 * Chapter 3 — Circuits & Symbols.
 */
import { svg, comp, wire, dot, flow, label, symbol } from '../js/utils/svg.js';

const r = String.raw;

/**
 * One loop panel showing current direction.
 * @param {number} ox X offset.
 * @param {boolean} electrons Draw electron flow instead of conventional current.
 * @returns {string} SVG.
 */
function loop(ox, electrons) {
  const cls = electrons ? 'e' : '';
  const d = electrons ? { left: 'up', bottom: 'left', right: 'down' } : { left: 'down', bottom: 'right', right: 'up' };
  return comp('cell', ox + 40, 34, ox + 190, 34, { signs: true }) + wire([ox + 40, 34], [ox + 40, 130]) + comp('bulb', ox + 40, 130, ox + 190, 130, { lit: 0.9 }) + wire([ox + 190, 130], [ox + 190, 34]) +
    flow(ox + 40, 82, d.left, { cls }) + flow(ox + 150, 130, d.bottom, { cls }) + flow(ox + 190, 82, d.right, { cls }) +
    label(ox + 115, 172, electrons ? 'Electron flow: − to +' : 'Conventional current: + to −', { cls: 'bold' });
}
const FLOW = svg(480, 186, loop(10, false) + loop(250, true), { title: 'Conventional current flows from + to −; electrons flow from − to +', maxw: 520 });

const SERIES = svg(440, 210, [
  comp('battery', 40, 170, 40, 50, { signs: true, label: '6.0 V', labelPos: 'left' }),
  comp('ammeter', 40, 50, 110, 50, { label: '0.20 A' }), comp('bulb', 110, 50, 190, 50, { label: '1' }), comp('ammeter', 190, 50, 260, 50, { label: '0.20 A' }),
  comp('bulb', 260, 50, 340, 50, { label: '2' }), wire([340, 50], [390, 50]), comp('ammeter', 390, 50, 390, 170, { label: '0.20 A', labelPos: 'right' }), wire([390, 170], [40, 170]),
  wire([125, 50], [125, 110], [134, 110]), comp('voltmeter', 125, 110, 175, 110), wire([166, 110], [175, 110], [175, 50]), label(150, 140, '2.5 V'),
  wire([275, 50], [275, 110], [284, 110]), comp('voltmeter', 275, 110, 325, 110), wire([316, 110], [325, 110], [325, 50]), label(300, 140, '3.5 V'),
  dot(125, 50), dot(175, 50), dot(275, 50), dot(325, 50),
].join(''), { title: 'Series circuit: the same current everywhere, voltages add up to the supply', maxw: 480 });

const PARALLEL = svg(400, 230, [
  comp('battery', 40, 200, 40, 50, { signs: true, label: '6.0 V', labelPos: 'left' }),
  comp('ammeter', 40, 50, 130, 50, { label: '0.75 A' }), wire([130, 50], [310, 50]),
  comp('ammeter', 180, 50, 180, 115, { label: '0.30 A', labelPos: 'right' }), comp('bulb', 180, 115, 180, 200, { label: '1', labelPos: 'right', lit: 0.8 }),
  comp('ammeter', 310, 50, 310, 115, { label: '0.45 A', labelPos: 'right' }), comp('bulb', 310, 115, 310, 200, { label: '2', labelPos: 'right', lit: 1 }),
  wire([40, 200], [310, 200]), dot(180, 50), dot(180, 200),
  label(245, 222, 'Each branch has the full 6.0 V across it'),
].join(''), { title: 'Parallel circuit: branch currents add up to the total current', maxw: 440 });

const SHORT = svg(360, 190, [
  comp('battery', 40, 160, 40, 50, { signs: true, labelPos: 'left' }), wire([40, 50], [300, 50]),
  comp('bulb', 300, 50, 300, 160, { label: 'bulb (off)', labelPos: 'right' }), wire([300, 160], [40, 160]),
  '<polyline points="250,50 250,160" style="stroke:var(--bad);stroke-width:3.5"/>', dot(250, 50), dot(250, 160),
  flow(250, 105, 'down', { cls: 'e' }), label(240, 108, 'short circuit', { anchor: 'end', cls: 'bold' }),
].join(''), { title: 'A wire across a bulb short-circuits it', maxw: 400 });

const MIXED = svg(420, 200, [
  comp('battery', 40, 180, 40, 60, { signs: true, label: '9.0 V', labelPos: 'left' }), wire([40, 60], [90, 60]),
  comp('bulb', 90, 60, 170, 60, { label: 'A' }), wire([170, 60], [250, 60]), comp('bulb', 250, 60, 330, 60, { label: 'B' }), wire([330, 60], [370, 60], [370, 180], [40, 180]),
  wire([220, 60], [220, 130], [250, 130]), comp('bulb', 250, 130, 330, 130, { label: 'C', labelPos: 'below' }), wire([330, 130], [370, 130]), dot(220, 60), dot(370, 130),
].join(''), { title: 'Bulb A in series with bulbs B and C in parallel', maxw: 460 });

const SYMBOLS = [
  ['cell', 'Cell', 'Long line = positive (+), short thick line = negative (−).'],
  ['battery', 'Battery', 'Two or more cells joined in series.'],
  ['switch-open', 'Switch (open)', 'Gap in the circuit — no current.'],
  ['switch-closed', 'Switch (closed)', 'Complete path — current flows.'],
  ['bulb', 'Lamp (bulb)', 'Transforms electrical energy to light and heat.'],
  ['resistor', 'Resistor', 'Fixed resistance. NZ uses the rectangle (US books draw a zig-zag).'],
  ['variable', 'Variable resistor', 'Resistance can be adjusted, e.g. a dimmer or rheostat.'],
  ['ldr', 'LDR', 'Resistance falls in brighter light.'],
  ['thermistor', 'Thermistor', 'Resistance falls as temperature rises.'],
  ['diode', 'Diode', 'Lets current through in one direction only (the way the triangle points).'],
  ['led', 'LED', 'A diode that gives out light.'],
  ['fuse', 'Fuse', 'Thin wire that melts if the current is too big.'],
  ['ammeter', 'Ammeter', 'Measures current. Connect in series.'],
  ['voltmeter', 'Voltmeter', 'Measures voltage. Connect in parallel.'],
  ['motor', 'Motor', 'Transforms electrical energy to kinetic energy.'],
  ['ac', 'AC supply', 'Alternating current, such as mains (Chapter 8).'],
  ['junction', 'Junction', 'Dot = wires joined.'],
  ['crossing', 'Crossing wires', 'No dot = wires cross without connecting.'],
  ['earth', 'Earth', 'Connection to the ground.'],
];
const SYMBOL_TABLE = `<div class="tablewrap"><table><thead><tr><th>Symbol</th><th>Name</th><th>What it does</th></tr></thead><tbody>${SYMBOLS.map(([t, n, d]) => `<tr><td class="no-hl" style="width:120px">${symbol(t)}</td><td><b>${n}</b></td><td>${d}</td></tr>`).join('')}</tbody></table></div>`;

export default {
  intro: 'Time to put charge to work. This chapter covers how circuits are built and drawn, how current and voltage behave in series and parallel, and how to measure them — the foundation for every calculation that follows.',
  standards: 'Year 10 science; simple electrical circuits are a physical system in NCEA Level 1 AS 92047, and circuits are a full question in Level 2 AS 91173.',
  lessons: [
    // ------------------------------------------------------------------ 3.1
    {
      id: '3.1', title: 'What makes a circuit work', levels: ['Y10'], minutes: 14,
      objectives: ['Name the parts every working circuit needs', 'Explain open, closed and short circuits', 'Explain conventional current and electron flow'],
      sections: [
        { type: 'text', title: 'Every circuit needs…', html: r`<ol><li>An <b>energy source</b> — a cell, battery or power supply — that pushes charge round.</li><li>A <b>complete loop of conductors</b> so charge can go out and come back.</li><li>A <b>load</b> — a component that transforms electrical energy into something useful (light, heat, motion, sound).</li><li>Usually a <b>switch</b> to control it.</li></ol>
<p>A <b>closed</b> circuit is a complete loop: current flows. An <b>open</b> circuit has a gap (an open switch, a broken wire, a blown bulb): no current flows anywhere in that loop.</p>` },
        { type: 'text', title: 'Charges carry energy — they are not used up', html: r`<p>A common idea is that a bulb “uses up” current. It doesn’t. The same amount of charge that leaves the battery comes back to it every second. What changes is the <b>energy</b> the charges carry: the battery gives each coulomb of charge energy, and the charge transfers that energy in the load. The charge itself goes round and round, like a bike chain carrying energy from the pedals to the wheel.</p>` },
        { type: 'text', title: 'Which way does current flow?', html: r`<p>In a metal wire the moving charges are <b>electrons</b>, and they drift from the <b>negative terminal round to the positive terminal</b>. But in circuit diagrams we always draw <b>conventional current</b>, flowing from <b>positive to negative</b>.</p>
<p>Why two directions? In the 1700s scientists (including Benjamin Franklin) decided current was a flow of positive charge, from + to −. The electron wasn’t discovered until 1897. By then every textbook and rule used the + to − direction, so we kept it. Both describe the same current — negative charge moving one way has the same effect as positive charge moving the other way.</p>
<p>Your notes say current “represents the positive flow” — exactly right. One correction: positive ions in a metal are atoms that have <i>lost</i> electrons (not gained protons), and in a metal they stay fixed. Only in liquids and gases do positive ions actually move.</p>` },
        { type: 'diagram', svg: FLOW, caption: 'Same circuit, two descriptions. NCEA diagrams use conventional current (left).' },
        { type: 'text', title: 'Short circuits', html: r`<p>A <b>short circuit</b> is a low-resistance path that lets current bypass the load. Because there is almost no resistance, a very large current flows. The wires heat up, the battery drains fast, and in mains wiring this can start a fire — which is why fuses and circuit breakers exist.</p>` },
        { type: 'diagram', svg: SHORT, caption: 'Almost all the current takes the easy path through the red wire, so the bulb goes out.' },
        { type: 'tip', html: 'A water-pipe picture helps: the battery is a pump, wires are pipes, the bulb is a narrow section, current is the flow rate and voltage is the pressure difference. But remember it is only a model — electrons don’t leak out of a cut wire!' },
        { type: 'misconception', wrong: 'Current is used up by the bulb, so less current comes back to the battery.', right: 'Current is the same going in and coming out. Energy is transferred in the bulb; the charge is not used up.' },
        { type: 'funfact', title: 'Thomson’s electron', html: 'In 1897 J. J. Thomson showed that “cathode rays” are streams of tiny negative particles about 1800 times lighter than a hydrogen atom — the electron. By then, the + to − convention was over 140 years old.' },
        { type: 'key', points: ['A circuit needs a source, a complete loop, and a load (plus usually a switch).', 'Open circuit = gap = no current anywhere in that loop.', 'Charge is not used up; energy is transferred.', 'Conventional current: + to −. Electrons: − to +.', 'Short circuit: low-resistance bypass → very large current.'] },
      ],
      checkpoint: [
        { type: 'multi', q: 'Which are needed for a bulb to light? Select all that apply.', options: ['An energy source', 'A complete loop of conductors', 'A load (the bulb)', 'An ammeter'], answer: [0, 1, 2], explain: 'An ammeter only measures current; it is not needed for the circuit to work.' },
        { type: 'mcq', q: 'In circuit diagrams, conventional current flows…', options: ['from the positive terminal to the negative terminal', 'from the negative terminal to the positive terminal', 'both ways at once', 'only inside the battery'], answer: 0, explain: 'Conventional current is defined as the direction positive charge would flow: + to −.' },
        { type: 'mcq', q: 'In a copper wire, the electrons actually move…', options: ['from − to + around the external circuit', 'from + to − around the external circuit', 'only inside the battery', 'back and forth in a DC circuit'], answer: 0, explain: 'Electrons are negative, so they are attracted to the positive terminal.' },
        { type: 'tf', q: 'A bulb uses up some of the current, so the current leaving the bulb is smaller than the current entering it.', answer: false, explain: 'Charge is conserved. The bulb transfers energy, not charge.' },
        { type: 'mcq', q: 'A wire is connected across a bulb’s terminals. What happens?', options: ['The bulb goes out and a large current flows through the wire', 'The bulb gets brighter', 'Nothing changes', 'The current stops completely'], answer: 0, explain: 'The wire is a short circuit: a low-resistance path bypassing the bulb.' },
      ],
    },
    // ------------------------------------------------------------------ 3.2
    {
      id: '3.2', title: 'Circuit symbols and diagrams', levels: ['Y10'], minutes: 12,
      objectives: ['Recognise and draw standard circuit symbols', 'Follow the rules for neat circuit diagrams'],
      sections: [
        { type: 'text', title: 'Why symbols?', html: r`<p>Circuit diagrams use standard symbols so anyone in the world can read them. Diagrams show <b>how components are connected</b>, not what they look like or where they sit on the bench.</p>` },
        { type: 'text', title: 'The symbols you need', html: SYMBOL_TABLE },
        { type: 'sim', sim: 'symbol-spotter', caption: 'Ten quick rounds. Can you get them all?' },
        { type: 'text', title: 'Rules for neat diagrams', html: r`<ul><li>Use a ruler: straight lines and right-angled corners.</li><li>Don’t put components on corners.</li><li>Put a <b>dot</b> where wires join; no dot where they just cross.</li><li>Label components (bulb 1, R₁, 6.0 V…).</li><li>Keep the cell’s long line (+) consistent with the current arrows you draw.</li></ul>` },
        { type: 'misconception', wrong: 'In a cell symbol, the short thick line is positive because it looks “bigger”.', right: 'The long thin line is positive (+). The short thick line is negative (−).' },
        { type: 'funfact', title: 'bulb or lamp?', html: 'You may see two lamp symbols: a circle with a cross (used in your notes and NZ exams) and a circle with a little loop inside (a filament). Both mean a lamp.' },
        { type: 'key', points: ['Cell: long line +, short line −.', 'Ammeter in series; voltmeter in parallel.', 'Dot = joined; no dot = crossing.', 'Straight lines, square corners, no components on corners.'] },
      ],
      checkpoint: [
        { type: 'match', q: 'Match each symbol description to its component.', pairs: [['Circle with A', 'Ammeter'], ['Circle with V', 'Voltmeter'], ['Rectangle', 'Resistor'], ['Circle with a cross', 'Lamp']], explain: 'These four come up in almost every circuit question.' },
        { type: 'mcq', q: 'In a cell symbol, which line is the positive terminal?', options: ['The long thin line', 'The short thick line', 'Either — it does not matter', 'Neither; cells have no positive'], answer: 0, explain: 'Long = positive, short = negative.' },
        { type: 'mcq', q: 'Which component lets current through in one direction only?', options: ['Diode', 'Resistor', 'Fuse', 'Lamp'], answer: 0, explain: 'A diode conducts in the direction its triangle points.' },
        { type: 'mcq', q: 'Two wires cross on a diagram with no dot. This means…', options: ['they are not connected', 'they are connected', 'there is a switch there', 'there is a fuse there'], answer: 0, explain: 'Only a dot shows a junction.' },
        { type: 'mcq', q: 'Which symbol is a component whose resistance falls as light increases?', options: ['LDR', 'Thermistor', 'Variable resistor', 'Fuse'], answer: 0, explain: 'LDR = light-dependent resistor.' },
      ],
    },
    // ------------------------------------------------------------------ 3.3
    {
      id: '3.3', title: 'Series circuits', levels: ['Y10', 'L1'], minutes: 16,
      objectives: ['Describe current and voltage in a series circuit', 'Calculate missing currents and voltages', 'Explain why bulbs dim when more are added in series'],
      sections: [
        { type: 'text', title: 'One path', html: r`<p>In a <b>series</b> circuit, components are connected one after another so there is <b>only one path</b> for the current.</p>
<p><b>Current is the same everywhere.</b> Every coulomb that passes through bulb 1 must also pass through bulb 2. From your notes: $I_1 = I_2 = I_3$.</p>
<p><b>Voltage is shared.</b> The supply voltage is split between the components: $V_{supply} = V_1 + V_2 + \dots$ (your notes: $V_1 = V_2 + V_3$).</p>` },
        { type: 'diagram', svg: SERIES, caption: 'All three ammeters read 0.20 A. The bulb voltages 2.5 V + 3.5 V add up to the 6.0 V supply.' },
        { type: 'text', title: 'Why the voltage is shared', html: r`<p>Voltage is <b>energy per coulomb</b>. A 6.0 V battery gives each coulomb 6.0 J of energy. Going round the loop, the coulomb transfers <b>all</b> of that energy to the components — some in bulb 1, the rest in bulb 2. So the voltages must add up to the supply voltage. (This is energy conservation, called Kirchhoff’s voltage law at Level 3.)</p>
<p>How is it split? <b>In proportion to resistance.</b> The component with the bigger resistance gets the bigger share. Two identical bulbs share equally.</p>` },
        { type: 'misconception', title: 'Checking a note', wrong: 'Resistors in series have different voltages because the current loses energy at the first one, so it has less energy for the second.', right: 'Each resistor’s voltage depends on its resistance (V = IR, with the same I for both). Identical resistors get identical voltages, whichever comes first. The order doesn’t matter.' },
        { type: 'sim', sim: 'series-parallel', caption: 'Start in Series. Add bulbs, then remove one and watch the others.' },
        { type: 'text', title: 'Adding bulbs; breaking bulbs', html: r`<ul><li><b>More bulbs in series → each is dimmer.</b> The total resistance goes up, so less current flows, and each bulb also gets a smaller share of the voltage.</li><li><b>One bulb breaks → all go out.</b> The single path is broken. Old Christmas lights were wired like this, which is why one dead bulb killed the whole string.</li></ul>` },
        { type: 'example', title: 'missing values', q: r`<p>A 9.0 V battery is connected in series with two lamps. The voltage across lamp 1 is 4.0 V. The ammeter next to the battery reads 0.30 A. Find the voltage across lamp 2 and the current through it.</p>`, steps: [r`Voltages add up: $V_2 = 9.0 - 4.0$.`, r`$V_2 = 5.0$ V.`, r`Series: current is the same everywhere, so $I_2 = 0.30$ A.`], answer: '<p>5.0 V across lamp 2; 0.30 A through it.</p>' },
        { type: 'try', question: { type: 'num', q: 'Three identical bulbs are in series with a 12 V battery. What is the voltage across each bulb?', answer: 4, unit: 'V', explain: 'Identical bulbs share the voltage equally: 12 ÷ 3 = 4.0 V each.' } },
        { type: 'key', points: ['One path; the current is the same everywhere.', 'Voltages add up to the supply voltage.', 'Bigger resistance gets a bigger share of the voltage.', 'More bulbs → dimmer; one breaks → all off.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 6.0 V battery powers two lamps in series. The voltage across lamp 1 is 2.2 V. What is the voltage across lamp 2?', answer: 3.8, unit: 'V', explain: '6.0 − 2.2 = 3.8 V.' },
        { type: 'num', q: 'In a series circuit an ammeter before the first lamp reads 0.45 A. What will an ammeter after the last lamp read?', answer: 0.45, unit: 'A', explain: 'Current is the same everywhere in a series circuit.' },
        { type: 'mcq', q: 'A third identical bulb is added in series with two others. The bulbs…', options: ['all become dimmer', 'all stay the same', 'all become brighter', 'only the new one is dim'], answer: 0, explain: 'Total resistance increases, so the current falls, and each bulb gets a smaller share of the voltage.' },
        { type: 'mcq', q: 'In a series circuit with a 4 Ω and an 8 Ω resistor, which has the larger voltage across it?', options: ['The 8 Ω resistor', 'The 4 Ω resistor', 'They are equal', 'It depends on which comes first'], answer: 0, explain: 'Same current, so V = IR is larger for the larger resistance. (It gets 2/3 of the supply voltage.)' },
        { type: 'mcq', q: 'One bulb in a series string breaks. What happens to the others?', options: ['They all go out', 'They get brighter', 'They stay the same', 'Only the next bulb goes out'], answer: 0, explain: 'There is only one path, so the whole circuit is broken.' },
      ],
    },
    // ------------------------------------------------------------------ 3.4
    {
      id: '3.4', title: 'Parallel circuits', levels: ['Y10', 'L1'], minutes: 16,
      objectives: ['Describe current and voltage in a parallel circuit', 'Use the junction rule to find branch currents', 'Explain why homes are wired in parallel'],
      sections: [
        { type: 'text', title: 'More than one path', html: r`<p>In a <b>parallel</b> circuit there are <b>two or more branches</b>, each a separate path between the same two points.</p>
<p><b>Voltage is the same across each branch</b> — every branch is connected directly across the supply. Your notes: $V_1 = V_2 = V_3$.</p>
<p><b>Currents add up.</b> At a junction the current splits; where the branches rejoin it combines again: $I_{total} = I_1 + I_2$ (your notes: $I_1 = I_2 + I_3$).</p>` },
        { type: 'diagram', svg: PARALLEL, caption: '0.30 A + 0.45 A = 0.75 A. The branch with lower resistance (bulb 2) takes more current.' },
        { type: 'text', title: 'The junction rule', html: r`<p>Charge cannot pile up at a junction or vanish, so <b>the total current into a junction equals the total current out</b>. This is conservation of charge, called <b>Kirchhoff’s current law</b> at Level 3.</p>
<p>Which branch gets more current? The one with <b>less resistance</b> — the easier path. Equal branches share equally.</p>` },
        { type: 'sim', sim: 'series-parallel', caption: 'Switch to Parallel. Remove one bulb and watch the others and the ammeter.' },
        { type: 'text', title: 'Adding bulbs; breaking bulbs', html: r`<ul><li><b>Each bulb is as bright as it would be on its own</b>, because each gets the full supply voltage (for an ideal battery).</li><li><b>Adding branches increases the total current</b> drawn from the battery, so it runs down faster. Adding a branch actually <b>lowers</b> the total resistance — there are more paths for the charge.</li><li><b>One bulb breaks → only its branch stops.</b> The others carry on.</li></ul>` },
        { type: 'text', title: 'Your home is a parallel circuit', html: r`<p>Every light and power point in an NZ house is connected in parallel. That way each appliance gets the full 230 V, each can be switched on and off independently, and one failing does not turn off everything else. The downside: every appliance you switch on adds to the total current in the main cable — too many and the circuit breaker trips.</p>` },
        { type: 'example', title: 'finding a branch current', q: r`<p>A battery supplies 0.90 A to two lamps in parallel. The current through lamp 1 is 0.40 A. Find the current through lamp 2.</p>`, steps: [r`Junction rule: $I_{total} = I_1 + I_2$.`, r`$I_2 = 0.90 - 0.40$.`, r`$I_2 = 0.50$ A.`], answer: '<p>0.50 A. Lamp 2 takes more current, so it has the lower resistance.</p>' },
        { type: 'misconception', wrong: 'Adding more bulbs in parallel increases the total resistance, just like in series.', right: 'Each new branch gives charge another path, so the total resistance goes down and the total current goes up.' },
        { type: 'funfact', title: 'modern fairy lights', html: 'Many modern LED fairy lights wire their LEDs in small series groups that are then connected in parallel. If one LED fails, only its small group goes dark instead of the whole string.' },
        { type: 'key', points: ['Same voltage across every branch.', 'Branch currents add up to the total (junction rule).', 'Lower-resistance branch takes more current.', 'More branches → lower total resistance, more total current.', 'Houses are wired in parallel.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'Two lamps are in parallel. The currents are 0.20 A and 0.35 A. What is the total current from the battery?', answer: 0.55, unit: 'A', explain: '0.20 + 0.35 = 0.55 A.' },
        { type: 'num', q: 'A 9.0 V battery is connected to three lamps in parallel. What is the voltage across each lamp?', answer: 9, unit: 'V', explain: 'Each branch is connected directly across the battery, so each gets 9.0 V.' },
        { type: 'mcq', q: 'One bulb in a parallel circuit is removed. The other bulbs…', options: ['stay on with the same brightness', 'all go out', 'become dimmer', 'become brighter'], answer: 0, explain: 'Each branch is a separate path with the full voltage. Removing one branch does not affect the others (ideal battery).' },
        { type: 'mcq', q: 'A third bulb is added in parallel with two others. The current from the battery…', options: ['increases', 'decreases', 'stays the same', 'becomes zero'], answer: 0, explain: 'An extra branch draws its own current, and the total is the sum of all branch currents.' },
        { type: 'mcq', q: 'Two parallel branches have currents of 0.6 A and 0.2 A. Which branch has the larger resistance?', options: ['The 0.2 A branch', 'The 0.6 A branch', 'They are equal', 'You can’t tell'], answer: 0, explain: 'Same voltage across both, so the one with less current has more resistance (R = V/I).' },
      ],
    },
    // ------------------------------------------------------------------ 3.5
    {
      id: '3.5', title: 'Measuring current and voltage', levels: ['Y10', 'L1'], minutes: 14,
      objectives: ['Connect ammeters and voltmeters correctly', 'Explain why each meter is connected the way it is', 'Read a meter accurately'],
      sections: [
        { type: 'text', title: 'Ammeter: in series', html: r`<p>An <b>ammeter</b> measures <b>current</b> in amps. The current must flow <b>through</b> it, so you break the circuit and connect the ammeter <b>in series</b>.</p>
<p>A good ammeter has <b>very low resistance</b>, so adding it hardly changes the current it is measuring. Connect one in parallel and its low resistance makes a short circuit — a big current flows through the meter, which can blow its fuse.</p>` },
        { type: 'text', title: 'Voltmeter: in parallel', html: r`<p>A <b>voltmeter</b> measures <b>voltage</b> (potential difference) in volts — the difference in energy per coulomb between two points. So it is connected <b>across</b> a component, <b>in parallel</b>, with one lead on each side.</p>
<p>A good voltmeter has <b>very high resistance</b>, so almost no current is diverted through it. Connect one in series and its huge resistance blocks almost all the current: the bulbs go out and the meter reads close to the supply voltage.</p>` },
        { type: 'sim', sim: 'meter-placement', caption: 'Five tasks. Tap the ? box where each meter should go.' },
        { type: 'text', title: 'Using a multimeter', html: r`<ul><li>Black lead in <b>COM</b>. Red lead in the V socket for voltage, or the A / mA socket for current.</li><li>Turn the dial to the right quantity (V for DC voltage, A for DC current). Start on the <b>highest range</b>, then switch down for a more precise reading.</li><li>Connect red to the side nearer the <b>+</b> terminal. A minus sign on the display means the leads are swapped.</li></ul>` },
        { type: 'text', title: 'Reading an analogue meter', html: r`<p>Work out what each small division is worth (e.g. 10 divisions between 0 and 1 A → 0.1 A each). Look straight at the needle (not from the side) to avoid <b>parallax error</b>, and check the needle sits on zero before you start (<b>zero error</b>).</p>` },
        { type: 'misconception', wrong: 'A voltmeter measures the voltage “going through” a component, so it goes in series like an ammeter.', right: 'Voltage is a difference between two points, so a voltmeter connects across the two ends of a component, in parallel.' },
        { type: 'exam', standard: 'NCEA Level 2, AS 91173 (circuits question)', html: '<p>Exam circuits often include meters and ask for their readings. Remember: an ideal ammeter has zero resistance and an ideal voltmeter has infinite resistance, so neither changes the circuit.</p>' },
        { type: 'key', points: ['Ammeter: series, very low resistance.', 'Voltmeter: parallel (across), very high resistance.', 'Wrong placement: ammeter in parallel → short circuit; voltmeter in series → current stops.', 'Multimeter: start on the highest range; red lead towards +.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'How should an ammeter be connected?', options: ['In series', 'In parallel', 'Across the battery only', 'Either way'], answer: 0, explain: 'The current must flow through the ammeter.' },
        { type: 'mcq', q: 'Why should a voltmeter have a very high resistance?', options: ['So it draws almost no current and doesn’t change the circuit', 'So it can measure larger currents', 'So it heats up and glows', 'So it can be connected in series'], answer: 0, explain: 'A high resistance means very little current is diverted through the meter.' },
        { type: 'mcq', q: 'A student connects an ammeter in parallel with a bulb. What happens?', options: ['The bulb goes out and a large current flows through the ammeter', 'The bulb gets brighter', 'The ammeter reads zero and nothing else changes', 'The bulb flashes'], answer: 0, explain: 'The ammeter’s very low resistance short-circuits the bulb.' },
        { type: 'mcq', q: 'A voltmeter is mistakenly placed in series with a bulb. What happens?', options: ['The bulb goes out and the voltmeter reads nearly the supply voltage', 'The bulb gets brighter', 'The voltmeter is destroyed', 'The voltmeter reads the current'], answer: 0, explain: 'Its very high resistance stops almost all the current.' },
        { type: 'mcq', q: 'On an analogue ammeter there are 10 small divisions between 0 and 0.5 A. What is one division worth?', options: ['0.05 A', '0.5 A', '0.1 A', '0.01 A'], answer: 0, explain: '0.5 ÷ 10 = 0.05 A.' },
      ],
    },
    // ------------------------------------------------------------------ 3.6
    {
      id: '3.6', title: 'Reading diagrams and mixed circuits', levels: ['Y10', 'L1', 'L2'], minutes: 16,
      objectives: ['Trace the paths in a circuit diagram', 'Identify series and parallel parts of a mixed circuit', 'Predict brightness changes with reasons'],
      sections: [
        { type: 'text', title: 'Tracing a circuit', html: r`<p>Put your finger on the <b>+</b> terminal and follow the wire, in the direction of conventional current.</p>
<ul><li>If you can reach a component <b>without passing a junction</b> after the previous one, they are in <b>series</b>.</li><li>If the path <b>splits at a junction</b> and the branches meet again, the components on those branches are in <b>parallel</b>.</li></ul>
<p>Look for wires that join two points with nothing on them — they may <b>short-circuit</b> whatever sits between those points.</p>` },
        { type: 'diagram', svg: MIXED, caption: 'Bulb A carries all the current. It then splits between B and C, which are in parallel with each other.' },
        { type: 'text', title: 'Mixed circuits', html: r`<p>In the circuit above, identical bulbs B and C are in parallel, and that pair is in series with bulb A.</p>
<ul><li><b>Current:</b> all the current passes through A; it then splits equally between B and C. So $I_B = I_C = \tfrac{1}{2} I_A$.</li><li><b>Voltage:</b> the pair B–C together has less resistance than A alone (two paths), so it takes the smaller share of the voltage. $V_A + V_{BC} = 9.0$ V, and $V_B = V_C$.</li><li><b>Brightness:</b> A has the most current and the most voltage, so <b>A is brightest</b>. B and C are equally bright and dimmer.</li></ul>` },
        { type: 'sim', sim: 'mixed-circuit', caption: 'Remove B. Does A get brighter or dimmer? Does C? Predict first, then test.' },
        { type: 'text', title: 'What happens when B is removed?', html: r`<p>This is a classic Excellence question. Chain your reasoning:</p>
<ol><li>Removing B leaves A and C in series — the parallel pair is now just C, with <b>more resistance</b> than B and C together.</li><li>So the <b>total resistance increases</b> and, with the same battery voltage, the <b>total current decreases</b>.</li><li>Less current through A → <b>A gets dimmer</b>.</li><li>C now has a <b>bigger share</b> of the voltage (half instead of one-third), so its current increases → <b>C gets brighter</b>.</li></ol>` },
        { type: 'example', title: 'currents in a mixed circuit', q: r`<p>In the diagram, the ammeter beside the battery reads 0.60 A. Bulbs B and C are identical. Find the currents through A and B.</p>`, steps: ['Bulb A is in series with the battery, so it carries all the current: 0.60 A.', 'The current splits equally between identical bulbs B and C.', '0.60 ÷ 2 = 0.30 A.'], answer: '<p>A: 0.60 A. B: 0.30 A (and C: 0.30 A).</p>' },
        { type: 'deeper', levels: ['L3'], title: "Kirchhoff's laws", html: r`<p>Everything in this chapter is two rules, which you will use at Level 3 for circuits with several batteries:</p><ul><li><b>Junction (current) law:</b> the sum of currents into a junction equals the sum out — charge is conserved.</li><li><b>Loop (voltage) law:</b> around any closed loop, the sum of EMFs equals the sum of the voltage drops — energy is conserved.</li></ul>` },
        { type: 'key', points: ['Trace from + to −; junctions mark where parallel branches start and end.', 'In a mixed circuit, the component carrying the total current is usually brightest.', 'Removing a parallel branch raises total resistance and lowers total current.', 'Explain changes as a chain: R → I → V → brightness.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'In the diagram (A in series with B and C in parallel), which bulb is brightest? All bulbs are identical.', options: ['A', 'B', 'C', 'All equally bright'], answer: 0, explain: 'A carries the full current and has the largest voltage.', figure: MIXED },
        { type: 'num', q: 'In the same circuit the battery is 9.0 V and the voltage across A is 6.0 V. What is the voltage across C?', answer: 3, unit: 'V', explain: 'A is in series with the parallel pair: 9.0 − 6.0 = 3.0 V across B and C (the same for both, as they are in parallel).' },
        { type: 'num', q: 'The current through A is 0.48 A. B and C are identical. What is the current through C?', answer: 0.24, unit: 'A', explain: 'All the current through A splits equally between B and C: 0.48 ÷ 2 = 0.24 A.' },
        { type: 'mcq', q: 'Bulb B is removed. What happens to bulb A?', options: ['It gets dimmer', 'It gets brighter', 'It stays the same', 'It goes out'], answer: 0, explain: 'Total resistance increases, so the total current (which all flows through A) decreases.' },
        { type: 'explain', q: 'Explain why bulb C gets brighter when bulb B is removed.', model: '<p>With B removed, A and C are simply in series. The resistance of the C part (one bulb) is now larger than before (B and C in parallel had half the resistance). In series the voltage is shared in proportion to resistance, so C now gets a bigger share of the supply voltage (half instead of one-third). With more voltage across it, more current flows through C, so it transfers energy faster and is brighter. (The total current is smaller, but C no longer shares it with B.)</p>', points: [{ lvl: 'A', text: 'States C gets brighter because it has more current or more voltage' }, { lvl: 'M', text: 'Explains the C section now has more resistance than the B–C pair had' }, { lvl: 'E', text: 'Uses voltage sharing in proportion to resistance to show C gets a larger share' }, { lvl: 'E', text: 'Notes the total current falls but C no longer shares it with B' }] },
      ],
    },
  ],
  test: {
    A: [
      { type: 'mcq', q: 'How should a voltmeter be connected to measure the voltage across a lamp?', options: ['In parallel with the lamp', 'In series with the lamp', 'Across the switch', 'Anywhere in the circuit'], answer: 0, explain: 'Voltmeters go across (in parallel with) the component.' },
      { type: 'num', q: 'Two lamps are in series with a 4.5 V battery. Lamp 1 has 1.5 V across it. Find the voltage across lamp 2.', answer: 3, unit: 'V', explain: '4.5 − 1.5 = 3.0 V.' },
      { type: 'num', q: 'Three branches of a parallel circuit carry 0.10 A, 0.25 A and 0.15 A. Find the total current.', answer: 0.5, unit: 'A', explain: '0.10 + 0.25 + 0.15 = 0.50 A.' },
      { type: 'mcq', q: 'Conventional current flows from…', options: ['+ to −', '− to +', 'the bulb to the battery only', 'earth to the battery'], answer: 0, explain: 'By convention, + to − in the external circuit.' },
      { type: 'mcq', q: 'Why are houses wired in parallel?', options: ['Each appliance gets the full voltage and can be switched separately', 'It uses less wire', 'It makes the voltage add up to 230 V', 'It stops current flowing to earth'], answer: 0, explain: 'Parallel wiring gives each appliance 230 V and independent control.' },
    ],
    M: [
      { type: 'explain', q: 'Two identical lamps are connected in series to a battery. A third identical lamp is then added in series. Explain what happens to the brightness of the lamps.', model: '<p>Adding a lamp in series increases the total resistance of the circuit. The battery voltage is the same, so the current decreases (the same smaller current flows through every lamp). The supply voltage is now shared between three lamps instead of two, so each lamp has a smaller voltage across it. With less current and less voltage, each lamp transfers energy more slowly, so all three lamps are dimmer than the two were.</p>', points: [{ lvl: 'A', text: 'The lamps get dimmer' }, { lvl: 'M', text: 'Total resistance increases, so the current decreases' }, { lvl: 'M', text: 'Voltage shared between more lamps, so less voltage each' }] },
      { type: 'explain', q: 'In a parallel circuit with two identical lamps, one lamp blows. Explain what happens to the other lamp and to the reading on an ammeter next to the battery.', model: '<p>The other lamp stays on with the same brightness, because it is on its own branch connected directly across the battery, so it still has the full battery voltage and the same current. The ammeter next to the battery measures the total current, which is the sum of the branch currents. One branch now carries no current, so the ammeter reading halves.</p>', points: [{ lvl: 'A', text: 'The other lamp stays on' }, { lvl: 'M', text: 'It still has the full voltage, so its brightness is unchanged' }, { lvl: 'M', text: 'Total current = sum of branches, so the ammeter reading halves' }] },
      { type: 'mcq', q: 'A 3 Ω and a 6 Ω resistor are in series with a 9 V battery. What is the voltage across the 6 Ω resistor?', options: ['6 V', '3 V', '4.5 V', '9 V'], answer: 0, explain: 'Voltage is shared in proportion to resistance: 6/(3+6) × 9 = 6 V.' },
      { type: 'num', q: 'A battery supplies 1.2 A to three identical lamps in parallel. What current flows through each lamp?', answer: 0.4, unit: 'A', explain: '1.2 ÷ 3 = 0.40 A each.' },
    ],
    E: [
      { type: 'explain', q: 'Bulb A is in series with identical bulbs B and C, which are in parallel with each other (see diagram). Discuss what happens to the brightness of A and C when bulb B is removed. Use ideas of resistance, current and voltage.', figure: MIXED, model: '<p>Before: B and C in parallel have half the resistance of one bulb, so the pair takes one-third of the voltage and A takes two-thirds. A carries the full current; B and C each carry half of it.</p><p>After removing B: the circuit is A and C in series. The total resistance increases (from 1.5R to 2R), so the total current decreases. A carries this smaller current and its voltage falls from two-thirds to one-half of the supply, so A gets dimmer. C’s share of the voltage rises from one-third to one-half, and C no longer shares the current with B, so the current through C increases and C gets brighter. A and C end up equally bright.</p>', points: [{ lvl: 'A', text: 'A dimmer, C brighter' }, { lvl: 'M', text: 'Total resistance increases so total current decreases' }, { lvl: 'E', text: 'Voltage shares change: A from 2/3 to 1/2; C from 1/3 to 1/2' }, { lvl: 'E', text: 'Concludes A and C end up equally bright, with reasons' }] },
      { type: 'explain', q: 'A student puts the ammeter in parallel with a lamp and the voltmeter in series with the battery. Discuss what the meters will read and what happens to the lamp, and explain how to correct the circuit.', model: '<p>The voltmeter in series has a very high resistance, so it allows almost no current to flow in the circuit. The lamp will not light. The ammeter (in parallel with the lamp) will read approximately zero, because almost no current flows. Almost all of the battery voltage is across the high-resistance voltmeter, so it reads close to the battery voltage.</p><p>To correct it: connect the ammeter in series (so the current flows through it) and the voltmeter in parallel across the lamp (to measure the voltage difference across it).</p>', points: [{ lvl: 'A', text: 'States the correct way to connect each meter' }, { lvl: 'M', text: 'Voltmeter in series has high resistance, so (almost) no current flows' }, { lvl: 'E', text: 'Ammeter reads ~0 and voltmeter reads ~battery voltage, with reasons' }, { lvl: 'E', text: 'Lamp does not light because the current is almost zero' }] },
      { type: 'num', q: 'In a parallel circuit, branch 1 has a resistance of 10 Ω and branch 2 has 15 Ω. The total current is 1.0 A. What current flows in branch 1? (Hint: the same voltage is across both.)', answer: 0.6, unit: 'A', explain: 'Same V across both, so I ∝ 1/R. I₁ : I₂ = 1/10 : 1/15 = 3 : 2. Branch 1 gets 3/5 of 1.0 A = 0.60 A.' },
    ],
  },
  glossary: [
    { term: 'Circuit', def: 'A complete closed path through which current can flow.' },
    { term: 'Open circuit', def: 'A circuit with a gap, so no current flows.' },
    { term: 'Short circuit', def: 'A low-resistance path that bypasses a component, causing a large current.' },
    { term: 'Load', def: 'A component that transforms electrical energy into another form (light, heat, motion).' },
    { term: 'Conventional current', def: 'Current direction defined as positive to negative around the external circuit.' },
    { term: 'Electron flow', def: 'The actual movement of electrons in a metal: negative to positive around the external circuit.' },
    { term: 'Series circuit', def: 'Components connected one after another, with only one path for the current.' },
    { term: 'Parallel circuit', def: 'Components on separate branches, giving more than one path for the current.' },
    { term: 'Junction', def: 'A point where wires join and current can split or combine.' },
    { term: "Kirchhoff's current law", def: 'The total current into a junction equals the total current out (conservation of charge).' },
    { term: "Kirchhoff's voltage law", def: 'Around any loop, the voltage drops add up to the supply EMF (conservation of energy).' },
    { term: 'Ammeter', def: 'Meter that measures current; connected in series; very low resistance.' },
    { term: 'Voltmeter', def: 'Meter that measures voltage (potential difference); connected in parallel; very high resistance.' },
    { term: 'Fuse', def: 'Safety device: a thin wire that melts and breaks the circuit if the current is too large.' },
    { term: 'Diode', def: 'Component that lets current flow in one direction only.' },
  ],
  formulas: [
    { name: 'Series: current', tex: 'I_1 = I_2 = I_3', note: 'Same current everywhere in a series circuit.', level: 'Y10 / L1' },
    { name: 'Series: voltage', tex: r`V_{supply} = V_1 + V_2 + \dots`, note: 'Voltages add up to the supply, shared in proportion to resistance.', level: 'Y10 / L1' },
    { name: 'Parallel: voltage', tex: r`V_{supply} = V_1 = V_2`, note: 'Every branch has the full supply voltage.', level: 'Y10 / L1' },
    { name: 'Parallel: current (junction rule)', tex: r`I_{total} = I_1 + I_2 + \dots`, note: 'Branch currents add up. Lower resistance branch takes more current.', level: 'Y10 / L1' },
  ],
  flashcards: [
    { front: 'Series circuit: current?', back: 'The same everywhere' }, { front: 'Series circuit: voltage?', back: 'Shared — adds up to the supply' },
    { front: 'Parallel circuit: voltage?', back: 'The same across every branch' }, { front: 'Parallel circuit: current?', back: 'Branch currents add up to the total' },
    { front: 'Ammeter connection and resistance', back: 'Series; very low resistance' }, { front: 'Voltmeter connection and resistance', back: 'Parallel; very high resistance' },
    { front: 'Cell symbol: which line is +?', back: 'The long thin line' },
  ],
};
