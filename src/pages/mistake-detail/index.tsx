import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { usePracticeStore } from '@/store/usePracticeStore';
import SceneTag from '@/components/SceneTag';
import DialogueCard from '@/components/DialogueCard';
import AITip from '@/components/AITip';
import type { MistakeRecord } from '@/types';
import { SCENE_INFO } from '@/types';
import { formatDate } from '@/utils';
import styles from './index.module.scss';

const MistakeDetailPage: React.FC = () => {
  const [mistake, setMistake] = useState<MistakeRecord | null>(null);
  const [notFound, setNotFound] = useState(false);
  const findMistakeById = usePracticeStore(s => s.findMistakeById);
  const markMistakeReviewed = usePracticeStore(s => s.markMistakeReviewed);

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params;
    const id = params?.id;
    if (id) {
      const found = findMistakeById(id);
      if (found) {
        setMistake(found);
      } else {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
  }, []);

  const handleRetry = () => {
    if (!mistake) return;
    markMistakeReviewed(mistake.id);
    Taro.switchTab({ url: '/pages/practice/index' });
  };

  if (notFound) {
    return (
      <View className={styles.pageContainer}>
        <View className={styles.notFound}>
          <Text className={styles.notFoundIcon}>📭</Text>
          <Text className={styles.notFoundText}>错题不存在</Text>
        </View>
      </View>
    );
  }

  if (!mistake) return null;

  const sceneInfo = SCENE_INFO[mistake.scene];

  return (
    <View className={styles.pageContainer}>
      <ScrollView className={styles.scrollContent} scrollY>
        <View className={styles.tagRow}>
          <SceneTag scene={mistake.scene} size='md' />
          <View
            className={styles.errorTypeTag}
            style={{ backgroundColor: `${sceneInfo.color}15`, color: sceneInfo.color }}
          >
            <Text className={styles.errorTypeTagText}>{mistake.errorType}</Text>
          </View>
        </View>

        <View className={styles.sectionBlock}>
          <Text className={styles.sectionLabel}>客户原话</Text>
          <DialogueCard
            dialogue={{
              id: 'customer-original',
              speaker: 'customer',
              content: mistake.customerContent,
              timestamp: '',
              segment: mistake.scene
            }}
            showTimestamp={false}
          />
        </View>

        <View className={styles.sectionBlock}>
          <Text className={styles.sectionLabel}>你当时的选择</Text>
          <View className={classnames(styles.answerCard, styles.wrongCard)}>
            <View className={styles.answerCardHeader}>
              <View className={classnames(styles.answerBadge, styles.wrongBadge)}>
                <Text className={styles.answerBadgeText}>你的回答</Text>
              </View>
            </View>
            <Text className={styles.answerCardContent}>{mistake.selectedOption}</Text>
          </View>
        </View>

        <View className={styles.sectionBlock}>
          <Text className={styles.sectionLabel}>正确回答</Text>
          <View className={classnames(styles.answerCard, styles.correctCard)}>
            <View className={styles.answerCardHeader}>
              <View className={classnames(styles.answerBadge, styles.correctBadge)}>
                <Text className={styles.answerBadgeText}>正确回答</Text>
              </View>
            </View>
            <Text className={styles.answerCardContent}>{mistake.correctAnswer}</Text>
          </View>
        </View>

        <View className={styles.sectionBlock}>
          <Text className={styles.sectionLabel}>原坐席回答</Text>
          <View className={classnames(styles.answerCard, styles.agentCard)}>
            <View className={styles.answerCardHeader}>
              <View className={classnames(styles.answerBadge, styles.agentBadge)}>
                <Text className={styles.answerBadgeText}>原坐席回答</Text>
              </View>
            </View>
            <Text className={styles.answerCardContent}>{mistake.agentAnswer}</Text>
          </View>
        </View>

        <View className={styles.sectionBlock}>
          <Text className={styles.sectionLabel}>质检点评</Text>
          <View className={styles.reviewBox}>
            <Text className={styles.reviewContent}>{mistake.qualityReview}</Text>
          </View>
        </View>

        <View className={styles.sectionBlock}>
          <AITip
            title='AI推荐话术'
            content={mistake.recommendedScript}
            type='info'
          />
        </View>

        <View className={styles.sectionBlock}>
          <AITip
            title='要点解析'
            content={mistake.explanation}
            type='success'
          />
        </View>

        <View className={styles.bottomSpacer} />
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.bottomInfo}>
          <Text className={styles.bottomInfoText}>练习日期：{formatDate(mistake.practiceDate)}</Text>
          <Text className={styles.bottomInfoText}>复习次数：{mistake.reviewCount}次</Text>
        </View>
        <View className={styles.retryBtn} onClick={handleRetry}>
          <Text className={styles.retryBtnText}>再练一次</Text>
        </View>
      </View>
    </View>
  );
};

export default MistakeDetailPage;
