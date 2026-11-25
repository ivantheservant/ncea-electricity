/**
 * Chapter 8 — DC, AC & Power Transmission.
 */
import { svg, comp, wire, dot, label, arrow } from '../js/utils/svg.js';

const r = String.raw;

/**
 * Small voltage–time sketch.
 * @param {number} ox X offset.
 * @param {string} title Title.
 * @param {(t:number)=>number} f Voltage (−1…1) against time (0…1).
 * @returns {string} SVG markup.
 */
function vt(ox, title, f) {
  const W = 200;
  const y0 = 95;
  let d = '';
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    d += `${i ? 'L' : 'M'}${(ox + 20 + t * (W - 30)).toFixed(1)},${(y0 - f(t) * 55).toFixed(1)}`;
  }
  return `<line x1="${ox + 20}" y1="${y0}" x2="${ox + W - 6}" y2="${y0}"/><line x1="${ox + 20}" y1="30" x2="${ox + 20}" y2="160"/>` +
    `<path d="${d}" style="stroke:var(--blue);stroke-width:3"/>` + label(ox + W - 8, y0 + 16, 't', { anchor: 'end', cls: 'bold' }) + label(ox + 28, 38, 'V', { anchor: 'start', cls: 'bold' }) + label(ox + W / 2, 18, title, { cls: 'bold' });
}

const DC_AC = svg(640, 175, vt(0, 'Steady DC (battery)', () => 0.7) + vt(220, 'AC (mains)', (t) => Math.sin(2 * Math.PI * 2 * t)) + vt(440, 'Varying DC', (t) => Math.abs(Math.sin(2 * Math.PI * 2 * t))), { title: 'Voltage–time graphs: steady DC, alternating AC and varying DC', maxw: 700 });

const PEAK = (() => {
  const W = 460;
  const y0 = 120;
  const A = 80;
  let d = '';
  for (let i = 0; i <= 200; i++) { const t = i / 200; d += `${i ? 'L' : 'M'}${(50 + t * 380).toFixed(1)},${(y0 - A * Math.sin(2 * Math.PI * 1.5 * t)).toFixed(1)}`; }
  const per = 380 / 1.5;
  return svg(W, 240, `<line x1="50" y1="${y0}" x2="440" y2="${y0}"/><line x1="50" y1="25" x2="50" y2="220"/><path d="${d}" style="stroke:var(--blue);stroke-width:3"/>` +
    `<line x1="50" y1="${y0 - A}" x2="440" y2="${y0 - A}" class="thin dash"/><line x1="50" y1="${y0 - A / Math.SQRT2}" x2="440" y2="${y0 - A / Math.SQRT2}" class="dash" style="stroke:var(--bad)"/>` +
    label(44, y0 - A + 4, '+325 V', { anchor: 'end', cls: 'small bold' }) + label(44, y0 - A / Math.SQRT2 + 12, '230 V rms', { anchor: 'end', cls: 'small bold' }) + label(44, y0 + A + 4, '−325 V', { anchor: 'end', cls: 'small bold' }) +
    `<line x1="50" y1="${y0 + A}" x2="440" y2="${y0 + A}" class="thin dash"/>` +
    arrow(50 + per * 0.25, 225, 50 + per * 1.25, 225) + arrow(50 + per * 1.25, 225, 50 + per * 0.25, 225) + label(50 + per * 0.75, 218, 'one period T = 20 ms', { cls: 'small bold' }),
  { title: 'NZ mains: peak 325 V, rms 230 V, period 20 ms', maxw: 500 });
})();

/**
 * Diode drawn along any line (points from a to b).
 * @param {number[]} a Start point.
 * @param {number[]} b End point.
 * @returns {string} SVG markup.
 */
