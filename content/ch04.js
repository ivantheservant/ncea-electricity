/**
 * Chapter 4 — Charge, Current & Voltage.
 */
import { svg, comp, wire, dot, flow, label } from '../js/utils/svg.js';

const r = String.raw;

const JUNCTION = svg(420, 170, [
  wire([30, 85], [200, 85]), wire([200, 85], [250, 35], [390, 35]), wire([200, 85], [250, 135], [390, 135]), dot(200, 85),
  flow(110, 85, 'right'), flow(320, 35, 'right'), flow(320, 135, 'right'),
  label(110, 70, '3.0 C every second', { cls: 'bold' }), label(110, 108, 'I = 3.0 A'),
  label(320, 22, '1.8 C/s → 1.8 A', { cls: 'bold' }), label(320, 158, '1.2 C/s → 1.2 A', { cls: 'bold' }),
].join(''), { title: 'Charge splitting at a junction: 3.0 A in, 1.8 A and 1.2 A out', maxw: 460 });

const CELLS = svg(480, 200, [
  comp('cell', 20, 50, 80, 50, { signs: true }), comp('cell', 80, 50, 140, 50, { signs: true }), comp('cell', 140, 50, 200, 50, { signs: true }),
  label(110, 95, 'Series, same way round:', { cls: 'bold' }), label(110, 115, '1.5 + 1.5 + 1.5 = 4.5 V'),
  wire([270, 40], [290, 40], [290, 20], [310, 20]), comp('cell', 310, 20, 390, 20, { signs: true }), wire([390, 20], [410, 20], [410, 40], [440, 40]),
  wire([290, 40], [290, 60], [310, 60]), comp('cell', 310, 60, 390, 60, { signs: true }), wire([390, 60], [410, 60], [410, 40]), wire([250, 40], [270, 40]), dot(290, 40), dot(410, 40),
  label(355, 95, 'Parallel (identical cells):', { cls: 'bold' }), label(355, 115, 'still 1.5 V, but lasts twice as long'),
  comp('cell', 20, 160, 90, 160, { signs: true }), comp('cell', 160, 160, 90, 160, { signs: true }), comp('cell', 160, 160, 230, 160, { signs: true }),
  label(330, 158, 'One cell reversed:', { cls: 'bold', anchor: 'middle' }), label(330, 178, '1.5 − 1.5 + 1.5 = 1.5 V', { anchor: 'middle' }),
].join(''), { title: 'Cells in series add their voltages; cells in parallel keep the same voltage', maxw: 520 });

const CHAIN = svg(460, 150, [
  comp('battery', 40, 120, 40, 30, { signs: true, label: '6.0 V', labelPos: 'left' }), wire([40, 30], [200, 30]), comp('bulb', 200, 30, 360, 30, { label: 'gets 6.0 J per coulomb', lit: 0.9 }), wire([360, 30], [420, 30], [420, 120], [40, 120]),
  flow(120, 30, 'right'), flow(420, 75, 'down'), flow(230, 120, 'left'),
  label(230, 105, 'coulombs return with no spare energy', { cls: 'small' }),
].join(''), { title: 'Each coulomb gains 6 J in the battery and transfers 6 J in the bulb', maxw: 500 });

