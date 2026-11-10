/**
 * config.js — app-wide constants. Change numbers here, not inside modules.
 */

export const APP_NAME = 'Spark Lab';
export const APP_VERSION = '1.0.0-build1';
export const STORAGE_KEY = 'sparklab.v1';
export const SCHEMA_VERSION = 1;

/** XP awarded for each kind of activity. */
export const XP = {
  lessonComplete: 30,
  checkpointFirstTry: 10,
  checkpointRetry: 4,
  testCorrect: 10,
  testGradeBonus: { A: 50, M: 100, E: 200 },
  flashcard: 2,
  flashcardDailyCap: 40,
  mistakeCleared: 8,
  simFirstUse: 5,
  funFact: 2,
  practiceCorrect: 5,
  streakBonusPerDay: 5,
  streakBonusMax: 50,
};

/** Level ladder. `min` is the total XP needed to reach the level. */
export const LEVELS = [
  { name: 'Spark', min: 0 },
  { name: 'Charge Carrier', min: 150 },
  { name: 'Current Flow', min: 400 },
  { name: 'Conductor', min: 800 },
  { name: 'Circuit Builder', min: 1400 },
  { name: 'Power Player', min: 2200 },
  { name: 'Field Master', min: 3200 },
  { name: 'Induction Ace', min: 4500 },
  { name: 'Grid Engineer', min: 6000 },
  { name: 'Future Engineer', min: 8000 },
];

export const DAILY_GOAL_OPTIONS = [30, 50, 80, 120];
export const DEFAULT_DAILY_GOAL = 50;

/** Leitner box intervals in days (box 1..5). */
export const SRS_INTERVALS = [0, 1, 3, 7, 16];
export const SRS_NEW_PER_DAY = 12;

/** A mistake leaves the mistake book after this many correct answers in a row. */
export const MISTAKE_CLEAR_STREAK = 2;

/**
 * Practice-grade thresholds for chapter tests (fraction of marks in each tier).
 * This only approximates NCEA judgements; real papers are marked holistically.
 */
export const GRADE_RULES = {
  E: { A: 0.75, M: 0.6, E: 0.5 },
  M: { A: 0.7, M: 0.5 },
  A: { A: 0.6 },
};

export const LEVEL_TAGS = {
  Y10: 'Year 10',
  L1: 'NCEA L1',
  L2: 'NCEA L2',
  L3: 'NCEA L3',
  Uni: 'University',
};

export const HIGHLIGHT_COLORS = ['green', 'pink', 'yellow'];
