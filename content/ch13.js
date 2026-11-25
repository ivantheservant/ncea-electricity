/**
 * Chapter 13 — Magnetic Force.
 */
import { svg, label, arrow } from '../js/utils/svg.js';

const r = String.raw;

/**
 * Field-into-page grid of crosses.
 * @param {number} w Width.
 * @param {number} h Height.
 * @returns {string} SVG markup.
 */
function crosses(w, h) {
  let s = '';
  for (let x = 30; x < w; x += 50) for (let y = 25; y < h; y += 45) s += `<line x1="${x - 5}" y1="${y - 5}" x2="${x + 5}" y2="${y + 5}" class="thin" style="stroke:var(--ink-3)"/><line x1="${x - 5}" y1="${y + 5}" x2="${x + 5}" y2="${y - 5}" class="thin" style="stroke:var(--ink-3)"/>`;
  return s;
}

const WIRE_FORCE = svg(460, 200, crosses(460, 200) +
  '<line x1="60" y1="110" x2="400" y2="110" style="stroke:var(--warn, #c9822b);stroke-width:7"/>' + arrow(180, 132, 280, 132, 'accent') + label(230, 152, 'I', { cls: 'bold' }) +
  arrow(230, 100, 230, 40) + label(240, 60, 'F', { anchor: 'start', cls: 'bold' }) + label(440, 190, 'B into page', { anchor: 'end', cls: 'small' }),
{ title: 'A wire carrying current to the right in a field into the page is pushed up the page', maxw: 500 });

const SLAP = svg(460, 200, [
  arrow(200, 90, 330, 90, 'field'), label(338, 95, 'B — fingers', { anchor: 'start', cls: 'bold' }),
  arrow(200, 90, 200, 175, 'accent'), label(212, 178, 'I — thumb (or v of a + charge)', { anchor: 'start', cls: 'bold' }),
  '<circle cx="200" cy="90" r="13" class="fill-sheet"/><circle cx="200" cy="90" r="3.5" class="solid"/>',
  label(186, 64, 'F — palm pushes out of the page', { anchor: 'end', cls: 'bold' }),
].join(''), { title: 'Right-hand slap rule: fingers along the field, thumb along the current, palm faces the force (here out of the page)', maxw: 500 });

const CIRCLE = svg(460, 230, crosses(460, 230) + '<circle cx="230" cy="115" r="80" class="dash" style="stroke:var(--blue);stroke-width:2.5"/>' +
  '<circle cx="230" cy="195" r="9" style="fill:var(--bad);stroke:none"/>' + arrow(230, 195, 300, 195, 'accent') + label(306, 199, 'v', { anchor: 'start', cls: 'bold' }) +
  arrow(230, 186, 230, 140) + label(240, 160, 'F (towards the centre)', { anchor: 'start', cls: 'small bold' }),
{ title: 'A positive charge moving in a field into the page follows a circle; the force always points to the centre', maxw: 500 });

const SPEAKER = svg(460, 210, [
  '<rect x="40" y="60" width="90" height="90" class="fill-soft"/>', label(85, 110, 'magnet', { cls: 'small bold' }),
  '<rect x="130" y="80" width="40" height="50" style="fill:none;stroke:var(--warn, #c9822b);stroke-width:4"/>', label(150, 150, 'coil', { cls: 'small' }),
  '<path d="M170,80 L330,20 L330,190 L170,130" class="fill-sheet"/>', label(260, 105, 'paper cone', { cls: 'small bold' }),
  arrow(350, 105, 420, 105, 'accent'), arrow(420, 105, 350, 105, 'accent'), label(385, 95, 'vibrates', { cls: 'small' }), label(230, 205, 'AC from the amplifier → force reverses → cone moves in and out', { cls: 'small' }),
].join(''), { title: 'A loudspeaker: AC in a coil in a magnetic field makes the cone vibrate', maxw: 500 });

