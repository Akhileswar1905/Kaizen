export type PlayerRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface PlayerStats {
  user_id: string;
  level: number;
  xp: number;
  rank: PlayerRank;
  strength: number;
  intelligence: number;
  vitality: number;
  willpower: number;
  luck: number;
  current_streak: number;
  max_streak: number;
  updated_at: string;
}

export type StatType = 'strength' | 'intelligence' | 'vitality' | 'willpower' | 'luck';

export type GamificationEvent =
  | { type: 'HABIT_COMPLETED'; amount: number }
  | { type: 'DSA_SOLVED'; amount: number }
  | { type: 'SYSTEM_DESIGN_MODULE'; amount: number }
  | { type: 'JOURNAL_SAVED'; amount: number }
  | { type: 'WEEKLY_REVIEW_DONE'; amount: number }
  | { type: 'FINANCE_LOGGED'; amount: number }
  | { type: 'REFINEMENT_QUEST_DONE'; amount: number };

export const XP_MAPPING: Record<GamificationEvent['type'], { xp: number; stat: StatType }> = {
  HABIT_COMPLETED: { xp: 10, stat: 'vitality' },
  DSA_SOLVED: { xp: 25, stat: 'intelligence' },
  SYSTEM_DESIGN_MODULE: { xp: 50, stat: 'strength' },
  JOURNAL_SAVED: { xp: 20, stat: 'willpower' },
  WEEKLY_REVIEW_DONE: { xp: 100, stat: 'willpower' },
  FINANCE_LOGGED: { xp: 5, stat: 'luck' },
  REFINEMENT_QUEST_DONE: { xp: 15, stat: 'willpower' },
};

/**
 * Calculates the XP required for the next level.
 * Using a simple scaling formula: level * 100
 */
export function getXpForNextLevel(level: number): number {
  return level * 100;
}

/**
 * Calculates if a player should rank up based on level and streak.
 */
export function calculateRank(level: number, streak: number): PlayerRank {
  if (level >= 100 && streak >= 365) return 'S';
  if (level >= 50 && streak >= 90) return 'A';
  if (level >= 30 && streak >= 30) return 'B';
  if (level >= 15 && streak >= 14) return 'C';
  if (level >= 5 && streak >= 7) return 'D';
  return 'E';
}

/**
 * Calculates the stat increase based on the event.
 */
export function calculateStatIncrease(event: GamificationEvent): { stat: StatType; value: number } {
  const mapping = XP_MAPPING[event.type];
  return {
    stat: mapping.stat,
    value: Math.floor(mapping.xp / 10) || 1,
  };
}

/**
 * Interfaces for raw log data used in calculation
 */
export interface RawHabitLog { is_completed: boolean; log_date: string; }
export interface RawDsaCompletion { problem_id: string; }
export interface RawJournal { entry_date: string; }
export interface RawWeeklyReview { week_start_date: string; }

export interface LogAggregation {
  habitLogs: RawHabitLog[];
  dsaCompletions: RawDsaCompletion[];
  journals: RawJournal[];
  weeklyReviews: RawWeeklyReview[];
}

/**
 * Derives PlayerStats from raw activity logs.
 */
export function derivePlayerStats(userId: string, logs: LogAggregation, currentStreak: number = 0): PlayerStats {
  let totalXp = 0;
  const stats: Record<StatType, number> = {
    strength: 0,
    intelligence: 0,
    vitality: 0,
    willpower: 0,
    luck: 0,
  };

  // Process Habit Logs
  logs.habitLogs.forEach(log => {
    if (log.is_completed) {
      const { xp, stat } = XP_MAPPING.HABIT_COMPLETED;
      totalXp += xp;
      stats[stat] += Math.floor(xp / 10) || 1;
    }
  });

  // Process DSA Completions
  logs.dsaCompletions.forEach(() => {
    const { xp, stat } = XP_MAPPING.DSA_SOLVED;
    totalXp += xp;
    stats[stat] += Math.floor(xp / 10) || 1;
  });

  // Process Journals
  logs.journals.forEach(() => {
    const { xp, stat } = XP_MAPPING.JOURNAL_SAVED;
    totalXp += xp;
    stats[stat] += Math.floor(xp / 10) || 1;
  });

  // Process Weekly Reviews
  logs.weeklyReviews.forEach(() => {
    const { xp, stat } = XP_MAPPING.WEEKLY_REVIEW_DONE;
    totalXp += xp;
    stats[stat] += Math.floor(xp / 10) || 1;
  });

  // Derive Level and remaining XP
  let level = 1;
  let remainingXp = totalXp;
  while (remainingXp >= getXpForNextLevel(level)) {
    remainingXp -= getXpForNextLevel(level);
    level++;
  }

  return {
    user_id: userId,
    level,
    xp: remainingXp,
    rank: calculateRank(level, currentStreak),
    strength: stats.strength,
    intelligence: stats.intelligence,
    vitality: stats.vitality,
    willpower: stats.willpower,
    luck: stats.luck,
    current_streak: currentStreak,
    max_streak: 0, // Max streak would need a more complex historical analysis
    updated_at: new Date().toISOString(),
  };
}
