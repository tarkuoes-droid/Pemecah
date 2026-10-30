import { PsychologicalQuestion, UserPsychologicalProfile, LearningArchetype } from '../types/psychology';

export const PSYCHOLOGICAL_QUESTIONS: PsychologicalQuestion[] = [
  {
    id: 'q_motivation',
    category: 'motivation',
    title: 'Dorongan Emosi & Sumber Gairah Belajar',
    question: 'Apa momen yang paling memicu rasa takjub atau semangat Anda saat membayangkan bisa bahasa Jepang?',
    psychologicalContext: 'Menentukan jenis bahan bakar intrinsik otak Anda agar tidak mudah padam di tengah jalan.',
    options: [
      {
        id: 'opt_contextual',
        text: 'Bisa langsung menikmati manga, anime, film, atau lagu tanpa terhalang subtitle.',
        subtext: 'Didorong oleh rasa terhubung emosional dengan karya dan percakapan nyata.',
        archetypePoints: { contextual_storyteller: 3, dopamine_sprinter: 1 },
      },
      {
        id: 'opt_structural',
        text: 'Memahami bagaimana partikel dan kanji bekerja seperti merakit puzzle teknik yang presisi.',
        subtext: 'Didorong oleh kepuasan intelektual membongkar logika tata bahasa yang rapi.',
        archetypePoints: { structural_architect: 3, mindful_scholar: 1 },
      },
      {
        id: 'opt_dopamine',
        text: 'Sensasi menaklukkan kata-kata baru, lulus level JLPT, dan melihat skor kemampuan melesat.',
        subtext: 'Didorong oleh rasa pencapaian terukur, target jelas, dan kemenangan mikro harian.',
        archetypePoints: { dopamine_sprinter: 3, contextual_storyteller: 1 },
      },
      {
        id: 'opt_mindful',
        text: 'Ketenangan menyelami keindahan bentuk kanji, filosofi budaya, dan nuansa ekspresi Jepang.',
        subtext: 'Didorong oleh ketertarikan mendalam pada estetika bahasa dan refleksi diri.',
        archetypePoints: { mindful_scholar: 3, structural_architect: 1 },
      },
    ],
  },
  {
    id: 'q_frustration',
    category: 'frustration_handling',
    title: 'Respon Kognitif Menghadapi Kalimat Sulit',
    question: 'Ketika Anda melihat kalimat panjang dengan banyak kanji rumit yang belum Anda kenal, apa reaksi pertama otak Anda?',
    psychologicalContext: 'Menentukan mekanisme regulasi stres kognitif dan zona toleransi kebingungan.',
    options: [
      {
        id: 'opt_frust_decompose',
        text: 'Saya ingin memecah kalimat itu jadi potongan-potongan kata dan mencari partikel penyambungnya.',
        subtext: 'Pola dekonstruktif: merasa tenang jika sistematis dipisah per komponen.',
        archetypePoints: { structural_architect: 3 },
      },
      {
        id: 'opt_frust_guess_context',
        text: 'Saya menebak artinya dari kata kunci yang familiar dan membayangkan konteks adegannya.',
        subtext: 'Pola holistik: mencari gambaran besar cerita sebelum peduli detail teknis.',
        archetypePoints: { contextual_storyteller: 3 },
      },
      {
        id: 'opt_frust_quick_solution',
        text: 'Saya ingin langsung melihat arti terjemahannya sekarang juga agar tidak buang-buang waktu.',
        subtext: 'Pola efisiensi: frustrasi jika proses terlalu lambat atau tersendat.',
        archetypePoints: { dopamine_sprinter: 3 },
      },
      {
        id: 'opt_frust_contemplate',
        text: 'Saya mengamati satu per satu kanjinya tanpa panik, menerima bahwa proses belajar butuh waktu.',
        subtext: 'Pola reflektif: memiliki daya tahan mental tinggi terhadap ketidakpastian.',
        archetypePoints: { mindful_scholar: 3 },
      },
    ],
  },
  {
    id: 'q_dopamine',
    category: 'dopamine_trigger',
    title: 'Saklar Dopamin (Sensasi "AHA!" di Otak)',
    question: 'Sensasi kepuasan mana yang paling membuat Anda tersenyum dan ingin terus lanjut belajar?',
    psychologicalContext: 'Menemukan tombol reward alami otak agar proses belajar terasa adiktif secara positif.',
    options: [
      {
        id: 'opt_dop_logic',
        text: 'Mengetahui ALASAN mengapa suatu partikel (seperti を, が, atau に) dipakai di posisi tersebut.',
        subtext: 'Dopamin logika: rasa puas saat semua potongan puzzle tata bahasa terkunci pas.',
        archetypePoints: { structural_architect: 3, mindful_scholar: 1 },
      },
      {
        id: 'opt_dop_realworld',
        text: 'Ketika kata yang baru saja didekonstruksi ternyata muncul di adegan manga atau papan nama asli!',
        subtext: 'Dopamin penemuan: sensasi dunia nyata tiba-tiba bisa Anda baca sendiri.',
        archetypePoints: { contextual_storyteller: 3, dopamine_sprinter: 1 },
      },
      {
        id: 'opt_dop_streak',
        text: 'Melihat streak hari belajar bertambah dan berhasil mengingat kartu flashcard tanpa salah.',
        subtext: 'Dopamin kompetisi mandiri: gairah mempertahankan rekor pribadi.',
        archetypePoints: { dopamine_sprinter: 3 },
      },
      {
        id: 'opt_dop_nuance',
        text: 'Menemukan perbedaan nuansa halus antara dua kata sinonim (misal: kapan pakai 食べる vs いただく).',
        subtext: 'Dopamin apresiasi estetika: ketakjuban pada kesopanan dan kedalaman budaya.',
        archetypePoints: { mindful_scholar: 3, structural_architect: 1 },
      },
    ],
  },
  {
    id: 'q_rhythm',
    category: 'daily_rhythm',
    title: 'Ritme & Manajemen Beban Mental',
    question: 'Berapa ritme belajar yang paling membuat Anda merasa ringan dan tidak terbebani rasa bersalah?',
    psychologicalContext: 'Mencegah burnout dengan memangkas friksi mental awal (Action Inertia).',
    options: [
      {
        id: 'opt_rhythm_sprint',
        text: 'Bite-sized (3–7 menit): 1 kalimat didekonstruksi tuntas per hari, yang penting konsisten.',
        subtext: 'Strategi kebiasaan mikro (Tiny Habits) yang mustahil untuk ditolak otak.',
        archetypePoints: { dopamine_sprinter: 3, contextual_storyteller: 1 },
      },
      {
        id: 'opt_rhythm_deep',
        text: 'Deep Session (15–25 menit): Membedah 1 paragraf utuh hingga paham relasi antar kalimat.',
        subtext: 'Pemberian waktu fokus terstruktur dengan hasil pemahaman tuntas.',
        archetypePoints: { structural_architect: 3 },
      },
      {
        id: 'opt_rhythm_flow',
        text: 'Fleksibel berbasis rasa penasaran: hanya belajar saat menemukan teks menarik dari foto/buku.',
        subtext: 'Belajar organik tanpa jadwal kaku, mengandalkan momentum alami.',
        archetypePoints: { contextual_storyteller: 3, mindful_scholar: 1 },
      },
      {
        id: 'opt_rhythm_calm',
        text: 'Ritual tenang (10 menit sebelum tidur atau pagi hari) untuk mengendapkan kanji ke ingatan.',
        subtext: 'Belajar sebagai sarana rileks dan menenangkan pikiran dari kesibukan.',
        archetypePoints: { mindful_scholar: 3 },
      },
    ],
  },
  {
    id: 'q_mental_blindspot',
    category: 'cognition',
    title: 'Pencegah Titik Jenuh (Burnout Shield)',
    question: 'Apa situasi yang biasanya membuat Anda paling cepat bosan atau merasa ingin berhenti belajar?',
    psychologicalContext: 'Mengidentifikasi jebakan mental agar sistem bisa memberikan tameng psikologis tepat waktu.',
    options: [
      {
        id: 'opt_burn_random',
        text: 'Dipaksa menghafal daftar kata panjang tanpa tahu kalimat dan struktur penggunaannya.',
        subtext: 'Solusi: Wajib selalu menyertakan fungsi partikel dan relasi kalimat nyata.',
        archetypePoints: { structural_architect: 3 },
      },
      {
        id: 'opt_burn_textbook',
        text: 'Kalimat contoh buku teks yang kaku dan tidak pernah digunakan orang Jepang asli di era sekarang.',
        subtext: 'Solusi: Gunakan foto teks asli dari manga, media sosial, atau papan jalan.',
        archetypePoints: { contextual_storyteller: 3 },
      },
      {
        id: 'opt_burn_slow',
        text: 'Merasa tidak ada kemajuan nyata setelah menghabiskan waktu lama membuka buku.',
        subtext: 'Solusi: Rayakan setiap kata yang tersimpan dengan penanda kemajuan instan.',
        archetypePoints: { dopamine_sprinter: 3 },
      },
      {
        id: 'opt_burn_pressure',
        text: 'Terlalu banyak tekanan target hafalan dan rasa cemas lupa kanji yang sudah dihafal.',
        subtext: 'Solusi: Normalisasikan bahwa lupa adalah bagian alami penguatan sinapsis otak.',
        archetypePoints: { mindful_scholar: 3 },
      },
    ],
  },
];

