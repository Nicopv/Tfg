import React, { useState } from 'react';
import {
  Volume2,
  Calendar,
  MapPin,
  Shield,
  Layers,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Flame,
  Radio,
  Table,
} from 'lucide-react';
import { INCIDENT_CASES, FUNCTIONAL_ZONES } from '../data/thesisContent';
import { IncidentCase } from '../types';
import { ComparativeMatrixView } from './ComparativeMatrixView';

interface IncidentCaseViewProps {
  initialCaseId?: string | null;
  onPlayCaseSpeech: (caseItem: IncidentCase) => void;
  isPlaying: boolean;
  isLoading: boolean;
  activeCaseId: string | null;
}

export const IncidentCaseView: React.FC<IncidentCaseViewProps> = ({
  initialCaseId,
  onPlayCaseSpeech,
  isPlaying,
  isLoading,
  activeCaseId,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    initialCaseId || INCIDENT_CASES[0].id
  );
  const [activeStep, setActiveStep] = useState<number>(0);
  const [subView, setSubView] = useState<'case' | 'matrix'>('case');

  const currentCase =
    INCIDENT_CASES.find((c) => c.id === selectedCaseId) || INCIDENT_CASES[0];

  const isCurrentAudioPlaying = activeCaseId === currentCase.id && isPlaying;
  const isCurrentAudioLoading = activeCaseId === currentCase.id && isLoading;

  return (
    <div className="space-y-6 pb-24">
      {/* Sub-view mode switcher */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cyan-700 text-white rounded-lg shadow-2xs">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Los 6 Casos Empíricos de Incidentes
            </h2>
            <p className="text-2xs text-slate-500">
              Reconstrucción cronológica de propagación y análisis matricial comparativo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setSubView('case')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              subView === 'case'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-700" />
            <span>Ficha del Incidente</span>
          </button>
          <button
            onClick={() => setSubView('matrix')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              subView === 'matrix'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-cyan-700" />
            <span>Matriz Comparativa</span>
          </button>
        </div>
      </div>

      {subView === 'matrix' ? (
        <ComparativeMatrixView
          onSelectCase={(caseId) => {
            setSelectedCaseId(caseId);
            setActiveStep(0);
            setSubView('case');
          }}
        />
      ) : (
        <>
          {/* Top Selector Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 text-cyan-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <Radio className="w-4 h-4" />
              <span>Diseño Comparativo: Los 6 Incidentes Empíricos Analizados</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {INCIDENT_CASES.map((c) => {
                const isSelected = c.id === currentCase.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCaseId(c.id);
                      setActiveStep(0);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-2xs font-mono opacity-70">{c.year}</span>
                      <span className="text-2xs font-medium opacity-80 truncate">{c.country}</span>
                    </div>
                    <h4 className="text-xs font-bold leading-snug line-clamp-1">{c.name}</h4>
                    <div className="mt-2">
                      <span
                        className="inline-block text-3xs font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wide truncate max-w-full text-white"
                        style={{ backgroundColor: c.configurationColor }}
                      >
                        {c.configurationLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

      {/* Selected Case Hero Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-md text-white font-mono"
                style={{ backgroundColor: currentCase.configurationColor }}
              >
                {currentCase.configurationLabel}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {currentCase.year}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {currentCase.country}
              </span>
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono">
                {currentCase.threatActorOrMalware}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {currentCase.name}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {currentCase.summary}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onPlayCaseSpeech(currentCase)}
              disabled={isCurrentAudioLoading}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-xs ${
                isCurrentAudioPlaying
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-cyan-700 hover:bg-cyan-800 text-white'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isCurrentAudioPlaying ? 'animate-pulse' : ''}`} />
              {isCurrentAudioLoading
                ? 'Sintetizando audio...'
                : isCurrentAudioPlaying
                ? 'Pausar Narración'
                : 'Escuchar Análisis del Caso'}
            </button>
          </div>
        </div>

        {/* Narrative Reconstruction */}
        <div className="my-6 p-4 sm:p-5 bg-slate-50 border-l-4 border-cyan-600 rounded-r-xl">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1 font-mono">
            Reconstrucción Sistémica de la Trayectoria
          </span>
          <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-serif italic">
            "{currentCase.narrativeText}"
          </p>
        </div>

        {/* Interactive Step-by-Step Propagation Timeline */}
        <div className="my-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Línea de Tiempo y Reconstrucción de la Propagación
              </h3>
              <p className="text-xs text-slate-500">
                Haz clic en cada fase para ver cómo el incidente salta entre zonas funcionales
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <span>Paso {activeStep + 1} de {currentCase.timeline.length}</span>
            </div>
          </div>

          {/* Timeline steps horizontal bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {currentCase.timeline.map((item, idx) => {
              const zone = FUNCTIONAL_ZONES.find((z) => z.id === item.zoneId);
              const isActive = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-cyan-500/30'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.step}
                    </span>
                    {item.dependencyInvolved && (
                      <span
                        className={`text-3xs uppercase font-mono px-1.5 py-0.5 rounded-sm ${
                          isActive
                            ? 'bg-slate-800 text-cyan-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Vía {item.dependencyInvolved}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold leading-tight mb-1">{item.phase}</h4>
                  <p
                    className={`text-2xs truncate ${
                      isActive ? 'text-cyan-300 font-medium' : 'text-slate-500'
                    }`}
                  >
                    Zona: {zone?.shortName || item.zoneId}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active step detail box */}
          {currentCase.timeline[activeStep] && (
            <div className="mt-4 p-4 bg-cyan-50/70 border border-cyan-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-600 text-white rounded-lg shrink-0 mt-0.5">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-900">
                      Paso {currentCase.timeline[activeStep].step}: {currentCase.timeline[activeStep].phase}
                    </span>
                    <span className="text-2xs px-2 py-0.5 bg-white text-cyan-800 border border-cyan-200 rounded-md font-mono">
                      Zona:{' '}
                      {FUNCTIONAL_ZONES.find((z) => z.id === currentCase.timeline[activeStep].zoneId)?.shortName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {currentCase.timeline[activeStep].description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-2.5 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  disabled={activeStep === currentCase.timeline.length - 1}
                  onClick={() =>
                    setActiveStep((prev) =>
                      Math.min(currentCase.timeline.length - 1, prev + 1)
                    )
                  }
                  className="px-2.5 py-1 text-xs rounded-md bg-cyan-700 text-white hover:bg-cyan-800 disabled:opacity-40 cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3-Column Analytical Breakdown: Factors, Consequences, Containment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-200">
          {/* Factores Estructurales */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-slate-600" />
              Factores Estructurales Moduladores
            </h4>
            <div className="space-y-2.5">
              {currentCase.structuralFactors.map((fac, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900">{fac.factor}</span>
                    <span
                      className={`text-3xs uppercase font-mono px-1.5 py-0.5 rounded-sm font-semibold ${
                        fac.effect === 'amplificador'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {fac.effect === 'amplificador' ? '▲ Amplificador' : '▼ Limitante'}
                    </span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-snug">{fac.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Consecuencias Asistenciales */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600" />
              Impacto Asistencial y Consecuencias
            </h4>
            <div className="space-y-2">
              {currentCase.consequences.map((cons, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-950 flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{cons}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medidas de Contención */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              Medidas de Contención Ejecutadas
            </h4>
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  {currentCase.containmentAction}
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-200/80 text-2xs text-emerald-800">
                <strong>Zonas protegidas/aisladas:</strong>{' '}
                {FUNCTIONAL_ZONES.filter((z) => !currentCase.zonesAffected.includes(z.id))
                  .map((z) => z.shortName)
                  .join(', ') || 'Todas las zonas sufrieron afectación parcial.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )}
</div>
);
};