function slantDiode(a, b) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>` +
    `<g transform="translate(${mx} ${my}) rotate(${ang})"><polygon points="-8,-9 8,0 -8,9" class="fill-sheet"/><line x1="8" y1="-9" x2="8" y2="9"/></g>`;
}

const BRIDGE = (() => {
  const T = [190, 40];
  const Rt = [270, 120];
  const B = [190, 200];
  const L = [110, 120];
  return svg(460, 240, [
    comp('ac', 40, 200, 40, 40, { label: 'AC in', labelPos: 'left' }), wire([40, 40], T), wire([40, 200], B),
    slantDiode(L, T), slantDiode(T, Rt), slantDiode(L, B), slantDiode(B, Rt),
    dot(...T), dot(...B), dot(...L), dot(...Rt),
    wire(Rt, [330, 120], [330, 60], [380, 60]), wire(L, [110, 225], [330, 225], [330, 180], [380, 180]),
    comp('resistor', 380, 60, 380, 180, { label: 'load', labelPos: 'right' }),
    label(338, 52, '+', { cls: 'bold' }), label(338, 196, '−', { cls: 'bold' }),
  ].join(''), { title: 'Bridge rectifier: four diodes always send current the same way through the load', maxw: 480 });
})();

const GRID = svg(640, 170, [
  '<rect x="10" y="60" width="90" height="60" rx="8" class="fill-soft"/>', label(55, 95, 'power station', { cls: 'small bold' }), label(55, 140, '11–22 kV', { cls: 'small' }),
  arrow(102, 90, 150, 90), '<rect x="150" y="65" width="70" height="50" rx="8" class="fill-green"/>', label(185, 95, 'step-up', { cls: 'small bold' }),
  arrow(222, 90, 290, 90), label(330, 70, 'national grid', { cls: 'small bold' }), label(330, 140, '220 kV (HVDC ±350 kV)', { cls: 'small' }), wire([290, 90], [370, 90]), arrow(370, 90, 420, 90),
  '<rect x="420" y="65" width="80" height="50" rx="8" class="fill-green"/>', label(460, 95, 'step-down', { cls: 'small bold' }), arrow(502, 90, 540, 90),
  '<rect x="540" y="60" width="90" height="60" rx="8" class="fill-soft"/>', label(585, 95, 'homes', { cls: 'small bold' }), label(585, 140, '230 V', { cls: 'small' }),
].join(''), { title: 'From power station to home: step up, transmit at high voltage, step down', maxw: 680 });

export default {
  intro: 'A battery pushes current one way. The power points in your house push it back and forth fifty times a second. This chapter explains alternating current, why we describe it with “rms” values, how diodes turn it into the DC your phone needs, and why New Zealand sends its electricity across the country at hundreds of thousands of volts.',
  standards: 'NCEA Level 2 (power and transmission ideas; diodes) and NCEA Level 3 AS 91526 (AC: rms values). Transformers are covered in Chapter 15.',
  lessons: [
    // ------------------------------------------------------------------ 8.1
    {
      id: '8.1', title: 'Direct and alternating current', levels: ['L1', 'L2'], minutes: 15,
      objectives: ['Distinguish DC and AC', 'Read period and frequency from a graph', 'Use f = 1/T'],
      sections: [
        { type: 'text', title: 'Two kinds of current', html: r`<ul><li><b>Direct current (DC)</b> flows in <b>one direction only</b>. Batteries, solar panels and phone chargers supply DC.</li><li><b>Alternating current (AC)</b> keeps <b>reversing direction</b>. The voltage rises to a maximum, falls to zero, reverses to a maximum the other way, and returns — over and over. The mains supply is AC.</li></ul>
<p>In AC the free electrons do not travel round the circuit at all: they just jiggle back and forth a tiny distance. Energy is still transferred to the components, because the electrons do work on the lattice whichever way they move.</p>` },
        { type: 'diagram', svg: DC_AC, caption: 'DC stays on one side of the axis. AC crosses it, changing direction each half-cycle.' },
        { type: 'formula', title: 'Period and frequency', tex: r`f = \frac{1}{T}`, symbols: [['f', 'frequency: cycles per second', 'hertz (Hz)'], ['T', 'period: time for one complete cycle', 'second (s)']], html: r`<p>New Zealand mains is <b>230 V, 50 Hz</b>: 50 complete cycles every second, so each cycle takes $T = 1/50 = 0.020$ s = 20 ms. (North America uses 60 Hz.)</p>` },
        { type: 'sim', sim: 'ac-scope', caption: 'Start on AC. Change the frequency and measure the period on the time axis. Then compare with DC.' },
        { type: 'example', title: 'reading an oscilloscope', q: r`<p>An oscilloscope shows one complete AC cycle across 4 squares. Each square is 5 ms. The peak is 3 squares high at 2 V per square. Find the period, the frequency and the peak voltage.</p>`, steps: [r`Period: $T = 4 \times 5 = 20$ ms $= 0.020$ s.`, r`Frequency: $f = \dfrac{1}{0.020} = 50$ Hz.`, r`Peak voltage: $3 \times 2 = 6.0$ V.`], answer: '<p>20 ms, 50 Hz, 6.0 V.</p>' },
        { type: 'text', title: 'Why use AC at all?', html: r`<p>AC is easy to make (a spinning generator naturally produces it, Chapter 14), and above all its voltage can be changed easily with <b>transformers</b> (Chapter 15). That lets power companies transmit at very high voltage and then step it down safely for homes. Electronics still need DC, so chargers convert AC to DC.</p>` },
        { type: 'try', question: { type: 'num', q: 'An AC supply has a period of 4.0 ms. What is its frequency?', answer: 250, unit: 'Hz', explain: 'f = 1/T = 1 ÷ 0.0040 = 250 Hz.' } },
        { type: 'misconception', wrong: 'In AC, the current goes out from the power station and comes back again.', right: 'The electrons only vibrate back and forth a tiny distance in the wires near you. Energy travels along the lines; the electrons do not.' },
        { type: 'funfact', title: 'the war of the currents', html: 'In the 1880s Thomas Edison backed DC for city power, while George Westinghouse and Nikola Tesla backed AC. AC won, mainly because transformers made long-distance transmission cheap. Today very long links often use high-voltage DC again — including the cable under Cook Strait.' },
        { type: 'key', points: ['DC: one direction. AC: reverses direction regularly.', r`$f = 1/T$. NZ mains: 230 V, 50 Hz, T = 20 ms.`, 'AC is used for the grid because transformers can change its voltage.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'Which supplies direct current?', options: ['A battery', 'A wall power point', 'A car alternator before rectification', 'A wind turbine generator coil'], answer: 0, explain: 'Batteries give a one-direction current.' },
        { type: 'num', q: 'What is the period of a 50 Hz supply, in milliseconds?', answer: 20, unit: 'ms', explain: 'T = 1/50 = 0.020 s = 20 ms.' },
        { type: 'num', q: 'An AC signal completes 300 cycles in 2.0 s. What is its frequency?', answer: 150, unit: 'Hz', explain: '300 ÷ 2.0 = 150 Hz.' },
        { type: 'tf', q: 'In an AC circuit the electrons travel all the way from the power station to your house.', answer: false, explain: 'They vibrate back and forth a small distance.' },
        { type: 'mcq', q: 'The main reason the grid uses AC is that…', options: ['its voltage can be changed easily with transformers', 'it is safer than DC at any voltage', 'electrons move faster', 'it cannot cause shocks'], answer: 0, explain: 'Transformers only work with changing (AC) current.' },
      ],
    },
    // ------------------------------------------------------------------ 8.2
    {
      id: '8.2', title: 'Peak and rms values', levels: ['L2', 'L3'], minutes: 18,
      objectives: ['Explain what an rms value means', 'Convert between peak and rms voltage and current', 'Calculate average power in an AC circuit'],
      sections: [
        { type: 'text', title: 'Which number describes AC?', html: r`<p>An AC voltage is always changing, so which value do we quote? The <b>average</b> is no good — it is zero, because the positive and negative halves cancel. Instead we use the <b>root mean square (rms)</b> value:</p>
