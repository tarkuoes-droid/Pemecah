/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InputPanel } from './components/InputPanel';
import { SentenceBreakdown } from './components/SentenceBreakdown';
import { VocabNotebook } from './components/VocabNotebook';
import { HistoryView } from './components/HistoryView';
import { ParticleGuideModal } from './components/ParticleGuideModal';
import { AboutView } from './components/AboutView';
import { ClarityWarningModal } from './components/ClarityWarningModal';
import { PsychologyAssessmentModal } from './components/PsychologyAssessmentModal';
import { PsychologyProfileView } from './components/PsychologyProfileView';
import {
  AnalysisResult,
  JapaneseWordToken,
  SavedVocabularyItem,
  DeconstructionHistoryItem,
} from './types/japanese';
import { UserPsychologicalProfile, DailyHabitStreak } from './types/psychology';
import { analyzeJapaneseText, analyzeJapaneseImage } from './services/api';
import {
  getSavedVocabulary,
  saveVocabularyToken,
  removeVocabularyItem,
  isVocabularySaved,
  getDeconstructionHistory,
  saveDeconstructionToHistory,
  deleteDeconstructionHistoryItem,
  clearDeconstructionHistory,
} from './services/storage';
import {
  getUserPsychologicalProfile,
  saveUserPsychologicalProfile,
  getDailyStreak,
  recordDailyDeconstructionActivity,
} from './services/psychologyStorage';
import { AlertCircle, ArrowLeft, Brain, Sparkles, Flame } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'analyzer' | 'vocab' | 'history' | 'mindset' | 'particles' | 'about'
  >('analyzer');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Saved vocabulary state
  const [savedItems, setSavedItems] = useState<SavedVocabularyItem[]>([]);

  // Deconstruction history state
  const [historyItems, setHistoryItems] = useState<DeconstructionHistoryItem[]>([]);

  // Psychology and mental habit streak state
  const [psychologyProfile, setPsychologyProfile] = useState<UserPsychologicalProfile | null>(null);
  const [dailyStreak, setDailyStreak] = useState<DailyHabitStreak>({
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: '',
    todayCount: 0,
  });
  const [isPsychologyModalOpen, setIsPsychologyModalOpen] = useState<boolean>(false);

  // Clarity modal state
  const [clarityModalState, setClarityModalState] = useState<{
    isOpen: boolean;
    clarityScore: number;
    clarityWarning: string;
    extractedText: string;
    imagePreviewUrl: string | null;
  }>({
    isOpen: false,
    clarityScore: 100,
    clarityWarning: '',
    extractedText: '',
    imagePreviewUrl: null,
  });

  // Load saved items, history, and psychology profile from localStorage on mount
  useEffect(() => {
    setSavedItems(getSavedVocabulary());
    setHistoryItems(getDeconstructionHistory());
    setPsychologyProfile(getUserPsychologicalProfile());
    setDailyStreak(getDailyStreak());
  }, []);

  const refreshSavedVocab = () => {
    setSavedItems(getSavedVocabulary());
  };

  const refreshHistory = () => {
    setHistoryItems(getDeconstructionHistory());
  };

  const handleProfileCreated = (profile: UserPsychologicalProfile) => {
    saveUserPsychologicalProfile(profile);
    setPsychologyProfile(profile);
  };

  // Analyze pure Japanese text
  const handleAnalyzeText = async (text: string) => {
    setIsLoading(true);
    setLoadingStep('Membedah struktur kalimat & relasi gramatikal...');
    setErrorMessage(null);

    try {
      const result = await analyzeJapaneseText(text);
      setAnalysisResult(result);
      saveDeconstructionToHistory(result, 'text');
      refreshHistory();

      // Record daily micro-victory
      const updatedStreak = recordDailyDeconstructionActivity();
      setDailyStreak(updatedStreak);

      setActiveTab('analyzer');
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Terjadi kesalahan saat memproses teks. Silakan periksa koneksi dan coba lagi.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Analyze image with clarity check
  const handleAnalyzeImage = async (base64: string, mimeType: string) => {
    setIsLoading(true);
    setLoadingStep('Memeriksa ketajaman foto & membaca teks (OCR)...');
    setErrorMessage(null);

    try {
      const result = await analyzeJapaneseImage(base64, mimeType, false);

      // If photo is blurry or low quality and user needs to confirm
      if (!result.isLegible && result.extractedText) {
        setClarityModalState({
          isOpen: true,
          clarityScore: result.clarityScore,
          clarityWarning: result.clarityWarning || 'Foto kurang tajam atau beresolusi rendah.',
          extractedText: result.extractedText,
          imagePreviewUrl: base64,
        });
        setIsLoading(false);
        return;
      }

      // If photo is clear and analysis is provided directly
      if (result.analysis) {
        setAnalysisResult(result.analysis);
        saveDeconstructionToHistory(result.analysis, 'photo');
        refreshHistory();

        // Record daily micro-victory
        const updatedStreak = recordDailyDeconstructionActivity();
        setDailyStreak(updatedStreak);

        setActiveTab('analyzer');
      } else if (result.extractedText) {
        // Run text analysis on the extracted text
        await handleAnalyzeText(result.extractedText);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Gagal memproses gambar. Pastikan gambar memuat teks Jepang yang jelas.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Confirmed text from the clarity warning modal
  const handleConfirmTextFromClarity = async (editedText: string) => {
    setClarityModalState((prev) => ({ ...prev, isOpen: false }));
    await handleAnalyzeText(editedText);
  };

  // Select a past deconstruction from history to re-open it
  const handleSelectHistory = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setErrorMessage(null);
    setActiveTab('analyzer');
  };

  // Delete single history item
  const handleDeleteHistoryItem = (id: string) => {
    deleteDeconstructionHistoryItem(id);
    refreshHistory();
  };

  // Clear all history items
  const handleClearAllHistory = () => {
    clearDeconstructionHistory();
    refreshHistory();
  };

  // Toggle save token to personal vocabulary notebook
  const handleToggleSaveToken = (token: JapaneseWordToken) => {
    const currentlySaved = isVocabularySaved(token.word, token.reading);
    if (currentlySaved) {
      const found = savedItems.find(
        (i) => i.word === token.word && i.reading === token.reading
      );
      if (found) {
        removeVocabularyItem(found.id);
      }
    } else {
      saveVocabularyToken(token, analysisResult?.japaneseText || '');
    }
    refreshSavedVocab();
  };

  const handleDeleteSavedItem = (id: string) => {
    removeVocabularyItem(id);
    refreshSavedVocab();
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setErrorMessage(null);
    setActiveTab('analyzer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedItems.length}
        historyCount={historyItems.length}
        hasPsychologyProfile={!!psychologyProfile}
        onNewAnalysisClick={handleNewAnalysis}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-900">Gagal Memproses</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-900 font-medium"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Tab 1: Dekonstruksi Workspace */}
        {activeTab === 'analyzer' && (
          <div className="space-y-6">
            {!analysisResult ? (
              <div className="space-y-6">
                {/* Hero kicker */}
                <div className="text-center max-w-2xl mx-auto space-y-2 pt-2 pb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    Pembedah & Penerjemah Kata Bahasa Jepang
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Unggah foto teks atau masukkan tulisan Jepang untuk membongkar setiap kata, partikel, relasi gramatikal, alternatif sinonim, dan contoh nyata.
                  </p>
                </div>

                {/* Mindset Invitation Card (if not yet assessed) */}
                {!psychologyProfile ? (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-50/80 via-stone-50 to-amber-50/50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-red-700 text-white shrink-0 mt-0.5">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                          Ingin tahu gaya belajar & saklar dopamin otak Anda?
                        </h4>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          Ikuti 5 pertanyaan psikologis singkat (2 menit) untuk menyesuaikan alur belajar agar Anda ketagihan dan terbebas dari rasa jenuh kanji.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPsychologyModalOpen(true)}
                      className="px-4 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-2xs transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tes Gaya Belajar</span>
                    </button>
                  </div>
                ) : (
                  /* Active Profile & Streak Micro-Bar */
                  <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-stone-700">
                      <span className="font-semibold text-stone-900 flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5 text-red-700" />
                        {psychologyProfile.archetypeName.split('(')[0].trim()}:
                      </span>
                      <span className="text-stone-500 italic truncate max-w-xs hidden sm:inline">
                        "{psychologyProfile.archetypeTagline}"
                      </span>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                      {dailyStreak.currentStreak > 0 && (
                        <span className="flex items-center gap-1 font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{dailyStreak.currentStreak} Hari Streak</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setActiveTab('mindset')}
                        className="text-red-700 hover:text-red-800 font-semibold underline underline-offset-2"
                      >
                        Buka Profil Mental →
                      </button>
                    </div>
                  </div>
                )}

                {/* Input Hub */}
                <InputPanel
                  onAnalyzeText={handleAnalyzeText}
                  onAnalyzeImage={handleAnalyzeImage}
                  isLoading={isLoading}
                  loadingStep={loadingStep}
                  recentHistory={historyItems}
                  onSelectHistory={handleSelectHistory}
                  onViewAllHistory={() => setActiveTab('history')}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleNewAnalysis}
                    className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors py-1 px-2.5 rounded-lg hover:bg-stone-200/50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Masukkan Teks / Foto Lain</span>
                  </button>

                  <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="hover:text-red-700 underline underline-offset-2"
                    >
                      Buka Riwayat ({historyItems.length})
                    </button>
                    <span>·</span>
                    <span>{savedItems.length} kata tersimpan di buku</span>
                  </div>
                </div>

                <SentenceBreakdown
                  analysis={analysisResult}
                  isTokenSaved={(tok) => isVocabularySaved(tok.word, tok.reading)}
                  onToggleSaveToken={handleToggleSaveToken}
                  onReset={handleNewAnalysis}
                  psychologyProfile={psychologyProfile}
                  streak={dailyStreak}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profil Mental & Gaya Belajar */}
        {activeTab === 'mindset' && (
          <PsychologyProfileView
            profile={psychologyProfile}
            streak={dailyStreak}
            onRetakeAssessment={() => setIsPsychologyModalOpen(true)}
            onStartPractice={() => setActiveTab('analyzer')}
          />
        )}

        {/* Tab 3: Buku Kosakata Pribadi */}
        {activeTab === 'vocab' && (
          <VocabNotebook
            items={savedItems}
            onDeleteItem={handleDeleteSavedItem}
            onRefresh={refreshSavedVocab}
            onSelectWordForAnalysis={(word) => {
              handleAnalyzeText(word);
            }}
          />
        )}

        {/* Tab 4: Riwayat Dekonstruksi */}
        {activeTab === 'history' && (
          <HistoryView
            historyItems={historyItems}
            onSelectHistory={handleSelectHistory}
            onDeleteItem={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
            onNewAnalysis={handleNewAnalysis}
          />
        )}

        {/* Tab 5: Kamus & Panduan Partikel */}
        {activeTab === 'particles' && <ParticleGuideModal />}

        {/* Tab 6: Tentang & Panduan */}
        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Psychology Assessment Modal */}
      <PsychologyAssessmentModal
        isOpen={isPsychologyModalOpen}
        onClose={() => setIsPsychologyModalOpen(false)}
        onProfileCreated={handleProfileCreated}
      />

      {/* Photo Clarity Warning Confirmation Modal */}
      <ClarityWarningModal
        isOpen={clarityModalState.isOpen}
        clarityScore={clarityModalState.clarityScore}
        clarityWarning={clarityModalState.clarityWarning}
        initialText={clarityModalState.extractedText}
        imagePreviewUrl={clarityModalState.imagePreviewUrl}
        onConfirmText={handleConfirmTextFromClarity}
        onRetake={() => {
          setClarityModalState((prev) => ({ ...prev, isOpen: false }));
        }}
        onClose={() => {
          setClarityModalState((prev) => ({ ...prev, isOpen: false }));
        }}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/60 py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">KotobaMorph (言葉モーフ)</span>
            <span>·</span>
            <span>Alat Dekonstruksi & Analisis Teks Jepang</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Profil Mental Kognitif</span>
            <span>·</span>
            <span>Level JLPT N5 - N1</span>
            <span>·</span>
            <span>Relasi Partikel</span>
            <span>·</span>
            <span>Kosakata Pribadi</span>
            <span>·</span>
            <span>Riwayat Analisis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
