import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface AITipProps {
  title?: string;
  content: string;
  type?: 'info' | 'success' | 'warning';
  className?: string;
}

const AITip: React.FC<AITipProps> = ({ title = 'AI智能提示', content, type = 'info', className }) => {
  return (
    <View className={classnames(styles.aiTip, styles[type], className)}>
      <View className={styles.aiHeader}>
        <View className={styles.aiIcon}>
          <Text className={styles.aiIconText}>AI</Text>
        </View>
        <Text className={styles.aiTitle}>{title}</Text>
      </View>
      <Text className={styles.aiContent}>{content}</Text>
    </View>
  );
};

export default AITip;
