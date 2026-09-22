import React, { useState } from 'react';
import {
  ArrowRight,
  X,
  AlertCircle,
  Play,
  FileText,
} from 'lucide-react';
import {
  INCIDENT_CASES,
  FUNCTIONAL_ZONES,
} from '../data/thesisContent';
import { IncidentCase } from '../types';

interface ComparativeMatrixViewProps {
  onSelectCase?: (caseId: string) => void;
  onPlayCaseInGraph?: (caseId: string) => void;
}

type MatrixTab = 'tabla3' | 'tabla4';

export const ComparativeMatrixView: React.FC<ComparativeMatrixViewProps> = ({
  onSelectCase,
  onPlayCaseInGraph,
}) => {
  const [activeTab, setActiveTab] = useState<MatrixTab>('tabla3');
  const [inspectedCase, setInspectedCase] = useState<IncidentCase | null>(null);

  const filteredCases = INCIDENT_CASES;

  return (
    <div className="space-y-4 pb-20">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('tabla3')}
          className={`px-4 py-2 font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'tabla3'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Tabla 3: Análisis Técnico-Operativo</span>
        </button>

        <button
          onClick={() => setActiveTab('tabla4')}
          className={`px-4 py-2 font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'tabla4'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Tabla 4: Patrones e Impacto Asistencial</span>
        </button>
      </div>

      {/* TAB 1: TABLA 3 - ANÁLISIS TÉCNICO-OPERATIVO */}
      {activeTab === 'tabla3' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200">
            <span className="text-2xs font-extrabold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
              TABLA 3
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              Análisis Técnico-Operativo de Casos de Propagación de Ciberriesgo
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200 text-2xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 min-w-[180px]">Caso / Año / País</th>
                  <th className="py-3 px-4 min-w-[220px]">Vector de Entrada Inicial</th>
                  <th className="py-3 px-4 min-w-[220px]">Técnica de Movimiento Lateral</th>
                  <th className="py-3 px-4 min-w-[240px]">Trayectoria entre Zonas Funcionales</th>
                  <th className="py-3 px-4 min-w-[170px]">Cronología</th>
                  <th className="py-3 px-4 min-w-[160px]">Patrón de Propagación</th>
                  <th className="py-3 px-4 text-center min-w-[130px]">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 align-top">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: caseItem.configurationColor }}
                        />
                        <span className="font-bold text-slate-950">{caseItem.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-2xs text-slate-500 mt-1">
                        <span>{caseItem.year}</span>
                        <span>•</span>
                        <span>{caseItem.country}</span>
                      </div>
                      <span className="text-3xs text-slate-400 block mt-1 font-mono">
                        {caseItem.threatActorOrMalware}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top leading-relaxed text-slate-800">
                      <span className="font-medium">
                        {caseItem.vectorEntradaInicial || caseItem.initialPoint}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top leading-relaxed text-slate-700">
                      {caseItem.tecnicaMovimientoLateral}
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="flex flex-wrap items-center gap-1 mb-1.5">
                        {caseItem.zonesAffected.map((zId, i) => {
                          const zone = FUNCTIONAL_ZONES.find((z) => z.id === zId);
                          return (
                            <React.Fragment key={zId}>
                              <span
                                className="px-1.5 py-0.5 rounded text-3xs font-bold border"
                                style={{
                                  backgroundColor: `${zone?.color}15`,
                                  borderColor: `${zone?.color}40`,
                                  color: zone?.color,
                                }}
                              >
                                {zone?.shortName || zId}
                              </span>
                              {i < caseItem.zonesAffected.length - 1 && (
                                <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                      <p className="text-3xs text-slate-500 leading-snug">
                        {caseItem.trayectoriaZonasTexto}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 align-top text-2xs text-slate-700 leading-relaxed">
                      <div className="font-semibold text-slate-900">
                        {caseItem.cronologia}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <span
                        className="inline-block px-2 py-1 rounded-lg text-2xs font-bold border"
                        style={{
                          backgroundColor: `${caseItem.configurationColor}15`,
                          borderColor: `${caseItem.configurationColor}40`,
                          color: caseItem.configurationColor,
                        }}
                      >
                        {caseItem.patronPropagacion || caseItem.configurationLabel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top text-center">
                      <button
                        onClick={() => onPlayCaseInGraph?.(caseItem.id)}
                        className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-2xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                        title="Ver animación de propagación paso a paso en el grafo D3"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Reproducir</span>
                      </button>

                      <button
                        onClick={() => setInspectedCase(caseItem)}
                        className="mt-1.5 text-3xs text-slate-500 hover:text-slate-800 underline block w-full text-center cursor-pointer"
                      >
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TABLA 4 - ESQUEMA ANALÍTICO DE PATRONES E IMPACTO */}
      {activeTab === 'tabla4' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200">
            <span className="text-2xs font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              TABLA 4
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              Esquema Analítico de Patrones de Propagación e Impacto Asistencial
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200 text-2xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 min-w-[170px]">Caso / Año</th>
                  <th className="py-3 px-4 min-w-[180px]">Zona de Entrada</th>
                  <th className="py-3 px-4 min-w-[170px]">Patrón de Propagación</th>
                  <th className="py-3 px-4 min-w-[220px]">Zonas Funcionales Afectadas</th>
                  <th className="py-3 px-4 min-w-[280px]">Consecuencia Asistencial Directa</th>
                  <th className="py-3 px-4 text-center min-w-[120px]">Animación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-950 align-top">
                      <div>{caseItem.name}</div>
                      <span className="text-2xs font-normal text-slate-500">
                        {caseItem.year} • {caseItem.country}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <span className="font-semibold text-slate-800">
                        {caseItem.zonaEntrada || caseItem.initialZoneId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <span
                        className="inline-block px-2 py-1 rounded-lg text-2xs font-bold border"
                        style={{
                          backgroundColor: `${caseItem.configurationColor}15`,
                          borderColor: `${caseItem.configurationColor}40`,
                          color: caseItem.configurationColor,
                        }}
                      >
                        {caseItem.patronPropagacion || caseItem.configurationLabel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="flex flex-wrap gap-1">
                        {caseItem.zonesAffected.map((zId) => {
                          const zone = FUNCTIONAL_ZONES.find((z) => z.id === zId);
                          return (
                            <span
                              key={zId}
                              className="px-2 py-0.5 rounded text-3xs font-semibold border"
                              style={{
                                backgroundColor: `${zone?.color}15`,
                                borderColor: `${zone?.color}40`,
                                color: zone?.color,
                              }}
                            >
                              {zone?.shortName || zId}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top leading-relaxed">
                      <p className="font-bold text-rose-900 bg-rose-50/70 p-2 rounded-lg border border-rose-100">
                        {caseItem.consecuenciaAsistencialExacta || caseItem.consequences[0]}
                      </p>
                      <span className="text-3xs text-slate-400 block mt-1">
                        Fuente: {caseItem.fuenteCorpus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top text-center">
                      <button
                        onClick={() => onPlayCaseInGraph?.(caseItem.id)}
                        className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-2xs font-bold transition-all shadow-2xs cursor-pointer"
                        title="Reproducir propagación en el grafo D3"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Ver Grafo</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Case Details Modal */}
      {inspectedCase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: inspectedCase.configurationColor }}
                  />
                  <h3 className="text-lg font-bold text-slate-900">{inspectedCase.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {inspectedCase.organization} ({inspectedCase.year}) • {inspectedCase.country}
                </p>
              </div>
              <button
                onClick={() => setInspectedCase(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
                  Resumen Ejecutivo:
                </span>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {inspectedCase.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 block">
                    Vector Inicial:
                  </span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    {inspectedCase.vectorEntradaInicial || inspectedCase.initialPoint}
                  </p>
                </div>
                <div>
                  <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 block">
                    Cronología:
                  </span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    {inspectedCase.cronologia}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Consecuencia Asistencial Directa:
                </span>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-950">
                  {inspectedCase.consecuenciaAsistencialExacta || inspectedCase.consequences[0]}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setInspectedCase(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const id = inspectedCase.id;
                  setInspectedCase(null);
                  onPlayCaseInGraph?.(id);
                }}
                className="px-4 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Reproducir en Grafo D3</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
