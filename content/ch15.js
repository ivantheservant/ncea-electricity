/**
 * Chapter 15 — Transformers & the National Grid.
 */
import { svg, comp, wire, label, arrow } from '../js/utils/svg.js';

const r = String.raw;

const TRANSFORMER = (() => {
  const coil = (x, n, right) => {
    let s = '';
    for (let i = 0; i < n; i++) { const y = 62 + i * (106 / n); s += `<path d="M${x - 14},${y} C ${x + (right ? 24 : -24)},${y + 2} ${x + (right ? 24 : -24)},${y + 106 / n - 2} ${x - 14},${y + 106 / n}" style="stroke:var(--warn, #c9822b);stroke-width:2.5"/>`; }
    return s;
  };
  return svg(540, 230, '<rect x="150" y="40" width="220" height="150" rx="6" style="fill:none;stroke:var(--ink-3);stroke-width:22"/>' + coil(150, 8, false) + coil(384, 4, true) +
    wire([136, 62], [60, 62]) + wire([136, 168], [60, 168]) + comp('ac', 60, 168, 60, 62, { label: 'AC in', labelPos: 'left' }) +
    wire([398, 62], [470, 62]) + wire([398, 168], [470, 168]) + comp('bulb', 470, 62, 470, 168, { label: 'load', labelPos: 'right', lit: 0.8 }) +
    label(150, 215, 'primary coil (Nₚ turns)', { cls: 'small bold' }) + label(380, 215, 'secondary coil (Nₛ turns)', { cls: 'small bold' }) + label(260, 30, 'laminated iron core', { cls: 'small bold' }) +
    arrow(200, 115, 320, 115, 'field') + label(260, 108, 'changing flux', { cls: 'small' }),
  { title: 'Transformer: AC in the primary coil makes a changing flux in the iron core, which induces a voltage in the secondary coil', maxw: 560 });
})();

const GRID_FULL = svg(660, 210, [
  '<rect x="10" y="70" width="90" height="60" rx="8" class="fill-soft"/>', label(55, 98, 'generator', { cls: 'small bold' }), label(55, 116, '11–22 kV', { cls: 'small' }),
  arrow(102, 100, 135, 100), '<rect x="135" y="75" width="70" height="50" rx="8" class="fill-green"/>', label(170, 98, 'step-up', { cls: 'small bold' }), label(170, 114, '× ~10–20', { cls: 'small' }),
  arrow(207, 100, 250, 100), label(300, 80, 'grid 220 kV', { cls: 'small bold' }), label(300, 120, 'low current', { cls: 'small' }), label(300, 136, 'small I²R loss', { cls: 'small' }), wire([250, 100], [350, 100]),
  arrow(350, 100, 385, 100), '<rect x="385" y="75" width="80" height="50" rx="8" class="fill-green"/>', label(425, 98, 'substation', { cls: 'small bold' }), label(425, 114, '→ 33 / 11 kV', { cls: 'small' }),
  arrow(467, 100, 500, 100), '<rect x="500" y="75" width="70" height="50" rx="8" class="fill-green"/>', label(535, 98, 'street', { cls: 'small bold' }), label(535, 114, '→ 400/230 V', { cls: 'small' }),
  arrow(572, 100, 600, 100), label(625, 104, 'home', { cls: 'small bold' }),
  label(330, 190, 'Each green box is a transformer. Only AC can be transformed.', { cls: 'small bold' }),
].join(''), { title: 'Transformers step the voltage up for transmission and down in stages for use', maxw: 680 });

