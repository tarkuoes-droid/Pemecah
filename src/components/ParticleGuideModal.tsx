import React, { useState } from 'react';
import { Volume2, BookOpen, Layers } from 'lucide-react';
import { playJapaneseSpeech } from '../services/speech';

const PARTICLES = [
  {
    kana: 'は (wa)',
    name: 'Partikel Penanda Topik',
    desc: 'Menandai subjek atau pokok pembicaraan utama dalam kalimat ("Mengenai X..."). Berfungsi seperti lampu sorot ke topik kalimat.',
    example: '私は学生です。 (Watashi wa gakusei desu - Saya adalah murid.)',
  },
  {
    kana: 'が (ga)',
    name: 'Partikel Penanda Subjek / Fokus Baru',
    desc: 'Menandai pelaku aksi secara spesifik, subjek dari kata sifat atau kata kerja intransitif, dan informasi baru ("Siapa yang melakukan").',
    example: '雨が降っています。 (Ame ga futte imasu - Hujan sedang turun.)',
  },
  {
    kana: 'を (o/wo)',
    name: 'Partikel Penanda Objek Penderita',
    desc: 'Menandai kata benda yang menjadi sasaran langsung dari kata kerja transitif (tindakan yang mengenai objek).',
    example: '本を読みます。 (Hon o yomimasu - Membaca buku.)',
  },
  {
    kana: 'に (ni)',
    name: 'Partikel Waktu / Titik Tujuan / Penerima',
    desc: 'Menyatakan waktu spesifik, titik tujuan kedatangan, posisi keberadaan benda mati/hidup, atau orang yang menerima tindakan.',
    example: '７時に起きます。 (Shichi-ji ni okimasu - Bangun pada jam 7.)',
  },
  {
    kana: 'で (de)',
    name: 'Partikel Tempat Aktivitas / Alat / Sarana',
    desc: 'Menyatakan tempat terjadinya suatu kegiatan, alat/metode yang digunakan, atau bahan baku.',
    example: '図書館で勉強します。 (Toshokan de benkyou shimasu - Belajar di perpustakaan.)',
  },
  {
    kana: 'へ (e)',
    name: 'Partikel Arah Gerakan',
    desc: 'Menyatakan orientasi atau arah menuju suatu tempat ("menuju ke..."). Fokus pada jalur perjalanan.',
    example: '日本へ行きます。 (Nihon e ikimasu - Pergi menuju Jepang.)',
  },
  {
    kana: 'と (to)',
    name: 'Partikel Penghubung "Dan" / "Bersama"',
    desc: 'Menyambung kata benda secara tuntas (daftar lengkap) atau menyatakan melakukan sesuatu bersama orang lain.',
    example: '友達と話します。 (Tomodachi to hanashimasu - Berbicara dengan teman.)',
  },
  {
    kana: 'も (mo)',
    name: 'Partikel Penanda "Juga / Pun"',
    desc: 'Menggantikan partikel は, が, atau を untuk menyatakan inklusi atau kesamaan sifat.',
    example: '私も日本人ではありません。 (Watashi mo nihonjin dewa arimasen - Saya pun bukan orang Jepang.)',
  },
  {
    kana: 'から・まで (kara / made)',
    name: 'Partikel Titik Awal & Akhir',
    desc: 'Menyatakan "dari" titik awal (waktu/tempat) hingga "sampai/ke" titik akhir.',
    example: '東京から大阪まで。 (Tokyo kara Osaka made - Dari Tokyo sampai Osaka.)',
  },
  {
    kana: 'ね / よ (ne / yo)',
    name: 'Partikel Akhir Kalimat (Shuujoshi)',
    desc: 'Partikel "ne" untuk meminta persetujuan ("kan?"), sedangkan "yo" untuk memberi tahu informasi baru kepada lawan bicara.',
    example: '美味しいですね！ (Oishii desu ne! - Enak ya!)',
  },
];

export const ParticleGuideModal: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-red-700" />
          <span>Kamus & Panduan Partikel Jepang (助詞 - Joshi)</span>
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Partikel adalah lem perekat dalam bahasa Jepang yang menentukan peran setiap kata dalam kalimat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PARTICLES.map((p, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold font-sans text-red-700">{p.kana}</span>
              <span className="text-xs font-semibold text-stone-700">{p.name}</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">{p.desc}</p>
            <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs">
              <span className="text-stone-800 font-sans font-medium">{p.example}</span>
              <button
                type="button"
                onClick={() => playJapaneseSpeech(p.example.split('(')[0])}
                className="text-stone-400 hover:text-red-700 p-1"
                title="Dengarkan contoh"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
