import {
  DefenseSection,
  FunctionalZone,
  Dependency,
  IncidentCase,
  VoiceOption,
  RiskApproachComparison,
  CorpusSource,
  StructuralFactor,
} from '../types';

export const AVAILABLE_VOICES: VoiceOption[] = [
  {
    id: 'Kore',
    name: 'Kore',
    gender: 'Femenino',
    tone: 'Clara, pausada y académica',
    description: 'Voz recomendada para presentaciones formales y defensas de tesis.',
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    gender: 'Masculino',
    tone: 'Solemne, firme y autoritativa',
    description: 'Voz profunda y reflexiva, ideal para análisis de casos críticos.',
  },
  {
    id: 'Puck',
    name: 'Puck',
    gender: 'Masculino',
    tone: 'Dinámica, fluida y precisa',
    description: 'Excelente ritmo para transiciones y explicaciones metodológicas.',
  },
  {
    id: 'Charon',
    name: 'Charon',
    gender: 'Masculino',
    tone: 'Grave y analítica',
    description: 'Tono sobrio y técnico para incidentes cibernéticos.',
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    gender: 'Femenino',
    tone: 'Suave, articulada y neutra',
    description: 'Alineada con la exposición científica y divulgación de conclusiones.',
  },
];

export const FUNCTIONAL_ZONES: FunctionalZone[] = [
  {
    id: 'infraestructura_ti',
    name: 'Infraestructura TI y redes',
    shortName: 'Infraestructura TI y redes',
    category: 'core_it',
    description:
      'Columna vertebral digital: redes de comunicaciones, servidores centralizados, hipervisores, almacenamiento SAN/NAS, Directorio Activo, DNS, DHCP y servicios de autenticación y respaldo.',
    iconName: 'Server',
    typicalSystems: [
      'Active Directory / LDAP',
      'Servidores VMware / Hyper-V',
      'Switches Core & Firewalls perimetrales',
      'Sistemas de Backup y Almacenamiento',
    ],
    clinicalConsequence:
      'Colapso transversal de conectividad, caída de autenticación de usuarios médicos y parálisis de acceso a cualquier software clínico centralizado.',
    color: '#0284c7', // Sky
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    badgeBorder: 'border-sky-300',
  },
  {
    id: 'gestion_clinica',
    name: 'Gestión clínica-asistencial',
    shortName: 'Gestión clínica-asistencial',
    category: 'clinical_core',
    description:
      'Núcleo operativo del historial del paciente: Historias Clínicas Electrónicas (HCE/HIS), gestión de admisiones, asignación de camas, programación de quirófanos y órdenes médicas.',
    iconName: 'ClipboardList',
    typicalSystems: [
      'HIS (Hospital Information System)',
      'EHR / Historia Clínica Electrónica',
      'Gestión de Admisión y Camas',
      'Prescripción Médica Electrónica',
    ],
    clinicalConsequence:
      'Pérdida de antecedentes médicos, alergias y prescripciones activas; retorno forzado y caótico a registros en papel; suspensión de cirugías programadas.',
    color: '#059669', // Emerald
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeBorder: 'border-emerald-300',
  },
  {
    id: 'diagnostico_imagen',
    name: 'Diagnóstico por imagen',
    shortName: 'Diagnóstico por imagen',
    category: 'diagnostic',
    description:
      'Servicios de radiología y medicina nuclear: adquisición, procesamiento, almacenamiento y distribución de estudios imagenológicos (TAC, Resonancia, Rayos X, Ecografías).',
    iconName: 'ScanLine',
    typicalSystems: [
      'PACS (Picture Archiving & Communication System)',
      'RIS (Radiology Information System)',
      'Modalidades DICOM (Tomógrafo, RM, RX)',
      'Estaciones de informe radiológico',
    ],
    clinicalConsequence:
      'Incapacidad de visualizar tomografías en ictus agudos, politraumatismos o patologías tiempo-dependientes, forzando derivación externa inmediata.',
    color: '#7c3aed', // Violet
    badgeBg: 'bg-violet-50 text-violet-800 border-violet-200',
    badgeBorder: 'border-violet-300',
  },
  {
    id: 'laboratorio_farmacia',
    name: 'Laboratorio y farmacia',
    shortName: 'Laboratorio y farmacia',
    category: 'therapeutic',
    description:
      'Diagnóstico biológico y terapéutica farmacológica: analizadores bioquímicos, hematológicos y microbiológicos, junto a la dispensación y validación de medicamentos.',
    iconName: 'FlaskConical',
    typicalSystems: [
      'LIS (Laboratory Information System)',
      'Analizadores bioquímicos automatizados',
      'Armarios dispensadores (Pyxis / Omnicell)',
      'Software de validación farmacéutica',
    ],
    clinicalConsequence:
      'Imposibilidad de procesar analíticas de urgencia o troponinas cardíacas; cese de dispensación automatizada y riesgo crítico de error en medicación.',
    color: '#d97706', // Amber
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeBorder: 'border-amber-300',
  },
  {
    id: 'urgencias_critica',
    name: 'Urgencias y atención crítica',
    shortName: 'Urgencias y atención crítica',
    category: 'critical',
    description:
      'Atención médica vital y tiempo-dependiente: servicio de urgencias médicas, triaje Manchester/Avanzado, Unidades de Cuidados Intensivos (UCI), Reanimación y Quirófanos de urgencia.',
    iconName: 'Activity',
    typicalSystems: [
      'Monitores multiparamétricos de cabecera',
      'Centrales de monitorización de UCI',
      'Software de Triaje de Emergencias',
      'Respiradores y bombas de infusión conectadas',
    ],
    clinicalConsequence:
      'Desvío obligatorio de ambulancias y emergencias a otros hospitales, saturación de triaje y riesgo directo vital en pacientes inestables.',
    color: '#e11d48', // Rose
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    badgeBorder: 'border-rose-300',
  },
  {
    id: 'conectividad_externa',
    name: 'Conectividad externa',
    shortName: 'Conectividad externa',
    category: 'perimeter',
    description:
      'Dependencias con proveedores y sistemas externos: interconexión del hospital con terceros (servicios de soporte remoto de proveedores vía VPN, plataformas en la nube, pasarelas de aseguradoras/clearinghouses, telemedicina y redes de salud externas). Representa una dependencia sistémica externa: no es necesariamente el origen o vector inicial de todos los ataques (los cuales a menudo comienzan en puntos internos), sino el conjunto de dependencias funcionales con entidades y sistemas fuera de la organización.',
    iconName: 'Globe',
    typicalSystems: [
      'Accesos de soporte y mantenimiento de proveedores externos (VPN)',
      'Pasarelas de facturación y Clearinghouses (Sistemas de terceros)',
      'Servicios de telemedicina y plataformas cloud externas',
      'Interconexión con redes sanitarias regionales y laboratorios externos',
    ],
    clinicalConsequence:
      'Afectación en la continuidad por caída o bloqueo de servicios de proveedores externos (autorizaciones farmacéuticas, facturación) o propagación a través de enlaces con terceros.',
    color: '#475569', // Slate
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
    badgeBorder: 'border-slate-300',
  },
];

