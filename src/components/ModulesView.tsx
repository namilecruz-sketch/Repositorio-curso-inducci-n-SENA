import React, { useState } from 'react';
import { InductionModule, ApprenticeProfile } from '../types';
import { CheckCircle2, Clock, ArrowRight, Play, BookOpen, Award } from 'lucide-react';

interface ModulesViewProps {
  modules: InductionModule[];
  learner: ApprenticeProfile;
  onSelectModule: (module: InductionModule) => void;
  onOpenQuiz: (module: InductionModule) => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({
  modules,
  learner,
  onSelectModule,
  onOpenQuiz,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('todos');

  const filteredModules = modules.filter((m) => {
    if (filterCategory === 'todos') return true;
    return m.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Section Header with category tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Ruta de Aprendizaje de Inducción
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Completa cada módulo, explora el contenido institucional y aprueba los cuestionarios para obtener tu certificación.
          </p>
        </div>

        {/* Category Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium shrink-0 overflow-x-auto">
          {[
            { id: 'todos', label: 'Todos los Módulos' },
            { id: 'identidad', label: 'Identidad y Símbolos' },
            { id: 'normativa', label: 'Normativa y Reglamento' },
            { id: 'formacion', label: 'Formación FPI' },
            { id: 'bienestar', label: 'Bienestar' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((mod) => {
          const isCompleted = learner.modulesCompleted.includes(mod.id);
          const score = learner.quizScores[mod.id];
          const hasBadge = learner.badges.includes(mod.badgeName);

          return (
            <div
              key={mod.id}
              className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all group"
            >
              {/* Card Media Header */}
              {mod.coverImage && (
                <div className={`relative h-36 w-full overflow-hidden flex items-center justify-center ${
                  mod.coverImage.includes('escudo')
                    ? 'bg-radial from-slate-100 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}>
                  <img
                    src={mod.coverImage}
                    alt={mod.title}
                    className={`transition-transform duration-500 group-hover:scale-105 ${
                      mod.coverImage.includes('escudo')
                        ? 'h-28 w-auto object-contain drop-shadow-md py-1 z-10'
                        : 'w-full h-full object-cover'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Clean unboxed metadata on image scrim */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="font-semibold">Módulo {mod.order}</span>
                    <div className="flex items-center gap-1.5 opacity-90">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{mod.durationMinutes} min</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Status metadata line */}
                  <div className="flex items-center gap-2 text-xs mb-2">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completado {score !== undefined && `(${score}%)`}
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Pendiente
                      </span>
                    )}
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-slate-500 dark:text-slate-400 capitalize">
                      {mod.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {mod.summary}
                  </p>
                </div>

                {/* Badge reward teaser */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Insignia: <strong>{mod.badgeName}</strong></span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectModule(mod)}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Ver Contenido</span>
                    </button>

                    <button
                      onClick={() => onOpenQuiz(mod)}
                      className="py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      title="Evaluar conocimientos del módulo"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{isCompleted ? 'Repetir Quiz' : 'Iniciar Quiz'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
