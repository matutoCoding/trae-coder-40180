import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import type { MistakeRecord } from '@/types';
import SceneTag from '@/components/SceneTag';
import { formatDate } from '@/utils';
import styles from './index.module.scss';

interface MistakeItemProps {
  mistake: MistakeRecord;
  onClick?: () => void;
  className?: string;
}

const MistakeItem: React.FC<MistakeItemProps> = ({ mistake, onClick, className }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/mistake-detail/index?id=${mistake.id}`
      });
    }
  };

  return (
    <View
      className={classnames(styles.mistakeItem, className)}
      onClick={handleClick}
    >
      <View className={styles.itemHeader}>
        <SceneTag scene={mistake.scene} size="sm" />
        <View className={styles.errorTag}>
          <Text className={styles.errorTagText}>{mistake.errorType}</Text>
        </View>
        <Text className={styles.practiceDate}>{formatDate(mistake.practiceDate)}</Text>
      </View>
      
      <View className={styles.customerQuote}>
        <Text className={styles.quoteIcon}>"</Text>
        <Text className={styles.quoteText}>{mistake.customerContent}</Text>
      </View>

      <View className={styles.compareSection}>
        <View className={styles.compareItem}>
          <Text className={styles.compareLabel}>你的回答</Text>
          <Text className={classnames(styles.compareText, styles.wrongAnswer)}>
            {mistake.selectedOption}
          </Text>
        </View>
        <View className={styles.compareItem}>
          <Text className={styles.compareLabel}>正确答案</Text>
          <Text className={classnames(styles.compareText, styles.correctAnswer)}>
            {mistake.correctAnswer}
          </Text>
        </View>
      </View>

      <View className={styles.itemFooter}>
        <Text className={styles.reviewCount}>
          已复习 {mistake.reviewCount} 次
        </Text>
        <View className={styles.retryBtn}>
          <Text className={styles.retryBtnText}>再练一次</Text>
        </View>
      </View>
    </View>
  );
};

export default MistakeItem;