export default {
  intro: 'A current in a magnetic field feels a force. This one fact runs almost every machine that moves: fans, drills, electric cars, washing machines, hard drives and loudspeakers. This chapter calculates the force on a wire and on a moving charge, finds its direction with your right hand, and explains how a motor keeps turning.',
  standards: 'NCEA Level 2 AS 91173: F = BIL and F = Bqv are on the formula sheet. Motors and the direction of forces are common Merit and Excellence questions.',
  lessons: [
    // ------------------------------------------------------------------ 13.1
    {
      id: '13.1', title: 'Force on a current-carrying wire: F = BIL', levels: ['L2'], minutes: 18,
      objectives: ['Calculate the force on a wire in a magnetic field', 'Find the direction of the force with the right-hand slap rule', 'Explain why there is no force when the wire is parallel to the field'],
      sections: [
        { type: 'text', title: 'The motor effect', html: r`<p>Put a wire carrying a current at right angles to a magnetic field and the wire is pushed sideways — at right angles to <b>both</b> the current and the field. This is the <b>motor effect</b>. It happens because the wire’s own field (Chapter 12) combines with the magnet’s field: stronger on one side, weaker on the other, and the wire is pushed towards the weaker side.</p>` },
        { type: 'formula', title: 'Force on a wire', tex: 'F = BIL', symbols: [['F', 'force on the wire', 'N'], ['B', 'magnetic flux density', 'T'], ['I', 'current', 'A'], ['L', 'length of wire in the field', 'm']], html: r`<p>This applies when the wire is <b>perpendicular</b> to the field. Only the length actually inside the field counts. If the wire runs <b>parallel</b> to the field, there is <b>no force</b>.</p>` },
        { type: 'diagram', svg: WIRE_FORCE, caption: 'Current to the right, field into the page: the force is up the page.' },
        { type: 'text', title: 'Direction: the right-hand slap rule', html: r`<p>Hold your right hand flat. Point your <b>fingers along the field</b> (N to S) and your <b>thumb along the conventional current</b>. Your <b>palm faces the direction of the force</b> — the way you would slap.</p>` },
        { type: 'diagram', svg: SLAP, caption: 'Fingers = B, thumb = I, palm = F. All three are at right angles.' },
        { type: 'example', title: 'force on a wire', q: r`<p>A 0.15 m length of wire carries 4.0 A at right angles to a field of 0.25 T. Find the force on it.</p>`, steps: [r`$F = BIL = 0.25 \times 4.0 \times 0.15$.`, r`$F = 0.15$ N.`], answer: '<p>0.15 N, at right angles to both the wire and the field.</p>' },
        { type: 'example', title: 'finding the field', q: r`<p>A 5.0 cm length of wire carrying 2.0 A feels a force of 0.030 N when perpendicular to a magnetic field. Find B.</p>`, steps: [r`$B = \dfrac{F}{IL} = \dfrac{0.030}{2.0 \times 0.050}$.`, r`$B = 0.30$ T.`], answer: '<p>0.30 T.</p>' },
        { type: 'sim', sim: 'force-lab', caption: 'Wire mode: predict the force direction with your hand, then reverse the field or the current to check.' },
        { type: 'deeper', levels: ['L3', 'Uni'], title: 'wires at an angle', html: r`<p>If the wire makes an angle θ with the field, only the component of the current perpendicular to the field matters: $F = BIL\sin\theta$. At θ = 90° this is $BIL$; at θ = 0° (parallel) it is zero. In vector form, $\vec F = I\vec L \times \vec B$.</p>` },
        { type: 'try', question: { type: 'num', q: 'A 0.40 m wire carries 3.0 A perpendicular to a 0.50 T field. What is the force?', answer: 0.6, unit: 'N', explain: 'F = BIL = 0.50 × 3.0 × 0.40 = 0.60 N.' } },
        { type: 'misconception', wrong: 'The force on the wire is along the field lines, towards the S pole.', right: 'The force is at right angles to both the field and the current. A wire along the field feels no force at all.' },
        { type: 'key', points: ['F = BIL (wire perpendicular to the field).', 'Parallel to the field → no force.', 'Right-hand slap: fingers B, thumb I, palm F.', 'Reverse either the current or the field → force reverses.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 0.20 m wire carrying 5.0 A lies perpendicular to a 0.10 T field. Calculate the force.', answer: 0.1, unit: 'N', explain: 'F = 0.10 × 5.0 × 0.20 = 0.10 N.' },
        { type: 'num', q: 'What current is needed for a 0.50 m wire in a 0.20 T field to feel 0.30 N?', answer: 3, unit: 'A', explain: 'I = F/BL = 0.30 ÷ (0.20 × 0.50) = 3.0 A.' },
        { type: 'mcq', q: 'A wire runs parallel to a magnetic field and carries a current. The force on it is…', options: ['zero', 'maximum', 'along the field', 'along the wire'], answer: 0, explain: 'Only the perpendicular part counts.' },
        { type: 'mcq', q: 'Current flows to the right; the field points into the page. The force on the wire is…', options: ['up the page', 'down the page', 'into the page', 'to the left'], answer: 0, explain: 'Right-hand slap rule.', figure: WIRE_FORCE },
        { type: 'mcq', q: 'Both the current and the field are reversed. The force…', options: ['stays in the same direction', 'reverses', 'becomes zero', 'doubles'], answer: 0, explain: 'Two reversals cancel.' },
      ],
    },
    // ------------------------------------------------------------------ 13.2
    {
      id: '13.2', title: 'Force on a moving charge: F = Bqv', levels: ['L2'], minutes: 18,
      objectives: ['Calculate the force on a charged particle moving through a field', 'Find the force direction for positive and negative charges', 'Explain why charges move in circles in a uniform field'],
      sections: [
        { type: 'text', title: 'Why wires feel forces', html: r`<p>A current is moving charges, so the force on a wire is really the total force on all the charges drifting through it. A single charge moving across a field feels a force too:</p>` },
        { type: 'formula', title: 'Force on a moving charge', tex: 'F = Bqv', symbols: [['F', 'force', 'N'], ['B', 'magnetic flux density', 'T'], ['q', 'charge', 'C'], ['v', 'speed perpendicular to the field', 'm s⁻¹']], html: r`<p>Link to $F = BIL$: in time $t$ a charge $q$ moves a distance $L = vt$, and $I = q/t$. So $BIL = B\dfrac{q}{t}vt = Bqv$. A charge that is <b>stationary</b>, or moving <b>parallel</b> to the field, feels <b>no</b> magnetic force.</p>` },
        { type: 'text', title: 'Direction', html: r`<p>Use the slap rule with your <b>thumb along the velocity of a positive charge</b>. For a <b>negative</b> charge (an electron) the force is the <b>opposite</b> way — or point your thumb opposite to the electron’s velocity (the direction of its conventional current).</p>` },
        { type: 'example', title: 'electron in a field', q: r`<p>An electron moves at $3.0 \times 10^{6}$ m s⁻¹ at right angles to a 0.020 T field. Find the force on it.</p>`, steps: [r`$F = Bqv = 0.020 \times 1.6 \times 10^{-19} \times 3.0 \times 10^{6}$.`, r`$F = 9.6 \times 10^{-15}$ N.`], answer: r`<p>$9.6 \times 10^{-15}$ N, at right angles to its velocity.</p>` },
        { type: 'text', title: 'Circular motion', html: r`<p>The magnetic force is always <b>perpendicular to the velocity</b>. It changes the particle’s direction but never its speed — it does no work. A force that keeps pointing at right angles to the motion makes the particle move in a <b>circle</b> (in a uniform field).</p>` },
        { type: 'diagram', svg: CIRCLE, caption: 'A positive charge in a field into the page circles anticlockwise; an electron would circle clockwise.' },
        { type: 'sim', sim: 'force-lab', caption: 'Moving-charge mode: compare an electron and a proton, and see how the field strength changes the circle.' },
        { type: 'deeper', levels: ['L3', 'Uni'], title: 'radius of the circle', html: r`<p>The magnetic force provides the centripetal force: $Bqv = \dfrac{mv^2}{r}$, so $r = \dfrac{mv}{Bq}$. Heavier or faster particles make bigger circles; stronger fields make smaller ones. A <b>mass spectrometer</b> uses this: ions of different mass curve by different amounts and land in different places, identifying atoms and molecules — used in forensic labs, airport security and carbon dating.</p>` },
        { type: 'text', title: 'Earth’s magnetic shield and auroras', html: r`<p>The Sun sends out fast charged particles (the solar wind). The Earth’s magnetic field deflects most of them, guiding some along field lines towards the poles. When they hit the upper atmosphere they make the air glow: the <b>aurora australis</b>, sometimes visible from the south of New Zealand.</p>` },
        { type: 'try', question: { type: 'num', q: 'A proton moves at 2.0 × 10⁵ m s⁻¹ perpendicular to a 0.50 T field. What is the force on it?', answer: 1.6e-14, unit: 'N', explain: 'F = 0.50 × 1.6 × 10⁻¹⁹ × 2.0 × 10⁵ = 1.6 × 10⁻¹⁴ N.' } },
        { type: 'misconception', wrong: 'A magnetic field speeds charged particles up.', right: 'The magnetic force is always at right angles to the motion, so it changes direction only. Electric fields (Chapter 9) change speed.' },
        { type: 'key', points: ['F = Bqv for motion perpendicular to the field.', 'No force on a stationary charge or one moving along the field.', 'Slap rule with thumb along a + charge’s velocity; reverse for electrons.', 'Force ⟂ velocity → circular motion, constant speed.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'An electron moves at 5.0 × 10⁶ m s⁻¹ perpendicular to a 0.10 T field. Calculate the force.', answer: 8e-14, unit: 'N', explain: 'F = 0.10 × 1.6 × 10⁻¹⁹ × 5.0 × 10⁶ = 8.0 × 10⁻¹⁴ N.' },
        { type: 'mcq', q: 'A charged particle is at rest in a magnetic field. The magnetic force on it is…', options: ['zero', 'Bq', 'maximum', 'towards the N pole'], answer: 0, explain: 'v = 0, so F = Bqv = 0.' },
        { type: 'mcq', q: 'Why does the magnetic force not change a particle’s speed?', options: ['It always acts at right angles to the velocity', 'It is too small', 'It only acts on stationary charges', 'It acts along the velocity'], answer: 0, explain: 'No component along the motion.' },
        { type: 'mcq', q: 'A proton and an electron enter the same field with the same velocity. Their forces are…', options: ['equal in size, opposite in direction', 'equal and in the same direction', 'larger on the proton', 'larger on the electron'], answer: 0, explain: 'Same size of charge, opposite sign.' },
        { type: 'num', q: 'What speed must a proton have to feel 3.2 × 10⁻¹⁴ N in a 0.40 T field?', answer: 5e5, unit: 'm s⁻¹', explain: 'v = F/(Bq) = 3.2 × 10⁻¹⁴ ÷ (0.40 × 1.6 × 10⁻¹⁹) = 5.0 × 10⁵ m s⁻¹.' },
      ],
    },
    // ------------------------------------------------------------------ 13.3
    {
      id: '13.3', title: 'The DC motor', levels: ['L2'], minutes: 18,
      objectives: ['Explain how forces on a coil produce rotation', 'Explain the job of the split-ring commutator and brushes', 'State how to make a motor turn faster or reverse'],
      sections: [
        { type: 'text', title: 'A coil in a field', html: r`<p>Put a rectangular coil of wire between the poles of a magnet and pass a current through it. The two long sides carry current in <b>opposite directions</b>, so (F = BIL) one side is pushed up and the other down. These two forces form a <b>turning effect</b> (torque) and the coil rotates.</p>
<p>The turning effect is largest when the coil is <b>parallel</b> to the field (the forces act furthest from the axis) and zero when the coil is <b>perpendicular</b> to the field (the forces line up through the axis).</p>` },
        { type: 'text', title: 'The split-ring commutator', html: r`<p>Once the coil passes the vertical position, the forces would push it back the other way — it would just rock and stop. The <b>split-ring commutator</b> solves this: it is a ring cut into two halves, attached to the coil and turning with it. Carbon <b>brushes</b> press against it to carry the current in. Every half-turn, each half of the ring swaps from one brush to the other, <b>reversing the current in the coil</b>. So the side of the coil nearest a given pole always has current in the same direction, and the coil keeps turning the same way.</p>` },
        { type: 'sim', sim: 'dc-motor', caption: 'Switch on with the commutator, then untick it and switch on again. What changes?' },
        { type: 'text', title: 'Controlling a motor', html: r`<ul><li><b>Faster / stronger:</b> more current, a stronger magnet, more turns on the coil, a larger coil, and a soft iron core (armature) inside the coil.</li><li><b>Reverse direction:</b> reverse the current or swap the magnet’s poles.</li></ul>
<p>Real motors use several coils at different angles so the turning effect is smooth, and many modern motors (in drones, electric cars and computer fans) are “brushless”: electronics switch the current instead of a commutator.</p>` },
        { type: 'example', title: 'force on the coil side', q: r`<p>A motor coil has 50 turns. Each side is 0.040 m long and lies in a 0.20 T field. The current is 1.5 A. What force acts on one side of the coil?</p>`, steps: [r`Force on one wire: $F = BIL = 0.20 \times 1.5 \times 0.040 = 0.012$ N.`, r`50 turns → 50 wires on that side: $F = 50 \times 0.012 = 0.60$ N.`], answer: '<p>0.60 N on each side (in opposite directions).</p>' },
        { type: 'misconception', wrong: 'The commutator changes AC into DC in a motor.', right: 'In a DC motor the commutator takes a steady DC supply and reverses the current in the coil every half-turn, so the turning effect always acts the same way.' },
        { type: 'funfact', title: 'the first motor', html: 'In 1821 Michael Faraday made the first electric motor: a wire hanging into a bowl of mercury with a magnet in the middle. When current flowed, the wire swung round and round the magnet.' },
        { type: 'key', points: ['Opposite currents in the two sides → opposite forces → turning effect.', 'Turning effect largest when the coil is parallel to the field.', 'Split-ring commutator reverses the current every half-turn.', 'Faster: more current, stronger field, more turns, iron core.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'Why does a current-carrying coil in a magnetic field turn?', options: ['The two sides carry opposite currents, so they are pushed in opposite directions', 'The coil is attracted to the north pole', 'The field pushes electrons out of the coil', 'The coil becomes hot'], answer: 0, explain: 'Opposite forces form a turning effect.' },
        { type: 'mcq', q: 'What does the split-ring commutator do?', options: ['Reverses the current in the coil every half-turn', 'Increases the voltage', 'Holds the magnet in place', 'Stores energy'], answer: 0, explain: 'Keeps the turning effect in one direction.' },
        { type: 'mcq', q: 'In which position is the turning effect on the coil zero?', options: ['When the coil is perpendicular to the field', 'When the coil is parallel to the field', 'At 45°', 'It is never zero'], answer: 0, explain: 'The forces line up through the axis.' },
        { type: 'mcq', q: 'Which change would NOT make the motor turn faster?', options: ['Using a weaker magnet', 'Increasing the current', 'Adding more turns', 'Adding an iron core'], answer: 0, explain: 'A weaker field means smaller forces.' },
        { type: 'num', q: 'A 100-turn coil side is 0.050 m long in a 0.30 T field with 2.0 A. What is the force on that side?', answer: 3, unit: 'N', explain: 'Per wire 0.30 × 2.0 × 0.050 = 0.030 N; × 100 = 3.0 N.' },
      ],
    },
    // ------------------------------------------------------------------ 13.4
    {
      id: '13.4', title: 'Loudspeakers, meters and other uses', levels: ['L2'], minutes: 12,
      objectives: ['Explain how a loudspeaker produces sound', 'Describe other applications of the motor effect'],
      sections: [
        { type: 'text', title: 'Loudspeakers', html: r`<p>A loudspeaker has a coil attached to a paper or plastic cone, sitting in the field of a permanent magnet. The amplifier sends an <b>alternating</b> current through the coil. Each time the current reverses, the force (F = BIL) reverses, so the coil and cone are pushed in and out. The vibrating cone pushes the air, making sound waves at the same frequency as the current. A bigger current → bigger force → bigger vibrations → louder sound.</p>` },
        { type: 'diagram', svg: SPEAKER, caption: 'The AC signal makes the force on the coil reverse many times a second.' },
        { type: 'text', title: 'More uses', html: r`<ul><li><b>Analogue meters</b> (galvanometers): a coil on a spring turns further when more current flows, moving a needle.</li><li><b>Hard drives</b>: a tiny voice-coil motor swings the read arm across the spinning disk in milliseconds.</li><li><b>Electric vehicles</b>: powerful motors turn electrical energy into motion with about 90% efficiency.</li><li><b>Particle beams</b>: magnets steer electrons in hospital X-ray machines and protons in accelerators.</li></ul>` },
        { type: 'misconception', wrong: 'A loudspeaker works using DC.', right: 'A steady DC would push the cone out once and hold it there — no sound. The current must vary (AC) to make the cone vibrate.' },
        { type: 'key', points: ['Loudspeaker: AC in a coil in a magnet’s field → reversing force → vibrating cone.', 'Frequency of sound = frequency of the current.', 'Meters, hard drives, EVs and particle beams all use magnetic forces.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'Why does a loudspeaker cone vibrate?', options: ['The alternating current makes the force on the coil keep reversing', 'The magnet vibrates by itself', 'The coil heats and cools', 'Sound waves push it'], answer: 0, explain: 'AC → reversing F = BIL.' },
        { type: 'mcq', q: 'What happens if the current in a loudspeaker is increased?', options: ['The sound gets louder', 'The pitch gets higher', 'The cone stops moving', 'The magnet reverses'], answer: 0, explain: 'Bigger force, bigger vibration.' },
        { type: 'mcq', q: 'A 440 Hz current flows through a loudspeaker. The sound has a frequency of…', options: ['440 Hz', '220 Hz', '880 Hz', '50 Hz'], answer: 0, explain: 'The cone follows the current.' },
        { type: 'mcq', q: 'Which device does NOT rely on the motor effect?', options: ['A filament lamp', 'A loudspeaker', 'An electric drill', 'An analogue ammeter'], answer: 0, explain: 'A lamp uses the heating effect.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'Calculate the force on a 0.25 m wire carrying 2.0 A perpendicular to a 0.40 T field.', answer: 0.2, unit: 'N', explain: 'F = 0.40 × 2.0 × 0.25 = 0.20 N.' },
      { type: 'num', q: 'Calculate the force on a proton moving at 1.0 × 10⁶ m s⁻¹ perpendicular to a 0.20 T field.', answer: 3.2e-14, unit: 'N', explain: 'F = 0.20 × 1.6 × 10⁻¹⁹ × 1.0 × 10⁶ = 3.2 × 10⁻¹⁴ N.' },
      { type: 'mcq', q: 'In the right-hand slap rule, the fingers point along…', options: ['the magnetic field', 'the current', 'the force', 'the electron flow'], answer: 0, explain: 'Fingers = B.' },
      { type: 'mcq', q: 'Name the part of a DC motor that reverses the current every half-turn.', options: ['Split-ring commutator', 'Brush', 'Armature', 'Magnet'], answer: 0, explain: 'The commutator.' },
      { type: 'mcq', q: 'A wire is parallel to a magnetic field. The force on it is…', options: ['zero', 'BIL', 'doubled', 'towards N'], answer: 0, explain: 'No perpendicular component.' },
    ],
    M: [
      { type: 'num', q: 'A horizontal wire of length 0.20 m and mass 6.0 g is in a horizontal field of 0.30 T at right angles to it. What current will make the magnetic force balance its weight? (g = 9.8 N kg⁻¹)', answer: 0.98, unit: 'A', explain: 'Weight = 0.0060 × 9.8 = 0.0588 N; I = F/BL = 0.0588 ÷ (0.30 × 0.20) = 0.98 A.' },
      { type: 'explain', q: 'Explain why a charged particle moving at right angles to a uniform magnetic field travels in a circle at constant speed.', model: '<p>The magnetic force on a moving charge, F = Bqv, always acts at right angles to both the field and the velocity. Because it is perpendicular to the velocity, it has no component along the direction of motion, so it does no work and the speed (and kinetic energy) stays constant. It only changes the direction of motion. As the particle turns, the force turns with it and stays perpendicular — always pointing towards the same centre — and with constant speed in a uniform field the force has a constant size, so the particle moves in a circle.</p>', points: [{ lvl: 'A', text: 'Force is at right angles to the velocity' }, { lvl: 'M', text: 'No work done, so speed constant' }, { lvl: 'M', text: 'Constant-size force always towards a centre → circle' }] },
      { type: 'explain', q: 'Explain why a simple coil in a magnetic field will not keep spinning without a split-ring commutator.', model: '<p>Without a commutator the current in each side of the coil always flows the same way. The forces on the two sides make a turning effect that rotates the coil until it is perpendicular to the field. Once it passes this position, the force on each side still acts in the same direction (up or down), so the turning effect now acts the other way and pushes the coil back. The coil rocks backwards and forwards and settles in the perpendicular position. The commutator reverses the current every half-turn, so the turning effect always acts in the same rotational direction.</p>', points: [{ lvl: 'A', text: 'The coil would rock/stop at the vertical' }, { lvl: 'M', text: 'After the vertical the turning effect reverses' }, { lvl: 'M', text: 'Commutator reverses the current each half-turn so rotation continues' }] },
      { type: 'num', q: 'An electron in a 5.0 mT field feels a force of 1.6 × 10⁻¹⁵ N. What is its speed?', answer: 2e6, unit: 'm s⁻¹', explain: 'v = F/(Bq) = 1.6 × 10⁻¹⁵ ÷ (0.0050 × 1.6 × 10⁻¹⁹) = 2.0 × 10⁶ m s⁻¹.' },
    ],
    E: [
      { type: 'explain', q: 'Describe how a DC motor works, explaining the forces on the coil, the role of the commutator, and three ways to make it turn faster.', model: '<p>A rectangular coil sits between the poles of a magnet. Current enters through brushes and a split-ring commutator. The two long sides of the coil carry current in opposite directions, perpendicular to the field, so each feels a force F = BIL (direction by the right-hand slap rule): one side is pushed up and the other down. These forces form a turning effect, largest when the coil is parallel to the field. When the coil reaches the perpendicular position, the gaps in the commutator pass the brushes and each half of the ring swaps to the other brush, reversing the current in the coil. Now the side nearer each pole again has current in the original direction, so the forces keep turning the coil the same way. Its momentum carries it past the perpendicular position. To make it turn faster: increase the current, use a stronger magnet, use more turns on the coil (or a larger coil, or an iron armature) — each increases the forces and the turning effect.</p>', points: [{ lvl: 'A', text: 'Opposite forces on the two sides make it turn' }, { lvl: 'M', text: 'Forces from F = BIL with correct reasoning on direction' }, { lvl: 'E', text: 'Commutator reverses current every half-turn so rotation continues in one direction' }, { lvl: 'E', text: 'Three valid ways to increase speed, each linked to larger force' }] },
      { type: 'explain', q: 'A proton and an electron enter the same uniform magnetic field at the same speed, perpendicular to the field. Compare their paths.', model: '<p>Both feel a force F = Bqv of the same size, because their charges have the same size and they have the same speed. The forces are in opposite directions, because the charges have opposite signs, so the particles curve in opposite directions (one clockwise, one anticlockwise). Both move in circles at constant speed. The radius of each circle is r = mv/Bq. The proton’s mass is about 1840 times larger, so its circle is about 1840 times bigger: the electron curves very sharply while the proton is only gently deflected.</p>', points: [{ lvl: 'A', text: 'They curve in opposite directions' }, { lvl: 'M', text: 'Same size force; opposite charge signs' }, { lvl: 'E', text: 'Both circles at constant speed' }, { lvl: 'E', text: 'Proton’s radius about 1840 times larger (r = mv/Bq)' }] },
      { type: 'num', q: 'A 0.15 m rod carrying 4.0 A sits on two horizontal rails in a vertical 0.50 T field. Friction is 0.10 N. What is the resultant force on the rod?', answer: 0.2, unit: 'N', explain: 'Magnetic force = 0.50 × 4.0 × 0.15 = 0.30 N; resultant = 0.30 − 0.10 = 0.20 N.' },
    ],
  },
  glossary: [
    { term: 'Motor effect', def: 'The force on a current-carrying conductor in a magnetic field.' },
    { term: 'Right-hand slap rule', def: 'Fingers along B, thumb along the current (or a + charge’s velocity); the palm faces the force.' },
    { term: 'Torque', def: 'A turning effect of a force.' },
    { term: 'Split-ring commutator', def: 'A split ring on a motor’s axle that reverses the current in the coil every half-turn.' },
    { term: 'Brushes', def: 'Carbon contacts that press on the commutator to carry current to the coil.' },
    { term: 'Armature', def: 'The rotating coil (often wound on iron) in a motor or generator.' },
    { term: 'Loudspeaker', def: 'A device using the motor effect on a coil to vibrate a cone and make sound.' },
    { term: 'Mass spectrometer', def: 'An instrument that separates ions by mass using magnetic deflection.' },
  ],
  formulas: [
    { name: 'Force on a wire', tex: 'F = BIL', note: 'Wire ⟂ field. Going deeper: F = BIL sin θ.', level: 'L2' },
    { name: 'Force on a moving charge', tex: 'F = Bqv', note: 'Velocity ⟂ field. No force if at rest or parallel.', level: 'L2' },
    { name: 'Radius of circular path', tex: r`r = \frac{mv}{Bq}`, note: 'Going deeper.', level: 'L3 / Uni' },
  ],
  flashcards: [
    { front: 'Force on a wire in a field', back: 'F = BIL' }, { front: 'Force on a moving charge', back: 'F = Bqv' },
    { front: 'Right-hand slap rule', back: 'Fingers B, thumb I, palm F' }, { front: 'Force on a wire parallel to B', back: 'Zero' },
    { front: 'Path of a charge ⟂ uniform B', back: 'Circle at constant speed' }, { front: 'Job of the split-ring commutator', back: 'Reverse the coil current every half-turn' },
    { front: 'How does a loudspeaker make sound?', back: 'AC in a coil in a magnetic field → cone vibrates' },
  ],
};
