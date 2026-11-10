/**
 * Chapter 2 — Conductors & Insulators.
 */
import { svg, charge, label, arrow, comp, wire, earth } from '../js/utils/svg.js';

const r = String.raw;

const SEA = svg(460, 170, [
  '<rect x="10" y="10" width="440" height="130" rx="10" class="fill-soft"/>',
  ...[0, 1, 2].flatMap((row) => [0, 1, 2, 3, 4, 5, 6].map((c) => charge(50 + c * 60, 40 + row * 40, '+', 13))),
  ...[[78, 28], [140, 62], [205, 24], [262, 55], [318, 98], [388, 30], [95, 105], [168, 118], [240, 92], [352, 68], [420, 112], [30, 70], [290, 125], [126, 18], [410, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" class="electron"/>`),
  label(230, 162, 'Metal: a lattice of positive ions in a “sea” of free electrons (blue dots)'),
].join(''), { title: 'Positive metal ions in a sea of free electrons', maxw: 480 });

const WIRES = svg(460, 190, [
  '<rect x="20" y="22" width="120" height="10" rx="5" style="fill:#d08a52"/>', label(80, 50, 'short: small R'),
  '<rect x="180" y="22" width="260" height="10" rx="5" style="fill:#d08a52"/>', label(310, 50, 'twice as long: 2 × R'),
  '<rect x="20" y="92" width="200" height="8" rx="4" style="fill:#d08a52"/>', label(120, 120, 'thin: larger R'),
  '<rect x="240" y="86" width="200" height="20" rx="10" style="fill:#d08a52"/>', label(340, 128, 'thick: smaller R'),
  label(230, 170, 'Double the diameter → 4 × the area → ¼ of the resistance', { cls: 'bold' }),
].join(''), { title: 'How length and thickness affect resistance', maxw: 480 });

const CABLE = svg(460, 180, [
  '<circle cx="90" cy="90" r="70" class="fill-soft"/>',
  '<circle cx="62" cy="72" r="20" style="fill:#8b5a2b"/><circle cx="62" cy="72" r="9" style="fill:#d08a52"/>',
  '<circle cx="118" cy="72" r="20" style="fill:#2f6fd6"/><circle cx="118" cy="72" r="9" style="fill:#d08a52"/>',
  '<circle cx="90" cy="118" r="20" style="fill:#3aa04a;stroke-dasharray:6 6;stroke:#e8c93a;stroke-width:6"/><circle cx="90" cy="118" r="9" style="fill:#d08a52"/>',
  label(180, 40, 'Brown: active (live), carries the 230 V', { anchor: 'start' }),
  label(180, 70, 'Blue: neutral, completes the circuit', { anchor: 'start' }),
  label(180, 100, 'Green/yellow: earth, safety path', { anchor: 'start' }),
  label(180, 130, 'Copper cores conduct; plastic insulates', { anchor: 'start' }),
  label(180, 160, 'Outer sheath protects all three', { anchor: 'start' }),
].join(''), { title: 'Cross-section of a three-core flexible cable', maxw: 480 });

const EARTH_FAULT = svg(460, 210, [
  '<rect x="250" y="40" width="150" height="110" rx="12" class="fill-soft"/>', label(325, 30, 'metal case of kettle'),
  comp('fuse', 20, 70, 140, 70, { label: 'fuse / breaker' }), wire([140, 70], [250, 70]), label(60, 100, 'active', { anchor: 'start' }),
  '<polyline points="250,70 280,70 300,95" style="stroke:var(--bad);stroke-width:3"/>', label(310, 112, 'fault: active wire touches case', { anchor: 'start', cls: 'small' }),
  wire([325, 150], [325, 175]), earth(325, 175), label(340, 175, 'earth wire', { anchor: 'start' }),
  arrow(300, 120, 318, 160, 'accent'),
].join(''), { title: 'An earth wire protects you if the active wire touches a metal case', maxw: 480 });

export default {
  intro: 'Why do wires have copper inside and plastic outside? Why does a heater glow but a cable stay cool? This chapter looks inside materials to see what lets charge flow — and what stops it.',
  standards: 'Year 10 science; resistance of a wire is a physical property used in NCEA Level 1 AS 92047 (physical system using energy concepts) and Level 2 AS 91173.',
  lessons: [
    // ------------------------------------------------------------------ 2.1
    {
      id: '2.1', title: 'Conductors, insulators and charge carriers', levels: ['Y10'], minutes: 12,
      objectives: ['Define conductor, insulator and charge carrier', 'Explain why metals conduct', 'Name the charge carriers in metals, solutions and gases'],
      sections: [
        { type: 'text', title: 'Definitions', html: r`<p>A <b>conductor</b> is a material that contains <b>charge carriers</b> — charged particles free to move — so it lets current flow easily, with little resistance.</p>
<p>An <b>insulator</b> has (almost) no free charge carriers, so it strongly resists current. Your notes say it well: an insulator “basically stops you from getting electrocuted”.</p>
<p>Materials are not simply one or the other. There is a spectrum: good conductors → poor conductors → semiconductors → insulators.</p>` },
        { type: 'text', title: 'Why metals conduct', html: r`<p>In a metal, each atom lets go of one or more of its outer electrons. These <b>free (delocalised) electrons</b> wander through the whole metal. The atoms they left behind become <b>positive ions</b> fixed in a regular pattern called a <b>lattice</b>. The free electrons are the charge carriers.</p>` },
        { type: 'diagram', svg: SEA, caption: 'The “sea of electrons” model of a metal — like the diagram in your notes.' },
        { type: 'text', title: 'Different materials, different carriers', html: r`<div class="tablewrap"><table><thead><tr><th>Material</th><th>Charge carriers</th><th>Example</th></tr></thead><tbody>
<tr><td>Metals and graphite</td><td>free electrons</td><td>copper wire, pencil lead</td></tr>
<tr><td>Solutions and molten salts (electrolytes)</td><td>positive and negative ions</td><td>salt water, battery paste, your blood</td></tr>
<tr><td>Ionised gases (plasma)</td><td>ions and electrons</td><td>neon signs, lightning, sparks</td></tr>
<tr><td>Semiconductors</td><td>electrons and “holes”</td><td>silicon chips (lesson 2.4)</td></tr></tbody></table></div>
<p><b>Pure water</b> is a very poor conductor because it has almost no ions. Tap water, sea water and sweat conduct because of dissolved substances — which is why water and electricity are a dangerous mix.</p>` },
        { type: 'sim', sim: 'material-tester', caption: 'Put different materials into the gap and watch the bulb.' },
        { type: 'misconception', wrong: 'Water is a good conductor of electricity.', right: 'Pure water conducts very poorly. It is the dissolved ions in everyday water (tap, sea, sweat) that make it conduct — and those are almost always present, so treat all water near electricity as dangerous.' },
        { type: 'funfact', title: 'you are a conductor', html: 'Your body is mostly salty water full of ions, so it conducts. Dry skin has a fairly high resistance, but wet skin far less — which is why wet hands and electrical switches should never meet.' },
        { type: 'key', points: ['Conductor: has free charge carriers; insulator: has almost none.', 'Metals: positive ion lattice + free electrons.', 'Electrolytes conduct with moving ions; plasmas with ions and electrons.', 'Pure water barely conducts; everyday water does.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'What are the charge carriers in a copper wire?', options: ['Free electrons', 'Positive ions', 'Protons', 'Neutrons'], answer: 0, explain: 'In metals the outer electrons are free to move; the positive ions stay fixed in the lattice.' },
        { type: 'mcq', q: 'What carries the current in salt water?', options: ['Positive and negative ions', 'Free electrons only', 'Protons', 'Water molecules'], answer: 0, explain: 'Dissolved salt splits into Na⁺ and Cl⁻ ions, which move in opposite directions.' },
        { type: 'multi', q: 'Which of these are good electrical conductors? Select all that apply.', options: ['Aluminium foil', 'Graphite', 'Dry wood', 'PVC plastic', 'Steel'], answer: [0, 1, 4], explain: 'Metals and graphite have free electrons. Dry wood and plastic are insulators.' },
        { type: 'mcq', q: 'In the “sea of electrons” model of a metal, the fixed particles are…', options: ['positive ions', 'negative ions', 'neutral atoms', 'protons on their own'], answer: 0, explain: 'Each atom has given up outer electrons, leaving a positive ion fixed in the lattice.' },
        { type: 'tf', q: 'Pure distilled water is an excellent conductor.', answer: false, explain: 'With almost no ions, pure water is a very poor conductor.' },
      ],
    },
    // ------------------------------------------------------------------ 2.2
    {
      id: '2.2', title: 'Electrons on the move: random motion and drift', levels: ['Y10', 'L2'], minutes: 14,
      objectives: ['Describe electron motion with and without a voltage', 'Explain why lights come on instantly even though electrons drift slowly', 'Explain resistance and heating using collisions'],
      sections: [
        { type: 'text', title: 'Random motion — no current', html: r`<p>Even in a wire that is not connected to anything, the free electrons are moving very fast — around a million metres per second — in completely random directions. They constantly bump into the vibrating ions. Because just as many go one way as the other, there is <b>no overall flow</b>, so no current. This is picture ① in your notes.</p>` },
        { type: 'text', title: 'Drift — a current', html: r`<p>Connect a battery and it creates an <b>electric field</b> along the wire. The field pushes every free electron towards the positive terminal. The electrons still zig-zag randomly, but now they have a small overall movement in one direction, called the <b>drift velocity</b>. This is picture ② in your notes — and this slow, collective drift <i>is</i> the current.</p>` },
        { type: 'sim', sim: 'electron-drift', caption: 'Track one electron. Without the battery it goes nowhere; with the battery it slowly drifts.' },
        { type: 'text', title: 'So why does the light come on instantly?', html: r`<p>The drift velocity is astonishingly slow — for a typical household wire, well under a millimetre per second. Yet the light comes on the moment you flick the switch. Why?</p>
<p>Because the wire is <b>already full of free electrons</b>. When the switch closes, the electric field travels along the wire at close to the speed of light, and electrons <b>everywhere</b> in the circuit start drifting at almost the same instant — including those already inside the bulb. Think of a pipe already full of marbles: push one in at one end and one pops out of the other end straight away.</p>` },
        { type: 'text', title: 'Collisions cause resistance and heating', html: r`<p>As electrons drift, they keep colliding with the metal ions. Each collision transfers some of the electrons’ energy to the ions, making them vibrate more. More vibration means a higher <b>temperature</b> — the wire heats up. These collisions also make it harder for current to flow: that is <b>resistance</b>.</p>
<p>This is the heating effect of a current. It is useful in toasters, kettles and heaters, and wasteful in cables and power lines (Chapter 8).</p>` },
        { type: 'misconception', wrong: 'When you switch on a light, electrons shoot from the switch to the bulb at the speed of light.', right: 'Electrons drift very slowly. It is the electric field (the “push”) that travels at nearly the speed of light, starting all the electrons drifting at once.' },
        { type: 'exam', standard: 'NCEA Level 1, AS 92047 (energy)', html: r`<p>Questions often ask how electrical energy is transformed in a circuit. Link the ideas: electrons gain energy from the battery → collide with ions in the resistor or filament → ions vibrate more → thermal energy (and light in a filament bulb).</p>` },
        { type: 'deeper', levels: ['Uni'], title: 'calculating drift velocity', html: r`<p>The current in a wire is $I = nAvq$, where $n$ is the number of free electrons per cubic metre, $A$ the cross-sectional area, $v$ the drift velocity and $q$ the charge of an electron.</p>
<p>For copper, $n \approx 8.5 \times 10^{28}\ \text{m}^{-3}$. A 1.0 A current in a wire of area $1.0\ \text{mm}^2 = 1.0 \times 10^{-6}\ \text{m}^2$:</p>
$$v = \frac{I}{nAq} = \frac{1.0}{(8.5 \times 10^{28})(1.0 \times 10^{-6})(1.6 \times 10^{-19})} \approx 7 \times 10^{-5}\ \text{m s}^{-1}$$
<p>That is 0.07 mm per second — slower than a snail.</p>` },
        { type: 'funfact', title: 'a four-hour journey', html: 'At a drift speed of about 0.07 mm per second, a single electron would take around four hours to travel one metre along a household wire.' },
        { type: 'key', points: ['No voltage: fast random motion, no net flow, no current.', 'With voltage: a slow drift towards + on top of the random motion = current.', 'The field travels at nearly light speed, so all electrons start moving at once.', 'Collisions with ions → resistance and heating.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'In a copper wire that is not connected to a battery, the free electrons…', options: ['move quickly in random directions, with no overall flow', 'are completely still', 'all move slowly in one direction', 'leave the wire'], answer: 0, explain: 'They move fast but randomly, so there is no net flow and no current.' },
        { type: 'mcq', q: 'When a battery is connected, which way do the electrons drift?', options: ['Towards the positive terminal', 'Towards the negative terminal', 'In random directions only', 'Into the ions'], answer: 0, explain: 'Electrons are negative, so they are pulled towards the positive terminal.' },
        { type: 'mcq', q: 'Why does a light come on almost instantly when switched on?', options: ['The wires are already full of electrons and the field reaches them all almost at once', 'Electrons travel at the speed of light', 'The bulb stores electrons from last time', 'Protons rush to the bulb'], answer: 0, explain: 'The push (electric field) spreads at nearly the speed of light, so electrons all around the circuit, including in the bulb, start drifting immediately.' },
        { type: 'mcq', q: 'Why does a wire get warm when a current flows?', options: ['Drifting electrons collide with ions and make them vibrate more', 'The protons rub together', 'The electrons themselves get hot from moving fast', 'Air flows through the wire'], answer: 0, explain: 'Collisions transfer energy to the ion lattice, raising its temperature.' },
        { type: 'tf', q: 'The drift velocity of electrons in a wire is close to the speed of light.', answer: false, explain: 'It is typically less than a millimetre per second.' },
      ],
    },
    // ------------------------------------------------------------------ 2.3
    {
      id: '2.3', title: 'What controls the resistance of a wire', levels: ['Y10', 'L1', 'L2'], minutes: 15,
      objectives: ['State four factors that affect the resistance of a wire', 'Explain each factor using collisions', 'Use R = ρL/A to compare wires'],
      sections: [
        { type: 'text', title: 'Four factors', html: r`<p>Resistance $R$, measured in ohms (Ω), is how strongly something opposes the flow of current. For a wire it depends on:</p>
<ol><li><b>Length</b> — a longer wire has more resistance. The electrons make more collisions on the longer journey. Double the length → double the resistance.</li>
<li><b>Thickness (cross-sectional area)</b> — a thicker wire has less resistance. There are more free electrons side by side, like more lanes on a motorway. Double the area → half the resistance.</li>
<li><b>Material</b> — some materials have more free electrons or more collisions. This is measured by the material’s <b>resistivity</b>.</li>
<li><b>Temperature</b> — in a metal, hotter ions vibrate more, so electrons collide more often. Resistance <b>increases</b> with temperature.</li></ol>
<p>Your notes got the first two exactly: resistance increases as length increases and as thickness decreases.</p>` },
        { type: 'diagram', svg: WIRES, caption: 'Longer wires have more resistance; thicker wires have less.' },
        { type: 'formula', title: 'Putting it together', tex: r`R = \frac{\rho L}{A}`, symbols: [['R', 'resistance', 'Ω'], [r`\rho`, 'resistivity of the material (rho)', 'Ω m'], ['L', 'length', 'm'], ['A', 'cross-sectional area', 'm²']], html: r`<p>Resistance is directly proportional to length and inversely proportional to area. This formula is not on the NCEA Level 1 or 2 formula sheets, but it is the clearest way to see all the factors at once — and you will use it at university.</p>` },
        { type: 'text', title: 'Resistivity: comparing materials', html: r`<div class="tablewrap"><table><thead><tr><th>Material</th><th>Resistivity ρ at 20 °C (Ω m)</th><th>Used for</th></tr></thead><tbody>
<tr><td>Silver</td><td>$1.6 \times 10^{-8}$</td><td>best conductor, but expensive</td></tr>
<tr><td>Copper</td><td>$1.7 \times 10^{-8}$</td><td>house wiring, electronics</td></tr>
<tr><td>Aluminium</td><td>$2.7 \times 10^{-8}$</td><td>overhead power lines (light and cheap)</td></tr>
<tr><td>Nichrome</td><td>$1.1 \times 10^{-6}$</td><td>heating elements in toasters and heaters</td></tr>
<tr><td>Glass</td><td>about $10^{10}$ to $10^{14}$</td><td>insulators on power poles</td></tr>
<tr><td>Rubber</td><td>about $10^{13}$</td><td>cable insulation, gloves</td></tr></tbody></table></div>
<p>Your notes: good conductors have low resistivity; insulators have high resistivity. Copper and aluminium are good choices for wires. Nichrome’s higher resistivity means a heating element gets hot, and it does not rust when red hot.</p>` },
        { type: 'sim', sim: 'wire-resistance', caption: 'Change length, diameter, material and temperature. Watch R.' },
        { type: 'example', title: 'resistance of a copper wire', q: r`<p>A copper wire is 10 m long with a cross-sectional area of $1.0\ \text{mm}^2$. Find its resistance. ($\rho = 1.7 \times 10^{-8}$ Ω m)</p>`, steps: [r`Convert the area: $1.0\ \text{mm}^2 = 1.0 \times 10^{-6}\ \text{m}^2$ (1 mm = $10^{-3}$ m, and squared gives $10^{-6}$).`, r`$R = \dfrac{\rho L}{A} = \dfrac{1.7 \times 10^{-8} \times 10}{1.0 \times 10^{-6}}$`, r`$R = 0.17$`], answer: '<p>R = 0.17 Ω — tiny, which is exactly what you want in a wire.</p>' },
        { type: 'misconception', wrong: 'If you double the diameter of a wire, its resistance halves.', right: r`Doubling the diameter makes the area <b>four</b> times bigger ($A = \pi r^2$, and $2^2 = 4$), so the resistance becomes a <b>quarter</b>.` },
        { type: 'exam', standard: 'NCEA Level 1, AS 92047', html: '<p>“The resistance of a wire” is listed as a physical property in the Level 1 energy standard. Typical question: <i>explain why a heater element is made from a thin nichrome wire, while the cable that supplies it is thick copper.</i> Link the material, thickness and resistance to where the energy is transformed into heat.</p>' },
        { type: 'funfact', title: 'aluminium in the sky', html: 'High-voltage lines usually use aluminium strands wrapped around a steel core. Copper conducts better, but aluminium is about a third of the weight and much cheaper — and the steel core adds strength for long spans between towers.' },
        { type: 'key', points: ['R increases with length; decreases with cross-sectional area.', 'Material matters: resistivity ρ. Copper low; nichrome higher; insulators enormous.', 'Metals: R increases with temperature (more ion vibration).', r`$R = \rho L / A$. Double the diameter → ¼ of the resistance.`] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'A wire is replaced by one of the same material and thickness but twice as long. Its resistance…', options: ['doubles', 'halves', 'stays the same', 'is four times bigger'], answer: 0, explain: 'R ∝ L, so twice the length gives twice the resistance.' },
        { type: 'mcq', q: 'A wire is replaced by one of the same material and length but with twice the diameter. Its resistance becomes…', options: ['one quarter', 'one half', 'double', 'four times bigger'], answer: 0, explain: 'Twice the diameter → four times the area → one quarter of the resistance.', hint: 'Area depends on the diameter squared.' },
        { type: 'mcq', q: 'Why does the resistance of a metal wire increase when it gets hotter?', options: ['The ions vibrate more, so electrons collide more often', 'The wire loses electrons', 'The wire gets longer by a lot', 'Hot metals become insulators'], answer: 0, explain: 'More vibration means more collisions, which oppose the current.' },
        { type: 'num', q: r`Find the resistance of a 2.0 m nichrome wire with area $2.0 \times 10^{-7}$ m². ($\rho = 1.1 \times 10^{-6}$ Ω m)`, answer: 11, unit: 'Ω', explain: r`$R = \dfrac{1.1\times10^{-6} \times 2.0}{2.0\times10^{-7}} = 11$ Ω.` },
        { type: 'mcq', q: 'Which material is best for a toaster’s heating element?', options: ['Nichrome', 'Copper', 'Rubber', 'Glass'], answer: 0, explain: 'Nichrome has a fairly high resistivity, so it heats up, and it resists oxidising when red hot.' },
      ],
    },
    // ------------------------------------------------------------------ 2.4
    {
      id: '2.4', title: 'Semiconductors, superconductors and breakdown', levels: ['Y10', 'L2', 'Uni'], minutes: 12,
      objectives: ['Describe how semiconductors differ from metals', 'Describe superconductors and their uses', 'Explain how insulators can break down'],
      sections: [
        { type: 'text', title: 'Semiconductors', html: r`<p><b>Semiconductors</b> such as silicon have a resistivity between conductors and insulators. At low temperatures they have very few free charge carriers. Heat or light gives some electrons enough energy to break free, so — unlike a metal — a semiconductor’s <b>resistance decreases as it gets hotter or brighter</b>.</p>
<p>Two sensors use this (you will build circuits with them in Chapters 5 and 11):</p>
<ul><li>A <b>thermistor</b>: resistance falls as temperature rises (used in thermostats, digital thermometers).</li><li>A <b>light-dependent resistor (LDR)</b>: resistance falls as light gets brighter (used in automatic street lights).</li></ul>` },
        { type: 'text', title: 'Superconductors', html: r`<p>Some materials, when cooled below a <b>critical temperature</b>, have <b>zero resistance</b>. A current can flow round a superconducting loop for years with no energy lost.</p>
<p>The first was mercury, discovered in 1911 to superconduct at 4.2 K (−269 °C). Since 1986, “high-temperature” superconductors have been found that work in liquid nitrogen (77 K, −196 °C) — still very cold!</p>
<p>Uses: the powerful magnets in hospital <b>MRI scanners</b>, maglev trains, particle accelerators and research into lossless power cables.</p>` },
        { type: 'text', title: 'When insulators fail: breakdown', html: r`<p>Every insulator has a limit. A strong enough electric field rips electrons free and the insulator suddenly conducts — this is <b>electrical breakdown</b>. Air breaks down in lightning and sparks. Cable insulation is rated for a maximum voltage: that is why high-voltage cables have thick insulation and why power-line insulators are long chains of glass or ceramic discs.</p>` },
        { type: 'deeper', levels: ['Uni'], title: 'band theory and doping', html: r`<p>In a solid, electron energies form <b>bands</b>. In an insulator a large <b>band gap</b> separates the full valence band from the empty conduction band; in a metal the bands overlap. In a semiconductor the gap is small (about 1.1 eV for silicon), so heat or light can lift electrons across, leaving <b>holes</b> that act like positive carriers.</p>
<p>Adding tiny amounts of other elements (<b>doping</b>) creates n-type (extra electrons) or p-type (extra holes) silicon. Joining them makes a <b>diode</b>, and combining them makes <b>transistors</b> — the switches inside every computer chip.</p>` },
        { type: 'funfact', title: 'Kiwi superconductor science', html: 'Wellington’s Robinson Research Institute at Victoria University is a world-leading centre for high-temperature superconductor research, designing superconducting magnets and cables used around the world.' },
        { type: 'funfact', title: 'billions of switches', html: 'A modern phone processor contains billions of transistors made from doped silicon — each one a tiny switch turning current on and off billions of times a second.' },
        { type: 'key', points: ['Semiconductors: resistance falls with rising temperature or light (thermistor, LDR).', 'Superconductors: zero resistance below a critical temperature (MRI magnets).', 'Any insulator breaks down in a strong enough field (sparks, lightning).'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'How does the resistance of a thermistor change as it gets hotter?', options: ['It decreases', 'It increases', 'It stays the same', 'It becomes zero'], answer: 0, explain: 'Heat frees more charge carriers in the semiconductor, lowering its resistance.' },
        { type: 'mcq', q: 'How is a semiconductor different from a metal when heated?', options: ['A semiconductor’s resistance falls; a metal’s rises', 'Both resistances rise', 'Both resistances fall', 'Neither changes'], answer: 0, explain: 'Heating frees carriers in a semiconductor, but in a metal it increases collisions.' },
        { type: 'mcq', q: 'What is special about a superconductor below its critical temperature?', options: ['It has zero resistance', 'It becomes an insulator', 'It stores charge', 'It produces light'], answer: 0, explain: 'Below the critical temperature resistance drops to exactly zero.' },
        { type: 'mcq', q: 'Which device uses a superconducting magnet?', options: ['An MRI scanner', 'A toaster', 'A torch', 'A phone charger'], answer: 0, explain: 'MRI scanners need extremely strong, steady magnetic fields from superconducting coils.' },
        { type: 'tf', q: 'An insulator can never conduct, no matter how high the voltage.', answer: false, explain: 'In a strong enough electric field, any insulator breaks down and conducts — like air in lightning.' },
      ],
    },
    // ------------------------------------------------------------------ 2.5
    {
      id: '2.5', title: 'Insulation and earthing at home', levels: ['Y10', 'L1'], minutes: 12,
      objectives: ['Explain how insulation and earthing protect people', 'Identify the wires in an appliance cable', 'Explain why water and electricity are dangerous'],
      sections: [
        { type: 'text', title: 'Why electricity can hurt you', html: r`<p>NZ mains electricity is 230 V. If your body completes a path between the active wire and earth, a current flows through you. It is the <b>current</b> through your body that harms you:</p>
<ul><li>about 1 mA — a tingle</li><li>about 10–20 mA — muscles clamp and you may not be able to let go</li><li>about 50–100 mA through the chest — can stop the heart beating properly</li></ul>
<p>Dry skin has a fairly high resistance, which limits the current. Wet skin has a much lower resistance, so the same voltage pushes a much larger current. That is why water near electricity is so dangerous.</p>` },
        { type: 'text', title: 'Inside an appliance cable', html: r`<p>A flexible appliance cable has three copper cores, each with plastic (PVC) insulation, inside an outer sheath.</p>` },
        { type: 'diagram', svg: CABLE, caption: 'NZ appliance cable colours. Older wiring may use red for active and black for neutral.' },
        { type: 'text', title: 'The earth wire', html: r`<p>Appliances with a metal case (kettles, toasters, washing machines) have the <b>earth wire</b> connected to the case. Normally no current flows in it. But if a fault lets the active wire touch the case, a large current flows straight through the low-resistance earth wire to the ground. This quickly blows the <b>fuse</b> or trips the <b>circuit breaker</b>, cutting the power — so the case never stays “live” to give you a shock.</p>` },
        { type: 'diagram', svg: EARTH_FAULT, caption: 'If the active wire touches the metal case, current flows to earth and the fuse or breaker cuts the supply.' },
        { type: 'text', title: 'Double insulation and RCDs', html: r`<p>Many appliances (hair dryers, phone chargers) have a plastic case and no earth wire. They are <b>double insulated</b> — two separate layers of insulation — and carry a symbol of a square inside a square.</p>
<p>Modern NZ homes also have <b>RCDs</b> (residual current devices) on power-point circuits. An RCD compares the current going out in the active wire with the current coming back in the neutral. If about 30 mA is missing — perhaps flowing through a person — it switches off in a fraction of a second.</p>` },
        { type: 'funfact', title: 'why birds on power lines are fine', html: 'A bird standing on a single power line touches only one wire. Both its feet are at the same voltage, so there is no potential difference across its body and almost no current flows through it. If it touched two wires — or a wire and the pole — it would be a different story.' },
        { type: 'misconception', wrong: 'A high voltage alone is what kills; current doesn’t matter.', right: 'It is the current through the body that does harm. Voltage matters because it pushes the current — and the body’s resistance (dry or wet skin) decides how big that current is.' },
        { type: 'key', points: ['It is the current through the body that harms; wet skin lets more current flow.', 'Brown = active, blue = neutral, green/yellow = earth.', 'Earth wire + fuse/breaker stops a metal case staying live.', 'Double insulation and RCDs add more protection.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'In an NZ appliance cable, which colour is the active (live) wire?', options: ['Brown', 'Blue', 'Green/yellow', 'Black'], answer: 0, explain: 'Brown = active, blue = neutral, green/yellow = earth.' },
        { type: 'mcq', q: 'Why are wires coated in plastic?', options: ['Plastic is an insulator, so it stops current reaching people or other wires', 'Plastic conducts better than copper', 'Plastic makes the current faster', 'Plastic stores spare charge'], answer: 0, explain: 'Plastic has almost no free charge carriers, so it keeps current inside the copper.' },
        { type: 'explain', q: 'A kettle has a metal case connected to the earth wire. Explain how this protects the user if the active wire comes loose and touches the case.', model: '<p>If the active wire touches the case, the case would be at 230 V and could give a shock. Because the case is connected to earth by a low-resistance wire, a large current flows from the active wire, through the case and earth wire, to the ground. This large current blows the fuse or trips the circuit breaker, which cuts off the supply. The case is then no longer live, so the user is safe.</p>', points: [{ lvl: 'A', text: 'The earth wire gives current a path to the ground' }, { lvl: 'M', text: 'The low resistance causes a large current' }, { lvl: 'M', text: 'The large current blows the fuse / trips the breaker, cutting the supply' }] },
        { type: 'mcq', q: 'Why is touching a switch with wet hands more dangerous?', options: ['Wet skin has lower resistance, so a larger current can flow through you', 'Water increases the mains voltage', 'Water is a perfect insulator', 'Wet hands make the switch magnetic'], answer: 0, explain: 'For the same voltage, lower resistance means a bigger current (I = V/R).' },
        { type: 'mcq', q: 'A bird sits on one high-voltage line and is not hurt because…', options: ['there is no potential difference across its body', 'birds are insulators', 'the current is too fast to notice', 'power lines carry no current'], answer: 0, explain: 'Both feet are at the same voltage, so no current flows through the bird.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'mcq', q: 'Which of these is an insulator?', options: ['Rubber', 'Copper', 'Graphite', 'Salt water'], answer: 0, explain: 'Rubber has almost no free charge carriers.' },
      { type: 'mcq', q: 'In a metal, what moves to make a current?', options: ['Free electrons', 'Positive ions', 'Protons', 'Atoms'], answer: 0, explain: 'The free electrons drift; the ions stay fixed.' },
      { type: 'mcq', q: 'What happens to the resistance of a wire if it is made longer?', options: ['It increases', 'It decreases', 'It stays the same', 'It becomes zero'], answer: 0, explain: 'More length → more collisions → more resistance.' },
      { type: 'mcq', q: 'The green/yellow wire in a cable is the…', options: ['earth', 'active', 'neutral', 'fuse'], answer: 0, explain: 'Green/yellow is the earth (safety) wire.' },
      { type: 'tf', q: 'The resistance of an LDR falls as the light gets brighter.', answer: true, explain: 'Light frees more charge carriers in the semiconductor.' },
    ],
    M: [
      { type: 'explain', q: 'Explain why a metal wire heats up when a current flows through it.', model: '<p>The battery’s electric field makes the free electrons drift through the wire. As they drift they collide with the positive metal ions in the lattice. In each collision some of the electrons’ energy is transferred to the ions, which vibrate more. Greater vibration of the ions means a higher temperature, so the wire heats up.</p>', points: [{ lvl: 'A', text: 'Electrons collide with ions' }, { lvl: 'M', text: 'Energy is transferred from electrons to the ions' }, { lvl: 'M', text: 'Ions vibrate more, so temperature rises' }] },
      { type: 'num', q: 'A 3.0 m wire has a resistance of 1.2 Ω. A 7.5 m length of the same wire has what resistance?', answer: 3, unit: 'Ω', explain: 'R ∝ L: 7.5 ÷ 3.0 = 2.5 times longer, so R = 2.5 × 1.2 = 3.0 Ω.' },
      { type: 'mcq', q: 'Wire X has twice the diameter of wire Y. They are the same material and length. Compare their resistances.', options: ['R(X) = ¼ R(Y)', 'R(X) = ½ R(Y)', 'R(X) = 2 R(Y)', 'R(X) = 4 R(Y)'], answer: 0, explain: 'Twice the diameter → 4× the area → ¼ the resistance.' },
      { type: 'explain', q: 'Explain why a light comes on almost immediately when switched on, even though electrons drift very slowly.', model: '<p>The wires and bulb are already full of free electrons. Closing the switch sets up an electric field throughout the circuit almost instantly (the field travels at nearly the speed of light). Every free electron in the circuit, including those already in the filament, starts drifting at about the same time, so energy is transferred in the bulb immediately. No electron has to travel from the switch to the bulb.</p>', points: [{ lvl: 'A', text: 'Wires are already full of electrons' }, { lvl: 'M', text: 'The field / push travels at nearly the speed of light' }, { lvl: 'M', text: 'All electrons start drifting at once, including in the bulb' }] },
    ],
    E: [
      { type: 'explain', q: 'A heater is connected to the mains by a thick copper cable. Its heating element is a long, thin nichrome wire. Discuss why the element gets very hot while the cable stays cool, using ideas about resistance, collisions and energy.', model: '<p>The same current flows through the cable and the element (they are in series). Copper has a very low resistivity and the cable is thick, so its resistance is tiny: electrons collide relatively rarely and little energy is transferred to the cable — it stays cool. Nichrome has a resistivity about 65 times copper’s, and the element is long and thin, so its resistance is much larger: electrons collide far more often, transferring lots of energy to the ion lattice, which vibrates more and becomes very hot. Energy is therefore transformed to heat where it is wanted (the element), not in the cable. Nichrome is also chosen because it does not oxidise when red hot.</p>', points: [{ lvl: 'A', text: 'The element has a higher resistance than the cable' }, { lvl: 'M', text: 'Links resistance to material (resistivity), length and thickness' }, { lvl: 'E', text: 'Same current, more collisions/energy transfer in the higher-resistance element' }, { lvl: 'E', text: 'Concludes energy is transformed to heat in the element, not the cable' }] },
      { type: 'explain', q: 'Compare how the resistance of a copper wire and a thermistor change as they are heated, and explain the difference.', model: '<p>The copper wire’s resistance increases as it is heated, but the thermistor’s resistance decreases. In copper, the number of free electrons hardly changes; heating makes the ions vibrate more, so electrons collide more often and resistance rises. The thermistor is a semiconductor with few free charge carriers when cold; heating gives more electrons enough energy to break free, so the number of charge carriers increases greatly. This effect is bigger than the extra collisions, so its resistance falls.</p>', points: [{ lvl: 'A', text: 'Copper R increases; thermistor R decreases' }, { lvl: 'M', text: 'Copper: more ion vibration → more collisions' }, { lvl: 'E', text: 'Thermistor: heating frees more charge carriers, which outweighs the extra collisions' }] },
      { type: 'num', q: r`A copper cable has resistance 0.050 Ω. A second copper cable is twice as long and has three times the diameter. What is its resistance? Give 2 s.f.`, answer: 0.0111, tol: 0.03, unit: 'Ω', explain: r`Length ×2 → R ×2. Diameter ×3 → area ×9 → R ÷9. New R = 0.050 × 2 ÷ 9 = 0.011 Ω.` },
    ],
  },
  glossary: [
    { term: 'Conductor', def: 'A material with free charge carriers that lets current flow easily.' },
    { term: 'Insulator', def: 'A material with almost no free charge carriers, so it strongly opposes current.' },
    { term: 'Charge carrier', def: 'A charged particle that is free to move and carry current: electrons in metals, ions in solutions.' },
    { term: 'Free (delocalised) electrons', def: 'Outer electrons in a metal that are not attached to any one atom and can move through the metal.' },
    { term: 'Lattice', def: 'The regular, fixed arrangement of positive ions in a metal.' },
    { term: 'Drift velocity', def: 'The slow average speed of charge carriers along a conductor when a current flows.' },
    { term: 'Resistance', def: 'Opposition to the flow of current, measured in ohms (Ω).' },
    { term: 'Resistivity', def: 'A property of a material that tells how strongly it opposes current. Symbol ρ, unit Ω m.' },
    { term: 'Semiconductor', def: 'A material with resistivity between conductors and insulators, whose resistance falls as temperature or light increases.' },
    { term: 'Thermistor', def: 'A semiconductor resistor whose resistance falls as its temperature rises.' },
    { term: 'LDR (light-dependent resistor)', def: 'A semiconductor resistor whose resistance falls as light gets brighter.' },
    { term: 'Superconductor', def: 'A material with zero resistance below its critical temperature.' },
    { term: 'Electrical breakdown', def: 'When a strong electric field makes an insulator suddenly conduct, e.g. a spark in air.' },
    { term: 'Earth wire', def: 'Safety wire connecting a metal case to the ground so a fault current blows the fuse or trips the breaker.' },
    { term: 'Double insulation', def: 'Two separate layers of insulation so an appliance needs no earth wire; symbol is a square in a square.' },
    { term: 'RCD', def: 'Residual current device: switches off quickly if current going out does not equal current coming back.' },
  ],
  formulas: [
    { name: 'Resistance of a wire', tex: r`R = \frac{\rho L}{A}`, symbols: [['R', 'resistance', 'Ω'], [r`\rho`, 'resistivity', 'Ω m'], ['L', 'length', 'm'], ['A', 'cross-sectional area', 'm²']], note: 'Not on the NCEA L1/L2 formula sheets, but explains every factor. Double the diameter → ¼ the resistance.', level: 'L2 / University' },
    { name: 'Current and drift velocity (go deeper)', tex: 'I = nAvq', symbols: [['n', 'free charge carriers per m³', 'm⁻³'], ['A', 'area', 'm²'], ['v', 'drift velocity', 'm s⁻¹'], ['q', 'charge per carrier', 'C']], level: 'University' },
  ],
  flashcards: [
    { front: 'Effect of doubling a wire’s length on R', back: 'R doubles' },
    { front: 'Effect of doubling a wire’s diameter on R', back: 'R becomes ¼ (area is 4×)' },
    { front: 'Metal heated: resistance…', back: 'increases (more ion vibration, more collisions)' },
    { front: 'Thermistor heated: resistance…', back: 'decreases (more charge carriers freed)' },
    { front: 'Brown / blue / green-yellow wires', back: 'active / neutral / earth' },
  ],
};
