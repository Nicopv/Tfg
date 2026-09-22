import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  GitBranch,
  Shield,
  FileText,
  CornerDownRight,
} from 'lucide-react';
import { FUNCTIONAL_ZONES, DEPENDENCIES } from '../data/thesisContent';
import { NetworkDiagram } from './NetworkDiagram';

export interface PropagationResult {
  configurationType: 'horizontal_masiva' | 'cascada_vertical' | 'lateral_dirigida' | 'ecosistema_terceros' | 'bloqueo_perimetral';
  configurationLabel: string;
  configurationDescription: string;
  badgeColor: string;
  propagationPath: string[]; // sequence of zone IDs
  affectedZones: string[];
  degradedZones: string[];
  containedZones: string[];
  activeDependencyIds: string[];
  containmentRecommendations: {
    category: 'Técnica' | 'Operativa' | 'Gobernanza';
    action: string;
    details: string;
  }[];
}

export const PropagationSimulator: React.FC = () => {
  const [entryZoneId, setEntryZoneId] = useState<string>('infraestructura_ti');
  const [hasSegmentation, setHasSegmentation] = useState<boolean>(false);
  const [hasMfa, setHasMfa] = useState<boolean>(false);
  const [hasEdrEarlyDetection, setHasEdrEarlyDetection] = useState<boolean>(false);
  const [hasManualContingency, setHasManualContingency] = useState<boolean>(false);
  const [hasImmutableBackups, setHasImmutableBackups] = useState<boolean>(false);

  const [simulationRun, setSimulationRun] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'network' | 'cards'>('network');

  // Calculate detailed propagation logic, configuration type and containment recommendations
  const computeSimulationResult = (): PropagationResult => {
    let affectedZones: string[] = [];
    let degradedZones: string[] = [];
    let containedZones: string[] = [];
    let activeDepIds: string[] = [];
    let propagationPath: string[] = [];

    let configType: PropagationResult['configurationType'] = 'horizontal_masiva';
    let configLabel = 'Propagación Horizontal Masiva';
    let configDesc = 'Afectación simultánea e indiscriminada de múltiples zonas funcionales por ausencia de barreras de segmentación.';
    let badgeColor = 'bg-rose-50 text-rose-800 border-rose-300';

    // SCENARIO 1: Entry at External Connectivity (Third party / VPN / Supply Chain)
    if (entryZoneId === 'conectividad_externa') {
      propagationPath.push('conectividad_externa');
      if (hasMfa) {
        configType = 'bloqueo_perimetral';
        configLabel = 'Contención Perimetral Exitosa';
        configDesc = 'La autenticación multifactor (MFA) impidió el uso de credenciales comprometidas en la pasarela o VPN externa.';
        badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        containedZones = FUNCTIONAL_ZONES.map((z) => z.id);
      } else {
        affectedZones.push('conectividad_externa');
        activeDepIds.push('dep_info_ext_farmacia');

        if (!hasSegmentation) {
          configType = 'ecosistema_terceros';
          configLabel = 'Propagación en Ecosistema de Terceros';
          configDesc = 'La intrusión se extendió desde el proveedor externo hacia el núcleo del hospital al carecer de filtrado estricto y segmentación.';
          badgeColor = 'bg-purple-50 text-purple-800 border-purple-300';

          propagationPath.push('laboratorio_farmacia');
          affectedZones.push('laboratorio_farmacia');

          activeDepIds.push('dep_op_lab_urgencias');
          activeDepIds.push('dep_info_lab_his');

          propagationPath.push('gestion_clinica');
          affectedZones.push('gestion_clinica');

          if (hasManualContingency) {
            degradedZones.push('urgencias_critica');
          } else {
            propagationPath.push('urgencias_critica');
            affectedZones.push('urgencias_critica');
          }
          affectedZones.push('infraestructura_ti');
        } else {
          // With segmentation, supply chain disruption is contained to billing/pharmacy interfaces
          configType = 'lateral_dirigida';
          configLabel = 'Propagación Lateral Restringida';
          configDesc = 'La segmentación perimetral impidió que el compromiso de terceros alcanzara la infraestructura central hospitalaria.';
          badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';

          propagationPath.push('laboratorio_farmacia');
          degradedZones.push('laboratorio_farmacia');
          containedZones.push('infraestructura_ti');
          containedZones.push('gestion_clinica');
          containedZones.push('diagnostico_imagen');
          containedZones.push('urgencias_critica');
        }
      }
    }
    // SCENARIO 2: Entry at Clinical Management (Phishing / Clinic Workstation)
    else if (entryZoneId === 'gestion_clinica') {
      propagationPath.push('gestion_clinica');
      if (hasEdrEarlyDetection) {
        configType = 'lateral_dirigida';
        configLabel = 'Contención en Endpoint Asistencial';
        configDesc = 'El agente EDR detectó la baliza o ejecutable en la estación clínica antes de la elevación de privilegios en el dominio.';
        badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        affectedZones = ['gestion_clinica'];
        containedZones = FUNCTIONAL_ZONES.filter((z) => z.id !== 'gestion_clinica').map((z) => z.id);
      } else {
        affectedZones.push('gestion_clinica');
        propagationPath.push('infraestructura_ti');
        affectedZones.push('infraestructura_ti');
        activeDepIds.push('dep_tec_it_his');

        if (!hasSegmentation) {
          configType = 'cascada_vertical';
          configLabel = 'Propagación en Cascada Vertical';
          configDesc = 'La elevación de privilegios hacia el Directorio Activo arrastró en cascada a todos los sistemas conectados de radiología y laboratorio.';
          badgeColor = 'bg-rose-50 text-rose-800 border-rose-300';

          propagationPath.push('diagnostico_imagen');
          affectedZones.push('diagnostico_imagen');
          activeDepIds.push('dep_tec_it_pacs');

          propagationPath.push('laboratorio_farmacia');
          affectedZones.push('laboratorio_farmacia');
          activeDepIds.push('dep_tec_it_lab');

          if (hasManualContingency) {
            degradedZones.push('urgencias_critica');
          } else {
            propagationPath.push('urgencias_critica');
            affectedZones.push('urgencias_critica');
            activeDepIds.push('dep_op_his_urgencias');
            activeDepIds.push('dep_op_pacs_urgencias');
            activeDepIds.push('dep_op_lab_urgencias');
          }
        } else {
          // Segmentation contains to IT and EHR
          configType = 'lateral_dirigida';
          configLabel = 'Contención Lateral por VLAN Médica';
          configDesc = 'Las redes aisladas de electromedicina (PACS y Analizadores) evitaron el cifrado de las modalidades de diagnóstico.';
          badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';

          containedZones.push('diagnostico_imagen');
          containedZones.push('laboratorio_farmacia');
          if (hasManualContingency) {
            containedZones.push('urgencias_critica');
          } else {
            degradedZones.push('urgencias_critica');
          }
        }
      }
    }
    // SCENARIO 3: Entry at Core IT Infrastructure (Vulnerability / SMB / WannaCry style)
    else {
      propagationPath.push('infraestructura_ti');
      affectedZones.push('infraestructura_ti');

      if (!hasSegmentation) {
        configType = 'horizontal_masiva';
        configLabel = 'Propagación Horizontal Masiva';
        configDesc = 'Colapso transversal no segmentado: el fallo del Active Directory o almacenamiento compromete simultáneamente todos los servicios hospitalarios.';
        badgeColor = 'bg-rose-50 text-rose-800 border-rose-300';

        propagationPath.push('gestion_clinica');
        affectedZones.push('gestion_clinica');
        activeDepIds.push('dep_tec_it_his');

        propagationPath.push('diagnostico_imagen');
        affectedZones.push('diagnostico_imagen');
        activeDepIds.push('dep_tec_it_pacs');

        propagationPath.push('laboratorio_farmacia');
        affectedZones.push('laboratorio_farmacia');
        activeDepIds.push('dep_tec_it_lab');

        if (hasManualContingency) {
          degradedZones.push('urgencias_critica');
        } else {
          propagationPath.push('urgencias_critica');
          affectedZones.push('urgencias_critica');
          activeDepIds.push('dep_op_pacs_urgencias');
          activeDepIds.push('dep_op_lab_urgencias');
          activeDepIds.push('dep_op_his_urgencias');
        }
      } else {
        configType = 'lateral_dirigida';
        configLabel = 'Propagación Lateral Segmentada';
        configDesc = 'A pesar del compromiso central, las zonas clínicas críticas operan con autonomía funcional protegida por cortafuegos internos.';
        badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';

        degradedZones.push('gestion_clinica');
        containedZones.push('diagnostico_imagen');
        containedZones.push('laboratorio_farmacia');

        if (hasManualContingency) {
          containedZones.push('urgencias_critica');
        } else {
          degradedZones.push('urgencias_critica');
        }
      }
    }

    // Deduplicate lists
    affectedZones = Array.from(new Set(affectedZones));
    degradedZones = Array.from(new Set(degradedZones)).filter((z) => !affectedZones.includes(z));
    containedZones = FUNCTIONAL_ZONES.filter(
      (z) => !affectedZones.includes(z.id) && !degradedZones.includes(z.id)
    ).map((z) => z.id);

    // Dynamic Containment Recommendations based on gaps identified in the simulation
    const containmentRecommendations: PropagationResult['containmentRecommendations'] = [];

    if (!hasSegmentation) {
      containmentRecommendations.push({
        category: 'Técnica',
        action: 'Microsegmentación y Aislamiento de VLANs Médicas',
        details:
          'Implementar zonas de seguridad con inspección mediante cortafuegos internos de nueva generación (NGFW), aislando PACS, LIS y monitorización crítica del Directorio Activo y redes de ofimática.',
      });
    }

    if (!hasMfa && entryZoneId === 'conectividad_externa') {
      containmentRecommendations.push({
        category: 'Técnica',
        action: 'Despliegue Mandatorio de MFA Resistente a Phishing (FIDO2)',
        details:
          'Exigir obligatoriamente autenticación de doble factor en todas las puertas de enlace VPN, accesos de mantenimiento de terceros y portales médicos externos sin excepción.',
      });
    }

    if (!hasEdrEarlyDetection) {
      containmentRecommendations.push({
        category: 'Técnica',
        action: 'EDR Asistencial 24/7 con Capacidad de Aislamiento Inmediato',
        details:
          'Implantar telemetría y agentes de respuesta en puestos clínicos capaces de cortar la conectividad de red de una máquina comprometida en menos de 15 minutos antes de la propagación.',
      });
    }

    if (!hasManualContingency) {
      containmentRecommendations.push({
        category: 'Operativa',
        action: 'Planes de Modo Degradado y Protocolos Analógicos en Papel',
        details:
          'Mantener plantillas de triaje, pedidos de hemoterapia y hojas de evolución impresas en boxes de urgencias, realizando simulacros periódicos de corte de suministro digital.',
      });
    }

    if (!hasImmutableBackups) {
      containmentRecommendations.push({
        category: 'Gobernanza',
        action: 'Copias de Seguridad Inmutables con Almacenamiento Fuera de Línea',
        details:
          'Asegurar respaldos con bloqueo WORM (Write Once Read Many) desacoplados del Directorio Activo, verificando tiempos de recuperación de la Historia Clínica en menos de 24 horas.',
      });
    }

    return {
      configurationType: configType,
      configurationLabel: configLabel,
      configurationDescription: configDesc,
      badgeColor,
      propagationPath,
      affectedZones,
      degradedZones,
      containedZones,
      activeDependencyIds: activeDepIds,
      containmentRecommendations,
    };
  };

  const simResult = computeSimulationResult();

  return (
    <div className="space-y-8 pb-24">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-cyan-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sliders className="w-4 h-4" />
            <span>Laboratorio Interactivo de Resiliencia Sanitaria</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Simulador de Propagación y Rutas de Contención
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Experimenta cómo la interacción entre el punto de intrusión inicial y los factores estructurales del hospital determina si un incidente aislado se convierte en una crisis asistencial o queda contenido. Identifica la configuración topológica resultante y las medidas de contención prioritarias.
          </p>
        </div>
      </div>

      {/* Simulator Controls & Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                1. Punto de Entrada Inicial del Incidente:
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'infraestructura_ti',
                    title: 'Infraestructura IT (Core / AD)',
                    subtitle: 'Análogo a WannaCry en NHS (vulnerabilidad SMBv1)',
                  },
                  {
                    id: 'gestion_clinica',
                    title: 'Gestión Clínica (Endpoint / HIS)',
                    subtitle: 'Análogo a HSE Irlanda (phishing a estación médica)',
                  },
                  {
                    id: 'conectividad_externa',
                    title: 'Conectividad Externa (Proveedores y Terceros)',
                    subtitle: 'Análogo a Düsseldorf o Change Healthcare (proveedor)',
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setEntryZoneId(opt.id);
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      entryZoneId === opt.id
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-medium ring-1 ring-cyan-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{opt.title}</div>
                    <div className="text-2xs text-slate-500 mt-0.5">{opt.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                2. Controles Estructurales y Barreras:
              </label>
              <div className="space-y-2.5">
                {[
                  {
                    id: 'seg',
                    state: hasSegmentation,
                    toggle: () => setHasSegmentation(!hasSegmentation),
                    title: 'Microsegmentación de Red Hospitalaria',
                    desc: 'Aísla VLAN de equipos médicos (PACS/LIS) del dominio.',
                  },
                  {
                    id: 'mfa',
                    state: hasMfa,
                    toggle: () => setHasMfa(!hasMfa),
                    title: 'Autenticación Multifactor (MFA)',
                    desc: 'Bloquea accesos con credenciales filtradas de terceros.',
                  },
                  {
                    id: 'edr',
                    state: hasEdrEarlyDetection,
                    toggle: () => setHasEdrEarlyDetection(!hasEdrEarlyDetection),
                    title: 'EDR Supervisado 24/7 en Endpoints',
                    desc: 'Contiene anomalías antes de la elevación lateral.',
                  },
                  {
                    id: 'contingency',
                    state: hasManualContingency,
                    toggle: () => setHasManualContingency(!hasManualContingency),
                    title: 'Protocolos de Contingencia Analógica',
                    desc: 'Urgencias y triaje operan en modo degradado en papel.',
                  },
                  {
                    id: 'backups',
                    state: hasImmutableBackups,
                    toggle: () => setHasImmutableBackups(!hasImmutableBackups),
                    title: 'Copias de Seguridad Inmutables Offsite',
                    desc: 'Garantiza restauración sin ceder a la extorsión.',
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={item.toggle}
                      className="mt-0.5 rounded-sm text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {item.title}
                      </span>
                      <span className="text-2xs text-slate-500 block leading-tight mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setSimulationRun(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-700 hover:bg-cyan-800 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Ejecutar Simulación</span>
              </button>
              <button
                onClick={() => {
                  setSimulationRun(false);
                  setHasSegmentation(false);
                  setHasMfa(false);
                  setHasEdrEarlyDetection(false);
                  setHasManualContingency(false);
                  setHasImmutableBackups(false);
                }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
                title="Reiniciar simulador"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Hospital Map State & Verdict */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Simulation Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Configuración Topológica Identificada
                </span>
                <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900">
                    {simResult.configurationLabel}
                  </h3>
                  <span
                    className={`text-2xs font-bold px-2.5 py-0.5 rounded-full border ${simResult.badgeColor}`}
                  >
                    {simResult.configurationType.toUpperCase().replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  {simResult.configurationDescription}
                </p>
              </div>

              {/* View Switcher: Graph vs Cards */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => setActiveViewMode('network')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeViewMode === 'network'
                      ? 'bg-white text-cyan-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Diagrama de Red
                </button>
                <button
                  onClick={() => setActiveViewMode('cards')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeViewMode === 'cards'
                      ? 'bg-white text-cyan-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fichas de Zona
                </button>
              </div>
            </div>

            {/* Propagation Path Flow Banner */}
            <div className="py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 shrink-0">
                <GitBranch className="w-3.5 h-3.5 text-cyan-600" />
                Ruta de Propagación:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {simResult.propagationPath.map((zoneId, idx) => {
                  const z = FUNCTIONAL_ZONES.find((item) => item.id === zoneId);
                  return (
                    <React.Fragment key={zoneId}>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                          idx === 0
                            ? 'bg-rose-50 border-rose-300 text-rose-800'
                            : 'bg-slate-100 border-slate-300 text-slate-800'
                        }`}
                      >
                        {idx === 0 ? 'Origen: ' : ''}
                        {z?.shortName}
                      </span>
                      {idx < simResult.propagationPath.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Stage: Network Diagram vs Grid */}
            <div className="mt-4">
              {activeViewMode === 'network' ? (
                <NetworkDiagram
                  highlightedZoneIds={simResult.affectedZones}
                  degradedZoneIds={simResult.degradedZones}
                  activeDependencyIds={simResult.activeDependencyIds}
                  compact={false}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FUNCTIONAL_ZONES.map((zone) => {
                    const isAffected = simResult.affectedZones.includes(zone.id);
                    const isDegraded = simResult.degradedZones.includes(zone.id);
                    const isContained = simResult.containedZones.includes(zone.id);
                    const isEntry = zone.id === entryZoneId;

                    let cardBg = 'bg-slate-50 border-slate-200 text-slate-800';
                    let statusLabel = 'EN ESPERA';
                    let statusColor = 'text-slate-500 bg-slate-100';

                    if (isAffected) {
                      cardBg = 'bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-400/30';
                      statusLabel = isEntry ? 'INTRUSIÓN INICIAL (Cifrado)' : 'AFECTADA (Parálisis Técnica)';
                      statusColor = 'text-rose-700 bg-rose-100 border border-rose-200';
                    } else if (isDegraded) {
                      cardBg = 'bg-amber-50 border-amber-300 text-amber-950 ring-1 ring-amber-400/30';
                      statusLabel = 'MODO DEGRADADO (Analógico)';
                      statusColor = 'text-amber-800 bg-amber-100 border border-amber-200';
                    } else if (isContained) {
                      cardBg = 'bg-emerald-50 border-emerald-300 text-emerald-950 ring-1 ring-emerald-400/30';
                      statusLabel = 'PROTEGIDA / CONTENIDA';
                      statusColor = 'text-emerald-800 bg-emerald-100 border border-emerald-200';
                    }

                    return (
                      <div
                        key={zone.id}
                        className={`p-3.5 rounded-xl border transition-all ${cardBg}`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-bold text-xs">{zone.shortName}</span>
                          <span
                            className={`text-3xs font-mono font-bold px-1.5 py-0.5 rounded-sm ${statusColor}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                        <p className="text-2xs opacity-80 leading-snug line-clamp-2">
                          {zone.clinicalConsequence}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Asistential Impact Verdict Card */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm ${
                  simResult.affectedZones.includes('urgencias_critica')
                    ? 'bg-rose-950 text-white border-rose-800'
                    : simResult.degradedZones.includes('urgencias_critica')
                    ? 'bg-amber-950 text-amber-100 border-amber-800'
                    : 'bg-emerald-950 text-emerald-100 border-emerald-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  {simResult.affectedZones.includes('urgencias_critica') ? (
                    <Flame className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  ) : simResult.degradedZones.includes('urgencias_critica') ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}

                  <div>
                    <h4 className="font-bold text-sm sm:text-base leading-snug">
                      {simResult.affectedZones.includes('urgencias_critica')
                        ? 'Crisis Asistencial Sistémica: Parálisis de Urgencias y Desvío de Ambulancias'
                        : simResult.degradedZones.includes('urgencias_critica')
                        ? 'Contención Parcial: Urgencias Operando en Modo Degradado Analógico'
                        : 'Resiliencia Exitosa: El Incidente Quedó Contenido sin Afectar la Atención Crítica'}
                    </h4>
                    <p className="text-xs mt-1.5 opacity-90 leading-relaxed">
                      {simResult.affectedZones.includes('urgencias_critica')
                        ? 'La ausencia de microsegmentación y controles en los endpoints permitió que el impacto se propagara vertical y horizontalmente a través de la infraestructura compartida hasta arrastrar los servicios vitales.'
                        : simResult.degradedZones.includes('urgencias_critica')
                        ? 'Los controles estructurales limitaron la propagación técnica hacia los analizadores de laboratorio y radiología, permitiendo al personal de urgencias sostener la vida mediante planes de contingencia.'
                        : 'Las defensas perimetrales y la segmentación impidieron la transferencia del riesgo hacia el núcleo asistencial, demostrando el principio rector: "Limitar la capacidad de propagación salva vidas".'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations for Containment Section */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-cyan-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Recomendaciones de Contención Prioritarias (Según Factores Detectados)
                </h4>
              </div>

              {simResult.containmentRecommendations.length === 0 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Todos los controles estructurales clave están activos. El entorno demuestra máxima madurez resiliente ante este vector de ataque.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {simResult.containmentRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {rec.action}
                        </span>
                        <span className="text-3xs font-mono font-semibold px-1.5 py-0.5 bg-cyan-100 text-cyan-800 rounded-md">
                          {rec.category}
                        </span>
                      </div>
                      <p className="text-2xs text-slate-600 leading-relaxed">
                        {rec.details}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
