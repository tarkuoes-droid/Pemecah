import React, { useState } from 'react';
import {
  PSYCHOLOGICAL_QUESTIONS,
  generatePsychologicalProfile,
} from '../services/psychologyQuestions';
import { UserPsychologicalProfile } from '../types/psychology';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Target,
  X,
  Compass,
} from 'lucide-react';

interface PsychologyAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profile: UserPsychologicalProfile) => void;
}

export const PsychologyAssessmentModal: React.FC<PsychologyAssessmentModalProps> = ({
  isOpen,
  onClose,
  onProfileCreated,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [generatedProfile, setGeneratedProfile] = useState<UserPsychologicalProfile | null>(null);

  if (!isOpen) return null;

  const currentQuestion = PSYCHOLOGICAL_QUESTIONS[currentStep];
  const isLastQuestion = currentStep === PSYCHOLOGICAL_QUESTIONS.length - 1;
  const currentSelection = selectedAnswers[currentQuestion?.id];

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (!currentSelection) return;

    if (isLastQuestion) {
      // Complete assessment and generate profile
      const profile = generatePsychologicalProfile(selectedAnswers);
      setGeneratedProfile(profile);
      onProfileCreated(profile);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header bar */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {generatedProfile
                  ? 'Profil Psikologis & Alur Belajar Anda'
                  : 'Tes Psikologi Gaya Belajar & Mental Bahasa Jepang'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {generatedProfile
                  ? 'Disesuaikan dengan cara kerja dopamin dan kenyamanan kognitif Anda'
                  : `Langkah ${currentStep + 1} dari ${PSYCHOLOGICAL_QUESTIONS.length} · Menyelaraskan alur belajar tanpa stres`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {!generatedProfile ? (
            /* QUESTION VIEW */
            <div className="space-y-5">
              {/* Progress bar */}
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-700 h-full transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / PSYCHOLOGICAL_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question title & context */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wider block">
                  {currentQuestion.title}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                  {currentQuestion.question}
                </h2>
                <p className="text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-700">Analisis Kognitif:</strong>{' '}
                  {currentQuestion.psychologicalContext}
                </p>
              </div>

              {/* Options list */}
              <div className="space-y-2.5 pt-1">
                {currentQuestion.options.map((option) => {
                  const isSelected = currentSelection === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(option.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-red-600 bg-red-50/70 ring-2 ring-red-600/20 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-red-700 bg-red-700 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-tight">
                          {option.text}
                        </p>
                        <p className="text-[11px] text-stone-500">{option.subtext}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* RESULTS VIEW */
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Archetype banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50 via-stone-50 to-amber-50/40 border border-red-200 space-y-2 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-red-200 text-xs font-semibold text-red-800 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-red-700" />
                  Arketipe Psikologis Anda
                </span>

                <h2 className="text-2xl font-bold font-sans text-stone-900">
                  {generatedProfile.archetypeName}
                </h2>
                <p className="text-xs font-medium text-stone-600 italic">
                  "{generatedProfile.archetypeTagline}"
                </p>

                <p className="text-xs text-stone-700 leading-relaxed max-w-lg mx-auto pt-2 border-t border-stone-200/80">
                  {generatedProfile.description}
                </p>
              </div>

              {/* Strengths & Blindspots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Kekuatan Alami Otak Anda</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-700 list-disc pl-4">
                    {generatedProfile.strengths.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Jebakan Mental yang Perlu Dihindari</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-700 list-disc pl-4">
                    {generatedProfile.mentalBlindspots.map((mb, i) => (
                      <li key={i}>{mb}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Customized Learning Path */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                  <Compass className="w-4 h-4 text-red-700" />
                  <span>Rekomendasi Alur & Strategi Belajar Personal:</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-stone-200">
                    <Target className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900">Target Harian Ideal:</strong>{' '}
                      <span className="text-stone-700">
                        {generatedProfile.personalizedLearningPath.recommendedDailyGoal}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-stone-200">
                    <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900">Kunci Ketagihan Belajar (Mental Hook):</strong>{' '}
                      <span className="text-stone-700">
                        {generatedProfile.personalizedLearningPath.mentalHook}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          {!generatedProfile ? (
            <>
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!currentSelection}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors"
              >
                <span>{isLastQuestion ? 'Lihat Profil Belajar' : 'Lanjut'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setGeneratedProfile(null);
                  setCurrentStep(0);
                }}
                className="text-xs text-stone-500 hover:text-stone-800 underline"
              >
                Ulangi Kuesioner
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-xs transition-colors"
              >
                <span>Terapkan Alur Belajar & Mulai</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
