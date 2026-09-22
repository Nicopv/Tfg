import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { FUNCTIONAL_ZONES, DEPENDENCIES, INCIDENT_CASES } from '../data/thesisContent';
import { DependencyType, IncidentCase } from '../types';

export interface D3NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  shortName: string;
  category: string;
  color: string;
  description: string;
  typicalSystems: string[];
  clinicalConsequence: string;
  badgeBg: string;
  iconName: string;
  inDegree: number;
  outDegree: number;
}

export interface D3LinkDatum extends d3.SimulationLinkDatum<D3NodeDatum> {
  id: string;
  source: string | D3NodeDatum;
  target: string | D3NodeDatum;
  type: DependencyType;
  label: string;
  description: string;
  clinicalImpact: string;
}

export const DEPENDENCY_METAS: Record<
  DependencyType,
  { stroke: string; label: string; strokeDash: string; bg: string; text: string }
> = {
  tecnica: {
    stroke: '#0284c7', // Sky-600
    label: 'Técnica (Red / AD / Servidores)',
    strokeDash: 'none',
    bg: 'bg-sky-50 border-sky-300 text-sky-800',
    text: 'text-sky-600',
  },
  operativa: {
    stroke: '#d97706', // Amber-600
    label: 'Operativa (Flujo Asistencial)',
    strokeDash: '6 3',
    bg: 'bg-amber-50 border-amber-300 text-amber-800',
    text: 'text-amber-600',
  },
  intercambio_info: {
    stroke: '#8b5cf6', // Violet-500
    label: 'Intercambio de Información',
    strokeDash: '3 3',
    bg: 'bg-violet-50 border-violet-300 text-violet-800',
    text: 'text-violet-600',
  },
};

// Logical clinical layout coordinates (normalized 0-1)
const LOGICAL_TARGETS: Record<string, { xRatio: number; yRatio: number }> = {
  conectividad_externa: { xRatio: 0.50, yRatio: 0.14 }, // Perímetro y proveedores externos
  infraestructura_ti: { xRatio: 0.22, yRatio: 0.40 },   // Núcleo tecnológico y cómputo
  gestion_clinica: { xRatio: 0.78, yRatio: 0.40 },      // Historias Clínicas (HIS/HCE)
  diagnostico_imagen: { xRatio: 0.20, yRatio: 0.75 },   // Radiología y PACS
  laboratorio_farmacia: { xRatio: 0.80, yRatio: 0.75 }, // Laboratorio (LIS) y Farmacia
  urgencias_critica: { xRatio: 0.50, yRatio: 0.88 },    // Nodo receptor crítico final
};

interface D3DependencyGraphProps {
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string | null) => void;
  selectedDependencyId?: string | null;
  onSelectDependency?: (depId: string | null) => void;
  activeFilter?: DependencyType | 'all';
  onFilterChange?: (filter: DependencyType | 'all') => void;
  layoutMode?: 'force' | 'clinical';
  onLayoutModeChange?: (mode: 'force' | 'clinical') => void;
  activeSimulationCaseId?: string | null;
  onSimulationCaseChange?: (caseId: string | null) => void;
  onGoToMatrix?: (caseId?: string) => void;
}

