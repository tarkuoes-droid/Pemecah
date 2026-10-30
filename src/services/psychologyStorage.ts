import { UserPsychologicalProfile, DailyHabitStreak } from '../types/psychology';

const PROFILE_STORAGE_KEY = 'kotobamorph_psycho_profile_v1';
const STREAK_STORAGE_KEY = 'kotobamorph_habit_streak_v1';

export function getUserPsychologicalProfile(): UserPsychologicalProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading psychological profile:', e);
    return null;
  }
}

export function saveUserPsychologicalProfile(profile: UserPsychologicalProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving psychological profile:', e);
  }
}

export function clearUserPsychologicalProfile(): void {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
}

function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

export function getDailyStreak(): DailyHabitStreak {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    const today = getTodayDateString();
    if (!raw) {
      return {
        currentStreak: 0,
        bestStreak: 0,
        lastActiveDate: '',
        todayCount: 0,
      };
    }
    const data: DailyHabitStreak = JSON.parse(raw);
    const yesterday = getYesterdayDateString();

    // If last active was before yesterday, the streak is broken
    if (data.lastActiveDate !== today && data.lastActiveDate !== yesterday && data.lastActiveDate !== '') {
      return {
        currentStreak: 0,
        bestStreak: data.bestStreak,
        lastActiveDate: data.lastActiveDate,
        todayCount: 0,
      };
    }

    // If today is a new day, reset today's counter
    if (data.lastActiveDate !== today) {
      return {
        ...data,
        todayCount: 0,
      };
    }

    return data;
  } catch {
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastActiveDate: '',
      todayCount: 0,
    };
  }
}

export function recordDailyDeconstructionActivity(): DailyHabitStreak {
  const current = getDailyStreak();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  let newStreak = current.currentStreak;
  let newTodayCount = current.todayCount + 1;

  if (current.lastActiveDate === today) {
    // Already active today, streak stays the same, todayCount increments
    newStreak = current.currentStreak || 1;
  } else if (current.lastActiveDate === yesterday) {
    // Continued streak from yesterday!
    newStreak = (current.currentStreak || 0) + 1;
  } else {
    // Streak starts fresh
    newStreak = 1;
  }

  const updated: DailyHabitStreak = {
    currentStreak: newStreak,
    bestStreak: Math.max(current.bestStreak, newStreak),
    lastActiveDate: today,
    todayCount: newTodayCount,
  };

  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
