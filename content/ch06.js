/**
 * Chapter 6 — Series & Parallel Calculations.
 */
import { svg, comp, wire, dot, label } from '../js/utils/svg.js';

const r = String.raw;

const SERIES3 = svg(420, 170, [
  comp('battery', 40, 140, 40, 40, { signs: true, label: '12 V', labelPos: 'left' }), wire([40, 40], [70, 40]),
  comp('resistor', 70, 40, 160, 40, { label: 'R₁ = 2.0 Ω' }), comp('resistor', 160, 40, 250, 40, { label: 'R₂ = 4.0 Ω' }), comp('resistor', 250, 40, 340, 40, { label: 'R₃ = 6.0 Ω' }),
  wire([340, 40], [370, 40], [370, 140], [40, 140]),
].join(''), { title: 'Three resistors in series with a 12 V battery', maxw: 460 });

const PAR3 = svg(420, 200, [
  comp('battery', 40, 170, 40, 40, { signs: true, label: '12 V', labelPos: 'left' }), wire([40, 40], [340, 40]),
  comp('resistor', 140, 40, 140, 170, { label: '6.0 Ω', labelPos: 'right' }), comp('resistor', 240, 40, 240, 170, { label: '12 Ω', labelPos: 'right' }), comp('resistor', 340, 40, 340, 170, { label: '4.0 Ω', labelPos: 'right' }),
  wire([40, 170], [340, 170]), dot(140, 40), dot(240, 40), dot(140, 170), dot(240, 170),
].join(''), { title: 'Three resistors in parallel with a 12 V battery', maxw: 460 });

const MIX1 = svg(420, 200, [
  comp('battery', 40, 170, 40, 50, { signs: true, label: '12 V', labelPos: 'left' }), wire([40, 50], [70, 50]), comp('resistor', 70, 50, 160, 50, { label: 'R₁ = 4.0 Ω' }),
  wire([160, 50], [200, 50]), comp('resistor', 200, 50, 320, 50, { label: 'R₂ = 12 Ω' }), wire([320, 50], [360, 50], [360, 170], [40, 170]),
  wire([180, 50], [180, 115], [200, 115]), comp('resistor', 200, 115, 320, 115, { label: 'R₃ = 6.0 Ω', labelPos: 'below' }), wire([320, 115], [360, 115]), dot(180, 50), dot(360, 115),
].join(''), { title: 'R1 in series with R2 and R3 in parallel, 12 V battery', maxw: 460 });

const MIX2 = svg(420, 200, [
  comp('battery', 40, 170, 40, 40, { signs: true, label: '9.0 V', labelPos: 'left' }), wire([40, 40], [70, 40]), comp('resistor', 70, 40, 180, 40, { label: 'R₁ = 10 Ω' }), comp('resistor', 180, 40, 290, 40, { label: 'R₂ = 20 Ω' }),
  wire([290, 40], [330, 40], [330, 170], [40, 170]), wire([55, 40], [55, 110], [120, 110]), comp('resistor', 120, 110, 240, 110, { label: 'R₃ = 15 Ω', labelPos: 'below' }), wire([240, 110], [330, 110]), dot(55, 40), dot(330, 110),
].join(''), { title: 'R1 and R2 in series, that pair in parallel with R3, 9.0 V battery', maxw: 460 });

const SWITCHED = svg(420, 200, [
  comp('battery', 40, 170, 40, 40, { signs: true, label: '6.0 V', labelPos: 'left' }), wire([40, 40], [70, 40]), comp('resistor', 70, 40, 170, 40, { label: 'R₁ = 10 Ω' }),
  wire([170, 40], [320, 40]), wire([320, 170], [40, 170]), comp('resistor', 210, 40, 210, 170, { label: 'R₂ = 10 Ω', labelPos: 'right' }),
  wire([320, 40], [320, 60]), comp('switch-open', 320, 60, 320, 100, { label: 'S', labelPos: 'right' }), comp('resistor', 320, 100, 320, 170, { label: 'R₃ = 10 Ω', labelPos: 'right' }), dot(210, 40), dot(210, 170),
].join(''), { title: 'R1 in series with R2 and a switched R3 in parallel', maxw: 460 });

const SHORTED = svg(420, 170, [
  comp('battery', 40, 140, 40, 40, { signs: true, label: '9.0 V', labelPos: 'left' }), wire([40, 40], [80, 40]), comp('bulb', 80, 40, 180, 40, { label: 'A', lit: 0.5 }), comp('bulb', 220, 40, 320, 40, { label: 'B', lit: 0.5 }),
  wire([180, 40], [220, 40]), wire([320, 40], [360, 40], [360, 140], [40, 140]),
  wire([200, 40], [200, 90], [240, 90]), comp('switch-open', 240, 90, 300, 90, { label: 'S', labelPos: 'below' }), wire([300, 90], [340, 90], [340, 40]), dot(200, 40), dot(340, 40),
].join(''), { title: 'Two bulbs in series; closing switch S connects a wire across bulb B', maxw: 460 });

