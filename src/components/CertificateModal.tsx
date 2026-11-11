import React from 'react';
import { ApprenticeProfile } from '../types';
import { SenaEscudoSvg, SenaSymbol } from './SenaLogo';
import { Award, Printer, CheckCircle, X, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  learner: ApprenticeProfile;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  learner,
  onClose,
}) => {
  const isEligible = learner.progressPercent >= 100 || learner.status === 'aprobado';
  const certificateCode = `SENA-IND-2026-${learner.codeFicha}-${learner.documentNumber.slice(-4)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full my-8 overflow-hidden">
        
        {/* Top Action Bar (hidden on print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Certificado de Inducción SENA</span>
          </div>

          <div className="flex items-center gap-2">
            {isEligible && (
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Guardar PDF</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 relative print:p-6" id="certificate-print-area">
          {/* Ornate Framing Border */}
          <div className="border-4 border-double border-emerald-800 p-6 sm:p-8 rounded-lg relative overflow-hidden bg-radial from-white via-white to-emerald-50/20">
            
            {/* Watermark in center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
              <SenaSymbol size={380} color="#007832" />
            </div>

            {/* Header: Republica de Colombia / SENA */}
            <div className="text-center space-y-1 relative z-10">
              <div className="flex justify-center mb-2">
                <img
                  src="/escudo-sena.png"
                  alt="Escudo Oficial SENA"
                  className="w-16 h-16 object-contain mx-auto drop-shadow-xs"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-600 font-sans">
                República de Colombia · Ministerio del Trabajo
              </p>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-900 font-serif">
                SERVICIO NACIONAL DE APRENDIZAJE
              </h2>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                {learner.regional} · {learner.center}
              </p>
            </div>

            {/* Title */}
            <div className="text-center my-6 relative z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Constancia de Aprobación
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 uppercase tracking-wide">
                Inducción a la Formación Profesional Integral
              </h3>
            </div>

            {/* Certification Statement */}
            <div className="text-center space-y-4 max-w-xl mx-auto text-xs sm:text-sm text-slate-700 relative z-10 leading-relaxed font-sans">
              <p>Hace constar que el aprendiz:</p>
              
              <div className="py-2 border-b-2 border-emerald-700 inline-block px-8">
                <p className="text-xl sm:text-2xl font-extrabold text-slate-950 font-serif">
                  {learner.name}
                </p>
              </div>

              <p className="font-mono text-xs text-slate-600 font-medium">
                Identificado con {learner.documentType} No. {learner.documentNumber}
              </p>

              <p className="text-xs leading-relaxed text-slate-800">
                Ha completado satisfactoriamente los módulos de contextualización institucional, apropiación de los símbolos patrios e institucionales, y conocimiento pleno del <strong>Reglamento del Aprendiz SENA (Acuerdo 007 de 2012)</strong>, demostrando los valores de integridad, respeto, compromiso y solidaridad para el programa:
              </p>

              <p className="text-sm font-bold text-emerald-900">
                {learner.program} · Ficha {learner.codeFicha}
              </p>
            </div>

            {/* Signatures & Seal */}
            <div className="grid grid-cols-2 gap-8 mt-10 pt-6 border-t border-slate-200 text-center relative z-10">
              <div>
                <div className="h-10 flex items-center justify-center font-serif italic text-emerald-900 text-sm opacity-80">
                  Subdirección de Centro
                </div>
                <div className="w-40 mx-auto border-t border-slate-400 mt-1" />
                <p className="text-xs font-bold text-slate-800 mt-1">Subdirector(a) de Centro</p>
                <p className="text-[10px] text-slate-500">Centro CEET · SENA</p>
              </div>

              <div>
                <div className="h-10 flex items-center justify-center font-serif italic text-emerald-900 text-sm opacity-80">
                  Coordinación de Formación
                </div>
                <div className="w-40 mx-auto border-t border-slate-400 mt-1" />
                <p className="text-xs font-bold text-slate-800 mt-1">Coordinador(a) Académico(a)</p>
                <p className="text-[10px] text-slate-500">Ficha {learner.codeFicha}</p>
              </div>
            </div>

            {/* Footer Verification Code */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono relative z-10 gap-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Certificado Digital Oficial Verificado</span>
              </div>
              <div>
                Folio: <span className="font-bold text-slate-800">{certificateCode}</span>
              </div>
              <div>
                Expedición: Bogotá D.C., Colombia
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
