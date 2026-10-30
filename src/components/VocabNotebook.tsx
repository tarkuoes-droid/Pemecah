import React, { useState, useMemo } from 'react';
import { SavedVocabularyItem, JLPTLevel } from '../types/japanese';
import {
  Search,
  Download,
  Upload,
  Trash2,
  Volume2,
  Layers,
  BookOpen,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { playJapaneseSpeech } from '../services/speech';
import {
  exportVocabularyAsCSV,
  exportVocabularyAsJSON,
  importVocabularyFromJSON,
} from '../services/storage';

interface VocabNotebookProps {
  items: SavedVocabularyItem[];
  onDeleteItem: (id: string) => void;
  onRefresh: () => void;
  onSelectWordForAnalysis?: (word: string) => void;
}

export const VocabNotebook: React.FC<VocabNotebookProps> = ({
  items,
  onDeleteItem,
  onRefresh,
  onSelectWordForAnalysis,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJlpt, setSelectedJlpt] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [studyMode, setStudyMode] = useState<boolean>(false);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // JLPT filter
      if (selectedJlpt !== 'all' && item.jlptLevel !== selectedJlpt) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all') {
        const pos = item.partOfSpeech.toLowerCase();
        if (selectedCategory === 'particle' && !pos.includes('partikel')) return false;
        if (selectedCategory === 'verb' && !pos.includes('verba') && !pos.includes('kerja')) return false;
        if (selectedCategory === 'noun' && !pos.includes('nomina') && !pos.includes('benda')) return false;
        if (selectedCategory === 'adj' && !pos.includes('adjektiva') && !pos.includes('sifat')) return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchWord = item.word.toLowerCase().includes(q);
        const matchReading = item.reading.toLowerCase().includes(q);
        const matchRomaji = item.romaji.toLowerCase().includes(q);
        const matchTranslation = item.translationId.toLowerCase().includes(q);
        const matchReason = item.grammarReason.toLowerCase().includes(q);
        if (!matchWord && !matchReading && !matchRomaji && !matchTranslation && !matchReason) {
          return false;
        }
      }
      return true;
    });
  }, [items, selectedJlpt, selectedCategory, searchQuery]);

  // Handle flashcard navigation
  const currentCard = filteredItems[flashcardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importVocabularyFromJSON(content);
      if (res.success) {
        alert(`Berhasil mengimpor ${res.count} kosakata!`);
        onRefresh();
      } else {
        alert(`Gagal mengimpor: ${res.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-700" />
              <span>Daftar Kosakata Pribadi</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Disimpan untuk dipelajari kembali dengan pengelompokan level JLPT dan fungsi partikel tata bahasa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setStudyMode(!studyMode);
                setFlashcardIndex(0);
                setIsFlipped(false);
              }}
              disabled={filteredItems.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                studyMode
                  ? 'bg-red-700 text-white hover:bg-red-800'
                  : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{studyMode ? 'Keluar Mode Kuis' : 'Mode Kuis / Flashcard'}</span>
            </button>

            <button
              type="button"
              onClick={exportVocabularyAsCSV}
              disabled={items.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
              title="Unduh format tabel CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>

            <label className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Impor JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="pt-3 border-t border-stone-100 space-y-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kanji, cara baca hiragana, romaji, arti, atau catatan grammar..."
              className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-stone-900 placeholder:text-stone-400"
            />
          </div>

          {/* Group 1: JLPT Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-stone-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Level JLPT:
            </span>
            {['all', 'N5', 'N4', 'N3', 'N2', 'N1'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedJlpt(lvl)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedJlpt === lvl
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {lvl === 'all' ? 'Semua Level' : lvl}
              </button>
            ))}
          </div>

          {/* Group 2: Category / Particle filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-stone-400 mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Kategori:
            </span>
            {[
              { id: 'all', label: 'Semua Kategori' },
              { id: 'particle', label: 'Partikel Grammar (は, が, を, に...)' },
              { id: 'verb', label: 'Verba (Kata Kerja)' },
              { id: 'noun', label: 'Nomina (Kata Benda)' },
              { id: 'adj', label: 'Adjektiva (Kata Sifat)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-red-700 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FLASHCARD STUDY MODE */}
      {studyMode && currentCard && (
        <div className="bg-white rounded-xl border border-red-200 shadow-md p-6 max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
            <span>
              Kartu {flashcardIndex + 1} dari {filteredItems.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-red-700">
                Level {currentCard.jlptLevel}
              </span>
              <span>·</span>
              <span>{currentCard.partOfSpeech}</span>
            </div>
          </div>

          {/* Card Body */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[220px] rounded-xl border border-stone-200 bg-gradient-to-b from-stone-50/50 to-stone-100/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xs transition-all relative select-none"
          >
            {!isFlipped ? (
              <div className="space-y-3">
                <span className="text-4xl sm:text-5xl font-bold font-sans text-stone-900 tracking-wide">
                  {currentCard.word}
                </span>
                <p className="text-sm text-stone-500 font-medium">
                  {currentCard.reading} · <span className="font-mono">{currentCard.romaji}</span>
                </p>
                <span className="inline-block px-3 py-1 bg-white border border-stone-300 rounded-full text-xs text-stone-500 shadow-2xs mt-3">
                  Klik kartu untuk melihat arti & alasan tata bahasa
                </span>
              </div>
            ) : (
              <div className="space-y-3 max-w-md animate-in fade-in zoom-in-95 duration-100">
                <span className="text-2xl font-bold text-red-800">
                  {currentCard.translationId}
                </span>
                <p className="text-xs text-stone-600 leading-relaxed bg-white p-3 rounded-lg border border-stone-200">
                  <strong className="text-stone-800">Alasan Tata Bahasa:</strong>{' '}
                  {currentCard.grammarReason}
                </p>
                {currentCard.realWorldSentence && (
                  <div className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded border border-stone-200 text-left">
                    <p className="font-medium text-stone-900">{currentCard.realWorldSentence}</p>
                    <p className="text-[11px] text-stone-500">{currentCard.realWorldTranslation}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Flashcard Footer Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrevCard}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              type="button"
              onClick={() => playJapaneseSpeech(currentCard.word)}
              className="p-2 text-stone-600 hover:text-red-700 hover:bg-stone-100 rounded-full"
              title="Dengarkan kata"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNextCard}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-2xs"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VOCABULARY LIST VIEW */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-sm font-semibold text-stone-700">
            {items.length === 0
              ? 'Belum ada kosakata yang disimpan'
              : 'Tidak ada kosakata yang cocok dengan filter'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {items.length === 0
              ? 'Lakukan analisis kalimat bahasa Jepang dan klik tombol "Simpan Kosakata" pada kata yang ingin Anda pelajari kembali.'
              : 'Coba ubah filter level JLPT, kategori tata bahasa, atau kata kunci pencarian Anda.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold font-sans text-stone-900">
                        {item.word}
                      </span>
                      <button
                        type="button"
                        onClick={() => playJapaneseSpeech(item.word)}
                        className="text-stone-400 hover:text-red-700 p-1 rounded-full hover:bg-stone-100"
                        title="Dengarkan suara"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span className="text-red-800 font-medium">{item.reading}</span>
                      <span>·</span>
                      <span className="font-mono text-stone-400">{item.romaji}</span>
                      {item.dictionaryForm && item.dictionaryForm !== item.word && (
                        <>
                          <span>·</span>
                          <span>Kamus: {item.dictionaryForm}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-stone-100 rounded text-stone-700">
                      {item.jlptLevel}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-stone-100"
                      title="Hapus dari daftar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Indonesian Meaning */}
                <div className="mt-3 p-2.5 bg-red-50/40 border border-red-100 rounded-lg text-xs font-semibold text-stone-900">
                  {item.translationId}
                </div>

                {/* Grammar Rationale */}
                <div className="mt-2 text-xs text-stone-600 space-y-1">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Alasan Gramatikal & Relasi Kata:
                  </p>
                  <p className="leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-200/80">
                    {item.grammarReason}
                  </p>
                </div>

                {/* Real world sentence */}
                {item.realWorldSentence && (
                  <div className="mt-2 text-xs text-stone-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        Contoh Kalimat Nyata:
                      </span>
                      <button
                        type="button"
                        onClick={() => playJapaneseSpeech(item.realWorldSentence)}
                        className="text-stone-400 hover:text-red-700 text-[10px] flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Dengar</span>
                      </button>
                    </div>
                    <p className="font-sans text-stone-900 font-medium">
                      {item.realWorldSentence}
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      {item.realWorldTranslation}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>{item.partOfSpeech}</span>
                <span>
                  Disimpan:{' '}
                  {new Date(item.savedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
