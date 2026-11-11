import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  X,
  FileCheck2,
} from 'lucide-react';
import { InstructorProfile } from '../types';

interface InstructorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customInstructorName?: string) => void;
  instructor: InstructorProfile;
}

export const GENERIC_INSTRUCTOR_CREDENTIALS = {
  username: 'instructor@sena.edu.co',
  password: 'sena2026*',
  alternativeUsernames: ['instructor', 'cmduarte@sena.edu.co'],
  alternativePasswords: ['sena2026', 'sena123', 'Sena2026*'],
};

export const InstructorLoginModal: React.FC<InstructorLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  instructor,
}) => {
  const [instructorName, setInstructorName] = useState(instructor.name || 'Ing. Carlos Mario Duarte');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFillGeneric = () => {
    setUsername(GENERIC_INSTRUCTOR_CREDENTIALS.username);
    setPassword(GENERIC_INSTRUCTOR_CREDENTIALS.password);
    setInstructorName(instructor.name || 'Ing. Carlos Mario Duarte');
    setError(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    const isUserValid =
      cleanUser === GENERIC_INSTRUCTOR_CREDENTIALS.username.toLowerCase() ||
      GENERIC_INSTRUCTOR_CREDENTIALS.alternativeUsernames.includes(cleanUser);

    const isPassValid =
      cleanPass === GENERIC_INSTRUCTOR_CREDENTIALS.password ||
      GENERIC_INSTRUCTOR_CREDENTIALS.alternativePasswords.includes(cleanPass);

    if (isUserValid && isPassValid) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess(instructorName.trim() || instructor.name);
        onClose();
      }, 500);
    } else {
      setError(
        'Usuario o contraseña incorrectos. Utiliza las credenciales genéricas mostradas en la guía superior.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-blue-200 border border-white/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Acceso al Portal del Instructor
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Servicio Nacional de Aprendizaje SENA
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Generic Credentials Notice Card */}
        <div className="p-4 mx-6 mt-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/90 dark:border-blue-900/60 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950 dark:text-blue-200">
              <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Credenciales Genéricas de Acceso</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-semibold">
              Rol Docente
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Para evaluar y auditar la cohorte en el prototipo, utiliza el usuario y contraseña genéricos asignados:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-blue-200/70 dark:border-blue-800/50">
              <span className="text-[10px] text-slate-400 block font-sans font-semibold uppercase tracking-wider">
                Usuario
              </span>
              <span className="font-bold text-blue-700 dark:text-blue-300 truncate block mt-0.5">
                {GENERIC_INSTRUCTOR_CREDENTIALS.username}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-blue-200/70 dark:border-blue-800/50">
              <span className="text-[10px] text-slate-400 block font-sans font-semibold uppercase tracking-wider">
                Contraseña
              </span>
              <span className="font-bold text-blue-700 dark:text-blue-300 block mt-0.5">
                {GENERIC_INSTRUCTOR_CREDENTIALS.password}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFillGeneric}
            className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autocompletar Credenciales Genéricas</span>
          </button>
        </div>

        {/* Instructor Target Info */}
        <div className="px-6 pt-3 pb-1 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <FileCheck2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>
            Docente asignado: <strong>{instructor.name}</strong> · Ficha {instructor.assignedFicha}
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Credenciales válidas. Ingresando al Panel de Seguimiento...</span>
            </div>
          )}

          {/* Custom Instructor Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Nombre y Apellidos del Instructor *</span>
            </label>
            <input
              type="text"
              required
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              placeholder="Ej: Ing. Carlos Mario Duarte o tu nombre"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1 flex items-start gap-1">
              <span>💡</span>
              <span><strong>Pista:</strong> Puedes ingresar tu nombre o el de cualquier instructor responsable. Se actualizará en todo el prototipo y panel de control.</span>
            </p>
          </div>

          {/* User Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Usuario o Correo Institucional *</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ej: instructor@sena.edu.co"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Contraseña Genérica *</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Escribe la contraseña (ej: sena2026*)"
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSuccess}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Ingresar como Instructor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
