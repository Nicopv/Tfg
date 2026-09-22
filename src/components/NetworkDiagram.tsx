import React, { useState, useRef } from 'react';
import {
  Server,
  ClipboardList,
  ScanLine,
  FlaskConical,
  Activity,
  Globe,
  Info,
  Maximize2,
  Minimize2,
  Filter,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { FUNCTIONAL_ZONES, DEPENDENCIES } from '../data/thesisContent';
import { Dependency, DependencyType, FunctionalZone } from '../types';

const ZONE_ICONS: Record<string, React.ElementType> = {
  Server,
  ClipboardList,
  ScanLine,
  FlaskConical,
  Activity,
  Globe,
};

// Node spatial layout coordinates (viewBox 960 x 540)
// Arranged to reflect logical healthcare architecture:
// Conectividad Externa (perimeter left-top), Infraestructura TI (core center-left),
// Gestión Clínica HIS (center), Diagnóstico Imagen (top right), Lab/Farmacia (bottom right),
// Urgencias/Atención Crítica (center right - critical receiver)
export const ZONE_COORDINATES: Record<string, { x: number; y: number; labelPos?: 'top' | 'bottom' | 'left' | 'right' }> = {
  conectividad_externa: { x: 130, y: 130, labelPos: 'top' },
  infraestructura_ti: { x: 230, y: 360, labelPos: 'bottom' },
  gestion_clinica: { x: 490, y: 190, labelPos: 'top' },
  diagnostico_imagen: { x: 440, y: 440, labelPos: 'bottom' },
  laboratorio_farmacia: { x: 740, y: 140, labelPos: 'top' },
  urgencias_critica: { x: 790, y: 390, labelPos: 'bottom' },
};

export const DEPENDENCY_COLORS: Record<DependencyType, { stroke: string; bg: string; text: string; label: string }> = {
  tecnica: {
    stroke: '#0284c7', // Sky-600
    bg: 'bg-sky-50 border-sky-300 text-sky-800',
    text: 'text-sky-700',
    label: 'Técnica (Red / Servidores)',
  },
  operativa: {
    stroke: '#d97706', // Amber-600
    bg: 'bg-amber-50 border-amber-300 text-amber-800',
    text: 'text-amber-700',
    label: 'Operativa (Cese Asistencial)',
  },
  intercambio_info: {
    stroke: '#8b5cf6', // Violet-500
    bg: 'bg-violet-50 border-violet-300 text-violet-800',
    text: 'text-violet-700',
    label: 'Intercambio de Información',
  },
};

interface NetworkDiagramProps {
  selectedZoneId?: string | null;
  onSelectZone?: (zoneId: string) => void;
  highlightedZoneIds?: string[];
  degradedZoneIds?: string[];
  activeDependencyIds?: string[];
  compact?: boolean;
}

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({
  selectedZoneId = null,
  onSelectZone,
  highlightedZoneIds = [],
  degradedZoneIds = [],
  activeDependencyIds = [],
  compact = false,
}) => {
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [hoveredDepId, setHoveredDepId] = useState<string | null>(null);
  const [selectedDepId, setSelectedDepId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<DependencyType | 'all'>('all');
  const [showCurveLabels, setShowCurveLabels] = useState<boolean>(true);

  const activeZoneId = hoveredZoneId || selectedZoneId;

  // Filter dependencies according to type filter
  const visibleDependencies = DEPENDENCIES.filter((dep) => {
    if (filterType !== 'all' && dep.type !== filterType) return false;
    return true;
  });

  const selectedOrHoveredDependency =
    DEPENDENCIES.find((d) => d.id === (hoveredDepId || selectedDepId)) || null;

  const activeZoneData = FUNCTIONAL_ZONES.find((z) => z.id === activeZoneId) || null;

  // Calculate curve paths between nodes
  const getPathData = (dep: Dependency) => {
    const from = ZONE_COORDINATES[dep.fromZoneId];
    const to = ZONE_COORDINATES[dep.toZoneId];
    if (!from || !to) return '';

    // Calculate midpoint with slight perpendicular offset for curved aesthetics
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Differentiate curvature based on dependency type or specific pairs so parallel lines don't collide
    let curvature = 0.15;
    if (dep.type === 'operativa') curvature = 0.22;
    if (dep.type === 'intercambio_info') curvature = -0.18;
    if (dep.fromZoneId === 'laboratorio_farmacia' && dep.toZoneId === 'gestion_clinica') curvature = -0.28;
    if (dep.fromZoneId === 'diagnostico_imagen' && dep.toZoneId === 'gestion_clinica') curvature = 0.25;

    // Normal vector
    const nx = -dy / dist;
    const ny = dx / dist;

    // Control point
    const cx = (from.x + to.x) / 2 + nx * (dist * curvature);
    const cy = (from.y + to.y) / 2 + ny * (dist * curvature);

    // Label coordinates around control point
    const labelX = cx;
    const labelY = cy;

    return {
      path: `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`,
      labelX,
      labelY,
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Diagram Top Bar Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-700 text-white rounded-lg shadow-2xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              Diagrama Topológico de Interconexión y Vías de Dependencia
            </h3>
            <p className="text-xs text-slate-500">
              Pasa el cursor o haz clic en cualquier zona o enlace para inspeccionar la ruta de propagación
            </p>
          </div>
        </div>

        {/* Filter Chips by Dependency Type */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas ({DEPENDENCIES.length})
          </button>
          <button
            onClick={() => setFilterType('tecnica')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'tecnica'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-sky-50 border border-sky-200 text-sky-800 hover:bg-sky-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Técnica
          </button>
          <button
            onClick={() => setFilterType('operativa')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'operativa'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Operativa
          </button>
          <button
            onClick={() => setFilterType('intercambio_info')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'intercambio_info'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'bg-violet-50 border border-violet-200 text-violet-800 hover:bg-violet-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            Intercambio Info
          </button>
        </div>
      </div>

      {/* Main SVG Stage */}
      <div className="relative w-full overflow-hidden bg-radial from-slate-50 via-white to-slate-100/70 p-2 sm:p-4 select-none">
        <svg
          viewBox="0 0 960 540"
          className="w-full h-auto max-h-[560px] drop-shadow-xs"
          style={{ minHeight: compact ? '320px' : '420px' }}
        >
          <defs>
            {/* Arrowhead markers for each dependency type */}
            <marker
              id="arrow-tecnica"
              viewBox="0 0 10 10"
              refX="26"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#0284c7" />
            </marker>
            <marker
              id="arrow-operativa"
              viewBox="0 0 10 10"
              refX="26"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#d97706" />
            </marker>
            <marker
              id="arrow-intercambio_info"
              viewBox="0 0 10 10"
              refX="26"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#8b5cf6" />
            </marker>

            {/* Glowing filter for highlighted pathways */}
            <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Pattern subtle guidelines */}
          <g opacity="0.06">
            <line x1="0" y1="180" x2="960" y2="180" stroke="#0f172a" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="360" x2="960" y2="360" stroke="#0f172a" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="320" y1="0" x2="320" y2="540" stroke="#0f172a" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="640" y1="0" x2="640" y2="540" stroke="#0f172a" strokeWidth="1" strokeDasharray="4 4" />
          </g>

          {/* RENDER DEPENDENCY EDGES */}
          <g className="dependency-edges">
            {visibleDependencies.map((dep) => {
              const pathCalc = getPathData(dep);
              if (!pathCalc) return null;

              const isDepActiveInSimulation = activeDependencyIds.includes(dep.id);
              const isSelected = selectedDepId === dep.id;
              const isHovered = hoveredDepId === dep.id;
              const isConnectedToActiveZone =
                activeZoneId === dep.fromZoneId || activeZoneId === dep.toZoneId;

              const strokeColor = DEPENDENCY_COLORS[dep.type].stroke;
              let strokeWidth = isSelected || isHovered ? 4 : isConnectedToActiveZone ? 3 : 2;
              let strokeDash = dep.type === 'intercambio_info' ? '6 4' : dep.type === 'operativa' ? '8 4' : 'none';
              let opacity =
                activeZoneId && !isConnectedToActiveZone && !isDepActiveInSimulation ? 0.25 : 0.85;

              if (isDepActiveInSimulation) {
                strokeWidth = 4.5;
                opacity = 1;
              }

              return (
                <g
                  key={dep.id}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => setSelectedDepId(dep.id === selectedDepId ? null : dep.id)}
                  onMouseEnter={() => setHoveredDepId(dep.id)}
                  onMouseLeave={() => setHoveredDepId(null)}
                >
                  {/* Invisible thicker stroke for easy hover targeting */}
                  <path
                    d={pathCalc.path}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="24"
                  />

                  {/* Highlight Glow Underlay */}
                  {(isHovered || isSelected || isDepActiveInSimulation) && (
                    <path
                      d={pathCalc.path}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth + 5}
                      strokeOpacity="0.3"
                      filter="url(#glow-effect)"
                    />
                  )}

                  {/* Main Visible Curve Edge */}
                  <path
                    d={pathCalc.path}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    strokeOpacity={opacity}
                    markerEnd={`url(#arrow-${dep.type})`}
                    className={isDepActiveInSimulation ? 'animate-pulse' : ''}
                  />

                  {/* Edge label pill on curve */}
                  {showCurveLabels && (
                    <g
                      transform={`translate(${pathCalc.labelX}, ${pathCalc.labelY})`}
                      className="pointer-events-none"
                    >
                      <rect
                        x="-48"
                        y="-10"
                        width="96"
                        height="20"
                        rx="10"
                        fill="white"
                        stroke={strokeColor}
                        strokeWidth="1"
                        opacity={opacity >= 0.7 ? 0.95 : 0.4}
                        className="shadow-xs"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="600"
                        fill="#1e293b"
                        opacity={opacity >= 0.7 ? 1 : 0.5}
                      >
                        {dep.type === 'tecnica'
                          ? 'Técnica'
                          : dep.type === 'operativa'
                          ? 'Operativa'
                          : 'HL7/DICOM'}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* RENDER FUNCTIONAL ZONE NODES */}
          <g className="zone-nodes">
            {FUNCTIONAL_ZONES.map((zone) => {
              const coords = ZONE_COORDINATES[zone.id];
              if (!coords) return null;

              const isSelected = selectedZoneId === zone.id;
              const isHovered = hoveredZoneId === zone.id;
              const isAffectedInSim = highlightedZoneIds.includes(zone.id);
              const isDegradedInSim = degradedZoneIds.includes(zone.id);
              const isIncomingToActive =
                activeZoneId &&
                DEPENDENCIES.some((d) => d.fromZoneId === zone.id && d.toZoneId === activeZoneId);
              const isOutgoingFromActive =
                activeZoneId &&
                DEPENDENCIES.some((d) => d.fromZoneId === activeZoneId && d.toZoneId === zone.id);

              const Icon = ZONE_ICONS[zone.iconName] || Server;

              // Node radius & ring styling
              let nodeRadius = 38;
              let ringColor = zone.color;
              let fillGradient = '#ffffff';

              if (isAffectedInSim) {
                ringColor = '#e11d48'; // Rose
                nodeRadius = 42;
              } else if (isDegradedInSim) {
                ringColor = '#d97706'; // Amber
                nodeRadius = 40;
              } else if (isSelected || isHovered) {
                nodeRadius = 42;
              }

              return (
                <g
                  key={zone.id}
                  transform={`translate(${coords.x}, ${coords.y})`}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => onSelectZone?.(zone.id)}
                  onMouseEnter={() => setHoveredZoneId(zone.id)}
                  onMouseLeave={() => setHoveredZoneId(null)}
                >
                  {/* Pulse Halo for affected or selected nodes */}
                  {(isSelected || isAffectedInSim) && (
                    <circle
                      r={nodeRadius + 10}
                      fill={ringColor}
                      opacity="0.18"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer Ring Drop Shadow */}
                  <circle
                    r={nodeRadius + 4}
                    fill={ringColor}
                    opacity={isSelected || isHovered || isAffectedInSim ? '0.35' : '0.15'}
                  />

                  {/* Main Circle Body */}
                  <circle
                    r={nodeRadius}
                    fill={fillGradient}
                    stroke={ringColor}
                    strokeWidth={isSelected || isAffectedInSim ? 4 : 2.5}
                    className="filter drop-shadow-sm"
                  />

                  {/* Inner Icon Container circle */}
                  <circle
                    r={22}
                    fill={zone.color}
                    opacity={isAffectedInSim ? '0.9' : '0.85'}
                  />

                  {/* Render node icon using foreignObject for standard Lucide rendering */}
                  <foreignObject x="-14" y="-14" width="28" height="28" className="pointer-events-none">
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                  </foreignObject>

                  {/* In Simulation or Active Indicator Badges */}
                  {isAffectedInSim && (
                    <g transform="translate(24, -24)">
                      <circle r="11" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                        !
                      </text>
                    </g>
                  )}
                  {isDegradedInSim && (
                    <g transform="translate(24, -24)">
                      <circle r="11" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                        ~
                      </text>
                    </g>
                  )}

                  {/* Relation Badges when another node is hovered */}
                  {isIncomingToActive && (
                    <g transform="translate(-32, -28)">
                      <rect x="-10" y="-8" width="46" height="16" rx="8" fill="#0284c7" />
                      <text x="13" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                        ORIGEN
                      </text>
                    </g>
                  )}
                  {isOutgoingFromActive && (
                    <g transform="translate(32, 28)">
                      <rect x="-10" y="-8" width="52" height="16" rx="8" fill="#e11d48" />
                      <text x="16" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                        DESTINO
                      </text>
                    </g>
                  )}

                  {/* Zone Text Label under or over the node */}
                  <g transform={`translate(0, ${coords.labelPos === 'top' ? -48 : 52})`}>
                    <rect
                      x="-85"
                      y="-11"
                      width="170"
                      height="22"
                      rx="6"
                      fill="#ffffff"
                      stroke={isSelected ? zone.color : '#e2e8f0'}
                      strokeWidth={isSelected ? '2' : '1'}
                      className="shadow-2xs"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight={isSelected || isHovered ? '700' : '600'}
                      fill="#0f172a"
                    >
                      {zone.shortName}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend Overlay at bottom left */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-xs text-xs space-y-1.5 max-w-xs hidden sm:block">
          <span className="font-bold text-slate-800 text-2xs uppercase tracking-wider block">
            Tipos de Dependencia (Vías de Propagación)
          </span>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-sky-600 rounded-full" />
            <span className="text-slate-600 font-medium">Técnica:</span>
            <span className="text-2xs text-slate-400">Infraestructura y Red</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-600" />
            <span className="text-slate-600 font-medium">Operativa:</span>
            <span className="text-2xs text-slate-400">Parálisis por falta de servicio</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-t-2 border-dotted border-violet-500" />
            <span className="text-slate-600 font-medium">Intercambio Info:</span>
            <span className="text-2xs text-slate-400">HL7 / DICOM / Receta</span>
          </div>
        </div>
      </div>

      {/* Interactive Detail Inspector Drawer for Selected or Hovered Item */}
      {(selectedOrHoveredDependency || activeZoneData) && (
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 transition-all animate-fadeIn">
          {selectedOrHoveredDependency ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-2xs uppercase font-bold px-2 py-0.5 rounded-md border ${
                      DEPENDENCY_COLORS[selectedOrHoveredDependency.type].bg
                    }`}
                  >
                    Vía {DEPENDENCY_COLORS[selectedOrHoveredDependency.type].label}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <span className="text-cyan-700">
                      {FUNCTIONAL_ZONES.find((z) => z.id === selectedOrHoveredDependency.fromZoneId)?.shortName}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-rose-700">
                      {FUNCTIONAL_ZONES.find((z) => z.id === selectedOrHoveredDependency.toZoneId)?.shortName}
                    </span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {selectedOrHoveredDependency.label}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {selectedOrHoveredDependency.description}
                </p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl max-w-md shrink-0">
                <span className="text-2xs font-bold uppercase tracking-wider text-rose-800 block">
                  Impacto Clínico de la Ruptura:
                </span>
                <p className="text-xs text-rose-900 mt-0.5 leading-snug">
                  {selectedOrHoveredDependency.clinicalImpact}
                </p>
              </div>
            </div>
          ) : activeZoneData ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className="p-2.5 rounded-xl text-white shadow-2xs shrink-0 mt-0.5"
                  style={{ backgroundColor: activeZoneData.color }}
                >
                  {React.createElement(ZONE_ICONS[activeZoneData.iconName] || Server, {
                    className: 'w-5 h-5',
                  })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {activeZoneData.name}
                    </span>
                    <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${activeZoneData.badgeBg}`}>
                      {activeZoneData.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {activeZoneData.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelectZone?.(activeZoneData.id)}
                  className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Explorar Ficha de Zona →
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