export const DEPENDENCIES: Dependency[] = [
  {
    id: 'dep_tec_it_his',
    fromZoneId: 'infraestructura_ti',
    toZoneId: 'gestion_clinica',
    type: 'tecnica',
    label: 'Infraestructura de Hosting y Red',
    description:
      'El sistema de gestión clínica depende directamente de servidores virtuales, bases de datos y Active Directory alojados en infraestructura TI y redes.',
    clinicalImpact:
      'Si cae el Directorio Activo o los hipervisores, el personal clínico no puede autenticarse ni acceder a la Historia Clínica Electrónica.',
  },
  {
    id: 'dep_tec_it_lab',
    fromZoneId: 'infraestructura_ti',
    toZoneId: 'laboratorio_farmacia',
    type: 'tecnica',
    label: 'Conectividad de Red y Servidores LIS',
    description:
      'Los analizadores biológicos y dispensadores automáticos requieren enlaces de red y servicios de middleware administrados por infraestructura TI y redes.',
    clinicalImpact:
      'Pérdida de comunicación entre equipos de hematología y la base de datos de laboratorio.',
  },
  {
    id: 'dep_tec_it_pacs',
    fromZoneId: 'infraestructura_ti',
    toZoneId: 'diagnostico_imagen',
    type: 'tecnica',
    label: 'Almacenamiento SAN y Red DICOM',
    description:
      'El PACS requiere volúmenes de almacenamiento masivo SAN y ancho de banda dedicado provisto por la zona de infraestructura TI y redes.',
    clinicalImpact:
      'Los radiólogos no pueden cargar estudios tomográficos ni transmitir imágenes a los quirófanos.',
  },
  {
    id: 'dep_op_lab_urgencias',
    fromZoneId: 'laboratorio_farmacia',
    toZoneId: 'urgencias_critica',
    type: 'operativa',
    label: 'Disponibilidad de Analítica Urgente',
    description:
      'Urgencias no puede diagnosticar ni estratificar con seguridad a pacientes con shock o sospecha de infarto sin los resultados del laboratorio.',
    clinicalImpact:
      'Demoras críticas en decisiones terapéuticas, estancamiento de pacientes en urgencias y saturación de camas de observación.',
  },
  {
    id: 'dep_op_pacs_urgencias',
    fromZoneId: 'diagnostico_imagen',
    toZoneId: 'urgencias_critica',
    type: 'operativa',
    label: 'Soporte Imagenológico en Politrauma',
    description:
      'Urgencias y quirófanos de trauma dependen operativamente de la capacidad de TAC y rayos portátiles para intervenir a pacientes críticos.',
    clinicalImpact:
      'Obliga al desvío de ambulancias y cierre del servicio de politrauma agudo.',
  },
  {
    id: 'dep_op_his_urgencias',
    fromZoneId: 'gestion_clinica',
    toZoneId: 'urgencias_critica',
    type: 'operativa',
    label: 'Triaje, Camas y Registro de Ingresos',
    description:
      'La asignación de boxes de urgencia y traslado a camas hospitalarias requiere la operatividad del sistema de admisiones y triaje.',
    clinicalImpact:
      'Colapso administrativo del circuito de urgencias y pérdida de trazabilidad de pacientes en espera.',
  },
  {
    id: 'dep_info_lab_his',
    fromZoneId: 'laboratorio_farmacia',
    toZoneId: 'gestion_clinica',
    type: 'intercambio_info',
    label: 'Transferencia de Informes Analíticos',
    description:
      'Intercambio bidireccional mediante estándares HL7: el HIS emite peticiones de laboratorio y el LIS retorna los resultados analíticos validados.',
    clinicalImpact:
      'Los médicos en planta no reciben las alertas de valores críticos (potasio, troponina, hemograma), comprometiendo la seguridad asistencial.',
  },
  {
    id: 'dep_info_pacs_his',
    fromZoneId: 'diagnostico_imagen',
    toZoneId: 'gestion_clinica',
    type: 'intercambio_info',
    label: 'Informes Radiológicos y Acceso DICOM',
    description:
      'El RIS envía el informe radiológico firmado a la historia clínica del paciente y habilita el visor de imágenes integrado en el puesto clínico.',
    clinicalImpact:
      'El médico tratante carece de la confirmación diagnóstica formal para iniciar tratamientos oncológicos o quirúrgicos.',
  },
  {
    id: 'dep_info_ext_farmacia',
    fromZoneId: 'conectividad_externa',
    toZoneId: 'laboratorio_farmacia',
    type: 'intercambio_info',
    label: 'Validación de Pólizas y Receta Electrónica',
    description:
      'Intercambio en tiempo real con pasarelas de aseguradoras y recetas interoperables para autorizar dispensaciones farmacológicas.',
    clinicalImpact:
      'Parálisis en la entrega de tratamientos crónicos y oncológicos en farmacias ambulatorias de toda la red.',
  },
];

