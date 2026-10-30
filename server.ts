import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser with 25MB limit for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Google GenAI with telemetry User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    japaneseText: {
      type: Type.STRING,
      description: 'Kalimat atau paragraf teks bahasa Jepang lengkap yang dianalisis.',
    },
    overallTranslation: {
      type: Type.STRING,
      description: 'Terjemahan utuh kalimat dalam Bahasa Indonesia yang alami.',
    },
    overallReading: {
      type: Type.STRING,
      description: 'Cara baca seluruh kalimat dalam Hiragana/Katakana.',
    },
    nuanceExplanation: {
      type: Type.STRING,
      description: 'Penjelasan konteks, nuansa emosi, atau situasi penggunaan kalimat dalam Bahasa Indonesia.',
    },
    formalityLevel: {
      type: Type.STRING,
      description: 'Tingkat formalitas (misal: Kasual/Biasa, Sopan/Desu-Masu, Sangat Sopan/Keigo, Kaku/Tertulis).',
    },
    tokens: {
      type: Type.ARRAY,
      description: 'Daftar pemecahan setiap kata dan partikel secara berurutan dalam teks.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          word: {
            type: Type.STRING,
            description: 'Bentuk kata persis seperti yang tertulis dalam teks.',
          },
          dictionaryForm: {
            type: Type.STRING,
            description: 'Bentuk dasar/kamus (Jisho-kei) untuk verba/adjektiva/nomina.',
          },
          reading: {
            type: Type.STRING,
            description: 'Cara baca kata dalam Hiragana atau Katakana (furigana).',
          },
          romaji: {
            type: Type.STRING,
            description: 'Transkripsi romaji huruf latin yang jelas.',
          },
          partOfSpeech: {
            type: Type.STRING,
            description: 'Kelas kata dalam Bahasa Indonesia (Nomina, Verba Transitif Gol. 1, Partikel Kasus, Partikel Topik, Adjektiva-i, Konjungsi, dll.).',
          },
          jlptLevel: {
            type: Type.STRING,
            description: 'Estimasi level JLPT kata ini: N5, N4, N3, N2, N1, atau Non-JLPT.',
          },
          translationId: {
            type: Type.STRING,
            description: 'Arti/terjemahan spesifik kata ini dalam konteks kalimat tersebut dalam Bahasa Indonesia.',
          },
          grammarConnection: {
            type: Type.OBJECT,
            properties: {
              targetNeighbor: {
                type: Type.STRING,
                description: 'Kata atau partikel terdekat yang saling terhubung langsung (misal: partikel を, kata kerja berikutnya, atau objek sebelum partikel).',
              },
              reason: {
                type: Type.STRING,
                description: 'Alasan mendalam mengapa kata ini dipasangkan/dihubungkan dengan kata terdekatnya dalam Bahasa Indonesia (misal: Partikel を berfungsi menandai nomina sebelumnya sebagai objek langsung dari kata kerja transitif berikutnya; atau verba bentuk te-form disambung dengan iru untuk menyatakan aksi sedang berlangsung).',
              },
            },
            required: ['targetNeighbor', 'reason'],
          },
          alternatives: {
            type: Type.ARRAY,
            description: 'Alternatif sinonim, variasi formal/kasual, atau padanan kata lain yang relevan.',
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                reading: { type: Type.STRING },
                nuance: {
                  type: Type.STRING,
                  description: 'Perbedaan nuansa makna atau konteks dibanding kata asli dalam Bahasa Indonesia.',
                },
              },
              required: ['word', 'reading', 'nuance'],
            },
          },
          examples: {
            type: Type.OBJECT,
            description: 'Contoh penerapan kata ini.',
            properties: {
              sourceContext: {
                type: Type.STRING,
                description: 'Bagaimana kata ini berperan secara spesifik dalam kalimat input pengguna.',
              },
              realWorldSentence: {
                type: Type.STRING,
                description: 'Contoh kalimat bahasa Jepang lain dalam percakapan atau tulisan nyata sehari-hari.',
              },
              realWorldReading: {
                type: Type.STRING,
                description: 'Cara baca kalimat nyata tersebut dalam Hiragana.',
              },
              realWorldTranslation: {
                type: Type.STRING,
                description: 'Terjemahan kalimat nyata tersebut dalam Bahasa Indonesia.',
              },
            },
            required: ['sourceContext', 'realWorldSentence', 'realWorldReading', 'realWorldTranslation'],
          },
        },
        required: [
          'id',
          'word',
          'dictionaryForm',
          'reading',
          'romaji',
          'partOfSpeech',
          'jlptLevel',
          'translationId',
          'grammarConnection',
          'alternatives',
          'examples',
        ],
      },
    },
  },
  required: [
    'japaneseText',
    'overallTranslation',
    'overallReading',
    'nuanceExplanation',
    'formalityLevel',
    'tokens',
  ],
};

