import React, { useState } from 'react';
import { InductionModule } from '../types';
import { X, BookOpen, CheckCircle, Clock, Award, ArrowRight, Play, ExternalLink } from 'lucide-react';

interface ModuleDetailModalProps {
  module: InductionModule | null;
  onClose: () => void;
  onStartQuiz: (module: InductionModule) => void;
  onNavigateToTab: (tab: string) => void;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({
  module,
  onClose,
  onStartQuiz,
  onNavigateToTab,
}) => {
  if (!module) return null;

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const activeSection = module.sections[activeSectionIndex] || module.sections[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded">
              MÓDULO {module.order}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {module.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{module.durationMinutes} minutos estimados</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{module.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Insignia: {module.badgeName}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto text-xs font-medium">
          {module.sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => setActiveSectionIndex(idx)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeSectionIndex === idx
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{idx + 1}. {section.title}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {activeSection.title}
            </h3>

            <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {activeSection.content.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Key points box */}
          {activeSection.keyPoints && activeSection.keyPoints.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Puntos Clave para Recordar</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                {activeSection.keyPoints.map((pt, kIdx) => (
                  <li key={kIdx} className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Element Jumpers */}
          {activeSection.interactiveElement === 'symbols' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Herramienta Interactiva: Visor de Símbolos e Himno
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inspecciona interactivamente los sectores del escudo y reproduce el himno oficial.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTab('simbolos');
                }}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>Explorar Símbolos</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {activeSection.interactiveElement === 'cases' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Simulador de Casos del Reglamento
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aplica el reglamento en situaciones éticas reales: faltas leves, graves y debido proceso.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTab('simulador');
                }}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>Ir al Simulador</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeSectionIndex > 0 ? (
              <button
                onClick={() => setActiveSectionIndex(activeSectionIndex - 1)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Sección Anterior
              </button>
            ) : null}

            {activeSectionIndex < module.sections.length - 1 ? (
              <button
                onClick={() => setActiveSectionIndex(activeSectionIndex + 1)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Siguiente Sección</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          <button
            onClick={() => {
              onClose();
              onStartQuiz(module);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Presentar Cuestionario Evaluativo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