<p><b>The rms value of an AC voltage is the steady DC voltage that would transfer energy to a resistor at the same average rate.</b></p>
<p>So a heater on 230 V rms AC gets just as hot as it would on 230 V DC. Every mains voltage you see quoted (230 V) is an rms value.</p>` },
        { type: 'formula', title: 'Rms for a sine wave', tex: r`V_{rms} = \frac{V_{peak}}{\sqrt{2}} \qquad I_{rms} = \frac{I_{peak}}{\sqrt{2}}`, html: r`<p>$\sqrt{2} \approx 1.414$, so the rms value is about 0.71 × the peak. Going the other way, $V_{peak} = \sqrt{2}\,V_{rms}$.</p>` },
        { type: 'diagram', svg: PEAK, caption: 'NZ mains: the voltage swings between +325 V and −325 V, 50 times a second. Its rms value is 230 V.' },
        { type: 'example', title: 'mains peak voltage', q: r`<p>NZ mains is 230 V rms. What is the peak voltage?</p>`, steps: [r`$V_{peak} = \sqrt{2} \times V_{rms}$.`, r`$V_{peak} = 1.414 \times 230 = 325$ V.`], answer: '<p>About 325 V — which is why mains insulation must handle well over 230 V.</p>' },
        { type: 'text', title: 'Power in AC circuits', html: r`<p>Use rms values in all the usual formulas and they give the <b>average</b> power:</p>
