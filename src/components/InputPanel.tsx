import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, Type, Sparkles, Upload, X, ArrowRight, Loader2, Info, History } from 'lucide-react';
import { DeconstructionHistoryItem, AnalysisResult } from '../types/japanese';

interface InputPanelProps {
  onAnalyzeText: (text: string) => void;
  onAnalyzeImage: (base64: string, mimeType: string) => void;
  isLoading: boolean;
  loadingStep: string;
  recentHistory?: DeconstructionHistoryItem[];
  onSelectHistory?: (result: AnalysisResult) => void;
  onViewAllHistory?: () => void;
}

const SAMPLE_TEXTS = [
  {
    label: 'Dasar N5 (Partikel は, を, ている)',
    text: '私は毎日図書館で日本語の勉強をしています。',
    level: 'N5',
  },
  {
    label: 'Percakapan N4 (Penyambung て-form)',
    text: '昨日、友達と映画を見に行って、とても面白かったです。',
    level: 'N4',
  },
  {
    label: 'Nuansa N3 (〜そう・〜ほうがいい)',
    text: '雨が降りそうだから、傘を持って行ったほうがいいですよ。',
    level: 'N3',
  },
  {
    label: 'Ekspresi N2 (Penyesalan 〜ばよかったのに)',
    text: '新幹線のチケットを早めに予約しておけばよかったのに。',
    level: 'N2',
  },
  {
    label: 'Praktis di Jepang (Pesan Makanan)',
    text: 'すみません、この店のおすすめのラーメンを一つお願いします。',
    level: 'Praktis',
  },
];

