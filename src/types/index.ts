export type UserRole = 'aprendiz' | 'instructor';

export interface ApprenticeProfile {
  id: string;
  name: string;
  documentType: 'CC' | 'TI' | 'PPT' | 'CE';
  documentNumber: string;
  email: string;
  phone?: string;
  jornada?: string;
  program: string;
  codeFicha: string;
  regional: string;
  center: string;
  avatarUrl?: string;
  enrollmentDate: string;
  progressPercent: number;
  modulesCompleted: string[];
  quizScores: Record<string, number>; // moduleId -> percentage
  badges: string[];
  status: 'en_progreso' | 'aprobado' | 'en_riesgo';
  lastActive: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  articleReference?: string;
}

export interface ModuleSection {
  id: string;
  title: string;
  content: string[];
  keyPoints?: string[];
  interactiveElement?: 'symbols' | 'hymn' | 'cases' | 'structure' | 'infographic';
}

export interface InductionModule {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  durationMinutes: number;
  category: 'identidad' | 'normativa' | 'formacion' | 'bienestar';
  summary: string;
  sections: ModuleSection[];
  quiz: QuizQuestion[];
  badgeName: string;
  badgeDescription: string;
  coverImage?: string;
}

export interface RegulationCase {
  id: string;
  title: string;
  context: string;
  scenario: string;
  questionType: string;
  faultTypeOptions: ('Académica' | 'Disciplinaria')[];
  correctFaultType: 'Académica' | 'Disciplinaria';
  severityOptions: ('Leve' | 'Grave' | 'Gravísima')[];
  correctSeverity: 'Leve' | 'Grave' | 'Gravísima';
  sanctionOptions: string[];
  correctSanction: string;
  justification: string;
  reglamentoArticle: string;
}

export interface HymnStanza {
  number: number;
  title: string;
  verses: string[];
}

export interface InstructorProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  regional: string;
  center: string;
  assignedFicha: string;
  program: string;
  roleDescription: string;
}
