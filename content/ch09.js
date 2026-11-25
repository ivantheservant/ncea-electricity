/**
 * Chapter 9 — Electric Fields.
 */
import { svg, label, arrow, charge } from '../js/utils/svg.js';

const r = String.raw;

/**
 * Parallel plates with field arrows.
 * @param {number} ox X offset.
 * @param {number} w Plate width.
 * @param {number} gap Gap in px.
 * @param {string} [extra] Extra SVG.
 * @returns {string} SVG markup.
 */
function platePair(ox, w, gap, extra = '') {
  let s = `<rect x="${ox}" y="30" width="${w}" height="10" style="fill:color-mix(in srgb, var(--bad) 30%, var(--sheet))"/><rect x="${ox}" y="${40 + gap}" width="${w}" height="10" style="fill:color-mix(in srgb, var(--blue) 30%, var(--sheet))"/>`;
  for (let i = 0; i < 6; i++) s += `<text x="${ox + 15 + i * ((w - 30) / 5)}" y="27" class="lbl bold" text-anchor="middle">+</text><text x="${ox + 15 + i * ((w - 30) / 5)}" y="${68 + gap}" class="lbl bold" text-anchor="middle">−</text>`;
  for (let i = 0; i < 6; i++) { const x = ox + 15 + i * ((w - 30) / 5); s += arrow(x, 44, x, 36 + gap, 'field'); }
  return s + extra;
}

const RADIAL = svg(520, 200, (() => {
  let s = charge(120, 100, '+', 14);
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; s += arrow(120 + 20 * Math.cos(a), 100 + 20 * Math.sin(a), 120 + 80 * Math.cos(a), 100 + 80 * Math.sin(a), 'field'); }
  s += label(120, 196, 'Radial field: weaker further away', { cls: 'small bold' });
  s += platePair(300, 200, 90, label(400, 196, 'Uniform field: same everywhere between the plates', { cls: 'small bold' }));
  return s;
})(), { title: 'A radial field around a point charge and a uniform field between parallel plates', maxw: 560 });

const PLATES = svg(420, 200, platePair(80, 260, 100, label(70, 40, '+300 V', { anchor: 'end', cls: 'bold' }) + label(70, 150, '0 V', { anchor: 'end', cls: 'bold' }) +
  arrow(370, 42, 370, 138) + arrow(370, 138, 370, 42) + label(380, 94, 'd = 0.020 m', { anchor: 'start', cls: 'small bold' }) +
  charge(170, 92, '-', 9) + arrow(170, 80, 170, 56, 'accent') + label(182, 70, 'F', { anchor: 'start', cls: 'bold' }) +
  charge(270, 92, '+', 9) + arrow(270, 104, 270, 128, 'accent') + label(282, 120, 'F', { anchor: 'start', cls: 'bold' })), { title: 'Uniform field between plates 0.020 m apart at 300 V; force on an electron is upward and on a positive charge downward', maxw: 460 });

const DEFLECT = svg(480, 200, platePair(90, 260, 100) + (() => {
  let d = 'M20,95 L90,95';
  for (let i = 0; i <= 30; i++) { const x = 90 + (i / 30) * 260; const y = 95 - 45 * (i / 30) ** 2; d += ` L${x.toFixed(1)},${y.toFixed(1)}`; }
  d += ' L460,12';
  return `<path d="${d}" class="dash" style="stroke:var(--blue);stroke-width:2.5"/>` + charge(20, 95, '-', 8) + label(30, 120, 'electron enters', { anchor: 'start', cls: 'small' }) + label(220, 185, 'path is a parabola between the plates, then a straight line', { cls: 'small bold' });
})(), { title: 'An electron fired between parallel plates curves towards the positive plate', maxw: 520 });