export default {
  intro: 'With V = IR and the series and parallel rules, you can now work out every current and voltage in any combination of resistors. This chapter builds the method step by step — total resistance first, then the current, then each voltage — and finishes with the reasoning needed for Merit and Excellence “what happens if…” questions.',
  standards: 'NCEA Level 1 (series and parallel circuits) and NCEA Level 2 AS 91173: the formulas for series and parallel resistance are on the formula sheet, and multi-step circuit questions appear every year.',
  lessons: [
    // ------------------------------------------------------------------ 6.1
    {
      id: '6.1', title: 'Total resistance in series', levels: ['L1', 'L2'], minutes: 14,
      objectives: ['Derive and use R_T = R₁ + R₂ + …', 'Explain why adding a series resistor reduces the current'],
      sections: [
        { type: 'text', title: 'Where the formula comes from', html: r`<p>In series, the same current $I$ flows through every resistor, and the voltages add up to the supply: $V = V_1 + V_2 + V_3$.</p>
<p>Write each voltage as $IR$: $\;IR_T = IR_1 + IR_2 + IR_3$. Divide every term by $I$:</p>
<p>$$R_T = R_1 + R_2 + R_3 + \dots$$</p>
<p>So in series, resistances simply <b>add up</b>. That matches the particle picture: a longer path with more obstacles.</p>` },
        { type: 'diagram', svg: SERIES3, caption: 'R_T = 2.0 + 4.0 + 6.0 = 12 Ω, so I = 12 V ÷ 12 Ω = 1.0 A.' },
        { type: 'example', title: 'three in series', q: r`<p>For the circuit above, find the total resistance and the current from the battery.</p>`, steps: [r`$R_T = 2.0 + 4.0 + 6.0 = 12\ \Omega$.`, r`$I = \dfrac{V}{R_T} = \dfrac{12}{12} = 1.0$ A.`], answer: '<p>12 Ω and 1.0 A. The same 1.0 A flows through every resistor.</p>' },
        { type: 'text', title: 'Adding a resistor in series', html: r`<p>Every extra series resistor <b>increases the total resistance</b>, so for the same supply voltage the <b>current decreases</b> everywhere in the loop. The total is always larger than the largest single resistor.</p>` },
        { type: 'example', title: 'finding a missing resistor', q: r`<p>A 9.0 V battery drives 0.30 A through a 12 Ω resistor and an unknown resistor in series. Find the unknown resistance.</p>`, steps: [r`Total resistance: $R_T = \dfrac{V}{I} = \dfrac{9.0}{0.30} = 30\ \Omega$.`, r`$R_T = 12 + R_x$, so $R_x = 30 - 12 = 18\ \Omega$.`], answer: '<p>18 Ω.</p>' },
        { type: 'try', question: { type: 'num', q: 'Resistors of 15 Ω, 25 Ω and 60 Ω are in series. What is the total resistance?', answer: 100, unit: 'Ω', explain: '15 + 25 + 60 = 100 Ω.' } },
        { type: 'key', points: [r`Series: $R_T = R_1 + R_2 + \dots$`, 'Derived from V = V₁ + V₂ with the same current through each.', 'Adding a series resistor → larger R_T → smaller current.', 'R_T is bigger than the biggest resistor.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'What is the total resistance of 3.3 Ω and 4.7 Ω in series?', answer: 8, unit: 'Ω', explain: '3.3 + 4.7 = 8.0 Ω.' },
        { type: 'num', q: 'A 6.0 V battery is connected to 5.0 Ω and 15 Ω in series. What current flows?', answer: 0.3, unit: 'A', explain: 'R_T = 20 Ω; I = 6.0 ÷ 20 = 0.30 A.' },
        { type: 'num', q: 'A 24 V supply drives 0.40 A through a 40 Ω resistor and an unknown resistor in series. Find the unknown resistance.', answer: 20, unit: 'Ω', explain: 'R_T = 24 ÷ 0.40 = 60 Ω; R = 60 − 40 = 20 Ω.' },
        { type: 'mcq', q: 'A third resistor is added in series with two others. What happens to the current from the battery?', options: ['It decreases', 'It increases', 'It stays the same', 'It becomes zero'], answer: 0, explain: 'Total resistance increases, so I = V/R_T decreases.' },
        { type: 'num', q: 'Ten identical 22 Ω resistors are connected in series. What is the total resistance?', answer: 220, unit: 'Ω', explain: '10 × 22 = 220 Ω.' },
      ],
    },
    // ------------------------------------------------------------------ 6.2
    {
      id: '6.2', title: 'Total resistance in parallel', levels: ['L1', 'L2'], minutes: 20,
      objectives: ['Derive and use 1/R_T = 1/R₁ + 1/R₂ + …', 'Use the product-over-sum and equal-resistor shortcuts', 'Explain why adding a branch lowers the total resistance'],
      sections: [
        { type: 'text', title: 'Where the formula comes from', html: r`<p>In parallel, every branch has the same voltage $V$, and the branch currents add up: $I = I_1 + I_2 + I_3$.</p>
<p>Write each current as $V/R$: $\;\dfrac{V}{R_T} = \dfrac{V}{R_1} + \dfrac{V}{R_2} + \dfrac{V}{R_3}$. Divide every term by $V$:</p>
<p>$$\frac{1}{R_T} = \frac{1}{R_1} + \frac{1}{R_2} + \frac{1}{R_3} + \dots$$</p>` },
        { type: 'maths', title: 'adding reciprocals', link: '0.3', html: r`<p>A <b>reciprocal</b> is 1 divided by a number. The formula gives you $1/R_T$, so the <b>last step is always to flip it</b>: $R_T = 1 \div (\text{your total})$.</p>
<p><b>By fractions:</b> for 6 Ω and 12 Ω, $\dfrac{1}{6} + \dfrac{1}{12} = \dfrac{2}{12} + \dfrac{1}{12} = \dfrac{3}{12} = \dfrac{1}{4}$, so $R_T = 4\ \Omega$.</p>
<p><b>By calculator:</b> use the $x^{-1}$ key: <code>6 x⁻¹ + 12 x⁻¹ = x⁻¹</code> → 4. Forgetting the final <code>x⁻¹</code> is the most common mistake: it would give 0.25, which is $1/R_T$, not $R_T$.</p>` },
        { type: 'text', title: 'Shortcuts', html: r`<ul><li><b>Two resistors:</b> $R_T = \dfrac{R_1 R_2}{R_1 + R_2}$ (“product over sum”). For 6 Ω and 12 Ω: $\dfrac{72}{18} = 4\ \Omega$.</li><li><b>$n$ identical resistors $R$:</b> $R_T = \dfrac{R}{n}$. Two 10 Ω resistors in parallel give 5 Ω; five give 2 Ω.</li><li><b>Check:</b> the total is always <b>smaller than the smallest</b> branch. If your answer is bigger, you forgot to flip.</li></ul>` },
        { type: 'sim', sim: 'resistance-builder', caption: 'Choose Parallel, then add resistors. Watch the total fall below the smallest one every time.' },
        { type: 'text', title: 'Why more branches mean less resistance', html: r`<p>Each new branch is an extra path for the charge, like opening another checkout at the supermarket. More charge can flow for the same voltage, so the total current goes up and the total resistance goes down — even if the new branch has a large resistance.</p>` },
        { type: 'diagram', svg: PAR3, caption: 'Three branches: 6.0 Ω, 12 Ω and 4.0 Ω.' },
        { type: 'example', title: 'three in parallel', q: r`<p>Find the total resistance of the circuit above and the current from the battery.</p>`, steps: [r`$\dfrac{1}{R_T} = \dfrac{1}{6.0} + \dfrac{1}{12} + \dfrac{1}{4.0} = 0.1667 + 0.0833 + 0.25 = 0.50\ \Omega^{-1}$.`, r`$R_T = \dfrac{1}{0.50} = 2.0\ \Omega$.`, r`$I = \dfrac{V}{R_T} = \dfrac{12}{2.0} = 6.0$ A.`, r`Check: branch currents $\dfrac{12}{6} + \dfrac{12}{12} + \dfrac{12}{4} = 2 + 1 + 3 = 6$ A ✓.`], answer: '<p>2.0 Ω and 6.0 A.</p>' },
        { type: 'try', question: { type: 'num', q: 'What is the total resistance of 20 Ω and 30 Ω in parallel?', answer: 12, unit: 'Ω', explain: 'Product over sum: 600 ÷ 50 = 12 Ω.' } },
        { type: 'misconception', wrong: '1/R_T = 1/6 + 1/12 = 0.25, so the total resistance is 0.25 Ω.', right: '0.25 is 1/R_T. Flip it: R_T = 1/0.25 = 4 Ω. Always check the answer is smaller than the smallest resistor but not absurdly small.' },
        { type: 'funfact', title: 'your body in parallel', html: 'If you touch a live wire with both hands, the two arms form parallel paths, lowering the resistance of your body and increasing the current. Electricians work with one hand when they can, and this is one reason RCD safety switches are so important.' },
        { type: 'key', points: [r`Parallel: $\dfrac{1}{R_T} = \dfrac{1}{R_1} + \dfrac{1}{R_2} + \dots$ — then flip.`, r`Two resistors: $R_T = \dfrac{R_1R_2}{R_1+R_2}$. Identical: $R/n$.`, 'R_T is smaller than the smallest branch.', 'Adding a branch lowers R_T and raises the total current.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'Two 8.0 Ω resistors are connected in parallel. What is the total resistance?', answer: 4, unit: 'Ω', explain: 'Identical: R/n = 8.0 ÷ 2 = 4.0 Ω.' },
        { type: 'num', q: 'Find the total resistance of 4.0 Ω and 12 Ω in parallel.', answer: 3, unit: 'Ω', explain: '48 ÷ 16 = 3.0 Ω.' },
        { type: 'num', q: 'Find the total resistance of 10 Ω, 20 Ω and 20 Ω in parallel.', answer: 5, unit: 'Ω', explain: '1/10 + 1/20 + 1/20 = 0.2; R_T = 5.0 Ω.' },
        { type: 'mcq', q: 'A 100 Ω resistor is connected in parallel with a 1 Ω resistor. The total resistance is…', options: ['slightly less than 1 Ω', 'slightly more than 1 Ω', 'about 50 Ω', '101 Ω'], answer: 0, explain: 'Parallel total is less than the smallest: 100/101 ≈ 0.99 Ω.' },
        { type: 'mcq', q: 'Another resistor is connected in parallel with an existing one. The total current from the battery…', options: ['increases', 'decreases', 'stays the same', 'drops to zero'], answer: 0, explain: 'An extra path lowers R_T, so more current flows.' },
        { type: 'num', q: 'How many 60 Ω resistors must be connected in parallel to make 15 Ω?', answer: 4, explain: 'R/n = 15 → n = 60/15 = 4.' },
      ],
    },
    // ------------------------------------------------------------------ 6.3
    {
      id: '6.3', title: 'Solving series circuits step by step', levels: ['L1', 'L2'], minutes: 18,
      objectives: ['Find every current and voltage in a series circuit', 'Use the voltage-sharing ratio', 'Check answers with the series rules'],
      sections: [
        { type: 'text', title: 'The method', html: r`<ol><li>Find the total resistance: $R_T = R_1 + R_2 + \dots$</li><li>Find the current: $I = V/R_T$. It is the same through every component.</li><li>Find each voltage: $V_1 = IR_1$, $V_2 = IR_2$, …</li><li>Check: the voltages add up to the supply.</li></ol>` },
        { type: 'example', title: 'complete analysis', q: r`<p>A 12 V battery is connected in series with resistors of 2.0 Ω, 4.0 Ω and 6.0 Ω. Find the current and the voltage across each resistor.</p>`, steps: [r`$R_T = 2.0 + 4.0 + 6.0 = 12\ \Omega$.`, r`$I = \dfrac{12}{12} = 1.0$ A through every resistor.`, r`$V_1 = 1.0 \times 2.0 = 2.0$ V; $V_2 = 1.0 \times 4.0 = 4.0$ V; $V_3 = 1.0 \times 6.0 = 6.0$ V.`, r`Check: $2.0 + 4.0 + 6.0 = 12$ V ✓.`], answer: '<p>1.0 A; 2.0 V, 4.0 V and 6.0 V.</p>' },
        { type: 'text', title: 'Voltage shares in proportion to resistance', html: r`<p>Because the current is the same, $V \propto R$ in a series circuit: a resistor with twice the resistance gets twice the voltage. For two resistors:</p>
<p>$$\frac{V_1}{V_2} = \frac{R_1}{R_2} \qquad\text{and}\qquad V_1 = V \times \frac{R_1}{R_1 + R_2}$$</p>
<p>This is the <b>voltage divider</b> idea — it lets you find a voltage without finding the current, and it is the basis of sensor circuits (Chapter 11).</p>` },
        { type: 'example', title: 'using the ratio', q: r`<p>A 9.0 V battery is connected to a 1.0 kΩ and a 2.0 kΩ resistor in series. Find the voltage across the 2.0 kΩ resistor.</p>`, steps: [r`Total: $1.0 + 2.0 = 3.0$ kΩ.`, r`The 2.0 kΩ resistor has $\dfrac{2.0}{3.0}$ of the total resistance.`, r`$V_2 = 9.0 \times \dfrac{2.0}{3.0} = 6.0$ V.`], answer: '<p>6.0 V (and 3.0 V across the 1.0 kΩ resistor).</p>' },
        { type: 'sim', sim: 'circuit-solver', caption: 'Choose Series. Work out I, V₁ and V₂ on paper, then reveal the steps to check.' },
        { type: 'example', title: 'working backwards', q: r`<p>A lamp and a 15 Ω resistor are in series with a 6.0 V battery. The voltage across the resistor is 4.5 V. Find the current and the lamp’s resistance.</p>`, steps: [r`Current from the resistor: $I = \dfrac{4.5}{15} = 0.30$ A (same through the lamp).`, r`Lamp voltage: $6.0 - 4.5 = 1.5$ V.`, r`Lamp resistance: $R = \dfrac{1.5}{0.30} = 5.0\ \Omega$.`], answer: '<p>0.30 A and 5.0 Ω.</p>' },
        { type: 'try', question: { type: 'num', q: 'A 10 Ω and a 30 Ω resistor are in series with a 12 V battery. What is the voltage across the 30 Ω resistor?', answer: 9, unit: 'V', explain: '12 × 30/40 = 9.0 V (or I = 0.30 A, V = 0.30 × 30 = 9.0 V).' } },
        { type: 'key', points: ['Series method: R_T → I → each V → check the sum.', 'Same current everywhere; V ∝ R.', r`$V_1 = V \times \dfrac{R_1}{R_1+R_2}$.`] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 20 Ω and a 40 Ω resistor are in series with a 12 V battery. Find the current.', answer: 0.2, unit: 'A', explain: 'R_T = 60 Ω; I = 12/60 = 0.20 A.' },
        { type: 'num', q: 'For the circuit in the last question, find the voltage across the 40 Ω resistor.', answer: 8, unit: 'V', explain: 'V = IR = 0.20 × 40 = 8.0 V.' },
        { type: 'num', q: 'A 4.7 kΩ and a 4.7 kΩ resistor are in series with a 5.0 V supply. What is the voltage across each?', answer: 2.5, unit: 'V', explain: 'Equal resistors share equally: 2.5 V each.' },
        { type: 'num', q: 'A resistor R and a 6.0 Ω resistor are in series with 9.0 V. The current is 0.50 A. Find R.', answer: 12, unit: 'Ω', explain: 'R_T = 9.0/0.50 = 18 Ω; R = 18 − 6.0 = 12 Ω.' },
        { type: 'mcq', q: 'In a series circuit, R₁ = 3R₂. How do the voltages compare?', options: ['V₁ = 3V₂', 'V₂ = 3V₁', 'V₁ = V₂', 'V₁ = V₂/3'], answer: 0, explain: 'Same current, so V ∝ R.' },
      ],
    },
    // ------------------------------------------------------------------ 6.4
    {
      id: '6.4', title: 'Solving parallel circuits step by step', levels: ['L1', 'L2'], minutes: 18,
      objectives: ['Find every branch current and the total current', 'Explain how current divides between branches', 'Find an unknown branch resistance'],
      sections: [
        { type: 'text', title: 'The method', html: r`<ol><li>Every branch has the full supply voltage (for an ideal battery and no series resistor).</li><li>Find each branch current: $I_1 = V/R_1$, $I_2 = V/R_2$, …</li><li>Add them for the total current: $I = I_1 + I_2 + \dots$</li><li>Check with the total resistance: $I = V/R_T$.</li></ol>
<p>In parallel you often do not need $R_T$ at all — branch currents are quicker.</p>` },
        { type: 'example', title: 'complete analysis', q: r`<p>A 12 V battery is connected to 6.0 Ω, 12 Ω and 4.0 Ω resistors in parallel. Find each branch current and the total current.</p>`, steps: [r`Each branch has 12 V across it.`, r`$I_1 = \dfrac{12}{6.0} = 2.0$ A; $I_2 = \dfrac{12}{12} = 1.0$ A; $I_3 = \dfrac{12}{4.0} = 3.0$ A.`, r`Total: $I = 2.0 + 1.0 + 3.0 = 6.0$ A.`, r`Check: $R_T = 2.0\ \Omega$ (Lesson 6.2) and $12 \div 2.0 = 6.0$ A ✓.`], answer: '<p>2.0 A, 1.0 A and 3.0 A; total 6.0 A.</p>' },
        { type: 'text', title: 'How the current divides', html: r`<p>In parallel the voltage is the same, so $I \propto 1/R$: the branch with <b>half</b> the resistance takes <b>twice</b> the current. For two branches:</p>
<p>$$\frac{I_1}{I_2} = \frac{R_2}{R_1} \qquad\text{and}\qquad I_1 = I \times \frac{R_2}{R_1 + R_2}$$</p>
<p>Notice the “other” resistance goes on top — the opposite of the series voltage rule.</p>` },
        { type: 'example', title: 'current divider', q: r`<p>A total current of 0.90 A splits between a 20 Ω and a 40 Ω resistor in parallel. Find the current in each.</p>`, steps: [r`The 20 Ω branch has half the resistance, so it takes twice the current: the currents are in the ratio 2 : 1.`, r`$I_{20} = 0.90 \times \dfrac{40}{20 + 40} = 0.60$ A.`, r`$I_{40} = 0.90 - 0.60 = 0.30$ A.`], answer: '<p>0.60 A through 20 Ω; 0.30 A through 40 Ω.</p>' },
        { type: 'example', title: 'unknown branch', q: r`<p>A 6.0 V battery supplies 0.75 A to a 12 Ω resistor and an unknown resistor in parallel. Find the unknown resistance.</p>`, steps: [r`Current in the 12 Ω branch: $\dfrac{6.0}{12} = 0.50$ A.`, r`Unknown branch: $0.75 - 0.50 = 0.25$ A.`, r`$R = \dfrac{6.0}{0.25} = 24\ \Omega$.`], answer: '<p>24 Ω.</p>' },
        { type: 'sim', sim: 'circuit-solver', caption: 'Choose Parallel. Predict the branch currents, then reveal the steps.' },
        { type: 'try', question: { type: 'num', q: 'A 9.0 V battery is connected to 3.0 Ω and 9.0 Ω resistors in parallel. What is the total current?', answer: 4, unit: 'A', explain: '9/3 + 9/9 = 3.0 + 1.0 = 4.0 A.' } },
        { type: 'key', points: ['Parallel method: same V on each branch → I = V/R for each → add.', 'I ∝ 1/R: smaller resistance, bigger current.', r`$I_1 = I \times \dfrac{R_2}{R_1+R_2}$.`] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 24 V supply is connected to 8.0 Ω and 12 Ω in parallel. What current flows through the 8.0 Ω resistor?', answer: 3, unit: 'A', explain: 'I = 24/8.0 = 3.0 A.' },
        { type: 'num', q: 'For the circuit in the last question, what is the total current?', answer: 5, unit: 'A', explain: '3.0 + 24/12 = 3.0 + 2.0 = 5.0 A.' },
        { type: 'num', q: 'A total of 1.2 A divides between 10 Ω and 30 Ω in parallel. What current flows through the 30 Ω resistor?', answer: 0.3, unit: 'A', explain: 'I₃₀ = 1.2 × 10/40 = 0.30 A.' },
        { type: 'num', q: 'A 12 V battery supplies 2.0 A to a 10 Ω resistor and an unknown resistor in parallel. Find the unknown resistance.', answer: 15, unit: 'Ω', explain: 'I₁₀ = 1.2 A; unknown branch 0.80 A; R = 12/0.80 = 15 Ω.' },
        { type: 'mcq', q: 'In a parallel circuit, branch A has twice the resistance of branch B. Then…', options: ['B carries twice the current of A', 'A carries twice the current of B', 'they carry equal currents', 'A has twice the voltage of B'], answer: 0, explain: 'Same voltage; I ∝ 1/R.' },
      ],
    },
    // ------------------------------------------------------------------ 6.5
    {
      id: '6.5', title: 'Mixed circuits', levels: ['L2'], minutes: 22,
      objectives: ['Reduce a mixed circuit to a single resistance', 'Work back out to find every current and voltage', 'Check answers with the junction and loop rules'],
      sections: [
        { type: 'text', title: 'The strategy: reduce, then expand', html: r`<ol><li><b>Spot the groups.</b> Find resistors that are purely in parallel (both ends joined) or purely in series (one after another with no junction between).</li><li><b>Reduce.</b> Replace each group with its single equivalent resistance, redrawing if it helps. Repeat until one resistance is left.</li><li><b>Total current:</b> $I = V/R_T$.</li><li><b>Expand back out.</b> Use the total current and V = IR on the simplified circuit, then return to the original groups to find each branch.</li><li><b>Check</b> that currents at each junction add up, and that voltages round each loop add up to the supply.</li></ol>` },
        { type: 'diagram', svg: MIX1, caption: 'R₂ and R₃ are in parallel; that pair is in series with R₁.' },
        { type: 'example', title: 'series + parallel pair', q: r`<p>Find all the currents and voltages in the circuit above.</p>`, steps: [r`Parallel pair: $R_{23} = \dfrac{12 \times 6.0}{12 + 6.0} = 4.0\ \Omega$.`, r`Total: $R_T = 4.0 + 4.0 = 8.0\ \Omega$; current $I = \dfrac{12}{8.0} = 1.5$ A (all through R₁).`, r`$V_1 = 1.5 \times 4.0 = 6.0$ V, so the pair has $12 - 6.0 = 6.0$ V across it.`, r`$I_2 = \dfrac{6.0}{12} = 0.50$ A; $I_3 = \dfrac{6.0}{6.0} = 1.0$ A. Check: $0.50 + 1.0 = 1.5$ A ✓.`], answer: '<p>R₁: 1.5 A, 6.0 V. R₂: 0.50 A, 6.0 V. R₃: 1.0 A, 6.0 V.</p>' },
        { type: 'diagram', svg: MIX2, caption: 'R₁ and R₂ form one branch; R₃ is the other branch.' },
        { type: 'example', title: 'series pair in parallel', q: r`<p>Find the current in each resistor and the voltage across R₂ in the circuit above.</p>`, steps: [r`Top branch: $R_{12} = 10 + 20 = 30\ \Omega$, with the full 9.0 V across it.`, r`Top current: $I_{12} = \dfrac{9.0}{30} = 0.30$ A through both R₁ and R₂; $V_2 = 0.30 \times 20 = 6.0$ V.`, r`Bottom branch: $I_3 = \dfrac{9.0}{15} = 0.60$ A.`, r`Total: $0.30 + 0.60 = 0.90$ A. Check: $R_T = \dfrac{30 \times 15}{45} = 10\ \Omega$ and $\dfrac{9.0}{10} = 0.90$ A ✓.`], answer: '<p>R₁ and R₂: 0.30 A each (V₂ = 6.0 V). R₃: 0.60 A. Total 0.90 A.</p>' },
        { type: 'sim', sim: 'circuit-solver', caption: 'Try both mixed layouts with your own values. Always predict before you reveal.' },
        { type: 'tip', html: 'Label your diagram as you go: write the current next to every wire and the voltage next to every resistor. Most mistakes come from using the supply voltage for a resistor that only has part of it.' },
        { type: 'misconception', wrong: 'In a mixed circuit, every resistor has the full battery voltage across it.', right: 'Only components connected directly across the battery have the full voltage. Any resistor in series with the battery takes a share first, so the parallel part gets what is left.' },
        { type: 'exam', standard: 'NCEA Level 2, AS 91173', html: '<p>Mixed-circuit questions are usually split into parts: total resistance (Achieved), current or a single voltage (Merit), and a full chain or a change to the circuit (Excellence). Show every step with a formula, substitution and unit so each part can earn credit.</p>' },
        { type: 'key', points: ['Reduce: replace parallel groups and series groups with single resistances.', 'Total current from V/R_T, then expand back out with V = IR.', 'Parallel parts share one voltage; series parts share one current.', 'Check the junction and loop rules at the end.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 6.0 Ω resistor is in series with two 12 Ω resistors that are in parallel with each other. What is the total resistance?', answer: 12, unit: 'Ω', explain: 'Parallel pair = 6.0 Ω; total = 6.0 + 6.0 = 12 Ω.' },
        { type: 'num', q: 'The circuit in the last question is connected to 24 V. What current flows through one of the 12 Ω resistors?', answer: 1, unit: 'A', explain: 'I_total = 24/12 = 2.0 A; it splits equally: 1.0 A each.' },
        { type: 'num', q: 'In MIX1 (12 V; R₁ = 4.0 Ω; R₂ = 12 Ω ∥ R₃ = 6.0 Ω), what would the total current be if R₁ were 8.0 Ω instead?', answer: 1, unit: 'A', explain: 'R_T = 8.0 + 4.0 = 12 Ω; I = 12/12 = 1.0 A.', figure: MIX1 },
        { type: 'num', q: 'In MIX2 (9.0 V; R₁ = 10 Ω and R₂ = 20 Ω in series, in parallel with R₃ = 15 Ω), what is the voltage across R₁?', answer: 3, unit: 'V', explain: 'Top branch current 0.30 A; V₁ = 0.30 × 10 = 3.0 V.', figure: MIX2 },
        { type: 'mcq', q: 'In a mixed circuit, which resistor always carries the total current?', options: ['One in series with the battery, outside any parallel group', 'The largest resistor', 'The smallest resistor', 'Any resistor in a parallel branch'], answer: 0, explain: 'All the current must pass through a component in series with the supply.' },
      ],
    },
    // ------------------------------------------------------------------ 6.6
    {
      id: '6.6', title: 'What happens if…? Explaining changes in circuits', levels: ['L2'], minutes: 20,
      objectives: ['Predict how currents, voltages and brightness change when a circuit is altered', 'Write a linked chain of reasoning', 'Support explanations with calculations'],
      sections: [
        { type: 'text', title: 'The chain', html: r`<p>Excellence questions ask you to explain the effect of a change — closing a switch, adding a resistor, a bulb blowing. Good answers follow a chain, one link at a time, with a reason for each:</p>
<p><b>change → total resistance → total current → voltages → each current → brightness/power</b></p>
<p>The battery voltage is (usually) fixed, so start from what the change does to the <b>total resistance</b>.</p>` },
        { type: 'diagram', svg: SWITCHED, caption: 'With S open: R₁ in series with R₂. Closing S adds R₃ in parallel with R₂.' },
        { type: 'example', title: 'closing a switch, with numbers', q: r`<p>In the circuit above (all resistors 10 Ω, 6.0 V battery), switch S is closed. Explain what happens to the current through R₁ and the voltage across R₂.</p>`, steps: [r`<b>Before</b> (S open): $R_T = 10 + 10 = 20\ \Omega$; $I = 6.0/20 = 0.30$ A; $V_1 = 3.0$ V; $V_2 = 3.0$ V.`, r`<b>Closing S</b> adds a parallel branch, so the parallel part drops from 10 Ω to 5.0 Ω and $R_T = 10 + 5.0 = 15\ \Omega$.`, r`Total current rises: $I = 6.0/15 = 0.40$ A, all through R₁, so $V_1 = 0.40 \times 10 = 4.0$ V.`, r`The parallel part gets the rest: $V_2 = 6.0 - 4.0 = 2.0$ V, so the current through R₂ falls from 0.30 A to 0.20 A.`], answer: '<p>The current through R₁ increases (0.30 → 0.40 A) because the total resistance falls. R₁ takes a bigger share of the voltage, so the voltage across R₂ decreases (3.0 → 2.0 V) and less current flows through R₂.</p>' },
        { type: 'text', title: 'Short circuits', html: r`<p>A wire connected across a component gives charge a path with (almost) zero resistance, so the component is <b>shorted out</b>: it has 0 V across it and no current through it. The rest of the circuit now has less total resistance, so the current increases.</p>` },
        { type: 'diagram', svg: SHORTED, caption: 'Closing S puts a wire across bulb B.' },
        { type: 'example', title: 'shorting a bulb', q: r`<p>Two identical bulbs A and B are in series with a 9.0 V battery. Closing switch S connects a wire across bulb B. Explain what happens to each bulb.</p>`, steps: [r`Before: the bulbs share the voltage, 4.5 V each.`, r`Closing S: current takes the zero-resistance wire instead of bulb B, so B has 0 V and goes <b>out</b>.`, r`The total resistance is now just bulb A, about half what it was, so the current roughly doubles.`, r`Bulb A now has the full 9.0 V (instead of 4.5 V) and more current, so A gets <b>much brighter</b> (and may blow).`], answer: '<p>B goes out; A gets much brighter.</p>' },
        { type: 'text', title: 'Brightness and power', html: r`<p>Brightness depends on the rate of energy transfer, which needs <b>both</b> voltage and current ($P = VI$, Chapter 7). A bulb with more voltage across it <b>and</b> more current through it is brighter. Avoid saying a bulb is brighter just because “it gets more current first” — in a series circuit the current is the same everywhere, whatever the order.</p>` },
        { type: 'misconception', wrong: 'Closing a switch to add a parallel branch takes current away from the other branch, so the total current falls.', right: 'Adding a branch lowers the total resistance, so the total current rises. Any branch that is directly across the battery keeps the same current; only branches sharing voltage with a series resistor lose out.' },
        { type: 'exam', standard: 'NCEA Level 2, AS 91173 — Excellence', html: '<p>To reach Excellence, make every link explicit (“because…, so…”), mention what is constant (usually the supply voltage), and use numbers where you can. A short calculation before and after the change is the clearest evidence.</p>' },
        { type: 'key', points: ['Chain: change → R_T → I_total → voltage shares → branch currents → brightness.', 'Adding a parallel branch: R_T falls, I_total rises.', 'Adding a series resistor: R_T rises, I_total falls.', 'Shorted component: 0 V, no current; the rest gets more.', 'Brightness needs both V and I (power).'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'A resistor is added in parallel with one already connected directly across a battery. What happens to the current through the original resistor?', options: ['It stays the same', 'It increases', 'It decreases', 'It becomes zero'], answer: 0, explain: 'It still has the full battery voltage across it, so its current is unchanged. The total current rises.' },
        { type: 'mcq', q: 'In SWITCHED, closing S makes the current through R₁…', options: ['increase', 'decrease', 'stay the same', 'drop to zero'], answer: 0, explain: 'Total resistance falls (20 → 15 Ω), so total current rises, and it all flows through R₁.', figure: SWITCHED },
        { type: 'num', q: 'In SWITCHED (6.0 V, all resistors 10 Ω), what is the current through R₃ after S is closed?', answer: 0.2, unit: 'A', explain: 'V across the parallel pair = 2.0 V; I₃ = 2.0/10 = 0.20 A.', figure: SWITCHED },
        { type: 'mcq', q: 'A wire is connected across one of two identical bulbs in series. The other bulb…', options: ['gets brighter', 'gets dimmer', 'goes out', 'stays the same'], answer: 0, explain: 'It now gets the full voltage and more current.' },
        { type: 'explain', q: 'Two identical bulbs are in parallel with a battery. A third identical bulb is added in parallel. Explain what happens to the brightness of the first two bulbs and to the total current.', model: '<p>Each bulb is on its own branch connected directly across the battery, so each still has the full battery voltage and the same current through it. Their brightness does not change. The new branch provides an extra path, so the total resistance falls and the total current from the battery increases (by one bulb’s current, to 1.5 times the previous value).</p>', points: [{ lvl: 'A', text: 'First two bulbs stay the same brightness' }, { lvl: 'M', text: 'They still have the full battery voltage' }, { lvl: 'M', text: 'Total resistance falls, so total current increases' }] },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'Calculate the total resistance of 12 Ω, 18 Ω and 30 Ω in series.', answer: 60, unit: 'Ω', explain: '12 + 18 + 30 = 60 Ω.' },
      { type: 'num', q: 'Calculate the total resistance of 6.0 Ω and 3.0 Ω in parallel.', answer: 2, unit: 'Ω', explain: '18 ÷ 9 = 2.0 Ω.' },
      { type: 'num', q: 'A 12 V battery is connected to two 4.0 Ω resistors in series. What current flows?', answer: 1.5, unit: 'A', explain: 'R_T = 8.0 Ω; I = 12/8.0 = 1.5 A.' },
      { type: 'num', q: 'A 9.0 V battery is connected to 18 Ω and 9.0 Ω in parallel. What current flows through the 18 Ω resistor?', answer: 0.5, unit: 'A', explain: 'I = 9.0/18 = 0.50 A.' },
      { type: 'mcq', q: 'Which arrangement of two 10 Ω resistors has the smaller total resistance?', options: ['Parallel (5 Ω)', 'Series (20 Ω)', 'They are the same', 'It depends on the battery'], answer: 0, explain: 'Parallel: R/n = 5 Ω.' },
    ],
    M: [
      { type: 'num', q: 'A 2.0 Ω resistor is in series with a parallel pair of 6.0 Ω and 3.0 Ω, connected to a 12 V battery. Find the total current.', answer: 3, unit: 'A', explain: 'Pair = 2.0 Ω; R_T = 4.0 Ω; I = 12/4.0 = 3.0 A.' },
      { type: 'num', q: 'For the circuit in the last question, find the current through the 3.0 Ω resistor.', answer: 2, unit: 'A', explain: 'V across the pair = 3.0 × 2.0 = 6.0 V; I = 6.0/3.0 = 2.0 A.' },
      { type: 'num', q: 'A 5.0 V supply is connected to a 330 Ω resistor and an LED in series. The LED has 2.0 V across it. What current flows? Give your answer in mA.', answer: 9.09, unit: 'mA', explain: 'V_R = 5.0 − 2.0 = 3.0 V; I = 3.0/330 = 0.00909 A = 9.1 mA.' },
      { type: 'explain', q: 'Explain why the total resistance of two resistors in parallel is less than either resistor on its own.', model: '<p>Each resistor provides a separate path between the same two points, and each has the full voltage across it. The current through each resistor is the same as if it were alone, so the total current is the sum of both currents — larger than the current through either one alone. For the same voltage, a larger current means a smaller resistance (R = V/I), so the combination has less resistance than either resistor.</p>', points: [{ lvl: 'A', text: 'More paths for the current' }, { lvl: 'M', text: 'Same voltage; total current is the sum of the branch currents' }, { lvl: 'M', text: 'Larger current for the same V means smaller R' }] },
    ],
    E: [
      { type: 'explain', q: 'In SWITCHED (6.0 V battery, R₁ = R₂ = R₃ = 10 Ω), switch S starts open and is then closed. Discuss the changes in the current through R₁, the voltage across R₂ and the total power supplied by the battery. Support your answer with calculations.', figure: SWITCHED, model: '<p>With S open, R₁ and R₂ are in series: R_T = 20 Ω, I = 6.0/20 = 0.30 A, and each resistor has 3.0 V. Closing S puts R₃ in parallel with R₂, so the parallel section drops from 10 Ω to 5.0 Ω and R_T falls to 15 Ω. With the same 6.0 V supply, the total current rises to 6.0/15 = 0.40 A, and all of it flows through R₁, so the current through R₁ increases from 0.30 A to 0.40 A. R₁ now has 0.40 × 10 = 4.0 V, leaving 2.0 V across the parallel section, so the voltage across R₂ decreases from 3.0 V to 2.0 V. The battery’s power output is P = VI: before 6.0 × 0.30 = 1.8 W, after 6.0 × 0.40 = 2.4 W, so the battery supplies energy faster after S is closed.</p>', points: [{ lvl: 'A', text: 'States current through R₁ increases and voltage across R₂ decreases' }, { lvl: 'M', text: 'Total resistance falls from 20 Ω to 15 Ω' }, { lvl: 'E', text: 'Correct before/after values: 0.30 → 0.40 A; 3.0 → 2.0 V' }, { lvl: 'E', text: 'Power rises from 1.8 W to 2.4 W, with reasoning' }] },
      { type: 'num', q: 'Three identical resistors R are connected: two in parallel, and that pair in series with the third. The combination is connected to 18 V and draws 2.0 A. Find R.', answer: 6, unit: 'Ω', explain: 'R_T = R + R/2 = 1.5R; 1.5R = 18/2.0 = 9.0 Ω; R = 6.0 Ω.' },
      { type: 'explain', q: 'Bulbs A, B and C are identical. A is in series with the battery, and B and C are in parallel with each other (as in Lesson 3.6). Bulb C is replaced by a plain wire. Discuss what happens to the brightness of A and B.', model: '<p>The plain wire is in parallel with bulb B and has almost zero resistance, so it short-circuits B: the voltage across the B–wire section becomes zero, no current flows through B, and B goes out. The total resistance of the circuit is now just bulb A, which is less than before (A plus the B–C pair), so the total current increases. All of this larger current flows through A, and A now has the whole battery voltage across it instead of two-thirds of it. With more current and more voltage, A transfers energy faster and becomes brighter.</p>', points: [{ lvl: 'A', text: 'B goes out, A gets brighter' }, { lvl: 'M', text: 'The wire shorts B: zero voltage across B' }, { lvl: 'E', text: 'Total resistance falls, so total current (through A) rises' }, { lvl: 'E', text: 'A now has the full supply voltage (up from 2/3)' }] },
    ],
  },
  glossary: [
    { term: 'Total (equivalent) resistance', def: 'The single resistance that would draw the same current from the supply as a whole combination.' },
    { term: 'Reciprocal', def: '1 divided by a number. Parallel resistance adds reciprocals.' },
    { term: 'Product over sum', def: 'Shortcut for two resistors in parallel: R₁R₂/(R₁ + R₂).' },
    { term: 'Voltage divider', def: 'Two or more resistors in series sharing the supply voltage in proportion to their resistances.' },
    { term: 'Current divider', def: 'Parallel branches sharing the total current in inverse proportion to their resistances.' },
    { term: 'Mixed circuit', def: 'A circuit with both series and parallel parts.' },
    { term: 'Shorted out', def: 'Bypassed by a zero-resistance path, so a component has no voltage across it and no current through it.' },
  ],
  formulas: [
    { name: 'Series resistance', tex: r`R_T = R_1 + R_2 + \dots`, note: 'Bigger than the biggest.', level: 'L1 / L2' },
    { name: 'Parallel resistance', tex: r`\frac{1}{R_T} = \frac{1}{R_1} + \frac{1}{R_2} + \dots`, note: 'Flip at the end. Smaller than the smallest.', level: 'L1 / L2' },
    { name: 'Two in parallel', tex: r`R_T = \frac{R_1 R_2}{R_1 + R_2}`, note: 'Product over sum. n identical: R/n.', level: 'L2' },
    { name: 'Voltage divider', tex: r`V_1 = V\,\frac{R_1}{R_1 + R_2}`, note: 'Series: V ∝ R.', level: 'L2' },
    { name: 'Current divider', tex: r`I_1 = I\,\frac{R_2}{R_1 + R_2}`, note: 'Parallel: I ∝ 1/R (other resistor on top).', level: 'L2' },
  ],
  flashcards: [
    { front: 'Series resistance formula', back: 'R_T = R₁ + R₂ + …' }, { front: 'Parallel resistance formula', back: '1/R_T = 1/R₁ + 1/R₂ + … (then flip)' },
    { front: 'Two resistors in parallel shortcut', back: 'R₁R₂ / (R₁ + R₂)' }, { front: 'n identical resistors R in parallel', back: 'R/n' },
    { front: 'Adding a parallel branch does what to R_T and I?', back: 'R_T falls, total current rises' }, { front: 'Series circuit: how does voltage share?', back: 'In proportion to resistance' },
    { front: 'Parallel circuit: how does current share?', back: 'Inversely with resistance' }, { front: 'A shorted component has…', back: '0 V across it and no current' },
    { front: 'Excellence chain', back: 'change → R_T → I → voltage shares → branch currents → brightness' },
  ],
};
