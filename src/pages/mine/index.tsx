import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import SceneTag from '@/components/SceneTag';
import { usePracticeStore } from '@/store/usePracticeStore';
import { calcCorrectRate, formatDate } from '@/utils';
import type { SceneType } from '@/types';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const { userInfo } = usePracticeStore();
  const stats = userInfo.stats;

  const sceneStatsList = useMemo(() => {
    const scenes: SceneType[] = ['opening', 'clarify', 'comfort', 'closing'];
    return scenes.map(scene => ({
      scene,
      total: stats.sceneStats[scene].total,
      correct: stats.sceneStats[scene].correct,
      rate: calcCorrectRate(stats.sceneStats[scene].correct, stats.sceneStats[scene].total)
    }));
  }, [stats.sceneStats]);

  const weakestScene = useMemo(() => {
    let minRate = 100;
    let weakest: SceneType = 'opening';
    sceneStatsList.forEach(item => {
      if (item.rate < minRate && item.total > 0) {
        minRate = item.rate;
        weakest = item.scene;
      }
    });
    return { scene: weakest, rate: minRate };
  }, [sceneStatsList]);

  const getAISuggestion = () => {
    const suggestionMap: Record<SceneType, string> = {
      opening: '您在开场确认环节正确率较低，建议加强开场白的完整性训练。专业的开场白应包含：问候语、公司身份介绍、个人姓名、表达服务意愿、确认客户身份信息五个要素。可以在素材库中多学习优秀案例的开场方式。',
      clarify: '您在需求澄清环节需要加强。建议学习5W1H提问法：What（什么问题）、When（何时发生）、Where（在哪发生）、Who（涉及谁）、Why（为什么）、How（如何发生）。这样可以一次性收集完整信息，提高沟通效率。',
      comfort: '您在情绪安抚环节的处理能力有待提升。记住安抚三步法：1) 先共情，表达理解；2) 再道歉，承担责任；3) 给出具体解决方案和时间承诺。不要在客户情绪激动时急于解释或辩解。',
      closing: '您在结束确认环节做得不够完整。完整的结束流程应包含：确认问题已解决、询问是否还有其他需求、引导满意度评价、表达感谢和祝福、礼貌结束。这是提升客户体验的重要环节。'
    };

    if (stats.correctRate >= 0.9) {
      return '太棒了！您的整体表现非常优秀，各场景正确率都很高。建议继续保持学习节奏，可以多关注一些复杂场景的处理技巧，如多人沟通、跨部门协调等高阶技能。';
    }

    return suggestionMap[weakestScene.scene] || suggestionMap.comfort;
  };

  const getInitial = (name: string) => {
    return name.charAt(0);
  };

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.profileCard}>
        <View className={styles.profileHeader}>
          <View className={styles.avatar}>
            <Text className={styles.avatarText}>{getInitial(userInfo.name)}</Text>
          </View>
          <View className={styles.profileInfo}>
            <Text className={styles.userName}>{userInfo.name}</Text>
            <Text className={styles.userDept}>{userInfo.department}</Text>
            <Text className={styles.userPosition}>{userInfo.position} · 入职 {formatDate(userInfo.joinDate)}</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsGrid}>
        <View className={styles.statCard}>
          <Text className={styles.statIcon}>📅</Text>
          <Text className={styles.statValue}>{stats.totalPracticeDays}</Text>
          <Text className={styles.statLabel}>练习天数</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statIcon}>✍️</Text>
          <Text className={styles.statValue}>{stats.totalQuestions}</Text>
          <Text className={styles.statLabel}>累计答题</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statIcon}>🎯</Text>
          <Text className={styles.statValue}>{calcCorrectRate(
            stats.sceneStats.opening.correct + stats.sceneStats.clarify.correct +
            stats.sceneStats.comfort.correct + stats.sceneStats.closing.correct,
            stats.totalQuestions
          )}%</Text>
          <Text className={styles.statLabel}>正确率</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statIcon}>🔥</Text>
          <Text className={styles.statValue}>{stats.streakDays}</Text>
          <Text className={styles.statLabel}>连续学习</Text>
        </View>
      </View>

      <View className={styles.sceneStatsSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleIcon} />
          <Text>各场景正确率</Text>
        </View>

        <View className={styles.sceneStatsList}>
          {sceneStatsList.map(item => (
            <View key={item.scene} className={styles.sceneStatItem}>
              <View className={styles.sceneStatHeader}>
                <View className={styles.sceneStatInfo}>
                  <SceneTag scene={item.scene} size="sm" />
                </View>
                <Text className={styles.sceneStatRate}>{item.rate}%</Text>
              </View>
              <View className={styles.progressBar}>
                <View
                  className={styles.progressFill}
                  style={{
                    width: `${item.rate}%`,
                    background: item.rate >= 80
                      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                      : item.rate >= 60
                        ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                        : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                  }}
                />
              </View>
              <View className={styles.sceneStatDetail}>
                <Text className={styles.sceneStatText}>答对 {item.correct} 题</Text>
                <Text className={styles.sceneStatText}>共 {item.total} 题</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.aiSuggestion}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleIcon} />
          <Text>AI学习建议</Text>
        </View>

        <View className={styles.suggestionCard}>
          <View className={styles.suggestionHeader}>
            <View className={styles.suggestionIcon}>
              <Text className={styles.suggestionIconText}>AI</Text>
            </View>
            <Text className={styles.suggestionTitle}>
              {stats.correctRate >= 0.8 ? '表现优秀！继续保持' : '针对薄弱环节重点提升'}
            </Text>
          </View>
          <Text className={styles.suggestionContent}>{getAISuggestion()}</Text>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <View className={styles.titleIcon} />
        <Text>更多功能</Text>
      </View>

      <View className={styles.menuList}>
        <View className={styles.menuItem}>
          <View className={styles.menuIcon}>📚</View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>学习资料</Text>
            <Text className={styles.menuSubtitle}>客服话术手册、沟通技巧文档</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem}>
          <View className={styles.menuIcon}>📊</View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>学习报告</Text>
            <Text className={styles.menuSubtitle}>查看详细的学习数据分析</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem}>
          <View className={styles.menuIcon}>⚙️</View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>设置</Text>
            <Text className={styles.menuSubtitle}>账号、通知、关于我们</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MinePage;
