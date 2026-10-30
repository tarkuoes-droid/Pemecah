import {
  SavedVocabularyItem,
  JapaneseWordToken,
  AnalysisResult,
  DeconstructionHistoryItem,
} from '../types/japanese';

const VOCAB_STORAGE_KEY = 'kotobamorph_saved_vocab_v1';
const HISTORY_STORAGE_KEY = 'kotobamorph_recent_history_v1';

export function getSavedVocabulary(): SavedVocabularyItem[] {
  try {
    const raw = localStorage.getItem(VOCAB_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading saved vocabulary from localStorage:', e);
    return [];
  }
}

export function saveVocabularyToken(
  token: JapaneseWordToken,
  sourceSentence: string
): SavedVocabularyItem {
  const current = getSavedVocabulary();
  
  // Check if already exists (same word and reading)
  const existingIndex = current.findIndex(
    (item) => item.word === token.word && item.reading === token.reading
  );

  const newItem: SavedVocabularyItem = {
    id: existingIndex >= 0 ? current[existingIndex].id : `vocab_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    word: token.word,
    dictionaryForm: token.dictionaryForm,
    reading: token.reading,
    romaji: token.romaji,
    partOfSpeech: token.partOfSpeech,
    jlptLevel: token.jlptLevel,
    translationId: token.translationId,
    grammarReason: token.grammarConnection.reason,
    targetNeighbor: token.grammarConnection.targetNeighbor,
    sourceSentence: sourceSentence,
    realWorldSentence: token.examples.realWorldSentence,
    realWorldReading: token.examples.realWorldReading,
    realWorldTranslation: token.examples.realWorldTranslation,
    savedAt: Date.now(),
  };

  if (existingIndex >= 0) {
    current[existingIndex] = newItem;
  } else {
    current.unshift(newItem);
  }

  localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(current));
  return newItem;
}

export function removeVocabularyItem(id: string): void {
  const current = getSavedVocabulary();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(updated));
}

export function isVocabularySaved(word: string, reading: string): boolean {
  const current = getSavedVocabulary();
  return current.some((item) => item.word === word && item.reading === reading);
}

export function exportVocabularyAsJSON(): void {
  const items = getSavedVocabulary();
  const blob = new Blob([JSON.stringify(items, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kotobamorph_kosakata_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportVocabularyAsCSV(): void {
  const items = getSavedVocabulary();
  if (items.length === 0) return;

  const headers = [
    'Kata',
    'Bentuk Kamus',
    'Cara Baca (Kana)',
    'Romaji',
    'Kelas Kata',
    'Level JLPT',
    'Arti Indonesia',
    'Alasan Gramatikal',
    'Kata Terhubung',
    'Contoh Kalimat Nyata',
    'Arti Kalimat Nyata',
  ];

  const escapeCSV = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;

  const rows = items.map((item) => [
    escapeCSV(item.word),
    escapeCSV(item.dictionaryForm),
    escapeCSV(item.reading),
    escapeCSV(item.romaji),
    escapeCSV(item.partOfSpeech),
    escapeCSV(item.jlptLevel),
    escapeCSV(item.translationId),
    escapeCSV(item.grammarReason),
    escapeCSV(item.targetNeighbor),
    escapeCSV(item.realWorldSentence),
    escapeCSV(item.realWorldTranslation),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kotobamorph_kosakata_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importVocabularyFromJSON(jsonString: string): {
  success: boolean;
  count: number;
  error?: string;
} {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      return { success: false, count: 0, error: 'Format berkas JSON harus berupa daftar array.' };
    }

    const current = getSavedVocabulary();
    const map = new Map<string, SavedVocabularyItem>();
    current.forEach((item) => map.set(`${item.word}_${item.reading}`, item));

    let importedCount = 0;
    for (const item of data) {
      if (item.word && item.reading && item.translationId) {
        const key = `${item.word}_${item.reading}`;
        map.set(key, {
          ...item,
          id: item.id || `vocab_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          savedAt: item.savedAt || Date.now(),
        });
        importedCount++;
      }
    }

    const merged = Array.from(map.values()).sort((a, b) => b.savedAt - a.savedAt);
    localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(merged));
    return { success: true, count: importedCount };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Gagal memproses berkas JSON' };
  }
}

export interface HistoryItem {
  id: string;
  text: string;
  date: number;
}

const DECONSTRUCTION_HISTORY_KEY = 'kotobamorph_deconstruction_history_v2';

export function getDeconstructionHistory(): DeconstructionHistoryItem[] {
  try {
    const raw = localStorage.getItem(DECONSTRUCTION_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading deconstruction history from localStorage:', e);
    return [];
  }
}

export function saveDeconstructionToHistory(
  result: AnalysisResult,
  sourceType: 'photo' | 'text' = 'text'
): DeconstructionHistoryItem {
  const current = getDeconstructionHistory();

  // Avoid duplicate adjacent items for the same japanese text
  const filtered = current.filter(
    (item) => item.japaneseText.trim() !== result.japaneseText.trim()
  );

  const newItem: DeconstructionHistoryItem = {
    id: `history_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    japaneseText: result.japaneseText,
    overallTranslation: result.overallTranslation,
    sourceType,
    tokenCount: result.tokens?.length || 0,
    result,
  };

  // Keep up to 40 items in history
  const updated = [newItem, ...filtered].slice(0, 40);
  localStorage.setItem(DECONSTRUCTION_HISTORY_KEY, JSON.stringify(updated));
  return newItem;
}

export function deleteDeconstructionHistoryItem(id: string): void {
  const current = getDeconstructionHistory();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(DECONSTRUCTION_HISTORY_KEY, JSON.stringify(updated));
}

export function clearDeconstructionHistory(): void {
  localStorage.removeItem(DECONSTRUCTION_HISTORY_KEY);
}

export function getRecentHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addRecentHistory(text: string): void {
  if (!text || !text.trim()) return;
  const current = getRecentHistory().filter((item) => item.text !== text.trim());
  current.unshift({
    id: `hist_${Date.now()}`,
    text: text.trim(),
    date: Date.now(),
  });
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(current.slice(0, 8)));
}

