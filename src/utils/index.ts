import type { SceneType } from '@/types';
import { SCENE_INFO as sceneInfo } from '@/types';

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

export const getSceneInfo = (scene: SceneType) => {
  return sceneInfo[scene];
};

export const getSceneLabel = (scene: SceneType): string => {
  return sceneInfo[scene].label;
};

export const getSceneColor = (scene: SceneType): string => {
  return sceneInfo[scene].color;
};

export const getQualityLabel = (quality: 'excellent' | 'failed'): string => {
  return quality === 'excellent' ? '优秀案例' : '待改进';
};

export const getQualityColor = (quality: 'excellent' | 'failed'): string => {
  return quality === 'excellent' ? '#10B981' : '#EF4444';
};

export const calcCorrectRate = (correct: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

export const getWeekday = (dateStr: string): string => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date(dateStr);
  return weekdays[date.getDay()];
};

export const getTodayDateStr = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const shuffleArray = <T>(arr: T[]): T[] => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
