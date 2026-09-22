/**
 * Audio helpers for academic vocal narration
 * Supports raw 24kHz 16-bit Linear PCM to standard WAV conversion and Web Audio API playback
 */

/**
 * Creates a standard 44-byte RIFF WAV header for 16-bit linear PCM audio
 */
export function pcm16ToWavBlob(
  pcmData: Uint8Array,
  sampleRate: number = 24000,
  numChannels: number = 1
): Blob {
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmData.byteLength;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // Helper to write ASCII strings
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF Chunk Descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // ChunkSize
  writeString(8, 'WAVE');

  // "fmt " sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample (16 bits)

  // "data" sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true); // Subchunk2Size

  // Copy raw PCM samples into WAV data block
  const pcmBytesView = new Uint8Array(buffer, 44, dataSize);
  pcmBytesView.set(pcmData);

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Converts a base64 string to an Audio URL (Blob URL)
 * Automatically detects whether it's already a WAV or raw PCM
 */
export function base64ToAudioUrl(base64String: string, sampleRate: number = 24000): string {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Check if it already has a RIFF header
  const isRiff =
    bytes.length >= 4 &&
    bytes[0] === 0x52 && // R
    bytes[1] === 0x49 && // I
    bytes[2] === 0x46 && // F
    bytes[3] === 0x46; // F

  if (isRiff) {
    const blob = new Blob([bytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  // Otherwise, it's raw PCM audio (24kHz 16-bit mono)
  const wavBlob = pcm16ToWavBlob(bytes, sampleRate, 1);
  return URL.createObjectURL(wavBlob);
}

/**
 * Fallback synthesizer using standard browser SpeechSynthesis
 * Used if server-side synthesis route is unavailable or encounters a network error
 */
export function speakWithBrowserFallback(
  text: string,
  onEnd?: () => void,
  onError?: (err: any) => void
): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onError?.(new Error('Speech synthesis not supported in this browser.'));
    return () => {};
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.95; // Clear academic presentation pace

  // Try to pick a natural Spanish voice if available
  const voices = window.speechSynthesis.getVoices();
  const esVoice =
    voices.find((v) => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
    voices.find((v) => v.lang.startsWith('es'));
  if (esVoice) {
    utterance.voice = esVoice;
  }

  utterance.onend = () => onEnd?.();
  utterance.onerror = (e) => onError?.(e);

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}
