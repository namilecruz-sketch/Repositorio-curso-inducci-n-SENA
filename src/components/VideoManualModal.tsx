import React from 'react';
import { X, Film } from 'lucide-react';

interface VideoManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoManualModal: React.FC<VideoManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Video Manual de la Plataforma SENA Inducción
              </h3>
              <p className="text-xs text-emerald-100">
                Guía visual interactiva para aprendices e instructores
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg text-lg cursor-pointer transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-center">
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800">
            <video
              src="/assets/aistudio/2026__17_18_c5832446.mp4"
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            >
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            Utiliza los controles de reproducción para pausar, avanzar o ajustar el volumen del video manual institucional.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Centro de Comando Digital SENA · Versión Interactiva 3.0
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cerrar Video Manual
          </button>
        </div>

      </div>
    </div>
  );
};
