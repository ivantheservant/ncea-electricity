/**
 * Chapter 12 — Magnetism & Magnetic Fields.
 */
import { svg, comp, wire, label, arrow } from '../js/utils/svg.js';

const r = String.raw;

/**
 * Dot (out of page) or cross (into page).
 * @param {number} x X.
 * @param {number} y Y.
 * @param {boolean} out Out of the page.
 * @param {number} [rr=10] Radius.
 * @returns {string} SVG markup.
 */
function dc(x, y, out, rr = 10) {
  return `<circle cx="${x}" cy="${y}" r="${rr}" class="fill-sheet"/>` + (out ? `<circle cx="${x}" cy="${y}" r="3" class="solid"/>` : `<line x1="${x - rr * 0.6}" y1="${y - rr * 0.6}" x2="${x + rr * 0.6}" y2="${y + rr * 0.6}"/><line x1="${x - rr * 0.6}" y1="${y + rr * 0.6}" x2="${x + rr * 0.6}" y2="${y - rr * 0.6}"/>`);
}

const BAR = svg(480, 220, (() => {
  let s = '<rect x="170" y="90" width="70" height="40" style="fill:color-mix(in srgb, var(--blue) 35%, var(--sheet))"/><rect x="240" y="90" width="70" height="40" style="fill:color-mix(in srgb, var(--bad) 35%, var(--sheet))"/>';
  s += label(205, 116, 'S', { cls: 'bold' }) + label(275, 116, 'N', { cls: 'bold' });
  for (const h of [22, 40, 58]) {
    s += `<path d="M310,${110 - 8} C ${340 + h * 1.5},${110 - 1.6 * h} ${140 - h * 1.5},${110 - 1.6 * h} 170,${110 - 8}" class="field" style="stroke:var(--ink-2)"/>`;
    s += `<path d="M310,${110 + 8} C ${340 + h * 1.5},${110 + 1.6 * h} ${140 - h * 1.5},${110 + 1.6 * h} 170,${110 + 8}" class="field" style="stroke:var(--ink-2)"/>`;
  }
  s += arrow(320, 110, 440, 110, 'field') + arrow(40, 110, 160, 110, 'field');
  s += arrow(244, 41, 236, 41, 'field') + arrow(244, 179, 236, 179, 'field');
  return s;
})(), { title: 'Field lines of a bar magnet: out of the north pole, round, and into the south pole', maxw: 520 });

const WIRE_GRIP = svg(480, 200, (() => {
  let s = '';
  for (const rr of [30, 55, 80]) s += `<circle cx="130" cy="100" r="${rr}" class="field" style="stroke:var(--ink-2)"/>`;
  s += dc(130, 100, true, 12) + arrow(130 + 55, 104, 130 + 55, 94, 'field') + arrow(130 - 55, 96, 130 - 55, 106, 'field');
  s += label(130, 196, 'current OUT of page: anticlockwise', { cls: 'small bold' });
  for (const rr of [30, 55, 80]) s += `<circle cx="360" cy="100" r="${rr}" class="field" style="stroke:var(--ink-2)"/>`;
  s += dc(360, 100, false, 12) + arrow(360 + 55, 94, 360 + 55, 104, 'field') + arrow(360 - 55, 106, 360 - 55, 96, 'field');
  s += label(360, 196, 'current INTO page: clockwise', { cls: 'small bold' });
  return s;
})(), { title: 'Circular field lines around a straight wire; direction set by the current', maxw: 520 });

const RELAY = svg(500, 210, [
  comp('battery', 40, 170, 40, 60, { signs: true, label: '6 V', labelPos: 'left' }), wire([40, 60], [80, 60]), comp('switch-open', 80, 60, 140, 60, { label: 'small switch' }), wire([140, 60], [170, 60], [170, 80]),
  '<rect x="160" y="80" width="20" height="70" class="fill-soft"/>', label(150, 120, 'coil', { anchor: 'end', cls: 'small' }), wire([170, 150], [170, 170], [40, 170]),
  '<line x1="200" y1="70" x2="250" y2="45" style="stroke-width:3"/>', '<circle cx="200" cy="70" r="3.5" class="solid"/>', label(250, 32, 'iron armature', { cls: 'small' }),
  wire([250, 45], [300, 45]), wire([200, 70], [200, 180], [460, 180]), comp('ac', 460, 180, 460, 45, { label: '230 V', labelPos: 'right' }), wire([460, 45], [420, 45]), comp('motor', 300, 45, 420, 45, { label: 'big motor' }),
].join(''), { title: 'A relay: a small current in the coil pulls an armature that switches a separate high-current circuit', maxw: 520 });