<p>$$P_{avg} = V_{rms}I_{rms} = I_{rms}^2R = \frac{V_{rms}^2}{R}$$</p>
<p>The <b>peak</b> power (at the instant the voltage is maximum) is twice the average: $P_{peak} = V_{peak}I_{peak} = 2V_{rms}I_{rms}$.</p>` },
        { type: 'example', title: 'a heater', q: r`<p>A 230 V rms heater has a resistance of 23 Ω. Find the rms current, the peak current and the average power.</p>`, steps: [r`$I_{rms} = \dfrac{V_{rms}}{R} = \dfrac{230}{23} = 10$ A.`, r`$I_{peak} = \sqrt{2} \times 10 = 14$ A.`, r`$P_{avg} = V_{rms}I_{rms} = 230 \times 10 = 2300$ W.`], answer: '<p>10 A rms, 14 A peak, 2.3 kW average.</p>' },
        { type: 'maths', title: 'square roots on the calculator', link: '0.3', html: r`<p>$\sqrt{2}$: press <code>√ 2 =</code> → 1.414… Dividing by $\sqrt{2}$ is the same as multiplying by 0.7071. Keep the full calculator value until the last step to avoid rounding errors.</p>` },
        { type: 'deeper', levels: ['L3', 'Uni'], title: 'where the √2 comes from', html: r`<p>Power in a resistor is $P = V^2/R$, so we need the average of $V^2$, not of $V$. For $V = V_{peak}\sin\omega t$, $V^2 = V_{peak}^2\sin^2\omega t$. Over a whole cycle the average of $\sin^2$ is exactly $\tfrac{1}{2}$ (the graph of $\sin^2$ is symmetrical about $\tfrac{1}{2}$). So the mean of $V^2$ is $\tfrac{1}{2}V_{peak}^2$, and its square root is $V_{peak}/\sqrt{2}$ — the “root of the mean of the square”. The $\sqrt{2}$ only applies to sine waves; other shapes have different factors.</p>` },
        { type: 'try', question: { type: 'num', q: 'An AC supply has a peak voltage of 17 V. What is its rms voltage?', answer: 12, unit: 'V', explain: '17 ÷ 1.414 = 12 V.' } },
        { type: 'misconception', wrong: 'The 230 V mains voltage is the maximum voltage.', right: '230 V is the rms value. The voltage actually peaks at about 325 V each half-cycle.' },
        { type: 'key', points: ['rms = the DC value giving the same heating effect.', r`$V_{rms} = V_{peak}/\sqrt{2}$; $V_{peak} = \sqrt{2}\,V_{rms}$.`, 'Mains: 230 V rms = 325 V peak.', 'Rms values in P = VI give the average power.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A sine-wave supply has a peak voltage of 10 V. What is its rms voltage?', answer: 7.07, unit: 'V', explain: '10 ÷ √2 = 7.07 V.' },
        { type: 'num', q: 'The rms current in a lamp is 0.50 A. What is the peak current?', answer: 0.707, unit: 'A', explain: '√2 × 0.50 = 0.707 A.' },
        { type: 'num', q: 'A 230 V rms supply drives 4.0 A rms through a toaster. What is the average power?', answer: 920, unit: 'W', explain: 'P = V_rms I_rms = 230 × 4.0 = 920 W.' },
        { type: 'mcq', q: 'Why is the average of a sine-wave AC voltage not used to describe it?', options: ['It is zero, because the positive and negative halves cancel', 'It is too large', 'It changes every second', 'It equals the peak'], answer: 0, explain: 'Over a full cycle the average is zero.' },
        { type: 'mcq', q: 'An AC supply of 12 V rms and a 12 V DC battery are each connected to identical resistors. Which resistor heats faster?', options: ['Both heat at the same rate', 'The one on AC', 'The one on DC', 'It depends on the frequency'], answer: 0, explain: 'That is the definition of rms.' },
      ],
    },
    // ------------------------------------------------------------------ 8.3
    {
      id: '8.3', title: 'Diodes and rectification', levels: ['L2', 'L3'], minutes: 16,
      objectives: ['Explain half-wave and full-wave rectification', 'Describe how a capacitor smooths the output', 'Identify rectifiers in everyday devices'],
      sections: [
        { type: 'text', title: 'Changing AC into DC', html: r`<p>Phones, laptops and most electronics need DC, but the wall supplies AC. Turning AC into DC is called <b>rectification</b>, and it uses <b>diodes</b>, which conduct in one direction only (Lesson 5.4).</p>` },
        { type: 'text', title: 'Half-wave rectification', html: r`<p>One diode in series with the load lets the positive half-cycles through and blocks the negative ones. The output is DC (one direction only), but it is switched off half the time and very bumpy. Half the available energy is thrown away.</p>` },
        { type: 'text', title: 'Full-wave rectification', html: r`<p>Four diodes arranged as a <b>bridge rectifier</b> route both halves of the cycle through the load in the <b>same direction</b>. The negative half-cycles are flipped over, giving a bump every half-cycle — 100 bumps per second from 50 Hz mains.</p>` },
        { type: 'diagram', svg: BRIDGE, caption: 'A bridge rectifier. Whichever way the AC is pushing, two of the diodes conduct and the current always goes through the load from + to −.' },
        { type: 'text', title: 'Smoothing', html: r`<p>A <b>capacitor</b> connected across the output stores charge. It charges up at each peak and, as the rectified voltage falls, it discharges through the load, filling in the dips. The result is nearly steady DC with a small <b>ripple</b>. A bigger capacitor (or a larger load resistance) gives less ripple, because it discharges more slowly. (Capacitors are studied in detail at Level 3.)</p>` },
        { type: 'sim', sim: 'ac-scope', caption: 'Compare AC → half-wave → full-wave → full-wave + smoothing.' },
        { type: 'text', title: 'Where you find them', html: r`<p>Every phone charger, laptop power brick and LED light bulb contains a rectifier. Modern chargers also use fast electronic switching to make them small and efficient, but the first step is still diodes turning AC into DC.</p>` },
        { type: 'misconception', wrong: 'A diode makes AC into smooth DC on its own.', right: 'A diode only stops current flowing backwards. The output is bumpy (varying) DC; a capacitor is needed to smooth it.' },
        { type: 'funfact', title: 'the glow of an LED', html: 'An LED is a diode whose junction gives out light when current flows forwards. LEDs on cheap AC decorations flicker 50 or 100 times a second — too fast to notice unless you wave them quickly and see a dotted trail.' },
        { type: 'key', points: ['Rectification: AC → DC using diodes.', 'Half-wave: one diode, positive halves only.', 'Full-wave: bridge of four diodes, both halves in the same direction.', 'A smoothing capacitor fills in the dips; bigger capacitor → less ripple.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'What does a single diode in series with an AC supply produce?', options: ['Half-wave rectified DC', 'Smooth DC', 'AC at double the frequency', 'Nothing — it blocks all current'], answer: 0, explain: 'It passes only one half of each cycle.' },
        { type: 'num', q: 'How many diodes are in a bridge rectifier?', answer: 4, explain: 'Four diodes in a bridge.' },
        { type: 'num', q: '50 Hz mains is full-wave rectified. How many “bumps” per second are in the output?', answer: 100, explain: 'Two per cycle: 2 × 50 = 100.' },
        { type: 'mcq', q: 'What is the job of the capacitor in a power supply?', options: ['To smooth the output by supplying charge between peaks', 'To block DC', 'To increase the voltage', 'To turn DC into AC'], answer: 0, explain: 'It charges at the peaks and discharges in the dips.' },
        { type: 'mcq', q: 'Which change reduces the ripple on a smoothed supply?', options: ['A larger capacitor', 'A smaller capacitor', 'Removing a diode', 'A lower frequency supply'], answer: 0, explain: 'A larger capacitor discharges more slowly.' },
      ],
    },
    // ------------------------------------------------------------------ 8.4
    {
      id: '8.4', title: 'Power transmission and line losses', levels: ['L2'], minutes: 18,
      objectives: ['Calculate the current in a transmission line from P = VI', 'Calculate power lost as heat with P = I²R', 'Explain why high voltages are used for transmission'],
      sections: [
        { type: 'text', title: 'The problem', html: r`<p>Power stations are often far from cities — hydro dams in the South Island, geothermal stations in the central North Island. The power travels through long lines of aluminium and steel cable, which have resistance. Some energy is always lost as heat in the lines:</p>
