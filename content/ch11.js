/**
 * Chapter 11 — Potential Dividers & Sensors.
 */
import { svg, comp, wire, dot, label } from '../js/utils/svg.js';

const r = String.raw;

/**
 * Vertical potential divider diagram.
 * @param {object} o Options: vin, top, bot (labels), topType, botType, load (label or ''), vout (label).
 * @returns {string} SVG element.
 */
function divider(o) {
  let s = comp('battery', 40, 30, 40, 200, { signs: true, label: o.vin, labelPos: 'left' }) + wire([40, 30], [160, 30]) +
    comp(o.topType || 'resistor', 160, 30, 160, 115, { label: o.top, labelPos: 'right' }) + comp(o.botType || 'resistor', 160, 115, 160, 200, { label: o.bot, labelPos: 'right' }) +
    wire([160, 200], [40, 200]) + wire([160, 115], [290, 115]) + wire([160, 200], [290, 200]) + dot(160, 115) + dot(160, 200) +
    '<circle cx="290" cy="115" r="4" class="solid"/><circle cx="290" cy="200" r="4" class="solid"/>' + label(300, 162, o.vout || 'V_out', { anchor: 'start', cls: 'bold' });
  if (o.load) s += comp('resistor', 330, 115, 330, 200, { label: o.load, labelPos: 'right' }) + wire([290, 115], [330, 115]) + wire([290, 200], [330, 200]);
  return svg(o.load ? 440 : 380, 225, s.replace('V_out', 'Vout'), { title: o.title || 'Potential divider', maxw: o.load ? 460 : 400 });
}

const BASIC = divider({ vin: '12 V', top: 'R₁ = 8.0 kΩ', bot: 'R₂ = 4.0 kΩ', vout: 'Vout = 4.0 V', title: 'Potential divider: 12 V across 8.0 kΩ and 4.0 kΩ, output across the 4.0 kΩ' });
const LDR_BOTTOM = divider({ vin: '6.0 V', top: '10 kΩ', bot: 'LDR', botType: 'ldr', vout: 'Vout', title: 'Fixed resistor on top, LDR on the bottom: output rises in the dark' });
const THERM_TOP = divider({ vin: '9.0 V', top: 'thermistor', topType: 'thermistor', bot: '2.2 kΩ', vout: 'Vout', title: 'Thermistor on top, fixed resistor on the bottom: output rises when hot' });
const LOADED = divider({ vin: '10 V', top: '10 kΩ', bot: '10 kΩ', load: 'load 10 kΩ', vout: 'Vout', title: 'A load connected across the bottom resistor of a divider' });

const POT = svg(380, 220, [
  comp('battery', 40, 30, 40, 200, { signs: true, label: '9.0 V', labelPos: 'left' }), wire([40, 30], [160, 30]), '<rect x="148" y="40" width="24" height="150" class="fill-sheet"/>', wire([160, 30], [160, 40]), wire([160, 190], [160, 200], [40, 200]),
  '<polygon points="190,100 176,94 176,106" class="solid"/>', wire([190, 100], [240, 100], [240, 110], [290, 110]), wire([160, 200], [290, 200]), '<circle cx="290" cy="110" r="4" class="solid"/><circle cx="290" cy="200" r="4" class="solid"/>',
  label(300, 160, 'Vout', { anchor: 'start', cls: 'bold' }), label(200, 90, 'slider', { anchor: 'start', cls: 'small' }), label(130, 70, 'top part', { anchor: 'end', cls: 'small' }), label(130, 160, 'bottom part', { anchor: 'end', cls: 'small' }),
].join(''), { title: 'Potentiometer: a resistance track with a sliding contact giving a variable output', maxw: 400 });

