/**
 * manifest.js — the whole course map. Chapters with status 'ready' have a content file
 * (content/chXX.js). The others are shown on the map as coming in a later build.
 */
export const COURSE = {
  title: 'Spark Lab',
  tagline: 'Electricity from Year 10 to engineering',
  chapters: [
    { id: 'ch00', num: 0, title: 'Maths Toolkit', blurb: 'Units, prefixes, scientific notation, rearranging formulas, significant figures, proportion and graphs.', levels: ['Y10', 'L1', 'L2', 'L3'], status: 'ready', icon: '🧮' },
    { id: 'ch01', num: 1, title: 'Charge & Static Electricity', blurb: 'Atoms, charge, forces between charges, charging by friction, contact and induction, lightning and safety.', levels: ['Y10', 'L2'], status: 'ready', icon: '⚡' },
    { id: 'ch02', num: 2, title: 'Conductors & Insulators', blurb: 'Charge carriers, electron drift, what controls resistance, semiconductors, superconductors and safe wiring.', levels: ['Y10', 'L1', 'L2'], status: 'ready', icon: '🧵' },
    { id: 'ch03', num: 3, title: 'Circuits & Symbols', blurb: 'What makes a circuit, conventional current, symbols, series and parallel circuits, meters and reading diagrams.', levels: ['Y10', 'L1'], status: 'ready', icon: '🔌' },
    { id: 'ch04', num: 4, title: 'Charge, Current & Voltage', blurb: 'Q = It, the coulomb, voltage as energy per coulomb, E = Vq.', levels: ['Y10', 'L1', 'L2'], status: 'soon', build: 2, icon: '🔋' },
    { id: 'ch05', num: 5, title: "Resistance & Ohm's Law", blurb: 'V = IR, I–V graphs, ohmic and non-ohmic components, LDRs and thermistors.', levels: ['L1', 'L2'], status: 'soon', build: 2, icon: 'Ω' },
    { id: 'ch06', num: 6, title: 'Series & Parallel Calculations', blurb: 'Total resistance, mixed circuits, step-by-step circuit analysis.', levels: ['L1', 'L2'], status: 'soon', build: 2, icon: '🧩' },
    { id: 'ch07', num: 7, title: 'Electrical Power & Energy', blurb: 'P = VI, I²R, V²/R, E = Pt, kWh and power bills, efficiency, home safety.', levels: ['L1', 'L2'], status: 'soon', build: 2, icon: '💡' },
    { id: 'ch08', num: 8, title: 'DC, AC & Power Transmission', blurb: 'Direct and alternating current, transmission losses and the NZ grid.', levels: ['L2', 'L3'], status: 'soon', build: 3, icon: '〰️' },
    { id: 'ch09', num: 9, title: 'Electric Fields', blurb: 'E = V/d, F = Eq, ΔEp = Vq, charged particles between plates.', levels: ['L2'], status: 'soon', build: 3, icon: '🧲' },
    { id: 'ch10', num: 10, title: 'EMF & Internal Resistance', blurb: 'V = ε − Ir, terminal voltage, lost volts.', levels: ['L3'], status: 'soon', build: 3, icon: '🔋' },
    { id: 'ch11', num: 11, title: 'Potential Dividers & Sensors', blurb: 'Voltage dividers, sensor circuits and design.', levels: ['L2', 'L3'], status: 'soon', build: 3, icon: '🎚️' },
    { id: 'ch12', num: 12, title: 'Magnetism & Magnetic Fields', blurb: 'Field patterns, fields from currents, solenoids, right-hand rules.', levels: ['L2'], status: 'soon', build: 4, icon: '🧭' },
    { id: 'ch13', num: 13, title: 'Magnetic Force', blurb: 'F = BIL, F = Bqv, how motors work.', levels: ['L2'], status: 'soon', build: 4, icon: '⚙️' },
    { id: 'ch14', num: 14, title: 'Electromagnetic Induction', blurb: "V = BvL, Faraday's and Lenz's laws, generators.", levels: ['L2'], status: 'soon', build: 4, icon: '🌀' },
    { id: 'ch15', num: 15, title: 'Transformers & the National Grid', blurb: 'Transformer equations, step-up and step-down, HVDC.', levels: ['L2', 'L3'], status: 'soon', build: 4, icon: '🏭' },
  ],
  later: [
    { title: 'Stage 2: NCEA Level 3 electrical systems', items: ["Kirchhoff's laws", 'Capacitors and RC circuits', 'Inductors and LR circuits', 'AC: rms, reactance, phasors, impedance, resonance', 'Scholarship-style problems'] },
    { title: 'Stage 3: University bridge', items: ['Complex numbers and phasors', 'Nodal and mesh analysis', 'Thévenin and Norton', 'Transients', 'Semiconductors and op-amps', 'Digital logic', 'Three-phase power', "Maxwell's equations (first look)"] },
  ],
};
