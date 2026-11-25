/**
 * mocks.js — mixed-topic practice exams. Each mock uses the chapter-test format
 * (Achieved → Merit → Excellence) but draws on several chapters, like a real paper.
 */
import { svg, comp, wire, dot } from '../js/utils/svg.js';


const M1_CIRCUIT = svg(420, 200, [
  comp('battery', 40, 40, 40, 170, { signs: true, label: '12 V', labelPos: 'left' }), wire([40, 40], [70, 40]), comp('resistor', 70, 40, 160, 40, { label: 'R₁ = 2.0 Ω' }),
  wire([160, 40], [200, 40]), comp('resistor', 200, 40, 320, 40, { label: 'R₂ = 6.0 Ω' }), wire([320, 40], [360, 40], [360, 170], [40, 170]),
  wire([180, 40], [180, 110], [200, 110]), comp('resistor', 200, 110, 320, 110, { label: 'R₃ = 3.0 Ω', labelPos: 'below' }), wire([320, 110], [360, 110]), dot(180, 40), dot(360, 110),
].join(''), { title: 'R1 in series with R2 and R3 in parallel, 12 V battery', maxw: 460 });

export default [
  {
    id: 'mock1',
    mock: true,
    num: 'M1',
    title: 'Mock exam 1: Circuits, power and energy',
    intro: 'Level 1–2 style. Covers Chapters 3–7: current, voltage, resistance, series and parallel circuits, power, energy and safety. Allow about 40 minutes and use a calculator.',
    lessons: [],
    test: {
      A: [
        { type: 'num', q: 'A charge of 90 C passes through a lamp in 1.5 minutes. Calculate the current.', answer: 1, unit: 'A', explain: 'I = q/t = 90 ÷ 90 = 1.0 A.' },
        { type: 'num', q: 'A 9.0 V battery drives 0.45 A through a resistor. Calculate the resistance.', answer: 20, unit: 'Ω', explain: 'R = V/I = 9.0 ÷ 0.45 = 20 Ω.' },
        { type: 'num', q: 'In the circuit, what is the combined resistance of R₂ and R₃?', answer: 2, unit: 'Ω', figure: M1_CIRCUIT, explain: '6.0 × 3.0 ÷ 9.0 = 2.0 Ω.' },
        { type: 'mcq', q: 'How should a voltmeter be connected to measure the voltage across R₁?', options: ['In parallel with R₁', 'In series with R₁', 'Across the whole battery only', 'In series with the battery'], answer: 0, explain: 'Voltmeters go across components.' },
        { type: 'num', q: 'A 2.4 kW heater is used for 3.0 hours. How many kWh does it use?', answer: 7.2, unit: 'kWh', explain: '2.4 × 3.0 = 7.2 kWh.' },
        { type: 'mcq', q: 'Which statement about a parallel circuit is correct?', options: ['Each branch has the same voltage', 'The current is the same in every branch', 'Adding a branch increases the total resistance', 'If one branch breaks, all go out'], answer: 0, explain: 'Same voltage across each branch.' },
      ],
      M: [
        { type: 'num', q: 'In the circuit, calculate the current through R₁.', answer: 3, unit: 'A', figure: M1_CIRCUIT, explain: 'R_T = 2.0 + 2.0 = 4.0 Ω; I = 12/4.0 = 3.0 A.' },
        { type: 'num', q: 'In the circuit, calculate the current through R₃.', answer: 2, unit: 'A', figure: M1_CIRCUIT, explain: 'V across the pair = 3.0 × 2.0 = 6.0 V; I₃ = 6.0/3.0 = 2.0 A.' },
        { type: 'num', q: 'A 230 V kettle has an element of resistance 23 Ω. Calculate the energy it transfers in 2.0 minutes.', answer: 276000, unit: 'J', explain: 'P = V²/R = 52 900/23 = 2300 W; E = Pt = 2300 × 120 = 2.76 × 10⁵ J.' },
        { type: 'explain', q: 'Explain why the total resistance of a circuit decreases when another resistor is connected in parallel.', model: '<p>The new resistor provides an extra path for the charge. It has the full voltage across it, so it carries its own current, while the existing branches keep their currents. The total current from the supply therefore increases. For the same supply voltage, a larger total current means a smaller total resistance (R = V/I).</p>', points: [{ lvl: 'A', text: 'Extra path for current' }, { lvl: 'M', text: 'Total current increases (sum of branch currents)' }, { lvl: 'M', text: 'Same V with larger I → smaller R' }] },
        { type: 'num', q: 'A 60% efficient motor lifts a load, giving it 540 J of potential energy. How much electrical energy did it use?', answer: 900, unit: 'J', explain: 'Input = 540 ÷ 0.60 = 900 J.' },
      ],
      E: [
        { type: 'explain', q: 'In the circuit, R₃ is disconnected. Discuss what happens to the current through R₁ and the voltage across R₂, supporting your answer with calculations.', figure: M1_CIRCUIT, model: '<p>Before: the parallel pair is 2.0 Ω, R_T = 4.0 Ω, I = 3.0 A through R₁, V₁ = 6.0 V and the pair (including R₂) has 6.0 V. After removing R₃, R₂ is alone in series with R₁: R_T = 2.0 + 6.0 = 8.0 Ω, so the current falls to 12/8.0 = 1.5 A. The voltage across R₁ falls to 1.5 × 2.0 = 3.0 V, so R₂ now has 12 − 3.0 = 9.0 V across it — an increase from 6.0 V. Removing a parallel branch raises the total resistance, so the total current (through R₁) falls; R₁ takes a smaller share of the voltage, leaving more for R₂.</p>', points: [{ lvl: 'A', text: 'Current through R₁ decreases; voltage across R₂ increases' }, { lvl: 'M', text: 'Total resistance increases (4.0 → 8.0 Ω)' }, { lvl: 'E', text: 'Correct values: 3.0 → 1.5 A; 6.0 → 9.0 V' }, { lvl: 'E', text: 'Linked explanation of voltage sharing' }] },
        { type: 'explain', q: 'A heater, a kettle and a toaster (2.4 kW, 2.2 kW and 0.90 kW) are all switched on, on one 20 A household circuit. Discuss whether this is safe and explain how the breaker and an RCD protect the household.', model: '<p>The appliances are in parallel at 230 V, so their powers add: 2400 + 2200 + 900 = 5500 W. The total current is I = P/V = 5500/230 = 23.9 A, which is more than 20 A. The circuit breaker trips, switching off the circuit before the cables overheat (the heating in the cables is I²R, so a larger current heats them much faster and could start a fire). The breaker protects the wiring, not people: a shock current of tens of milliamps is far too small to trip it. An RCD compares the current in the active and neutral wires; if current leaks to earth through a person, the difference (about 30 mA) makes it switch off within a few hundredths of a second, preventing a fatal shock.</p>', points: [{ lvl: 'A', text: 'Not safe; the breaker trips' }, { lvl: 'M', text: 'Total current ≈ 24 A > 20 A (powers add in parallel)' }, { lvl: 'E', text: 'Breaker prevents cable overheating (I²R); does not protect people' }, { lvl: 'E', text: 'RCD detects ~30 mA leakage and protects people' }] },
        { type: 'num', q: 'Two lamps rated “12 V 24 W” and “12 V 12 W” are connected in series to 12 V. Assuming constant resistance, calculate the power of the 12 W lamp.', answer: 5.33, unit: 'W', explain: 'R = 144/24 = 6.0 Ω and 144/12 = 12 Ω; I = 12/18 = 0.667 A; P = I²R = 0.444 × 12 = 5.3 W.' },
      ],
    },
  },
  {
    id: 'mock2',
    mock: true,
    num: 'M2',
    title: 'Mock exam 2: Electricity and electromagnetism (Level 2)',
    intro: 'NCEA Level 2 AS 91173 style. Covers electric fields, DC circuits and electromagnetism (Chapters 4–9 and 12–15). Allow about 50 minutes.',
    lessons: [],
    test: {
      A: [
        { type: 'num', q: 'Parallel plates 5.0 mm apart have 250 V across them. Calculate the electric field strength.', answer: 50000, unit: 'V m⁻¹', explain: 'E = V/d = 250 ÷ 0.0050 = 5.0 × 10⁴ V m⁻¹.' },
        { type: 'num', q: 'Calculate the force on an electron in a field of 2.5 × 10⁴ V m⁻¹.', answer: 4e-15, unit: 'N', explain: 'F = Eq = 2.5 × 10⁴ × 1.6 × 10⁻¹⁹ = 4.0 × 10⁻¹⁵ N.' },
        { type: 'num', q: 'A 0.30 m wire carries 4.0 A perpendicular to a 0.15 T field. Calculate the force on it.', answer: 0.18, unit: 'N', explain: 'F = BIL = 0.15 × 4.0 × 0.30 = 0.18 N.' },
        { type: 'num', q: 'A rod 0.50 m long moves at 2.0 m s⁻¹ through a 0.40 T field. Calculate the voltage induced.', answer: 0.4, unit: 'V', explain: 'V = BvL = 0.40 × 2.0 × 0.50 = 0.40 V.' },
        { type: 'mcq', q: 'Describe the field around a long straight current-carrying wire.', options: ['Concentric circles around the wire', 'Parallel lines along the wire', 'Radial lines out from the wire', 'There is no field'], answer: 0, explain: 'Circles; direction by the right-hand grip rule.' },
        { type: 'num', q: 'A transformer has 800 primary turns and 40 secondary turns. Calculate the output from 230 V.', answer: 11.5, unit: 'V', explain: '230 × 40/800 = 11.5 V.' },
      ],
      M: [
        { type: 'num', q: 'An electron is accelerated from rest across 800 V. Calculate its final speed. (m = 9.11 × 10⁻³¹ kg)', answer: 1.68e7, unit: 'm s⁻¹', explain: 'qV = 1.28 × 10⁻¹⁶ J; v = √(2 × 1.28 × 10⁻¹⁶ ÷ 9.11 × 10⁻³¹) = 1.7 × 10⁷ m s⁻¹.' },
        { type: 'num', q: 'A proton moving at 3.0 × 10⁵ m s⁻¹ feels a magnetic force of 2.4 × 10⁻¹⁴ N at right angles to a field. Calculate B.', answer: 0.5, unit: 'T', explain: 'B = F/(qv) = 2.4 × 10⁻¹⁴ ÷ (1.6 × 10⁻¹⁹ × 3.0 × 10⁵) = 0.50 T.' },
        { type: 'explain', q: 'Explain why a charged particle fired horizontally between two horizontal charged plates follows a curved path.', model: '<p>Between the plates there is a uniform electric field, so the particle feels a constant force F = Eq, vertically (towards the plate of opposite charge). There is no horizontal force, so its horizontal velocity stays constant. The constant vertical force gives a constant vertical acceleration, so its vertical velocity increases steadily. Constant horizontal velocity combined with constant vertical acceleration gives a parabolic path, like a ball thrown horizontally.</p>', points: [{ lvl: 'A', text: 'Constant force from the field (F = Eq)' }, { lvl: 'M', text: 'Horizontal velocity constant; vertical acceleration constant' }, { lvl: 'M', text: 'Result is a parabola' }] },
        { type: 'explain', q: 'State Lenz’s law and explain how it applies when a magnet is pushed towards a coil connected to a meter.', model: '<p>Lenz’s law: an induced current flows in the direction that opposes the change causing it. As the north pole of the magnet approaches, the flux through the coil increases and a current is induced. This current makes the end of the coil nearest the magnet a north pole, which repels the approaching magnet, opposing its motion. Work must therefore be done to push the magnet in, and this work becomes the electrical energy in the circuit — consistent with conservation of energy.</p>', points: [{ lvl: 'A', text: 'Correct statement of Lenz’s law' }, { lvl: 'M', text: 'Near end of coil becomes N and repels the magnet' }, { lvl: 'M', text: 'Links to work done / conservation of energy' }] },
        { type: 'num', q: 'A rod 0.25 m long moves at 4.0 m s⁻¹ on rails in a 0.60 T field, with a 1.2 Ω resistor completing the circuit. Calculate the induced current.', answer: 0.5, unit: 'A', explain: 'V = 0.60 × 4.0 × 0.25 = 0.60 V; I = 0.60/1.2 = 0.50 A.' },
      ],
      E: [
        { type: 'explain', q: 'Describe how a DC motor works and explain why it needs a split-ring commutator.', model: '<p>A coil between magnet poles carries a current. Its two sides carry current in opposite directions perpendicular to the field, so by F = BIL and the right-hand slap rule one side is pushed up and the other down, making a turning effect. When the coil reaches the perpendicular position, the forces line up through the axis, and if the current stayed the same, the forces would then push the coil back so it would just rock. The split-ring commutator turns with the coil and swaps its connections to the brushes every half-turn, reversing the current in the coil. The side next to each pole always carries current in the same direction, so the turning effect always acts the same way and the coil keeps rotating.</p>', points: [{ lvl: 'A', text: 'Forces on the coil make it turn' }, { lvl: 'M', text: 'Opposite currents in the two sides → opposite forces (F = BIL)' }, { lvl: 'E', text: 'Without a commutator the coil would rock and stop at the vertical' }, { lvl: 'E', text: 'Commutator reverses current every half-turn so rotation continues' }] },
        { type: 'explain', q: 'A power station produces 30 MW at 15 kV. Discuss, with calculations, the benefit of using a step-up transformer to 300 kV before sending the power through lines of total resistance 6.0 Ω.', model: '<p>Without a transformer: I = 30 × 10⁶ ÷ 15 × 10³ = 2000 A, and P_loss = I²R = 2000² × 6.0 = 2.4 × 10⁷ W — 80% of the power. With a 1 : 20 step-up transformer the voltage is 300 kV and (VpIp = VsIs) the current falls by 20 to 100 A, so P_loss = 100² × 6.0 = 6.0 × 10⁴ W — only 0.2%. Because loss ∝ I², reducing the current twentyfold reduces the loss four hundredfold. The transformer only works because the supply is AC: the changing current in the primary produces a changing flux in the core, inducing the voltage in the secondary.</p>', points: [{ lvl: 'A', text: 'Higher voltage → lower loss' }, { lvl: 'M', text: 'Currents 2000 A and 100 A' }, { lvl: 'E', text: 'Losses 24 MW vs 60 kW; factor 400 from I²' }, { lvl: 'E', text: 'Transformer needs AC (changing flux)' }] },
        { type: 'num', q: 'An oil drop of mass 2.4 × 10⁻¹⁵ kg is held stationary between plates 6.0 mm apart with 450 V across them. How many excess electrons does it carry? (g = 9.8 N kg⁻¹)', answer: 2, explain: 'E = 450/0.0060 = 7.5 × 10⁴ V m⁻¹; q = mg/E = 2.352 × 10⁻¹⁴ ÷ 7.5 × 10⁴ = 3.1 × 10⁻¹⁹ C ≈ 2e → 2 electrons.' },
      ],
    },
  },
  {
    id: 'mock3',
    mock: true,
    num: 'M3',
    title: 'Mock exam 3: DC and AC electrical systems (Level 3 preview)',
    intro: 'NCEA Level 3 AS 91526 style, using the parts covered so far: EMF and internal resistance, Kirchhoff’s laws, potential dividers and rms values (Chapters 8, 10 and 11). Capacitors and inductors come in Stage 2.',
    lessons: [],
    test: {
      A: [
        { type: 'num', q: 'A battery of EMF 6.0 V and internal resistance 0.50 Ω supplies 2.0 A. Calculate the terminal voltage.', answer: 5, unit: 'V', explain: 'V = ε − Ir = 6.0 − 1.0 = 5.0 V.' },
        { type: 'num', q: 'Calculate the rms voltage of an AC supply with a peak of 20 V.', answer: 14.1, unit: 'V', explain: '20/√2 = 14.1 V.' },
        { type: 'num', q: 'A potential divider has R₁ = 3.0 kΩ (top) and R₂ = 1.0 kΩ (bottom) across 8.0 V. Calculate V_out across R₂.', answer: 2, unit: 'V', explain: '8.0 × 1/4 = 2.0 V.' },
        { type: 'mcq', q: 'Kirchhoff’s current law is a statement of conservation of…', options: ['charge', 'energy', 'momentum', 'power'], answer: 0, explain: 'Current in = current out.' },
        { type: 'num', q: 'Calculate the short-circuit current of a 12 V battery with internal resistance 0.040 Ω.', answer: 300, unit: 'A', explain: 'ε/r = 300 A.' },
      ],
      M: [
        { type: 'num', q: 'A battery gives 8.2 V at 0.40 A and 7.0 V at 1.0 A. Calculate its internal resistance.', answer: 2, unit: 'Ω', explain: 'r = (8.2 − 7.0)/(1.0 − 0.40) = 1.2/0.60 = 2.0 Ω.' },
        { type: 'num', q: 'A 230 V rms supply is connected to a 46 Ω heater. Calculate the peak current.', answer: 7.07, unit: 'A', explain: 'I_rms = 5.0 A; I_peak = √2 × 5.0 = 7.07 A.' },
        { type: 'num', q: 'Two 10 kΩ resistors form a divider across 12 V. A 10 kΩ load is connected across the bottom resistor. Calculate the output voltage.', answer: 4, unit: 'V', explain: 'Bottom pair 5.0 kΩ; 12 × 5/15 = 4.0 V.' },
        { type: 'explain', q: 'Explain why the terminal voltage of a battery falls as the current it supplies increases.', model: '<p>A real battery has internal resistance. The current flowing through the battery also flows through this internal resistance, so some energy per coulomb is transferred inside the battery: the lost volts, Ir. The terminal voltage is the EMF minus these lost volts, V = ε − Ir. As the current increases, Ir increases, so the terminal voltage decreases.</p>', points: [{ lvl: 'A', text: 'Battery has internal resistance' }, { lvl: 'M', text: 'Lost volts = Ir increase with current' }, { lvl: 'M', text: 'V = ε − Ir decreases' }] },
      ],
      E: [
        { type: 'explain', q: 'A thermistor and a fixed resistor form a potential divider used to switch on a fan when a room gets too hot. The switching circuit turns on when its input rises above half the supply voltage. Discuss where the thermistor must be placed, how the circuit works, how to choose the fixed resistor, and why the switching circuit must draw very little current.', model: '<p>The thermistor’s resistance falls as it gets hotter. The output must rise as the temperature rises, so the output must be taken across the fixed resistor, with the thermistor at the top. As the room warms, the thermistor’s resistance falls, so it takes a smaller share of the supply voltage and the fixed resistor’s share — the output — rises. When the output passes half the supply, the switching circuit turns on the fan. At that point the two resistances are equal, so the fixed resistor should equal the thermistor’s resistance at the chosen switching temperature (or use a variable resistor to adjust it). The switching circuit is a load in parallel with the fixed resistor; if it drew significant current it would lower the effective resistance of the bottom part and pull the output down, changing the switching temperature. It must therefore have a resistance much larger than the fixed resistor.</p>', points: [{ lvl: 'A', text: 'Thermistor resistance falls with temperature' }, { lvl: 'M', text: 'Thermistor on top; output across fixed resistor rises when hot' }, { lvl: 'E', text: 'Fixed resistor = thermistor resistance at switching temperature' }, { lvl: 'E', text: 'Loading: switching input must have high resistance' }] },
        { type: 'num', q: 'A 12 V battery with r = 0.50 Ω and a 6.0 V battery with r = 0.50 Ω are connected in a single loop with a 5.0 Ω resistor, with their positive terminals facing the same way round the loop (EMFs opposing). Calculate the current.', answer: 1, unit: 'A', explain: 'Net EMF 6.0 V; total resistance 6.0 Ω; I = 1.0 A.' },
        { type: 'explain', q: 'A 9.0 V battery (r = 1.5 Ω) can be connected to a 1.5 Ω or a 6.0 Ω load. Compare the power delivered to each load and the efficiency, and explain which choice suits a device that needs maximum power and which suits long battery life.', model: '<p>1.5 Ω: I = 9.0/3.0 = 3.0 A; load power I²R = 9.0 × 1.5 = 13.5 W; efficiency R/(R + r) = 50%. 6.0 Ω: I = 9.0/7.5 = 1.2 A; load power = 1.44 × 6.0 = 8.6 W; efficiency 80%. The 1.5 Ω load equals the internal resistance, so it receives the maximum possible power, but half the energy is wasted heating the battery and it runs down quickly. The 6.0 Ω load receives less power but wastes far less energy inside the battery, so the battery lasts much longer. A device needing maximum power should match R to r; a device needing long life should have R much larger than r.</p>', points: [{ lvl: 'A', text: 'Correct current or power for one load' }, { lvl: 'M', text: 'Powers 13.5 W and 8.6 W' }, { lvl: 'E', text: 'Efficiencies 50% and 80%' }, { lvl: 'E', text: 'R = r for maximum power; R ≫ r for efficiency/long life' }] },
      ],
    },
  },
];

