import React, { useState, useMemo } from 'react';
import { DeconstructionHistoryItem, AnalysisResult } from '../types/japanese';
import {
  History,
  Search,
  Trash2,
  ExternalLink,
  Camera,
  Type,
  Calendar,
  Layers,
  ArrowRight,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { playJapaneseSpeech } from '../services/speech';

interface HistoryViewProps {
  historyItems: DeconstructionHistoryItem[];
  onSelectHistory: (result: AnalysisResult) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onNewAnalysis: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  historyItems,
  onSelectHistory,
  onDeleteItem,
  onClearAll,
  onNewAnalysis,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<'all' | 'photo' | 'text'>('all');

  const filteredHistory = useMemo(() => {
    return historyItems.filter((item) => {
      if (selectedSource !== 'all' && item.sourceType !== selectedSource) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchJp = item.japaneseText.toLowerCase().includes(q);
        const matchTr = item.overallTranslation.toLowerCase().includes(q);
        const matchReading = (item.result.overallReading || '').toLowerCase().includes(q);
        const matchTokens = item.result.tokens?.some(
          (t) =>
            t.word.toLowerCase().includes(q) ||
            t.reading.toLowerCase().includes(q) ||
            t.translationId.toLowerCase().includes(q)
        );
        if (!matchJp && !matchTr && !matchReading && !matchTokens) {
          return false;
        }
      }
      return true;
    });
  }, [historyItems, selectedSource, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <History className="w-5 h-5 text-red-700" />
              <span>Riwayat Dekonstruksi Teks</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Akses kembali hasil pemecahan kata, relasi partikel, dan terjemahan yang pernah Anda analisis sebelumnya secara instan tanpa perlu memproses ulang.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {historyItems.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat dekonstruksi?')) {
                    onClearAll();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-red-700 hover:bg-red-50 border border-stone-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua Riwayat</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNewAnalysis}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-2xs transition-colors"
            >
              <span>+ Analisis Baru</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="pt-3 border-t border-stone-100 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kalimat bahasa Jepang, arti, cara baca, atau kata tertentu dalam riwayat..."
              className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-stone-900 placeholder:text-stone-400"
            />
          </div>

          {/* Source Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-stone-400 mr-1">Sumber Input:</span>
            {[
              { id: 'all', label: 'Semua Riwayat' },
              { id: 'photo', label: 'Foto Teks (Kamera/Upload)' },
              { id: 'text', label: 'Input Teks Langsung' },
            ].map((src) => (
              <button
                key={src.id}
                onClick={() => setSelectedSource(src.id as any)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedSource === src.id
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {src.label}
              </button>
            ))}
            <span className="text-stone-400 text-xs ml-auto">
              Total {filteredHistory.length} riwayat ditemukan
            </span>
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
          <History className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-sm font-semibold text-stone-700">
            {historyItems.length === 0
              ? 'Belum ada riwayat dekonstruksi'
              : 'Tidak ada riwayat yang sesuai dengan pencarian'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {historyItems.length === 0
              ? 'Setiap kali Anda menganalisis teks Jepang dari foto maupun ketikan langsung, hasil pemecahan kata dan gramatikanya akan otomatis tersimpan di sini.'
              : 'Coba ubah kata kunci pencarian atau ganti filter sumber input.'}
          </p>
          {historyItems.length === 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onNewAnalysis}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-xs transition-colors"
              >
                <span>Mulai Analisis Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:border-stone-300 transition-all space-y-3 group"
            >
              {/* Header row: date & source info */}
              <div className="flex items-center justify-between gap-3 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-medium text-stone-700">
                    {item.sourceType === 'photo' ? (
                      <>
                        <Camera className="w-3.5 h-3.5 text-amber-700" />
                        <span>Foto Teks (OCR)</span>
                      </>
                    ) : (
                      <>
                        <Type className="w-3.5 h-3.5 text-stone-600" />
                        <span>Input Teks Langsung</span>
                      </>
                    )}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-500">
                    {new Date(item.timestamp).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-500 font-mono">
                    {item.tokenCount} kata/partikel
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus riwayat ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Japanese text & Reading */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl sm:text-2xl font-bold font-sans text-stone-900 tracking-wide">
                    {item.japaneseText}
                  </h3>
                  <button
                    type="button"
                    onClick={() => playJapaneseSpeech(item.japaneseText)}
                    className="text-stone-400 hover:text-red-700 p-1.5 rounded-full hover:bg-stone-100 shrink-0"
                    title="Dengarkan pengucapan kalimat"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {item.result.overallReading && (
                  <p className="text-xs font-medium text-stone-500 font-sans">
                    {item.result.overallReading}
                  </p>
                )}
              </div>

              {/* Indonesian Meaning */}
              <div className="p-3 bg-red-50/40 border border-red-100 rounded-lg text-xs sm:text-sm font-semibold text-stone-900">
                "{item.overallTranslation}"
              </div>

              {/* Preview of first tokens */}
              {item.result.tokens && item.result.tokens.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                    Komponen Kata & Partikel:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.result.tokens.slice(0, 7).map((tok) => (
                      <span
                        key={tok.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs text-stone-800"
                      >
                        <strong className="font-sans font-bold">{tok.word}</strong>
                        <span className="text-[10px] text-stone-500">({tok.reading})</span>
                        <span className="text-[10px] text-red-800">· {tok.translationId}</span>
                      </span>
                    ))}
                    {item.result.tokens.length > 7 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs text-stone-400 font-medium">
                        +{item.result.tokens.length - 7} kata lainnya...
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Footer action button */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  Tingkat tutur: {item.result.formalityLevel || 'Standar'}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectHistory(item.result)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-red-700 hover:text-white rounded-lg transition-all shadow-2xs group-hover:bg-red-700 group-hover:text-white"
                >
                  <span>Buka Dekonstruksi Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
