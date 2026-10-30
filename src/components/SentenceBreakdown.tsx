import React, { useState } from 'react';
import { AnalysisResult, JapaneseWordToken } from '../types/japanese';
import { UserPsychologicalProfile, DailyHabitStreak } from '../types/psychology';
import { WordDetailCard } from './WordDetailCard';
import { Volume2, Sparkles, BookOpen, Layers, ArrowRight, Bookmark, Brain, Flame } from 'lucide-react';
import { playJapaneseSpeech } from '../services/speech';

interface SentenceBreakdownProps {
  analysis: AnalysisResult;
  isTokenSaved: (token: JapaneseWordToken) => boolean;
  onToggleSaveToken: (token: JapaneseWordToken) => void;
  onReset: () => void;
  psychologyProfile?: UserPsychologicalProfile | null;
  streak?: DailyHabitStreak;
}

export const SentenceBreakdown: React.FC<SentenceBreakdownProps> = ({
  analysis,
  isTokenSaved,
  onToggleSaveToken,
  onReset,
  psychologyProfile,
  streak,
}) => {
  const [selectedTokenId, setSelectedTokenId] = useState<string>(
    analysis.tokens[0]?.id || ''
  );

  const selectedToken =
    analysis.tokens.find((t) => t.id === selectedTokenId) || analysis.tokens[0];

  const handlePlayFullSentence = () => {
    playJapaneseSpeech(analysis.japaneseText);
  };

  return (
    <div className="space-y-6">
      {/* 1. Overall Sentence Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-700">
                Teks Bahasa Jepang & Cara Baca
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500 font-medium">
                Tingkat Tutur: {analysis.formalityLevel}
              </span>
            </div>
            {/* Interactive Furigana Sentence */}
            <div className="text-2xl sm:text-3xl font-bold font-sans text-stone-900 tracking-wide pt-1 leading-relaxed">
              {analysis.japaneseText}
            </div>
            <div className="text-sm font-medium text-stone-500 font-sans">
              {analysis.overallReading}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePlayFullSentence}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              title="Dengarkan seluruh kalimat"
            >
              <Volume2 className="w-4 h-4 text-red-700" />
              <span>Dengarkan Kalimat</span>
            </button>
          </div>
        </div>

        {/* Translation Banner */}
        <div className="p-4 bg-red-50/40 rounded-xl border border-red-100 space-y-1.5">
          <span className="text-xs font-semibold text-stone-600 block">
            Terjemahan Utuh (Bahasa Indonesia):
          </span>
          <p className="text-stone-900 font-semibold text-base sm:text-lg">
            "{analysis.overallTranslation}"
          </p>
          {analysis.nuanceExplanation && (
            <p className="text-xs text-stone-600 pt-1 border-t border-red-200/50 leading-relaxed">
              <strong>Catatan Nuansa:</strong> {analysis.nuanceExplanation}
            </p>
          )}
        </div>

        {/* Psychological Mindset Reinforcement */}
        {psychologyProfile && (
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-start sm:items-center gap-2 text-stone-700">
              <div className="p-1.5 rounded-lg bg-red-100/80 text-red-700 shrink-0 mt-0.5 sm:mt-0">
                <Brain className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block sm:inline mr-1">
                  Afirmasi {psychologyProfile.archetypeName.split('(')[0].trim()}:
                </span>
                <span className="text-stone-600 italic">
                  "{psychologyProfile.encouragementStyle}"
                </span>
              </div>
            </div>

            {streak && streak.currentStreak > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-semibold shrink-0 self-start sm:self-auto text-[11px]">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Streak Hari ke-{streak.currentStreak}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Interactive Tokens & Deep Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column (7 cols): Token flow list & interactive token selector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-700" />
                <h3 className="text-sm font-bold text-stone-900">
                  Pemecahan Kata & Partikel (Klik untuk Menginspeksi)
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                {analysis.tokens.length} komponen kata
              </span>
            </div>

            {/* Word Chips Row */}
            <div className="flex flex-wrap gap-2 pt-1 pb-3">
              {analysis.tokens.map((token) => {
                const isSelected = token.id === selectedToken?.id;
                const saved = isTokenSaved(token);
                const isParticle = token.partOfSpeech.toLowerCase().includes('partikel');

                return (
                  <button
                    key={token.id}
                    type="button"
                    onClick={() => setSelectedTokenId(token.id)}
                    className={`group relative text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-50/80 ring-2 ring-red-600/20 shadow-xs'
                        : isParticle
                        ? 'border-indigo-200 bg-indigo-50/40 hover:border-indigo-300'
                        : 'border-stone-200 bg-stone-50/60 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] text-stone-500 font-medium">
                        {token.reading}
                      </span>
                      <span className="text-lg font-bold font-sans text-stone-900 leading-tight">
                        {token.word}
                      </span>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-500">
                        <span className="truncate max-w-[80px]">{token.translationId}</span>
                        {saved && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 ml-auto" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-400 italic">
              Klik kata mana saja di atas untuk melihat dekonstruksi makna, alasan penggabungan partikel, alternatif, dan contoh penerapannya.
            </p>
          </div>

          {/* Sequential Breakdown List */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Daftar Aliran Kalimat & Hubungan Partikel
            </h4>
            <div className="divide-y divide-stone-100">
              {analysis.tokens.map((tok, idx) => {
                const isSelected = tok.id === selectedToken?.id;
                return (
                  <div
                    key={tok.id}
                    onClick={() => setSelectedTokenId(tok.id)}
                    className={`py-3 px-3 rounded-lg cursor-pointer transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-red-50/60' : 'hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-xs font-mono font-medium text-stone-400 mt-0.5">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 font-sans text-base">
                          {tok.word}
                        </span>
                        <span className="text-xs text-red-800">({tok.reading})</span>
                        <span className="text-xs text-stone-400 font-mono">
                          [{tok.jlptLevel}]
                        </span>
                        <span className="text-xs text-stone-500 truncate">
                          · {tok.partOfSpeech}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-stone-800 mt-0.5">
                        Arti: {tok.translationId}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                        <strong className="text-stone-700">Hubungan:</strong>{' '}
                        {tok.grammarConnection.reason}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveToken(tok);
                      }}
                      className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg shrink-0"
                      title="Simpan kata"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isTokenSaved(tok) ? 'fill-emerald-600 text-emerald-600' : ''
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column (5 cols): Deep Inspector Card */}
        <div className="lg:col-span-5">
          {selectedToken ? (
            <WordDetailCard
              token={selectedToken}
              isSaved={isTokenSaved(selectedToken)}
              onToggleSave={onToggleSaveToken}
              sentenceContext={analysis.japaneseText}
            />
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-sm">
              Pilih salah satu kata untuk melihat dekonstruksi lengkap.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
