import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { DialogueTurn } from '@/types';
import styles from './index.module.scss';

interface DialogueCardProps {
  dialogue: DialogueTurn;
  showTimestamp?: boolean;
  className?: string;
}

const DialogueCard: React.FC<DialogueCardProps> = ({ dialogue, showTimestamp = true, className }) => {
  const isCustomer = dialogue.speaker === 'customer';

  return (
    <View className={classnames(styles.dialogueWrapper, isCustomer && styles.customer, className)}>
      <View className={styles.dialogueHeader}>
        <View className={classnames(styles.speakerAvatar, isCustomer ? styles.customerAvatar : styles.agentAvatar)}>
          <Text className={styles.avatarText}>{isCustomer ? '客' : '坐'}</Text>
        </View>
        <Text className={styles.speakerName}>{isCustomer ? '客户' : '坐席'}</Text>
        {showTimestamp && dialogue.timestamp && (
          <Text className={styles.timestamp}>{dialogue.timestamp}</Text>
        )}
      </View>
      <View className={classnames(styles.dialogueBubble, isCustomer ? styles.customerBubble : styles.agentBubble)}>
        <Text className={styles.dialogueContent}>{dialogue.content}</Text>
      </View>
    </View>
  );
};

export default DialogueCard;
