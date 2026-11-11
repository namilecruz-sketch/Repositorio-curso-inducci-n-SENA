import React, { useState } from 'react';
import { InductionModule } from '../types';
import { X, CheckCircle2, AlertCircle, Award, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

interface QuizModalProps {
  module: InductionModule | null;
  onClose: () => void;
  onQuizComplete: (moduleId: string, scorePercent: number, badgeAwarded: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  module,
  onClose,
  onQuizComplete,
}) => {
  if (!module) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = module.quiz[currentIndex];
  const totalQuestions = module.quiz.length;

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return; // already answered
    setSelectedOption(idx);
    setShowExplanation(true);

    if (idx === currentQuestion.correctIndex) {
      setCorrectCount((prev) => prev + 1);
      // Play brief pleasant chime
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } catch {
        // audio context fallback
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      const scorePercent = Math.round((correctCount / totalQuestions) * 100);
      if (scorePercent >= 66) {
        onQuizComplete(module.id, scorePercent, module.badgeName);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercent >= 66;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              EVALUACIÓN DE INDUCCIÓN
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {module.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Content Body */}
        <div className="p-6">
          {!quizFinished ? (
            <div className="space-y-6">
              {/* Question count & progress indicator */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Pregunta <strong className="text-slate-900 dark:text-white font-mono">{currentIndex + 1}</strong> de <span className="font-mono">{totalQuestions}</span></span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Aciertos: {correctCount}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let optionClass = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';
                  
                  if (showExplanation) {
                    if (isCorrect) {
                      optionClass = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium';
                    } else if (isSelected && !isCorrect) {
                      optionClass = 'border-rose-400 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    } else {
                      optionClass = 'border-slate-200 dark:border-slate-800 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showExplanation}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3 ${optionClass}`}
                    >
                      <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showExplanation && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {showExplanation && isSelected && !isCorrect && (
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {showExplanation && (
                <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed animate-in fade-in ${
                  selectedOption === currentQuestion.correctIndex
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                }`}>
                  <p className="font-bold mb-1 flex items-center gap-1.5">
                    {selectedOption === currentQuestion.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>¡Respuesta Correcta!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Retroalimentación Formativa:</span>
                      </>
                    )}
                  </p>
                  <p className="mt-1">{currentQuestion.explanation}</p>
                  {currentQuestion.articleReference && (
                    <p className="mt-2 text-xs font-mono font-medium opacity-80">
                      Referencia legal: {currentQuestion.articleReference}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                {passed ? <Award className="w-8 h-8" /> : <RotateCcw className="w-8 h-8 text-amber-600" />}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {passed ? '¡Felicitaciones! Cuestionario Aprobado' : 'Refuerzo Requerido'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {passed
                    ? 'Has demostrado dominio sobre los temas de este módulo de inducción institucional.'
                    : 'Para certificar el módulo debes alcanzar al menos un 66% de respuestas correctas. Repasa el material y vuelve a intentarlo.'}
                </p>
              </div>

              {/* Score Display */}
              <div className="inline-block p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center gap-4 text-xs font-medium">
                  <div>
                    <span className="text-slate-500">Puntaje Final:</span>
                    <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      {scorePercent}%
                    </p>
                  </div>
                  <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
                    <span className="text-slate-500">Aciertos:</span>
                    <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {correctCount} / {totalQuestions}
                    </p>
                  </div>
                </div>
              </div>

              {passed && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2 max-w-sm mx-auto">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Has desbloqueado la insignia: <strong>{module.badgeName}</strong></span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          {!quizFinished ? (
            <>
              <button
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Salir
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={!showExplanation}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>{currentIndex < totalQuestions - 1 ? 'Siguiente Pregunta' : 'Finalizar Evaluación'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-end gap-3">
              {!passed && (
                <button
                  onClick={handleRestartQuiz}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Intentar de Nuevo</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
              >
                Continuar Ruta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