const SYSTEM_INSTRUCTION_TEXT = `Anda adalah pakar linguistik bahasa Jepang dan guru bahasa Jepang profesional untuk penutur Bahasa Indonesia.
Tugas Anda adalah:
1. Menerima teks bahasa Jepang (bisa berupa sepenggal kalimat, kalimat panjang, maupun paragraf singkat).
2. Membedah setiap kata dan partikel satu per satu secara runut dan detail (dekonstruksi morfologis).
3. Untuk setiap kata/partikel:
   - Terjemahkan artinya ke dalam Bahasa Indonesia sesuai konteks teks tersebut.
   - Jelaskan bentuk kamus (dictionary form) dan kelas kata.
   - Jelaskan dengan sangat jelas ALASAN MENGAPA kata tersebut dipasangkan atau dihubungkan dengan kata lain di dekatnya (misal: aturan partikel, konjugasi verba/adjektiva, kolokasi frasa, pola tata bahasa).
   - Berikan 1-3 alternatif kata (sinonim formal, kasual, atau padanan lain dengan keterangan nuansanya).
   - Berikan contoh penerapan dalam teks input tersebut dan kalimat nyata di kehidupan sehari-hari (beserta cara baca dan terjemahan Indonesia).
Semua penjelasan makna, alasan tata bahasa, dan nuansa HARUS ditulis dalam Bahasa Indonesia yang edukatif, jelas, dan mudah dipahami.`;

// Endpoint: Analyze direct Japanese text
// Endpoint: Analyze direct Japanese text
app.post('/api/analyze-text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Teks bahasa Jepang tidak boleh kosong.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Analisis dan dekonstruksi teks bahasa Jepang berikut secara mendalam:\n\n${text.trim()}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_TEXT,
        responseMimeType: 'application/json',
        responseSchema: ANALYSIS_SCHEMA,
        temperature: 0.2,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error('Tidak ada respon dari model AI.');
    }

    const parsed = JSON.parse(outputText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing text:', error);
    return res.status(500).json({
      error: error?.message || 'Gagal menganalisis teks bahasa Jepang. Silakan coba lagi.',
    });
  }
});

// Endpoint: OCR & Image Clarity check + single-pass deep analysis
const COMBINED_IMAGE_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isLegible: {
      type: Type.BOOLEAN,
      description: 'True jika teks Jepang dalam foto terbaca tajam dan tidak buram. False jika foto buram, gelap, miring parah, atau karakter sulit dipastikan.',
    },
    clarityScore: {
      type: Type.INTEGER,
      description: 'Skor kejernihan dan keterbacaan teks 0 hingga 100 (100 = sangat tajam, <70 = buram/ragu).',
    },
    clarityWarning: {
      type: Type.STRING,
      description: 'Jika foto kurang jelas/buram, beri penjelasan ramah dalam Bahasa Indonesia mengapa foto kurang jelas. Jika jelas, string kosong.',
    },
    extractedText: {
      type: Type.STRING,
      description: 'Hasil pembacaan teks bahasa Jepang lengkap yang tertulis pada gambar.',
    },
    overallTranslation: {
      type: Type.STRING,
      description: 'Terjemahan utuh kalimat dalam Bahasa Indonesia yang alami.',
    },
    overallReading: {
      type: Type.STRING,
      description: 'Cara baca seluruh kalimat dalam Hiragana/Katakana.',
    },
    nuanceExplanation: {
      type: Type.STRING,
      description: 'Penjelasan nuansa, konteks emosi, atau situasi penggunaan kalimat dalam Bahasa Indonesia.',
    },
    formalityLevel: {
      type: Type.STRING,
      description: 'Tingkat formalitas (Kasual, Sopan, Keigo, dll.).',
    },
    tokens: ANALYSIS_SCHEMA.properties.tokens,
  },
  required: ['isLegible', 'clarityScore', 'clarityWarning', 'extractedText'],
};