<p>$$P_{loss} = I^2R_{line}$$</p>
<p>The power being sent is $P = VI$. For a fixed power, <b>higher voltage means lower current</b>, and because the loss depends on $I^2$, a lower current cuts the loss dramatically.</p>` },
        { type: 'example', title: 'comparing two voltages', q: r`<p>A power station sends 100 MW along lines with a total resistance of 5.0 Ω. Find the power lost (a) at 110 kV and (b) at 220 kV.</p>`, steps: [r`(a) $I = \dfrac{P}{V} = \dfrac{100 \times 10^6}{110 \times 10^3} = 909$ A; $P_{loss} = 909^2 \times 5.0 = 4.13 \times 10^6$ W (4.1 MW, about 4%).`, r`(b) $I = \dfrac{100 \times 10^6}{220 \times 10^3} = 455$ A; $P_{loss} = 455^2 \times 5.0 = 1.03 \times 10^6$ W (1.0 MW, about 1%).`, r`Doubling the voltage halved the current and cut the loss to one quarter.`], answer: '<p>4.1 MW at 110 kV; 1.0 MW at 220 kV.</p>' },
        { type: 'sim', sim: 'grid-loss', caption: 'Try sending 100 MW at 11 kV. Then step the voltage up and watch the loss collapse.' },
        { type: 'text', title: 'Voltage drop along the line', html: r`<p>The line resistance also causes a <b>voltage drop</b> $V_{drop} = IR_{line}$, so the voltage at the far end is less than at the start. With a large current, the drop could be so big that appliances at the far end would not work properly. High-voltage, low-current transmission keeps the drop small.</p>` },
        { type: 'example', title: 'voltage drop', q: r`<p>For case (b) above (455 A in 5.0 Ω), what is the voltage drop along the line, as a percentage of 220 kV?</p>`, steps: [r`$V_{drop} = IR = 455 \times 5.0 = 2275$ V.`, r`Percentage: $\dfrac{2275}{220\,000} \times 100\% = 1.0\%$.`], answer: '<p>About 2.3 kV, or 1.0% of the supply voltage.</p>' },
        { type: 'text', title: 'Why not use even higher voltages?', html: r`<p>Higher voltages need taller towers, bigger insulators and wider clearances (air can break down and spark), and the transformers cost more. Engineers choose a voltage that balances these costs against the energy saved. Around the world, main lines run from about 110 kV to over 1 million volts.</p>` },
        { type: 'try', question: { type: 'num', q: 'A 2.0 A current flows through a line of resistance 8.0 Ω. What power is lost as heat?', answer: 32, unit: 'W', explain: 'P = I²R = 4.0 × 8.0 = 32 W.' } },
        { type: 'misconception', wrong: 'High voltage lines lose less energy because high voltage pushes the electricity through more easily.', right: 'For the same power, high voltage means low current, and the loss is I²R. It is the smaller current that reduces the heating.' },
        { type: 'exam', standard: 'NCEA Level 2, AS 91173', html: '<p>Excellence answers combine both formulas: P = VI shows the current falls in proportion to the voltage rise, and P = I²R shows the loss falls with the square of the current. A numerical example makes the argument complete.</p>' },
        { type: 'key', points: [r`Line loss $P_{loss} = I^2R$.`, 'For a fixed power P = VI: higher V → lower I.', 'Double V → half I → quarter of the loss.', r`Voltage drop along a line: $V = IR_{line}$.`] },
      ],
      checkpoint: [
        { type: 'num', q: 'A power line carries 200 A and has resistance 3.0 Ω. What power is lost?', answer: 120000, unit: 'W', explain: 'P = I²R = 40 000 × 3.0 = 120 000 W (120 kW).' },
        { type: 'num', q: 'A station sends 50 MW at 250 kV. What current flows in the line?', answer: 200, unit: 'A', explain: 'I = P/V = 50 × 10⁶ ÷ 250 × 10³ = 200 A.' },
        { type: 'mcq', q: 'The transmission voltage is increased by a factor of 10 (same power). The power lost in the lines…', options: ['falls to one-hundredth', 'falls to one-tenth', 'stays the same', 'rises ten times'], answer: 0, explain: 'I falls ×10, and loss ∝ I², so ÷100.' },
        { type: 'num', q: 'A line of resistance 4.0 Ω carries 500 A. What is the voltage drop along it?', answer: 2000, unit: 'V', explain: 'V = IR = 500 × 4.0 = 2000 V.' },
        { type: 'mcq', q: 'Why are transmission lines not run at millions of volts everywhere?', options: ['The towers, insulators and transformers would be very expensive, and air could spark over', 'Electrons cannot move at such voltages', 'It would increase the current', 'It would increase the I²R loss'], answer: 0, explain: 'Engineers balance insulation and equipment costs against energy savings.' },
      ],
    },
    // ------------------------------------------------------------------ 8.5
    {
      id: '8.5', title: 'New Zealand’s electricity system', levels: ['Y10', 'L1', 'L2'], minutes: 14,
      objectives: ['Describe where New Zealand’s electricity comes from', 'Trace electricity from power station to home', 'Explain the role of the HVDC link'],
      sections: [
        { type: 'text', title: 'Where it comes from', html: r`<p>New Zealand makes most of its electricity from renewable sources. In 2025, according to the Ministry of Business, Innovation and Employment (MBIE), about <b>88%</b> of electricity was renewable:</p>
