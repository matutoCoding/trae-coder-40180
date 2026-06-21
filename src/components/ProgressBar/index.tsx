import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, showText = true, className }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <View className={classnames(styles.progressWrapper, className)}>
      <View className={styles.progressBar}>
        <View
          className={styles.progressFill}
          style={{ width: `${percentage}%` }}
        />
      </View>
      {showText && (
        <Text className={styles.progressText}>
          {current}/{total} ({percentage}%)
        </Text>
      )}
    </View>
  );
};

export default ProgressBar;
