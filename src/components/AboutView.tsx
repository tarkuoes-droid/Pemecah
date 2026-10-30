import React from 'react';
import { HelpCircle, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-red-700" />
          <span>Tentang KotobaMorph (言葉モーフ)</span>
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Mengapa dekonstruksi kata lebih efektif daripada terjemahan instan konvensional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-700">
        <div className="space-y-3 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Keunggulan Dekonstruksi Kata
          </h3>
          <p className="leading-relaxed">
            Penerjemah umum (seperti Google Translate) hanya menghasilkan kalimat terjemahan akhir tanpa menjelaskan logika di baliknya. Ketika menghadapi kalimat baru, pembelajar sering bingung mengapa suatu partikel digunakan.
          </p>
          <ul className="space-y-2 list-disc pl-4 text-stone-600">
            <li>Membedah verba ke bentuk kamus aslinya (jisho-kei).</li>
            <li>Mengungkap hubungan gramatikal dengan partikel sebelum dan sesudahnya.</li>
            <li>Menyajikan alternatif kata formal vs kasual.</li>
            <li>Menyediakan contoh penerapan di dunia nyata agar kata melekat di ingatan.</li>
          </ul>
        </div>

        <div className="space-y-3 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Tips Pengambilan Foto Teks yang Jelas
          </h3>
          <p className="leading-relaxed">
            Sistem dilengkapi evaluator kejernihan gambar otomatis. Untuk hasil dekonstruksi terbaik:
          </p>
          <ul className="space-y-2 list-disc pl-4 text-stone-600">
            <li>Pastikan pencahayaan cukup terang dan hindari bayangan tebal tangan atau ponsel.</li>
            <li>Pegang kamera tegak lurus sejajar dengan kertas buku/layar untuk menghindari teks melengkung atau miring parah.</li>
            <li>Jika foto agak buram, KotobaMorph akan menampilkan peringatan dan mengizinkan Anda mengoreksi huruf hasil bacaan sebelum analisis dijalankan.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