<div class="tablewrap"><table><thead><tr><th>Source</th><th>Share of generation (2025, approx.)</th></tr></thead><tbody>
<tr><td>Hydro (lakes and rivers)</td><td>55%</td></tr><tr><td>Geothermal (steam from underground, mostly central North Island)</td><td>22%</td></tr><tr><td>Wind</td><td>9%</td></tr><tr><td>Solar</td><td>2%</td></tr><tr><td>Gas</td><td>8%</td></tr><tr><td>Coal</td><td>3.5%</td></tr>
</tbody></table></div>
<p>The hydro share goes up and down with rainfall and snow-melt: in dry years, gas and coal stations at Huntly and Taranaki make up the gap.</p>` },
        { type: 'diagram', svg: GRID, caption: 'Generators make AC at around 11–22 kV; transformers step it up for the grid and down again for homes.' },
        { type: 'text', title: 'From station to home', html: r`<ol><li><b>Generation:</b> spinning generators produce AC (Chapter 14).</li><li><b>Step-up transformers</b> raise the voltage (Chapter 15).</li><li><b>Transmission:</b> the national grid, run by Transpower, carries power across the country, mostly at 220 kV and 110 kV.</li><li><b>Step-down:</b> substations lower the voltage; local lines companies distribute it at 33 kV and 11 kV along streets.</li><li><b>Final step-down:</b> a transformer on a pole or in a green street cabinet supplies 230 V (400 V three-phase for workshops and some homes).</li></ol>` },
        { type: 'text', title: 'The HVDC link', html: r`<p>Much of the hydro power is generated in the South Island, but most people live in the North Island. The <b>HVDC Inter-Island link</b> carries power from Benmore in the South Island to Haywards near Wellington, crossing Cook Strait in undersea cables. It uses high-voltage <b>direct</b> current (about ±350 kV) because, over long undersea cables, DC loses less energy than AC and makes it easier to control how much power flows. Converter stations at each end change AC to DC and back.</p>` },
        { type: 'text', title: 'Balancing supply and demand', html: r`<p>Electricity cannot easily be stored in large amounts, so generation must match demand second by second. Demand peaks on cold winter evenings when heaters, ovens and lights are all on. The 50 Hz frequency is the signal: if demand exceeds supply, generators slow slightly and the frequency drops, so more generation is brought in.</p>` },
        { type: 'funfact', title: 'Reefton’s first lights', html: 'In 1888 the West Coast town of Reefton became the first place in the Southern Hemisphere with a public electricity supply, powered by a small hydro scheme on the Inangahua River.' },
        { type: 'key', points: ['About 88% renewable (2025): mainly hydro, then geothermal and wind.', 'Generate → step up → transmit (220 kV) → step down → 230 V homes.', 'HVDC link (±350 kV DC) carries South Island power north under Cook Strait.', 'Supply must match demand at every moment; frequency shows the balance.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'What is New Zealand’s largest source of electricity?', options: ['Hydro', 'Coal', 'Gas', 'Solar'], answer: 0, explain: 'Hydro supplied over half in 2025.' },
        { type: 'mcq', q: 'Why does the Inter-Island link use DC?', options: ['DC loses less energy in long undersea cables and gives easy control of the power flow', 'DC cannot give electric shocks', 'Transformers work better with DC', 'Homes in the North Island use DC'], answer: 0, explain: 'Long cables suit HVDC.' },
        { type: 'order', q: 'Put the stages in order from power station to home.', items: ['Generator produces AC', 'Step-up transformer', 'National grid transmission', 'Substation step-down', 'Street transformer to 230 V'], explain: 'Generate, step up, transmit, step down, final step down.' },
        { type: 'mcq', q: 'In a dry year with low lake levels, what usually happens?', options: ['More electricity comes from gas and coal stations', 'Electricity is imported from Australia', 'The grid switches to DC', 'The voltage is lowered to 110 V'], answer: 0, explain: 'Thermal stations make up for low hydro.' },
        { type: 'mcq', q: 'When does demand usually peak in New Zealand?', options: ['Cold winter evenings', 'Summer afternoons', 'Midnight', 'Early on Sunday mornings'], answer: 0, explain: 'Heating, cooking and lighting overlap.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'Calculate the frequency of an AC supply with a period of 0.025 s.', answer: 40, unit: 'Hz', explain: 'f = 1/T = 40 Hz.' },
      { type: 'num', q: 'Calculate the peak voltage of a 12 V rms supply.', answer: 17, unit: 'V', explain: '√2 × 12 = 17 V.' },
      { type: 'mcq', q: 'What is the difference between AC and DC?', options: ['AC reverses direction regularly; DC flows one way', 'AC is always higher voltage', 'DC only comes from power stations', 'AC cannot transfer energy'], answer: 0, explain: 'Definition.' },
      { type: 'num', q: 'A transmission line has resistance 6.0 Ω and carries 100 A. Calculate the power lost.', answer: 60000, unit: 'W', explain: 'P = I²R = 10 000 × 6.0 = 60 000 W.' },
      { type: 'mcq', q: 'What does a bridge rectifier do?', options: ['Changes AC into (bumpy) DC using four diodes', 'Changes DC into AC', 'Raises the voltage', 'Stores energy'], answer: 0, explain: 'Full-wave rectification.' },
    ],
    M: [
      { type: 'num', q: 'A 230 V rms kettle draws a peak current of 13 A. Calculate its average power.', answer: 2114, unit: 'W', explain: 'I_rms = 13/√2 = 9.19 A; P = 230 × 9.19 = 2114 W ≈ 2.1 kW.' },
      { type: 'num', q: 'A power station sends 40 MW at 200 kV through lines of total resistance 8.0 Ω. Calculate the power lost.', answer: 320000, unit: 'W', explain: 'I = 40 × 10⁶/200 × 10³ = 200 A; P = 200² × 8.0 = 320 000 W.' },
      { type: 'explain', q: 'Explain what is meant by saying the mains voltage is “230 V rms”.', model: '<p>The mains voltage is alternating: it varies continuously between about +325 V and −325 V. Its average over a cycle is zero, so the average does not describe it. 230 V rms means that this AC transfers energy to a resistor at the same average rate as a steady 230 V DC supply would — it has the same heating effect. For a sine wave the rms value equals the peak value divided by √2.</p>', points: [{ lvl: 'A', text: 'Mains voltage alternates; 230 V is not the peak' }, { lvl: 'M', text: 'Same heating effect / average power as 230 V DC' }, { lvl: 'M', text: 'Peak = √2 × rms ≈ 325 V' }] },
      { type: 'explain', q: 'Explain why a capacitor is added to the output of a rectifier.', model: '<p>The output of a rectifier is direct current, but it varies — it rises and falls to zero with each half-cycle. A capacitor across the output charges up when the voltage is near its peak. As the rectified voltage falls, the capacitor discharges through the load, supplying current and keeping the voltage up. This fills in the dips, so the output becomes nearly steady DC with only a small ripple.</p>', points: [{ lvl: 'A', text: 'To smooth the output' }, { lvl: 'M', text: 'Capacitor charges at the peaks' }, { lvl: 'M', text: 'Discharges through the load when the voltage falls, reducing ripple' }] },
    ],
    E: [
      { type: 'explain', q: 'A town needs 20 MW. It can be supplied along lines of resistance 10 Ω at either 22 kV or 220 kV. Discuss, with calculations, why the higher voltage is used and what is needed to make it safe to use in homes.', model: '<p>At 22 kV the current would be I = P/V = 20 × 10⁶ ÷ 22 × 10³ = 909 A, and the power lost would be I²R = 909² × 10 = 8.3 MW — over 40% of the power sent. At 220 kV the current is ten times smaller, 90.9 A, and the loss is 90.9² × 10 = 83 kW, only about 0.4%. Because the loss depends on the square of the current, increasing the voltage tenfold reduces the loss a hundredfold. The voltage drop along the line (IR) is also much smaller: 909 V versus 9090 V. High voltage is far too dangerous for homes, so the AC is stepped down by transformers at substations and finally to 230 V near the houses. AC is used for this because transformers only work with a changing current.</p>', points: [{ lvl: 'A', text: 'Higher voltage gives less energy loss' }, { lvl: 'M', text: 'Correct currents: 909 A and 90.9 A' }, { lvl: 'E', text: 'Correct losses (≈8.3 MW vs 83 kW) and the hundredfold reduction from I²' }, { lvl: 'E', text: 'Transformers step down to 230 V; needs AC' }] },
      { type: 'num', q: 'A 325 V peak AC supply is connected to a 50 Ω resistor. Calculate the average power transferred.', answer: 1056, unit: 'W', explain: 'V_rms = 325/√2 = 229.8 V; P = V_rms²/R = 229.8² ÷ 50 = 1056 W ≈ 1.06 kW.' },
      { type: 'explain', q: 'Compare the outputs of a half-wave and a full-wave rectifier connected to 50 Hz AC, and explain which is better for charging a phone.', model: '<p>A half-wave rectifier uses one diode and passes only the positive half-cycles. Its output is zero for half of every cycle and has 50 pulses per second, so only about half of the available energy reaches the load. A full-wave (bridge) rectifier uses four diodes so that both half-cycles drive current through the load in the same direction, giving 100 pulses per second with no gaps. The full-wave output delivers more power, and the gaps between pulses are shorter, so a smoothing capacitor can fill them in with much less ripple. Phones need a steady DC supply, so a full-wave rectifier with smoothing is better.</p>', points: [{ lvl: 'A', text: 'Half-wave uses only half of each cycle; full-wave uses both' }, { lvl: 'M', text: '50 vs 100 pulses per second; full-wave delivers more power' }, { lvl: 'E', text: 'Shorter gaps → easier smoothing → less ripple' }, { lvl: 'E', text: 'Concludes full-wave + smoothing for steady DC' }] },
    ],
  },
  glossary: [
    { term: 'Direct current (DC)', def: 'Current that flows in one direction only.' },
    { term: 'Alternating current (AC)', def: 'Current that reverses direction regularly.' },
    { term: 'Frequency (f)', def: 'Number of complete cycles per second, in hertz (Hz). f = 1/T.' },
    { term: 'Period (T)', def: 'Time for one complete cycle.' },
    { term: 'Peak value', def: 'The maximum voltage or current reached in a cycle.' },
    { term: 'Rms value', def: 'The steady DC value that gives the same heating effect; V_peak/√2 for a sine wave.' },
    { term: 'Rectification', def: 'Changing AC into DC using diodes.' },
    { term: 'Bridge rectifier', def: 'Four diodes arranged to give full-wave rectification.' },
    { term: 'Smoothing capacitor', def: 'A capacitor across a rectifier’s output that reduces ripple.' },
    { term: 'Ripple', def: 'The small variation left in a smoothed DC supply.' },
    { term: 'National grid', def: 'The network of high-voltage lines carrying power across the country.' },
    { term: 'HVDC', def: 'High-voltage direct current transmission, used for the Inter-Island link.' },
  ],
  formulas: [
    { name: 'Frequency', tex: r`f = \frac{1}{T}`, note: 'NZ mains: 50 Hz, T = 20 ms.', level: 'L2' },
    { name: 'Rms voltage', tex: r`V_{rms} = \frac{V_{peak}}{\sqrt{2}}`, note: 'Also I_rms = I_peak/√2. Mains: 230 V rms = 325 V peak.', level: 'L3' },
    { name: 'Average AC power', tex: r`P_{avg} = V_{rms}I_{rms}`, note: 'Peak power = 2 × average.', level: 'L3' },
    { name: 'Line loss', tex: r`P_{loss} = I^2R`, note: 'With I = P/V for the power being sent.', level: 'L2' },
  ],
  flashcards: [
    { front: 'AC vs DC', back: 'AC reverses direction; DC flows one way' }, { front: 'NZ mains supply', back: '230 V rms, 50 Hz' },
    { front: 'f and T', back: 'f = 1/T' }, { front: 'rms from peak', back: 'V_rms = V_peak / √2' },
    { front: 'Peak of 230 V mains', back: 'About 325 V' }, { front: 'Meaning of rms', back: 'DC value with the same heating effect' },
    { front: 'Why transmit at high voltage?', back: 'Lower current → much lower I²R loss' }, { front: 'Bridge rectifier', back: '4 diodes; full-wave rectification' },
    { front: 'Largest NZ electricity source', back: 'Hydro (about 55% in 2025)' },
  ],
};
