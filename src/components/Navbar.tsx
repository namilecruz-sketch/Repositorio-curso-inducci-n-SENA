import React from 'react';
import { SenaSymbol } from './SenaLogo';
import { UserRole } from '../types';
import { Users, GraduationCap, Sparkles, Moon, Sun, Film } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenAITutor: () => void;
  onOpenVideoManual?: () => void;
  progressPercent: number;
  isDark: boolean;
  onToggleTheme: () => void;
  isTransitioningTheme: boolean;
  onRequestInstructorLogin?: () => void;
  isInstructorAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onOpenAITutor,
  onOpenVideoManual,
  progressPercent,
  isDark,
  onToggleTheme,
  isTransitioningTheme,
  onRequestInstructorLogin,
  isInstructorAuthenticated = false,
}) => {
  const toggleRole = () => {
    if (userRole === 'aprendiz') {
      if (!isInstructorAuthenticated && onRequestInstructorLogin) {
        onRequestInstructorLogin();
      } else {
        setUserRole('instructor');
        setActiveTab('seguimiento');
      }
    } else {
      setUserRole('aprendiz');
      setActiveTab('modulos');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element brand wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer" onClick={() => setActiveTab('inicio')}>
          <div className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
            <SenaSymbol size={38.4} color="#39A900" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            SENA <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Inducción</span>
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'inicio'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Inicio
          </button>

          <button
            onClick={() => setActiveTab('modulos')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'modulos'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Módulos
          </button>

          <button
            onClick={() => setActiveTab('simbolos')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'simbolos'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Símbolos e Himno
          </button>

          <button
            onClick={() => setActiveTab('simulador')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'simulador'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Simulador de Casos
          </button>

          <button
            onClick={() => setActiveTab('seguimiento')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'seguimiento'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {userRole === 'instructor' ? 'Panel de Seguimiento' : 'Mi Progreso'}
          </button>

          <button
            onClick={() => setActiveTab('certificado')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'certificado'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Certificado
          </button>
        </nav>

        {/* Zone 3: 1 primary action + dark mode switch in top-right */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenVideoManual}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Ver video manual interactivo de la plataforma"
          >
            <Film className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Video Manual</span>
          </button>

          <button
            onClick={onOpenAITutor}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Consultar al Tutor Virtual SofIA sobre el reglamento"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Asistente SofIA</span>
          </button>

          <button
            onClick={toggleRole}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            title="Alternar entre vista de Aprendiz y panel de Instructor"
          >
            {userRole === 'aprendiz' ? (
              <>
                <Users className="w-3.5 h-3.5" />
                <span>Modo: Aprendiz</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Modo: Instructor</span>
              </>
            )}
          </button>

          {/* Dark Mode Toggle Button - Esquina Superior Derecha */}
          <button
            onClick={onToggleTheme}
            disabled={isTransitioningTheme}
            className={`p-2 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all duration-300 flex items-center justify-center shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              isTransitioningTheme ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'
            }`}
            title={isDark ? "Cambiar a Modo Claro" : "Activar Modo Oscuro (con transición difusa)"}
            aria-label={isDark ? "Cambiar a Modo Claro" : "Activar Modo Oscuro"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile subnavigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-800 py-2 px-2 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('inicio')}
          className={`px-2 py-1 rounded ${activeTab === 'inicio' ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-600'}`}
        >
          Inicio
        </button>
        <button
          onClick={() => setActiveTab('modulos')}
          className={`px-2 py-1 rounded ${activeTab === 'modulos' ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-600'}`}
        >
          Módulos
        </button>
        <button
          onClick={() => setActiveTab('simbolos')}
          className={`px-2 py-1 rounded ${activeTab === 'simbolos' ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-600'}`}
        >
          Símbolos
        </button>
        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-2 py-1 rounded ${activeTab === 'simulador' ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-600'}`}
        >
          Casos
        </button>
        <button
          onClick={() => setActiveTab('seguimiento')}
          className={`px-2 py-1 rounded ${activeTab === 'seguimiento' ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-600'}`}
        >
          Seguimiento
        </button>
        <button
          onClick={() => setActiveTab('certificado')}
          className={`px-2 py-1 rounded ${activeTab === 'certificado' ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-600'}`}
        >
          Certificado
        </button>
      </div>
    </header>
  );
};