export default {
  intro: 'Transformers are the reason the world runs on AC. With nothing but two coils and an iron core — no moving parts — they change 230 V into the 5 V your phone needs, or 11 kV from a generator into 220 kV for the grid, with almost no energy lost. This final Stage 1 chapter uses everything from induction to power to explain them, and pulls together the whole journey from power station to power point.',
  standards: 'NCEA Level 2 AS 91173 (electromagnetic induction applied to transformers and transmission) and Level 3 AS 91526 (AC systems).',
  lessons: [
    // ------------------------------------------------------------------ 15.1
    {
      id: '15.1', title: 'How a transformer works', levels: ['L2', 'L3'], minutes: 15,
      objectives: ['Describe the structure of a transformer', 'Explain how a transformer works using induction', 'Explain why a transformer does not work on DC'],
      sections: [
        { type: 'text', title: 'Two coils and a core', html: r`<p>A transformer has a <b>primary coil</b> connected to the AC supply and a <b>secondary coil</b> connected to the output, both wound on the same <b>iron core</b>. The coils are not electrically connected — energy is passed between them by the changing magnetic field.</p>` },
        { type: 'diagram', svg: TRANSFORMER, caption: 'The core guides the primary’s changing flux through the secondary coil.' },
        { type: 'text', title: 'Step by step', html: r`<ol><li>An <b>alternating current</b> flows in the primary coil.</li><li>It produces a magnetic field in the iron core that is <b>constantly changing</b> — growing, shrinking and reversing 50 times a second.</li><li>The iron core carries this changing flux through the secondary coil.</li><li>A <b>changing flux</b> through the secondary <b>induces an alternating voltage</b> in it (Faraday’s law), at the same frequency.</li></ol>` },
        { type: 'text', title: 'Why not DC?', html: r`<p>A steady DC current makes a steady magnetic field. The flux through the secondary is constant, so <b>no voltage is induced</b> — apart from a brief pulse at the moment you switch on or off. That is the main reason power grids use AC: only AC can be stepped up and down by transformers.</p>` },
        { type: 'sim', sim: 'transformer-lab', caption: 'Switch between AC and DC input. Then change the numbers of turns.' },
        { type: 'misconception', wrong: 'Current flows from the primary coil through the core into the secondary coil.', right: 'The coils are insulated from each other and from the core. Only the changing magnetic flux links them; the secondary current is induced.' },
        { type: 'funfact', title: 'the hum', html: 'The 100 Hz hum you hear from transformers comes from the iron core: it changes shape very slightly each time it is magnetised (twice per cycle), an effect called magnetostriction.' },
        { type: 'key', points: ['Primary coil, secondary coil, shared iron core.', 'AC in primary → changing flux → induced AC in secondary.', 'DC gives steady flux → no output.', 'Output frequency = input frequency.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'What links the primary and secondary coils of a transformer?', options: ['A changing magnetic flux in the iron core', 'A copper wire', 'A current through the core', 'Nothing at all'], answer: 0, explain: 'Induction through the core.' },
        { type: 'mcq', q: 'Why does a transformer not work with a steady DC supply?', options: ['The flux is steady, so no voltage is induced in the secondary', 'DC is too dangerous', 'The core would melt', 'DC flows the wrong way'], answer: 0, explain: 'Induction needs change.' },
        { type: 'mcq', q: 'A transformer’s input is 50 Hz AC. The output frequency is…', options: ['50 Hz', '100 Hz', '25 Hz', 'it depends on the turns ratio'], answer: 0, explain: 'The secondary follows the primary’s changes.' },
        { type: 'mcq', q: 'What is the core made of?', options: ['Iron', 'Copper', 'Aluminium', 'Plastic'], answer: 0, explain: 'A magnetic material concentrates the flux.' },
        { type: 'tf', q: 'The primary and secondary coils are electrically connected to each other.', answer: false, explain: 'They are insulated; only flux links them.' },
      ],
    },
    // ------------------------------------------------------------------ 15.2
    {
      id: '15.2', title: 'The transformer equation', levels: ['L2', 'L3'], minutes: 16,
      objectives: ['Use Vp/Vs = Np/Ns', 'Identify step-up and step-down transformers', 'Design a transformer for a given output'],
      sections: [
        { type: 'formula', title: 'Turns ratio', tex: r`\frac{V_p}{V_s} = \frac{N_p}{N_s}`, symbols: [['V_p, V_s', 'primary and secondary voltages', 'V'], ['N_p, N_s', 'numbers of turns on the primary and secondary', '']], html: r`<p>Each turn of either coil has the same changing flux through it, so each turn has the same voltage induced across it. The coil voltages are therefore in proportion to their numbers of turns.</p>` },
        { type: 'text', title: 'Step up, step down', html: r`<ul><li><b>Step-up</b>: more turns on the secondary ($N_s > N_p$) → $V_s > V_p$. Used at power stations.</li><li><b>Step-down</b>: fewer turns on the secondary ($N_s < N_p$) → $V_s < V_p$. Used in substations, street transformers and chargers.</li></ul>` },
        { type: 'example', title: 'step-down', q: r`<p>A transformer has 2000 turns on its primary and 100 turns on its secondary. It is connected to 230 V AC. Find the output voltage.</p>`, steps: [r`$V_s = V_p \times \dfrac{N_s}{N_p} = 230 \times \dfrac{100}{2000}$.`, r`$V_s = 11.5$ V.`], answer: '<p>11.5 V — a step-down transformer.</p>' },
        { type: 'example', title: 'design', q: r`<p>A power station generator gives 11 kV. How many turns are needed on the secondary to step it up to 220 kV, if the primary has 500 turns?</p>`, steps: [r`Ratio: $\dfrac{220}{11} = 20$, so $N_s = 20 \times N_p$.`, r`$N_s = 20 \times 500 = 10\,000$ turns.`], answer: '<p>10 000 turns.</p>' },
        { type: 'sim', sim: 'transformer-lab', caption: 'Make a 12 V output from 230 V. Then build a step-up transformer.' },
        { type: 'try', question: { type: 'num', q: 'A transformer steps 240 V down to 12 V. Its secondary has 50 turns. How many turns are on the primary?', answer: 1000, explain: 'Np = Ns × Vp/Vs = 50 × 20 = 1000 turns.' } },
        { type: 'misconception', wrong: 'A step-up transformer creates energy, because the voltage goes up.', right: 'The voltage goes up, but the current goes down by the same factor (Lesson 15.3). Power out can never exceed power in.' },
        { type: 'key', points: [r`$V_p/V_s = N_p/N_s$.`, 'More secondary turns → step-up; fewer → step-down.', 'Each turn has the same induced voltage.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A transformer has 500 primary turns and 25 secondary turns. With 230 V in, what is the output voltage?', answer: 11.5, unit: 'V', explain: '230 × 25/500 = 11.5 V.' },
        { type: 'num', q: 'A step-up transformer has a turns ratio Ns : Np of 10 : 1. With 120 V in, what is the output?', answer: 1200, unit: 'V', explain: '120 × 10 = 1200 V.' },
        { type: 'mcq', q: 'A transformer with 200 primary turns and 800 secondary turns is a…', options: ['step-up transformer', 'step-down transformer', 'one-to-one transformer', 'rectifier'], answer: 0, explain: 'More secondary turns.' },
        { type: 'num', q: 'A phone charger steps 230 V down to 5.0 V. The primary has 2300 turns. How many secondary turns?', answer: 50, explain: 'Ns = 2300 × 5.0/230 = 50.' },
        { type: 'mcq', q: 'Why does each turn of the secondary have the same voltage induced in it?', options: ['The same changing flux passes through every turn', 'The turns are connected in parallel', 'Each turn has the same resistance', 'The current is the same in each'], answer: 0, explain: 'Shared flux in the core.' },
      ],
    },
    // ------------------------------------------------------------------ 15.3
    {
      id: '15.3', title: 'Power, current and efficiency', levels: ['L2', 'L3'], minutes: 18,
      objectives: ['Use VpIp = VsIs for an ideal transformer', 'Calculate transformer efficiency', 'Explain the sources of energy loss and how they are reduced'],
      sections: [
        { type: 'text', title: 'Power in = power out (ideally)', html: r`<p>An ideal transformer wastes no energy, so the power into the primary equals the power out of the secondary:</p>
<p>$$V_pI_p = V_sI_s \qquad\Rightarrow\qquad \frac{I_s}{I_p} = \frac{V_p}{V_s} = \frac{N_p}{N_s}$$</p>
<p>Stepping the voltage <b>up</b> steps the current <b>down</b> by the same factor, and vice versa. This is exactly what the grid needs: high voltage and low current for transmission (Lesson 8.4).</p>` },
        { type: 'example', title: 'currents', q: r`<p>A step-down transformer supplies 12 V to a 60 W lamp from 230 V mains. Assuming it is ideal, find the current in the lamp and in the primary coil.</p>`, steps: [r`Secondary: $I_s = \dfrac{P}{V_s} = \dfrac{60}{12} = 5.0$ A.`, r`Primary: $I_p = \dfrac{P}{V_p} = \dfrac{60}{230} = 0.26$ A.`], answer: '<p>5.0 A in the lamp, but only 0.26 A drawn from the mains.</p>' },
        { type: 'text', title: 'Real transformers', html: r`<p>Large transformers are among the most efficient machines ever built — often 98–99%. The small losses come from:</p>
<ul><li><b>Resistance of the coils</b> ($I^2R$ heating, “copper losses”): reduced with thick copper wire, especially on the high-current side.</li><li><b>Eddy currents</b> induced in the iron core (Lesson 14.3): reduced by making the core from thin <b>laminated</b> sheets insulated from each other, which breaks up the current paths.</li><li><b>Hysteresis</b>: energy used re-magnetising the core 100 times a second; reduced with “soft” iron alloys that magnetise easily.</li><li><b>Flux leakage</b>: some flux misses the secondary; reduced by winding the coils on top of each other.</li></ul>` },
        { type: 'formula', title: 'Efficiency', tex: r`\text{efficiency} = \frac{V_sI_s}{V_pI_p} \times 100\%` },
        { type: 'example', title: 'efficiency', q: r`<p>A transformer takes 0.50 A from 230 V and supplies 9.0 A at 12 V. Find its efficiency and the power wasted.</p>`, steps: [r`Input: $230 \times 0.50 = 115$ W. Output: $12 \times 9.0 = 108$ W.`, r`Efficiency: $\dfrac{108}{115} \times 100\% = 94\%$.`, r`Wasted: $115 - 108 = 7$ W, mostly as heat.`], answer: '<p>94%; 7 W wasted.</p>' },
        { type: 'sim', sim: 'transformer-lab', caption: 'Tick “Real transformer” and compare the primary current with the ideal case.' },
        { type: 'try', question: { type: 'num', q: 'An ideal transformer steps 11 kV up to 220 kV. The primary current is 400 A. What is the secondary current?', answer: 20, unit: 'A', explain: 'Is = Ip × Vp/Vs = 400 × 11/220 = 20 A.' } },
        { type: 'misconception', wrong: 'Laminating the core stops the magnetic field getting through.', right: 'The thin sheets still carry the magnetic flux easily. The insulation between them only blocks the eddy currents.' },
        { type: 'key', points: [r`Ideal: $V_pI_p = V_sI_s$; current changes opposite to voltage.`, 'Efficiency = output power ÷ input power × 100% (often 95–99%).', 'Losses: coil resistance, eddy currents, hysteresis, flux leakage.', 'Laminated core reduces eddy currents.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'An ideal transformer steps 230 V down to 23 V. The secondary current is 4.0 A. What is the primary current?', answer: 0.4, unit: 'A', explain: 'Ip = Is × Vs/Vp = 4.0 × 23/230 = 0.40 A.' },
        { type: 'num', q: 'A transformer takes 200 W and delivers 190 W. What is its efficiency (%)?', answer: 95, unit: '%', explain: '190/200 × 100 = 95%.' },
        { type: 'mcq', q: 'Why is a transformer core laminated?', options: ['To reduce eddy currents', 'To increase the voltage', 'To make it lighter', 'To stop the flux'], answer: 0, explain: 'Insulated layers break up eddy current paths.' },
        { type: 'mcq', q: 'A transformer steps the voltage up by a factor of 10. The current…', options: ['is divided by 10', 'is multiplied by 10', 'stays the same', 'is multiplied by 100'], answer: 0, explain: 'Power is conserved.' },
        { type: 'mcq', q: 'Which loss is reduced by using thick copper wire for the coils?', options: ['Resistive heating of the coils', 'Eddy currents in the core', 'Hysteresis', 'Flux leakage'], answer: 0, explain: 'Lower resistance → less I²R.' },
      ],
    },
    // ------------------------------------------------------------------ 15.4
    {
      id: '15.4', title: 'Transformers in the grid and at home', levels: ['L2'], minutes: 16,
      objectives: ['Explain the role of transformers in the national grid', 'Calculate the benefit of high-voltage transmission', 'Identify transformers in everyday devices'],
      sections: [
        { type: 'diagram', svg: GRID_FULL, caption: 'The complete journey: generate, step up, transmit, step down in stages.' },
        { type: 'text', title: 'Putting the course together', html: r`<p>Everything from Stage 1 meets here:</p>
<ul><li>A <b>generator</b> (Ch 14) turns the energy of falling water, steam or wind into AC at around 11–22 kV.</li><li>A <b>step-up transformer</b> (Ch 15) raises it to 220 kV, cutting the current.</li><li>Lower current means much lower <b>I²R losses</b> in the lines (Ch 7–8).</li><li><b>Step-down transformers</b> in substations and streets reduce it to 230 V for homes, where appliances are connected in <b>parallel</b> (Ch 3, 6), protected by <b>breakers and RCDs</b> (Ch 7).</li><li>Inside your devices, chargers use small transformers or electronics plus <b>rectifiers</b> (Ch 8) to give low-voltage DC.</li></ul>` },
        { type: 'example', title: 'the benefit in numbers', q: r`<p>A generator produces 50 MW at 11 kV. It is sent through lines of resistance 4.0 Ω either directly or after a step-up transformer to 220 kV. Compare the power lost.</p>`, steps: [r`At 11 kV: $I = \dfrac{50 \times 10^6}{11 \times 10^3} = 4545$ A; loss $= 4545^2 \times 4.0 = 8.3 \times 10^{7}$ W — more than the power sent! It simply could not work.`, r`At 220 kV: $I = \dfrac{50 \times 10^6}{220 \times 10^3} = 227$ A; loss $= 227^2 \times 4.0 = 2.1 \times 10^{5}$ W — about 0.4%.`], answer: '<p>Stepping up by 20 times cuts the current by 20 and the loss by 400.</p>' },
        { type: 'text', title: 'HVDC links', html: r`<p>The Cook Strait link (Lesson 8.5) uses DC, so transformers cannot step it up directly. Converter stations at Benmore and Haywards use transformers on the AC side, then giant electronic switches (thyristors and transistors) to turn AC into DC for the cable, and back into AC at the other end.</p>` },
        { type: 'text', title: 'Transformers around you', html: r`<ul><li><b>Phone and laptop chargers</b>: modern ones switch the mains at tens of thousands of times a second so a tiny transformer can do the job, then rectify to DC.</li><li><b>Electric toothbrushes and wireless phone chargers</b>: the primary coil is in the base and the secondary in the device — no metal contacts, so water cannot get in.</li><li><b>Doorbells, garden lights and older halogen lamps</b>: 230 V to 12 V or 24 V.</li><li><b>Welders and microwave ovens</b>: transformers to very high currents or high voltages.</li></ul>` },
        { type: 'misconception', wrong: 'The 230 V in homes comes straight from the power station.', right: 'It has passed through several transformers. The power station’s output was stepped up to 220 kV and down again in stages.' },
        { type: 'funfact', title: 'giant transformers', html: 'The transformers at a large power station can each weigh hundreds of tonnes and handle hundreds of megawatts — yet they typically waste less than 1% of the energy passing through them.' },
        { type: 'key', points: ['Step up for transmission (low current, low loss); step down for use.', 'Higher voltage by a factor k → current ÷ k → loss ÷ k².', 'HVDC needs converter stations, as DC cannot be transformed.', 'Chargers, wireless chargers and doorbells all use transformers.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'Why is electricity stepped up before transmission?', options: ['To reduce the current and therefore the I²R losses', 'To increase the current', 'To make it safer for homes', 'To change it into DC'], answer: 0, explain: 'Lower current → much lower loss.' },
        { type: 'num', q: 'Stepping up the voltage by a factor of 5 reduces the power lost in the lines by what factor?', answer: 25, explain: 'Current ÷ 5, loss ∝ I², so ÷ 25.' },
        { type: 'mcq', q: 'Why does the HVDC link need converter stations?', options: ['Transformers cannot change DC voltages, so AC must be converted to DC and back', 'DC travels faster', 'The cable only carries AC', 'To make the frequency 50 Hz'], answer: 0, explain: 'Transformers need AC.' },
        { type: 'mcq', q: 'How does a wireless phone charger transfer energy?', options: ['A changing field from a coil in the pad induces a current in a coil in the phone', 'Through radio waves', 'By heating the phone', 'Through metal contacts'], answer: 0, explain: 'Transformer action without a shared core.' },
        { type: 'order', q: 'Put these in order from power station to home.', items: ['Generator (about 11 kV)', 'Step-up transformer', '220 kV transmission line', 'Substation step-down', 'Street transformer (230 V)'], explain: 'Generate, step up, transmit, step down, step down again.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'A transformer has 1200 primary turns and 60 secondary turns. Calculate the output voltage from a 240 V supply.', answer: 12, unit: 'V', explain: '240 × 60/1200 = 12 V.' },
      { type: 'mcq', q: 'What is the function of the iron core in a transformer?', options: ['To carry the changing flux from the primary through the secondary', 'To conduct current between the coils', 'To store energy', 'To insulate the coils'], answer: 0, explain: 'It links the flux.' },
      { type: 'mcq', q: 'A transformer has more turns on its secondary than its primary. It is a…', options: ['step-up transformer', 'step-down transformer', 'generator', 'motor'], answer: 0, explain: 'Ns > Np.' },
      { type: 'num', q: 'A transformer takes 500 W and delivers 480 W. Calculate its efficiency (%).', answer: 96, unit: '%', explain: '480/500 × 100 = 96%.' },
      { type: 'mcq', q: 'Why will a transformer not work with a battery?', options: ['A battery gives DC, which produces a steady flux and induces no voltage', 'The voltage is too low', 'Batteries have internal resistance', 'The current is too large'], answer: 0, explain: 'No change in flux.' },
    ],
    M: [
      { type: 'num', q: 'An ideal transformer supplies a 24 V, 48 W heater from 230 V mains. Calculate the primary current.', answer: 0.209, unit: 'A', explain: 'Ip = P/Vp = 48/230 = 0.21 A.' },
      { type: 'explain', q: 'Explain how a transformer produces an output voltage in its secondary coil.', model: '<p>An alternating current in the primary coil produces a magnetic field in the iron core that is continually changing in size and direction. The iron core carries this changing magnetic flux through the secondary coil. A changing flux through a coil induces a voltage in it (electromagnetic induction / Faraday’s law), so an alternating voltage of the same frequency is induced in the secondary. The size of the output depends on the ratio of the numbers of turns, because the same changing flux induces the same voltage in every turn.</p>', points: [{ lvl: 'A', text: 'AC in the primary makes a magnetic field in the core' }, { lvl: 'M', text: 'The field/flux is changing, and the core links it to the secondary' }, { lvl: 'M', text: 'Changing flux induces a voltage in the secondary (turns ratio sets the size)' }] },
      { type: 'num', q: 'A step-up transformer raises 25 kV to 400 kV. If the secondary current is 150 A, what is the primary current (ideal)?', answer: 2400, unit: 'A', explain: 'Ip = Is × Vs/Vp = 150 × 16 = 2400 A.' },
      { type: 'explain', q: 'Explain why the core of a transformer is made of thin, insulated layers of iron.', model: '<p>The changing magnetic flux in the core induces voltages in the iron itself, which is a conductor, so currents called eddy currents swirl around inside it. These currents heat the core and waste energy. Making the core from thin sheets with insulation between them breaks up the paths the eddy currents could follow, so the currents are much smaller and less energy is lost. The thin sheets still carry the magnetic flux easily, so the transformer still works.</p>', points: [{ lvl: 'A', text: 'To reduce eddy currents / energy loss' }, { lvl: 'M', text: 'Changing flux induces eddy currents in the iron, heating it' }, { lvl: 'M', text: 'Insulated layers break up the current paths but still carry the flux' }] },
    ],
    E: [
      { type: 'explain', q: 'A power station produces 20 MW at 11 kV. Discuss, with calculations, why transformers are essential for sending this power through lines with a total resistance of 5.0 Ω, and why the grid uses AC.', model: '<p>Sent directly at 11 kV, the current would be I = P/V = 20 × 10⁶ ÷ 11 × 10³ = 1820 A, and the power lost in the lines would be I²R = 1820² × 5.0 = 1.65 × 10⁷ W — over 80% of the power. A step-up transformer to 220 kV (turns ratio 1 : 20) gives a current of 20 × 10⁶ ÷ 220 × 10³ = 91 A (power conserved: VpIp = VsIs, so the current falls by the same factor of 20 that the voltage rises). The loss is then 91² × 5.0 = 4.1 × 10⁴ W, about 0.2% — four hundred times less, because loss ∝ I². Step-down transformers then reduce the voltage to safe levels for homes. Transformers only work with a changing current: AC produces a changing flux in the core that induces a voltage in the secondary, whereas DC would give a steady flux and no output. So AC is used so that transformers can step the voltage up and down.</p>', points: [{ lvl: 'A', text: 'High voltage reduces energy loss in the lines' }, { lvl: 'M', text: 'Correct currents (≈1820 A vs ≈91 A) using P = VI' }, { lvl: 'E', text: 'Correct losses and the factor of 400 (loss ∝ I²)' }, { lvl: 'E', text: 'Explains AC is needed because transformers rely on changing flux' }] },
      { type: 'num', q: 'A 90% efficient transformer steps 230 V down to 12 V and supplies 6.0 A to a load. Calculate the primary current.', answer: 0.348, unit: 'A', explain: 'Output = 12 × 6.0 = 72 W; input = 72/0.90 = 80 W; Ip = 80/230 = 0.35 A.' },
      { type: 'explain', q: 'Discuss the energy losses in a real transformer and how each is reduced, and explain why large transformers are designed to be extremely efficient.', model: '<p>Copper (resistive) losses: current in the coils heats them (I²R); reduced by using thick, low-resistance copper wire, especially on the high-current side. Eddy currents: the changing flux induces currents in the iron core, heating it; reduced by laminating the core with thin, insulated sheets. Hysteresis: energy is used to re-magnetise the core every half-cycle; reduced by using soft iron alloys that magnetise and demagnetise easily. Flux leakage: some flux from the primary does not pass through the secondary; reduced by winding the coils close together, one over the other, on a closed core. Large transformers handle hundreds of megawatts, so even 1% loss is several megawatts of wasted energy and heat — expensive, and the heat must be removed with oil and cooling fins to stop damage. High efficiency saves money and energy and keeps the transformer cool.</p>', points: [{ lvl: 'A', text: 'Names at least two losses' }, { lvl: 'M', text: 'Explains how two losses are reduced' }, { lvl: 'E', text: 'Covers resistance, eddy currents and hysteresis (or leakage) with reductions' }, { lvl: 'E', text: 'Explains why high efficiency matters at large power (wasted MW, heat)' }] },
    ],
  },
  glossary: [
    { term: 'Transformer', def: 'A device with two coils on an iron core that changes the size of an AC voltage.' },
    { term: 'Primary coil', def: 'The input coil of a transformer, connected to the AC supply.' },
    { term: 'Secondary coil', def: 'The output coil of a transformer, in which a voltage is induced.' },
    { term: 'Step-up transformer', def: 'A transformer with more turns on the secondary, so Vs > Vp.' },
    { term: 'Step-down transformer', def: 'A transformer with fewer turns on the secondary, so Vs < Vp.' },
    { term: 'Turns ratio', def: 'Np : Ns, equal to Vp : Vs.' },
    { term: 'Laminated core', def: 'A core made of thin insulated iron sheets to reduce eddy currents.' },
    { term: 'Hysteresis loss', def: 'Energy used in repeatedly magnetising and demagnetising the core.' },
  ],
  formulas: [
    { name: 'Transformer equation', tex: r`\frac{V_p}{V_s} = \frac{N_p}{N_s}`, note: 'Step-up: Ns > Np.', level: 'L2 / L3' },
    { name: 'Ideal transformer power', tex: r`V_pI_p = V_sI_s`, note: 'Current changes in the opposite ratio to voltage.', level: 'L2 / L3' },
    { name: 'Transformer efficiency', tex: r`\eta = \frac{V_sI_s}{V_pI_p} \times 100\%`, note: 'Large transformers: 98–99%.', level: 'L2' },
  ],
  flashcards: [
    { front: 'Transformer equation', back: 'Vp/Vs = Np/Ns' }, { front: 'Ideal transformer power', back: 'VpIp = VsIs' },
    { front: 'Why transformers need AC', back: 'Only a changing flux induces a voltage' }, { front: 'Purpose of a laminated core', back: 'Reduce eddy currents' },
    { front: 'Step-up transformer', back: 'More turns on the secondary; voltage up, current down' }, { front: 'Why step up for transmission?', back: 'Lower current → I²R loss falls with the square' },
    { front: 'Four transformer losses', back: 'Coil resistance, eddy currents, hysteresis, flux leakage' },
  ],
};
