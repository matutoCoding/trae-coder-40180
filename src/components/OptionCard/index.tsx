import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { PracticeOption } from '@/types';
import styles from './index.module.scss';

interface OptionCardProps {
  option: PracticeOption;
  optionLabel: string;
  isSelected: boolean;
  showResult?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  optionLabel,
  isSelected,
  showResult = false,
  disabled = false,
  onClick,
  className
}) => {
  const getStatusClass = () => {
    if (!showResult) {
      return isSelected ? 'selected' : 'normal';
    }
    if (option.isCorrect) return 'correct';
    if (isSelected && !option.isCorrect) return 'wrong';
    return 'normal';
  };

  const status = getStatusClass();

  return (
    <View
      className={classnames(
        styles.optionCard,
        styles[status],
        disabled && styles.disabled,
        className
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <View className={styles.optionLabel}>
        <Text className={styles.labelText}>{optionLabel}</Text>
      </View>
      <Text className={styles.optionContent}>{option.content}</Text>
      {showResult && (
        <View className={classnames(styles.resultIcon, styles[status])}>
          <Text className={styles.resultText}>
            {option.isCorrect ? '✓' : isSelected ? '✕' : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

export default OptionCard;
