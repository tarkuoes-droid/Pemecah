import React, { useState } from 'react';
import { AlertTriangle, Check, RefreshCw, Edit3, Eye } from 'lucide-react';

interface ClarityWarningModalProps {
  isOpen: boolean;
  clarityScore: number;
  clarityWarning: string;
  initialText: string;
  imagePreviewUrl: string | null;
  onConfirmText: (editedText: string) => void;
  onRetake: () => void;
  onClose: () => void;
}

export const ClarityWarningModal: React.FC<ClarityWarningModalProps> = ({
  isOpen,
  clarityScore,
  clarityWarning,
  initialText,
  imagePreviewUrl,
  onConfirmText,
  onRetake,
  onClose,
}) => {
  const [text, setText] = useState(initialText);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Banner */}
        <div className="bg-amber-50 border-b border-amber-200 p-4 sm:p-5 flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-amber-900">
                Peringatan: Kualitas Foto Kurang Tajam
              </h3>
              <span className="text-xs font-mono font-medium text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                Skor: {clarityScore}/100
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              {clarityWarning ||
                'Foto terdeteksi buram atau pencahayaan kurang. Sistem telah mencoba membaca teksnya, mohon pastikan atau perbaiki tulisan sebelum dianalisis.'}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {imagePreviewUrl && (
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600">
              <img
                src={imagePreviewUrl}
                alt="Pratinjau foto teks"
                className="w-16 h-16 object-cover rounded border border-stone-300"
              />
              <div className="flex-1">
                <p className="font-medium text-stone-800">Pratinjau Foto Asli</p>
                <p className="text-stone-500 text-[11px] mt-0.5">
                  Bandingkan karakter teks di bawah dengan foto di sebelah kiri. Anda dapat langsung mengoreksi huruf kanji atau kana yang keliru terbaca.
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                Teks Bahasa Jepang Hasil Pembacaan (Dapat Disunting)
              </span>
              <span className="text-stone-400 font-normal">Koreksi bila perlu</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full text-base font-sans p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-stone-900"
              placeholder="Teks bahasa Jepang..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-stone-50 px-5 py-3.5 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRetake}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Unggah Foto Lain
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={!text.trim()}
              onClick={() => onConfirmText(text.trim())}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Lanjutkan Analisis Teks Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