export const INCIDENT_CASES: IncidentCase[] = [
  {
    id: 'wannacry_nhs',
    name: 'WannaCry en el NHS',
    organization: 'National Health Service (NHS)',
    year: 2017,
    country: 'Reino Unido',
    threatActorOrMalware: 'WannaCry (Gusano / EternalBlue SMBv1)',
    initialPoint: 'Equipos desactualizados con SMBv1 expuesto a redes hospitalarias compartidas',
    initialZoneId: 'infraestructura_ti',
    trajectoryType: 'horizontal_masiva',
    configurationLabel: 'Propagación Horizontal Masiva',
    configurationColor: '#ef4444',
    summary:
      'Afectación rápida y simultánea de 80 de los 236 fideicomisos del NHS británico por autoreplicación masiva en redes poco segmentadas.',
    narrativeText:
      'WannaCry permite observar una propagación horizontal masiva, caracterizada por una afectación rápida de múltiples sistemas sin requerir interacción manual de los operadores. Aprovechando el exploit EternalBlue en el protocolo SMBv1, el ransomware se expandió en minutos por toda la infraestructura compartida, provocando el cifrado simultáneo de estaciones de trabajo, sistemas de diagnóstico y plataformas clínicas, forzando la cancelación de 19.000 citas y desvíos generalizados de urgencias.',
    zonesAffected: [
      'infraestructura_ti',
      'diagnostico_imagen',
      'gestion_clinica',
      'urgencias_critica',
    ],
    dependenciesExploited: ['tecnica', 'operativa'],
    structuralFactors: [
      {
        factor: 'Falta de segmentación de red',
        effect: 'amplificador',
        detail: 'Redes corporativas planas permitieron al gusano saltar de PC en PC sin restricciones perimetrales.',
      },
      {
        factor: 'Heterogeneidad tecnológica y falta de parches',
        effect: 'amplificador',
        detail: 'Miles de máquinas con Windows 7 y XP sin el parche de seguridad MS17-010 aplicado.',
      },
      {
        factor: 'Interruptor kill-switch de dominio web',
        effect: 'limitante',
        detail: 'El registro del dominio sinkhole por parte de un investigador frenó la auto-propagación global.',
      },
    ],
    consequences: [
      '34 organizaciones de salud infectadas; 46 afectadas adicionalmente',
      'Más de 19.000 citas médicas y cirugías suspendidas',
      'Desvío masivo de ambulancias de urgencias hacia centros no afectados',
      'Equipos de radiología (MRI) y análisis inoperativos durante días',
    ],
    containmentAction:
      'Desconexión física total de redes hospitalarias, aislamiento de cables Ethernet y activación del kill-switch de dominio.',
    // Campos exactos de Tabla 3 y Tabla 4 (Massaccesi, 2026)
    vectorEntradaInicial:
      'Explotación de la vulnerabilidad MS17-010 (EternalBlue) vía protocolo SMB; sin interacción del usuario.',
    tecnicaMovimientoLateral:
      'Autopropagación tipo gusano; backdoor mediante SMB; escaneo automático de sistemas vulnerables.',
    trayectoriaZonasTexto:
      'Infraestructura TI y redes → diagnóstico por imagen → gestión clínica → comunicaciones internas → urgencias y atención crítica.',
    cronologia:
      'Propagación masiva en horas (12/05/2017); contención parcial mediante kill switch.',
    patronPropagacion:
      'Horizontal masiva.',
    zonaEntrada: 'Infraestructura TI y redes',
    consecuenciaAsistencialExacta:
      '34 org. infectadas; 46 afectadas. 19.000 citas canceladas. Alto costo económico.',
    fuenteCorpus: 'Ghafur et al. (2019); ENISA (2023)',
    nivelEvidenciaConceptual: 'CONFIRMADO',
    timeline: [
      {
        step: 1,
        phase: 'Vector de Entrada Inicial',
        zoneId: 'infraestructura_ti',
        description:
          'Explotación remota de la vulnerabilidad MS17-010 (EternalBlue) vía protocolo SMBv1 en puerto 445 sin interacción del usuario.',
        contained: false,
      },
      {
        step: 2,
        phase: 'Movimiento Lateral Autónomo a Diagnóstico',
        zoneId: 'diagnostico_imagen',
        description:
          'Autopropagación tipo gusano (worm) con escaneo de puertos 139/445; bloqueo de estaciones PACS y resonadores magnéticos (MRI).',
        dependencyInvolved: 'tecnica',
        contained: false,
      },
      {
        step: 3,
        phase: 'Parálisis de Gestión Clínica y HCE',
        zoneId: 'gestion_clinica',
        description:
          'Cifrado masivo de terminales y servidores; Historias Clínicas Electrónicas (HCE) inaccesibles en plantas de hospitalización.',
        dependencyInvolved: 'tecnica',
        contained: false,
      },
      {
        step: 4,
        phase: 'Colapso Asistencial de Urgencias',
        zoneId: 'urgencias_critica',
        description:
          'Dependencia operativa: parálisis de triaje y admisión de urgencias; desvío generalizado de ambulancias y 19.000 citas canceladas.',
        dependencyInvolved: 'operativa',
        contained: true,
      },
    ],
  },
  {
    id: 'dusseldorf',
    name: 'Hospital Universitario de Düsseldorf',
    organization: 'Universitätsklinikum Düsseldorf (UKD)',
    year: 2020,
    country: 'Alemania',
    threatActorOrMalware: 'DoppelPaymer (Vulnerabilidad Citrix ADC)',
    initialPoint:
      'Compromiso previo de un Citrix NetScaler Gateway utilizado para acceso remoto, mediante una vulnerabilidad explotada antes de la instalación del parche de seguridad.',
    initialZoneId: 'conectividad_externa',
    trajectoryType: 'vertical_cascada',
    configurationLabel: 'Configuración Vertical en Cascada',
    configurationColor: '#f59e0b',
    summary:
      'El compromiso previo de un servicio de acceso remoto precedió a la afectación de la infraestructura interna y a la exclusión de la atención de urgencias durante 13 días.',
    narrativeText:
      'Düsseldorf presenta una configuración vertical en cascada. Un Citrix NetScaler Gateway utilizado para acceso remoto había sido comprometido antes de la instalación del parche de seguridad. La secuencia de movimiento lateral no fue documentada en detalle; se detectaron archivos cifrados en servidores internos y se aisló la infraestructura para limitar una mayor extensión. El hospital quedó excluido de la atención de urgencias durante 13 días y desvió ambulancias mientras recuperaba progresivamente sus sistemas.',
    zonesAffected: [
      'conectividad_externa',
      'infraestructura_ti',
      'gestion_clinica',
      'urgencias_critica',
    ],
    dependenciesExploited: ['tecnica', 'operativa'],
    structuralFactors: [
      {
        factor: 'Vulnerabilidad perimetral de proveedor externo (Citrix)',
        effect: 'amplificador',
        detail: 'Dispositivo gateway de acceso externo sin actualizar permitió ejecución remota de código.',
      },
      {
        factor: 'Dependencia operativa absoluta de urgencias sobre el HIS',
        effect: 'amplificador',
        detail: 'Incapacidad de gestionar ingresos forzó el cierre preventivo completo del área de críticos.',
      },
      {
        factor: 'Identificación errónea del objetivo por el atacante',
        effect: 'limitante',
        detail: 'La nota de rescate iba dirigida a la Universidad de Düsseldorf; entregaron la clave de descifrado al advertir que era un hospital.',
      },
    ],
    consequences: [
      'Cierre/exclusión de urgencias durante 13 días y desvío de ambulancias',
      'Cancelación de cientos de cirugías programadas y consultas',
    ],
    containmentAction:
      'Desconexión de pasarelas perimetrales, contacto policial y obtención de clave de descifrado tras advertir a los atacantes del carácter hospitalario.',
    // Campos exactos de Tabla 3 y Tabla 4 (Massaccesi, 2026)
    vectorEntradaInicial:
      'Compromiso previo de un Citrix NetScaler Gateway utilizado para acceso remoto, mediante una vulnerabilidad explotada antes de la instalación del parche de seguridad.',
    tecnicaMovimientoLateral:
      'La secuencia de movimiento lateral no fue documentada en detalle; se detectaron archivos cifrados en servidores internos y se aisló la infraestructura para limitar una mayor extensión.',
    trayectoriaZonasTexto:
      'Conectividad externa / acceso remoto → infraestructura TI → gestión clínica-asistencial → urgencias y atención crítica.',
    cronologia:
      'Detección: 10/09/2020; exclusión de la atención de urgencias durante 13 días; recuperación progresiva de los sistemas.',
    patronPropagacion:
      'Vertical en cascada. Desde un servicio de acceso remoto comprometido hacia infraestructura y zonas clínicas dependientes.',
    zonaEntrada: 'Conectividad externa / acceso remoto',
    consecuenciaAsistencialExacta:
      'Cierre/exclusión de urgencias durante 13 días y desvío de ambulancias.',
    fuenteCorpus: 'Scroxton (2020); Comisión Europea (2025)',
    nivelEvidenciaConceptual: 'PARCIALMENTE DOCUMENTADO',
    timeline: [
      {
        step: 1,
        phase: 'Vector de Entrada Perimetral',
        zoneId: 'conectividad_externa',
        description:
          'Compromiso previo de un Citrix NetScaler Gateway utilizado para acceso remoto, mediante una vulnerabilidad explotada antes de la instalación del parche de seguridad.',
        contained: false,
      },
      {
        step: 2,
        phase: 'Afectación de Infraestructura Interna',
        zoneId: 'infraestructura_ti',
        description:
          'La secuencia de movimiento lateral no fue documentada en detalle; se detectaron archivos cifrados en servidores internos.',
        dependencyInvolved: 'tecnica',
        contained: false,
      },
      {
        step: 3,
        phase: 'Inoperatividad de Gestión Clínica-Asistencial',
        zoneId: 'gestion_clinica',
        description:
          'Caída total del sistema de gestión hospitalaria (HIS) y bloqueo de admisiones e historias clínicas.',
        dependencyInvolved: 'tecnica',
        contained: false,
      },
      {
        step: 4,
        phase: 'Exclusión de la Atención de Urgencias',
        zoneId: 'urgencias_critica',
        description:
          'Cierre/exclusión de urgencias durante 13 días y desvío de ambulancias.',
        dependencyInvolved: 'operativa',
        contained: true,
      },
    ],
  },
  {
    id: 'hse_conti',
    name: 'HSE - Conti (Irlanda)',
    organization: 'Health Service Executive (HSE)',
    year: 2021,
    country: 'Irlanda',
    threatActorOrMalware: 'Grupo Conti (Cobalt Strike / Ransomware)',
    initialPoint:
      'Phishing: archivo Microsoft Excel malicioso abierto por un usuario el 18/03/2021, provocando una infección de malware en el endpoint inicial.',
    initialZoneId: 'infraestructura_ti',
    trajectoryType: 'lateral_prolongada',
    configurationLabel: 'Configuración Lateral Prolongada',
    configurationColor: '#8b5cf6',
    summary:
      'Fase prolongada de reconocimiento y movimiento lateral durante aproximadamente 8 semanas, desde un endpoint de usuario hasta la red nacional NHN y múltiples servicios sanitarios.',
    narrativeText:
      'HSE muestra una configuración lateral prolongada, con una fase extensa de reconocimiento y movimiento lateral antes de la activación del ransomware. El incidente comenzó en un endpoint de usuario comprometido mediante la apertura de un archivo Microsoft Excel malicioso el 18 de marzo de 2021. Desde ese punto la intrusión alcanzó la red nacional NHN y la infraestructura TI, y posteriormente afectó servicios diagnósticos y asistenciales antes del despliegue del ransomware el 14 de mayo.',
    zonesAffected: [
      'infraestructura_ti',
      'diagnostico_imagen',
      'laboratorio_farmacia',
      'gestion_clinica',
      'urgencias_critica',
    ],
    dependenciesExploited: ['tecnica', 'operativa', 'intercambio_info'],
    structuralFactors: [
      {
        factor: 'Ausencia de segmentación en la red nacional NHN',
        effect: 'amplificador',
        detail: 'Arquitectura de dominio plano permitió saltar entre hospitales y condados sin barreras internas.',
      },
      {
        factor: 'Falta de monitoreo activo de alertas EDR',
        effect: 'amplificador',
        detail: 'Alertas de antivirus generadas semanas antes del ataque no fueron investigadas oportunamente.',
      },
      {
        factor: 'Apagado preventivo de toda la red nacional',
        effect: 'limitante',
        detail: 'La desconexión intencionada evitó el cifrado total pero generó parálisis asistencial de 4 meses.',
      },
    ],
    consequences: [
      '80.000 terminales apagadas en toda Irlanda',
      'Recuperación de más de 4 meses con costo superior a USD 83 millones',
      'Cancelación masiva de tratamientos oncológicos, radioterapia y citas ambulatorias',
      'Retorno masivo y prolongado al registro analógico en papel',
    ],
    containmentAction:
      'Desconexión manual de emergencia de la red nacional sanitaria (NHN), asistencia militar y reconstrucción forense integral.',
    // Campos exactos de Tabla 3 y Tabla 4 (Massaccesi, 2026)
    vectorEntradaInicial:
      'Phishing: archivo Microsoft Excel malicioso abierto por un usuario el 18/03/2021, provocando una infección de malware en el endpoint inicial.',
    tecnicaMovimientoLateral:
      'Cobalt Strike Beacon para reconocimiento, escalada de privilegios y movimiento lateral; aproximadamente 8 semanas de permanencia previa al despliegue del ransomware.',
    trayectoriaZonasTexto:
      'Endpoint de usuario → red nacional NHN → infraestructura TI → radiología → laboratorio y patología → maternidad y oncología → atención primaria.',
    cronologia:
      '8 semanas de movimiento lateral (18/03 → 14/05/2021); recuperación: más de 4 meses.',
    patronPropagacion:
      'Lateral prolongada con activación nacional diferida; reconocimiento extenso previo al cifrado.',
    zonaEntrada: 'Endpoint de usuario (phishing)',
    consecuenciaAsistencialExacta:
      '80.000 terminales apagadas. Recuperación de 4 meses. Costo: USD 83 M. Numerosos pacientes afectados.',
    fuenteCorpus: 'HSE (2021)',
    nivelEvidenciaConceptual: 'CONFIRMADO',
    timeline: [
      {
        step: 1,
        phase: 'Entrada desde un Endpoint de Usuario',
        zoneId: 'infraestructura_ti',
        description:
          'El incidente comenzó en un endpoint de usuario comprometido. Desde ese punto la intrusión alcanzó la red nacional NHN y la infraestructura TI.',
        contained: false,
      },
      {
        step: 2,
        phase: 'Movimiento Lateral Silencioso (8 Semanas)',
        zoneId: 'infraestructura_ti',
        description:
          'Cobalt Strike Beacon para reconocimiento, escalada de privilegios y movimiento lateral; aproximadamente 8 semanas de permanencia previa al despliegue del ransomware.',
        dependencyInvolved: 'tecnica',
        contained: false,
      },
      {
        step: 3,
        phase: 'Afectación de Radiología y PACS',
        zoneId: 'diagnostico_imagen',
        description:
          'Cifrado de servidores de imagenología y desconexión de estaciones diagnósticas.',
        dependencyInvolved: 'tecnica',
        contained: false,
      },
      {
        step: 4,
        phase: 'Interrupción de Laboratorio y Patología',
        zoneId: 'laboratorio_farmacia',
        description:
          'Caída del sistema LIS; analíticas de sangre y patología paralizadas.',
        dependencyInvolved: 'intercambio_info',
        contained: false,
      },
      {
        step: 5,
        phase: 'Suspensión de Maternidad y Oncología',
        zoneId: 'gestion_clinica',
        description:
          'Parálisis asistencial en oncología, quimioterapia y consultas clínicas especializadas.',
        dependencyInvolved: 'operativa',
        contained: false,
      },
      {
        step: 6,
        phase: 'Apagado Defensivo y Colapso Crítico',
        zoneId: 'urgencias_critica',
        description:
          'Desconexión total de emergencia y atención en urgencias en modo degradado durante una recuperación de más de 4 meses.',
        dependencyInvolved: 'operativa',
        contained: true,
      },
    ],
  },
  {
    id: 'clinic_barcelona',
    name: 'Hospital Clínic de Barcelona',
    organization: 'Hospital Clínic de Barcelona',
    year: 2023,
    country: 'España',
    threatActorOrMalware: 'Grupo RansomHouse',
    initialPoint:
      'Vector inicial no divulgado públicamente; ataque de ransomware con cifrado y exfiltración de información.',
    initialZoneId: 'laboratorio_farmacia',
    trajectoryType: 'intra_interorganizacional',
    configurationLabel: 'Intra e Interorganizacional',
    configurationColor: '#0ea5e9',
    summary:
      'Propagación intraorganizacional interna con extensión hacia la red de centros de atención primaria (CAPs) vinculados al consorcio hospitalario.',
    narrativeText:
      'El Clínic mostró una propagación intraorganizacional con extensión interorganizacional hacia su red asistencial vinculada. El vector inicial y la secuencia técnica de movimiento lateral no fueron divulgados públicamente. La documentación permitió identificar la afectación de múltiples sistemas y servicios vinculados al Clínic, con laboratorio y farmacia como primera zona identificable dentro de la trayectoria reconstruida, sin presentarla como punto de entrada confirmado.',
    zonesAffected: [
      'laboratorio_farmacia',
      'urgencias_critica',
      'gestion_clinica',
      'conectividad_externa',
    ],
    dependenciesExploited: ['operativa', 'intercambio_info', 'tecnica'],
    structuralFactors: [
      {
        factor: 'Alta interconexión con centros de atención primaria del consorcio',
        effect: 'amplificador',
        detail: 'Los CAPs dependían de las plataformas analíticas y servidores centrales del hospital sede.',
      },
      {
        factor: 'Copias de seguridad desconectadas (Backups inmutables)',
        effect: 'limitante',
        detail: 'Permitió una restauración progresiva sin pagar el rescate exigido por RansomHouse.',
      },
    ],
    consequences: [
      '150 cirugías programadas complejas canceladas',
      'Más de 4.000 análisis clínicos postergados',
      'Coordinación de urgencias de 3 sedes con otros hospitales de la red de Barcelona',
      '4,5 TB de datos médicos confidenciales exfiltrados y publicados en la Dark Web',
    ],
    containmentAction:
      'Aislamiento de la infraestructura con coordinación de la Agencia de Ciberseguridad de Cataluña y recuperación forense mediante copias limpias.',
    // Campos exactos de Tabla 3 y Tabla 4 (Massaccesi, 2026)
    vectorEntradaInicial:
      'Vector inicial no divulgado públicamente; ataque de ransomware con cifrado y exfiltración de información.',
    tecnicaMovimientoLateral:
      'La secuencia técnica de movimiento lateral no fue divulgada públicamente; se documentó la afectación de múltiples sistemas y servicios vinculados al Clínic.',
    trayectoriaZonasTexto:
      'Laboratorio y farmacia → urgencias y atención crítica (3 sedes) → intercambio de información (4,5 TB exfiltrados) → atención primaria y ambulatorios del consorcio.',
    cronologia: 'Detección: 05/03/2023.',
    patronPropagacion:
      'Intraorganizacional entre zonas, con extensión interorganizacional hacia la red sanitaria vinculada.',
    zonaEntrada: 'No divulgado públicamente',
    consecuenciaAsistencialExacta:
      '150 cirugías canceladas. Coordinación de urgencias con otros hospitales. Datos publicados.',
    fuenteCorpus: 'Hospital Clínic de Barcelona (2023)',
    nivelEvidenciaConceptual: 'PARCIALMENTE DOCUMENTADO',
    timeline: [
      {
        step: 1,
        phase: 'Primera Zona Identificable',
        zoneId: 'laboratorio_farmacia',
        description:
          'El vector inicial no fue divulgado públicamente. Laboratorio y farmacia se muestra como primera zona identificable dentro de la trayectoria reconstruida, no como punto de entrada confirmado.',
        contained: false,
      },
      {
        step: 2,
        phase: 'Impacto Operativo en Urgencias (3 Sedes)',
        zoneId: 'urgencias_critica',
        description:
          'Falta de analíticas urgentes paraliza el triaje en 3 sedes; coordinación con el SEM para derivar pacientes agudos.',
        dependencyInvolved: 'operativa',
        contained: false,
      },
      {
        step: 3,
        phase: 'Parálisis Quirúrgica y Consultas',
        zoneId: 'gestion_clinica',
        description:
          'Cancelación de 150 cirugías programadas y desprogramación de más de 3.000 consultas ambulatorias.',
        dependencyInvolved: 'operativa',
        contained: false,
      },
      {
        step: 4,
        phase: 'Extensión Interorganizacional y Exfiltración',
        zoneId: 'conectividad_externa',
        description:
          'Propagación hacia centros de atención primaria del consorcio; publicación de 4,5 TB de datos médicos en la Dark Web.',
        dependencyInvolved: 'intercambio_info',
        contained: true,
      },
    ],
  },
  {
    id: 'change_healthcare',
    name: 'Change Healthcare (UnitedHealth)',
    organization: 'Change Healthcare / UnitedHealth Group',
    year: 2024,
    country: 'Estados Unidos',
    threatActorOrMalware: 'ALPHV / BlackCat Ransomware',
    initialPoint: 'Credenciales robadas en portal VPN Citrix sin Autenticación Multifactor (MFA)',
    initialZoneId: 'conectividad_externa',
    trajectoryType: 'ecosistemica',
    configurationLabel: 'Configuración Ecosistémica',
    configurationColor: '#10b981',
    summary:
      'El compromiso de un intermediario de compensación crítico paralizó el flujo financiero y de recetas en miles de hospitales y farmacias en todo EE.UU.',
    narrativeText:
      'Change Healthcare permite observar una configuración ecosistémica, porque la afectación de un intermediario crítico termina produciendo consecuencias sobre múltiples organizaciones dependientes. Los atacantes utilizaron credenciales robadas en un servidor Citrix sin MFA el 12 de febrero de 2024; tras 9 días de movimiento lateral interno y exfiltración de información, el ransomware fue desplegado el 21 de febrero. En una encuesta de la AHA, el 74 % de los hospitales participantes informó impactos sobre la atención directa. Aproximadamente 192,7 millones de personas fueron afectadas por la brecha de datos.',
    zonesAffected: [
      'conectividad_externa',
      'infraestructura_ti',
      'laboratorio_farmacia',
      'gestion_clinica',
    ],
    dependenciesExploited: ['tecnica', 'intercambio_info', 'operativa'],
    structuralFactors: [
      {
        factor: 'Acceso remoto crítico sin autenticación multifactor (MFA)',
        effect: 'amplificador',
        detail: 'Credenciales filtradas otorgaron acceso directo a la infraestructura interna del clearinghouse.',
      },
      {
        factor: 'Monopolio/Concentración extrema del intermediario',
        effect: 'amplificador',
        detail: 'Casi el 50% de las reclamaciones de salud de EE.UU. fluían por este único intermediario.',
      },
      {
        factor: 'Desconexión perimetral obligada por terceros',
        effect: 'limitante',
        detail: 'Hospitales y cadenas de farmacias cortaron enlaces para evitar la propagación hacia sus redes internas.',
      },
    ],
    consequences: [
      'En una encuesta de la AHA, el 74 % de los hospitales participantes informó impactos sobre la atención directa',
      'Aproximadamente 192,7 millones de personas fueron afectadas por la brecha de datos',
      'Incapacidad de retirar medicamentos vitales en farmacias de todo el país',
      'Costo de recuperación e impacto superior a USD 1.500 millones',
    ],
    containmentAction:
      'Aislamiento forzoso de plataformas, creación de líneas de crédito de emergencia por más de USD 3.000 M y reconstrucción de infraestructura.',
    // Campos exactos de Tabla 3 y Tabla 4 (Massaccesi, 2026)
    vectorEntradaInicial:
      'Credenciales robadas en servidor de acceso remoto Citrix sin MFA; acceso inicial: 12/02/2024.',
    tecnicaMovimientoLateral:
      'Movimiento lateral interno durante 9 días y exfiltración de información antes del despliegue del ransomware el 21/02/2024.',
    trayectoriaZonasTexto:
      'Servidor remoto → infraestructura TI de CHC → sistemas de procesamiento → farmacia y dispensación → autorización y elegibilidad → gestión clínica.',
    cronologia:
      '9 días entre acceso y cifrado (12/02 → 21/02/2024); recuperación parcial: 2 semanas; costo: más de USD 1.500 M.',
    patronPropagacion:
      'Ecosistémica por intermediario crítico.',
    zonaEntrada: 'Conectividad externa (acceso remoto sin MFA)',
    consecuenciaAsistencialExacta:
      'En una encuesta de la AHA, el 74 % de los hospitales participantes informó impactos sobre la atención directa. Aproximadamente 192,7 millones de personas fueron afectadas por la brecha de datos.',
    fuenteCorpus: 'AHA (2024)',
    nivelEvidenciaConceptual: 'PARCIALMENTE DOCUMENTADO',
    timeline: [
      {
        step: 1,
        phase: 'Vector Inicial: Acceso Remoto sin MFA',
        zoneId: 'conectividad_externa',
        description:
          'Credenciales robadas en servidor Citrix de acceso remoto sin autenticación multifactor (MFA) el 12/02/2024.',
        contained: false,
      },
      {
        step: 2,
        phase: 'Movimiento Lateral y Exfiltración',
        zoneId: 'infraestructura_ti',
        description:
          'Movimiento lateral interno durante 9 días y exfiltración de información antes del despliegue del ransomware el 21/02/2024.',
        dependencyInvolved: 'tecnica',
        contained: false,
      },
      {
        step: 3,
        phase: 'Colapso en Farmacia y Dispensación',
        zoneId: 'laboratorio_farmacia',
        description:
          'Inoperatividad de pasarelas de procesamiento; farmacias de todo el país no pueden verificar copagos ni dispensar recetas.',
        dependencyInvolved: 'intercambio_info',
        contained: false,
      },
      {
        step: 4,
        phase: 'Bloqueo de Autorización y Elegibilidad',
        zoneId: 'conectividad_externa',
        description:
          'Corte de interfaces con aseguradoras de salud; imposibilidad de autorizar tratamientos y consultas de cobertura médica.',
        dependencyInvolved: 'intercambio_info',
        contained: false,
      },
      {
        step: 5,
        phase: 'Parálisis Financiera y Asistencial',
        zoneId: 'gestion_clinica',
        description:
          'En una encuesta de la AHA, el 74 % de los hospitales participantes informó impactos sobre la atención directa. Aproximadamente 192,7 millones de personas fueron afectadas por la brecha de datos.',
        dependencyInvolved: 'operativa',
        contained: true,
      },
    ],
  },
  {
    id: 'ardent_health',
    name: 'Ardent Health Services',
    organization: 'Ardent Health Services (30 hospitales en 6 estados)',
    year: 2023,
    country: 'Estados Unidos',
    threatActorOrMalware: 'Ataque de Ransomware corporativo',
    initialPoint: 'No divulgado por completo; actividad no autorizada detectada el 23/11/2023.',
    initialZoneId: 'infraestructura_ti',
    trajectoryType: 'multisitio_centralizada',
    configurationLabel: 'Intrared Corporativa Multi-sitio',
    configurationColor: '#ec4899',
    summary:
      'La afectación simultánea resultó compatible con un efecto de amplificación asociado a infraestructura TI centralizada compartida entre 30 instituciones.',
    narrativeText:
      'Ardent presentó una configuración intrared corporativa multi-sitio. El vector inicial no fue divulgado por completo y se detectó actividad no autorizada el 23 de noviembre de 2023. La trayectoria se infiere a partir de la afectación de infraestructura de TI corporativa centralizada compartida entre 30 instituciones. La afectación simultánea resultó compatible con un efecto de amplificación asociado a esa infraestructura, sin que exista evidencia forense pública suficiente para presentar la trayectoria completa como causalidad técnicamente confirmada.',
    zonesAffected: [
      'infraestructura_ti',
      'gestion_clinica',
      'urgencias_critica',
      'conectividad_externa',
    ],
    dependenciesExploited: ['tecnica', 'operativa', 'intercambio_info'],
    structuralFactors: [
      {
        factor: 'Consolidación de infraestructura tecnológica centralizada',
        effect: 'amplificador',
        detail: 'Los 30 hospitales compartían servidores centrales y el mismo despliegue de Epic EMR.',
      },
      {
        factor: 'Protocolos de desvío de ambulancias y contingencia previa',
        effect: 'limitante',
        detail: 'Coordinación rápida con redes de emergencia 911 locales para amortiguar el riesgo asistencial.',
      },
    ],
    consequences: [
      '30 hospitales afectados en 6 estados norteamericanos',
      'Epic EMR inactivo durante 14 días (restaurado el 07/12/2023)',
      'Portales de pacientes MyChart inoperativos durante 54 días (hasta el 16/01/2024)',
      'Aproximadamente 40.000 pacientes con datos sensibles expuestos',
    ],
    containmentAction:
      'Desconexión preventiva intencional de todos los sistemas corporativos e investigación forense para restauración sede por sede.',
    // Campos exactos de Tabla 3 y Tabla 4 (Massaccesi, 2026)
    vectorEntradaInicial:
      'No divulgado por completo; actividad no autorizada detectada el 23/11/2023.',
    tecnicaMovimientoLateral:
      'Trayectoria inferida a partir de la afectación de infraestructura de TI corporativa centralizada compartida entre 30 instituciones.',
    trayectoriaZonasTexto:
      'Infraestructura TI corporativa centralizada → Epic EMR (30 hospitales) → gestión clínica-asistencial → urgencias → telemedicina y portales de pacientes.',
    cronologia:
      'Detección: 23/11/2023; Epic restaurado: 07/12 (14 días); MyChart restaurado: 16/01/2024 (54 días); ~40.000 pacientes expuestos.',
    patronPropagacion:
      'Intrared corporativa multi-sitio. Amplificación simultánea compatible con una infraestructura de TI centralizada.',
    zonaEntrada: 'Infraestructura TI corporativa centralizada',
    consecuenciaAsistencialExacta:
      '30 hospitales afectados en 6 estados. Epic inactivo 14 días. ~40.000 pacientes expuestos.',
    fuenteCorpus: 'Ardent Health Services (2023)',
    nivelEvidenciaConceptual: 'INFERIDO',
    timeline: [
      {
        step: 1,
        phase: 'Actividad no Autorizada Detectada',
        zoneId: 'infraestructura_ti',
        description:
          'Vector no divulgado por completo; actividad no autorizada detectada el 23/11/2023.',
        contained: false,
      },
      {
        step: 2,
        phase: 'Amplificación Simultánea sobre Epic EMR',
        zoneId: 'gestion_clinica',
        description:
          'La afectación simultánea de Epic EMR en 30 hospitales resultó compatible con un efecto de amplificación asociado a infraestructura TI centralizada.',
        dependencyInvolved: 'tecnica',
        contained: false,
      },
      {
        step: 3,
        phase: 'Cierre y Desvío de Urgencias en 6 Estados',
        zoneId: 'urgencias_critica',
        description:
          'Salas de urgencias forzadas a operar en papel y desviar ambulancias en múltiples estados durante 14 días.',
        dependencyInvolved: 'operativa',
        contained: false,
      },
      {
        step: 4,
        phase: 'Inoperatividad de MyChart y Telemedicina',
        zoneId: 'conectividad_externa',
        description:
          'Portales de pacientes y telemedicina inactivos por 54 días (hasta el 16/01/2024); ~40.000 pacientes expuestos.',
        dependencyInvolved: 'intercambio_info',
        contained: true,
      },
    ],
  },
];

