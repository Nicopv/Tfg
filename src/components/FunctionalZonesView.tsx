import React, { useState } from 'react';
import {
  Server,
  ClipboardList,
  ScanLine,
  FlaskConical,
  Activity,
  Globe,
  ArrowRight,
  Info,
  Layers,
  ArrowDownUp,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { FUNCTIONAL_ZONES, DEPENDENCIES, INCIDENT_CASES } from '../data/thesisContent';
import { DependencyType } from '../types';
import { NetworkDiagram } from './NetworkDiagram';

const ZONE_ICONS: Record<string, React.ElementType> = {
  Server,
  ClipboardList,
  ScanLine,
  FlaskConical,
  Activity,
  Globe,
};

interface FunctionalZonesViewProps {
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  onInspectCase: (caseId: string) => void;
}

export const FunctionalZonesView: React.FC<FunctionalZonesViewProps> = ({
  selectedZoneId,
  onSelectZone,
  onInspectCase,
}) => {
  const [filterType, setFilterType] = useState<DependencyType | 'all'>('all');

  const activeZone =
    FUNCTIONAL_ZONES.find((z) => z.id === selectedZoneId) || FUNCTIONAL_ZONES[0];

  const filteredDependencies = DEPENDENCIES.filter((dep) => {
    if (filterType === 'all') return true;
    return dep.type === filterType;
  });

  // Dependencies related to selected zone
  const incomingDependencies = DEPENDENCIES.filter((d) => d.toZoneId === activeZone.id);
  const outgoingDependencies = DEPENDENCIES.filter((d) => d.fromZoneId === activeZone.id);

  // Incidents that impacted this zone
  const relatedIncidents = INCIDENT_CASES.filter((c) =>
    c.zonesAffected.includes(activeZone.id)
  );

  return (
    <div className="space-y-8 pb-24">
      {/* Top Explanation Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-cyan-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            <span>Abstracción Metodológica del Entorno Sanitario</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Las 6 Zonas Funcionales y sus Dependencias Preexistentes
          </h2>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Una zona funcional agrupa sistemas, servicios y procesos que cumplen una función asistencial dentro del hospital (no es un pabellón físico ni un único software). Las dependencias <strong>no son mecanismos de ataque</strong>, sino relaciones preexistentes que actúan como vías de propagación del impacto.
          </p>

          {/* Dependency Filter Chips */}
          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">
              Filtrar por Vía:
            </span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todas las Dependencias ({DEPENDENCIES.length})
            </button>
            <button
              onClick={() => setFilterType('tecnica')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterType === 'tecnica'
                  ? 'bg-sky-600 text-white'
                  : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              Dependencia Técnica (Infraestructura / Red)
            </button>
            <button
              onClick={() => setFilterType('operativa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterType === 'operativa'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Dependencia Operativa (Parálisis por falta de servicio)
            </button>
            <button
              onClick={() => setFilterType('intercambio_info')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterType === 'intercambio_info'
                  ? 'bg-violet-600 text-white'
                  : 'bg-violet-50 text-violet-800 border border-violet-200 hover:bg-violet-100'
              }`}
            >
              Intercambio de Información (HL7 / DICOM / Receta)
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Visual Network Diagram */}
      <NetworkDiagram
        selectedZoneId={selectedZoneId}
        onSelectZone={onSelectZone}
      />

      {/* Grid: 6 Zones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FUNCTIONAL_ZONES.map((zone) => {
          const isSelected = zone.id === activeZone.id;
          const Icon = ZONE_ICONS[zone.iconName] || Server;

          return (
            <div
              key={zone.id}
              onClick={() => onSelectZone(zone.id)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-white border-cyan-600 shadow-md ring-2 ring-cyan-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className="p-2.5 rounded-xl text-white shadow-2xs"
                  style={{ backgroundColor: zone.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-2xs font-semibold uppercase px-2.5 py-0.5 rounded-full border ${zone.badgeBg}`}
                >
                  {zone.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {zone.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">
                {zone.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
                <span>{zone.typicalSystems.length} sistemas tipo</span>
                <span
                  className={`font-semibold ${
                    isSelected ? 'text-cyan-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  {isSelected ? '● Inspeccionando' : 'Ver detalle →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Inspector of the Selected Zone */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <div
              className="p-3.5 rounded-2xl text-white shadow-xs shrink-0"
              style={{ backgroundColor: activeZone.color }}
            >
              {React.createElement(ZONE_ICONS[activeZone.iconName] || Server, {
                className: 'w-7 h-7',
              })}
            </div>
            <div>
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Zona Seleccionada
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {activeZone.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {activeZone.description}
              </p>
            </div>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl max-w-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-rose-900 block">
                  Consecuencia Asistencial si Colapsa:
                </span>
                <p className="text-xs text-rose-800 leading-snug mt-0.5">
                  {activeZone.clinicalConsequence}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs / Inspector columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Column 1: Typical Systems */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              Sistemas y Tecnologías Típicas
            </h4>
            <ul className="space-y-2">
              {activeZone.typicalSystems.map((sys, idx) => (
                <li
                  key={idx}
                  className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-medium text-slate-800 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0" />
                  {sys}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Dependencies Breakdown */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ArrowDownUp className="w-3.5 h-3.5 text-slate-500" />
              Relaciones de Propagación
            </h4>

            <div className="space-y-3">
              <div>
                <span className="text-2xs font-semibold text-slate-500 uppercase block mb-1">
                  ← De quién depende esta zona (Entrantes):
                </span>
                {incomingDependencies.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No registra dependencias entrantes primarias en el modelo.</p>
                ) : (
                  incomingDependencies.map((dep) => {
                    const fromZone = FUNCTIONAL_ZONES.find((z) => z.id === dep.fromZoneId);
                    return (
                      <div
                        key={dep.id}
                        className="mb-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                      >
                        <div className="flex items-center gap-1 font-semibold text-slate-900">
                          <span className="text-cyan-700">{fromZone?.shortName}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span>{activeZone.shortName}</span>
                        </div>
                        <p className="text-2xs text-slate-500 mt-0.5">{dep.description}</p>
                      </div>
                    );
                  })
                )}
              </div>

              <div>
                <span className="text-2xs font-semibold text-slate-500 uppercase block mb-1">
                  → A quién arrastra si colapsa (Salientes):
                </span>
                {outgoingDependencies.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No proyecta dependencias salientes directas en el modelo.</p>
                ) : (
                  outgoingDependencies.map((dep) => {
                    const toZone = FUNCTIONAL_ZONES.find((z) => z.id === dep.toZoneId);
                    return (
                      <div
                        key={dep.id}
                        className="mb-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                      >
                        <div className="flex items-center gap-1 font-semibold text-slate-900">
                          <span>{activeZone.shortName}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="text-rose-700">{toZone?.shortName}</span>
                        </div>
                        <p className="text-2xs text-slate-500 mt-0.5">{dep.clinicalImpact}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Real Cases Affecting this Zone */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-slate-500" />
              Casos Reales con Afectación en esta Zona
            </h4>

            <div className="space-y-2">
              {relatedIncidents.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onInspectCase(c.id)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-cyan-800">
                      {c.name}
                    </span>
                    <span className="text-2xs font-mono text-slate-400">{c.year}</span>
                  </div>
                  <span
                    className="inline-block text-2xs px-2 py-0.5 rounded-md font-semibold text-white mb-1.5"
                    style={{ backgroundColor: c.configurationColor }}
                  >
                    {c.configurationLabel}
                  </span>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
