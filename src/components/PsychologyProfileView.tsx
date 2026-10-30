import React from 'react';
import { UserPsychologicalProfile, DailyHabitStreak } from '../types/psychology';
import {
  Brain,
  Sparkles,
  Flame,
  Target,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Compass,
  Zap,
  BookOpen,
  Heart,
  Smile,
} from 'lucide-react';

interface PsychologyProfileViewProps {
  profile: UserPsychologicalProfile | null;
  streak: DailyHabitStreak;
  onRetakeAssessment: () => void;
  onStartPractice: () => void;
}

export const PsychologyProfileView: React.FC<PsychologyProfileViewProps> = ({
  profile,
  streak,
  onRetakeAssessment,
  onStartPractice,
}) => {
  if (!profile) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto mb-2">
          <Brain className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
          Temukan Gaya Belajar & Profil Mental Bahasa Jepang Anda
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg mx-auto">
          Setiap otak memproses kanji dan tata bahasa Jepang dengan cara unik. Melalui 5 pertanyaan psikologis singkat, kami akan mendiagnosis arketipe belajar Anda, memicu saklar dopamin alami, dan menyusun alur harian yang membuat Anda ketagihan belajar tanpa rasa frustrasi.
        </p>

        <div className="pt-3">
          <button
            type="button"
            onClick={onRetakeAssessment}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-red-700 hover:bg-red-800 rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mulai Tes Psikologi Belajar (2 Menit)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner: Profile Archetype & Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Archetype Persona (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                Arketipe Psikologis Anda
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-sans text-stone-900 mt-1">
                {profile.archetypeName}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-medium italic mt-0.5">
                "{profile.archetypeTagline}"
              </p>
            </div>

            <button
              type="button"
              onClick={onRetakeAssessment}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 py-1 px-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors shrink-0"
              title="Ulangi kuesioner"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tes Ulang</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
            {profile.description}
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs text-stone-500">
            <span>
              Dianalisis:{' '}
              {new Date(profile.answeredAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <button
              type="button"
              onClick={onStartPractice}
              className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1"
            >
              <span>Mulai Latihan Dekonstruksi Sekarang →</span>
            </button>
          </div>
        </div>

        {/* Right: Daily Habit & Streak Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Momentum Belajar
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                Rekor Terbaik: {streak.bestStreak} hari
              </span>
            </div>

            <div className="mt-4 text-center p-4 bg-amber-50/50 rounded-xl border border-amber-200">
              <span className="text-4xl sm:text-5xl font-black font-sans text-amber-900">
                {streak.currentStreak}
              </span>
              <span className="text-xs font-bold text-amber-800 block mt-1">
                Hari Streak Berturut-turut!
              </span>
              <p className="text-[11px] text-amber-700 mt-1">
                {streak.todayCount > 0
                  ? `Hari ini: ${streak.todayCount} dekonstruksi selesai!`
                  : 'Selesaikan 1 dekonstruksi hari ini untuk menjaga streak!'}
              </p>
            </div>
          </div>

          <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-stone-800">
              <Zap className="w-3.5 h-3.5 text-red-700" />
              <span>Prinsip Kemenangan Mikro:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-600">
              1 kalimat sehari yang didekonstruksi secara tuntas jauh lebih ampuh membangun jalur sinapsis otak dibanding 2 jam belajar seminggu sekali.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Strategy & Mental Hook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customized Learning Path */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-red-700" />
            <h3 className="text-sm font-bold text-stone-900">
              Alur Belajar yang Disesuaikan untuk Anda
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                Target Harian yang Paling Ramah Otak:
              </span>
              <p className="font-semibold text-stone-900">
                {profile.personalizedLearningPath.recommendedDailyGoal}
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                Fokus Penguasaan Tata Bahasa:
              </span>
              <p className="text-stone-800 leading-relaxed">
                {profile.personalizedLearningPath.focusGrammarStrategy}
              </p>
            </div>

            <div className="p-3 bg-red-50/50 rounded-xl border border-red-200 space-y-1">
              <span className="text-[11px] font-semibold text-red-800 uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-700 fill-red-700" />
                Saklar Bikin Ketagihan (Mental Hook):
              </span>
              <p className="text-stone-900 font-medium leading-relaxed">
                {profile.personalizedLearningPath.mentalHook}
              </p>
            </div>
          </div>
        </div>

        {/* Strengths & Mental Blindspots */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-red-700" />
            <h3 className="text-sm font-bold text-stone-900">
              Peta Kekuatan & Tameng Mental Anda
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Strengths */}
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Kekuatan Kognitif Anda:
              </span>
              <ul className="space-y-1 text-stone-700 list-disc pl-4 text-[11px]">
                {profile.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Blindspots */}
            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Jebakan Mental yang Sering Terjadi:
              </span>
              <ul className="space-y-1 text-stone-700 list-disc pl-4 text-[11px]">
                {profile.mentalBlindspots.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Psychology Tips: First-Aid for Language Frustration */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Smile className="w-4 h-4 text-red-700" />
          <h3 className="text-sm font-bold text-stone-900">
            P3K Psikologis: Saat Bertemu Kalimat Rumit atau Merasa Jenuh
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
            <strong className="text-stone-900 block font-semibold">
              1. Normalisasi "Lupa Kanji"
            </strong>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Secara neurobiologis, otak manusia memang dirancang untuk melupakan informasi yang baru dilihat 1–2 kali (Kurva Ebbinghaus). Lupa bukan tanda Anda tidak berbakat, melainkan sinyal bahwa kanji itu sedang bersiap untuk dikonsolidasikan ke memori permanen.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
            <strong className="text-stone-900 block font-semibold">
              2. Patahkan Jadi Partikel (Chunking)
            </strong>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Saat melihat kalimat panjang Jepang yang menakutkan, jangan coba terjemahkan sekaligus. Cari partikelnya (は, が, を, に, で) dan bagi kalimat menjadi blok-blok kecil. Beban kerja kognitif otak Anda akan seketika turun 80%.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
            <strong className="text-stone-900 block font-semibold">
              3. Aturan 2 Menit (Dopamine Ignition)
            </strong>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Saat rasa malas melanda, katakan pada diri sendiri: "Saya hanya akan mendekonstruksi 1 kalimat saja hari ini." Begitu otak merasakan kepuasan memecahkan 1 kalimat, dopamin alami akan aktif dan Anda sering kali ingin lanjut secara sukarela.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