export const DEFENSE_SECTIONS: DefenseSection[] = [
  {
    id: 'sec_1_premisa',
    number: 1,
    title: 'Premisa Central: El riesgo no termina donde comienza',
    speakerCue: 'Apertura de la defensa y justificación del enfoque sistémico',
    fullSpeech:
      'Buenas tardes. Mi trabajo final de grado se titula "Análisis de la propagación del riesgo cibernético entre zonas funcionales en entornos de salud conectados". El trabajo parte de una idea bastante sencilla: en un entorno sanitario conectado, un incidente informático no necesariamente termina donde comienza. Por eso, en lugar de analizar solamente el activo inicialmente comprometido, el trabajo se centra en entender cómo sus consecuencias pueden trasladarse hacia otras funciones de la organización.',
    keyConcepts: [
      'Enfoque sistémico vs. análisis de activo aislado',
      'La consecuencia puede manifestarse lejos del punto de intrusión',
      'Preservación de la función asistencial como objetivo último',
    ],
    highlightQuote:
      'En un entorno sanitario conectado, un incidente informático no necesariamente termina donde comienza.',
    recommendedZoneId: 'infraestructura_ti',
  },
  {
    id: 'sec_2_problema',
    number: 2,
    title: 'El Problema de la Conectividad & Pregunta Central',
    speakerCue: 'Tensión entre beneficio clínico y vulnerabilidad sistémica',
    fullSpeech:
      'Actualmente, una organización sanitaria ya no puede entenderse como un conjunto de sistemas aislados. La atención depende de redes, sistemas clínicos, plataformas diagnósticas, laboratorios, infraestructura tecnológica y servicios externos que trabajan de manera conectada. Esa conectividad genera una ventaja enorme para la atención sanitaria, pero al mismo tiempo genera dependencia. Y ahí aparece el problema que interesa en este trabajo. Cuanta más conexión existe entre las diferentes funciones, mayor es la posibilidad de que la afectación de un componente produzca consecuencias en otros. Por eso, la misma conectividad que permite sostener la atención también puede actuar como vía para trasladar el impacto de un incidente. A partir de esto formulé la pregunta central: ¿Cómo se propaga el riesgo cibernético entre zonas funcionales a partir de sus dependencias técnicas, operativas y de intercambio de información? Es importante delimitar qué estoy preguntando: el trabajo no intenta determinar qué zona es más riesgosa, ni construir un ranking, ni calcular un valor cuantitativo de riesgo. Lo que busco es reconstruir cómo el impacto puede transferirse entre distintas funciones de un entorno sanitario conectado.',
    keyConcepts: [
      'Paradoja de la conectividad: valor asistencial vs. vector de transferencia',
      'Delimitación: No es ranking ni cálculo numérico, sino reconstrucción cualitativa',
      'Perspectiva de transferencia de consecuencias asistenciales',
    ],
    highlightQuote:
      'La misma conectividad que permite sostener la atención también puede actuar como vía para trasladar el impacto de un incidente.',
    recommendedZoneId: 'conectividad_externa',
  },
  {
    id: 'sec_3_zonas',
    number: 3,
    title: 'Definición de las 6 Zonas Funcionales',
    speakerCue: 'Abstracción analítica para permitir la comparación inter-hospitalaria',
    fullSpeech:
      'Como la pregunta habla de zonas funcionales, primero es necesario aclarar qué entiendo por una zona. En este trabajo no se trata necesariamente de un sector físico del hospital ni tampoco de un único sistema informático. Una zona funcional agrupa sistemas, servicios y procesos que cumplen una determinada función dentro del entorno sanitario. Por ejemplo, una función diagnóstica puede depender de distintas aplicaciones, equipamiento, sistemas de información y procesos, pero para el análisis puede representarse como una zona funcional. Esta abstracción es la que después me permite comparar organizaciones diferentes utilizando categorías comunes. El análisis permitió trabajar con seis zonas funcionales: infraestructura TI y redes, gestión clínica-asistencial, diagnóstico por imagen, laboratorio y farmacia, urgencias y atención crítica, y conectividad externa. Estas categorías no pretenden ser una taxonomía universal de un hospital. Son una agrupación analítica que permite comparar incidentes producidos en organizaciones con estructuras diferentes.',
    keyConcepts: [
      'Zona funcional: agrupación analítica de sistemas, servicios y procesos',
      'Independencia de la distribución física de pabellones o edificios',
      'Estandarización metodológica para comparar organizaciones diversas',
    ],
    highlightQuote:
      'Una zona funcional agrupa sistemas, servicios y procesos que cumplen una determinada función dentro del entorno sanitario.',
    recommendedZoneId: 'gestion_clinica',
  },
  {
    id: 'sec_4_dependencias',
    number: 4,
    title: 'Los 3 Tipos de Dependencias Preexistentes',
    speakerCue: 'Vías preexistentes de propagación (no son ataques)',
    fullSpeech:
      'Una vez definidas las zonas, la siguiente pregunta es: ¿qué las conecta? Para el análisis distinguí tres tipos de dependencia. La primera es la dependencia técnica: ocurre cuando diferentes funciones dependen de infraestructura, redes, plataformas o recursos tecnológicos compartidos. La segunda es la dependencia operativa: una zona puede no estar técnicamente comprometida, pero perder capacidad de funcionar porque otra zona de la que depende dejó de prestar servicio. Y la tercera es la dependencia de intercambio de información: cuando una función necesita transmitir, consultar, procesar o recibir información proveniente de otra zona. Una distinción importante es que estas dependencias no son mecanismos de ataque. Son relaciones preexistentes del entorno sanitario a través de las cuales las consecuencias de un incidente pueden trasladarse. Laboratorio y farmacia puede depender técnicamente de la infraestructura TI. Urgencias puede requerir información producida por laboratorio y, al mismo tiempo, mantener una dependencia operativa respecto de ese servicio. Esto permite entender algo crucial: las zonas pueden estar diferenciadas analíticamente pero no funcionan de manera independiente.',
    keyConcepts: [
      'Dependencia Técnica (infraestructura, cómputo y redes compartidas)',
      'Dependencia Operativa (parálisis por falta del servicio de un tercero)',
      'Intercambio de información (flujos de datos clínicos vitales HL7/DICOM)',
      'Las dependencias NO son mecanismos de ataque, son relaciones preexistentes',
    ],
    highlightQuote:
      'Una zona puede no estar técnicamente comprometida, pero perder capacidad de funcionar porque otra zona de la que depende dejó de prestar servicio.',
    recommendedZoneId: 'laboratorio_farmacia',
  },
  {
    id: 'sec_5_metodologia_hse',
    number: 5,
    title: 'Metodología & Demostración con el Caso HSE',
    speakerCue: 'Diseño de investigación y reconstrucción matricial de incidentes',
    fullSpeech:
      'Sobre esta base se definió el objetivo general: analizar la propagación del riesgo entre zonas funcionales desde una perspectiva sistémica. El trabajo sigue cuatro pasos: primero, identificar las zonas y sus dependencias; segundo, estudiar qué factores pueden favorecer o limitar la propagación; tercero, reconstruir la transferencia del impacto; y finalmente, sistematizar las configuraciones observadas. Utilicé un diseño documental, cualitativo, retrospectivo, descriptivo y comparativo sobre seis casos intencionales: WannaCry en el NHS, Düsseldorf, HSE-Conti, el Clínic de Barcelona, Change Healthcare y Ardent Health Services. Voy a utilizar HSE únicamente como ejemplo del procedimiento. El incidente parte de un endpoint de usuario comprometido mediante phishing. La documentación permitió reconstruir una etapa prolongada de reconocimiento y movimiento lateral previa al despliegue del ransomware. A partir de ahí, la trayectoria alcanza la red nacional, infraestructura tecnológica y posteriormente diferentes servicios diagnósticos y asistenciales. Con la matriz transformo esa reconstrucción en categorías comparables: punto inicial, zonas, dependencias, ruta, consecuencias y contención. Lo relevante no es solamente que un endpoint haya sido comprometido, sino que un incidente localizado terminó generando consecuencias en funciones diferentes de aquella donde comenzó.',
    keyConcepts: [
      'Diseño documental, cualitativo, retrospectivo, descriptivo y comparativo',
      'Matriz de categorías comparables (Punto inicial, Zonas, Dependencias, Ruta, Consecuencias, Contención)',
      'Caso HSE como arquetipo de movimiento lateral encubierto',
    ],
    highlightQuote:
      'Lo relevante no es solamente que un endpoint haya sido comprometido, sino que un incidente localizado terminó generando consecuencias en funciones diferentes de aquella donde comenzó.',
    recommendedZoneId: 'diagnostico_imagen',
  },
  {
    id: 'sec_6_configuraciones',
    number: 6,
    title: 'Condiciones Estructurales & Las 6 Configuraciones',
    speakerCue: 'Sistematización comparativa de los seis casos empíricos',
    fullSpeech:
      'Además de las dependencias, el análisis permitió identificar condiciones estructurales que pueden modificar el alcance: la segmentación de red, la heterogeneidad tecnológica, la dependencia de terceros, la interoperabilidad y los controles de acceso y autenticación. Las dependencias ayudan a entender por dónde puede trasladarse el impacto; los factores estructurales ayudan a entender qué condiciones pueden favorecer o limitar esa transferencia. Cuando comparé las trayectorias reconstruidas, aparecieron configuraciones diferentes: WannaCry permite observar una propagación horizontal masiva, caracterizada por afectación rápida de múltiples sistemas. Düsseldorf presenta una configuración vertical en cascada, donde la interrupción de capacidades de infraestructura genera consecuencias sucesivas hacia otras funciones. HSE muestra una configuración lateral prolongada, con una fase extensa de movimiento lateral antes de la activación. Y Change Healthcare permite observar una configuración ecosistémica, porque la afectación de un intermediario crítico produce consecuencias sobre múltiples organizaciones dependientes. Los otros dos casos también presentaron configuraciones diferenciadas: el Clínic mostró una propagación intraorganizacional con extensión interorganizacional hacia su red vinculada, y Ardent presentó una configuración intrared corporativa multi-sitio, compatible con un efecto de amplificación por infraestructura centralizada.',
    keyConcepts: [
      'Factores estructurales modulan (favorecen o limitan) la transferencia',
      'Horizontal Masiva (WannaCry)',
      'Vertical en Cascada (Düsseldorf)',
      'Lateral Prolongada (HSE)',
      'Ecosistémica (Change Healthcare)',
      'Intra e Interorganizacional (Clínic de Barcelona)',
      'Intrared Corporativa Multi-sitio (Ardent Health Services)',
    ],
    highlightQuote:
      'Las dependencias ayudan a entender por dónde puede trasladarse el impacto; los factores estructurales ayudan a entender qué condiciones pueden favorecer o limitar esa transferencia.',
    recommendedZoneId: 'urgencias_critica',
  },
  {
    id: 'sec_7_resiliencia',
    number: 7,
    title: 'Implicancias Finales: Las Cuatro Acciones Estratégicas',
    speakerCue: 'Cierre de la defensa: De la crisis a la resiliencia sistémica',
    fullSpeech:
      'A partir de estos resultados aparece una pregunta distinta: ¿cómo evitar que un incidente localizado se convierta en una crisis sistémica? Proteger los activos individuales continúa siendo necesario. Pero el análisis sugiere que la protección del activo por sí sola no permite comprender todo el problema. También necesitamos entender de qué depende ese activo y qué funciones pueden verse afectadas si deja de estar disponible. Por eso, la implicancia final puede resumirse en cuatro acciones: Proteger, porque prevenir y proteger los activos continúa siendo indispensable. Comprender, porque necesitamos conocer las dependencias que conectan las funciones. Contener, porque cuando el incidente ocurre necesitamos limitar las rutas por las que sus consecuencias pueden propagarse. Y mantener, porque el objetivo final en un entorno sanitario es preservar las funciones esenciales y la continuidad asistencial. Por eso, si tuviera que resumir todo el trabajo en una sola frase, sería: En un entorno sanitario conectado, el riesgo no permanece necesariamente donde comienza. Y de ahí surge la idea final: la resiliencia requiere prevenir, pero también limitar la capacidad de propagación. Muchas gracias por su atención. Quedo a disposición para las preguntas que quieran realizar.',
    keyConcepts: [
      'Proteger (prevención sobre activos individuales)',
      'Comprender (mapeo de dependencias técnicas, operativas y de datos)',
      'Contener (limitación dinámica de rutas de propagación)',
      'Mantener (continuidad asistencial y modos de degradación segura)',
      'Axioma final de resiliencia sanitaria',
    ],
    highlightQuote:
      'En un entorno sanitario conectado, el riesgo no permanece necesariamente donde comienza. La resiliencia requiere prevenir, pero también limitar la capacidad de propagación.',
    recommendedZoneId: 'infraestructura_ti',
  },
];

