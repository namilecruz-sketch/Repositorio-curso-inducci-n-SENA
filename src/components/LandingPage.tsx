import React, { useState } from 'react';
import { ApprenticeProfile, InstructorProfile, InductionModule } from '../types';
import { SenaSymbol } from './SenaLogo';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Save,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  FileBadge,
  Building,
  MapPin,
  Clock,
  Lightbulb,
  Info,
  HelpCircle,
  KeyRound,
  Lock,
} from 'lucide-react';
import { InstructorLoginModal, GENERIC_INSTRUCTOR_CREDENTIALS } from './InstructorLoginModal';

interface LandingPageProps {
  cohort: ApprenticeProfile[];
  instructor: InstructorProfile;
  modules: InductionModule[];
  currentLearner: ApprenticeProfile;
  onSaveAndEnterApprentice: (learner: ApprenticeProfile) => void;
  onSelectRole: (role: 'aprendiz' | 'instructor', apprenticeId?: string) => void;
  onUpdateInstructorName?: (name: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  cohort,
  instructor,
  modules,
  currentLearner,
  onSaveAndEnterApprentice,
  onSelectRole,
  onUpdateInstructorName,
}) => {
  // Modal / Form state for apprentice registration & intake
  const [showApprenticeForm, setShowApprenticeForm] = useState(false);
  // Modal state for instructor authentication
  const [showInstructorLogin, setShowInstructorLogin] = useState(false);
  // Editable instructor name state
  const [instructorNameInput, setInstructorNameInput] = useState(instructor.name || 'Ing. Carlos Mario Duarte');

  // Form Fields - Initialized Clean
  const [docType, setDocType] = useState<'CC' | 'TI' | 'PPT' | 'CE'>('CC');
  const [docNumber, setDocNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jornada, setJornada] = useState('Mañana');
  const [program, setProgram] = useState('Tecnólogo en Análisis y Desarrollo de Software (ADSO)');
  const [codeFicha, setCodeFicha] = useState('2758392');
  const [center, setCenter] = useState('Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)');
  const [regional, setRegional] = useState('Regional Distrito Capital');

  // Existing progress tracking data
  const [existingProgress, setExistingProgress] = useState<{
    percent: number;
    modules: string[];
    scores: Record<string, number>;
    badges: string[];
    status: 'en_progreso' | 'aprobado' | 'en_riesgo';
  }>({
    percent: 0,
    modules: [],
    scores: {},
    badges: [],
    status: 'en_progreso',
  });

  const [isSavedAnimation, setIsSavedAnimation] = useState(false);

  // Helper to reset/clean all form fields
  const handleResetForm = () => {
    setDocType('CC');
    setDocNumber('');
    setFullName('');
    setEmail('');
    setPhone('');
    setJornada('Mañana');
    setProgram('Tecnólogo en Análisis y Desarrollo de Software (ADSO)');
    setCodeFicha('2758392');
    setCenter('Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)');
    setRegional('Regional Distrito Capital');
    setExistingProgress({
      percent: 0,
      modules: [],
      scores: {},
      badges: [],
      status: 'en_progreso',
    });
  };

  // Helper to load an existing apprentice into the form
  const handleSelectExistingApprentice = (apr: ApprenticeProfile) => {
    setDocType(apr.documentType);
    setDocNumber(apr.documentNumber);
    setFullName(apr.name);
    setEmail(apr.email);
    setPhone(apr.phone || '312 458 9210');
    setJornada(apr.jornada || 'Mañana');
    setProgram(apr.program);
    setCodeFicha(apr.codeFicha);
    setCenter(apr.center);
    setRegional(apr.regional);
    setExistingProgress({
      percent: apr.progressPercent,
      modules: apr.modulesCompleted,
      scores: apr.quizScores,
      badges: apr.badges,
      status: apr.status,
    });
  };

  // When user types a document number, check if it matches someone in the cohort
  const handleDocNumberChange = (value: string) => {
    setDocNumber(value);
    const matched = cohort.find((a) => a.documentNumber.trim() === value.trim());
    if (matched) {
      handleSelectExistingApprentice(matched);
    }
  };

  const handleSaveApprenticeProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !docNumber.trim()) return;

    setIsSavedAnimation(true);

    const existingInCohort = cohort.find(
      (a) => a.documentNumber.trim() === docNumber.trim()
    );

    const savedProfile: ApprenticeProfile = {
      id: existingInCohort ? existingInCohort.id : `apr-${Date.now().toString().slice(-4)}`,
      name: fullName.trim(),
      documentType: docType,
      documentNumber: docNumber.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '')}@misena.edu.co`,
      phone: phone.trim(),
      jornada: jornada,
      program: program.trim(),
      codeFicha: codeFicha.trim(),
      regional: regional.trim(),
      center: center.trim(),
      enrollmentDate: existingInCohort ? existingInCohort.enrollmentDate : 'Febrero 2026',
      progressPercent: existingProgress.percent,
      modulesCompleted: existingProgress.modules,
      quizScores: existingProgress.scores,
      badges: existingProgress.badges,
      status: existingProgress.status,
      lastActive: 'Hace un momento',
    };

    setTimeout(() => {
      setIsSavedAnimation(false);
      setShowApprenticeForm(false);
      onSaveAndEnterApprentice(savedProfile);
    }, 400);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-emerald-900 text-white border border-emerald-800 shadow-lg">
        {/* Visual Background with subtle overlay */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src="/src/assets/images/hero_sena_induction_1794325234431.jpg"
            alt="Ambiente tecnológico SENA"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-emerald-900/90 to-emerald-800/80" />

        <div className="relative px-6 py-12 sm:px-12 sm:py-16 max-w-5xl mx-auto text-center space-y-6">
          {/* Top Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-200">
            <div className="p-0.5 rounded-full bg-white flex items-center justify-center">
              <SenaSymbol size={16} color="#007832" />
            </div>
            <span>Servicio Nacional de Aprendizaje · República de Colombia</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Plataforma Institucional de <br className="hidden sm:inline" />
            <span className="text-emerald-300">Inducción y Normativa SENA</span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Bienvenido al portal oficial de inducción para la Formación Profesional Integral. Identifícate con tus datos, realiza el seguimiento a tu progreso formativo y apropia los principios del Reglamento del Aprendiz.
          </p>

          {/* Micro Stats Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-emerald-800/80 text-left">
            <div className="p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
              <span className="text-[11px] text-emerald-300 block font-mono">Ficha Asignada</span>
              <p className="text-sm sm:text-base font-bold text-white mt-0.5">2758392 ADSO</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
              <span className="text-[11px] text-emerald-300 block font-mono">Aprendices Cohorte</span>
              <p className="text-sm sm:text-base font-bold text-white mt-0.5">{cohort.length} Matriculados</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
              <span className="text-[11px] text-emerald-300 block font-mono">Instructor Líder</span>
              <p className="text-sm sm:text-base font-bold text-white mt-0.5">1 Encargado</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
              <span className="text-[11px] text-emerald-300 block font-mono">Módulos Formativos</span>
              <p className="text-sm sm:text-base font-bold text-white mt-0.5">{modules.length} Módulos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section - Core User Flow */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Selecciona tu Perfil de Ingreso
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Escoge tu rol para acceder a la plataforma: como <strong>Aprendiz</strong> completando tus datos de interés para registrar tu avance, o como el <strong>Instructor Encargado</strong> para auditar toda la cohorte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Card 1: Portal del Aprendiz (With Step: Choose role -> Fill data & progress -> Save -> Enter prototype) */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:border-emerald-500/60 transition-all duration-300 group">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Portal del Aprendiz
                  </h3>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    Ingreso personalizado con registro de progreso
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              Selecciona tu rol de aprendiz para registrar o actualizar tus datos de interés institucional. Podrás guardar tu perfil, comprobar tu porcentaje de avance y continuar con tu inducción.
            </p>

            {/* Quick 3-Step Flow Indicator */}
            <div className="my-5 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Flujo de Acceso del Aprendiz:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block font-mono">Paso 1</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">Elegir Rol</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block font-mono">Paso 2</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">Llenar Datos</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block font-mono">Paso 3</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">Guardar e Ir</span>
                </div>
              </div>
            </div>

            {/* Features check list */}
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-6 flex-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Formulario completo de datos de contacto y caracterización</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reconocimiento de historial de progreso o matrícula nueva</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Guardado de perfil con redirección automática al prototipo</span>
              </li>
            </ul>

            <button
              onClick={() => {
                handleResetForm();
                setShowApprenticeForm(true);
              }}
              className="w-full py-3.5 px-5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Ingresar como Aprendiz (Llenar y Guardar Perfil)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Portal del Instructor Encargado (Single lead instructor) */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:border-blue-500/60 transition-all duration-300 group">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-700 dark:text-blue-400 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Portal del Instructor
                  </h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    Único Docente Encargado de la Ficha
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed mb-5">
              Espacio exclusivo para el docente líder responsable de consolidar la información, verificar el progreso de todos los aprendices y expedir los certificados oficiales.
            </p>

            {/* Instructor capabilities list */}
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-6 flex-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Panel de control con métricas en tiempo real de los {cohort.length} aprendices</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Semáforo de alertas tempranas por inactividad o riesgo de deserción</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Aprobación de evidencias y validación individual de inducción</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Exportación de actas completas en formato CSV / Excel</span>
              </li>
            </ul>

            {/* Custom Instructor Name input block */}
            <div className="mb-4 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Nombre del Instructor Encargado</span>
                </span>
                <span className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold uppercase">Personalizable</span>
              </label>
              <input
                type="text"
                value={instructorNameInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setInstructorNameInput(val);
                  if (onUpdateInstructorName && val.trim()) {
                    onUpdateInstructorName(val.trim());
                  }
                }}
                placeholder="Ej: Ing. Carlos Mario Duarte o tu nombre"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-start gap-1">
                <span>💡</span>
                <span><strong>Pista:</strong> Puedes ingresar otro nombre de instructor para evaluar la cohorte.</span>
              </p>
            </div>

            <button
              onClick={() => setShowInstructorLogin(true)}
              className="w-full py-3.5 px-5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
            >
              <Lock className="w-4 h-4 text-blue-300" />
              <span>
                Ingresar como Instructor ({instructorNameInput.trim().split(' ').slice(1, 2)[0] || instructorNameInput.trim().split(' ')[0] || 'Docente'})
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* APPRENTICE INTAKE & PROFILE REGISTRATION MODAL / VIEW */}
      {showApprenticeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full my-6 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    Ficha de Identificación del Aprendiz SENA
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Ingresa tus datos requeridos para registrar tu perfil e iniciar tu inducción.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowApprenticeForm(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Pedagogical Guidance Banner */}
            <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
              <div className="p-1 rounded-lg bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <span className="font-bold block text-amber-950 dark:text-amber-100 mb-0.5">
                  Guía de diligenciamiento del perfil
                </span>
                El formulario inicia con los <strong>campos limpios</strong> para tu registro. Sigue las pistas (💡) detalladas debajo de cada casilla para ingresar la información correcta requerida por el SENA. Al guardar, tu perfil quedará registrado en el prototipo.
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveApprenticeProfile} className="p-6 space-y-4 overflow-y-auto max-h-[65vh]">
              
              {/* Document Type & Number Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Documento *
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as 'CC' | 'TI' | 'PPT' | 'CE')}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CC">C.C. - Cédula de Ciudadanía</option>
                    <option value="TI">T.I. - Tarjeta de Identidad</option>
                    <option value="PPT">P.P.T. - Permiso Protección Temporal</option>
                    <option value="CE">C.E. - Cédula de Extranjería</option>
                  </select>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                    <span>💡</span>
                    <span><strong>Pista:</strong> Tipo con el que estás inscrito en SOFIA Plus.</span>
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={(e) => handleDocNumberChange(e.target.value)}
                    placeholder="Ej: 1020485921 (solo números, sin puntos)"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 flex items-start gap-1">
                    <span>💡</span>
                    <span><strong>Pista:</strong> Solo dígitos. Si ya tienes avance registrado, el sistema cargará tu progreso automáticamente.</span>
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombres y Apellidos Completos *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Valentina Restrepo Morales"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 flex items-start gap-1">
                  <span>💡</span>
                  <span><strong>Pista:</strong> Escribe tus nombres completos como figuran en tu documento oficial. Se usarán para tu certificado de inducción.</span>
                </p>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Correo Institucional / Personal *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej: vrestrepo@misena.edu.co o tu correo personal"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                    <span>💡</span>
                    <span><strong>Pista:</strong> Tu correo @misena.edu.co o tu correo principal donde recibes notificaciones académicas.</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Teléfono o Celular de Contacto</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 312 458 9210 (10 dígitos)"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                    <span>💡</span>
                    <span><strong>Pista:</strong> Número de celular de 10 dígitos para contacto con tu instructor vocero y Bienestar al Aprendiz.</span>
                  </p>
                </div>
              </div>

              {/* Program & Ficha */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <FileBadge className="w-3.5 h-3.5 text-slate-400" />
                    <span>Programa de Formación Titulada</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    placeholder="Ej: Tecnólogo en Análisis y Desarrollo de Software (ADSO)"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                    <span>💡</span>
                    <span><strong>Pista:</strong> Programa técnico o tecnológico oficial en el que estás matriculado.</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ficha de Caracterización *
                  </label>
                  <input
                    type="text"
                    required
                    value={codeFicha}
                    onChange={(e) => setCodeFicha(e.target.value)}
                    placeholder="Ej: 2758392"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                    <span>💡</span>
                    <span><strong>Pista:</strong> Código de ficha de 7 dígitos.</span>
                  </p>
                </div>
              </div>

              {/* Jornada & Centro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jornada Formativa</span>
                  </label>
                  <select
                    value={jornada}
                    onChange={(e) => setJornada(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Mañana">Jornada Mañana (6:00 AM - 12:00 PM)</option>
                    <option value="Tarde">Jornada Tarde (12:00 PM - 6:00 PM)</option>
                    <option value="Noche">Jornada Noche (6:00 PM - 10:00 PM)</option>
                    <option value="Mixta">Jornada Mixta / Virtual</option>
                  </select>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                    <span>💡</span>
                    <span><strong>Pista:</strong> Franja horaria de tu formación en el SENA.</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Centro de Formación</span>
                  </label>
                  <input
                    type="text"
                    value={center}
                    onChange={(e) => setCenter(e.target.value)}
                    placeholder="Ej: Centro de Electricidad, Electrónica y Telecomunicaciones"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                    <span>💡</span>
                    <span><strong>Pista:</strong> Centro de Formación y Regional a la que perteneces.</span>
                  </p>
                </div>
              </div>

              {/* Progress Summary Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-2">
                  <span>Progreso de Inducción Reconocido:</span>
                  <span className="font-mono text-base text-emerald-700 dark:text-emerald-400">
                    {existingProgress.percent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-emerald-200/50 dark:bg-emerald-900/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${existingProgress.percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 mt-2">
                  <span>Módulos acreditados: {existingProgress.modules.length} de {modules.length}</span>
                  <span className="capitalize">Estado: {existingProgress.status.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Form Footer Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar formulario</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApprenticeForm(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSavedAnimation}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {isSavedAnimation ? 'Guardando Perfil...' : 'Guardar Perfil y Continuar a la Inducción'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Instructor Login Modal with Generic Credentials */}
      <InstructorLoginModal
        isOpen={showInstructorLogin}
        onClose={() => setShowInstructorLogin(false)}
        onSuccess={(customName) => {
          if (customName && onUpdateInstructorName) {
            onUpdateInstructorName(customName);
            setInstructorNameInput(customName);
          }
          onSelectRole('instructor');
        }}
        instructor={{
          ...instructor,
          name: instructorNameInput.trim() || instructor.name,
        }}
      />
    </div>
  );
};
