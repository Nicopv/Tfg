export type DependencyType = 'tecnica' | 'operativa' | 'intercambio_info';

export interface FunctionalZone {
  id: string;
  name: string;
  shortName: string;
  category: 'core_it' | 'clinical_core' | 'diagnostic' | 'therapeutic' | 'critical' | 'perimeter';
  description: string;
  iconName: string;
  typicalSystems: string[];
  clinicalConsequence: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
}

export interface Dependency {
  id: string;
  fromZoneId: string;
  toZoneId: string;
  type: DependencyType;
  label: string;
  description: string;
  clinicalImpact: string;
}

export type TrajectoryType =
  | 'horizontal_masiva'
  | 'vertical_cascada'
  | 'lateral_prolongada'
  | 'ecosistemica'
  | 'intra_interorganizacional'
  | 'multisitio_centralizada';

export interface TimelineEvent {
  step: number;
  phase: string;
  zoneId: string;
  description: string;
  dependencyInvolved?: DependencyType;
  contained: boolean;
}

export interface IncidentCase {
  id: string;
  name: string;
  organization: string;
  year: number;
  country: string;
  threatActorOrMalware: string;
  initialPoint: string;
  initialZoneId: string;
  trajectoryType: TrajectoryType;
  configurationLabel: string;
  configurationColor: string;
  summary: string;
  narrativeText: string;
  zonesAffected: string[];
  dependenciesExploited: DependencyType[];
  structuralFactors: {
    factor: string;
    effect: 'amplificador' | 'limitante';
    detail: string;
  }[];
  consequences: string[];
  containmentAction: string;
  timeline: TimelineEvent[];
  // Campos exactos de la Tabla 3 y Tabla 4 del TFG (Massaccesi, 2026)
  vectorEntradaInicial: string;
  tecnicaMovimientoLateral: string;
  trayectoriaZonasTexto: string;
  cronologia: string;
  patronPropagacion: string;
  zonaEntrada: string;
  consecuenciaAsistencialExacta: string;
  fuenteCorpus: string;
}

export interface RiskApproachComparison {
  aspecto: string;
  enfoqueTradicional: string;
  propuestaSistemica: string;
}

export interface CorpusSource {
  fuente: string;
  tipoAporte: string;
  casosAreasVinculadas: string;
  patronPropagacionSustenta: string;
}

export interface StructuralFactor {
  id: string;
  nombre: string;
  descripcion: string;
  casosIlustrativos: string[];
}

export interface DefenseSection {
  id: string;
  number: number;
  title: string;
  speakerCue: string;
  fullSpeech: string;
  keyConcepts: string[];
  highlightQuote: string;
  recommendedZoneId?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Femenino' | 'Masculino';
  tone: string;
  description: string;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  audioUrl: string | null;
  currentPlayingText: string;
  activeSectionId: string | null;
  voice: string;
  playbackRate: number;
  progress: number;
  duration: number;
  error: string | null;
}
