/**
 * Chapter 14 — Electromagnetic Induction.
 */
import { svg, comp, wire, label, arrow } from '../js/utils/svg.js';

const r = String.raw;

/**
 * Field-into-page grid of crosses.
 * @param {number} x0 Left.
 * @param {number} y0 Top.
 * @param {number} w Width.
 * @param {number} h Height.
 * @returns {string} SVG markup.
 */
function crosses(x0, y0, w, h) {
  let s = '';
  for (let x = x0 + 20; x < x0 + w; x += 45) for (let y = y0 + 20; y < y0 + h; y += 40) s += `<line x1="${x - 5}" y1="${y - 5}" x2="${x + 5}" y2="${y + 5}" class="thin" style="stroke:var(--ink-3)"/><line x1="${x - 5}" y1="${y + 5}" x2="${x + 5}" y2="${y - 5}" class="thin" style="stroke:var(--ink-3)"/>`;
  return s;
}

const ROD = svg(480, 210, crosses(40, 10, 430, 190) + wire([60, 40], [450, 40]) + wire([60, 170], [450, 170]) + comp('resistor', 60, 40, 60, 170, { label: 'R', labelPos: 'right' }) +
  '<line x1="300" y1="30" x2="300" y2="180" style="stroke:var(--warn, #c9822b);stroke-width:8"/>' + arrow(312, 105, 380, 105, 'accent') + label(386, 110, 'v', { anchor: 'start', cls: 'bold' }) +
  arrow(286, 150, 286, 60) + label(278, 70, 'I', { anchor: 'end', cls: 'bold' }) + label(320, 196, 'L = length of rod between the rails', { cls: 'small' }),
{ title: 'A rod moving right along rails in a field into the page: the induced current flows up the rod', maxw: 520 });

const GEN = svg(500, 230, [
  '<rect x="20" y="40" width="70" height="140" rx="8" style="fill:color-mix(in srgb, var(--bad) 35%, var(--sheet))"/>', label(55, 115, 'N', { cls: 'bold' }),
  '<rect x="300" y="40" width="70" height="140" rx="8" style="fill:color-mix(in srgb, var(--blue) 35%, var(--sheet))"/>', label(335, 115, 'S', { cls: 'bold' }),
  '<rect x="130" y="60" width="130" height="100" style="fill:none;stroke:var(--warn, #c9822b);stroke-width:5"/>', wire([195, 160], [195, 190]),
  '<ellipse cx="195" cy="195" rx="22" ry="6" style="stroke-width:3"/><ellipse cx="195" cy="210" rx="22" ry="6" style="stroke-width:3"/>', label(240, 206, 'slip rings', { anchor: 'start', cls: 'small bold' }),
  wire([173, 195], [120, 195], [120, 222], [420, 222]), wire([217, 210], [440, 210], [440, 120]), comp('bulb', 440, 120, 440, 40, { label: 'lamp', labelPos: 'right' }), wire([440, 40], [420, 40], [420, 222]),
  arrow(200, 30, 240, 40, 'accent'), label(250, 34, 'coil turns', { anchor: 'start', cls: 'small bold' }),
].join(''), { title: 'AC generator: a coil turning between magnet poles, connected through slip rings to a lamp', maxw: 520 });

