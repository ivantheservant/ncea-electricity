/**
 * Chapter 0 — Maths Toolkit.
 * TeX inside content uses String.raw (r``) so backslashes survive.
 */
const r = String.raw;

export default {
  intro: 'Physics is maths with meaning. These six short lessons give you every maths skill the electricity chapters use. Come back here whenever a lesson links to a Maths corner.',
  standards: 'Skills used in every NCEA Physics standard, including AS 92047 (L1), AS 91173 (L2) and AS 91526 (L3).',
  lessons: [
    // ------------------------------------------------------------------ 0.1
    {
      id: '0.1', title: 'Units and SI prefixes', levels: ['Y10', 'L1'], minutes: 12,
      objectives: ['Name the quantities, symbols and units used in electricity', 'Use the prefixes G, M, k, m, μ, n and p', 'Convert between prefixed units and base units'],
      intro: 'A number without a unit is like a bus timetable without times. In NCEA you can lose marks for a missing or wrong unit, so let’s make units automatic.',
      sections: [
        { type: 'text', title: 'Quantities, symbols and units', html: r`<p>Every physical <b>quantity</b> has a <b>symbol</b> (a letter used in formulas) and a <b>unit</b> (what it is measured in). In electricity you will meet these again and again:</p>
<div class="tablewrap"><table><thead><tr><th>Quantity</th><th>Symbol</th><th>Unit</th><th>Unit symbol</th></tr></thead><tbody>
<tr><td>Current</td><td>$I$</td><td>ampere (amp)</td><td>A</td></tr>
<tr><td>Voltage (potential difference)</td><td>$V$</td><td>volt</td><td>V</td></tr>
<tr><td>Resistance</td><td>$R$</td><td>ohm</td><td>Ω</td></tr>
<tr><td>Charge</td><td>$Q$ or $q$</td><td>coulomb</td><td>C</td></tr>
<tr><td>Energy</td><td>$E$</td><td>joule</td><td>J</td></tr>
<tr><td>Power</td><td>$P$</td><td>watt</td><td>W</td></tr>
<tr><td>Time</td><td>$t$</td><td>second</td><td>s</td></tr></tbody></table></div>
<p>Notice that “V” does two jobs: the <i>quantity</i> voltage ($V$, written in italics) and the <i>unit</i> volt (V, upright). “12 V” means a voltage of twelve volts.</p>` },
        { type: 'text', title: 'Prefixes: shortcuts for powers of ten', html: r`<p>Electrical quantities range from tiny (a phone microphone makes millivolts) to huge (power lines carry hundreds of kilovolts). A <b>prefix</b> in front of a unit multiplies it by a power of ten.</p>
<div class="tablewrap"><table><thead><tr><th>Prefix</th><th>Symbol</th><th>Multiply by</th><th>Example</th></tr></thead><tbody>
<tr><td>giga</td><td>G</td><td>$10^{9}$ (1 000 000 000)</td><td>1 GW power station</td></tr>
<tr><td>mega</td><td>M</td><td>$10^{6}$ (1 000 000)</td><td>2.2 MΩ resistor</td></tr>
<tr><td>kilo</td><td>k</td><td>$10^{3}$ (1000)</td><td>4.7 kΩ resistor</td></tr>
<tr><td>milli</td><td>m</td><td>$10^{-3}$ (0.001)</td><td>250 mA</td></tr>
<tr><td>micro</td><td>μ</td><td>$10^{-6}$ (0.000 001)</td><td>3 μC of charge</td></tr>
<tr><td>nano</td><td>n</td><td>$10^{-9}$</td><td>45 nC</td></tr>
<tr><td>pico</td><td>p</td><td>$10^{-12}$</td><td>100 pF capacitor</td></tr></tbody></table></div>
<p>Each step down the table is a factor of 1000. Capital and small letters matter: <b>M</b> is mega (a million) but <b>m</b> is milli (a thousandth) — a difference of a billion times!</p>` },
        { type: 'text', title: 'How to convert', html: r`<p>The safest method: <b>replace the prefix with its power of ten</b>.</p>
<ul><li>250 mA = 250 × $10^{-3}$ A = 0.25 A</li><li>4.7 kΩ = 4.7 × $10^{3}$ Ω = 4700 Ω</li><li>3 μC = 3 × $10^{-6}$ C</li></ul>
<p>Going the other way (base unit → prefix), divide by the prefix’s value: 0.045 A = 0.045 ÷ $10^{-3}$ mA = 45 mA.</p>
<p>Time is the one awkward unit: 1 minute = 60 s and 1 hour = 3600 s. Always change minutes and hours into <b>seconds</b> before using a formula.</p>` },
        { type: 'example', title: 'charging a phone', q: r`<p>A phone charger delivers 1500 mA for 2.0 hours. Write the current in amps and the time in seconds.</p>`, steps: [r`Current: milli means $10^{-3}$, so 1500 mA = 1500 × $10^{-3}$ A.`, r`1500 × 0.001 = 1.5 A.`, r`Time: 1 hour = 3600 s, so 2.0 h = 2.0 × 3600 s.`, r`2.0 × 3600 = 7200 s.`], answer: r`<p>$I$ = 1.5 A and $t$ = 7200 s (or 7.2 × $10^{3}$ s).</p>` },
        { type: 'sim', sim: 'prefix-trainer', caption: 'Build a streak: convert between prefixes until it feels automatic.' },
        { type: 'misconception', wrong: 'mA and MA are the same thing — the letter is just written bigger.', right: 'm (milli) = $10^{-3}$ and M (mega) = $10^{6}$. Copy prefixes exactly as they appear.' },
        { type: 'tip', html: 'Write the unit at every step of a calculation, not just at the end. It catches mistakes before they happen.' },
        { type: 'funfact', title: 'the amp got a new definition', html: r`Since 20 May 2019 the ampere has been defined by fixing the charge on one electron at exactly $1.602\,176\,634 \times 10^{-19}$ C. Before that it was defined by the force between two infinitely long wires!` },
        { type: 'key', points: ['Quantity = number + unit. Always write the unit.', 'G $10^{9}$, M $10^{6}$, k $10^{3}$, m $10^{-3}$, μ $10^{-6}$, n $10^{-9}$, p $10^{-12}$.', 'To convert, replace the prefix with its power of ten.', 'Change minutes and hours to seconds before calculating.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'Convert 350 mA into amps.', answer: 0.35, unit: 'A', explain: r`milli = $10^{-3}$, so 350 mA = 350 × $10^{-3}$ A = 0.35 A.`, hint: 'milli means divide by 1000.' },
        { type: 'num', q: 'Convert 2.2 kΩ into ohms.', answer: 2200, unit: 'Ω', explain: r`kilo = $10^{3}$, so 2.2 kΩ = 2.2 × 1000 Ω = 2200 Ω.` },
        { type: 'mcq', q: 'Which is the largest resistance?', options: ['0.5 MΩ', '450 kΩ', '45 000 Ω', '4 500 000 mΩ'], answer: 0, explain: r`0.5 MΩ = 500 000 Ω; 450 kΩ = 450 000 Ω; 45 000 Ω; 4 500 000 mΩ = 4500 Ω. So 0.5 MΩ is largest.`, hint: 'Change all four into plain ohms first.' },
        { type: 'num', q: 'A charge of 6 μC is how many coulombs?', answer: 6e-6, unit: 'C', explain: r`micro = $10^{-6}$, so 6 μC = 6 × $10^{-6}$ C.` },
        { type: 'num', q: 'A lamp is switched on for 3.5 minutes. How many seconds is that?', answer: 210, unit: 's', explain: '3.5 × 60 = 210 s.' },
      ],
    },
    // ------------------------------------------------------------------ 0.2
    {
      id: '0.2', title: 'Scientific notation and your calculator', levels: ['Y10', 'L1', 'L2'], minutes: 12,
      objectives: ['Write very large and very small numbers in scientific notation', 'Multiply and divide powers of ten', 'Enter scientific notation correctly on a calculator'],
      sections: [
        { type: 'text', title: 'What scientific notation is', html: r`<p>Scientific notation (also called <b>standard form</b>) writes any number as</p>$$a \times 10^{n}$$<p>where $a$ is between 1 and 10 (it can be 1 but not 10) and $n$ is a whole number.</p>
<ul><li>The charge of an electron: 0.000 000 000 000 000 000 16 C = $1.6 \times 10^{-19}$ C</li><li>Electrons in one coulomb: 6 250 000 000 000 000 000 = $6.25 \times 10^{18}$</li><li>Speed of light: 300 000 000 m s⁻¹ = $3.0 \times 10^{8}$ m s⁻¹</li></ul>
<p><b>Big numbers</b> have a positive power. <b>Small numbers</b> (less than 1) have a negative power. The power tells you how many places the decimal point moved.</p>` },
        { type: 'text', title: 'Multiplying and dividing powers of ten', html: r`<p>When you multiply, <b>multiply the front numbers and add the powers</b>. When you divide, <b>divide the front numbers and subtract the powers</b>:</p>
$$(3 \times 10^{4}) \times (2 \times 10^{-6}) = 6 \times 10^{-2}$$
$$\frac{8 \times 10^{5}}{2 \times 10^{2}} = 4 \times 10^{3}$$
<p>If the front number ends up 10 or more, tidy it: $12 \times 10^{3} = 1.2 \times 10^{4}$.</p>` },
        { type: 'text', title: 'Using your calculator properly', html: r`<p>Use the <b>EXP</b>, <b>EE</b> or <b>×10ˣ</b> key. To type $1.6 \times 10^{-19}$ press: <code class="no-math">1.6 EXP (−) 19</code>. Don’t type “× 10 ^” — it is easy to get the order of operations wrong.</p>
<p>When dividing by a number in scientific notation, put it in brackets: $1 \div (1.6 \times 10^{-19})$. On many calculators the display shows <b>E</b> for “× 10 to the”: <code class="no-math">6.25E18</code> means $6.25 \times 10^{18}$.</p>` },
        { type: 'example', title: 'electrons in a coulomb', q: r`<p>One electron carries $1.6 \times 10^{-19}$ C. How many electrons make up 1 C of charge?</p>`, steps: [r`Number of electrons = total charge ÷ charge per electron.`, r`$n = \dfrac{1}{1.6 \times 10^{-19}}$`, r`Calculator: 1 ÷ (1.6 EXP −19) = 6.25E18.`], answer: r`<p>$n = 6.25 \times 10^{18}$ electrons — over six billion billion!</p>` },
        { type: 'sim', sim: 'sci-trainer', caption: 'Practise writing numbers in scientific notation and multiplying powers of ten.' },
        { type: 'misconception', wrong: r`$45 \times 10^{3}$ is correct scientific notation.`, right: r`The front number must be between 1 and 10, so write $4.5 \times 10^{4}$. Both are the same value, but only one is proper scientific notation.` },
        { type: 'funfact', title: 'lightning by numbers', html: r`A typical lightning flash moves several coulombs of charge. At $1.6 \times 10^{-19}$ C each, that is roughly $10^{19}$ to $10^{20}$ electrons in less than a second.` },
        { type: 'key', points: [r`Scientific notation: $a \times 10^{n}$ with $1 \le a < 10$.`, 'Multiply → add powers. Divide → subtract powers.', 'Use the EXP / ×10ˣ key and brackets when dividing.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'Write 0.00042 in scientific notation.', answer: 4.2e-4, explain: r`Move the decimal point 4 places right to get 4.2, so the power is −4: $4.2 \times 10^{-4}$.`, hint: 'How many places must the decimal point move to get a number between 1 and 10?' },
        { type: 'num', q: r`Calculate $(3.0 \times 10^{8}) \times (2.0 \times 10^{-3})$.`, answer: 6e5, explain: r`3.0 × 2.0 = 6.0 and 8 + (−3) = 5, so $6.0 \times 10^{5}$.` },
        { type: 'mcq', q: 'Which number is written in correct scientific notation?', options: [r`$3.2 \times 10^{-19}$`, r`$32 \times 10^{-20}$`, r`$0.32 \times 10^{-18}$`, r`$3.2^{-19}$`], answer: 0, explain: 'Only the first has a front number between 1 and 10 multiplied by a power of ten. All three of the first options have the same value.' },
        { type: 'num', q: r`How much charge do $5.0 \times 10^{18}$ electrons carry? (Each carries $1.6 \times 10^{-19}$ C.) Give the size only.`, answer: 0.8, unit: 'C', explain: r`$5.0 \times 10^{18} \times 1.6 \times 10^{-19} = 8.0 \times 10^{-1} = 0.80$ C.` },
        { type: 'mcq', q: 'A calculator shows 2.5E-3. What does it mean?', options: [r`$2.5 \times 10^{-3}$ = 0.0025`, r`$2.5^{-3}$`, '2.5 − 3 = −0.5', r`$2.5 \times e^{-3}$`], answer: 0, explain: 'E on a calculator display means “× 10 to the power of”.' },
      ],
    },
    // ------------------------------------------------------------------ 0.3
    {
      id: '0.3', title: 'Rearranging formulas', levels: ['Y10', 'L1', 'L2', 'L3'], minutes: 15,
      objectives: ['Change the subject of a formula', 'Rearrange formulas with squares and square roots', 'Set out a calculation the way NCEA markers like to see it'],
      sections: [
        { type: 'text', title: 'The golden rule', html: r`<p>A formula is a balance. Whatever you do to one side, do to the other. To make a quantity the <b>subject</b> (alone on one side), undo what is being done to it, in reverse order.</p>
<p>Start with Ohm’s law, $V = IR$. Here $I$ is multiplied by $R$. To get $I$ alone, <b>divide both sides by $R$</b>:</p>
$$V = IR \quad\Rightarrow\quad \frac{V}{R} = \frac{IR}{R} \quad\Rightarrow\quad I = \frac{V}{R}$$
<p>In the same way, $R = \dfrac{V}{I}$.</p>` },
        { type: 'text', title: 'Formula triangles: handy, but limited', html: r`<p>For a formula with three quantities like $V = IR$, some people use a triangle with $V$ on top and $I$, $R$ underneath. Cover the one you want: what’s left tells you to multiply or divide.</p>
<p>Triangles only work for “one thing = two things multiplied”. Later you will meet $V = \varepsilon - Ir$, $V_{out} = V_{in} \dfrac{R_2}{R_1 + R_2}$ and $E_k = \tfrac{1}{2}mv^2$. These need real algebra, so practise the algebra now.</p>` },
        { type: 'text', title: 'Two-step rearranging', html: r`<p>Kinetic energy: $E_k = \tfrac{1}{2}mv^2$. Make $v$ the subject:</p>
<ol><li>Multiply both sides by 2: $2E_k = mv^2$</li><li>Divide both sides by $m$: $\dfrac{2E_k}{m} = v^2$</li><li>Square-root both sides: $v = \sqrt{\dfrac{2E_k}{m}}$</li></ol>
<p>This exact formula is in your notes for the speed of an electron between charged plates — you will use it in Chapter 9.</p>` },
        { type: 'sim', sim: 'rearrange-trainer', caption: 'Pick the correct rearrangement. Includes formulas from later chapters.' },
        { type: 'text', title: 'Setting out a calculation', html: r`<p>Markers want to follow your thinking. Use four lines:</p>
<ol><li><b>Formula</b>: $R = \dfrac{V}{I}$</li><li><b>Substitute</b> with units: $R = \dfrac{12\ \text{V}}{0.50\ \text{A}}$</li><li><b>Answer</b>: $R = 24$</li><li><b>Unit</b>: Ω</li></ol>
<p>If you make a slip in the arithmetic, a clear method can still earn credit.</p>` },
        { type: 'example', title: 'finding resistance', q: r`<p>A lamp has 6.0 V across it and 0.25 A flowing through it. Find its resistance.</p>`, steps: [r`Formula: $V = IR$, so $R = \dfrac{V}{I}$.`, r`Substitute: $R = \dfrac{6.0}{0.25}$.`, r`Calculate: $R = 24$.`], answer: r`<p>$R = 24$ Ω</p>` },
        { type: 'misconception', wrong: r`From $V = IR$, $R = \dfrac{I}{V}$.`, right: r`$R$ was multiplied by $I$, so divide by $I$: $R = \dfrac{V}{I}$. Check with numbers: 12 V and 2 A gives 6 Ω, and indeed 2 × 6 = 12.` },
        { type: 'tip', html: 'Not sure your rearrangement is right? Test it with easy numbers like 2, 3 and 6 that you can check in your head.' },
        { type: 'key', points: ['Do the same thing to both sides.', 'Undo operations in reverse order (last done, first undone).', 'Squares are undone by square roots.', 'Set out: formula → substitute → answer → unit.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: r`Make $I$ the subject of $Q = It$.`, options: [r`$I = \dfrac{Q}{t}$`, r`$I = Qt$`, r`$I = \dfrac{t}{Q}$`, r`$I = Q - t$`], answer: 0, explain: r`$I$ is multiplied by $t$, so divide both sides by $t$.` },
        { type: 'mcq', q: r`Make $V$ the subject of $P = VI$.`, options: [r`$V = \dfrac{P}{I}$`, r`$V = PI$`, r`$V = \dfrac{I}{P}$`, r`$V = P + I$`], answer: 0, explain: 'Divide both sides by I.' },
        { type: 'num', q: 'A current of 0.25 A flows through a 40 Ω resistor. Use V = IR to find the voltage across it.', answer: 10, unit: 'V', explain: 'V = 0.25 × 40 = 10 V.' },
        { type: 'order', q: r`Put the steps in order to make $v$ the subject of $E_k = \tfrac{1}{2}mv^2$.`, items: ['Multiply both sides by 2', r`Divide both sides by $m$`, 'Take the square root of both sides'], explain: r`$2E_k = mv^2 \Rightarrow \dfrac{2E_k}{m} = v^2 \Rightarrow v = \sqrt{\dfrac{2E_k}{m}}$` },
        { type: 'mcq', q: r`Make $V$ the subject of $P = \dfrac{V^2}{R}$.`, options: [r`$V = \sqrt{PR}$`, r`$V = \dfrac{P}{R}$`, r`$V = \sqrt{\dfrac{P}{R}}$`, r`$V = PR^2$`], answer: 0, explain: r`Multiply by $R$: $PR = V^2$. Square-root: $V = \sqrt{PR}$.`, hint: 'First get rid of the fraction, then deal with the square.' },
      ],
    },
    // ------------------------------------------------------------------ 0.4
    {
      id: '0.4', title: 'Significant figures and rounding', levels: ['Y10', 'L1', 'L2'], minutes: 10,
      objectives: ['Count significant figures', 'Round to a given number of significant figures', 'Choose a sensible precision for an answer'],
      sections: [
        { type: 'text', title: 'Which digits are significant?', html: r`<p>Significant figures (s.f.) are the digits that carry meaning about how precise a number is.</p>
<ul><li>Non-zero digits always count: 4.72 has 3 s.f.</li><li>Zeros <b>between</b> digits count: 2.03 has 3 s.f.</li><li><b>Leading</b> zeros never count: 0.0045 has 2 s.f. (they only place the decimal point)</li><li>Zeros at the <b>end after a decimal point</b> count: 3.50 has 3 s.f. — the 0 says “we measured to the hundredth”</li><li>Zeros at the end of a whole number are unclear: 1500 could be 2, 3 or 4 s.f. Scientific notation removes doubt: $1.50 \times 10^{3}$ is 3 s.f.</li></ul>` },
        { type: 'text', title: 'Rounding', html: r`<p>To round to $n$ s.f., count $n$ digits from the <b>first non-zero digit</b>, then look at the next digit: 5 or more rounds up, 4 or less leaves it.</p>
<ul><li>0.006 785 3 to 2 s.f. → 0.0068</li><li>12 V ÷ 7.0 Ω = 1.714 285… A → 1.7 A (2 s.f.)</li></ul>
<p><b>How many s.f. should an answer have?</b> About the same as the least precise value you were given — usually 2 or 3 in NCEA questions. If a question says “give your answer to 3 s.f.”, do exactly that.</p>` },
        { type: 'text', title: 'Never round in the middle', html: r`<p>Keep the full calculator value (use the ANS key or memory) until the final answer. Rounding early creates <b>rounding errors</b> that grow through multi-step problems — a common reason for losing Merit or Excellence marks.</p>` },
        { type: 'sim', sim: 'sigfig-trainer', caption: 'Count significant figures and round numbers.' },
        { type: 'misconception', wrong: '0.0045 has 4 significant figures because there are four digits after the decimal point.', right: 'Leading zeros are just place holders. 0.0045 = $4.5 \\times 10^{-3}$, which has 2 s.f.' },
        { type: 'key', points: ['Leading zeros don’t count; zeros between digits and trailing zeros after a decimal point do.', 'Round only the final answer.', 'Give answers to about the same s.f. as the data (usually 2–3).'] },
      ],
      checkpoint: [
        { type: 'num', q: 'How many significant figures are in 0.00450?', answer: 3, exact: true, explain: 'Leading zeros don’t count. The digits 4, 5 and the trailing 0 after the decimal point do: 3 s.f.' },
        { type: 'num', q: 'How many significant figures are in 2.030?', answer: 4, exact: true, explain: 'The zero between 2 and 3 counts, and the final zero after the decimal point counts: 4 s.f.' },
        { type: 'num', q: 'Round 0.0067853 to 2 significant figures.', answer: 0.0068, exact: true, sf: 2, answerText: '0.0068', explain: 'The first non-zero digit is 6. Two s.f. gives 67…, and the next digit 8 rounds the 7 up: 0.0068.' },
        { type: 'num', q: 'A 12 V battery is connected to a 7.0 Ω resistor. Use I = V/R and give the current to 3 s.f.', answer: 1.71, tol: 0.003, sf: 3, unit: 'A', answerText: '1.71', explain: '12 ÷ 7.0 = 1.714 285… → 1.71 A (3 s.f.).' },
        { type: 'mcq', q: 'Why should you avoid rounding numbers in the middle of a calculation?', options: ['Rounding errors build up and can make the final answer wrong', 'Markers do not allow rounding at any point', 'Calculators cannot use rounded numbers', 'It makes the units change'], answer: 0, explain: 'Each rounding loses a little accuracy. Over several steps the error can be big enough to change your final digits.' },
      ],
    },
    // ------------------------------------------------------------------ 0.5
    {
      id: '0.5', title: 'Proportion: how quantities change together', levels: ['L1', 'L2'], minutes: 12,
      objectives: ['Tell direct, inverse and square relationships apart', 'Predict how one quantity changes when another doubles or halves', 'Write Merit-style “because… therefore…” explanations'],
      sections: [
        { type: 'text', title: 'Direct proportion', html: r`<p>Two quantities are <b>directly proportional</b> if doubling one doubles the other. We write $y \propto x$, meaning $y = kx$ for some constant $k$. The graph is a <b>straight line through the origin</b>.</p>
<p>Example: for a fixed resistor, $V = IR$, so $V \propto I$. Double the current and the voltage across the resistor doubles.</p>` },
        { type: 'text', title: 'Inverse proportion', html: r`<p>Two quantities are <b>inversely proportional</b> if doubling one halves the other: $y \propto \dfrac{1}{x}$, or $y = \dfrac{k}{x}$. The graph is a curve that gets close to the axes but never touches them.</p>
<p>Example: with a fixed battery voltage, $I = \dfrac{V}{R}$, so $I \propto \dfrac{1}{R}$. Double the resistance and the current halves.</p>` },
        { type: 'text', title: 'Square relationships', html: r`<p>If $y \propto x^2$, doubling $x$ makes $y$ <b>four</b> times bigger (2² = 4). Tripling $x$ makes $y$ nine times bigger.</p>
<p>Example: power wasted as heat in a wire is $P = I^2R$. Double the current and four times as much energy is wasted every second — the reason the national grid uses very high voltages (Chapter 8).</p>` },
        { type: 'sim', sim: 'proportion-explorer', caption: 'Choose a relationship, then double or triple the input and watch the output.' },
        { type: 'text', title: 'Writing it like an Excellence answer', html: r`<p>Examiners reward explanations that <b>link</b> cause and effect using a formula and say what stays constant:</p>
<p><i>“The battery voltage stays the same. Since $I = \dfrac{V}{R}$, when the resistance doubles the current halves.”</i></p>
<p>Notice the three parts: what is <b>constant</b>, the <b>formula</b> that links the quantities, and the <b>effect</b> with a number (halves, doubles, ×4).</p>` },
        { type: 'misconception', wrong: '“Inversely proportional” just means one goes up while the other goes down.', right: r`It means more than that: the product stays constant ($xy = k$). If one doubles, the other exactly halves. A quantity can go down without being inversely proportional.` },
        { type: 'try', question: { type: 'mcq', q: r`Power wasted in a cable is $P = I^2R$. The current is tripled. What happens to the power wasted?`, options: ['×3', '×6', '×9', '÷3'], answer: 2, explain: r`$P \propto I^2$, so tripling $I$ multiplies $P$ by $3^2 = 9$.` } },
        { type: 'key', points: ['Direct: $y \\propto x$ — straight line through origin.', 'Inverse: $y \\propto 1/x$ — doubling one halves the other.', 'Square: $y \\propto x^2$ — doubling gives ×4.', 'Good explanations state what is constant, the formula, and the size of the change.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'The battery voltage stays the same while the resistance in a circuit is tripled. What happens to the current?', options: ['It becomes one-third', 'It triples', 'It stays the same', 'It becomes one-ninth'], answer: 0, explain: r`$I = V/R$ with $V$ constant, so $I \propto 1/R$. Three times the resistance gives one-third of the current.` },
        { type: 'mcq', q: r`In a wire, $P = I^2R$ with $R$ constant. The current doubles. The power…`, options: ['is multiplied by 4', 'doubles', 'halves', 'stays the same'], answer: 0, explain: r`$P \propto I^2$, and $2^2 = 4$.` },
        { type: 'mcq', q: 'Which graph shows that y is directly proportional to x?', options: ['A straight line through the origin', 'A straight line that crosses the y-axis above zero', 'A curve that gets steeper', 'A curve that never touches the axes'], answer: 0, explain: 'Direct proportion means y = kx, a straight line with zero intercept.' },
        { type: 'num', q: 'A 12 V supply is shared between two resistors in the ratio 1 : 2. What voltage is across the larger share?', answer: 8, unit: 'V', explain: 'There are 1 + 2 = 3 parts, each worth 12 ÷ 3 = 4 V. The larger share is 2 parts = 8 V. You will use this for potential dividers in Chapter 11.' },
        { type: 'tf', q: 'If y goes down whenever x goes up, then y must be inversely proportional to x.', answer: false, explain: r`Inverse proportion needs $xy$ to stay constant. For example $y = 10 - x$ goes down as $x$ goes up, but it is not inverse proportion.` },
      ],
    },
    // ------------------------------------------------------------------ 0.6
    {
      id: '0.6', title: 'Graphs: gradient and straight lines', levels: ['L1', 'L2', 'L3'], minutes: 14,
      objectives: ['Draw and read a graph correctly', 'Calculate a gradient with units', 'Explain what the gradient and intercept mean in physics'],
      sections: [
        { type: 'text', title: 'Drawing a good graph', html: r`<p>Put the quantity you <b>change</b> (independent variable) on the x-axis and the quantity you <b>measure</b> (dependent variable) on the y-axis. Label each axis with the quantity and unit, e.g. “Current / A”. Use more than half the paper, plot points neatly, and draw a <b>line of best fit</b> — a smooth line that passes as close as possible to most points (not dot-to-dot).</p>` },
        { type: 'text', title: 'Gradient', html: r`<p>The gradient (slope) of a straight line is</p>$$\text{gradient} = \frac{\text{rise}}{\text{run}} = \frac{\Delta y}{\Delta x}$$
<p>where Δ (delta) means “change in”. Pick two points far apart <b>on the line</b> (not data points), find the differences, and divide. The gradient has units: y-unit ÷ x-unit.</p>
<p>For a graph of voltage $V$ (y-axis) against current $I$ (x-axis), the gradient is $\dfrac{\Delta V}{\Delta I}$ in V/A = Ω. That is the <b>resistance</b>!</p>` },
        { type: 'sim', sim: 'gradient-explorer', caption: 'Change R and watch the gradient. Then switch to the battery graph from your notes: V = ε − Ir.' },
        { type: 'text', title: 'y = mx + c', html: r`<p>Every straight line can be written $y = mx + c$, where $m$ is the gradient and $c$ is the y-intercept (where the line crosses the y-axis).</p>
<p>Your notes on internal resistance say $V = \varepsilon - Ir$. Rearranged: $V = (-r)I + \varepsilon$. So a graph of terminal voltage $V$ against current $I$ is a straight line with gradient $-r$ and intercept $\varepsilon$. Level 3 exams ask you to read $\varepsilon$ and $r$ off exactly this graph.</p>` },
        { type: 'example', title: 'resistance from a graph', q: r`<p>A V–I graph for a resistor is a straight line through (0.10 A, 2.0 V) and (0.40 A, 8.0 V). Find the resistance.</p>`, steps: [r`$\Delta V = 8.0 - 2.0 = 6.0$ V`, r`$\Delta I = 0.40 - 0.10 = 0.30$ A`, r`gradient $= \dfrac{6.0}{0.30} = 20$`], answer: r`<p>$R = 20$ Ω</p>` },
        { type: 'deeper', levels: ['L2', 'L3'], title: 'area under a graph', html: r`<p>Sometimes the <b>area</b> under a graph means something. For a current–time graph, area = current × time = charge ($Q = It$). For a capacitor’s charge–voltage graph, the area is the energy stored. You will use this at Level 3.</p>` },
        { type: 'funfact', title: 'Ohm was ignored', html: 'Georg Ohm published his law in 1827 from careful graphs of current against voltage. Many German scientists dismissed it at first. Years later the Royal Society in London gave him its Copley Medal, and the unit of resistance is now named after him.' },
        { type: 'key', points: ['Independent variable on x, dependent on y; label both with units.', 'Gradient = Δy/Δx, with units.', 'V–I graph: gradient = resistance.', 'y = mx + c: m = gradient, c = intercept. For V = ε − Ir, gradient = −r, intercept = ε.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A straight-line V–I graph passes through (2.0 A, 10 V) and (4.0 A, 20 V). What is the gradient?', answer: 5, unit: 'Ω', explain: 'ΔV = 10 V, ΔI = 2.0 A, so gradient = 10 ÷ 2.0 = 5.0 Ω.' },
        { type: 'mcq', q: 'For a graph of voltage (y) against current (x), the gradient represents…', options: ['resistance', 'power', 'charge', 'energy'], answer: 0, explain: 'ΔV/ΔI has units V/A = Ω, the resistance.' },
        { type: 'mcq', q: r`A battery’s terminal voltage is graphed against current using $V = \varepsilon - Ir$. Where can you read the EMF $\varepsilon$?`, options: ['The y-intercept', 'The gradient', 'The x-intercept', 'The area under the line'], answer: 0, explain: r`When $I = 0$, $V = \varepsilon$, so the line crosses the V-axis at $\varepsilon$.` },
        { type: 'mcq', q: 'What is a line of best fit?', options: ['A line that passes as close as possible to most points, showing the trend', 'A line joining each point to the next', 'A line that must pass through the first and last points', 'A line drawn from the origin to the highest point'], answer: 0, explain: 'It shows the overall trend and averages out small measurement errors.' },
        { type: 'tf', q: 'To find a gradient you should use two data points that are close together.', answer: false, explain: 'Use two points on the line that are far apart. This reduces the effect of reading errors.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'Convert 0.075 A into milliamps.', answer: 75, unit: 'mA', explain: '0.075 ÷ 0.001 = 75 mA.' },
      { type: 'num', q: r`Write 45 000 000 in scientific notation.`, answer: 4.5e7, explain: r`$4.5 \times 10^{7}$` },
      { type: 'mcq', q: r`Make $t$ the subject of $E = Pt$.`, options: [r`$t = \dfrac{E}{P}$`, r`$t = EP$`, r`$t = \dfrac{P}{E}$`, r`$t = E - P$`], answer: 0, explain: 'Divide both sides by P.' },
      { type: 'num', q: 'How many significant figures are in 0.0702?', answer: 3, exact: true, explain: '7, 0 and 2 — the zero between digits counts; leading zeros do not.' },
      { type: 'num', q: 'A heater runs for 2.5 hours. How many seconds is that?', answer: 9000, unit: 's', explain: '2.5 × 3600 = 9000 s.' },
    ],
    M: [
      { type: 'num', q: r`An object has a charge of $-4.8 \times 10^{-18}$ C. Each electron carries $1.6 \times 10^{-19}$ C. How many extra electrons does it have?`, answer: 30, explain: r`$n = \dfrac{4.8 \times 10^{-18}}{1.6 \times 10^{-19}} = 30$ electrons.` },
      { type: 'num', q: r`Use $v = \sqrt{\dfrac{2E_k}{m}}$ to find the speed of an electron ($m = 9.11 \times 10^{-31}$ kg) with $E_k = 1.6 \times 10^{-18}$ J.`, answer: 1.874e6, tol: 0.02, unit: 'm s⁻¹', explain: r`$v = \sqrt{\dfrac{2 \times 1.6\times10^{-18}}{9.11\times10^{-31}}} = \sqrt{3.51\times10^{12}} = 1.87 \times 10^{6}$ m s⁻¹.` },
      { type: 'mcq', q: 'The current through a wire doubles and its resistance stays the same. By what factor does the heat produced per second change? (P = I²R)', options: ['×4', '×2', '×½', 'no change'], answer: 0, explain: 'P ∝ I², so ×2² = ×4.' },
      { type: 'num', q: 'A V–I graph line passes through (0.05 A, 1.5 V) and (0.25 A, 7.5 V). Find the resistance to 2 s.f.', answer: 30, unit: 'Ω', explain: 'ΔV = 6.0 V, ΔI = 0.20 A, R = 6.0 ÷ 0.20 = 30 Ω.' },
    ],
    E: [
      { type: 'explain', q: r`A student keeps the battery voltage the same and replaces a 10 Ω resistor with a 40 Ω resistor. Explain fully how the current changes, and how the power $P = I^2R$ used by the resistor changes.`, model: r`<p>The voltage is constant, and $I = \dfrac{V}{R}$, so the current is inversely proportional to the resistance. The resistance is 4 times bigger, so the current becomes one-quarter of what it was.</p><p>Power: $P = I^2R$. The current is ¼ as big, so $I^2$ is $\tfrac{1}{16}$ as big, but $R$ is 4 times bigger. Overall $P$ becomes $\tfrac{1}{16} \times 4 = \tfrac{1}{4}$. (Check with $P = \dfrac{V^2}{R}$: $V$ is constant and $R$ is ×4, so $P$ is ÷4.)</p>`, points: [{ lvl: 'A', text: 'States the current decreases' }, { lvl: 'M', text: 'Uses I = V/R with V constant to show the current becomes ¼' }, { lvl: 'E', text: 'Combines the changes in I² and R to show the power becomes ¼' }, { lvl: 'E', text: 'Checks with P = V²/R or numbers' }] },
      { type: 'explain', q: r`A battery’s terminal voltage is measured at different currents. The V–I graph is a straight line from (0 A, 9.0 V) to (3.0 A, 6.0 V). Using $V = \varepsilon - Ir$, explain what the intercept and gradient tell you, and calculate the battery’s EMF and internal resistance.`, model: r`<p>Comparing $V = \varepsilon - Ir$ with $y = mx + c$: the y-intercept is the EMF and the gradient is $-r$.</p><p>Intercept: $\varepsilon = 9.0$ V (the voltage when no current flows).</p><p>Gradient $= \dfrac{6.0 - 9.0}{3.0 - 0} = -1.0$ Ω, so $r = 1.0$ Ω. The terminal voltage drops 1.0 V for every amp drawn because of “lost volts” inside the battery.</p>`, points: [{ lvl: 'A', text: 'States ε = 9.0 V from the intercept' }, { lvl: 'M', text: 'Calculates gradient = −1.0 (V/A)' }, { lvl: 'E', text: 'Links gradient to −r and gives r = 1.0 Ω with reasoning' }] },
      { type: 'num', q: r`A current of 2.0 A flows for 1.5 minutes. Each electron carries $1.6 \times 10^{-19}$ C. How many electrons pass a point? (Charge = current × time.)`, answer: 1.125e21, tol: 0.02, explain: r`$t = 90$ s, $Q = 2.0 \times 90 = 180$ C, $n = \dfrac{180}{1.6\times10^{-19}} = 1.1 \times 10^{21}$ electrons.` },
    ],
  },
  glossary: [
    { term: 'Quantity', def: 'Something that can be measured, such as current or time. It has a size and a unit.' },
    { term: 'Unit', def: 'The standard a quantity is measured in, e.g. ampere (A), volt (V), ohm (Ω).' },
    { term: 'Prefix', def: 'Letter in front of a unit that multiplies it by a power of ten, e.g. k = 10³, m = 10⁻³, μ = 10⁻⁶.' },
    { term: 'Scientific notation', def: 'Writing a number as a × 10ⁿ with 1 ≤ a < 10. Also called standard form.' },
    { term: 'Subject (of a formula)', def: 'The quantity on its own on one side of a formula, e.g. I in I = V/R.' },
    { term: 'Significant figures', def: 'The meaningful digits in a number, counted from the first non-zero digit.' },
    { term: 'Directly proportional', def: 'y ∝ x: doubling x doubles y. Graph is a straight line through the origin.' },
    { term: 'Inversely proportional', def: 'y ∝ 1/x: doubling x halves y; the product xy stays constant.' },
    { term: 'Gradient', def: 'Slope of a line: rise ÷ run = Δy/Δx, with units of y-unit per x-unit.' },
    { term: 'Intercept', def: 'Where a graph crosses an axis. In y = mx + c, c is the y-intercept.' },
    { term: 'Line of best fit', def: 'A straight or smooth line that passes as close as possible to most data points to show the trend.' },
  ],
  formulas: [
    { name: 'Scientific notation', tex: r`a \times 10^{n},\ 1 \le a < 10`, note: 'Multiply: add powers. Divide: subtract powers.' },
    { name: 'Gradient', tex: r`m = \frac{\Delta y}{\Delta x}`, note: 'Use two points on the line that are far apart.' },
    { name: 'Straight line', tex: r`y = mx + c`, symbols: [['m', 'gradient'], ['c', 'y-intercept']], note: r`For $V = \varepsilon - Ir$: gradient $= -r$, intercept $= \varepsilon$.` },
  ],
  flashcards: [
    { front: 'kilo (k)', back: '× 10³ (1000)' }, { front: 'mega (M)', back: '× 10⁶' }, { front: 'giga (G)', back: '× 10⁹' },
    { front: 'milli (m)', back: '× 10⁻³ (0.001)' }, { front: 'micro (μ)', back: '× 10⁻⁶' }, { front: 'nano (n)', back: '× 10⁻⁹' }, { front: 'pico (p)', back: '× 10⁻¹²' },
    { front: 'Unit of resistance', back: 'ohm, Ω' }, { front: 'Unit of charge', back: 'coulomb, C' }, { front: 'Unit of power', back: 'watt, W' },
  ],
};
