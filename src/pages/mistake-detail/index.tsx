import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const MistakeDetailPage: React.FC = () => {
  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderContent}>
        <Text className={styles.placeholderIcon}>❌</Text>
        <Text className={styles.placeholderTitle}>错题详情</Text>
        <Text className={styles.placeholderText}>功能正在开发中...</Text>
      </View>
    </View>
  );
};

export default MistakeDetailPage;
