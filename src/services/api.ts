import { AnalysisResult, ImageClarityCheck } from '../types/japanese';

export async function analyzeJapaneseText(text: string): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function analyzeJapaneseImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  forceAnalyze: boolean = false
): Promise<ImageClarityCheck> {
  const response = await fetch('/api/analyze-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType, forceAnalyze }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  return response.json();
}
