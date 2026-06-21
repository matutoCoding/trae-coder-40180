import { create } from 'zustand';
import type { PracticeQuestion, MistakeRecord, UserInfo, SceneType, UserStats } from '@/types';

interface PracticeState {
  currentQuestionIndex: number;
  todayQuestions: PracticeQuestion[];
  selectedOptionId: string | null;
  showAnswer: boolean;
  mistakes: MistakeRecord[];
  userInfo: UserInfo;
  isPracticeComplete: boolean;

  setCurrentQuestionIndex: (index: number) => void;
  setSelectedOption: (optionId: string | null) => void;
  setShowAnswer: (show: boolean) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  resetPractice: () => void;
  addMistake: (mistake: MistakeRecord) => void;
  updateUserStats: (scene: SceneType, isCorrect: boolean) => void;
  markMistakeReviewed: (mistakeId: string) => void;
}

const initialStats: UserStats = {
  totalPracticeDays: 12,
  totalQuestions: 86,
  correctRate: 0.78,
  streakDays: 5,
  sceneStats: {
    opening: { total: 22, correct: 18 },
    clarify: { total: 25, correct: 19 },
    comfort: { total: 20, correct: 14 },
    closing: { total: 19, correct: 15 }
  },
  recentSessions: []
};

const initialUserInfo: UserInfo = {
  name: '李小明',
  department: '客户服务部',
  position: '客服新人',
  joinDate: '2026-01-15',
  stats: initialStats
};

export const usePracticeStore = create<PracticeState>((set, get) => ({
  currentQuestionIndex: 0,
  todayQuestions: [],
  selectedOptionId: null,
  showAnswer: false,
  mistakes: [],
  userInfo: initialUserInfo,
  isPracticeComplete: false,

  setCurrentQuestionIndex: (index: number) => set({ currentQuestionIndex: index }),
  setSelectedOption: (optionId: string | null) => set({ selectedOptionId: optionId }),
  setShowAnswer: (show: boolean) => set({ showAnswer: show }),

  submitAnswer: () => {
    const { currentQuestionIndex, todayQuestions, selectedOptionId, updateUserStats, addMistake } = get();
    const currentQuestion = todayQuestions[currentQuestionIndex];
    
    if (!currentQuestion || !selectedOptionId) return;

    const selectedOption = currentQuestion.options.find(opt => opt.id === selectedOptionId);
    const isCorrect = selectedOption?.isCorrect || false;

    updateUserStats(currentQuestion.scene, isCorrect);

    if (!isCorrect && selectedOption) {
      const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
      const mistake: MistakeRecord = {
        id: `mistake-${Date.now()}`,
        questionId: currentQuestion.id,
        scene: currentQuestion.scene,
        customerContent: currentQuestion.customerContent,
        selectedOption: selectedOption.content,
        correctAnswer: correctOption?.content || '',
        errorType: currentQuestion.errorType || '语气生硬',
        agentAnswer: currentQuestion.agentAnswer,
        qualityReview: currentQuestion.qualityReview,
        recommendedScript: currentQuestion.recommendedScript,
        explanation: currentQuestion.explanation,
        practiceDate: new Date().toISOString().split('T')[0],
        reviewCount: 0
      };
      addMistake(mistake);
    }

    set({ showAnswer: true });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, todayQuestions } = get();
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex >= todayQuestions.length) {
      set({ isPracticeComplete: true });
    } else {
      set({
        currentQuestionIndex: nextIndex,
        selectedOptionId: null,
        showAnswer: false
      });
    }
  },

  resetPractice: () => set({
    currentQuestionIndex: 0,
    selectedOptionId: null,
    showAnswer: false,
    isPracticeComplete: false
  }),

  addMistake: (mistake: MistakeRecord) => set(state => ({
    mistakes: [mistake, ...state.mistakes]
  })),

  updateUserStats: (scene: SceneType, isCorrect: boolean) => set(state => {
    const newStats = { ...state.userInfo.stats };
    newStats.totalQuestions += 1;
    newStats.sceneStats = {
      ...newStats.sceneStats,
      [scene]: {
        total: newStats.sceneStats[scene].total + 1,
        correct: newStats.sceneStats[scene].correct + (isCorrect ? 1 : 0)
      }
    };
    newStats.correctRate = Object.values(newStats.sceneStats).reduce((acc, s) => acc + s.correct, 0) / newStats.totalQuestions;

    return {
      userInfo: {
        ...state.userInfo,
        stats: newStats
      }
    };
  }),

  markMistakeReviewed: (mistakeId: string) => set(state => ({
    mistakes: state.mistakes.map(m =>
      m.id === mistakeId ? { ...m, reviewCount: m.reviewCount + 1 } : m
    )
  }))
}));
