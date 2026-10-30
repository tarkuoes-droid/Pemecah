export type LearningArchetype =
  | 'structural_architect'  // Sang Arsitek Struktur (Suka logika, rumus, & relasi partikel)
  | 'contextual_storyteller' // Sang Penjelajah Cerita (Didorong emosi, manga, anime, ekspresi hidup)
  | 'dopamine_sprinter'     // Sang Pemburu Kemenangan Mikro (Suka target cepat, 5 menit streak, kuis kilat)
  | 'mindful_scholar';      // Sang Pembelajar Reflektif (Suka kedalaman kanji, filosofi, tanpa stres)

export interface PsychologicalQuestionOption {
  id: string;
  text: string;
  subtext: string;
  archetypePoints: {
    structural_architect?: number;
    contextual_storyteller?: number;
    dopamine_sprinter?: number;
    mindful_scholar?: number;
  };
}

export interface PsychologicalQuestion {
  id: string;
  title: string;
  category: 'motivation' | 'cognition' | 'frustration_handling' | 'dopamine_trigger' | 'daily_rhythm';
  question: string;
  psychologicalContext: string;
  options: PsychologicalQuestionOption[];
}

export interface UserPsychologicalProfile {
  archetype: LearningArchetype;
  archetypeName: string;
  archetypeTagline: string;
  description: string;
  strengths: string[];
  mentalBlindspots: string[]; // Jebakan mental yang sering membuat jenuh/menyerah
  personalizedLearningPath: {
    recommendedDailyGoal: string; // Misal: "1 dekonstruksi kalimat nyata + review 3 flashcard"
    recommendedInputMode: 'photo' | 'text';
    focusGrammarStrategy: string;
    mentalHook: string; // Trigger psikologis agar ketagihan dan rileks
  };
  encouragementStyle: string; // Gaya kata-kata afirmasi saat selesai menganalisis kalimat
  answeredAt: number;
}

export interface DailyHabitStreak {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  todayCount: number;
}