export const STRUCTURAL_FACTORS = [
  {
    id: 'segmentacion',
    title: 'Segmentación de Red',
    type: 'limitante' as const,
    description:
      'Aislamiento de VLANs y microsegmentación que impide el tráfico no autorizado entre zonas funcionales (ej. aislar modalidades de radiología de terminales de oficina).',
    recommendation: 'Segmentar redes médicas (VLAN PACS, VLAN LIS, VLAN IoT biomédico) con firewalls de inspección profunda.',
  },
  {
    id: 'heterogeneidad',
    title: 'Heterogeneidad Tecnológica y Dispositivos Médicos',
    type: 'amplificador' as const,
    description:
      'Coexistencia de sistemas operativos obsoletos integrados en equipamiento electromédico (TACs con Windows XP/7) que no admiten parches regulares.',
    recommendation: 'Aislar equipos con sistemas heredados en zonas de red de solo lectura con control perimetral estricto.',
  },
  {
    id: 'terceros',
    title: 'Dependencia de Terceros y Servicios Externos',
    type: 'amplificador' as const,
    description:
      'Conexión continua con clearinghouses, plataformas cloud, proveedores de telemedicina y túneles VPN de soporte técnico de fabricantes.',
    recommendation: 'Exigir MFA, sesiones temporales grabadas y auditorías de seguridad a accesos remotos de proveedores.',
  },
  {
    id: 'interoperabilidad',
    title: 'Interoperabilidad (HL7, DICOM, FHIR)',
    type: 'amplificador' as const,
    description:
      'Protocolos estándar diseñados originalmente para la fluidez clínica sin mecanismos nativos de cifrado ni autenticación granular.',
    recommendation: 'Canalizar mensajería HL7 a través de motores de integración seguros con TLS y validación de esquemas.',
  },
  {
    id: 'autenticacion',
    title: 'Controles de Acceso y Gestión de Actualizaciones',
    type: 'limitante' as const,
    description:
      'Autenticación multifactor (MFA) obligatoria, principio de mínimo privilegio en Active Directory y políticas ágiles de mitigación de vulnerabilidades.',
    recommendation: 'Desplegar MFA innegociable en todo acceso remoto perimetral y segmentar privilegios de administrador de dominio.',
  },
];

