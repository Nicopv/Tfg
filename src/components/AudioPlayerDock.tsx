import React, { useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  Download,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { AVAILABLE_VOICES } from '../data/thesisContent';
import { AudioPlaybackState } from '../types';

interface AudioPlayerDockProps {
  state: AudioPlaybackState;
  onTogglePlay: () => void;
  onStop: () => void;
  onVoiceChange: (voice: string) => void;
  onRateChange: (rate: number) => void;
  onSeek: (progress: number) => void;
  audioElementRef: React.RefObject<HTMLAudioElement | null>;
}

export const AudioPlayerDock: React.FC<AudioPlayerDockProps> = ({
  state,
  onTogglePlay,
  onStop,
  onVoiceChange,
  onRateChange,
  onSeek,
  audioElementRef,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !state.duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * state.duration);
  };

  // Sync playback rate with audio element
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = state.playbackRate;
    }
  }, [state.playbackRate, audioElementRef]);

  // If there's no audio active or loading, display minimal status or prompt
  const hasAudioContent = Boolean(state.audioUrl || state.currentPlayingText || state.isLoading);

  if (!hasAudioContent) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-300 py-2.5 px-4 z-40 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">
              Locución académica lista para su reproducción.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Voz:</span>
              <select
                value={state.voice}
                onChange={(e) => onVoiceChange(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md px-2 py-1 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                {AVAILABLE_VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.gender}) - {v.tone.slice(0, 18)}...
                  </option>
                ))}
              </select>
            </div>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="text-slate-400 hidden sm:inline">
              Haz clic en "Escuchar Sección" o "Escuchar Defensa Oral" para iniciar.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 text-white shadow-2xl z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {state.error && (
          <div className="mb-2 p-2 bg-rose-950/80 border border-rose-800 rounded-md text-xs text-rose-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{state.error}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Audio Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-cyan-900/60 border border-cyan-700/50 rounded-lg text-cyan-300 shrink-0">
              {state.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 flex items-center gap-1">
                  <Volume2 className="w-2.5 h-2.5 text-cyan-400" />
                  Locución de la Tesis
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-100 truncate mt-0.5">
                {state.isLoading
                  ? 'Generando locución académica...'
                  : state.currentPlayingText || 'Audio de Defensa Oral'}
              </p>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onTogglePlay}
              disabled={state.isLoading}
              className="p-2.5 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white rounded-full transition-transform cursor-pointer disabled:opacity-50"
              title={state.isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {state.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : state.isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            <button
              onClick={onStop}
              className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full transition-colors cursor-pointer"
              title="Detener audio"
            >
              <Square className="w-4 h-4" />
            </button>

            {/* Time Indicator */}
            <div className="text-xs text-slate-400 font-mono hidden sm:block">
              <span>{formatTime(state.progress)}</span> /{' '}
              <span>{formatTime(state.duration)}</span>
            </div>
          </div>

          {/* Settings & Extras */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            {/* Voice Selector */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="voice-select" className="text-2xs text-slate-400 uppercase font-semibold hidden sm:inline">
                Voz:
              </label>
              <select
                id="voice-select"
                value={state.voice}
                onChange={(e) => onVoiceChange(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {AVAILABLE_VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.gender})
                  </option>
                ))}
              </select>
            </div>

            {/* Playback Speed */}
            <div className="flex items-center">
              {[1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => onRateChange(rate)}
                  className={`px-1.5 py-0.5 text-2xs rounded-md font-mono transition-colors cursor-pointer ${
                    state.playbackRate === rate
                      ? 'bg-cyan-700 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Download Audio */}
            {state.audioUrl && (
              <a
                href={state.audioUrl}
                download="defensa_tfg_riesgo_salud.wav"
                className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-md transition-colors"
                title="Descargar audio WAV (24kHz)"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Progress Scrubber */}
        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          className="mt-2.5 w-full bg-slate-800 hover:bg-slate-750 h-1.5 rounded-full cursor-pointer overflow-hidden transition-all group"
        >
          <div
            className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full transition-all duration-100 group-hover:h-2"
            style={{
              width: `${state.duration ? (state.progress / state.duration) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