export const InputPanel: React.FC<InputPanelProps> = ({
  onAnalyzeText,
  onAnalyzeImage,
  isLoading,
  loadingStep,
  recentHistory = [],
  onSelectHistory,
  onViewAllHistory,
}) => {
  const [mode, setMode] = useState<'photo' | 'text'>('photo');
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<{
    base64: string;
    mimeType: string;
    previewUrl: string;
    fileName: string;
    fileSizeKb: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste support for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileSelect(file);
            setMode('photo');
          }
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const compressImage = (
    file: File,
    maxDimension = 1400,
    quality = 0.85
  ): Promise<{ base64: string; mimeType: string; sizeKb: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // fallback to FileReader
          const reader = new FileReader();
          reader.onload = (e) => {
            const res = e.target?.result as string;
            resolve({
              base64: res,
              mimeType: file.type || 'image/jpeg',
              sizeKb: Math.round(file.size / 1024),
            });
          };
          reader.readAsDataURL(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = 'image/jpeg';
        const base64 = canvas.toDataURL(mimeType, quality);
        const sizeKb = Math.round((base64.length * 3) / 4 / 1024);
        resolve({ base64, mimeType, sizeKb });
      };
      img.onerror = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const res = e.target?.result as string;
          resolve({
            base64: res,
            mimeType: file.type || 'image/jpeg',
            sizeKb: Math.round(file.size / 1024),
          });
        };
        reader.readAsDataURL(file);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar (JPG, PNG, atau WEBP).');
      return;
    }
    const { base64, mimeType, sizeKb } = await compressImage(file);
    setSelectedImage({
      base64,
      mimeType,
      previewUrl: base64,
      fileName: file.name,
      fileSizeKb: sizeKb,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'photo') {
      if (!selectedImage) return;
      onAnalyzeImage(selectedImage.base64, selectedImage.mimeType);
    } else {
      if (!textInput.trim()) return;
      onAnalyzeText(textInput.trim());
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Mode Switcher */}
      <div className="flex border-b border-stone-200 bg-stone-50/70 p-1.5 gap-1.5">
        <button
          type="button"
          onClick={() => setMode('photo')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
            mode === 'photo'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
          }`}
        >
          <Camera className="w-4 h-4 text-red-700" />
          <span>Input Foto Teks (OCR & Cek Kejernihan)</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
            mode === 'text'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
          }`}
        >
          <Type className="w-4 h-4 text-stone-700" />
          <span>Ketik / Tempel Teks Langsung</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        {mode === 'photo' ? (
          <div>
            {!selectedImage ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-red-600 bg-red-50/50'
                    : 'border-stone-300 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-600 mb-3">
                  <Upload className="w-5 h-5 text-red-700" />
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  Pilih foto teks bahasa Jepang atau tarik berkas ke sini
                </p>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  Dukung foto buku, manga, struk, papan jalan, maupun tangkapan layar. Anda juga bisa menempel gambar langsung dengan{' '}
                  <kbd className="px-1.5 py-0.5 bg-stone-200 rounded text-[10px] font-mono">Ctrl+V</kbd>.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-stone-400 mt-4">
                  <span>JPG, PNG, WEBP</span>
                  <span>·</span>
                  <span>Maksimal 20MB</span>
                  <span>·</span>
                  <span>Pengecekan Kualitas Otomatis</span>
                </div>
              </div>
            ) : (
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedImage.previewUrl}
                      alt="Pratinjau gambar"
                      className="w-20 h-20 object-cover rounded-lg border border-stone-200 shadow-2xs"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-stone-800 truncate max-w-xs">
                        {selectedImage.fileName}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Ukuran: {selectedImage.fileSizeKb} KB
                      </p>
                      <span className="text-[11px] text-stone-600 font-medium">
                        Foto siap dianalisis dan dicek ketajamannya
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors"
                    title="Hapus foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                <span>Masukkan Kalimat / Paragraf Bahasa Jepang:</span>
                <span className="text-stone-400 font-normal">
                  {textInput.length} karakter
                </span>
              </div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={3}
                placeholder="Contoh: 私は毎日日本語の勉強をしています。"
                className="w-full text-base font-sans p-3.5 bg-stone-50/70 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-stone-900 placeholder:text-stone-400"
              />
            </div>

            {/* Presets */}
            <div>
              <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Atau coba contoh kalimat:
              </p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_TEXTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTextInput(sample.text)}
                    className="text-xs py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors text-left flex items-center gap-1.5"
                  >
                    <span className="font-semibold text-red-700 text-[11px]">
                      [{sample.level}]
                    </span>
                    <span className="truncate max-w-[220px]">{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-200">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>
              {mode === 'photo'
                ? 'Foto diperiksa tingkat kejelasannya sebelum analisis pemecahan kata.'
                : 'Menganalisis kata, partikel, relasi gramatikal, dan contoh nyata.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              (mode === 'photo' && !selectedImage) ||
              (mode === 'text' && !textInput.trim())
            }
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{loadingStep || 'Sedang Memproses...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Mulai Dekonstruksi</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Recent History Bar */}
      {recentHistory.length > 0 && onSelectHistory && (
        <div className="bg-stone-50/80 px-5 py-3 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <span className="font-semibold text-stone-500 flex items-center gap-1 shrink-0">
              <History className="w-3.5 h-3.5 text-stone-400" />
              <span>Riwayat Terakhir:</span>
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {recentHistory.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectHistory(item.result)}
                  className="px-2.5 py-1 bg-white hover:bg-red-50 hover:border-red-200 border border-stone-200 rounded text-stone-800 text-xs font-sans transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 group"
                  title={item.overallTranslation}
                >
                  <span className="font-bold text-stone-900 group-hover:text-red-700">
                    {item.japaneseText.length > 14
                      ? `${item.japaneseText.slice(0, 14)}...`
                      : item.japaneseText}
                  </span>
                  <span className="text-[10px] text-stone-400">· {item.tokenCount} kata</span>
                </button>
              ))}
            </div>
          </div>

          {onViewAllHistory && (
            <button
              type="button"
              onClick={onViewAllHistory}
              className="text-stone-600 hover:text-red-700 font-medium whitespace-nowrap shrink-0 text-[11px] self-end sm:self-auto"
            >
              Lihat Semua ({recentHistory.length}) →
            </button>
          )}
        </div>
      )}
    </div>
  );
};