export default {
  intro: 'Most sensors do not produce a voltage — they change their resistance. Put a sensor in series with a fixed resistor and the supply voltage is shared between them; as the sensor’s resistance changes, so does its share. That simple idea, the potential divider, is how thermostats, night lights, volume knobs and fire alarms turn the world into electrical signals.',
  standards: 'NCEA Level 2 (series circuits with sensors, voltage sharing) and NCEA Level 3 AS 91526 (circuit analysis, including the effect of loads).',
  lessons: [
    // ------------------------------------------------------------------ 11.1
    {
      id: '11.1', title: 'The potential divider', levels: ['L2', 'L3'], minutes: 16,
      objectives: ['Derive and use the potential divider formula', 'Use ratios to find output voltages quickly', 'Choose resistors to give a required output'],
      sections: [
        { type: 'text', title: 'Sharing a voltage', html: r`<p>A <b>potential divider</b> is two resistors in series across a supply, with an output taken across one of them. In Lesson 6.3 you saw that series resistors share the supply voltage <b>in proportion to their resistances</b>. The potential divider uses this on purpose, to make a smaller voltage from a bigger one.</p>` },
        { type: 'formula', title: 'Potential divider formula', tex: r`V_{out} = V_{in} \times \frac{R_2}{R_1 + R_2}`, symbols: [[r`V_{out}`, 'output voltage, across R₂', 'V'], [r`V_{in}`, 'supply voltage', 'V'], ['R_1', 'top resistor', 'Ω'], ['R_2', 'bottom resistor (output across this one)', 'Ω']], html: r`<p><b>Where it comes from:</b> the current is $I = \dfrac{V_{in}}{R_1 + R_2}$, and the output is the voltage across $R_2$: $V_{out} = IR_2 = V_{in}\dfrac{R_2}{R_1+R_2}$. It only holds when <b>no current</b> is drawn from the output (Lesson 11.4).</p>` },
        { type: 'diagram', svg: BASIC, caption: 'R₂ is one-third of the total resistance, so it gets one-third of the 12 V: 4.0 V.' },
        { type: 'example', title: 'using the formula', q: r`<p>A 9.0 V supply is connected across a 3.3 kΩ resistor (top) and a 6.8 kΩ resistor (bottom). Find the output across the bottom resistor.</p>`, steps: [r`$V_{out} = 9.0 \times \dfrac{6.8}{3.3 + 6.8}$ (kΩ cancel, so no need to convert).`, r`$V_{out} = 9.0 \times \dfrac{6.8}{10.1} = 6.1$ V.`], answer: '<p>6.1 V (and 2.9 V across the top resistor).</p>' },
        { type: 'text', title: 'The ratio shortcut', html: r`<p>The voltages are in the same ratio as the resistances: $\dfrac{V_1}{V_2} = \dfrac{R_1}{R_2}$. If $R_1$ is three times $R_2$, the top gets three parts and the bottom one part, so the bottom gets $\tfrac{1}{4}$ of the supply.</p>` },
        { type: 'example', title: 'design', q: r`<p>You need 3.0 V from a 12 V supply. The bottom resistor is 1.0 kΩ. What top resistor is needed?</p>`, steps: [r`The bottom needs 3.0 V and the top 9.0 V: ratio top : bottom = 3 : 1.`, r`So $R_1 = 3 \times 1.0 = 3.0$ kΩ.`], answer: '<p>3.0 kΩ (check: 12 × 1/4 = 3.0 V).</p>' },
        { type: 'sim', sim: 'divider-lab', caption: 'Start with “Two resistors”. Predict V_out for different pairs before reading it.' },
        { type: 'try', question: { type: 'num', q: 'A 5.0 V supply is across a 2.0 kΩ (top) and 3.0 kΩ (bottom) divider. What is V_out across the bottom resistor?', answer: 3, unit: 'V', explain: '5.0 × 3/5 = 3.0 V.' } },
        { type: 'misconception', wrong: 'The output voltage depends on the actual resistance values, so 1 kΩ + 1 kΩ gives a different output from 100 kΩ + 100 kΩ.', right: 'Only the ratio matters (with no load): both give half the supply. The values do matter for how much current is wasted and how the divider copes with a load.' },
        { type: 'key', points: [r`$V_{out} = V_{in}\,\dfrac{R_2}{R_1 + R_2}$ — output across R₂.`, 'Voltages share in the same ratio as resistances.', 'Units cancel in the fraction (kΩ is fine).', 'Valid only when no current is drawn from the output.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A 12 V supply is across 1.0 kΩ (top) and 2.0 kΩ (bottom). What is the output across the bottom resistor?', answer: 8, unit: 'V', explain: '12 × 2/3 = 8.0 V.' },
        { type: 'num', q: 'A 6.0 V supply is across two identical resistors. What is the output across one?', answer: 3, unit: 'V', explain: 'Equal resistors share equally.' },
        { type: 'num', q: 'A divider gives 2.0 V from 10 V. The bottom resistor is 5.0 kΩ. What is the top resistor (in kΩ)?', answer: 20, unit: 'kΩ', explain: 'Top 8.0 V : bottom 2.0 V = 4 : 1, so top = 20 kΩ.' },
        { type: 'mcq', q: 'In a divider, R₁ (top) is increased. The output across R₂ (bottom)…', options: ['decreases', 'increases', 'stays the same', 'becomes equal to V_in'], answer: 0, explain: 'R₂ gets a smaller share.' },
        { type: 'num', q: 'A 9.0 V divider uses 470 Ω (top) and 1000 Ω (bottom). What is V_out?', answer: 6.12, unit: 'V', explain: '9.0 × 1000/1470 = 6.1 V.' },
      ],
    },
    // ------------------------------------------------------------------ 11.2
    {
      id: '11.2', title: 'Potentiometers', levels: ['L2', 'L3'], minutes: 12,
      objectives: ['Explain how a potentiometer gives a variable output voltage', 'Compare a potentiometer with a rheostat', 'Calculate the output for a slider position'],
      sections: [
        { type: 'text', title: 'A divider you can adjust', html: r`<p>A <b>potentiometer</b> (“pot”) is a resistance track with a <b>sliding contact</b>. The whole track is connected across the supply, and the output is taken between the slider and one end. The slider splits the track into a top part and a bottom part — a potential divider whose ratio changes as you turn the knob.</p>` },
        { type: 'diagram', svg: POT, caption: 'Slider at the bottom: 0 V. Slider at the top: the full 9.0 V. Anywhere in between: a share.' },
        { type: 'text', title: 'Output for a slider position', html: r`<p>For a uniform (linear) track, the output is proportional to how far the slider is from the bottom: slider 30% of the way up → $V_{out} = 0.30\,V_{in}$. So a potentiometer gives a <b>smoothly variable output from 0 V up to the full supply</b>.</p>
<p>A <b>rheostat</b> (Lesson 5.6) uses only two connections and changes the <b>current</b> in a circuit; it can never reduce the voltage across a component all the way to zero. A potentiometer uses three connections and controls the <b>voltage</b> over the whole range.</p>` },
        { type: 'example', title: 'slider', q: r`<p>A 10 kΩ linear potentiometer is connected across 6.0 V. The slider is set so that 2.5 kΩ of track lies between the slider and the bottom. What is the output?</p>`, steps: [r`Bottom part 2.5 kΩ, top part $10 - 2.5 = 7.5$ kΩ.`, r`$V_{out} = 6.0 \times \dfrac{2.5}{10} = 1.5$ V.`], answer: '<p>1.5 V.</p>' },
        { type: 'sim', sim: 'divider-lab', caption: 'Choose “Potentiometer” and move the slider. The output follows the slider position.' },
        { type: 'text', title: 'Where you find them', html: r`<p>Volume knobs, light dimmers in electronics, joystick and steering sensors in game controllers (the position of the stick moves a slider), and position sensors on machines. Many “knobs” today are digital, but the idea is the same.</p>` },
        { type: 'key', points: ['Potentiometer: track + slider = adjustable potential divider.', 'Output from 0 V to the full supply.', 'Linear track: output ∝ slider position.', 'Rheostat controls current; potentiometer controls voltage.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A linear potentiometer across 12 V has its slider 25% of the way up the track. What is the output?', answer: 3, unit: 'V', explain: '0.25 × 12 = 3.0 V.' },
        { type: 'mcq', q: 'How many connections does a potentiometer use?', options: ['Three', 'Two', 'One', 'Four'], answer: 0, explain: 'Both ends of the track and the slider.' },
        { type: 'mcq', q: 'What is the advantage of a potentiometer over a rheostat for controlling a lamp?', options: ['It can reduce the lamp’s voltage all the way to zero', 'It uses less wire', 'It increases the supply voltage', 'It works only on AC'], answer: 0, explain: 'Full range from 0 V.' },
        { type: 'num', q: 'A 5.0 kΩ pot across 9.0 V has 4.0 kΩ of track between the slider and the bottom. What is V_out?', answer: 7.2, unit: 'V', explain: '9.0 × 4.0/5.0 = 7.2 V.' },
        { type: 'mcq', q: 'Moving the slider of a potentiometer towards the top (positive) end makes the output…', options: ['increase', 'decrease', 'stay the same', 'reverse'], answer: 0, explain: 'The bottom part gets bigger.' },
      ],
    },
    // ------------------------------------------------------------------ 11.3
    {
      id: '11.3', title: 'Sensor circuits', levels: ['L2', 'L3'], minutes: 20,
      objectives: ['Explain how an LDR or thermistor in a divider gives a changing output', 'Decide where to put the sensor for a rising or falling output', 'Calculate the output for a given sensor resistance'],
      sections: [
        { type: 'text', title: 'Turning resistance into voltage', html: r`<p>Replace one resistor in a divider with a sensor. When the sensor’s resistance changes, its <b>share</b> of the supply changes, so the output voltage changes. A voltage is much easier to measure, display or use to switch something on than a resistance.</p>
<p><b>The golden rule:</b> the component with the bigger resistance gets the bigger share of the voltage.</p>` },
        { type: 'diagram', svg: LDR_BOTTOM, caption: 'Dark → LDR resistance high → LDR (bottom) gets most of the voltage → V_out high.' },
        { type: 'example', title: 'night light', q: r`<p>In the circuit above the LDR has 1.0 kΩ in daylight and 100 kΩ in darkness. Find V_out in each case.</p>`, steps: [r`Daylight: $V_{out} = 6.0 \times \dfrac{1.0}{10 + 1.0} = 0.55$ V.`, r`Dark: $V_{out} = 6.0 \times \dfrac{100}{10 + 100} = 5.5$ V.`], answer: '<p>0.55 V in daylight, 5.5 V in the dark — a big change that can switch a lamp on at night.</p>' },
        { type: 'diagram', svg: THERM_TOP, caption: 'Hot → thermistor resistance low → thermistor (top) gets a small share → V_out (across the fixed resistor) high.' },
        { type: 'text', title: 'Where to put the sensor', html: r`<div class="tablewrap"><table><thead><tr><th>Sensor position</th><th>LDR: V_out when it gets brighter</th><th>Thermistor: V_out when it gets hotter</th></tr></thead><tbody>
<tr><td>Bottom (output across the sensor)</td><td>falls</td><td>falls</td></tr>
<tr><td>Top (output across the fixed resistor)</td><td>rises</td><td>rises</td></tr>
</tbody></table></div>
<p>So for a <b>fire alarm</b> (output rises with heat), put the thermistor at the top. For a <b>night light</b> (output rises in the dark), put the LDR at the bottom. Swapping the two components reverses the behaviour.</p>` },
        { type: 'sim', sim: 'divider-lab', caption: 'Choose “LDR sensor”, move the light slider, then tick “Swap positions”. Repeat with the thermistor.' },
        { type: 'example', title: 'thermistor', q: r`<p>In the thermistor circuit above, the thermistor has 10 kΩ at 25 °C and 1.0 kΩ at 80 °C. Find V_out at each temperature.</p>`, steps: [r`25 °C: $V_{out} = 9.0 \times \dfrac{2.2}{10 + 2.2} = 1.6$ V.`, r`80 °C: $V_{out} = 9.0 \times \dfrac{2.2}{1.0 + 2.2} = 6.2$ V.`], answer: '<p>1.6 V at 25 °C, rising to 6.2 V at 80 °C.</p>' },
        { type: 'tip', html: 'For the biggest change in output, choose a fixed resistor roughly equal to the sensor’s resistance at the condition you care about most (for example, the light level at dusk). Then the output is half the supply at exactly that point.' },
        { type: 'exam', standard: 'NCEA Level 2 and 3', html: '<p>Explain sensor circuits as a chain: condition changes → sensor resistance changes (and why: more charge carriers) → share of the voltage changes → output rises or falls. State clearly which component the output is across.</p>' },
        { type: 'key', points: ['Sensor + fixed resistor = potential divider; resistance change → voltage change.', 'Bigger resistance → bigger share of the voltage.', 'Sensor at the bottom: output falls as the sensor’s resistance falls.', 'Sensor at the top: output rises as the sensor’s resistance falls.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'An LDR is the bottom component of a divider. It gets darker. V_out (across the LDR)…', options: ['rises', 'falls', 'stays the same', 'becomes zero'], answer: 0, explain: 'LDR resistance rises, so it takes a bigger share.' },
        { type: 'mcq', q: 'For a fire alarm whose output rises with temperature, the thermistor should be…', options: ['the top component, with the output across the fixed resistor', 'the bottom component, with the output across it', 'connected in parallel with the battery', 'replaced by an LDR'], answer: 0, explain: 'Hot → thermistor R falls → fixed resistor’s share rises.' },
        { type: 'num', q: 'A 12 V divider has a 4.0 kΩ fixed resistor on top and a thermistor of 2.0 kΩ on the bottom. What is V_out across the thermistor?', answer: 4, unit: 'V', explain: '12 × 2/6 = 4.0 V.' },
        { type: 'num', q: 'In the night-light circuit (6.0 V, 10 kΩ top, LDR bottom), the LDR has 10 kΩ at dusk. What is V_out?', answer: 3, unit: 'V', explain: 'Equal resistances: half of 6.0 V.' },
        { type: 'mcq', q: 'Why are sensors usually used in a potential divider rather than on their own?', options: ['A changing voltage is easy to measure and use to switch other circuits', 'Sensors need very high voltages', 'It makes the sensor more sensitive to light', 'To stop the sensor heating up'], answer: 0, explain: 'Resistance changes become voltage changes.' },
      ],
    },
    // ------------------------------------------------------------------ 11.4
    {
      id: '11.4', title: 'Loading a potential divider', levels: ['L3'], minutes: 16,
      objectives: ['Explain why connecting a load lowers a divider’s output', 'Calculate the loaded output voltage', 'Choose divider values that are not affected much by a load'],
      sections: [
        { type: 'text', title: 'The hidden parallel resistor', html: r`<p>Anything connected to the output — a lamp, a meter, another circuit — is a <b>load</b> in <b>parallel with the bottom resistor</b>. The parallel pair has a smaller resistance than $R_2$ alone, so it takes a smaller share of the supply and the output voltage <b>drops</b>.</p>` },
        { type: 'diagram', svg: LOADED, caption: 'The load is in parallel with the bottom 10 kΩ resistor.' },
        { type: 'example', title: 'loaded output', q: r`<p>A 10 V supply is across two 10 kΩ resistors. (a) What is the output with no load? (b) What is it when a 10 kΩ load is connected across the bottom resistor?</p>`, steps: [r`(a) Equal resistors: $V_{out} = 5.0$ V.`, r`(b) Bottom pair: $R_{\parallel} = \dfrac{10 \times 10}{10 + 10} = 5.0$ kΩ.`, r`$V_{out} = 10 \times \dfrac{5.0}{10 + 5.0} = 3.3$ V.`], answer: '<p>5.0 V with no load, but only 3.3 V with the 10 kΩ load.</p>' },
        { type: 'text', title: 'Keeping the effect small', html: r`<p>The drop is small if the load resistance is <b>much bigger</b> than the bottom resistor (a rule of thumb: at least 10 times). Then the parallel combination is almost the same as $R_2$. For the divider above with a 1.0 MΩ load: $R_\parallel = 9.9$ kΩ and $V_{out} = 4.98$ V — barely changed.</p>
<p>This is why a good voltmeter has a very high resistance (around 10 MΩ): it hardly loads the circuit it measures. A cheap meter with low resistance would read too low.</p>` },
        { type: 'sim', sim: 'divider-lab', caption: 'Set two 10 kΩ resistors, then try each load. Which load barely changes V_out?' },
        { type: 'try', question: { type: 'num', q: 'A 12 V supply is across two 4.0 kΩ resistors. A 4.0 kΩ load is connected across the bottom one. What is V_out?', answer: 4, unit: 'V', explain: 'Bottom pair 2.0 kΩ; 12 × 2/6 = 4.0 V.' } },
        { type: 'misconception', wrong: 'A voltmeter shows the voltage that was there before it was connected.', right: 'Connecting a voltmeter adds a load. With a high-resistance meter the change is tiny, but with a low-resistance meter across a high-resistance divider, the reading can be noticeably too low.' },
        { type: 'key', points: ['A load is in parallel with the bottom resistor.', 'Parallel combination is smaller → output drops.', 'Keep the load ≥ 10 × R₂ to make the drop small.', 'High-resistance voltmeters avoid loading errors.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'Connecting a load to the output of a potential divider makes the output…', options: ['fall', 'rise', 'stay exactly the same', 'reverse'], answer: 0, explain: 'The bottom section’s resistance is reduced.' },
        { type: 'num', q: 'A 9.0 V divider has 6.0 kΩ (top) and 3.0 kΩ (bottom). What is V_out with no load?', answer: 3, unit: 'V', explain: '9.0 × 3/9 = 3.0 V.' },
        { type: 'num', q: 'A 6.0 kΩ load is connected across the 3.0 kΩ bottom resistor in the last question. What is V_out now?', answer: 2.25, unit: 'V', explain: 'Bottom pair = 2.0 kΩ; 9.0 × 2/8 = 2.25 V.' },
        { type: 'mcq', q: 'Which load would change a divider with a 1 kΩ bottom resistor the least?', options: ['100 kΩ', '10 kΩ', '1 kΩ', '100 Ω'], answer: 0, explain: 'Much larger than R₂.' },
        { type: 'mcq', q: 'Why should a voltmeter have a very high resistance?', options: ['So it draws almost no current and does not load the circuit', 'So it can measure larger currents', 'To make it more robust', 'So it works on AC'], answer: 0, explain: 'Minimises the loading effect.' },
      ],
    },
    // ------------------------------------------------------------------ 11.5
    {
      id: '11.5', title: 'From sensor to action', levels: ['L3', 'Uni'], minutes: 16,
      objectives: ['Describe how a sensor circuit switches a device on', 'Design a divider for a given switching voltage', 'Explain the Wheatstone bridge (going deeper)'],
      sections: [
        { type: 'text', title: 'Switching something on', html: r`<p>A potential divider’s output cannot usually power a lamp or buzzer directly — it would load the divider (Lesson 11.4). Instead, the output drives an electronic switch that needs almost no current:</p>
<ul><li>A <b>transistor</b> switches on when the voltage at its input passes about 0.7 V, and can then control a much larger current through a lamp, buzzer, motor or relay.</li><li>A <b>comparator</b> (or a microcontroller such as an Arduino) compares the sensor voltage with a set <b>reference voltage</b> and switches its output when the sensor voltage crosses it.</li></ul>
<p>The potential divider is the “sense” part; the transistor or comparator is the “decide and act” part.</p>` },
        { type: 'example', title: 'designing a frost alarm', q: r`<p>A frost alarm should switch on when the temperature falls below 2 °C, when the thermistor has 30 kΩ. The comparator switches when its input rises above 4.5 V. The supply is 9.0 V. Where should the thermistor go, and what fixed resistor is needed?</p>`, steps: ['Colder → thermistor resistance rises. We want the output to rise as it gets colder, so the output must be across the thermistor: put it at the bottom.', r`Switching point: $V_{out} = 4.5$ V, exactly half the supply, so the fixed resistor must equal the thermistor’s resistance then.`, r`Fixed resistor $= 30$ kΩ (on top).`], answer: '<p>Thermistor at the bottom, 30 kΩ fixed resistor at the top. Above 2 °C the thermistor has less than 30 kΩ, so V_out is below 4.5 V and the alarm stays off.</p>' },
        { type: 'text', title: 'A variable resistor for fine-tuning', html: r`<p>Real sensors vary, so designers often use a <b>variable resistor</b> in place of the fixed one. Turning it changes the switching point — for example, adjusting the light level at which a street light comes on. It is the same divider, just with an adjustable ratio.</p>` },
        { type: 'deeper', levels: ['Uni'], title: 'the Wheatstone bridge', html: r`<p>Two potential dividers side by side, sharing the same supply, form a <b>Wheatstone bridge</b>. A meter connected between the two outputs reads zero when the dividers have the same ratio: $\dfrac{R_1}{R_2} = \dfrac{R_3}{R_4}$. If one resistor is a sensor, a tiny change in its resistance makes the bridge unbalanced, giving a small voltage that can be amplified. Bridges are used in electronic scales (strain gauges), precise thermometers and pressure sensors, because they measure small changes very accurately.</p>` },
        { type: 'funfact', title: 'street lights that wait', html: 'Many street-light controllers include a time delay, so a passing car’s headlights or a lightning flash do not switch the lights off. The light sensor’s output has to stay past the switching point for a while before anything happens.' },
        { type: 'key', points: ['Divider senses; transistor, comparator or microcontroller acts.', 'Switching point: set the divider ratio so V_out equals the switching voltage at the chosen condition.', 'If V_out should be half the supply, the fixed resistor equals the sensor’s resistance at that condition.', 'Going deeper: Wheatstone bridge balances when R₁/R₂ = R₃/R₄.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'Why is a lamp not connected directly to the output of a sensor divider?', options: ['It would draw current and lower the output, so the divider would not work properly', 'Lamps need AC', 'The divider voltage is always too high', 'The lamp would change the sensor’s resistance'], answer: 0, explain: 'Loading effect.' },
        { type: 'num', q: 'A comparator switches at 6.0 V from a 12 V supply. The LDR has 5.0 kΩ at the chosen light level. What fixed resistor gives switching at exactly that light level?', answer: 5, unit: 'kΩ', explain: 'Half the supply → equal resistances: 5.0 kΩ.' },
        { type: 'mcq', q: 'In a dark-activated circuit with the output across the LDR, the LDR should be…', options: ['the bottom component', 'the top component', 'in parallel with the supply', 'replaced by a thermistor'], answer: 0, explain: 'Dark → LDR R rises → its share rises.' },
        { type: 'mcq', q: 'Replacing the fixed resistor with a variable resistor lets you…', options: ['adjust the light or temperature at which the device switches', 'increase the supply voltage', 'turn AC into DC', 'stop the sensor from heating'], answer: 0, explain: 'It changes the divider ratio.' },
        { type: 'mcq', q: 'A Wheatstone bridge is balanced (meter reads zero) when…', options: ['R₁/R₂ = R₃/R₄', 'all resistors are equal to 1 Ω', 'the supply is zero', 'R₁ + R₂ = R₃ + R₄'], answer: 0, explain: 'Both dividers give the same output.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'A 6.0 V supply is across 2.0 kΩ (top) and 1.0 kΩ (bottom). Calculate the output across the bottom resistor.', answer: 2, unit: 'V', explain: '6.0 × 1/3 = 2.0 V.' },
      { type: 'mcq', q: 'What happens to the resistance of an LDR as it gets darker?', options: ['It increases', 'It decreases', 'It stays the same', 'It becomes zero'], answer: 0, explain: 'Fewer charge carriers freed by light.' },
      { type: 'num', q: 'A linear potentiometer across 9.0 V has its slider halfway. What is the output?', answer: 4.5, unit: 'V', explain: 'Half of 9.0 V.' },
      { type: 'mcq', q: 'In a potential divider, which resistor has the larger voltage across it?', options: ['The one with the larger resistance', 'The one with the smaller resistance', 'The top one, always', 'They always have equal voltages'], answer: 0, explain: 'Voltage shares in proportion to resistance.' },
      { type: 'num', q: 'A divider gives 3.0 V from 12 V. What fraction of the total resistance is the bottom resistor?', answer: 0.25, explain: '3/12 = 1/4.' },
    ],
    M: [
      { type: 'num', q: 'A thermistor (top) and a 3.3 kΩ resistor (bottom) form a divider across 5.0 V. At 60 °C the thermistor is 1.7 kΩ. Calculate V_out across the fixed resistor.', answer: 3.3, unit: 'V', explain: '5.0 × 3.3/5.0 = 3.3 V.' },
      { type: 'num', q: 'Two 20 kΩ resistors form a divider across 8.0 V. A 20 kΩ load is connected across the bottom resistor. Calculate the new output.', answer: 2.67, unit: 'V', explain: 'Bottom pair 10 kΩ; 8.0 × 10/30 = 2.7 V.' },
      { type: 'explain', q: 'An LDR is the bottom component of a potential divider with a fixed resistor on top. Explain what happens to the output voltage (across the LDR) when the light level increases.', model: '<p>When the light level increases, light frees more charge carriers in the LDR’s semiconductor, so its resistance decreases. In a potential divider the supply voltage is shared in proportion to resistance. With a smaller resistance, the LDR now has a smaller share of the supply voltage compared with the fixed resistor, so the output voltage across the LDR decreases.</p>', points: [{ lvl: 'A', text: 'Output voltage decreases' }, { lvl: 'M', text: 'LDR resistance decreases with more light' }, { lvl: 'M', text: 'Voltage shared in proportion to resistance, so the LDR’s share falls' }] },
      { type: 'num', q: 'A potentiometer of total resistance 10 kΩ is across 12 V. What resistance must lie between the slider and the bottom to give 3.0 V (in kΩ)?', answer: 2.5, unit: 'kΩ', explain: '3.0/12 = 0.25 of 10 kΩ = 2.5 kΩ.' },
    ],
    E: [
      { type: 'explain', q: 'Design a circuit that turns on a heater when a greenhouse gets too cold. Use a thermistor, a fixed resistor and a switching device that turns on when its input rises above half the supply voltage. Explain where each component goes and how the circuit works, including how to choose the fixed resistor.', model: '<p>Use a potential divider across the supply with the fixed resistor on top and the thermistor on the bottom, and connect the switching device’s input across the thermistor. When the temperature falls, the thermistor’s semiconductor has fewer free charge carriers, so its resistance rises. It then takes a larger share of the supply voltage, so the input voltage rises. When it rises above half the supply, the switching device turns on the heater. The switch-on point is when the thermistor and the fixed resistor have equal resistances, so choose the fixed resistor equal to the thermistor’s resistance at the temperature where the heater should come on (read from the thermistor’s graph). A variable resistor could be used instead to adjust this temperature. The switching device draws almost no current, so it does not load the divider.</p>', points: [{ lvl: 'A', text: 'Thermistor and fixed resistor in a divider' }, { lvl: 'M', text: 'Thermistor at the bottom with output across it (rises when colder)' }, { lvl: 'E', text: 'Explains cold → higher R → bigger share → switches at half supply' }, { lvl: 'E', text: 'Fixed resistor = thermistor resistance at the set temperature (or variable resistor); mentions loading' }] },
      { type: 'num', q: 'A divider of 4.7 kΩ (top) and 4.7 kΩ (bottom) across 10 V is measured with a voltmeter of resistance 47 kΩ across the bottom resistor. What does the voltmeter read?', answer: 4.76, unit: 'V', explain: 'Bottom pair = 4.7 × 47/51.7 = 4.27 kΩ; V = 10 × 4.27/8.97 = 4.76 V (instead of 5.00 V).' },
      { type: 'explain', q: 'A student uses a 1 kΩ + 1 kΩ divider and another student uses a 1 MΩ + 1 MΩ divider, both across 6.0 V, to give 3.0 V. Discuss the advantages and disadvantages of each when a 10 kΩ load is connected.', model: '<p>With no load both give 3.0 V, because only the ratio matters. The 1 kΩ divider draws 3 mA from the supply all the time, which wastes energy (18 mW), but when the 10 kΩ load is connected the bottom pair becomes 1 × 10/11 = 0.91 kΩ, so the output only falls to 6.0 × 0.91/1.91 = 2.9 V. The 1 MΩ divider wastes very little energy (3 μA), but the 10 kΩ load is much smaller than 1 MΩ: the bottom pair becomes about 9.9 kΩ, and the output collapses to about 6.0 × 9.9/1010 ≈ 0.06 V. So low-value resistors cope with loads better but waste more energy; high-value resistors save energy but only work with very high-resistance loads.</p>', points: [{ lvl: 'A', text: 'Both give 3.0 V with no load' }, { lvl: 'M', text: 'Low values waste more current/energy; high values waste less' }, { lvl: 'E', text: 'Correct loaded outputs (≈2.9 V vs ≈0.06 V)' }, { lvl: 'E', text: 'Conclusion: trade-off between loading and energy use' }] },
    ],
  },
  glossary: [
    { term: 'Potential divider', def: 'Two or more resistors in series across a supply, with an output taken across one of them.' },
    { term: 'Output voltage (V_out)', def: 'The voltage across the bottom component of a divider.' },
    { term: 'Potentiometer', def: 'A resistance track with a slider, giving an adjustable output from 0 V to the supply.' },
    { term: 'Load', def: 'Anything connected to a circuit’s output that draws current.' },
    { term: 'Loading effect', def: 'The drop in a divider’s output when a load is connected in parallel with the bottom resistor.' },
    { term: 'Comparator', def: 'A circuit that switches its output when an input voltage crosses a reference voltage.' },
    { term: 'Transistor', def: 'An electronic switch or amplifier: a small input controls a larger current.' },
    { term: 'Wheatstone bridge', def: 'Two dividers side by side; balanced when R₁/R₂ = R₃/R₄.' },
  ],
  formulas: [
    { name: 'Potential divider', tex: r`V_{out} = V_{in}\,\frac{R_2}{R_1 + R_2}`, note: 'Output across R₂; no load.', level: 'L2 / L3' },
    { name: 'Voltage ratio', tex: r`\frac{V_1}{V_2} = \frac{R_1}{R_2}`, note: 'Series resistors share in proportion.', level: 'L2' },
    { name: 'Loaded divider', tex: r`R_{\parallel} = \frac{R_2 R_L}{R_2 + R_L}`, note: 'Replace R₂ with this, then use the divider formula.', level: 'L3' },
    { name: 'Bridge balance', tex: r`\frac{R_1}{R_2} = \frac{R_3}{R_4}`, note: 'Going deeper.', level: 'Uni' },
  ],
  flashcards: [
    { front: 'Potential divider formula', back: 'V_out = V_in × R₂/(R₁ + R₂)' }, { front: 'Which resistor gets more voltage?', back: 'The larger one' },
    { front: 'LDR at the bottom, gets darker', back: 'V_out rises' }, { front: 'Thermistor at the top, gets hotter', back: 'V_out (across fixed resistor) rises' },
    { front: 'Effect of a load on a divider', back: 'Output falls (load in parallel with R₂)' }, { front: 'Rule of thumb for loads', back: 'R_load ≥ 10 × R₂' },
    { front: 'Potentiometer vs rheostat', back: 'Pot controls voltage (3 terminals); rheostat controls current (2)' },
  ],
};
