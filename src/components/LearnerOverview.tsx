import React from 'react';
import { ApprenticeProfile } from '../types';
import { Award, BookOpen, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface LearnerOverviewProps {
  learner: ApprenticeProfile;
  totalModules: number;
  onContinue: () => void;
  onViewCert: () => void;
}

export const LearnerOverview: React.FC<LearnerOverviewProps> = ({
  learner,
  totalModules,
  onContinue,
  onViewCert,
}) => {
  const isComplete = learner.progressPercent >= 100;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all mb-8">
      {/* Background Hero Accent & Media Strip */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-emerald-900">
        <img
          src="/src/assets/images/hero_sena_induction_1794325234431.jpg"
          alt="Centro de formación tecnológica SENA con aprendices en inducción"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        
        {/* Banner Content */}
        <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium mb-1">
              <span>SENA · Servicio Nacional de Aprendizaje</span>
              <span aria-hidden="true">/</span>
              <span>Regional Distrito Capital</span>
              <span aria-hidden="true">/</span>
              <span>Ficha {learner.codeFicha}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight text-balance">
              Inducción a la Formación Profesional Integral
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {isComplete ? (
              <button
                onClick={onViewCert}
                className="px-4 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Award className="w-4 h-4" />
                <span>Ver Certificado Oficial</span>
              </button>
            ) : (
              <button
                onClick={onContinue}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>Continuar Inducción</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress & Profile Detail Card Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Col 1: Apprentice Identity */}
          <div className="md:col-span-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {learner.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {learner.program}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span>{learner.documentType}: {learner.documentNumber}</span>
              <span aria-hidden="true">·</span>
              <span>{learner.email}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Última actividad: {learner.lastActive}</span>
            </div>
          </div>

          {/* Col 2: Progress Bar & Metrics */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">
                Progreso General de la Inducción
              </span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums text-sm">
                {learner.progressPercent}%
              </span>
            </div>
            
            {/* Custom Track */}
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${learner.progressPercent}%` }}
              />
            </div>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Módulos</span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                  {learner.modulesCompleted.length} / {totalModules}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Cuestionarios</span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                  {Object.keys(learner.quizScores).length} aprobados
                </p>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Insignias</span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                  {learner.badges.length} obtenidas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges preview row */}
        {learner.badges.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs text-slate-600 dark:text-slate-300">
            <span className="font-medium text-slate-700 dark:text-slate-200 shrink-0">Logros desbloqueados:</span>
            {learner.badges.map((badge, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-xs shrink-0">
                <Award className="w-3 h-3" />
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
