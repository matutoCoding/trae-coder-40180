export type SceneType = 'opening' | 'clarify' | 'comfort' | 'closing';

export interface SceneInfo {
  type: SceneType;
  label: string;
  color: string;
}

export const SCENE_INFO: Record<SceneType, SceneInfo> = {
  opening: { type: 'opening', label: '开场确认', color: '#3B82F6' },
  clarify: { type: 'clarify', label: '需求澄清', color: '#8B5CF6' },
  comfort: { type: 'comfort', label: '情绪安抚', color: '#EC4899' },
  closing: { type: 'closing', label: '结束确认', color: '#10B981' }
};

export type MaterialQuality = 'excellent' | 'failed';

export interface DialogueTurn {
  id: string;
  speaker: 'customer' | 'agent';
  content: string;
  timestamp?: string;
  segment?: SceneType;
}

export interface Material {
  id: string;
  title: string;
  scene: SceneType;
  quality: MaterialQuality;
  category: string;
  duration: number;
  date: string;
  summary: string;
  dialogue: DialogueTurn[];
  tags: string[];
}

export interface PracticeOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface PracticeQuestion {
  id: string;
  scene: SceneType;
  customerContent: string;
  options: PracticeOption[];
  agentAnswer: string;
  qualityReview: string;
  recommendedScript: string;
  errorType?: string;
  explanation: string;
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  scene: SceneType;
  customerContent: string;
  selectedOption: string;
  correctAnswer: string;
  errorType: string;
  agentAnswer: string;
  qualityReview: string;
  recommendedScript: string;
  explanation: string;
  practiceDate: string;
  reviewCount: number;
}

export interface PracticeSession {
  id: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  scenes: SceneType[];
}

export interface UserStats {
  totalPracticeDays: number;
  totalQuestions: number;
  correctRate: number;
  streakDays: number;
  sceneStats: Record<SceneType, { total: number; correct: number; }>;
  recentSessions: PracticeSession[];
}

export interface UserInfo {
  name: string;
  avatar?: string;
  department: string;
  position: string;
  joinDate: string;
  stats: UserStats;
}

export type AddMaterialForm = {
  title: string;
  quality: MaterialQuality;
  scene: SceneType;
  category: string;
};