export default {
  intro: 'In Chapter 1 you met electric fields as patterns of lines around charges. Now you will measure them. This chapter defines field strength, works out the uniform field between two charged plates, and uses it to calculate the force on, and energy gained by, charged particles — the physics behind old TV tubes, inkjet printers and particle accelerators.',
  standards: 'NCEA Level 2 AS 91173: E = V/d, F = Eq and ΔEp = Eqd are on the formula sheet. Particle motion in fields links with Level 2 mechanics.',
  lessons: [
    // ------------------------------------------------------------------ 9.1
    {
      id: '9.1', title: 'Electric field strength', levels: ['L2'], minutes: 15,
      objectives: ['Define electric field and field strength', 'State the direction of an electric field', 'Compare radial and uniform fields'],
      sections: [
        { type: 'text', title: 'A field is a region of force', html: r`<p>An <b>electric field</b> is a region where a charged object feels a force. Every charge creates a field around itself, and any other charge placed in that field is pushed or pulled. (Gravity works the same way: the Earth’s gravitational field pulls on any mass.)</p>
<p>The <b>direction</b> of the field at a point is the direction of the force on a small <b>positive</b> test charge placed there. So field lines point <b>away from positive</b> charges and <b>towards negative</b> charges (Lesson 1.2).</p>` },
        { type: 'formula', title: 'Field strength', tex: r`E = \frac{F}{q}`, symbols: [['E', 'electric field strength', 'N C⁻¹ (or V m⁻¹)'], ['F', 'force on the charge', 'newton (N)'], ['q', 'charge', 'coulomb (C)']], html: r`<p><b>Field strength</b> is the force per coulomb of charge. A field of 500 N C⁻¹ pushes on each coulomb with 500 N (and on an electron with $500 \times 1.6 \times 10^{-19} = 8.0 \times 10^{-17}$ N). Careful: in NCEA, $E$ means field strength. Energy is written $\Delta E$ or $\Delta E_p$.</p>` },
        { type: 'diagram', svg: RADIAL, caption: 'Closer field lines mean a stronger field. Between parallel plates the lines are evenly spaced and parallel: the field is uniform.' },
        { type: 'text', title: 'Radial and uniform fields', html: r`<ul><li>Around a single point charge the field is <b>radial</b>: the lines spread out, so the field gets weaker with distance.</li><li>Between two flat, parallel, oppositely charged plates the field is <b>uniform</b>: the lines are parallel and evenly spaced, so the field strength (and the force on a charge) is the same everywhere between the plates — except near the edges, where the lines bulge outwards.</li></ul>
<p>NCEA Level 2 calculations use uniform fields.</p>` },
        { type: 'example', title: 'field from a force', q: r`<p>A charge of $2.0 \times 10^{-6}$ C feels a force of 0.050 N in an electric field. Find the field strength.</p>`, steps: [r`$E = \dfrac{F}{q} = \dfrac{0.050}{2.0 \times 10^{-6}}$.`, r`$E = 2.5 \times 10^{4}$ N C⁻¹.`], answer: r`<p>$2.5 \times 10^{4}$ N C⁻¹.</p>` },
        { type: 'misconception', wrong: 'Field lines show the path a charge will follow.', right: 'Field lines show the direction of the force. A moving charge can cut across field lines, just as a thrown ball does not follow the vertical lines of gravity.' },
        { type: 'funfact', title: 'sharks feel fields', html: 'Sharks and rays have jelly-filled pores called ampullae of Lorenzini that can detect electric fields as weak as a few billionths of a volt per centimetre — enough to sense the tiny fields made by the muscles of a fish hiding in the sand.' },
        { type: 'key', points: ['Electric field: a region where a charge feels a force.', 'Direction: the force on a positive charge (away from +, towards −).', r`Field strength $E = F/q$ in N C⁻¹.`, 'Uniform field between parallel plates; radial field around a point charge.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'The direction of an electric field is the direction of the force on…', options: ['a positive charge', 'a negative charge', 'an electron', 'a neutron'], answer: 0, explain: 'By definition.' },
        { type: 'num', q: 'A 3.0 × 10⁻⁶ C charge feels a 0.012 N force. What is the field strength?', answer: 4000, unit: 'N C⁻¹', explain: 'E = F/q = 0.012 ÷ 3.0 × 10⁻⁶ = 4000 N C⁻¹.' },
        { type: 'mcq', q: 'Which describes the field between two parallel charged plates?', options: ['Uniform: the same strength everywhere between them', 'Strongest in the middle', 'Zero in the middle', 'Radial'], answer: 0, explain: 'Parallel, evenly spaced lines.' },
        { type: 'mcq', q: 'An electron is placed in a field that points to the right. The force on it is…', options: ['to the left', 'to the right', 'upwards', 'zero'], answer: 0, explain: 'Negative charges feel a force opposite to the field.' },
        { type: 'tf', q: 'A charge always moves along a field line.', answer: false, explain: 'Field lines show force direction, not paths.' },
      ],
    },
    // ------------------------------------------------------------------ 9.2
    {
      id: '9.2', title: 'Uniform fields: E = V/d', levels: ['L2'], minutes: 16,
      objectives: ['Use E = V/d for parallel plates', 'Show that V m⁻¹ and N C⁻¹ are the same unit', 'Predict how changing V or d changes the field'],
      sections: [
        { type: 'formula', title: 'Field between parallel plates', tex: r`E = \frac{V}{d}`, symbols: [['E', 'field strength', 'V m⁻¹'], ['V', 'voltage between the plates', 'V'], ['d', 'distance between the plates', 'metre (m)']], html: r`<p>The field depends only on the voltage and the gap. Double the voltage → double the field. Halve the gap → double the field. Notice that $d$ must be in <b>metres</b>.</p>` },
        { type: 'diagram', svg: PLATES, caption: 'E = 300 ÷ 0.020 = 15 000 V m⁻¹, the same at every point between the plates.' },
        { type: 'example', title: 'plates', q: r`<p>Two plates 2.0 cm apart are connected to a 300 V supply. Find the field strength.</p>`, steps: [r`Convert: $d = 2.0$ cm $= 0.020$ m.`, r`$E = \dfrac{V}{d} = \dfrac{300}{0.020}$.`, r`$E = 1.5 \times 10^{4}$ V m⁻¹.`], answer: '<p>15 000 V m⁻¹ (= 15 000 N C⁻¹).</p>' },
        { type: 'text', title: 'Two units, one quantity', html: r`<p>Why is field strength measured in both N C⁻¹ and V m⁻¹? Expand the volt: 1 V = 1 J C⁻¹, and 1 J = 1 N m. So</p>
<p>$$1\ \text{V m}^{-1} = 1\ \frac{\text{J}}{\text{C m}} = 1\ \frac{\text{N m}}{\text{C m}} = 1\ \text{N C}^{-1}$$</p>` },
        { type: 'example', title: 'finding the gap', q: r`<p>Air breaks down and sparks when the field reaches about $3.0 \times 10^{6}$ V m⁻¹. What is the smallest gap that can safely hold 12 kV?</p>`, steps: [r`$d = \dfrac{V}{E} = \dfrac{12\,000}{3.0 \times 10^{6}}$.`, r`$d = 4.0 \times 10^{-3}$ m $= 4.0$ mm.`], answer: '<p>About 4 mm — any closer and a spark jumps across (Lesson 1.5).</p>' },
        { type: 'sim', sim: 'field-plates', caption: 'Change the voltage and the gap. Watch E = V/d in the readout — then fire a particle.' },
        { type: 'try', question: { type: 'num', q: 'Plates 5.0 mm apart have a field of 2.0 × 10⁵ V m⁻¹ between them. What voltage is across them?', answer: 1000, unit: 'V', explain: 'V = Ed = 2.0 × 10⁵ × 0.0050 = 1000 V.' } },
        { type: 'misconception', wrong: 'The field is strongest next to the positive plate and weakest in the middle.', right: 'Between large parallel plates the field is uniform — the same strength everywhere (except near the edges).' },
        { type: 'key', points: [r`$E = V/d$ between parallel plates; $d$ in metres.`, 'E ∝ V and E ∝ 1/d.', '1 V m⁻¹ = 1 N C⁻¹.', 'Air sparks at about 3 × 10⁶ V m⁻¹.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'Plates 4.0 cm apart are connected to 600 V. What is the field strength?', answer: 15000, unit: 'V m⁻¹', explain: 'E = 600 ÷ 0.040 = 15 000 V m⁻¹.' },
        { type: 'mcq', q: 'The gap between two plates is halved while the voltage stays the same. The field strength…', options: ['doubles', 'halves', 'stays the same', 'quadruples'], answer: 0, explain: 'E ∝ 1/d.' },
        { type: 'num', q: 'What voltage gives a field of 5000 V m⁻¹ between plates 3.0 cm apart?', answer: 150, unit: 'V', explain: 'V = Ed = 5000 × 0.030 = 150 V.' },
        { type: 'mcq', q: 'Which unit is equivalent to N C⁻¹?', options: ['V m⁻¹', 'J C⁻¹', 'A s', 'Ω m'], answer: 0, explain: 'Shown by expanding V = J/C and J = N m.' },
        { type: 'num', q: 'A thundercloud base is 1500 m above the ground at a potential difference of 3.0 × 10⁸ V. Treating it as parallel plates, what is the field?', answer: 200000, unit: 'V m⁻¹', explain: 'E = 3.0 × 10⁸ ÷ 1500 = 2.0 × 10⁵ V m⁻¹.' },
      ],
    },
    // ------------------------------------------------------------------ 9.3
    {
      id: '9.3', title: 'Force on a charge: F = Eq', levels: ['L2'], minutes: 16,
      objectives: ['Calculate the force on a charge in a field', 'Find the acceleration of a charged particle', 'Compare electric and gravitational forces on particles'],
      sections: [
        { type: 'formula', title: 'Electric force', tex: 'F = Eq', symbols: [['F', 'force', 'N'], ['E', 'field strength', 'N C⁻¹ or V m⁻¹'], ['q', 'charge', 'C']], html: r`<p>This is just $E = F/q$ rearranged. Positive charges are pushed <b>along</b> the field (towards the negative plate); negative charges are pushed <b>against</b> it (towards the positive plate).</p>` },
        { type: 'example', title: 'force on an electron', q: r`<p>An electron is between plates with a field of $1.5 \times 10^{4}$ V m⁻¹. Find the size and direction of the force on it.</p>`, steps: [r`$F = Eq = 1.5 \times 10^{4} \times 1.6 \times 10^{-19}$.`, r`$F = 2.4 \times 10^{-15}$ N.`, 'The electron is negative, so the force is towards the positive plate (opposite to the field).'], answer: r`<p>$2.4 \times 10^{-15}$ N, towards the positive plate.</p>` },
        { type: 'text', title: 'Combining with E = V/d', html: r`<p>Questions often give the voltage and the gap, not the field. Find $E$ first, then $F$: $\;F = Eq = \dfrac{V}{d}\,q$.</p>` },
        { type: 'example', title: 'two steps', q: r`<p>A dust particle carrying $3.2 \times 10^{-18}$ C is between plates 5.0 mm apart with 2000 V across them. Find the force on it.</p>`, steps: [r`$E = \dfrac{V}{d} = \dfrac{2000}{0.0050} = 4.0 \times 10^{5}$ V m⁻¹.`, r`$F = Eq = 4.0 \times 10^{5} \times 3.2 \times 10^{-18} = 1.28 \times 10^{-12}$ N.`], answer: r`<p>$1.3 \times 10^{-12}$ N.</p>` },
        { type: 'text', title: 'Acceleration', html: r`<p>Newton’s second law ($F = ma$) gives the acceleration: $a = \dfrac{F}{m} = \dfrac{Eq}{m}$. Because the field is uniform, the force and acceleration are constant, so the motion works just like a ball in gravity.</p>
<p>For an electron ($m = 9.11 \times 10^{-31}$ kg) in a field of $1.5 \times 10^{4}$ V m⁻¹: $a = \dfrac{2.4 \times 10^{-15}}{9.11 \times 10^{-31}} = 2.6 \times 10^{15}$ m s⁻² — over 10¹⁴ times the acceleration due to gravity.</p>` },
        { type: 'text', title: 'Can we ignore gravity?', html: r`<p>The weight of an electron is $mg = 9.11 \times 10^{-31} \times 9.8 \approx 9 \times 10^{-30}$ N. The electric force above was $2.4 \times 10^{-15}$ N — about $10^{14}$ times bigger. So for electrons and protons, gravity can be ignored. For larger objects such as oil drops or dust, both forces can matter (Lesson 9.5).</p>` },
        { type: 'try', question: { type: 'num', q: 'What force acts on a proton (1.6 × 10⁻¹⁹ C) in a field of 5.0 × 10³ N C⁻¹?', answer: 8e-16, unit: 'N', explain: 'F = Eq = 5.0 × 10³ × 1.6 × 10⁻¹⁹ = 8.0 × 10⁻¹⁶ N.' } },
        { type: 'misconception', wrong: 'An electron and a proton in the same field feel different-sized forces because the proton is heavier.', right: 'They feel forces of the same size (same size of charge) in opposite directions. The proton accelerates far less because its mass is about 1800 times larger.' },
        { type: 'key', points: [r`$F = Eq$; with plates, $F = \dfrac{V}{d}q$.`, 'Positive: force along the field. Negative: against the field.', r`Acceleration $a = Eq/m$ — constant in a uniform field.`, 'Gravity is negligible for electrons and protons.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'What force acts on an electron in a field of 2.0 × 10⁴ V m⁻¹?', answer: 3.2e-15, unit: 'N', explain: 'F = 2.0 × 10⁴ × 1.6 × 10⁻¹⁹ = 3.2 × 10⁻¹⁵ N.' },
        { type: 'num', q: 'Plates 1.0 cm apart have 500 V across them. What force acts on a charge of 2.0 × 10⁻⁹ C between them?', answer: 1e-4, unit: 'N', explain: 'E = 500/0.010 = 5.0 × 10⁴ V m⁻¹; F = 5.0 × 10⁴ × 2.0 × 10⁻⁹ = 1.0 × 10⁻⁴ N.' },
        { type: 'mcq', q: 'A proton and an electron are in the same uniform field. Which statement is true?', options: ['The forces are equal in size and opposite in direction', 'The proton feels a larger force', 'The electron feels a larger force', 'Only the proton feels a force'], answer: 0, explain: 'Same size of charge.' },
        { type: 'mcq', q: 'Which particle has the greater acceleration in the same field?', options: ['The electron', 'The proton', 'They are equal', 'Neither accelerates'], answer: 0, explain: 'Same force, much smaller mass.' },
        { type: 'mcq', q: 'Why can we usually ignore gravity for an electron in an electric field?', options: ['The electric force is many orders of magnitude larger than its weight', 'Electrons have no mass', 'Gravity does not act on charged particles', 'The field cancels gravity'], answer: 0, explain: 'About 10¹⁴ times larger in typical fields.' },
      ],
    },
    // ------------------------------------------------------------------ 9.4
    {
      id: '9.4', title: 'Energy in an electric field: ΔEp = Eqd', levels: ['L2'], minutes: 18,
      objectives: ['Calculate the change in electric potential energy', 'Link ΔEp = Eqd to V = ΔE/q', 'Find the speed gained by a charge accelerated across a voltage'],
      sections: [
        { type: 'text', title: 'Work done by the field', html: r`<p>When the field pushes a charge a distance $d$ along the force, it does work $W = Fd$. The charge loses <b>electric potential energy</b> and, if nothing else acts, gains the same amount of kinetic energy. Pushing a charge the other way (against the force) needs work, which is stored as potential energy — like lifting a ball against gravity.</p>
<p>Using $F = Eq$:</p>` },
        { type: 'formula', title: 'Change in potential energy', tex: r`\Delta E_p = Eqd`, symbols: [[r`\Delta E_p`, 'change in electric potential energy', 'J'], ['E', 'field strength', 'V m⁻¹'], ['q', 'charge', 'C'], ['d', 'distance moved along the field', 'm']], html: r`<p>Since $E = V/d$, this becomes $\Delta E_p = \dfrac{V}{d}\,qd = qV$ — exactly the voltage definition from Chapter 4, $V = \Delta E/q$. A charge moved across the <b>whole</b> gap changes its energy by $qV$, whatever the gap.</p>` },
        { type: 'example', title: 'part of the gap', q: r`<p>Plates 4.0 cm apart have 800 V across them. A proton moves 1.0 cm along the field. How much potential energy does it lose?</p>`, steps: [r`$E = \dfrac{800}{0.040} = 2.0 \times 10^{4}$ V m⁻¹.`, r`$\Delta E_p = Eqd = 2.0 \times 10^{4} \times 1.6 \times 10^{-19} \times 0.010$.`, r`$\Delta E_p = 3.2 \times 10^{-17}$ J.`], answer: r`<p>$3.2 \times 10^{-17}$ J (a quarter of the gap, so a quarter of $qV$).</p>` },
        { type: 'text', title: 'From energy to speed', html: r`<p>If the charge starts at rest and only the electric force acts, all the potential energy lost becomes kinetic energy: $qV = \tfrac{1}{2}mv^2$, so</p>
<p>$$v = \sqrt{\frac{2qV}{m}}$$</p>` },
        { type: 'example', title: 'electron gun', q: r`<p>In an old TV tube, electrons start at rest and are accelerated across 2000 V. Find their final kinetic energy and speed. ($m_e = 9.11 \times 10^{-31}$ kg)</p>`, steps: [r`$\Delta E = qV = 1.6 \times 10^{-19} \times 2000 = 3.2 \times 10^{-16}$ J.`, r`$v = \sqrt{\dfrac{2 \times 3.2 \times 10^{-16}}{9.11 \times 10^{-31}}} = \sqrt{7.03 \times 10^{14}}$.`, r`$v = 2.7 \times 10^{7}$ m s⁻¹ (about 9% of the speed of light).`], answer: r`<p>$3.2 \times 10^{-16}$ J and $2.7 \times 10^{7}$ m s⁻¹.</p>` },
        { type: 'sim', sim: 'field-plates', caption: 'Choose “Accelerate across the gap”. Change the gap: the energy gained stays the same. Change the voltage: it changes.' },
        { type: 'deeper', levels: ['L3', 'Uni'], title: 'the electron-volt', html: r`<p>Particle physicists use a tiny unit of energy: the <b>electron-volt (eV)</b>, the energy an electron gains crossing 1 V. $1\ \text{eV} = 1.6 \times 10^{-19}$ J. The electrons in the example gained 2000 eV = 2 keV. The Large Hadron Collider accelerates protons to about 7 TeV ($7 \times 10^{12}$ eV).</p>` },
        { type: 'try', question: { type: 'num', q: 'How much energy does an electron gain when accelerated across 500 V?', answer: 8e-17, unit: 'J', explain: 'ΔE = qV = 1.6 × 10⁻¹⁹ × 500 = 8.0 × 10⁻¹⁷ J.' } },
        { type: 'misconception', wrong: 'A wider gap gives the particle more energy because it accelerates for longer.', right: 'For a fixed voltage, a wider gap means a weaker field. The force is smaller but acts over a longer distance, and the energy gained, qV, is the same.' },
        { type: 'key', points: [r`$\Delta E_p = Eqd$, and across the whole gap $\Delta E = qV$.`, 'Potential energy lost by the charge = kinetic energy gained.', r`From rest: $v = \sqrt{2qV/m}$.`, 'Going deeper: 1 eV = 1.6 × 10⁻¹⁹ J.'] },
      ],
      checkpoint: [
        { type: 'num', q: 'A field of 3000 V m⁻¹ moves a charge of 2.0 × 10⁻⁶ C a distance of 0.050 m. What is the change in potential energy?', answer: 3e-4, unit: 'J', explain: 'ΔEp = Eqd = 3000 × 2.0 × 10⁻⁶ × 0.050 = 3.0 × 10⁻⁴ J.' },
        { type: 'num', q: 'A proton is accelerated from rest across 1000 V. What kinetic energy does it gain?', answer: 1.6e-16, unit: 'J', explain: 'qV = 1.6 × 10⁻¹⁹ × 1000 = 1.6 × 10⁻¹⁶ J.' },
        { type: 'mcq', q: 'The gap between two plates is doubled, keeping the voltage the same. The energy an electron gains crossing the whole gap…', options: ['stays the same', 'doubles', 'halves', 'quadruples'], answer: 0, explain: 'ΔE = qV, independent of d.' },
        { type: 'num', q: 'An electron gains 4.8 × 10⁻¹⁷ J crossing between two plates. What is the voltage between them?', answer: 300, unit: 'V', explain: 'V = ΔE/q = 4.8 × 10⁻¹⁷ ÷ 1.6 × 10⁻¹⁹ = 300 V.' },
        { type: 'num', q: 'An electron (9.11 × 10⁻³¹ kg) gains 1.6 × 10⁻¹⁷ J from rest. What is its speed?', answer: 5.93e6, unit: 'm s⁻¹', explain: 'v = √(2 × 1.6 × 10⁻¹⁷ ÷ 9.11 × 10⁻³¹) = √(3.51 × 10¹³) = 5.9 × 10⁶ m s⁻¹.' },
      ],
    },
    // ------------------------------------------------------------------ 9.5
    {
      id: '9.5', title: 'Charged particles moving in fields', levels: ['L2', 'L3'], minutes: 18,
      objectives: ['Describe the path of a charge fired along or across a uniform field', 'Balance electric and gravitational forces', 'Explain applications of electric fields'],
      sections: [
        { type: 'text', title: 'Along the field', html: r`<p>A charge released between plates, or fired parallel to the field lines, moves in a straight line, speeding up (or slowing down) with constant acceleration $a = Eq/m$.</p>` },
        { type: 'text', title: 'Across the field', html: r`<p>A charge fired <b>perpendicular</b> to the field keeps its original speed in the forward direction (no force that way), but accelerates steadily sideways. Exactly like a ball thrown horizontally, its path is a <b>parabola</b>. Once it leaves the plates the force stops, and it carries on in a straight line.</p>` },
        { type: 'diagram', svg: DEFLECT, caption: 'An electron curves towards the positive plate. A proton would curve the other way, much less (it is heavier).' },
        { type: 'sim', sim: 'field-plates', caption: 'Choose “Fire between the plates”. Compare an electron with a proton, then increase the voltage until the electron hits the plate.' },
        { type: 'text', title: 'Balancing forces: Millikan’s oil drops', html: r`<p>In 1909 Robert Millikan sprayed tiny charged oil drops between horizontal plates and adjusted the voltage until a drop hung still. Then the upward electric force balanced the weight:</p>
<p>$$Eq = mg \quad\Rightarrow\quad q = \frac{mg}{E} = \frac{mgd}{V}$$</p>
<p>Every charge he measured was a whole-number multiple of $1.6 \times 10^{-19}$ C — the first proof that charge comes in lumps of $e$.</p>` },
        { type: 'example', title: 'a floating drop', q: r`<p>An oil drop of mass $4.9 \times 10^{-15}$ kg floats between plates 1.0 cm apart when the voltage is 1000 V. Find its charge and the number of extra electrons on it.</p>`, steps: [r`$E = \dfrac{1000}{0.010} = 1.0 \times 10^{5}$ V m⁻¹.`, r`$q = \dfrac{mg}{E} = \dfrac{4.9 \times 10^{-15} \times 9.8}{1.0 \times 10^{5}} = 4.8 \times 10^{-19}$ C.`, r`$n = \dfrac{4.8 \times 10^{-19}}{1.6 \times 10^{-19}} = 3$ electrons.`], answer: r`<p>$4.8 \times 10^{-19}$ C: three extra electrons. The top plate must be positive to pull the negative drop up.</p>` },
        { type: 'text', title: 'Uses of electric fields', html: r`<ul><li><b>Cathode ray tubes</b> (old TVs and oscilloscopes): electrons are accelerated by a high voltage and steered by deflecting plates onto a glowing screen.</li><li><b>Inkjet printers</b>: tiny ink drops are given a charge and steered by plates onto the paper.</li><li><b>Electrostatic precipitators</b>: charged smoke particles are attracted to plates in factory chimneys (Lesson 1.5).</li><li><b>Particle accelerators</b>: chains of electric fields push particles to enormous energies, used in hospitals to make X-rays for cancer treatment.</li></ul>` },
        { type: 'deeper', levels: ['L3'], title: 'calculating the deflection', html: r`<p>Plates of length $L$, electron entering at speed $u$ perpendicular to field $E$. Time between plates $t = L/u$. Sideways acceleration $a = Eq/m$, so sideways displacement $y = \tfrac{1}{2}at^2 = \dfrac{EqL^2}{2mu^2}$. Example: $E = 2.5 \times 10^{4}$ V m⁻¹, $L = 0.10$ m, $u = 3.0 \times 10^{7}$ m s⁻¹: $a = 4.4 \times 10^{15}$ m s⁻², $t = 3.3 \times 10^{-9}$ s, $y = 2.4$ cm.</p>` },
        { type: 'funfact', title: 'your old TV was an accelerator', html: 'A big cathode-ray TV accelerated electrons through about 25 000 V, firing them at the screen at roughly 30% of the speed of light — millions of electrons, every second, steered across the screen 50 times a second.' },
        { type: 'key', points: ['Along the field: straight line, constant acceleration.', 'Across the field: parabola (like a thrown ball), then straight once it leaves.', r`Floating drop: $Eq = mg$.`, 'Uses: CRTs, inkjet printers, precipitators, accelerators.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'An electron is fired horizontally between two horizontal plates (top +). Its path between the plates is…', options: ['a parabola curving upwards', 'a straight line', 'a circle', 'a parabola curving downwards'], answer: 0, explain: 'Constant sideways force towards the + plate.' },
        { type: 'mcq', q: 'After the electron leaves the plates, it moves…', options: ['in a straight line', 'in a circle', 'back towards the plates', 'in a parabola'], answer: 0, explain: 'No force outside the plates (ignoring edge effects).' },
        { type: 'num', q: 'A drop of weight 6.4 × 10⁻¹⁴ N floats in a field of 1.0 × 10⁵ N C⁻¹. What is its charge?', answer: 6.4e-19, unit: 'C', explain: 'q = W/E = 6.4 × 10⁻¹⁴ ÷ 1.0 × 10⁵ = 6.4 × 10⁻¹⁹ C (4 electrons).' },
        { type: 'mcq', q: 'An electron and a proton are fired at the same speed between the same plates. Which is deflected more?', options: ['The electron', 'The proton', 'Both equally', 'Neither'], answer: 0, explain: 'Same force, far smaller mass → larger acceleration.' },
        { type: 'mcq', q: 'Which device steers charged ink drops with electric fields?', options: ['Inkjet printer', 'Laser pointer', 'Microwave oven', 'Solar panel'], answer: 0, explain: 'Charged drops are deflected by plates.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'num', q: 'Two parallel plates are 2.5 cm apart with 500 V across them. Calculate the field strength.', answer: 20000, unit: 'V m⁻¹', explain: 'E = 500 ÷ 0.025 = 2.0 × 10⁴ V m⁻¹.' },
      { type: 'num', q: 'Calculate the force on an electron in a field of 4.0 × 10³ N C⁻¹.', answer: 6.4e-16, unit: 'N', explain: 'F = Eq = 4.0 × 10³ × 1.6 × 10⁻¹⁹ = 6.4 × 10⁻¹⁶ N.' },
      { type: 'mcq', q: 'Which way do field lines point between a positive and a negative plate?', options: ['From the positive plate to the negative plate', 'From the negative plate to the positive plate', 'Parallel to the plates', 'In circles'], answer: 0, explain: 'Away from +, towards −.' },
      { type: 'num', q: 'An electron is accelerated across 250 V. Calculate the energy it gains.', answer: 4e-17, unit: 'J', explain: 'qV = 1.6 × 10⁻¹⁹ × 250 = 4.0 × 10⁻¹⁷ J.' },
      { type: 'mcq', q: 'What happens to the field strength between plates if the voltage is tripled?', options: ['It triples', 'It is divided by 3', 'It stays the same', 'It increases nine times'], answer: 0, explain: 'E ∝ V.' },
    ],
    M: [
      { type: 'num', q: 'A charge of 5.0 × 10⁻⁸ C moves 3.0 cm along the field between plates 6.0 cm apart with 1200 V across them. Calculate the change in potential energy.', answer: 3e-5, unit: 'J', explain: 'E = 1200/0.060 = 2.0 × 10⁴ V m⁻¹; ΔEp = Eqd = 2.0 × 10⁴ × 5.0 × 10⁻⁸ × 0.030 = 3.0 × 10⁻⁵ J.' },
      { type: 'num', q: 'Calculate the acceleration of an electron (9.11 × 10⁻³¹ kg) between plates 2.0 cm apart with 100 V across them.', answer: 8.78e14, unit: 'm s⁻²', explain: 'E = 5000 V m⁻¹; F = 8.0 × 10⁻¹⁶ N; a = F/m = 8.8 × 10¹⁴ m s⁻².' },
      { type: 'explain', q: 'Explain why the energy gained by an electron crossing between two plates depends on the voltage but not on the distance between the plates.', model: '<p>The energy gained equals the work done by the field: force × distance. The force is F = Eq and the field between the plates is E = V/d, so the work is (V/d) × q × d = qV. If the plates are moved further apart, the field (and so the force) becomes weaker in proportion, but the force acts over a proportionally longer distance. The two effects cancel, so the energy gained depends only on the charge and the voltage. This matches the definition of voltage as energy per coulomb.</p>', points: [{ lvl: 'A', text: 'Energy gained = qV' }, { lvl: 'M', text: 'Work = Fd with F = Eq and E = V/d' }, { lvl: 'M', text: 'Wider gap: weaker force over longer distance — they cancel' }] },
      { type: 'num', q: 'An oil drop of mass 3.3 × 10⁻¹⁵ kg floats between plates 8.0 mm apart. Its charge is 3.2 × 10⁻¹⁹ C. What voltage is across the plates? (g = 9.8 N kg⁻¹)', answer: 808.5, unit: 'V', explain: 'E = mg/q = 3.3 × 10⁻¹⁵ × 9.8 ÷ 3.2 × 10⁻¹⁹ = 1.01 × 10⁵ V m⁻¹; V = Ed = 1.01 × 10⁵ × 0.0080 = 809 V.' },
    ],
    E: [
      { type: 'explain', q: 'An electron and a proton are released from rest at opposite plates of the same pair of parallel plates. Discuss and compare their forces, accelerations, energies gained and final speeds.', model: '<p>Both particles have charge of the same size (1.6 × 10⁻¹⁹ C) in the same uniform field, so F = Eq gives forces of equal size; the electron is pushed towards the positive plate and the proton towards the negative plate. Their accelerations a = F/m are very different: the proton’s mass is about 1840 times the electron’s, so its acceleration is about 1840 times smaller. Each crosses the full voltage, so each gains the same kinetic energy, ΔE = qV. Because ½mv² is the same, the speed is proportional to 1/√m: the electron ends up about √1840 ≈ 43 times faster than the proton.</p>', points: [{ lvl: 'A', text: 'Equal-sized forces, opposite directions' }, { lvl: 'M', text: 'Electron has much larger acceleration (smaller mass)' }, { lvl: 'E', text: 'Same energy gained (qV) for both' }, { lvl: 'E', text: 'Electron about √(mass ratio) ≈ 43 times faster' }] },
      { type: 'num', q: 'Electrons are accelerated from rest across 1500 V and then enter a uniform field. Calculate their speed as they enter. (m = 9.11 × 10⁻³¹ kg)', answer: 2.3e7, unit: 'm s⁻¹', explain: 'qV = 2.4 × 10⁻¹⁶ J; v = √(2 × 2.4 × 10⁻¹⁶ ÷ 9.11 × 10⁻³¹) = 2.3 × 10⁷ m s⁻¹.' },
      { type: 'explain', q: 'In Millikan’s experiment, a negatively charged oil drop is held stationary between horizontal plates. The voltage is then increased. Discuss what happens to the drop and why, and how the top plate must be charged.', model: '<p>When the drop is stationary, the upward electric force equals its weight: Eq = mg. The drop is negative and the force must be upwards, so the top plate must be positive (negative charges are pushed against the field, towards the positive plate). Increasing the voltage increases the field strength (E = V/d), so the electric force Eq increases while the weight stays the same. There is now a resultant upward force, so the drop accelerates upwards towards the top plate (in practice air resistance soon limits its speed).</p>', points: [{ lvl: 'A', text: 'The drop moves upwards' }, { lvl: 'M', text: 'Stationary: Eq = mg; top plate positive' }, { lvl: 'E', text: 'Larger V → larger E → larger electric force; weight unchanged' }, { lvl: 'E', text: 'Resultant upward force → upward acceleration' }] },
    ],
  },
  glossary: [
    { term: 'Electric field', def: 'A region where a charged object experiences a force.' },
    { term: 'Electric field strength (E)', def: 'Force per unit charge, E = F/q, in N C⁻¹ or V m⁻¹.' },
    { term: 'Uniform field', def: 'A field with the same strength and direction everywhere, as between parallel plates.' },
    { term: 'Radial field', def: 'A field spreading out from a point charge, weaker further away.' },
    { term: 'Electric potential energy', def: 'Energy a charge has because of its position in an electric field.' },
    { term: 'Electron-volt (eV)', def: 'Energy gained by an electron crossing 1 V: 1.6 × 10⁻¹⁹ J.' },
    { term: 'Deflection', def: 'The sideways movement of a charged particle fired across a field.' },
  ],
  formulas: [
    { name: 'Field strength', tex: r`E = \frac{F}{q}`, note: 'Force per coulomb. Also F = Eq.', level: 'L2' },
    { name: 'Uniform field', tex: r`E = \frac{V}{d}`, note: 'Parallel plates; d in metres.', level: 'L2' },
    { name: 'Potential energy change', tex: r`\Delta E_p = Eqd`, note: 'Across the whole gap: ΔE = qV.', level: 'L2' },
    { name: 'Speed from rest', tex: r`v = \sqrt{\frac{2qV}{m}}`, note: 'From qV = ½mv².', level: 'L2 / L3' },
    { name: 'Floating drop', tex: 'Eq = mg', note: 'Millikan’s balance condition.', level: 'L2 / L3' },
  ],
  flashcards: [
    { front: 'Define electric field strength', back: 'Force per coulomb: E = F/q' }, { front: 'Field between plates', back: 'E = V/d' },
    { front: 'Force on a charge in a field', back: 'F = Eq' }, { front: 'Energy change of a charge moving in a field', back: 'ΔEp = Eqd (= qV for the whole gap)' },
    { front: 'Direction of force on an electron', back: 'Opposite to the field (towards +)' }, { front: 'Path of a charge fired across a field', back: 'Parabola' },
    { front: '1 V m⁻¹ equals…', back: '1 N C⁻¹' }, { front: '1 eV in joules', back: '1.6 × 10⁻¹⁹ J' },
  ],
};
