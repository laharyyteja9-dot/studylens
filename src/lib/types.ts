export type ConceptStatus = 'strong' | 'fair' | 'weak' | 'critical';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface Concept {
  id: string;
  topic: string;
  name: string;
  summary: string;
  sourceExcerpt: string;
  mastery: number; // 0-100
  masteryHistory: number[]; // Added for sparklines
  status: ConceptStatus;
  lastTested?: string;
  confidence: ConfidenceLevel;
  pastMistakes: string[];
}

export interface ExamTrap {
  id: string;
  conceptA: string;
  conceptB: string;
  description: string;
  questions: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string; // ISO
}

export interface StudyPlanItem {
  id: string;
  conceptId: string;
  date: string; // ISO yyyy-mm-dd
  completed: boolean;
}

export interface UserState {
  name: string;
  examName: string;
  examDate: string; // ISO
  isDemoMode: boolean;
  hasVisitedBefore: boolean;
  theme: 'light' | 'warm-dark';
  streak: number;
  lastStudyDate?: string;
  studyTimeThisWeek: { day: string; minutes: number }[];
  concepts: Concept[];
  examTraps: ExamTrap[];
  readinessHistory: { date: string; score: number }[];
  achievements: Achievement[];
  studyPlan: StudyPlanItem[];
}

export interface QuizQuestion {
  id: string;
  conceptId: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizResult {
  conceptId: string;
  isCorrect: boolean;
  timestamp: string;
}
