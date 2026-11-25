/**
 * Chapter 10 — EMF & Internal Resistance.
 */
import { svg, comp, wire, dot, label } from '../js/utils/svg.js';

const r = String.raw;

const REAL_CELL = svg(440, 200, [
  '<rect x="40" y="40" width="120" height="120" rx="12" class="dash fill-soft"/>', label(100, 32, 'real battery', { cls: 'small bold' }),
  comp('cell', 100, 150, 100, 100, { signs: true, label: 'ε', labelPos: 'left' }), comp('resistor', 100, 100, 100, 50, { label: 'r', labelPos: 'left' }),
  wire([100, 50], [100, 20], [330, 20]), comp('resistor', 330, 20, 330, 180, { label: 'load R', labelPos: 'right' }), wire([330, 180], [100, 180], [100, 150]),
  dot(160, 20), dot(160, 180), wire([160, 20], [160, 70]), comp('voltmeter', 160, 70, 160, 130), wire([160, 130], [160, 180]),
  label(245, 150, 'voltmeter reads', { cls: 'small' }), label(245, 168, 'V = ε − Ir', { cls: 'bold' }),
].join(''), { title: 'A real battery: an ideal EMF ε in series with an internal resistance r, connected to a load R', maxw: 460 });

const VI_LINE = (() => {
  const P = { l: 60, b: 40, t: 14, r: 20 };
  const W = 400;
  const H = 240;
  const X = (i) => P.l + (i / 4) * (W - P.l - P.r);
  const Y = (v) => H - P.b - (v / 10) * (H - P.t - P.b);
  let s = '';
  for (const i of [1, 2, 3, 4]) s += `<line x1="${X(i)}" y1="${P.t}" x2="${X(i)}" y2="${H - P.b}" class="thin" style="stroke:var(--line)"/>` + label(X(i), H - P.b + 16, String(i), { cls: 'small' });
  for (const v of [2, 4, 6, 8, 10]) s += `<line x1="${P.l}" y1="${Y(v)}" x2="${W - P.r}" y2="${Y(v)}" class="thin" style="stroke:var(--line)"/>` + label(P.l - 6, Y(v) + 4, String(v), { anchor: 'end', cls: 'small' });
  s += `<line x1="${P.l}" y1="${H - P.b}" x2="${W - P.r}" y2="${H - P.b}"/><line x1="${P.l}" y1="${P.t}" x2="${P.l}" y2="${H - P.b}"/>`;
  s += `<line x1="${X(0)}" y1="${Y(9)}" x2="${X(4)}" y2="${Y(3)}" style="stroke:var(--blue);stroke-width:2.5"/>`;
  s += `<polyline points="${X(1)},${Y(7.5)} ${X(3)},${Y(7.5)} ${X(3)},${Y(4.5)}" class="dash" style="stroke:var(--bad)"/>`;
  s += label(X(2), Y(7.5) - 8, 'ΔI = 2.0 A', { cls: 'small bold' }) + label(X(3) + 6, Y(6), 'ΔV = −3.0 V', { anchor: 'start', cls: 'small bold' }) + label(X(0) + 8, Y(9) - 8, 'intercept = ε = 9.0 V', { anchor: 'start', cls: 'small bold' });
  s += label((W + P.l) / 2, H - 6, 'Current I (A)') + `<text x="16" y="${(H - P.b + P.t) / 2}" text-anchor="middle" class="lbl" transform="rotate(-90 16 ${(H - P.b + P.t) / 2})">Terminal voltage V (V)</text>`;
  return svg(W, H, s, { title: 'Terminal voltage against current: a straight line falling from 9.0 V with gradient −1.5 ohms', maxw: 440 });
})();

const KIRCH = svg(440, 210, [
  comp('battery', 40, 40, 40, 180, { signs: true, label: 'ε₁ = 12 V', labelPos: 'left' }), wire([40, 40], [80, 40]), comp('resistor', 80, 40, 190, 40, { label: 'R₁ = 2.0 Ω' }), wire([190, 40], [220, 40]),
  wire([220, 40], [250, 40]), comp('resistor', 250, 40, 360, 40, { label: 'R₂ = 4.0 Ω' }), wire([360, 40], [400, 40]), comp('battery', 400, 40, 400, 180, { signs: true, label: 'ε₂ = 6.0 V', labelPos: 'right' }),
  wire([40, 180], [400, 180]), comp('resistor', 220, 40, 220, 180, { label: 'R₃ = 6.0 Ω', labelPos: 'right' }), dot(220, 40), dot(220, 180),
].join(''), { title: 'Two batteries and three resistors: a circuit needing Kirchhoff’s laws', maxw: 460 });

