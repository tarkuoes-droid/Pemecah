export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'Non-JLPT';

export interface GrammarConnection {
  targetNeighbor: string;
  reason: string;
}

export interface WordAlternative {
  word: string;
  reading: string;
  nuance: string;
}

export interface WordExamples {
  sourceContext: string;
  realWorldSentence: string;
  realWorldReading: string;
  realWorldTranslation: string;
}

export interface JapaneseWordToken {
  id: string;
  word: string;
  dictionaryForm: string;
  reading: string;
  romaji: string;
  partOfSpeech: string;
  jlptLevel: JLPTLevel;
  translationId: string;
  grammarConnection: GrammarConnection;
  alternatives: WordAlternative[];
  examples: WordExamples;
}

export interface AnalysisResult {
  japaneseText: string;
  overallTranslation: string;
  overallReading: string;
  nuanceExplanation: string;
  formalityLevel: string;
  tokens: JapaneseWordToken[];
}

export interface ImageClarityCheck {
  isLegible: boolean;
  clarityScore: number; // 0 - 100
  clarityWarning?: string;
  extractedText: string;
  analysis?: AnalysisResult;
}

export interface SavedVocabularyItem {
  id: string;
  word: string;
  dictionaryForm: string;
  reading: string;
  romaji: string;
  partOfSpeech: string;
  jlptLevel: JLPTLevel;
  translationId: string;
  grammarReason: string;
  targetNeighbor: string;
  sourceSentence: string;
  realWorldSentence: string;
  realWorldReading: string;
  realWorldTranslation: string;
  savedAt: number;
  tags?: string[];
  notes?: string;
}

export interface DeconstructionHistoryItem {
  id: string;
  timestamp: number;
  japaneseText: string;
  overallTranslation: string;
  sourceType: 'photo' | 'text';
  tokenCount: number;
  result: AnalysisResult;
}