const NOTATION = svg(460, 150, (() => {
  let s = '';
  for (let x = 30; x <= 190; x += 40) for (let y = 30; y <= 110; y += 40) s += dc(x, y, false, 8);
  s += label(110, 145, 'field INTO page (×: tail of an arrow)', { cls: 'small bold' });
  for (let x = 270; x <= 430; x += 40) for (let y = 30; y <= 110; y += 40) s += dc(x, y, true, 8);
  s += label(350, 145, 'field OUT of page (•: tip of an arrow)', { cls: 'small bold' });
  return s;
})(), { title: 'Crosses mean a field into the page; dots mean a field out of the page', maxw: 500 });

export default {
  intro: 'Electricity and magnetism are two sides of one force. In 1820 Hans Christian Ørsted noticed a compass needle twitch near a wire carrying current — the first clue. This chapter describes magnetic fields, shows how currents create them, and explains how coils become switchable magnets.',
  standards: 'NCEA Level 2 AS 91173 (electromagnetism: fields of magnets, wires and solenoids; right-hand grip rule).',
  lessons: [
    // ------------------------------------------------------------------ 12.1
    {
      id: '12.1', title: 'Magnets and magnetic fields', levels: ['Y10', 'L2'], minutes: 14,
      objectives: ['Describe the forces between magnetic poles', 'Draw field lines around magnets', 'Describe the Earth’s magnetic field'],
      sections: [
        { type: 'text', title: 'Poles and forces', html: r`<p>Every magnet has a <b>north (N)</b> and a <b>south (S)</b> pole. Like poles repel; unlike poles attract. Cut a magnet in half and you get two smaller magnets, each with its own N and S — you can never get a single pole on its own.</p>
<p>Only a few materials are strongly magnetic: <b>iron, nickel, cobalt</b> and some of their alloys (steel). A magnet attracts these even when they are unmagnetised, because it magnetises them temporarily (just as a charged rod polarises paper in Lesson 1.4).</p>` },
        { type: 'text', title: 'Magnetic fields', html: r`<p>A <b>magnetic field</b> is a region where a magnetic pole (or a magnetic material, or a moving charge) feels a force. Field lines show:</p>
<ul><li><b>Direction:</b> the way the north end of a compass points — <b>out of N, into S</b> outside the magnet.</li><li><b>Strength:</b> closer lines mean a stronger field (strongest at the poles).</li><li>Field lines never cross, and they form closed loops (continuing through the magnet from S to N).</li></ul>` },
        { type: 'diagram', svg: BAR, caption: 'Field lines leave the north pole and curve round into the south pole.' },
        { type: 'sim', sim: 'mag-field', caption: 'Bar magnet mode: each compass’s red end points along the field. Press Reverse to flip the magnet.' },
        { type: 'text', title: 'The Earth is a magnet', html: r`<p>The Earth’s molten iron core produces a magnetic field like a giant bar magnet. A compass’s north pole points to the Earth’s <b>geographic north</b> — so the magnetic pole up there is actually a magnetic <b>south</b> pole! In New Zealand the field also dips steeply into the ground, and compasses point roughly 20° east of true north (the “declination”), which is why maps show the difference.</p>` },
        { type: 'misconception', wrong: 'Magnets attract all metals.', right: 'Only iron, nickel, cobalt and some alloys are strongly attracted. Aluminium, copper, gold and silver are not (a fridge magnet will not stick to an aluminium can).' },
        { type: 'funfact', title: 'animal compasses', html: 'Many birds, sea turtles and even some whales seem to sense the Earth’s magnetic field to navigate. Godwits flying non-stop from Alaska to New Zealand — over 11 000 km — may use it as one of their guides.' },
        { type: 'key', points: ['Like poles repel; unlike poles attract.', 'Field lines: out of N, into S; closer = stronger; never cross.', 'Iron, nickel and cobalt are magnetic materials.', 'Earth’s field: compass N points to geographic north.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'Two north poles are brought close together. They…', options: ['repel', 'attract', 'do nothing', 'become south poles'], answer: 0, explain: 'Like poles repel.' },
        { type: 'mcq', q: 'Outside a magnet, field lines point…', options: ['from N to S', 'from S to N', 'towards both poles', 'away from both poles'], answer: 0, explain: 'The direction a compass N end would point.' },
        { type: 'mcq', q: 'Which metal is NOT attracted to a magnet?', options: ['Aluminium', 'Iron', 'Nickel', 'Steel'], answer: 0, explain: 'Aluminium is not a magnetic material.' },
        { type: 'mcq', q: 'Where is the field of a bar magnet strongest?', options: ['Near the poles', 'In the middle of the long side', 'Far away from it', 'It is the same everywhere'], answer: 0, explain: 'The lines are closest at the poles.' },
        { type: 'tf', q: 'If you cut a bar magnet in half, you get a separate north pole and a separate south pole.', answer: false, explain: 'Each half becomes a complete magnet with N and S.' },
      ],
    },
    // ------------------------------------------------------------------ 12.2
    {
      id: '12.2', title: 'The magnetic field of a current', levels: ['L2'], minutes: 16,
      objectives: ['Describe the field around a straight current-carrying wire', 'Use the right-hand grip rule', 'State how the field depends on current and distance'],
      sections: [
        { type: 'text', title: 'Ørsted’s discovery', html: r`<p>Every electric current produces a magnetic field. Around a long straight wire, the field lines are <b>concentric circles</b> centred on the wire, in planes at right angles to it. The field is stronger close to the wire and with a bigger current.</p>` },
        { type: 'diagram', svg: WIRE_GRIP, caption: 'Looking along the wire: current out of the page gives anticlockwise field lines; into the page gives clockwise.' },
        { type: 'text', title: 'Right-hand grip rule', html: r`<p>Grip the wire with your <b>right hand</b>, <b>thumb pointing along the conventional current</b>. Your <b>fingers curl in the direction of the field</b>.</p>
<p>Notation: a <b>dot</b> (•) means a current or field coming <b>out of the page</b> towards you (the tip of an arrow); a <b>cross</b> (×) means going <b>into the page</b> (the tail feathers of an arrow).</p>` },
        { type: 'sim', sim: 'mag-field', caption: 'Choose “Straight wire”. Use your right hand to predict the needle directions, then press Reverse.' },
        { type: 'text', title: 'How strong?', html: r`<p>The field strength $B$ is <b>proportional to the current</b> and <b>inversely proportional to the distance</b> from the wire: $B \propto \dfrac{I}{r}$. Double the current → double the field. Twice as far away → half the field.</p>` },
        { type: 'deeper', levels: ['Uni'], title: 'B = μ₀I / 2πr', html: r`<p>The exact formula is $B = \dfrac{\mu_0 I}{2\pi r}$, where $\mu_0 = 4\pi \times 10^{-7}$ T m A⁻¹ is the permeability of free space. A 10 A current 1.0 cm away gives $B = \dfrac{4\pi \times 10^{-7} \times 10}{2\pi \times 0.010} = 2.0 \times 10^{-4}$ T — about four times the Earth’s field, which is why a compass near a car’s battery cable can point the wrong way.</p>` },
        { type: 'example', title: 'proportional reasoning', q: r`<p>The field 2.0 cm from a wire carrying 5.0 A is 50 μT. What is the field 4.0 cm from the wire if the current is raised to 15 A?</p>`, steps: ['Current × 3 → field × 3.', 'Distance × 2 → field ÷ 2.', r`$B = 50 \times \dfrac{3}{2} = 75$ μT.`], answer: '<p>75 μT.</p>' },
        { type: 'misconception', wrong: 'The magnetic field around a wire points along the wire, in the direction of the current.', right: 'The field circles round the wire, at right angles to the current. Use the grip rule.' },
        { type: 'key', points: ['A current creates a magnetic field.', 'Straight wire: concentric circles.', 'Right-hand grip: thumb = current, fingers = field.', 'B ∝ I/r. Dot = out of page; cross = into page.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'A wire carries current into the page. Seen from above, the field lines go…', options: ['clockwise', 'anticlockwise', 'radially outwards', 'along the wire'], answer: 0, explain: 'Right-hand grip with thumb into the page.' },
        { type: 'mcq', q: 'In diagrams, a dot (•) inside a circle means…', options: ['out of the page', 'into the page', 'no current', 'a north pole'], answer: 0, explain: 'The tip of an arrow coming towards you.' },
        { type: 'num', q: 'A wire’s field is 40 μT at 1.0 cm. What is it at 4.0 cm (same current)?', answer: 10, unit: 'μT', explain: 'B ∝ 1/r: 40 ÷ 4 = 10 μT.' },
        { type: 'num', q: 'The current in a wire is doubled and you move twice as far away. By what factor does the field change?', answer: 1, explain: '× 2 for current, ÷ 2 for distance: unchanged (factor 1).' },
        { type: 'mcq', q: 'In the right-hand grip rule, the thumb points…', options: ['along the conventional current', 'along the field', 'towards north', 'along the electron flow'], answer: 0, explain: 'Thumb = conventional current, fingers = field.' },
      ],
    },
    // ------------------------------------------------------------------ 12.3
    {
      id: '12.3', title: 'Solenoids and electromagnets', levels: ['L2'], minutes: 16,
      objectives: ['Describe the field of a solenoid', 'Find the poles of a solenoid with the right-hand rule', 'Explain how electromagnets and relays are used'],
      sections: [
        { type: 'text', title: 'Coiling the wire', html: r`<p>Wind a wire into a long coil — a <b>solenoid</b> — and the fields of all the turns add together. Inside, the field is <b>strong and uniform</b> (parallel, evenly spaced lines along the axis). Outside, the field looks just like a bar magnet’s, with a north pole at one end and a south pole at the other.</p>` },
        { type: 'text', title: 'Finding the north pole', html: r`<p>Right-hand rule for a coil: <b>curl the fingers of your right hand in the direction of the current round the coil; your thumb points to the north end</b>. (A memory aid: look at one end — if the current goes anticlockwise, that end is N; clockwise, it is S. Draw the arrows on the letters N and S and you will see the shapes.)</p>` },
        { type: 'sim', sim: 'mag-field', caption: 'Choose “Solenoid”. Add turns, increase the current, add an iron core — and press Reverse to swap the poles.' },
        { type: 'text', title: 'Making it stronger', html: r`<ul><li><b>More current</b> through the coil.</li><li><b>More turns</b> per metre of coil.</li><li>An <b>iron core</b> inside: iron becomes strongly magnetised by the coil’s field, multiplying it hundreds or thousands of times.</li></ul>
<p>Soft iron is used because it loses its magnetism as soon as the current stops, so the electromagnet can be switched off.</p>` },
        { type: 'text', title: 'Electromagnets at work', html: r`<ul><li><b>Relays:</b> a small current through a coil pulls an iron arm that closes a separate switch. A tiny, safe circuit (a sensor or a car’s ignition key) can control a large, dangerous current (a starter motor or a 230 V pump).</li><li><b>Scrapyard cranes</b> lift cars and drop them by switching the current off.</li><li><b>Electric door locks, doorbells</b> and the solenoid valves in washing machines.</li><li><b>MRI scanners</b> use superconducting coils to make fields of 1.5–3 T.</li></ul>` },
        { type: 'diagram', svg: RELAY, caption: 'Closing the small switch magnetises the coil, which pulls the armature down and completes the 230 V motor circuit.' },
        { type: 'misconception', wrong: 'An electromagnet works on any metal core, such as copper or aluminium.', right: 'Only magnetic materials such as iron strengthen the field. A copper core would make almost no difference.' },
        { type: 'funfact', title: 'floating trains', html: 'Shanghai’s maglev train uses powerful electromagnets to lift the train about 1 cm above its guideway and pull it along, reaching over 400 km/h with no wheels touching the track.' },
        { type: 'key', points: ['Solenoid: uniform field inside; bar-magnet field outside.', 'Right hand: fingers along the current, thumb = N end.', 'Stronger: more current, more turns, iron core.', 'Relays let a small current switch a large one.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'What is the field like inside a long solenoid?', options: ['Strong and uniform', 'Zero', 'Circular', 'Weakest in the middle'], answer: 0, explain: 'Parallel, evenly spaced lines.' },
        { type: 'mcq', q: 'Which change does NOT make an electromagnet stronger?', options: ['Using a copper core', 'More turns', 'More current', 'An iron core'], answer: 0, explain: 'Copper is not magnetic.' },
        { type: 'mcq', q: 'Looking at one end of a solenoid, the current flows anticlockwise. That end is a…', options: ['north pole', 'south pole', 'neutral point', 'it depends on the core'], answer: 0, explain: 'Anticlockwise = N.' },
        { type: 'mcq', q: 'Why is soft iron used for electromagnet cores?', options: ['It loses its magnetism when the current is switched off', 'It conducts electricity well', 'It is permanently magnetic', 'It is light'], answer: 0, explain: 'So the magnet can be switched off.' },
        { type: 'mcq', q: 'What is the main advantage of a relay?', options: ['A small, safe current can switch a large current', 'It makes AC into DC', 'It increases the voltage', 'It stores energy'], answer: 0, explain: 'Separates the control circuit from the power circuit.' },
      ],
    },
    // ------------------------------------------------------------------ 12.4
    {
      id: '12.4', title: 'Magnetic flux density and field diagrams', levels: ['L2'], minutes: 12,
      objectives: ['State the unit of magnetic field strength', 'Use dot and cross notation', 'Recognise a uniform magnetic field'],
      sections: [
        { type: 'text', title: 'Measuring the field: the tesla', html: r`<p>The strength of a magnetic field is called the <b>magnetic flux density</b>, symbol $B$, measured in <b>tesla (T)</b>. One tesla is a strong field: a wire 1 m long carrying 1 A at right angles to a 1 T field feels a force of 1 N (Chapter 13).</p>
<div class="tablewrap"><table><thead><tr><th>Field</th><th>Typical B</th></tr></thead><tbody>
<tr><td>Earth’s field in New Zealand</td><td>about 55–60 μT</td></tr><tr><td>Fridge magnet (at the surface)</td><td>about 5 mT</td></tr><tr><td>Strong neodymium magnet</td><td>about 1 T</td></tr><tr><td>Hospital MRI scanner</td><td>1.5–3 T</td></tr><tr><td>Strongest steady lab magnets</td><td>about 45 T</td></tr>
</tbody></table></div>` },
        { type: 'text', title: 'Uniform fields', html: r`<p>Between the flat, close, opposite poles of a magnet (or inside a solenoid) the field is <b>uniform</b>: the same strength and direction everywhere, drawn as parallel, evenly spaced lines. NCEA force and induction calculations assume uniform fields.</p>` },
        { type: 'diagram', svg: NOTATION, caption: 'To draw a field pointing into or out of the page, use crosses or dots.' },
        { type: 'text', title: 'Thinking in three dimensions', html: r`<p>Magnetism problems are 3-D: the current, the field and (in Chapter 13) the force are all at right angles to each other. Diagrams squash this onto flat paper using dots and crosses. Practise turning your right hand to match the diagram — physically turning the page is allowed!</p>` },
        { type: 'misconception', wrong: 'The tesla is a unit of magnetic force.', right: 'The tesla measures field strength (flux density). Force is measured in newtons.' },
        { type: 'funfact', title: 'Nikola Tesla', html: 'The unit is named after Nikola Tesla, the engineer behind the AC induction motor and much of the AC power system used around the world today.' },
        { type: 'key', points: ['Magnetic flux density B in tesla (T).', 'Earth ≈ 55–60 μT in NZ; MRI 1.5–3 T.', 'Uniform field: parallel, evenly spaced lines.', '× = into the page; • = out of the page.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'What is the unit of magnetic flux density?', options: ['Tesla', 'Newton', 'Weber per metre', 'Gauss per second'], answer: 0, explain: 'B is measured in tesla.' },
        { type: 'mcq', q: 'Which is the strongest field?', options: ['An MRI scanner', 'The Earth’s field', 'A fridge magnet', 'A compass needle’s field'], answer: 0, explain: '1.5–3 T.' },
        { type: 'num', q: 'Express the Earth’s field of 55 μT in tesla.', answer: 5.5e-5, unit: 'T', explain: '55 × 10⁻⁶ = 5.5 × 10⁻⁵ T.' },
        { type: 'mcq', q: 'A diagram shows a grid of crosses. The field is…', options: ['into the page', 'out of the page', 'to the right', 'zero'], answer: 0, explain: 'Crosses = tails of arrows going away from you.' },
        { type: 'mcq', q: 'Where is a magnetic field uniform?', options: ['Between flat opposite poles close together, or inside a solenoid', 'Around a straight wire', 'Near one end of a bar magnet', 'Far from any magnet'], answer: 0, explain: 'Parallel, evenly spaced lines.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'mcq', q: 'Which pair of poles attract?', options: ['North and south', 'North and north', 'South and south', 'None'], answer: 0, explain: 'Unlike poles attract.' },
      { type: 'mcq', q: 'Describe the shape of the field around a long straight wire carrying a current.', options: ['Concentric circles around the wire', 'Straight lines parallel to the wire', 'Lines from one end to the other', 'There is no field'], answer: 0, explain: 'Circles centred on the wire.' },
      { type: 'mcq', q: 'State one way to make an electromagnet stronger.', options: ['Increase the number of turns', 'Use a plastic core', 'Reduce the current', 'Use thinner insulation'], answer: 0, explain: 'More turns, more current or an iron core.' },
      { type: 'num', q: 'A field is 0.25 T. Express it in millitesla.', answer: 250, unit: 'mT', explain: '0.25 × 1000 = 250 mT.' },
      { type: 'mcq', q: 'Field lines leave which pole of a magnet?', options: ['North', 'South', 'Both', 'Neither'], answer: 0, explain: 'Out of N, into S.' },
    ],
    M: [
      { type: 'explain', q: 'A vertical wire carries a current upwards through a horizontal card. Describe the field pattern on the card and explain how you would find its direction.', model: '<p>The field lines are concentric circles centred on the wire, lying in the plane of the card (at right angles to the wire), closer together near the wire where the field is stronger. Using the right-hand grip rule: point the thumb of the right hand upwards along the conventional current; the fingers curl in the direction of the field, which is anticlockwise when looking down from above. Compasses placed on the card would line up along these circles.</p>', points: [{ lvl: 'A', text: 'Concentric circles around the wire' }, { lvl: 'M', text: 'Right-hand grip rule correctly applied' }, { lvl: 'M', text: 'Anticlockwise from above; stronger near the wire' }] },
      { type: 'num', q: 'The field 3.0 cm from a wire is 60 μT. What is the field 1.0 cm from the wire when the current is halved?', answer: 90, unit: 'μT', explain: '÷2 for current, ×3 for distance: 60 × 3/2 = 90 μT.' },
      { type: 'explain', q: 'Explain how a relay allows a small switch to turn on a large motor safely.', model: '<p>The small switch is in a low-voltage circuit with the relay’s coil. When it is closed, a small current flows in the coil, which becomes an electromagnet (strengthened by its iron core). The magnetic field attracts an iron armature, which moves and closes a second set of contacts in the separate high-current motor circuit, so the motor starts. The person only touches the low-voltage circuit, which is electrically separate from the dangerous high-current circuit.</p>', points: [{ lvl: 'A', text: 'Coil becomes a magnet when current flows' }, { lvl: 'M', text: 'Attracts the armature, closing the second circuit' }, { lvl: 'M', text: 'Two separate circuits: small safe current controls large current' }] },
      { type: 'mcq', q: 'Viewed from one end, the current in a solenoid flows clockwise. That end is…', options: ['a south pole', 'a north pole', 'unmagnetised', 'north only if there is an iron core'], answer: 0, explain: 'Clockwise = S.' },
    ],
    E: [
      { type: 'explain', q: 'Discuss the similarities and differences between the magnetic field of a solenoid and that of a bar magnet, and explain how the strength and polarity of the solenoid’s field can be changed.', model: '<p>Outside, the solenoid’s field has the same shape as a bar magnet’s: lines leave one end (north) and curve round to enter the other (south), and the field is strongest near the ends. Inside the solenoid the field is strong and uniform, parallel to the axis — like the field inside a bar magnet, but there is no material, so it can be switched on and off. Unlike a permanent magnet, its strength can be changed: increasing the current or the number of turns per metre strengthens it, and adding a soft iron core greatly increases it. Reversing the current reverses the polarity (found by the right-hand rule: fingers along the current, thumb points to N). Switching the current off removes the field completely.</p>', points: [{ lvl: 'A', text: 'Same external shape as a bar magnet' }, { lvl: 'M', text: 'Uniform field inside; polarity by right-hand rule' }, { lvl: 'E', text: 'Strength changed by current, turns, iron core' }, { lvl: 'E', text: 'Polarity reverses with current; can be switched off' }] },
      { type: 'explain', q: 'Two long parallel wires each carry a current upwards. Use field patterns and the right-hand grip rule to explain the direction of the field midway between them, and what happens to it if one current is reversed.', model: '<p>Each wire produces circular field lines around itself. Using the right-hand grip rule with both currents upwards (looking from above, both fields anticlockwise), at the midpoint the field from the left wire points one way and the field from the right wire points the opposite way. With equal currents at equal distances they are equal in size, so they cancel: the field midway is zero. If one current is reversed, its field reverses, so at the midpoint both fields point the same way and add: the field there is twice the field of one wire.</p>', points: [{ lvl: 'A', text: 'Each wire has circular field lines' }, { lvl: 'M', text: 'At the midpoint the two fields are in opposite directions' }, { lvl: 'E', text: 'Equal currents → fields cancel (zero)' }, { lvl: 'E', text: 'One reversed → fields add (doubled)' }] },
      { type: 'num', q: 'A compass 2.0 cm from a wire is affected by a field of 1.2 × 10⁻⁴ T from the wire. How far from the wire would the wire’s field equal the Earth’s field of 6.0 × 10⁻⁵ T?', answer: 4, unit: 'cm', explain: 'B ∝ 1/r: half the field at twice the distance → 4.0 cm.' },
    ],
  },
  glossary: [
    { term: 'Magnetic field', def: 'A region where a magnetic pole, magnetic material or moving charge experiences a force.' },
    { term: 'Magnetic pole', def: 'The end of a magnet where the field is strongest: north (N) or south (S).' },
    { term: 'Magnetic flux density (B)', def: 'The strength of a magnetic field, in tesla (T).' },
    { term: 'Tesla (T)', def: 'Unit of magnetic flux density.' },
    { term: 'Right-hand grip rule', def: 'Thumb along the conventional current; fingers curl in the direction of the magnetic field.' },
    { term: 'Solenoid', def: 'A long coil of wire; carries a uniform field inside when current flows.' },
    { term: 'Electromagnet', def: 'A coil with a soft iron core that is magnetic only while current flows.' },
    { term: 'Relay', def: 'An electromagnetic switch: a small current in a coil switches a separate circuit.' },
    { term: 'Magnetic materials', def: 'Iron, nickel, cobalt and some alloys, which are strongly attracted by magnets.' },
  ],
  formulas: [
    { name: 'Field of a straight wire', tex: r`B \propto \frac{I}{r}`, note: 'Going deeper: B = μ₀I/2πr.', level: 'L2' },
    { name: 'Field inside a solenoid', tex: r`B = \mu_0 n I`, note: 'n = turns per metre. Going deeper.', level: 'Uni' },
  ],
  flashcards: [
    { front: 'Direction of field lines outside a magnet', back: 'From N to S' }, { front: 'Shape of the field around a straight wire', back: 'Concentric circles' },
    { front: 'Right-hand grip rule', back: 'Thumb = current; fingers = field' }, { front: 'Three ways to strengthen an electromagnet', back: 'More current, more turns, iron core' },
    { front: '× in a field diagram', back: 'Into the page' }, { front: '• in a field diagram', back: 'Out of the page' },
    { front: 'Unit of B', back: 'Tesla (T)' }, { front: 'What does a relay do?', back: 'Uses a small current to switch a large one' },
  ],
};