export function generatePsychologicalProfile(
  answers: Record<string, string>
): UserPsychologicalProfile {
  const scores: Record<LearningArchetype, number> = {
    structural_architect: 0,
    contextual_storyteller: 0,
    dopamine_sprinter: 0,
    mindful_scholar: 0,
  };

  // Tally points based on selected option IDs
  PSYCHOLOGICAL_QUESTIONS.forEach((q) => {
    const selectedOptionId = answers[q.id];
    const option = q.options.find((opt) => opt.id === selectedOptionId);
    if (option) {
      Object.entries(option.archetypePoints).forEach(([arch, points]) => {
        if (points && arch in scores) {
          scores[arch as LearningArchetype] += points;
        }
      });
    }
  });

  // Find archetype with highest points
  let topArchetype: LearningArchetype = 'structural_architect';
  let maxScore = -1;

  for (const arch of Object.keys(scores) as LearningArchetype[]) {
    if (scores[arch] > maxScore) {
      maxScore = scores[arch];
      topArchetype = arch;
    }
  }

  switch (topArchetype) {
    case 'structural_architect':
      return {
        archetype: 'structural_architect',
        archetypeName: 'Sang Arsitek Struktur (構造の建築家)',
        archetypeTagline: 'Logis, Presisi, dan Membedah Bahasa Seperti Kode Pemrograman',
        description:
          'Otak Anda dirancang untuk menyukai keteraturan sistemik. Anda paling cepat menyerap bahasa Jepang bukan dengan menghafal buta, melainkan dengan memahami MENGAPA partikel itu berdiri di sana dan bagaimana konjugasi verba diturunkan.',
        strengths: [
          'Sangat kuat memahami pola partikel rumit (は vs が, に vs で, を vs に).',
          'Cepat menguasai logika bentuk kamus (jisho-kei) dan perubahan infleksi verba.',
          'Tidak mudah bingung oleh susunan kalimat terbalik dalam bahasa Jepang (SOV).',
        ],
        mentalBlindspots: [
          'Sering terjebak *overthinking* mencari aturan mutlak pada bahasa percakapan kasual yang santai.',
          'Kadang ragu berbicara karena takut struktur kalimatnya belum 100% sempurna.',
        ],
        personalizedLearningPath: {
          recommendedDailyGoal: 'Dekonstruksi 1 kalimat kompleks per hari & telaah diagram partikelnya.',
          recommendedInputMode: 'text',
          focusGrammarStrategy: 'Fokus pada kelas kata, fungsi partikel kasus, dan derivasi bentuk kamus.',
          mentalHook: 'Perlakukan setiap kalimat sebagai teka-teki logika yang elegan, bukan hafalan hafalan mati.',
        },
        encouragementStyle:
          'Logika gramatikalmu tajam! Kamu berhasil membongkar relasi partikel dan struktur kalimat ini dengan sempurna.',
        answeredAt: Date.now(),
      };

    case 'contextual_storyteller':
      return {
        archetype: 'contextual_storyteller',
        archetypeName: 'Sang Penjelajah Konteks (文脈の探検家)',
        archetypeTagline: 'Visual, Emosional, dan Menyerap Bahasa dari Kehidupan Nyata',
        description:
          'Otak Anda belajar melalui imajinasi dan cerita. Kata-kata bahasa Jepang baru akan menancap kuat jika Anda melihatnya langsung di adegan manga, foto papan jalan, dialog karakter favorit, atau situasi kehidupan nyata.',
        strengths: [
          'Memiliki intuisi nuansa kata yang sangat kuat (kapan terdengar kasual, emosional, atau puitis).',
          'Sangat menikmati proses dekonstruksi foto teks nyata dibanding buku teks biasa.',
          'Mudah mengingat kosakata jika dikaitkan dengan adegan cerita atau ekspresi ekspresif.',
        ],
        mentalBlindspots: [
          'Mudah bosan jika disuruh menghafal tabel konjugasi yang kaku tanpa ada konteks cerita.',
          'Kadang mengabaikan partikel kecil karena merasa maknanya sudah bisa ditebak dari kata benda.',
        ],
        personalizedLearningPath: {
          recommendedDailyGoal: 'Foto 1 teks nyata (manga, poster, kemasan Jepang) lalu bongkar artinya.',
          recommendedInputMode: 'photo',
          focusGrammarStrategy: 'Fokus pada nuansa alternatif kata, situasi percakapan, dan contoh kalimat nyata.',
          mentalHook: 'Setiap kalimat adalah jendela intip ke dalam cara berpikir dan budaya orang Jepang.',
        },
        encouragementStyle:
          'Luar biasa! Kamu baru saja menguraikan kalimat yang hidup dan penuh nuansa nyata. Bahasa Jepangmu semakin hidup!',
        answeredAt: Date.now(),
      };

    case 'dopamine_sprinter':
      return {
        archetype: 'dopamine_sprinter',
        archetypeName: 'Sang Pemburu Kemenangan Mikro (連勝のスプリンター)',
        archetypeTagline: 'Cepat, Berorientasi Hasil, dan Berenergi Tinggi Lewat Streak Harian',
        description:
          'Otak Anda sangat responsif terhadap sistem reward cepat dan kemajuan yang kasat mata. Kunci agar Anda ketagihan belajar adalah memangkas target besar menjadi kemenangan mikro 3–5 menit yang memberi kepuasan instan.',
        strengths: [
          'Sangat disiplin jika memiliki target harian yang jelas dan ringkas.',
          'Menikmati mode latihan kuis flashcard kilat dan melihat koleksi kosakata terus bertambah.',
          'Memiliki momentum belajar yang tinggi saat sedang dalam kondisi beruntun (streak on fire).',
        ],
        mentalBlindspots: [
          'Rentan merasa hancur atau menyerah total jika suatu hari streak belajarnya sempat terputus.',
          'Cenderung terburu-buru ingin cepat tamat sehingga melewatkan detail pemahaman partikel yang halus.',
        ],
        personalizedLearningPath: {
          recommendedDailyGoal: '1 Dekonstruksi kilat (3 menit) + 5 kartu kuis flashcard kosakata.',
          recommendedInputMode: 'text',
          focusGrammarStrategy: 'Prioritaskan level JLPT kata (N5 -> N4 -> N3) dan simpan kata kunci ke buku.',
          mentalHook: 'Fokus pada 1 kemenangan kecil hari ini. 3 menit konsisten mengalahkan 3 jam sekali sebulan.',
        },
        encouragementStyle:
          'Streak bertambah! Kemenangan mikro hari ini sukses kamu amankan. Dopamin belajar terisi penuh!',
        answeredAt: Date.now(),
      };

    case 'mindful_scholar':
    default:
      return {
        archetype: 'mindful_scholar',
        archetypeName: 'Sang Penikmat Reflektif (静寂の学者)',
        archetypeTagline: 'Tenang, Mendalam, dan Meresapi Estetika Bahasa Tanpa Cemas',
        description:
          'Bagi Anda, belajar bahasa Jepang adalah sarana meditasi dan penemuan keindahan. Anda tidak suka terburu-buru oleh target ujian yang memicu stres. Anda menikmati mengamati kanji, meresapi keanggunan tata bahasa, dan mendengarkan pelafalan suaranya.',
        strengths: [
          'Ketahanan mental jangka panjang yang sangat stabil karena tidak belajar di bawah tekanan panik.',
          'Apresiasi tinggi terhadap keindahan karakter kanji dan perbedaan tingkat kesopanan (keigo).',
          'Suka mendengarkan audio pelafalan secara berulang hingga terdengar alami di telinga.',
        ],
        mentalBlindspots: [
          'Kadang terlalu nyaman mengagumi satu kata sehingga kecepatan eksplorasi kalimat baru menjadi lambat.',
          'Ragu untuk mulai jika suasana hati atau lingkungan sedang bising dan terburu-buru.',
        ],
        personalizedLearningPath: {
          recommendedDailyGoal: '1 Dekonstruksi santai + dengarkan audio pelafalannya 3 kali dengan tenang.',
          recommendedInputMode: 'photo',
          focusGrammarStrategy: 'Fokus pada asal-usul kanji, audio pelafalan, dan nuansa kehalusan kata.',
          mentalHook: 'Belajar bukan perlombaan cepat-cepatan. Setiap kanji yang kamu resapi adalah ketenangan jiwa.',
        },
        encouragementStyle:
          'Bagus sekali. Kamu telah meresapi setiap kata dengan tenang dan mendalam. Bahasa Jepang kini meresap ke memorimu.',
        answeredAt: Date.now(),
      };
  }
}