export default {
  intro: 'So far batteries have been perfect: a 9 V battery always gave 9 V. Real batteries are not like that — their voltage drops when they deliver a big current. This chapter explains why, using the ideas of EMF and internal resistance, and finishes with Kirchhoff’s laws for circuits with more than one battery.',
  standards: 'NCEA Level 3 AS 91526 (Demonstrate understanding of electrical systems): EMF, internal resistance and Kirchhoff’s laws for DC circuits.',
  lessons: [
    // ------------------------------------------------------------------ 10.1
    {
      id: '10.1', title: 'EMF and terminal voltage', levels: ['L3'], minutes: 15,
      objectives: ['Define EMF', 'Explain why the terminal voltage is less than the EMF when current flows', 'Describe “lost volts”'],
      sections: [
        { type: 'text', title: 'Energy given and energy delivered', html: r`<p>The <b>EMF</b> (ε, electromotive force) of a battery is the energy it gives each coulomb of charge that passes through it: the chemical energy converted to electrical energy per coulomb. It is measured in volts.</p>
<p>But the charge must flow through the battery itself, and the battery’s chemicals and electrodes have resistance — the <b>internal resistance</b> $r$. Some of each coulomb’s energy is used up inside the battery, warming it. The energy per coulomb that is left to deliver to the outside circuit is the <b>terminal voltage</b> $V$ (the reading on a voltmeter across the battery’s terminals).</p>` },
        { type: 'diagram', svg: REAL_CELL, caption: 'Model a real battery as a perfect EMF in series with a small resistor r, both inside the dotted box.' },
        { type: 'text', title: 'Lost volts', html: r`<p>The energy per coulomb used inside is $Ir$ (Ohm’s law for the internal resistance). It is called the <b>lost volts</b>. So:</p>
<p>$$\varepsilon = V + Ir$$</p>
<p>When <b>no current</b> flows (switch open), $Ir = 0$ and the terminal voltage equals the EMF. That is why a high-resistance voltmeter connected straight across an unused battery reads (almost exactly) its EMF.</p>` },
        { type: 'example', title: 'lost volts', q: r`<p>A battery of EMF 9.0 V has a terminal voltage of 8.4 V when it supplies 0.40 A. Find the lost volts and the internal resistance.</p>`, steps: [r`Lost volts $= \varepsilon - V = 9.0 - 8.4 = 0.60$ V.`, r`$r = \dfrac{0.60}{0.40} = 1.5\ \Omega$.`], answer: '<p>0.60 V lost inside; r = 1.5 Ω.</p>' },
        { type: 'text', title: 'You have seen this happen', html: r`<p>Turn a car’s headlights on, then start the engine: the lights dim. The starter motor draws over 100 A, so even a tiny internal resistance (0.02 Ω) loses $100 \times 0.02 = 2$ V, and the terminal voltage — which the lights share — drops. A torch with old batteries is dim for the same reason: old cells have a much higher internal resistance.</p>` },
        { type: 'misconception', wrong: 'EMF is a force that pushes electrons.', right: 'Despite its name, EMF is not a force. It is energy per coulomb, measured in volts.' },
        { type: 'key', points: ['EMF ε: energy given to each coulomb by the source.', 'Terminal voltage V: energy per coulomb delivered to the external circuit.', r`Lost volts $= Ir$; $\varepsilon = V + Ir$.`, 'No current → V = ε.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'A voltmeter is connected across a battery with nothing else attached. It reads…', options: ['the EMF', 'zero', 'the lost volts', 'half the EMF'], answer: 0, explain: 'No current, so no lost volts.' },
        { type: 'num', q: 'A 6.0 V battery has a terminal voltage of 5.5 V while delivering current. What are the lost volts?', answer: 0.5, unit: 'V', explain: '6.0 − 5.5 = 0.50 V.' },
        { type: 'num', q: 'In the last question the current is 0.25 A. What is the internal resistance?', answer: 2, unit: 'Ω', explain: 'r = 0.50/0.25 = 2.0 Ω.' },
        { type: 'mcq', q: 'Why do headlights dim when a car engine is started?', options: ['The large starter current causes large lost volts, lowering the terminal voltage', 'The engine uses up the charge', 'The headlights heat up', 'The EMF of the battery suddenly halves'], answer: 0, explain: 'V = ε − Ir with a very large I.' },
        { type: 'mcq', q: 'EMF is measured in…', options: ['volts', 'newtons', 'amps', 'ohms'], answer: 0, explain: 'Energy per coulomb.' },
      ],
    },
    // ------------------------------------------------------------------ 10.2
    {
      id: '10.2', title: 'Calculations with V = ε − Ir', levels: ['L3'], minutes: 18,
      objectives: ['Use V = ε − Ir and I = ε/(R + r)', 'Find the short-circuit current', 'Explain how terminal voltage changes with load'],
      sections: [
        { type: 'formula', title: 'Terminal voltage', tex: r`V = \varepsilon - Ir`, symbols: [['V', 'terminal voltage', 'V'], [r`\varepsilon`, 'EMF', 'V'], ['I', 'current', 'A'], ['r', 'internal resistance', 'Ω']] },
        { type: 'text', title: 'The current in the whole circuit', html: r`<p>The internal resistance is in series with the external load $R$, so the total resistance is $R + r$:</p>
<p>$$I = \frac{\varepsilon}{R + r}$$</p>
<p>The terminal voltage is then simply the voltage across the load: $V = IR$.</p>` },
        { type: 'example', title: 'full analysis', q: r`<p>A battery of EMF 12 V and internal resistance 0.50 Ω is connected to a 5.5 Ω lamp. Find the current, the terminal voltage and the lost volts.</p>`, steps: [r`$I = \dfrac{\varepsilon}{R + r} = \dfrac{12}{5.5 + 0.50} = 2.0$ A.`, r`Terminal voltage: $V = IR = 2.0 \times 5.5 = 11$ V.`, r`Lost volts: $Ir = 2.0 \times 0.50 = 1.0$ V. Check: $11 + 1.0 = 12$ V ✓.`], answer: '<p>2.0 A; 11 V; 1.0 V lost.</p>' },
        { type: 'text', title: 'How the load changes things', html: r`<ul><li><b>Large R</b> (small current): lost volts small, so $V \approx \varepsilon$.</li><li><b>Smaller R</b> (more current): more lost volts, $V$ falls.</li><li><b>Short circuit</b> ($R = 0$): $V = 0$ and the current is as large as it can be: $I_{max} = \dfrac{\varepsilon}{r}$. All the energy is dissipated inside the battery, which can get dangerously hot.</li></ul>` },
        { type: 'example', title: 'short-circuit current', q: r`<p>A car battery has EMF 12.6 V and internal resistance 0.020 Ω. What current would flow if a spanner accidentally connected its terminals?</p>`, steps: [r`$I = \dfrac{\varepsilon}{r} = \dfrac{12.6}{0.020}$.`, r`$I = 630$ A.`], answer: '<p>About 630 A — enough to weld the spanner and burn the person holding it. This is why car batteries are dangerous despite their low voltage.</p>' },
        { type: 'example', title: 'finding EMF and r from two readings', q: r`<p>A battery gives 5.6 V at 0.20 A and 4.8 V at 0.60 A. Find ε and r.</p>`, steps: [r`Write $V = \varepsilon - Ir$ twice: $5.6 = \varepsilon - 0.20r$ and $4.8 = \varepsilon - 0.60r$.`, r`Subtract: $0.8 = 0.40r$, so $r = 2.0\ \Omega$.`, r`Substitute: $\varepsilon = 5.6 + 0.20 \times 2.0 = 6.0$ V.`], answer: '<p>ε = 6.0 V, r = 2.0 Ω.</p>' },
        { type: 'maths', title: 'simultaneous equations', html: r`<p>Two unknowns need two equations. Line them up so the same unknown ($\varepsilon$) appears in both, then <b>subtract</b> one equation from the other to eliminate it. Solve for the remaining unknown and substitute back. Always check the answer in the equation you did not use.</p>` },
        { type: 'try', question: { type: 'num', q: 'A cell has EMF 1.5 V and internal resistance 0.50 Ω. What current flows through a 2.5 Ω resistor connected to it?', answer: 0.5, unit: 'A', explain: 'I = 1.5 ÷ (2.5 + 0.50) = 0.50 A.' } },
        { type: 'key', points: [r`$V = \varepsilon - Ir$ and $I = \varepsilon/(R + r)$.`, 'More current → more lost volts → lower terminal voltage.', r`Short-circuit current $= \varepsilon / r$.`, 'Two readings → two equations → solve for ε and r.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A battery (ε = 9.0 V, r = 1.0 Ω) is connected to an 8.0 Ω resistor. What is the current?', answer: 1, unit: 'A', explain: 'I = 9.0/(8.0 + 1.0) = 1.0 A.' },
        { type: 'num', q: 'For the last question, what is the terminal voltage?', answer: 8, unit: 'V', explain: 'V = IR = 1.0 × 8.0 = 8.0 V.' },
        { type: 'num', q: 'What is the short-circuit current of a 1.5 V cell with internal resistance 0.30 Ω?', answer: 5, unit: 'A', explain: 'I = ε/r = 1.5/0.30 = 5.0 A.' },
        { type: 'mcq', q: 'As the load resistance connected to a battery is decreased, the terminal voltage…', options: ['decreases', 'increases', 'stays equal to the EMF', 'becomes negative'], answer: 0, explain: 'More current → more lost volts.' },
        { type: 'num', q: 'A battery gives 3.0 V at 0.50 A and 2.0 V at 1.0 A. What is its internal resistance?', answer: 2, unit: 'Ω', explain: 'ΔV = 1.0 V for ΔI = 0.50 A: r = 2.0 Ω (and ε = 4.0 V).' },
      ],
    },
    // ------------------------------------------------------------------ 10.3
    {
      id: '10.3', title: 'Measuring EMF and internal resistance', levels: ['L3'], minutes: 18,
      objectives: ['Plan an experiment to find ε and r', 'Draw and interpret a V–I graph for a battery', 'Identify sources of error'],
      sections: [
        { type: 'text', title: 'Method', html: r`<ol><li>Connect the battery in series with an ammeter and a variable resistor (rheostat). Connect a voltmeter directly across the battery’s terminals.</li><li>Record the terminal voltage and the current for at least six settings of the rheostat, from small currents to large.</li><li>Switch off between readings — a battery warms up and runs down when delivering large currents, which changes ε and r.</li><li>Plot terminal voltage (y) against current (x) and draw the line of best fit.</li></ol>` },
        { type: 'text', title: 'Reading the graph', html: r`<p>Rearrange $V = \varepsilon - Ir$ into the form $y = mx + c$:</p>
<p>$$V = -r\,I + \varepsilon$$</p>
<ul><li>The <b>y-intercept</b> (where $I = 0$) is the <b>EMF</b> ε.</li><li>The <b>gradient</b> is $-r$, so the internal resistance is the size of the gradient.</li><li>The x-intercept (where $V = 0$) is the short-circuit current $\varepsilon/r$ — usually found by extending the line, not by measuring!</li></ul>` },
        { type: 'diagram', svg: VI_LINE, caption: 'Intercept 9.0 V = ε. Gradient = −3.0 V ÷ 2.0 A = −1.5 Ω, so r = 1.5 Ω.' },
        { type: 'sim', sim: 'emf-lab', caption: 'Pick a source, record six readings at different load resistances, and read ε and r from the line. Compare a new and an old AA cell.' },
        { type: 'example', title: 'from a table', q: r`<p>Readings: (0.10 A, 1.46 V), (0.20 A, 1.42 V), (0.40 A, 1.34 V), (0.60 A, 1.26 V). Find ε and r.</p>`, steps: [r`Gradient from the first and last points: $\dfrac{1.26 - 1.46}{0.60 - 0.10} = \dfrac{-0.20}{0.50} = -0.40\ \Omega$.`, r`So $r = 0.40\ \Omega$.`, r`Intercept: $\varepsilon = V + Ir = 1.46 + 0.10 \times 0.40 = 1.50$ V.`], answer: '<p>ε = 1.50 V, r = 0.40 Ω.</p>' },
        { type: 'text', title: 'Errors and improvements', html: r`<ul><li>The battery’s ε and r change as it heats and runs down: take readings quickly and switch off between them.</li><li>Including a fixed protective resistor in series stops the current getting dangerously large at low rheostat settings.</li><li>Meter resistance: an ideal voltmeter draws no current. A real one draws a little, but with ~10 MΩ the effect is negligible.</li><li>Use a line of best fit over many points rather than two readings.</li></ul>` },
        { type: 'key', points: ['Plot V (y) against I (x).', 'Intercept = ε; gradient = −r.', 'Switch off between readings; use a protective resistor.', 'Extrapolating to V = 0 gives the short-circuit current ε/r.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'On a graph of terminal voltage against current for a battery, the y-intercept equals…', options: ['the EMF', 'the internal resistance', 'the short-circuit current', 'zero'], answer: 0, explain: 'At I = 0, V = ε.' },
        { type: 'mcq', q: 'The gradient of the same graph equals…', options: ['−r', 'r', 'ε', '1/r'], answer: 0, explain: 'V = −rI + ε.' },
        { type: 'num', q: 'A V–I line for a battery passes through (0, 4.5 V) and (1.5 A, 3.0 V). What is r?', answer: 1, unit: 'Ω', explain: 'Gradient = −1.5/1.5 = −1.0 Ω, so r = 1.0 Ω.' },
        { type: 'num', q: 'For the battery in the last question, what is the short-circuit current?', answer: 4.5, unit: 'A', explain: 'ε/r = 4.5/1.0 = 4.5 A.' },
        { type: 'mcq', q: 'Why should the circuit be switched off between readings?', options: ['To stop the battery heating and running down, which would change ε and r', 'To reset the ammeter', 'To protect the voltmeter from AC', 'To increase the EMF'], answer: 0, explain: 'Keeps conditions constant.' },
      ],
    },
    // ------------------------------------------------------------------ 10.4
    {
      id: '10.4', title: 'Power from real sources', levels: ['L3', 'Uni'], minutes: 16,
      objectives: ['Calculate the power delivered to the load and wasted inside the battery', 'Find the efficiency of a real source', 'State and explain the maximum power transfer condition'],
      sections: [
        { type: 'text', title: 'Where the energy goes', html: r`<p>Multiply $\varepsilon = V + Ir$ by $I$:</p>
<p>$$\varepsilon I = VI + I^2r$$</p>
<ul><li>$\varepsilon I$ = total power converted by the battery.</li><li>$VI = I^2R$ = useful power delivered to the load.</li><li>$I^2r$ = power wasted as heat inside the battery.</li></ul>
<p>Efficiency $= \dfrac{\text{useful}}{\text{total}} = \dfrac{VI}{\varepsilon I} = \dfrac{V}{\varepsilon} = \dfrac{R}{R + r}$.</p>` },
        { type: 'example', title: 'powers and efficiency', q: r`<p>A 12 V battery with r = 0.50 Ω drives 2.0 A through a 5.5 Ω lamp. Find the total power, the useful power, the wasted power and the efficiency.</p>`, steps: [r`Total: $\varepsilon I = 12 \times 2.0 = 24$ W.`, r`Useful: $I^2R = 4.0 \times 5.5 = 22$ W.`, r`Wasted: $I^2r = 4.0 \times 0.50 = 2.0$ W.`, r`Efficiency: $\dfrac{22}{24} = 92\%$.`], answer: '<p>24 W total, 22 W useful, 2.0 W wasted, 92% efficient.</p>' },
        { type: 'text', title: 'Maximum power transfer', html: r`<p>If you want the <b>most power</b> delivered to the load (not the most efficient), choose $R = r$. Then half the power is wasted inside the source (efficiency 50%), but the load gets more than with any other resistance. Smaller $R$ draws more current but most of the energy is lost inside; larger $R$ wastes little but the current is small.</p>
<p>With $R = r$: $P_{max} = \dfrac{\varepsilon^2}{4r}$. Matching resistances like this matters in audio amplifiers and radio aerials. For power supplies, where efficiency matters more, $R$ is made much bigger than $r$.</p>` },
        { type: 'sim', sim: 'emf-lab', caption: 'With the 9 V battery, find the load resistance where the lamp gets the most power (P = VI). It should be close to r.' },
        { type: 'text', title: 'Batteries in series and parallel', html: r`<p>Cells in <b>series</b>: EMFs add and internal resistances add (they are in series). Identical cells in <b>parallel</b>: the EMF is that of one cell, and the internal resistances combine in parallel ($r/n$ for $n$ cells), so the pack can deliver more current with fewer lost volts.</p>` },
        { type: 'try', question: { type: 'num', q: 'Four identical cells (1.5 V, 0.20 Ω each) are in series. What is the total internal resistance?', answer: 0.8, unit: 'Ω', explain: 'Series: 4 × 0.20 = 0.80 Ω (EMF 6.0 V).' } },
        { type: 'misconception', wrong: 'The maximum power transfer condition also gives the best efficiency.', right: 'At R = r the efficiency is only 50%. Efficiency keeps rising as R increases, but the power delivered then falls.' },
        { type: 'key', points: [r`$\varepsilon I = I^2R + I^2r$ (total = useful + wasted).`, r`Efficiency $= V/\varepsilon = R/(R + r)$.`, r`Maximum power to the load when $R = r$: $P = \varepsilon^2/4r$, efficiency 50%.`, 'Series cells: ε and r both add. Parallel identical cells: same ε, r/n.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 6.0 V battery (r = 1.0 Ω) is connected to a 2.0 Ω resistor. What power is wasted inside the battery?', answer: 4, unit: 'W', explain: 'I = 6.0/3.0 = 2.0 A; I²r = 4.0 × 1.0 = 4.0 W.' },
        { type: 'num', q: 'For the last question, what is the efficiency (%)?', answer: 66.7, unit: '%', explain: 'R/(R + r) = 2/3 = 67%.' },
        { type: 'mcq', q: 'For maximum power transfer to a load, the load resistance should be…', options: ['equal to the internal resistance', 'as large as possible', 'as small as possible', 'zero'], answer: 0, explain: 'R = r.' },
        { type: 'num', q: 'What is the maximum power a 9.0 V battery with r = 1.5 Ω can deliver to a load?', answer: 13.5, unit: 'W', explain: 'ε²/4r = 81/6 = 13.5 W.' },
        { type: 'num', q: 'Three identical 2.0 V cells, each with r = 0.30 Ω, are connected in parallel. What is the internal resistance of the pack?', answer: 0.1, unit: 'Ω', explain: 'r/n = 0.30/3 = 0.10 Ω (EMF 2.0 V).' },
      ],
    },
    // ------------------------------------------------------------------ 10.5
    {
      id: '10.5', title: "Kirchhoff's laws", levels: ['L3'], minutes: 22,
      objectives: ["State Kirchhoff's current and voltage laws", 'Apply them to circuits with more than one EMF', 'Interpret negative answers'],
      sections: [
        { type: 'text', title: 'Two laws from two conservation principles', html: r`<ul><li><b>Kirchhoff’s current law (junction rule):</b> the total current into any junction equals the total current out. (Conservation of charge — Lesson 4.3.)</li><li><b>Kirchhoff’s voltage law (loop rule):</b> around any closed loop, the sum of the EMFs equals the sum of the $IR$ voltage drops. (Conservation of energy — each coulomb ends where it started with the same energy.)</li></ul>
<p>Series and parallel rules are special cases. You need the full laws when a circuit has <b>two or more batteries</b> in different branches, because it cannot be simplified into series and parallel groups.</p>` },
        { type: 'text', title: 'Method', html: r`<ol><li>Label a current in each branch with a guessed direction ($I_1$, $I_2$, …).</li><li>Use the junction rule to reduce the number of unknowns.</li><li>Choose loops. Go round each loop in one direction: an EMF counts <b>+</b> if you pass through it from − to +; an $IR$ drop counts <b>+</b> if you travel in the direction of your guessed current.</li><li>Solve the simultaneous equations.</li><li>A <b>negative</b> answer just means that current flows the opposite way to your guess.</li></ol>` },
        { type: 'diagram', svg: KIRCH, caption: 'Two batteries in different branches (both with + at the top): series/parallel rules cannot solve this.' },
        { type: 'example', title: 'two batteries', q: r`<p>In the circuit above, find the current through each resistor. (Take $I_1$ through R₁ from left to right, $I_2$ through R₂ from left to right, and $I_3 = I_1 - I_2$ down through R₃.)</p>`, steps: [r`Left loop (ε₁, R₁, R₃): $12 = 2.0I_1 + 6.0(I_1 - I_2)$ → $12 = 8.0I_1 - 6.0I_2$.`, r`Right loop (R₃, R₂, ε₂), going clockwise from the top junction through R₂: ε₂ is passed from + to −, so $-6.0 = 4.0I_2 - 6.0(I_1 - I_2)$ → $-6.0 = -6.0I_1 + 10I_2$.`, r`Multiply the first by 3 and the second by 4: $36 = 24I_1 - 18I_2$ and $-24 = -24I_1 + 40I_2$. Add: $12 = 22I_2$, so $I_2 = 0.545$ A.`, r`Then $8.0I_1 = 12 + 6.0 \times 0.545 = 15.27$, so $I_1 = 1.91$ A, and $I_3 = 1.91 - 0.545 = 1.36$ A.`, r`Check the right loop: $4.0(0.545) - 6.0(1.36) = 2.18 - 8.18 = -6.0$ ✓.`], answer: '<p>R₁: 1.91 A; R₂: 0.545 A (left to right, so into the + terminal of ε₂, charging it); R₃: 1.36 A downwards.</p>' },
        { type: 'maths', title: 'solving two simultaneous equations', html: r`<p>Make the coefficient of one unknown equal and opposite in the two equations (multiply each equation by a suitable number), then add them so that unknown disappears. Or use substitution: rearrange one equation for $I_1$ and substitute into the other. Many scientific calculators also have an equation-solving mode.</p>` },
        { type: 'text', title: 'Charging a battery', html: r`<p>In the example, current flows <b>into</b> the positive terminal of the 6.0 V battery. That battery is being <b>charged</b>: energy is transferred to it rather than from it. Car alternators charge the battery this way, and phone chargers push current backwards through the cell.</p>` },
        { type: 'try', question: { type: 'num', q: 'Three currents meet at a junction: 2.0 A in, 0.5 A in, and I out. What is I?', answer: 2.5, unit: 'A', explain: 'Junction rule: 2.0 + 0.5 = 2.5 A.' } },
        { type: 'exam', standard: 'NCEA Level 3, AS 91526', html: '<p>Show each loop equation clearly with its direction, and state which conservation law each Kirchhoff law comes from. If an answer comes out negative, say what that means for the actual direction.</p>' },
        { type: 'key', points: ['Current law: Σ I in = Σ I out (charge conservation).', 'Voltage law: around a loop, Σ ε = Σ IR (energy conservation).', 'Guess directions; negative answer = opposite direction.', 'Current into a battery’s + terminal charges it.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: "Kirchhoff's voltage law is based on conservation of…", options: ['energy', 'charge', 'momentum', 'mass'], answer: 0, explain: 'Each coulomb returns with the same energy.' },
        { type: 'mcq', q: "Kirchhoff's current law is based on conservation of…", options: ['charge', 'energy', 'momentum', 'voltage'], answer: 0, explain: 'Charge cannot pile up at a junction.' },
        { type: 'num', q: 'A single loop has a 12 V battery and a 4.0 V battery opposing it, with a total resistance of 4.0 Ω. What current flows?', answer: 2, unit: 'A', explain: 'Net EMF 12 − 4.0 = 8.0 V; I = 8.0/4.0 = 2.0 A.' },
        { type: 'mcq', q: 'Solving a Kirchhoff problem gives I₂ = −0.30 A. This means…', options: ['the current is 0.30 A in the opposite direction to the guess', 'the answer is wrong', 'no current flows', 'the battery is flat'], answer: 0, explain: 'Negative = opposite direction.' },
        { type: 'mcq', q: 'When current is pushed into the positive terminal of a battery, the battery is…', options: ['being charged', 'discharging faster', 'short-circuited', 'not affected'], answer: 0, explain: 'Energy is transferred to it.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'A battery has EMF 4.5 V and terminal voltage 4.1 V. Calculate the lost volts.', answer: 0.4, unit: 'V', explain: '4.5 − 4.1 = 0.40 V.' },
      { type: 'num', q: 'Calculate the current from a battery of EMF 6.0 V and internal resistance 0.50 Ω connected to a 2.5 Ω resistor.', answer: 2, unit: 'A', explain: 'I = 6.0/3.0 = 2.0 A.' },
      { type: 'mcq', q: 'What does EMF stand for and measure?', options: ['Electromotive force: energy given to each coulomb by the source', 'Electric magnetic field: the field around a wire', 'Electron mass flow: current', 'Energy of moving force: power'], answer: 0, explain: 'Energy per coulomb, in volts.' },
      { type: 'num', q: 'Calculate the short-circuit current of a 9.0 V battery with internal resistance 1.5 Ω.', answer: 6, unit: 'A', explain: 'ε/r = 6.0 A.' },
      { type: 'mcq', q: 'On a V–I graph for a battery, the internal resistance is found from…', options: ['the gradient (its size)', 'the y-intercept', 'the area under the line', 'the x-intercept only'], answer: 0, explain: 'Gradient = −r.' },
    ],
    M: [
      { type: 'num', q: 'A battery has a terminal voltage of 1.35 V when delivering 0.30 A and 1.20 V when delivering 0.60 A. Calculate its EMF.', answer: 1.5, unit: 'V', explain: 'r = 0.15/0.30 = 0.50 Ω; ε = 1.35 + 0.30 × 0.50 = 1.50 V.' },
      { type: 'num', q: 'A 12 V battery with internal resistance 0.40 Ω supplies 5.0 A. Calculate the power wasted inside the battery.', answer: 10, unit: 'W', explain: 'I²r = 25 × 0.40 = 10 W.' },
      { type: 'explain', q: 'Explain why the voltage across a torch bulb falls as the batteries get old.', model: '<p>As batteries age, the chemical changes inside increase their internal resistance. The current through the bulb also flows through this internal resistance, so energy is transferred inside the battery: the lost volts Ir increase. The terminal voltage V = ε − Ir therefore falls (the EMF may also fall a little), so there is less voltage across the bulb, less current through it, and it is dimmer.</p>', points: [{ lvl: 'A', text: 'Internal resistance increases with age' }, { lvl: 'M', text: 'Lost volts Ir increase' }, { lvl: 'M', text: 'Terminal voltage V = ε − Ir falls, so the bulb gets less voltage' }] },
      { type: 'num', q: 'Two cells, 1.5 V with r = 0.25 Ω each, are connected in series to a 2.5 Ω resistor. Calculate the current.', answer: 1, unit: 'A', explain: 'ε = 3.0 V, r = 0.50 Ω; I = 3.0/3.0 = 1.0 A.' },
    ],
    E: [
      { type: 'explain', q: 'A battery (ε = 9.0 V, r = 3.0 Ω) is connected in turn to loads of 1.0 Ω, 3.0 Ω and 9.0 Ω. Calculate the power delivered to each load and the efficiency in each case, and discuss which load is best for maximum power and which for efficiency.', model: '<p>1.0 Ω: I = 9.0/4.0 = 2.25 A; P = I²R = 5.06 W; efficiency R/(R + r) = 25%.</p><p>3.0 Ω: I = 9.0/6.0 = 1.5 A; P = 6.75 W; efficiency 50%.</p><p>9.0 Ω: I = 9.0/12 = 0.75 A; P = 5.06 W; efficiency 75%.</p><p>The 3.0 Ω load, equal to the internal resistance, receives the most power (maximum power transfer), but half the energy is wasted inside the battery. With the smaller load, more current flows but most of the energy is wasted in r. With the larger load, little energy is wasted (high efficiency), but the current is small, so the power delivered is less. For maximum power choose R = r; for best efficiency choose R much larger than r.</p>', points: [{ lvl: 'A', text: 'Correct current or power for at least one load' }, { lvl: 'M', text: 'Correct powers 5.06 W, 6.75 W, 5.06 W' }, { lvl: 'E', text: 'Correct efficiencies 25%, 50%, 75%' }, { lvl: 'E', text: 'Explains R = r gives maximum power but larger R gives higher efficiency' }] },
      { type: 'num', q: 'Two batteries are connected in parallel (positive to positive): battery A has ε = 6.0 V, r = 0.50 Ω; battery B has ε = 5.0 V, r = 0.50 Ω. With nothing else connected, what current flows between them?', answer: 1, unit: 'A', explain: 'Single loop: net EMF 6.0 − 5.0 = 1.0 V; total r = 1.0 Ω; I = 1.0 A (A charges B).' },
      { type: 'explain', q: 'Explain, using Kirchhoff’s laws and conservation principles, why the current from battery A in the last question charges battery B, and why connecting batteries of different EMF in parallel is wasteful.', model: '<p>Around the loop formed by the two batteries, Kirchhoff’s voltage law (energy conservation) gives a net EMF of 6.0 − 5.0 = 1.0 V driving current through the total internal resistance of 1.0 Ω, so 1.0 A flows. It leaves the + terminal of A and enters the + terminal of B, so B has energy transferred to it — it is being charged — while A is discharging. By the junction rule the same current flows all round the loop. Energy is continually wasted as heat in both internal resistances (I²r = 0.5 W in each), even with no load connected, so the batteries run down for nothing. That is why batteries of different EMF should not be connected in parallel.</p>', points: [{ lvl: 'A', text: 'Current flows from A into B' }, { lvl: 'M', text: 'Net EMF 1.0 V over 1.0 Ω (Kirchhoff’s voltage law)' }, { lvl: 'E', text: 'Current enters B’s + terminal, so B is charged' }, { lvl: 'E', text: 'Energy wasted as heat in internal resistances with no load' }] },
    ],
  },
  glossary: [
    { term: 'EMF (ε)', def: 'Energy converted into electrical energy per coulomb by a source, in volts.' },
    { term: 'Internal resistance (r)', def: 'The resistance of the materials inside a source.' },
    { term: 'Terminal voltage', def: 'The voltage across a source’s terminals: the energy per coulomb delivered to the external circuit.' },
    { term: 'Lost volts', def: 'The energy per coulomb transferred inside the source: Ir.' },
    { term: 'Short-circuit current', def: 'The current when the terminals are joined directly: ε/r.' },
    { term: 'Maximum power transfer', def: 'Maximum power reaches a load when its resistance equals the source’s internal resistance.' },
    { term: "Kirchhoff's current law", def: 'The sum of currents into a junction equals the sum out.' },
    { term: "Kirchhoff's voltage law", def: 'Around any closed loop, the sum of EMFs equals the sum of IR drops.' },
  ],
  formulas: [
    { name: 'Terminal voltage', tex: r`V = \varepsilon - Ir`, note: 'Also ε = V + Ir.', level: 'L3' },
    { name: 'Circuit current', tex: r`I = \frac{\varepsilon}{R + r}`, note: 'Short circuit: I = ε/r.', level: 'L3' },
    { name: 'Power balance', tex: r`\varepsilon I = I^2R + I^2r`, note: 'Efficiency = R/(R + r).', level: 'L3' },
    { name: 'Maximum power', tex: r`P_{max} = \frac{\varepsilon^2}{4r}`, note: 'When R = r.', level: 'Uni' },
    { name: "Kirchhoff's laws", tex: r`\Sigma I_{in} = \Sigma I_{out} \qquad \Sigma \varepsilon = \Sigma IR`, note: 'Charge and energy conservation.', level: 'L3' },
  ],
  flashcards: [
    { front: 'Define EMF', back: 'Energy given to each coulomb by the source' }, { front: 'Terminal voltage formula', back: 'V = ε − Ir' },
    { front: 'Lost volts', back: 'Ir — energy per coulomb used inside the source' }, { front: 'V–I graph for a battery', back: 'Intercept = ε; gradient = −r' },
    { front: 'Short-circuit current', back: 'ε / r' }, { front: 'Maximum power transfer condition', back: 'R = r (efficiency 50%)' },
    { front: "Kirchhoff's current law", back: 'Σ I in = Σ I out' }, { front: "Kirchhoff's voltage law", back: 'Σ ε = Σ IR around a loop' },
  ],
};
