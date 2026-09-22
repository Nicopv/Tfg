import React from 'react';
import {
  Shield,
  Eye,
  Minimize2,
  HeartHandshake,
  CheckCircle2,
  Quote,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { RESILIENCE_PILLARS } from '../data/thesisContent';

const PILLAR_ICONS: Record<string, React.ElementType> = {
  PROTEGER: Shield,
  COMPRENDER: Eye,
  CONTENER: Minimize2,
  MANTENER: HeartHandshake,
};

interface ResilienceFrameworkViewProps {
  onGoToDefense: () => void;
}

export const ResilienceFrameworkView: React.FC<ResilienceFrameworkViewProps> = ({
  onGoToDefense,
}) => {
  return (
    <div className="space-y-8 pb-24">
      {/* Golden Thesis Quote Box */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-7 sm:p-9 shadow-md border border-slate-700">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Quote className="w-8 h-8 text-cyan-400 mx-auto opacity-80" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-slate-100 leading-snug">
            "En un entorno sanitario conectado, el riesgo no permanece necesariamente donde comienza. La resiliencia requiere prevenir, pero también limitar la capacidad de propagación."
          </h2>
          <div className="pt-2 text-xs uppercase tracking-wider text-cyan-300 font-semibold font-mono">
            Axioma Central del Trabajo Final de Grado
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RESILIENCE_PILLARS.map((item) => {
          const Icon = PILLAR_ICONS[item.pillar] || Shield;

          return (
            <div
              key={item.pillar}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-xl text-white shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-2xs font-bold uppercase tracking-widest text-slate-400 block font-mono">
                        {item.subtitle}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        {item.pillar}: {item.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 font-medium mb-4 leading-relaxed">
                  {item.actionText}
                </p>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
                    Directrices de Implementación Clínica:
                  </span>
                  <ul className="space-y-2">
                    {item.checklist.map((check, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 flex items-start gap-2.5 leading-snug"
                      >
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: item.color }}
                        />
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-2xs text-slate-400 flex items-center justify-between font-mono">
                <span>Pilar Estratégico {item.pillar}</span>
                <span className="text-cyan-700 font-semibold">Resiliencia Sanitaria</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthesis Card: Why Individual Asset Security is Not Enough */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-4 h-4" />
            <span>Implicancia Práctica para Directores de TI y CISOs Hospitalarios</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Superando el Paradigma de la Seguridad Basada en el Activo
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            La protección tradicional se ha focalizado en poner parches y antivirus en servidores o terminales. Sin embargo, en un hospital conectado, la parada de un equipo perimetral o un intermediario externo puede colapsar urgencias sin que una sola máquina del área de urgencias haya sido infectada. La resiliencia auténtica exige cartografiar las rutas invisibles de dependencia y garantizar que los médicos puedan continuar salvando vidas incluso en condiciones de aislamiento digital.
          </p>

          <div className="mt-5">
            <button
              onClick={onGoToDefense}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-cyan-800 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100 px-4 py-2.5 rounded-xl border border-cyan-200 transition-colors cursor-pointer"
            >
              <span>Escuchar Conclusión en la Defensa Oral</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