export const RESILIENCE_PILLARS = [
  {
    pillar: 'PROTEGER',
    title: 'Fortalecimiento de Activos',
    subtitle: 'Prevención continua',
    actionText: 'Prevenir y blindar activos individuales continúa siendo indispensable.',
    checklist: [
      'Hardening de servidores, terminales médicas y dispositivos biomédicos',
      'Despliegue de agentes EDR/XDR supervisados 24/7',
      'Gestión rigurosa de vulnerabilidades y parches críticos en ventanas asistenciales',
      'Autenticación Multifactor (MFA) estricta en todos los accesos externos',
    ],
    color: '#0284c7',
  },
  {
    pillar: 'COMPRENDER',
    title: 'Cartografía de Dependencias',
    subtitle: 'Conocer las rutas ocultas',
    actionText: 'Conocer las dependencias técnicas, operativas y de información que enlazan las funciones sanitarias.',
    checklist: [
      'Mapeo exhaustivo de flujos HL7, DICOM y enlaces de red entre servicios',
      'Análisis de impacto en el negocio asistencial (BIA) orientado a zonas funcionales',
      'Identificación de "puntos únicos de falla" operativos (ej. LIS o pasarela externa)',
      'Claridad en qué servicios asistenciales colapsan si cae una función adyacente',
    ],
    color: '#8b5cf6',
  },
  {
    pillar: 'CONTENER',
    title: 'Limitación de la Propagación',
    subtitle: 'Contener las vías de impacto',
    actionText: 'Cuando el incidente ocurre, limitar las rutas por las que sus consecuencias pueden propagarse.',
    checklist: [
      'Protocolos de desconexión selectiva por zonas sin apagar todo el hospital',
      'Aislamiento dinámico de redes mediante firewalls internos y control de acceso a la red (NAC)',
      'Corte de enlaces WAN y VPNs con centros secundarios para evitar extensión interorganizacional',
      'Copias de seguridad inmutables fuera de línea (air-gapped) protegidas de ransomware',
    ],
    color: '#d97706',
  },
  {
    pillar: 'MANTENER',
    title: 'Continuidad Asistencial',
    subtitle: 'Resiliencia clínica humana',
    actionText: 'Preservar las funciones asistenciales esenciales y la seguridad del paciente durante el ataque.',
    checklist: [
      'Manuales y simulacros regulares de operación analógica en papel para personal médico',
      'Redes de derivación protocolizadas para códigos infarto, ictus y politrauma',
      'Autonomía operativa local de dispositivos de soporte de vida en UCI y quirófanos',
      'Estrategias de comunicación de crisis médica transparente y coordinada',
    ],
    color: '#059669',
  },
];

