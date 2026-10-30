import React from 'react';
import { JapaneseWordToken } from '../types/japanese';
import { Volume2, Bookmark, BookmarkCheck, GitCommit, ArrowRightLeft, BookOpen, Sparkles } from 'lucide-react';
import { playJapaneseSpeech } from '../services/speech';

interface WordDetailCardProps {
  token: JapaneseWordToken;
  isSaved: boolean;
  onToggleSave: (token: JapaneseWordToken) => void;
  sentenceContext: string;
}

export const WordDetailCard: React.FC<WordDetailCardProps> = ({
  token,
  isSaved,
  onToggleSave,
  sentenceContext,
}) => {
  const handlePlayAudio = (text: string) => {
    playJapaneseSpeech(text);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden sticky top-20">
      {/* Card Header */}
      <div className="p-5 border-b border-stone-200 bg-stone-50/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold font-sans tracking-tight text-stone-900">
                {token.word}
              </span>
              <button
                type="button"
                onClick={() => handlePlayAudio(token.word)}
                className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-stone-200/60 rounded-full transition-colors"
                title="Dengarkan pelafalan"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            {/* Furigana & Romaji */}
            <div className="flex items-center gap-2 text-sm text-stone-600 mt-1 font-medium">
              <span className="text-red-800">{token.reading}</span>
              <span className="text-stone-300">·</span>
              <span className="font-mono text-xs text-stone-500">{token.romaji}</span>
              {token.dictionaryForm && token.dictionaryForm !== token.word && (
                <>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs text-stone-500">
                    Bentuk Kamus: <strong className="text-stone-700">{token.dictionaryForm}</strong>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={() => onToggleSave(token)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-2xs ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tersimpan di Buku</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Simpan Kosakata</span>
              </>
            )}
          </button>
        </div>

        {/* Metadata info */}
        <div className="flex items-center gap-3 text-xs text-stone-500 mt-3 pt-3 border-t border-stone-200">
          <span className="font-semibold text-stone-700">{token.partOfSpeech}</span>
          <span className="text-stone-300">·</span>
          <span className="font-mono font-medium text-stone-700">
            Level JLPT: {token.jlptLevel}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5 text-sm">
        {/* 1. Terjemahan Individu */}
        <section>
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-red-700" />
            Terjemahan dalam Konteks Kalimat
          </h4>
          <div className="p-3 bg-red-50/50 rounded-lg border border-red-100 text-stone-900 font-medium text-base">
            {token.translationId}
          </div>
        </section>

        {/* 2. Alasan Mengapa Dipasangkan / Dihubungkan */}
        <section>
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5 text-indigo-700" />
            Relasi & Alasan Penggabungan dengan Kata Terdekat
          </h4>
          <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
              <span className="text-stone-500 font-normal">Terhubung dengan:</span>
              <span className="px-2 py-0.5 bg-white border border-stone-300 rounded font-sans text-stone-900 font-bold">
                {token.grammarConnection.targetNeighbor || '-'}
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {token.grammarConnection.reason}
            </p>
          </div>
        </section>

        {/* 3. Alternatif Kata (Sinonim & Variasi Nuansa) */}
        <section>
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-700" />
            Alternatif Kata & Variasi Nuansa
          </h4>
          {token.alternatives && token.alternatives.length > 0 ? (
            <div className="space-y-2">
              {token.alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-stone-50/80 rounded-lg border border-stone-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{alt.word}</span>
                      <span className="text-stone-500">({alt.reading})</span>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(alt.word)}
                        className="text-stone-400 hover:text-stone-700"
                        title="Dengar"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-stone-600 mt-0.5">{alt.nuance}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400 italic">
              Tidak ada alternatif umum untuk partikel atau kata fungsi ini.
            </p>
          )}
        </section>

        {/* 4. Contoh Penerapan Kata */}
        <section className="space-y-2">
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-700" />
            Contoh Penerapan Nyata
          </h4>

          {/* Konteks kalimat input */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
            <span className="text-[11px] font-semibold text-stone-500 block">
              1. Dalam Teks Input Anda:
            </span>
            <p className="text-stone-800 font-sans">{token.examples.sourceContext}</p>
          </div>

          {/* Kalimat nyata sehari-hari */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-500 block">
                2. Kalimat di Kehidupan Nyata:
              </span>
              <button
                type="button"
                onClick={() => handlePlayAudio(token.examples.realWorldSentence)}
                className="text-stone-400 hover:text-red-700 flex items-center gap-1 text-[11px]"
              >
                <Volume2 className="w-3 h-3" />
                <span>Dengarkan</span>
              </button>
            </div>
            <p className="text-stone-900 font-medium font-sans text-sm">
              {token.examples.realWorldSentence}
            </p>
            <p className="text-stone-500 text-[11px]">
              {token.examples.realWorldReading}
            </p>
            <p className="text-stone-700 text-xs pt-1 border-t border-stone-200/80">
              Artinya: {token.examples.realWorldTranslation}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
