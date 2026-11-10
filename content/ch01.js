/**
 * Chapter 1 — Charge & Static Electricity.
 */
import { svg, charge, arrow, flow, earth, label } from '../js/utils/svg.js';

const r = String.raw;

/**
 * Radial field lines around one point charge.
 * @param {number} cx Centre x.
 * @param {number} cy Centre y.
 * @param {'+'|'-'} s Sign.
 * @returns {string} SVG.
 */
function radial(cx, cy, s) {
  let out = '';
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * 16;
    const y1 = cy + Math.sin(a) * 16;
    const x2 = cx + Math.cos(a) * 50;
    const y2 = cy + Math.sin(a) * 50;
    out += s === '+' ? arrow(x1, y1, x2, y2, 'field') : arrow(x2, y2, x1, y1, 'field');
  }
  return out + charge(cx, cy, s, 11);
}

const FIELD_DIAGRAM = svg(520, 170, [
  radial(70, 80, '+'), label(70, 160, 'Positive: lines point out'),
  radial(200, 80, '-'), label(200, 160, 'Negative: lines point in'),
  `<path d="M 334 72 Q 400 20 466 72" class="field"/><path d="M 334 88 Q 400 140 466 88" class="field"/><line x1="337" y1="80" x2="463" y2="80" class="field"/>`,
  `<path d="M 330 66 Q 400 -18 470 66" class="field"/><path d="M 330 94 Q 400 178 470 94" class="field"/>`,
  flow(400, 46, 'right') + flow(400, 114, 'right') + flow(400, 80, 'right') + flow(400, 24, 'right') + flow(400, 136, 'right'),
  charge(322, 80, '+', 11), charge(478, 80, '-', 11), label(400, 166, 'Opposite charges: lines go from + to −'),
].join(''), { title: 'Electric field lines around positive, negative and a pair of opposite charges', maxw: 560 });

const ELECTROSCOPE = svg(300, 210, [
  '<rect x="120" y="22" width="60" height="12" rx="4" class="fill-soft"/>',
  '<line x1="150" y1="34" x2="150" y2="128"/>',
  '<path d="M 100 70 L 100 192 Q 100 200 108 200 L 192 200 Q 200 200 200 192 L 200 70" class="thin"/><rect x="132" y="62" width="36" height="14" rx="3" class="fill-pink"/>',
  '<line x1="150" y1="128" x2="128" y2="176" style="stroke:var(--glow);stroke-width:4"/><line x1="150" y1="128" x2="172" y2="176" style="stroke:var(--glow);stroke-width:4"/>',
  charge(134, 28, '-', 6), charge(166, 28, '-', 6), charge(131, 164, '-', 5), charge(169, 164, '-', 5),
  arrow(118, 166, 104, 170), arrow(182, 166, 196, 170),
  label(212, 30, 'metal cap', { anchor: 'start' }), label(212, 70, 'insulating', { anchor: 'start' }), label(212, 86, 'stopper', { anchor: 'start' }), label(212, 150, 'gold leaves', { anchor: 'start' }), label(212, 166, 'repel', { anchor: 'start' }),
].join(''), { title: 'A charged gold-leaf electroscope with its leaves spread apart', maxw: 320 });

const BALLOON_WALL = svg(420, 222, [
  '<ellipse cx="110" cy="100" rx="62" ry="78" class="fill-pink"/><path d="M110 178 l-6 14 h12 z"/>',
  ...[[90, 60], [130, 60], [80, 100], [120, 100], [140, 130], [95, 140], [110, 80]].map(([x, y]) => charge(x, y, '-', 7)),
  '<rect x="250" y="10" width="150" height="180" class="fill-soft"/>',
  ...[40, 80, 120, 160].flatMap((y) => [270, 330].map((x) => `<ellipse cx="${x + 20}" cy="${y}" rx="24" ry="13" class="fill-sheet"/>${charge(x + 6, y, '+', 6)}${charge(x + 34, y, '-', 6)}`)),
  arrow(236, 100, 190, 100, 'accent'), label(212, 90, 'attraction'),
  label(110, 214, 'charged balloon (−)'), label(325, 214, 'wall (neutral overall)'),
].join(''), { title: 'A negatively charged balloon polarises molecules in a wall and is attracted', maxw: 460 });

const LIGHTNING = svg(440, 250, [
  '<path d="M60 70 Q50 30 100 30 Q120 0 170 18 Q210 -4 250 24 Q300 18 300 56 Q330 70 300 92 L80 92 Q40 92 60 70 Z" class="fill-soft"/>',
  ...[100, 140, 180, 220, 260].map((x) => charge(x, 80, '-', 7)), ...[130, 190, 240].map((x) => charge(x, 38, '+', 7)),
  '<polyline points="170,92 150,130 172,135 145,185 165,188 140,232" style="stroke:var(--glow);stroke-width:5"/>',
  '<line x1="0" y1="232" x2="440" y2="232"/>', ...[60, 110, 230, 280].map((x) => charge(x, 220, '+', 6)),
  '<rect x="340" y="150" width="50" height="82" class="fill-sheet"/><line x1="365" y1="150" x2="365" y2="118" style="stroke-width:3"/><line x1="392" y1="140" x2="410" y2="140"/><line x1="410" y1="140" x2="410" y2="226"/>',
  earth(410, 226),
  label(365, 110, 'lightning rod'), label(300, 110, 'cloud base −', { anchor: 'start' }), label(20, 246, 'ground (induced +)', { anchor: 'start' }),
].join(''), { title: 'Charge separation in a thundercloud, lightning and a lightning rod connected to earth', maxw: 480 });