export const D3DependencyGraph: React.FC<D3DependencyGraphProps> = ({
  selectedZoneId,
  onSelectZone,
  selectedDependencyId,
  onSelectDependency,
  activeFilter = 'all',
  onFilterChange,
  layoutMode = 'clinical',
  onLayoutModeChange,
  activeSimulationCaseId = null,
  onSimulationCaseChange,
  onGoToMatrix,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<D3NodeDatum, D3LinkDatum> | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Simulation controls state
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(activeSimulationCaseId || null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 1.5x, 2x

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);

  // Sync external activeSimulationCaseId
  useEffect(() => {
    if (activeSimulationCaseId !== undefined) {
      setSelectedCaseId(activeSimulationCaseId);
      setCurrentStep(0);
      if (activeSimulationCaseId) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }
  }, [activeSimulationCaseId]);

  // Active case object
  const activeCase: IncidentCase | null = useMemo(() => {
    if (!selectedCaseId) return null;
    return INCIDENT_CASES.find((c) => c.id === selectedCaseId) || null;
  }, [selectedCaseId]);

  // Handle auto-advance playback
  useEffect(() => {
    if (!isPlaying || !activeCase) return;

    const intervalMs = Math.round(2600 / playbackSpeed);
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < activeCase.timeline.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, activeCase, playbackSpeed]);

  // Current simulation state details
  const simState = useMemo(() => {
    if (!activeCase) return null;
    const timeline = activeCase.timeline;
    const safeIndex = Math.min(currentStep, timeline.length - 1);
    const currentEvent = timeline[safeIndex];

    const compromisedZoneIds = timeline.slice(0, safeIndex + 1).map((e) => e.zoneId);
    const activeZoneId = currentEvent ? currentEvent.zoneId : null;
    const prevZoneId = safeIndex > 0 ? timeline[safeIndex - 1].zoneId : null;

    return {
      safeIndex,
      currentEvent,
      compromisedZoneIds,
      activeZoneId,
      prevZoneId,
      isFinalStep: safeIndex === timeline.length - 1,
    };
  }, [activeCase, currentStep]);

  // Compute node degrees
  const nodesData: D3NodeDatum[] = useMemo(() => {
    return FUNCTIONAL_ZONES.map((zone) => {
      const inDegree = DEPENDENCIES.filter((d) => d.toZoneId === zone.id).length;
      const outDegree = DEPENDENCIES.filter((d) => d.fromZoneId === zone.id).length;
      return {
        ...zone,
        inDegree,
        outDegree,
      };
    });
  }, []);

  // Filter links
  const linksData: D3LinkDatum[] = useMemo(() => {
    return DEPENDENCIES.filter((dep) => {
      if (activeFilter === 'all') return true;
      return dep.type === activeFilter;
    }).map((dep) => ({
      ...dep,
      source: dep.fromZoneId,
      target: dep.toZoneId,
    }));
  }, [activeFilter]);

  // Main D3 initialization and update hook
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = Math.max(520, container.clientHeight || 560);

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Clear previous elements
    svg.selectAll('*').remove();

    // Defs: Arrowhead markers & drop shadows & gradients
    const defs = svg.append('defs');

    // Create marker for each dependency type
    Object.entries(DEPENDENCY_METAS).forEach(([typeKey, meta]) => {
      defs
        .append('marker')
        .attr('id', `d3-arrow-${typeKey}`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 38)
        .attr('refY', 5)
        .attr('markerWidth', 7)
        .attr('markerHeight', 7)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 1.5 L 8 5 L 0 8.5 z')
        .attr('fill', meta.stroke);

      // Highlighted marker
      defs
        .append('marker')
        .attr('id', `d3-arrow-${typeKey}-highlight`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 40)
        .attr('refY', 5)
        .attr('markerWidth', 9)
        .attr('markerHeight', 9)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 1 L 9 5 L 0 9 z')
        .attr('fill', meta.stroke);
    });

    // Special danger attack marker
    defs
      .append('marker')
      .attr('id', 'd3-arrow-attack')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 40)
      .attr('refY', 5)
      .attr('markerWidth', 9)
      .attr('markerHeight', 9)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 1 L 9 5 L 0 9 z')
      .attr('fill', '#ef4444');

    // Drop shadow filter for nodes
    const filter = defs.append('filter').attr('id', 'd3-node-shadow').attr('height', '130%');
    filter
      .append('feDropShadow')
      .attr('dx', '0')
      .attr('dy', '2')
      .attr('stdDeviation', '4')
      .attr('flood-color', '#0f172a')
      .attr('flood-opacity', '0.15');

    // Glow filter for selected node
    const glow = defs.append('filter').attr('id', 'd3-glow').attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
    glow.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'blur');
    glow.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    // Red glow filter for attack node
    const attackGlow = defs.append('filter').attr('id', 'd3-attack-glow').attr('x', '-40%').attr('y', '-40%').attr('width', '180%').attr('height', '180%');
    attackGlow.append('feGaussianBlur').attr('stdDeviation', '8').attr('result', 'blur');
    attackGlow.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    // Root group for zoom/pan
    const g = svg.append('g').attr('class', 'd3-canvas-root');

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3.0])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Background subtle grid lines
    const gridG = g.append('g').attr('class', 'd3-grid').attr('opacity', 0.04);
    for (let x = -width; x < width * 2; x += 60) {
      gridG.append('line').attr('x1', x).attr('y1', -height).attr('x2', x).attr('y2', height * 2).attr('stroke', '#0f172a');
    }
    for (let y = -height; y < height * 2; y += 60) {
      gridG.append('line').attr('x1', -width).attr('y1', y).attr('x2', width * 2).attr('y2', y).attr('stroke', '#0f172a');
    }

    // Clone data to avoid in-place mutation conflicts
    const nodes: D3NodeDatum[] = nodesData.map((d) => {
      const targetPos = LOGICAL_TARGETS[d.id];
      const initialX = targetPos ? targetPos.xRatio * width : width / 2;
      const initialY = targetPos ? targetPos.yRatio * height : height / 2;
      return {
        ...d,
        x: initialX,
        y: initialY,
      };
    });

    const links: D3LinkDatum[] = linksData.map((d) => ({ ...d }));

    // Edge Groups
    const linkGroup = g.append('g').attr('class', 'd3-links');
    const linkLabelGroup = g.append('g').attr('class', 'd3-link-labels');
    const nodeGroup = g.append('g').attr('class', 'd3-nodes');

    // Helper to calculate smooth curved edge path with avoidance
    const computeCurvedPath = (d: D3LinkDatum) => {
      const source = d.source as D3NodeDatum;
      const target = d.target as D3NodeDatum;
      const sx = source.x ?? 0;
      const sy = source.y ?? 0;
      const tx = target.x ?? 0;
      const ty = target.y ?? 0;

      const dx = tx - sx;
      const dy = ty - sy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      // Deterministic offset to separate bidirectional links
      const isReverse = String(source.id) > String(target.id);
      const curvature = (isReverse ? -1 : 1) * 26 * (dist / 320);

      const nx = -dy / dist;
      const ny = dx / dist;

      const midX = (sx + tx) / 2 + nx * curvature;
      const midY = (sy + tx) / 2 + ny * curvature;

      const path = `M ${sx} ${sy} Q ${midX} ${midY} ${tx} ${ty}`;
      return { path, cx: midX, cy: midY };
    };

    // Links selection
    const linkPaths = linkGroup
      .selectAll<SVGPathElement, D3LinkDatum>('path.d3-link')
      .data(links, (d) => d.id)
      .join('path')
      .attr('class', 'd3-link')
      .attr('id', (d) => `d3-link-${d.id}`)
      .attr('fill', 'none')
      .attr('stroke', (d) => DEPENDENCY_METAS[d.type].stroke)
      .attr('stroke-width', (d) => (d.id === selectedDependencyId ? 3.5 : 2))
      .attr('stroke-dasharray', (d) => DEPENDENCY_METAS[d.type].strokeDash)
      .attr('marker-end', (d) => `url(#d3-arrow-${d.type})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onSelectDependency?.(d.id === selectedDependencyId ? null : d.id);
      })
      .on('mouseenter', (event, d) => {
        setHoveredLinkId(d.id);
      })
      .on('mouseleave', () => {
        setHoveredLinkId(null);
      });

    // Transparent thicker hitbox for easier clicking/hovering
    linkGroup
      .selectAll<SVGPathElement, D3LinkDatum>('path.d3-link-hitbox')
      .data(links, (d) => `${d.id}-hitbox`)
      .join('path')
      .attr('class', 'd3-link-hitbox')
      .attr('fill', 'none')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 22)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onSelectDependency?.(d.id === selectedDependencyId ? null : d.id);
      })
      .on('mouseenter', (event, d) => {
        setHoveredLinkId(d.id);
      })
      .on('mouseleave', () => {
        setHoveredLinkId(null);
      });

    // Link label pills
    const linkLabels = linkLabelGroup
      .selectAll<SVGGElement, D3LinkDatum>('g.d3-link-label')
      .data(links, (d) => d.id)
      .join('g')
      .attr('class', 'd3-link-label')
      .attr('id', (d) => `d3-label-${d.id}`)
      .style('pointer-events', 'none');

    linkLabels
      .append('rect')
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('x', -38)
      .attr('y', -9)
      .attr('width', 76)
      .attr('height', 18)
      .attr('fill', '#ffffff')
      .attr('stroke', (d) => DEPENDENCY_METAS[d.type].stroke)
      .attr('stroke-width', 1)
      .attr('opacity', 0.95);

    linkLabels
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 3.5)
      .attr('font-size', '8.5px')
      .attr('font-weight', '600')
      .attr('fill', '#1e293b')
      .text((d) => (d.type === 'tecnica' ? 'Técnica' : d.type === 'operativa' ? 'Operativa' : 'Información'));

    // Nodes selection
    const nodeNodes = nodeGroup
      .selectAll<SVGGElement, D3NodeDatum>('g.d3-node')
      .data(nodes, (d) => d.id)
      .join('g')
      .attr('class', 'd3-node')
      .attr('id', (d) => `d3-node-${d.id}`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onSelectZone(selectedZoneId === d.id ? null : d.id);
      })
      .on('mouseenter', (event, d) => {
        setHoveredNodeId(d.id);
      })
      .on('mouseleave', () => {
        setHoveredNodeId(null);
      });

    // Node outer halo for selected
    nodeNodes
      .append('circle')
      .attr('class', 'node-halo')
      .attr('r', 38)
      .attr('fill', (d) => d.color)
      .attr('opacity', (d) => (d.id === selectedZoneId ? 0.25 : 0))
      .attr('filter', 'url(#d3-glow)');

    // Outer border ring
    nodeNodes
      .append('circle')
      .attr('class', 'node-outer-ring')
      .attr('r', 32)
      .attr('fill', '#ffffff')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', (d) => (d.id === selectedZoneId ? 3.5 : 2))
      .attr('filter', 'url(#d3-node-shadow)');

    // Inner filled circle
    nodeNodes
      .append('circle')
      .attr('class', 'node-inner-circle')
      .attr('r', 20)
      .attr('fill', (d) => d.color)
      .attr('opacity', 0.9);

    // Initial character / symbol inside circle
    nodeNodes
      .append('text')
      .attr('class', 'node-glyph')
      .attr('text-anchor', 'middle')
      .attr('y', 5)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .text((d) => {
        if (d.id === 'infraestructura_ti') return 'TI';
        if (d.id === 'gestion_clinica') return 'HIS';
        if (d.id === 'diagnostico_imagen') return 'RX';
        if (d.id === 'laboratorio_farmacia') return 'LAB';
        if (d.id === 'urgencias_critica') return 'URG';
        if (d.id === 'conectividad_externa') return 'EXT';
        return d.shortName.slice(0, 2).toUpperCase();
      });

    // Degree / Status badge
    const badgeG = nodeNodes.append('g').attr('class', 'node-badge-group').attr('transform', 'translate(18, -20)');
    badgeG
      .append('circle')
      .attr('class', 'node-badge-circle')
      .attr('r', 9)
      .attr('fill', '#0f172a')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5);
    badgeG
      .append('text')
      .attr('class', 'node-badge-text')
      .attr('text-anchor', 'middle')
      .attr('y', 3)
      .attr('font-size', '8px')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .text((d) => `${d.inDegree + d.outDegree}`);

    // Node Name Label underneath
    const labelGroup = nodeNodes.append('g').attr('class', 'node-label-group').attr('transform', 'translate(0, 44)');

    labelGroup
      .append('rect')
      .attr('class', 'node-label-bg')
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('x', -72)
      .attr('y', -10)
      .attr('width', 144)
      .attr('height', 20)
      .attr('fill', '#ffffff')
      .attr('stroke', (d) => (d.id === selectedZoneId ? d.color : '#cbd5e1'))
      .attr('stroke-width', (d) => (d.id === selectedZoneId ? 2 : 1))
      .attr('filter', 'url(#d3-node-shadow)');

    labelGroup
      .append('text')
      .attr('class', 'node-label-text')
      .attr('text-anchor', 'middle')
      .attr('y', 3.5)
      .attr('font-size', '9.5px')
      .attr('font-weight', (d) => (d.id === selectedZoneId ? '700' : '600'))
      .attr('fill', '#0f172a')
      .text((d) => d.shortName);

    // Node Drag Behavior
    const drag = d3
      .drag<SVGGElement, D3NodeDatum>()
      .on('start', (event, d) => {
        if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0);
        if (layoutMode === 'force') {
          d.fx = null;
          d.fy = null;
        }
      });

    nodeNodes.call(drag);

    // SVG Background click deselects
    svg.on('click', () => {
      onSelectZone(null);
      onSelectDependency?.(null);
    });

    // D3 Force Simulation configuration
    const simulation = d3
      .forceSimulation<D3NodeDatum>(nodes)
      .force(
        'link',
        d3
          .forceLink<D3NodeDatum, D3LinkDatum>(links)
          .id((d) => d.id)
          .distance(layoutMode === 'clinical' ? 170 : 150)
          .strength(layoutMode === 'clinical' ? 0.35 : 0.6)
      )
      .force('charge', d3.forceManyBody().strength(layoutMode === 'clinical' ? -420 : -550))
      .force('collision', d3.forceCollide().radius(58))
      .alphaDecay(0.04);

    if (layoutMode === 'force') {
      simulation
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX(width / 2).strength(0.08))
        .force('y', d3.forceY(height / 2).strength(0.08));
    } else {
      // Anchored logical targets for clinical layout
      simulation
        .force(
          'x',
          d3.forceX<D3NodeDatum>((d) => {
            const target = LOGICAL_TARGETS[d.id];
            return target ? target.xRatio * width : width / 2;
          }).strength(0.85)
        )
        .force(
          'y',
          d3.forceY<D3NodeDatum>((d) => {
            const target = LOGICAL_TARGETS[d.id];
            return target ? target.yRatio * height : height / 2;
          }).strength(0.85)
        );
    }

    // Tick update function
    simulation.on('tick', () => {
      nodes.forEach((d) => {
        d.x = Math.max(50, Math.min(width - 50, d.x || width / 2));
        d.y = Math.max(50, Math.min(height - 50, d.y || height / 2));
      });

      linkPaths.attr('d', (d) => {
        const { path } = computeCurvedPath(d);
        return path;
      });

      linkGroup.selectAll<SVGPathElement, D3LinkDatum>('path.d3-link-hitbox').attr('d', (d) => {
        const { path } = computeCurvedPath(d);
        return path;
      });

      linkLabels.attr('transform', (d) => {
        const { cx, cy } = computeCurvedPath(d);
        return `translate(${cx}, ${cy})`;
      });

      nodeNodes.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [nodesData, linksData, layoutMode, activeFilter]);

  // Dynamic visual styling update for hover, selection, and SIMULATION states
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    // If simulation is active, apply high-precision attack trajectory styling
    if (activeCase && simState) {
      const { activeZoneId, prevZoneId, compromisedZoneIds } = simState;

      // Find if there is an active attack edge between prevZoneId and activeZoneId
      const isSimulationActiveLink = (link: D3LinkDatum) => {
        if (!prevZoneId || !activeZoneId) return false;
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        return (sId === prevZoneId && tId === activeZoneId) || (sId === activeZoneId && tId === prevZoneId);
      };

      // Find if link is in the compromised chain
      const isLinkInTrajectory = (link: D3LinkDatum) => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        return compromisedZoneIds.includes(String(sId)) && compromisedZoneIds.includes(String(tId));
      };

      // Update Links in simulation
      svg.selectAll<SVGPathElement, D3LinkDatum>('path.d3-link').each(function (d) {
        const isCurrentAttackEdge = isSimulationActiveLink(d);
        const inTrajectory = isLinkInTrajectory(d);

        let stroke = DEPENDENCY_METAS[d.type].stroke;
        let strokeWidth = 2;
        let opacity = 0.12;
        let marker = `url(#d3-arrow-${d.type})`;

        if (isCurrentAttackEdge) {
          stroke = '#ef4444'; // Red attack highlight
          strokeWidth = 4.5;
          opacity = 1;
          marker = 'url(#d3-arrow-attack)';
          d3.select(this).attr('class', 'd3-link animate-flow-dash');
        } else if (inTrajectory) {
          stroke = '#f97316'; // Amber previous route
          strokeWidth = 2.8;
          opacity = 0.85;
          d3.select(this).attr('class', 'd3-link');
        } else {
          d3.select(this).attr('class', 'd3-link');
        }

        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', stroke)
          .attr('stroke-width', strokeWidth)
          .attr('opacity', opacity)
          .attr('marker-end', marker);
      });

      // Update Link labels in simulation
      svg.selectAll<SVGGElement, D3LinkDatum>('g.d3-link-label').each(function (d) {
        const isCurrentAttackEdge = isSimulationActiveLink(d);
        const inTrajectory = isLinkInTrajectory(d);
        const opacity = isCurrentAttackEdge ? 1 : inTrajectory ? 0.75 : 0.08;
        d3.select(this).transition().duration(200).attr('opacity', opacity);
      });

      // Update Nodes in simulation
      svg.selectAll<SVGGElement, D3NodeDatum>('g.d3-node').each(function (d) {
        const isActiveNode = d.id === activeZoneId;
        const isCompromised = compromisedZoneIds.includes(d.id);
        const nodeG = d3.select(this);

        let opacity = 0.22;
        if (isActiveNode) opacity = 1;
        else if (isCompromised) opacity = 0.95;

        nodeG.transition().duration(200).attr('opacity', opacity);

        // Halo
        const halo = nodeG.select('.node-halo');
        if (isActiveNode) {
          halo
            .attr('class', 'node-halo animate-pulse-ring')
            .attr('fill', '#ef4444')
            .attr('opacity', 0.85)
            .attr('filter', 'url(#d3-attack-glow)');
        } else if (isCompromised) {
          halo
            .attr('class', 'node-halo')
            .attr('fill', '#f97316')
            .attr('opacity', 0.25)
            .attr('r', 38)
            .attr('filter', 'url(#d3-glow)');
        } else {
          halo.attr('class', 'node-halo').attr('opacity', 0).attr('r', 32);
        }

        // Outer Ring
        const ring = nodeG.select('.node-outer-ring');
        if (isActiveNode) {
          ring
            .attr('stroke', '#ef4444')
            .attr('stroke-width', 4)
            .attr('r', 34);
        } else if (isCompromised) {
          ring
            .attr('stroke', '#f97316')
            .attr('stroke-width', 2.8)
            .attr('r', 32);
        } else {
          ring
            .attr('stroke', d.color)
            .attr('stroke-width', 2)
            .attr('r', 32);
        }

        // Inner Circle
        const inner = nodeG.select('.node-inner-circle');
        if (isActiveNode) {
          inner.attr('fill', '#ef4444');
        } else if (isCompromised) {
          inner.attr('fill', '#ea580c');
        } else {
          inner.attr('fill', d.color);
        }

        // Badge
        const badgeCircle = nodeG.select('.node-badge-circle');
        const badgeText = nodeG.select('.node-badge-text');
        if (isActiveNode) {
          badgeCircle.attr('fill', '#ef4444').attr('stroke', '#fee2e2');
          badgeText.text('!');
        } else if (isCompromised) {
          badgeCircle.attr('fill', '#f97316').attr('stroke', '#ffedd5');
          const stepIndex = activeCase.timeline.findIndex((t) => t.zoneId === d.id);
          badgeText.text(`${stepIndex >= 0 ? stepIndex + 1 : '✓'}`);
        } else {
          badgeCircle.attr('fill', '#0f172a').attr('stroke', '#ffffff');
          badgeText.text(`${d.inDegree + d.outDegree}`);
        }

        // Label box
        const labelBg = nodeG.select('.node-label-bg');
        const labelText = nodeG.select('.node-label-text');
        if (isActiveNode) {
          labelBg.attr('stroke', '#ef4444').attr('stroke-width', 2.5).attr('fill', '#fef2f2');
          labelText.attr('fill', '#991b1b').attr('font-weight', '700');
        } else if (isCompromised) {
          labelBg.attr('stroke', '#f97316').attr('stroke-width', 1.8).attr('fill', '#fff7ed');
          labelText.attr('fill', '#9a3412').attr('font-weight', '600');
        } else {
          labelBg.attr('stroke', '#cbd5e1').attr('stroke-width', 1).attr('fill', '#ffffff');
          labelText.attr('fill', '#0f172a').attr('font-weight', '600');
        }
      });

      return;
    }

    // Standard interactive inspection styling (when no simulation is active)
    const activeNodeId = hoveredNodeId || selectedZoneId;
    const activeLinkId = hoveredLinkId || selectedDependencyId;

    const isLinkConnectedToActiveNode = (link: D3LinkDatum) => {
      if (!activeNodeId) return false;
      const sId = typeof link.source === 'object' ? link.source.id : link.source;
      const tId = typeof link.target === 'object' ? link.target.id : link.target;
      return sId === activeNodeId || tId === activeNodeId;
    };

    const isNodeAdjacent = (nodeId: string) => {
      if (!activeNodeId) return true;
      if (nodeId === activeNodeId) return true;
      return DEPENDENCIES.some(
        (dep) =>
          (dep.fromZoneId === activeNodeId && dep.toZoneId === nodeId) ||
          (dep.toZoneId === activeNodeId && dep.fromZoneId === nodeId)
      );
    };

    // Update Links styling
    svg.selectAll<SVGPathElement, D3LinkDatum>('path.d3-link').each(function (d) {
      const isSelected = d.id === selectedDependencyId;
      const isHovered = d.id === hoveredLinkId;
      const isConnected = isLinkConnectedToActiveNode(d);

      let strokeWidth = isSelected || isHovered ? 4 : isConnected ? 3 : 2;
      let opacity = 0.85;

      if (activeNodeId) {
        opacity = isConnected ? 1 : 0.15;
      } else if (activeLinkId) {
        opacity = d.id === activeLinkId ? 1 : 0.15;
      }

      d3.select(this)
        .attr('class', 'd3-link')
        .transition()
        .duration(150)
        .attr('stroke', DEPENDENCY_METAS[d.type].stroke)
        .attr('stroke-width', strokeWidth)
        .attr('opacity', opacity)
        .attr('marker-end', `url(#d3-arrow-${d.type}${isSelected || isHovered || isConnected ? '-highlight' : ''})`);
    });

    // Update Link Labels opacity
    svg.selectAll<SVGGElement, D3LinkDatum>('g.d3-link-label').each(function (d) {
      const isConnected = isLinkConnectedToActiveNode(d);
      const isSelected = d.id === selectedDependencyId;
      const isHovered = d.id === hoveredLinkId;

      let opacity = 0.9;
      if (activeNodeId) {
        opacity = isConnected ? 1 : 0.12;
      } else if (activeLinkId) {
        opacity = isSelected || isHovered ? 1 : 0.15;
      }

      d3.select(this).transition().duration(150).attr('opacity', opacity);
    });

    // Update Nodes styling
    svg.selectAll<SVGGElement, D3NodeDatum>('g.d3-node').each(function (d) {
      const isSelected = d.id === selectedZoneId;
      const isHovered = d.id === hoveredNodeId;
      const isAdjacent = isNodeAdjacent(d.id);

      let opacity = 1;
      if (activeNodeId) {
        opacity = isAdjacent ? 1 : 0.25;
      } else if (activeLinkId) {
        const activeLink = DEPENDENCIES.find((dep) => dep.id === activeLinkId);
        const isEndpoint = activeLink?.fromZoneId === d.id || activeLink?.toZoneId === d.id;
        opacity = isEndpoint ? 1 : 0.25;
      }

      const nodeG = d3.select(this);
      nodeG.transition().duration(150).attr('opacity', opacity);

      // Node halo
      nodeG
        .select('.node-halo')
        .attr('class', 'node-halo')
        .transition()
        .duration(150)
        .attr('fill', d.color)
        .attr('opacity', isSelected ? 0.35 : isHovered ? 0.2 : 0)
        .attr('r', isSelected ? 44 : 38)
        .attr('filter', 'url(#d3-glow)');

      // Node outer ring
      nodeG
        .select('.node-outer-ring')
        .transition()
        .duration(150)
        .attr('stroke', d.color)
        .attr('stroke-width', isSelected ? 4 : isHovered ? 3 : 2)
        .attr('r', isSelected || isHovered ? 34 : 32);

      // Inner circle
      nodeG.select('.node-inner-circle').attr('fill', d.color);

      // Badge
      nodeG.select('.node-badge-circle').attr('fill', '#0f172a').attr('stroke', '#ffffff');
      nodeG.select('.node-badge-text').text(`${d.inDegree + d.outDegree}`);

      // Label
      nodeG
        .select('.node-label-bg')
        .attr('stroke', isSelected ? d.color : '#cbd5e1')
        .attr('stroke-width', isSelected ? 2 : 1)
        .attr('fill', '#ffffff');
      nodeG
        .select('.node-label-text')
        .attr('fill', '#0f172a')
        .attr('font-weight', isSelected ? '700' : '600');
    });
  }, [selectedZoneId, hoveredNodeId, selectedDependencyId, hoveredLinkId, activeCase, simState]);

  // Zoom control helpers
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(450)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  // Case change handler
  const handleSelectCase = (caseId: string) => {
    if (caseId === 'none') {
      setSelectedCaseId(null);
      setIsPlaying(false);
      onSimulationCaseChange?.(null);
    } else {
      setSelectedCaseId(caseId);
      setCurrentStep(0);
      setIsPlaying(true);
      onSimulationCaseChange?.(caseId);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-radial from-slate-50 via-white to-slate-100/90 rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col"
      id="d3-graph-container"
    >
      {/* Top Simulation & Diagram Toolbar */}
      <div className="p-2.5 sm:p-3 border-b border-slate-200 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-3 z-10 flex-wrap">
        {/* Left: Active Simulation Case Indicator (if active) */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeCase ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-800 px-2.5 py-1 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Simulación: {activeCase.name} ({activeCase.year})</span>
              </span>
              <button
                onClick={() => handleSelectCase('none')}
                className="text-2xs font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
                title="Volver a la topología base"
              >
                Cerrar simulación
              </button>
            </div>
          ) : (
            <span className="text-xs font-bold text-slate-700">Topología de Interdependencias</span>
          )}
        </div>

        {/* Right: Layout Toggle & Zoom Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Dependency Filter (when not in full simulation) */}
          {!activeCase && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => onFilterChange?.('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todas ({DEPENDENCIES.length})
              </button>
              <button
                onClick={() => onFilterChange?.('tecnica')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'tecnica'
                    ? 'bg-sky-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-sky-600'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                Técnicas
              </button>
              <button
                onClick={() => onFilterChange?.('operativa')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'operativa'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-amber-600'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Operativas
              </button>
              <button
                onClick={() => onFilterChange?.('intercambio_info')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'intercambio_info'
                    ? 'bg-violet-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-violet-600'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Información
              </button>
            </div>
          )}

          {/* Layout Mode Button */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => onLayoutModeChange?.('clinical')}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                layoutMode === 'clinical'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Disposición clínica según jerarquía asistencial del TFG"
            >
              Clínica
            </button>
            <button
              onClick={() => onLayoutModeChange?.('force')}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                layoutMode === 'force'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Fuerzas dinámicas D3.js"
            >
              Física
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
              title="Acercar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
              title="Alejar"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
              title="Restablecer vista"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Player Control Bar (when a case is selected) */}
      {activeCase && simState && (
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap z-10 border-b border-slate-800 shadow-md">
          {/* Step transport playback buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentStep((prev) => Math.max(0, prev - 1));
                setIsPlaying(false);
              }}
              disabled={currentStep === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
              title="Paso anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title={isPlaying ? 'Pausar animación' : 'Reproducir animación'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pausar' : currentStep === activeCase.timeline.length - 1 ? 'Repetir' : 'Reproducir'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep((prev) => Math.min(activeCase.timeline.length - 1, prev + 1));
                setIsPlaying(false);
              }}
              disabled={currentStep === activeCase.timeline.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
              title="Paso siguiente"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentStep(0);
                setIsPlaying(true);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
              title="Reiniciar desde el paso 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Speed toggle */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 ml-2 text-2xs">
              <button
                onClick={() => setPlaybackSpeed(1)}
                className={`px-2 py-1 rounded font-bold cursor-pointer ${
                  playbackSpeed === 1 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setPlaybackSpeed(1.5)}
                className={`px-2 py-1 rounded font-bold cursor-pointer ${
                  playbackSpeed === 1.5 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                1.5x
              </button>
              <button
                onClick={() => setPlaybackSpeed(2)}
                className={`px-2 py-1 rounded font-bold cursor-pointer ${
                  playbackSpeed === 2 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                2x
              </button>
            </div>
          </div>

          {/* Step Indicator Scrubber */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-2xs font-semibold text-slate-400 mr-1">Pasos:</span>
            {activeCase.timeline.map((stepItem, idx) => {
              const isCurrent = idx === currentStep;
              const isPast = idx < currentStep;
              const zoneMeta = FUNCTIONAL_ZONES.find((z) => z.id === stepItem.zoneId);

              return (
                <button
                  key={stepItem.step}
                  onClick={() => {
                    setCurrentStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-rose-600 text-white ring-2 ring-rose-400 ring-offset-1 ring-offset-slate-900 shadow-xs'
                      : isPast
                      ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600/50'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{stepItem.step}.</span>
                  <span>{zoneMeta?.shortName || stepItem.phase}</span>
                </button>
              );
            })}
          </div>

          {/* Cross-reference link to matrix */}
          {onGoToMatrix && (
            <button
              onClick={() => onGoToMatrix(activeCase.id)}
              className="text-2xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Ver en Matriz (Tablas 3 y 4)</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* SVG Canvas Container */}
      <div className="relative flex-1 w-full min-h-[480px]">
        <svg
          ref={svgRef}
          className="w-full h-full block select-none"
          style={{ minHeight: '480px' }}
        />

        {/* Floating Simulation Step HUD Banner */}
        {activeCase && simState && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xl bg-white/95 backdrop-blur-md rounded-2xl border border-rose-200 p-3.5 shadow-xl z-10 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-2xs font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  Paso {simState.safeIndex + 1} de {activeCase.timeline.length}: {simState.currentEvent.phase}
                </span>
              </div>
              {simState.currentEvent.dependencyInvolved && (
                <span
                  className={`text-2xs font-bold px-2 py-0.5 rounded-md border ${
                    DEPENDENCY_METAS[simState.currentEvent.dependencyInvolved]?.bg || 'bg-slate-100'
                  }`}
                >
                  Vía: {DEPENDENCY_METAS[simState.currentEvent.dependencyInvolved]?.label || simState.currentEvent.dependencyInvolved}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {simState.currentEvent.description}
            </p>

            {/* If final step, show systemic impact from Table 4 */}
            {simState.isFinalStep && (
              <div className="pt-2 border-t border-rose-100 bg-rose-50/70 -mx-3.5 -mb-3.5 p-3 rounded-b-2xl">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-2xs font-bold uppercase tracking-wider text-rose-800 block">
                      Consecuencia Asistencial Directa (Tabla 4 TFG):
                    </span>
                    <p className="text-xs font-semibold text-rose-950 mt-0.5">
                      {activeCase.consecuenciaAsistencialExacta || activeCase.consequences[0]}
                    </p>
                    <span className="text-3xs text-rose-700/80 block mt-1">
                      Cronología: {activeCase.cronologia} | Fuente: {activeCase.fuenteCorpus}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Legend */}
      <div className="p-2 sm:p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-2xs text-slate-500 flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-slate-700">Vías de Interdependencia:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-sky-600 inline-block" />
            <span className="text-slate-700">Técnica (Red/AD/Servidor)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 border-t-2 border-dashed border-amber-600 inline-block" />
            <span className="text-slate-700">Operativa (Flujo Asistencial)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 border-t-2 border-dotted border-violet-600 inline-block" />
            <span className="text-slate-700">Intercambio de Información</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span>Click en nodo/arista para examinar detalles clínicos</span>
        </div>
      </div>
    </div>
  );
};
