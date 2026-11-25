/**
 * Chapter 5 — Resistance & Ohm's Law.
 */
import { svg, comp, wire, dot, label } from '../js/utils/svg.js';

const r = String.raw;

/**
 * Small I–V characteristic panel with axes through the origin.
 * @param {number} ox X offset of the panel.
 * @param {string} title Panel title.
 * @param {(v:number)=>number} f Current as a function of voltage (both scaled −1…1).
 * @returns {string} SVG markup (not wrapped in <svg>).
 */
function ivPanel(ox, title, f) {
  const W = 200;
  const H = 170;
  const cx = ox + W / 2;
  const cy = 20 + (H - 20) / 2;
  const sx = (W / 2 - 14);
  const sy = (H - 40) / 2;
  let d = '';
  for (let i = 0; i <= 120; i++) {
    const v = -1 + (2 * i) / 120;
    const y = f(v);
    if (Math.abs(y) > 1.05) continue;
    d += `${d ? 'L' : 'M'}${(cx + v * sx).toFixed(1)},${(cy - y * sy).toFixed(1)}`;
  }
  return `<line x1="${ox + 10}" y1="${cy}" x2="${ox + W - 6}" y2="${cy}"/><line x1="${cx}" y1="28" x2="${cx}" y2="${H + 8}"/>` +
    `<path d="${d}" style="stroke:var(--blue);stroke-width:3"/>` +
    label(ox + W - 8, cy + 18, 'V', { anchor: 'end', cls: 'bold' }) + label(cx + 8, 38, 'I', { anchor: 'start', cls: 'bold' }) +
    label(cx, 16, title, { cls: 'bold' });
}

const IV_THREE = svg(640, 190, [
  ivPanel(0, 'Resistor (ohmic)', (v) => v * 0.9),
  ivPanel(220, 'Filament lamp', (v) => Math.sign(v) * Math.abs(v) ** 0.55 * 0.9),
  ivPanel(440, 'Diode', (v) => (v > 0.35 ? Math.min(1.05, ((v - 0.35) / 0.25) ** 2) : -0.02)),
].join(''), { title: 'I–V graphs for a resistor (straight line), a filament lamp (curve flattening) and a diode (current one way only)', maxw: 700 });

const VI_GRAPH = (() => {
  const P = { l: 60, b: 40, t: 14, r: 20 };
  const W = 380;
  const H = 240;
  const X = (i) => P.l + (i / 0.6) * (W - P.l - P.r);
  const Y = (v) => H - P.b - (v / 12) * (H - P.t - P.b);
  const data = [[0.1, 2.1], [0.2, 3.9], [0.3, 6.1], [0.4, 7.9], [0.5, 10.1]];
  let s = '';
  for (const i of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]) s += `<line x1="${X(i)}" y1="${P.t}" x2="${X(i)}" y2="${H - P.b}" class="thin" style="stroke:var(--line)"/>` + label(X(i), H - P.b + 16, String(i), { cls: 'small' });
  for (const v of [2, 4, 6, 8, 10, 12]) s += `<line x1="${P.l}" y1="${Y(v)}" x2="${W - P.r}" y2="${Y(v)}" class="thin" style="stroke:var(--line)"/>` + label(P.l - 6, Y(v) + 4, String(v), { anchor: 'end', cls: 'small' });
  s += `<line x1="${P.l}" y1="${H - P.b}" x2="${W - P.r}" y2="${H - P.b}"/><line x1="${P.l}" y1="${P.t}" x2="${P.l}" y2="${H - P.b}"/>`;
  s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(0.6)}" y2="${Y(12)}" style="stroke:var(--blue);stroke-width:2.5"/>`;
  s += data.map(([i, v]) => `<g style="stroke:var(--ink)"><line x1="${X(i) - 5}" y1="${Y(v) - 5}" x2="${X(i) + 5}" y2="${Y(v) + 5}"/><line x1="${X(i) - 5}" y1="${Y(v) + 5}" x2="${X(i) + 5}" y2="${Y(v) - 5}"/></g>`).join('');
  s += `<polyline points="${X(0.1)},${Y(2)} ${X(0.5)},${Y(2)} ${X(0.5)},${Y(10)}" class="dash" style="stroke:var(--bad)"/>`;
  s += label(X(0.3), Y(2) + 16, 'ΔI = 0.40 A', { cls: 'small bold' }) + label(X(0.5) + 6, Y(6), 'ΔV = 8.0 V', { anchor: 'start', cls: 'small bold' });
  s += label((W + P.l) / 2, H - 6, 'Current I (A)') + `<text x="16" y="${(H - P.b + P.t) / 2}" text-anchor="middle" class="lbl" transform="rotate(-90 16 ${(H - P.b + P.t) / 2})">Voltage V (V)</text>`;
  return svg(W, H, s, { title: 'Voltage against current for a resistor: straight line through the origin with gradient 20 ohms', maxw: 440 });
})();

const OHM_CIRCUIT = svg(380, 200, [
  comp('battery', 40, 170, 40, 40, { signs: true, label: 'power supply', labelPos: 'left' }), wire([40, 40], [70, 40]), comp('variable', 70, 40, 160, 40, { label: 'rheostat' }),
  comp('ammeter', 160, 40, 220, 40), wire([220, 40], [240, 40]), comp('resistor', 240, 40, 320, 40, { label: 'test resistor' }), wire([320, 40], [345, 40], [345, 170], [40, 170]),
  wire([230, 40], [230, 110], [248, 110]), comp('voltmeter', 248, 110, 312, 110), wire([312, 110], [330, 110], [330, 40]), dot(230, 40), dot(330, 40),
].join(''), { title: 'Circuit for investigating resistance: ammeter in series, voltmeter across the resistor, rheostat to change the current', maxw: 420 });