export const TABLE_5_COMPARISON: RiskApproachComparison[] = [
  {
    aspecto: 'Objeto de protección',
    enfoqueTradicional: 'Activo individual (servidor, PC, base de datos)',
    propuestaSistemica: 'Continuidad del servicio (red asistencial integrada)',
  },
  {
    aspecto: 'Visión de la red',
    enfoqueTradicional: 'Perimetral (firewall exterior, perímetro duro)',
    propuestaSistemica: 'Segmentación por zonas funcionales internas',
  },
  {
    aspecto: 'Gestión de terceros',
    enfoqueTradicional: 'Auditoría de cumplimiento administrativo',
    propuestaSistemica: 'Integración como nodo crítico en el mapa de dependencias',
  },
  {
    aspecto: 'Prioridad de defensa',
    enfoqueTradicional: 'Disponibilidad general y confidencialidad TI',
    propuestaSistemica: 'Resiliencia priorizada en urgencias y pacientes críticos',
  },
  {
    aspecto: 'Respuesta al incidente',
    enfoqueTradicional: 'Técnica y aislada (aislar el servidor infectado)',
    propuestaSistemica: 'Sistémica (anticipar la interdependencia técnica y operativa entre zonas)',
  },
];

export const TABLE_1_CORPUS: CorpusSource[] = [
  {
    fuente: 'Ghafur et al. (2019)',
    tipoAporte: 'Análisis académico retrospectivo de impacto asistencial',
    casosAreasVinculadas: 'WannaCry – NHS',
    patronPropagacionSustenta: 'Horizontal masiva (condición habilitadora: parcheo)',
  },
  {
    fuente: 'Scroxton (2020)',
    tipoAporte: 'Cobertura periodística especializada del incidente y fallo judicial',
    casosAreasVinculadas: 'Hospital Universitario de Düsseldorf',
    patronPropagacionSustenta: 'Vertical en cascada desde proveedor externo',
  },
  {
    fuente: 'HSE (2021)',
    tipoAporte: 'Informe de incidente primario post-ataque Conti',
    casosAreasVinculadas: 'HSE Conti (Irlanda)',
    patronPropagacionSustenta: 'Lateral prolongada con activación nacional diferida',
  },
  {
    fuente: 'Hospital Clínic de Barcelona (2023)',
    tipoAporte: 'Documentación técnica y comunicados oficiales del consorcio',
    casosAreasVinculadas: 'Clínic de Barcelona',
    patronPropagacionSustenta: 'Intraorganizacional con extensión interorganizacional',
  },
  {
    fuente: 'Ardent Health Services (2023)',
    tipoAporte: 'Divulgación de incidente regulatorio y SEC filings',
    casosAreasVinculadas: 'Ardent Health Services (30 hospitales)',
    patronPropagacionSustenta: 'Intrared corporativa multi-sitio (amplificación centralizada)',
  },
  {
    fuente: 'AHA (2024)',
    tipoAporte: 'Análisis de impacto técnico y asistencial nacional',
    casosAreasVinculadas: 'Change Healthcare (UnitedHealth)',
    patronPropagacionSustenta: 'Ecosistémica por intermediario crítico',
  },
  {
    fuente: 'ENISA (2023)',
    tipoAporte: 'Informe de ciberamenazas del sector sanitario europeo',
    casosAreasVinculadas: 'WannaCry; patrones generales de ransomware',
    patronPropagacionSustenta: 'Horizontal masiva; condiciones habilitadoras (parcheo, configuración)',
  },
  {
    fuente: 'INCIBE-CERT (2024)',
    tipoAporte: 'Análisis de vectores y riesgos en infraestructuras críticas',
    casosAreasVinculadas: 'Patrones de propagación (todos los casos)',
    patronPropagacionSustenta: 'Vectores de entrada transversales a todos los patrones',
  },
  {
    fuente: 'Comisión Europea (2025)',
    tipoAporte: 'Plan de acción de ciberseguridad en el sector sanitario',
    casosAreasVinculadas: 'Düsseldorf; resiliencia sistémica en salud',
    patronPropagacionSustenta: 'Vertical en cascada; capacidad de respuesta y recuperación',
  },
  {
    fuente: 'Ministerio de Sanidad de España (2025)',
    tipoAporte: 'Estrategia nacional de ciberseguridad en salud',
    casosAreasVinculadas: 'Cadena de suministro; infraestructuras hospitalarias',
    patronPropagacionSustenta: 'Vertical en cascada (riesgo de terceros e intermediarios)',
  },
  {
    fuente: 'Cervera García y Goussens (2024)',
    tipoAporte: 'Marco teórico de ciberseguridad sanitaria y taxonomía',
    casosAreasVinculadas: 'Interdependencia entre zonas funcionales',
    patronPropagacionSustenta: 'Fundamento teórico de las dependencias técnicas y operativas',
  },
  {
    fuente: 'Londoño-Puentes (2024)',
    tipoAporte: 'Análisis de interoperabilidad en sistemas de salud',
    casosAreasVinculadas: 'Fragmentación de sistemas y puntos ciegos asistenciales',
    patronPropagacionSustenta: 'Factor estructural: heterogeneidad tecnológica',
  },
];

