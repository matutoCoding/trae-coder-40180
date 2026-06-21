import { create } from 'zustand';
import Taro from '@tarojs/taro';
import type { PracticeQuestion, MistakeRecord, UserInfo, SceneType, UserStats, Material, AddMaterialForm, DialogueTurn } from '@/types';
import { getTodayDateStr } from '@/utils';

const STORAGE_KEY_MISTAKES = 'ai_cs_mistakes';
const STORAGE_KEY_MATERIALS = 'ai_cs_custom_materials';

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = Taro.getStorageSync(key);
    if (raw) return JSON.parse(raw as string) as T;
  } catch (e) {
    console.error('[Storage] 读取失败', key, e);
  }
  return fallback;
};

const saveToStorage = (key: string, data: unknown) => {
  try {
    Taro.setStorageSync(key, JSON.stringify(data));
  } catch (e) {
    console.error('[Storage] 写入失败', key, e);
  }
};

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

const generateDialogueFromForm = (form: AddMaterialForm): DialogueTurn[] => {
  const templates: Record<SceneType, DialogueTurn[]> = {
    opening: [
      { id: 'd0', speaker: 'agent', content: '您好，这里是XX客服中心，我是客服专员小A，请问有什么可以帮助您的？', timestamp: '00:00', segment: 'opening' },
      { id: 'd1', speaker: 'customer', content: '你好，我想咨询一下相关业务的事情。', timestamp: '00:08', segment: 'opening' },
      { id: 'd2', speaker: 'agent', content: '好的，为了更好地为您服务，请先确认一下您的身份信息可以吗？', timestamp: '00:15', segment: 'opening' }
    ],
    clarify: [
      { id: 'd0', speaker: 'customer', content: '我这个订单已经处理了，为什么还没到账？', timestamp: '00:00', segment: 'clarify' },
      { id: 'd1', speaker: 'agent', content: '非常抱歉给您带来不便，请问您的订单号是多少呢？', timestamp: '00:08', segment: 'clarify' },
      { id: 'd2', speaker: 'customer', content: '订单号是20260622001。', timestamp: '00:15', segment: 'clarify' },
      { id: 'd3', speaker: 'agent', content: '好的，我帮您查看一下。请问还有其他需要确认的信息吗？', timestamp: '00:22', segment: 'clarify' }
    ],
    comfort: [
      { id: 'd0', speaker: 'customer', content: '你们怎么回事啊！我已经等了很久了，问题还没解决！', timestamp: '00:00', segment: 'comfort' },
      { id: 'd1', speaker: 'agent', content: '非常抱歉让您这么生气，我完全理解您现在的心情。您先消消气，我这边马上为您处理。', timestamp: '00:10', segment: 'comfort' },
      { id: 'd2', speaker: 'customer', content: '唉，你们每次都这么说。', timestamp: '00:20', segment: 'comfort' },
      { id: 'd3', speaker: 'agent', content: '真的非常抱歉，这次我亲自跟进，一定给您满意答复。', timestamp: '00:28', segment: 'comfort' }
    ],
    closing: [
      { id: 'd0', speaker: 'agent', content: '好的，您的问题我已经记录下来了，我们会尽快安排处理。', timestamp: '00:00', segment: 'closing' },
      { id: 'd1', speaker: 'customer', content: '好的，那我等你们消息。', timestamp: '00:08', segment: 'closing' },
      { id: 'd2', speaker: 'agent', content: '请问还有其他可以帮到您的吗？', timestamp: '00:14', segment: 'closing' },
      { id: 'd3', speaker: 'customer', content: '没有了，谢谢。', timestamp: '00:18', segment: 'closing' },
      { id: 'd4', speaker: 'agent', content: '不客气，感谢您的来电，祝您生活愉快，再见！', timestamp: '00:22', segment: 'closing' }
    ]
  };

  return templates[form.scene] || templates.opening;
};

interface PracticeState {
  currentQuestionIndex: number;
  todayQuestions: PracticeQuestion[];
  selectedOptionId: string | null;
  showAnswer: boolean;
  mistakes: MistakeRecord[];
  customMaterials: Material[];
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
  addCustomMaterial: (form: AddMaterialForm) => Material;
  getMistakeStats: () => Record<SceneType, number>;
  getErrorTypeStats: () => Record<string, number>;
  findMistakeById: (id: string) => MistakeRecord | undefined;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  currentQuestionIndex: 0,
  todayQuestions: [],
  selectedOptionId: null,
  showAnswer: false,
  mistakes: loadFromStorage<MistakeRecord[]>(STORAGE_KEY_MISTAKES, []),
  customMaterials: loadFromStorage<Material[]>(STORAGE_KEY_MATERIALS, []),
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
        practiceDate: getTodayDateStr(),
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

  addMistake: (mistake: MistakeRecord) => {
    set(state => {
      const updated = [mistake, ...state.mistakes];
      saveToStorage(STORAGE_KEY_MISTAKES, updated);
      return { mistakes: updated };
    });
  },

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

  markMistakeReviewed: (mistakeId: string) => {
    set(state => {
      const updated = state.mistakes.map(m =>
        m.id === mistakeId ? { ...m, reviewCount: m.reviewCount + 1 } : m
      );
      saveToStorage(STORAGE_KEY_MISTAKES, updated);
      return { mistakes: updated };
    });
  },

  addCustomMaterial: (form: AddMaterialForm) => {
    const dialogue = generateDialogueFromForm(form);
    const material: Material = {
      id: `custom-${Date.now()}`,
      title: form.title,
      scene: form.scene,
      quality: form.quality,
      category: form.category,
      duration: 60 + Math.floor(Math.random() * 120),
      date: getTodayDateStr(),
      summary: `${form.category} - ${form.quality === 'excellent' ? '优秀案例' : '待改进'} - ${form.scene === 'opening' ? '开场确认' : form.scene === 'clarify' ? '需求澄清' : form.scene === 'comfort' ? '情绪安抚' : '结束确认'}环节通话录音`,
      dialogue,
      tags: [form.scene, form.quality === 'excellent' ? '优秀案例' : '待改进', form.category]
    };

    set(state => {
      const updated = [material, ...state.customMaterials];
      saveToStorage(STORAGE_KEY_MATERIALS, updated);
      return { customMaterials: updated };
    });

    console.log('[Store] 添加自定义素材', { id: material.id, title: material.title });
    return material;
  },

  getMistakeStats: () => {
    const { mistakes } = get();
    const stats: Record<SceneType, number> = { opening: 0, clarify: 0, comfort: 0, closing: 0 };
    mistakes.forEach(m => { stats[m.scene]++; });
    return stats;
  },

  getErrorTypeStats: () => {
    const { mistakes } = get();
    const stats: Record<string, number> = {};
    mistakes.forEach(m => { stats[m.errorType] = (stats[m.errorType] || 0) + 1; });
    return stats;
  },

  findMistakeById: (id: string) => {
    return get().mistakes.find(m => m.id === id);
  }
}));
