import React, { useState } from 'react';
import { ApprenticeProfile, InductionModule, InstructorProfile } from '../types';
import { Users, AlertTriangle, CheckCircle2, Download, Search, FileText, Plus, Eye, Award } from 'lucide-react';

interface InstructorDashboardProps {
  cohort: ApprenticeProfile[];
  modules: InductionModule[];
  onUpdateApprenticeStatus: (id: string, status: 'en_progreso' | 'aprobado' | 'en_riesgo') => void;
  onSelectApprentice: (apprentice: ApprenticeProfile) => void;
  onAddApprentice: (newApprentice: ApprenticeProfile) => void;
  instructor?: InstructorProfile;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  cohort,
  modules,
  onUpdateApprenticeStatus,
  onSelectApprentice,
  onAddApprentice,
  instructor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'aprobado' | 'en_progreso' | 'en_riesgo'>('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDetailsApprentice, setSelectedDetailsApprentice] = useState<ApprenticeProfile | null>(null);

  // Form state for adding an apprentice
  const [newName, setNewName] = useState('');
  const [newDoc, setNewDoc] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Calculations
  const total = cohort.length;
  const approved = cohort.filter((a) => a.status === 'aprobado').length;
  const inProgress = cohort.filter((a) => a.status === 'en_progreso').length;
  const atRisk = cohort.filter((a) => a.status === 'en_riesgo').length;
  const avgProgress = Math.round(
    cohort.reduce((acc, curr) => acc + curr.progressPercent, 0) / (total || 1)
  );

  const filteredCohort = cohort.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.documentNumber.includes(searchTerm) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'todos') return matchesSearch;
    return matchesSearch && a.status === statusFilter;
  });

  const handleExportCSV = () => {
    const headers = ['ID,Nombre,Documento,Email,Ficha,Progreso,ModulosCompletados,Estado,UltimaActividad\n'];
    const rows = cohort.map(
      (a) =>
        `"${a.id}","${a.name}","${a.documentType} ${a.documentNumber}","${a.email}","${a.codeFicha}","${a.progressPercent}%","${a.modulesCompleted.length}/${modules.length}","${a.status}","${a.lastActive}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SENA_Seguimiento_Induccion_Ficha_2758392.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateApprentice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDoc.trim()) return;

    const newApprentice: ApprenticeProfile = {
      id: `apr-${Date.now().toString().slice(-4)}`,
      name: newName.trim(),
      documentType: 'CC',
      documentNumber: newDoc.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '')}@misena.edu.co`,
      program: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      codeFicha: '2758392',
      regional: 'Regional Distrito Capital',
      center: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
      enrollmentDate: 'Febrero 2026',
      progressPercent: 0,
      modulesCompleted: [],
      quizScores: {},
      badges: [],
      status: 'en_progreso',
      lastActive: 'Recién registrado',
    };

    onAddApprentice(newApprentice);
    setShowAddModal(false);
    setNewName('');
    setNewDoc('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Ficha de Caracterización 2758392 (ADSO)</span>
            <span aria-hidden="true">·</span>
            <span>Centro CEET</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              Instructor Encargado: {instructor?.name || 'Ing. Carlos Mario Duarte'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Panel de Seguimiento y Control de Inducción
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Matricular Aprendiz</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Acta (.CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Aprendices</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
            {total}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ficha 2758392 ADSO</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Avance Promedio</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-1">
            {avgProgress}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Meta de cohorte: 100%</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Inducción Aprobada</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
            {approved} <span className="text-xs font-normal text-slate-500">({Math.round((approved / total) * 100)}%)</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Con certificado habilitado</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>En Riesgo / Inactivos</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums mt-1">
            {atRisk}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">&gt; 3 días sin avance</p>
        </div>
      </div>

      {/* Cohort Table & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Table Controls Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, documento o correo..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'todos' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Todos ({total})
            </button>
            <button
              onClick={() => setStatusFilter('aprobado')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'aprobado' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Aprobados ({approved})
            </button>
            <button
              onClick={() => setStatusFilter('en_progreso')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'en_progreso' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              En Curso ({inProgress})
            </button>
            <button
              onClick={() => setStatusFilter('en_riesgo')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'en_riesgo' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              En Riesgo ({atRisk})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Aprendiz</th>
                <th className="py-3 px-4">Documento</th>
                <th className="py-3 px-4">Progreso</th>
                <th className="py-3 px-4">Módulos</th>
                <th className="py-3 px-4">Última Conexión</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredCohort.map((apprentice) => {
                return (
                  <tr key={apprentice.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {apprentice.name}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {apprentice.email}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      {apprentice.documentType} {apprentice.documentNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              apprentice.progressPercent === 100
                                ? 'bg-emerald-600'
                                : apprentice.progressPercent > 30
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${apprentice.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold tabular-nums">
                          {apprentice.progressPercent}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums">
                      {apprentice.modulesCompleted.length} / {modules.length}
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {apprentice.lastActive}
                    </td>

                    <td className="py-3 px-4">
                      {apprentice.status === 'aprobado' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aprobado</span>
                        </span>
                      ) : apprentice.status === 'en_riesgo' ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>En Riesgo</span>
                        </span>
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          En Progreso
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDetailsApprentice(apprentice)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Ver detalle del aprendiz"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {apprentice.status !== 'aprobado' ? (
                          <button
                            onClick={() => onUpdateApprenticeStatus(apprentice.id, 'aprobado')}
                            className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 rounded transition-colors"
                            title="Validar inducción y expedir certificado"
                          >
                            Aprobar
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectApprentice(apprentice)}
                            className="px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Ver certificado del aprendiz"
                          >
                            Certificado
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Apprentice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Matricular Nuevo Aprendiz en la Ficha
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Agrega un aprendiz a la cohorte de inducción de la Ficha 2758392.
            </p>

            <form onSubmit={handleCreateApprentice} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Camilo Andrés Rojas"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Número de Documento (C.C. / T.I.)
                </label>
                <input
                  type="text"
                  required
                  value={newDoc}
                  onChange={(e) => setNewDoc(e.target.value)}
                  placeholder="Ej: 1024589231"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Correo Institucional (@misena.edu.co)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Ej: crojas231@misena.edu.co"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  Guardar y Matricular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Apprentice Details Modal */}
      {selectedDetailsApprentice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hoja de Seguimiento del Aprendiz
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedDetailsApprentice.name} · {selectedDetailsApprentice.documentType} {selectedDetailsApprentice.documentNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedDetailsApprentice(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <p><strong>Programa:</strong> {selectedDetailsApprentice.program}</p>
                <p><strong>Centro:</strong> {selectedDetailsApprentice.center}</p>
                <p><strong>Regional:</strong> {selectedDetailsApprentice.regional}</p>
                <p><strong>Fecha de Matrícula:</strong> {selectedDetailsApprentice.enrollmentDate}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  Resultados por Módulo de Inducción:
                </h4>
                <div className="space-y-1.5">
                  {modules.map((m) => {
                    const done = selectedDetailsApprentice.modulesCompleted.includes(m.id);
                    const score = selectedDetailsApprentice.quizScores[m.id];
                    return (
                      <div key={m.id} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                        <span>Módulo {m.order}: {m.shortTitle}</span>
                        <span className={done ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                          {done ? `Aprobado (${score}%)` : 'Pendiente'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedDetailsApprentice.badges.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    Insignias Ganadas:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDetailsApprentice.badges.map((b, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-xs">
                        <Award className="w-3 h-3" />
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDetailsApprentice(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