export default {
  intro: 'Chapter 3 described circuits in words. Now we put numbers on them. Current is a flow of charge, and voltage is the energy each coulomb of charge carries. These two ideas, and the three formulas that link them, sit underneath every circuit calculation in NCEA.',
  standards: 'Year 10 science and NCEA Level 1 (simple circuits). The formulas I = q/t and V = ΔE/q are on the NCEA Level 2 formula sheet for AS 91173.',
  lessons: [
    // ------------------------------------------------------------------ 4.1
    {
      id: '4.1', title: 'From coulombs to amps: what current measures', levels: ['Y10', 'L1', 'L2'], minutes: 15,
      objectives: ['Recall the coulomb and the charge on an electron', 'Define current as the rate of flow of charge', 'Use the units A, mA and μA'],
      sections: [
        { type: 'text', title: 'Counting charge', html: r`<p>In Chapter 1 you met <b>charge</b>, measured in <b>coulombs (C)</b>. Every electron carries the same tiny negative charge, and every proton the same positive charge:</p>
<p>$$e = 1.6 \times 10^{-19}\ \text{C}$$</p>
<p>A coulomb is a <b>lot</b> of electrons. Turn the formula round: the number of electrons in one coulomb is $\dfrac{1}{1.6 \times 10^{-19}} = 6.25 \times 10^{18}$ — over six billion billion. For any charge $q$, the number of electrons is $n = \dfrac{q}{e}$.</p>` },
        { type: 'maths', title: 'dividing by 1.6 × 10⁻¹⁹', link: '0.2', html: r`<p>Type the power of ten with the <b>EXP</b> (or ×10ˣ) key, never as “× 10 ^”. To find how many electrons make 2.0 C: <code>2 ÷ 1.6 EXP −19 =</code> gives $1.25 \times 10^{19}$. If your calculator shows <code>1.25E19</code>, write it as $1.25 \times 10^{19}$ — never as 1.25E19 in an exam.</p>` },
        { type: 'text', title: 'Current is a rate', html: r`<p><b>Current</b> is the amount of charge that passes a point in the circuit <b>each second</b>. If 5 coulombs pass a point every second, the current is 5 amps. In symbols:</p>` },
        { type: 'formula', title: 'Current', tex: r`I = \frac{q}{t}`, symbols: [['I', 'current', 'ampere (A)'], ['q', 'charge that passes', 'coulomb (C)'], ['t', 'time taken', 'second (s)']], html: r`<p>So <b>one ampere is one coulomb per second</b>: 1 A = 1 C s⁻¹. NCEA writes charge as $q$; some books use $Q$. They mean the same thing.</p>` },
        { type: 'sim', sim: 'charge-flow', caption: 'Each glowing dot is one coulomb. Set the current, press Start, and count how many pass the red line in 10 s.' },
        { type: 'text', title: 'How big are everyday currents?', html: r`<div class="tablewrap"><table><thead><tr><th>Situation</th><th>Typical current</th></tr></thead><tbody>
<tr><td>Calculator or quartz watch</td><td>a few μA (microamps, $10^{-6}$ A)</td></tr>
<tr><td>Indicator LED</td><td>about 20 mA (milliamps, $10^{-3}$ A)</td></tr>
<tr><td>Torch bulb</td><td>about 0.3 A</td></tr>
<tr><td>Phone charging</td><td>1–3 A</td></tr>
<tr><td>Electric kettle on 230 V</td><td>about 10 A</td></tr>
<tr><td>Car starter motor</td><td>100–200 A for a second or two</td></tr>
<tr><td>Lightning stroke</td><td>about 30 000 A, for less than a thousandth of a second</td></tr>
</tbody></table></div>
<p>Converting: $1\ \text{mA} = 0.001\ \text{A}$ and $1\ \mu\text{A} = 0.000\,001\ \text{A}$. Always change to amps before you use a formula.</p>` },
        { type: 'misconception', wrong: 'Current is how fast the electrons are moving.', right: 'Current is how much charge passes a point each second. Electrons drift very slowly (Chapter 2) — a large current means a large amount of charge moving, not fast-moving charge.' },
        { type: 'misconception', wrong: 'A bigger battery pushes out more electrons, so it “contains” more current.', right: 'A battery does not store current or electrons. The electrons were already in the wires; the battery gives them energy to keep moving round. How much current flows depends on the voltage and the resistance of the circuit.' },
        { type: 'funfact', title: 'why the amp is special', html: 'The ampere is named after André-Marie Ampère, who showed in 1820 that two wires carrying current push or pull on each other. Since 2019 the amp has been defined by fixing the value of the electron’s charge exactly, so 1 A means exactly 1/(1.602176634 × 10⁻¹⁹) electrons passing per second.' },
        { type: 'key', points: [r`$e = 1.6 \times 10^{-19}$ C; 1 C ≈ $6.25 \times 10^{18}$ electrons; $n = q/e$.`, r`Current = rate of flow of charge: $I = q/t$.`, '1 A = 1 coulomb per second.', 'Convert mA and μA to A, and minutes to seconds, before calculating.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'One ampere is…', options: ['one coulomb of charge passing a point each second', 'one electron passing a point each second', 'one joule of energy per coulomb', 'one volt per ohm per second'], answer: 0, explain: 'I = q/t, so 1 A = 1 C ÷ 1 s.' },
        { type: 'num', q: 'How many electrons make up a charge of 4.0 C? (e = 1.6 × 10⁻¹⁹ C)', answer: 2.5e19, explain: 'n = q/e = 4.0 ÷ 1.6 × 10⁻¹⁹ = 2.5 × 10¹⁹ electrons.' },
        { type: 'num', q: 'Write 250 mA in amps.', answer: 0.25, unit: 'A', explain: '250 × 10⁻³ = 0.25 A.' },
        { type: 'mcq', q: 'Which current is the largest?', options: ['0.5 A', '45 mA', '900 μA', '0.05 A'], answer: 0, explain: '45 mA = 0.045 A; 900 μA = 0.0009 A; so 0.5 A is the largest.' },
        { type: 'tf', q: 'A large current means the electrons are moving very fast.', answer: false, explain: 'Current measures charge per second. Drift speeds are tiny, around a tenth of a millimetre per second.' },
      ],
    },
    // ------------------------------------------------------------------ 4.2
    {
      id: '4.2', title: 'Calculating with I = q/t', levels: ['L1', 'L2'], minutes: 18,
      objectives: ['Rearrange I = q/t to find charge or time', 'Convert times to seconds', 'Find the number of electrons passing per second'],
      sections: [
        { type: 'text', title: 'Three versions of one formula', html: r`<p>The formula has three quantities, so you can be asked to find any one of them:</p>
<p>$$I = \frac{q}{t} \qquad q = It \qquad t = \frac{q}{I}$$</p>
<p>Get the second and third by rearranging (Lesson 0.3): multiply both sides by $t$ to get $q = It$; then divide both sides by $I$ to get $t = q/I$. Learning to rearrange is better than memorising a triangle, because the same skill works for every formula you will meet, including ones with squares and fractions.</p>` },
        { type: 'maths', title: 'time in seconds', link: '0.1', html: r`<p>The coulomb–amp–second units only work together if time is in <b>seconds</b>.</p><ul><li>minutes → seconds: × 60 (e.g. 2.5 min = 150 s)</li><li>hours → seconds: × 3600 (e.g. 1.5 h = 5400 s)</li><li>milliseconds → seconds: × 10⁻³ (e.g. 40 ms = 0.040 s)</li></ul>` },
        { type: 'example', title: 'finding charge', q: r`<p>A torch bulb carries a current of 0.30 A. How much charge passes through it in 2.0 minutes?</p>`, steps: [r`Time in seconds: $t = 2.0 \times 60 = 120$ s.`, r`Formula: $q = It$.`, r`Substitute: $q = 0.30 \times 120$.`, r`$q = 36$ C.`], answer: '<p>36 C of charge passes through the bulb.</p>' },
        { type: 'example', title: 'finding current', q: r`<p>A charge of 540 C flows through a heater in 45 s. What is the current?</p>`, steps: [r`Formula: $I = \dfrac{q}{t}$.`, r`Substitute: $I = \dfrac{540}{45}$.`, r`$I = 12$ A.`], answer: '<p>12 A.</p>' },
        { type: 'example', title: 'finding time', q: r`<p>A phone charges with a current of 2.0 A. How long does it take for 9000 C to flow into the battery? Give your answer in minutes.</p>`, steps: [r`Formula: $t = \dfrac{q}{I}$.`, r`Substitute: $t = \dfrac{9000}{2.0} = 4500$ s.`, r`Convert to minutes: $4500 \div 60 = 75$ minutes.`], answer: '<p>4500 s, which is 75 minutes (1 h 15 min).</p>' },
        { type: 'text', title: 'Electrons per second', html: r`<p>A current of 1 A means 1 coulomb per second, which is $6.25 \times 10^{18}$ electrons per second. For any current:</p>
<p>$$\text{electrons per second} = \frac{I}{e}$$</p>
<p>This is a two-step idea: the current tells you the charge each second, and dividing by $e$ turns charge into a number of electrons.</p>` },
        { type: 'example', title: 'two steps', q: r`<p>A current of 0.50 A flows through a lamp for 10 s. How many electrons pass through the lamp?</p>`, steps: [r`Charge first: $q = It = 0.50 \times 10 = 5.0$ C.`, r`Electrons: $n = \dfrac{q}{e} = \dfrac{5.0}{1.6 \times 10^{-19}}$.`, r`$n = 3.1 \times 10^{19}$ electrons (3.125 rounded to 2 s.f.).`], answer: r`<p>$3.1 \times 10^{19}$ electrons.</p>` },
        { type: 'try', question: { type: 'num', q: 'A current of 3.0 A flows for 5.0 s. How much charge flows?', answer: 15, unit: 'C', explain: 'q = It = 3.0 × 5.0 = 15 C.' } },
        { type: 'tip', html: 'Set every calculation out the same way: formula → substitute (with units converted) → answer with unit. Examiners can then give marks for correct working even if you slip on the calculator.' },
        { type: 'exam', standard: 'NCEA Level 2, AS 91173', html: '<p>Achieved questions often ask for a single calculation like q = It. Merit questions combine two steps, for example finding the charge and then the number of electrons, or the charge and then the energy (Lesson 4.5). Show both steps clearly.</p>' },
        { type: 'key', points: [r`$I = q/t$, $q = It$, $t = q/I$ — rearrange, don’t memorise triangles.`, 'Time must be in seconds.', r`Electrons per second $= I/e$; total electrons $= q/e$.`] },
      ],
      checkpoint: [
        { type: 'num', q: 'A current of 0.20 A flows for 3.0 minutes. How much charge flows?', answer: 36, unit: 'C', explain: 't = 180 s; q = It = 0.20 × 180 = 36 C.' },
        { type: 'num', q: 'A charge of 72 C passes through a motor in 1.2 minutes. Find the current.', answer: 1, unit: 'A', explain: 't = 72 s; I = q/t = 72 ÷ 72 = 1.0 A.' },
        { type: 'num', q: 'How long does it take for 600 C to pass through a 4.0 A heater?', answer: 150, unit: 's', explain: 't = q/I = 600 ÷ 4.0 = 150 s.' },
        { type: 'num', q: 'A current of 20 mA flows through an LED for 50 s. How much charge passes?', answer: 1, unit: 'C', explain: '20 mA = 0.020 A; q = 0.020 × 50 = 1.0 C.' },
        { type: 'num', q: 'How many electrons pass a point each second when the current is 2.0 A?', answer: 1.25e19, explain: 'Electrons per second = I/e = 2.0 ÷ 1.6 × 10⁻¹⁹ = 1.25 × 10¹⁹.' },
        { type: 'order', q: 'Put the steps for “find the charge that flows in 5 minutes at 0.4 A” in order.', items: ['Convert 5 minutes to 300 s', 'Write q = It', 'Substitute q = 0.4 × 300', 'Write the answer with its unit: 120 C'], explain: 'Convert units first, then formula, substitute, answer with unit.' },
      ],
    },
    // ------------------------------------------------------------------ 4.3
    {
      id: '4.3', title: 'Charge is conserved: current in series and parallel', levels: ['L1', 'L2'], minutes: 15,
      objectives: ['Explain the series and junction rules using conservation of charge', 'Calculate currents at junctions', 'Explain why a thin section of wire gets hot'],
      sections: [
        { type: 'text', title: 'Charge cannot vanish or pile up', html: r`<p>Charge is <b>conserved</b>: it is never created or destroyed, only moved. In a circuit, charge also cannot pile up at one place, because the build-up would repel any more charge arriving. Together these give the two current rules from Chapter 3, now with a reason behind them:</p>
<ul><li><b>Series:</b> every coulomb that goes into a component must come out the other side, so the current (coulombs per second) is the <b>same everywhere</b> in a single loop.</li>
<li><b>Junctions:</b> the coulombs arriving at a junction each second must equal the coulombs leaving each second, so $I_{in} = I_{out}$.</li></ul>` },
        { type: 'diagram', svg: JUNCTION, caption: 'Each second, 3.0 C arrive at the junction and 3.0 C leave it (1.8 C + 1.2 C).' },
        { type: 'example', title: 'a junction with three branches', q: r`<p>A current of 2.5 A enters a junction. Two of the wires leaving it carry 0.80 A and 1.1 A. What is the current in the third wire, and how much charge passes through it in one minute?</p>`, steps: [r`Junction rule: $2.5 = 0.80 + 1.1 + I_3$.`, r`$I_3 = 2.5 - 1.9 = 0.60$ A.`, r`Charge in one minute: $q = It = 0.60 \times 60 = 36$ C.`], answer: '<p>0.60 A, and 36 C passes in one minute.</p>' },
        { type: 'text', title: 'Thin wire, same current, faster drift', html: r`<p>Suppose a wire narrows to half its width. The same number of coulombs must pass through the narrow part every second, but there are fewer free electrons in each centimetre of thin wire. So the electrons there must <b>drift faster</b>. Faster electrons collide with the metal ions harder and more often, transferring more energy — the narrow part gets hotter. This is exactly how a <b>fuse</b> works: a deliberately thin wire that melts first if the current gets too large.</p>` },
        { type: 'sim', sim: 'electron-drift', caption: 'Recap from Chapter 2: switch the battery on and watch the slow drift on top of the fast random motion.' },
        { type: 'deeper', levels: ['L3', 'Uni'], title: 'the drift formula I = nAvq', html: r`<p>Count the charge flowing through a wire of cross-sectional area $A$, with $n$ free electrons per cubic metre, each of charge $q$, drifting at speed $v$. In one second the electrons that pass a point are those within a length $v$ of it: a volume $Av$, containing $nAv$ electrons. So</p><p>$$I = nAvq$$</p><p>For copper, $n \approx 8.5 \times 10^{28}\ \text{m}^{-3}$. With 1.0 A in a 1.0 mm² ($1.0 \times 10^{-6}$ m²) wire: $v = \dfrac{I}{nAq} = \dfrac{1.0}{8.5 \times 10^{28} \times 1.0 \times 10^{-6} \times 1.6 \times 10^{-19}} \approx 7 \times 10^{-5}$ m/s — about 0.07 mm per second. The formula also shows why the drift speed is larger in a thinner wire (smaller $A$) carrying the same current.</p>` },
        { type: 'funfact', title: 'a very slow journey', html: 'At 0.07 mm per second, an electron would take around 4 hours to travel one metre of wire. The lamp still lights instantly because the wire is already full of free electrons and they all start drifting at once when the switch closes.' },
        { type: 'misconception', wrong: 'Electrons leave the battery, travel to the bulb, and that is why it lights up.', right: 'The electrons in the bulb filament start moving as soon as the circuit is complete. The energy reaches the bulb almost instantly through the electric field; the individual electrons barely move.' },
        { type: 'key', points: ['Charge is conserved and does not pile up.', 'Series: same current everywhere. Junction: total in = total out.', 'Same current through a thinner wire → faster drift → more heating.', r`Going deeper: $I = nAvq$.`] },
      ],
      checkpoint: [
        { type: 'num', q: 'A current of 1.5 A enters a junction and splits into two wires. One carries 0.40 A. What does the other carry?', answer: 1.1, unit: 'A', explain: '1.5 − 0.40 = 1.1 A.' },
        { type: 'mcq', q: 'Why is the current the same at every point in a series circuit?', options: ['Charge is conserved and cannot build up anywhere, so the same charge passes every point each second', 'The battery pushes the same voltage everywhere', 'Each component uses up the same amount of current', 'Resistance is the same everywhere'], answer: 0, explain: 'Conservation of charge: what goes in must come out, every second.' },
        { type: 'mcq', q: 'A copper wire narrows to a thinner section. In the thin section the current is…', options: ['the same, but electrons drift faster', 'smaller, because less charge fits through', 'larger, because electrons are squeezed', 'zero'], answer: 0, explain: 'The current is the same (series); fewer electrons per length means each must drift faster.' },
        { type: 'num', q: 'Three wires meet at a junction. 0.6 A and 0.9 A flow in through two of them. How much charge flows out through the third wire in 20 s?', answer: 30, unit: 'C', explain: 'I out = 0.6 + 0.9 = 1.5 A; q = It = 1.5 × 20 = 30 C.' },
        { type: 'tf', q: 'When you switch on a light, it lights up only when electrons from the switch reach the bulb.', answer: false, explain: 'All the free electrons start drifting at once; the bulb lights almost instantly.' },
      ],
    },
    // ------------------------------------------------------------------ 4.4
    {
      id: '4.4', title: 'Voltage: energy per coulomb', levels: ['Y10', 'L1', 'L2'], minutes: 18,
      objectives: ['Define voltage as energy transferred per unit charge', 'Distinguish the voltage of a source from the voltage across a component', 'Use V = ΔE/q'],
      sections: [
        { type: 'text', title: 'Charge carries energy', html: r`<p>A battery does not supply charge — the charge is already in the wires. What the battery supplies is <b>energy</b>. Each coulomb that passes through the battery is given some energy, and it transfers that energy to the components as it flows round: light and heat in a bulb, heat in a heater, kinetic energy in a motor.</p>
<p><b>Voltage</b> tells you how much energy each coulomb gains or transfers:</p>` },
        { type: 'formula', title: 'Voltage', tex: r`V = \frac{\Delta E}{q}`, symbols: [['V', 'voltage (potential difference)', 'volt (V)'], [r`\Delta E`, 'energy transferred', 'joule (J)'], ['q', 'charge', 'coulomb (C)']], html: r`<p><b>One volt is one joule per coulomb</b>: 1 V = 1 J C⁻¹. A 9 V battery gives every coulomb 9 J of energy. A bulb with 2.5 V across it transfers 2.5 J from every coulomb that passes through it. The Δ (delta) means “change in”, so $\Delta E$ is the energy that changes form.</p>` },
        { type: 'diagram', svg: CHAIN, caption: 'One bulb: all the energy each coulomb gained in the battery is transferred in the bulb.' },
        { type: 'text', title: 'Two kinds of voltage', html: r`<ul><li>The voltage of a <b>source</b> (battery, power supply, generator) is the energy it <b>gives</b> each coulomb. At Level 3 this is called the <b>EMF</b> (electromotive force, symbol ε) — a confusing name, because it is not a force.</li>
<li>The voltage <b>across a component</b> is the energy each coulomb <b>transfers</b> in that component. Its proper name is <b>potential difference</b> (p.d.).</li></ul>
<p>Both are measured in volts with a voltmeter connected across the two points. In NCEA questions “voltage” is used for both.</p>` },
        { type: 'sim', sim: 'energy-lift', caption: 'Each coulomb climbs an “energy hill” in the battery, then goes down in steps through R₁ and R₂. Change the resistors and see how the drops share out.' },
        { type: 'text', title: 'Why series voltages add up and parallel voltages are equal', html: r`<p><b>Series:</b> a coulomb passes through every component in turn. By the time it returns to the battery it has transferred <b>all</b> its energy, so the drops must add up to the supply voltage: $V = V_1 + V_2$. This is conservation of energy.</p>
<p><b>Parallel:</b> each coulomb passes through <b>only one</b> branch, and it still transfers all its energy before getting back. So every branch has the <b>same</b> voltage as the supply.</p>` },
        { type: 'text', title: 'A gravity picture', html: r`<p>Think of the battery as a lift that raises balls to the top of a slide. Each ball (coulomb) gets the same height (energy per coulomb). Going down, the balls lose height through the bulbs. On a single slide with two bumps (series), the two drops add up to the full height. On two separate slides (parallel), each slide drops the full height. The number of balls per second is the current; the height is the voltage.</p>` },
        { type: 'example', title: 'energy from voltage', q: r`<p>A 9.0 V battery drives 4.0 C of charge round a circuit. How much energy does the battery supply?</p>`, steps: [r`Rearrange $V = \dfrac{\Delta E}{q}$: $\Delta E = Vq$.`, r`Substitute: $\Delta E = 9.0 \times 4.0$.`, r`$\Delta E = 36$ J.`], answer: '<p>36 J.</p>' },
        { type: 'example', title: 'voltage from energy', q: r`<p>When 6.0 C of charge flows through a lamp, the lamp transfers 54 J of energy. What is the voltage across the lamp?</p>`, steps: [r`$V = \dfrac{\Delta E}{q} = \dfrac{54}{6.0}$.`, r`$V = 9.0$ V.`], answer: '<p>9.0 V.</p>' },
        { type: 'misconception', wrong: 'Voltage flows through the circuit, like current.', right: 'Current flows through components; voltage is across them. It is a difference in energy per coulomb between two points, which is why a voltmeter needs two leads, one on each side.' },
        { type: 'misconception', wrong: 'The battery runs out because it runs out of electrons.', right: 'The battery runs out of stored chemical energy. The number of electrons in the circuit stays the same the whole time.' },
        { type: 'funfact', title: 'big voltage, tiny energy', html: 'A static shock from a door handle can be 10 000 V or more — but the charge is tiny (about a millionth of a coulomb), so the energy is only around 0.01 J. Voltage is energy per coulomb; it does not tell you how much energy there is in total.' },
        { type: 'key', points: [r`Voltage = energy per coulomb: $V = \Delta E / q$; 1 V = 1 J/C.`, 'Source voltage (EMF): energy given to each coulomb. Potential difference: energy transferred per coulomb in a component.', 'Series: voltages add up (energy conservation). Parallel: same voltage on each branch.', 'Current flows through; voltage is across.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'A battery is labelled 1.5 V. This means it…', options: ['gives each coulomb of charge 1.5 J of energy', 'pushes 1.5 C of charge every second', 'stores 1.5 J of energy', 'makes a current of 1.5 A'], answer: 0, explain: '1 V = 1 J per coulomb.' },
        { type: 'num', q: 'A 12 V battery moves 25 C of charge. How much energy does it supply?', answer: 300, unit: 'J', explain: 'ΔE = Vq = 12 × 25 = 300 J.' },
        { type: 'num', q: 'A motor transfers 360 J when 60 C passes through it. What is the voltage across the motor?', answer: 6, unit: 'V', explain: 'V = ΔE/q = 360 ÷ 60 = 6.0 V.' },
        { type: 'mcq', q: 'In a series circuit, why do the voltages across the components add up to the supply voltage?', options: ['Each coulomb transfers all the energy it gained in the battery as it passes through the components in turn', 'The current is shared between the components', 'Voltage is used up at the first component', 'The components have the same resistance'], answer: 0, explain: 'Conservation of energy: energy gained per coulomb = total energy transferred per coulomb.' },
        { type: 'mcq', q: 'Which statement uses the word “voltage” correctly?', options: ['The voltage across the bulb is 3 V', 'The voltage through the bulb is 3 V', 'The voltage flows from the battery', '3 V of voltage was used up'], answer: 0, explain: 'Voltage is across a component (between two points).' },
      ],
    },
    // ------------------------------------------------------------------ 4.5
    {
      id: '4.5', title: 'Energy in circuits: ΔE = Vq = VIt', levels: ['L1', 'L2'], minutes: 18,
      objectives: ['Combine q = It with ΔE = Vq', 'Solve two-step energy problems', 'Give answers with sensible significant figures and units'],
      sections: [
        { type: 'text', title: 'Joining two formulas', html: r`<p>You now have two formulas that share the charge $q$:</p>
<p>$$q = It \qquad \text{and} \qquad \Delta E = Vq$$</p>
<p>Replace $q$ in the second formula with $It$ from the first:</p>
<p>$$\Delta E = VIt$$</p>
<p>This gives the energy transferred directly from the voltage, current and time, without finding the charge first. Either route gives the same answer — use whichever the question suits.</p>` },
        { type: 'maths', title: 'substitution', link: '0.3', html: r`<p>Substitution means swapping a symbol for something equal to it. Because $q$ and $It$ are equal, anywhere you see $q$ you may write $It$ instead. You will use this idea again for power ($P = VI$, $P = I^2R$) in Chapter 7.</p>` },
        { type: 'text', title: 'A method for every multi-step problem', html: r`<ol><li>List what you know, with units, and what you need to find.</li><li>Convert to base units: A, V, s, C, J.</li><li>Choose a formula that links what you know to what you need. If none does in one go, find an in-between quantity (often the charge).</li><li>Rearrange, substitute, and calculate.</li><li>Give the answer with a unit and 2–3 significant figures.</li></ol>` },
        { type: 'example', title: 'phone charger', q: r`<p>A phone charger supplies 5.0 V and 2.0 A for 30 minutes. How much charge flows, and how much energy is transferred to the phone?</p>`, steps: [r`Known: $V = 5.0$ V, $I = 2.0$ A, $t = 30 \times 60 = 1800$ s.`, r`Charge: $q = It = 2.0 \times 1800 = 3600$ C.`, r`Energy: $\Delta E = Vq = 5.0 \times 3600 = 18\,000$ J.`, r`Check with one formula: $\Delta E = VIt = 5.0 \times 2.0 \times 1800 = 18\,000$ J ✓.`], answer: '<p>3600 C and 18 000 J (18 kJ).</p>' },
        { type: 'example', title: 'kettle', q: r`<p>A kettle on the 230 V mains takes a current of 9.6 A. How much energy does it transfer in 3.0 minutes?</p>`, steps: [r`$t = 3.0 \times 60 = 180$ s.`, r`$\Delta E = VIt = 230 \times 9.6 \times 180$.`, r`$\Delta E = 397\,440$ J.`, r`To 2 s.f.: $4.0 \times 10^{5}$ J (400 kJ).`], answer: r`<p>$4.0 \times 10^{5}$ J.</p>` },
        { type: 'example', title: 'working backwards', q: r`<p>A 3.0 V torch bulb transfers 270 J of energy in 2.0 minutes. What current flows through it?</p>`, steps: [r`Charge from energy: $q = \dfrac{\Delta E}{V} = \dfrac{270}{3.0} = 90$ C.`, r`Time: $t = 120$ s.`, r`Current: $I = \dfrac{q}{t} = \dfrac{90}{120} = 0.75$ A.`], answer: '<p>0.75 A.</p>' },
        { type: 'try', question: { type: 'num', q: 'A 6.0 V motor draws 0.50 A for 40 s. How much energy does it transfer?', answer: 120, unit: 'J', explain: 'ΔE = VIt = 6.0 × 0.50 × 40 = 120 J.' } },
        { type: 'misconception', wrong: 'If the current doubles, the energy per coulomb doubles.', right: 'The energy per coulomb is the voltage. Doubling the current (with the same voltage) doubles the number of coulombs per second, so the energy per second doubles, but each coulomb still carries the same energy.' },
        { type: 'funfact', title: 'what is in an AA battery?', html: 'A typical alkaline AA cell can push around 2.5 A h of charge (about 9000 C) at 1.5 V. That is roughly ΔE = Vq = 1.5 × 9000 ≈ 13 000 J — enough to lift a 70 kg person about 20 m.' },
        { type: 'key', points: [r`$\Delta E = Vq$ and $q = It$ give $\Delta E = VIt$.`, 'Multi-step problems: find the in-between quantity (usually the charge).', 'Convert minutes to seconds; finish with a unit and 2–3 s.f.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 12 V car headlight takes 4.0 A for 10 minutes. How much energy does it transfer?', answer: 28800, unit: 'J', explain: 't = 600 s; ΔE = VIt = 12 × 4.0 × 600 = 28 800 J (2.9 × 10⁴ J).' },
        { type: 'num', q: 'A 9.0 V battery supplies 0.10 A for 5.0 minutes. How much charge flows?', answer: 30, unit: 'C', explain: 'q = It = 0.10 × 300 = 30 C.' },
        { type: 'num', q: 'For the battery in the last question, how much energy does it supply?', answer: 270, unit: 'J', explain: 'ΔE = Vq = 9.0 × 30 = 270 J.' },
        { type: 'num', q: 'A heater transfers 46 000 J in 20 s on the 230 V supply. What current does it draw?', answer: 10, unit: 'A', explain: 'q = ΔE/V = 46 000 ÷ 230 = 200 C; I = q/t = 200 ÷ 20 = 10 A.' },
        { type: 'mcq', q: 'Which expression gives the energy transferred by a component?', options: ['VIt', 'V/It', 'It/V', 'VI/t'], answer: 0, explain: 'ΔE = Vq and q = It, so ΔE = VIt.' },
      ],
    },
    // ------------------------------------------------------------------ 4.6
    {
      id: '4.6', title: 'Cells, batteries and capacity', levels: ['Y10', 'L1', 'L2'], minutes: 15,
      objectives: ['Work out the voltage of cells joined in series and parallel', 'Convert battery capacity in mA h to coulombs', 'Estimate how long a battery will last'],
      sections: [
        { type: 'text', title: 'Cells and batteries', html: r`<p>A <b>cell</b> transforms stored chemical energy into electrical energy. A <b>battery</b> is, strictly, two or more cells joined together (though everyone calls a single AA cell a battery). Common voltages:</p>
<ul><li>Alkaline cell (AA, AAA, C, D): 1.5 V — the size changes how long it lasts, not the voltage.</li><li>Rechargeable NiMH cell: 1.2 V.</li><li>Lithium-ion cell (phones, laptops, e-scooters): about 3.7 V.</li><li>Car battery: 12 V, made of six 2 V lead–acid cells in series.</li></ul>` },
        { type: 'diagram', svg: CELLS, caption: 'Series cells add up (watch the direction). Identical cells in parallel keep the same voltage.' },
        { type: 'text', title: 'Joining cells', html: r`<p><b>In series</b> (+ of one to − of the next), each coulomb passes through every cell and gains energy from each, so the voltages <b>add</b>. Three 1.5 V cells give 4.5 V. If one cell is put in backwards, it takes energy away instead and its voltage <b>subtracts</b>.</p>
<p><b>In parallel</b> (all + terminals joined, all − terminals joined), each coulomb passes through only one cell, so identical cells give the <b>same voltage</b> as one cell. The benefit is that the charge is shared between the cells, so they last longer and can supply a larger current together. Never connect cells of different voltages in parallel — current flows from one into the other and wastes energy.</p>` },
        { type: 'text', title: 'Capacity: how much charge a battery can push', html: r`<p>Batteries are labelled with a <b>capacity</b> in milliamp-hours (mA h) or amp-hours (A h). Because charge = current × time, an amp-hour <b>is a unit of charge</b>:</p>
<p>$$1\ \text{A h} = 1\ \text{A} \times 3600\ \text{s} = 3600\ \text{C} \qquad 1\ \text{mA h} = 3.6\ \text{C}$$</p>
<p>A 3000 mA h phone battery can deliver $3.0\ \text{A} \times 1\ \text{h}$ or $0.30\ \text{A} \times 10\ \text{h}$, and so on — in theory, the same total charge either way.</p>` },
        { type: 'example', title: 'battery life', q: r`<p>A phone has a 3.7 V, 4000 mA h battery. (a) How much charge can it deliver? (b) How long will it last if the phone draws an average of 0.25 A? (c) How much energy does it store?</p>`, steps: [r`(a) $q = 4000 \times 3.6 = 14\,400$ C (or $4.0\ \text{A} \times 3600\ \text{s}$).`, r`(b) $t = \dfrac{q}{I} = \dfrac{14\,400}{0.25} = 57\,600$ s $= 16$ hours.`, r`(c) $\Delta E = Vq = 3.7 \times 14\,400 = 53\,280$ J $\approx 5.3 \times 10^{4}$ J.`], answer: r`<p>14 400 C; 16 h; about $5.3 \times 10^{4}$ J (53 kJ).</p>` },
        { type: 'try', question: { type: 'num', q: 'A battery is rated 2.0 A h. How many coulombs is that?', answer: 7200, unit: 'C', explain: '2.0 A × 3600 s = 7200 C.' } },
        { type: 'text', title: 'Real batteries', html: r`<p>Real batteries are not perfect. Their voltage drops a little when they deliver a large current, because some energy is wasted inside the battery itself (its <b>internal resistance</b>, Chapter 10), and it falls further as the battery runs down. Capacity also shrinks in the cold and as rechargeable batteries age. Used batteries contain metals worth recovering and chemicals that should not go to landfill — recycle them, and never puncture or crush lithium-ion batteries, which can catch fire.</p>` },
        { type: 'misconception', wrong: 'A D cell is bigger than an AA cell, so it has a bigger voltage.', right: 'Both are 1.5 V, because the voltage depends on the chemicals. The D cell holds more of those chemicals, so it has a larger capacity and lasts longer.' },
        { type: 'funfact', title: 'Volta’s pile', html: 'In 1800 Alessandro Volta stacked discs of zinc and copper separated by cardboard soaked in salt water — the first battery, called a “voltaic pile”. The volt is named after him.' },
        { type: 'key', points: ['Series cells: voltages add (a reversed cell subtracts).', 'Identical parallel cells: same voltage, longer life.', '1 A h = 3600 C; 1 mA h = 3.6 C.', r`Battery life $t = q/I$; stored energy $\Delta E = Vq$.`] },
      ],
      checkpoint: [
        { type: 'num', q: 'Four 1.5 V cells are connected in series, all the same way round. What is the total voltage?', answer: 6, unit: 'V', explain: '4 × 1.5 = 6.0 V.' },
        { type: 'num', q: 'Three 1.5 V cells are connected in series, but one is the wrong way round. What is the total voltage?', answer: 1.5, unit: 'V', explain: '1.5 + 1.5 − 1.5 = 1.5 V.' },
        { type: 'mcq', q: 'Two identical 1.5 V cells are connected in parallel. Compared with one cell, the pair gives…', options: ['the same voltage and lasts about twice as long', 'double the voltage', 'half the voltage', 'the same voltage but runs down twice as fast'], answer: 0, explain: 'Parallel identical cells keep the voltage and share the charge.' },
        { type: 'num', q: 'How many coulombs can a 500 mA h battery deliver?', answer: 1800, unit: 'C', explain: '500 × 3.6 = 1800 C.' },
        { type: 'num', q: 'A 2400 mA h battery powers a torch that draws 0.40 A. How many hours will it last?', answer: 6, unit: 'h', explain: '2.4 A h ÷ 0.40 A = 6.0 h.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'A current of 0.50 A flows for 4.0 minutes. Calculate the charge that flows.', answer: 120, unit: 'C', explain: 'q = It = 0.50 × 240 = 120 C.' },
      { type: 'num', q: 'A lamp transfers 180 J of energy when 15 C of charge passes through it. Calculate the voltage across the lamp.', answer: 12, unit: 'V', explain: 'V = ΔE/q = 180 ÷ 15 = 12 V.' },
      { type: 'mcq', q: 'What is meant by “the voltage across a component is 6 V”?', options: ['Each coulomb transfers 6 J of energy in the component', '6 C of charge passes through it each second', 'The component stores 6 J', '6 A flows through it'], answer: 0, explain: 'Voltage is energy transferred per coulomb.' },
      { type: 'num', q: 'Five 1.2 V rechargeable cells are connected in series. What is the total voltage?', answer: 6, unit: 'V', explain: '5 × 1.2 = 6.0 V.' },
      { type: 'num', q: 'Convert 35 mA to amps.', answer: 0.035, unit: 'A', explain: '35 × 10⁻³ = 0.035 A.' },
    ],
    M: [
      { type: 'num', q: 'A current of 0.80 A flows through a resistor for 25 s. How many electrons pass through the resistor? (e = 1.6 × 10⁻¹⁹ C)', answer: 1.25e20, explain: 'q = It = 0.80 × 25 = 20 C; n = q/e = 20 ÷ 1.6 × 10⁻¹⁹ = 1.25 × 10²⁰.' },
      { type: 'num', q: 'A 24 V motor transfers 8640 J of energy in 1.0 minute. Calculate the current through the motor.', answer: 6, unit: 'A', explain: 'q = ΔE/V = 8640 ÷ 24 = 360 C; I = q/t = 360 ÷ 60 = 6.0 A.' },
      { type: 'explain', q: 'Two identical lamps are connected in series to a 6.0 V battery. Explain, in terms of energy and charge, why the voltage across each lamp is 3.0 V.', model: '<p>The battery gives each coulomb of charge 6.0 J of energy (6.0 V = 6.0 J per coulomb). Each coulomb passes through both lamps in turn and transfers all of its energy before returning to the battery, so the energy transferred per coulomb in the two lamps adds up to 6.0 J. The lamps are identical, so each coulomb transfers the same energy in each: 3.0 J in each lamp. Energy per coulomb is voltage, so each lamp has 3.0 V across it.</p>', points: [{ lvl: 'A', text: 'Voltage is energy per coulomb' }, { lvl: 'M', text: 'Each coulomb passes through both lamps and transfers all 6.0 J' }, { lvl: 'M', text: 'Identical lamps share equally, so 3.0 J per coulomb (3.0 V) each' }] },
      { type: 'num', q: 'A 3.7 V phone battery is rated at 3500 mA h. How much energy does it store when fully charged?', answer: 46620, unit: 'J', explain: 'q = 3500 × 3.6 = 12 600 C; ΔE = Vq = 3.7 × 12 600 = 46 620 J ≈ 4.7 × 10⁴ J.' },
    ],
    E: [
      { type: 'explain', q: 'A student says: “The current is used up as it goes through the bulb, and that is where the bulb’s energy comes from.” Explain why this is wrong and describe what actually happens to charge and energy in the circuit.', model: '<p>Current is not used up. Charge is conserved and cannot pile up, so the same number of coulombs per second flows into the bulb as flows out of it — an ammeter on either side gives the same reading. What changes is the energy the charge carries. In the battery, chemical energy is transferred to the charge: each coulomb gains energy equal to the battery voltage in joules. In the bulb, each coulomb transfers that energy to the filament, which heats up and gives out light. The charge then returns to the battery with no spare energy and is given more. So the bulb’s energy comes from the energy carried by the charge, not from using up the charge itself.</p>', points: [{ lvl: 'A', text: 'States current is the same before and after the bulb' }, { lvl: 'M', text: 'Explains charge is conserved / cannot pile up' }, { lvl: 'E', text: 'Energy per coulomb is gained in the battery and transferred in the bulb (links to voltage)' }, { lvl: 'E', text: 'Clearly separates the roles of charge (carrier) and energy (what is transferred)' }] },
      { type: 'num', q: 'An electric car battery stores 2.16 × 10⁸ J of energy at 400 V. If the car draws an average current of 60 A, how many hours of driving does the battery give?', answer: 2.5, unit: 'h', explain: 'q = ΔE/V = 2.16 × 10⁸ ÷ 400 = 5.4 × 10⁵ C; t = q/I = 5.4 × 10⁵ ÷ 60 = 9000 s = 2.5 h.' },
      { type: 'explain', q: 'Two identical 1.5 V cells can be connected in series or in parallel to light a small lamp. Discuss the differences in the lamp’s brightness and in how long the cells last, using ideas of energy per coulomb and charge.', model: '<p>In series each coulomb passes through both cells and gains 1.5 J from each, so it carries 3.0 J (3.0 V). With a larger voltage across the lamp, more current flows and each coulomb transfers more energy, so the lamp is much brighter. But the cells now deliver energy faster, so they run down sooner.</p><p>In parallel each coulomb passes through only one cell, so it gains 1.5 J (1.5 V) — the same as one cell. The lamp is as bright as it would be with a single cell. The total charge delivered is shared between the two cells, so each cell supplies half the current and the pair lasts about twice as long as one cell (and much longer than the series pair).</p>', points: [{ lvl: 'A', text: 'Series: brighter, 3.0 V. Parallel: 1.5 V' }, { lvl: 'M', text: 'Series: each coulomb gains energy from both cells' }, { lvl: 'E', text: 'Parallel: charge shared between cells, so they last longer' }, { lvl: 'E', text: 'Series gives faster energy transfer so cells run down sooner' }] },
    ],
  },
  glossary: [
    { term: 'Coulomb (C)', def: 'The unit of charge; about 6.25 × 10¹⁸ electrons’ worth.' },
    { term: 'Elementary charge (e)', def: 'The size of the charge on one electron or proton: 1.6 × 10⁻¹⁹ C.' },
    { term: 'Current (I)', def: 'The rate of flow of charge: I = q/t. Measured in amperes.' },
    { term: 'Ampere (A)', def: 'The unit of current: one coulomb per second.' },
    { term: 'Conservation of charge', def: 'Charge cannot be created or destroyed, so current into a junction equals current out.' },
    { term: 'Voltage (V)', def: 'Energy transferred per coulomb of charge: V = ΔE/q. Measured in volts (J/C).' },
    { term: 'Potential difference (p.d.)', def: 'The voltage across a component: the energy each coulomb transfers between two points.' },
    { term: 'EMF (ε)', def: 'Electromotive force: the energy a source gives each coulomb of charge. Measured in volts.' },
    { term: 'Cell', def: 'A device that transforms chemical energy into electrical energy.' },
    { term: 'Battery', def: 'Two or more cells joined together.' },
    { term: 'Capacity', def: 'The total charge a battery can deliver, often given in mA h or A h (1 A h = 3600 C).' },
    { term: 'Drift speed', def: 'The slow average speed of charge carriers along a wire when a current flows.' },
  ],
  formulas: [
    { name: 'Charge from electrons', tex: 'q = ne', note: 'e = 1.6 × 10⁻¹⁹ C.', level: 'L2' },
    { name: 'Current', tex: r`I = \frac{q}{t}`, note: 'Also q = It and t = q/I. Time in seconds.', level: 'L1 / L2' },
    { name: 'Voltage', tex: r`V = \frac{\Delta E}{q}`, note: 'Energy per coulomb. Also ΔE = Vq.', level: 'L1 / L2' },
    { name: 'Energy transferred', tex: r`\Delta E = VIt`, note: 'Combines ΔE = Vq with q = It.', level: 'L2' },
    { name: 'Battery capacity', tex: r`1\ \text{A h} = 3600\ \text{C}`, note: '1 mA h = 3.6 C.', level: 'L1' },
    { name: 'Drift formula', tex: 'I = nAvq', note: 'Going deeper: n = carriers per m³, A = area, v = drift speed.', level: 'L3 / Uni' },
  ],
  flashcards: [
    { front: 'Define current', back: 'The rate of flow of charge: I = q/t' }, { front: '1 ampere =', back: '1 coulomb per second' },
    { front: 'Define voltage', back: 'Energy transferred per coulomb: V = ΔE/q' }, { front: '1 volt =', back: '1 joule per coulomb' },
    { front: 'Charge on an electron', back: '1.6 × 10⁻¹⁹ C' }, { front: 'Energy transferred in terms of V, I and t', back: 'ΔE = VIt' },
    { front: '1 A h in coulombs', back: '3600 C' }, { front: 'Cells in series', back: 'Voltages add (reversed cell subtracts)' },
    { front: 'Identical cells in parallel', back: 'Same voltage, last longer' },
  ],
};
