import React, { useState, useEffect } from 'react';
import { UserRole, InductionModule, ApprenticeProfile } from './types';
import { INDUCTION_MODULES, INITIAL_LEARNER, MOCK_COHORT, LEAD_INSTRUCTOR } from './data/senaData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LearnerOverview } from './components/LearnerOverview';
import { ModulesView } from './components/ModulesView';
import { SymbolsExplorer } from './components/SymbolsExplorer';
import { RegulationSimulator } from './components/RegulationSimulator';
import { InstructorDashboard } from './components/InstructorDashboard';
import { ModuleDetailModal } from './components/ModuleDetailModal';
import { QuizModal } from './components/QuizModal';
import { CertificateModal } from './components/CertificateModal';
import { AITutorDrawer } from './components/AITutorDrawer';
import { InstructorLoginModal } from './components/InstructorLoginModal';
import { VideoManualModal } from './components/VideoManualModal';
import { Award, BookOpen, CheckCircle, Scale, Shield, Users } from 'lucide-react';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('aprendiz');
  const [activeTab, setActiveTab] = useState<string>('inicio');
  // Instructor authentication state & profile
  const [instructor, setInstructor] = useState(LEAD_INSTRUCTOR);
  const [isInstructorAuthenticated, setIsInstructorAuthenticated] = useState(false);
  const [showInstructorLoginModal, setShowInstructorLoginModal] = useState(false);

  const handleUpdateInstructorName = (newName: string) => {
    if (!newName.trim()) return;
    setInstructor((prev) => ({
      ...prev,
      name: newName.trim(),
    }));
  };

  // Apprentice state
  const [learner, setLearner] = useState<ApprenticeProfile>(INITIAL_LEARNER);
  // Cohort state for instructor tracking
  const [cohort, setCohort] = useState<ApprenticeProfile[]>(MOCK_COHORT);

  // Dark mode state with screen blur transition
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isTransitioningTheme, setIsTransitioningTheme] = useState(false);

  // Sync initial theme class on mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    if (isTransitioningTheme) return;

    // 1. Activate smooth blur phase
    setIsTransitioningTheme(true);

    // 2. Midway through the blur, change colors / classes
    setTimeout(() => {
      const nextTheme = !isDark;
      setIsDark(nextTheme);
      if (nextTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('sena_dark_mode', String(nextTheme));
    }, 220);

    // 3. Clear blur, revealing the crisp new theme
    setTimeout(() => {
      setIsTransitioningTheme(false);
    }, 550);
  };

  // Modals state
  const [selectedModule, setSelectedModule] = useState<InductionModule | null>(null);
  const [quizModule, setQuizModule] = useState<InductionModule | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);
  const [showVideoManual, setShowVideoManual] = useState(false);

  // Certificate viewing target (learner or someone inspected from cohort)
  const [targetCertificateLearner, setTargetCertificateLearner] = useState<ApprenticeProfile>(INITIAL_LEARNER);

  // Handler when quiz completes
  const handleQuizComplete = (moduleId: string, scorePercent: number, badgeAwarded: string) => {
    setLearner((prev) => {
      const updatedModules = prev.modulesCompleted.includes(moduleId)
        ? prev.modulesCompleted
        : [...prev.modulesCompleted, moduleId];

      const updatedScores = {
        ...prev.quizScores,
        [moduleId]: Math.max(prev.quizScores[moduleId] || 0, scorePercent),
      };

      const updatedBadges = prev.badges.includes(badgeAwarded)
        ? prev.badges
        : [...prev.badges, badgeAwarded];

      const totalModulesCount = INDUCTION_MODULES.length;
      const newProgressPercent = Math.round((updatedModules.length / totalModulesCount) * 100);

      // Check if all modules completed
      const newStatus = newProgressPercent >= 100 ? 'aprobado' : prev.status;
      if (newStatus === 'aprobado' && !updatedBadges.includes('Inducción Culminada')) {
        updatedBadges.push('Inducción Culminada');
      }

      const updatedProfile: ApprenticeProfile = {
        ...prev,
        modulesCompleted: updatedModules,
        quizScores: updatedScores,
        badges: updatedBadges,
        progressPercent: newProgressPercent,
        status: newStatus,
        lastActive: 'Hace un momento',
      };

      // Also update in the cohort
      setCohort((prevCohort) =>
        prevCohort.map((item) => (item.id === updatedProfile.id ? updatedProfile : item))
      );

      return updatedProfile;
    });
  };

  // Instructor updates an apprentice's status
  const handleUpdateApprenticeStatus = (id: string, status: 'en_progreso' | 'aprobado' | 'en_riesgo') => {
    setCohort((prevCohort) =>
      prevCohort.map((item) => {
        if (item.id === id) {
          const isNowApproved = status === 'aprobado';
          const updated = {
            ...item,
            status,
            progressPercent: isNowApproved ? 100 : item.progressPercent,
            modulesCompleted: isNowApproved
              ? INDUCTION_MODULES.map((m) => m.id)
              : item.modulesCompleted,
          };
          if (learner.id === id) {
            setLearner(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleSelectApprenticeCertificate = (apprentice: ApprenticeProfile) => {
    setTargetCertificateLearner(apprentice);
    setShowCertificate(true);
  };

  const handleAddApprentice = (newApprentice: ApprenticeProfile) => {
    setCohort((prev) => [newApprentice, ...prev]);
  };

  const handleSaveAndEnterApprentice = (savedLearner: ApprenticeProfile) => {
    setCohort((prevCohort) => {
      const idx = prevCohort.findIndex(
        (a) => a.documentNumber === savedLearner.documentNumber || a.id === savedLearner.id
      );
      if (idx >= 0) {
        const updated = [...prevCohort];
        updated[idx] = savedLearner;
        return updated;
      }
      return [savedLearner, ...prevCohort];
    });

    setLearner(savedLearner);
    setUserRole('aprendiz');
    setActiveTab('modulos');
  };

  const handleSelectRole = (role: 'aprendiz' | 'instructor', apprenticeId?: string) => {
    if (role === 'instructor') {
      setIsInstructorAuthenticated(true);
    }
    setUserRole(role);
    if (role === 'aprendiz') {
      if (apprenticeId) {
        const found = cohort.find((a) => a.id === apprenticeId);
        if (found) {
          setLearner(found);
        }
      }
      setActiveTab('modulos');
    } else {
      setActiveTab('seguimiento');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-500 relative">
      
      {/* Full-screen Glass Blur Transition Overlay (triggers on theme toggle) */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-all duration-500 ease-in-out ${
          isTransitioningTheme
            ? 'backdrop-blur-xl bg-slate-900/25 dark:bg-black/35 opacity-100'
            : 'backdrop-blur-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Main page content container with soft blur morph */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${
          isTransitioningTheme
            ? 'filter blur-md scale-[0.99] select-none pointer-events-none'
            : 'filter-none scale-100'
        }`}
      >
        {/* Top Bar Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={userRole}
          setUserRole={setUserRole}
          onOpenAITutor={() => setShowAITutor(true)}
          onOpenVideoManual={() => setShowVideoManual(true)}
          progressPercent={learner.progressPercent}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          isTransitioningTheme={isTransitioningTheme}
          onRequestInstructorLogin={() => setShowInstructorLoginModal(true)}
          isInstructorAuthenticated={isInstructorAuthenticated}
        />

        {/* Main Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Landing Page: Role Selection & Overview */}
        {activeTab === 'inicio' ? (
          <LandingPage
            cohort={cohort}
            instructor={instructor}
            modules={INDUCTION_MODULES}
            currentLearner={learner}
            onSaveAndEnterApprentice={handleSaveAndEnterApprentice}
            onSelectRole={handleSelectRole}
            onUpdateInstructorName={handleUpdateInstructorName}
          />
        ) : userRole === 'instructor' && activeTab === 'seguimiento' ? (
          <InstructorDashboard
            cohort={cohort}
            modules={INDUCTION_MODULES}
            onUpdateApprenticeStatus={handleUpdateApprenticeStatus}
            onSelectApprentice={handleSelectApprenticeCertificate}
            onAddApprentice={handleAddApprentice}
            instructor={instructor}
          />
        ) : (
          /* Apprentice Mode / Content exploration */
          <div className="space-y-8">
            
            {/* Learner Progress & Profile Banner (visible for apprentice on course views) */}
            {userRole === 'aprendiz' && activeTab !== 'certificado' && (
              <LearnerOverview
                learner={learner}
                totalModules={INDUCTION_MODULES.length}
                onContinue={() => {
                  const nextMod = INDUCTION_MODULES.find(
                    (m) => !learner.modulesCompleted.includes(m.id)
                  ) || INDUCTION_MODULES[0];
                  setSelectedModule(nextMod);
                }}
                onViewCert={() => {
                  setTargetCertificateLearner(learner);
                  setShowCertificate(true);
                }}
              />
            )}

            {/* Content Tabs */}
            {activeTab === 'modulos' && (
              <ModulesView
                modules={INDUCTION_MODULES}
                learner={learner}
                onSelectModule={(m) => setSelectedModule(m)}
                onOpenQuiz={(m) => setQuizModule(m)}
              />
            )}

            {activeTab === 'simbolos' && (
              <SymbolsExplorer />
            )}

            {activeTab === 'simulador' && (
              <RegulationSimulator />
            )}

            {activeTab === 'seguimiento' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Mi Hoja de Seguimiento de Inducción
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Evidencias, evaluaciones y resultados requeridos para validar tu proceso de inducción institucional.
                  </p>
                </div>

                {/* Progress Details Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Modules Breakdown */}
                  <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Estado por Módulos y Cuestionarios</span>
                    </h3>

                    <div className="space-y-3">
                      {INDUCTION_MODULES.map((m) => {
                        const isDone = learner.modulesCompleted.includes(m.id);
                        const score = learner.quizScores[m.id];

                        return (
                          <div
                            key={m.id}
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                          >
                            <div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span>Módulo {m.order}</span>
                                <span aria-hidden="true">·</span>
                                <span className="capitalize">{m.category}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                                {m.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {isDone ? (
                                <div className="text-right">
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Aprobado</span>
                                  </span>
                                  <p className="text-[11px] font-mono text-slate-500">
                                    Nota: {score}%
                                  </p>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setQuizModule(m)}
                                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                                >
                                  Presentar Quiz
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Badges & Certificate Readiness */}
                  <div className="space-y-6">
                    {/* Badges Box */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>Insignias de Inducción</span>
                      </h3>

                      <div className="space-y-2.5">
                        {INDUCTION_MODULES.map((m) => {
                          const hasBadge = learner.badges.includes(m.badgeName);

                          return (
                            <div
                              key={m.id}
                              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                                hasBadge
                                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                                  : 'border-slate-200 dark:border-slate-800 opacity-50'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${hasBadge ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <Award className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                  {m.badgeName}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {m.badgeDescription}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Certificate Status */}
                    <div className="bg-emerald-800 text-white rounded-2xl p-6 shadow-sm space-y-3">
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-300" />
                        <span>Certificación Oficial</span>
                      </h3>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        Al completar el 100% de la ruta y aprobar los cuestionarios, se genera automáticamente el Certificado Oficial de Inducción validado con código único.
                      </p>
                      
                      <button
                        onClick={() => {
                          setTargetCertificateLearner(learner);
                          setShowCertificate(true);
                        }}
                        className="w-full py-2.5 px-4 text-xs font-bold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 rounded-xl transition-colors shadow-xs"
                      >
                        {learner.progressPercent >= 100 ? 'Ver Certificado Oficial' : 'Vista Previa del Certificado'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'certificado' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Certificado Oficial de Inducción SENA
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Constancia institucional que valida la culminación del proceso de inducción.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setTargetCertificateLearner(learner);
                      setShowCertificate(true);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    Abrir en Modo Impresión
                  </button>
                </div>

                {/* Inline Certificate Preview */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
                  <div className="border-2 border-emerald-800 p-8 rounded-xl text-center space-y-4 bg-radial from-white via-white to-emerald-50/30 text-slate-900">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                      Servicio Nacional de Aprendizaje · SENA
                    </p>
                    <h3 className="text-2xl font-black text-emerald-900 font-serif">
                      CERTIFICADO DE INDUCCIÓN
                    </h3>
                    <p className="text-sm max-w-lg mx-auto text-slate-700">
                      Otorgado a <strong>{learner.name}</strong> ({learner.documentType} {learner.documentNumber}) por haber aprobado satisfactoriamente los módulos de Identidad Institucional, Símbolos y Reglamento del Aprendiz en la Ficha <strong>{learner.codeFicha}</strong>.
                    </p>
                    <p className="text-xs font-mono text-emerald-800 font-semibold">
                      Folio Digital: SENA-IND-2026-{learner.codeFicha}-{learner.documentNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <ModuleDetailModal
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
        onStartQuiz={(m) => {
          setSelectedModule(null);
          setQuizModule(m);
        }}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      <QuizModal
        module={quizModule}
        onClose={() => setQuizModule(null)}
        onQuizComplete={handleQuizComplete}
      />

      {showCertificate && (
        <CertificateModal
          learner={targetCertificateLearner}
          onClose={() => setShowCertificate(false)}
        />
      )}

      <AITutorDrawer
        isOpen={showAITutor}
        onClose={() => setShowAITutor(false)}
      />

      {/* Video Manual Floating Modal */}
      <VideoManualModal
        isOpen={showVideoManual}
        onClose={() => setShowVideoManual(false)}
      />

      {/* Global Instructor Login Modal */}
      <InstructorLoginModal
        isOpen={showInstructorLoginModal}
        onClose={() => setShowInstructorLoginModal(false)}
        onSuccess={(customName) => {
          if (customName) {
            handleUpdateInstructorName(customName);
          }
          setIsInstructorAuthenticated(true);
          setUserRole('instructor');
          setActiveTab('seguimiento');
        }}
        instructor={instructor}
      />

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">SENA</span>
            <span aria-hidden="true">·</span>
            <span>Servicio Nacional de Aprendizaje · Colombia</span>
            <span aria-hidden="true">·</span>
            <span>Dirección de Formación Profesional</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Reglamento del Aprendiz (Acuerdo 007 de 2012)</span>
            <span aria-hidden="true">·</span>
            <span>SOFIA Plus & ZAJUNA</span>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
