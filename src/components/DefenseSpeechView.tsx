import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  Quote,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { DEFENSE_SECTIONS, FUNCTIONAL_ZONES } from '../data/thesisContent';
import { DefenseSection } from '../types';

interface DefenseSpeechViewProps {
  onPlaySection: (section: DefenseSection) => void;
  activeSectionId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  onSelectZone: (zoneId: string) => void;
}

export const DefenseSpeechView: React.FC<DefenseSpeechViewProps> = ({
  onPlaySection,
  activeSectionId,
  isPlaying,
  isLoading,
  onSelectZone,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Introduction Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/60 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-cyan-700/60">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            Guión Estructurado y Locución de Defensa
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Guión Completo de la Defensa de Tesis
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Estructurado en 7 bloques secuenciales de exposición oral. Cada sección cuenta con su texto literal transcrito, notas de entonación académica, conceptos clave y reproducción sincronizada de locución académica.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-cyan-200">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-md border border-slate-700">
              <Quote className="w-3.5 h-3.5 text-cyan-400" />
              <span>7 Secciones Cronológicas</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-md border border-slate-700">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Enfoque Sistémico Cualitativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {DEFENSE_SECTIONS.map((section) => {
          const isCurrentActive = activeSectionId === section.id;
          const isCurrentlyPlaying = isCurrentActive && isPlaying;
          const isCurrentlyLoading = isCurrentActive && isLoading;
          const relatedZone = FUNCTIONAL_ZONES.find((z) => z.id === section.recommendedZoneId);

          return (
            <article
              key={section.id}
              className={`rounded-2xl transition-all duration-200 border ${
                isCurrentActive
                  ? 'bg-cyan-50/70 border-cyan-400 shadow-md ring-2 ring-cyan-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="p-5 sm:p-7">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        isCurrentActive
                          ? 'bg-cyan-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {section.number}
                    </span>
                    <div>
                      <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block font-mono">
                        {section.speakerCue}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                        {section.title}
                      </h3>
                    </div>
                  </div>

                  {/* Actions: Audio Button & Copy */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => handleCopy(section.id, section.fullSpeech)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Copiar texto de esta sección"
                    >
                      {copiedId === section.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => onPlaySection(section)}
                      disabled={isCurrentlyLoading}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs ${
                        isCurrentlyPlaying
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-cyan-700 hover:bg-cyan-800 text-white'
                      }`}
                    >
                      <Volume2 className={`w-4 h-4 ${isCurrentlyPlaying ? 'animate-pulse' : ''}`} />
                      {isCurrentlyLoading
                        ? 'Sintetizando...'
                        : isCurrentlyPlaying
                        ? 'Pausar Audio'
                        : 'Escuchar Sección'}
                    </button>
                  </div>
                </div>

                {/* Highlight Quote Banner */}
                <div className="my-4 p-3.5 bg-slate-50 border-l-4 border-cyan-600 rounded-r-xl">
                  <div className="flex items-start gap-2.5">
                    <Quote className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm italic font-medium text-slate-800">
                      "{section.highlightQuote}"
                    </p>
                  </div>
                </div>

                {/* Speech Transcript Body */}
                <div className="prose prose-slate max-w-none my-4">
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-serif">
                    {section.fullSpeech}
                  </p>
                </div>

                {/* Footer: Key Concepts & Zone Shortcut */}
                <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-2xs font-bold text-slate-400 uppercase mr-1">
                      Conceptos Clave:
                    </span>
                    {section.keyConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-2xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-cyan-600 shrink-0" />
                        {concept}
                      </span>
                    ))}
                  </div>

                  {relatedZone && (
                    <button
                      onClick={() => onSelectZone(relatedZone.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-800 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100 px-2.5 py-1.5 rounded-lg border border-cyan-200 transition-colors self-start md:self-auto cursor-pointer"
                    >
                      <span>Ver Zona: {relatedZone.shortName}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
