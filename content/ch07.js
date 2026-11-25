/**
 * Chapter 7 — Electrical Power & Energy.
 */
import { svg, comp, wire, dot, label, earth } from '../js/utils/svg.js';

const r = String.raw;

/**
 * Money amount that KaTeX will not treat as maths.
 * @param {string} x Amount, e.g. '3.50'.
 * @returns {string} HTML.
 */
const nz = (x) => `<span class="no-math">$${x}</span>`;

const BULBS_SP = svg(560, 190, [
  comp('battery', 30, 160, 30, 50, { signs: true, label: '12 V', labelPos: 'left' }), wire([30, 50], [60, 50]), comp('bulb', 60, 50, 140, 50, { label: '“12 V 24 W”', lit: 0.35 }), comp('bulb', 140, 50, 220, 50, { label: '“12 V 6 W”', labelPos: 'below', lit: 1 }), wire([220, 50], [250, 50], [250, 160], [30, 160]),
  label(140, 190, 'Series: the 6 W bulb is brighter', { cls: 'bold' }),
  comp('battery', 320, 160, 320, 50, { signs: true, label: '12 V', labelPos: 'left' }), wire([320, 50], [520, 50]), comp('bulb', 420, 50, 420, 160, { label: '24 W', labelPos: 'right', lit: 1 }), comp('bulb', 520, 50, 520, 160, { label: '6 W', labelPos: 'right', lit: 0.45 }), wire([320, 160], [520, 160]), dot(420, 50), dot(420, 160),
  label(440, 190, 'Parallel: the 24 W bulb is brighter', { cls: 'bold' }),
].join(''), { title: 'The same two bulbs in series and in parallel: which is brighter swaps over', maxw: 600 }).replace('viewBox="0 0 560 190"', 'viewBox="0 0 560 200"');

const SANKEY = svg(520, 200, [
  '<polygon points="20,60 300,60 300,95 20,95" class="fill-soft"/>',
  '<polygon points="300,60 500,60 500,73 300,73" class="fill-glow"/>',
  '<path d="M300,73 L300,95 C 360,95 380,120 380,180 L 400,180 C 400,110 370,73 300,73 Z" class="fill-pink"/>',
  label(160, 82, '100 J electrical energy in', { cls: 'bold' }), label(400, 52, '10 J light (useful)', { cls: 'bold' }), label(408, 176, '90 J heat (wasted)', { anchor: 'start', cls: 'bold' }),
].join(''), { title: 'Energy flow diagram for a filament bulb: 100 J in, 10 J light, 90 J heat', maxw: 560 });

const PLUG = svg(480, 210, [
  comp('ac', 40, 180, 40, 40, { label: '230 V', labelPos: 'left' }), wire([40, 40], [80, 40]), comp('fuse', 80, 40, 160, 40, { label: 'breaker / fuse (active)' }), wire([160, 40], [220, 40]),
  comp('switch-closed', 220, 40, 280, 40, { label: 'switch' }), wire([280, 40], [330, 40]), '<rect x="330" y="20" width="110" height="150" rx="10" class="fill-soft"/>',
  comp('heater', 360, 40, 360, 150, { label: 'element', labelPos: 'right' }), wire([330, 40], [360, 40]), wire([360, 150], [330, 150], [330, 180], [40, 180]),
  wire([440, 170], [440, 190], [400, 190]), earth(400, 190), label(385, 15, 'metal case', { cls: 'small bold' }), label(200, 200, 'neutral (blue)', { cls: 'small' }), label(120, 70, 'active (brown)', { cls: 'small' }), label(455, 160, 'earth', { anchor: 'start', cls: 'small' }),
].join(''), { title: 'Heater circuit: breaker and switch in the active wire, metal case connected to earth', maxw: 520 }).replace('viewBox="0 0 480 210"', 'viewBox="0 0 480 228"');

