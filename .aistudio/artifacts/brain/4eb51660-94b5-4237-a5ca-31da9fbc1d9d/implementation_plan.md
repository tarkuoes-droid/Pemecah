# KotobaMorph (言葉モーフ) - Analisis & Dekonstruksi Teks Jepang Mendalam

Aplikasi web cerdas untuk membedah teks bahasa Jepang hingga ke tingkat kata, partikel, dan relasi gramatikal. Aplikasi tidak hanya memberikan terjemahan kalimat biasa, melainkan membongkar struktur kalimat per komponen kata, menjelaskan alasan penggabungan partikel/konjugasi di dekatnya, menyajikan alternatif kata, serta menyediakan buku kosakata pribadi yang dikelompokkan menurut level JLPT dan fungsi tata bahasa.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Tiga keputusan utama telah dikonfirmasi melalui klarifikasi:
> - **Bahasa Pengantar & Analisis**: Menggunakan Bahasa Indonesia untuk seluruh penjelasan makna kata, partikel, dan catatan tata bahasa.
> - **Organisasi Kosakata Pribadi**: Disimpan di memori lokal (localStorage) dengan pengelompokan terstruktur berdasarkan level JLPT (N5 s/d N1) dan kategori partikel/tata bahasa (Partikel Kasus, Verba, Adjektiva, dll.), lengkap dengan filter dan fitur review.
> - **Penanganan Kualitas Foto**: Model memeriksa kejernihan gambar (OCR legibility score). Jika teks terdeteksi buram/redup/terpotong, sistem menampilkan peringatan visual ramah dan membuka editor teks konfirmasi agar pengguna dapat memverifikasi atau mengoreksi teks sebelum analisis pemecahan kata dieksekusi.

---

### 1. Overview & Core Concept

- **Tujuan Utama**: Membantu pembelajar bahasa Jepang memahami *mengapa* suatu kalimat tersusun demikian, bukan sekadar melihat terjemahan mentah Google Translate.
- **Fitur Unggulan**:
  1. **Dual Input (Foto & Teks Langsung)**: Unggah foto dokumen, manga, buku bacaan, papan nama, atau tangkapan layar, dengan preview interaktif. Terdapat juga mode ketik/tempel teks langsung.
  2. **Pendeteksi Kejernihan Gambar**: Penilaian otomatis apakah foto jelas atau buram. Memberikan peringatan khusus jika pencahayaan buruk atau resolusi tidak memadai, disertai editor teks hasil bacaan.
  3. **Kotak Dekonstruksi Kata (Token Inspector)**:
     - Teks kanji dengan Furigana (hiragana di atas kanji) dan Romaji.
     - Terjemahan kontekstual spesifik dalam Bahasa Indonesia.
     - Bentuk dasar kamus (*dictionary form*) serta bentuk infleksi dalam teks (*masu-form, te-form, past tense, passive/causative*).
     - **Alasan Relasi Gramatikal**: Penjelasan mendalam mengapa kata tersebut terhubung dengan kata/partikel sebelum dan sesudahnya (misal: partikel を menandai objek transitif, bentuk 〜ている menyatakan kondisi yang sedang berlangsung).
     - **Alternatif Kata**: Sinonim, padanan kasual vs formal/keigo, dan variasi nuansa.
     - **Contoh Penerapan Nyata**: 1 contoh kemunculan dalam teks input + 2 contoh kalimat kehidupan sehari-hari lengkap dengan kanji, furigana, romaji, dan terjemahan Indonesia.
     - **Audio Pelafalan**: Tombol dengarkan audio menggunakan Web Speech API bahasa Jepang.
  4. **Daftar Kosakata Pribadi (Personal Vocab Deck)**:
     - Tombol 1-klik untuk menyimpan kata dari hasil analisis ke daftar belajar.
     - Pengelompokan cerdas per level JLPT (N5, N4, N3, N2, N1) dan Kategori Tata Bahasa / Partikel.
     - Mode kartu review interaktif untuk mengingat kembali kata yang disimpan.
     - Fitur ekspor/backup ke JSON/CSV dan tombol hapus/tandai hafal.

---

### 2. User Experience & Visual Design

- **Arah Visual & Mood**:
  - Terinspirasi dari estetika kertas *Washi* dan tinta *Sumi* modern: latar belakang netral bersih lembut (`#FBF9F5` / dark `#14171A`), aksen merah kuil Torii (`#D32F2F`) dan biru navy indigo (`#1E3A8A`).
  - Tipografi rapi dengan dukungan tulisan kanji yang terbaca nyaman (`Noto Sans JP` / `Plus Jakarta Sans`).
  - Mengikuti *Zero-Pill Discipline* dan *Universal Frontend Design Constitution*: metadata disajikan dengan pembatas tipografis elegan (`·`), tidak ada badge bertumpuk sembarangan.
