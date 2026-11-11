import React, { useState } from 'react';
import { REGULATION_CASES } from '../data/senaData';
import { RegulationCase } from '../types';
import { Scale, CheckCircle2, AlertCircle, BookOpen, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react';

export const RegulationSimulator: React.FC = () => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const activeCase: RegulationCase = REGULATION_CASES[selectedCaseIndex];

  // User answers state per case
  const [userFaultType, setUserFaultType] = useState<'Académica' | 'Disciplinaria' | null>(null);
  const [userSeverity, setUserSeverity] = useState<'Leve' | 'Grave' | 'Gravísima' | null>(null);
  const [userSanction, setUserSanction] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelectCase = (index: number) => {
    setSelectedCaseIndex(index);
    setUserFaultType(null);
    setUserSeverity(null);
    setUserSanction(null);
    setSubmitted(false);
  };

  const isFormComplete = userFaultType !== null && userSeverity !== null && userSanction !== null;

  const isFaultTypeCorrect = userFaultType === activeCase.correctFaultType;
  const isSeverityCorrect = userSeverity === activeCase.correctSeverity;
  const isSanctionCorrect = userSanction === activeCase.correctSanction;
  const allCorrect = isFaultTypeCorrect && isSeverityCorrect && isSanctionCorrect;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Simulador de Casos del Reglamento del Aprendiz</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Analiza situaciones de la vida real en el SENA y aplica el Acuerdo 007 de 2012 para dictaminar la medida adecuada con debido proceso.
          </p>
        </div>

        {/* Case selector strip */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
          {REGULATION_CASES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => handleSelectCase(idx)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                selectedCaseIndex === idx
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Caso {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Case Scenario Description */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
              EXPEDIENTE SIMULADO #{selectedCaseIndex + 1}
            </span>
            <span>{activeCase.context}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {activeCase.title}
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            <p className="font-semibold text-slate-900 dark:text-white mb-1.5">
              Descripción de los hechos:
            </p>
            {activeCase.scenario}
          </div>

          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
            <p className="font-bold">Misión del Aprendiz en este caso:</p>
            <p>1. Tipificar si la falta es académica o disciplinaria.</p>
            <p>2. Calificar la gravedad según criterios reglamentarios.</p>
            <p>3. Seleccionar la medida formativa correspondiente garantizando el debido proceso.</p>
          </div>
        </div>

        {/* Right: Decision Panel & Evaluation */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          
          {/* Step 1: Tipo de Falta */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              1. ¿Qué naturaleza tiene la falta cometida?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {activeCase.faultTypeOptions.map((type) => {
                const isSelected = userFaultType === type;
                return (
                  <button
                    key={type}
                    onClick={() => !submitted && setUserFaultType(type)}
                    disabled={submitted}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Falta {type}</span>
                    {submitted && type === activeCase.correctFaultType && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Calificación de Gravedad */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              2. ¿Cómo se califica la gravedad de esta falta?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {activeCase.severityOptions.map((sev) => {
                const isSelected = userSeverity === sev;
                return (
                  <button
                    key={sev}
                    onClick={() => !submitted && setUserSeverity(sev)}
                    disabled={submitted}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-center ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{sev}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Medida formativa o sanción */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              3. ¿Cuál es la medida pedagógica o sanción aplicable?
            </label>
            <div className="space-y-2">
              {activeCase.sanctionOptions.map((sanct, idx) => {
                const isSelected = userSanction === sanct;
                return (
                  <button
                    key={idx}
                    onClick={() => !submitted && setUserSanction(sanct)}
                    disabled={submitted}
                    className={`w-full p-3 rounded-xl border text-xs leading-relaxed text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sanct}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submission and Feedback */}
          {!submitted ? (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSubmitted(true)}
                disabled={!isFormComplete}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Dictaminar Fallo Reglamentario</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2 animate-in fade-in">
              <div className={`p-4 rounded-xl border ${
                allCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-900 dark:text-amber-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  {allCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>¡Dictamen Conforme a Normativa SENA!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <span>Dictamen Parcialmente Acertado</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed mt-1">
                  {activeCase.justification}
                </p>
                <p className="text-xs font-mono font-medium mt-2 opacity-90">
                  Fundamento Normativo: {activeCase.reglamentoArticle}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setUserFaultType(null);
                    setUserSeverity(null);
                    setUserSanction(null);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reintentar este caso</span>
                </button>

                {selectedCaseIndex < REGULATION_CASES.length - 1 ? (
                  <button
                    onClick={() => handleSelectCase(selectedCaseIndex + 1)}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Siguiente Caso</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                    ¡Todos los casos del simulador explorados!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