export default {
  intro: 'In 1831 Michael Faraday discovered the reverse of the motor effect: moving a wire through a magnetic field, or changing the field through a coil, produces a voltage. This is electromagnetic induction. It is how almost all of the world’s electricity is generated — including every turbine at every New Zealand hydro dam, geothermal station and wind farm.',
  standards: 'NCEA Level 2 AS 91173: V = BvL is on the formula sheet; Lenz’s law and generators are common Merit and Excellence topics. Faraday’s law with flux appears at Level 3.',
  lessons: [
    // ------------------------------------------------------------------ 14.1
    {
      id: '14.1', title: 'Inducing a voltage', levels: ['L2'], minutes: 15,
      objectives: ['Describe ways to induce a voltage', 'State the factors that affect the size of an induced voltage', 'Explain the importance of relative motion and change'],
      sections: [
        { type: 'text', title: 'Faraday’s discovery', html: r`<p>Connect a coil to a sensitive meter (a galvanometer) and push a magnet into it: the needle flicks. Hold the magnet still: nothing. Pull it out: the needle flicks the <b>other</b> way. A voltage — and, in a complete circuit, a current — is <b>induced</b> whenever the magnetic field through a conductor <b>changes</b>, or a conductor <b>moves across</b> a field.</p>
<p>It is the <b>relative</b> motion that matters: moving the coil over a still magnet works just as well.</p>` },
        { type: 'sim', sim: 'induction-lab', caption: 'Choose “Magnet and coil”. Push in, pull out, try different speeds and turns, and turn the magnet round.' },
        { type: 'text', title: 'What makes the voltage bigger?', html: r`<ul><li>Moving <b>faster</b> (changing the field more quickly).</li><li>A <b>stronger</b> magnet.</li><li><b>More turns</b> on the coil (each turn adds its own voltage, like cells in series).</li><li>A larger coil area cutting the field (and an iron core inside the coil).</li></ul>
<p>Reversing the motion, or the magnet’s poles, reverses the direction of the induced voltage.</p>` },
        { type: 'misconception', wrong: 'A magnet sitting inside a coil makes a current flow, because the field is passing through the coil.', right: 'A steady field induces nothing. Only a changing field (or a conductor moving across a field) induces a voltage.' },
        { type: 'funfact', title: 'a mission to make electricity from magnetism', html: 'In 1822 Faraday wrote in his notebook: “Convert magnetism into electricity.” It took him nine years to succeed — the trick he had missed was that the magnetism had to be changing.' },
        { type: 'key', points: ['Changing field or a conductor cutting a field → induced voltage.', 'Bigger: faster, stronger magnet, more turns, larger area.', 'Reverse the motion or the poles → reverse the voltage.', 'No change, no voltage.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'A magnet is held still inside a coil connected to a meter. The meter reads…', options: ['zero', 'a steady current', 'a large current', 'a current that reverses'], answer: 0, explain: 'No change in field, no induced voltage.' },
        { type: 'mcq', q: 'Which change increases the induced voltage when a magnet is pushed into a coil?', options: ['Pushing it in faster', 'Using a weaker magnet', 'Using fewer turns', 'Pushing it in more slowly'], answer: 0, explain: 'Faster change → larger voltage.' },
        { type: 'mcq', q: 'The magnet is pulled out instead of pushed in. The induced current…', options: ['reverses direction', 'stays the same direction', 'stops', 'doubles'], answer: 0, explain: 'Opposite change → opposite direction.' },
        { type: 'mcq', q: 'Which also induces a voltage?', options: ['Moving the coil towards a still magnet', 'Holding both still', 'Heating the magnet slightly', 'Painting the coil'], answer: 0, explain: 'Relative motion counts.' },
        { type: 'mcq', q: 'Why does a coil with more turns give a bigger voltage?', options: ['Each turn has a voltage induced in it, and they add up in series', 'It has less resistance', 'It makes the magnet stronger', 'It moves faster'], answer: 0, explain: 'Like cells in series.' },
      ],
    },
    // ------------------------------------------------------------------ 14.2
    {
      id: '14.2', title: 'Voltage across a moving conductor: V = BvL', levels: ['L2'], minutes: 18,
      objectives: ['Explain the induced voltage using the force on charges', 'Calculate the induced voltage with V = BvL', 'Find the direction of the induced current'],
      sections: [
        { type: 'text', title: 'Why charges move', html: r`<p>A metal rod contains free electrons. When the rod moves through a magnetic field, those charges move with it — and moving charges in a field feel a force, F = Bqv (Lesson 13.2). This force pushes charges along the rod, so one end becomes positive and the other negative: a <b>voltage</b> appears across the rod. If the ends are connected into a circuit, a current flows.</p>` },
        { type: 'formula', title: 'Induced voltage', tex: 'V = BvL', symbols: [['V', 'induced voltage (EMF)', 'V'], ['B', 'magnetic flux density', 'T'], ['v', 'speed of the conductor (⟂ to B and to its length)', 'm s⁻¹'], ['L', 'length of conductor in the field', 'm']], html: r`<p><b>Where it comes from:</b> charge builds up until the electric force from the separated charges balances the magnetic force: $Eq = Bqv$, so $E = Bv$. For a rod of length $L$, $V = EL = BvL$.</p>` },
        { type: 'diagram', svg: ROD, caption: 'Rod moving right, field into the page: the force on positive charges in the rod is up, so conventional current flows up the rod and round the circuit.' },
        { type: 'text', title: 'Direction of the induced current', html: r`<p>Use the right-hand slap rule on the charges in the rod: <b>fingers along the field</b>, <b>thumb along the rod’s velocity</b> (the charges move with it), and the <b>palm faces the direction positive charges are pushed</b> along the rod — the direction of the induced conventional current inside the rod. That end of the rod becomes the positive terminal for the external circuit.</p>` },
        { type: 'example', title: 'a sliding rod', q: r`<p>A 0.30 m rod slides at 4.0 m s⁻¹ along rails in a 0.50 T field (as in the diagram). The rails are connected by a 2.0 Ω resistor. Find the induced voltage and current.</p>`, steps: [r`$V = BvL = 0.50 \times 4.0 \times 0.30 = 0.60$ V.`, r`$I = \dfrac{V}{R} = \dfrac{0.60}{2.0} = 0.30$ A.`], answer: '<p>0.60 V and 0.30 A, flowing up the rod (and down through the resistor).</p>' },
        { type: 'example', title: 'a plane’s wings', q: r`<p>A plane with a wingspan of 40 m flies horizontally at 250 m s⁻¹ where the vertical component of the Earth’s field is $5.0 \times 10^{-5}$ T. What voltage is induced between the wing tips?</p>`, steps: [r`$V = BvL = 5.0 \times 10^{-5} \times 250 \times 40$.`, r`$V = 0.50$ V.`], answer: '<p>0.50 V — too small to be useful, and no current flows because there is no complete circuit.</p>' },
        { type: 'sim', sim: 'induction-lab', caption: '“Rod on rails” mode: change v, B and L, and watch V = BvL and the backwards force.' },
        { type: 'try', question: { type: 'num', q: 'A 0.25 m wire moves at 8.0 m s⁻¹ perpendicular to a 0.20 T field. What voltage is induced?', answer: 0.4, unit: 'V', explain: 'V = 0.20 × 8.0 × 0.25 = 0.40 V.' } },
        { type: 'misconception', wrong: 'A voltage is induced in a wire moving along (parallel to) the field lines.', right: 'The conductor must cut across the field. Moving parallel to the field, or sliding the rod along its own length, induces nothing.' },
        { type: 'key', points: ['Moving charges in a field feel F = Bqv → charge separation → voltage.', 'V = BvL (B, v and L all perpendicular).', 'Slap rule: fingers B, thumb v, palm = direction + charges move in the rod.', 'Current only flows if there is a complete circuit.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 0.50 m rod moves at 3.0 m s⁻¹ through a 0.40 T field. Calculate the induced voltage.', answer: 0.6, unit: 'V', explain: 'V = 0.40 × 3.0 × 0.50 = 0.60 V.' },
        { type: 'num', q: 'How fast must a 0.20 m rod move through a 0.25 T field to induce 0.10 V?', answer: 2, unit: 'm s⁻¹', explain: 'v = V/(BL) = 0.10 ÷ 0.050 = 2.0 m s⁻¹.' },
        { type: 'mcq', q: 'A rod moves to the right through a field into the page. Conventional current in the rod flows…', options: ['up the page', 'down the page', 'to the right', 'there is no current'], answer: 0, explain: 'Slap rule on positive charges.', figure: ROD },
        { type: 'mcq', q: 'An isolated rod (not in a circuit) moves through a field. Which is true?', options: ['A voltage is induced but no steady current flows', 'A large current flows', 'Nothing happens', 'The rod becomes a magnet'], answer: 0, explain: 'Charges separate until the forces balance.' },
        { type: 'num', q: 'The rod in the last numerical question (0.60 V) is part of a circuit with total resistance 3.0 Ω. What current flows?', answer: 0.2, unit: 'A', explain: 'I = 0.60/3.0 = 0.20 A.' },
      ],
    },
    // ------------------------------------------------------------------ 14.3
    {
      id: '14.3', title: "Lenz's law", levels: ['L2'], minutes: 16,
      objectives: ["State Lenz's law", 'Explain it using conservation of energy', 'Describe magnetic braking and eddy currents'],
      sections: [
        { type: 'text', title: 'The induced current fights back', html: r`<p><b>Lenz’s law:</b> the induced current always flows in the direction that <b>opposes the change</b> that caused it.</p>
<ul><li>Push a north pole into a coil → the induced current makes the near end of the coil a <b>north</b> pole, which <b>repels</b> the magnet.</li><li>Pull the north pole out → the near end becomes a <b>south</b> pole, which <b>attracts</b> the magnet back.</li><li>A rod sliding on rails → the induced current in the rod feels a force (F = BIL) <b>backwards</b>, slowing it down.</li></ul>` },
        { type: 'text', title: 'Why it must be so: energy', html: r`<p>Suppose the induced current helped the motion instead. The magnet would speed up, inducing a bigger current, which would speed it up more — free energy from nothing. That would break the conservation of energy. Because the induced current opposes the motion, <b>you must do work</b> to keep the magnet or rod moving, and that work is exactly the electrical energy produced (which ends up as heat in the circuit).</p>` },
        { type: 'example', title: 'the work needed', q: r`<p>In Lesson 14.2’s example (B = 0.50 T, L = 0.30 m, I = 0.30 A, v = 4.0 m s⁻¹), find the backwards force on the rod and the power needed to keep it moving.</p>`, steps: [r`$F = BIL = 0.50 \times 0.30 \times 0.30 = 0.045$ N, backwards.`, r`Power $= Fv = 0.045 \times 4.0 = 0.18$ W.`, r`Check: electrical power $= VI = 0.60 \times 0.30 = 0.18$ W ✓ — the energy is conserved.`], answer: '<p>0.045 N; 0.18 W — exactly the electrical power delivered to the resistor.</p>' },
        { type: 'text', title: 'Eddy currents and magnetic braking', html: r`<p>Induced currents also swirl around inside solid pieces of metal moving through a field: <b>eddy currents</b>. By Lenz’s law they oppose the motion.</p>
<ul><li>A strong magnet dropped down a copper pipe falls very slowly — eddy currents in the pipe repel it.</li><li>Trains, roller coasters and some trucks use <b>magnetic (eddy-current) brakes</b>: smooth, with no parts rubbing.</li><li><b>Induction cooktops</b> use a rapidly changing field to induce eddy currents in the base of the pot, heating it directly.</li><li>Transformers use thin, insulated layers of iron to <b>reduce</b> unwanted eddy currents (Chapter 15).</li></ul>` },
        { type: 'misconception', wrong: 'The induced current always flows in the same direction as the original current or field.', right: 'It flows to oppose the change. If the field through a coil is increasing, the induced current makes a field in the opposite direction; if it is decreasing, the induced field is in the same direction, trying to keep it.' },
        { type: 'funfact', title: 'the slow-motion magnet', html: 'Drop a strong neodymium magnet down a thick copper pipe and it can take several seconds to fall half a metre, hovering as if in syrup. Drop a non-magnetic metal of the same size and it falls straight through.' },
        { type: 'key', points: ["Lenz's law: the induced current opposes the change causing it.", 'It is required by conservation of energy: work must be done.', 'Rod on rails: backwards force F = BIL; power Fv = VI.', 'Eddy currents: braking, induction cooking; reduced in transformers by laminations.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'A north pole is pushed into a coil. The end of the coil nearest the magnet becomes…', options: ['a north pole, repelling the magnet', 'a south pole, attracting the magnet', 'neutral', 'a north pole, attracting the magnet'], answer: 0, explain: 'It opposes the approach.' },
        { type: 'mcq', q: "Lenz's law is a consequence of conservation of…", options: ['energy', 'charge', 'mass', 'momentum only'], answer: 0, explain: 'You must do work to produce electrical energy.' },
        { type: 'mcq', q: 'Why does a magnet fall slowly through a copper pipe?', options: ['Eddy currents induced in the pipe oppose its motion', 'Copper is magnetic', 'Air resistance is large in pipes', 'The magnet loses its magnetism'], answer: 0, explain: 'Lenz’s law.' },
        { type: 'num', q: 'A rod carrying an induced current of 2.0 A, 0.10 m long, moves in a 0.40 T field. What backwards force acts on it?', answer: 0.08, unit: 'N', explain: 'F = BIL = 0.40 × 2.0 × 0.10 = 0.080 N.' },
        { type: 'mcq', q: 'If a coil is not connected in a complete circuit, pushing a magnet into it…', options: ['induces a voltage but almost no opposing force', 'needs a large force', 'is impossible', 'makes the coil spin'], answer: 0, explain: 'No current → no opposing magnetic force.' },
      ],
    },
    // ------------------------------------------------------------------ 14.4
    {
      id: '14.4', title: "Magnetic flux and Faraday's law", levels: ['L2', 'L3'], minutes: 18,
      objectives: ['Define magnetic flux', 'Use Faraday’s law to calculate an induced EMF', 'Link V = BvL to the rate of change of flux'],
      sections: [
        { type: 'formula', title: 'Magnetic flux', tex: r`\Phi = BA`, symbols: [[r`\Phi`, 'magnetic flux', 'weber (Wb)'], ['B', 'flux density (⟂ to the area)', 'T'], ['A', 'area', 'm²']], html: r`<p><b>Flux</b> is the “amount of field” passing through an area: field strength × area (when the field is perpendicular to the area). That is why $B$ is called flux <b>density</b>: flux per square metre. 1 Wb = 1 T m².</p>` },
        { type: 'formula', title: "Faraday's law", tex: r`\varepsilon = -N\frac{\Delta\Phi}{\Delta t}`, symbols: [[r`\varepsilon`, 'induced EMF', 'V'], ['N', 'number of turns', ''], [r`\Delta\Phi / \Delta t`, 'rate of change of flux', 'Wb s⁻¹']], html: r`<p>The induced EMF equals the <b>rate of change of flux linkage</b> ($N\Phi$). The minus sign is Lenz’s law: the EMF opposes the change.</p>` },
        { type: 'example', title: 'a coil in a changing field', q: r`<p>A 200-turn coil of area 0.0050 m² sits perpendicular to a field that rises steadily from 0 to 0.30 T in 0.10 s. Find the size of the induced EMF.</p>`, steps: [r`Change of flux: $\Delta\Phi = \Delta B \times A = 0.30 \times 0.0050 = 1.5 \times 10^{-3}$ Wb.`, r`$\varepsilon = N\dfrac{\Delta\Phi}{\Delta t} = 200 \times \dfrac{1.5 \times 10^{-3}}{0.10}$.`, r`$\varepsilon = 3.0$ V.`], answer: '<p>3.0 V (only while the field is changing).</p>' },
        { type: 'text', title: 'Same law, two pictures', html: r`<p>The rod on rails is a special case. In time $\Delta t$ the rod moves $v\Delta t$, sweeping out an area $Lv\Delta t$, so the flux in the circuit changes by $\Delta\Phi = BLv\Delta t$. Faraday’s law (with $N = 1$) gives $\varepsilon = \Delta\Phi/\Delta t = BvL$ — exactly Lesson 14.2.</p>` },
        { type: 'text', title: 'Reading flux graphs', html: r`<p>On a graph of flux against time, the induced EMF is (minus N times) the <b>gradient</b>. Where flux is steady, the EMF is zero; where it changes fastest, the EMF is largest. For a coil rotating in a field, the flux is largest when the coil faces the field — but that is exactly where it is changing <b>least</b>, so the EMF is zero there (Lesson 14.5).</p>` },
        { type: 'try', question: { type: 'num', q: 'The flux through a 50-turn coil falls from 4.0 × 10⁻³ Wb to zero in 0.020 s. What EMF is induced (size)?', answer: 10, unit: 'V', explain: 'ε = 50 × 4.0 × 10⁻³ ÷ 0.020 = 10 V.' } },
        { type: 'misconception', wrong: 'A large flux through a coil means a large induced EMF.', right: 'It is the rate of change of flux that matters. A huge steady flux induces nothing.' },
        { type: 'key', points: [r`Flux $\Phi = BA$ (Wb); B = flux per m².`, r`Faraday: $\varepsilon = -N\,\Delta\Phi/\Delta t$.`, 'Minus sign = Lenz’s law.', 'EMF = gradient of the flux–time graph (× N).'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 0.20 T field passes perpendicularly through an area of 0.050 m². What is the flux?', answer: 0.01, unit: 'Wb', explain: 'Φ = BA = 0.20 × 0.050 = 0.010 Wb.' },
        { type: 'num', q: 'The flux through a 100-turn coil changes by 2.0 × 10⁻³ Wb in 0.050 s. What EMF is induced?', answer: 4, unit: 'V', explain: '100 × 2.0 × 10⁻³ ÷ 0.050 = 4.0 V.' },
        { type: 'mcq', q: 'What does the minus sign in Faraday’s law represent?', options: ['Lenz’s law: the EMF opposes the change', 'The EMF is always negative', 'Electrons are negative', 'Flux is decreasing'], answer: 0, explain: 'Opposition to the change.' },
        { type: 'mcq', q: 'On a graph of flux against time, the induced EMF is largest where…', options: ['the graph is steepest', 'the flux is largest', 'the flux is zero', 'the graph is flat'], answer: 0, explain: 'EMF ∝ rate of change.' },
        { type: 'mcq', q: 'The unit of magnetic flux is the…', options: ['weber', 'tesla', 'henry', 'farad'], answer: 0, explain: '1 Wb = 1 T m².' },
      ],
    },
    // ------------------------------------------------------------------ 14.5
    {
      id: '14.5', title: 'Generators', levels: ['L2'], minutes: 18,
      objectives: ['Explain how an AC generator works', 'Interpret the output graph of a generator', 'Compare generators and motors'],
      sections: [
        { type: 'text', title: 'Turning motion into electricity', html: r`<p>An <b>AC generator</b> (alternator) is a coil turned in a magnetic field. As the coil rotates, its sides cut through the field lines and a voltage is induced (V = BvL for each side, adding for each turn). The coil’s ends connect to <b>slip rings</b>, which turn with it, and brushes press on the rings to take the current out.</p>` },
        { type: 'diagram', svg: GEN, caption: 'Each slip ring always connects to the same end of the coil, so the output reverses as the coil turns: AC.' },
        { type: 'text', title: 'Why the output is AC', html: r`<p>During one half-turn, a given side of the coil moves <b>up</b> through the field; in the next half-turn it moves <b>down</b>. The induced voltage reverses each half-turn, giving an alternating output. One rotation = one complete cycle, so the frequency equals the number of turns per second.</p>
<ul><li>The voltage is <b>largest</b> when the coil is <b>parallel</b> to the field — the sides cut straight across the field lines.</li><li>The voltage is <b>zero</b> when the coil is <b>perpendicular</b> to the field — the sides move along the lines, cutting none (even though the flux through the coil is largest).</li></ul>` },
        { type: 'sim', sim: 'ac-generator', caption: 'Double the turning rate: what happens to the frequency and the peak voltage? Then change only the number of turns.' },
        { type: 'text', title: 'Controlling the output', html: r`<ul><li><b>Faster rotation</b> → higher frequency <b>and</b> higher peak voltage.</li><li><b>More turns, stronger magnet, bigger coil, iron core</b> → higher peak voltage (same frequency).</li></ul>
<p>Power-station generators turn at a fixed speed to keep the frequency at exactly 50 Hz. In large generators the magnet (an electromagnet) spins and the coils are fixed, which avoids passing huge currents through sliding contacts.</p>` },
        { type: 'deeper', levels: ['L3', 'Uni'], title: 'the generator equation', html: r`<p>For $N$ turns of area $A$ rotating at angular speed $\omega$ in field $B$: flux $\Phi = BA\cos\omega t$, so $\varepsilon = NBA\omega\sin\omega t$. Peak EMF $= NBA\omega$, with $\omega = 2\pi f$.</p>` },
        { type: 'text', title: 'Motor or generator?', html: r`<p>They are the same machine run in opposite directions. A <b>motor</b> takes electrical energy and gives kinetic energy (motor effect). A <b>generator</b> takes kinetic energy and gives electrical energy (induction). Electric cars use this: when you brake, the motor becomes a generator and charges the battery (“regenerative braking”) — and by Lenz’s law its opposing force slows the car.</p>` },
        { type: 'misconception', wrong: 'The generator voltage is biggest when the coil faces the magnets (most field through it).', right: 'That is when the flux is largest but changing least, so the voltage is zero. The voltage peaks when the coil is parallel to the field and the flux is changing fastest.' },
        { type: 'funfact', title: 'Manapōuri', html: 'Manapōuri Power Station in Fiordland is built inside a mountain, with its seven generators about 200 m underground. Water falls through them from Lake Manapōuri and flows out to the sea through two tailrace tunnels about 10 km long.' },
        { type: 'key', points: ['Generator: rotating coil + magnets + slip rings → AC.', 'Voltage peaks when the coil is parallel to the field; zero when perpendicular.', 'Faster → higher frequency and higher peak.', 'Motor and generator: same machine, opposite energy transfers.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'Why is the output of a simple generator alternating?', options: ['Each side of the coil moves up then down through the field, reversing the induced voltage', 'The magnets reverse', 'The slip rings reverse the current', 'The brushes wear out'], answer: 0, explain: 'Direction of cutting reverses every half-turn.' },
        { type: 'mcq', q: 'When is the generator’s output voltage zero?', options: ['When the coil is perpendicular to the field', 'When the coil is parallel to the field', 'At 45°', 'Never'], answer: 0, explain: 'The sides move along the field lines.' },
        { type: 'mcq', q: 'The coil is turned twice as fast. The output…', options: ['doubles in both frequency and peak voltage', 'doubles in frequency only', 'doubles in peak voltage only', 'stays the same'], answer: 0, explain: 'Flux changes twice as fast.' },
        { type: 'num', q: 'A generator coil turns 50 times a second. What is the output frequency?', answer: 50, unit: 'Hz', explain: 'One cycle per turn.' },
        { type: 'mcq', q: 'What is the difference between slip rings and a split-ring commutator?', options: ['Slip rings keep the same connection (AC output); a commutator swaps connections every half-turn', 'There is no difference', 'Slip rings are only used in motors', 'A commutator gives AC'], answer: 0, explain: 'Slip rings → AC; commutator → DC.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'Calculate the voltage induced across a 0.40 m rod moving at 5.0 m s⁻¹ through a 0.30 T field.', answer: 0.6, unit: 'V', explain: 'V = BvL = 0.30 × 5.0 × 0.40 = 0.60 V.' },
      { type: 'mcq', q: 'State one way to increase the voltage induced by moving a magnet into a coil.', options: ['Move the magnet faster', 'Move it more slowly', 'Use a coil with fewer turns', 'Use a weaker magnet'], answer: 0, explain: 'Faster change.' },
      { type: 'mcq', q: "What does Lenz's law state?", options: ['The induced current opposes the change that caused it', 'The induced current helps the change', 'Induced voltage equals BIL', 'Current is the same everywhere'], answer: 0, explain: 'Definition.' },
      { type: 'num', q: 'Calculate the flux when a 0.50 T field passes perpendicularly through 0.020 m².', answer: 0.01, unit: 'Wb', explain: 'Φ = 0.50 × 0.020 = 0.010 Wb.' },
      { type: 'mcq', q: 'What energy transfer happens in a generator?', options: ['Kinetic → electrical', 'Electrical → kinetic', 'Chemical → electrical', 'Light → electrical'], answer: 0, explain: 'Induction turns motion into electricity.' },
    ],
    M: [
      { type: 'explain', q: 'Explain, in terms of the forces on charges, why a voltage is induced across a metal rod moving through a magnetic field.', model: '<p>The rod contains free charges (electrons) that move with the rod through the magnetic field. A charge moving across a magnetic field feels a force F = Bqv at right angles to both its velocity and the field — here, along the length of the rod. The free electrons are pushed towards one end, which becomes negative, leaving the other end positive. This separation of charge is a potential difference (voltage) across the rod. Charges build up until the electric force from the separated charges balances the magnetic force, giving V = BvL.</p>', points: [{ lvl: 'A', text: 'Free charges move with the rod' }, { lvl: 'M', text: 'Magnetic force F = Bqv pushes charges along the rod' }, { lvl: 'M', text: 'Charge separation gives a voltage across the ends' }] },
      { type: 'num', q: 'A 0.20 m rod moves at 6.0 m s⁻¹ along rails in a 0.50 T field, connected to a 1.5 Ω resistor. Calculate the force needed to keep it moving at constant speed (ignore friction).', answer: 0.04, unit: 'N', explain: 'V = 0.50 × 6.0 × 0.20 = 0.60 V; I = 0.40 A; F = BIL = 0.50 × 0.40 × 0.20 = 0.040 N.' },
      { type: 'num', q: 'The field through a 300-turn coil of area 4.0 × 10⁻³ m² falls from 0.25 T to 0.05 T in 0.040 s. Calculate the size of the induced EMF.', answer: 6, unit: 'V', explain: 'ΔΦ = 0.20 × 4.0 × 10⁻³ = 8.0 × 10⁻⁴ Wb; ε = 300 × 8.0 × 10⁻⁴ ÷ 0.040 = 6.0 V.' },
      { type: 'explain', q: 'Explain why the voltage from an AC generator is zero when the coil is perpendicular to the magnetic field.', model: '<p>When the coil is perpendicular to the field, its two long sides are moving parallel to the field lines (at the top and bottom of their circular paths, moving along the direction of the field). They are not cutting across the field, so no voltage is induced in them. In terms of flux, the flux through the coil is at its maximum here but is momentarily not changing, so the rate of change of flux — and the induced EMF — is zero.</p>', points: [{ lvl: 'A', text: 'No cutting of field lines at that position' }, { lvl: 'M', text: 'Sides move parallel to the field' }, { lvl: 'M', text: 'Flux maximum but not changing, so EMF zero' }] },
    ],
    E: [
      { type: 'explain', q: 'A rod slides along rails in a magnetic field as part of a complete circuit. Use Lenz’s law and conservation of energy to explain why a force must be applied to keep the rod moving at constant speed, and show that the mechanical power equals the electrical power.', model: '<p>As the rod moves, a voltage V = BvL is induced and, because the circuit is complete, a current I = V/R flows through the rod. The current-carrying rod is in a magnetic field, so it feels a force F = BIL. By Lenz’s law the induced current flows in the direction that opposes the change causing it, so this force acts backwards, against the motion. To keep the rod moving at constant velocity, an equal forward force must be applied. If the induced current helped the motion instead, the rod would speed up and produce more and more energy from nothing, breaking the conservation of energy. The mechanical power supplied is P = Fv = BILv. The electrical power produced is P = VI = (BvL)I = BILv — the same. So all the work done pushing the rod becomes electrical energy, which is transferred to heat in the resistance.</p>', points: [{ lvl: 'A', text: 'A backwards force acts on the rod' }, { lvl: 'M', text: 'Induced current in the field gives F = BIL opposing motion (Lenz)' }, { lvl: 'E', text: 'Explains via conservation of energy why it must oppose' }, { lvl: 'E', text: 'Shows Fv = BILv = VI' }] },
      { type: 'explain', q: 'Compare an electric motor and a generator: their structure, the physics they rely on, and their energy transfers. Explain regenerative braking in an electric car.', model: '<p>Both have a coil that can rotate in a magnetic field, with brushes making sliding contact. A DC motor uses a split-ring commutator; an AC generator uses slip rings. A motor relies on the motor effect: a current in the coil in the magnetic field produces forces (F = BIL) that make it turn, transferring electrical energy to kinetic energy. A generator relies on electromagnetic induction: turning the coil makes its sides cut the field, inducing a voltage (V = BvL, or Faraday’s law), transferring kinetic energy to electrical energy. In regenerative braking, the car’s wheels keep the motor turning when the driver brakes. The motor now acts as a generator, inducing a current that charges the battery. By Lenz’s law the induced current produces a force opposing the rotation, which slows the car, so kinetic energy is recovered as stored chemical energy instead of being wasted as heat in brake pads.</p>', points: [{ lvl: 'A', text: 'Motor: electrical → kinetic; generator: kinetic → electrical' }, { lvl: 'M', text: 'Motor effect vs induction, with formulas' }, { lvl: 'E', text: 'Structural differences (commutator vs slip rings)' }, { lvl: 'E', text: 'Regenerative braking: motor as generator, Lenz force slows the car, energy recovered' }] },
      { type: 'num', q: 'A generator coil has 100 turns of area 0.010 m² and turns at 25 revolutions per second in a 0.30 T field. Calculate the peak EMF (ε = NBAω).', answer: 47.1, unit: 'V', explain: 'ω = 2π × 25 = 157 rad s⁻¹; ε = 100 × 0.30 × 0.010 × 157 = 47 V.' },
    ],
  },
  glossary: [
    { term: 'Electromagnetic induction', def: 'Producing a voltage by changing the magnetic field through a conductor or moving a conductor across a field.' },
    { term: 'Induced EMF', def: 'The voltage produced by electromagnetic induction.' },
    { term: "Lenz's law", def: 'An induced current flows in the direction that opposes the change producing it.' },
    { term: 'Magnetic flux (Φ)', def: 'Field × area perpendicular to it: Φ = BA, in webers (Wb).' },
    { term: "Faraday's law", def: 'Induced EMF = rate of change of flux linkage: ε = −NΔΦ/Δt.' },
    { term: 'Eddy currents', def: 'Induced currents swirling in solid metal, opposing its motion or heating it.' },
    { term: 'Generator (alternator)', def: 'A rotating coil in a magnetic field producing AC through slip rings.' },
    { term: 'Slip rings', def: 'Continuous rings that connect a rotating coil to an external circuit without reversing the connection.' },
    { term: 'Regenerative braking', def: 'Using a vehicle’s motor as a generator to slow it down and recharge its battery.' },
  ],
  formulas: [
    { name: 'Induced voltage (moving rod)', tex: 'V = BvL', note: 'B, v and L mutually perpendicular.', level: 'L2' },
    { name: 'Magnetic flux', tex: r`\Phi = BA`, note: '1 Wb = 1 T m².', level: 'L2 / L3' },
    { name: "Faraday's law", tex: r`\varepsilon = -N\frac{\Delta\Phi}{\Delta t}`, note: 'Minus sign = Lenz’s law.', level: 'L3' },
    { name: 'Generator peak EMF', tex: r`\varepsilon_{peak} = NBA\omega`, note: 'ω = 2πf. Going deeper.', level: 'L3 / Uni' },
  ],
  flashcards: [
    { front: 'When is a voltage induced?', back: 'When the field through a conductor changes, or it cuts across a field' }, { front: 'Voltage across a moving rod', back: 'V = BvL' },
    { front: "Lenz's law", back: 'Induced current opposes the change causing it' }, { front: 'Why Lenz’s law?', back: 'Conservation of energy' },
    { front: 'Magnetic flux', back: 'Φ = BA (Wb)' }, { front: "Faraday's law", back: 'ε = −N ΔΦ/Δt' },
    { front: 'Generator output is zero when…', back: 'the coil is perpendicular to the field' }, { front: 'Slip rings vs commutator', back: 'Slip rings → AC; commutator → DC' },
  ],
};
