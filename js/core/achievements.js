/**
 * achievements.js — badge definitions and the checker that awards them.
 */
import { getState, commit, emit } from './store.js';
import { readyChapters, allSimIds } from './content.js';
import { lessonsDoneCount, isChapterComplete, testsAtGrade } from './progress.js';

/**
 * Build the badge list. Chapter badges are generated from the ready chapters.
 * @returns {{id:string, icon:string, name:string, desc:string, group:string, test:(s:object)=>boolean}[]} Badges.
 */
export function badgeList() {
  const n = (k) => (s) => s.counters[k] || 0;
  const list = [
    { id: 'first-lesson', icon: '🌱', name: 'First spark', desc: 'Complete your first lesson.', group: 'Learning', test: () => lessonsDoneCount() >= 1 },
    { id: 'lessons-10', icon: '📗', name: 'Ten down', desc: 'Complete 10 lessons.', group: 'Learning', test: () => lessonsDoneCount() >= 10 },
    { id: 'lessons-20', icon: '📚', name: 'Bookworm', desc: 'Complete 20 lessons.', group: 'Learning', test: () => lessonsDoneCount() >= 20 },
    { id: 'perfect-1', icon: '🎯', name: 'Bullseye', desc: 'Get every checkpoint question right first time in a lesson.', group: 'Quizzes', test: (s) => n('perfectCheckpoints')(s) >= 1 },
    { id: 'perfect-5', icon: '🏹', name: 'Sharpshooter', desc: 'Score a perfect checkpoint in 5 lessons.', group: 'Quizzes', test: (s) => n('perfectCheckpoints')(s) >= 5 },
    { id: 'perfect-15', icon: '🧠', name: 'Steady hand', desc: 'Score a perfect checkpoint in 15 lessons.', group: 'Quizzes', test: (s) => n('perfectCheckpoints')(s) >= 15 },
    { id: 'test-a', icon: '✅', name: 'Achieved', desc: 'Reach Achieved on any chapter test.', group: 'Tests', test: () => testsAtGrade('A') >= 1 },
    { id: 'test-m', icon: '🥈', name: 'Merit mindset', desc: 'Reach Merit on any chapter test.', group: 'Tests', test: () => testsAtGrade('M') >= 1 },
    { id: 'test-e', icon: '🥇', name: 'Excellence', desc: 'Reach Excellence on any chapter test.', group: 'Tests', test: () => testsAtGrade('E') >= 1 },
    { id: 'test-e3', icon: '🏆', name: 'Hat-trick', desc: 'Reach Excellence on three chapter tests.', group: 'Tests', test: () => testsAtGrade('E') >= 3 },
    { id: 'streak-3', icon: '🔥', name: 'Warming up', desc: 'Study 3 days in a row.', group: 'Habits', test: (s) => s.streak.best >= 3 },
    { id: 'streak-7', icon: '🔥', name: 'One full week', desc: 'Study 7 days in a row.', group: 'Habits', test: (s) => s.streak.best >= 7 },
    { id: 'streak-14', icon: '☄️', name: 'Fortnight', desc: 'Study 14 days in a row.', group: 'Habits', test: (s) => s.streak.best >= 14 },
    { id: 'streak-30', icon: '🌋', name: 'Unstoppable', desc: 'Study 30 days in a row.', group: 'Habits', test: (s) => s.streak.best >= 30 },
    { id: 'goal-7', icon: '📅', name: 'Goal getter', desc: 'Reach your daily goal on 7 different days.', group: 'Habits', test: (s) => Object.keys(s.goalDays).length >= 7 },
    { id: 'xp-500', icon: '⚡', name: '500 XP', desc: 'Earn 500 XP in total.', group: 'XP', test: (s) => s.xp.total >= 500 },
    { id: 'xp-2000', icon: '🔋', name: '2000 XP', desc: 'Earn 2000 XP in total.', group: 'XP', test: (s) => s.xp.total >= 2000 },
    { id: 'xp-5000', icon: '🏭', name: 'Power station', desc: 'Earn 5000 XP in total.', group: 'XP', test: (s) => s.xp.total >= 5000 },
    { id: 'highlight-10', icon: '🖍️', name: 'Highlighter', desc: 'Highlight 10 pieces of text.', group: 'Study skills', test: (s) => s.highlights.length >= 10 },
    { id: 'notes-5', icon: '📝', name: 'Note-taker', desc: 'Write 5 notes on highlights.', group: 'Study skills', test: (s) => s.highlights.filter((h) => h.note).length >= 5 },
    { id: 'bookmark-3', icon: '🔖', name: 'Bookmarker', desc: 'Bookmark 3 lessons or sections.', group: 'Study skills', test: (s) => s.bookmarks.length >= 3 },
    { id: 'curious', icon: '🙋', name: 'Curious mind', desc: 'Save a question to ask your teacher or parent.', group: 'Study skills', test: (s) => s.questions.length >= 1 },
    { id: 'flash-25', icon: '🃏', name: 'Card shark', desc: 'Review 25 flashcards.', group: 'Revision', test: (s) => n('flashReviews')(s) >= 25 },
    { id: 'flash-200', icon: '🗂️', name: 'Memory bank', desc: 'Review 200 flashcards.', group: 'Revision', test: (s) => n('flashReviews')(s) >= 200 },
    { id: 'mistake-1', icon: '🩹', name: 'Fixer', desc: 'Clear a question from your mistake book.', group: 'Revision', test: (s) => n('mistakesCleared')(s) >= 1 },
    { id: 'mistake-10', icon: '🛠️', name: 'Mistake slayer', desc: 'Clear 10 questions from your mistake book.', group: 'Revision', test: (s) => n('mistakesCleared')(s) >= 10 },
    { id: 'comeback', icon: '🔁', name: 'Comeback', desc: 'Get a question right that you once got wrong.', group: 'Revision', test: (s) => n('comebacks')(s) >= 1 },
    { id: 'sim-3', icon: '🧪', name: 'Experimenter', desc: 'Try 3 different interactives.', group: 'Explore', test: (s) => Object.keys(s.sims).length >= 3 },
    { id: 'sim-all', icon: '🔬', name: 'Lab rat', desc: 'Try every interactive available so far.', group: 'Explore', test: (s) => { const ids = allSimIds(); return ids.length > 0 && ids.every((id) => s.sims[id]); } },
    { id: 'facts-10', icon: '💡', name: 'Trivia buff', desc: 'Reveal 10 fun facts.', group: 'Explore', test: (s) => Object.keys(s.facts).length >= 10 },
    { id: 'explorer', icon: '🧭', name: 'Explorer', desc: 'Open the glossary and the formula sheet.', group: 'Explore', test: (s) => s.visited.glossary && s.visited.formulas },
    { id: 'backup', icon: '💾', name: 'Safe keeper', desc: 'Back up your progress.', group: 'Explore', test: (s) => !!s.lastBackup },
    { id: 'reward-1', icon: '🎁', name: 'Treat time', desc: 'Have a reward claimed.', group: 'Rewards', test: (s) => s.rewards.items.some((r) => r.status === 'claimed') },
  ];
  for (const ch of readyChapters()) {
    list.push({ id: `chapter-${ch.id}`, icon: ch.icon || '⭐', name: `Chapter ${ch.num} complete`, desc: `Finish every lesson in ${ch.title}.`, group: 'Chapters', test: () => isChapterComplete(ch.id) });
  }
  return list;
}

/**
 * Award any badges whose conditions are now met.
 * @returns {object[]} Newly earned badges.
 */
export function checkAchievements() {
  const s = getState();
  const earned = [];
  for (const b of badgeList()) {
    if (s.badges[b.id]) continue;
    let ok = false;
    try { ok = b.test(s); } catch { ok = false; }
    if (ok) {
      s.badges[b.id] = Date.now();
      earned.push(b);
    }
  }
  if (earned.length) {
    commit('badge');
    earned.forEach((b) => emit('badge', b));
  }
  return earned;
}
