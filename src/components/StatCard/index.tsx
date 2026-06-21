import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  color = 'primary',
  className
}) => {
  return (
    <View className={classnames(styles.statCard, styles[color], className)}>
      <Text className={styles.statTitle}>{title}</Text>
      <View className={styles.statValueWrapper}>
        <Text className={styles.statValue}>{value}</Text>
        {unit && <Text className={styles.statUnit}>{unit}</Text>}
      </View>
      {trend && trendValue && (
        <View className={classnames(styles.statTrend, styles[trend])}>
          <Text className={styles.trendIcon}>{trend === 'up' ? '↑' : '↓'}</Text>
          <Text className={styles.trendText}>{trendValue}</Text>
        </View>
      )}
    </View>
  );
};

export default StatCard;
