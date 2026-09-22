import React, { useState } from 'react';
import {
  Server,
  ClipboardList,
  ScanLine,
  FlaskConical,
  Activity,
  Globe,
  X,
  AlertTriangle,
} from 'lucide-react';
import { FUNCTIONAL_ZONES, DEPENDENCIES } from '../data/thesisContent';
import { D3DependencyGraph, DEPENDENCY_METAS } from './D3DependencyGraph';
import { DependencyType } from '../types';

const ZONE_ICONS: Record<string, React.ElementType> = {
  Server,
  ClipboardList,
  ScanLine,
  FlaskConical,
  Activity,
  Globe,
};

interface D3GraphViewProps {
  initialZoneId?: string | null;
  initialSimulationCaseId?: string | null;
  onInspectCase?: (caseId: string) => void;
  onGoToMatrix?: (caseId?: string) => void;
  onSimulationCaseChange?: (caseId: string | null) => void;
}

export const D3GraphView: React.FC<D3GraphViewProps> = ({
  initialZoneId,
  initialSimulationCaseId = null,
  onInspectCase,
  onGoToMatrix,
  onSimulationCaseChange,
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(
    initialZoneId || null
  );
  const [selectedDependencyId, setSelectedDependencyId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<DependencyType | 'all'>('all');
  const [layoutMode, setLayoutMode] = useState<'force' | 'clinical'>('clinical');

  React.useEffect(() => {
    if (initialZoneId) {
      setSelectedZoneId(initialZoneId);
      setSelectedDependencyId(null);
    }
  }, [initialZoneId]);

  // Selected Zone object
  const selectedZone = selectedZoneId
    ? FUNCTIONAL_ZONES.find((z) => z.id === selectedZoneId) || null
    : null;

  // Selected Dependency object
  const selectedDependency = selectedDependencyId
    ? DEPENDENCIES.find((d) => d.id === selectedDependencyId) || null
    : null;

  // Connected incoming and outgoing dependencies for selected zone
  const incomingDependencies = selectedZoneId
    ? DEPENDENCIES.filter((d) => d.toZoneId === selectedZoneId)
    : [];

  const outgoingDependencies = selectedZoneId
    ? DEPENDENCIES.filter((d) => d.fromZoneId === selectedZoneId)
    : [];

  // Zone icon
  const IconComponent = selectedZone ? ZONE_ICONS[selectedZone.iconName] || Server : Server;

  return (
    <div className="space-y-4 pb-20">
      {/* Full-width D3 Graph Canvas */}
      <div className="space-y-4">
        <D3DependencyGraph
          selectedZoneId={selectedZoneId}
          onSelectZone={(id) => {
            setSelectedZoneId(id);
            if (id) setSelectedDependencyId(null);
          }}
          selectedDependencyId={selectedDependencyId}
          onSelectDependency={(id) => {
            setSelectedDependencyId(id);
            if (id) setSelectedZoneId(null);
          }}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          layoutMode={layoutMode}
          onLayoutModeChange={setLayoutMode}
          activeSimulationCaseId={initialSimulationCaseId}
          onSimulationCaseChange={onSimulationCaseChange}
          onGoToMatrix={onGoToMatrix}
        />
      </div>

      {/* Modal Dialog for Selected Zone */}
      {selectedZone && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedZoneId(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-3 bg-slate-50/70 shrink-0">
              <div className="flex items-start gap-3">
                <div
                  className="p-2.5 rounded-xl text-white shadow-xs shrink-0"
                  style={{ backgroundColor: selectedZone.color }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-3xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Zona Funcional Seleccionada
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedZone.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedZoneId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Description & Clinical Role */}
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Misión y Rol Clínico en el Hospital
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedZone.description}
                </p>
              </div>

              {/* Critical Assets and Medical Systems */}
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Sistemas Típicos y Activos Críticos de la Zona
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.typicalSystems.map((sys, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium border border-slate-200"
                    >
                      {sys}
                    </span>
                  ))}
                </div>
              </div>

              {/* Asistential Consequence of Failure */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Consecuencia Asistencial del Fallo o Parálisis</span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed">
                  {selectedZone.clinicalConsequence}
                </p>
              </div>

              {/* Downstream Dependencies: Outgoing */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                    Dependencias Salientes ({outgoingDependencies.length})
                  </span>
                  <span className="text-3xs text-slate-400">Impacto si esta zona colapsa</span>
                </div>

                {outgoingDependencies.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg">
                    Esta zona es un sumidero terminal asistencial (nodo receptor final de pacientes).
                  </p>
                ) : (
                  <div className="space-y-2">
                    {outgoingDependencies.map((dep) => {
                      const toZone = FUNCTIONAL_ZONES.find((z) => z.id === dep.toZoneId);
                      const meta = DEPENDENCY_METAS[dep.type];
                      return (
                        <div
                          key={dep.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-3xs font-semibold px-2 py-0.5 rounded-md border ${meta.bg}`}
                            >
                              {meta.label}
                            </span>
                            <div className="flex items-center gap-1 font-bold text-slate-900 text-2xs">
                              <span>Hacia:</span>
                              <span className="text-cyan-700">{toZone?.shortName}</span>
                            </div>
                          </div>
                          <div className="font-bold text-slate-900">{dep.label}</div>
                          <p className="text-2xs text-slate-600 leading-snug">
                            {dep.description}
                          </p>
                          <div className="text-2xs text-rose-800 bg-rose-50/70 p-1.5 rounded-md border border-rose-100">
                            <span className="font-bold">Impacto asistencial: </span>
                            {dep.clinicalImpact}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Upstream Dependencies: Incoming */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                    Dependencias Entrantes ({incomingDependencies.length})
                  </span>
                  <span className="text-3xs text-slate-400">Vulnerabilidad ante fallos externos</span>
                </div>

                {incomingDependencies.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg">
                    Esta zona es un origen primario de servicios o conectividad perimetral.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {incomingDependencies.map((dep) => {
                      const fromZone = FUNCTIONAL_ZONES.find((z) => z.id === dep.fromZoneId);
                      const meta = DEPENDENCY_METAS[dep.type];
                      return (
                        <div
                          key={dep.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-3xs font-semibold px-2 py-0.5 rounded-md border ${meta.bg}`}
                            >
                              {meta.label}
                            </span>
                            <div className="flex items-center gap-1 font-bold text-slate-900 text-2xs">
                              <span>Desde:</span>
                              <span className="text-slate-800">{fromZone?.shortName}</span>
                            </div>
                          </div>
                          <div className="font-bold text-slate-900">{dep.label}</div>
                          <p className="text-2xs text-slate-600">{dep.description}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedZoneId(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog for Selected Dependency Link */}
      {selectedDependency && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedDependencyId(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-3 bg-slate-50/70 shrink-0">
              <div>
                <span
                  className={`text-3xs font-semibold px-2 py-0.5 rounded-md border ${
                    DEPENDENCY_METAS[selectedDependency.type].bg
                  }`}
                >
                  {DEPENDENCY_METAS[selectedDependency.type].label}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedDependency.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDependencyId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Mecanismo y Naturaleza del Enlace
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedDependency.description}
                </p>
              </div>
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <span className="text-2xs font-bold uppercase tracking-wider text-rose-800 block">
                  Impacto Clínico y Asistencial si se Interrumpe
                </span>
                <p className="text-xs text-rose-900 leading-relaxed">
                  {selectedDependency.clinicalImpact}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedDependencyId(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