export default {
  intro: 'Why does a heater cost so much more to run than a phone charger? How does the power company work out your bill? Why do circuit breakers trip? This chapter is about the rate at which electrical energy is transferred — power — and how to use it safely and efficiently.',
  standards: 'NCEA Level 1 (energy, power and efficiency in a physical system) and NCEA Level 2 AS 91173: P = VI and P = ΔE/t are on the formula sheet, and power questions often combine with V = IR.',
  lessons: [
    // ------------------------------------------------------------------ 7.1
    {
      id: '7.1', title: 'Power: the rate of energy transfer', levels: ['Y10', 'L1', 'L2'], minutes: 16,
      objectives: ['Define power and the watt', 'Derive and use P = VI', 'Interpret appliance power ratings'],
      sections: [
        { type: 'text', title: 'Energy per second', html: r`<p><b>Power</b> is how fast energy is transferred: the energy transferred <b>each second</b>.</p>` },
        { type: 'formula', title: 'Power', tex: r`P = \frac{\Delta E}{t}`, symbols: [['P', 'power', 'watt (W)'], [r`\Delta E`, 'energy transferred', 'joule (J)'], ['t', 'time', 'second (s)']], html: r`<p><b>One watt is one joule per second</b>: 1 W = 1 J s⁻¹. 1 kW = 1000 W; 1 MW = 10⁶ W.</p>` },
        { type: 'text', title: 'Power from voltage and current', html: r`<p>From Lesson 4.5, the energy transferred is $\Delta E = VIt$. Divide by $t$:</p>
<p>$$P = \frac{\Delta E}{t} = \frac{VIt}{t} = VI$$</p>
<p>This makes sense: the voltage is the energy each coulomb transfers, and the current is the number of coulombs per second, so (joules per coulomb) × (coulombs per second) = joules per second.</p>` },
        { type: 'formula', title: 'Electrical power', tex: 'P = VI', symbols: [['P', 'power', 'W'], ['V', 'voltage', 'V'], ['I', 'current', 'A']] },
        { type: 'text', title: 'Power ratings', html: r`<p>Appliances are labelled with a voltage and a power, e.g. “230 V 2200 W”. It means that <b>when connected to 230 V</b>, the appliance transfers 2200 J every second. On a different voltage it would not have that power.</p>
<div class="tablewrap"><table><thead><tr><th>Appliance (230 V)</th><th>Typical power</th><th>Current, I = P/V</th></tr></thead><tbody>
<tr><td>LED light bulb</td><td>9 W</td><td>0.039 A</td></tr><tr><td>Laptop charger</td><td>60 W</td><td>0.26 A</td></tr><tr><td>TV</td><td>100 W</td><td>0.43 A</td></tr><tr><td>Microwave</td><td>1100 W</td><td>4.8 A</td></tr><tr><td>Kettle</td><td>2200 W</td><td>9.6 A</td></tr><tr><td>Hot water cylinder element</td><td>3000 W</td><td>13 A</td></tr>
</tbody></table></div>` },
        { type: 'example', title: 'power from V and I', q: r`<p>A car headlight draws 4.5 A from a 12 V battery. What is its power?</p>`, steps: [r`$P = VI = 12 \times 4.5$.`, r`$P = 54$ W.`], answer: '<p>54 W.</p>' },
        { type: 'example', title: 'current from a power rating', q: r`<p>What current does a 1500 W heater draw from the 230 V mains?</p>`, steps: [r`$I = \dfrac{P}{V} = \dfrac{1500}{230}$.`, r`$I = 6.5$ A (2 s.f.).`], answer: '<p>6.5 A.</p>' },
        { type: 'example', title: 'energy from power', q: r`<p>A 2200 W kettle takes 3.0 minutes to boil. How much energy does it transfer?</p>`, steps: [r`$t = 180$ s.`, r`$\Delta E = Pt = 2200 \times 180$.`, r`$\Delta E = 396\,000$ J $\approx 4.0 \times 10^{5}$ J.`], answer: '<p>About 4.0 × 10⁵ J — the same answer as Lesson 4.5, found more quickly.</p>' },
        { type: 'try', question: { type: 'num', q: 'A 230 V toaster draws 4.0 A. What is its power?', answer: 920, unit: 'W', explain: 'P = VI = 230 × 4.0 = 920 W.' } },
        { type: 'misconception', wrong: 'Power and energy are the same thing.', right: 'Energy is an amount (joules). Power is how fast that amount is transferred (joules per second). A low-power appliance left on for a long time can use more energy than a high-power one used briefly.' },
        { type: 'key', points: [r`$P = \Delta E / t$; 1 W = 1 J/s.`, r`$P = VI$ (from $\Delta E = VIt$).`, 'A power rating applies at the stated voltage.', r`Energy $\Delta E = Pt$.`] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 6.0 V motor draws 0.50 A. What is its power?', answer: 3, unit: 'W', explain: 'P = VI = 6.0 × 0.50 = 3.0 W.' },
        { type: 'num', q: 'What current does a 2.3 kW heater draw from 230 V?', answer: 10, unit: 'A', explain: 'I = P/V = 2300/230 = 10 A.' },
        { type: 'num', q: 'A 60 W bulb is on for 10 minutes. How much energy does it transfer?', answer: 36000, unit: 'J', explain: 'ΔE = Pt = 60 × 600 = 36 000 J.' },
        { type: 'mcq', q: 'One watt is…', options: ['one joule per second', 'one coulomb per second', 'one joule per coulomb', 'one volt per amp'], answer: 0, explain: 'Power = energy per second.' },
        { type: 'num', q: 'A device transfers 4500 J in 1.5 minutes. What is its power?', answer: 50, unit: 'W', explain: 'P = ΔE/t = 4500/90 = 50 W.' },
      ],
    },
    // ------------------------------------------------------------------ 7.2
    {
      id: '7.2', title: 'P = I²R and P = V²/R', levels: ['L2'], minutes: 20,
      objectives: ['Derive the two extra power formulas from P = VI and V = IR', 'Choose the right power formula', 'Compare the brightness of bulbs in series and in parallel'],
      sections: [
        { type: 'text', title: 'Two more versions', html: r`<p>Combine $P = VI$ with $V = IR$ by substitution:</p>
<ul><li>Replace $V$ with $IR$: $\;P = (IR)I = I^2R$</li><li>Replace $I$ with $V/R$: $\;P = V \times \dfrac{V}{R} = \dfrac{V^2}{R}$</li></ul>
<p>$$P = VI = I^2R = \frac{V^2}{R}$$</p>
<p>All three always give the same answer. Choose the one that uses the two quantities you know. $P = VI$ is on the NCEA Level 2 formula sheet; the other two you derive (or remember).</p>` },
        { type: 'maths', title: 'squares and square roots', link: '0.3', html: r`<p>In $P = I^2R$ only the current is squared: $I^2R$ means $I \times I \times R$. Squaring makes changes bigger: double the current → four times the power.</p><p>To find $I$ from $P$ and $R$, rearrange then take the square root: $I^2 = \dfrac{P}{R}$, so $I = \sqrt{\dfrac{P}{R}}$. Similarly $V = \sqrt{PR}$.</p>` },
        { type: 'example', title: 'using I²R', q: r`<p>A current of 3.0 A flows through a 5.0 Ω resistor. What is the power?</p>`, steps: [r`$P = I^2R = 3.0^2 \times 5.0$.`, r`$P = 9.0 \times 5.0 = 45$ W.`], answer: '<p>45 W.</p>' },
        { type: 'example', title: 'using V²/R', q: r`<p>A kettle element has a resistance of 24 Ω. What is its power on 230 V?</p>`, steps: [r`$P = \dfrac{V^2}{R} = \dfrac{230^2}{24}$.`, r`$P = \dfrac{52\,900}{24} = 2204$ W $\approx 2.2$ kW.`], answer: '<p>About 2.2 kW.</p>' },
        { type: 'example', title: 'square root', q: r`<p>What is the maximum current a 0.25 W, 100 Ω resistor can safely carry?</p>`, steps: [r`$I^2 = \dfrac{P}{R} = \dfrac{0.25}{100} = 0.0025$.`, r`$I = \sqrt{0.0025} = 0.050$ A (50 mA).`], answer: '<p>50 mA. More than this and it overheats (Lesson 5.6).</p>' },
        { type: 'text', title: 'Which bulb is brighter?', html: r`<p>Two bulbs rated “12 V 24 W” and “12 V 6 W”. From $R = V^2/P$, the 24 W bulb has $R = 144/24 = 6\ \Omega$ and the 6 W bulb has $R = 144/6 = 24\ \Omega$. The higher-power bulb has the <b>lower</b> resistance.</p>
<ul><li><b>In parallel</b> (each gets 12 V): $P = V^2/R$ — the smaller resistance gives more power, so the <b>24 W bulb is brighter</b>, as you would expect.</li>
<li><b>In series</b> (same current through both): $P = I^2R$ — the <b>larger</b> resistance gives more power, so the <b>6 W bulb is brighter!</b> Both are dimmer than normal.</li></ul>` },
        { type: 'diagram', svg: BULBS_SP, caption: 'Series: same I, so P ∝ R and the high-resistance (6 W) bulb wins. Parallel: same V, so P ∝ 1/R and the 24 W bulb wins.' },
        { type: 'example', title: 'the series case in numbers', q: r`<p>The two bulbs (6 Ω and 24 Ω) are in series with 12 V. Find the power of each.</p>`, steps: [r`$R_T = 30\ \Omega$; $I = 12/30 = 0.40$ A.`, r`24 W bulb (6 Ω): $P = 0.40^2 \times 6 = 0.96$ W.`, r`6 W bulb (24 Ω): $P = 0.40^2 \times 24 = 3.84$ W.`], answer: '<p>0.96 W and 3.8 W: the “6 W” bulb is four times as bright as the “24 W” bulb here (assuming the resistances stay constant).</p>' },
        { type: 'deeper', levels: ['L2', 'L3'], title: 'why the grid uses high voltage', html: r`<p>Power lines lose energy as heat at a rate $P_{loss} = I^2R$, where $R$ is the line resistance. To send the same power $P = VI$ with a smaller current, use a higher voltage. Ten times the voltage → one-tenth the current → <b>one-hundredth</b> of the heat loss. That is why the National Grid runs at up to 220 kV (Chapter 15).</p>` },
        { type: 'misconception', wrong: 'A higher-power bulb always glows brighter.', right: 'Only when it gets its rated voltage. In series with a lower-power bulb, the higher-power bulb (lower resistance) gets less of the voltage and can be the dimmer one.' },
        { type: 'key', points: [r`$P = VI = I^2R = V^2/R$.`, 'Same current (series): P ∝ R. Same voltage (parallel): P ∝ 1/R.', r`Rearranging with squares: $I = \sqrt{P/R}$, $V = \sqrt{PR}$.`, 'Higher-power rating → lower resistance.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 2.0 A current flows through a 12 Ω resistor. What is the power?', answer: 48, unit: 'W', explain: 'P = I²R = 4.0 × 12 = 48 W.' },
        { type: 'num', q: 'A 9.0 V battery is connected across a 27 Ω resistor. What is the power?', answer: 3, unit: 'W', explain: 'P = V²/R = 81/27 = 3.0 W.' },
        { type: 'num', q: 'What is the resistance of a “230 V 1150 W” heater when it is working normally?', answer: 46, unit: 'Ω', explain: 'R = V²/P = 52 900/1150 = 46 Ω.' },
        { type: 'mcq', q: 'The current through a resistor is doubled. Its power…', options: ['is multiplied by 4', 'doubles', 'halves', 'stays the same'], answer: 0, explain: 'P = I²R: 2² = 4.' },
        { type: 'mcq', q: 'Two bulbs with different resistances are in series. Which is brighter?', options: ['The one with the larger resistance', 'The one with the smaller resistance', 'They are equally bright', 'The one nearer the positive terminal'], answer: 0, explain: 'Same current, so P = I²R is larger for larger R.' },
        { type: 'num', q: 'What is the largest voltage that can be put across a 0.50 W, 200 Ω resistor?', answer: 10, unit: 'V', explain: 'V = √(PR) = √(0.50 × 200) = √100 = 10 V.' },
      ],
    },
    // ------------------------------------------------------------------ 7.3
    {
      id: '7.3', title: 'Energy, kilowatt-hours and power bills', levels: ['Y10', 'L1', 'L2'], minutes: 18,
      objectives: ['Convert between joules and kilowatt-hours', 'Calculate the energy used and the cost of running appliances', 'Compare the running costs of appliances'],
      sections: [
        { type: 'text', title: 'Why the joule is too small', html: r`<p>A heater running for an evening transfers tens of millions of joules. Power companies use a bigger unit: the <b>kilowatt-hour (kWh)</b>, which they call a “unit” on your bill.</p>
<p><b>1 kWh</b> is the energy transferred by a 1 kW appliance in 1 hour:</p>
<p>$$1\ \text{kWh} = 1000\ \text{W} \times 3600\ \text{s} = 3\,600\,000\ \text{J} = 3.6\ \text{MJ}$$</p>` },
        { type: 'formula', title: 'Energy in kWh', tex: r`E\,(\text{kWh}) = P\,(\text{kW}) \times t\,(\text{h})`, html: r`<p>The same formula $E = Pt$, but with power in <b>kilowatts</b> and time in <b>hours</b>. Never mix the two systems: kW with hours gives kWh; W with seconds gives J.</p>` },
        { type: 'example', title: 'cost of a heater', q: r`<p>A 2.0 kW heater is used for 5.0 hours a day. Electricity costs 35 c per kWh. Find the energy used and the cost per day and per week.</p>`, steps: [r`$E = Pt = 2.0 \times 5.0 = 10$ kWh per day.`, r`Cost per day: $10 \times 35 = 350$ c = ${nz('3.50')}.`, `Per week: ${nz('3.50')} × 7 = ${nz('24.50')}.`], answer: `<p>10 kWh a day; ${nz('3.50')} a day; ${nz('24.50')} a week.</p>` },
        { type: 'example', title: 'converting units', q: r`<p>A 1200 W microwave runs for 4.0 minutes. Find the energy in kWh and in joules.</p>`, steps: [r`Convert: $P = 1.2$ kW; $t = \dfrac{4.0}{60} = 0.0667$ h.`, r`$E = 1.2 \times 0.0667 = 0.080$ kWh.`, r`In joules: $0.080 \times 3.6 \times 10^{6} = 2.9 \times 10^{5}$ J (check: $1200 \times 240 = 288\,000$ J ✓).`], answer: '<p>0.080 kWh = 2.9 × 10⁵ J.</p>' },
        { type: 'sim', sim: 'power-bill', caption: 'Change the hours each appliance runs. Which ones dominate the bill? (Check your own bill for your real price per kWh.)' },
        { type: 'text', title: 'Reading your bill', html: r`<p>A power bill shows the meter readings in kWh at the start and end of the period. Units used = later reading − earlier reading. Most NZ bills also have a <b>fixed daily charge</b> that you pay whatever you use, plus GST. Prices vary between companies and plans, and many have cheaper night rates — which is why hot water cylinders are often heated at night.</p>` },
        { type: 'example', title: 'meter readings', q: r`<p>A meter reads 45 218 kWh on 1 June and 46 058 kWh on 1 July. The price is 32 c/kWh and the fixed charge is ${nz('1.20')} per day (30 days). What is the bill (before GST)?</p>`, steps: [r`Units used: $46\,058 - 45\,218 = 840$ kWh.`, `Energy cost: 840 × 0.32 = ${nz('268.80')}.`, `Fixed charges: 30 × ${nz('1.20')} = ${nz('36.00')}.`, `Total: ${nz('268.80')} + ${nz('36.00')} = ${nz('304.80')}.`], answer: `<p>${nz('304.80')} before GST.</p>` },
        { type: 'try', question: { type: 'num', q: 'A 9 W LED bulb is on for 6 hours a day for 30 days. How many kWh is that?', answer: 1.62, unit: 'kWh', explain: '0.009 kW × 6 h × 30 = 1.62 kWh.' } },
        { type: 'funfact', title: 'the standby drain', html: `Devices left on standby still draw a little power — often 1–5 W each. Ten such devices left on all year use about 10 × 3 W × 8760 h ≈ 260 kWh, which can add ${nz('80')} or more to a year’s bills.` },
        { type: 'key', points: ['1 kWh = 3.6 × 10⁶ J.', 'E (kWh) = P (kW) × t (h); E (J) = P (W) × t (s).', 'Cost = kWh × price per kWh (plus any fixed daily charge).', 'High power × long time = high cost: heating and hot water dominate.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'How many joules are in 2.5 kWh?', answer: 9000000, unit: 'J', explain: '2.5 × 3.6 × 10⁶ = 9.0 × 10⁶ J.' },
        { type: 'num', q: 'A 3.0 kW hot water element runs for 2.5 hours. How many kWh does it use?', answer: 7.5, unit: 'kWh', explain: '3.0 × 2.5 = 7.5 kWh.' },
        { type: 'num', q: 'At 30 c per kWh, how much does it cost to run a 1.5 kW heat pump for 8.0 hours? Answer in dollars.', answer: 3.6, unit: 'dollars', explain: `1.5 × 8.0 = 12 kWh; 12 × 0.30 = ${nz('3.60')}.` },
        { type: 'num', q: 'A 100 W TV is on for 30 minutes. How many kWh is that?', answer: 0.05, unit: 'kWh', explain: '0.100 kW × 0.5 h = 0.050 kWh.' },
        { type: 'mcq', q: 'Which uses the most energy?', options: ['A 2 kW heater for 3 hours (6 kWh)', 'A 100 W TV for 24 hours (2.4 kWh)', 'A 2.2 kW kettle for 6 minutes (0.22 kWh)', 'A 10 W charger for 100 hours (1 kWh)'], answer: 0, explain: 'Compare kWh: 6 > 2.4 > 1 > 0.22.' },
      ],
    },
    // ------------------------------------------------------------------ 7.4
    {
      id: '7.4', title: 'Efficiency', levels: ['Y10', 'L1'], minutes: 14,
      objectives: ['Calculate efficiency from energies or powers', 'Draw and read energy flow diagrams', 'Explain why LEDs are more efficient than filament bulbs'],
      sections: [
        { type: 'text', title: 'Useful and wasted energy', html: r`<p>Energy is never destroyed, but not all of it ends up where we want it. A bulb is meant to give light; the heat it also produces is <b>wasted</b> energy. <b>Efficiency</b> is the fraction of the input energy that ends up as useful output:</p>` },
        { type: 'formula', title: 'Efficiency', tex: r`\text{efficiency} = \frac{\text{useful energy out}}{\text{total energy in}} \times 100\%`, html: r`<p>You can use powers instead of energies: $\text{efficiency} = \dfrac{\text{useful power out}}{\text{power in}} \times 100\%$. Efficiency has no unit, and it can never be more than 100%.</p>` },
        { type: 'diagram', svg: SANKEY, caption: 'An energy flow (Sankey) diagram: the width of each arrow shows the amount of energy. This filament bulb is 10% efficient.' },
        { type: 'example', title: 'a motor', q: r`<p>An electric motor takes in 500 J of electrical energy and lifts a load, gaining 350 J of gravitational potential energy. Find its efficiency and the energy wasted.</p>`, steps: [r`Efficiency $= \dfrac{350}{500} \times 100\% = 70\%$.`, r`Wasted: $500 - 350 = 150$ J (as heat and sound).`], answer: '<p>70%; 150 J wasted.</p>' },
        { type: 'example', title: 'LED versus filament', q: r`<p>A 9 W LED and a 60 W filament bulb give about the same light (about 6 W of light energy per second). Compare their efficiencies.</p>`, steps: [r`LED: $\dfrac{6}{9} \times 100\% \approx 67\%$ (a generous estimate for a good LED).`, r`Filament: $\dfrac{6}{60} \times 100\% = 10\%$.`, 'The filament wastes 54 W as heat; the LED wastes only about 3 W.'], answer: '<p>The LED is several times more efficient, so it gives the same light for far less energy.</p>' },
        { type: 'try', question: { type: 'num', q: 'A kettle takes in 240 kJ and transfers 216 kJ to the water. What is its efficiency (%)?', answer: 90, unit: '%', explain: '216/240 × 100 = 90%.' } },
        { type: 'text', title: 'Where the waste goes', html: r`<p>Most wasted energy ends up as <b>heat</b> spreading into the surroundings — from resistance in wires, friction in motors, or a hot filament. It is not destroyed, but it is so spread out that it cannot easily be used again. Improving efficiency means less energy bought for the same job: LED lighting, heat pumps (which move heat rather than make it), and well-designed motors all save money and reduce demand on power stations.</p>` },
        { type: 'misconception', wrong: 'An efficient appliance uses up less energy because energy is destroyed less.', right: 'Energy is never destroyed. An efficient appliance turns a bigger fraction of its input into the useful form, so it needs less input to do the same job.' },
        { type: 'funfact', title: 'more than 100%?', html: 'A heat pump can deliver 3–4 kW of heat to a room while using only 1 kW of electricity. This does not break the rules — it moves heat that already exists in the outdoor air into the house, rather than making it from electrical energy.' },
        { type: 'key', points: ['Efficiency = useful out ÷ total in × 100% (energies or powers).', 'Wasted energy usually becomes heat spread into the surroundings.', 'Efficiency is always less than 100%.', 'LEDs are far more efficient than filament bulbs.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A motor has a power input of 80 W and a useful output of 60 W. What is its efficiency (%)?', answer: 75, unit: '%', explain: '60/80 × 100 = 75%.' },
        { type: 'num', q: 'A 40% efficient device wastes 300 J. How much energy was put in?', answer: 500, unit: 'J', explain: 'Useful is 40%, wasted is 60%: 300 J = 60% of the input, so input = 500 J.' },
        { type: 'mcq', q: 'Most of the wasted energy from a filament bulb is…', options: ['heat', 'sound', 'light', 'chemical energy'], answer: 0, explain: 'The filament runs at around 2500 °C.' },
        { type: 'mcq', q: 'Why can no device be more than 100% efficient?', options: ['Energy cannot be created, so useful output cannot exceed the input', 'Electricity always loses voltage', 'Machines always break down', 'The current is used up'], answer: 0, explain: 'Conservation of energy.' },
        { type: 'num', q: 'A 90% efficient phone charger delivers 18 W to the phone. What is its input power?', answer: 20, unit: 'W', explain: 'Input = 18 ÷ 0.90 = 20 W.' },
      ],
    },
    // ------------------------------------------------------------------ 7.5
    {
      id: '7.5', title: 'Using mains electricity safely', levels: ['Y10', 'L1', 'L2'], minutes: 18,
      objectives: ['Explain how fuses, circuit breakers and RCDs protect people and property', 'Calculate the current on a household circuit', 'Choose a suitable fuse or breaker rating'],
      sections: [
        { type: 'text', title: 'Two dangers', html: r`<p>Mains electricity (230 V AC, 50 Hz in New Zealand) can harm in two ways:</p>
<ul><li><b>Overheating and fire</b>: too much current in a cable heats it ($P = I^2R$) until its insulation melts or burns. Causes: too many appliances on one circuit, or a short circuit.</li><li><b>Electric shock</b>: current through the body. Around 50 mA through the chest can disturb the heart’s rhythm and kill. With 230 V and wet skin, that current is easily reached.</li></ul>` },
        { type: 'diagram', svg: PLUG, caption: 'The breaker and the switch are in the active wire. The metal case is earthed.' },
        { type: 'text', title: 'Fuses and circuit breakers', html: r`<p>Both go in the <b>active</b> wire and cut the current if it becomes too large.</p>
<ul><li>A <b>fuse</b> is a thin wire that melts when the current exceeds its rating. It must be replaced afterwards.</li><li>A <b>circuit breaker</b> is an automatic switch that trips (switches off) when the current is too large, using an electromagnet or a heat-sensitive strip. It can be reset. NZ homes use circuit breakers on the switchboard: typically 10 A for lighting circuits and 16–20 A for power-point circuits.</li></ul>
<p>Unlike British plugs, NZ plugs do not contain fuses — protection is at the switchboard. Choose a rating just <b>above</b> the normal current: too low and it trips during normal use; too high and the cable could overheat before it trips.</p>` },
        { type: 'example', title: 'current on one circuit', q: r`<p>A 2.4 kW heater, a 2.2 kW kettle and a 100 W TV are all switched on, on a single 20 A power circuit. Will the breaker trip?</p>`, steps: [r`Appliances are in parallel, so the powers add: $P = 2400 + 2200 + 100 = 4700$ W.`, r`$I = \dfrac{P}{V} = \dfrac{4700}{230} = 20.4$ A.`, r`20.4 A is more than 20 A, so the breaker trips.`], answer: '<p>Yes — about 20.4 A. Move the heater to a different circuit.</p>' },
        { type: 'sim', sim: 'circuit-load', caption: 'Switch appliances on and off. Find a combination that trips the 20 A breaker, then try the 10 A lighting breaker.' },
        { type: 'text', title: 'Earthing and RCDs', html: r`<p>If the active wire comes loose and touches a <b>metal case</b>, the case becomes live. The <b>earth wire</b> connects the case to the ground with a very low resistance, so a huge current flows straight away and the breaker trips, making the appliance safe (Lesson 2.5).</p>
<p>An <b>RCD</b> (residual current device) compares the current in the active and neutral wires. Normally they are equal. If some current leaks to earth — perhaps through a person — the two differ. When the difference reaches about 30 mA, the RCD switches off in a few hundredths of a second, fast enough to prevent a fatal shock. NZ wiring rules require RCDs on new household lighting and power-point circuits; plug-in RCD adaptors add protection for outdoor tools.</p>
<p><b>Double-insulated</b> appliances (marked with a square inside a square) have no exposed metal that could become live, so they need no earth wire.</p>` },
        { type: 'example', title: 'choosing a fuse', q: r`<p>A 230 V, 900 W toaster is to be protected by a fuse. Fuses come in 3 A, 5 A, 10 A and 13 A. Which should be used?</p>`, steps: [r`Normal current: $I = \dfrac{900}{230} = 3.9$ A.`, '3 A is too small — it would blow in normal use.', 'Choose the next size up: 5 A.'], answer: '<p>5 A — just above the 3.9 A normal current.</p>' },
        { type: 'misconception', wrong: 'A fuse protects you from electric shock.', right: 'A fuse or breaker protects the wiring and appliance from overheating. A shock current of 50 mA is far too small to blow a 10 A fuse. An RCD is what protects people.' },
        { type: 'misconception', wrong: 'Switching off at the wall makes it safe to touch any wire in the appliance.', right: 'Only if the switch is in the active wire — which is why switches and fuses always go in the active wire. Even then, unplug before opening anything, and leave mains wiring to a registered electrician.' },
        { type: 'funfact', title: 'why birds on power lines are fine', html: 'A bird sitting on a single power line has both feet on the same wire, at the same voltage, so there is no voltage across its body and no current flows through it. It would only be in danger if it touched a second wire or an earthed pole at the same time.' },
        { type: 'key', points: ['Fuses and breakers go in the active wire and stop overheating; choose a rating just above the normal current.', r`Total current on a circuit: add the powers, then $I = P/V$.`, 'Earth wire: makes a faulty metal case trip the breaker.', 'RCD: detects ~30 mA leaking to earth and protects people.', 'Double insulation: no exposed metal, no earth needed.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 230 V hair dryer is rated at 1840 W. What current does it draw?', answer: 8, unit: 'A', explain: 'I = P/V = 1840/230 = 8.0 A.' },
        { type: 'mcq', q: 'Which fuse should be used for an appliance that normally draws 8.0 A? (3 A, 5 A, 10 A, 13 A available)', options: ['10 A', '13 A', '5 A', '3 A'], answer: 0, explain: 'Just above the normal current.' },
        { type: 'mcq', q: 'What does an RCD detect?', options: ['A difference between the currents in the active and neutral wires', 'A current larger than 20 A', 'A voltage above 230 V', 'A loose plug'], answer: 0, explain: 'A difference means current is leaking to earth, possibly through a person.' },
        { type: 'num', q: 'A 16 A breaker protects a circuit. What is the maximum total power of appliances that can run on it at 230 V?', answer: 3680, unit: 'W', explain: 'P = VI = 230 × 16 = 3680 W.' },
        { type: 'mcq', q: 'Why is the fuse placed in the active wire rather than the neutral?', options: ['So that when it blows, the appliance is disconnected from the high voltage', 'Because the neutral carries no current', 'To make the fuse last longer', 'Because the active wire is thinner'], answer: 0, explain: 'A fuse in the neutral would leave the appliance connected to the live voltage.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'Calculate the power of a lamp that draws 0.50 A from a 12 V supply.', answer: 6, unit: 'W', explain: 'P = VI = 12 × 0.50 = 6.0 W.' },
      { type: 'num', q: 'A 1.2 kW microwave runs for 5.0 minutes. Calculate the energy transferred in joules.', answer: 360000, unit: 'J', explain: 'ΔE = Pt = 1200 × 300 = 360 000 J (3.6 × 10⁵ J).' },
      { type: 'num', q: 'How many kWh does a 2.0 kW heater use in 4.0 hours?', answer: 8, unit: 'kWh', explain: '2.0 × 4.0 = 8.0 kWh.' },
      { type: 'num', q: 'A motor’s input power is 200 W and its useful output power is 150 W. Calculate its efficiency (%).', answer: 75, unit: '%', explain: '150/200 × 100 = 75%.' },
      { type: 'mcq', q: 'What is the purpose of the earth wire in an appliance with a metal case?', options: ['To make the breaker trip if the case becomes live', 'To carry the current back to the switchboard', 'To make the appliance more efficient', 'To stop the appliance overheating in normal use'], answer: 0, explain: 'A live case gives a large current to earth, which trips the breaker.' },
    ],
    M: [
      { type: 'num', q: 'A current of 0.20 A flows through a 150 Ω resistor. Calculate the power.', answer: 6, unit: 'W', explain: 'P = I²R = 0.04 × 150 = 6.0 W.' },
      { type: 'num', q: 'A “230 V 2000 W” heater is run on 115 V (half the voltage). Assuming its resistance stays the same, what is its power?', answer: 500, unit: 'W', explain: 'R = 230²/2000 = 26.45 Ω; P = 115²/26.45 = 500 W (half the voltage → a quarter of the power).' },
      { type: 'num', q: 'A family uses a 3.0 kW clothes dryer for 1.5 hours, 4 times a week. At 33 c per kWh, what is the cost per week? Answer in dollars.', answer: 5.94, unit: 'dollars', explain: `3.0 × 1.5 × 4 = 18 kWh; 18 × 0.33 = ${nz('5.94')}.` },
      { type: 'explain', q: 'Explain how an RCD protects a person who touches a faulty live appliance, and why a 20 A circuit breaker would not protect them.', model: '<p>An RCD compares the current flowing out in the active wire with the current returning in the neutral wire. Normally these are equal. If a person touches a live part, some current flows through their body to earth instead of returning through the neutral, so the two currents differ. When the difference reaches about 30 mA, the RCD switches off within a few hundredths of a second, before the current can cause a fatal shock. A 20 A circuit breaker only trips when the total current exceeds 20 A. The current through a person (tens of milliamps) is far too small to trip it, yet large enough to kill.</p>', points: [{ lvl: 'A', text: 'RCD switches off when current leaks through a person' }, { lvl: 'M', text: 'Compares active and neutral currents; trips at about 30 mA quickly' }, { lvl: 'M', text: 'Shock current is far below 20 A, so the breaker does not trip' }] },
    ],
    E: [
      { type: 'explain', q: 'Two bulbs are labelled “12 V 36 W” and “12 V 12 W”. Discuss which bulb is brighter when they are connected (a) in parallel and (b) in series to a 12 V battery. Support your answer with calculations (assume the resistances stay constant).', model: '<p>Resistances from R = V²/P: the 36 W bulb has R = 144/36 = 4.0 Ω; the 12 W bulb has R = 144/12 = 12 Ω.</p><p>(a) In parallel each bulb has the full 12 V, so each works at its rated power: 36 W and 12 W. The 36 W bulb is brighter, because with the same voltage P = V²/R is larger for the smaller resistance.</p><p>(b) In series the total resistance is 16 Ω, so I = 12/16 = 0.75 A through both. Using P = I²R: the 36 W bulb has 0.75² × 4.0 = 2.25 W and the 12 W bulb has 0.75² × 12 = 6.75 W. With the same current, the bulb with the larger resistance has more power, so the “12 W” bulb is now brighter (three times the power of the other). Both are much dimmer than in parallel.</p>', points: [{ lvl: 'A', text: 'Parallel: 36 W bulb brighter' }, { lvl: 'M', text: 'Correct resistances 4.0 Ω and 12 Ω' }, { lvl: 'E', text: 'Series: same current, P = I²R larger for larger R, so the 12 W bulb is brighter' }, { lvl: 'E', text: 'Correct series powers 2.25 W and 6.75 W' }] },
      { type: 'num', q: 'An electric kettle (230 V, 2400 W) is 85% efficient. Heating 1.0 kg of water from 20 °C to 100 °C needs 3.36 × 10⁵ J. How many seconds does it take?', answer: 164.7, unit: 's', explain: 'Useful power = 0.85 × 2400 = 2040 W; t = 3.36 × 10⁵ ÷ 2040 = 165 s (about 2 min 45 s).' },
      { type: 'explain', q: 'Explain why power is transmitted across the country at very high voltage, using P = VI and P = I²R.', model: '<p>A power station must deliver a certain power P = VI to the towns. The transmission lines have resistance R, so they waste energy as heat at a rate P_loss = I²R. If the electricity is sent at a high voltage, the same power can be delivered with a much smaller current (I = P/V). Because the loss depends on the current squared, reducing the current by a factor of ten reduces the heat loss by a factor of one hundred. So high-voltage transmission wastes far less energy, and thinner, cheaper cables can be used. Transformers then step the voltage down to 230 V for homes.</p>', points: [{ lvl: 'A', text: 'High voltage reduces energy losses' }, { lvl: 'M', text: 'For the same power, higher V means lower I' }, { lvl: 'E', text: 'Loss = I²R, so the loss falls with the square of the current' }, { lvl: 'E', text: 'Quantitative example (e.g. 10× V → 1/100 of the loss)' }] },
    ],
  },
  glossary: [
    { term: 'Power (P)', def: 'The rate of energy transfer: P = ΔE/t. Measured in watts.' },
    { term: 'Watt (W)', def: 'The unit of power: one joule per second.' },
    { term: 'Kilowatt-hour (kWh)', def: 'The energy transferred by a 1 kW appliance in one hour: 3.6 × 10⁶ J.' },
    { term: 'Power rating', def: 'The power an appliance transfers at its stated voltage.' },
    { term: 'Efficiency', def: 'The percentage of input energy (or power) that becomes useful output.' },
    { term: 'Energy flow (Sankey) diagram', def: 'A diagram where arrow widths show how the input energy is split into useful and wasted parts.' },
    { term: 'Active wire', def: 'The wire at a high voltage (brown in NZ); the fuse, breaker and switch go in this wire.' },
    { term: 'Neutral wire', def: 'The return wire, close to 0 V (blue in NZ).' },
    { term: 'Earth wire', def: 'Safety wire (green/yellow) connecting metal cases to the ground.' },
    { term: 'Fuse', def: 'A thin wire that melts if the current is too large, breaking the circuit.' },
    { term: 'Circuit breaker', def: 'An automatic switch that trips when the current exceeds its rating; it can be reset.' },
    { term: 'RCD', def: 'Residual current device: switches off when the active and neutral currents differ by about 30 mA.' },
    { term: 'Double insulation', def: 'Design with no exposed metal that could become live, so no earth wire is needed.' },
  ],
  formulas: [
    { name: 'Power', tex: r`P = \frac{\Delta E}{t}`, note: 'Energy per second. ΔE = Pt.', level: 'L1 / L2' },
    { name: 'Electrical power', tex: 'P = VI', note: 'On the Level 2 formula sheet.', level: 'L1 / L2' },
    { name: 'Power with resistance', tex: r`P = I^2R = \frac{V^2}{R}`, note: 'From P = VI and V = IR.', level: 'L2' },
    { name: 'Kilowatt-hour', tex: r`1\ \text{kWh} = 3.6 \times 10^{6}\ \text{J}`, note: 'E (kWh) = P (kW) × t (h).', level: 'L1' },
    { name: 'Efficiency', tex: r`\eta = \frac{\text{useful out}}{\text{total in}} \times 100\%`, note: 'Energies or powers. Never above 100%.', level: 'Y10 / L1' },
  ],
  flashcards: [
    { front: 'Define power', back: 'Rate of energy transfer: P = ΔE/t' }, { front: 'Three power formulas', back: 'P = VI = I²R = V²/R' },
    { front: '1 kWh in joules', back: '3.6 × 10⁶ J' }, { front: 'Cost of electricity', back: 'kWh × price per kWh (+ fixed charge)' },
    { front: 'Efficiency formula', back: 'useful out ÷ total in × 100%' }, { front: 'Series bulbs: which is brighter?', back: 'The one with larger R (P = I²R)' },
    { front: 'What does an RCD do?', back: 'Switches off when ~30 mA leaks to earth' }, { front: 'Fuse rating rule', back: 'Just above the normal current' },
    { front: 'NZ wire colours', back: 'Brown active, blue neutral, green/yellow earth' },
  ],
};
