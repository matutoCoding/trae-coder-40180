import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import MistakeItem from '@/components/MistakeItem';
import { usePracticeStore } from '@/store/usePracticeStore';
import { getSceneLabel } from '@/utils';
import type { SceneType } from '@/types';
import styles from './index.module.scss';

const MistakesPage: React.FC = () => {
  const [selectedScene, setSelectedScene] = useState<SceneType | 'all'>('all');
  const mistakes = usePracticeStore(state => state.mistakes);
  const getMistakeStats = usePracticeStore(state => state.getMistakeStats);
  const getErrorTypeStats = usePracticeStore(state => state.getErrorTypeStats);

  const sceneStats = useMemo(() => getMistakeStats(), [mistakes]);
  const errorTypeStats = useMemo(() => getErrorTypeStats(), [mistakes]);

  const sceneOptions: Array<{ value: SceneType | 'all'; label: string }> = [
    { value: 'all', label: '全部' },
    { value: 'opening', label: '开场确认' },
    { value: 'clarify', label: '需求澄清' },
    { value: 'comfort', label: '情绪安抚' },
    { value: 'closing', label: '结束确认' }
  ];

  const filteredMistakes = useMemo(() => {
    if (selectedScene === 'all') return mistakes;
    return mistakes.filter(m => m.scene === selectedScene);
  }, [selectedScene, mistakes]);

  const weakestScene = useMemo(() => {
    let maxCount = 0;
    let weakest: SceneType = 'opening';
    (Object.entries(sceneStats) as [SceneType, number][]).forEach(([scene, count]) => {
      if (count > maxCount) {
        maxCount = count;
        weakest = scene;
      }
    });
    return { scene: weakest, count: maxCount };
  }, [sceneStats]);

  const totalMistakes = mistakes.length;

  const handleSceneChange = (scene: SceneType | 'all') => {
    setSelectedScene(scene);
  };

  const handleMistakeClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/mistake-detail/index?id=${id}` });
  };

  const maxErrorCount = Math.max(...Object.values(errorTypeStats), 1);

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.headerSection}>
        <Text className={styles.pageTitle}>错题本</Text>
        <Text className={styles.pageSubtitle}>记录薄弱环节，针对性提升客服技能</Text>

        <View className={styles.statsSection}>
          <View className={styles.statsMain}>
            <View className={styles.totalMistakes}>
              <Text className={styles.totalNumber}>{totalMistakes}</Text>
              <Text className={styles.totalLabel}>累计错题</Text>
            </View>
            <View className={styles.weakestScene}>
              <Text className={styles.weakestLabel}>薄弱环节</Text>
              <Text className={styles.weakestName}>
                {totalMistakes > 0 ? getSceneLabel(weakestScene.scene) : '暂无'}
              </Text>
              {totalMistakes > 0 && (
                <Text style={{ fontSize: '22rpx', color: 'rgba(255,255,255,0.7)', marginTop: '4rpx' }}>
                  {weakestScene.count} 次错误
                </Text>
              )}
            </View>
          </View>

          <View className={styles.sceneStats}>
            <View className={styles.sceneStatItem}>
              <Text className={styles.sceneStatValue}>{sceneStats.opening}</Text>
              <Text className={styles.sceneStatLabel}>开场确认</Text>
            </View>
            <View className={styles.sceneStatItem}>
              <Text className={styles.sceneStatValue}>{sceneStats.clarify}</Text>
              <Text className={styles.sceneStatLabel}>需求澄清</Text>
            </View>
            <View className={styles.sceneStatItem}>
              <Text className={styles.sceneStatValue}>{sceneStats.comfort}</Text>
              <Text className={styles.sceneStatLabel}>情绪安抚</Text>
            </View>
            <View className={styles.sceneStatItem}>
              <Text className={styles.sceneStatValue}>{sceneStats.closing}</Text>
              <Text className={styles.sceneStatLabel}>结束确认</Text>
            </View>
          </View>
        </View>

        <View className={styles.filterSection}>
          <Text className={styles.filterLabel}>场景筛选</Text>
          <View className={styles.sceneTabs}>
            {sceneOptions.map(scene => (
              <View
                key={scene.value}
                className={classnames(
                  styles.sceneTab,
                  selectedScene === scene.value && styles.active
                )}
                onClick={() => handleSceneChange(scene.value)}
              >
                <Text className={styles.sceneTabText}>{scene.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.errorTypeSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleIcon} />
          <Text>错误类型分析</Text>
        </View>
        {Object.keys(errorTypeStats).length > 0 ? (
          <View className={styles.errorTypeList}>
            {Object.entries(errorTypeStats).map(([type, count]) => (
              <View key={type} className={styles.errorTypeItem}>
                <Text className={styles.errorTypeName}>{type}</Text>
                <View className={styles.errorTypeBar}>
                  <View
                    className={styles.errorTypeFill}
                    style={{ width: `${(count / maxErrorCount) * 100}%` }}
                  />
                </View>
                <Text className={styles.errorTypeCount}>{count}次</Text>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>暂无错误类型数据</Text>
          </View>
        )}
      </View>

      <View className={styles.sectionTitle}>
        <View className={styles.titleIcon} />
        <Text>错题列表</Text>
        <Text className={styles.countBadge}>{filteredMistakes.length} 条</Text>
      </View>

      {filteredMistakes.length > 0 ? (
        <View className={styles.mistakeList}>
          {filteredMistakes.map(mistake => (
            <MistakeItem
              key={mistake.id}
              mistake={mistake}
              onClick={() => handleMistakeClick(mistake.id)}
            />
          ))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🎉</Text>
          <Text className={styles.emptyText}>
            {selectedScene === 'all'
              ? '太棒了！暂无错题记录'
              : '该场景暂无错题'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default MistakesPage;