const BANDS = (() => {
  const col = { brown: '#7a4a24', black: '#1d1d1d', red: '#d8342c', gold: '#c9a227', yellow: '#f2d11b', violet: '#8247c2', orange: '#f08a1c' };
  const res = (x, y, bands, txt) => `<line x1="${x}" y1="${y}" x2="${x + 40}" y2="${y}"/><line x1="${x + 200}" y1="${y}" x2="${x + 240}" y2="${y}"/>` +
    `<rect x="${x + 40}" y="${y - 22}" width="160" height="44" rx="18" style="fill:#e9d9b8"/>` +
    bands.map((b, i) => `<rect x="${x + 62 + i * 30 + (i === 3 ? 22 : 0)}" y="${y - 22}" width="14" height="44" class="nostroke" style="fill:${col[b]}"/>`).join('') +
    label(x + 120, y + 42, txt, { cls: 'small bold' });
  return svg(560, 130, res(10, 40, ['brown', 'black', 'red', 'gold'], 'brown black red gold = 1.0 kΩ ±5%') + res(300, 40, ['yellow', 'violet', 'orange', 'gold'], 'yellow violet orange gold = 47 kΩ ±5%'), { title: 'Two resistors with colour bands', maxw: 600 });
})();

export default {
  intro: 'Why does the same battery push a big current through a kettle element but only a tiny one through an LED? The answer is resistance. This chapter defines resistance, introduces Ohm’s law, shows you how to measure resistance in the lab, and explains why some components follow Ohm’s law and others do not.',
  standards: 'NCEA Level 1 (simple circuits) and NCEA Level 2 AS 91173 (V = IR is on the formula sheet). I–V graphs and sensors also appear in Level 1 practical work.',
  lessons: [
    // ------------------------------------------------------------------ 5.1
    {
      id: '5.1', title: 'What resistance means', levels: ['Y10', 'L1', 'L2'], minutes: 15,
      objectives: ['Define resistance as R = V/I', 'Use the units Ω, kΩ and MΩ', 'Explain resistance in terms of collisions'],
      sections: [
        { type: 'text', title: 'Opposition to current', html: r`<p>Connect the same 6 V battery to two different bulbs and you will usually get two different currents. The bulb that lets <b>less</b> current through has the bigger <b>resistance</b>. Resistance measures how hard it is for charge to flow through a component: how many volts you need to push each amp of current through it.</p>` },
        { type: 'formula', title: 'Resistance', tex: r`R = \frac{V}{I}`, symbols: [['R', 'resistance', 'ohm (Ω)'], ['V', 'voltage across the component', 'volt (V)'], ['I', 'current through the component', 'ampere (A)']], html: r`<p><b>One ohm</b> is the resistance of a component that needs <b>1 volt to push 1 amp</b> through it: 1 Ω = 1 V A⁻¹. Large resistances are written with prefixes: 1 kΩ = 1000 Ω and 1 MΩ = 1 000 000 Ω. The symbol Ω is the Greek capital letter omega.</p>` },
        { type: 'text', title: 'Where resistance comes from', html: r`<p>From Chapter 2: in a metal, the free electrons drift through a lattice of vibrating positive ions. They keep colliding with the ions and transfer energy to them, so the metal heats up. The more collisions per metre, the more voltage (energy per coulomb) is needed to keep each coulomb moving — that is a bigger resistance.</p>
<p>A wire has more resistance if it is <b>longer</b> (more ions to pass), <b>thinner</b> (fewer free electrons sharing the current), made of a material with fewer free electrons or more scattering, or <b>hotter</b> (ions vibrate more). These are the factors in $R = \rho L / A$ from Lesson 2.3.</p>` },
        { type: 'example', title: 'calculating resistance', q: r`<p>A current of 0.25 A flows through a lamp when the voltage across it is 6.0 V. What is the lamp’s resistance?</p>`, steps: [r`$R = \dfrac{V}{I}$.`, r`$R = \dfrac{6.0}{0.25}$.`, r`$R = 24\ \Omega$.`], answer: '<p>24 Ω.</p>' },
        { type: 'text', title: 'Typical resistances', html: r`<div class="tablewrap"><table><thead><tr><th>Component</th><th>Typical resistance</th></tr></thead><tbody>
<tr><td>1 m of connecting wire</td><td>about 0.01–0.02 Ω</td></tr>
<tr><td>Kettle element (hot)</td><td>about 25 Ω</td></tr>
<tr><td>Torch bulb (lit)</td><td>about 10–20 Ω</td></tr>
<tr><td>Resistors in electronics</td><td>10 Ω to 1 MΩ</td></tr>
<tr><td>Your body, hand to hand, dry skin</td><td>tens of kΩ (much less when wet)</td></tr>
<tr><td>Voltmeter</td><td>about 10 MΩ</td></tr>
</tbody></table></div>` },
        { type: 'misconception', wrong: 'A component with a large resistance has a large current, because it “uses more electricity”.', right: 'For the same voltage, a large resistance means a small current. Resistance opposes the current.' },
        { type: 'funfact', title: 'Georg Ohm', html: 'Georg Ohm published his law in 1827. His ideas were so poorly received at first that he resigned from his teaching post. In 1841 the Royal Society of London awarded him its Copley Medal, and the unit of resistance is now named after him.' },
        { type: 'key', points: [r`Resistance $R = V/I$: volts needed per amp of current.`, '1 Ω = 1 V/A; 1 kΩ = 1000 Ω; 1 MΩ = 10⁶ Ω.', 'Resistance comes from electrons colliding with vibrating ions, transferring energy as heat.', 'Longer, thinner, hotter (for metals) → more resistance.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A heater carries 10 A when connected to 230 V. What is its resistance?', answer: 23, unit: 'Ω', explain: 'R = V/I = 230 ÷ 10 = 23 Ω.' },
        { type: 'num', q: 'Write 4.7 kΩ in ohms.', answer: 4700, unit: 'Ω', explain: '4.7 × 1000 = 4700 Ω.' },
        { type: 'mcq', q: 'Two lamps are each connected to the same battery. Lamp X has a larger current. Lamp X has…', options: ['a smaller resistance', 'a larger resistance', 'the same resistance', 'no resistance'], answer: 0, explain: 'Same V: R = V/I, so a larger I means a smaller R.' },
        { type: 'mcq', q: 'Why does a metal’s resistance increase when it gets hotter?', options: ['The ions vibrate more, so electrons collide with them more often', 'The electrons stop moving', 'Heat makes the wire shorter', 'Hot metals have more free electrons'], answer: 0, explain: 'More ion vibration means more collisions per metre.' },
        { type: 'num', q: 'A resistor has 2.4 V across it and 20 mA through it. What is its resistance?', answer: 120, unit: 'Ω', explain: '20 mA = 0.020 A; R = 2.4 ÷ 0.020 = 120 Ω.' },
      ],
    },
    // ------------------------------------------------------------------ 5.2
    {
      id: '5.2', title: "Ohm's law and V = IR", levels: ['L1', 'L2'], minutes: 18,
      objectives: ["State Ohm's law", 'Use V = IR in all three forms, with prefixes', 'Use proportional reasoning for an ohmic conductor'],
      sections: [
        { type: 'text', title: "Ohm's law", html: r`<p><b>Ohm’s law:</b> the current through a metallic conductor is <b>directly proportional</b> to the voltage across it, provided the <b>temperature stays constant</b>.</p>
<p>Directly proportional means: double the voltage → double the current; triple the voltage → triple the current. The ratio $V/I$ stays the same, so the resistance is <b>constant</b>. Components that behave like this are called <b>ohmic</b>.</p>
<p>Careful: $R = V/I$ is the <b>definition</b> of resistance and is true for any component at any moment. Ohm’s law is the extra fact that, for some components, that resistance does not change.</p>` },
        { type: 'formula', title: 'The NCEA form', tex: 'V = IR', symbols: [['V', 'voltage', 'V'], ['I', 'current', 'A'], ['R', 'resistance', 'Ω']], html: r`<p>This is how the formula sheet writes it. Rearranged: $I = \dfrac{V}{R}$ and $R = \dfrac{V}{I}$.</p>` },
        { type: 'maths', title: 'prefixes in V = IR', link: '0.1', html: r`<p>Change prefixes to powers of ten before calculating: 20 mA → $20 \times 10^{-3}$ A; 4.7 kΩ → $4.7 \times 10^{3}$ Ω. A useful shortcut: volts = milliamps × kilohms, because $10^{-3} \times 10^{3} = 1$. So 2.0 mA through 3.3 kΩ needs 6.6 V.</p>` },
        { type: 'example', title: 'finding current', q: r`<p>A 12 V battery is connected across a 48 Ω resistor. What current flows?</p>`, steps: [r`$I = \dfrac{V}{R}$.`, r`$I = \dfrac{12}{48}$.`, r`$I = 0.25$ A.`], answer: '<p>0.25 A (250 mA).</p>' },
        { type: 'example', title: 'finding voltage, with prefixes', q: r`<p>A current of 15 mA flows through a 2.2 kΩ resistor. What is the voltage across it?</p>`, steps: [r`Convert: $I = 15 \times 10^{-3} = 0.015$ A; $R = 2.2 \times 10^{3} = 2200\ \Omega$.`, r`$V = IR = 0.015 \times 2200$.`, r`$V = 33$ V.`], answer: '<p>33 V.</p>' },
        { type: 'example', title: 'proportional reasoning', q: r`<p>A fixed resistor carries 0.30 A when there is 4.5 V across it. Without finding R, what current flows when the voltage is increased to 13.5 V?</p>`, steps: [r`The resistor is ohmic, so $I \propto V$.`, r`The voltage is multiplied by $13.5 \div 4.5 = 3$.`, r`So the current is also multiplied by 3: $0.30 \times 3 = 0.90$ A.`], answer: '<p>0.90 A. (Check: R = 4.5/0.30 = 15 Ω, and 13.5/15 = 0.90 A.)</p>' },
        { type: 'try', question: { type: 'num', q: 'What voltage drives 0.40 A through a 30 Ω resistor?', answer: 12, unit: 'V', explain: 'V = IR = 0.40 × 30 = 12 V.' } },
        { type: 'misconception', wrong: 'Ohm’s law is V = IR, so every component obeys Ohm’s law.', right: 'V = IR (or R = V/I) works for every component at a single moment. Only ohmic components keep the same R when the voltage changes. A lamp, a diode and a thermistor do not (Lesson 5.4).' },
        { type: 'exam', standard: 'NCEA Level 2, AS 91173', html: '<p>When a question says “the resistor is ohmic” or “at constant temperature”, it is telling you R stays the same, so you can use proportion. When a question involves a lamp, expect its resistance to change with current.</p>' },
        { type: 'key', points: ["Ohm's law: I ∝ V for a metallic conductor at constant temperature.", 'Ohmic → constant resistance → straight-line graph through the origin.', r`$V = IR$, $I = V/R$, $R = V/I$. Convert mA and kΩ first.`, 'For an ohmic component, scale the current by the same factor as the voltage.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 9.0 V battery is connected to a 45 Ω resistor. What current flows?', answer: 0.2, unit: 'A', explain: 'I = V/R = 9.0 ÷ 45 = 0.20 A.' },
        { type: 'num', q: 'A current of 2.5 mA flows through a 10 kΩ resistor. What is the voltage across it?', answer: 25, unit: 'V', explain: 'V = 0.0025 × 10 000 = 25 V (or 2.5 mA × 10 kΩ = 25 V).' },
        { type: 'num', q: 'An ohmic resistor carries 0.8 A at 6.0 V. What current does it carry at 1.5 V?', answer: 0.2, unit: 'A', explain: 'V is divided by 4, so I is divided by 4: 0.8 ÷ 4 = 0.20 A.' },
        { type: 'mcq', q: "Ohm's law only applies if…", options: ['the temperature stays constant', 'the current is less than 1 A', 'the circuit is in series', 'the voltage is less than 12 V'], answer: 0, explain: 'Temperature changes change the resistance of a metal.' },
        { type: 'num', q: 'What resistance draws 5.0 A from a 230 V supply?', answer: 46, unit: 'Ω', explain: 'R = V/I = 230 ÷ 5.0 = 46 Ω.' },
      ],
    },
    // ------------------------------------------------------------------ 5.3
    {
      id: '5.3', title: 'Investigating resistance in the lab', levels: ['L1', 'L2'], minutes: 20,
      objectives: ['Set up a circuit to measure resistance', 'Record results and draw a V–I graph', 'Find resistance from the gradient and comment on errors'],
      sections: [
        { type: 'text', title: 'The aim and the variables', html: r`<p><b>Aim:</b> find out how the current through a resistor depends on the voltage across it, and so find its resistance.</p>
<ul><li><b>Independent variable</b> (what you change): the voltage across the resistor, using a variable power supply or a rheostat.</li><li><b>Dependent variable</b> (what you measure): the current through it.</li><li><b>Controlled variables</b> (kept the same): the resistor, its temperature, the wires and connections.</li></ul>` },
        { type: 'diagram', svg: OHM_CIRCUIT, caption: 'Ammeter in series with the resistor; voltmeter in parallel across it; the rheostat sets the current.' },
        { type: 'text', title: 'Method', html: r`<ol><li>Set up the circuit. Check the ammeter is in series and the voltmeter is across the resistor only.</li><li>Set the rheostat for a small current. Record the voltmeter and ammeter readings.</li><li>Change the rheostat to get at least 5–6 readings, evenly spread over the range.</li><li>Switch off between readings so the resistor does not heat up (which would change its resistance).</li><li>Reverse the supply connections and repeat to get negative values, if you want the full graph.</li><li>Repeat the whole set and average to reduce random error.</li></ol>` },
        { type: 'sim', sim: 'ohm-lab', caption: 'Choose the 10 Ω resistor. Record about six readings from −6 V to +6 V, then check the R = V/I column.' },
        { type: 'text', title: 'Graph and gradient', html: r`<p>Plot <b>voltage on the y-axis against current on the x-axis</b>. For an ohmic resistor the points lie on a straight line through the origin. Draw the <b>line of best fit</b> (not dot-to-dot), then find the gradient using a big triangle:</p>
<p>$$\text{gradient} = \frac{\Delta V}{\Delta I} = R$$</p>
<p>Using the gradient averages all your readings, so it is more reliable than calculating V/I from a single pair. If you plot the other way round (current on y, voltage on x), the gradient is $\Delta I / \Delta V = 1/R$.</p>` },
        { type: 'diagram', svg: VI_GRAPH, caption: 'Gradient = ΔV ÷ ΔI = 8.0 V ÷ 0.40 A = 20 Ω. The crosses scatter slightly either side of the line (random error).' },
        { type: 'example', title: 'from a results table', q: r`<p>A student records: 1.0 V, 0.048 A; 2.0 V, 0.101 A; 3.0 V, 0.149 A; 4.0 V, 0.202 A; 5.0 V, 0.250 A. Find the resistance.</p>`, steps: [r`The ratio $V/I$ is close to 20 for every row, so the resistor is ohmic.`, r`From the line of best fit through (0, 0) and (0.250, 5.0): gradient $= \dfrac{5.0 - 0}{0.250 - 0}$.`, r`$R = 20\ \Omega$.`], answer: '<p>About 20 Ω.</p>' },
        { type: 'text', title: 'Errors and improvements', html: r`<ul><li><b>Random errors</b> (readings scatter): take more readings, repeat and average, use a line of best fit.</li><li><b>Systematic errors</b> (every reading out by the same amount): a meter that does not read zero at the start (<b>zero error</b>) shifts the line so it misses the origin. Check and correct the zero.</li><li><b>Heating:</b> large currents warm the resistor and raise its resistance, so the graph curves at the top. Keep currents small and switch off between readings.</li><li><b>Resolution:</b> use the meter range that gives the most digits.</li></ul>` },
        { type: 'exam', standard: 'NCEA practical investigations', html: '<p>A strong write-up states the aim and variables, records results in a table with units in the headings, plots a line of best fit, calculates the gradient with a large triangle, and explains at least one source of error with a specific improvement.</p>' },
        { type: 'key', points: ['Change V (independent), measure I (dependent), keep temperature constant.', 'Plot V (y) against I (x): gradient = R. Plot I against V: gradient = 1/R.', 'Use a line of best fit and a large triangle.', 'Switch off between readings to avoid heating; check for zero errors.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'In the experiment, which is the independent variable?', options: ['The voltage across the resistor', 'The current through the resistor', 'The resistance', 'The temperature'], answer: 0, explain: 'You choose the voltage (with the rheostat) and measure the resulting current.' },
        { type: 'mcq', q: 'A graph of voltage (y) against current (x) for a resistor is a straight line through the origin. What does the gradient equal?', options: ['The resistance', '1/resistance', 'The power', 'The charge'], answer: 0, explain: 'Gradient = ΔV/ΔI = R.' },
        { type: 'num', q: 'On a V–I graph (V on y), the line passes through (0, 0) and (0.60 A, 9.0 V). What is the resistance?', answer: 15, unit: 'Ω', explain: 'Gradient = 9.0 ÷ 0.60 = 15 Ω.' },
        { type: 'mcq', q: 'Why should the student switch off between readings?', options: ['To stop the resistor heating up and changing its resistance', 'To save the battery for later', 'To reset the ammeter to zero', 'So the voltmeter can cool down'], answer: 0, explain: 'Heating raises resistance and spoils the straight line.' },
        { type: 'mcq', q: 'All the points lie on a straight line, but the line crosses the current axis at 0.02 A instead of the origin. The most likely cause is…', options: ['a zero error on the ammeter', 'random error', 'the resistor heating up', 'too few readings'], answer: 0, explain: 'A constant offset in every reading is a systematic (zero) error.' },
      ],
    },
    // ------------------------------------------------------------------ 5.4
    {
      id: '5.4', title: 'I–V characteristics: ohmic and non-ohmic', levels: ['L1', 'L2'], minutes: 18,
      objectives: ['Sketch and interpret I–V graphs for a resistor, filament lamp and diode', 'Explain the shape of the lamp graph', 'Find resistance at a point on a curved graph'],
      sections: [
        { type: 'text', title: 'Three famous graphs', html: r`<p>An <b>I–V characteristic</b> is a graph of current (y-axis) against voltage (x-axis) for a component, including negative values (supply reversed). The shape tells you how the resistance behaves.</p>` },
        { type: 'diagram', svg: IV_THREE, caption: 'Left: straight line through the origin — constant R. Middle: curve that flattens — R increases. Right: current flows one way only.' },
        { type: 'text', title: 'Fixed resistor (ohmic)', html: r`<p>A straight line through the origin, the same in both directions. Current is proportional to voltage, so resistance is constant. On an I–V graph a <b>steeper</b> line means a <b>smaller</b> resistance.</p>` },
        { type: 'text', title: 'Filament lamp (non-ohmic)', html: r`<p>The graph curves and gets <b>flatter</b> at higher voltages: each extra volt produces less extra current. Chain of reasoning:</p>
<ol><li>More voltage → more current through the tungsten filament.</li><li>More current → more energy transferred per second → the filament gets hotter (up to about 2500 °C).</li><li>Hotter → metal ions vibrate more → electrons collide more often.</li><li>So the <b>resistance increases</b>, and the current rises less than proportionally.</li></ol>
<p>Reversing the voltage gives the same shape upside-down, because the filament works the same either way.</p>` },
        { type: 'text', title: 'Diode and LED (non-ohmic)', html: r`<p>A diode lets current through in one direction only. In the <b>forward</b> direction almost nothing happens until about 0.6 V (silicon diode; around 2 V for most LEDs). Above that the current rises very steeply, so the resistance becomes small. In <b>reverse</b> the current is practically zero — very high resistance. Diodes protect circuits from batteries put in backwards and turn AC into DC (Chapter 8).</p>` },
        { type: 'sim', sim: 'ohm-lab', caption: 'Switch the component to the filament lamp, then the diode. Record readings and compare the R = V/I column.' },
        { type: 'text', title: 'Resistance from a curved graph', html: r`<p>For a curve, the resistance at a point is $R = \dfrac{V}{I}$ <b>using the coordinates of that point</b>. Do <b>not</b> use the gradient of the curve — the gradient only equals 1/R for a straight line through the origin.</p>` },
        { type: 'example', title: 'lamp resistance at two points', q: r`<p>From a lamp’s I–V graph: at 2.0 V the current is 0.20 A; at 6.0 V it is 0.30 A. Find the resistance at each voltage and explain the difference.</p>`, steps: [r`At 2.0 V: $R = \dfrac{2.0}{0.20} = 10\ \Omega$.`, r`At 6.0 V: $R = \dfrac{6.0}{0.30} = 20\ \Omega$.`, 'The filament is hotter at 6.0 V, so its ions vibrate more and the resistance is higher.'], answer: '<p>10 Ω at 2.0 V and 20 Ω at 6.0 V.</p>' },
        { type: 'misconception', wrong: 'The resistance of a component is the gradient of its I–V graph.', right: 'On an I–V graph, resistance is V ÷ I at a point. Only for a straight line through the origin does this equal 1 ÷ gradient.' },
        { type: 'funfact', title: 'why bulbs blow at switch-on', html: 'A cold filament has about one-tenth of its hot resistance, so for a split second at switch-on the current is about ten times bigger than normal. That surge is why old-style bulbs usually failed the moment you flicked the switch.' },
        { type: 'key', points: ['Resistor: straight line through origin → ohmic, constant R.', 'Filament lamp: curve flattens → R increases as it heats up.', 'Diode: current one way only, after about 0.6 V.', 'Resistance at a point = V/I at that point, not the gradient.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'Which I–V graph shows an ohmic conductor?', options: ['A straight line through the origin', 'A curve that flattens at high voltage', 'A line that is zero for negative voltage', 'A horizontal line'], answer: 0, explain: 'Constant R means I ∝ V.' },
        { type: 'mcq', q: 'Why does the I–V graph for a filament lamp curve?', options: ['The filament heats up, so its resistance increases', 'The filament cools down, so its resistance decreases', 'Charge is used up in the lamp', 'The voltage across the lamp is constant'], answer: 0, explain: 'More current → hotter → more ion vibration → more resistance.' },
        { type: 'num', q: 'On a lamp’s I–V graph, the point (4.0 V, 0.25 A) lies on the curve. What is the lamp’s resistance at 4.0 V?', answer: 16, unit: 'Ω', explain: 'R = V/I = 4.0 ÷ 0.25 = 16 Ω.' },
        { type: 'mcq', q: 'A diode is connected in reverse. The current is…', options: ['almost zero', 'very large', 'the same as forward', 'proportional to the voltage'], answer: 0, explain: 'In reverse a diode has a very high resistance.' },
        { type: 'tf', q: 'On an I–V graph, a steeper straight line means a larger resistance.', answer: false, explain: 'Steeper means more current per volt, which is a smaller resistance (gradient = 1/R).' },
      ],
    },
    // ------------------------------------------------------------------ 5.5
    {
      id: '5.5', title: 'Thermistors and LDRs: resistors that sense', levels: ['L1', 'L2'], minutes: 16,
      objectives: ['Describe how a thermistor and an LDR respond to temperature and light', 'Read resistance values from sensor graphs', 'Calculate the current in a simple sensor circuit'],
      sections: [
        { type: 'text', title: 'Two semiconductor sensors', html: r`<p>Both components are made of <b>semiconductors</b> (Lesson 2.4), which have very few free charge carriers until something gives the electrons extra energy.</p>
<ul><li><b>Thermistor</b> (NTC type): heating frees more charge carriers, so the <b>resistance falls as temperature rises</b>.</li><li><b>LDR</b> (light-dependent resistor): light frees more charge carriers, so the <b>resistance falls as light intensity rises</b>.</li></ul>
<p>Note the difference from a metal, whose resistance <b>rises</b> when it is heated.</p>` },
        { type: 'sim', sim: 'sensor-lab', caption: 'Move the slider and read the resistance off the graph. Watch how the voltmeter reading changes too.' },
        { type: 'text', title: 'Reading the graphs', html: r`<p>Sensor graphs are curves, not straight lines. The thermistor’s resistance drops quickly at low temperatures and more slowly when hot. An LDR’s resistance can change from about 1 MΩ in the dark to a few hundred ohms in sunlight, so light levels are often drawn on a <b>logarithmic</b> scale where each step is ten times brighter.</p>` },
        { type: 'example', title: 'current in a sensor circuit', q: r`<p>A thermistor is in series with a 2.0 kΩ resistor and a 6.0 V battery. At 25 °C the thermistor’s resistance is 10 kΩ; at 80 °C it is 1.0 kΩ. Find the current at each temperature.</p>`, steps: [r`At 25 °C: total $R = 10 + 2.0 = 12$ kΩ $= 12\,000\ \Omega$.`, r`$I = \dfrac{V}{R} = \dfrac{6.0}{12\,000} = 5.0 \times 10^{-4}$ A $= 0.50$ mA.`, r`At 80 °C: total $R = 1.0 + 2.0 = 3.0$ kΩ, so $I = \dfrac{6.0}{3000} = 2.0 \times 10^{-3}$ A $= 2.0$ mA.`], answer: '<p>0.50 mA at 25 °C and 2.0 mA at 80 °C — the current rises four times as the thermistor warms up. (Adding series resistances is covered fully in Chapter 6.)</p>' },
        { type: 'text', title: 'What they are used for', html: r`<ul><li><b>Thermistors:</b> digital thermometers, fridge and oven thermostats, fire alarms, battery-charger temperature cut-outs, car engine temperature gauges.</li><li><b>LDRs:</b> street lights that switch on at dusk, automatic night lights, camera light meters, alarm systems that detect a broken light beam.</li></ul>
<p>In real devices the sensor is usually part of a <b>potential divider</b> (Chapter 11), so that a change in resistance becomes a change in voltage that can switch something on.</p>` },
        { type: 'misconception', wrong: 'An LDR produces electricity when light shines on it, like a solar cell.', right: 'An LDR produces no voltage. It only changes its resistance; a battery is still needed to drive a current through it.' },
        { type: 'funfact', title: 'the thermometer under your tongue', html: 'A digital clinical thermometer has a tiny thermistor bead in its tip. Near body temperature its resistance changes by about 4% for every degree, so the electronics can measure your temperature to a tenth of a degree.' },
        { type: 'key', points: ['NTC thermistor: hotter → less resistance.', 'LDR: brighter → less resistance.', 'Both are semiconductors: energy frees more charge carriers.', 'Read resistance from the graph, then use V = IR.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'What happens to the resistance of an LDR when a torch is shone on it?', options: ['It decreases', 'It increases', 'It stays the same', 'It becomes zero'], answer: 0, explain: 'More light frees more charge carriers.' },
        { type: 'mcq', q: 'A thermistor is warmed from 20 °C to 60 °C in a series circuit with a battery. The current…', options: ['increases', 'decreases', 'stays the same', 'reverses direction'], answer: 0, explain: 'Its resistance falls, so with the same voltage the current rises.' },
        { type: 'num', q: 'An LDR has a resistance of 600 Ω in a bright room. It is connected alone across a 3.0 V battery. What current flows?', answer: 0.005, unit: 'A', explain: 'I = V/R = 3.0 ÷ 600 = 0.0050 A (5.0 mA).' },
        { type: 'mcq', q: 'Which device would be best for switching on a street light at dusk?', options: ['LDR', 'Thermistor', 'Fuse', 'Diode'], answer: 0, explain: 'It responds to light level.' },
        { type: 'mcq', q: 'How is a thermistor different from a metal wire when both are heated?', options: ['The thermistor’s resistance falls; the wire’s rises', 'Both resistances rise', 'Both resistances fall', 'The thermistor’s resistance rises; the wire’s falls'], answer: 0, explain: 'Semiconductors gain charge carriers; metals get more ion vibration.' },
      ],
    },
    // ------------------------------------------------------------------ 5.6
    {
      id: '5.6', title: 'Resistors in practice', levels: ['L1', 'L2'], minutes: 14,
      objectives: ['Read a resistor colour code', 'Explain tolerance and power rating', 'Describe how a rheostat and potentiometer work'],
      sections: [
        { type: 'text', title: 'Why we use resistors', html: r`<p>Resistors set the current or voltage in a circuit. An LED, for example, would draw far too much current and burn out if connected straight across a 9 V battery; a resistor in series limits the current to a safe 10–20 mA.</p>` },
        { type: 'text', title: 'The colour code', html: r`<p>Small resistors are too small to print numbers on, so they use coloured bands. The first two bands are digits, the third is the number of zeros (the multiplier), and a gap then the last band gives the <b>tolerance</b>.</p>
<div class="tablewrap"><table><thead><tr><th>Colour</th><th>Digit</th><th>Colour</th><th>Digit</th></tr></thead><tbody>
<tr><td>Black</td><td>0</td><td>Green</td><td>5</td></tr><tr><td>Brown</td><td>1</td><td>Blue</td><td>6</td></tr><tr><td>Red</td><td>2</td><td>Violet</td><td>7</td></tr><tr><td>Orange</td><td>3</td><td>Grey</td><td>8</td></tr><tr><td>Yellow</td><td>4</td><td>White</td><td>9</td></tr>
</tbody></table></div>
<p>Tolerance: gold ±5%, silver ±10%, brown ±1%.</p>` },
        { type: 'diagram', svg: BANDS, caption: 'Brown (1), black (0), red (2 zeros) = 1000 Ω. Yellow (4), violet (7), orange (3 zeros) = 47 000 Ω.' },
        { type: 'example', title: 'tolerance', q: r`<p>A resistor is marked red, red, brown, gold. What is its value, and what range could its true resistance lie in?</p>`, steps: ['Red = 2, red = 2: digits 22.', 'Brown = 1 zero: 220 Ω.', 'Gold = ±5%: 5% of 220 = 11 Ω.', 'Range: 220 − 11 = 209 Ω to 220 + 11 = 231 Ω.'], answer: '<p>220 Ω ± 5%, so anywhere from 209 Ω to 231 Ω.</p>' },
        { type: 'text', title: 'Power rating', html: r`<p>Every resistor heats up when current flows through it. The <b>power rating</b> (often 0.25 W for small resistors) is the fastest rate of heating it can handle without damage. You will calculate power in Chapter 7 using $P = I^2R$; a small resistor carrying too much current overheats, discolours and can burn out.</p>` },
        { type: 'text', title: 'Variable resistors', html: r`<ul><li>A <b>rheostat</b> has a sliding contact that changes how much of a resistance wire the current flows through. More wire in the circuit → more resistance → less current. Used to control current in experiments.</li><li>A <b>potentiometer</b> uses the same track with three connections, to give an adjustable voltage — volume knobs and dimmers. You will analyse it as a potential divider in Chapter 11.</li></ul>` },
        { type: 'deeper', levels: ['L3', 'Uni'], title: 'resistivity again', html: r`<p>A resistor’s value is set by $R = \dfrac{\rho L}{A}$. Example: how long must a nichrome wire ($\rho = 1.1 \times 10^{-6}\ \Omega\,\text{m}$) of cross-section $1.0 \times 10^{-7}$ m² be to have a resistance of 22 Ω? $L = \dfrac{RA}{\rho} = \dfrac{22 \times 1.0 \times 10^{-7}}{1.1 \times 10^{-6}} = 2.0$ m.</p>` },
        { type: 'funfact', title: 'remember the colours', html: 'Many students remember the colour order with a sentence where each word starts with the colour’s letter: Black, Brown, Red, Orange, Yellow, Green, Blue, Violet, Grey, White. Try making up your own — the sillier, the better it sticks.' },
        { type: 'key', points: ['Band 1, band 2 = digits; band 3 = number of zeros; last band = tolerance.', 'Tolerance gives the range the true value could lie in.', 'Power rating: the maximum heating rate the resistor can take.', 'Rheostat controls current; potentiometer gives a variable voltage.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'A resistor has bands brown, black, orange, gold. What is its resistance?', options: ['10 kΩ', '1 kΩ', '100 Ω', '103 Ω'], answer: 0, explain: '1, 0, then 3 zeros: 10 000 Ω = 10 kΩ.' },
        { type: 'num', q: 'A 470 Ω resistor has a tolerance of ±10%. What is the largest value its resistance could be?', answer: 517, unit: 'Ω', explain: '10% of 470 = 47; 470 + 47 = 517 Ω.' },
        { type: 'mcq', q: 'Why is a resistor connected in series with an LED?', options: ['To limit the current so the LED does not burn out', 'To make the LED brighter', 'To change DC into AC', 'To store charge'], answer: 0, explain: 'Without it the current would be far too large.' },
        { type: 'mcq', q: 'Sliding a rheostat so that more of its wire is in the circuit will…', options: ['decrease the current', 'increase the current', 'not change the current', 'reverse the current'], answer: 0, explain: 'More wire → more resistance → less current.' },
        { type: 'mcq', q: 'What does a resistor’s power rating tell you?', options: ['The maximum rate at which it can safely transfer energy as heat', 'Its resistance', 'The maximum voltage of the battery', 'How long it will last'], answer: 0, explain: 'Above the rating it overheats.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'A 6.0 V supply drives a current of 0.30 A through a resistor. Calculate the resistance.', answer: 20, unit: 'Ω', explain: 'R = V/I = 6.0 ÷ 0.30 = 20 Ω.' },
      { type: 'num', q: 'Calculate the current through a 1.5 kΩ resistor with 4.5 V across it. Give your answer in mA.', answer: 3, unit: 'mA', explain: 'I = 4.5 ÷ 1500 = 0.0030 A = 3.0 mA.' },
      { type: 'mcq', q: 'Which component’s resistance falls when it gets warmer?', options: ['Thermistor', 'Filament lamp', 'Copper wire', 'Fixed resistor'], answer: 0, explain: 'A semiconductor gains charge carriers when heated.' },
      { type: 'mcq', q: 'In an experiment to measure resistance, the voltmeter should be connected…', options: ['in parallel with the resistor', 'in series with the resistor', 'across the battery only', 'in series with the ammeter'], answer: 0, explain: 'Voltmeters measure across a component.' },
      { type: 'num', q: 'What voltage is needed to drive 0.15 A through a 40 Ω resistor?', answer: 6, unit: 'V', explain: 'V = IR = 0.15 × 40 = 6.0 V.' },
    ],
    M: [
      { type: 'explain', q: 'Describe how you would use an ammeter, a voltmeter and a variable power supply to show that a resistor obeys Ohm’s law. Include how you would use your results.', model: '<p>Connect the resistor in series with the ammeter and the variable supply, and connect the voltmeter in parallel across the resistor. Set a low voltage and record the voltmeter and ammeter readings. Increase the voltage in steps to get at least five pairs of readings, switching off between readings so the resistor stays at the same temperature. Plot voltage against current. If the points lie on a straight line through the origin, the current is directly proportional to the voltage, so the resistor obeys Ohm’s law. The gradient of the line gives the resistance.</p>', points: [{ lvl: 'A', text: 'Ammeter in series, voltmeter in parallel across the resistor' }, { lvl: 'M', text: 'Several readings at different voltages, temperature kept constant' }, { lvl: 'M', text: 'Straight line through origin shows I ∝ V; gradient = R' }] },
      { type: 'num', q: 'A filament lamp carries 0.12 A at 1.2 V and 0.25 A at 6.0 V. By how many ohms does its resistance increase between these voltages?', answer: 14, unit: 'Ω', explain: 'R₁ = 1.2/0.12 = 10 Ω; R₂ = 6.0/0.25 = 24 Ω; increase = 14 Ω.' },
      { type: 'num', q: 'An ohmic resistor carries 40 mA at 3.0 V. What current flows when the voltage is 7.5 V? Give your answer in mA.', answer: 100, unit: 'mA', explain: 'V × 2.5, so I × 2.5: 40 × 2.5 = 100 mA.' },
      { type: 'explain', q: 'Explain why the resistance of an LDR decreases when the light level increases.', model: '<p>An LDR is made from a semiconductor, which normally has very few free charge carriers. When light falls on it, the light gives energy to electrons that were bound in the material, freeing them to move. With more free charge carriers, more charge can flow for the same voltage, so the current is larger and the resistance (V/I) is smaller.</p>', points: [{ lvl: 'A', text: 'States the resistance decreases with more light' }, { lvl: 'M', text: 'Light frees more charge carriers in the semiconductor' }, { lvl: 'M', text: 'More carriers → more current for the same voltage → lower R' }] },
    ],
    E: [
      { type: 'explain', q: 'Sketch (in words) the I–V graph of a filament lamp and explain its shape in terms of particles. Explain how you would find the lamp’s resistance at a particular voltage from the graph.', model: '<p>The graph passes through the origin and is roughly straight at low voltages, then curves so that it gets flatter as the voltage increases. It has the same shape (upside down) for negative voltages. As the voltage increases, the current increases and the filament transfers energy faster, so it gets hotter. In the hotter tungsten the positive ions vibrate with larger amplitude, so the free electrons collide with them more often. This increases the resistance, so each extra volt produces a smaller increase in current — the curve flattens. To find the resistance at a voltage, read the current at that voltage from the graph and calculate R = V/I using that point’s coordinates. The gradient of the curve should not be used.</p>', points: [{ lvl: 'A', text: 'Correct shape: through origin, flattening at higher voltage' }, { lvl: 'M', text: 'Higher current heats the filament' }, { lvl: 'E', text: 'Hotter ions vibrate more → more collisions → higher resistance → flatter curve' }, { lvl: 'E', text: 'R = V/I at a point, not the gradient' }] },
      { type: 'num', q: 'A thermistor and a fixed 4.0 kΩ resistor are in series with a 9.0 V battery. The current is 1.5 mA. What is the thermistor’s resistance? (Hint: find the total resistance first.)', answer: 2000, unit: 'Ω', explain: 'R_total = V/I = 9.0 ÷ 0.0015 = 6000 Ω; thermistor = 6000 − 4000 = 2000 Ω (2.0 kΩ).' },
      { type: 'explain', q: 'A student plots current (y) against voltage (x) for a resistor and gets a straight line through the origin with gradient 0.050 A/V. Another student plots voltage (y) against current (x) for the same resistor. Discuss what each gradient means and find the resistance.', model: '<p>For a straight line through the origin, both graphs show that current is directly proportional to voltage, so the resistor is ohmic and has a constant resistance. On the I–V graph (current on y), the gradient is ΔI/ΔV = 1/R, so R = 1 ÷ 0.050 = 20 Ω. On the V–I graph (voltage on y), the gradient is ΔV/ΔI = R, so the second student’s gradient would be 20 V/A = 20 Ω directly. Both give the same resistance; the second graph gives it without needing a reciprocal.</p>', points: [{ lvl: 'A', text: 'Straight line through origin → ohmic' }, { lvl: 'M', text: 'I–V gradient = 1/R; V–I gradient = R' }, { lvl: 'E', text: 'Correctly finds R = 20 Ω from 1/0.050' }, { lvl: 'E', text: 'Explains both students get the same resistance' }] },
    ],
  },
  glossary: [
    { term: 'Resistance (R)', def: 'Voltage needed per amp of current: R = V/I. Measured in ohms (Ω).' },
    { term: 'Ohm (Ω)', def: 'Unit of resistance: 1 Ω = 1 V per A.' },
    { term: "Ohm's law", def: 'For a metallic conductor at constant temperature, current is directly proportional to voltage.' },
    { term: 'Ohmic conductor', def: 'A component whose resistance stays constant, giving a straight-line I–V graph through the origin.' },
    { term: 'Non-ohmic', def: 'A component whose resistance changes with current or voltage, such as a lamp, diode or thermistor.' },
    { term: 'I–V characteristic', def: 'A graph of current against voltage for a component.' },
    { term: 'Thermistor', def: 'A semiconductor resistor whose resistance falls as temperature rises (NTC type).' },
    { term: 'LDR', def: 'Light-dependent resistor: resistance falls as light intensity rises.' },
    { term: 'Diode', def: 'A component that lets current flow in one direction only.' },
    { term: 'Tolerance', def: 'How far a resistor’s true value may differ from its marked value, as a percentage.' },
    { term: 'Power rating', def: 'The maximum rate of heating a resistor can handle safely.' },
    { term: 'Rheostat', def: 'A variable resistor used to control current.' },
    { term: 'Potentiometer', def: 'A variable resistor with three terminals, used to give an adjustable voltage.' },
    { term: 'Line of best fit', def: 'A straight line or smooth curve that passes as close as possible to all the plotted points.' },
  ],
  formulas: [
    { name: 'Resistance / Ohm’s law', tex: 'V = IR', note: 'Also I = V/R and R = V/I. Convert mA and kΩ first.', level: 'L1 / L2' },
    { name: 'Gradient of a V–I graph', tex: r`R = \frac{\Delta V}{\Delta I}`, note: 'Voltage on y, current on x. For I on y, gradient = 1/R.', level: 'L1 / L2' },
    { name: 'Resistivity', tex: r`R = \frac{\rho L}{A}`, note: 'Longer → more R; thicker → less R.', level: 'L3 / Uni' },
  ],
  flashcards: [
    { front: 'Define resistance', back: 'R = V/I: volts needed per amp' }, { front: "State Ohm's law", back: 'I ∝ V for a metallic conductor at constant temperature' },
    { front: 'Ohmic I–V graph', back: 'Straight line through the origin' }, { front: 'Filament lamp I–V graph', back: 'Curve flattening: R rises as it heats' },
    { front: 'Diode I–V graph', back: 'Current only forward, after about 0.6 V' }, { front: 'Thermistor (NTC) when heated', back: 'Resistance falls' },
    { front: 'LDR in brighter light', back: 'Resistance falls' }, { front: 'Gradient of V (y) against I (x)', back: 'Resistance' },
    { front: 'Resistance at a point on a curve', back: 'V ÷ I at that point (not the gradient)' },
  ],
};