app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', forceAnalyze = false } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Data gambar tidak ditemukan.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    // Single-pass: Gemini simultaneously evaluates image clarity, reads OCR text,
    // and prepares the deep linguistic breakdown in one fast query!
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: 'Periksa kejernihan foto teks bahasa Jepang ini. Baca teksnya (OCR) dan dekonstruksi kata-kata di dalamnya jika terbaca.',
          },
        ],
      },
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION_TEXT}
Instruksi Tambahan Pemeriksaan Gambar:
1. Evaluasi kejernihan gambar: jika fokus tajam dan terbaca jelas, set isLegible: true dan clarityScore >= 80.
2. Jika gambar buram, miring parah, atau gelap sehingga ada risiko salah baca kanji/kana, set isLegible: false, skor < 70, dan jelaskan kendalanya pada clarityWarning dalam Bahasa Indonesia.
3. Ekstrak teks bahasa Jepang selengkap dan seakurat mungkin ke extractedText.
4. Dekonstruksi setiap kata dan partikel ke dalam tokens (jika gambar jelas).`,
        responseMimeType: 'application/json',
        responseSchema: COMBINED_IMAGE_ANALYSIS_SCHEMA,
        temperature: 0.15,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const {
      isLegible,
      clarityScore = 80,
      clarityWarning = '',
      extractedText = '',
      overallTranslation = '',
      overallReading = '',
      nuanceExplanation = '',
      formalityLevel = 'Sopan',
      tokens = [],
    } = parsed;

    if (!extractedText || !extractedText.trim()) {
      return res.status(400).json({
        isLegible: false,
        clarityScore: clarityScore || 20,
        clarityWarning: 'Tidak ada teks bahasa Jepang yang terdeteksi dalam gambar ini. Mohon gunakan foto dengan tulisan bahasa Jepang yang tampak jelas.',
        extractedText: '',
      });
    }

    // If blurry and user hasn't explicitly forced analysis, pause and let user confirm/edit text
    if ((!isLegible || clarityScore < 70) && !forceAnalyze) {
      return res.json({
        isLegible: false,
        clarityScore: clarityScore || 50,
        clarityWarning:
          clarityWarning ||
          'Foto terdeteksi buram atau memiliki kontras rendah. Silakan periksa atau koreksi teks hasil bacaan di bawah ini sebelum melanjutkan analisis.',
        extractedText: extractedText.trim(),
      });
    }

    // Photo is clear (or forceAnalyze is true), provide instant complete breakdown!
    return res.json({
      isLegible: true,
      clarityScore: clarityScore || 90,
      clarityWarning: clarityWarning || '',
      extractedText: extractedText.trim(),
      analysis: {
        japaneseText: extractedText.trim(),
        overallTranslation: overallTranslation || 'Terjemahan berhasil diekstrak.',
        overallReading: overallReading || extractedText.trim(),
        nuanceExplanation: nuanceExplanation || 'Teks diekstrak langsung dari foto.',
        formalityLevel: formalityLevel || 'Standar',
        tokens: tokens && tokens.length > 0 ? tokens : [],
      },
    });
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({
      error: error?.message || 'Gagal memproses gambar teks bahasa Jepang. Silakan coba unggah foto yang lebih terang.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'KotobaMorph API', timestamp: Date.now() });
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KotobaMorph server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
