import React from 'react';
import { BookOpen, Sparkles, HelpCircle, FileText, History, Brain } from 'lucide-react';

interface NavbarProps {
  activeTab: 'analyzer' | 'vocab' | 'history' | 'mindset' | 'particles' | 'about';
  setActiveTab: (tab: 'analyzer' | 'vocab' | 'history' | 'mindset' | 'particles' | 'about') => void;
  savedCount: number;
  historyCount: number;
  hasPsychologyProfile: boolean;
  onNewAnalysisClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  historyCount,
  hasPsychologyProfile,
  onNewAnalysisClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('analyzer')}
          className="flex items-center gap-2.5 text-left text-stone-900 group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-md py-1 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold text-sm tracking-widest shadow-xs">
            言
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-stone-900 group-hover:text-red-700 transition-colors whitespace-nowrap">
              KotobaMorph
            </span>
            <span className="text-[10px] text-stone-500 font-medium tracking-wider -mt-1">
              言葉モーフ · Dekonstruksi Jepang
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              activeTab === 'analyzer'
                ? 'text-red-700 font-semibold border-b-2 border-red-700 -mb-[2px]'
                : ''
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dekonstruksi</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              activeTab === 'vocab'
                ? 'text-red-700 font-semibold border-b-2 border-red-700 -mb-[2px]'
                : ''
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kosakata</span>
            {savedCount > 0 && (
              <span className="text-xs font-semibold text-stone-700 ml-0.5">
                ({savedCount})
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('mindset')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              activeTab === 'mindset'
                ? 'text-red-700 font-semibold border-b-2 border-red-700 -mb-[2px]'
                : ''
            }`}
          >
            <Brain className="w-4 h-4 text-red-700" />
            <span>Profil Mental</span>
            {!hasPsychologyProfile && (
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse ml-0.5" title="Mulai tes gaya belajar" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              activeTab === 'history'
                ? 'text-red-700 font-semibold border-b-2 border-red-700 -mb-[2px]'
                : ''
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat</span>
            {historyCount > 0 && (
              <span className="text-xs font-semibold text-stone-700 ml-0.5">
                ({historyCount})
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('particles')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              activeTab === 'particles'
                ? 'text-red-700 font-semibold border-b-2 border-red-700 -mb-[2px]'
                : ''
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Partikel</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              activeTab === 'about'
                ? 'text-red-700 font-semibold border-b-2 border-red-700 -mb-[2px]'
                : ''
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Panduan</span>
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewAnalysisClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-700 rounded-lg hover:bg-red-800 transition-colors whitespace-nowrap shadow-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            + Analisis Baru
          </button>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="flex lg:hidden border-t border-stone-200 px-3 py-2 justify-around bg-stone-50 text-xs font-medium text-stone-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`py-1 whitespace-nowrap px-1.5 ${
            activeTab === 'analyzer' ? 'text-red-700 font-bold' : ''
          }`}
        >
          Dekonstruksi
        </button>
        <button
          onClick={() => setActiveTab('mindset')}
          className={`py-1 whitespace-nowrap px-1.5 flex items-center gap-1 ${
            activeTab === 'mindset' ? 'text-red-700 font-bold' : ''
          }`}
        >
          <span>Profil Mental</span>
          {!hasPsychologyProfile && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
        </button>
        <button
          onClick={() => setActiveTab('vocab')}
          className={`py-1 whitespace-nowrap px-1.5 ${
            activeTab === 'vocab' ? 'text-red-700 font-bold' : ''
          }`}
        >
          Kosakata ({savedCount})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-1 whitespace-nowrap px-1.5 ${
            activeTab === 'history' ? 'text-red-700 font-bold' : ''
          }`}
        >
          Riwayat ({historyCount})
        </button>
        <button
          onClick={() => setActiveTab('particles')}
          className={`py-1 whitespace-nowrap px-1.5 ${
            activeTab === 'particles' ? 'text-red-700 font-bold' : ''
          }`}
        >
          Partikel
        </button>
      </div>
    </header>
  );
};