export const STRUCTURAL_CATALYSTS: StructuralFactor[] = [
  {
    id: 'segmentacion',
    nombre: 'Ausencia o Deficiencia de Segmentación de Red',
    descripcion:
      'El factor catalizador más crítico documentado en el TFG. La falta de barreras lógicas internas permite el movimiento lateral autónomo o prolongado sin restricciones entre zonas asistenciales.',
    casosIlustrativos: ['WannaCry – NHS', 'HSE Ireland – Conti', 'Ardent Health Services'],
  },
  {
    id: 'heterogeneidad',
    nombre: 'Heterogeneidad Tecnológica y Sistemas Heredados (Legacy)',
    descripcion:
      'Convivencia forzada de sistemas operativos obsoletos sin soporte junto a infraestructura moderna. Genera zonas de sombra y eslabones débiles que no admiten agentes de seguridad ni parches periódicos.',
    casosIlustrativos: ['WannaCry – NHS (MS17-010 / Win 7)', 'HSE Ireland (modalidades diagnósticas legadas)'],
  },
  {
    id: 'cadena_suministro',
    nombre: 'Fragilidad de la Cadena de Suministro y Proveedores Críticos',
    descripcion:
      'Vulnerabilidades en gateways o software de terceros que otorgan accesos perimetrales privilegiados no auditados formalmente como parte de la red clínica.',
    casosIlustrativos: ['Hospital Univ. de Düsseldorf (Citrix CVE-2019-19781)', 'Change Healthcare (servidor remoto Citrix)'],
  },
  {
    id: 'paradoja_interoperabilidad',
    nombre: 'Paradoja de la Interoperabilidad (HL7 FHIR / DICOM)',
    descripcion:
      'La exigencia de integración continua para mejorar la calidad clínica encadena las zonas funcionales. Al priorizar disponibilidad e intercambio sin seguridad nativa, amplía drásticamente la superficie de ataque.',
    casosIlustrativos: ['Change Healthcare (compensación nacional)', 'Clínic de Barcelona (red consorcial)'],
  },
  {
    id: 'autenticacion',
    nombre: 'Ausencia o Deficiencia de Controles de Autenticación y MFA',
    descripcion:
      'Falta de autenticación multifactor en accesos remotos críticos y demoras operativas en el despliegue de parches de seguridad conocidos.',
    casosIlustrativos: ['Change Healthcare (acceso VPN sin MFA)', 'WannaCry (parche MS17-010 disponible y no aplicado)'],
  },
];