export default {
  intro: 'Everything around you is made of charged particles. This chapter explains what charge is, why some things stick together, and how a thunderstorm can build up enough charge to rip through the air.',
  standards: 'Year 10 science; charge and electric fields lead into NCEA Level 2 Physics AS 91173 (electricity and electromagnetism).',
  lessons: [
    // ------------------------------------------------------------------ 1.1
    {
      id: '1.1', title: 'Atoms and electric charge', levels: ['Y10', 'L2'], minutes: 12,
      objectives: ['Describe the charged particles in an atom', 'Explain how atoms become positive or negative ions', 'Use the elementary charge and Q = ne'],
      intro: 'You drew these atoms in your notes — protons in the middle, electrons around the outside. Let’s turn that picture into numbers.',
      sections: [
        { type: 'text', title: 'Inside an atom', html: r`<p>Every atom has a tiny, dense <b>nucleus</b> containing <b>protons</b> (positive) and <b>neutrons</b> (no charge). Around the nucleus move <b>electrons</b> (negative).</p>
<div class="tablewrap"><table><thead><tr><th>Particle</th><th>Charge</th><th>Where</th><th>Mass</th></tr></thead><tbody>
<tr><td>Proton</td><td>$+1.6 \times 10^{-19}$ C</td><td>nucleus</td><td>$1.67 \times 10^{-27}$ kg</td></tr>
<tr><td>Neutron</td><td>0</td><td>nucleus</td><td>$1.67 \times 10^{-27}$ kg</td></tr>
<tr><td>Electron</td><td>$-1.6 \times 10^{-19}$ C</td><td>around the nucleus</td><td>$9.11 \times 10^{-31}$ kg</td></tr></tbody></table></div>
<p>A proton and an electron have charges of exactly the same size but opposite sign. A proton is about 1800 times heavier than an electron.</p>` },
        { type: 'text', title: 'Neutral atoms and ions', html: r`<p>A normal atom has the <b>same number of protons and electrons</b>. The positive and negative charges cancel, so the atom is <b>neutral</b>.</p>
<ul><li>If an atom <b>loses</b> electrons it has more protons than electrons: a <b>positive ion</b>.</li><li>If an atom <b>gains</b> electrons it has more electrons than protons: a <b>negative ion</b>.</li></ul>
<p>Protons are locked inside the nucleus by the strong nuclear force. In everyday charging, <b>only electrons move</b>. A positive object has <i>lost</i> electrons; it has not gained protons.</p>` },
        { type: 'sim', sim: 'atom-builder', caption: 'Add and remove electrons. Watch the net charge and the name change.' },
        { type: 'text', title: 'Charge comes in packets', html: r`<p>Charge is measured in <b>coulombs</b> (C). The smallest free charge is the charge on one electron or proton, called the <b>elementary charge</b>:</p>
$$e = 1.6 \times 10^{-19}\ \text{C}$$
<p>Every charge is a whole number of these packets. If an object has $n$ extra (or missing) electrons, its charge is</p>
$$Q = ne$$
<p>Charge is also <b>conserved</b>: it can be moved from place to place, but never created or destroyed.</p>` },
        { type: 'example', title: 'counting extra electrons', q: r`<p>A plastic comb has a charge of $-4.8 \times 10^{-18}$ C. How many extra electrons does it have?</p>`, steps: [r`Rearrange $Q = ne$: $n = \dfrac{Q}{e}$ (use the size of the charge).`, r`$n = \dfrac{4.8 \times 10^{-18}}{1.6 \times 10^{-19}}$`, r`$n = 30$`], answer: r`<p>30 extra electrons (it is negative, so they are extra, not missing).</p>` },
        { type: 'maths', title: 'scientific notation', html: r`<p>Divide the front numbers (4.8 ÷ 1.6 = 3) and subtract the powers (−18 − (−19) = 1): $3 \times 10^{1} = 30$.</p>`, link: '0.2' },
        { type: 'misconception', wrong: 'A positively charged object has gained protons.', right: 'Protons cannot leave the nucleus in everyday charging. A positive object has lost electrons. Only electrons move.' },
        { type: 'exam', standard: 'NCEA Level 2 Physics, AS 91173', html: r`<p>Level 2 papers use $Q = ne$ with the electron charge. The 2024 paper asked candidates to find the number of excess electrons on an oil drop from its charge — exactly the calculation above. Always give a <b>whole number</b> of electrons.</p>` },
        { type: 'deeper', levels: ['Uni'], title: 'quarks and Millikan’s oil drops', html: r`<p>Protons and neutrons are made of quarks with charges of $+\tfrac{2}{3}e$ and $-\tfrac{1}{3}e$. Quarks are never found alone, so the smallest charge you can isolate is still $e$.</p><p>In 1909 Robert Millikan sprayed tiny oil drops between charged plates and balanced them against gravity. Every drop’s charge was a whole-number multiple of about $1.6 \times 10^{-19}$ C — the first proof that charge comes in packets. He won the 1923 Nobel Prize in Physics.</p>` },
        { type: 'funfact', title: 'mostly empty', html: 'If an atom were the size of Eden Park, its nucleus would be about the size of a pea on the centre spot. Almost all of the atom is empty space, yet the electrons’ charge stops you from falling through your chair.' },
        { type: 'key', points: ['Protons +, electrons −, neutrons 0; the charges of a proton and an electron are equal in size.', 'Neutral atom: protons = electrons. Positive ion: lost electrons. Negative ion: gained electrons.', 'Only electrons move in everyday charging.', r`$e = 1.6 \times 10^{-19}$ C and $Q = ne$. Charge is conserved.`] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'An atom has 8 protons and 10 electrons. It is…', options: ['a negative ion', 'a positive ion', 'neutral', 'a different element'], answer: 0, explain: 'It has 2 more electrons than protons, so its net charge is −2e: a negative ion.' },
        { type: 'mcq', q: 'A glass rod becomes positively charged. What happened?', options: ['It lost electrons', 'It gained protons', 'It gained electrons', 'It lost protons'], answer: 0, explain: 'Only electrons move in everyday charging. Losing negative charge leaves the rod positive.' },
        { type: 'num', q: 'What is the total charge of 3 electrons? Give the size only.', answer: 4.8e-19, unit: 'C', explain: r`$3 \times 1.6 \times 10^{-19} = 4.8 \times 10^{-19}$ C (negative).` },
        { type: 'num', q: r`How many electrons make a charge of 1.0 C? ($e = 1.6 \times 10^{-19}$ C)`, answer: 6.25e18, explain: r`$n = Q/e = 1.0 / 1.6 \times 10^{-19} = 6.25 \times 10^{18}$.` , hint: 'Use n = Q ÷ e.' },
        { type: 'tf', q: 'Charge can be created by rubbing two objects together.', answer: false, explain: 'Rubbing only moves electrons from one object to the other. The total charge stays the same (conservation of charge).' },
      ],
    },
    // ------------------------------------------------------------------ 1.2
    {
      id: '1.2', title: 'Forces between charges and electric fields', levels: ['Y10', 'L2'], minutes: 14,
      objectives: ['State the rule for forces between charges', 'Describe how the force changes with charge size and distance', 'Draw electric field lines'],
      sections: [
        { type: 'text', title: 'Like charges repel, unlike charges attract', html: r`<p>Two positive charges push each other apart. Two negative charges push each other apart. A positive and a negative pull together. Your notes put it neatly: <i>“opposite charges attract each other”</i>.</p>
<p>The force gets <b>bigger</b> when the charges are <b>bigger</b>, and much bigger when they are <b>closer</b>. Both charges feel forces of the same size in opposite directions.</p>` },
        { type: 'sim', sim: 'charge-forces', caption: 'Change the signs, sizes and distance. Halve the distance and see the force become four times bigger.' },
        { type: 'text', title: 'Electric fields', html: r`<p>How does one charge “know” the other is there? Every charge is surrounded by an <b>electric field</b> — the “invisible force zone” from your notes. Any other charge inside that field feels a force.</p>
<p>We draw fields with <b>field lines</b>:</p>
<ul><li>Lines point in the direction a <b>positive</b> charge would be pushed: away from +, towards −.</li><li>Lines never cross.</li><li>Closer lines mean a stronger field.</li><li>Lines start and end on charges, meeting the surface at right angles.</li></ul>` },
        { type: 'diagram', svg: FIELD_DIAGRAM, caption: 'Field lines point away from positive charges and towards negative charges.' },
        { type: 'text', title: 'Detecting charge: the electroscope', html: r`<p>A gold-leaf electroscope has a metal cap joined by a metal rod to two very thin gold (or aluminium) leaves, inside a glass case. Touch the cap with a charged object and charge spreads down to the leaves. Both leaves now have the <b>same</b> sign of charge, so they <b>repel</b> and spread apart. The more charge, the wider they spread.</p>` },
        { type: 'diagram', svg: ELECTROSCOPE, caption: 'Both leaves carry negative charge and repel each other.' },
        { type: 'misconception', wrong: 'Only charged objects can be attracted to a charged rod.', right: 'A charged rod also attracts neutral objects such as paper scraps, by pulling their charges slightly apart. You will see why in lesson 1.4.' },
        { type: 'deeper', levels: ['L3', 'Uni'], title: "Coulomb's law", html: r`<p>The force between two point charges is</p>$$F = \frac{k\,q_1 q_2}{r^2}, \qquad k = 8.99 \times 10^{9}\ \text{N m}^2\,\text{C}^{-2}$$
<p>This is an <b>inverse-square law</b>: double the distance and the force drops to a quarter. In a hydrogen atom the electron is about $5.3 \times 10^{-11}$ m from the proton:</p>
$$F = \frac{(8.99 \times 10^{9})(1.6 \times 10^{-19})^2}{(5.3 \times 10^{-11})^2} \approx 8.2 \times 10^{-8}\ \text{N}$$
<p>NCEA Level 2 focuses on the <i>uniform</i> field between parallel plates ($E = V/d$, Chapter 9). Coulomb’s law appears in first-year university physics.</p>` },
        { type: 'funfact', title: 'gravity is the weakling', html: r`The electric force between a proton and an electron is about $10^{39}$ times stronger than the gravitational pull between them. Gravity only wins at large scales because big objects are almost perfectly neutral.` },
        { type: 'key', points: ['Like charges repel; unlike charges attract.', 'Bigger charges and smaller distances give bigger forces.', 'Field lines: away from +, towards −; never cross; closer = stronger.', 'An electroscope’s leaves repel because they carry the same sign of charge.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'Two negatively charged balloons hang near each other. They…', options: ['repel', 'attract', 'feel no force', 'attract, then become neutral'], answer: 0, explain: 'Like charges repel.' },
        { type: 'mcq', q: 'Electric field lines around a single positive charge…', options: ['point outwards, away from the charge', 'point inwards, towards the charge', 'go round in circles', 'point upwards only'], answer: 0, explain: 'Field lines show the direction of the force on a positive test charge, which is repelled by the positive charge.' },
        { type: 'mcq', q: 'Two charges are moved closer together. The force between them…', options: ['increases', 'decreases', 'stays the same', 'changes direction'], answer: 0, explain: 'The force gets stronger as the distance decreases (inverse-square law).' },
        { type: 'tf', q: 'Electric field lines can cross each other.', answer: false, explain: 'At any point the field has only one direction, so lines never cross.' },
        { type: 'mcq', q: 'Why do the leaves of a charged electroscope spread apart?', options: ['Both leaves carry the same sign of charge and repel', 'The leaves become magnetic', 'The leaves have opposite charges and attract the case', 'Air pushes them apart'], answer: 0, explain: 'Charge spreads onto both leaves. Like charges repel, so the leaves spread.' },
      ],
    },
    // ------------------------------------------------------------------ 1.3
    {
      id: '1.3', title: 'Charging by friction', levels: ['Y10'], minutes: 12,
      objectives: ['Explain charging by friction in terms of electron transfer', 'Use a triboelectric series to predict the charges', 'Explain why insulators keep their charge and why damp days reduce static'],
      sections: [
        { type: 'text', title: 'Rubbing moves electrons', html: r`<p>When two different insulators are rubbed together, their surfaces touch closely at many points. One material holds on to its outer electrons more strongly than the other, so <b>electrons transfer</b> from one surface to the other.</p>
<ul><li>The material that <b>gains</b> electrons becomes <b>negative</b>.</li><li>The material that <b>loses</b> electrons becomes <b>positive</b>.</li></ul>
<p>Because charge is conserved, the two objects end up with <b>equal and opposite</b> charges.</p>` },
        { type: 'sim', sim: 'rubbing-lab', caption: 'Choose a pair, rub, then test each object with a negative rod.' },
        { type: 'text', title: 'The triboelectric series', html: r`<p>Scientists list materials in order of how easily they give up electrons. When two materials are rubbed, the one <b>higher</b> in the list becomes positive and the one <b>lower</b> becomes negative.</p>
<div class="tablewrap"><table><tbody>
<tr><th>Tends to become positive (loses electrons)</th></tr>
<tr><td>glass → human hair → nylon → wool → silk → paper and cotton → hard rubber → polyester → polythene → PVC → Teflon</td></tr>
<tr><th>Tends to become negative (gains electrons)</th></tr></tbody></table></div>
<p>Classroom results: a <b>polythene rod rubbed with wool becomes negative</b>; an <b>acetate rod rubbed with a cloth becomes positive</b>; a <b>balloon rubbed on hair becomes negative</b>. Exact orders differ between books because surfaces, dirt and humidity change the results.</p>` },
        { type: 'text', title: 'Why insulators, and why dry days?', html: r`<p>In an <b>insulator</b> the transferred electrons stay where they landed — the charge cannot flow away. If you rub a metal rod held in your hand, the charge flows straight through the metal and you to earth, so it seems not to charge at all (hold it with an insulating handle and it will).</p>
<p>On <b>humid</b> days a very thin layer of water forms on surfaces. Dissolved ions in it let charge leak away, so static builds up less. Static shocks are most common on dry days — and in air-conditioned buildings.</p>` },
        { type: 'example', title: 'predicting charges', q: r`<p>A nylon jacket rubs against a polyester car seat. Use the series to predict the charge on each, and explain.</p>`, steps: ['Nylon is higher in the series than polyester, so nylon holds its electrons less tightly.', 'Electrons move from the nylon to the polyester.', 'Nylon has lost electrons; polyester has gained them.'], answer: '<p>Jacket: positive. Seat: negative. The charges are equal in size.</p>' },
        { type: 'misconception', wrong: 'Rubbing creates new charge, and the positive charges move onto the other object.', right: 'Rubbing only separates charge that was already there, by moving electrons. Positive charges (protons) never move. Total charge before and after is zero.' },
        { type: 'funfact', title: 'the word “electron”', html: 'Around 600 BC the Greek thinker Thales noticed that amber rubbed with fur attracted bits of straw. The Greek word for amber is <i>ēlektron</i> — the origin of “electricity” and “electron”.' },
        { type: 'key', points: ['Rubbing transfers electrons between surfaces.', 'Gain electrons → negative; lose electrons → positive; charges equal and opposite.', 'Higher in the triboelectric series → positive.', 'Insulators keep charge where it is; damp air lets charge leak away.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'A polythene rod is rubbed with a woollen cloth and becomes negative. What happened?', options: ['Electrons moved from the wool to the rod', 'Electrons moved from the rod to the wool', 'Protons moved from the rod to the wool', 'The rod created new electrons'], answer: 0, explain: 'The rod gained electrons (negative), so they came from the wool.' },
        { type: 'mcq', q: 'After the rubbing in the last question, the woollen cloth is…', options: ['positive, with a charge equal in size to the rod’s', 'neutral', 'negative', 'positive, with a larger charge than the rod'], answer: 0, explain: 'Charge is conserved: the cloth lost exactly the electrons the rod gained.' },
        { type: 'num', q: 'A balloon rubbed on hair gets a charge of −3.2 nC. What is the charge on the hair, in nC?', answer: 3.2, unit: 'nC', explain: 'Equal and opposite: +3.2 nC.' },
        { type: 'mcq', q: 'After you brush your hair on a dry day, it stands up. Why?', options: ['Each hair has the same sign of charge, so the hairs repel', 'The hairs become magnetic', 'The brush pulls the hairs with gravity', 'The hairs gain protons'], answer: 0, explain: 'Every hair loses electrons to the brush, so they are all positive and repel each other.' },
        { type: 'mcq', q: 'Why is it hard to charge a metal rod by rubbing while holding it in your bare hand?', options: ['Charge flows through the metal and your body to earth', 'Metals have no electrons', 'Metals are too smooth to rub', 'Metals only gain protons'], answer: 0, explain: 'Metals are conductors. Any charge flows away through you to earth. With an insulating handle, a metal rod can be charged.' },
      ],
    },
    // ------------------------------------------------------------------ 1.4
    {
      id: '1.4', title: 'Contact, induction, earthing and polarisation', levels: ['Y10', 'L2'], minutes: 16,
      objectives: ['Explain charging by contact and by induction', 'Describe what earthing does', 'Explain why charged objects attract neutral ones'],
      sections: [
        { type: 'text', title: 'Charging by contact (conduction)', html: r`<p>Touch a charged object onto a neutral <b>conductor</b> and some of the charge spreads onto it. Both objects end up with the <b>same sign</b> of charge. For example, a negative rod touching a metal sphere gives some of its extra electrons to the sphere.</p>` },
        { type: 'text', title: 'Earthing', html: r`<p>The Earth is so huge that it can give or take almost any number of electrons without noticeably changing. Connecting a charged conductor to the ground with a conductor is called <b>earthing</b> (or grounding):</p>
<ul><li>A <b>negative</b> object: extra electrons flow <b>to</b> earth.</li><li>A <b>positive</b> object: electrons flow <b>from</b> earth to fill the shortage.</li></ul>
<p>Either way, the object becomes neutral. Your body conducts, so touching a charged metal object usually earths it — that is the “zap” you feel.</p>` },
        { type: 'text', title: 'Charging by induction', html: r`<p>Induction charges a conductor <b>without touching it</b> with the charged object. Step through it below. The key ideas: the rod pushes or pulls free electrons to one side (charge <b>separation</b>), earthing lets some of them escape, and removing the earth first traps the imbalance.</p>` },
        { type: 'sim', sim: 'induction-steps', caption: 'Charging a metal sphere by induction with a negative rod.' },
        { type: 'text', title: 'Why charged objects attract neutral ones: polarisation', html: r`<p>Bring a charged rod near small bits of paper and they jump up to it — even though the paper is neutral.</p>
<p>In an <b>insulator</b> electrons cannot flow freely, but the electron cloud of each molecule can shift slightly. A negative rod pushes the electrons in each nearby molecule slightly away, so the side of each molecule facing the rod becomes slightly positive. This is <b>polarisation</b>.</p>
<p>The near (opposite) charges are <b>closer</b> to the rod than the far (like) charges. Closer means stronger force, so the attraction beats the repulsion and the paper moves towards the rod. A positive rod works too — the shift is just the other way round.</p>` },
        { type: 'diagram', svg: BALLOON_WALL, caption: 'The negative balloon makes each molecule’s near side slightly positive. The nearer opposite charges win, so the balloon sticks.' },
        { type: 'exam', title: 'Writing an Excellence explanation', html: r`<p><i>Explain why a charged balloon sticks to a wall.</i> A complete answer links each step:</p>
<ol><li>The balloon is negatively charged (gained electrons by rubbing).</li><li>Its negative charge repels electrons in the wall’s surface molecules slightly away, so the wall is <b>polarised</b>: its surface near the balloon becomes slightly positive.</li><li>Opposite charges attract, and the positive side is closer to the balloon than the negative side.</li><li>Force is bigger at shorter distance, so the attraction is greater than the repulsion: there is a net attractive force.</li></ol>` },
        { type: 'misconception', wrong: 'In induction, the charged rod gives some of its charge to the sphere.', right: 'In induction the rod never touches the sphere and keeps all its charge. Charge flows between the sphere and earth instead. That is why the sphere ends up with the opposite sign.' },
        { type: 'try', question: { type: 'mcq', q: 'A positively charged rod is brought near a stream of tap water. The stream…', options: ['bends towards the rod', 'bends away from the rod', 'is not affected', 'stops flowing'], answer: 0, explain: 'The rod polarises the water, inducing the opposite charge on the near side. A negative rod would also attract the stream.' } },
        { type: 'funfact', title: 'your photocopier uses induction', html: 'Laser printers and photocopiers use a light-sensitive drum. Light removes charge from parts of the drum, leaving a charged “image” that attracts toner powder, which is then melted onto the paper.' },
        { type: 'key', points: ['Contact: same sign as the charging object.', 'Earthing neutralises a conductor; electrons flow to or from earth.', 'Induction: separate charges, earth, remove earth, remove rod → opposite sign.', 'Polarisation lets charged objects attract neutral insulators because the nearer opposite charge wins.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'A negatively charged rod touches a neutral metal sphere on an insulating stand. The sphere becomes…', options: ['negative', 'positive', 'neutral', 'positive then neutral'], answer: 0, explain: 'In charging by contact, some of the rod’s extra electrons spread onto the sphere: same sign.' },
        { type: 'mcq', q: 'A negatively charged metal sphere is earthed. What happens?', options: ['Electrons flow from the sphere to earth', 'Electrons flow from earth to the sphere', 'Protons flow to earth', 'Nothing happens'], answer: 0, explain: 'The extra electrons flow away to earth and the sphere becomes neutral.' },
        { type: 'order', q: 'Put the steps of charging a sphere by induction in order (using a negative rod).', items: ['Bring the negative rod near the neutral sphere', 'Touch the far side of the sphere to earth it', 'Remove the earth connection', 'Take the rod away'], explain: 'If the rod is removed before the earth, electrons flow back and the sphere ends neutral.' },
        { type: 'mcq', q: 'After charging by induction with a negative rod, the sphere is…', options: ['positive', 'negative', 'neutral', 'positive on one side and negative on the other only'], answer: 0, explain: 'Electrons were pushed off through the earth connection, leaving the sphere with fewer electrons than protons.' },
        { type: 'explain', q: 'Explain why a charged comb can pick up small pieces of neutral paper.', model: '<p>The comb is charged (say negative). It repels electrons in the paper’s molecules slightly away, so the paper is polarised: the side nearest the comb becomes slightly positive and the far side slightly negative. Opposite charges attract. Because the positive side is closer, its attraction is stronger than the repulsion of the further negative side, so there is a net attraction and the paper moves to the comb.</p>', points: [{ lvl: 'A', text: 'States that the comb is charged and attracts the paper' }, { lvl: 'M', text: 'Explains that the paper becomes polarised (charges shift in molecules)' }, { lvl: 'E', text: 'Explains that the nearer opposite charge gives a stronger attraction than the repulsion' }] },
      ],
    },
    // ------------------------------------------------------------------ 1.5
    {
      id: '1.5', title: 'Static in action: lightning, sparks and safety', levels: ['Y10', 'L2'], minutes: 14,
      objectives: ['Explain sparks and lightning as discharges', 'Describe how lightning rods and earthing keep people safe', 'Describe useful applications of static electricity'],
      sections: [
        { type: 'text', title: 'Sparks: when air gives way', html: r`<p>Air is normally an insulator. But if the electric field is strong enough — about 3 million volts per metre in dry air — it tears electrons off air molecules. The air becomes <b>ionised</b> and conducts, and charge rushes through in a flash of light and heat: a <b>spark</b> or <b>discharge</b>.</p>
<p>The shock you get touching a door handle after walking on carpet is a tiny spark. It might be a few thousand volts, but very little charge flows, so it isn’t dangerous.</p>` },
        { type: 'text', title: 'Lightning', html: r`<p>Inside a thundercloud, ice crystals and soft hail (graupel) collide in strong up-draughts. Charge is separated: the cloud’s <b>base usually becomes negative</b> and its top positive. The negative base <b>induces</b> a positive charge on the ground below.</p>
<p>When the field becomes strong enough, the air breaks down and a giant spark — lightning — carries charge between the cloud and the ground. The channel heats to around 30 000 °C, about five times hotter than the surface of the Sun. The air expands explosively, making <b>thunder</b>.</p>` },
        { type: 'diagram', svg: LIGHTNING, caption: 'Charge separation in a storm cloud, an induced charge on the ground, and a lightning rod.' },
        { type: 'text', title: 'Lightning rods and earthing', html: r`<p>A <b>lightning rod</b> is a pointed metal rod on top of a building, joined by a thick conductor to a metal plate buried in the ground. If lightning strikes, the charge takes this <b>low-resistance path</b> safely to earth instead of through the building.</p>
<p>Earthing also prevents dangerous sparks:</p>
<ul><li><b>Fuel tankers and aircraft</b> are connected by a cable to earth before refuelling. Fuel flowing through hoses can build up charge, and a spark near fuel vapour could cause an explosion.</li><li>Aircraft have small <b>static wicks</b> on their wings that let charge leak gently into the air.</li><li>People who repair electronics wear <b>earthed wrist straps</b>, because a static spark can destroy microchips.</li></ul>` },
        { type: 'text', title: 'Useful static', html: r`<ul><li><b>Electrostatic spray painting</b>: paint droplets are given the same charge, so they repel and spread into a fine, even mist. The car body is given the opposite charge and attracts the paint — even round the back — so less paint is wasted.</li><li><b>Precipitators</b> in factory chimneys charge smoke particles, which are then attracted to oppositely charged plates and removed before reaching the air.</li><li><b>Laser printers and photocopiers</b> use charge patterns to place toner.</li><li><b>Crop spraying</b> uses charged droplets that wrap around leaves.</li></ul>` },
        { type: 'tip', html: 'Flash-to-bang: count the seconds between the lightning flash and the thunder, then divide by 3. That is roughly how many kilometres away the strike was (sound travels about 340 m every second).' },
        { type: 'funfact', title: 'a busy planet', html: 'Earth has roughly 40 to 50 lightning flashes every second (counting flashes inside clouds as well as to the ground).' },
        { type: 'funfact', title: 'Franklin’s kite', html: 'In 1752 Benjamin Franklin flew a kite in a thunderstorm to show that lightning is electrical. It was extremely risky: in 1753 the scientist Georg Richmann was killed in St Petersburg while trying a similar experiment. Never copy it!' },
        { type: 'key', points: ['A spark happens when the field is strong enough to ionise air (about 3 MV per metre).', 'Lightning: collisions separate charge in clouds; the base is usually negative and induces + on the ground.', 'Lightning rods and earthing give charge a safe, low-resistance path to earth.', 'Spray painting, precipitators and printers use attraction and repulsion of charges.'] },
      ],
      checkpoint: [
        { type: 'mcq', q: 'Why is a fuel tanker connected to earth before fuel is pumped?', options: ['To stop charge building up and causing a spark near fuel vapour', 'To make the fuel flow faster', 'To charge the fuel so it burns better', 'To keep the tanker cool'], answer: 0, explain: 'Earthing lets any charge flow away safely, so no spark can ignite the vapour.' },
        { type: 'mcq', q: 'In electrostatic spray painting, why are all the paint droplets given the same charge?', options: ['They repel each other and spread out evenly', 'They attract each other into big drops', 'It makes the paint dry faster', 'It makes the paint conduct'], answer: 0, explain: 'Like charges repel, so the droplets form a fine, even spray. The oppositely charged car attracts them.' },
        { type: 'mcq', q: 'What does a lightning rod do?', options: ['Gives charge a safe low-resistance path to earth', 'Stores the lightning’s charge', 'Repels lightning away from the building', 'Makes the cloud neutral before it rains'], answer: 0, explain: 'If lightning strikes, the charge flows through the thick conductor to earth instead of through the building.' },
        { type: 'mcq', q: 'The base of a thundercloud is negative. The ground below becomes…', options: ['positive, by induction', 'negative, by contact', 'neutral', 'magnetic'], answer: 0, explain: 'The negative cloud repels electrons in the ground away, leaving the surface below positive.' },
        { type: 'num', q: 'You see lightning and hear the thunder 6 seconds later. Using “divide by 3”, roughly how far away was the strike in km?', answer: 2, unit: 'km', explain: '6 ÷ 3 = 2 km. Sound travels about 340 m in each second, so 6 s ≈ 2 km.' },
      ],
    },
  ],
  test: {
    A: [
      { type: 'mcq', q: 'Which particle moves when objects become charged by rubbing?', options: ['Electrons', 'Protons', 'Neutrons', 'Nuclei'], answer: 0, explain: 'Electrons on the surfaces transfer. Protons stay in the nucleus.' },
      { type: 'mcq', q: 'A positive rod is brought near a positively charged balloon. The balloon is…', options: ['repelled', 'attracted', 'unaffected', 'discharged'], answer: 0, explain: 'Like charges repel.' },
      { type: 'num', q: r`What is the charge on an object with 50 extra electrons? Give the size only. ($e = 1.6 \times 10^{-19}$ C)`, answer: 8e-18, unit: 'C', explain: r`$Q = ne = 50 \times 1.6 \times 10^{-19} = 8.0 \times 10^{-18}$ C (negative).` },
      { type: 'mcq', q: 'Which direction do electric field lines point near a negative charge?', options: ['Towards the charge', 'Away from the charge', 'In circles around it', 'They don’t exist'], answer: 0, explain: 'Field lines show the force on a positive test charge, which is attracted towards a negative charge.' },
      { type: 'tf', q: 'Static shocks are more common on dry days.', answer: true, explain: 'On humid days a thin water layer lets charge leak away.' },
    ],
    M: [
      { type: 'explain', q: 'A woollen cloth is used to rub a polythene rod. Explain how the rod and cloth become charged, and compare the size and sign of their charges.', model: '<p>When the materials are rubbed, electrons are transferred because polythene holds electrons more strongly than wool. Electrons move from the wool to the polythene. The rod gains electrons and becomes negative; the cloth loses electrons and becomes positive. Charge is conserved, so the two charges are equal in size and opposite in sign.</p>', points: [{ lvl: 'A', text: 'Rod negative and cloth positive' }, { lvl: 'M', text: 'Electrons transfer from wool to polythene (not protons)' }, { lvl: 'M', text: 'Charges are equal in size because charge is conserved' }] },
      { type: 'num', q: r`An oil drop carries a charge of $6.4 \times 10^{-19}$ C. How many electrons has it gained?`, answer: 4, exact: true, explain: r`$n = Q/e = 6.4 \times 10^{-19} / 1.6 \times 10^{-19} = 4$.` },
      { type: 'mcq', q: 'A negative rod is held near (not touching) a neutral metal can on an insulating mat. Which statement is correct?', options: ['Electrons in the can move to the far side; the near side becomes positive and the can is attracted', 'Protons move to the near side of the can', 'The can gains electrons from the rod', 'Nothing happens because the can is neutral'], answer: 0, explain: 'The rod repels the free electrons in the metal. The near side is left positive and, being closer, is attracted more than the far side is repelled.' },
      { type: 'explain', q: 'Explain why aircraft are connected to the ground with a cable before refuelling.', model: '<p>As fuel flows through the hose, friction can transfer electrons and build up charge on the aircraft or tanker. If enough charge builds up, a spark could jump and ignite fuel vapour, causing a fire or explosion. Connecting the aircraft to earth with a conductor lets the charge flow away safely as it is produced, so no large charge builds up and no spark occurs.</p>', points: [{ lvl: 'A', text: 'Charge can build up during refuelling' }, { lvl: 'M', text: 'A spark could ignite fuel vapour' }, { lvl: 'M', text: 'The cable lets the charge flow to earth so it cannot build up' }] },
    ],
    E: [
      { type: 'explain', q: 'Describe how to give a metal sphere a positive charge using a negatively charged rod, without the rod touching the sphere. Explain what happens to the electrons at each step, and why the order of the last two steps matters.', model: '<p>1. Bring the negative rod near the neutral sphere (on an insulating stand). The rod repels free electrons to the far side; the near side is left positive. The sphere is still neutral overall.</p><p>2. Earth the far side (e.g. touch it). The repelled electrons flow away to earth.</p><p>3. Remove the earth connection while the rod is still near. The electrons cannot return.</p><p>4. Remove the rod. The sphere now has fewer electrons than protons, so it is positive, and the charge spreads evenly.</p><p>If the rod were removed before the earth connection, electrons would flow back up from earth and the sphere would end up neutral.</p>', points: [{ lvl: 'A', text: 'Rod near sphere, then earth, then remove' }, { lvl: 'M', text: 'Electrons repelled to far side and flow to earth' }, { lvl: 'E', text: 'Explains sphere is positive because it has lost electrons' }, { lvl: 'E', text: 'Explains why earth must be removed before the rod' }] },
      { type: 'explain', q: 'A negatively charged balloon sticks to a neutral wall. Discuss why there is a net attractive force even though the wall has no overall charge.', model: '<p>The balloon’s negative charge repels electrons in the wall’s surface molecules slightly away from the balloon. The wall is polarised: the surface near the balloon becomes slightly positive and the far side of each molecule slightly negative. The balloon attracts the positive charges and repels the negative ones. Electric force gets stronger as distance gets smaller, and the positive charges are closer. So the attraction is greater than the repulsion and there is a net attractive force. The wall is still neutral overall — the charges have only shifted, not left.</p>', points: [{ lvl: 'A', text: 'Opposite charges attract' }, { lvl: 'M', text: 'Wall becomes polarised by the balloon' }, { lvl: 'E', text: 'Nearer positive charges → stronger attraction than repulsion' }, { lvl: 'E', text: 'Wall stays neutral overall; charges shift only' }] },
      { type: 'num', q: r`A Millikan-style oil drop has a charge of $-8.0 \times 10^{-19}$ C. A second drop has $-4.8 \times 10^{-19}$ C. How many more extra electrons does the first drop have than the second?`, answer: 2, exact: true, explain: r`First: $8.0\times10^{-19}/1.6\times10^{-19} = 5$. Second: $4.8\times10^{-19}/1.6\times10^{-19} = 3$. Difference: 2 electrons.` },
    ],
  },
  glossary: [
    { term: 'Charge', def: 'A property of particles that makes them feel electric forces. Measured in coulombs (C). Symbol Q or q.' },
    { term: 'Coulomb (C)', def: 'Unit of charge. 1 C is the charge of about 6.25 × 10¹⁸ electrons.' },
    { term: 'Elementary charge (e)', def: 'The charge on one proton (+) or electron (−): 1.6 × 10⁻¹⁹ C.' },
    { term: 'Ion', def: 'An atom that has lost electrons (positive ion) or gained electrons (negative ion).' },
    { term: 'Conservation of charge', def: 'Charge cannot be created or destroyed, only moved from one place to another.' },
    { term: 'Electric field', def: 'The region around a charge where another charge feels a force.' },
    { term: 'Field line', def: 'A line showing the direction of the force on a positive test charge: away from +, towards −.' },
    { term: 'Electroscope', def: 'A device that detects charge; its thin metal leaves spread apart when charged.' },
    { term: 'Triboelectric series', def: 'A list of materials in order of how easily they lose electrons when rubbed.' },
    { term: 'Charging by friction', def: 'Rubbing two materials so that electrons transfer from one to the other.' },
    { term: 'Charging by contact', def: 'Touching a charged object to another so that charge spreads; both end with the same sign.' },
    { term: 'Charging by induction', def: 'Charging a conductor without touching it, using a nearby charge and an earth connection; gives the opposite sign.' },
    { term: 'Earthing', def: 'Connecting an object to the ground with a conductor so excess charge can flow away (or electrons flow in).' },
    { term: 'Polarisation', def: 'Slight separation of charge within neutral molecules caused by a nearby charge.' },
    { term: 'Discharge (spark)', def: 'A sudden flow of charge through air when the field is strong enough to ionise it.' },
  ],
  formulas: [
    { name: 'Charge from electrons', tex: 'Q = ne', symbols: [['Q', 'charge', 'C'], ['n', 'number of electrons', '—'], ['e', 'elementary charge, 1.6 × 10⁻¹⁹ C', 'C']], note: 'Rearrange to n = Q / e to count electrons.', level: 'L2' },
    { name: "Coulomb's law (go deeper)", tex: r`F = \frac{k q_1 q_2}{r^2}`, symbols: [['F', 'force between charges', 'N'], ['k', '8.99 × 10⁹', 'N m² C⁻²'], ['q_1, q_2', 'the two charges', 'C'], ['r', 'distance between them', 'm']], note: 'Inverse-square law. Not on the NCEA Level 2 formula sheet.', level: 'University' },
  ],
  flashcards: [
    { front: 'Like charges…', back: 'repel' }, { front: 'Unlike (opposite) charges…', back: 'attract' },
    { front: 'Which particle moves when objects are charged by rubbing?', back: 'Electrons' },
    { front: 'Polythene rubbed with wool becomes…', back: 'negative (gains electrons)' },
    { front: 'Charging by induction gives the conductor…', back: 'the opposite sign to the charged rod' },
    { front: 'Charging by contact gives…', back: 'the same sign as the charged object' },
    { front: 'Air breaks down (sparks) at about…', back: '3 million volts per metre (3 MV m⁻¹)' },
  ],
};