- **Alur Pengguna (User Flow)**:
  1. *Halaman Utama*: Pengguna memilih tab input "Unggah Foto" (drag & drop / kamera) atau "Ketik / Tempel Teks Jepang". Tersedia juga tombol contoh teks (teks sederhana N5 s/d teks percakapan natural).
  2. *Proses & Validasi Kejernihan*:
     - Jika foto diunggah, server memproses OCR dan memeriksa keterbacaan teks.
     - Jika foto buram/kurang tajam, kartu peringatan muncul berwarna oranye dengan transkrip hasil tebakan yang dapat langsung disunting pengguna, lalu klik "Lanjutkan Analisis".
     - Jika foto jelas, langsung berpindah ke tampilan analisis.
  3. *Tampilan Dekonstruksi*:
     - Teks utuh ditampilkan dengan furigana interaktif di bagian atas.
     - Setiap kata dapat diklik secara interaktif.
     - Panel rincian kata menampilkan terjemahan, kelas kata, level JLPT, relasi partikel terdekat, sinonim/alternatif, dan contoh kalimat.
     - Pengguna dapat mengeklik ikon bintang "Simpan ke Kosakata".
  4. *Tab Kosakata Tersimpan*:
     - Tab terpisah untuk melihat seluruh perbendaharaan kata yang telah disimpan.
     - Filter berdasarkan level JLPT (Semua, N5, N4, N3, N2, N1) dan Kategori Partikel/Grammar.
     - Mode kuis flashcard cepat untuk menguji ingatan makna dan cara baca.

---

### 3. Key Product Decisions & Trade-Offs

- **Server-Side Gemini Integration**:
  - *Keputusan*: Menggunakan server backend Express terintegrasi dengan SDK resmi `@google/genai` (menggunakan model `gemini-3.8-flash` yang cepat, multimodal, dan akurat untuk analisis bahasa Jepang).
  - *Alasan*: Menjamin keamanan kunci API (`process.env.GEMINI_API_KEY`) dan memanfaatkan fitur `responseSchema` bertipe JSON terstruktur untuk menjamin keakuratan format output token, partikel, dan contoh kalimat.
- **Penyimpanan Kosakata Lokal (Client-side localStorage)**:
  - *Keputusan*: Menggunakan `localStorage` terstruktur dengan dukungan ekspor/impor JSON.
  - *Alasan*: Akses instan tanpa perlu registrasi login, berfungsi offline untuk belajar kapan saja, dan data tersimpan aman di browser pengguna.
- **Pemeriksaan Kejernihan Foto Dua Tahap**:
  - *Keputusan*: Saat menganalisis foto, Gemini mengevaluasi `imageClarityScore` (1-100), `isLegible` (boolean), dan `clarityIssues` (misal: "Teks miring atau buram pada baris kedua"). Jika `isLegible` false atau skor < 70, pengguna diberi kesempatan meninjau teks yang diekstrak sebelum analisis kata diproses.

---

### 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                        Frontend (React 19)                   │
├──────────────────────────────┬───────────────────────────────┤
│  Input Hub                   │  Analysis Workspace           │
│  - Foto Dropzone / Kamera    │  - Full Sentence & Furigana   │
│  - Image Clarity Modal       │  - Interactive Word Tokens    │
│  - Direct Textarea Input     │  - Detailed Token Drawer      │
├──────────────────────────────┴───────────────────────────────┤
│  Personal Vocab Notebook (localStorage)                      │
│  - JLPT Filter Tabs (N5..N1) · Particle & Grammar Filter     │
│  - Flashcard Review Mode · Audio TTS Player · JSON Export    │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTP POST (multipart/json)
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    Express Backend Server                    │
│  /api/analyze-image (Multipart/Base64 Image + Gemini Vision) │
│  /api/analyze-text  (Japanese Text + Structured JSON Parser) │
│  /api/health                                                 │
├──────────────────────────────────────────────────────────────┤
│  Google GenAI SDK (gemini-3.8-flash)                         │
│  - Multi-part prompt with system instructions                │
│  - Strict JSON schema for Japanese linguistic tokenization   │
└──────────────────────────────────────────────────────────────┘
```

#### Rencana File & Implementasi:
- `server.ts`: Server Express yang meng-host API `/api/analyze-text` dan `/api/analyze-image` menggunakan Google GenAI SDK `gemini-3.8-flash`.
- `src/types/japanese.ts`: Definisi antarmuka TypeScript untuk token, partikel, contoh kalimat, dan kosakata tersimpan.
- `src/services/api.ts`: Helper request client-side untuk memanggil backend.
- `src/services/storage.ts`: Pengelolaan penyimpanan lokal kosakata, riwayat analisis, dan utilitas ekspor/impor.
- `src/components/Navbar.tsx`: Top bar satu baris dengan navigasi tab dan status ringkas.
- `src/components/InputPanel.tsx`: Area unggah foto dengan drag-and-drop, pratinjau gambar, input teks langsung, dan template contoh teks Jepang.
- `src/components/ClarityWarningModal.tsx`: Dialog penanganan gambar buram dengan editor teks hasil pembacaan OCR.
- `src/components/SentenceBreakdown.tsx`: Tampilan pemecahan teks dengan furigana, token interaktif, dan visualisasi relasi partikel.
- `src/components/WordDetailCard.tsx`: Kartu inspeksi kata lengkap (makna, bentuk kamus, alasan relasi, alternatif, contoh nyata, audio).
- `src/components/VocabNotebook.tsx`: Panel kosakata pribadi dengan filter level JLPT, filter partikel/grammar, flashcard review, dan ekspor.
